import type { EQBand, TestAxis } from './audio-store'

export const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]
export const EQ_Q = 1.4
export const clampGain = (gain: number) => Math.max(-10, Math.min(10, gain))

export const AXIS_FREQUENCIES: Record<TestAxis, number[]> = {
  bass: [32, 64], warmth: [125, 250], vocal: [500, 1000], brightness: [2000, 4000, 8000, 16000],
}

// A single axis delta must fit every affected band before per-band clamping.
export function getAxisGainRange(base: EQBand[], axis: TestAxis) {
  const affected = base.filter(band => AXIS_FREQUENCIES[axis].includes(band.frequency))
  return {
    min: Math.max(-10, ...affected.map(band => -10 - band.gain)),
    max: Math.min(10, ...affected.map(band => 10 - band.gain)),
  }
}

export function combineEQ(base: EQBand[], delta: EQBand[]): EQBand[] {
  return base.map(band => ({
    ...band,
    gain: clampGain(band.gain + (delta.find(d => d.frequency === band.frequency)?.gain ?? 0)),
  }))
}

// RBJ cookbook coefficients, matching Web Audio peaking Q=1.4 and shelves S=1.
export function filterCoefficients(band: EQBand, sampleRate: number) {
  const a = Math.pow(10, clampGain(band.gain) / 40)
  const w = 2 * Math.PI * Math.min(band.frequency, sampleRate * 0.499) / sampleRate
  const c = Math.cos(w)
  const s = Math.sin(w)
  if (band.type === 'peaking') {
    const alpha = s / (2 * EQ_Q)
    return [1 + alpha * a, -2 * c, 1 - alpha * a, 1 + alpha / a, -2 * c, 1 - alpha / a]
  }
  const beta = Math.sqrt(2 * a) * s
  if (band.type === 'lowshelf') {
    return [a * ((a + 1) - (a - 1) * c + beta), 2 * a * ((a - 1) - (a + 1) * c), a * ((a + 1) - (a - 1) * c - beta), (a + 1) + (a - 1) * c + beta, -2 * ((a - 1) + (a + 1) * c), (a + 1) + (a - 1) * c - beta]
  }
  return [a * ((a + 1) + (a - 1) * c + beta), -2 * a * ((a - 1) + (a + 1) * c), a * ((a + 1) + (a - 1) * c - beta), (a + 1) - (a - 1) * c + beta, 2 * ((a - 1) - (a + 1) * c), (a + 1) - (a - 1) * c - beta]
}

export function responseDb(coefficients: number[], frequency: number, sampleRate: number) {
  const [b0, b1, b2, a0, a1, a2] = coefficients
  const w = 2 * Math.PI * frequency / sampleRate
  const power = (x0: number, x1: number, x2: number) =>
    Math.pow(x0 + x1 * Math.cos(w) + x2 * Math.cos(2 * w), 2) + Math.pow(x1 * Math.sin(w) + x2 * Math.sin(2 * w), 2)
  return 10 * Math.log10(power(b0, b1, b2) / power(a0, a1, a2))
}

// Sample the complete cascade, not just the largest individual band. This is
// frequency-response headroom with 0.5 dB margin, not perceptual loudness matching
// or a guarantee against every transient/inter-sample peak.
export function getPreampDb(bands: EQBand[], sampleRate = 48000) {
  const coefficients = bands.map(b => filterCoefficients(b, sampleRate))
  const upper = Math.min(22000, sampleRate * 0.499)
  let peakDb = 0
  for (let i = 0; i <= 2048; i++) {
    const frequency = 10 * Math.pow(upper / 10, i / 2048)
    const gain = coefficients.reduce((sum, c) => sum + responseDb(c, frequency, sampleRate), 0)
    peakDb = Math.max(peakDb, gain)
  }
  return peakDb < 0.001 ? 0 : -Math.ceil((peakDb + 0.5) * 10) / 10
}
