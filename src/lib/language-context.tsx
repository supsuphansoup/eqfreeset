'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import ko from '@/locales/ko'
import en from '@/locales/en'
import zh from '@/locales/zh'
import ja from '@/locales/ja'
import type { Locale } from '@/locales/ko'
import { isLocalizedPath, localizePath, samePath, splitLangPath } from '@/lib/locale-routes'

export type LangCode = 'ko' | 'en' | 'zh' | 'ja'

const LOCALES: Record<LangCode, Locale> = { ko, en, zh, ja }
const STORAGE_KEY = 'v2_eq-lang'

interface LanguageContextValue {
  lang: LangCode
  setLang: (lang: LangCode) => void
  t: Locale
  /** 현재 URL 언어(/en/ 등)에 맞춰 내부 링크 경로를 바꾼다. 한국어 URL에서는 그대로 */
  localePath: (href: string) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ko',
  setLang: () => {},
  t: ko,
  localePath: (href) => href,
})

function readSaved(): LangCode | null {
  try {
    // v1 구버전 키 마이그레이션 및 삭제
    const oldLang = localStorage.getItem('eq-lang') as LangCode | null
    if (oldLang && LOCALES[oldLang]) {
      if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, oldLang)
      localStorage.removeItem('eq-lang')
    }
    const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null
    return saved && LOCALES[saved] ? saved : null
  } catch {
    return null
  }
}

function saveLang(lang: LangCode) {
  try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* 저장 불가 환경에서는 현재 화면에만 적용 */ }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/'
  const router = useRouter()
  // /en/, /zh/, /ja/ 경로는 URL이 언어를 정한다 (정적 HTML도 해당 언어로 생성됨)
  const { routeLang, path } = splitLangPath(pathname)
  const [lang, setLangState] = useState<LangCode>('ko')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = readSaved()
    // Restore browser storage after hydration; static HTML of Korean URLs always starts in Korean.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setLangState(saved)
    setMounted(true)
  }, [])

  useEffect(() => {
    // 언어 URL로 들어오면 그 언어를 기억해 결과 페이지 등 공용 페이지도 같은 언어로 보이게 한다
    if (routeLang) {
      saveLang(routeLang)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(routeLang)
    }
  }, [routeLang])

  // mounted 전에는 항상 서버와 동일한 값(URL 언어 또는 'ko')을 사용해 hydration mismatch 방지
  const activeLang: LangCode = routeLang ?? (mounted ? lang : 'ko')

  useEffect(() => {
    if (mounted || routeLang) document.documentElement.lang = activeLang
  }, [activeLang, mounted, routeLang])

  const setLang = (newLang: LangCode) => {
    setLangState(newLang)
    saveLang(newLang)
    // 언어별 페이지가 있는 경로라면 해당 언어 URL로 이동
    if (isLocalizedPath(path)) {
      const target = localizePath(path, newLang)
      if (!samePath(target, pathname)) router.push(target)
    }
  }

  const localePath = (href: string) => localizePath(href, routeLang ?? 'ko')

  return (
    <LanguageContext.Provider value={{ lang: activeLang, setLang, t: LOCALES[activeLang], localePath }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
