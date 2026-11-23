'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { useTestStore, useAudioStore, MAX_TEST_ROUNDS } from '@/lib/audio-store'
import { getAllDevices, findDeviceByName, findDeviceById } from '@/lib/device-db'
import { useLanguage } from '@/lib/language-context'
import Link from '@/components/locale-link'
import { experienceCopy } from '@/lib/experience-copy'
import { Play, Pause, Search, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'

const GENRE_IDS = ['pop','hiphop','jazz','classical','edm','rnb','ballad','indie','jpop','rock'] as const
const GENRE_URL: Record<string, string> = {
  pop:'/samples/pop-test.mp3', hiphop:'/samples/hiphop-test.mp3', jazz:'/samples/jazz-test.mp3',
  classical:'/samples/classical-test.mp3', edm:'/samples/edm-test.mp3', rnb:'/samples/rnb-test.mp3',
  ballad:'/samples/ballad-test.mp3', indie:'/samples/indie-test.mp3', jpop:'/samples/jpop-test.mp3',
  rock:'/samples/rock-test.mp3',
}

export default function TestContent() {
  const router = useRouter()
  const { t, lang, localePath } = useLanguage()
  const c = experienceCopy[lang]
  const [searchTerm, setSearchTerm] = useState('')
  const filteredDevices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return query ? getAllDevices().filter(device => [device.name, device.brand, ...device.alias].some(value => value.toLowerCase().includes(query))) : getAllDevices()
  }, [searchTerm])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisReady, setAnalysisReady] = useState(false)

  // 수동 구간 설정
  const [manualStart, setManualStart] = useState(0)

  const {
    currentStep, selectedDevice, selectedAudioType, currentRound,
    currentAxis, manualMode, testResult, roundBudget, responses,
    setCurrentStep, setSelectedDevice, setSelectedAudioType,
    setSelectedSegment, setSegments, setManualMode,
    processResponse, resetTestProgress, getCurrentSegment, confirmResult, extendTest, undoLastResponse,
  } = useTestStore()

  const {
    isPlaying, loadAudio, loadAudioFile, pause,
    playComparison, analyzeSegments, cleanup, isLoading, error, currentBuffer,
  } = useAudioStore()
  const manualDuration = Math.min(10, currentBuffer?.duration ?? 10)

  const [heardA, setHeardA] = useState(false)
  const [heardB, setHeardB] = useState(false)
  const [playingOption, setPlayingOption] = useState<'A' | 'B' | null>(null)
  
  const isProcessingRef = useRef(false)
  const audioTaskRef = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const cancelAudioTask = useCallback(() => { audioTaskRef.current++; cleanup() }, [cleanup])
  useEffect(() => cancelAudioTask, [cancelAudioTask])
  useEffect(() => {
    if (currentStep === 'result') {
      if (testResult?.id) {
        router.push(`/result?id=${testResult.id}`)
      } else {
        router.push('/result')
      }
    }
  }, [currentStep, testResult, router])
  useEffect(() => { 
    // Reset local listening evidence when the external test store advances.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeardA(false)
    setHeardB(false)
    setPlayingOption(null)
    isProcessingRef.current = false
  }, [currentRound, currentStep])
  useEffect(() => {
    // Audio playback ends outside React, via AudioBufferSourceNode.onended.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isPlaying) setPlayingOption(null)
  }, [isPlaying])
  useEffect(() => {
    if (!isPlaying || !playingOption) return
    // A tap alone is not evidence of listening. Cancel when stopped or switched.
    const timer = setTimeout(() => {
      if (playingOption === 'A') setHeardA(true)
      else setHeardB(true)
    }, Math.min(1000, (currentBuffer?.duration ?? 2) * 500))
    return () => clearTimeout(timer)
  }, [isPlaying, playingOption, currentRound, currentBuffer])
  useEffect(() => {
    pause()
    if (currentStep === 'audio' || currentStep === 'device') {
      cancelAudioTask()
      // Cancel the external audio task when leaving its step, including local UI.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnalyzing(false)
      setAnalysisReady(false)
      setUploadedFile(null)
    }
    if (currentStep === 'review') window.scrollTo({ top: 0, behavior: 'instant' })
  }, [currentStep, pause, cancelAudioTask])

  const groupedDevices = useMemo(() => {
    const groups = new Map<string, typeof filteredDevices>()
    filteredDevices.forEach(d => {
      if (!groups.has(d.brand)) groups.set(d.brand, [])
      groups.get(d.brand)?.push(d)
    })
    return Array.from(groups.entries())
  }, [filteredDevices])

  const handleDeviceSelect = (idOrName: string) => {
    const device = findDeviceById(idOrName) || findDeviceByName(idOrName)
    if (device) { setSelectedDevice(device); setCurrentStep('audio') }
  }
  const handleAudioSelect = (type: 'sample' | 'upload') => {
    setSelectedAudioType(type); setCurrentStep('segment')
  }

  // 장르 선택 → 로드 + 4축 동시 분석
  const handleGenreSelect = async (genreId: string) => {
    const task = ++audioTaskRef.current
    setAnalysisReady(false); setIsAnalyzing(true)
    try {
      const success = await loadAudio(GENRE_URL[genreId])
      if (!success || task !== audioTaskRef.current) return
      const buffer = useAudioStore.getState().currentBuffer
      setManualStart(0)
      const segs = await analyzeSegments()
      if (task !== audioTaskRef.current || useAudioStore.getState().currentBuffer !== buffer) return
      setSegments(segs)
      setManualMode(false)
      setAnalysisReady(true)
      resetTestProgress()
      setCurrentStep('test')
    } finally { if (task === audioTaskRef.current) setIsAnalyzing(false) }
  }

  // 파일 업로드 → 로드 + 4축 동시 분석
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // 동일 파일 재선택 가능하도록 input value 초기화
    e.target.value = ''

    // 50MB 파일 크기 검증
    if (file.size > 50 * 1024 * 1024) {
      useAudioStore.setState({ error: t.upload.fileTooLarge })
      return
    }

    // 파일 확장자 및 MIME 타입 검증
    const validExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.aac', '.ogg', '.webm']
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    const hasValidMime = file.type.startsWith('audio/') || file.type === ''
    if (!hasValidExt && !hasValidMime) {
      useAudioStore.setState({ error: t.upload.invalidFormat })
      return
    }

    setUploadedFile(file)
    setAnalysisReady(false)
    setIsAnalyzing(true)
    const task = ++audioTaskRef.current
    try {
      const success = await loadAudioFile(file)
      if (!success || task !== audioTaskRef.current) return
      const buffer = useAudioStore.getState().currentBuffer
      setManualStart(0)
      const segs = await analyzeSegments()
      if (task !== audioTaskRef.current || useAudioStore.getState().currentBuffer !== buffer) return
      setSegments(segs)
      setManualMode(false)
      setAnalysisReady(true)
    } finally { if (task === audioTaskRef.current) setIsAnalyzing(false) }
  }

  const handleConfirmAuto = () => {
    setManualMode(false); resetTestProgress(); setCurrentStep('test')
  }
  const handleConfirmManual = () => {
    setManualMode(true)
    setSelectedSegment({ start: manualStart, duration: manualDuration })
    resetTestProgress(); setCurrentStep('test')
  }

  const formatTime = (sec: number) =>
    `${Math.floor(sec/60)}:${String(Math.floor(sec%60)).padStart(2,'0')}`

  const audioError = error === 'comparison-silent' ? c.silentAudio : error === 'comparison-unavailable' ? c.comparisonError : error

  // A/B 재생: getCurrentSegment()로 현재 라운드 최적 구간 자동 선택
  const playOption = async (option: 'A' | 'B') => {
    // 이미 재생 중인 동일한 옵션을 클릭한 경우 일시정지
    if (playingOption === option && isPlaying) {
      pause()
      setPlayingOption(null)
      return
    }

    const seg = getCurrentSegment()
    if (!seg) return
    if (isPlaying) { pause(); await new Promise(r => setTimeout(r, 100)) }
    setPlayingOption(option)
    try {
      await playComparison(option, seg.start, seg.duration)
      if (!useAudioStore.getState().isPlaying || useAudioStore.getState().error) setPlayingOption(null)
    } catch {
      setPlayingOption(null)
    }
  }

  const handleChoice = (choice: 'A' | 'B' | 'similar' | 'unsure') => {
    if (isProcessingRef.current || !heardA || !heardB) return
    isProcessingRef.current = true
    if (isPlaying) pause()
    if (currentStep === 'review') confirmResult(choice === 'similar' ? 'unsure' : choice)
    else processResponse(choice)
  }

  /* ─── Shared Header ─── */
  const renderHeader = (title: string, onBack?: () => void) => (
    <>
    <header className="app-header mb-0">
      <div className="app-header-inner">
        <button
          onClick={onBack || (() => router.back())}
          className="flex items-center justify-center h-11 w-11 -ml-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="sr-only">{t.common.back}</span>
        </button>
        <h2 className="text-sm font-semibold text-foreground absolute left-1/2 -translate-x-1/2">{title}</h2>
        <div className="w-10" />
      </div>
    </header>
    <ol className="test-steps" aria-label={c.progress}>
      {c.stages.map((label, i) => {
        const stepIndex = ['device', 'audio', 'segment', 'test'].indexOf(currentStep === 'review' ? 'test' : currentStep)
        return <li key={label} aria-current={i === stepIndex ? 'step' : undefined}><span className="test-step-marker">{i < stepIndex ? <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}</span><span>{currentStep === 'review' && i === 3 ? c.reviewStage : label}</span></li>
      })}
    </ol>
    {selectedDevice && currentStep !== 'device' && <p className="test-content !py-3 text-xs text-muted-foreground">{c.selected}<span className="text-foreground font-medium ml-2">{selectedDevice.name}</span></p>}
    </>
  )

  /* ─── STEP: device ─── */
  if (currentStep === 'device') return (
    <div className="page-shell">
      {renderHeader(t.device.pageTitle, () => router.push(localePath('/')))}
      <main className="test-content fade-up flex-1">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1.5">{t.device.title}</h1>
          <p className="text-sm text-muted-foreground">{t.device.desc}</p>
        </div>
        {error && <Alert className="mb-4"><AlertDescription>{audioError}</AlertDescription></Alert>}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            aria-label={t.device.searchPlaceholder}
            placeholder={t.device.searchPlaceholder}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-card border-border text-base"
          />
        </div>
        <p className="text-xs text-muted-foreground mb-4" aria-live="polite">{filteredDevices.length}{c.deviceCount}</p>
        {filteredDevices.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-10">{t.device.noResult}</p>
        ) : (
          <Accordion key={searchTerm ? 'search' : 'browse'} type="multiple" defaultValue={searchTerm ? groupedDevices.map(([brand]) => brand) : []} className="w-full space-y-2">
            {groupedDevices.map(([brand, devices]) => (
              <AccordionItem
                key={brand} value={brand}
                className="border border-border rounded-xl px-4 bg-card overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-3.5 text-sm font-semibold text-foreground">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span>{brand}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{devices.length}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <div className="space-y-1 pt-1">
                    {devices.map(device => (
                      <button
                        key={device.id}
                        onClick={() => handleDeviceSelect(device.id)}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors group"
                      >
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{device.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{device.brand}</p>
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        <div className="info-box mt-6 flex flex-wrap items-center justify-between gap-2"><span>{c.noDevice}</span><Link href="/contact" className="text-primary py-2 font-medium">{c.requestDevice}</Link></div>
      </main>
    </div>
  )

  /* ─── STEP: audio ─── */
  if (currentStep === 'audio') return (
    <div className="page-shell">
      {renderHeader(t.audio.pageTitle, () => setCurrentStep('device'))}
      <main className="test-content fade-up flex-1">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1.5">{t.audio.title}</h1>
          <p className="text-sm text-muted-foreground">{t.audio.desc}</p>
        </div>
        {error && <Alert className="mb-4"><AlertDescription>{audioError}</AlertDescription></Alert>}
        <div className="space-y-2">
          <button onClick={() => handleAudioSelect('sample')} className="surface-hover w-full px-5 py-4 flex items-center justify-between text-left">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-0.5">{t.audio.sampleTitle}</h3>
              <p className="text-xs text-muted-foreground">{t.audio.sampleDesc}</p>
            </div>
            <span className="text-muted-foreground text-sm ml-4">→</span>
          </button>
          <button onClick={() => handleAudioSelect('upload')} className="surface-hover w-full px-5 py-4 flex items-center justify-between text-left">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-0.5">{t.audio.uploadTitle}</h3>
              <p className="text-xs text-muted-foreground">{t.audio.uploadDesc}</p>
            </div>
            <span className="text-muted-foreground text-sm ml-4">→</span>
          </button>
        </div>
        <div className="info-box mt-6">
          <span className="font-semibold text-foreground">TIP</span>{' '}{t.audio.tip}
        </div>
      </main>
    </div>
  )

  /* ─── STEP: segment (sample) ─── */
  if (currentStep === 'segment' && selectedAudioType === 'sample') return (
    <div className="page-shell">
      {renderHeader(t.genre.pageTitle, () => setCurrentStep('audio'))}
      <main className="test-content fade-up flex-1">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1.5">{t.genre.title}</h1>
          <p className="text-sm text-muted-foreground">{t.genre.desc}</p>
        </div>
        {error && <Alert className="mb-4"><AlertDescription>{audioError}</AlertDescription></Alert>}
        {isLoading || isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{isLoading ? t.genre.downloading : t.genre.analyzing}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {GENRE_IDS.map(id => {
              const g = t.genre.genres[id as keyof typeof t.genre.genres]
              return (
                <button
                  key={id}
                  onClick={() => handleGenreSelect(id)}
                  className="surface-hover px-4 py-3.5 flex items-center justify-between text-left"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">{g.name}</p>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">{g.desc}</p>
                  </div>
                  <span className="text-muted-foreground text-sm ml-3">→</span>
                </button>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )

  /* ─── STEP: segment (upload) ─── */
  if (currentStep === 'segment' && selectedAudioType === 'upload') return (
    <div className="page-shell">
      {renderHeader(t.upload.pageTitle, () => setCurrentStep('audio'))}
      <main className="test-content fade-up flex-1">
        <h1 className="text-xl font-bold mb-6">{t.upload.title}</h1>
        {error && <Alert className="mb-4"><AlertDescription>{audioError}</AlertDescription></Alert>}
        <div className="surface p-6 mb-4 text-center">
          <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" id="audio-upload" />
          <Button variant="outline" className="h-11 text-sm" disabled={isLoading || isAnalyzing} onClick={() => fileInputRef.current?.click()}>{t.upload.selectFile}</Button>
          {uploadedFile && <p className="mt-3 text-xs text-muted-foreground">{uploadedFile.name}</p>}
          {(isLoading || isAnalyzing) && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">{isLoading ? t.upload.loading : t.upload.analyzing}</p>
            </div>
          )}
        </div>

        {analysisReady && !isAnalyzing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1 mb-3">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">{t.upload.analysisComplete}</span>
            </div>
            {/* 자동 모드 */}
            <button
              onClick={() => setManualMode(false)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${!manualMode
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30 bg-card'
              }`}
            >
              <p className="text-sm font-semibold mb-0.5">{t.upload.autoTitle}</p>
              <p className="text-xs text-muted-foreground">{t.upload.autoDesc}</p>
            </button>
            {/* 수동 모드 */}
            <button
              onClick={() => setManualMode(true)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${manualMode
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30 bg-card'
              }`}
            >
              <p className="text-sm font-semibold mb-0.5">{t.upload.manualTitle}</p>
              <p className="text-xs text-muted-foreground">{t.upload.manualDesc}</p>
            </button>
            {/* 수동 구간 슬라이더 */}
            {manualMode && (
              <div className="surface p-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold text-foreground">{t.test.manualSegmentLabel}</label>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {formatTime(manualStart)} – {formatTime(manualStart + manualDuration)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, (currentBuffer?.duration ?? 60) - manualDuration)}
                  step={1}
                  value={manualStart}
                  onChange={e => {
                    if (isPlaying) pause()
                    setPlayingOption(null)
                    setManualStart(Number(e.target.value))
                  }}
                  className="w-full accent-primary"
                />
              </div>
            )}
            <Button
              className="w-full btn-primary h-12 mt-2 text-sm"
              onClick={manualMode ? handleConfirmManual : handleConfirmAuto}
            >
              {t.upload.startTest}
            </Button>
          </div>
        )}
        {!uploadedFile && (
          <div className="text-xs text-muted-foreground space-y-1 mt-4 px-1">
            <p>{t.upload.formatHint1}</p>
            <p>{t.upload.formatHint2}</p>
            <p>{t.upload.formatHint3}</p>
          </div>
        )}
      </main>
    </div>
  )

  /* ─── STEP: test ─── */
  const handleTestBack = () => {
    if (currentRound > 1 && !window.confirm(t.test.confirmReset)) return
    setSegments([])
    resetTestProgress(); setCurrentStep('segment')
  }
  const reviewing = currentStep === 'review'
  const progressPct = Math.min(100, Math.round(((currentRound - 1) / roundBudget) * 100))
  const canChoose = heardA && heardB
  const axisInfo = t.test.axis[currentAxis as keyof typeof t.test.axis]
  const handleUndo = () => {
    pause()
    undoLastResponse()
    const segment = useTestStore.getState().getCurrentSegment()
    if (segment && manualMode) setManualStart(segment.start)
  }

  return (
    <div className="page-shell">
      {renderHeader(reviewing ? c.reviewStage : `${t.test.headerTitle} ${currentRound}/${roundBudget}`, handleTestBack)}
      <main className="test-content fade-up flex-1 flex flex-col">
        {/* Progress */}
        {!reviewing && <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{t.test.bayesianLabel}</span>
            <span className="tabular-nums">{progressPct}%</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t.test.bayesianLabel}
          >
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>}

        {/* Axis Info */}
        <div className="mb-8">
          <p className="label-xs mb-2">{reviewing ? c.reviewStage : t.test.nowTesting}</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {reviewing ? c.reviewTitle : axisInfo?.title ?? currentAxis}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{reviewing ? c.reviewDesc : axisInfo?.sub}</p>
          <p className="text-xs text-muted-foreground/60 mt-2">{t.test.listenBoth}</p>
        </div>

        {error && <Alert className="mb-4"><AlertDescription>{audioError}</AlertDescription></Alert>}

        {/* 수동 구간 슬라이더 (테스트 중 수동 모드일 때) */}
        {manualMode && !reviewing && (
          <div className="surface mb-6 p-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-semibold text-foreground">{t.test.manualSegmentLabel}</label>
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {formatTime(manualStart)} – {formatTime(manualStart + manualDuration)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(0, (currentBuffer?.duration ?? 60) - manualDuration)}
              step={1}
              value={manualStart}
              onChange={e => {
                if (isPlaying) pause()
                setPlayingOption(null)
                setManualStart(Number(e.target.value))
                setSelectedSegment({ start: Number(e.target.value), duration: manualDuration })
                setHeardA(false)
                setHeardB(false)
              }}
              className="w-full accent-primary"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {t.test.manualAdjustHint}{' '}
              <span className="text-destructive">{t.test.manualResetWarning}</span>
            </p>
          </div>
        )}

        {/* 자동 구간 인디케이터 */}
        {!manualMode && !reviewing && (
          <div className="mb-6 info-box flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{t.test.autoSegment}</span>
            </div>
            {(() => {
              const seg = getCurrentSegment()
              if (!seg) return null
              return (
                <span className="font-mono text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded-md flex-shrink-0 ml-2">
                  {formatTime(seg.start)} – {formatTime(seg.start + seg.duration)}
                </span>
              )
            })()}
          </div>
        )}

        {!reviewing && <p className="text-xs text-muted-foreground leading-relaxed mb-4">{c.listening}</p>}
        {/* A / B Play Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4 min-h-[180px]">
          {(['A', 'B'] as const).map(opt => {
            const isActive = playingOption === opt
            const isDone = opt === 'A' ? heardA : heardB
            const statusText = isActive ? t.test.playing : isDone ? t.test.listened : t.test.tapToPlay
            return (
              <button
                key={opt}
                onClick={() => !isLoading && void playOption(opt)}
                disabled={isLoading}
                aria-label={`${opt} ${statusText}`}
                aria-pressed={isActive}
                className={`choice-card p-4 flex flex-col items-center gap-3 h-full min-h-[120px] ${
                  isActive ? 'choice-card-active border-primary' : isDone ? 'choice-card-done' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {isLoading && isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : isActive
                    ? <Pause className="w-4 h-4" />
                    : isDone
                      ? <CheckCircle className="w-4 h-4 text-primary" />
                      : <Play className="w-4 h-4" />
                  }
                </div>
                <span className="text-xl font-bold text-foreground">{opt}</span>
                <span className="text-xs text-muted-foreground">
                  {isLoading && isActive ? c.preparing : isActive ? t.test.playing : isDone ? t.test.listened : t.test.tapToPlay}
                </span>
              </button>
            )
          })}
        </div>

        {!canChoose && (
          <p className="text-center text-xs text-muted-foreground mb-4">{t.test.needBoth}</p>
        )}

        {/* Choice Buttons */}
        <div className="space-y-2 mb-6">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-14 text-base font-bold border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
              disabled={!canChoose || isLoading}
              onClick={() => handleChoice('A')}
            >
              {reviewing ? c.saveA : t.test.chooseA}
            </Button>
            <Button
              variant="outline"
              className="h-14 text-base font-bold border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
              disabled={!canChoose || isLoading}
              onClick={() => handleChoice('B')}
            >
              {reviewing ? c.saveB : t.test.chooseB}
            </Button>
          </div>
          {!reviewing && <Button
            variant="ghost"
            className="w-full h-11 text-sm text-muted-foreground hover:text-foreground"
            disabled={!canChoose || isLoading}
            onClick={() => handleChoice('similar')}
          >
            {t.test.similar}
          </Button>}
          <Button
            variant="ghost"
            className="w-full h-11 text-sm text-muted-foreground hover:text-foreground"
            disabled={!canChoose || isLoading}
            onClick={() => handleChoice('unsure')}
          >
            {reviewing ? c.saveUnsure : c.unsure}
          </Button>
          {reviewing && roundBudget < MAX_TEST_ROUNDS && <Button variant="outline" className="w-full h-12" disabled={isLoading} onClick={() => { pause(); extendTest() }}>{c.extend}</Button>}
          {responses.length > 0 && <Button variant="ghost" className="w-full h-11 text-muted-foreground" disabled={isLoading} onClick={handleUndo}>{c.undo}</Button>}
        </div>

        {/* Help */}
        {!reviewing && <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
          <DialogTrigger asChild>
            <button className="w-full text-left px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">{t.test.helpTitle}</p>
                <p className="text-xs text-muted-foreground">{t.test.helpSub}</p>
              </div>
              <span className="text-xs text-muted-foreground">?</span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{axisInfo?.title} {t.test.guideTitle}</DialogTitle>
            </DialogHeader>
            <p className="text-sm leading-relaxed text-muted-foreground">{axisInfo?.help}</p>
          </DialogContent>
        </Dialog>}
      </main>
    </div>
  )
}
