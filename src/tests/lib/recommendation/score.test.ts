import {
  bayesianRating,
  buildCategoryAffinity,
  bookAffinity,
  rankRecommendations,
  BAYESIAN_PRIOR_STRENGTH,
  type CandidateBook,
} from '@/lib/recommendation/score'

describe('bayesianRating', () => {
  it('pulls a low-count book toward the global mean', () => {
    const mean = 3.5
    const single = bayesianRating([5], mean)
    // (8 * 3.5 + 5) / (8 + 1) = 33 / 9
    expect(single).toBeCloseTo(33 / 9)
    expect(single).toBeGreaterThan(mean)
    expect(single).toBeLessThan(5)
  })

  it('converges to the raw average as ratings accumulate', () => {
    const mean = 3.5
    const many = bayesianRating(Array(500).fill(4.6), mean)
    expect(many).toBeCloseTo(4.6, 1)
  })

  it('ranks a well-reviewed book above a single five-star (cold-start)', () => {
    const mean = 3.5
    const hyped = bayesianRating([5], mean)
    const proven = bayesianRating(Array(200).fill(4.6), mean)
    expect(proven).toBeGreaterThan(hyped)
  })

  it('uses the configured prior strength as the damping knob', () => {
    const mean = 3
    const soft = bayesianRating([5], mean, 1)
    const hard = bayesianRating([5], mean, BAYESIAN_PRIOR_STRENGTH)
    // More prior strength = closer to the mean.
    expect(Math.abs(hard - mean)).toBeLessThan(Math.abs(soft - mean))
  })
})

describe('buildCategoryAffinity', () => {
  it('produces a distribution that sums to 1, weighted by frequency', () => {
    const affinity = buildCategoryAffinity([
      ['fantasy', 'adventure'],
      ['fantasy'],
      ['fantasy', 'romance'],
    ])
    expect(affinity.get('fantasy')).toBeCloseTo(3 / 5)
    expect(affinity.get('adventure')).toBeCloseTo(1 / 5)
    expect(affinity.get('romance')).toBeCloseTo(1 / 5)
    const sum = [...affinity.values()].reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(1)
  })

  it('returns an empty map when there is no signal', () => {
    expect(buildCategoryAffinity([]).size).toBe(0)
  })
})

describe('bookAffinity', () => {
  const affinity = buildCategoryAffinity([
    ['fantasy', 'adventure'],
    ['fantasy'],
  ])

  it('sums matching category weights, clamped to 1 and sorted by weight', () => {
    const { score, matched } = bookAffinity(
      ['fantasy', 'adventure', 'unrelated'],
      affinity,
    )
    expect(matched.map((m) => m.categoryId)).toEqual(['fantasy', 'adventure'])
    expect(score).toBeCloseTo(Math.min(1, 2 / 3 + 1 / 3))
  })

  it('is zero for a book outside the user’s taste', () => {
    expect(bookAffinity(['unrelated'], affinity).score).toBe(0)
  })
})

describe('rankRecommendations reasons', () => {
  it('explains taste-based matches with category names', () => {
    const affinity = buildCategoryAffinity([['c1', 'c2'], ['c1']])
    const ranked = rankRecommendations({
      candidates: [
        { id: 'b1', categoryIds: ['c1', 'c2'], rates: [5, 5, 4, 5, 5, 4] },
      ],
      affinity,
      globalMean: 3.5,
      categoryNames: new Map([
        ['c1', 'Fantasy'],
        ['c2', 'Adventure'],
      ]),
    })
    const reasons = ranked[0].reasons
    expect(reasons).toContainEqual({
      kind: 'affinity',
      label: 'Because you like Fantasy & Adventure',
    })
    expect(reasons.some((r) => r.kind === 'quality')).toBe(true)
  })

  it('orders by the blended score', () => {
    const affinity = buildCategoryAffinity([['c1']])
    const ranked = rankRecommendations({
      candidates: [
        // on-taste + well reviewed
        { id: 'good', categoryIds: ['c1'], rates: Array(20).fill(4.6) },
        // off-taste hype: a single five-star, no affinity
        { id: 'hype', categoryIds: ['c9'], rates: [5] },
      ],
      affinity,
      globalMean: 3.5,
    })
    expect(ranked[0].id).toBe('good')
  })
})

/**
 * Offline evaluation — leave-one-out hold-out.
 *
 * For each synthetic user we know their taste, hide one book they would love,
 * drop it into a pool of distractors (off-taste hits, on-taste duds, cold-start
 * hype, noise), and check whether the ranker surfaces it. Deterministic via a
 * seeded RNG, so the reported hit-rate / MRR are reproducible across runs.
 *
 * This converts "I built a recommender" into "I measured my recommender".
 */
describe('offline evaluation (leave-one-out)', () => {
  function mulberry32(seed: number) {
    return function () {
      seed |= 0
      seed = (seed + 0x6d2b79f5) | 0
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  const CATEGORIES = Array.from({ length: 8 }, (_, i) => `cat${i}`)
  const TRIALS = 400
  const TOP_K = 4

  const sample = <T>(rng: () => number, arr: T[], n: number): T[] => {
    const copy = [...arr]
    const out: T[] = []
    for (let i = 0; i < n && copy.length > 0; i++) {
      out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0])
    }
    return out
  }

  const ratings = (rng: () => number, mean: number, count: number): number[] =>
    Array.from({ length: count }, () =>
      Math.max(1, Math.min(5, mean + (rng() - 0.5) * 1.5)),
    )

  /** Returns the 0-based rank of the held-out book, or -1 if absent. */
  function runTrial(rng: () => number): number {
    const favorites = sample(rng, CATEGORIES, 2)
    const others = CATEGORIES.filter((c) => !favorites.includes(c))

    // The user's demonstrated taste: high-rated books in favorite categories.
    const training = Array.from({ length: 5 }, () =>
      sample(rng, favorites, 1 + Math.floor(rng() * 2)),
    )
    const affinity = buildCategoryAffinity(training)

    const candidates: CandidateBook[] = []

    // The hidden positive: on-taste, with a solid (not perfect) community rating.
    candidates.push({
      id: 'held-out',
      categoryIds: sample(rng, favorites, 1 + Math.floor(rng() * 2)),
      rates: ratings(rng, 3.8 + rng() * 0.7, 6 + Math.floor(rng() * 20)),
    })

    for (let i = 0; i < 25; i++) {
      const roll = rng()
      let categoryIds: string[]
      let rates: number[]
      if (roll < 0.4) {
        // strong but off-taste — high rating, none of the user's categories
        categoryIds = sample(rng, others, 1 + Math.floor(rng() * 2))
        rates = ratings(rng, 4.2 + rng() * 0.7, 8 + Math.floor(rng() * 25))
      } else if (roll < 0.7) {
        // on-taste but mediocre community rating
        categoryIds = sample(rng, favorites, 1)
        rates = ratings(rng, 2.6 + rng() * 0.8, 6 + Math.floor(rng() * 20))
      } else if (roll < 0.85) {
        // cold-start hype — favorite category, a single five-star
        categoryIds = sample(rng, favorites, 1)
        rates = [5]
      } else {
        // noise
        categoryIds = sample(rng, CATEGORIES, 1 + Math.floor(rng() * 2))
        rates = ratings(rng, 2.5 + rng() * 2, 1 + Math.floor(rng() * 30))
      }
      candidates.push({ id: `d${i}`, categoryIds, rates })
    }

    const allRates = candidates.flatMap((c) => c.rates)
    const globalMean = allRates.reduce((a, b) => a + b, 0) / allRates.length

    const ranked = rankRecommendations({ candidates, affinity, globalMean })
    return ranked.findIndex((r) => r.id === 'held-out')
  }

  it(`recovers the held-out book within the top ${TOP_K}`, () => {
    const rng = mulberry32(1337)
    let hits = 0
    let reciprocalRankSum = 0

    for (let t = 0; t < TRIALS; t++) {
      const rank = runTrial(rng)
      expect(rank).toBeGreaterThanOrEqual(0)
      if (rank < TOP_K) hits += 1
      reciprocalRankSum += 1 / (rank + 1)
    }

    const hitRate = hits / TRIALS
    const mrr = reciprocalRankSum / TRIALS

    // Surfaced for telemetry when run with --verbose.
    // eslint-disable-next-line no-console
    console.log(
      `[offline eval] trials=${TRIALS} hit@${TOP_K}=${hitRate.toFixed(
        3,
      )} MRR=${mrr.toFixed(3)}`,
    )

    // A working recommender should clear a random baseline (~4/26 ≈ 0.15) by a
    // wide margin. Thresholds are deterministic given the seed.
    expect(hitRate).toBeGreaterThanOrEqual(0.8)
    expect(mrr).toBeGreaterThanOrEqual(0.6)
  })
})
