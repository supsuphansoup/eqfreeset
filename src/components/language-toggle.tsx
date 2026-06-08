'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-flex items-center justify-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex flex-col items-center justify-center gap-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4" />
        <span className="text-[9px] leading-none font-medium tracking-wide uppercase">{lang}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-32 bg-popover border border-border backdrop-blur-md rounded-lg shadow-lg py-1 z-[100] animate-in fade-in slide-in-from-top-1 duration-150">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code)
                setIsOpen(false)
              }}
              className={`w-full px-3 py-2 text-left text-xs font-semibold transition-colors hover:bg-muted flex items-center justify-between ${
                lang === l.code ? 'text-primary' : 'text-foreground'
              }`}
            >
              <span>{l.label}</span>
              {lang === l.code && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
