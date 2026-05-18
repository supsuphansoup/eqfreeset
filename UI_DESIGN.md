# EQ FreeSet — UI 설계서
> 마지막 업데이트: 2026-05-08 | 디자인 방향: **Refined Minimalism**

---

## 1. 디자인 철학

### 핵심 원칙
EQ FreeSet의 UI는 **"도구로서의 UI"** 를 지향한다.
Vercel, Linear, Notion처럼 UI 자체가 주목받지 않고, 기능과 콘텐츠가 전면에 드러나는 설계.

| 원칙 | 설명 |
|------|------|
| **텍스트 우선** | 장식 아이콘·이모지 최소화, 내용 자체가 UI 역할 |
| **다크 모드 우선** | 기본 테마는 다크. 라이트는 보조 |
| **포인트 컬러 1가지** | 파란색(Blue) 계열 단 하나. 그 외 모든 요소는 무채색 |
| **최소한의 움직임** | 애니메이션은 `fadeUp` 입장 효과 1가지만. 글로우·float 없음 |
| **명확한 위계** | 크기와 굵기로만 정보 위계 표현. 색상으로 위계를 만들지 않음 |

### 피해야 할 패턴 (Anti-patterns)
- ❌ 그라데이션 텍스트 (`gradient-text`)
- ❌ 글로우 효과 (`shadow` + 컬러)
- ❌ Mesh/Radial 배경 그라데이언트
- ❌ 카드 Hover 부상 (`-translate-y`)
- ❌ 아이콘 `animate-pulse` / `animate-float`
- ❌ 장식용 이모지 (기능과 무관한 이모지)
- ❌ Glass-morphism (과도한 `backdrop-blur` + 반투명)

---

## 2. 컬러 시스템

### 다크 모드 (기본)

| 토큰 | HSL 값 | 용도 |
|------|--------|------|
| `--background` | `222 14% 7%` | 페이지 배경 (거의 검정) |
| `--foreground` | `210 17% 95%` | 본문 텍스트 |
| `--card` | `220 13% 10%` | 카드/표면 배경 |
| `--border` | `220 13% 16%` | 구분선, 카드 테두리 |
| `--muted` | `220 13% 14%` | 비활성 배경 |
| `--muted-foreground` | `215 13% 52%` | 보조 텍스트 |
| `--primary` | `213 94% 58%` | **포인트 블루** — CTA, 활성 상태, 강조 |
| `--primary-foreground` | `0 0% 100%` | 블루 버튼 위 텍스트 |
| `--destructive` | `0 63% 45%` | 오류, 경고 |

### 라이트 모드

| 토큰 | HSL 값 | 용도 |
|------|--------|------|
| `--background` | `0 0% 98%` | 페이지 배경 (거의 흰색) |
| `--foreground` | `220 13% 9%` | 본문 텍스트 |
| `--card` | `0 0% 100%` | 카드 배경 |
| `--border` | `220 13% 91%` | 구분선 |
| `--primary` | `213 94% 52%` | **포인트 블루** |

### 컬러 사용 규칙
- `primary` 는 **인터랙션 포인트에만** 사용 (버튼, 활성 탭, 선택 상태, 진행 바)
- 텍스트 색상 위계: `foreground` > `muted-foreground` > `muted-foreground/60`
- 카드 테두리: 기본 `border`, 활성/호버 `border-primary/40` ~ `border-primary/50`

---

## 3. 타이포그래피

### 폰트
- **패밀리**: Inter (Google Fonts) — `--font-sans`
- **렌더링**: `antialiased`, `font-feature-settings: "cv02","cv03","cv04","cv11"`

### 스케일

| 용도 | 클래스 | 크기 | 굵기 |
|------|--------|------|------|
| 페이지 제목 (H1) | `text-xl font-bold` | 20px | 700 |
| 섹션 제목 (H2) | `text-3xl font-bold tracking-tight` | 30px | 700 |
| 카드 제목 | `text-sm font-semibold` | 14px | 600 |
| 본문 | `text-sm` | 14px | 400 |
| 보조 텍스트 | `text-xs text-muted-foreground` | 12px | 400 |
| 레이블 (섹션 구분) | `.label-xs` | 12px | 500, letter-spacing 넓음 |

### `.label-xs` 규칙
```css
text-xs font-medium tracking-widest uppercase text-muted-foreground
```
섹션 구분에 사용. Hero의 배지, Steps 제목, EQ 섹션 제목 등.

---

## 4. 컴포넌트 시스템

### 4-1. 표면 (Surface)

```css
/* 기본 카드 표면 */
.surface {
  bg-card border border-border rounded-xl;
}

/* 클릭 가능한 표면 */
.surface-hover {
  surface + transition-colors hover:border-primary/40 hover:bg-card/80 cursor-pointer;
}
```

**사용처**: 기기 목록 아이템, 장르 선택 카드, 오디오 타입 선택, A/B 청취 카드

---

### 4-2. 버튼

#### Primary 버튼
```css
.btn-primary {
  bg-primary text-primary-foreground px-5 py-2.5 rounded-lg
  text-sm font-semibold
  hover:brightness-110 active:brightness-95 active:scale-[0.99]
}
```
**사용처**: 테스트 시작, 테스트 진행, 결과 페이지 주요 액션

#### Outline 버튼 (shadcn/ui `variant="outline"`)
```
border-border hover:border-primary/50 hover:bg-primary/5
```
**사용처**: A 선택 / B 선택 버튼, 다운로드, 공유

#### Ghost 버튼 (shadcn/ui `variant="ghost"`)
```
text-muted-foreground hover:text-foreground
```
**사용처**: 비슷함 버튼, 다시 테스트하기

#### 텍스트 링크
```
text-sm text-primary font-medium hover:underline underline-offset-4
```
**사용처**: "더 자세히 알아보기 →", CTA 섹션 링크

---

### 4-3. 헤더

#### 메인 헤더 (홈)
```
sticky top-0 z-50 bg-background/90 border-b border-border backdrop-blur-sm
height: h-14
```
- 좌: 브랜드명 텍스트 (아이콘 없음)
- 우: `Globe` (언어) + `Moon/Sun` (테마) — 동일한 `w-8 h-8` 버튼

#### 서브 헤더 (test/result)
```
sticky top-0 z-50 bg-background/90 border-b border-border backdrop-blur-sm
height: h-14
```
- 좌: `←` ArrowLeft 버튼 (`w-4 h-4`)
- 중앙: 페이지 제목 (`text-sm font-semibold`, absolute 중앙 정렬)
- 우: 빈 공간 (`w-10`)

---

### 4-4. 하단 탭 (Bottom Nav)

```
fixed bottom-0 bg-background/95 border-t border-border backdrop-blur-sm
height: h-14
```

| 상태 | 스타일 |
|------|--------|
| 활성 | `text-foreground` |
| 비활성 | `text-muted-foreground hover:text-foreground` |

- **아이콘 없음**, 텍스트만
- `/test`, `/result` 에서는 숨김

---

### 4-5. 진행 바 (Progress)

```css
.progress-track { w-full h-0.5 bg-border rounded-full }
.progress-fill  { h-full bg-primary rounded-full transition-all duration-500 ease-out }
```

- 높이 `h-0.5` (2px) — 얇고 섬세하게
- 상단에 `진행도 레이블 | 퍼센트` 표시 (`text-xs text-muted-foreground`)

---

### 4-6. A/B 청취 카드

```css
.choice-card {
  surface + transition-all cursor-pointer hover:border-primary/50 active:scale-[0.98]
}
.choice-card-active { border-primary bg-primary/10 }  /* 재생 중 */
.choice-card-done   { border-border/60 bg-muted/30 }  /* 청취 완료 */
```

구성 요소:
1. 상태 아이콘 원형 (`w-10 h-10 rounded-full bg-muted`)
   - 기본: `Play` (w-4 h-4)
   - 재생 중: `Pause` (w-4 h-4), 원 배경 `bg-primary text-primary-foreground`
   - 완료: `CheckCircle` (w-4 h-4 text-primary)
2. 옵션 레이블 `A` / `B` (`text-xl font-bold`)
3. 상태 텍스트 (`text-xs text-muted-foreground`)

---

### 4-7. 정보 박스 (Info Box)

```css
.info-box {
  rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground
}
```
**사용처**: TIP 메시지, 자동 구간 재생 안내

---

### 4-8. EQ 바 그래프

```css
.eq-bar-boost { bg-primary/80 rounded-t-[2px] transition-all duration-500 }
.eq-bar-cut   { bg-primary/40 rounded-b-[2px] transition-all duration-500 }
```

- 0dB 기준선: `absolute h-px bg-border`
- 바 컨테이너: `surface p-4` 안에 `h-40 relative`
- 주파수 레이블: `text-[8px] text-muted-foreground`
- boost(양수): `primary/80`, cut(음수): `primary/40` — 단색, 그라데이션 없음

---

## 5. 레이아웃

### 최대 너비
```
max-w-lg (512px)
container mx-auto px-4
```
모바일 우선 단일 컬럼 레이아웃. 데스크톱에서는 중앙 정렬.

### 섹션 구분
Divider 방식: `<div className="border-t border-border" />`
섹션 간격: `py-12` (상하 패딩)

### 페이지 셸
```css
.page-shell { min-h-screen bg-background flex flex-col }
```

---

## 6. 애니메이션 & 인터랙션

### 허용되는 애니메이션

| 이름 | 용도 | 정의 |
|------|------|------|
| `.fade-up` | 페이지/스텝 전환 시 진입 | `translateY(8px)→0, opacity 0→1, 0.25s ease-out` |
| `progress-fill` | 진행 바 너비 변화 | `transition-all duration-500 ease-out` |
| `eq-bar` | EQ 그래프 바 높이 변화 | `transition-all duration-500` |
| `Loader2` | 로딩 스피너 | `animate-spin` |
| `accordion` | Accordion 열기/닫기 | shadcn/ui 기본 (`0.2s ease-out`) |

### 인터랙션 규칙

| 요소 | Hover | Active | 전환 속도 |
|------|-------|--------|-----------|
| 버튼 (기본) | - | `scale-[0.98]` | `100ms` |
| Primary 버튼 | `brightness-110` | `brightness-95 scale-[0.99]` | `150ms` |
| surface-hover 카드 | `border-primary/40 bg-card/80` | - | `150ms` |
| 텍스트 링크 | `underline` | - | `150ms` |
| 탭 링크 | `text-foreground` | - | `150ms` |

---

## 7. 아이콘 사용 정책

### 허용 (기능 아이콘)
| 아이콘 | 사용처 |
|--------|--------|
| `ArrowLeft` | 서브 헤더 뒤로가기 |
| `Search` | 기기 검색 입력창 |
| `Play / Pause` | A/B 청취 카드 |
| `CheckCircle` | 청취 완료 상태 |
| `Loader2` | 로딩 스피너 |
| `Upload` | 업로드 버튼 (shadcn Button 내) |
| `Download` | 결과 다운로드 버튼 |
| `Share2` | 공유 버튼 |
| `RotateCcw` | 다시 테스트 버튼 |
| `Home` | 결과 헤더 홈 버튼 |
| `Globe` | 언어 변경 토글 |
| `Moon / Sun` | 다크/라이트 테마 토글 |

### 금지 (장식 아이콘)
| 아이콘 | 이유 |
|--------|------|
| `Sparkles` | AI 느낌, 장식적 |
| `Music` | 카드 내 장식 목적 |
| `HelpCircle` | `?` 텍스트로 대체 |
| `BarChart3`, `BookOpen` 등 섹션 장식 | 텍스트 레이블로 대체 |
| 이모지 전반 (장르 카드 등) | 텍스트 전용으로 대체 |

---

## 8. 페이지별 UI 명세

### 8-1. 홈 (`/`)

```
[Header]
  브랜드명 "EQ FreeSet"  |  [Globe][Moon]

[Hero] — text-center, fade-up
  label-xs: heroBadge
  H1: heroTitle (text-primary 강조 1단어)
  body: heroDesc
  [btn-primary: 테스트 시작]

[Divider]

[Steps] — text-center
  label-xs: stepsTitle
  번호 원형(bg-primary/10 border border-primary/20) + 제목 + 설명
  (수직 배열, items-center)

[Divider]

[Info Article]
  label-xs: infoTitle
  H2: 기사 제목
  p: 기사 요약
  텍스트 링크: "더 자세히 →"

[Divider]

[FAQ]
  label-xs
  Accordion (3개 항목)
  — AccordionTrigger: text-sm font-medium, hover:text-primary
  — AccordionContent: text-sm text-muted-foreground

[Divider]

[CTA Links] — 텍스트 링크 2개 (→ 화살표 포함)

[Footer]
  법무 링크 3개
  저작권 텍스트 (text-muted-foreground/60)

[BottomNav] — fixed bottom
```

---

### 8-2. 기기 선택 (`/test` — step: device)

```
[SubHeader] ← | 기기 선택 | (공백)

[Main] fade-up
  H1: 제목
  p: 설명

  [Search Input] — pl-9, Search 아이콘 absolute left

  [Accordion] — 브랜드별 그룹
    AccordionItem: surface + border rounded-xl
    AccordionTrigger: 브랜드명 | 기기 수(숫자)
    AccordionContent:
      [button rows]: 기기명 + 버전 (hover:bg-muted/60, hover:text-primary)
```

---

### 8-3. 오디오 선택 (`/test` — step: audio)

```
[SubHeader]

[Main] fade-up
  H1 + 설명

  [surface-hover buttons] — 2개, px-5 py-4
    제목 (font-semibold) + 설명 (text-xs muted) | →

  [info-box]: TIP 메시지
```

---

### 8-4. 장르 선택 (`/test` — step: segment/sample)

```
[SubHeader]

[Main] fade-up
  H1 + 설명

  [로딩 중]: Loader2 + 텍스트
  [로드 완료]:
    grid grid-cols-2 gap-2
    [surface-hover button] x10:
      장르명 (text-sm font-semibold) + 설명 (text-xs muted) | →
```

---

### 8-5. 파일 업로드 (`/test` — step: segment/upload)

```
[SubHeader]

[Main] fade-up
  H1

  [surface p-6 text-center]:
    [파일 선택 Button(outline)]
    파일명 표시
    [로딩: Loader2 + 텍스트]

  [분석 완료 시]:
    CheckCircle + "분석 완료" 텍스트
    [자동 구간 선택 버튼] — border-primary bg-primary/5 시 활성
    [수동 구간 선택 버튼]
    [btn-primary: 테스트 시작]

  [파일 미선택 시]:
    포맷 힌트 3줄 (text-xs muted)
```

---

### 8-6. A/B 테스트 (`/test` — step: test)

```
[SubHeader] ← | 분석 N/16 | (공백)

[Main] flex-col, fade-up

  [Progress Bar]
    label-xs | 퍼센트%
    h-0.5 progress-track > progress-fill

  [Axis Info]
    label-xs: bayesianLabel
    H1: 축 제목
    p: 축 설명
    p(dim): listenBoth 안내

  [수동 구간 슬라이더] (manualMode 시)
    surface p-4
    레이블 | 시간 범위
    <input range>
    경고 텍스트

  [자동 구간 안내] (autoMode 시)
    info-box: CheckCircle + 텍스트

  [A/B 청취 카드] grid grid-cols-2
    choice-card x2 (위 4-6 명세)

  [needBoth 안내] (두 개 안 들었을 시)
    text-xs text-muted-foreground text-center

  [선택 버튼]
    grid grid-cols-2: [A가 더 좋음] [B가 더 좋음] — outline h-14
    [비슷함] — ghost h-11

  [도움말 버튼]
    surface border rounded-xl px-4 py-3
    제목 + 설명 | ?
    → Dialog 열림
```

---

### 8-7. 결과 (`/result`)

```
[SubHeader] Home | 최종 결과 | (공백)

[Main] fade-up

  [완료 헤더]
    label-xs: "테스트 완료!"
    H1: 기기명 + "에 최적화된 EQ 설정을 찾았습니다"
    p: 인사이트 메시지

  [Divider]

  [선호도 분석]
    label-xs
    [4개 축 행]:
      축명(capitalize) | Badge(boosted/reduced/balanced)
      progress-track (신뢰도)
      p(text-xs muted): 설명

  [Divider]

  [EQ 그래프]
    label-xs
    [surface p-4]:
      h-40: 바 그래프 (10밴드)
      0dB 기준선
    [5x2 grid]: 주파수 + dB 값 (primary색: 양수, muted: 음수/0)
    [2열 버튼]:
      [Download outline] + 설명
      [Share outline] + 설명

  [Divider]

  [다시 테스트] — ghost + RotateCcw
    설명 텍스트
```

---

## 9. 반응형 전략

- 모바일 우선 (`max-w-lg` 단일 컬럼)
- 데스크톱: 컨테이너 중앙 정렬, 레이아웃 변경 없음
- 유일한 그리드 분기: 결과 페이지 EQ 수치 (`grid-cols-5 md:grid-cols-5`)

---

## 10. 파일 맵

| 파일 | 역할 |
|------|------|
| `src/app/globals.css` | 디자인 토큰(CSS 변수) + 컴포넌트 클래스 전체 |
| `src/app/page.tsx` | 홈 페이지 |
| `src/app/test/page.tsx` | 테스트 플로우 4단계 (device/audio/segment/test) |
| `src/app/result/page.tsx` | 결과 페이지 |
| `src/components/bottom-nav.tsx` | 하단 탭바 |
| `src/components/theme-toggle.tsx` | 다크/라이트 토글 (Moon/Sun 아이콘) |
| `src/components/language-toggle.tsx` | 언어 변경 토글 (Globe 아이콘) |
| `src/components/ui/` | shadcn/ui 기본 컴포넌트 11종 |
| `src/locales/ko.ts` | 한국어 (기준 로케일) |
| `src/locales/en.ts` | 영어 |
| `src/locales/zh.ts` | 중국어 |
| `src/locales/ja.ts` | 일본어 |

---

## 11. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-05-08 | 전면 리디자인 (Refined Minimalism 적용) |
| 2026-05-08 | Hero·Steps 가운데 정렬 |
| 2026-05-08 | 장식 아이콘 정리 (이모지·HelpCircle·Music 등 제거) |
| 2026-05-08 | 언어/테마 토글 스타일 통일 (w-8 h-8 버튼) |
| 2026-05-08 | 하단 탭 텍스트 전용으로 변경 |
| 2026-05-08 | 로케일 AI 표현 제거 (`AI 분석` → `분석`) |
