import { test, expect } from '@playwright/test'
import { useAudioStore } from '../src/lib/audio-store'

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>(done => { resolve = done })
  return { promise, resolve }
}

const file = () => ({ arrayBuffer: async () => new ArrayBuffer(8) }) as File

test.afterEach(() => {
  useAudioStore.getState().cleanup()
})

test('a decoded file cannot restore audio after cleanup', async () => {
  const decoded = deferred<AudioBuffer>(), started = deferred<void>()
  const context = {
    state: 'running', close: async () => {},
    decodeAudioData: () => { started.resolve(); return decoded.promise },
  } as unknown as AudioContext
  useAudioStore.setState({ audioContext: context, isInitialized: true })
  const loading = useAudioStore.getState().loadAudioFile(file())
  await started.promise
  useAudioStore.getState().cleanup()
  decoded.resolve({ duration: 3 } as AudioBuffer)
  expect(await loading).toBe(false)
  expect(useAudioStore.getState().currentBuffer).toBeNull()
  expect(useAudioStore.getState().error).toBeNull()
})

test('a newer load owns the loading indicator and decoded audio', async () => {
  const first = deferred<AudioBuffer>(), second = deferred<AudioBuffer>()
  const firstStarted = deferred<void>(), secondStarted = deferred<void>()
  let calls = 0
  const context = {
    state: 'running', close: async () => {},
    decodeAudioData: () => {
      if (++calls === 1) { firstStarted.resolve(); return first.promise }
      secondStarted.resolve(); return second.promise
    },
  } as unknown as AudioContext
  useAudioStore.setState({ audioContext: context, isInitialized: true })
  const oldLoad = useAudioStore.getState().loadAudioFile(file())
  await firstStarted.promise
  const newLoad = useAudioStore.getState().loadAudioFile(file())
  await secondStarted.promise
  first.resolve({ duration: 1 } as AudioBuffer)
  expect(await oldLoad).toBe(false)
  expect(useAudioStore.getState().isLoading).toBe(true)
  const latest = { duration: 4 } as AudioBuffer
  second.resolve(latest)
  expect(await newLoad).toBe(true)
  expect(useAudioStore.getState().currentBuffer).toBe(latest)
  expect(useAudioStore.getState().isLoading).toBe(false)
})

for (const frequency of [50, 200, 700, 4000]) {
  test(`short audio uses measured frequency energy rather than fabricated scores (${frequency}Hz)`, async () => {
    const sampleRate = 48000, duration = 0.75
    const samples = Float32Array.from({ length: sampleRate * duration }, (_, i) => 0.2 * Math.sin(2 * Math.PI * frequency * i / sampleRate))
    useAudioStore.setState({ currentBuffer: { sampleRate, duration, numberOfChannels: 1, getChannelData: () => samples } as unknown as AudioBuffer })
    const segments = await useAudioStore.getState().analyzeSegments()
    expect(segments).toHaveLength(1)
    expect(segments[0].duration).toBe(duration)
    const strongest = Object.entries(segments[0].axisScores).sort((a, b) => b[1] - a[1])[0][0]
    expect(strongest).toBe(({ 50: 'bass', 200: 'warmth', 700: 'vocal', 4000: 'brightness' })[frequency])
    expect(Object.values(segments[0].axisScores).every(score => score < 1)).toBe(true)
  })
}

test('short silence has zero measured scores', async () => {
  useAudioStore.setState({ currentBuffer: { sampleRate: 48000, duration: 0.25, numberOfChannels: 1, getChannelData: () => new Float32Array(12000) } as unknown as AudioBuffer })
  const [segment] = await useAudioStore.getState().analyzeSegments()
  expect(Object.values(segment.axisScores)).toEqual([0, 0, 0, 0])
})

test('cleanup aborts a pending sample request without surfacing a stale error', async () => {
  const originalFetch = globalThis.fetch, started = deferred<AbortSignal>()
  globalThis.fetch = async (_url, options) => {
    const signal = options!.signal!
    started.resolve(signal)
    return new Promise<Response>((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Cancelled', 'AbortError')), { once: true })
    })
  }
  useAudioStore.setState({ audioContext: { state: 'running', close: async () => {} } as unknown as AudioContext, isInitialized: true })
  try {
    const pending = useAudioStore.getState().loadAudio('/sample.mp3')
    const signal = await started.promise
    useAudioStore.getState().cleanup()
    expect(signal.aborted).toBe(true)
    expect(await pending).toBe(false)
    expect(useAudioStore.getState().error).toBeNull()
    expect(useAudioStore.getState().isLoading).toBe(false)
  } finally { globalThis.fetch = originalFetch }
})

test('analysis discards segments if audio is cleared during a yield', async () => {
  const sampleRate = 8000, duration = 60
  const samples = Float32Array.from({ length: sampleRate * duration }, (_, i) => 0.2 * Math.sin(2 * Math.PI * 200 * i / sampleRate))
  useAudioStore.setState({ currentBuffer: { sampleRate, duration, numberOfChannels: 1, getChannelData: () => samples } as unknown as AudioBuffer })
  const pending = useAudioStore.getState().analyzeSegments()
  useAudioStore.getState().cleanup()
  expect(await pending).toEqual([])
})
