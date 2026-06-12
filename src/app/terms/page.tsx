import type { Metadata } from 'next'
import TermsContent from './TermsContent'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'EQ FreeSet terms of service — service purpose, user responsibilities, and liability limitations.',
  alternates: { canonical: '/terms/' },
}

export default function TermsPage() {
  return <TermsContent />
}
