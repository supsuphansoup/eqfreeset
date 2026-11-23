import type { ReactNode } from 'react'
import { langStaticParams } from '@/lib/localized-metadata'

// /en/, /zh/, /ja/ 페이지: 한국어 페이지와 같은 화면을 URL 언어로 정적 생성한다
export const dynamicParams = false

export function generateStaticParams() {
  return langStaticParams()
}

export default function LangLayout({ children }: { children: ReactNode }) {
  return children
}
