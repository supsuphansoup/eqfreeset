import type { Metadata } from 'next'
import EarphoneTipsContent from './EarphoneTipsContent'

export const metadata: Metadata = {
  title: 'Earphone Care & Buying Guide',
  description: 'How to choose the right earphones, foam vs silicone tips, proper cleaning and storage — get the most out of your earphones.',
  alternates: { canonical: '/guide/earphone-tips/' },
}

export default function EarphoneTipsPage() {
  return <EarphoneTipsContent />
}
