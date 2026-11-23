import type { Metadata } from 'next'
import GuideIndexContent from '@/app/guide/GuideIndexContent'
import { pageMetadata } from '@/lib/localized-metadata'
import type { RouteLang } from '@/lib/locale-routes'

type Props = { params: Promise<{ lang: RouteLang }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata((await params).lang, 'guide')
}

export default function LocalizedGuideIndexPage() {
  return <GuideIndexContent />
}
