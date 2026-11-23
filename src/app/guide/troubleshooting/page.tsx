import type { Metadata } from 'next'
import { withLanguages } from '@/lib/locale-routes'
import { GuideArticleView } from '@/components/guide-article'
import content from '@/lib/guides/content/troubleshooting'

export const metadata: Metadata = {
  title: '이어폰 소리 문제 해결 가이드',
  description: '저음이 약할 때, 한쪽 소리가 작을 때, 블루투스가 끊길 때, 지글거림과 찌르는 고음까지 EQ 조정 전에 확인할 이어폰 점검 방법을 단계별로 안내합니다.',
  alternates: withLanguages('/guide/troubleshooting/'),
}

export default function TroubleshootingPage() {
  return <GuideArticleView slug="troubleshooting" content={content} />
}
