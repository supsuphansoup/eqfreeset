import type { Metadata } from 'next'
import { GuideArticleView } from '@/components/guide-article'
import content from '@/lib/guides/content/bluetooth-codecs'

export const metadata: Metadata = {
  title: 'Bluetooth Codecs Compared: SBC, AAC, aptX, LDAC',
  description: 'Compare Bluetooth audio codecs SBC, AAC, aptX, LDAC and LC3: bitrate, latency, iPhone vs Android support, and how much codecs really affect sound quality.',
  alternates: { canonical: '/guide/bluetooth-codecs/' },
}

export default function BluetoothCodecsPage() {
  return <GuideArticleView slug="bluetooth-codecs" content={content} />
}
