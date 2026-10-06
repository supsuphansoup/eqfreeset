import type { Metadata } from 'next'
import InfoContent from './InfoContent'

export const metadata: Metadata = {
  title: 'EQ와 이 서비스에 대해',
  description: '이퀄라이저가 동작하는 원리, 주파수 대역별 특징, A/B 블라인드 테스트 방식, AutoEq 데이터를 내 기기에 적용하는 방법을 알아보세요.',
  alternates: { canonical: '/info/' },
}

export default function InfoPage() {
  return <InfoContent />
}
