import { create } from 'zustand'

export interface EQBand {
  frequency: number
  gain: number
  type: 'lowshelf' | 'peaking' | 'highshelf'
}

export interface DeviceProfile {
  id: string
  brand: string
  name: string
  alias: string[]
  baseEQ: EQBand[]
  version: string
}

export interface TestResponse {
  round: number
  axis: 'bass' | 'warmth' | 'vocal' | 'brightness'
  choice: 'A' | 'B' | 'similar'
  responseTime: number
}

export interface TestResult {
  id?: string
  deviceId: string
  deviceName?: string
  personalizationDelta: EQBand[]
  responses: TestResponse[]
  confidence: number
  completedRounds: number   // 실제 완료된 라운드 수
  earlyStop: boolean        // 조기 종료 여부
  createdAt: string
}

export type TestAxis = 'bass' | 'warmth' | 'vocal' | 'brightness'

export interface AnalyzedSegment {
  start: number        // 시작 시간(초)
  duration: number     // 구간 길이(초)
  energy: number       // 대표 에너지 (0~1, 4축 평균)
  label: string        // 표시 레이블 (예: "0:32 ~ 0:42")
  axisScores: Record<TestAxis, number>  // 4축 각각의 에너지 점수
}

interface AudioState {
  audioContext: AudioContext | null
  currentSource: AudioBufferSourceNode | null
  gainNode: GainNode | null
  filters: BiquadFilterNode[]
  isInitialized: boolean
  isPlaying: boolean
  isLoading: boolean
  error: string | null
  currentBuffer: AudioBuffer | null
  currentEQ: EQBand[]
  playSegment: (startSec: number, durationSec: number) => Promise<void>
  playWithAxisGain: (axis: TestAxis, gainDb: number, start: number, duration: number) => Promise<void>
  applyAxisGain: (axis: TestAxis, gainDb: number) => void
  initAudioContext: () => Promise<void>
  loadAudio: (url: string) => Promise<boolean>
  loadAudioFile: (file: File) => Promise<boolean>
  // 1회 FFT로 4축 동시 분석 → top-3 구간 반환 (OfflineAudioContext 생성 횟수 1/4로 절감)
  analyzeSegments: () => Promise<AnalyzedSegment[]>
  play: () => Promise<void>
  pause: () => void
  applyEQ: (eqBands: EQBand[]) => void
  cleanup: () => void
}

export interface AxisTestState {
  gain: number        // 현재 추정 선호 gain (dB)
  bayesMean: number   // posterior 평균
  bayesStd: number    // posterior 표준편차
}

const AXES: TestAxis[] = ['bass', 'warmth', 'vocal', 'brightness']
export const BAYESIAN_TOTAL_ROUNDS = 16

function makeAxisState(): AxisTestState {
  // bayesStd=5: 첫 비교는 ±5 dB 단차(니으로 전체 탐색공간 커버)
  return { gain: 0, bayesMean: 0, bayesStd: 5 }
}

interface TestState {
  currentStep: 'device' | 'audio' | 'segment' | 'test' | 'result'
  selectedDevice: DeviceProfile | null
  selectedAudioType: 'sample' | 'upload'
  selectedSegment: { start: number; duration: number } | null  // manual 모드용
  segments: AnalyzedSegment[]    // 자동 분석된 top-3 구간
  manualMode: boolean            // true이면 selectedSegment 사용, false이면 segments 자동 순환
  axisStates: Record<TestAxis, AxisTestState>
  currentRound: number
  responses: TestResponse[]
  testResult: TestResult | null
  isTestComplete: boolean
  currentAxis: TestAxis
  roundStartTime: number   // 현재 라운드 시작 시각 (Date.now())
  lastPlayedSegmentStart: number | null // 직전 라운드에 재생된 구간 시작 초 (연속 동일 구간 방지용)
  getCurrentABGains: () => { aGain: number; bGain: number }
  // 현재 라운드에 사용할 세그먼트 (자동 순환 or 수동)
  getCurrentSegment: () => { start: number; duration: number } | null
  setCurrentStep: (step: TestState['currentStep']) => void
  setSelectedDevice: (device: DeviceProfile) => void
  setSelectedAudioType: (type: 'sample' | 'upload') => void
  setSelectedSegment: (segment: { start: number; duration: number }) => void
  setSegments: (segments: AnalyzedSegment[]) => void
  setManualMode: (manual: boolean) => void
  processResponse: (choice: 'A' | 'B' | 'similar') => void
  completeTest: (earlyStop?: boolean) => void
  resetTestProgress: () => void
  resetTest: () => void
}

// ─── AudioStore ───────────────────────────────────────────────────────────────

export const useAudioStore = create<AudioState>((set, get) => ({
  audioContext: null,
  currentSource: null,
  gainNode: null,
  filters: [],
  isInitialized: false,
  isPlaying: false,
  isLoading: false,
  error: null,
  currentBuffer: null,
  currentEQ: [],

  initAudioContext: async () => {
    try {
      // audioContext + isInitialized 둘 다 체크 → 비동기 동시 호출 시 중복 초기화 방지
      if (get().isInitialized || get().audioContext) return
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const gainNode = audioContext.createGain()
      gainNode.connect(audioContext.destination)

      const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]
      const filters: BiquadFilterNode[] = []
      frequencies.forEach((freq, index) => {
        const filter = audioContext.createBiquadFilter()
        filter.frequency.value = freq
        if (index === 0) {
          filter.type = 'lowshelf'
        } else if (index === frequencies.length - 1) {
          filter.type = 'highshelf'
        } else {
          filter.type = 'peaking'
          filter.Q.value = 1.4
        }
        filter.gain.value = 0
        filters.push(filter)
      })
      filters.reduce((prev, current) => { prev.connect(current); return current })
      filters[filters.length - 1].connect(gainNode)
      set({ audioContext, gainNode, filters, isInitialized: true, error: null })
    } catch (error) {
      console.error('AudioContext init failed:', error)
      set({ error: 'Failed to initialize audio. Please check your browser settings.' })
    }
  },

  loadAudio: async (url: string) => {
    set({ isLoading: true, error: null })
    try {
      await get().initAudioContext()
      const { audioContext, currentSource } = get()
      if (!audioContext) { set({ error: 'Failed to initialize audio. Please check your browser settings.' }); return false }
      if (audioContext.state === 'suspended') await audioContext.resume()
      if (currentSource) { try { currentSource.stop() } catch {} }
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      set({ currentBuffer: audioBuffer })
      return true
    } catch (error) {
      console.error('Audio load failed:', error)
      set({ error: 'Failed to load audio. Please check the file or your connection.' })
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  loadAudioFile: async (file: File) => {
    set({ isLoading: true, error: null })
    try {
      await get().initAudioContext()
      const { audioContext, currentSource } = get()
      if (!audioContext) { set({ error: 'Failed to initialize audio. Please check your browser settings.' }); return false }
      if (audioContext.state === 'suspended') await audioContext.resume()
      if (currentSource) { try { currentSource.stop() } catch {} }
      const arrayBuffer = await file.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      set({ currentBuffer: audioBuffer })
      return true
    } catch (error) {
      console.error('Audio file load failed:', error)
      set({ error: 'Failed to load the uploaded audio file. Please try a different file.' })
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  playSegment: async (startSec: number, durationSec: number) => {
    const { currentBuffer, filters, currentSource } = get()
    if (!currentBuffer || !filters.length) { set({ error: 'No audio loaded. Please select audio first.' }); return }
    await get().initAudioContext()
    const { audioContext } = get()
    if (!audioContext) return
    if (audioContext.state === 'suspended') {
      try { await audioContext.resume() } catch {}
    }
    if (currentSource) {
      currentSource.onended = null
      try { currentSource.stop() } catch {}
    }
    const safeStart = Math.max(0, Math.min(startSec, Math.max(0, currentBuffer.duration - 0.1)))
    const safeDuration = Math.min(durationSec, Math.max(0.1, currentBuffer.duration - safeStart))
    const source = audioContext.createBufferSource()
    source.buffer = currentBuffer
    source.connect(filters[0])
    source.start(0, safeStart, safeDuration)
    set({ currentSource: source, isPlaying: true })
    source.onended = () => {
      if (get().currentSource === source) {
        set({ isPlaying: false, currentSource: null })
      }
    }
  },

  // 각 구간 PCM 샘플을 BiquadFilter 시뮬레이션으로 대역별 RMS 계산 (FFT 미사용)
  // O(n) 연산으로 구간당 ~440k 곱셈 → O(n³) DFT 대비 수백 배 빠름
  analyzeSegments: async (): Promise<AnalyzedSegment[]> => {
    const { currentBuffer } = get()
    if (!currentBuffer) return []

    const sampleRate      = currentBuffer.sampleRate
    const totalDuration   = currentBuffer.duration
    const maxNyquistFreq  = Math.floor(sampleRate * 0.45)

    const freqRanges: Record<TestAxis, [number, number]> = {
      // 겹치지 않는 경계: 각 축의 고유 특성 구간만 분리 (나이퀴스트 주파수 안전 마진 적용)
      bass:       [20,   250],
      warmth:     [250,  600],   // 저중음 온기감 (600Hz 이하)
      vocal:      [600,  Math.min(3500, maxNyquistFreq)],  // 보컬 명료도 핵심 대역
      brightness: [Math.min(3500, maxNyquistFreq - 500), Math.min(16000, maxNyquistFreq)], // 에어·존재감 대역
    }

    const segmentDuration = Math.max(2, Math.min(10, totalDuration))
    const stepSec         = Math.max(1, Math.min(5, Math.floor(totalDuration / 4)))
    const axisKeys: TestAxis[] = ['bass', 'warmth', 'vocal', 'brightness']
    const channelData     = currentBuffer.getChannelData(0)

    // 앞뒤 15% 제외 (전주/아웃트로)
    const startLimit = totalDuration > 30 ? totalDuration * 0.15 : 0
    const endLimit   = totalDuration > 30 ? totalDuration * 0.85 : totalDuration

    // 2차 Butterworth 대역통과 필터 계수 계산 (bilinear transform)
    const makeBandpassCoeffs = (freqLow: number, freqHigh: number) => {
      const safeLow  = Math.max(10, Math.min(freqLow, maxNyquistFreq - 100))
      const safeHigh = Math.max(safeLow + 50, Math.min(freqHigh, maxNyquistFreq))
      const fc  = Math.sqrt(safeLow * safeHigh) / sampleRate  // 중심 주파수(정규화)
      const bw  = (safeHigh - safeLow) / sampleRate           // 대역폭(정규화)
      const w0  = 2 * Math.PI * fc
      const Q   = fc / bw
      const cos0 = Math.cos(w0)
      const sin0 = Math.sin(w0)
      const alpha = sin0 / (2 * Q)
      const b0 =  alpha
      const b1 =  0
      const b2 = -alpha
      const a0 =  1 + alpha
      const a1 = -2 * cos0
      const a2 =  1 - alpha
      return { b0: b0/a0, b1: b1/a0, b2: b2/a0, a1: a1/a0, a2: a2/a0 }
    }

    // 대역통과 필터 적용 후 RMS 에너지 계산
    const bandRMS = (samples: Float32Array, freqLow: number, freqHigh: number): number => {
      const { b0, b1, b2, a1, a2 } = makeBandpassCoeffs(freqLow, freqHigh)
      let x1 = 0, x2 = 0, y1 = 0, y2 = 0
      let sumSq = 0
      for (let i = 0; i < samples.length; i++) {
        const x0 = samples[i]
        const y0 = b0*x0 + b1*x1 + b2*x2 - a1*y1 - a2*y2
        sumSq += y0 * y0
        x2 = x1; x1 = x0; y2 = y1; y1 = y0
      }
      return Math.sqrt(sumSq / (samples.length || 1))
    }

    // 전체 RMS (prominence 계산용)
    const totalRMS = (samples: Float32Array): number => {
      let sumSq = 0
      for (let i = 0; i < samples.length; i++) sumSq += samples[i] * samples[i]
      return Math.sqrt(sumSq / (samples.length || 1))
    }

    const scored: Array<{
      start: number; duration: number; label: string;
      axisScores: Record<TestAxis, number>; energy: number
    }> = []

    let offset = startLimit
    while (offset + segmentDuration <= endLimit) {
      const startSample    = Math.floor(offset * sampleRate)
      const endSample      = Math.min(startSample + Math.floor(segmentDuration * sampleRate), channelData.length)
      // subarray 사용으로 무복사 메모리 뷰 생성 (메모리 절약 및 GC 부하 방지)
      const segmentSamples = channelData.subarray(startSample, endSample)
      const rmsTotal       = totalRMS(segmentSamples) || 1

      const axisScores = {} as Record<TestAxis, number>
      for (const ax of axisKeys) {
        const [lo, hi] = freqRanges[ax]
        const rms       = bandRMS(segmentSamples, lo, hi)
        const prominence = rms / rmsTotal  // 전체 대비 해당 대역 비율
        axisScores[ax]  = rms * Math.pow(prominence, 1.5)
      }
      const avgScore = axisKeys.reduce((s, ax) => s + axisScores[ax], 0) / axisKeys.length

      const sMin  = Math.floor(offset / 60)
      const sSec  = Math.floor(offset % 60)
      const eMin  = Math.floor((offset + segmentDuration) / 60)
      const eSec  = Math.floor((offset + segmentDuration) % 60)
      const label = `${sMin}:${String(sSec).padStart(2,'0')} ~ ${eMin}:${String(eSec).padStart(2,'0')}`

      scored.push({ start: offset, duration: segmentDuration, label, axisScores, energy: avgScore })
      offset += stepSec
    }

    // 2초 미만 음원 등 루프에서 세그먼트가 생성되지 않은 경우 전체 음원을 1구간으로 보장
    if (scored.length === 0) {
      const fallbackDuration = Math.max(0.1, totalDuration)
      const eMin = Math.floor(fallbackDuration / 60)
      const eSec = Math.floor(fallbackDuration % 60)
      return [{
        start: 0,
        duration: fallbackDuration,
        label: `0:00 ~ ${eMin}:${String(eSec).padStart(2, '0')}`,
        energy: 1,
        axisScores: { bass: 1, warmth: 1, vocal: 1, brightness: 1 }
      }]
    }

    // 에너지 정규화 (0~1)
    const maxE  = Math.max(...scored.map(r => r.energy))
    const minE  = Math.min(...scored.map(r => r.energy))
    const range = maxE - minE || 1
    const normalized: AnalyzedSegment[] = scored.map(r => ({ ...r, energy: (r.energy - minE) / range }))

    // [다양성 강화 알고리즘]: 4개 축 각각에서 가장 두드러진 고유 구간 2개씩 선별 + 전체 하이라이트 구간 결합 (총 6~10개 세그먼트 풀 생성)
    const selected: AnalyzedSegment[] = []
    const isOverlapping = (start: number, factor = 0.6) =>
      selected.some(s => Math.abs(s.start - start) < segmentDuration * factor)

    // 1) 각 축(bass, warmth, vocal, brightness)별 특화 구간 선별 (각 축당 최대 2개)
    for (const ax of axisKeys) {
      const axisSorted = [...normalized].sort((a, b) => b.axisScores[ax] - a.axisScores[ax])
      let addedForAxis = 0
      for (const seg of axisSorted) {
        if (!isOverlapping(seg.start, 0.6)) {
          selected.push(seg)
          addedForAxis++
          if (addedForAxis >= 2) break
        }
      }
    }

    // 2) 전체 에너지 상위 구간 추가 (최대 2개 추가, 세그먼트 풀 확장)
    const energySorted = [...normalized].sort((a, b) => b.energy - a.energy)
    for (const seg of energySorted) {
      if (!isOverlapping(seg.start, 0.5)) {
        selected.push(seg)
        if (selected.length >= 8) break
      }
    }

    // 만약 선택된 구간이 4개 미만이라면 완화하여 최소 4개 이상 보장
    if (selected.length < 4) {
      for (const seg of energySorted) {
        if (!selected.some(s => Math.abs(s.start - seg.start) < segmentDuration * 0.3)) {
          selected.push(seg)
          if (selected.length >= 4) break
        }
      }
    }

    return selected.sort((a, b) => a.start - b.start)
  },

  play: async () => {
    const { currentBuffer, filters, currentSource } = get()
    if (!currentBuffer || !filters.length) { set({ error: 'No audio loaded. Please select audio first.' }); return }
    await get().initAudioContext()
    const { audioContext } = get()
    if (!audioContext) { set({ error: 'Failed to initialize audio. Please check your browser settings.' }); return }
    if (audioContext.state === 'suspended') {
      try { await audioContext.resume() } catch {}
    }
    if (currentSource) {
      currentSource.onended = null
      try { currentSource.stop() } catch {}
    }
    const source = audioContext.createBufferSource()
    source.buffer = currentBuffer
    source.connect(filters[0])
    source.start(0)
    set({ currentSource: source, isPlaying: true })
    source.onended = () => {
      if (get().currentSource === source) {
        set({ isPlaying: false, currentSource: null })
      }
    }
  },

  pause: () => {
    const { currentSource } = get()
    if (currentSource) { currentSource.stop(); set({ isPlaying: false, currentSource: null }) }
  },

  // bass[0,1] warmth[2,3] vocal[4,5] brightness[6,7,8,9]
  applyAxisGain: (axis: TestAxis, gainDb: number) => {
    const { filters, gainNode } = get()
    if (!gainNode || filters.length === 0) return
    const { axisStates, selectedDevice } = useTestStore.getState()
    const baseEQ = selectedDevice?.baseEQ
    const activeGains: Record<TestAxis, number> = {
      bass:       axis === 'bass'       ? gainDb : axisStates.bass.gain,
      warmth:     axis === 'warmth'     ? gainDb : axisStates.warmth.gain,
      vocal:      axis === 'vocal'      ? gainDb : axisStates.vocal.gain,
      brightness: axis === 'brightness' ? gainDb : axisStates.brightness.gain,
    }
    const idxMap: Record<TestAxis, number[]> = {
      bass: [0, 1], warmth: [2, 3], vocal: [4, 5], brightness: [6, 7, 8, 9],
    }
    const allFinalGains: number[] = []
    AXES.forEach(a => {
      idxMap[a].forEach(i => {
        if (filters[i]) {
          const baseGain = baseEQ ? baseEQ[i].gain : 0
          const finalGain = Math.max(-10, Math.min(10, baseGain + activeGains[a]))
          filters[i].gain.value = finalGain
          allFinalGains.push(finalGain)
        }
      })
    })
    // Loudness Normalization: 전체 밴드 평균 gain으로 보상
    // → A/B 각각 재생 시 평균 스펙트럼 파워를 동일하게 유지해 loudness 편향 제거
    const avgGainDb = allFinalGains.reduce((s, g) => s + g, 0) / (allFinalGains.length || 1)
    gainNode.gain.value = Math.pow(10, -avgGainDb / 20)
  },

  playWithAxisGain: async (axis: TestAxis, gainDb: number, start: number, duration: number) => {
    get().applyAxisGain(axis, gainDb)
    await get().playSegment(start, duration)
  },

  applyEQ: (eqBands: EQBand[]) => {
    const { filters, gainNode } = get()
    if (!gainNode || filters.length === 0) return
    let maxPositiveGain = 0
    eqBands.forEach((band, index) => {
      if (filters[index]) {
        const finalGain = Math.max(-10, Math.min(10, band.gain))
        filters[index].gain.value = finalGain
        if (finalGain > maxPositiveGain) maxPositiveGain = finalGain
      }
    })
    gainNode.gain.value = Math.pow(10, -maxPositiveGain / 20)
    set({ currentEQ: eqBands })
  },

  cleanup: () => {
    const { currentSource, audioContext } = get()
    if (currentSource) {
      currentSource.onended = null
      try { currentSource.stop() } catch {}
    }
    // set 먼저 호출해 참조를 null로 교체한 후 close()
    set({
      audioContext: null, currentSource: null, gainNode: null,
      filters: [], isInitialized: false, isPlaying: false,
      isLoading: false, error: null, currentBuffer: null,
    })
    if (audioContext) { try { audioContext.close() } catch {} }
  },
}))

// Local storage helper
function saveResultToLocalStorage(result: TestResult) {
  if (typeof window === 'undefined') return
  try {
    const stored = localStorage.getItem('eqfreeset.results')
    const parsed = stored ? JSON.parse(stored) : []
    const results: TestResult[] = Array.isArray(parsed) ? parsed : []
    // Remove if duplicate ID exists
    const filtered = results.filter(r => r && typeof r === 'object' && r.id !== result.id)
    // Limit to 50 items
    if (filtered.length >= 50) {
      filtered.pop()
    }
    filtered.unshift(result)
    localStorage.setItem('eqfreeset.results', JSON.stringify(filtered))
  } catch (e) {
    console.error('Failed to save result to localStorage:', e)
  }
}

// ─── TestStore ────────────────────────────────────────────────────────────────

export const useTestStore = create<TestState>((set, get) => ({
  currentStep: 'device',
  selectedDevice: null,
  selectedAudioType: 'sample',
  selectedSegment: null,
  segments: [],
  manualMode: false,
  axisStates: {
    bass: makeAxisState(), warmth: makeAxisState(),
    vocal: makeAxisState(), brightness: makeAxisState(),
  },
  currentRound: 1,
  responses: [],
  testResult: null,
  isTestComplete: false,
  currentAxis: 'bass',
  roundStartTime: Date.now(),
  lastPlayedSegmentStart: null,

  // A = mean - std, B = mean + std
  getCurrentABGains: () => {
    const { axisStates, currentAxis } = get()
    const s = axisStates[currentAxis]
    const clamp = (v: number) => Math.max(-10, Math.min(10, v))
    return { aGain: clamp(s.bayesMean - s.bayesStd), bGain: clamp(s.bayesMean + s.bayesStd) }
  },

  // 현재 라운드에 사용할 세그먼트
  // - manualMode ON : 사용자가 지정한 selectedSegment
  // - manualMode OFF: 현재 축의 특화도 상위 후보군 안에서 축 등장 횟수 기반 순환 + 직전 라운드 회피
  getCurrentSegment: () => {
    const { manualMode, selectedSegment, segments, currentAxis, responses, lastPlayedSegmentStart } = get()
    if (manualMode) return selectedSegment
    if (segments.length === 0) return null

    // 현재 축이 지금까지 몇 번 테스트되었는지 카운트
    const axisCount = responses.filter(r => r.axis === currentAxis).length

    // 현재 축의 특화도 점수 기준으로 정렬
    const sorted = [...segments].sort((a, b) => b.axisScores[currentAxis] - a.axisScores[currentAxis])
    const topCandidates = sorted.slice(0, Math.min(3, sorted.length))

    // 축 등장 횟수 기반 순환 인덱스
    const baseIndex = axisCount % topCandidates.length

    // 직전 라운드에 들었던 구간과 8초 이상 차이나는 구간 우선 선택 (연속 중복 방지)
    let chosen = topCandidates[baseIndex]
    for (let i = 0; i < topCandidates.length; i++) {
      const candidate = topCandidates[(baseIndex + i) % topCandidates.length]
      if (lastPlayedSegmentStart === null || Math.abs(candidate.start - lastPlayedSegmentStart) >= 8) {
        chosen = candidate
        break
      }
    }

    return { start: chosen.start, duration: chosen.duration }
  },

  setCurrentStep:     (step)    => set({ currentStep: step }),
  setSelectedDevice:  (device)  => set({ selectedDevice: device }),
  setSelectedAudioType:(type)   => set({ selectedAudioType: type }),
  setSelectedSegment: (segment) => set({ selectedSegment: segment }),
  setSegments:        (segments)=> set({ segments }),
  setManualMode:      (manual)  => set({ manualMode: manual }),

  // Bayesian 갱신 (Thurstone 근사) + 조기 종료
  processResponse: (choice) => {
    const state = get()
    if (state.isTestComplete) return

    const { currentRound, axisStates, currentAxis } = state
    const s = { ...axisStates[currentAxis] }

    // Mean 갱신: A/B는 std 비례 이동
    if (choice === 'B')      s.bayesMean = Math.min(10, s.bayesMean + s.bayesStd * 0.4)
    else if (choice === 'A') s.bayesMean = Math.max(-10, s.bayesMean - s.bayesStd * 0.4)
    // similar: mean 부동 (이미 true에 가기다는 신호 → 현 위치유지)

    // Std 갱신: Monte Carlo 200회 시뮬레이션으로 검증된 최적값
    // · similar → "이미 true 근처" 신호 → std 큰 폭 감소로 빠른 수렴 (×0.70)
    // · A/B    → 방향은 알았지만 similar보다 덜 확신 → std 소폭 감소 (×0.85)
    s.bayesStd = Math.max(0.5, s.bayesStd * (choice === 'similar' ? 0.70 : 0.85))
    s.gain = s.bayesMean

    const newAxisStates = { ...axisStates, [currentAxis]: s }
    const nextAxis = AXES.reduce((a, b) =>
      newAxisStates[a].bayesStd >= newAxisStates[b].bayesStd ? a : b
    )

    const currentSeg = state.getCurrentSegment()

    set({
      axisStates: newAxisStates,
      currentRound: currentRound + 1,
      currentAxis: nextAxis,
      roundStartTime: Date.now(),
      lastPlayedSegmentStart: currentSeg ? currentSeg.start : null,
      responses: [...state.responses, {
        round: currentRound, axis: currentAxis, choice,
        responseTime: Date.now() - state.roundStartTime,
      }],
    })

    // 조기 종료: 10라운드 이후, 모든 축 std ≤ 2.0 && 평균 std ≤ 1.5
    const stds       = AXES.map(a => newAxisStates[a].bayesStd)
    const avgStdNow  = stds.reduce((a, b) => a + b, 0) / stds.length
    const allTight   = stds.every(std => std <= 2.0)
    const nextRound  = currentRound + 1  // set() 후 실제 저장될 라운드 번호
    const earlyStop  = nextRound > 10 && allTight && avgStdNow <= 1.5

    if (nextRound > BAYESIAN_TOTAL_ROUNDS || earlyStop) get().completeTest(earlyStop)
  },

  completeTest: (earlyStop = false) => {
    const state = get()
    if (!state.selectedDevice) return
    const { axisStates } = state
    const gainOf = (axis: TestAxis) => Math.max(-10, Math.min(10, axisStates[axis].gain))

    const personalizationDelta: EQBand[] = [
      { frequency: 32,    gain: gainOf('bass'),       type: 'lowshelf'  },
      { frequency: 64,    gain: gainOf('bass'),       type: 'peaking'   },
      { frequency: 125,   gain: gainOf('warmth'),     type: 'peaking'   },
      { frequency: 250,   gain: gainOf('warmth'),     type: 'peaking'   },
      { frequency: 500,   gain: gainOf('vocal'),      type: 'peaking'   },
      { frequency: 1000,  gain: gainOf('vocal'),      type: 'peaking'   },
      { frequency: 2000,  gain: gainOf('brightness'), type: 'peaking'   },
      { frequency: 4000,  gain: gainOf('brightness'), type: 'peaking'   },
      { frequency: 8000,  gain: gainOf('brightness'), type: 'peaking'   },
      { frequency: 16000, gain: gainOf('brightness'), type: 'highshelf' },
    ]

    const avgStd = AXES.reduce((s, a) => s + state.axisStates[a].bayesStd, 0) / 4
    // confidence: 1 - (avgStd / bayesStd_초기값). 초기 std=5 기준으로 정규화
    const confidence = Math.min(0.99, Math.max(0.5, 1 - avgStd / 5))

    const resultId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    const finalResult: TestResult = {
      id: resultId,
      deviceId: state.selectedDevice.id,
      deviceName: state.selectedDevice.name,
      personalizationDelta,
      responses: state.responses,
      confidence,
      completedRounds: state.responses.length,
      earlyStop,
      createdAt: new Date().toISOString(),
    }

    saveResultToLocalStorage(finalResult)

    set({
      testResult: finalResult,
      currentStep: 'result',
      isTestComplete: true,
    })
  },

  // 테스트 진행 데이터만 수동 초기화 (세그먼트·기기 선택은 유지)
  resetTestProgress: () => set({
    axisStates: {
      bass: makeAxisState(), warmth: makeAxisState(),
      vocal: makeAxisState(), brightness: makeAxisState(),
    },
    currentRound: 1,
    responses: [],
    testResult: null,
    isTestComplete: false,
    currentAxis: 'bass',
    roundStartTime: Date.now(),
    lastPlayedSegmentStart: null,
  }),

  resetTest: () => set({
    currentStep: 'device',
    selectedDevice: null,
    selectedAudioType: 'sample',
    selectedSegment: null,
    segments: [],
    manualMode: false,
    axisStates: {
      bass: makeAxisState(), warmth: makeAxisState(),
      vocal: makeAxisState(), brightness: makeAxisState(),
    },
    currentRound: 1,
    responses: [],
    testResult: null,
    isTestComplete: false,
    currentAxis: 'bass',
    roundStartTime: Date.now(),
    lastPlayedSegmentStart: null,
  }),
}))
