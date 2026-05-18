import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '테스트 결과',
  description: 'EQ FreeSet A/B 테스트 결과입니다. 나만의 이퀄라이저 설정을 JSON으로 다운로드하세요.',
  alternates: { canonical: '/result' },
  robots: { index: false, follow: false }, // 개인화된 1회성 결과 페이지는 색인 제외
}

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
