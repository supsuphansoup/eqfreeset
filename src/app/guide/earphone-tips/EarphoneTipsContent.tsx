'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage, type LangCode } from '@/lib/language-context'

type EarphoneTipsData = {
  title: string
  subtitle: string
  backLink: string
  ctaTitle: string
  ctaDesc: string
  ctaBtn: string
  sections: {
    tips: {
      heading: string
      intro: string
      silicone: { title: string; intro: string; pros: string; cons: string }
      foam: { title: string; intro: string; pros: string; cons: string }
      eqTip: string
    }
    drivers: {
      heading: string
      intro: string
      dd: { title: string; text: string }
      ba: { title: string; text: string }
      hybrid: { title: string; text: string }
      planar: { title: string; text: string }
    }
    care: {
      heading: string
      intro: string
      tips: string[]
    }
  }
}

const CONTENT: Record<LangCode, EarphoneTipsData> = {
  ko: {
    title: '이어폰 구매 및 관리 가이드',
    subtitle: '나에게 딱 맞는 이어폰을 찾고, 오래도록 깨끗하게 사용하는 방법',
    backLink: '← EQ 가이드로 돌아가기',
    ctaTitle: '내 이어폰의 진짜 소리를 찾아보세요',
    ctaDesc: '이어팁을 바꾸셨나요? 아니면 새 이어폰을 구매하셨나요? EQ FreeSet 테스트를 통해 기기의 잠재력을 100% 끌어올려 보세요.',
    ctaBtn: 'EQ 테스트 시작하기',
    sections: {
      tips: {
        heading: '1. 폼팁 vs 실리콘 팁, 무엇이 다를까?',
        intro: '이어폰(특히 인이어)의 소리와 착용감을 결정짓는 가장 중요한 요소 중 하나가 이어팁입니다. 크게 실리콘 팁과 폼팁으로 나뉘며, 각각 명확한 장단점이 있습니다.',
        silicone: {
          title: '💧 실리콘 팁 (Silicone Tips)',
          intro: '가장 대중적이고 기본적으로 제공되는 팁입니다.',
          pros: '장점: 관리가 편하고 내구성이 좋음. 고음역대(Treble)가 선명하게 들리며, 세척이 용이함.',
          cons: '단점: 귀 모양에 완벽히 밀착되지 않을 수 있어 차음성이 폼팁보다 다소 떨어질 수 있음.',
        },
        foam: {
          title: '🧽 폼팁 (Memory Foam Tips)',
          intro: '메모리 폼 소재로 만들어져 체온에 의해 팽창하는 팁입니다.',
          pros: '장점: 외이도 모양에 맞게 팽창하여 밀폐력이 뛰어나 차음성이 압도적임. 저음역대(Bass)가 강화됨.',
          cons: '단점: 수명이 짧음(보통 수개월 단위 교체). 귀지나 땀에 쉽게 오염되며 세척이 어려움. 고음이 약간 줄어들 수 있음.',
        },
        eqTip: '💡 EQ FreeSet 꿀팁: 이어폰의 저음이 부족하다면 폼팁으로 교체해 보세요. 반대로 고음이 답답하다면 내경이 넓은 실리콘 팁을 사용하면 효과를 볼 수 있습니다. 팁 교체 후 EQ FreeSet에서 다시 테스트를 진행하면 완벽한 조합을 찾을 수 있습니다.',
      },
      drivers: {
        heading: '2. 나에게 맞는 이어폰 드라이버 고르기',
        intro: '이어폰 안에서 소리를 내는 부품을 드라이버(Driver)라고 합니다. 드라이버의 종류에 따라 소리의 결이 완전히 달라집니다.',
        dd: { title: '다이내믹 드라이버 (DD)', text: '스피커와 같은 원리로 진동판을 울려 소리를 냅니다. 자연스러운 울림, 풍부하고 깊은 저음이 특징입니다. 대중음악, 힙합, EDM에 잘 어울리며 가장 대중적으로 사용됩니다.' },
        ba: { title: '밸런스드 아마추어 (BA)', text: '보청기에서 유래한 방식입니다. 뛰어난 해상도와 선명한 고음, 빠른 반응 속도가 특징입니다. 보컬 위주의 음악이나 모니터링, 클래식에 적합합니다.' },
        hybrid: { title: '하이브리드 (Hybrid)', text: '저음은 다이내믹 드라이버가, 중/고음은 BA 드라이버가 담당하도록 혼합한 구조입니다. 두 드라이버의 장점을 모두 취할 수 있어 최근 고급형 이어폰에서 많이 채택됩니다.' },
        planar: { title: '평면 자력형 (Planar Magnetic)', text: '넓은 진동판 전체를 자력으로 고르게 울리는 방식입니다. 왜곡이 매우 적고 해상도가 압도적이지만, 구동하기 어려워 별도의 앰프가 필요한 경우가 많습니다.' },
      },
      care: {
        heading: '3. 이어폰 수명을 늘리는 관리 및 보관법',
        intro: '비싸게 주고 산 이어폰, 올바른 관리가 수명을 좌우합니다.',
        tips: [
          '단선 방지 보관법: 케이블을 기기에 감아서 보관하는 것은 단선의 지름길입니다. 오버-언더(Over-Under) 방식으로 둥글게 말아 전용 케이스에 보관하는 것이 좋습니다.',
          '습기 관리: 전자기기는 습기에 취약합니다. 땀을 흘렸다면 마른 천으로 닦아내고, 보관 케이스 안에 실리카겔(제습제)을 하나 넣어두면 내부 부식을 막을 수 있습니다.',
          '노즐 청소: 이어폰 노즐(소리가 나오는 구멍)에 귀지가 쌓이면 소리가 작아지거나 밸런스가 틀어집니다. 동봉된 청소 툴이나 부드러운 칫솔을 이용해 노즐이 아래를 향하게 한 뒤 가볍게 털어내세요. 액체를 사용하는 것은 절대 금물입니다.',
          '커넥터 청소: 유선 이어폰의 3.5mm 플러그나 블루투스 이어폰의 충전 단자 부분은 알코올 스왑이나 지우개로 가끔 닦아주면 접촉 불량을 예방할 수 있습니다.',
        ],
      },
    },
  },
  en: {
    title: 'Earphone Buying & Care Guide',
    subtitle: 'How to find the right earphones and keep them in top condition',
    backLink: '← Back to EQ Guide',
    ctaTitle: 'Discover your earphones\' true sound',
    ctaDesc: 'Changed your ear tips? Got new earphones? Use EQ FreeSet to bring out 100% of your device\'s potential.',
    ctaBtn: 'Start EQ Test',
    sections: {
      tips: {
        heading: '1. Foam Tips vs Silicone Tips — What\'s the Difference?',
        intro: 'Ear tips are one of the most important factors affecting the sound and fit of in-ear earphones. They come in two main types — silicone and foam — each with distinct pros and cons.',
        silicone: {
          title: '💧 Silicone Tips',
          intro: 'The most common type, usually included in the box.',
          pros: 'Pros: Easy to maintain and durable. Treble sounds clear and bright. Easy to clean.',
          cons: 'Cons: May not seal perfectly in every ear shape, leading to slightly weaker noise isolation than foam tips.',
        },
        foam: {
          title: '🧽 Memory Foam Tips',
          intro: 'Made from memory foam that expands with body heat to conform to your ear canal.',
          pros: 'Pros: Exceptional noise isolation due to the custom seal. Bass is noticeably enhanced.',
          cons: 'Cons: Shorter lifespan (usually replaced every few months). Prone to earwax and sweat buildup, difficult to clean. Treble may be slightly reduced.',
        },
        eqTip: '💡 EQ FreeSet Tip: If your earphones feel bass-light, try switching to foam tips. If the treble sounds muffled, a wide-bore silicone tip (like Spiral Dot) can help. After changing tips, re-test with EQ FreeSet to find the perfect combination.',
      },
      drivers: {
        heading: '2. Choosing the Right Driver Type',
        intro: 'The driver is the component inside your earphone that produces sound. Driver type dramatically affects the character of the sound.',
        dd: { title: 'Dynamic Driver (DD)', text: 'Works like a miniature speaker — a magnetic coil vibrates a diaphragm to produce sound. Known for natural, full-bodied bass. Great for pop, hip-hop, and EDM. The most widely used driver type.' },
        ba: { title: 'Balanced Armature (BA)', text: 'Originally developed for hearing aids, using a small armature and coil. Delivers excellent resolution, clear treble, and fast transient response. Best suited for vocal-focused music, monitoring, and classical.' },
        hybrid: { title: 'Hybrid', text: 'Combines DD for bass and BA for mids/highs, taking the strengths of both. Increasingly popular in high-end earphones.' },
        planar: { title: 'Planar Magnetic', text: 'Uses a large, flat diaphragm driven uniformly by magnets. Extremely low distortion and outstanding resolution, but requires more power — often needs a dedicated amplifier.' },
      },
      care: {
        heading: '3. Care & Storage Tips to Extend Earphone Life',
        intro: 'Proper care is crucial for maximizing the lifespan of your earphones.',
        tips: [
          'Prevent cable damage: Wrapping the cable tightly around your device is a sure way to cause breaks. Use the over-under coiling method and store in a dedicated case.',
          'Moisture control: Electronics are vulnerable to moisture. Wipe off sweat with a dry cloth after use, and keep a silica gel packet in your storage case to prevent internal corrosion.',
          'Nozzle cleaning: Earwax buildup in the nozzle (sound outlet) can reduce volume and alter sound balance. Use the included cleaning tool or a soft toothbrush — hold the nozzle downward and brush gently. Never use liquid.',
          'Connector cleaning: Occasionally clean the 3.5mm plug or Bluetooth charging port with an alcohol swab or pencil eraser to prevent connection issues.',
        ],
      },
    },
  },
  zh: {
    title: '耳机购买与保养指南',
    subtitle: '如何找到适合自己的耳机并长期保持良好状态',
    backLink: '← 返回EQ指南',
    ctaTitle: '发现你耳机的真实声音',
    ctaDesc: '换了耳套？还是购买了新耳机？通过EQ FreeSet测试，将你的设备潜力发挥到100%。',
    ctaBtn: '开始EQ测试',
    sections: {
      tips: {
        heading: '1. 泡沫耳套 vs 硅胶耳套，有什么区别？',
        intro: '耳套是影响入耳式耳机音质和佩戴感最重要的因素之一。主要分为硅胶耳套和泡沫耳套两种，各有明显的优缺点。',
        silicone: {
          title: '💧 硅胶耳套',
          intro: '最常见的类型，通常随耳机附带。',
          pros: '优点：易于维护，耐用性好。高频清晰明亮，清洁方便。',
          cons: '缺点：可能无法完全贴合每个人的耳道形状，隔音效果略逊于泡沫耳套。',
        },
        foam: {
          title: '🧽 泡沫耳套（记忆棉）',
          intro: '由记忆海绵制成，通过体温膨胀贴合耳道。',
          pros: '优点：贴合性极佳，隔音效果出色。低频明显增强。',
          cons: '缺点：使用寿命较短（通常数月更换一次）。容易沾染耳垢和汗水，清洁困难。高频可能略有减弱。',
        },
        eqTip: '💡 EQ FreeSet小贴士：如果感觉低音不足，可以尝试换用泡沫耳套。如果高音感觉闷，可以使用大孔径硅胶耳套（如螺旋点款）。更换耳套后，在EQ FreeSet重新测试，找到完美组合。',
      },
      drivers: {
        heading: '2. 选择适合自己的单元类型',
        intro: '驱动单元是耳机内产生声音的部件，单元类型对声音特性有决定性影响。',
        dd: { title: '动圈单元（DD）', text: '原理类似小型扬声器，通过磁圈振动振膜产生声音。自然的音染，低频饱满深沉。适合流行、嘻哈、EDM，是最广泛使用的单元类型。' },
        ba: { title: '动铁单元（BA）', text: '源于助听器技术，使用小型衔铁和线圈。解析力出色，高频清晰，瞬态响应快。最适合以人声为主的音乐、监听和古典乐。' },
        hybrid: { title: '混合单元（Hybrid）', text: '低频由动圈负责，中高频由动铁负责，兼具两者优点。在高端耳机中越来越流行。' },
        planar: { title: '平面磁力单元', text: '使用大型平面振膜由磁铁均匀驱动。失真极低，解析力卓越，但驱动难度大，通常需要专用放大器。' },
      },
      care: {
        heading: '3. 延长耳机寿命的保养与存放方法',
        intro: '正确保养对于延长耳机使用寿命至关重要。',
        tips: [
          '防断线存放：将线缆紧绕在设备上是造成断线的常见原因。建议使用过-下（Over-Under）绕线法，收入专用收纳盒。',
          '防潮管理：电子设备容易受潮。出汗后用干布擦拭，收纳盒内放入硅胶干燥剂可防止内部腐蚀。',
          '导管清洁：耳机导管（出音口）积累耳垢会导致音量变小或音色失衡。使用附带清洁工具或软毛牙刷，将导管朝下轻轻清扫。切忌使用液体。',
          '接头清洁：偶尔用酒精棉签或橡皮擦清洁3.5mm插头或蓝牙充电接口，可预防接触不良。',
        ],
      },
    },
  },
  ja: {
    title: 'イヤホン購入・管理ガイド',
    subtitle: '自分に合ったイヤホンを見つけ、長く清潔に使う方法',
    backLink: '← EQガイドに戻る',
    ctaTitle: 'イヤホンの本来の音を見つけましょう',
    ctaDesc: 'イヤーピースを交換しましたか？それとも新しいイヤホンを購入しましたか？EQ FreeSetのテストでデバイスのポテンシャルを100%引き出しましょう。',
    ctaBtn: 'EQテストを開始',
    sections: {
      tips: {
        heading: '1. フォームチップ vs シリコンチップ — 何が違う？',
        intro: 'イヤーピースは、インイヤーイヤホンのサウンドと装着感を左右する最も重要な要素の一つです。主にシリコンチップとフォームチップの2種類があり、それぞれ明確な長所と短所があります。',
        silicone: {
          title: '💧 シリコンチップ',
          intro: '最も一般的で、イヤホンに付属していることが多いタイプです。',
          pros: 'メリット：手入れが簡単で耐久性が高い。高域（トレブル）が鮮明に聴こえ、洗浄も容易。',
          cons: 'デメリット：耳の形状によっては完璧に密着しない場合があり、フォームチップと比べて遮音性がやや劣ることがある。',
        },
        foam: {
          title: '🧽 フォームチップ（メモリーフォーム）',
          intro: 'メモリーフォーム素材でできており、体温で膨張して耳道の形状にフィットします。',
          pros: 'メリット：外耳道に密着して圧倒的な遮音性を発揮。低域（バス）が強化される。',
          cons: 'デメリット：耐久性が低い（数ヶ月で交換が必要）。耳垢や汗で汚れやすく、洗浄が難しい。高音がわずかに減衰する場合がある。',
        },
        eqTip: '💡 EQ FreeSetのヒント：低音が物足りないと感じたら、フォームチップに交換してみてください。逆に高音がこもる場合は、内径の広いシリコンチップ（スパイラルドットなど）が効果的です。チップ交換後はEQ FreeSetで再テストして、完璧な組み合わせを見つけましょう。',
      },
      drivers: {
        heading: '2. 自分に合ったドライバーを選ぶ',
        intro: 'ドライバーはイヤホン内部で音を生成する部品です。ドライバーの種類によってサウンドキャラクターが全く異なります。',
        dd: { title: 'ダイナミックドライバー（DD）', text: 'スピーカーと同じ原理で振動板を振動させて音を出します。自然な響きと豊かで深みのある低音が特徴です。ポップ、ヒップホップ、EDMに最適で、最も広く使われているタイプです。' },
        ba: { title: 'バランスドアーマチュア（BA）', text: '補聴器から派生した方式で、小型のアーマチュアとコイルを使用します。優れた解像度と鮮明な高音、速い過渡応答が特徴です。ボーカル中心の音楽、モニタリング、クラシックに最適です。' },
        hybrid: { title: 'ハイブリッド', text: '低音はDDが、中高音はBAが担当する複合構造です。両方の長所を活かせるため、最近の高級イヤホンで多く採用されています。' },
        planar: { title: '平面磁力型（プレーナーマグネティック）', text: '広い振動板全体を磁力で均一に駆動する方式です。歪みが極めて少なく解像度が圧倒的ですが、駆動が難しく専用アンプが必要な場合が多いです。' },
      },
      care: {
        heading: '3. イヤホンの寿命を延ばすケアと保管方法',
        intro: '高価なイヤホンも、正しいケアが寿命を左右します。',
        tips: [
          '断線防止の保管：ケーブルをデバイスにぐるぐる巻き付けて保管するのは断線の原因になります。オーバー・アンダー方式で丸めて専用ケースに保管しましょう。',
          '湿気管理：電子機器は湿気に弱いです。汗をかいたら乾いた布で拭き取り、保管ケースにシリカゲル（乾燥剤）を入れておくと内部腐食を防げます。',
          'ノズル清掃：ノズル（音が出る穴）に耳垢が溜まると音量が小さくなったりバランスが崩れます。付属の清掃ツールや柔らかい歯ブラシを使い、ノズルを下に向けて軽く払いましょう。液体は絶対に使用しないでください。',
          'コネクター清掃：有線イヤホンの3.5mmプラグやBluetoothイヤホンの充電端子は、アルコールスワブや消しゴムで時々拭くと接触不良を防止できます。',
        ],
      },
    },
  },
}

export default function EarphoneTipsContent() {
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
        {/* Tips section */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">{s.tips.heading}</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>{s.tips.intro}</p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">{s.tips.silicone.title}</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>{s.tips.silicone.intro}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>{s.tips.silicone.pros}</strong></li>
                    <li><strong>{s.tips.silicone.cons}</strong></li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">{s.tips.foam.title}</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>{s.tips.foam.intro}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>{s.tips.foam.pros}</strong></li>
                    <li><strong>{s.tips.foam.cons}</strong></li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <p className="mt-4">{s.tips.eqTip}</p>
          </div>
        </section>

        {/* Drivers section */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">{s.drivers.heading}</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>{s.drivers.intro}</p>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {[s.drivers.dd, s.drivers.ba, s.drivers.hybrid, s.drivers.planar].map((driver) => (
                    <div key={driver.title} className="p-4">
                      <h3 className="font-bold text-foreground mb-1">{driver.title}</h3>
                      <p className="text-sm">{driver.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Care section */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">{s.care.heading}</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>{s.care.intro}</p>
            <ul className="list-disc pl-5 space-y-3">
              {s.care.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
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
