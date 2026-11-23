import type { EQBand } from './audio-store'
import { EQ_Q } from './eq-processing'

export function measureChannels(channels: Float32Array[]) {
  let sum = 0, peak = 0, count = 0
  for (const channel of channels) {
    for (const sample of channel) {
      sum += sample * sample
      peak = Math.max(peak, Math.abs(sample))
    }
    count += channel.length
  }
  return { rms: Math.sqrt(sum / Math.max(1, count)), peak }
}

// Match stereo mean-square energy without boosting either candidate. This is
// RMS matching, not BS.1770 loudness or a true-peak limiter.
export function matchComparisonLevels(a: Float32Array[], b: Float32Array[]) {
  const am = measureChannels(a), bm = measureChannels(b)
  if (![am.rms, bm.rms, am.peak, bm.peak].every(Number.isFinite) || Math.min(am.rms, bm.rms) < 1e-6) {
    throw new Error('comparison-silent')
  }
  const target = Math.min(am.rms, bm.rms)
  const aLevel = target / am.rms, bLevel = target / bm.rms
  const headroom = Math.min(1, Math.pow(10, -1 / 20) / Math.max(am.peak * aLevel, bm.peak * bLevel))
  return { aLevel: aLevel * headroom, bLevel: bLevel * headroom }
}

async function renderCandidate(buffer: AudioBuffer, bands: EQBand[], start: number, duration: number, sampleRate: number) {
  const offline = new OfflineAudioContext(buffer.numberOfChannels, Math.ceil(duration * sampleRate), sampleRate)
  const source = offline.createBufferSource()
  source.buffer = buffer
  let previous: AudioNode = source
  for (const band of bands) {
    const filter = offline.createBiquadFilter()
    filter.type = band.type
    filter.frequency.value = Math.min(band.frequency, sampleRate * 0.499)
    filter.Q.value = EQ_Q
    filter.gain.value = band.gain
    previous.connect(filter)
    previous = filter
  }
  previous.connect(offline.destination)
  source.start(0, start, duration)
  const rendered = await offline.startRendering()
  // Identical 10 ms edge fades avoid click cues from abrupt starts/stops.
  const fade = Math.min(Math.round(sampleRate * 0.01), Math.floor(rendered.length / 2))
  for (let c = 0; c < rendered.numberOfChannels; c++) {
    const data = rendered.getChannelData(c)
    for (let i = 0; i < fade; i++) {
      data[i] *= i / fade
      data[data.length - 1 - i] *= i / fade
    }
  }
  return rendered
}

// Retain only the latest pair for each source buffer. Replays use identical PCM.
const cache = new WeakMap<AudioBuffer, { key: string; value: Promise<{ A: AudioBuffer; B: AudioBuffer }> }>()

export function prepareComparison(buffer: AudioBuffer, a: EQBand[], b: EQBand[], start: number, duration: number, sampleRate: number) {
  const safeStart = Math.max(0, Math.min(start, buffer.duration - 0.01))
  const safeDuration = Math.min(10, duration, buffer.duration - safeStart)
  if (!Number.isFinite(safeStart) || !Number.isFinite(safeDuration) || safeDuration <= 0) throw new Error('comparison-silent')
  const key = JSON.stringify([a, b, safeStart, safeDuration, sampleRate])
  const existing = cache.get(buffer)
  if (existing?.key === key) return existing.value
  const value = Promise.all([
    renderCandidate(buffer, a, safeStart, safeDuration, sampleRate),
    renderCandidate(buffer, b, safeStart, safeDuration, sampleRate),
  ]).then(([A, B]) => {
    const channels = (audio: AudioBuffer) => Array.from({ length: audio.numberOfChannels }, (_, c) => audio.getChannelData(c))
    const ac = channels(A), bc = channels(B)
    const { aLevel, bLevel } = matchComparisonLevels(ac, bc)
    for (const [data, gain] of [[ac, aLevel], [bc, bLevel]] as const) {
      for (const channel of data) for (let i = 0; i < channel.length; i++) channel[i] *= gain
    }
    return { A, B }
  }).catch(error => {
    if (cache.get(buffer)?.key === key) cache.delete(buffer)
    throw error
  })
  cache.set(buffer, { key, value })
  return value
}
