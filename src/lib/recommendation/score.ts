export const MAX_RATING = 5

export const RECOMMENDATION_WEIGHTS = {
  quality: 0.6,
  affinity: 0.4,
} as const

export const BAYESIAN_PRIOR_STRENGTH = 8

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
  affinity: Map<string, number>
  globalMean: number
  categoryNames?: Map<string, string>
  priorStrength?: number
  weights?: { quality: number; affinity: number }
  limit?: number
}

export function bayesianRating(
  rates: number[],
  globalMean: number,
  priorStrength = BAYESIAN_PRIOR_STRENGTH,
): number {
  const n = rates.length
  const sum = rates.reduce((acc, r) => acc + r, 0)
  return (priorStrength * globalMean + sum) / (priorStrength + n)
}

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
