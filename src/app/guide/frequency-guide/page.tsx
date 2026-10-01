import type { Metadata } from 'next'
import { GuideArticleView } from '@/components/guide-article'
import content from '@/lib/guides/content/frequency-guide'

export const metadata: Metadata = {
  title: 'Frequency Band Sound Guide',
  description: 'What each frequency band from sub-bass to air sounds like, how too much or too little sounds, and how to turn feelings like muddy or harsh into EQ adjustments.',
  alternates: { canonical: '/guide/frequency-guide/' },
}

export default function FrequencyGuidePage() {
  return <GuideArticleView slug="frequency-guide" content={content} />
}
