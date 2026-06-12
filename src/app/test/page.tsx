import type { Metadata } from 'next'
import TestContent from './TestContent'

export const metadata: Metadata = {
  title: 'EQ A/B Test — Find Your Perfect Sound',
  description: 'Select your earphone or headphone, choose a music genre, and run an A/B blind test to find your personalized equalizer settings in minutes.',
  alternates: { canonical: '/test/' },
  openGraph: {
    title: 'EQ A/B Test — Find Your Perfect Sound',
    description: 'Personalized equalizer settings via A/B blind testing. Works with 100+ earphones and headphones.',
    url: 'https://eqfreeset.pages.dev/test/',
    type: 'website',
  },
}

export default function TestPage() {
  return <TestContent />
}
