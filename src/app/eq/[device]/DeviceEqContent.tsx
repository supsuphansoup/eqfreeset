'use client'

import Link from '@/components/locale-link'
import { GuideArticleView } from '@/components/guide-article'
import { useLanguage } from '@/lib/language-context'
import type { GuideContent } from '@/lib/guides'
import { DEVICE_PAGE_COPY, FEATURED_DEVICES, getDeviceDisplayName } from '@/lib/device-guides'

export default function DeviceEqContent({ deviceId, content }: { deviceId: string; content: GuideContent }) {
  const { lang } = useLanguage()
  const c = DEVICE_PAGE_COPY[lang] ?? DEVICE_PAGE_COPY.ko
  const others = FEATURED_DEVICES.filter((d) => d.id !== deviceId)

  return (
    // 관련 가이드는 목록 맨 앞(기기별 EQ 적용 방법 등)부터 보이도록 마지막 가이드 slug를 기준으로 전달
    <GuideArticleView slug="eq-apps" content={content}>
      <section className="pt-12">
        <h2 className="text-base font-semibold mb-4 text-foreground">{c.moreDevices}</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((d) => (
            <Link
              key={d.id}
              href={`/eq/${d.id}`}
              className="text-sm px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              {getDeviceDisplayName(d.id, lang)}
            </Link>
          ))}
        </div>
        <Link href="/eq" className="inline-block mt-4 text-sm text-muted-foreground hover:text-primary transition-colors">
          {c.allDevices}
        </Link>
      </section>
    </GuideArticleView>
  )
}
