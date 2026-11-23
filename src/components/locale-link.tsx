'use client'

import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { useLanguage } from '@/lib/language-context'

/** next/link와 같지만, /en/ 같은 언어 URL에서는 내부 링크를 같은 언어 페이지로 연결한다 */
export default function LocaleLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { localePath } = useLanguage()
  return <NextLink href={typeof href === 'string' ? localePath(href) : href} {...props} />
}
