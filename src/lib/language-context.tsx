'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import ko from '@/locales/ko'
import en from '@/locales/en'
import zh from '@/locales/zh'
import ja from '@/locales/ja'
import type { Locale } from '@/locales/ko'

export type LangCode = 'ko' | 'en' | 'zh' | 'ja'

const LOCALES: Record<LangCode, Locale> = { ko, en, zh, ja }

interface LanguageContextValue {
  lang: LangCode
  setLang: (lang: LangCode) => void
  t: Locale
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ko',
  setLang: () => {},
  t: ko,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('ko')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // v1 구버전 키 마이그레이션 및 삭제
    const oldLang = localStorage.getItem('eq-lang') as LangCode | null
    if (oldLang && LOCALES[oldLang]) {
      if (!localStorage.getItem('v2_eq-lang')) {
        localStorage.setItem('v2_eq-lang', oldLang)
      }
      localStorage.removeItem('eq-lang')
    }
    const saved = localStorage.getItem('v2_eq-lang') as LangCode | null
    if (saved && LOCALES[saved]) setLangState(saved)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = lang
    }
  }, [lang, mounted])

  const setLang = (newLang: LangCode) => {
    setLangState(newLang)
    localStorage.setItem('v2_eq-lang', newLang)
  }

  // mounted 전에는 항상 서버와 동일한 기본값('ko')을 사용해 hydration mismatch 방지
  const activeLang = mounted ? lang : 'ko'

  return (
    <LanguageContext.Provider value={{ lang: activeLang, setLang, t: LOCALES[activeLang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
