'use client'

import Link from 'next/link'
import { useLanguage, type LangCode } from '@/lib/language-context'
import { GUIDES } from '@/lib/guides'

const CONTENT: Record<LangCode, { label: string; title: string; desc: string }> = {
  ko: {
    label: '가이드',
    title: '이어폰 · EQ 가이드',
    desc: 'EQ를 적용하는 방법부터 주파수 대역의 의미, 측정 그래프 읽는 법, 블루투스 코덱, 청력 보호까지. 내 이어폰 소리를 이해하고 더 좋게 만드는 데 필요한 내용을 직접 정리했습니다.',
  },
  en: {
    label: 'Guides',
    title: 'Earphone & EQ Guides',
    desc: 'From applying EQ and what each frequency band means to reading measurement graphs, Bluetooth codecs and protecting your hearing. Everything you need to understand and improve how your earphones sound.',
  },
  zh: {
    label: '指南',
    title: '耳机 · EQ 指南',
    desc: '从EQ的设置方法、各频段的含义、测量曲线的读法，到蓝牙编解码器与听力保护。这里整理了理解并改善耳机声音所需的内容。',
  },
  ja: {
    label: 'ガイド',
    title: 'イヤホン・EQガイド',
    desc: 'EQの適用方法から周波数帯域の意味、測定グラフの読み方、Bluetoothコーデック、聴力保護まで。イヤホンの音を理解し、より良くするために必要な内容をまとめました。',
  },
}

export default function GuideIndexContent() {
  const { lang } = useLanguage()
  const c = CONTENT[lang] ?? CONTENT.ko

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="mb-10">
        <p className="label-xs mb-3">{c.label}</p>
        <h1 className="text-2xl font-bold tracking-tight mb-3">{c.title}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
      </div>

      <ul className="space-y-1">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guide/${g.slug}`}
              className="flex items-center justify-between gap-4 py-4 border-b border-border group"
            >
              <div>
                <h2 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{g.title[lang]}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.desc[lang]}</p>
              </div>
              <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
