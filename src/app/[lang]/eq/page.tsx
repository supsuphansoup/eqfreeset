import type { Metadata } from 'next'
import DeviceIndexContent from '@/app/eq/DeviceIndexContent'
import { pageMetadata } from '@/lib/localized-metadata'
import type { RouteLang } from '@/lib/locale-routes'

type Props = { params: Promise<{ lang: RouteLang }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata((await params).lang, 'eq')
}

export default function LocalizedDeviceIndexPage() {
  return <DeviceIndexContent />
}
