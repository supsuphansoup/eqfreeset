export interface PreferenceSearch {
  values: number[]
  weights: number[]
  answers: number
}

export type PreferenceAnswer = 'A' | 'B' | 'similar' | 'unsure'

// Explicit, uncalibrated response model: closer gain is preferred, with a lapse
// floor and an indifference region. These assumptions need human validation.
export function createPreferenceSearch(min = -10, max = 10): PreferenceSearch {
  const steps = Math.max(1, Math.ceil((max - min) / 0.25))
  const values = Array.from({ length: steps + 1 }, (_, i) => Math.max(min, Math.min(max, min + (max - min) * i / steps)))
  if (min <= 0 && max >= 0) values.push(0)
  const unique = [...new Set(values)].sort((a, b) => a - b)
  return { values: unique, weights: unique.map(() => 1 / unique.length), answers: 0 }
}

function quantile(search: PreferenceSearch, probability: number) {
  let cumulative = 0
  for (let i = 0; i < search.values.length; i++) {
    cumulative += search.weights[i]
    if (cumulative >= probability) return search.values[i]
  }
  return search.values[search.values.length - 1]
}

export function summarizePreference(search: PreferenceSearch) {
  if (search.answers === 0) return { gain: 0, spread: 5 }
  const mean = search.values.reduce((sum, value, i) => sum + value * search.weights[i], 0)
  const spread = Math.sqrt(search.values.reduce((sum, value, i) => sum + (value - mean) ** 2 * search.weights[i], 0))
  const median = quantile(search, 0.5)
  // Avoid presenting quarter-dB numerical precision as listening precision.
  const rounded = Math.abs(median) <= 0.5 ? 0 : Math.round(median * 2) / 2
  return { gain: Math.max(search.values[0], Math.min(search.values[search.values.length - 1], rounded)), spread }
}

export function preferenceCandidates(search: PreferenceSearch) {
  const min = search.values[0], max = search.values[search.values.length - 1]
  if (search.answers === 0) {
    const radius = Math.min(5, -min, max)
    return radius > 1e-9 ? { low: -radius, high: radius } : { low: Math.max(min, -5), high: Math.min(max, 5) }
  }
  let low = quantile(search, 0.2), high = quantile(search, 0.8)
  if (high - low < 1) {
    const center = quantile(search, 0.5)
    low = Math.max(min, Math.min(max - 1, center - 0.5))
    high = Math.min(max, low + 1)
  }
  return { low, high }
}

export function updatePreference(search: PreferenceSearch, aGain: number, bGain: number, answer: PreferenceAnswer): PreferenceSearch {
  if (answer === 'unsure' || Math.abs(aGain - bGain) < 1e-9) return search
  const weights = search.weights.map((weight, i) => {
    const theta = search.values[i]
    const advantageB = Math.abs(theta - aGain) - Math.abs(theta - bGain)
    const tie = 0.65 * Math.exp(-0.5 * (advantageB / 0.8) ** 2)
    const b = (1 - tie) / (1 + Math.exp(-advantageB / 0.8))
    const probability = answer === 'similar' ? tie : answer === 'B' ? b : 1 - tie - b
    return weight * (0.12 / 3 + 0.88 * probability)
  })
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  return { ...search, weights: weights.map(weight => weight / total), answers: search.answers + 1 }
}
