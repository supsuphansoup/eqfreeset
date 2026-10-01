import type { Metadata } from 'next'
import GuideIndexContent from './GuideIndexContent'

export const metadata: Metadata = {
  title: 'Earphone & EQ Guides',
  description: 'Guides on applying EQ, frequency bands, reading frequency response graphs, Bluetooth codecs, blind listening tests, troubleshooting and hearing protection.',
  alternates: { canonical: '/guide/' },
}

export default function GuideIndexPage() {
  return <GuideIndexContent />
}
