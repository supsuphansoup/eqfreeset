import type { LangCode } from '@/lib/language-context'

/**
 * 가이드 글 공통 데이터 구조
 * - 문단(p), 목록(list), 표(table), 강조 박스(note) 블록으로 본문을 구성합니다.
 * - list 항목에 "라벨: 설명" 형태로 콜론이 있으면 라벨 부분을 굵게 표시합니다.
 */
export type GuideBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'note'; title: string; text: string }

export type GuideSection = { heading: string; blocks: GuideBlock[] }

export type GuideArticle = {
  title: string
  subtitle: string
  intro: string
  sections: GuideSection[]
}

export type GuideContent = Record<LangCode, GuideArticle>

type GuideEntry = {
  slug: string
  title: Record<LangCode, string>
  desc: Record<LangCode, string>
}

// 사이트 전체 가이드 목록 (홈·정보·가이드 목록·푸터·사이트맵에서 공통 사용)
export const GUIDES: GuideEntry[] = [
  {
    slug: 'apply-eq',
    title: {
      ko: '기기별 EQ 적용 방법',
      en: 'How to Apply EQ on Your Device',
      zh: '各设备EQ设置方法',
      ja: 'デバイス別EQの適用方法',
    },
    desc: {
      ko: '갤럭시, 아이폰, Windows, Mac에서 EQ 값을 실제로 입력하는 방법과 클리핑을 막는 프리앰프 설정',
      en: 'Entering EQ values on Galaxy, iPhone, Windows and Mac, plus preamp settings to avoid clipping',
      zh: '在Galaxy、iPhone、Windows、Mac上输入EQ数值的方法，以及防止削波的前级增益设置',
      ja: 'Galaxy・iPhone・Windows・MacでEQ値を入力する方法と、クリッピングを防ぐプリアンプ設定',
    },
  },
  {
    slug: 'frequency-guide',
    title: {
      ko: '주파수 대역별 소리 가이드',
      en: 'Frequency Band Sound Guide',
      zh: '各频段声音指南',
      ja: '周波数帯域別サウンドガイド',
    },
    desc: {
      ko: '저음부터 초고음까지, 각 대역이 어떤 소리를 담당하고 많거나 적을 때 어떻게 들리는지',
      en: 'From sub-bass to air: what each band does and how it sounds when there is too much or too little',
      zh: '从超低频到极高频，各频段负责什么声音，过多或过少时听起来如何',
      ja: '超低域から超高域まで、各帯域が担う音と、多すぎ・少なすぎのときの聞こえ方',
    },
  },
  {
    slug: 'frequency-response',
    title: {
      ko: '주파수 응답 그래프와 타깃 커브 읽는 법',
      en: 'Reading Frequency Response Graphs & Target Curves',
      zh: '如何读懂频响曲线与目标曲线',
      ja: '周波数特性グラフとターゲットカーブの読み方',
    },
    desc: {
      ko: '측정 그래프의 축과 모양 해석, 하만 타깃의 의미, 같은 이어폰도 사람마다 다르게 들리는 이유',
      en: 'How to read measurement graphs, what the Harman target means, and why the same earphone sounds different to each person',
      zh: '测量曲线的坐标与形状解读、哈曼目标曲线的含义，以及同一款耳机为何因人而异',
      ja: '測定グラフの軸と形の読み方、ハーマンターゲットの意味、同じイヤホンでも人によって聞こえ方が違う理由',
    },
  },
  {
    slug: 'bluetooth-codecs',
    title: {
      ko: '블루투스 코덱 비교 (SBC·AAC·aptX·LDAC)',
      en: 'Bluetooth Codecs Compared (SBC, AAC, aptX, LDAC)',
      zh: '蓝牙编解码器对比（SBC·AAC·aptX·LDAC）',
      ja: 'Bluetoothコーデック比較（SBC・AAC・aptX・LDAC）',
    },
    desc: {
      ko: '무선 이어폰 음질과 지연에 코덱이 미치는 영향, 내 폰에서 쓰이는 코덱 확인법',
      en: 'How codecs affect wireless sound quality and latency, and how to check which codec your phone uses',
      zh: '编解码器对无线耳机音质与延迟的影响，以及如何查看手机正在使用的编解码器',
      ja: 'コーデックがワイヤレスイヤホンの音質と遅延に与える影響と、使用中のコーデックの確認方法',
    },
  },
  {
    slug: 'blind-test',
    title: {
      ko: '블라인드 테스트로 귀를 믿는 법',
      en: 'Why Blind Listening Tests Work',
      zh: '为什么要做盲听测试',
      ja: 'ブラインドテストで耳を信じる方法',
    },
    desc: {
      ko: '음량 편향과 기대 편향, 공정한 A/B 비교 조건, 집에서 정확하게 듣고 고르는 요령',
      en: 'Loudness and expectation bias, conditions for a fair A/B comparison, and tips for listening accurately at home',
      zh: '音量偏差与预期偏差、公平A/B对比的条件，以及在家准确聆听的技巧',
      ja: '音量バイアスと期待バイアス、公平なA/B比較の条件、自宅で正確に聴き比べるコツ',
    },
  },
  {
    slug: 'troubleshooting',
    title: {
      ko: '이어폰 소리 문제 해결 가이드',
      en: 'Earphone Sound Troubleshooting',
      zh: '耳机声音问题排查指南',
      ja: 'イヤホンの音のトラブル解決ガイド',
    },
    desc: {
      ko: '저음이 약할 때, 한쪽만 작을 때, 끊기거나 지연될 때 순서대로 점검하는 방법',
      en: 'Step-by-step checks for weak bass, one side quieter, dropouts and audio lag',
      zh: '低频不足、单边声音小、断连或延迟时的逐步排查方法',
      ja: '低音が弱い、片側だけ小さい、途切れる・遅れるときに順番に確認する方法',
    },
  },
  {
    slug: 'earphone-tips',
    title: {
      ko: '이어폰 관리 및 팁',
      en: 'Earphone Care & Tips',
      zh: '耳机使用与保养',
      ja: 'イヤホンの管理とヒント',
    },
    desc: {
      ko: '실리콘 팁과 폼 팁의 차이, 드라이버 종류별 특성, 청소·보관법',
      en: 'Silicone vs foam tips, driver types, cleaning and storage',
      zh: '硅胶与海绵耳套的区别、单元类型特点、清洁与存放方法',
      ja: 'シリコンとフォームの違い、ドライバー方式の特徴、掃除・保管方法',
    },
  },
  {
    slug: 'hearing-health',
    title: {
      ko: '청력 보호 가이드',
      en: 'Hearing Protection Guide',
      zh: '听力保护指南',
      ja: '聴力保護ガイド',
    },
    desc: {
      ko: '소음성 난청이 생기는 원리, 60/60 법칙, 낮은 볼륨에서도 만족스럽게 듣는 법',
      en: 'How noise-induced hearing loss happens, the 60/60 rule, enjoying music at lower volume',
      zh: '噪声性听力损失的成因、60/60法则、低音量下也能享受音乐的方法',
      ja: '騒音性難聴の仕組み、60/60ルール、小さな音量でも満足して聴く方法',
    },
  },
  {
    slug: 'eq-presets',
    title: {
      ko: '장르별 EQ 프리셋',
      en: 'EQ Presets by Genre',
      zh: '按曲风EQ预设',
      ja: 'ジャンル別EQプリセット',
    },
    desc: {
      ko: '팝, 록, EDM, 클래식에서 조절하면 좋은 대역과 튜닝 포인트',
      en: 'Which bands to adjust for pop, rock, EDM and classical',
      zh: '流行、摇滚、EDM、古典应调整的频段与调音要点',
      ja: 'ポップ、ロック、EDM、クラシックで調整すべき帯域とポイント',
    },
  },
]
