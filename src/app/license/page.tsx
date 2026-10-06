import type { Metadata } from 'next'
import LicenseContent from './LicenseContent'

export const metadata: Metadata = {
  title: '오픈소스 라이선스',
  description: 'EQ FreeSet에서 사용하는 AutoEq, Next.js, shadcn/ui, Zustand 등 오픈소스 라이브러리의 라이선스 고지입니다.',
  alternates: { canonical: '/license/' },
}

export default function LicensePage() {
  return <LicenseContent />
}
