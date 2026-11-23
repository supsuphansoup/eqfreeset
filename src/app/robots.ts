import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/result/', '/result'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
    ],
    sitemap: 'https://eqfreeset.pages.dev/sitemap.xml',
  }
}
