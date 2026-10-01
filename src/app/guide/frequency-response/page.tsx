import type { Metadata } from 'next'
import { GuideArticleView } from '@/components/guide-article'
import content from '@/lib/guides/content/frequency-response'

export const metadata: Metadata = {
  title: 'Reading Frequency Response Graphs & Target Curves',
  description: 'How to read earphone frequency response graphs, what the Harman target means, and why measurements alone cannot predict how earphones sound to you.',
  alternates: { canonical: '/guide/frequency-response/' },
}

export default function FrequencyResponsePage() {
  return <GuideArticleView slug="frequency-response" content={content} />
}
