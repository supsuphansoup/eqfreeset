'use client'

import { useState } from 'react'
import { AudioLines, SlidersHorizontal } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { experienceCopy } from '@/lib/experience-copy'

const PRESETS = [
  [1, 1.5, 1, 0, -1, 0, 1.5, 2, 1.5, 0.5],
  [5, 4.5, 3, 1, 0, -0.5, 0, 1, 1.5, 1],
  [-1, -0.5, -1, 0, 2, 3.5, 3, 1.5, 0, -1],
]
const FREQUENCIES = ['32', '64', '125', '250', '500', '1k', '2k', '4k', '8k', '16k']

export function EQPreview() {
  const { lang } = useLanguage()
  const c = experienceCopy[lang]
  const [preset, setPreset] = useState(0)
  const values = PRESETS[preset]
  const points = values.map((gain, i) => `${36 + i * 40},${114 - gain * 12}`).join(' ')

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
        <polyline points={points} fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinejoin="round" />
        {values.map((gain, i) => <circle key={i} cx={36 + i * 40} cy={114 - gain * 12} r="4" fill="currentColor" className="text-primary" />)}
        {FREQUENCIES.map((f, i) => <text key={f} x={36 + i * 40} y="220" textAnchor="middle" className="preview-axis">{f}</text>)}
      </svg>
      <div className="preview-presets" role="group" aria-label={c.preview}>
        {c.presets.map((label, i) => <button key={label} type="button" aria-pressed={preset === i} onClick={() => setPreset(i)}>{label}</button>)}
      </div>
      <p className="text-xs text-muted-foreground mt-4 leading-relaxed">{c.previewNote}</p>
    </section>
  )
}
