import type { LangCode } from '@/lib/language-context'

// 한국어는 기본 URL(/...), 나머지 언어는 /en/... 처럼 접두사가 붙는 별도 정적 페이지로 만든다.
export const ROUTE_LANGS = ['en', 'zh', 'ja'] as const
export type RouteLang = (typeof ROUTE_LANGS)[number]
export const ALL_LANGS: LangCode[] = ['ko', ...ROUTE_LANGS]

// 언어별 페이지가 있는 경로 (결과·약관 같은 페이지는 한국어 URL 하나만 두고 화면에서 언어를 바꾼다)
const LOCALIZED_SECTIONS = ['/test', '/guide', '/eq', '/tools']

const PREFIX_RE = /^\/(en|zh|ja)(?=\/|$)/

const trimSlash = (path: string) => (path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path)

export function isRouteLang(value: string): value is RouteLang {
  return (ROUTE_LANGS as readonly string[]).includes(value)
}

/** '/en/guide/x/' → { routeLang: 'en', path: '/guide/x/' } */
export function splitLangPath(pathname: string): { routeLang: RouteLang | null; path: string } {
  const match = PREFIX_RE.exec(pathname)
  if (!match) return { routeLang: null, path: pathname || '/' }
  return { routeLang: match[1] as RouteLang, path: pathname.slice(match[0].length) || '/' }
}

export function isLocalizedPath(href: string) {
  if (!href.startsWith('/')) return false
  const path = trimSlash(href.split(/[?#]/)[0])
  return path === '/' || LOCALIZED_SECTIONS.some((s) => path === s || path.startsWith(`${s}/`))
}

/** 한국어 경로를 해당 언어 경로로 바꾼다. 언어별 페이지가 없는 경로는 그대로 둔다 */
export function localizePath(href: string, lang: LangCode) {
  const { path } = splitLangPath(href)
  if (lang === 'ko' || !isLocalizedPath(path)) return path
  return path === '/' ? `/${lang}/` : `/${lang}${path}`
}

export function samePath(a: string, b: string) {
  return trimSlash(a) === trimSlash(b)
}

/** hreflang 대응표 (canonical 경로 형식 그대로, 예: '/guide/x/') */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ko: path,
    en: localizePath(path, 'en'),
    zh: localizePath(path, 'zh'),
    ja: localizePath(path, 'ja'),
    'x-default': path,
  }
}

/** 한국어 페이지 metadata용: canonical과 함께 언어별 페이지(hreflang)를 알린다 */
export function withLanguages(path: string) {
  return { canonical: path, languages: languageAlternates(path) }
}
