import type { Metadata } from 'next'
import ToolsContent from '@/app/tools/ToolsContent'
import { pageMetadata } from '@/lib/localized-metadata'
import type { RouteLang } from '@/lib/locale-routes'

type Props = { params: Promise<{ lang: RouteLang }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata((await params).lang, 'tools')
}

export default function LocalizedToolsPage() {
  return <ToolsContent />
}
