'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useLanguage, type LangCode } from '@/lib/language-context'

type TermsData = {
  title: string
  effectiveDate: string
  articles: { heading: string; body: string[] }[]
}

const CONTENT: Record<LangCode, TermsData> = {
  ko: {
    title: '이용약관',
    effectiveDate: '본 약관은 2026년 5월 1일부터 시행됩니다.',
    articles: [
      {
        heading: '제1조 (목적)',
        body: ['본 약관은 EQ FreeSet(이하 "서비스")이 제공하는 오디오 이퀄라이저 최적화 테스트 및 관련 서비스의 이용과 관련하여, 서비스와 사용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.'],
      },
      {
        heading: '제2조 (약관의 효력 및 변경)',
        body: [
          '① 본 약관은 서비스를 이용하고자 하는 모든 사용자에게 효력이 발생합니다.',
          '② 서비스는 필요하다고 인정되는 경우 본 약관을 변경할 수 있으며, 약관이 변경된 경우 서비스 내에 공지함으로써 효력이 발생합니다.',
        ],
      },
      {
        heading: '제3조 (서비스 제공 및 한계)',
        body: [
          '① 서비스는 사용자의 청각적 특성과 기기별 주파수 응답을 기반으로 이퀄라이저 설정값을 추천하는 기능을 제공합니다.',
          '② 서비스가 제공하는 설정값은 사용자의 주관적 만족도를 높이기 위한 참고 자료일 뿐, 청력 보호나 의학적 효능을 보장하지 않습니다.',
          '③ 과도한 볼륨이나 극단적인 이퀄라이저 설정은 청력 손상 및 청각 기기 고장의 원인이 될 수 있으며, 이에 대한 책임은 전적으로 사용자에게 있습니다.',
        ],
      },
      {
        heading: '제4조 (사용자의 의무)',
        body: [
          '사용자는 서비스를 이용함에 있어 다음 각 호의 행위를 하여서는 안 됩니다.',
          '1. 서비스의 정상적인 운영을 방해하는 행위',
          '2. 서비스의 시스템에 비정상적인 방법으로 접근하거나 부하를 유발하는 행위',
          '3. 기타 불법적이거나 부당한 행위',
        ],
      },
      {
        heading: '제5조 (책임 제한)',
        body: [
          '① 서비스는 무료로 제공되며, 서비스 이용과 관련하여 사용자에게 발생한 어떠한 손해에 대해서도 책임을 지지 않습니다.',
          '② 서비스는 사용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.',
          '③ 서비스는 사용자 간 또는 사용자와 제3자 상호 간에 본 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며 이로 인한 손해를 배상할 책임이 없습니다.',
        ],
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    effectiveDate: 'These Terms are effective as of May 1, 2026.',
    articles: [
      {
        heading: 'Article 1 (Purpose)',
        body: ['These Terms of Service govern the rights, obligations, and responsibilities between EQ FreeSet (the "Service") and users regarding the use of the audio equalizer optimization test and related services.'],
      },
      {
        heading: 'Article 2 (Effectiveness and Changes)',
        body: [
          '① These Terms apply to all users who intend to use the Service.',
          '② The Service may update these Terms as necessary. Changes take effect upon being announced within the Service.',
        ],
      },
      {
        heading: 'Article 3 (Service Scope and Limitations)',
        body: [
          '① The Service provides equalizer setting recommendations based on the user\'s hearing characteristics and device frequency response.',
          '② The settings provided are for reference purposes only to improve subjective satisfaction and do not guarantee hearing protection or medical benefits.',
          '③ Excessive volume or extreme equalizer settings may damage hearing or audio devices. Users bear full responsibility for such use.',
        ],
      },
      {
        heading: 'Article 4 (User Obligations)',
        body: [
          'Users must not engage in any of the following activities when using the Service:',
          '1. Acts that interfere with the normal operation of the Service',
          '2. Unauthorized access to Service systems or acts that cause excessive load',
          '3. Any other illegal or improper acts',
        ],
      },
      {
        heading: 'Article 5 (Limitation of Liability)',
        body: [
          '① The Service is provided free of charge and bears no responsibility for any damages incurred by users in connection with using the Service.',
          '② The Service is not liable for service disruptions caused by the user\'s own actions.',
          '③ The Service has no obligation to intervene in disputes between users or between users and third parties arising through the Service, and bears no liability for resulting damages.',
        ],
      },
    ],
  },
  zh: {
    title: '服务条款',
    effectiveDate: '本条款自2026年5月1日起生效。',
    articles: [
      {
        heading: '第一条（目的）',
        body: ['本条款旨在规定EQ FreeSet（以下简称"服务"）与用户在使用音频均衡器优化测试及相关服务过程中的权利、义务和责任事项。'],
      },
      {
        heading: '第二条（条款效力及变更）',
        body: [
          '① 本条款对所有意图使用本服务的用户生效。',
          '② 本服务可在认为必要时修改本条款，修改后的条款在服务内公告后生效。',
        ],
      },
      {
        heading: '第三条（服务提供及限制）',
        body: [
          '① 本服务根据用户的听觉特性和设备频率响应提供均衡器设置推荐功能。',
          '② 本服务提供的设置值仅为提高用户主观满意度的参考资料，不保证听力保护或医疗效果。',
          '③ 过高的音量或极端的均衡器设置可能导致听力损伤或音频设备损坏，相关责任完全由用户承担。',
        ],
      },
      {
        heading: '第四条（用户义务）',
        body: [
          '用户在使用本服务时不得进行以下行为：',
          '1. 妨碍服务正常运营的行为',
          '2. 以异常方式访问服务系统或造成过载的行为',
          '3. 其他违法或不当行为',
        ],
      },
      {
        heading: '第五条（责任限制）',
        body: [
          '① 本服务免费提供，对用户因使用本服务而产生的任何损害不承担责任。',
          '② 本服务对因用户原因造成的服务使用障碍不承担责任。',
          '③ 本服务对以本服务为媒介发生的用户间或用户与第三方间的纠纷无介入义务，且对因此造成的损害不承担赔偿责任。',
        ],
      },
    ],
  },
  ja: {
    title: '利用規約',
    effectiveDate: '本規約は2026年5月1日より施行されます。',
    articles: [
      {
        heading: '第1条（目的）',
        body: ['本規約は、EQ FreeSet（以下「サービス」）が提供するオーディオイコライザー最適化テストおよび関連サービスの利用に関して、サービスとユーザーとの間の権利、義務および責任事項を定めることを目的とします。'],
      },
      {
        heading: '第2条（規約の効力および変更）',
        body: [
          '① 本規約は、サービスを利用しようとするすべてのユーザーに効力が発生します。',
          '② サービスは必要と認められる場合に本規約を変更することができ、変更された場合はサービス内に公告することで効力が発生します。',
        ],
      },
      {
        heading: '第3条（サービスの提供および限界）',
        body: [
          '① サービスは、ユーザーの聴覚特性とデバイスの周波数特性に基づいてイコライザー設定値を推薦する機能を提供します。',
          '② サービスが提供する設定値は、ユーザーの主観的な満足度を高めるための参考情報であり、聴力保護や医学的効果を保証するものではありません。',
          '③ 過度な音量や極端なイコライザー設定は、聴力障害やオーディオ機器の故障の原因となる可能性があり、これに対する責任はすべてユーザーにあります。',
        ],
      },
      {
        heading: '第4条（ユーザーの義務）',
        body: [
          'ユーザーはサービスを利用するにあたり、以下の行為を行ってはなりません。',
          '1. サービスの正常な運営を妨げる行為',
          '2. サービスのシステムに不正な方法でアクセスしたり、過負荷を引き起こす行為',
          '3. その他の違法または不当な行為',
        ],
      },
      {
        heading: '第5条（責任制限）',
        body: [
          '① サービスは無料で提供され、サービスの利用に関連してユーザーに生じたいかなる損害についても責任を負いません。',
          '② サービスは、ユーザーの帰責事由によるサービス利用障害について責任を負いません。',
          '③ サービスは、ユーザー間またはユーザーと第三者との間でサービスを媒介として生じた紛争に介入する義務はなく、それによる損害を賠償する責任もありません。',
        ],
      },
    ],
  },
}

export default function TermsContent() {
  const { lang } = useLanguage()
  const c = CONTENT[lang] ?? CONTENT.ko

  return (
    <main className="min-h-screen container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">{c.title}</h1>
      <Card>
        <CardContent className="p-6 prose dark:prose-invert max-w-none space-y-6">
          {c.articles.map((article, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold mb-2">{article.heading}</h2>
              {article.body.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </section>
          ))}
          <p className="text-sm text-muted-foreground pt-4 border-t border-border">{c.effectiveDate}</p>
        </CardContent>
      </Card>
    </main>
  )
}
