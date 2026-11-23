import { test, expect } from '@playwright/test'
import { matchComparisonLevels, measureChannels } from '../src/lib/comparison-audio'
import { useAudioStore, useTestStore, type DeviceProfile } from '../src/lib/audio-store'
import { combineEQ, EQ_FREQUENCIES, getAxisGainRange } from '../src/lib/eq-processing'
import { getAllDevices } from '../src/lib/device-db'
import { writeFile } from 'node:fs/promises'

const device = (): DeviceProfile => ({
  id: 'test-flat', brand: 'Test', name: 'Test', alias: [], version: 'test-v1',
  baseEQ: EQ_FREQUENCIES.map((frequency, i) => ({ frequency, gain: 0, type: i === 0 ? 'lowshelf' : i === 9 ? 'highshelf' : 'peaking' })),
})

function startTest() {
  useTestStore.getState().resetTest()
  useTestStore.getState().setSelectedDevice(device())
  useTestStore.setState({ currentStep: 'test', comparisonFlipped: false })
}

test('comparison RMS matches across both channels without gain or sample clipping', () => {
  const a = [new Float32Array([0, 2, -2, 0]), new Float32Array([0, 0, 0, 0])]
  const b = [new Float32Array([0, 0.2, -0.2, 0]), new Float32Array([0, 0.8, -0.8, 0])]
  const { aLevel, bLevel } = matchComparisonLevels(a, b)
  expect(aLevel).toBeLessThanOrEqual(1)
  expect(bLevel).toBeLessThanOrEqual(1)
  const apply = (channels: Float32Array[], gain: number) => channels.map(channel => channel.map(value => value * gain))
  const am = measureChannels(apply(a, aLevel)), bm = measureChannels(apply(b, bLevel))
  expect(am.rms).toBeCloseTo(bm.rms, 7)
  expect(Math.max(am.peak, bm.peak)).toBeLessThanOrEqual(Math.pow(10, -1 / 20) + 1e-7)
})

test('silence and non-finite samples cannot produce fabricated comparison levels', () => {
  for (const sample of [0, NaN, Infinity]) {
    expect(() => matchComparisonLevels([new Float32Array([sample])], [new Float32Array([0.2])])).toThrow('comparison-silent')
  }
})

test('unsure preserves preference and search width and cannot starve other axes', () => {
  startTest()
  const initial = structuredClone(useTestStore.getState().axisStates)
  for (let i = 0; i < 16; i++) useTestStore.getState().processResponse('unsure')
  const state = useTestStore.getState()
  expect(state.axisStates).toEqual(initial)
  expect(state.testResult!.completedRounds).toBe(16)
  expect(state.testResult!.earlyStop).toBe(false)
  for (const axis of ['bass', 'warmth', 'vocal', 'brightness']) expect(state.responses.filter(r => r.axis === axis)).toHaveLength(4)
})

test('new results retain independent base and final EQ snapshots and segment evidence', () => {
  startTest()
  useTestStore.getState().setManualMode(true)
  useTestStore.getState().setSelectedSegment({ start: 12, duration: 10 })
  for (let i = 0; i < 16; i++) useTestStore.getState().processResponse('similar')
  const state = useTestStore.getState(), result = state.testResult!
  expect(result).toMatchObject({ schemaVersion: 2, algorithmVersion: 'preference-grid-v3', deviceVersion: 'test-v1' })
  expect(result).not.toHaveProperty('confidence')
  expect(result.responses[0]).toMatchObject({ segmentStart: 12, segmentDuration: 10 })
  state.selectedDevice!.baseEQ[0].gain = 9
  expect(result.baseEQSnapshot![0].gain).toBe(0)
  expect(result.finalEQ![0].gain).toBe(0)
})

for (const polarity of [1, -1]) {
  test(`stereo analysis retains right-only and anti-phase signals (${polarity})`, async () => {
    const sampleRate = 24000, frames = sampleRate * 12
    const right = Float32Array.from({ length: frames }, (_, i) => 0.2 * Math.sin(2 * Math.PI * 4000 * i / sampleRate))
    const left = polarity === 1 ? new Float32Array(frames) : right.map(value => -value)
    useAudioStore.setState({ currentBuffer: { sampleRate, duration: 12, numberOfChannels: 2, getChannelData: (c: number) => c === 0 ? left : right } as AudioBuffer })
    try {
      const segments = await useAudioStore.getState().analyzeSegments()
      const scores = segments[0].axisScores
      expect(scores.brightness).toBeGreaterThan(0)
      expect(Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]).toBe('brightness')
    } finally { useAudioStore.setState({ currentBuffer: null }) }
  })
}

// Deterministic software oracle only: documents reachable range, not human accuracy.
for (const direction of [-1, 1]) {
  test(`16-round search reaches extreme preferences beyond the old range limit (${direction})`, () => {
    startTest()
    for (let i = 0; i < 16; i++) {
      const state = useTestStore.getState()
      const { aGain, bGain } = state.getCurrentABGains()
      state.processResponse(direction * aGain > direction * bGain ? 'A' : 'B')
    }
    const result = useTestStore.getState().testResult!
    for (const band of result.personalizationDelta) expect(band.gain * direction).toBeGreaterThan(8)
    expect(result.earlyStop).toBe(false)
  })
}

test('records deterministic preference and preset saturation diagnostics', async ({}, testInfo) => {
  const simulation = []
  for (const target of [-10, -6, -3, 0, 3, 6, 10]) {
    startTest()
    for (let i = 0; i < 16 && !useTestStore.getState().isTestComplete; i++) {
      const state = useTestStore.getState(), { aGain, bGain } = state.getCurrentABGains()
      const aDistance = Math.abs(aGain - target), bDistance = Math.abs(bGain - target)
      state.processResponse(Math.abs(aDistance - bDistance) < 1e-6 ? 'similar' : aDistance < bDistance ? 'A' : 'B')
    }
    const gain = useTestStore.getState().testResult!.personalizationDelta[0].gain
    expect(Number.isFinite(gain)).toBe(true)
    expect(Math.abs(gain)).toBeLessThanOrEqual(10)
    simulation.push({ target, gain, absoluteError: Math.abs(target - gain) })
  }
  let saturatedComparisons = 0
  const axisBands = [[0, 1], [2, 3], [4, 5], [6, 7, 8, 9]]
  for (const profile of getAllDevices()) for (const indices of axisBands) {
    if (indices.some(i => Math.abs(profile.baseEQ[i].gain - 5) > 10 || Math.abs(profile.baseEQ[i].gain + 5) > 10)) saturatedComparisons++
  }
  const reportPath = testInfo.outputPath('eq-diagnostics.json')
  await writeFile(reportPath, JSON.stringify({
    assumption: 'Noiseless nearest-gain software oracle on a flat device; not human listening accuracy.',
    simulation, meanAbsoluteError: simulation.reduce((sum, s) => sum + s.absoluteError, 0) / simulation.length,
    legacyInitialComparisons: getAllDevices().length * 4, legacySaturatedComparisons: saturatedComparisons,
  }, null, 2))
  await testInfo.attach('eq-diagnostics', { contentType: 'application/json', path: reportPath })
})

test('all device candidates keep the same axis delta without per-band saturation', () => {
  const axes = ['bass', 'warmth', 'vocal', 'brightness'] as const
  const axisBands = [[0, 1], [2, 3], [4, 5], [6, 7, 8, 9]]
  for (const profile of getAllDevices()) for (const [a, axis] of axes.entries()) {
    const range = getAxisGainRange(profile.baseEQ, axis)
    expect(range.min).toBeLessThanOrEqual(0)
    expect(range.max).toBeGreaterThanOrEqual(0)
    useTestStore.getState().resetTest()
    useTestStore.getState().setSelectedDevice(profile)
    useTestStore.setState({ currentStep: 'test', currentAxis: axis })
    const { aGain, bGain } = useTestStore.getState().getCurrentABGains()
    for (const gain of [aGain, bGain]) {
      const delta = device().baseEQ.map((band, i) => ({ ...band, gain: axisBands[a].includes(i) ? gain : 0 }))
      const final = combineEQ(profile.baseEQ, delta)
      for (const i of axisBands[a]) expect(final[i].gain - profile.baseEQ[i].gain, profile.id).toBeCloseTo(gain, 8)
    }
  }
})

test('an axis with no feasible adjustment never fabricates preference evidence', () => {
  startTest()
  const profile = device()
  profile.baseEQ[0].gain = 10
  profile.baseEQ[1].gain = -10
  useTestStore.getState().setSelectedDevice(profile)
  useTestStore.getState().processResponse('A')
  expect(useTestStore.getState().responses[0].choice).toBe('unsure')
  expect(useTestStore.getState().axisStates.bass).toMatchObject({ gain: 0, bayesStd: 5 })
})

test('bounded candidates preserve a neutral preference across all device presets', () => {
  for (const profile of getAllDevices()) {
    startTest()
    useTestStore.getState().setSelectedDevice(profile)
    for (let i = 0; i < 16 && !useTestStore.getState().isTestComplete; i++) {
      const state = useTestStore.getState(), { aGain, bGain } = state.getCurrentABGains()
      const distance = Math.abs(aGain) - Math.abs(bGain)
      state.processResponse(Math.abs(distance) < 1e-9 ? 'similar' : distance < 0 ? 'A' : 'B')
    }
    expect(useTestStore.getState().testResult!.personalizationDelta.every(band => Math.abs(band.gain) < 1e-9), profile.id).toBe(true)
  }
})

function finishSearch() {
  while (useTestStore.getState().currentStep === 'test') {
    const state = useTestStore.getState(), { aGain, bGain } = state.getCurrentABGains()
    state.processResponse(aGain > bGain ? 'A' : 'B')
  }
}

for (const flipped of [false, true]) for (const choice of ['A', 'B', 'unsure'] as const) {
  test(`final review saves the actual selected EQ (${flipped}, ${choice})`, () => {
    startTest()
    useTestStore.getState().setManualMode(true)
    useTestStore.getState().setSelectedSegment({ start: 3, duration: 10 })
    finishSearch()
    useTestStore.setState({ reviewFlipped: flipped })
    const draft = useTestStore.getState().testResult!
    const proposed = structuredClone(draft.finalEQ!)
    expect(useTestStore.getState().isTestComplete).toBe(false)
    useTestStore.getState().confirmResult(choice)
    const result = useTestStore.getState().testResult!
    const expected = choice === 'unsure' ? 'unsure' : (choice === 'A') === flipped ? 'personalized' : 'base'
    expect(result.finalReview).toEqual({ choice: expected, aIsPersonalized: flipped, segmentStart: 3, segmentDuration: 10 })
    expect(result.proposedEQ).toEqual(proposed)
    expect(result.finalEQ).toEqual(expected === 'base' ? result.baseEQSnapshot : proposed)
    expect(result.personalizationDelta.every(b => b.gain === 0)).toBe(expected === 'base')
    expect(useTestStore.getState().isTestComplete).toBe(true)
    useTestStore.getState().confirmResult(choice === 'A' ? 'B' : 'A')
    expect(useTestStore.getState().testResult).toBe(result)
    useTestStore.getState().undoLastResponse()
    expect(useTestStore.getState().currentStep).toBe('result')
  })
}

test('undo restores the exact evidence, candidates and segment even from final review', () => {
  startTest()
  useTestStore.getState().setSegments([
    { start: 5, duration: 10, energy: 1, label: 'first', axisScores: { bass: 1, warmth: 1, vocal: 1, brightness: 1 } },
    { start: 25, duration: 10, energy: 1, label: 'second', axisScores: { bass: 1, warmth: 1, vocal: 1, brightness: 1 } },
  ])
  for (let round = 1; round <= 16; round++) {
    const before = useTestStore.getState(), pair = before.getCurrentABGains(), segment = before.getCurrentSegment()
    before.processResponse('B')
    useTestStore.getState().undoLastResponse()
    const restored = useTestStore.getState()
    expect(restored.axisStates).toEqual(before.axisStates)
    expect(restored.responses).toEqual(before.responses)
    expect(restored.currentRound).toBe(before.currentRound)
    expect(restored.currentAxis).toBe(before.currentAxis)
    expect(restored.getCurrentABGains()).toEqual(pair)
    expect(restored.getCurrentSegment()).toEqual(segment)
    expect(restored.testResult).toBeNull()
    restored.processResponse('A')
  }
  expect(useTestStore.getState().currentStep).toBe('review')
})

test('additional comparisons preserve evidence, stop at 32 and reset back to 16', () => {
  startTest()
  for (const budget of [16, 24, 32]) {
    finishSearch()
    const before = useTestStore.getState()
    expect(before.responses).toHaveLength(budget)
    expect(before.testResult!.roundBudget).toBe(budget)
    for (const axis of ['bass', 'warmth', 'vocal', 'brightness']) expect(before.responses.filter(r => r.axis === axis)).toHaveLength(budget / 4)
    before.extendTest()
    expect(useTestStore.getState().axisStates).toBe(before.axisStates)
    expect(useTestStore.getState().responses).toBe(before.responses)
    expect(useTestStore.getState().currentStep).toBe(budget < 32 ? 'test' : 'review')
  }
  useTestStore.getState().resetTestProgress()
  expect(useTestStore.getState().roundBudget).toBe(16)
  expect(useTestStore.getState().responses).toEqual([])
})

test('different preferences on four axes do not leak evidence into one another', () => {
  startTest()
  const targets = { bass: -8, warmth: -2, vocal: 3, brightness: 7 }
  for (let i = 0; i < 16; i++) {
    const state = useTestStore.getState(), { aGain, bGain } = state.getCurrentABGains()
    const target = targets[state.currentAxis], difference = Math.abs(aGain - target) - Math.abs(bGain - target)
    const otherAxes = Object.entries(state.axisStates).filter(([axis]) => axis !== state.currentAxis)
    state.processResponse(Math.abs(difference) < 1e-9 ? 'similar' : difference < 0 ? 'A' : 'B')
    for (const [axis, before] of otherAxes) expect(useTestStore.getState().axisStates[axis as keyof typeof targets]).toBe(before)
  }
  for (const axis of Object.keys(targets) as Array<keyof typeof targets>) {
    expect(Math.abs(useTestStore.getState().axisStates[axis].gain - targets[axis])).toBeLessThanOrEqual(1)
  }
})
