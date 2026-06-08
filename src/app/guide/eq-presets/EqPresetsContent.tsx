'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage, type LangCode } from '@/lib/language-context'

type Genre = { title: string; desc: string; tips: string[] }
type PresetsData = {
  title: string
  subtitle: string
  backLink: string
  ctaTitle: string
  ctaDesc: string
  ctaBtn: string
  sections: {
    why: { heading: string; p1: string; p2: string }
    genres: {
      heading: string
      list: Genre[]
    }
    caution: {
      heading: string
      warning: { title: string; desc: string }
      note: string
    }
  }
}

const CONTENT: Record<LangCode, PresetsData> = {
  ko: {
    title: '장르별 EQ 프리셋 가이드',
    subtitle: '음악 장르의 매력을 200% 끌어올리는 주파수 튜닝 비법',
    backLink: '← EQ 가이드로 돌아가기',
    ctaTitle: '완벽한 베이스라인 위에서 조절하세요',
    ctaDesc: '장르별 EQ를 제대로 적용하려면, 먼저 기기 자체의 왜곡을 바로잡는 기기 보정 EQ가 필요합니다.',
    ctaBtn: '내 기기 보정 EQ 찾기',
    sections: {
      why: {
        heading: '1. 장르별 맞춤 EQ, 왜 필요할까?',
        p1: 'EQ FreeSet을 통해 이어폰의 기본적인 밸런스를 맞췄다면(기기 자체의 왜곡 보정), 그 다음 단계는 장르나 취향에 맞는 "양념"을 치는 것입니다.',
        p2: '클래식 음악은 악기의 질감과 공간감이 중요하고, 힙합은 베이스의 타격감이 중요합니다. 이처럼 장르마다 핵심 주파수 대역이 다르기 때문에, 목적에 맞게 특정 대역을 미세하게 조절하면 훨씬 더 감동적인 소리를 들을 수 있습니다.',
      },
      genres: {
        heading: '2. 주요 음악 장르별 EQ 조절 포인트',
        list: [
          {
            title: 'Pop / 보컬 중심 음악',
            desc: '팝 음악의 핵심은 가수의 목소리입니다. 보컬이 악기에 묻히지 않고 명료하게 들려야 합니다.',
            tips: [
              '1kHz ~ 2kHz (보컬 대역): +1~+2dB 정도 올려주면 보컬이 앞으로 다가옵니다.',
              '250Hz ~ 500Hz: 탁하다면 살짝 깎아주세요 (-1~-2dB).',
              '4kHz ~ 8kHz (Presence): 숨소리나 디테일을 원하면 아주 약간만 올립니다.',
            ],
          },
          {
            title: 'Rock / Metal',
            desc: '일렉트릭 기타의 묵직한 디스토션, 드럼의 타격감, 베이스의 리듬이 살아나야 합니다. V자형 EQ가 잘 어울리는 장르입니다.',
            tips: [
              '60Hz ~ 120Hz (베이스/킥): +2~+4dB. 드럼 킥의 펀치감을 살립니다.',
              '250Hz ~ 500Hz: 약간 깎아주면 (-1~-2dB) 기타 톤이 깔끔해집니다.',
              '4kHz ~ 8kHz (심벌즈/어택): +2~+3dB. 심벌즈와 스네어의 타격감을 날카롭게 살립니다.',
            ],
          },
          {
            title: 'EDM / Hip-Hop',
            desc: '심장을 울리는 서브 베이스와 선명한 하이햇 사운드가 생명입니다. Rock과 비슷한 V자형이지만 저음이 더 깊게 내려갑니다.',
            tips: [
              '30Hz ~ 60Hz (서브 베이스): +3~+5dB. 베이스의 울림을 극대화합니다.',
              '125Hz ~ 250Hz: 붐붐거림이 심하다면 살짝 낮춥니다.',
              '8kHz ~ 16kHz (에어/하이햇): +2dB. 전자음의 날카로움과 공간감을 부여합니다.',
            ],
          },
          {
            title: 'Classical / Acoustic / Jazz',
            desc: '가장 자연스럽고 평탄한 사운드가 요구됩니다. 인위적인 강조보다는 악기 고유의 질감과 공간감을 살리는 것이 중요합니다.',
            tips: [
              '전체적인 형태: 가급적 Flat(평탄) 상태를 유지합니다.',
              '30Hz ~ 60Hz: 콘트라베이스나 파이프 오르간의 깊이를 원한다면 +1dB 정도만 아주 조심스럽게 올립니다.',
              '10kHz ~ 16kHz: +1~+2dB. 콘서트홀의 공기감과 악기의 배음을 살려 공간감을 만듭니다.',
            ],
          },
        ],
      },
      caution: {
        heading: '3. 프리셋 적용 시 주의사항',
        warning: {
          title: '⚠️ 주의: 깎는 것이 올리는 것보다 낫습니다',
          desc: '특정 대역을 올리기(Boost)보다는, 필요 없는 대역을 깎는(Cut) 방식이 오디오 왜곡(클리핑)을 방지합니다. 예를 들어 저음을 강조하고 싶다면 저음을 올리는 대신 고음과 중음을 살짝 낮추고 전체 볼륨을 올리는 것이 더 깨끗한 소리를 냅니다.',
        },
        note: '위 가이드는 어디까지나 일반적인 추천 사항일 뿐 정답은 아닙니다. 사람마다 귀의 구조와 취향이 다르기 때문에, 이를 출발점으로 삼아 자신만의 최적 설정을 찾아보세요.',
      },
    },
  },
  en: {
    title: 'Genre EQ Preset Guide',
    subtitle: 'Frequency tuning tips to bring out 200% of each genre\'s character',
    backLink: '← Back to EQ Guide',
    ctaTitle: 'Start from a perfect baseline',
    ctaDesc: 'To apply genre EQ properly, you first need device correction EQ to fix your earphone\'s inherent coloration.',
    ctaBtn: 'Find My Device Correction EQ',
    sections: {
      why: {
        heading: '1. Why Do You Need Genre-Specific EQ?',
        p1: 'Once you\'ve balanced your earphone\'s baseline with EQ FreeSet (device correction), the next step is adding genre-specific "seasoning."',
        p2: 'Classical music emphasizes instrument texture and soundstage, while hip-hop prioritizes the punch of bass. Every genre has its key frequency range — subtle adjustments for each yield dramatically more satisfying results.',
      },
      genres: {
        heading: '2. EQ Tips by Music Genre',
        list: [
          {
            title: 'Pop / Vocal-Focused',
            desc: 'The centerpiece of pop is the vocalist. Vocals should be clear and upfront, not buried by instruments.',
            tips: [
              '1kHz ~ 2kHz (vocal range): +1~+2dB brings vocals forward.',
              '250Hz ~ 500Hz: Cut slightly (-1~-2dB) if the sound feels muddy.',
              '4kHz ~ 8kHz (Presence): A very small boost adds breath and detail.',
            ],
          },
          {
            title: 'Rock / Metal',
            desc: 'Electric guitar crunch, drum punch, and bass rhythm need to come alive. A V-shaped EQ works well here.',
            tips: [
              '60Hz ~ 120Hz (bass/kick): +2~+4dB. Adds punch to the kick drum.',
              '250Hz ~ 500Hz: Cut slightly (-1~-2dB) to clean up the guitar tone.',
              '4kHz ~ 8kHz (cymbals/attack): +2~+3dB. Sharpens the snap of cymbals and snare.',
            ],
          },
          {
            title: 'EDM / Hip-Hop',
            desc: 'Heart-thumping sub-bass and crisp hi-hats define the genre. Similar to rock\'s V-shape, but bass extends deeper.',
            tips: [
              '30Hz ~ 60Hz (sub-bass): +3~+5dB. Maximizes the rumble and impact of bass.',
              '125Hz ~ 250Hz: Cut slightly if there is too much boom or mud.',
              '8kHz ~ 16kHz (air/hi-hats): +2dB. Adds crispness and spaciousness to electronic elements.',
            ],
          },
          {
            title: 'Classical / Acoustic / Jazz',
            desc: 'The most natural, flat sound profile is needed. Rather than artificial emphasis, the goal is to preserve instrument texture and concert-hall space.',
            tips: [
              'Overall shape: Keep as flat (Flat) as possible.',
              '30Hz ~ 60Hz: Only a very cautious +1dB if you want more depth from double bass or pipe organ.',
              '10kHz ~ 16kHz: +1~+2dB. Adds air and harmonic overtones for a sense of concert-hall space.',
            ],
          },
        ],
      },
      caution: {
        heading: '3. Important Notes When Applying Presets',
        warning: {
          title: '⚠️ Cuts Beat Boosts',
          desc: 'Cutting unwanted frequencies is better than boosting desired ones — it avoids clipping and distortion. For example, to emphasize bass, try cutting the highs and mids slightly and then raising the overall volume instead.',
        },
        note: 'These are general starting points, not universal rules. Everyone\'s ears and preferences differ, so use these as a baseline and find your own perfect settings.',
      },
    },
  },
  zh: {
    title: '流派EQ预设指南',
    subtitle: '将各音乐流派魅力发挥到极致的频率调音秘诀',
    backLink: '← 返回EQ指南',
    ctaTitle: '在完美基准线上进行调整',
    ctaDesc: '要正确应用流派EQ，首先需要通过设备校正EQ来修正耳机自身的频响偏差。',
    ctaBtn: '找到我的设备校正EQ',
    sections: {
      why: {
        heading: '1. 为什么需要流派专属EQ？',
        p1: '通过EQ FreeSet完成耳机基础校准（设备本身的失真修正）后，下一步就是根据流派或个人喜好添加"调味料"。',
        p2: '古典音乐注重乐器质感和空间感，嘻哈音乐重视低音的冲击感。每种流派的核心频段不同，针对性地微调特定频段，可以获得更震撼的听感。',
      },
      genres: {
        heading: '2. 主要音乐流派EQ调节要点',
        list: [
          {
            title: 'Pop / 人声为主',
            desc: '流行音乐的核心是歌手的声音。人声应该清晰突出，不被乐器掩盖。',
            tips: [
              '1kHz ~ 2kHz（人声频段）：提升+1~+2dB，让人声更加突出。',
              '250Hz ~ 500Hz：如果声音发闷，适当削减-1~-2dB。',
              '4kHz ~ 8kHz（临场感）：如需增加气息感和细节，非常轻微地提升。',
            ],
          },
          {
            title: 'Rock / Metal',
            desc: '电吉他的厚重失真、鼓的冲击感、贝斯的节奏感需要充分展现。V型EQ非常适合这个流派。',
            tips: [
              '60Hz ~ 120Hz（低音/底鼓）：+2~+4dB，增强底鼓的冲击力。',
              '250Hz ~ 500Hz：轻微削减-1~-2dB，让吉他音色更清晰。',
              '4kHz ~ 8kHz（镲片/Attack）：+2~+3dB，使镲片和军鼓的打击感更锐利。',
            ],
          },
          {
            title: 'EDM / Hip-Hop',
            desc: '震撼心灵的超低音和清脆的击打声是这类流派的灵魂。与摇滚相似的V型EQ，但低频延伸更深。',
            tips: [
              '30Hz ~ 60Hz（超低音）：+3~+5dB，最大化低音的轰鸣感。',
              '125Hz ~ 250Hz：如果浑浊感过强，适当降低。',
              '8kHz ~ 16kHz（空气感/击打声）：+2dB，为电子音增添清脆感和空间感。',
            ],
          },
          {
            title: 'Classical / Acoustic / Jazz',
            desc: '需要最自然、平坦的声音。与其人为强调，不如保留乐器本身的质感和音乐厅的空间感。',
            tips: [
              '整体形态：尽量保持平坦（Flat）状态。',
              '30Hz ~ 60Hz：如果想要低音提琴或管风琴的深度，极其谨慎地提升+1dB。',
              '10kHz ~ 16kHz：+1~+2dB，保留音乐厅的空气感和乐器泛音，营造空间感。',
            ],
          },
        ],
      },
      caution: {
        heading: '3. 应用预设时的注意事项',
        warning: {
          title: '⚠️ 注意：削减优于提升',
          desc: '相较于提升（Boost）某些频段，削减（Cut）不需要的频段更能防止音频失真（截波）。例如，想强调低音时，不要提升低频，而是稍微降低高频和中频后再提高整体音量，这样能获得更干净的声音。',
        },
        note: '上述指南仅为一般性建议，并非绝对标准。每个人的耳朵结构和喜好不同，请以此为起点，寻找自己的最佳设置。',
      },
    },
  },
  ja: {
    title: 'ジャンル別EQプリセットガイド',
    subtitle: '音楽ジャンルの魅力を200%引き出す周波数チューニングのコツ',
    backLink: '← EQガイドに戻る',
    ctaTitle: '完璧なベースラインの上で調整しましょう',
    ctaDesc: 'ジャンル別EQを正しく適用するためには、まずデバイス自体の歪みを補正するデバイス補正EQが必要です。',
    ctaBtn: '自分のデバイス補正EQを探す',
    sections: {
      why: {
        heading: '1. ジャンル別EQはなぜ必要か？',
        p1: 'EQ FreeSetでイヤホンの基本的なバランスを整えたら（デバイス自体の歪み補正）、次のステップはジャンルや好みに合わせた「スパイス」を加えることです。',
        p2: 'クラシック音楽では楽器の質感と空間感が重要で、ヒップホップではベースの打撃感が重要です。ジャンルごとに核心的な周波数帯域が異なるため、目的に合わせて微調整すれば、より感動的なサウンドが楽しめます。',
      },
      genres: {
        heading: '2. 主要な音楽ジャンル別EQ調整ポイント',
        list: [
          {
            title: 'Pop / ボーカル中心',
            desc: 'ポップ音楽の核心は歌手の声です。ボーカルが楽器に埋もれず、明瞭に聴こえる必要があります。',
            tips: [
              '1kHz ~ 2kHz（ボーカル帯域）：+1~+2dBほど上げるとボーカルが前に出てきます。',
              '250Hz ~ 500Hz：こもって聴こえる場合は少し削りましょう（-1~-2dB）。',
              '4kHz ~ 8kHz（プレゼンス）：息遣いやディテールが欲しい場合はごくわずかに上げます。',
            ],
          },
          {
            title: 'Rock / Metal',
            desc: 'エレキギターの重厚なディストーション、ドラムの打撃感、ベースのリズムが活きてくる必要があります。V字型EQが合うジャンルです。',
            tips: [
              '60Hz ~ 120Hz（ベース/キック）：+2~+4dB。キックドラムのパンチ感を活かします。',
              '250Hz ~ 500Hz：少し削ると（-1~-2dB）ギタートーンがスッキリします。',
              '4kHz ~ 8kHz（シンバル/アタック）：+2~+3dB。シンバルとスネアの打撃感を鋭くします。',
            ],
          },
          {
            title: 'EDM / Hip-Hop',
            desc: '心臓に響くサブベースと鮮明なハイハットサウンドが命です。ロックに似たV字型ですが、低音がより深く下がります。',
            tips: [
              '30Hz ~ 60Hz（サブベース）：+3~+5dB。ベースの響きを最大化します。',
              '125Hz ~ 250Hz：こもりが激しい場合は少し下げましょう。',
              '8kHz ~ 16kHz（エア/ハイハット）：+2dB。電子音の鋭さと空間感を与えます。',
            ],
          },
          {
            title: 'Classical / Acoustic / Jazz',
            desc: '最も自然でフラットなサウンドが求められます。人工的な強調よりも楽器固有の質感とコンサートホールの現場感を活かすことが重要です。',
            tips: [
              '全体的な形状：できるだけフラット（Flat）な状態を維持します。',
              '30Hz ~ 60Hz：コントラバスやパイプオルガンの深みが欲しい場合は、非常に慎重に+1dBのみ上げます。',
              '10kHz ~ 16kHz：+1~+2dB。コンサートホールの空気感と楽器の倍音を活かし、広い空間感を生み出します。',
            ],
          },
        ],
      },
      caution: {
        heading: '3. プリセット適用時の注意事項',
        warning: {
          title: '⚠️ 注意：カットの方がブーストより優れています',
          desc: '特定の帯域を上げる（Boost）よりも、不要な帯域を削る（Cut）方がオーディオ歪み（クリッピング）を防ぎます。例えば低音を強調したい場合、低音を上げる代わりに高音と中音を少し下げてから全体の音量を上げると、よりクリアな音が得られます。',
        },
        note: '上記のガイドはあくまで一般的な推奨であり、正解ではありません。人それぞれ耳の形状と好みが異なるため、これを出発点として自分だけの最適設定を見つけてください。',
      },
    },
  },
}

export default function EqPresetsContent() {
  const { lang } = useLanguage()
  const c = CONTENT[lang] ?? CONTENT.ko
  const s = c.sections

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{c.title}</h1>
        <p className="text-muted-foreground">{c.subtitle}</p>
      </div>

      <div className="space-y-10">
        {/* Why */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">{s.why.heading}</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>{s.why.p1}</p>
            <p>{s.why.p2}</p>
          </div>
        </section>

        {/* Genres */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">{s.genres.heading}</h2>
          <div className="space-y-6">
            {s.genres.list.map((genre) => (
              <Card key={genre.title}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">{genre.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{genre.desc}</p>
                  <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                    {genre.tips.map((tip, i) => {
                      const colonIdx = tip.indexOf(':')
                      if (colonIdx === -1) return <li key={i}>{tip}</li>
                      const prefix = tip.slice(0, colonIdx + 1)
                      const rest = tip.slice(colonIdx + 1)
                      return (
                        <li key={i}>
                          <strong>{prefix}</strong>{rest}
                        </li>
                      )
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Caution */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">{s.caution.heading}</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-r-md">
              <p className="font-bold text-orange-500 mb-1">{s.caution.warning.title}</p>
              <p className="text-sm">{s.caution.warning.desc}</p>
            </div>
            <p>{s.caution.note}</p>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-6">
          <div className="bg-muted p-6 rounded-xl text-center">
            <h3 className="text-lg font-bold mb-2 text-foreground">{c.ctaTitle}</h3>
            <p className="text-muted-foreground mb-4">{c.ctaDesc}</p>
            <Button asChild className="btn-premium">
              <Link href="/test">{c.ctaBtn}</Link>
            </Button>
          </div>
        </section>

        <div className="flex justify-between items-center pt-8 border-t">
          <Button variant="ghost" asChild>
            <Link href="/info">{c.backLink}</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
