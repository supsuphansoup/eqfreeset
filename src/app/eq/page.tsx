import type { Metadata } from 'next'
import DeviceIndexContent from './DeviceIndexContent'

export const metadata: Metadata = {
  title: '기기별 EQ 설정값 · 에어팟, 갤럭시 버즈, 소니',
  description: '에어팟 프로 2, 갤럭시 버즈3 프로, 소니 WF-1000XM5 등 인기 이어폰·헤드폰의 측정 기반 소리 성향과 10밴드 EQ 보정값을 기기별로 정리했습니다.',
  alternates: { canonical: '/eq/' },
}

export default function DeviceIndexPage() {
  return <DeviceIndexContent />
}
