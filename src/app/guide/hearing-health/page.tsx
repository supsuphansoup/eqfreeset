import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: '청력 보호를 위한 올바른 청취 습관 가이드',
  description: '소음성 난청 예방, 적정 볼륨 설정, 60/60 법칙 등 이어폰과 헤드폰을 건강하게 사용하는 방법을 안내합니다.',
  alternates: { canonical: '/guide/hearing-health' },
}

export default function HearingHealthPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">청력 보호 가이드</h1>
        <p className="text-muted-foreground">오랫동안 좋은 음악을 즐기기 위한 필수 청취 습관</p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">1. 소음성 난청, 왜 위험할까?</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              세계보건기구(WHO)에 따르면 전 세계 젊은 층 약 10억 명이 안전하지 않은 청취 습관으로 인해 청력 손실 위험에 노출되어 있습니다.
              이어폰이나 헤드폰을 통해 큰 소리에 장시간 노출되면 귀 내부의 <strong>유모세포(Hair Cells)</strong>가 손상됩니다.
            </p>
            <p>
              가장 무서운 점은 <strong>한 번 손상된 유모세포는 현대 의학으로 재생할 수 없다</strong>는 것입니다. 소음성 난청은 서서히 진행되기 때문에 본인이 인지했을 때는 이미 늦은 경우가 많습니다. 특히 고음역대(Treble) 소리부터 듣지 못하게 되는 것이 특징입니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">2. 안전한 볼륨의 기준은?</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              전문가들이 권장하는 안전한 소음 노출 기준은 <strong>85dB(데시벨) 이하</strong>입니다. 85dB은 어느 정도의 크기일까요?
            </p>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex justify-between items-center border-b pb-2"><span>소곤거리는 소리</span> <span>30dB (안전)</span></li>
                  <li className="flex justify-between items-center border-b pb-2"><span>일상적인 대화</span> <span>60dB (안전)</span></li>
                  <li className="flex justify-between items-center border-b pb-2"><span>시끄러운 식당, 진공청소기</span> <span>70~80dB (주의)</span></li>
                  <li className="flex justify-between items-center border-b pb-2 font-bold text-foreground"><span>안전 기준선 (8시간 이상 노출 금지)</span> <span>85dB</span></li>
                  <li className="flex justify-between items-center border-b pb-2 text-orange-500"><span>지하철 소음, 잔디깎이</span> <span>90~100dB (위험)</span></li>
                  <li className="flex justify-between items-center pb-2 text-red-500 font-bold"><span>클럽, 록 콘서트, 최대 볼륨 이어폰</span> <span>105~110dB (매우 위험)</span></li>
                </ul>
              </CardContent>
            </Card>
            <p className="text-sm mt-2">
              * 스마트폰 볼륨의 60~70% 수준이 보통 80~85dB 정도에 해당합니다. (기기에 따라 차이가 있습니다)
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">3. 청력을 지키는 &apos;60 / 60 법칙&apos;</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              청각 전문가들은 이어폰이나 헤드폰을 사용할 때 가장 기억하기 쉬운 규칙으로 <strong>60/60 법칙</strong>을 강조합니다.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-xl">🔊 볼륨은 최대 60% 이하로</CardTitle></CardHeader>
                <CardContent className="text-sm">
                  스마트폰 등 재생 기기의 최대 볼륨의 60%를 넘기지 마세요. 스마트폰의 &apos;볼륨 제한&apos; 또는 &apos;헤드폰 안전&apos; 기능을 활성화하여 85데시벨을 넘지 않도록 설정하는 것이 좋습니다.
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="text-xl">⏱️ 하루 60분 청취 후 휴식</CardTitle></CardHeader>
                <CardContent className="text-sm">
                  연속으로 60분 동안 음악을 들었다면, 반드시 이어폰을 빼고 귀에 10~15분 이상의 조용한 휴식 시간을 주어야 합니다. 청각 기관도 쉴 시간이 필요합니다.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">4. 노이즈 캔슬링(ANC)과 청력 보호의 관계</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              액티브 노이즈 캔슬링(ANC, Active Noise Cancellation) 기능은 주변 소음을 상쇄해 주는 기술입니다. 이 기술은 청력 보호에 <strong>매우 큰 도움</strong>이 됩니다.
            </p>
            <p>
              지하철이나 버스 같은 시끄러운 환경(보통 80~90dB)에서는 주변 소음을 뚫고 음악을 듣기 위해 무의식적으로 볼륨을 높이게 됩니다. 이때 이어폰의 볼륨은 청력을 손상시키는 100dB 이상으로 올라가기 쉽습니다.
            </p>
            <p>
              노이즈 캔슬링 기능이 있거나 차음성이 뛰어난 이어폰(인이어 타입, 폼팁 사용)을 사용하면, 주변 소음이 줄어들어 <strong>낮은 볼륨으로도 음악을 선명하게 감상</strong>할 수 있어 청력 보호에 매우 효과적입니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">5. EQ 튜닝을 통한 청력 보호 효과</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              맞지 않는 이어폰으로 음악을 들을 때, 특정 대역(예: 보컬)이 잘 들리지 않으면 전체 볼륨을 올리게 됩니다. 이렇게 되면 이미 충분히 큰 다른 대역(저음 등)의 소리까지 과도하게 커져 귀에 무리를 줍니다.
            </p>
            <p>
              <strong>EQ FreeSet</strong>을 통해 이어폰의 밸런스를 평탄하게 맞추면, 과도하게 강조된 음역대는 낮추고 부족한 음역대는 보완할 수 있습니다. 결과적으로 <strong>전체 볼륨을 낮춰도 모든 악기와 보컬의 소리가 선명하게 들리는 효과</strong>를 얻을 수 있으며, 이는 곧 청력 보호로 이어집니다.
            </p>
            <div className="text-center mt-6">
              <Button asChild className="btn-premium">
                <Link href="/test">볼륨을 낮춰도 선명한 나만의 EQ 찾기</Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="flex justify-between items-center pt-8 border-t">
          <Button variant="ghost" asChild>
            <Link href="/info">← EQ 가이드로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
