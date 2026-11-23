import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FEATURED_DEVICES, buildDeviceContent } from '@/lib/device-guides'
import { deviceMetadata } from '@/lib/localized-metadata'
import type { RouteLang } from '@/lib/locale-routes'
import DeviceEqContent from '@/app/eq/[device]/DeviceEqContent'

export const dynamicParams = false

export function generateStaticParams() {
  return FEATURED_DEVICES.map((d) => ({ device: d.id }))
}

type Props = { params: Promise<{ lang: RouteLang; device: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, device } = await params
  return deviceMetadata(lang, device)
}

export default async function LocalizedDeviceEqPage({ params }: Props) {
  const { device } = await params
  const content = buildDeviceContent(device)
  if (!content) notFound()
  return <DeviceEqContent deviceId={device} content={content} />
}
