import type { Metadata } from 'next'
import { GuideArticleView } from '@/components/guide-article'
import content from '@/lib/guides/content/frequency-response'

export const metadata: Metadata = {
  title: '주파수 응답 그래프와 타깃 커브 읽는 법',
  description: '이어폰 주파수 응답 그래프를 읽는 법, 하만 타깃의 의미, 측정값만으로는 내 귀에 들리는 소리를 다 알 수 없는 이유를 설명합니다.',
  alternates: { canonical: '/guide/frequency-response/' },
}

export default function FrequencyResponsePage() {
  return <GuideArticleView slug="frequency-response" content={content} />
}
