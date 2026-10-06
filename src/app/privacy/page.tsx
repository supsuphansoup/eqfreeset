import type { Metadata } from 'next'
import PrivacyContent from './PrivacyContent'

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description: 'EQ FreeSet의 광고 쿠키, 방문 통계, 데이터 처리 방식을 안내합니다. 서버에는 개인정보를 수집하거나 저장하지 않습니다.',
  alternates: { canonical: '/privacy/' },
}

export default function PrivacyPage() {
  return <PrivacyContent />
}
