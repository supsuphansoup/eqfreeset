# 개인화 EQ 웹서비스 MVP 권장 기술스택

이 문서는 개인화 EQ 웹서비스 MVP 명세를 기준으로, 실제 구현에 가장 적합한 기술스택을 레이어별로 정리한 제안서다. 서비스는 브라우저 내 A/B 청취 비교, 10-band EQ 적용, 업로드 음원 처리, 결과 저장, 후기 및 정보글 제공을 포함하므로 일반 콘텐츠 웹사이트보다 오디오 엔진, 보안 업로드, 상태 관리, 재현 가능한 데이터 구조가 더 중요하다.

## 기술 선정 원칙

이 프로젝트의 핵심은 “초보자도 쉽게 쓰는 오디오 중심 웹앱”이다. 따라서 기술스택은 다음 기준을 만족해야 한다.

- 브라우저에서 안정적으로 10-band EQ와 A/B 전환을 처리할 것.
- 모바일과 데스크톱 모두에서 UX 품질을 유지할 것.
- 사용자 업로드 오디오를 안전하게 처리할 것.
- AutoEq 기반 기기 데이터를 관리하고 버전 추적이 가능할 것.
- MVP 단계에서 개발 속도와 운영 단순성을 확보할 것.

## 권장 아키텍처

전체 구조는 **Next.js 중심의 통합 웹앱 + PostgreSQL 기반 데이터 저장 + 비공개 오브젝트 스토리지 + 별도 오디오 분석 워커** 형태가 가장 적합하다. Next.js는 React 기반 웹앱 개발과 서버 기능을 함께 제공하며 공식 문서에서 App Router, Route Handlers, Middleware, 로딩 UI 등 제품형 웹서비스에 필요한 구조를 제공한다.[cite:11]

Web Audio API는 브라우저에서 오디오 처리를 위한 표준 API이며, W3C 사양은 오디오 라우팅과 프로세싱을 위한 고수준 API라고 설명한다.[cite:3] 또한 BiquadFilterNode는 lowpass, highpass, bandpass, lowshelf, highshelf, peaking 등 여러 필터 타입을 제공해 브라우저 EQ 구현의 핵심 구성요소로 적합하다.[cite:10]

## 프론트엔드

### 권장 스택

- Next.js 14+ (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- Zustand 또는 Jotai
- React Hook Form + Zod

### 선정 이유

Next.js는 서버 렌더링, 라우팅, 로딩 상태 처리, API 엔드포인트 구성을 하나의 코드베이스에서 다룰 수 있어 MVP 개발 속도와 유지보수성 측면에서 유리하다.[cite:11] 이 서비스는 홈, 테스트, 내 결과, 후기, 정보글, 관리자 기능을 함께 가져가야 하므로 프론트와 API를 분리하지 않는 구조가 초기 단계에 특히 적합하다.

TypeScript는 테스트 세션 상태, EQ 데이터 구조, AutoEq 변환 포맷, 결과 메타데이터처럼 필드가 많은 서비스에서 실수를 줄이는 데 유리하다. 특히 `device_id`, `base_eq_version`, `personalization_delta`, `response_log` 같은 구조적 데이터는 정적 타입 검증의 이점이 크다.

shadcn/ui와 Radix UI 조합은 선택도움 모달, 모바일 바텀시트, 접근성 포커스 트랩, 키보드 조작 지원 같은 요구사항을 구현하기 좋다. WCAG 관점에서도 모달과 키보드 탐색 같은 상호작용 품질이 중요한데, 이 서비스는 팝업 기반 선택도움과 오디오 제어 UI가 핵심이므로 접근성 기반 UI 컴포넌트 사용이 효율적이다.[cite:3]

Zustand는 A/B 테스트 중 현재 회차, 선택 결과, 응답 시간, 재청취 여부, 신뢰도 계산 입력값 등을 가볍게 관리하기 좋다. Redux보다 설정이 단순해 MVP에 잘 맞고, 세션 단위 로컬 상태가 많은 이 프로젝트와도 잘 맞는다.

## 오디오 엔진

### 권장 스택

- Web Audio API
- BiquadFilterNode 기반 10-band EQ 체인
- GainNode 기반 A/B 전환
- AudioContext 수동 초기화
- Canvas 또는 SVG 기반 EQ 시각화

### 선정 이유

Web Audio API는 브라우저 내 오디오 그래프 구성, 필터 적용, 게인 제어, 분석 기능을 지원하는 표준이다.[cite:3] BiquadFilterNode는 peaking, lowshelf, highshelf를 제공하므로 10-band graphic EQ를 구현할 때 가장 현실적인 선택이다.[cite:10]

이 MVP에서는 저역과 고역 끝단에 shelf, 중간 대역에는 peaking 필터를 두는 체인이 적합하다.[cite:10] 또한 A/B 전환 시 단순 on/off가 아니라 GainNode를 이용해 짧은 crossfade를 적용하면 클릭 노이즈를 줄일 수 있다.

모바일 브라우저에서는 자동재생 제한이 있으므로 첫 사용자 탭 이후 AudioContext를 시작해야 한다. Web Audio 관련 문서와 브라우저 동작 제약을 고려하면 “테스트 시작” 버튼 이후 오디오 컨텍스트를 resume 하는 UX가 가장 안전하다.[cite:3][cite:10]

## 백엔드

### 권장 스택

- Next.js Route Handlers
- 서버 액션 또는 tRPC
- Node.js 런타임
- 백그라운드 작업용 큐 또는 서버리스 함수

### 선정 이유

이 프로젝트는 일반 CRUD를 넘어서 파일 검증, 업로드 프록시, 결과 저장, 후기 작성 조건 검증, 기기 alias 검색, 세션 신뢰도 계산 등 서버 로직이 많다. Next.js Route Handlers는 이런 기능을 같은 프로젝트 안에서 구현하기 좋고, 공식 문서도 서버 기능 구성을 지원한다.[cite:11]

API 계층은 두 방향 중 하나가 적합하다.

- **빠른 MVP 우선**: Next.js Route Handlers + Zod 검증
- **타입 일관성 강화**: tRPC

초기 출시 속도가 더 중요하면 Route Handler만으로 충분하다. 다만 추천 엔진 입력과 결과 구조가 복잡해질 가능성이 크므로, 팀이 TypeScript 중심이라면 tRPC도 좋은 선택이다.

## 데이터베이스

### 권장 스택

- PostgreSQL
- Supabase 또는 관리형 Postgres
- Prisma 또는 Drizzle ORM

### 선정 이유

이 서비스는 기기 DB, 모델 alias, EQ 프로파일 버전, 테스트 세션, 응답 로그, 후기, 기기 요청, 정보글, 관리자 계정 등 관계형 데이터가 많다. 이런 구조에는 문서형 DB보다 PostgreSQL이 더 적합하다.

Supabase는 PostgreSQL 기반이며 인증과 스토리지를 함께 제공해 MVP 속도에 유리하다. 특히 사용자별 결과 접근 제어가 필요한 경우 Row Level Security 같은 Postgres 기반 접근제어 전략과 잘 맞는다.

ORM은 Prisma가 생산성이 높고 생태계가 넓어 초기 개발에 유리하다. Drizzle은 더 가볍고 SQL 친화적이라 팀 취향에 따라 선택 가능하지만, 빠른 팀 온보딩 관점에서는 Prisma가 무난하다.

### 핵심 테이블 예시

| 테이블 | 역할 |
| --- | --- |
| devices | 지원 기기 목록 |
| device_aliases | 모델명 alias 검색 매핑 |
| eq_profiles | AutoEq 기반 base EQ 저장 |
| test_sessions | 테스트 세션 메타데이터 저장 |
| test_responses | A/B 응답 로그 저장 |
| result_presets | 최종 개인화 결과 저장 |
| upload_files | 업로드 파일 메타데이터 |
| device_requests | 미지원 기기 요청 |
| reviews | 검증형 후기 |
| articles | 정보글 |

## 파일 업로드 및 스토리지

### 권장 스택

- AWS S3 또는 Cloudflare R2
- 비공개 버킷
- 서버 사이드 업로드 프록시
- UUID 파일명 치환
- ClamAV 스캔
- 메타데이터 제거 라이브러리

### 선정 이유

파일 업로드는 보안 리스크가 크기 때문에 공개 URL을 발급하지 않는 비공개 오브젝트 스토리지가 적합하다. 업로드 파일은 서버가 확장자, MIME type, magic bytes를 모두 검사한 뒤 저장해야 하며, 악성코드 스캔도 추가하는 것이 바람직하다. ClamAV는 서버 측 악성코드 검사 도구로 널리 사용된다.[cite:1]

파일명은 UUID로 치환하고, 재생은 S3 직접 공개가 아니라 서버 프록시를 거치는 구조가 적합하다. 이렇게 해야 명세서에 적힌 “direct public access 차단”, “signed URL 미사용”, “서버 사이드 proxy” 원칙을 지키기 쉽다.

Cloudflare R2는 S3 호환 API를 제공하면서 egress 비용 측면에서 유리할 수 있고, AWS S3는 생태계와 운영 안정성이 강점이다. MVP에서는 팀이 익숙한 쪽을 택하면 되지만, 국내 트래픽과 향후 음원 재생량까지 고려하면 둘 다 충분히 적합하다.

## AutoEq 데이터 파이프라인

AutoEq 저장소는 MIT 라이선스를 사용하며, 저장소 자체가 헤드폰 EQ 자동화 프로젝트임을 공개하고 있다.[cite:9][cite:12] MIT 라이선스는 재사용과 수정이 가능하지만 라이선스 고지를 포함해야 하므로 서비스 내 법적 고지 페이지에 원문과 출처 링크를 포함하는 구조가 적절하다.[cite:9]

### 권장 처리 방식

- AutoEq 원본 데이터를 직접 프론트에 노출하지 않음
- 내부 표준 포맷으로 변환 후 DB 적재
- 10-band graphic EQ로 다운샘플링
- `base_eq_version` 필드로 버전 관리
- alias와 신뢰도 점수를 별도 테이블 또는 컬럼으로 관리

### 구현 스택

- Python 스크립트 또는 Node.js ETL 스크립트
- GitHub Actions 정기 동기화
- PostgreSQL 적재

이 파이프라인은 초기에는 수동 배치로 시작해도 되지만, 이후 기기 수가 늘어나면 정기 배치 자동화가 유리하다.

## 오디오 분석 및 자동 구간 추천

### 권장 스택

- Python FastAPI 또는 서버리스 Python 함수
- `librosa` 기반 주파수 특징 추출
- 비동기 작업 큐

### 선정 이유

사용자 업로드 음원에서 저음/보컬/고음 비교에 적합한 구간을 추천하려면 단순 파일 저장만으로는 부족하고, 주파수 특성 분석이 필요하다. 이런 작업은 Node.js보다 Python 오디오 분석 생태계가 훨씬 강하다.

따라서 웹앱 메인 서버는 Next.js로 유지하고, 오디오 구간 추천만 Python 분석 워커로 분리하는 구조가 가장 실용적이다. 분석 실패 시 곡 중간 10초 fallback을 제공하면 사용자 경험도 안정적이다.

## 인증 및 권한

### 권장 스택

- Supabase Auth 또는 NextAuth.js
- Google / Apple 소셜 로그인
- 역할 기반 관리자 권한 분리

### 선정 이유

명세서상 업로드 권한은 로그인 사용자에게만 부여되므로 인증 모듈은 필수다. Supabase Auth는 DB와 함께 쓸 때 빠르게 붙일 수 있고, NextAuth.js는 Next.js 친화성이 강점이다.

초기 MVP에서는 이메일 로그인보다 Google 또는 Apple 로그인 위주가 진입장벽을 낮춘다. 관리자는 일반 사용자와 별도 role 필드로 구분하고, `/admin` 경로는 서버에서 차단하는 것이 적절하다.

## 관리자 백오피스

### 권장 스택

- Next.js 내부 관리자 페이지
- Supabase Studio 또는 별도 어드민 UI
- RBAC 기반 접근 통제

### 선정 이유

MVP 백오피스는 복잡한 CMS보다 내부 관리 화면이면 충분하다. 기기 등록/수정, alias 수정, 후기 숨김, 기기 요청 목록 확인은 모두 일반적인 테이블 기반 UI로 구현 가능하다.

초기에는 일부 작업을 Supabase Studio로 대체할 수 있지만, 운영자가 자주 쓰는 기능은 내부 어드민 화면으로 점진적으로 옮기는 편이 좋다.

## 인프라 및 배포

### 권장 스택

| 영역 | 권장안 |
| --- | --- |
| 웹 호스팅 | Vercel |
| DB | Supabase Postgres |
| 스토리지 | AWS S3 또는 Cloudflare R2 |
| 오디오 분석 | Python 워커(FastAPI 또는 서버리스) |
| 모니터링 | Sentry |
| 배치 작업 | GitHub Actions / Cron |

### 선정 이유

Next.js는 Vercel에서 가장 자연스럽게 배포되고, 프리뷰 배포 및 운영 편의성이 높다.[cite:11] 모니터링은 테스트 화면처럼 인터랙션이 복잡한 서비스에서 필수이므로 프론트와 API 에러를 함께 잡을 수 있는 Sentry가 적합하다.

오디오 분석은 요청 시간과 CPU 사용량이 커질 수 있으므로 메인 웹앱과 분리하는 편이 좋다. 정적 정보글과 일반 페이지는 Vercel로 충분하고, 분석과 업로드 스캔은 별도 실행 계층으로 떼어내는 구조가 운영상 안정적이다.

## 최종 추천 조합

가장 현실적이고 균형 잡힌 MVP 조합은 아래와 같다.

| 레이어 | 최종 추천 |
| --- | --- |
| 프론트엔드 | Next.js + React + TypeScript + Tailwind + shadcn/ui |
| 오디오 엔진 | Web Audio API + BiquadFilterNode + GainNode |
| 상태 관리 | Zustand |
| 폼/검증 | React Hook Form + Zod |
| 백엔드 | Next.js Route Handlers |
| DB | Supabase Postgres |
| ORM | Prisma |
| 인증 | Supabase Auth |
| 파일 저장 | AWS S3 또는 Cloudflare R2 |
| 악성코드 검사 | ClamAV |
| 오디오 분석 | Python FastAPI + librosa |
| 배포 | Vercel |
| 모니터링 | Sentry |

## 한 줄 권고

이 MVP에 가장 적합한 기술스택은 **Next.js 중심 풀스택 웹앱 + Web Audio API 기반 브라우저 EQ 엔진 + Supabase Postgres + 비공개 오브젝트 스토리지 + Python 오디오 분석 워커** 조합이다.[cite:3][cite:10][cite:11][cite:12] 이 조합은 브라우저 오디오 처리, 개발 속도, 데이터 구조 안정성, 업로드 보안, 추후 확장성 사이의 균형이 가장 좋다.
