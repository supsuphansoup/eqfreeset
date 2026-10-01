import type { Metadata } from 'next'
import { GuideArticleView } from '@/components/guide-article'
import content from '@/lib/guides/content/troubleshooting'

export const metadata: Metadata = {
  title: 'Earphone Sound Troubleshooting',
  description: 'Fix weak bass, one side quieter, Bluetooth dropouts, crackling and harsh treble with step-by-step earphone checks before adjusting EQ.',
  alternates: { canonical: '/guide/troubleshooting/' },
}

export default function TroubleshootingPage() {
  return <GuideArticleView slug="troubleshooting" content={content} />
}
