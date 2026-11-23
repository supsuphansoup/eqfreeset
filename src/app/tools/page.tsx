import type { Metadata } from 'next'
import { withLanguages } from '@/lib/locale-routes'
import ToolsContent from './ToolsContent'

export const metadata: Metadata = {
  title: '이어폰 좌우 테스트 · 주파수 · 마이크(핸즈프리) 테스트',
  description: '설치 없이 브라우저에서 이어폰 좌우 채널, 20Hz–20kHz 주파수 스윕, 마이크(핸즈프리) 입력과 녹음을 바로 확인하세요. 소리와 녹음은 기기 밖으로 전송되지 않습니다.',
  alternates: withLanguages('/tools/'),
}

export default function ToolsPage() {
  return <ToolsContent />
}
