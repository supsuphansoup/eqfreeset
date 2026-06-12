import type { Metadata } from 'next'
import PrivacyContent from './PrivacyContent'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'EQ FreeSet privacy policy covering ad cookies, analytics, and data handling. No personal data is collected or stored on our servers.',
  alternates: { canonical: '/privacy/' },
}

export default function PrivacyPage() {
  return <PrivacyContent />
}
