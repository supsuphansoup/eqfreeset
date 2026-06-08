import type { Metadata } from 'next'
import HomeContent from './HomeContent'

export const metadata: Metadata = {
  title: 'EQ FreeSet — Find Your Perfect Earphone & Headphone EQ in 3 Minutes',
  description: 'Free personalized equalizer settings for your earphones and headphones. Find your perfect EQ through A/B blind testing in just 3 minutes. Results downloadable as JSON.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'EQ FreeSet — Find Your Perfect EQ in 3 Minutes',
    description: 'Free personalized equalizer for earphones & headphones. A/B blind test in 3 minutes.',
    url: 'https://eqfreeset.pages.dev',
    type: 'website',
  },
}

export default function HomePage() {
  return <HomeContent />
}
