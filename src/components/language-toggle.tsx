'use client'

import { Globe } from 'lucide-react'
import { useLanguage, type LangCode } from '@/lib/language-context'

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="relative inline-flex items-center justify-center">
      <button className="w-10 h-10 flex flex-col items-center justify-center gap-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors pointer-events-none" aria-hidden="true" tabIndex={-1}>
        <Globe className="w-4 h-4" />
        <span className="text-[9px] leading-none font-medium tracking-wide uppercase">{lang}</span>
      </button>
      <select
        value={lang}
        onChange={e => setLang(e.target.value as LangCode)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-base"
        aria-label="Select Language"
      >
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code} className="text-foreground bg-background">
            {l.label}
          </option>
        ))}
      </select>
    </div>
  )
}
