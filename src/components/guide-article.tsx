'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage, type LangCode } from '@/lib/language-context'
import { GUIDES, type GuideBlock, type GuideContent } from '@/lib/guides'

const UI: Record<LangCode, { backLink: string; related: string; ctaTitle: string; ctaDesc: string; ctaBtn: string }> = {
  ko: {
    backLink: '← 전체 가이드 보기',
    related: '다른 가이드',
    ctaTitle: '내 기기에 맞는 EQ부터 찾아보세요',
    ctaDesc: 'A/B 블라인드 테스트로 3분 만에 내 귀와 이어폰에 맞는 EQ 값을 받을 수 있습니다.',
    ctaBtn: '기기 EQ 테스트 시작',
  },
  en: {
    backLink: '← All Guides',
    related: 'More Guides',
    ctaTitle: 'Start with an EQ made for your device',
    ctaDesc: 'Get EQ values tuned to your ears and earphones in 3 minutes with an A/B blind test.',
    ctaBtn: 'Start Device EQ Test',
  },
  zh: {
    backLink: '← 全部指南',
    related: '其他指南',
    ctaTitle: '先找到适合你设备的EQ',
    ctaDesc: '通过A/B盲听测试，3分钟即可获得适合你耳朵和耳机的EQ数值。',
    ctaBtn: '开始设备EQ测试',
  },
  ja: {
    backLink: '← ガイド一覧',
    related: 'ほかのガイド',
    ctaTitle: 'まずは自分のデバイスに合うEQを',
    ctaDesc: 'A/Bブラインドテストで、3分で自分の耳とイヤホンに合ったEQ値を見つけられます。',
    ctaBtn: 'デバイスEQテストを開始',
  },
}

function ListItem({ text }: { text: string }) {
  // 반각(:)과 전각(：) 콜론 중 먼저 나오는 것을 라벨 구분자로 사용 (중국어·일본어 대응)
  const colonIdx = text.search(/[:：]/)
  // "라벨: 설명" 형태만 라벨을 굵게 (URL·시간 표기의 콜론은 제외하도록 앞부분 길이 제한)
  if (colonIdx === -1 || colonIdx > 40) return <li>{text}</li>
  return (
    <li>
      <strong className="text-foreground">{text.slice(0, colonIdx + 1)}</strong>
      {text.slice(colonIdx + 1)}
    </li>
  )
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case 'p':
      return <p>{block.text}</p>
    case 'list':
      return (
        <ul className="list-disc pl-5 space-y-2">
          {block.items.map((item, i) => <ListItem key={i} text={item} />)}
        </ul>
      )
    case 'table':
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} className="text-left font-semibold text-foreground border-b border-border py-2 pr-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border-b border-border py-2 pr-3 align-top">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'note':
      return (
        <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-md">
          <p className="font-bold text-foreground mb-1">{block.title}</p>
          <p className="text-sm">{block.text}</p>
        </div>
      )
  }
}

export function GuideArticleView({ slug, content }: { slug: string; content: GuideContent }) {
  const { lang } = useLanguage()
  const c = content[lang] ?? content.ko
  const ui = UI[lang] ?? UI.ko
  // 현재 글 다음 순서의 가이드 4개를 순환하며 추천 (모든 글이 고르게 링크되도록)
  const idx = GUIDES.findIndex((g) => g.slug === slug)
  const related = [1, 2, 3, 4].map((k) => GUIDES[(idx + k) % GUIDES.length])

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{c.title}</h1>
          <p className="text-muted-foreground">{c.subtitle}</p>
        </header>

        <p className="text-muted-foreground leading-relaxed mb-10">{c.intro}</p>

        <div className="space-y-10">
          {c.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b">{section.heading}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {section.blocks.map((block, i) => <Block key={i} block={block} />)}
              </div>
            </section>
          ))}
        </div>
      </article>

      {/* CTA */}
      <section className="pt-12">
        <div className="bg-muted p-6 rounded-xl text-center">
          <h2 className="text-lg font-bold mb-2 text-foreground">{ui.ctaTitle}</h2>
          <p className="text-muted-foreground mb-4">{ui.ctaDesc}</p>
          <Button asChild className="btn-premium">
            <Link href="/test">{ui.ctaBtn}</Link>
          </Button>
        </div>
      </section>

      {/* 관련 가이드 */}
      <section className="pt-10">
        <h2 className="text-base font-semibold mb-4 text-foreground">{ui.related}</h2>
        <div className="space-y-3">
          {related.map((g) => (
            <Link
              key={g.slug}
              href={`/guide/${g.slug}`}
              className="flex items-center justify-between py-3 border-b border-border group"
            >
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{g.title[lang]}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{g.desc[lang]}</p>
              </div>
              <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="pt-8">
        <Button variant="ghost" asChild>
          <Link href="/guide">{ui.backLink}</Link>
        </Button>
      </div>
    </main>
  )
}
