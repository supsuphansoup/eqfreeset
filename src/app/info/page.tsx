import type { Metadata } from 'next'
import InfoContent from './InfoContent'

export const metadata: Metadata = {
  title: 'About EQ & This Service',
  description: 'Learn how equalizers work, frequency band characteristics, A/B blind testing, and how AutoEq data is applied to your device.',
  alternates: { canonical: '/info' },
}

export default function InfoPage() {
  return <InfoContent />
}
