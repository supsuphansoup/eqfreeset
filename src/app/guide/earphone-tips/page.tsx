import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: '이어폰 구매 및 관리 완벽 가이드',
  description: '나에게 맞는 이어폰 고르는 법, 폼팁과 실리콘 팁의 차이, 이어폰 청소 및 보관법 등 이어폰을 100% 활용하는 팁을 알아보세요.',
  alternates: { canonical: '/guide/earphone-tips' },
}

export default function EarphoneTipsPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">이어폰 구매 및 관리 가이드</h1>
        <p className="text-muted-foreground">나에게 딱 맞는 이어폰을 찾고, 오래도록 깨끗하게 사용하는 방법</p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">1. 폼팁 vs 실리콘 팁, 무엇이 다를까?</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              이어폰(특히 인이어 모니터)의 소리와 착용감을 결정짓는 가장 중요한 요소 중 하나가 바로 <strong>이어팁(Ear-tip)</strong>입니다. 
              이어팁은 크게 실리콘 팁과 폼팁으로 나뉘며, 각각 명확한 장단점이 있습니다.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">💧 실리콘 팁 (Silicone Tips)</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>가장 대중적이고 기본적으로 제공되는 팁입니다.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>장점:</strong> 관리가 편하고 내구성이 좋음. 고음역대(Treble)가 선명하게 들리며, 세척이 용이함.</li>
                    <li><strong>단점:</strong> 귀 모양에 완벽히 밀착되지 않을 수 있어 차음성이 폼팁보다 다소 떨어질 수 있음.</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">🧽 폼팁 (Memory Foam Tips)</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>메모리 폼 소재로 만들어져 체온에 의해 팽창하는 팁입니다.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>장점:</strong> 외이도 모양에 맞게 팽창하여 밀폐력이 뛰어나 차음성이 압도적임. 저음역대(Bass)가 강화됨.</li>
                    <li><strong>단점:</strong> 수명이 짧음(보통 수개월 단위 교체). 귀지나 땀에 쉽게 오염되며 세척이 어려움. 고음이 약간 줄어들 수 있음.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <p className="mt-4">
              <strong>💡 EQ FreeSet의 꿀팁:</strong> 이어폰의 저음이 부족하게 느껴진다면 폼팁으로 교체해 보세요. 반대로 고음이 답답하다면 내경이 넓은 실리콘 팁(예: 스파이럴닷 팁 등)을 사용하면 효과를 볼 수 있습니다. 팁 교체 후 EQ FreeSet에서 다시 테스트를 진행하면 완벽한 조합을 찾을 수 있습니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">2. 나에게 맞는 이어폰 드라이버 고르기</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              이어폰 안에서 소리를 내는 부품을 <strong>드라이버(Driver)</strong>라고 합니다. 드라이버의 종류에 따라 소리의 결이 완전히 달라집니다.
            </p>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1">다이내믹 드라이버 (Dynamic Driver, DD)</h3>
                    <p className="text-sm">스피커와 같은 원리로 진동판을 울려 소리를 냅니다. <strong>자연스러운 울림, 풍부하고 깊은 저음</strong>이 특징입니다. 대중음악, 힙합, EDM에 잘 어울리며 가장 대중적으로 사용됩니다.</p>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1">밸런스드 아마추어 (Balanced Armature, BA)</h3>
                    <p className="text-sm">보청기에서 유래한 작은 금속 막대와 코일을 이용한 방식입니다. <strong>뛰어난 해상도와 선명한 고음, 빠른 반응 속도</strong>가 특징입니다. 보컬 위주의 음악이나 모니터링, 클래식에 적합합니다.</p>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1">하이브리드 (Hybrid)</h3>
                    <p className="text-sm">저음은 다이내믹 드라이버가, 중/고음은 BA 드라이버가 담당하도록 혼합한 구조입니다. 두 드라이버의 장점을 모두 취할 수 있어 최근 고급형 이어폰에서 많이 채택됩니다.</p>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1">평면 자력형 (Planar Magnetic)</h3>
                    <p className="text-sm">넓은 진동판 전체를 자력으로 고르게 울리는 방식입니다. 왜곡이 매우 적고 해상도가 압도적이지만, 구동하기 어려워 별도의 앰프가 필요한 경우가 많습니다.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">3. 이어폰 수명을 늘리는 관리 및 보관법</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              비싸게 주고 산 이어폰, 올바른 관리가 수명을 좌우합니다.
            </p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>단선 방지 보관법:</strong> 케이블을 기기에 칭칭 감아서 보관하는 것은 단선의 지름길입니다. &apos;오버-언더(Over-Under)&apos; 방식으로 둥글게 말아 전용 케이스에 보관하는 것이 좋습니다.</li>
              <li><strong>습기 관리:</strong> 전자기기는 습기에 취약합니다. 땀을 흘렸다면 마른 천으로 닦아내고, 보관 케이스 안에 실리카겔(제습제)을 하나 넣어두면 내부 부식을 막을 수 있습니다.</li>
              <li><strong>노즐 청소:</strong> 이어폰 노즐(소리가 나오는 구멍)에 귀지가 쌓이면 소리가 작아지거나 밸런스가 틀어집니다. 동봉된 청소 툴이나 부드러운 칫솔을 이용해 노즐이 아래를 향하게 한 뒤 가볍게 털어내세요. 액체를 사용하는 것은 절대 금물입니다.</li>
              <li><strong>커넥터 청소:</strong> 유선 이어폰의 3.5mm 플러그나 블루투스 이어폰의 충전 단자 부분은 알코올 스왑이나 지우개로 가끔 닦아주면 접촉 불량을 예방할 수 있습니다.</li>
            </ul>
          </div>
        </section>

        <section className="pt-6">
          <div className="bg-muted p-6 rounded-xl text-center">
            <h3 className="text-lg font-bold mb-2 text-foreground">내 이어폰의 진짜 소리를 찾아보세요</h3>
            <p className="text-muted-foreground mb-4">이어팁을 바꾸셨나요? 아니면 새 이어폰을 구매하셨나요? EQ FreeSet 테스트를 통해 기기의 잠재력을 100% 끌어올려 보세요.</p>
            <Button asChild className="btn-premium">
              <Link href="/test">EQ 테스트 시작하기</Link>
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
