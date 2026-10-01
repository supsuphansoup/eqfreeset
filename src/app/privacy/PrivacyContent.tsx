'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useLanguage, type LangCode } from '@/lib/language-context'

type Section = { heading: string; body: string[] }

type PrivacyData = {
  title: string
  effectiveDate: string
  sections: Section[]
}

const CONTENT: Record<LangCode, PrivacyData> = {
  ko: {
    title: '개인정보 처리방침',
    effectiveDate: '시행일자: 2026년 5월 1일',
    sections: [
      {
        heading: '1. 수집하는 개인정보 (무수집 원칙)',
        body: [
          'EQ FreeSet은 회원가입이나 로그인을 요구하지 않으며, 사용자를 식별할 수 있는 어떠한 개인정보도 서버에 수집하거나 저장하지 않습니다.',
          '테스트 진행 과정에서 선택한 기기 정보와 테스트 결과(EQ 설정값)는 전적으로 사용자의 브라우저 로컬 스토리지(Local Storage)에만 저장됩니다. 브라우저 데이터를 삭제하면 모든 정보가 함께 사라집니다.',
        ],
      },
      {
        heading: '2. 광고 및 쿠키 (Google AdSense)',
        body: [
          '본 서비스는 Google AdSense를 통해 광고를 게재합니다. Google을 비롯한 제3자 광고 업체는 쿠키를 사용하여 맞춤형 광고를 제공할 수 있습니다.',
          '광고 게재 과정에서 Google은 방문 페이지 URL 및 시간, 브라우저 유형 및 운영체제, 익명화된 IP 주소, 쿠키 및 광고 식별자 등을 수집할 수 있습니다.',
          'Google을 포함한 제3자 공급업체는 쿠키를 사용하여 사용자가 본 웹사이트 또는 다른 웹사이트를 이전에 방문한 기록을 바탕으로 광고를 게재합니다. Google은 광고 쿠키를 사용하여 사용자의 본 사이트 및 인터넷상의 다른 사이트 방문 기록에 기반한 광고를 사용자와 파트너에게 제공할 수 있습니다.',
          '사용자는 Google 광고 설정(https://adssettings.google.com)에서 맞춤 광고를 해제할 수 있으며, www.aboutads.info/choices 를 방문하여 제3자 공급업체의 맞춤 광고용 쿠키 사용을 해제할 수도 있습니다. 자세한 내용은 Google의 광고 정책(https://policies.google.com/technologies/ads)에서 확인할 수 있습니다.',
        ],
      },
      {
        heading: '3. 통계 및 서비스 개선을 위한 데이터',
        body: [
          '서비스 이용성 향상과 접속 통계를 위해 Google Analytics 및 Microsoft Clarity를 사용합니다. IP 주소, 방문 일시, 브라우저 종류, 사용 패턴 등 익명화된 비식별 정보가 수집될 수 있으나, 개인을 특정하는 데는 사용되지 않습니다.',
        ],
      },
      {
        heading: '4. 외부 서비스 연동 (Formspree)',
        body: [
          '개발자와 소통 폼을 통해 문의를 남기실 경우, 이메일 주소와 문의 내용이 Formspree를 통해 전송됩니다. 이 정보는 문의 응대 목적으로만 사용되며 제3자에게 제공되지 않습니다.',
        ],
      },
      {
        heading: '5. 개인정보의 제3자 제공 및 위탁',
        body: [
          '본 서비스는 Google AdSense 운영 목적 외에는 사용자의 개인정보를 제3자에게 제공하거나 처리를 위탁하지 않습니다.',
        ],
      },
      {
        heading: '6. 쿠키 거부 방법',
        body: [
          '사용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다. Chrome: 설정 → 개인정보 보호 및 보안 → 쿠키 및 기타 사이트 데이터 / Safari: 환경설정 → 개인정보 보호 → 쿠키 및 웹사이트 데이터 / Firefox: 설정 → 개인정보 보호 → 쿠키 및 사이트 데이터',
        ],
      },
      {
        heading: '7. 문의처',
        body: [
          '서비스 이용 및 개인정보 관련 문의사항은 개발자와 소통 페이지를 통해 연락해 주시기 바랍니다.',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    effectiveDate: 'Effective Date: May 1, 2026',
    sections: [
      {
        heading: '1. Personal Information (No-Collection Policy)',
        body: [
          'EQ FreeSet does not require account registration or login, and collects no personally identifiable information on its servers.',
          'Device selections and test results (EQ settings) are stored exclusively in your browser\'s Local Storage. Clearing your browser data removes all stored information.',
        ],
      },
      {
        heading: '2. Advertising & Cookies (Google AdSense)',
        body: [
          'This service displays ads via Google AdSense. Google and third-party advertisers may use cookies to serve personalized ads based on your browsing history.',
          'Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the Internet.',
          'You may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com), or opt out of a third-party vendor’s use of cookies for personalized advertising by visiting www.aboutads.info/choices. For more information, see Google’s advertising policy (https://policies.google.com/technologies/ads).',
          'During ad serving, Google may collect: visited page URLs and timestamps, browser type and OS, anonymized IP address, and advertising identifiers.',
        ],
      },
      {
        heading: '3. Analytics Data',
        body: [
          'We use Google Analytics and Microsoft Clarity to improve the service. Anonymized data such as IP address, visit time, browser type, and usage patterns may be collected but is never used to identify individuals.',
        ],
      },
      {
        heading: '4. Third-Party Services (Formspree)',
        body: [
          'When you submit a message through the Contact form, your email and message are sent via Formspree to enable a reply. This information is used solely for responding to your inquiry and is not shared with third parties.',
        ],
      },
      {
        heading: '5. Data Sharing',
        body: [
          'We do not share or entrust user data to third parties except for Google AdSense advertising operations.',
        ],
      },
      {
        heading: '6. Opting Out of Cookies',
        body: [
          'You can refuse or delete cookies through your browser settings. Chrome: Settings → Privacy and Security → Cookies / Safari: Preferences → Privacy → Cookies / Firefox: Settings → Privacy & Security → Cookies',
        ],
      },
      {
        heading: '7. Contact',
        body: [
          'For any questions regarding privacy or the service, please reach out through the Contact page.',
        ],
      },
    ],
  },
  zh: {
    title: '隐私政策',
    effectiveDate: '生效日期：2026年5月1日',
    sections: [
      {
        heading: '1. 个人信息收集（不收集原则）',
        body: [
          'EQ FreeSet不要求注册账号或登录，不在服务器上收集或存储任何可识别个人身份的信息。',
          '测试过程中选择的设备信息和测试结果（EQ设置值）仅存储在用户浏览器的本地存储中。清除浏览器数据后，所有信息将随之消失。',
        ],
      },
      {
        heading: '2. 广告与Cookie（Google AdSense）',
        body: [
          '本服务通过Google AdSense投放广告。Google及第三方广告商可能使用Cookie提供个性化广告。',
          '包括Google在内的第三方供应商会使用Cookie，根据用户此前对本网站或其他网站的访问记录投放广告。Google通过广告Cookie，可根据用户对本网站及互联网上其他网站的访问情况，向用户投放其本身及合作伙伴的广告。',
          '用户可访问Google广告设置（https://adssettings.google.com）停用个性化广告，或访问 www.aboutads.info/choices 停用第三方供应商用于个性化广告的Cookie。详情请参阅Google广告政策（https://policies.google.com/technologies/ads）。',
          '广告投放过程中，Google可能收集：访问页面URL及时间、浏览器类型和操作系统、匿名化IP地址及广告标识符。',
        ],
      },
      {
        heading: '3. 统计与服务改进数据',
        body: [
          '我们使用Google Analytics和Microsoft Clarity改善服务。可能收集IP地址、访问时间、浏览器类型等匿名化信息，但不会用于识别个人。',
        ],
      },
      {
        heading: '4. 第三方服务（Formspree）',
        body: [
          '通过联系表单留言时，您输入的邮箱和内容将通过Formspree发送以便回复。该信息仅用于回复问询，不会提供给第三方。',
        ],
      },
      {
        heading: '5. 个人信息第三方提供',
        body: [
          '除Google AdSense广告运营目的外，本服务不向第三方提供或委托处理用户个人信息。',
        ],
      },
      {
        heading: '6. Cookie拒绝方法',
        body: [
          '您可以通过浏览器设置拒绝或删除Cookie。Chrome：设置→隐私和安全→Cookie / Safari：偏好设置→隐私→Cookie / Firefox：设置→隐私与安全→Cookie',
        ],
      },
      {
        heading: '7. 联系方式',
        body: [
          '如有关于隐私或服务使用的问题，请通过联系页面与我们联系。',
        ],
      },
    ],
  },
  ja: {
    title: 'プライバシーポリシー',
    effectiveDate: '施行日：2026年5月1日',
    sections: [
      {
        heading: '1. 個人情報の収集（無収集の原則）',
        body: [
          'EQ FreeSetは会員登録やログインを必要とせず、ユーザーを識別できる個人情報をサーバーに収集・保存しません。',
          'テスト中に選択したデバイス情報とテスト結果（EQ設定値）はブラウザのLocal Storageのみに保存されます。ブラウザのデータを削除すると、すべての情報が消去されます。',
        ],
      },
      {
        heading: '2. 広告とCookie（Google AdSense）',
        body: [
          '本サービスはGoogle AdSenseを通じて広告を掲載します。Googleおよび第三者広告会社は、Cookieによりパーソナライズされた広告を提供する場合があります。',
          'Googleなどの第三者配信事業者は、Cookieを使用して、ユーザーが本サイトや他のサイトに過去にアクセスした際の情報に基づいて広告を配信します。Googleは広告Cookieを使用することにより、ユーザーが本サイトやインターネット上の他のサイトにアクセスした際の情報に基づいて、Googleやそのパートナーが適切な広告を表示できます。',
          'ユーザーは、Googleの広告設定（https://adssettings.google.com）でパーソナライズ広告を無効にできます。また、www.aboutads.info/choices にアクセスすれば、第三者配信事業者がパーソナライズ広告の掲載で使用するCookieを無効にできます。詳しくはGoogleの広告ポリシー（https://policies.google.com/technologies/ads）をご覧ください。',
          '広告配信の過程でGoogleは、訪問ページのURLと時刻、ブラウザの種類とOS、匿名化されたIPアドレス、広告IDなどを収集する場合があります。',
        ],
      },
      {
        heading: '3. 統計およびサービス改善のためのデータ',
        body: [
          'Google AnalyticsとMicrosoft Clarityを使用してサービスを改善します。IPアドレス、訪問日時、ブラウザの種類などの匿名化された情報が収集される場合がありますが、個人の特定には使用されません。',
        ],
      },
      {
        heading: '4. 外部サービス連携（Formspree）',
        body: [
          'お問い合わせフォームからのメッセージは、Formspreeを通じて送信されます。この情報はお問い合わせへの回答のみに使用され、第三者に提供されることはありません。',
        ],
      },
      {
        heading: '5. 個人情報の第三者提供',
        body: [
          'Google AdSenseの広告運営目的以外で、ユーザーの個人情報を第三者に提供または委託することはありません。',
        ],
      },
      {
        heading: '6. Cookieの拒否方法',
        body: [
          'ブラウザの設定からCookieを拒否または削除できます。Chrome：設定→プライバシーとセキュリティ→Cookie / Safari：環境設定→プライバシー→Cookie / Firefox：設定→プライバシーとセキュリティ→Cookie',
        ],
      },
      {
        heading: '7. お問い合わせ',
        body: [
          'サービスの利用や個人情報に関するご質問は、お問い合わせページからご連絡ください。',
        ],
      },
    ],
  },
}

export default function PrivacyContent() {
  const { lang } = useLanguage()
  const c = CONTENT[lang] ?? CONTENT.ko

  return (
    <main className="min-h-screen container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">{c.title}</h1>
      <p className="text-muted-foreground text-sm mb-8">{c.effectiveDate}</p>
      <Card>
        <CardContent className="p-6 prose dark:prose-invert max-w-none space-y-6">
          {c.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold mb-2">{section.heading}</h2>
              {section.body.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </section>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}
