import { MetadataRoute } from 'next'
import { GUIDES } from '@/lib/guides'
import { FEATURED_DEVICES } from '@/lib/device-guides'
import { ROUTE_LANGS, isLocalizedPath, languageAlternates, localizePath } from '@/lib/locale-routes'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://eqfreeset.pages.dev'

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/test/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/info/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/guide/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...GUIDES.map((g) => ({
      url: `${baseUrl}/guide/${g.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/eq/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...FEATURED_DEVICES.map((d) => ({
      url: `${baseUrl}/eq/${d.id}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/tools/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/license/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  // 언어별 페이지(/en/ 등)를 추가하고, 각 항목에 hreflang 대응을 붙인다
  return entries.flatMap((entry) => {
    const path = entry.url.slice(baseUrl.length)
    if (!isLocalizedPath(path)) return [entry]
    const alternates = {
      languages: Object.fromEntries(Object.entries(languageAlternates(path)).map(([lang, p]) => [lang, `${baseUrl}${p}`])),
    }
    return [
      { ...entry, alternates },
      ...ROUTE_LANGS.map((lang) => ({ ...entry, url: `${baseUrl}${localizePath(path, lang)}`, alternates })),
    ]
  })
}
