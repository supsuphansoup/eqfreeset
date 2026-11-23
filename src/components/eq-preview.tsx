'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AudioLines, SlidersHorizontal } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { experienceCopy } from '@/lib/experience-copy'

const PRESETS = [
  [1, 1.5, 1, 0, -1, 0, 1.5, 2, 1.5, 0.5],
  [5, 4.5, 3, 1, 0, -0.5, 0, 1, 1.5, 1],
  [-1, -0.5, -1, 0, 2, 3.5, 3, 1.5, 0, -1],
]
const FREQUENCIES = ['32', '64', '125', '250', '500', '1k', '2k', '4k', '8k', '16k']
const MORPH_MS = 420

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/** 프리셋을 바꾸면 곡선이 이전 값에서 새 값으로 부드럽게 변한다 (동작 줄이기 설정이면 즉시 바뀜) */
function useMorphedValues(target: number[]) {
  const [values, setValues] = useState(target)
  const fromRef = useRef(target)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    if (from === target) return
    // 동작 줄이기 설정이면 첫 프레임에 바로 새 값으로 바뀜
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : MORPH_MS
    const start = performance.now()
    const step = (now: number) => {
      const t = duration ? easeOutCubic(Math.min((now - start) / duration, 1)) : 1
      const next = target.map((v, i) => from[i] + (v - from[i]) * t)
      fromRef.current = next
      setValues(next)
      if (t < 1) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
    return () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current) }
  }, [target])

  return values
}

export function EQPreview() {
  const { lang } = useLanguage()
  const c = experienceCopy[lang]
  const [preset, setPreset] = useState(0)
  const values = useMorphedValues(PRESETS[preset])
  const points = values.map((gain, i) => `${36 + i * 40},${114 - gain * 12}`).join(' ')

  // 선택된 프리셋 버튼 아래로 미끄러지는 표시
  const groupRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  useLayoutEffect(() => {
    const measure = () => {
      const button = groupRef.current?.querySelectorAll('button')[preset]
      if (button) setIndicator({ x: button.offsetLeft, y: button.offsetTop, width: button.offsetWidth, height: button.offsetHeight })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [preset, lang])

  return (
    <section className="eq-preview" aria-label={c.preview}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="preview-icon"><AudioLines className="h-5 w-5" aria-hidden="true" /></span>
          <div><p className="font-semibold text-sm">{c.preview}</p><p className="text-xs text-muted-foreground mt-1">10-band EQ</p></div>
        </div>
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <svg viewBox="0 0 432 232" className="w-full my-5" role="img" aria-label={c.curve}>
        {[42, 114, 186].map(y => <line key={y} x1="28" x2="412" y1={y} y2={y} stroke="currentColor" className="text-border" strokeDasharray={y === 114 ? '4 5' : undefined} />)}
        <text x="4" y="46" className="preview-axis">+6</text><text x="8" y="118" className="preview-axis">0</text><text x="4" y="190" className="preview-axis">−6</text>
        {values.map((gain, i) => <line key={i} x1={36 + i * 40} x2={36 + i * 40} y1="114" y2={114 - gain * 12} className="text-primary" stroke="currentColor" strokeWidth="16" opacity=".12" />)}
        {/* 첫 화면에서 곡선이 왼쪽부터 그려짐 (pathLength=1로 길이와 무관하게 동작) */}
        <polyline points={points} pathLength={1} fill="none" stroke="currentColor" className="text-primary curve-draw" strokeWidth="2.5" strokeLinejoin="round" />
        {values.map((gain, i) => <circle key={i} cx={36 + i * 40} cy={114 - gain * 12} r="4" fill="currentColor" className="text-primary" />)}
        {FREQUENCIES.map((f, i) => <text key={f} x={36 + i * 40} y="220" textAnchor="middle" className="preview-axis">{f}</text>)}
      </svg>
      <div ref={groupRef} className="preview-presets" role="group" aria-label={c.preview}>
        {indicator && <span aria-hidden="true" className="preset-indicator" style={{ width: indicator.width, height: indicator.height, transform: `translate(${indicator.x}px, ${indicator.y}px)` }} />}
        {c.presets.map((label, i) => <button key={label} type="button" aria-pressed={preset === i} onClick={() => setPreset(i)}>{label}</button>)}
      </div>
      <p className="text-xs text-muted-foreground mt-4 leading-relaxed">{c.previewNote}</p>
    </section>
  )
}
