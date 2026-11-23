'use client'

import Link from '@/components/locale-link'
import { Button } from '@/components/ui/button'
import { useLanguage, type LangCode } from '@/lib/language-context'
import { FEATURED_DEVICES, getDeviceDisplayName, getDeviceHighlights } from '@/lib/device-guides'

const CONTENT: Record<LangCode, { label: string; title: string; desc: string; note: string; cta: string; ctaDesc: string }> = {
  ko: {
    label: '기기별 EQ',
    title: '기기별 EQ 설정값',
    desc: '인기 이어폰·헤드폰의 원래 소리가 기준(타깃 커브)과 비교해 어떤 성향인지, 균형을 맞추려면 EQ를 어떻게 넣으면 되는지 공개 측정 데이터를 바탕으로 정리했습니다. 각 기기 옆의 수치는 기준 대비 차이가 가장 큰 대역입니다.',
    note: '목록에 없는 기기도 EQ 테스트에서 100여 종 중 검색해 선택할 수 있습니다.',
    cta: '기기 EQ 테스트 시작',
    ctaDesc: '보정값은 출발점일 뿐입니다. 내 귀에 맞는 값은 A/B 블라인드 테스트로 찾아보세요.',
  },
  en: {
    label: 'Device EQ',
    title: 'EQ Settings by Device',
    desc: 'How popular earphones and headphones compare to a target curve, and how to EQ them toward balance, based on public measurements. The values next to each device are the ranges that differ most from the target.',
    note: 'Devices not listed here can be found among 100+ models in the EQ test.',
    cta: 'Start Device EQ Test',
    ctaDesc: 'A correction is only a starting point. Find values that fit your ears with an A/B blind test.',
  },
  zh: {
    label: '设备EQ',
    title: '按设备的EQ设置',
    desc: '基于公开测量数据，整理了热门耳机与头戴式耳机的原始声音与基准（目标曲线）相比的倾向，以及如何用EQ调到均衡。设备旁的数值是与基准差距最大的频段。',
    note: '未列出的设备也可以在EQ测试中从100多款型号中搜索选择。',
    cta: '开始设备EQ测试',
    ctaDesc: '校正值只是起点。通过A/B盲听测试找到适合你耳朵的数值。',
  },
  ja: {
    label: '機器別EQ',
    title: '機器別EQ設定',
    desc: '人気のイヤホン・ヘッドホン本来の音が基準（ターゲットカーブ）と比べてどんな傾向か、バランスを整えるにはどうEQを入れればよいかを、公開測定データをもとにまとめました。各機器の横の数値は基準との差が最も大きい帯域です。',
    note: '一覧にない機器も、EQテストで100種類以上の中から検索して選べます。',
    cta: 'デバイスEQテストを開始',
    ctaDesc: '補正値は出発点にすぎません。自分の耳に合う値はA/Bブラインドテストで見つけましょう。',
  },
}

export default function DeviceIndexContent() {
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
        {FEATURED_DEVICES.map((d) => (
          <li key={d.id}>
            <Link href={`/eq/${d.id}`} className="flex items-center justify-between gap-4 py-4 border-b border-border group">
              <div>
                <h2 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {getDeviceDisplayName(d.id, lang)}
                </h2>
                <p className="text-sm text-muted-foreground">{getDeviceHighlights(d.id, lang)}</p>
              </div>
              <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground mt-6">{c.note}</p>

      <section className="pt-10">
        <div className="bg-muted p-6 rounded-xl text-center">
          <p className="text-muted-foreground mb-4">{c.ctaDesc}</p>
          <Button asChild className="btn-premium">
            <Link href="/test">{c.cta}</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
