import type { Metadata } from 'next'
import { GuideArticleView } from '@/components/guide-article'
import content from '@/lib/guides/content/blind-test'

export const metadata: Metadata = {
  title: 'Why Blind Listening Tests Work',
  description: 'Loudness bias, expectation bias and auditory memory explained, with conditions for fair A/B and ABX listening tests and tips for comparing sound at home.',
  alternates: { canonical: '/guide/blind-test/' },
}

export default function BlindTestPage() {
  return <GuideArticleView slug="blind-test" content={content} />
}
