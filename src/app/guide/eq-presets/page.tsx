import type { Metadata } from 'next'
import EqPresetsContent from './EqPresetsContent'

export const metadata: Metadata = {
  title: '장르별 EQ 프리셋 가이드 — 팝, 록, EDM 등',
  description: '팝, 록, 클래식, EDM, 힙합 등 장르별 추천 이퀄라이저 설정과 주파수 튜닝 포인트를 정리했습니다.',
  alternates: { canonical: '/guide/eq-presets/' },
}

export default function EqPresetsPage() {
  return <EqPresetsContent />
}
