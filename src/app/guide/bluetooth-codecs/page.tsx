import type { Metadata } from 'next'
import { withLanguages } from '@/lib/locale-routes'
import { GuideArticleView } from '@/components/guide-article'
import content from '@/lib/guides/content/bluetooth-codecs'

export const metadata: Metadata = {
  title: '블루투스 코덱 비교: SBC, AAC, aptX, LDAC',
  description: 'SBC, AAC, aptX, LDAC, LC3 블루투스 코덱의 전송률과 지연, 아이폰·안드로이드 지원 차이, 코덱이 실제 음질에 미치는 영향을 비교합니다.',
  alternates: withLanguages('/guide/bluetooth-codecs/'),
}

export default function BluetoothCodecsPage() {
  return <GuideArticleView slug="bluetooth-codecs" content={content} />
}
