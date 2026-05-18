import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개발자와 소통',
  description: '버그 제보, 기기 추가 요청, 개선사항 등 개발자에게 직접 메시지를 보낼 수 있습니다.',
  alternates: { canonical: '/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
