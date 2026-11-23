import type { Metadata } from 'next'
import { GUIDES } from '@/lib/guides'
import { getDeviceDisplayName } from '@/lib/device-guides'
import { ROUTE_LANGS, languageAlternates, localizePath, type RouteLang } from '@/lib/locale-routes'

// /en/, /zh/, /ja/ 페이지의 제목·설명 (한국어 페이지는 각 page.tsx의 metadata를 그대로 쓴다)

type Meta = { title: string; description: string }

const OG_LOCALE: Record<RouteLang, string> = { en: 'en_US', zh: 'zh_CN', ja: 'ja_JP' }

const PAGES: Record<'home' | 'test' | 'guide' | 'eq' | 'tools', Record<RouteLang, Meta>> = {
  home: {
    en: {
      title: 'EQ FreeSet — Personal EQ for Your Earphones and Headphones',
      description: 'Find equalizer settings for your earphones and headphones for free. An A/B blind test finds EQ values that fit your ears, and you can download the result as JSON.',
    },
    zh: {
      title: 'EQ FreeSet — 通过试听找到适合你的耳机EQ',
      description: '免费找到适合你的耳机与头戴式耳机的均衡器设置。通过A/B盲听测试得到适合你耳朵的EQ数值，并可下载为JSON。',
    },
    ja: {
      title: 'EQ FreeSet — 聴き比べで見つけるイヤホン・ヘッドホンの自分用EQ',
      description: 'イヤホンやヘッドホンに合うイコライザー設定を無料で見つけましょう。A/Bブラインドテストで自分の耳に合うEQ値がわかり、結果はJSONでダウンロードできます。',
    },
  },
  test: {
    en: {
      title: 'EQ A/B Test — Find the Sound That Fits Your Ears',
      description: 'Choose your earphones or headphones and a music genre, then take an A/B blind test to find equalizer settings that suit you in a few minutes.',
    },
    zh: {
      title: 'EQ A/B测试 — 找到适合你耳朵的声音',
      description: '选择耳机和音乐类型后进行A/B盲听测试，几分钟内即可找到适合你的均衡器设置。',
    },
    ja: {
      title: 'EQ A/Bテスト — 自分の耳に合う音を見つける',
      description: 'イヤホンやヘッドホンと音楽ジャンルを選び、A/Bブラインドテストを進めると数分で自分に合うイコライザー設定が見つかります。',
    },
  },
  guide: {
    en: {
      title: 'Earphone & EQ Guides',
      description: 'Guides on applying EQ, frequency bands, reading frequency response graphs, Bluetooth codecs, blind testing, troubleshooting and protecting your hearing.',
    },
    zh: {
      title: '耳机 · EQ 指南',
      description: '涵盖EQ设置方法、频段含义、频响曲线读法、蓝牙编解码器、盲听测试、故障排除与听力保护的指南合集。',
    },
    ja: {
      title: 'イヤホン・EQガイド',
      description: 'EQの適用方法、周波数帯域、周波数特性グラフの読み方、Bluetoothコーデック、ブラインドテスト、トラブル対処、聴力保護までのガイド集です。',
    },
  },
  eq: {
    en: {
      title: 'EQ Settings by Device · AirPods, Galaxy Buds, Sony, Bose',
      description: 'Measurement-based sound signatures and 10-band EQ corrections for popular earphones and headphones such as AirPods Pro 2, Galaxy Buds3 Pro and Sony WF-1000XM5.',
    },
    zh: {
      title: '按设备的EQ设置 · AirPods、Galaxy Buds、索尼、Bose',
      description: '按设备整理AirPods Pro 2、Galaxy Buds3 Pro、索尼WF-1000XM5等热门耳机的测量声音倾向与10段EQ校正值。',
    },
    ja: {
      title: '機器別EQ設定 · AirPods、Galaxy Buds、ソニー、Bose',
      description: 'AirPods Pro 2、Galaxy Buds3 Pro、ソニーWF-1000XM5など人気イヤホン・ヘッドホンの測定に基づく音の傾向と10バンドEQ補正値を機器別にまとめました。',
    },
  },
  tools: {
    en: {
      title: 'Earphone Left/Right Test · Frequency Sweep · Mic Test',
      description: 'Check left and right channels, a 20Hz–20kHz frequency sweep and your headset mic with recording, right in the browser. Sound and recordings never leave your device.',
    },
    zh: {
      title: '耳机左右声道测试 · 频率扫描 · 麦克风测试',
      description: '无需安装，在浏览器中检查耳机左右声道、20Hz–20kHz频率扫描以及麦克风输入与录音。声音和录音不会离开你的设备。',
    },
    ja: {
      title: 'イヤホン左右テスト · 周波数スイープ · マイクテスト',
      description: 'インストール不要で、ブラウザからイヤホンの左右チャンネル、20Hz–20kHzの周波数スイープ、マイク入力と録音を確認できます。音声と録音は端末の外に送信されません。',
    },
  },
}

const DEVICE_META: Record<RouteLang, (name: string) => Meta> = {
  en: (name) => ({
    title: `${name} EQ Settings · 10-Band Correction`,
    description: `The ${name}'s measured sound signature (bass, vocals, treble), a 10-band EQ correction, preamp and how to apply it in apps.`,
  }),
  zh: (name) => ({
    title: `${name} EQ设置推荐 · 10段校正表`,
    description: `${name}基于测量的声音倾向（低音、人声、高音）、10段EQ校正值、前级增益以及在应用中设置EQ的方法。`,
  }),
  ja: (name) => ({
    title: `${name} EQ設定おすすめ · 10バンド補正表`,
    description: `${name}の測定に基づく音の傾向（低音・ボーカル・高音）、10バンドEQ補正値、プリアンプ、アプリでのEQ適用方法をまとめました。`,
  }),
}

export function langStaticParams() {
  return ROUTE_LANGS.map((lang) => ({ lang }))
}

/** path는 한국어 canonical 경로 (예: '/guide/apply-eq/') */
export function buildLocalizedMetadata(lang: RouteLang, path: string, meta: Meta, absoluteTitle = false): Metadata {
  const url = localizePath(path, lang)
  return {
    title: absoluteTitle ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://eqfreeset.pages.dev${url}`,
      siteName: 'EQ FreeSet',
      locale: OG_LOCALE[lang],
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'EQ FreeSet' }],
    },
  }
}

export function pageMetadata(lang: RouteLang, page: keyof typeof PAGES) {
  const path = page === 'home' ? '/' : `/${page}/`
  return buildLocalizedMetadata(lang, path, PAGES[page][lang], page === 'home')
}

export function guideMetadata(lang: RouteLang, slug: string) {
  const guide = GUIDES.find((g) => g.slug === slug)
  if (!guide) return {}
  return buildLocalizedMetadata(lang, `/guide/${slug}/`, { title: guide.title[lang], description: guide.desc[lang] })
}

export function deviceMetadata(lang: RouteLang, id: string) {
  return buildLocalizedMetadata(lang, `/eq/${id}/`, DEVICE_META[lang](getDeviceDisplayName(id, lang)))
}
