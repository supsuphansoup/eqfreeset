import type { Metadata } from 'next'
import { withLanguages } from '@/lib/locale-routes'
import TestContent from './TestContent'

export const metadata: Metadata = {
  title: 'EQ A/B 테스트 — 내 귀에 맞는 소리 찾기',
  description: '이어폰이나 헤드폰을 고르고 음악 장르를 선택한 뒤 A/B 블라인드 테스트를 진행하면 몇 분 만에 나에게 맞는 이퀄라이저 설정을 찾을 수 있습니다.',
  alternates: withLanguages('/test/'),
  openGraph: {
    title: 'EQ A/B 테스트 — 내 귀에 맞는 소리 찾기',
    description: '100가지 이상의 이어폰·헤드폰을 지원하는 A/B 블라인드 테스트로 맞춤 이퀄라이저 설정을 찾아보세요.',
    url: 'https://eqfreeset.pages.dev/test/',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function TestPage() {
  return <TestContent />
}
