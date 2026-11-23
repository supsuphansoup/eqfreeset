import type { LangCode } from '@/lib/language-context'
import { GUIDES } from '@/lib/guides'
import { localizePath, splitLangPath } from '@/lib/locale-routes'

// 검색 결과에 경로·사이트 정보가 붙도록 하는 schema.org 구조화 데이터

export const SITE_URL = 'https://eqfreeset.pages.dev'

const LABELS: Record<LangCode, { guide: string; eq: string; desc: string }> = {
  ko: { guide: '가이드', eq: '기기별 EQ', desc: 'A/B 블라인드 테스트로 이어폰·헤드폰에 맞는 이퀄라이저 설정을 무료로 찾는 서비스' },
  en: { guide: 'Guides', eq: 'Device EQ', desc: 'A free A/B blind test that finds equalizer settings for your earphones and headphones' },
  zh: { guide: '指南', eq: '设备EQ', desc: '通过A/B盲听测试免费找到适合耳机的均衡器设置' },
  ja: { guide: 'ガイド', eq: '機器別EQ', desc: 'A/Bブラインドテストでイヤホン・ヘッドホンに合うイコライザー設定を無料で見つけるサービス' },
}

const IN_LANGUAGE: Record<LangCode, string> = { ko: 'ko-KR', en: 'en', zh: 'zh-CN', ja: 'ja-JP' }

const withSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`)

const ORGANIZATION = { '@type': 'Organization', name: 'EQ FreeSet', url: SITE_URL }

export function buildArticleJsonLd({ pathname, lang, title, description }: { pathname: string; lang: LangCode; title: string; description?: string }) {
  // 주소는 실제 URL 언어 기준, 본문 텍스트는 화면 언어 기준
  const { routeLang, path } = splitLangPath(pathname)
  const urlLang = routeLang ?? 'ko'
  const url = `${SITE_URL}${localizePath(withSlash(path), urlLang)}`
  const section = path.startsWith('/eq') ? 'eq' : 'guide'
  const guide = GUIDES.find((g) => withSlash(path) === `/guide/${g.slug}/`)
  const label = LABELS[lang]

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: guide?.desc[lang] ?? description,
      inLanguage: IN_LANGUAGE[lang],
      url,
      mainEntityOfPage: url,
      image: `${SITE_URL}/og-image.png`,
      author: ORGANIZATION,
      publisher: ORGANIZATION,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'EQ FreeSet', item: `${SITE_URL}${localizePath('/', urlLang)}` },
        { '@type': 'ListItem', position: 2, name: label[section], item: `${SITE_URL}${localizePath(`/${section}/`, urlLang)}` },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    },
  ]
}

export function buildWebAppJsonLd(pathname: string, lang: LangCode) {
  const { routeLang, path } = splitLangPath(pathname)
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'EQ FreeSet',
    url: `${SITE_URL}${localizePath(withSlash(path), routeLang ?? 'ko')}`,
    description: LABELS[lang].desc,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a browser with Web Audio API support',
    inLanguage: IN_LANGUAGE[lang],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  }
}
