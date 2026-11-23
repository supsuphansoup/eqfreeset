import { test, expect } from '@playwright/test'
import { combineEQ, EQ_FREQUENCIES, filterCoefficients, getPreampDb, responseDb } from '../src/lib/eq-processing'
import { encodeSharedEQ, decodeSharedEQ } from '../src/lib/result-share'
import { useTestStore, useAudioStore, EQBand } from '../src/lib/audio-store'
import { getAllDevices } from '../src/lib/device-db'

const bands = (gain = 0): EQBand[] => EQ_FREQUENCIES.map((frequency, i) => ({ frequency, gain, type: i === 0 ? 'lowshelf' : i === 9 ? 'highshelf' : 'peaking' }))

test('combines by frequency and clamps exactly as playback does', () => {
  const base = bands(8)
  const delta = bands(5).reverse()
  const result = combineEQ(base, delta)
  expect(result.map(b => b.gain)).toEqual(Array(10).fill(10))
  expect(combineEQ(bands(-8), bands(-5)).map(b => b.gain)).toEqual(Array(10).fill(-10))
  expect(base[0].gain).toBe(8)
})

test('flat and cut-only EQ never adds gain', () => {
  expect(getPreampDb(bands())).toBe(0)
  expect(getPreampDb(bands(-6))).toBeLessThanOrEqual(0)
})

test('overlapping boosts receive more headroom than largest individual gain', () => {
  const boosted = bands(10)
  const preamp = getPreampDb(boosted)
  expect(preamp).toBeLessThan(-10)
  for (const sampleRate of [44100, 48000, 96000]) {
    const coeffs = boosted.map(b => filterCoefficients(b, sampleRate))
    const attenuation = getPreampDb(boosted, sampleRate)
    for (let f = 20; f < Math.min(22000, sampleRate / 2); f *= 1.02) {
      expect(coeffs.reduce((sum, c) => sum + responseDb(c, f, sampleRate), 0) + attenuation).toBeLessThan(0)
    }
  }
})

test('a peaking filter reaches its specified center gain', () => {
  const band: EQBand = { frequency: 1000, gain: 6, type: 'peaking' }
  expect(responseDb(filterCoefficients(band, 48000), 1000, 48000)).toBeCloseTo(6, 6)
})

test('shared settings round-trip without storage including Unicode', () => {
  const value = { v: 1 as const, device: '내 헤드폰 日本語 🎧', bands: bands(1.2), delta: bands(-2) }
  expect(decodeSharedEQ(encodeSharedEQ(value))).toEqual(value)
})

test('shared settings reject broken, oversized and invalid payloads', () => {
  for (const input of ['', '%%%', 'a'.repeat(8001), 'null']) expect(decodeSharedEQ(input)).toBeNull()
  const valid = { v: 1 as const, device: 'Test', bands: bands(), delta: bands() }
  for (const bad of [{ ...valid, v: 2 }, { ...valid, bands: bands(11) }, { ...valid, delta: [] }, { ...valid, device: '' }, { ...valid, bands: bands().reverse() }]) {
    expect(decodeSharedEQ(encodeSharedEQ(bad as typeof valid))).toBeNull()
  }
})

for (const flipped of [false, true]) {
  test(`A/B mapping respects the randomized direction (${flipped})`, () => {
    useTestStore.getState().resetTest()
    useTestStore.getState().setSelectedDevice(getAllDevices()[0])
    useTestStore.setState({ currentStep: 'test', comparisonFlipped: flipped })
    const { aGain, bGain } = useTestStore.getState().getCurrentABGains()
    expect(flipped ? aGain > bGain : aGain < bGain).toBe(true)
    useTestStore.getState().processResponse(flipped ? 'A' : 'B')
    expect(useTestStore.getState().axisStates.bass.gain).toBeGreaterThan(0)
    expect(useTestStore.getState().responses[0].choice).toBe(flipped ? 'A' : 'B')
    expect(useTestStore.getState().responses[0]).toMatchObject({ aGain, bGain })
  })
}

test('requires final review after 16 rounds and ignores more search answers', () => {
  useTestStore.getState().resetTest()
  useTestStore.getState().setSelectedDevice(getAllDevices()[0])
  useTestStore.setState({ currentStep: 'test' })
  for (let i = 0; i < 16; i++) useTestStore.getState().processResponse('similar')
  const result = useTestStore.getState().testResult!
  expect(result.completedRounds).toBe(16)
  expect(useTestStore.getState().currentStep).toBe('review')
  expect(useTestStore.getState().isTestComplete).toBe(false)
  useTestStore.getState().processResponse('B')
  expect(useTestStore.getState().testResult).toBe(result)
})

test('does not accept responses outside an active test', () => {
  useTestStore.getState().resetTest()
  useTestStore.getState().processResponse('B')
  expect(useTestStore.getState().responses).toEqual([])
})

test('every device has valid, unique, complete fixed-band data', () => {
  const devices = getAllDevices()
  expect(new Set(devices.map(d => d.id)).size).toBe(devices.length)
  for (const device of devices) {
    expect(device.baseEQ.map(b => b.frequency), device.id).toEqual(EQ_FREQUENCIES)
    expect(device.baseEQ.every(b => Number.isFinite(b.gain) && Math.abs(b.gain) <= 10), device.id).toBe(true)
  }
})

test('network failure does not replace a valid buffer or report success', async () => {
  const original = globalThis.fetch
  const originalError = console.error
  console.error = () => {}
  globalThis.fetch = async () => new Response('', { status: 404 })
  useAudioStore.setState({ audioContext: { state: 'running' } as AudioContext, isInitialized: true, currentBuffer: null })
  try {
    expect(await useAudioStore.getState().loadAudio('/missing.mp3')).toBe(false)
    expect(useAudioStore.getState().error).toContain('Failed to load')
    expect(useAudioStore.getState().isLoading).toBe(false)
  } finally {
    globalThis.fetch = original
    console.error = originalError
    useAudioStore.setState({ audioContext: null, isInitialized: false })
  }
})

for (const [frequency, axis] of [[50, 'bass'], [200, 'warmth'], [700, 'vocal'], [4000, 'brightness']] as const) {
  test(`segment analysis targets the same ${axis} band that EQ changes`, async () => {
    const sampleRate = 48000
    const data = Float32Array.from({ length: sampleRate * 12 }, (_, i) => 0.2 * Math.sin(2 * Math.PI * frequency * i / sampleRate))
    useAudioStore.setState({ currentBuffer: { sampleRate, duration: 12, numberOfChannels: 1, getChannelData: () => data } as unknown as AudioBuffer })
    try {
      const segments = await useAudioStore.getState().analyzeSegments()
      expect(segments.length).toBeGreaterThan(0)
      const scores = segments[0].axisScores
      expect(Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]).toBe(axis)
    } finally {
      useAudioStore.setState({ currentBuffer: null })
    }
  })
}
