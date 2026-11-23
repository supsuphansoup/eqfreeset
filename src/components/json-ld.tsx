'use client'

import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { buildArticleJsonLd, buildWebAppJsonLd } from '@/lib/structured-data'

function JsonLd({ data }: { data: unknown }) {
  // '<'를 이스케이프해 본문 문자열이 </script>로 스크립트를 끊지 못하게 한다
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

/** 가이드 글·기기 페이지용 Article + BreadcrumbList */
export function ArticleJsonLd({ title, description }: { title: string; description?: string }) {
  const pathname = usePathname() ?? '/'
  const { lang } = useLanguage()
  return <JsonLd data={buildArticleJsonLd({ pathname, lang, title, description })} />
}

/** 홈 화면용 WebApplication */
export function WebAppJsonLd() {
  const pathname = usePathname() ?? '/'
  const { lang } = useLanguage()
  return <JsonLd data={buildWebAppJsonLd(pathname, lang)} />
}
