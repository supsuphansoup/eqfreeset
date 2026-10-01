'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage, type LangCode } from '@/lib/language-context'
import { GUIDES } from '@/lib/guides'

type FooterData = {
  service: string
  guides: string
  site: string
  links: {
    home: string
    test: string
    info: string
    allGuides: string
    contact: string
    terms: string
    privacy: string
    license: string
  }
}

const CONTENT: Record<LangCode, FooterData> = {
  ko: {
    service: '서비스',
    guides: '가이드',
    site: '사이트 정보',
    links: {
      home: '홈',
      test: '기기 EQ 테스트',
      info: 'EQ와 이 서비스에 대해',
      allGuides: '전체 가이드',
      contact: '개발자와 소통',
      terms: '이용약관',
      privacy: '개인정보 처리방침',
      license: 'AutoEq 라이선스',
    },
  },
  en: {
    service: 'Service',
    guides: 'Guides',
    site: 'About',
    links: {
      home: 'Home',
      test: 'Device EQ Test',
      info: 'About EQ & This Service',
      allGuides: 'All Guides',
      contact: 'Contact the Developer',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      license: 'AutoEq License',
    },
  },
  zh: {
    service: '服务',
    guides: '指南',
    site: '网站信息',
    links: {
      home: '首页',
      test: '设备EQ测试',
      info: '关于EQ与本服务',
      allGuides: '全部指南',
      contact: '联系开发者',
      terms: '服务条款',
      privacy: '隐私政策',
      license: 'AutoEq 许可证',
    },
  },
  ja: {
    service: 'サービス',
    guides: 'ガイド',
    site: 'サイト情報',
    links: {
      home: 'ホーム',
      test: 'デバイスEQテスト',
      info: 'EQとこのサービスについて',
      allGuides: 'ガイド一覧',
      contact: '開発者に連絡',
      terms: '利用規約',
      privacy: 'プライバシーポリシー',
      license: 'AutoEq ライセンス',
    },
  },
}

// 테스트 진행·결과 화면은 몰입형 UI라 푸터를 숨김 (BottomNav와 동일한 규칙)
const NO_FOOTER_PATHS = ['/test', '/result']

export function SiteFooter() {
  const pathname = usePathname()
  const { lang, t } = useLanguage()
  const c = CONTENT[lang] ?? CONTENT.ko

  const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  if (NO_FOOTER_PATHS.includes(clean)) return null

  const groups = [
    {
      heading: c.service,
      items: [
        { href: '/', label: c.links.home },
        { href: '/test', label: c.links.test },
        { href: '/info', label: c.links.info },
      ],
    },
    {
      heading: c.guides,
      items: [
        ...GUIDES.map((g) => ({ href: `/guide/${g.slug}`, label: g.title[lang] })),
        { href: '/guide', label: c.links.allGuides },
      ],
    },
    {
      heading: c.site,
      items: [
        { href: '/contact', label: c.links.contact },
        { href: '/terms', label: c.links.terms },
        { href: '/privacy', label: c.links.privacy },
        { href: '/license', label: c.links.license },
      ],
    },
  ]

  return (
    <footer className="border-t border-border mt-12">
      <div className="container mx-auto px-4 max-w-3xl py-10 text-xs text-muted-foreground">
        <nav aria-label="Footer" className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
          {groups.map((group) => (
            <div key={group.heading}>
              <p className="font-semibold text-foreground mb-3">{group.heading}</p>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <p className="text-muted-foreground/60">{t.home.footerSuno}</p>
        <p className="text-muted-foreground/60 mt-0.5">{t.home.footerCopyright}</p>
      </div>
    </footer>
  )
}
