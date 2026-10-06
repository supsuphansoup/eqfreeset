import type { Metadata } from 'next'
import TermsContent from './TermsContent'

export const metadata: Metadata = {
  title: '이용약관',
  description: 'EQ FreeSet 이용약관입니다. 서비스 목적, 이용자의 책임, 책임의 한계를 안내합니다.',
  alternates: { canonical: '/terms/' },
}

export default function TermsPage() {
  return <TermsContent />
}
