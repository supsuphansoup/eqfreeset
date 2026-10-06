import type { Metadata } from 'next'
import GuideIndexContent from './GuideIndexContent'

export const metadata: Metadata = {
  title: '이어폰 · EQ 가이드',
  description: 'EQ 적용 방법, 주파수 대역, 주파수 응답 그래프 읽는 법, 블루투스 코덱, 블라인드 테스트, 문제 해결, 청력 보호까지 이어폰 소리에 관한 가이드 모음입니다.',
  alternates: { canonical: '/guide/' },
}

export default function GuideIndexPage() {
  return <GuideIndexContent />
}
