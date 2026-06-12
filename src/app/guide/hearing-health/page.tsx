import type { Metadata } from 'next'
import HearingHealthContent from './HearingHealthContent'

export const metadata: Metadata = {
  title: 'Hearing Protection Guide — Safe Listening Habits',
  description: 'Prevent noise-induced hearing loss with the 60/60 rule, proper volume levels, and healthy listening habits for earphone and headphone users.',
  alternates: { canonical: '/guide/hearing-health/' },
}

export default function HearingHealthPage() {
  return <HearingHealthContent />
}
