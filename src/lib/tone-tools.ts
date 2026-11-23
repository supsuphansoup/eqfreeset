// 이어폰 테스트 도구(/tools/)의 순수 계산 함수 (Web Audio 없이 테스트 가능하도록 분리)

export const SWEEP_MIN_HZ = 20
export const SWEEP_MAX_HZ = 20000
export const SWEEP_SECONDS = 15
export const SLIDER_STEPS = 1000

/** exponentialRampToValueAtTime과 같은 로그 스윕에서 경과 시간의 주파수 */
export function sweepFrequencyAt(elapsed: number, duration = SWEEP_SECONDS, from = SWEEP_MIN_HZ, to = SWEEP_MAX_HZ) {
  const t = Math.min(Math.max(elapsed / duration, 0), 1)
  return from * Math.pow(to / from, t)
}

/** 슬라이더 위치(0~SLIDER_STEPS)를 로그 스케일 주파수로 변환 */
export function sliderToFrequency(position: number, steps = SLIDER_STEPS) {
  return Math.round(sweepFrequencyAt(position, steps))
}

export function frequencyToSlider(frequency: number, steps = SLIDER_STEPS) {
  const f = Math.min(Math.max(frequency, SWEEP_MIN_HZ), SWEEP_MAX_HZ)
  return Math.round((Math.log(f / SWEEP_MIN_HZ) / Math.log(SWEEP_MAX_HZ / SWEEP_MIN_HZ)) * steps)
}

export function formatHz(frequency: number) {
  return frequency >= 1000 ? `${(frequency / 1000).toFixed(frequency >= 10000 ? 1 : 2)} kHz` : `${Math.round(frequency)} Hz`
}

/** 마이크 입력 샘플의 RMS 레벨을 0~1 미터 값으로 변환 (-60 dBFS 이하는 0) */
export function levelFromSamples(samples: Float32Array) {
  let sum = 0
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i]
  const rms = Math.sqrt(sum / Math.max(samples.length, 1))
  if (rms <= 0) return 0
  const db = 20 * Math.log10(rms)
  return Math.min(Math.max((db + 60) / 60, 0), 1)
}
