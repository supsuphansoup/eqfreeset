import type { Metadata } from 'next'
import EqPresetsContent from './EqPresetsContent'

export const metadata: Metadata = {
  title: 'Genre EQ Preset Guide — Pop, Rock, EDM & More',
  description: 'Recommended equalizer settings for pop, rock, classical, EDM, hip-hop and more. Frequency tuning tips for each genre.',
  alternates: { canonical: '/guide/eq-presets/' },
}

export default function EqPresetsPage() {
  return <EqPresetsContent />
}
