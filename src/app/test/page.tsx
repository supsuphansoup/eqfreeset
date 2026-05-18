'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { useTestStore, useAudioStore, BAYESIAN_TOTAL_ROUNDS } from '@/lib/audio-store'
import { getAllDevices, findDeviceByName } from '@/lib/device-db'
import { useLanguage } from '@/lib/language-context'
import { Play, Pause, Search, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'

const GENRE_IDS = ['pop','hiphop','jazz','classical','edm','rnb','ballad','indie','jpop','rock'] as const
const GENRE_URL: Record<string, string> = {
  pop:'/samples/pop-test.mp3', hiphop:'/samples/hiphop-test.mp3', jazz:'/samples/jazz-test.mp3',
  classical:'/samples/classical-test.mp3', edm:'/samples/edm-test.mp3', rnb:'/samples/rnb-test.mp3',
  ballad:'/samples/ballad-test.mp3', indie:'/samples/indie-test.mp3', jpop:'/samples/jpop-test.mp3',
  rock:'/samples/rock-test.mp3',
}

export default function TestPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDevices, setFilteredDevices] = useState(getAllDevices())
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisReady, setAnalysisReady] = useState(false)

  // 수동 구간 설정
  const [manualStart, setManualStart] = useState(0)
  const [manualDuration] = useState(10)

  const {
    currentStep, selectedDevice, selectedAudioType, currentRound,
    currentAxis, manualMode,
    setCurrentStep, setSelectedDevice, setSelectedAudioType,
    setSelectedSegment, setSegments, setManualMode,
    processResponse, resetTestProgress, getCurrentABGains, getCurrentSegment,
  } = useTestStore()

  const {
    isPlaying, loadAudio, loadAudioFile, pause,
    playWithAxisGain, analyzeSegments, cleanup, isLoading, error, currentBuffer,
  } = useAudioStore()

  const [heardA, setHeardA] = useState(false)
  const [heardB, setHeardB] = useState(false)
  const [playingOption, setPlayingOption] = useState<'A' | 'B' | null>(null)
  
  const isProcessingRef = useRef(false)

  useEffect(() => { return () => { cleanup() } }, [cleanup])
  useEffect(() => { if (currentStep === 'result') router.push('/result') }, [currentStep, router])
  useEffect(() => {
    const n = searchTerm.toLowerCase()
    setFilteredDevices(n ? getAllDevices().filter(d =>
      d.name.toLowerCase().includes(n) || d.brand.toLowerCase().includes(n) ||
      d.alias.some((a: string) => a.toLowerCase().includes(n))
    ) : getAllDevices())
  }, [searchTerm])
  useEffect(() => { 
    setHeardA(false)
    setHeardB(false)
    setPlayingOption(null)
    isProcessingRef.current = false
  }, [currentRound])
  useEffect(() => { if (!isPlaying) setPlayingOption(null) }, [isPlaying])

  const groupedDevices = useMemo(() => {
    const groups = new Map<string, typeof filteredDevices>()
    filteredDevices.forEach(d => {
      if (!groups.has(d.brand)) groups.set(d.brand, [])
      groups.get(d.brand)?.push(d)
    })
    return Array.from(groups.entries())
  }, [filteredDevices])

  const handleDeviceSelect = (name: string) => {
    const device = findDeviceByName(name)
    if (device) { setSelectedDevice(device); setCurrentStep('audio') }
  }
  const handleAudioSelect = (type: 'sample' | 'upload') => {
    setSelectedAudioType(type); setCurrentStep('segment')
  }

  // 장르 선택 → 로드 + 4축 동시 분석
  const handleGenreSelect = async (genreId: string) => {
    setAnalysisReady(false); setIsAnalyzing(true)
    const success = await loadAudio(GENRE_URL[genreId])
    if (success) {
      try {
        const segs = await analyzeSegments()
        setSegments(segs)
        setManualMode(false)
        setAnalysisReady(true)
        resetTestProgress()
        setCurrentStep('test')
      } finally { setIsAnalyzing(false) }
    } else { setIsAnalyzing(false) }
  }

  // 파일 업로드 → 로드 + 4축 동시 분석
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploadedFile(file)
    setAnalysisReady(false)
    const success = await loadAudioFile(file)
    if (success) {
      setIsAnalyzing(true)
      try {
        const segs = await analyzeSegments()
        setSegments(segs)
        setManualMode(false)
        setAnalysisReady(true)
      } finally { setIsAnalyzing(false) }
    }
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

  // A/B 재생: getCurrentSegment()로 현재 라운드 최적 구간 자동 선택
  const playOption = async (option: 'A' | 'B') => {
    const seg = manualMode
      ? { start: manualStart, duration: manualDuration }
      : getCurrentSegment()
    if (!seg) return
    const { aGain, bGain } = getCurrentABGains()
    const gain = option === 'A' ? aGain : bGain
    if (isPlaying) { pause(); await new Promise(r => setTimeout(r, 100)) }
    setPlayingOption(option)
    try {
      await playWithAxisGain(currentAxis, gain, seg.start, seg.duration)
      // 성공적으로 시작된 경우에만 heard 표시
      if (option === 'A') setHeardA(true); else setHeardB(true)
    } catch {
      setPlayingOption(null)
    }
  }

  const handleChoice = (choice: 'A' | 'B' | 'similar') => {
    if (isProcessingRef.current) return
    isProcessingRef.current = true
    if (isPlaying) pause()
    processResponse(choice)
  }

  /* ─── Shared Header ─── */
  const renderHeader = (title: string, onBack?: () => void) => (
    <header className="app-header mb-0">
      <div className="app-header-inner">
        <button
          onClick={onBack || (() => router.back())}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="sr-only">{t.common.back}</span>
        </button>
        <h2 className="text-sm font-semibold text-foreground absolute left-1/2 -translate-x-1/2">{title}</h2>
        <div className="w-10" />
      </div>
    </header>
  )

  /* ─── STEP: device ─── */
  if (currentStep === 'device') return (
    <div className="page-shell">
      {renderHeader(t.device.pageTitle, () => router.push('/'))}
      <main className="container mx-auto px-4 max-w-lg py-6 fade-up flex-1">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1.5">{t.device.title}</h1>
          <p className="text-sm text-muted-foreground">{t.device.desc}</p>
        </div>
        {error && <Alert className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={t.device.searchPlaceholder}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 bg-card border-border text-sm"
          />
        </div>
        {filteredDevices.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-10">{t.device.noResult}</p>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-1">
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
                        onClick={() => handleDeviceSelect(device.name)}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors group"
                      >
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{device.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">AutoEQ v{device.version}</p>
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </main>
    </div>
  )

  /* ─── STEP: audio ─── */
  if (currentStep === 'audio') return (
    <div className="page-shell">
      {renderHeader(t.audio.pageTitle, () => setCurrentStep('device'))}
      <main className="container mx-auto px-4 max-w-lg py-6 fade-up flex-1">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1.5">{t.audio.title}</h1>
          <p className="text-sm text-muted-foreground">{t.audio.desc}</p>
        </div>
        {error && <Alert className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
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
      <main className="container mx-auto px-4 max-w-lg py-6 fade-up flex-1">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1.5">{t.genre.title}</h1>
          <p className="text-sm text-muted-foreground">{t.genre.desc}</p>
        </div>
        {error && <Alert className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
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
      <main className="container mx-auto px-4 max-w-lg py-6 fade-up flex-1">
        <h1 className="text-xl font-bold mb-6">{t.upload.title}</h1>
        {error && <Alert className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
        <div className="surface p-6 mb-4 text-center">
          <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" id="audio-upload" />
          <label htmlFor="audio-upload">
            <Button variant="outline" className="cursor-pointer text-sm" asChild>
              <span>{t.upload.selectFile}</span>
            </Button>
          </label>
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
                  onChange={e => setManualStart(Number(e.target.value))}
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
  const progressPct = Math.min(100, Math.round(((currentRound - 1) / BAYESIAN_TOTAL_ROUNDS) * 100))
  const canChoose = heardA && heardB
  const axisInfo = t.test.axis[currentAxis as keyof typeof t.test.axis]

  return (
    <div className="page-shell">
      {renderHeader(`${t.test.headerTitle} ${currentRound}/${BAYESIAN_TOTAL_ROUNDS}`, handleTestBack)}
      <main className="container mx-auto px-4 max-w-lg py-6 fade-up flex-1 flex flex-col">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{t.test.bayesianLabel}</span>
            <span className="tabular-nums">{progressPct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Axis Info */}
        <div className="mb-8">
          <p className="label-xs mb-2">{t.test.bayesianLabel}</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {axisInfo?.title ?? currentAxis}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{axisInfo?.sub}</p>
          <p className="text-xs text-muted-foreground/60 mt-2">{t.test.listenBoth}</p>
        </div>

        {error && <Alert className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}

        {/* 수동 구간 슬라이더 (테스트 중 수동 모드일 때) */}
        {manualMode && (
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
              onChange={e => { setManualStart(Number(e.target.value)); setHeardA(false); setHeardB(false) }}
              className="w-full accent-primary"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {t.test.manualAdjustHint}{' '}
              <span className="text-destructive">{t.test.manualResetWarning}</span>
            </p>
          </div>
        )}

        {/* 자동 구간 인디케이터 */}
        {!manualMode && (
          <div className="mb-6 info-box flex items-center gap-2 text-primary text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{t.test.autoSegment}</span>
          </div>
        )}

        {/* A / B Play Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4 flex-1 max-h-52">
          {(['A', 'B'] as const).map(opt => {
            const isActive = playingOption === opt
            const isDone = opt === 'A' ? heardA : heardB
            return (
              <button
                key={opt}
                onClick={() => !isLoading && void playOption(opt)}
                className={`choice-card p-4 flex flex-col items-center gap-3 h-full min-h-[120px] ${
                  isActive ? 'choice-card-active border-primary' : isDone ? 'choice-card-done' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {isActive
                    ? <Pause className="w-4 h-4" />
                    : isDone
                      ? <CheckCircle className="w-4 h-4 text-primary" />
                      : <Play className="w-4 h-4" />
                  }
                </div>
                <span className="text-xl font-bold text-foreground">{opt}</span>
                <span className="text-xs text-muted-foreground">
                  {isActive ? t.test.playing : isDone ? t.test.listened : t.test.tapToPlay}
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
              {t.test.chooseA}
            </Button>
            <Button
              variant="outline"
              className="h-14 text-base font-bold border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
              disabled={!canChoose || isLoading}
              onClick={() => handleChoice('B')}
            >
              {t.test.chooseB}
            </Button>
          </div>
          <Button
            variant="ghost"
            className="w-full h-11 text-sm text-muted-foreground hover:text-foreground"
            disabled={!canChoose || isLoading}
            onClick={() => handleChoice('similar')}
          >
            {t.test.similar}
          </Button>
        </div>

        {/* Help */}
        <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
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
        </Dialog>
      </main>
    </div>
  )
}
