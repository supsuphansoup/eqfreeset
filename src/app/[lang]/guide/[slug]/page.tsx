import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import { notFound } from 'next/navigation'
import { GUIDES } from '@/lib/guides'
import { guideMetadata } from '@/lib/localized-metadata'
import type { RouteLang } from '@/lib/locale-routes'
import ApplyEq from '@/app/guide/apply-eq/page'
import BlindTest from '@/app/guide/blind-test/page'
import BluetoothCodecs from '@/app/guide/bluetooth-codecs/page'
import EarphoneTips from '@/app/guide/earphone-tips/page'
import EqApps from '@/app/guide/eq-apps/page'
import EqPresets from '@/app/guide/eq-presets/page'
import FrequencyGuide from '@/app/guide/frequency-guide/page'
import FrequencyResponse from '@/app/guide/frequency-response/page'
import HearingHealth from '@/app/guide/hearing-health/page'
import Troubleshooting from '@/app/guide/troubleshooting/page'

// 한국어 가이드 페이지의 화면을 그대로 쓰고, 언어는 URL로 정한다
const GUIDE_PAGES: Record<string, ComponentType> = {
  'apply-eq': ApplyEq,
  'blind-test': BlindTest,
  'bluetooth-codecs': BluetoothCodecs,
  'earphone-tips': EarphoneTips,
  'eq-apps': EqApps,
  'eq-presets': EqPresets,
  'frequency-guide': FrequencyGuide,
  'frequency-response': FrequencyResponse,
  'hearing-health': HearingHealth,
  troubleshooting: Troubleshooting,
}

export const dynamicParams = false

export function generateStaticParams() {
  // 가이드 목록에 새 글을 추가하고 이 표에 빠뜨리면 빌드가 실패하도록 한다
  const missing = GUIDES.filter((g) => !GUIDE_PAGES[g.slug]).map((g) => g.slug)
  if (missing.length) throw new Error(`Localized guide pages missing: ${missing.join(', ')}`)
  return GUIDES.map((g) => ({ slug: g.slug }))
}

type Props = { params: Promise<{ lang: RouteLang; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  return guideMetadata(lang, slug)
}

export default async function LocalizedGuidePage({ params }: Props) {
  const { slug } = await params
  const Page = GUIDE_PAGES[slug]
  if (!Page) notFound()
  return <Page />
}
