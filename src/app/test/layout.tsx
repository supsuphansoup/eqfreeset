import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EQ A/B 테스트',
  description: '이어폰·헤드폰을 선택하고 A/B 블라인드 테스트를 시작하세요. 나에게 딱 맞는 이퀄라이저 설정을 과학적으로 찾아드립니다.',
  alternates: { canonical: '/test' },
  robots: { index: false, follow: false }, // 테스트는 1회성 세션이므로 색인 제외
}

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
