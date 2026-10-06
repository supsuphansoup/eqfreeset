import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개발자와 소통하기',
  description: '버그 제보, 추가를 원하는 기기, 개선 제안을 자유롭게 보내 주세요. 보내 주신 메시지는 모두 읽습니다.',
  alternates: { canonical: '/contact/' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
