import type { Metadata } from 'next'
import LicenseContent from './LicenseContent'

export const metadata: Metadata = {
  title: 'Open Source Licenses',
  description: 'Open source license notices for AutoEq, Next.js, shadcn/ui, Zustand, and other libraries used in EQ FreeSet.',
  alternates: { canonical: '/license' },
}

export default function LicensePage() {
  return <LicenseContent />
}
