import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: '음악 장르별 추천 EQ 프리셋 가이드',
  description: '팝, 락, 클래식, EDM, 힙합 등 다양한 음악 장르에 최적화된 이퀄라이저 설정 방법과 주파수 대역별 튜닝 포인트를 확인하세요.',
  alternates: { canonical: '/guide/eq-presets' },
}

export default function EqPresetsPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">장르별 EQ 프리셋 가이드</h1>
        <p className="text-muted-foreground">음악 장르의 매력을 200% 끌어올리는 주파수 튜닝 비법</p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">1. 장르별 맞춤 EQ, 왜 필요할까?</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              EQ FreeSet을 통해 이어폰의 기본적인 밸런스를 맞췄다면(기기 자체의 왜곡 보정), 그 다음 단계는 <strong>장르나 취향에 맞는 &apos;양념&apos;을 치는 것</strong>입니다. 
            </p>
            <p>
              클래식 음악은 악기의 질감과 공간감이 중요하고, 힙합은 베이스의 타격감이 중요합니다. 이렇게 장르마다 핵심적으로 들려야 하는 주파수 대역이 다르기 때문에, 베이스가 평탄하게 잡힌 상태에서 목적에 맞게 특정 대역을 미세하게 조절하면 훨씬 더 감동적인 소리를 들을 수 있습니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">2. 주요 음악 장르별 EQ 조절 포인트</h2>
          
          <div className="space-y-6">
            {/* Pop */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-xl flex items-center gap-2">Pop / 보컬 중심 음악</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">팝 음악의 핵심은 가수의 목소리입니다. 보컬이 악기에 묻히지 않고 명료하게 들려야 합니다.</p>
                <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                  <li><strong>1kHz ~ 2kHz (보컬 대역):</strong> +1dB ~ +2dB 정도 살짝 올려주면 보컬이 한 걸음 앞으로 다가옵니다.</li>
                  <li><strong>250Hz ~ 500Hz:</strong> 과도하게 높으면 목소리가 멍멍해질 수 있으니 탁하다면 살짝 깎아주세요.</li>
                  <li><strong>4kHz ~ 8kHz (Presence):</strong> 숨소리나 디테일을 원하면 아주 약간만 올려줍니다.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Rock */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-xl flex items-center gap-2">Rock / Metal</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">일렉트릭 기타의 묵직한 디스토션, 드럼의 타격감, 베이스 기타의 리듬이 살아나야 합니다. 이른바 &apos;V자형&apos; EQ가 잘 어울리는 장르입니다.</p>
                <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                  <li><strong>60Hz ~ 120Hz (베이스/킥):</strong> +2dB ~ +4dB. 드럼 킥의 펀치감을 살립니다.</li>
                  <li><strong>250Hz ~ 500Hz (저음-중음):</strong> 약간 깎아주면(-1~-2dB) 기타 톤이 깔끔해집니다.</li>
                  <li><strong>4kHz ~ 8kHz (심벌즈/어택):</strong> +2dB ~ +3dB. 심벌즈와 스네어 드럼의 타격감을 날카롭게 살려줍니다.</li>
                </ul>
              </CardContent>
            </Card>

            {/* EDM / Hip-hop */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-xl flex items-center gap-2">EDM / Hip-Hop</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">심장을 울리는 서브 베이스와 선명한 하이햇(고음) 사운드가 생명입니다. Rock과 비슷한 V자형이지만 저음이 더 깊게 내려갑니다.</p>
                <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                  <li><strong>30Hz ~ 60Hz (서브 베이스):</strong> +3dB ~ +5dB. 베이스의 울림을 극대화합니다.</li>
                  <li><strong>125Hz ~ 250Hz:</strong> 붐붐거림(먹먹함)이 심하다면 살짝 낮춰줍니다.</li>
                  <li><strong>8kHz ~ 16kHz (에어/하이햇):</strong> +2dB. 전자음의 날카로움과 공간감을 부여합니다.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Classical */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-xl flex items-center gap-2">Classical / Acoustic / Jazz</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">가장 자연스럽고 평탄한 사운드가 요구됩니다. 인위적인 강조보다는 악기 고유의 질감과 콘서트홀의 현장감(공간감)을 살리는 것이 중요합니다.</p>
                <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                  <li><strong>전체적인 형태:</strong> 가급적 Flat(평탄) 상태를 유지합니다.</li>
                  <li><strong>30Hz ~ 60Hz:</strong> 콘트라베이스나 파이프 오르간의 깊이를 원한다면 +1dB 정도만 매우 조심스럽게 올립니다.</li>
                  <li><strong>10kHz ~ 16kHz:</strong> +1dB ~ +2dB. 콘서트홀의 &apos;공기감(Air)&apos;과 악기의 배음을 살려 넓은 공간감을 만들어냅니다.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">3. 프리셋 적용 시 주의사항</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-r-md">
              <p className="font-bold text-orange-500 mb-1">⚠️ 주의: 깎는 것이 올리는 것보다 낫습니다</p>
              <p className="text-sm">
                특정 대역을 올리기(Boost)보다는, 필요 없는 대역을 깎는(Cut) 방식이 오디오 왜곡(클리핑)을 방지하는 좋은 방법입니다. 예를 들어 저음을 강조하고 싶다면, 저음을 올리는 대신 고음과 중음을 살짝 낮추고 전체 볼륨을 올리는 것이 더 깨끗한 소리를 냅니다.
              </p>
            </div>
            <p>
              또한 위 가이드는 어디까지나 <strong>일반적인 추천 사항</strong>일 뿐 정답은 아닙니다. 사람마다 귀의 구조와 청력이 다르고 취향이 다르기 때문에, 이를 출발점으로 삼아 자신만의 최적 설정을 찾아보세요.
            </p>
          </div>
        </section>

        <section className="pt-6">
          <div className="bg-muted p-6 rounded-xl text-center">
            <h3 className="text-lg font-bold mb-2 text-foreground">완벽한 베이스라인 위에서 조절하세요</h3>
            <p className="text-muted-foreground mb-4">장르별 EQ를 제대로 적용하려면, 먼저 기기 자체의 왜곡을 바로잡는 <strong>기기 보정 EQ</strong>가 필요합니다. EQ FreeSet으로 기기 튜닝부터 시작하세요.</p>
            <Button asChild className="btn-premium">
              <Link href="/test">내 기기 보정 EQ 찾기</Link>
            </Button>
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
