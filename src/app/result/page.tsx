'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTestStore, EQBand, BAYESIAN_TOTAL_ROUNDS } from '@/lib/audio-store'
import { useLanguage } from '@/lib/language-context'
import { Download, Share2, RotateCcw, Home, Loader2 } from 'lucide-react'

interface EQResult {
  axis: string
  preference: 'A' | 'B' | 'similar'
  confidence: number
  description: string
}

interface OptimalEQ {
  device: string
  bands: EQBand[]
}

const defaultEqBands: EQBand[] = [
  { frequency: 32, gain: 0, type: 'lowshelf' },
  { frequency: 64, gain: 0, type: 'peaking' },
  { frequency: 125, gain: 0, type: 'peaking' },
  { frequency: 250, gain: 0, type: 'peaking' },
  { frequency: 500, gain: 0, type: 'peaking' },
  { frequency: 1000, gain: 0, type: 'peaking' },
  { frequency: 2000, gain: 0, type: 'peaking' },
  { frequency: 4000, gain: 0, type: 'peaking' },
  { frequency: 8000, gain: 0, type: 'peaking' },
  { frequency: 16000, gain: 0, type: 'highshelf' }
]

function buildResults(
  device: { name: string; baseEQ: EQBand[] } | null,
  personalizationDelta: EQBand[] | undefined,
  axisDesc: Record<string, { B: string; A: string; similar: string }>
) {
  const THRESHOLD = 1.5
  const deltaByAxis: Record<string, number> = {
    bass:       personalizationDelta ? ((personalizationDelta[0]?.gain ?? 0) + (personalizationDelta[1]?.gain ?? 0)) / 2 : 0,
    warmth:     personalizationDelta ? ((personalizationDelta[2]?.gain ?? 0) + (personalizationDelta[3]?.gain ?? 0)) / 2 : 0,
    vocal:      personalizationDelta ? ((personalizationDelta[4]?.gain ?? 0) + (personalizationDelta[5]?.gain ?? 0)) / 2 : 0,
    brightness: personalizationDelta ? ((personalizationDelta[6]?.gain ?? 0) + (personalizationDelta[7]?.gain ?? 0) + (personalizationDelta[8]?.gain ?? 0) + (personalizationDelta[9]?.gain ?? 0)) / 4 : 0,
  }

  const results: EQResult[] = ['bass', 'warmth', 'vocal', 'brightness'].map(axis => {
    const gain = deltaByAxis[axis] ?? 0
    let preference: 'A' | 'B' | 'similar' = 'similar'
    if (gain > THRESHOLD) preference = 'B'
    else if (gain < -THRESHOLD) preference = 'A'
    const confidence = Math.min(100, Math.round(Math.abs(gain) / 10 * 70) + 30)
    return { axis, preference, confidence, description: axisDesc[axis]?.[preference] ?? '' }
  })

  const baseBands = device?.baseEQ ?? defaultEqBands
  const bands: EQBand[] = baseBands.map((band, index) => {
    const deltaGain = personalizationDelta ? personalizationDelta[index]?.gain || 0 : 0
    return { ...band, gain: Math.max(-10, Math.min(10, band.gain + deltaGain)) }
  })

  return { results, optimalEQ: { device: device?.name ?? 'Unknown Device', bands } as OptimalEQ }
}

function ResultPageContent() {
  const router = useRouter()
  const { t } = useLanguage()
  const r = t.result
  const [eqResults, setEqResults] = useState<EQResult[]>([])
  const [optimalEQ, setOptimalEQ] = useState<OptimalEQ | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const captureRef = useRef<HTMLDivElement>(null)
  const { selectedDevice, isTestComplete, resetTest, testResult } = useTestStore()

  useEffect(() => {
    // 1) Zustand 상태 정상: 저장 + 결과 렌더링
    if (isTestComplete && selectedDevice && testResult) {
      try {
        sessionStorage.setItem('eq_last_result', JSON.stringify({ device: selectedDevice, testResult }))
      } catch {}
      const { results, optimalEQ } = buildResults(selectedDevice, testResult.personalizationDelta, r.axis)
      setEqResults(results)
      setOptimalEQ(optimalEQ)
      return
    }

    // 2) Zustand 미완료 → sessionStorage 복구 시도
    try {
      const cached = sessionStorage.getItem('eq_last_result')
      if (cached) {
        const { device, testResult: cachedResult } = JSON.parse(cached)
        if (device && cachedResult) {
          const { results, optimalEQ } = buildResults(device, cachedResult.personalizationDelta, r.axis)
          setEqResults(results)
          setOptimalEQ(optimalEQ)
        }
      }
    } catch {}
  }, [isTestComplete, selectedDevice, testResult, r.axis])

  const getInsightMessage = (results: EQResult[]) => {
    const strong = results.filter(res => res.preference !== 'similar')
    if (strong.length === 0) return r.insightFlat
    return `${r.insightPrefix}${strong.map(res => res.description).join(', ')}${r.insightSuffix}`
  }

  const handleDownloadEQ = () => {
    if (!optimalEQ) return
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ device: optimalEQ.device, bands: optimalEQ.bands }, null, 2))
    const a = document.createElement('a')
    a.setAttribute('href', dataUri)
    a.setAttribute('download', `${optimalEQ.device}_eq_profile.json`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleShare = async () => {
    if (!captureRef.current || isCapturing) return
    setIsCapturing(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const isDark = document.documentElement.classList.contains('dark')
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: isDark ? '#161716' : '#f7faf9',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b!), 'image/png')
      )
      const filename = `${optimalEQ?.device ?? 'eq'}_result.png`
      // Web Share API with files (mobile)
      if (
        navigator.canShare &&
        navigator.canShare({ files: [new File([blob], filename, { type: 'image/png' })] })
      ) {
        await navigator.share({
          title: r.shareTitle,
          files: [new File([blob], filename, { type: 'image/png' })],
        })
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch {
      // share/download 실패 시 조용히 무시
    } finally {
      setIsCapturing(false)
    }
  }

  const handleRetest = () => {
    resetTest()
    window.location.href = '/test'
  }

  /* ─── No result state (Zustand 미완료 + sessionStorage 복구도 없음) ─── */
  if (!isTestComplete && !optimalEQ) return (
    <div className="page-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <button onClick={() => router.push('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-semibold text-foreground absolute left-1/2 -translate-x-1/2">{r.pageTitle}</h2>
          <div className="w-6" />
        </div>
      </header>
      <main className="container mx-auto px-4 max-w-lg py-20 flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-xl font-bold mb-2">{r.noResult}</h1>
        <p className="text-sm text-muted-foreground mb-6">{r.noResultDesc}</p>
        <Button onClick={() => window.location.href = '/test'} className="btn-primary">
          {r.goToTest}
        </Button>
      </main>
    </div>
  )

  return (
    <div className="page-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <button onClick={() => router.push('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
            <span className="sr-only">{t.common.home}</span>
          </button>
          <h2 className="text-sm font-semibold text-foreground absolute left-1/2 -translate-x-1/2">{r.finalTitle}</h2>
          <div className="w-6" />
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-lg py-6 fade-up flex-1 pb-20" ref={captureRef}>
        {/* Completion Header */}
        <div className="mb-8">
          <p className="label-xs mb-3">{r.complete}</p>
          <h1 className="text-xl font-bold text-foreground mb-1">
            {optimalEQ?.device ?? ''}{r.optimizedFor}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {getInsightMessage(eqResults)}
          </p>
          {/* 신뢰도 + 조기종료 배지 */}
          <div className="flex items-center gap-2 flex-wrap">

            {testResult?.completedRounds != null && (
              <Badge variant="secondary" className="text-xs">
                {testResult.completedRounds}/{BAYESIAN_TOTAL_ROUNDS} 라운드
              </Badge>
            )}
            {testResult?.earlyStop && (
              <Badge className="text-xs bg-emerald-500/20 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20">
                ⚡ 조기 완료
              </Badge>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Analysis */}
        <div className="mb-8">
          <p className="label-xs mb-4">{r.analysisTitle}</p>
          <div className="space-y-5">
            {eqResults.map((result) => (
              <div key={result.axis}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {t.test.axis[result.axis as keyof typeof t.test.axis]?.title ?? result.axis}
                  </span>
                  <Badge
                    variant={result.preference === 'similar' ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {result.preference === 'B' ? r.boosted : result.preference === 'A' ? r.reduced : r.balanced}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{result.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* EQ Graph */}
        {optimalEQ && (
          <div className="mb-8">
            <p className="label-xs mb-4">{r.eqTitle}</p>

            {/* Bar chart */}
            <div className="surface p-4 mb-4">
              <div className="w-full h-40 relative">
                {/* 0dB line */}
                <div className="absolute left-0 right-0 top-1/2 h-px bg-border z-10" />
                <span className="absolute right-0 top-1/2 -translate-y-4 text-[9px] text-muted-foreground z-10 select-none">0dB</span>
                <div className="flex h-full px-1 gap-1 pb-5">
                  {optimalEQ.bands.map((band) => {
                    const g = Math.max(-10, Math.min(10, band.gain))
                    const pct = Math.abs(g) / 10 * 50
                    const pos = g >= 0
                    return (
                      <div key={band.frequency} className="flex-1 relative flex flex-col h-full">
                        <div className="flex-1 relative">
                          {pos && (
                            <div
                              className="eq-bar-boost absolute bottom-0 left-0 right-0"
                              style={{ height: `${pct * 2}%` }}
                            />
                          )}
                        </div>
                        <div className="flex-1 relative">
                          {!pos && (
                            <div
                              className="eq-bar-cut absolute top-0 left-0 right-0"
                              style={{ height: `${pct * 2}%` }}
                            />
                          )}
                        </div>
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground leading-none">
                          {band.frequency >= 1000 ? `${band.frequency / 1000}k` : band.frequency}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Band values */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {optimalEQ.bands.map((band) => {
                const g = Math.round(band.gain)
                return (
                  <div key={band.frequency} className="text-center">
                    <div className="text-[10px] text-muted-foreground mb-0.5">
                      {band.frequency >= 1000 ? `${band.frequency / 1000}k` : band.frequency}Hz
                    </div>
                    <div className={`text-sm font-semibold tabular-nums ${g > 0 ? 'text-primary' : g < 0 ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {g > 0 ? '+' : ''}{g}<span className="text-xs font-normal">dB</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Button variant="outline" onClick={handleDownloadEQ} className="w-full text-sm border-border hover:border-primary/40">
                  <Download className="h-4 w-4 mr-2" />{r.download}
                </Button>
                <p className="text-xs text-muted-foreground text-center leading-relaxed">{r.downloadTip}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Button variant="outline" onClick={handleShare} disabled={isCapturing} className="w-full text-sm border-border hover:border-primary/40">
                  {isCapturing
                    ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    : <Share2 className="h-4 w-4 mr-2" />
                  }
                  {isCapturing ? '...' : r.share}
                </Button>
                <p className="text-xs text-muted-foreground text-center leading-relaxed">{r.shareTip}</p>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border mb-6" />

        {/* Retest */}
        <div className="text-center">
          <button
            onClick={handleRetest}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />{r.retest}
          </button>
          <p className="text-xs text-muted-foreground mt-2">{r.retestDesc}</p>
        </div>
      </main>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="page-shell items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  )
}
