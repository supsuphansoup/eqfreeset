import type { Metadata } from 'next'
import { withLanguages } from '@/lib/locale-routes'
import HomeContent from './HomeContent'

export const metadata: Metadata = {
  title: 'EQ FreeSet — 듣고 고르는 내 이어폰·헤드폰 맞춤 EQ',
  description: '이어폰과 헤드폰에 맞는 이퀄라이저 설정을 무료로 찾아보세요. A/B 블라인드 테스트로 내 귀에 맞는 EQ 값을 찾고, 결과를 JSON으로 내려받을 수 있습니다.',
  alternates: withLanguages('/'),
  openGraph: {
    title: 'EQ FreeSet — 듣고 고르는 내 맞춤 EQ',
    description: '이어폰·헤드폰 맞춤 이퀄라이저를 A/B 블라인드 테스트로 무료로 찾아보세요.',
    url: 'https://eqfreeset.pages.dev',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function HomePage() {
  return <HomeContent />
}
