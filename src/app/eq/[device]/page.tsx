import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FEATURED_DEVICES, buildDeviceContent, getDeviceDisplayName } from '@/lib/device-guides'
import DeviceEqContent from './DeviceEqContent'

export const dynamicParams = false

export function generateStaticParams() {
  return FEATURED_DEVICES.map((d) => ({ device: d.id }))
}

type Props = { params: Promise<{ device: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { device } = await params
  const name = getDeviceDisplayName(device, 'ko')
  return {
    title: `${name} EQ 설정값 추천 · 10밴드 보정표`,
    description: `${name}의 측정 기반 소리 성향(저음·보컬·고음)과 10밴드 EQ 보정값, 프리앰프, 앱에서 EQ를 적용하는 방법을 정리했습니다.`,
    alternates: { canonical: `/eq/${device}/` },
  }
}

export default async function DeviceEqPage({ params }: Props) {
  const { device } = await params
  const content = buildDeviceContent(device)
  if (!content) notFound()
  return <DeviceEqContent deviceId={device} content={content} />
}
