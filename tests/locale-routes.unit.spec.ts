import { test, expect } from '@playwright/test'
import { isLocalizedPath, languageAlternates, localizePath, samePath, splitLangPath } from '../src/lib/locale-routes'
import { FEATURED_DEVICES, findFeaturedIdByDeviceName, getDeviceLinkText } from '../src/lib/device-guides'
import { findDeviceById } from '../src/lib/device-db'
import { buildArticleJsonLd } from '../src/lib/structured-data'

test('language prefixes split and join only for pages that have language versions', () => {
  expect(splitLangPath('/en/guide/apply-eq/')).toEqual({ routeLang: 'en', path: '/guide/apply-eq/' })
  expect(splitLangPath('/ja')).toEqual({ routeLang: 'ja', path: '/' })
  expect(splitLangPath('/english-page')).toEqual({ routeLang: null, path: '/english-page' })
  expect(splitLangPath('/eq/')).toEqual({ routeLang: null, path: '/eq/' })

  expect(localizePath('/', 'en')).toBe('/en/')
  expect(localizePath('/guide/apply-eq/', 'zh')).toBe('/zh/guide/apply-eq/')
  expect(localizePath('/en/tools/', 'ko')).toBe('/tools/')
  expect(localizePath('/en/tools/', 'ja')).toBe('/ja/tools/')
  expect(localizePath('/privacy', 'en')).toBe('/privacy')
  expect(localizePath('/result?id=1', 'en')).toBe('/result?id=1')
  expect(localizePath('#how-it-works', 'en')).toBe('#how-it-works')

  expect(isLocalizedPath('/test')).toBe(true)
  expect(isLocalizedPath('/testing')).toBe(false)
  expect(isLocalizedPath('/eq/sony-wh-1000xm5/')).toBe(true)
  expect(samePath('/tools', '/tools/')).toBe(true)

  expect(languageAlternates('/eq/')).toEqual({ ko: '/eq/', en: '/en/eq/', zh: '/zh/eq/', ja: '/ja/eq/', 'x-default': '/eq/' })
})

test('result page device names map back to featured device pages', () => {
  for (const { id } of FEATURED_DEVICES) {
    expect(findFeaturedIdByDeviceName(findDeviceById(id)!.name)).toBe(id)
  }
  expect(findFeaturedIdByDeviceName('Unknown Device')).toBeNull()
  expect(getDeviceLinkText('sony-wh-1000xm5', 'ko')).toBe('소니 WH-1000XM5 EQ 설정 자세히 보기')
})

test('article structured data uses the URL language for links', () => {
  const [article, breadcrumb] = buildArticleJsonLd({ pathname: '/ja/guide/eq-apps', lang: 'ja', title: 'T' })
  expect(article.url).toBe('https://eqfreeset.pages.dev/ja/guide/eq-apps/')
  expect(article.inLanguage).toBe('ja-JP')
  expect(article.description).toBeTruthy()
  expect((breadcrumb.itemListElement ?? []).map((i) => i.item)).toEqual([
    'https://eqfreeset.pages.dev/ja/',
    'https://eqfreeset.pages.dev/ja/guide/',
    'https://eqfreeset.pages.dev/ja/guide/eq-apps/',
  ])
  const [device] = buildArticleJsonLd({ pathname: '/eq/qcy-t13/', lang: 'ko', title: 'QCY', description: 'd' })
  expect(device.url).toBe('https://eqfreeset.pages.dev/eq/qcy-t13/')
  expect(device.description).toBe('d')
})
