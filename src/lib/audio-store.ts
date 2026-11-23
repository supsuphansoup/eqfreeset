import { create } from 'zustand'
import { combineEQ, getPreampDb, getAxisGainRange } from './eq-processing'
import { prepareComparison } from './comparison-audio'
import { createPreferenceSearch, preferenceCandidates, summarizePreference, updatePreference, type PreferenceSearch } from './preference-search'

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
  choice: 'A' | 'B' | 'similar' | 'unsure'
  responseTime: number
  aGain?: number
  bGain?: number
  segmentStart?: number
  segmentDuration?: number
}

export interface TestResult {
  id?: string
  deviceId: string
  deviceName?: string
  personalizationDelta: EQBand[]
  responses: TestResponse[]
  confidence?: number       // 과거 기록 호환용. 새 결과에는 정확도 수치를 만들지 않음
  completedRounds: number   // 실제 완료된 라운드 수
  earlyStop: boolean        // 조기 종료 여부
  createdAt: string
  schemaVersion?: 2
  algorithmVersion?: string
  baseEQSnapshot?: EQBand[]
  finalEQ?: EQBand[]
  deviceVersion?: string
  roundBudget?: number
  proposedEQ?: EQBand[]
  finalReview?: { choice: 'base' | 'personalized' | 'unsure'; aIsPersonalized: boolean; segmentStart: number; segmentDuration: number }
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
  playComparison: (option: 'A' | 'B', start: number, duration: number) => Promise<void>
  applyAxisGain: (axis: TestAxis, gainDb: number) => void
  initAudioContext: () => Promise<void>
  loadAudio: (url: string) => Promise<boolean>
  loadAudioFile: (file: File) => Promise<boolean>
  // Stereo PCM energy analysis for all four axes.
  analyzeSegments: () => Promise<AnalyzedSegment[]>
  play: () => Promise<void>
  pause: () => void
  applyEQ: (eqBands: EQBand[]) => void
  cleanup: () => void
}

export interface AxisTestState {
  gain: number        // 현재 추정 선호 gain (dB)
  bayesMean: number   // 기존 필드명 유지: 격자 분포의 중앙값을 반올림한 설정
  bayesStd: number    // 가정한 응답 모형의 분포 폭; 청취 정확도가 아님
  search: PreferenceSearch
}

const AXES: TestAxis[] = ['bass', 'warmth', 'vocal', 'brightness']
export const BAYESIAN_TOTAL_ROUNDS = 16
export const MAX_TEST_ROUNDS = 32

function makeAxisState(min = -10, max = 10): AxisTestState {
  return { gain: 0, bayesMean: 0, bayesStd: 5, search: createPreferenceSearch(min, max) }
}

function makeAxisStates(device: DeviceProfile | null = null) {
  return Object.fromEntries(AXES.map(axis => {
    const { min, max } = getAxisGainRange(device?.baseEQ ?? [], axis)
    return [axis, makeAxisState(min, max)]
  })) as Record<TestAxis, AxisTestState>
}

function answerAxis(state: AxisTestState, aGain: number, bGain: number, choice: TestResponse['choice']): AxisTestState {
  const search = updatePreference(state.search, aGain, bGain, choice)
  if (search === state.search) return state
  const { gain, spread } = summarizePreference(search)
  return { search, gain, bayesMean: gain, bayesStd: spread }
}

interface TestState {
  currentStep: 'device' | 'audio' | 'segment' | 'test' | 'review' | 'result'
  selectedDevice: DeviceProfile | null
  selectedAudioType: 'sample' | 'upload'
  selectedSegment: { start: number; duration: number } | null  // manual 모드용
  segments: AnalyzedSegment[]    // 자동 분석된 top-3 구간
  manualMode: boolean            // true이면 selectedSegment 사용, false이면 segments 자동 순환
  axisStates: Record<TestAxis, AxisTestState>
  currentRound: number
  responses: TestResponse[]
  testResult: TestResult | null
  resultPersisted: boolean | null
  isTestComplete: boolean
  currentAxis: TestAxis
  roundStartTime: number   // 현재 라운드 시작 시각 (Date.now())
  lastPlayedSegmentStart: number | null // 직전 라운드에 재생된 구간 시작 초 (연속 동일 구간 방지용)
  comparisonFlipped: boolean
  roundBudget: number
  reviewFlipped: boolean
  comparisonOverride: TestResponse | null
  getCurrentABGains: () => { aGain: number; bGain: number }
  // 현재 라운드에 사용할 세그먼트 (자동 순환 or 수동)
  getCurrentSegment: () => { start: number; duration: number } | null
  setCurrentStep: (step: TestState['currentStep']) => void
  setSelectedDevice: (device: DeviceProfile) => void
  setSelectedAudioType: (type: 'sample' | 'upload') => void
  setSelectedSegment: (segment: { start: number; duration: number }) => void
  setSegments: (segments: AnalyzedSegment[]) => void
  setManualMode: (manual: boolean) => void
  processResponse: (choice: TestResponse['choice']) => void
  completeTest: (earlyStop?: boolean) => void
  confirmResult: (choice: 'A' | 'B' | 'unsure') => void
  retrySaveResult: () => void
  extendTest: () => void
  undoLastResponse: () => void
  resetTestProgress: () => void
  resetTest: () => void
}

// ─── AudioStore ───────────────────────────────────────────────────────────────

let audioLoadController: AbortController | null = null
let comparisonRequest: object | null = null

async function loadAudioData(read: (signal: AbortSignal) => Promise<ArrayBuffer>, errorMessage: string) {
  comparisonRequest = null
  const request = new AbortController()
  audioLoadController?.abort()
  audioLoadController = request
  const isCurrent = () => audioLoadController === request
  const get = useAudioStore.getState
  useAudioStore.setState({ isLoading: true, error: null })
  try {
    await get().initAudioContext()
    if (!isCurrent()) return false
    const { audioContext } = get()
    if (!audioContext) throw new Error('audio-context-unavailable')
    if (audioContext.state === 'suspended') await audioContext.resume()
    if (!isCurrent()) return false
    get().pause()
    const data = await read(request.signal)
    if (!isCurrent()) return false
    const buffer = await audioContext.decodeAudioData(data)
    // Decoding cannot be aborted, so discard results from an obsolete request.
    if (!isCurrent() || get().audioContext !== audioContext) return false
    useAudioStore.setState({ currentBuffer: buffer })
    return true
  } catch {
    if (isCurrent()) useAudioStore.setState({ error: errorMessage })
    return false
  } finally {
    if (isCurrent()) {
      audioLoadController = null
      useAudioStore.setState({ isLoading: false })
    }
  }
}

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
    return loadAudioData(async signal => {
      const response = await fetch(url, { signal })
      if (!response.ok) throw new Error(`Audio request failed: ${response.status}`)
      return response.arrayBuffer()
    }, 'Failed to load audio. Please check the file or your connection.')
  },

  loadAudioFile: async (file: File) => {
    return loadAudioData(() => file.arrayBuffer(), 'Failed to load the uploaded audio file. Please try a different file.')
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
    if (!currentBuffer || currentBuffer.duration <= 0) return []

    const sampleRate      = currentBuffer.sampleRate
    const totalDuration   = currentBuffer.duration
    const maxNyquistFreq  = Math.floor(sampleRate * 0.45)

    const freqRanges: Record<TestAxis, [number, number]> = {
      // 겹치지 않는 경계: 각 축의 고유 특성 구간만 분리 (나이퀴스트 주파수 안전 마진 적용)
      bass:       [20, 90],
      warmth:     [90, 354],
      vocal:      [354, Math.min(1414, maxNyquistFreq)],
      brightness: [Math.min(1414, maxNyquistFreq - 500), Math.min(16000, maxNyquistFreq)],
    }

    const segmentDuration = Math.min(10, totalDuration)
    const stepSec         = Math.max(1, Math.min(5, Math.floor(totalDuration / 4)))
    const axisKeys: TestAxis[] = ['bass', 'warmth', 'vocal', 'brightness']
    const channels = Array.from({ length: currentBuffer.numberOfChannels }, (_, c) => currentBuffer.getChannelData(c))

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
      if (get().currentBuffer !== currentBuffer) return []
      const startSample    = Math.floor(offset * sampleRate)
      const endSample      = Math.min(startSample + Math.floor(segmentDuration * sampleRate), channels[0].length)
      // subarray 사용으로 무복사 메모리 뷰 생성 (메모리 절약 및 GC 부하 방지)
      const segmentChannels = channels.map(channel => channel.subarray(startSample, endSample))
      // Sum channel energy rather than samples: anti-phase stereo must not cancel.
      const rmsTotal = Math.sqrt(segmentChannels.reduce((sum, samples) => sum + totalRMS(samples) ** 2, 0) / channels.length) || 1

      const axisScores = {} as Record<TestAxis, number>
      for (const ax of axisKeys) {
        const [lo, hi] = freqRanges[ax]
        const rms = Math.sqrt(segmentChannels.reduce((sum, samples) => sum + bandRMS(samples, lo, hi) ** 2, 0) / channels.length)
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
      // Let loading feedback and input paint while analysing long files.
      if (scored.length % 4 === 0) await new Promise(resolve => setTimeout(resolve, 0))
    }

    if (scored.length === 0 || get().currentBuffer !== currentBuffer) return []

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
    const finalBands = combineEQ(baseEQ ?? filters.map(filter => ({ frequency: filter.frequency.value, gain: 0, type: filter.type as EQBand['type'] })),
      filters.map((filter, i) => ({ frequency: filter.frequency.value, gain: activeGains[AXES.find(a => idxMap[a].includes(i))!], type: filter.type as EQBand['type'] })))
    AXES.forEach(a => {
      idxMap[a].forEach(i => {
        if (filters[i]) {
          const finalGain = finalBands[i].gain
          filters[i].gain.value = finalGain
        }
      })
    })
    // Frequency-response headroom; perceptual loudness matching is separate.
    gainNode.gain.value = Math.pow(10, getPreampDb(finalBands, get().audioContext?.sampleRate) / 20)
  },

  playWithAxisGain: async (axis: TestAxis, gainDb: number, start: number, duration: number) => {
    get().applyAxisGain(axis, gainDb)
    await get().playSegment(start, duration)
  },

  playComparison: async (option, start, duration) => {
    if (get().isLoading) return
    const request = {}
    comparisonRequest = request
    set({ isLoading: true, error: null })
    try {
      await get().initAudioContext()
      const { audioContext, currentBuffer } = get()
      if (!audioContext || !currentBuffer) throw new Error('comparison-unavailable')
      if (audioContext.state === 'suspended') await audioContext.resume()
      if (audioContext.state !== 'running') throw new Error('comparison-unavailable')
      get().pause()
      const test = useTestStore.getState()
      const { aGain, bGain } = test.getCurrentABGains()
      const bandsFor = (gain: number) => {
        const axisForBand = ['bass', 'bass', 'warmth', 'warmth', 'vocal', 'vocal', 'brightness', 'brightness', 'brightness', 'brightness'] as const
        return combineEQ(test.selectedDevice!.baseEQ, test.selectedDevice!.baseEQ.map((band, i) => ({
          ...band, gain: axisForBand[i] === test.currentAxis ? gain : test.axisStates[axisForBand[i]].gain,
        })))
      }
      const draft = test.testResult
      const review = test.currentStep === 'review'
      if (!test.selectedDevice || (review && (!draft?.baseEQSnapshot || !draft.finalEQ))) throw new Error('comparison-unavailable')
      const aBands = review ? (test.reviewFlipped ? draft!.finalEQ! : draft!.baseEQSnapshot!) : bandsFor(aGain)
      const bBands = review ? (test.reviewFlipped ? draft!.baseEQSnapshot! : draft!.finalEQ!) : bandsFor(bGain)
      const pair = await prepareComparison(currentBuffer, aBands, bBands, start, duration, audioContext.sampleRate)
      const latest = useTestStore.getState()
      if (comparisonRequest !== request) return
      if (!['test', 'review'].includes(latest.currentStep) || latest.currentStep !== test.currentStep || latest.testResult !== draft || latest.comparisonOverride !== test.comparisonOverride || latest.currentRound !== test.currentRound || latest.selectedDevice !== test.selectedDevice || latest.currentAxis !== test.currentAxis || latest.comparisonFlipped !== test.comparisonFlipped || latest.reviewFlipped !== test.reviewFlipped || get().currentBuffer !== currentBuffer || get().audioContext !== audioContext) return
      const latestSegment = latest.getCurrentSegment()
      if (latestSegment?.start !== start || latestSegment.duration !== duration) return
      const source = audioContext.createBufferSource()
      source.buffer = pair[option]
      // EQ and matched levels are already in the PCM; bypass the live filter chain.
      source.connect(audioContext.destination)
      source.onended = () => {
        source.disconnect()
        if (get().currentSource === source) set({ currentSource: null, isPlaying: false })
      }
      source.start()
      set({ currentSource: source, isPlaying: true })
    } catch (error) {
      if (comparisonRequest === request) set({ error: error instanceof Error && error.message === 'comparison-silent' ? 'comparison-silent' : 'comparison-unavailable', isPlaying: false })
    } finally {
      if (comparisonRequest === request) {
        comparisonRequest = null
        set({ isLoading: false })
      }
    }
  },

  applyEQ: (eqBands: EQBand[]) => {
    const { filters, gainNode } = get()
    if (!gainNode || filters.length === 0) return
    eqBands.forEach((band, index) => {
      if (filters[index]) {
        const finalGain = Math.max(-10, Math.min(10, band.gain))
        filters[index].gain.value = finalGain
      }
    })
    gainNode.gain.value = Math.pow(10, getPreampDb(eqBands, get().audioContext?.sampleRate) / 20)
    set({ currentEQ: eqBands })
  },

  cleanup: () => {
    comparisonRequest = null
    audioLoadController?.abort()
    audioLoadController = null
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
function saveResultToLocalStorage(result: TestResult): boolean {
  if (typeof window === 'undefined') return false
  try {
    const stored = localStorage.getItem('eqfreeset.results')
    const parsed = stored ? JSON.parse(stored) : []
    const results: TestResult[] = Array.isArray(parsed) ? parsed : []
    // Remove if duplicate ID exists
    const filtered = results.filter(r => r && typeof r === 'object' && r.id !== result.id)
    localStorage.setItem('eqfreeset.results', JSON.stringify([result, ...filtered].slice(0, 50)))
    return true
  } catch {
    return false
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
  axisStates: makeAxisStates(),
  currentRound: 1,
  responses: [],
  testResult: null,
  resultPersisted: null,
  isTestComplete: false,
  currentAxis: 'bass',
  roundStartTime: Date.now(),
  lastPlayedSegmentStart: null,
  comparisonFlipped: Math.random() < 0.5,
  roundBudget: BAYESIAN_TOTAL_ROUNDS,
  reviewFlipped: false,
  comparisonOverride: null,

  // Randomize the visible labels once per round; keep replay assignments stable.
  getCurrentABGains: () => {
    const { axisStates, currentAxis, comparisonFlipped, comparisonOverride } = get()
    if (comparisonOverride?.aGain != null && comparisonOverride.bGain != null) return { aGain: comparisonOverride.aGain, bGain: comparisonOverride.bGain }
    const { low, high } = preferenceCandidates(axisStates[currentAxis].search)
    return comparisonFlipped ? { aGain: high, bGain: low } : { aGain: low, bGain: high }
  },

  // 현재 라운드에 사용할 세그먼트
  // - manualMode ON : 사용자가 지정한 selectedSegment
  // - manualMode OFF: 현재 축의 특화도 상위 후보군 안에서 축 등장 횟수 기반 순환 + 직전 라운드 회피
  getCurrentSegment: () => {
    const { manualMode, selectedSegment, segments, currentAxis, responses, lastPlayedSegmentStart, comparisonOverride, currentStep } = get()
    if (comparisonOverride?.segmentStart != null && comparisonOverride.segmentDuration != null) return { start: comparisonOverride.segmentStart, duration: comparisonOverride.segmentDuration }
    // Use one stable segment throughout the final whole-EQ comparison.
    if (currentStep === 'review' && responses[responses.length - 1]?.segmentStart != null) {
      const last = responses[responses.length - 1]
      return { start: last.segmentStart!, duration: last.segmentDuration! }
    }
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
  setSelectedDevice:  (device)  => set({ selectedDevice: device, axisStates: makeAxisStates(device) }),
  setSelectedAudioType:(type)   => set({ selectedAudioType: type }),
  setSelectedSegment: (segment) => set({ selectedSegment: segment, comparisonOverride: null }),
  setSegments:        (segments)=> set({ segments }),
  setManualMode:      (manual)  => set({ manualMode: manual }),

  // Explicit response likelihood on a bounded grid. Unsure supplies no evidence.
  processResponse: (choice) => {
    const state = get()
    if (state.isTestComplete || state.currentStep !== 'test' || !state.selectedDevice) return

    const { currentRound, axisStates, currentAxis } = state
    const { aGain, bGain } = state.getCurrentABGains()
    if (Math.abs(aGain - bGain) < 1e-9) choice = 'unsure'
    const s = answerAxis(axisStates[currentAxis], aGain, bGain, choice)

    const newAxisStates = { ...axisStates, [currentAxis]: s }
    // Keep a skipped axis from consuming the remaining rounds. First balance
    // attempts, then use width to break ties; every axis gets four opportunities.
    const attempts = (axis: TestAxis) => state.responses.filter(r => r.axis === axis).length + (axis === currentAxis ? 1 : 0)
    const nextAxis = AXES.reduce((a, b) => attempts(a) !== attempts(b)
      ? (attempts(a) < attempts(b) ? a : b)
      : (newAxisStates[a].bayesStd >= newAxisStates[b].bayesStd ? a : b))

    const currentSeg = state.getCurrentSegment()

    set({
      axisStates: newAxisStates,
      currentRound: currentRound + 1,
      currentAxis: nextAxis,
      roundStartTime: Date.now(),
      lastPlayedSegmentStart: currentSeg ? currentSeg.start : null,
      comparisonFlipped: Math.random() < 0.5,
      comparisonOverride: null,
      responses: [...state.responses, {
        round: currentRound, axis: currentAxis, choice,
        aGain, bGain,
        segmentStart: currentSeg?.start, segmentDuration: currentSeg?.duration,
        responseTime: Date.now() - state.roundStartTime,
      }],
    })

    if (currentRound >= state.roundBudget) get().completeTest()
  },

  completeTest: (earlyStop = false) => {
    const state = get()
    if (!state.selectedDevice || state.currentStep !== 'test') return
    const { axisStates } = state
    const gainOf = (axis: TestAxis) => {
      const range = getAxisGainRange(state.selectedDevice!.baseEQ, axis)
      return Math.max(range.min, Math.min(range.max, axisStates[axis].gain))
    }

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

    const resultId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    const finalResult: TestResult = {
      id: resultId,
      deviceId: state.selectedDevice.id,
      deviceName: state.selectedDevice.name,
      personalizationDelta,
      responses: state.responses,
      completedRounds: state.responses.length,
      earlyStop,
      createdAt: new Date().toISOString(),
      schemaVersion: 2,
      algorithmVersion: 'preference-grid-v3',
      roundBudget: state.roundBudget,
      deviceVersion: state.selectedDevice.version,
      baseEQSnapshot: state.selectedDevice.baseEQ.map(b => ({ ...b })),
      finalEQ: combineEQ(state.selectedDevice.baseEQ, personalizationDelta),
    }

    set({
      testResult: finalResult,
      currentStep: 'review',
      reviewFlipped: Math.random() < 0.5,
      isTestComplete: false,
    })
  },

  confirmResult: (choice) => {
    const state = get(), draft = state.testResult, segment = state.getCurrentSegment()
    if (state.currentStep !== 'review' || !draft?.baseEQSnapshot || !draft.finalEQ || !segment) return
    const selection = choice === 'unsure' ? 'unsure' : ((choice === 'A') === state.reviewFlipped ? 'personalized' : 'base')
    const result: TestResult = {
      ...draft,
      proposedEQ: draft.finalEQ.map(b => ({ ...b })),
      finalReview: { choice: selection, aIsPersonalized: state.reviewFlipped, segmentStart: segment.start, segmentDuration: segment.duration },
      ...(selection === 'base' ? {
        personalizationDelta: draft.personalizationDelta.map(b => ({ ...b, gain: 0 })),
        finalEQ: draft.baseEQSnapshot.map(b => ({ ...b })),
      } : {}),
    }
    const resultPersisted = saveResultToLocalStorage(result)
    set({ testResult: result, resultPersisted, currentStep: 'result', isTestComplete: true })
  },

  retrySaveResult: () => {
    const state = get()
    if (state.isTestComplete && state.testResult) set({ resultPersisted: saveResultToLocalStorage(state.testResult) })
  },

  extendTest: () => {
    const state = get()
    if (state.currentStep !== 'review' || state.roundBudget >= MAX_TEST_ROUNDS) return
    set({ roundBudget: Math.min(MAX_TEST_ROUNDS, state.roundBudget + 8), testResult: null, currentStep: 'test', roundStartTime: Date.now() })
  },

  undoLastResponse: () => {
    const state = get()
    if (!['test', 'review'].includes(state.currentStep) || !state.selectedDevice || !state.responses.length) return
    const responses = state.responses.slice(0, -1), last = state.responses[state.responses.length - 1]
    const axisStates = makeAxisStates(state.selectedDevice)
    for (const response of responses) {
      axisStates[response.axis] = answerAxis(axisStates[response.axis], response.aGain!, response.bGain!, response.choice)
    }
    set({ responses, axisStates, currentRound: last.round, currentAxis: last.axis,
      comparisonOverride: last, comparisonFlipped: last.aGain! > last.bGain!,
      currentStep: 'test', testResult: null, isTestComplete: false, roundStartTime: Date.now(),
      lastPlayedSegmentStart: responses[responses.length - 1]?.segmentStart ?? null })
  },

  // 테스트 진행 데이터만 수동 초기화 (세그먼트·기기 선택은 유지)
  resetTestProgress: () => set({
    axisStates: makeAxisStates(get().selectedDevice),
    roundBudget: BAYESIAN_TOTAL_ROUNDS,
    reviewFlipped: false,
    comparisonOverride: null,
    currentRound: 1,
    responses: [],
    testResult: null,
    resultPersisted: null,
    isTestComplete: false,
    currentAxis: 'bass',
    roundStartTime: Date.now(),
    lastPlayedSegmentStart: null,
    comparisonFlipped: Math.random() < 0.5,
  }),

  resetTest: () => set({
    currentStep: 'device',
    selectedDevice: null,
    selectedAudioType: 'sample',
    selectedSegment: null,
    segments: [],
    manualMode: false,
    axisStates: makeAxisStates(),
    roundBudget: BAYESIAN_TOTAL_ROUNDS,
    reviewFlipped: false,
    comparisonOverride: null,
    currentRound: 1,
    responses: [],
    testResult: null,
    resultPersisted: null,
    isTestComplete: false,
    currentAxis: 'bass',
    roundStartTime: Date.now(),
    lastPlayedSegmentStart: null,
    comparisonFlipped: Math.random() < 0.5,
  }),
}))
