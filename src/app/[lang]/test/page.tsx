import type { Metadata } from 'next'
import TestContent from '@/app/test/TestContent'
import { pageMetadata } from '@/lib/localized-metadata'
import type { RouteLang } from '@/lib/locale-routes'

type Props = { params: Promise<{ lang: RouteLang }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata((await params).lang, 'test')
}

export default function LocalizedTestPage() {
  return <TestContent />
}
