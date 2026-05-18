import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/result'],  // 테스트 결과 페이지만 색인 제외 (/test는 허용)
      },
    ],
    sitemap: 'https://eqfreeset.pages.dev/sitemap.xml',
    host: 'https://eqfreeset.pages.dev',
  }
}
