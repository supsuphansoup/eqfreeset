import type { Metadata } from 'next'
import { withLanguages } from '@/lib/locale-routes'
import { GuideArticleView } from '@/components/guide-article'
import content from '@/lib/guides/content/frequency-guide'

export const metadata: Metadata = {
  title: '주파수 대역별 소리 가이드',
  description: '초저음부터 초고음까지 각 주파수 대역이 담당하는 소리, 많거나 적을 때 들리는 방식, 먹먹함이나 날카로움 같은 느낌을 EQ 조정으로 바꾸는 방법을 설명합니다.',
  alternates: withLanguages('/guide/frequency-guide/'),
}

export default function FrequencyGuidePage() {
  return <GuideArticleView slug="frequency-guide" content={content} />
}
