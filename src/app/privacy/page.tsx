import type { Metadata } from 'next'
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description: 'EQ FreeSet의 개인정보 처리방침입니다. 광고 쿠키 및 데이터 처리에 관한 상세 안내를 확인하세요.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">개인정보 처리방침</h1>
      <p className="text-muted-foreground text-sm mb-8">시행일자: 2026년 5월 1일</p>
      <Card>
        <CardContent className="p-6 prose dark:prose-invert max-w-none space-y-6">

          <section>
            <h2 className="text-xl font-bold mb-2">1. 수집하는 개인정보 (무수집 원칙)</h2>
            <p>EQ FreeSet 서비스는 회원가입이나 로그인을 요구하지 않으며, 사용자를 식별할 수 있는 어떠한 <strong>개인정보도 서버에 수집하거나 저장하지 않습니다</strong>.</p>
            <p>테스트 진행 과정에서 선택한 기기 정보와 테스트 결과(EQ 설정값)는 전적으로 사용자의 브라우저 <strong>로컬 스토리지(Local Storage)</strong>에만 안전하게 저장됩니다. 따라서 사용자가 브라우저 데이터를 삭제하면 모든 정보가 함께 사라집니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">2. 광고 및 쿠키 (Google AdSense)</h2>
            <p>본 서비스는 <strong>Google AdSense</strong>를 통해 광고를 게재합니다. Google을 비롯한 제3자 광고 업체는 쿠키를 사용하여 사용자의 이전 방문 기록 및 관심사를 기반으로 <strong>맞춤형 광고</strong>를 제공할 수 있습니다.</p>
            <p>Google의 광고 쿠키 사용은 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google 광고 및 개인정보 보호정책</a>의 적용을 받습니다. 사용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google 광고 설정</a> 페이지에서 맞춤형 광고를 비활성화할 수 있습니다. 또한 <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary underline">aboutads.info</a>를 방문하여 제3자 쿠키 기반 맞춤 광고를 거부할 수 있습니다.</p>
            <p>광고 게재 과정에서 Google은 다음 정보를 수집할 수 있습니다.</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>방문한 페이지 URL 및 시간</li>
              <li>브라우저 유형 및 운영체제</li>
              <li>익명화된 IP 주소</li>
              <li>쿠키 및 광고 식별자(광고 ID)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">3. 통계 및 서비스 개선을 위한 데이터</h2>
            <p>서비스 이용성 향상과 접속 통계를 위해 <strong>Google Analytics</strong> 및 <strong>Microsoft Clarity</strong>를 사용합니다. 이 과정에서 IP 주소, 방문 일시, 브라우저 종류, 사용 패턴 등 익명화된 비식별 정보가 수집될 수 있으나, 이는 개인을 특정하는 데 사용되지 않습니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">4. 외부 서비스 연동 (Formspree)</h2>
            <p>&#39;개발자와 소통&#39; 폼을 통해 문의를 남기실 경우, 원활한 답변을 위해 사용자가 입력한 이메일 주소와 문의 내용이 Formspree를 통해 전송됩니다. 이 정보는 문의 응대 목적으로만 사용되며 제3자에게 제공되지 않습니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">5. 개인정보의 제3자 제공 및 위탁</h2>
            <p>본 서비스는 광고 서비스(Google AdSense) 운영 목적 외에는 사용자의 개인정보를 제3자에게 제공하거나 처리를 위탁하지 않습니다. Google AdSense와의 관계는 위 2항의 정책을 따릅니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">6. 쿠키 거부 방법</h2>
            <p>사용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다. 단, 쿠키 거부 시 일부 서비스 기능 이용에 제한이 생길 수 있습니다.</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Chrome:</strong> 설정 → 개인정보 보호 및 보안 → 쿠키 및 기타 사이트 데이터</li>
              <li><strong>Safari:</strong> 환경설정 → 개인정보 보호 → 쿠키 및 웹사이트 데이터</li>
              <li><strong>Firefox:</strong> 설정 → 개인정보 보호 → 쿠키 및 사이트 데이터</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">7. 문의처</h2>
            <p>서비스 이용 및 개인정보 관련 문의사항이 있으실 경우, 하단의 &#39;개발자와 소통&#39; 페이지를 통해 연락해 주시기 바랍니다.</p>
          </section>

        </CardContent>
      </Card>
    </main>
  )
}
