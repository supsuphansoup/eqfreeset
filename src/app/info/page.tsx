import type { Metadata } from 'next'
import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'EQ 정보 — EQ FreeSet',
  description: '이퀄라이저 원리, 주파수 대역 특성, A/B 블라인드 테스트, AutoEq 데이터 적용 방법에 대한 정보를 담았습니다.',
  alternates: { canonical: '/info' },
}

export default function InfoPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">

      {/* Page header */}
      <div className="mb-12">
        <p className="label-xs mb-3">정보</p>
        <h1 className="text-2xl font-bold tracking-tight mb-3">EQ와 이 서비스에 대해</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          EQ FreeSet을 처음 만든 이유는 단순합니다. 좋은 이어폰을 샀는데 소리가 마음에 안 들어서 AutoEq를 찾아봤고,
          그 데이터를 조금 더 쉽게 쓸 수 있었으면 했습니다. 여기서는 EQ가 어떻게 동작하는지,
          이 서비스가 어떤 방식으로 결과를 만드는지 간략히 정리했습니다.
        </p>
      </div>

      <div className="space-y-14">

        {/* EQ 기본 */}
        <section id="what-is-eq">
          <h2 className="text-base font-semibold mb-4 text-foreground">EQ가 하는 일</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              이퀄라이저는 소리를 구성하는 주파수 대역별로 음량을 올리거나 내립니다.
              사람이 들을 수 있는 범위는 대략 20Hz에서 20kHz인데, EQ는 이 구간을
              여러 밴드로 나누어 각각 따로 조절합니다.
            </p>
            <p>
              이어폰마다 소리 성향이 다른 건 제조사가 의도적으로 특정 대역을 강조하거나
              억제해서 그렇습니다. EQ로 이 성향을 보정하면 같은 기기로도 꽤 다른 소리를
              들을 수 있습니다. 물론 드라이버 자체의 한계는 EQ로 극복이 안 됩니다.
            </p>
          </div>
        </section>

        {/* 주파수 대역 */}
        <section id="frequency-bands">
          <h2 className="text-base font-semibold mb-4 text-foreground">주파수 대역별 특성</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            어떤 대역을 조절하면 어떤 소리가 바뀌는지 대략적으로만 알아도 결과를 해석하는 데 도움이 됩니다.
          </p>

          <div className="space-y-6 text-sm">
            <div className="border-l-2 border-border pl-4 space-y-1.5">
              <p className="font-medium text-foreground">저음 — 20Hz ~ 250Hz</p>
              <p className="text-muted-foreground leading-relaxed">
                60Hz 아래는 몸으로 느끼는 진동에 가깝습니다. 250Hz 근처까지가 베이스 기타, 킥 드럼의
                핵심 음역이고, 음악의 리듬감과 무게감을 담당합니다. 소비자용 이어폰 대부분이
                이 구간을 원본보다 강하게 표현합니다.
              </p>
            </div>

            <div className="border-l-2 border-border pl-4 space-y-1.5">
              <p className="font-medium text-foreground">중음 — 250Hz ~ 4kHz</p>
              <p className="text-muted-foreground leading-relaxed">
                보컬과 대부분 악기의 핵심 배음이 이 범위에 있습니다. 250~500Hz 구간이 뭉치면 소리가
                먹먹하게 들리고, 2~4kHz가 과하면 오래 듣기 피곤해집니다.
                음악 정보의 밀도가 가장 높은 대역이라 조금만 건드려도 체감이 큽니다.
              </p>
            </div>

            <div className="border-l-2 border-border pl-4 space-y-1.5">
              <p className="font-medium text-foreground">고음 — 4kHz ~ 20kHz</p>
              <p className="text-muted-foreground leading-relaxed">
                선명도, 공기감, 해상도를 결정합니다. 개인 청력에 따라 체감 차이가 가장 크게 나는
                대역이기도 합니다. 8kHz 이상은 심벌즈 찰랑거림이나 현악기의 질감을 만들고,
                12kHz 넘어서면 공간감에 영향을 줍니다.
              </p>
            </div>
          </div>
        </section>

        {/* A/B 테스트 */}
        <section id="ab-test">
          <h2 className="text-base font-semibold mb-4 text-foreground">A/B 블라인드 테스트 방식</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              두 소리를 번갈아 듣고 어느 쪽이 더 낫게 느껴지는지 고르는 방식입니다.
              어느 쪽이 EQ 적용본인지 모르는 상태에서 판단하기 때문에 심리적 편향이 줄어듭니다.
            </p>
            <p>
              사람의 뇌는 절대적인 기준보다 직접 비교에 훨씬 잘 반응합니다.
              &ldquo;이 소리가 좋다&rdquo;보다 &ldquo;이게 저것보다 낫다&rdquo;가 훨씬 판단하기 쉽고 정확합니다.
            </p>
          </div>

          <div className="mt-5 bg-muted/40 rounded-xl p-4 text-sm space-y-2">
            <p className="font-medium text-foreground text-xs tracking-widest uppercase mb-3">테스트 팁</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary shrink-0">—</span> 조용한 환경에서 하세요. 주변 소음이 있으면 미세한 차이를 놓칩니다.</li>
              <li className="flex gap-2"><span className="text-primary shrink-0">—</span> 평소 자주 듣는 곡을 쓰면 차이를 더 잘 잡아냅니다.</li>
              <li className="flex gap-2"><span className="text-primary shrink-0">—</span> 피곤한 상태에서는 판단이 흐려집니다. 귀가 쉰 상태에서 시작하세요.</li>
              <li className="flex gap-2"><span className="text-primary shrink-0">—</span> 저음에 집중할 땐 킥 드럼과 베이스를, 고음은 심벌즈를 기준으로 삼으면 좋습니다.</li>
            </ul>
          </div>
        </section>

        {/* AutoEq */}
        <section id="autoeq">
          <h2 className="text-base font-semibold mb-4 text-foreground">AutoEq 데이터에 대해</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              EQ FreeSet은 핀란드 엔지니어 Jaakko Pasanen이 만든
              오픈소스 프로젝트 AutoEq의 측정 데이터를 사용합니다.
              전문 측정 장비로 각 이어폰의 주파수 응답을 실측한 후,
              Harman Target이라는 기준 곡선에 맞춰 보정값을 계산한 결과입니다.
            </p>
            <p>
              Harman Target은 삼성 산하 오디오 연구소 하만에서 수천 명의 청취 선호도를 조사해
              도출한 목표 곡선입니다. 완전히 평탄한 것보다 저음이 약간 강조되고
              고음이 자연스럽게 내려가는 형태입니다.
            </p>
            <p>
              데이터는 MIT 라이선스 하에 공개되어 있습니다.
              EQ FreeSet은 이를 그대로 가져와서 사용자에게 전달하는 역할만 합니다.
            </p>
          </div>
          <div className="mt-4">
            <a
              href="https://github.com/jaakkopasanen/AutoEq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              AutoEq GitHub 저장소 →
            </a>
          </div>
        </section>

        {/* 앱 적용 */}
        <section id="apply-guide">
          <h2 className="text-base font-semibold mb-4 text-foreground">EQ 결과 적용하는 법</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div>
              <p className="font-medium text-foreground mb-1.5">Android — Wavelet (무료)</p>
              <p>
                AutoEq 데이터베이스가 내장된 시스템 EQ 앱입니다. Bluetooth도 됩니다.
                앱 설치 후 기기를 선택하면 자동으로 EQ가 적용됩니다.
                EQ FreeSet의 파라메트릭 EQ 값으로 추가 미세조정도 가능합니다.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1.5">iOS</p>
              <p>
                iOS는 시스템 전역 EQ를 지원하지 않습니다. Apple 음악 앱 내 EQ 설정을 쓰거나,
                정밀한 제어가 필요하면 Equalizer Fx 같은 서드파티 앱을 사용해야 합니다.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1.5">스트리밍 앱 내장 EQ</p>
              <p>
                Spotify는 홈 → 설정 → 재생 → 이퀄라이저에서 찾을 수 있고,
                YouTube Music은 프로필 → 설정 → 오디오 품질 → 이퀄라이저에 있습니다.
                Poweramp나 TIDAL도 자체 EQ를 지원합니다.
              </p>
            </div>
          </div>
        </section>

        {/* EQ 종류 */}
        <section id="eq-types">
          <h2 className="text-base font-semibold mb-4 text-foreground">그래픽 EQ vs 파라메트릭 EQ</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              그래픽 EQ는 미리 정해진 주파수 슬라이더를 올리내리는 방식입니다. 대부분의 음악 앱에 내장되어
              있고 직관적이지만, 원하는 정확한 주파수를 타깃하기가 어렵습니다.
            </p>
            <p>
              파라메트릭 EQ는 중심 주파수, 이득(dB), 대역폭(Q)을 직접 입력합니다.
              훨씬 정밀하게 조절할 수 있지만 전용 앱이 필요하고 진입 장벽이 있습니다.
              EQ FreeSet은 두 방식의 값을 모두 제공합니다.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <h2 className="text-base font-semibold mb-4 text-foreground">자주 묻는 것들</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-primary py-4">
                무료로 쓸 수 있나요?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                네, 기기 선택부터 테스트, 결과 확인, JSON 다운로드까지 전부 무료입니다. 회원가입도 없습니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-primary py-4">
                어떤 기기를 지원하나요?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                AutoEq 데이터베이스 기반으로 Sony, Sennheiser, Apple AirPods, Samsung Galaxy Buds 등 수백 종이 있습니다.
                기기 선택 화면에서 검색해서 확인해보세요.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-primary py-4">
                EQ를 적용하면 음질이 나빠지나요?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                ±6dB 정도의 조절은 음질 저하 없이 적용됩니다. 다만 10dB 이상 올리는 건 드라이버에 부담이 가거나
                왜곡이 생길 수 있어 권장하지 않습니다. EQ FreeSet 결과는 ±10dB 이내로 제한됩니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-primary py-4">
                내 이어폰이 목록에 없어요
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                개발자와 소통 페이지로 요청 주시면 AutoEq에 측정값이 있는 기기는 추가해 드리겠습니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-primary py-4">
                테스트 결과가 마음에 안 들면?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                언제든 다시 할 수 있습니다. 귀가 피로할 때나 볼륨이 너무 낮거나 높을 때 결과가 달라지기도 합니다.
                조용한 환경에서 적당한 볼륨으로 하는 게 가장 일관된 결과를 줍니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* 심화 가이드 링크 */}
        <section id="guides">
          <h2 className="text-base font-semibold mb-4 text-foreground">더 읽어볼 것들</h2>
          <div className="space-y-3">
            <Link
              href="/guide/earphone-tips"
              className="flex items-center justify-between py-3 border-b border-border hover:text-primary transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">이어폰 관리 및 팁</p>
                <p className="text-xs text-muted-foreground mt-0.5">팁 종류, 드라이버, 보관법</p>
              </div>
              <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
            </Link>
            <Link
              href="/guide/hearing-health"
              className="flex items-center justify-between py-3 border-b border-border hover:text-primary transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">청력 보호 가이드</p>
                <p className="text-xs text-muted-foreground mt-0.5">소음성 난청 예방, 60/60 법칙</p>
              </div>
              <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
            </Link>
            <Link
              href="/guide/eq-presets"
              className="flex items-center justify-between py-3 border-b border-border hover:text-primary transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">장르별 EQ 프리셋</p>
                <p className="text-xs text-muted-foreground mt-0.5">팝, 락, EDM, 클래식별 튜닝 포인트</p>
              </div>
              <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
            </Link>
          </div>
        </section>

        {/* Contact */}
        <section className="pt-4 border-t border-border">
          <Link
            href="/contact"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            개발자와 소통 →
          </Link>
        </section>

      </div>
    </main>
  )
}
