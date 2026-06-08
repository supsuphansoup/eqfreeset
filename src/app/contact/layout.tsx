import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Developer',
  description: 'Send us bug reports, device requests, or suggestions directly. We read every message.',
  alternates: { canonical: '/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
