/**
 * Google AdSense 설정 파일
 * 
 * - CLIENT_ID: 본인의 애드센스 게시자 ID (ca-pub-...)
 * - SLOTS: 구글 애드센스 콘솔 > [광고 단위 기준] > [디스플레이 광고] 생성 후 발급받은 10자리 숫자 ID
 *   환경 변수(.env.local)로 설정하거나 여기에 직접 숫자를 입력하실 수 있습니다.
 */
export const ADSENSE_CONFIG = {
  CLIENT_ID: 'ca-pub-3853805636561789',
  SLOTS: {
    // 메인 홈 하단 광고 슬롯 ID (예: '0987654321')
    HOME_BOTTOM: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || '',
  },
}
