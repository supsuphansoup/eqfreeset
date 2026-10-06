import type { Metadata } from 'next'
import { GuideArticleView } from '@/components/guide-article'
import content from '@/lib/guides/content/blind-test'

export const metadata: Metadata = {
  title: '블라인드 테스트로 귀를 믿는 법',
  description: '음량 편향, 기대 편향, 청각 기억의 한계를 설명하고, 공정한 A/B·ABX 청취 테스트 조건과 집에서 소리를 비교하는 요령을 정리했습니다.',
  alternates: { canonical: '/guide/blind-test/' },
}

export default function BlindTestPage() {
  return <GuideArticleView slug="blind-test" content={content} />
}
