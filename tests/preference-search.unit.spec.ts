import { test, expect } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import { createPreferenceSearch, preferenceCandidates, summarizePreference, updatePreference, type PreferenceAnswer } from '../src/lib/preference-search'

function random(seed: number) {
  let state = seed >>> 0
  return () => {
    state += 0x6D2B79F5
    let value = Math.imul(state ^ state >>> 15, state | 1)
    value ^= value + Math.imul(value ^ value >>> 7, value | 61)
    return ((value ^ value >>> 14) >>> 0) / 2 ** 32
  }
}

function choice(a: number, b: number, target: number, noise: number, rng: () => number): PreferenceAnswer {
  const difference = Math.abs(a - target) - Math.abs(b - target)
  let answer: PreferenceAnswer = Math.abs(difference) < 1e-6 ? 'similar' : difference < 0 ? 'A' : 'B'
  if (rng() < noise) answer = answer === 'A' ? 'B' : answer === 'B' ? 'A' : rng() < 0.5 ? 'A' : 'B'
  return answer
}

function legacy(min: number, max: number, target: number, noise: number, seed: number) {
  let mean = 0, width = 5
  const rng = random(seed), clamp = (value: number) => Math.max(min, Math.min(max, value))
  for (let i = 0; i < 4; i++) {
    let low = clamp(mean - width), high = clamp(mean + width)
    const radius = Math.min(mean - low, high - mean)
    if (radius > 1e-9) { low = mean - radius; high = mean + radius }
    const answer = choice(low, high, target, noise, rng)
    if (answer !== 'similar') mean = clamp(mean + (answer === 'B' ? 1 : -1) * width * 0.4)
    width = Math.max(0.5, width * (answer === 'similar' ? 0.70 : 0.85))
  }
  return mean
}

test('compares the explicit response model with the previous heuristic under seeded errors', async ({}, testInfo) => {
  const report = []
  for (const noise of [0, 0.1, 0.2]) {
    let oldError = 0, newError = 0, count = 0
    for (const [min, max] of [[-10, 10], [-3, 10], [-10, 2], [0, 8], [-4, 0], [-1, 1]]) {
      const targets = [...new Set([min, max, 0, min / 2, max / 2, (min + max) / 2])]
      for (const target of targets) for (let seed = 1; seed <= 200; seed++) {
        let search = createPreferenceSearch(min, max)
        const rng = random(seed)
        for (let i = 0; i < 4; i++) {
          const { low, high } = preferenceCandidates(search)
          search = updatePreference(search, low, high, choice(low, high, target, noise, rng))
        }
        oldError += Math.abs(legacy(min, max, target, noise, seed) - target)
        newError += Math.abs(summarizePreference(search).gain - target)
        count++
      }
    }
    report.push({ noise, cases: count, previousMAE: oldError / count, proposedMAE: newError / count })
  }
  const path = testInfo.outputPath('search-model-comparison.json')
  await writeFile(path, JSON.stringify({ assumption: 'Nearest-gain software oracle, four comparisons per axis, uniform seeded response flips; not human accuracy.', report }, null, 2))
  await testInfo.attach('search-model-comparison', { path, contentType: 'application/json' })
  for (const row of report) expect(row.proposedMAE).toBeLessThan(row.previousMAE)
})

test('unknown answers preserve evidence and likelihoods remain normalized after contradictions', () => {
  let search = createPreferenceSearch()
  expect(updatePreference(search, -5, 5, 'unsure')).toBe(search)
  for (let i = 0; i < 100; i++) search = updatePreference(search, -5, 5, i % 2 ? 'A' : 'B')
  expect(search.weights.every(weight => Number.isFinite(weight) && weight > 0)).toBe(true)
  expect(search.weights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1, 10)
})

test('seeded errors include early mistakes rather than only later responses', () => {
  const errors = Array.from({ length: 200 }, (_, i) => random(i + 1)()).filter(value => value < 0.2).length
  expect(errors).toBeGreaterThan(20)
  expect(errors).toBeLessThan(60)
})

test('swapping A/B labels leaves the inferred preference unchanged', () => {
  let normal = createPreferenceSearch(-3, 10), swapped = createPreferenceSearch(-3, 10)
  for (const answer of ['B', 'similar', 'A', 'unsure', 'B', 'B', 'A', 'B'] as const) {
    const { low, high } = preferenceCandidates(normal)
    normal = updatePreference(normal, low, high, answer)
    swapped = updatePreference(swapped, high, low, answer === 'A' ? 'B' : answer === 'B' ? 'A' : answer)
    expect(summarizePreference(swapped).gain).toBe(summarizePreference(normal).gain)
    expect(summarizePreference(swapped).spread).toBeCloseTo(summarizePreference(normal).spread, 12)
  }
})

test('all stages respect asymmetric, narrow and fixed feasible ranges', () => {
  for (const [min, max] of [[-3, 10], [-10, 2], [0, 8], [-4, 0], [-0.1, 0.2], [0, 0]]) {
    for (const answer of ['A', 'B', 'similar', 'unsure'] as const) {
      let search = createPreferenceSearch(min, max)
      for (let i = 0; i < 8; i++) {
        const { low, high } = preferenceCandidates(search)
        expect(low).toBeGreaterThanOrEqual(min)
        expect(high).toBeLessThanOrEqual(max)
        expect(high).toBeGreaterThanOrEqual(low)
        search = updatePreference(search, low, high, answer)
        const { gain } = summarizePreference(search)
        expect(gain).toBeGreaterThanOrEqual(min)
        expect(gain).toBeLessThanOrEqual(max)
      }
    }
  }
})
