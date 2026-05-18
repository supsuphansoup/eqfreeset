# EQ FreeSet — 프로젝트 현황 파일
> 마지막 업데이트: 2026-05-08 | 상태: **배포 완료 (eqfreeset.pages.dev)**

---

## 1. 프로젝트 개요

**EQ FreeSet**은 A/B 블라인드 테스트 기반의 개인화 이어폰/헤드폰 EQ 튜너 웹앱이다.
사용자가 자신의 기기를 선택 → 음악을 들으며 A/B 선택 16라운드 → 개인화된 EQ JSON 다운로드.

- **URL**: https://eqfreeset.pages.dev
- **배포 플랫폼**: Cloudflare Pages
- **저장소**: `c:\Users\khs62\OneDrive\바탕 화면\코딩\eqfreeset`

---

## 2. 기술 스택

| 레이어 | 기술 |
|--------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 상태 관리 | Zustand (`useTestStore`, `useAudioStore`) |
| 오디오 처리 | Web Audio API (BiquadFilter 체인 10밴드) |
| 스타일링 | Tailwind CSS v3 + shadcn/ui + 커스텀 CSS 변수 |
| UI 컴포넌트 | shadcn/ui (Radix UI 기반, `src/components/ui/`) |
| 디자인 시스템 | Refined Minimalism — 다크 우선, 블루 단일 포인트 컬러 (`globals.css`) |
| 폼 | Formspree (`/f/mgorgdbj`) |
| PWA | Service Worker (`/public/sw.js`) |
| 배포 | Cloudflare Pages (정적 export: `output: 'export'`) |
| 분석 도구 | Google Analytics (G-0PPLGZP5EM), Microsoft Clarity (wjkoxkdhez) |
| 광고 | Google AdSense (ca-pub-3853805636561789) |

---

## 3. 핵심 파일 구조

```
src/
├── app/
│   ├── layout.tsx            # 루트 레이아웃, SEO metadata, PWA, AdSense, GA, Clarity
│   ├── globals.css           # 전역 스타일 (Tailwind + 커스텀 디자인 토큰)
│   ├── page.tsx              # 홈 (히어로, 3단계 설명, FAQ, 푸터)
│   ├── test/
│   │   ├── layout.tsx        # test SEO metadata (index: false)
│   │   └── page.tsx          # 핵심 테스트 플로우 (4단계: device→audio→segment→test)
│   ├── result/
│   │   ├── layout.tsx        # result SEO metadata (index: false)
│   │   └── page.tsx          # 결과 표시 (EQ 그래프, 다운로드, 공유)
│   ├── contact/
│   │   ├── layout.tsx        # contact SEO metadata
│   │   └── page.tsx          # 문의 폼 (fetch + 인라인 피드백)
│   ├── guide/                # 정보성 가이드 (AdSense 승인용)
│   │   ├── earphone-tips/    # 이어폰 관리 팁
│   │   ├── eq-presets/       # EQ 프리셋 가이드
│   │   └── hearing-health/   # 청력 건강 가이드
│   ├── info/page.tsx         # 서비스 소개 (EQ 원리 설명)
│   ├── terms/page.tsx        # 이용약관
│   ├── privacy/page.tsx      # 개인정보처리방침
│   ├── license/page.tsx      # 오픈소스 라이선스 (AutoEQ)
│   ├── sitemap.ts            # SEO 사이트맵 (10개 페이지)
│   └── robots.ts             # SEO robots.txt
├── lib/
│   ├── audio-store.ts        # 핵심 알고리즘 + Zustand 상태 (useAudioStore, useTestStore)
│   ├── local-data.ts         # 로컬스토리지 CRUD (SavedResult)
│   ├── device-db.ts          # 기기 데이터베이스 (AutoEQ 기반)
│   └── utils.ts              # cn() 유틸리티 (clsx + tailwind-merge)
└── components/
    ├── bottom-nav.tsx         # 하단 탭 (/, /info만 표시 — /test, /result에서 숨김)
    ├── bottom-nav-spacer.tsx  # 조건부 하단 여백 (bottom-nav와 동일 조건)
    ├── pwa-install.tsx        # Service Worker 등록
    ├── theme-toggle.tsx       # 다크/라이트 토글
    ├── theme-provider.tsx     # ThemeProvider (기본 다크 모드)
    ├── language-toggle.tsx    # 다국어 변경 토글 (ko, en, zh, ja)
    └── ui/                    # shadcn/ui 컴포넌트 11종
        ├── accordion.tsx
        ├── alert.tsx
        ├── avatar.tsx
        ├── badge.tsx
        ├── button.tsx
        ├── card.tsx
        ├── dialog.tsx
        ├── input.tsx
        ├── progress.tsx
        ├── tabs.tsx
        └── textarea.tsx
```

---

## 4. 핵심 알고리즘 — Bayesian-only 16라운드

### 흐름
```
기기 선택 → 오디오 선택 (샘플/업로드) → 구간 분석 → A/B 테스트 16라운드 → 결과
```

### 테스트 4단계 (`currentStep`)
| step | 화면 |
|------|------|
| `'device'` | 기기 선택 (브랜드별 Accordion, 검색 지원) |
| `'audio'` | 오디오 선택 (장르별 샘플 / 업로드) |
| `'segment'` | 구간 분석 (샘플: 장르 선택 → 자동 분석, 업로드: 파일 업로드 → 자동 분석) |
| `'test'` | A/B 테스트 (16라운드 Bayesian) → 완료 시 `/result` 자동 이동 |

### 알고리즘 상세 (`audio-store.ts`)

**테스트 축 (4개)**
- `bass` → filters[0, 1] (32Hz, 64Hz)
- `warmth` → filters[2, 3] (125Hz, 250Hz)
- `vocal` → filters[4, 5] (500Hz, 1000Hz)
- `brightness` → filters[6, 7, 8, 9] (2000Hz, 4000Hz, 8000Hz, 16000Hz)

**Bayesian prior 초기값**
```ts
bayesMean: 0   // 0dB에서 시작
bayesStd:  5   // 넓은 불확실성
```

**A/B gain 산출**
```ts
aGain = clamp(bayesMean - bayesStd)   // A = 더 낮은 쪽
bGain = clamp(bayesMean + bayesStd)   // B = 더 높은 쪽
```

**Thurstone 근사 업데이트**
```ts
if (B 선택) bayesMean = min(10, bayesMean + bayesStd * 0.4)
if (A 선택) bayesMean = max(-10, bayesMean - bayesStd * 0.4)
if (비슷)   bayesStd *= 0.7    // 빠르게 수렴
else        bayesStd *= 0.85   // 점진적 수렴
bayesStd = max(0.5, bayesStd)  // 최소 하한선
```

**축 선택 전략**
- 매 라운드 가장 `bayesStd`가 큰 축(가장 불확실한 축) 자동 선택
- 이 전략으로 동일 라운드 수 대비 정보 효율 극대화

**EQ 범위**
- ±10dB 하드 클램핑 (gain 산출, Bayesian 업데이트, 최종 출력 3중 적용)
- Loudness Normalization: 최대 positive gain만큼 Preamp(GainNode)를 감소하여 음량 차이 착시 방지

### 결과 계산 (`completeTest()`)
- `personalizationDelta`: 4축 Bayesian 수렴값을 10밴드로 매핑 (소수점 유지)
- `optimalEQ.bands` = `device.baseEQ[i].gain` + `personalizationDelta[i].gain` → 클램핑
- 신뢰도 = `1 - avgBayesStd / 6` (std 작을수록 신뢰도 높음, 0.5~0.99 범위)

---

## 5. 구간 분석 (`analyzeSegments`)

- 전체 곡이 30초 이상이면 앞 15%, 뒤 15% 제외 (전주/후주 skip)
- 5초 간격 슬라이딩 윈도우, 10초 구간
- OfflineAudioContext + AnalyserNode (fftSize=2048)로 FFT 에너지 추출
- Prominence 가중치 (`^1.5`)로 대역별 특성 구간 선별
- **4개 축을 Promise.all로 동시 분석**
- 겹치지 않는 상위 3개 구간 반환

> ⚠️ 배포 후 개선 예정: OfflineAudioContext를 구간마다 생성하는 성능 문제.
> 전체 곡을 1회 FFT 분석 후 구간별 슬라이싱으로 교체 권장.

### 업로드 음원 구간 선택 모드 (2가지)
- **자동 추천 (권장)**: 라운드마다 현재 테스트 축에 최적화된 구간 자동 재생
- **수동 선택**: 테스트 화면에서 슬라이더로 직접 구간 조절 가능 (구간 변경 시 A/B 청취 상태 초기화)

---

## 6. 데이터 영속성

**로컬 스토리지 키**: `eqfreeset.results`

**저장 시점**: `completeTest()` 호출 시 자동 저장 (`addResult()`)

**SavedResult 구조**:
```ts
{
  id: string              // crypto.randomUUID()
  deviceId: string
  deviceName: string
  responses: TestResponse[]
  personalizationDelta: EQBand[]
  confidence: number      // 0.5~0.99
  createdAt: string       // ISO8601
}
```

**결과 복원**: `/result?id={uuid}` 쿼리 파라미터로 특정 결과 조회 가능.
파라미터 없으면 최신 결과(index 0) 사용.

---

## 7. 샘플 음원

### `/public/samples/` (정적 서빙, 배포 포함)
| 파일명 | 장르 |
|--------|------|
| `pop-test.mp3` | 팝 |
| `hiphop-test.mp3` | 힙합 |
| `jazz-test.mp3` | 재즈 |
| `classical-test.mp3` | 클래식 |
| `edm-test.mp3` | EDM |
| `rnb-test.mp3` | R&B / Soul |
| `ballad-test.mp3` | 발라드 |
| `indie-test.mp3` | 인디뮤직 |
| `jpop-test.mp3` | J-Pop |
| `rock-test.mp3` | 락 |
| `balanced-test.mp3` | (파일 있으나 장르 목록 미노출) |
| `bass-test.mp3` | (파일 있으나 장르 목록 미노출) |
| `brightness-test.mp3` | (파일 있으나 장르 목록 미노출) |
| `vocal-test.mp3` | (파일 있으나 장르 목록 미노출) |

> `/eqfreeset_sample_audio/`는 프로젝트 루트 별도 디렉토리 (배포 포함 안 됨, 원본 보관용).

---

## 8. SEO 설정

- `layout.tsx`: 기본 metadata (OG, Twitter Card, Canonical, Robots, Icons, Manifest)
- 서브 라우트별 layout에 개별 metadata 선언
  - `/test`, `/result`: `robots: { index: false }` (색인 제외)
  - `/contact`: 색인 허용
- `sitemap.ts`: 10개 페이지 동적 사이트맵
- `robots.ts`: 크롤러 허용 설정
- OG 이미지: `/public/og-image.png` (1200×630)
- 파비콘: `/public/icon-192.png`, `/public/icon-512.png`, `/public/apple-icon.png`
- `app/icon.png`, `app/apple-icon.png` (App Router 자동 파비콘 처리)

---

## 9. 분석 / 광고 스크립트 (`layout.tsx`)

| 도구 | 스크립트 | 설정값 |
|------|---------|--------|
| Google AdSense | `pagead2.googlesyndication.com` | `ca-pub-3853805636561789` |
| Google Analytics | `googletagmanager.com/gtag/js` | `G-0PPLGZP5EM` |
| Microsoft Clarity | `clarity.ms/tag/` | `wjkoxkdhez` |

---

## 10. 완료된 기능 목록

| 기능 | 상태 |
|------|------|
| Bayesian-only 16라운드 A/B 테스트 | ✅ |
| 불확실 축 자동 선택 (최대 정보 이득) | ✅ |
| Loudness Normalization (Preamp 보정) | ✅ |
| ±10dB 하드 클램핑 (3중 적용) | ✅ |
| 결과 로컬스토리지 영구 저장 | ✅ |
| 결과 ID 기반 복원 (`?id=`) | ✅ |
| EQ 그래프 (0dB 기준선 boost/cut 시각화) | ✅ |
| 인사이트 메시지 (Bayesian gain 기반) | ✅ |
| JSON 다운로드 | ✅ |
| 공유하기 (Web Share API + clipboard fallback) | ✅ |
| 장르별 샘플 음원 10종 | ✅ |
| 음원 업로드 + 자동 구간 분석 | ✅ |
| 수동 구간 선택 슬라이더 (테스트 화면 실시간) | ✅ |
| 자동/수동 구간 선택 모드 전환 | ✅ |
| 기기 DB (AutoEQ 기반, 브랜드별 Accordion 검색) | ✅ |
| 테스트 뒤로가기 데이터 보호 (confirm 경고) | ✅ |
| 하단 탭 /test·/result에서 숨김 | ✅ |
| BottomNavSpacer (탭 높이만큼 하단 여백) | ✅ |
| PWA (Service Worker, 설치 가능, manifest) | ✅ |
| 다크/라이트 테마 토글 | ✅ |
| SEO 완비 (sitemap, robots, OG, Twitter Card) | ✅ |
| 법무 페이지 3종 (이용약관, 개인정보, 라이선스) | ✅ |
| 문의 폼 (Formspree + 인라인 피드백) | ✅ |
| Google AdSense 자동 광고 | ✅ |
| Google Analytics (GA4) | ✅ |
| Microsoft Clarity | ✅ |
| 다국어 지원 (ko, en, zh, ja) 및 Hydration 이슈 해결 | ✅ |
| 기본 다크 모드 활성화 | ✅ |
| Cloudflare Pages 배포 이관 | ✅ |
| 정보성 가이드 페이지 3종 추가 | ✅ |
| 결과 화면 'EQ 적용하기' 버튼 제거 | ✅ |
| 결과 화면 버튼 레이아웃 개선 | ✅ |
| `store.ts` (미사용 파일) 제거 | ✅ |
| 미사용 import 정리 | ✅ |
| **UI 전면 리디자인 (Refined Minimalism)** | ✅ |
| 홈 Hero·Steps 섹션 가운데 정렬 | ✅ |
| 언어/테마 토글 아이콘 스타일 통일 | ✅ |
| 장르 선택 이모지 제거 → 텍스트 전용 카드 | ✅ |
| 하단 탭 아이콘 제거 → 텍스트 전용 탭바 | ✅ |
| 로케일 AI 표현 제거 (`AI 분석` → `분석`) | ✅ |

---

## 11. 배포 후 개선 예정 (Backlog)

### 🔴 성능
- `analyzeSegments` OfflineAudioContext 구간마다 생성 → 1회 FFT + 슬라이싱으로 교체
  - 파일: `src/lib/audio-store.ts` → `analyzeSegments()` 함수
  - 모바일 분석 10~20초 → 3~5초로 단축 예상

### 🟠 알고리즘
- 라운드 수 유연화: 신뢰도 임계값 도달 시 조기 종료 옵션
- `similar` 응답 처리: 중립 응답이 많을 때 탐색 범위 자동 조정

### 🟡 UX / 기능
- 결과 히스토리 페이지 (`/history`) — 과거 테스트 결과 목록
- 기기 DB 추가 요청 시 업데이트 파이프라인 구축

---

## 12. 환경/빌드

```bash
npm run dev    # 개발 서버 (localhost:3000)
npm run build  # 프로덕션 빌드 (next build, output: 'export', out/ 디렉토리)
```

**next.config.js 주요 설정**:
```js
output: 'export'       // 정적 HTML 내보내기
trailingSlash: true    // /result → /result/ (정적 호스팅 라우팅 안정성)
images.unoptimized: true  // 정적 내보내기에서 Image 최적화 비활성
```

**빌드 결과 (2026-05-07 기준)**:
```
/          59.4 kB
/test      10.3 kB  (33kB page.tsx 클라이언트 컴포넌트)
/result     9.31 kB
/contact    4.42 kB
/info       6.15 kB
(법무 페이지들 ~160B 각)
```

---

## 13. 현재 알려진 이슈 (배포 시 무해)

| 이슈 | 설명 | 영향 |
|------|------|------|
| `(window as any).webkitAudioContext` | iOS Safari 호환 접두사 | 정상 동작, 필수 코드 |
| `/result` CSR 전용 경고 | `useSearchParams` 사용으로 SSR 불가 → `Suspense`로 래핑 처리 완료 | 기능 정상 |
| `balanced-test.mp3` 외 4개 샘플 | `/public/samples/`에 있으나 장르 선택 UI에 미노출 | 기능 무영향 |

---

## 14. 참고 파일

- `README.md` — 서비스 상세 설명, 알고리즘 원리
- `STACK.md` — 기술 스택 상세
- `components.json` — shadcn/ui 설정
