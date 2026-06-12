import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EQ 가이드 · 정보',
  description: 'EQ(이퀄라이저) 기초 개념, A/B 테스트 방법, 주파수 대역 가이드, 자주 묻는 질문까지 한 번에 알아보세요.',
  alternates: { canonical: '/info/' },
}

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
