import type { Metadata } from 'next'
import HearingHealthContent from './HearingHealthContent'

export const metadata: Metadata = {
  title: '청력 보호 가이드 — 안전한 청취 습관',
  description: '60/60 법칙과 적정 볼륨, 건강한 청취 습관으로 이어폰·헤드폰 사용자의 소음성 난청을 예방하는 방법을 알아보세요.',
  alternates: { canonical: '/guide/hearing-health/' },
}

export default function HearingHealthPage() {
  return <HearingHealthContent />
}
