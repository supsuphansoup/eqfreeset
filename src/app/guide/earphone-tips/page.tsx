import type { Metadata } from 'next'
import { withLanguages } from '@/lib/locale-routes'
import EarphoneTipsContent from './EarphoneTipsContent'

export const metadata: Metadata = {
  title: '이어폰 구매 및 관리 가이드',
  description: '나에게 맞는 이어폰 고르는 법, 폼팁과 실리콘 팁의 차이, 올바른 청소와 보관법으로 이어폰을 오래 잘 쓰는 방법을 알아보세요.',
  alternates: withLanguages('/guide/earphone-tips/'),
}

export default function EarphoneTipsPage() {
  return <EarphoneTipsContent />
}
