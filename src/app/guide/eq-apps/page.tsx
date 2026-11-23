import type { Metadata } from 'next'
import { GuideArticleView } from '@/components/guide-article'
import content from '@/lib/guides/content/eq-apps'

export const metadata: Metadata = {
  title: '무료 EQ 프로그램·앱 추천',
  description: 'Windows(Equalizer APO, Peace, FxSound), Mac(eqMac, SoundSource), 안드로이드(Wavelet), 아이폰에서 쓸 수 있는 이퀄라이저 프로그램을 비교하고 고르는 기준을 정리했습니다.',
  alternates: { canonical: '/guide/eq-apps/' },
}

export default function EqAppsPage() {
  return <GuideArticleView slug="eq-apps" content={content} />
}
