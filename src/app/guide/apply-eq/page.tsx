import type { Metadata } from 'next'
import { withLanguages } from '@/lib/locale-routes'
import { GuideArticleView } from '@/components/guide-article'
import content from '@/lib/guides/content/apply-eq'

export const metadata: Metadata = {
  title: '기기별 EQ 적용 방법',
  description: '갤럭시·안드로이드, 아이폰, Windows(Equalizer APO), Mac에서 EQ 값을 입력하는 방법과 클리핑을 막는 프리앰프 설정을 단계별로 정리했습니다.',
  alternates: withLanguages('/guide/apply-eq/'),
}

export default function ApplyEqPage() {
  return <GuideArticleView slug="apply-eq" content={content} />
}
