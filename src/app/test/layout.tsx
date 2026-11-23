import type { Metadata } from 'next'
import { withLanguages } from '@/lib/locale-routes'

export const metadata: Metadata = {
  title: 'EQ A/B 테스트',
  description: '이어폰·헤드폰을 선택하고 A/B 비교로 내 취향에 맞는 이퀄라이저 설정을 찾아보세요.',
  alternates: withLanguages('/test/'),
}

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
