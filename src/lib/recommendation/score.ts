/**
 * Recommendation scoring core.
 *
 * Pure, dependency-free functions so the ranking logic can be unit-tested and
 * evaluated offline (see `src/tests/lib/recommendation/score.test.ts`) without a
 * database. The API route (`/api/books/recommended`) fetches data with Prisma and
 * feeds plain objects into `rankRecommendations`.
 *
 * A recommendation score combines two signals, each normalized to [0, 1]:
 *
 *   - quality:  community rating, damped by a Bayesian prior so a book with one
 *               5★ rating does not outrank a book with 200 ratings at 4.6.
 *   - affinity: how much the book overlaps the categories the user has
 *               demonstrably enjoyed (rated 4★+), expressed as a share of taste.
 *
 *   score = W_quality * quality + W_affinity * affinity
 */

export const MAX_RATING = 5

/**
 * Weights for the final blend. Because both signals are genuinely normalized to
 * [0, 1], these weights mean what they say: 60% "is this book good?", 40% "is
 * this book my taste?".
 */
export const RECOMMENDATION_WEIGHTS = {
  quality: 0.6,
  affinity: 0.4,
} as const

/**
 * Prior strength `C` for the Bayesian average: equivalent to this many
 * "imaginary" ratings sitting at the global mean. Higher = more damping, so
 * books with few ratings are pulled harder toward the global mean (cold-start).
 */
export const BAYESIAN_PRIOR_STRENGTH = 8

/** Minimum ratings + Bayesian rating for a book to earn a "highly rated" reason. */
const QUALITY_REASON_MIN_RATINGS = 5
const QUALITY_REASON_MIN_RATING = 4

export interface CandidateBook {
  id: string
  categoryIds: string[]
  rates: number[]
}

export type RecommendationReason =
  | { kind: 'affinity'; label: string }
  | { kind: 'quality'; label: string }

export interface ScoredBook {
  id: string
  score: number
  bayesianRate: number
  affinity: number
  ratingCount: number
  reasons: RecommendationReason[]
}

export interface RankInput {
  candidates: CandidateBook[]
  /** Category affinity distribution, from `buildCategoryAffinity`. */
  affinity: Map<string, number>
  /** Mean rating across all live ratings — the Bayesian prior's target. */
  globalMean: number
  /** Optional id → display name map, used to build human-readable reasons. */
  categoryNames?: Map<string, string>
  priorStrength?: number
  weights?: { quality: number; affinity: number }
  limit?: number
}

/**
 * Bayesian estimate of a book's "true" rating (a.k.a. the IMDB weighted rating).
 *
 *   (C * m + Σ rates) / (C + n)
 *
 * Pulls the raw average toward the global mean `m` with prior strength `C`. With
 * few ratings the estimate sits near `m`; as `n` grows it converges to the raw
 * average. This is what stops a single 5★ from beating a well-reviewed book.
 */
export function bayesianRating(
  rates: number[],
  globalMean: number,
  priorStrength = BAYESIAN_PRIOR_STRENGTH,
): number {
  const n = rates.length
  const sum = rates.reduce((acc, r) => acc + r, 0)
  return (priorStrength * globalMean + sum) / (priorStrength + n)
}

/**
 * Build a probability distribution over categories from the user's high-rated
 * books. Each book contributes its categories; the result sums to 1, so a
 * category the user has rated highly many times weighs more than a one-off.
 */
export function buildCategoryAffinity(
  highRatedBookCategories: string[][],
): Map<string, number> {
  const counts = new Map<string, number>()
  let total = 0
  for (const categoryIds of highRatedBookCategories) {
    for (const categoryId of categoryIds) {
      counts.set(categoryId, (counts.get(categoryId) ?? 0) + 1)
      total += 1
    }
  }

  const affinity = new Map<string, number>()
  if (total === 0) return affinity
  for (const [categoryId, count] of counts) {
    affinity.set(categoryId, count / total)
  }
  return affinity
}

/**
 * How well a single book matches the user's taste: the summed affinity of its
 * categories that the user cares about, clamped to [0, 1]. Returns the matched
 * categories (strongest first) so the caller can explain the recommendation.
 */
export function bookAffinity(
  categoryIds: string[],
  affinity: Map<string, number>,
): { score: number; matched: { categoryId: string; weight: number }[] } {
  const matched = categoryIds
    .map((categoryId) => ({
      categoryId,
      weight: affinity.get(categoryId) ?? 0,
    }))
    .filter((m) => m.weight > 0)
    .sort((a, b) => b.weight - a.weight)

  const score = Math.min(
    1,
    matched.reduce((acc, m) => acc + m.weight, 0),
  )
  return { score, matched }
}

/**
 * Score and rank candidate books for a user. Pure: same inputs → same output,
 * which is what lets the offline evaluation hold-out test assert quality.
 */
export function rankRecommendations(input: RankInput): ScoredBook[] {
  const {
    candidates,
    affinity,
    globalMean,
    categoryNames,
    priorStrength = BAYESIAN_PRIOR_STRENGTH,
    weights = RECOMMENDATION_WEIGHTS,
    limit,
  } = input

  const scored: ScoredBook[] = candidates.map((book) => {
    const bayesianRate = bayesianRating(book.rates, globalMean, priorStrength)
    const { score: affinityScore, matched } = bookAffinity(
      book.categoryIds,
      affinity,
    )
    const qualityNorm = bayesianRate / MAX_RATING
    const score =
      weights.quality * qualityNorm + weights.affinity * affinityScore

    const reasons: RecommendationReason[] = []
    if (matched.length > 0 && categoryNames) {
      const names = matched
        .slice(0, 2)
        .map((m) => categoryNames.get(m.categoryId))
        .filter((name): name is string => Boolean(name))
      if (names.length > 0) {
        reasons.push({
          kind: 'affinity',
          label:
            names.length === 1
              ? `Because you like ${names[0]}`
              : `Because you like ${names[0]} & ${names[1]}`,
        })
      }
    }
    if (
      book.rates.length >= QUALITY_REASON_MIN_RATINGS &&
      bayesianRate >= QUALITY_REASON_MIN_RATING
    ) {
      reasons.push({
        kind: 'quality',
        label: `Highly rated by readers (${bayesianRate.toFixed(1)}★)`,
      })
    }

    return {
      id: book.id,
      score,
      bayesianRate,
      affinity: affinityScore,
      ratingCount: book.rates.length,
      reasons,
    }
  })

  scored.sort((a, b) => b.score - a.score)
  return typeof limit === 'number' ? scored.slice(0, limit) : scored
}
