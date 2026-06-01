# EQ FreeSet — EQ 탐색 알고리즘 상세 문서

> 파일: `src/lib/audio-store.ts`  
> 마지막 업데이트: 2026-05-07

---

## 1. 전체 흐름 요약

```
기기 선택 → 오디오 선택 → 구간 분석 → A/B 테스트 (16라운드) → 결과 계산
```

사용자는 A/B 블라인드 테스트를 통해 자신의 청각 선호도를 간접적으로 측정한다.  
각 라운드에서 "A가 낫다", "B가 낫다", "비슷하다" 중 하나를 선택하면,  
Bayesian 추론이 EQ gain 추정값을 점점 좁혀나간다.

---

## 2. 테스트 축 (4개)

EQ 10밴드를 4개의 의미적 축으로 묶어 테스트한다.

| 축 | 필터 인덱스 | 주파수 대역 | 의미 |
|----|-----------|------------|------|
| `bass` | [0, 1] | 32Hz, 64Hz | 저음 강도 |
| `warmth` | [2, 3] | 125Hz, 250Hz | 음색 따뜻함 |
| `vocal` | [4, 5] | 500Hz, 1000Hz | 보컬 선명도 |
| `brightness` | [6, 7, 8, 9] | 2000Hz, 4000Hz, 8000Hz, 16000Hz | 고음 밝기 |

> 10밴드를 하나씩 테스트하면 40라운드 이상 필요하지만,  
> 4축으로 묶으면 16라운드로 충분한 정보를 얻을 수 있다.

---

## 3. Bayesian 추론 — 라운드별 gain 갱신

### 초기 prior

```ts
bayesMean: 0   // 0dB에서 시작 (평탄한 EQ 가정)
bayesStd:  5   // 넓은 불확실성 (±5dB 탐색 범위)
```

### A/B gain 산출

매 라운드, 현재 축의 `bayesMean`, `bayesStd`를 이용해 A와 B의 gain을 결정한다.

```ts
aGain = clamp(bayesMean - bayesStd)   // A = 더 낮은 쪽
bGain = clamp(bayesMean + bayesStd)   // B = 더 높은 쪽
clamp = (v) => Math.max(-10, Math.min(10, v))
```

예시: `bayesMean=2, bayesStd=3` → A는 −1dB, B는 +5dB

### 사용자 응답에 따른 posterior 갱신 (Thurstone 근사)

```ts
if (선택 == 'B')      bayesMean = min(10, bayesMean + bayesStd * 0.4)   // 더 높은 쪽 선호
if (선택 == 'A')      bayesMean = max(-10, bayesMean - bayesStd * 0.4)  // 더 낮은 쪽 선호
if (선택 == 'similar') bayesStd *= 0.7    // 차이를 못 느낌 → 빠르게 수렴
else                   bayesStd *= 0.85   // 차이를 느낌 → 점진적 수렴
bayesStd = max(0.5, bayesStd)            // 최소 탐색 범위 유지
```

### 수렴 과정 예시 (bass 축)

| 라운드 | 선택 | bayesMean | bayesStd | A | B |
|--------|------|-----------|----------|---|---|
| 1 | B (강한 저음 선호) | 2.0 | 4.25 | −3.0 | +7.0 |
| 2 | B | 3.7 | 3.61 | +0.1 | +7.3 |
| 3 | similar | 3.7 | 2.53 | +1.2 | +6.2 |
| 4 | A | 2.7 | 2.15 | +0.5 | +4.8 |
| … | … | → 3.0 근방 수렴 | → 0.5 수렴 | | |

---

## 4. 축 선택 전략 — 최대 정보 이득

매 라운드 **가장 `bayesStd`가 큰 축**(가장 불확실한 축)을 자동 선택한다.

```ts
const nextAxis = AXES.reduce((a, b) =>
  axisStates[a].bayesStd >= axisStates[b].bayesStd ? a : b
)
```

이렇게 하면 16라운드 안에 4축이 자동으로 균형 있게 분배되고,  
불확실한 축에 더 많은 라운드가 집중되어 정보 효율이 극대화된다.

---

## 5. 라운드 수 — 왜 16라운드인가?

| 항목 | 값 |
|------|----|
| 총 라운드 | 16 |
| 축 수 | 4 |
| 평균 라운드 / 축 | 4 |

초기 `bayesStd=5`에서 4번 응답하면:

```
5 → 4.25 → 3.61 → 3.07 → 2.61  (모두 B 선택 시)
5 → 3.5  → 2.45 → 1.72 → 1.2   (similar 혼합 시)
```

약 4라운드 후 `bayesStd ≤ 2.5` 수준으로 gain 추정 오차가 ±2.5dB 이내로 좁혀진다.  
16라운드는 "사용자 피로 최소화"와 "충분한 수렴" 사이의 실용적 타협점이다.

---

## 6. EQ 범위 제한 — ±10dB 3중 클램핑

gain이 ±10dB를 초과하면 음질 왜곡 위험이 크다.  
세 군데에서 중복으로 클램핑하여 어느 경로로든 범위를 벗어나지 않도록 한다.

| 적용 시점 | 코드 위치 |
|----------|----------|
| A/B gain 산출 | `getCurrentABGains()` 내 `clamp()` |
| Bayesian 갱신 | `processResponse()` 내 `min/max` |
| 최종 EQ 출력 | `completeTest()` 내 `gainOf()` |

---

## 7. Loudness Normalization (Preamp 보정)

"B가 더 크게 들려서 좋다"는 착시를 방지한다.  
양의 gain이 올라갈수록 전체 볼륨(GainNode)을 같은 양만큼 낮춘다.

```ts
const maxPositiveGain = max(모든 필터의 finalGain, 0)
const preampDb = -maxPositiveGain
gainNode.gain.value = 10^(preampDb / 20)   // dB → linear 변환
```

예: 6dB boost가 있으면 GainNode를 −6dB 낮춤 → 전체 음량 동일 유지

---

## 8. 구간 분석 (`analyzeSegments`)

업로드 음원 또는 샘플을 사용할 때, 테스트 구간을 자동 선택한다.

### 동작 방식

1. 30초 이상 곡은 **앞 15%, 뒤 15% 제외** (전주/아웃트로 skip)
2. 유효 구간에서 **5초 간격 슬라이딩 윈도우**를 사용하여 2~10초 길이 구간 추출
3. 각 구간의 PCM Float32Array 데이터에 직접 2차 Butterworth 대역통과 필터(Bilinear Transform 방식) 연산을 수행
4. 대역통과 필터 통과 후 각 축별 RMS 에너지와 구간 전체의 RMS 에너지를 계산
5. `prominence = bandRMS / totalRMS`를 산출하여 주파수 비중 측정
6. `score = bandRMS × prominence^1.5` — 대역별 특성이 두드러진 구간에 높은 점수 부여
7. **겹치지 않는 상위 3개 구간** 반환

### 축별 분석 주파수 범위

| 축 | 범위 |
|----|------|
| `bass` | 20 – 250 Hz |
| `warmth` | 250 – 600 Hz |
| `vocal` | 600 – 3500 Hz |
| `brightness` | 3500 – 16000 Hz |

### 성능 특징

- **클라이언트 사이드 연산**: `OfflineAudioContext`나 `AnalyserNode`를 생성하지 않고, 직접 디코딩된 오디오 버퍼의 채널 데이터를 O(n) 필터 수식 시뮬레이션으로 연산하여 수 밀리초(ms) 만에 분석이 완료됨.

---

## 9. 최종 EQ 계산 (`completeTest`)

### personalizationDelta 구성

```ts
personalizationDelta = [
  { frequency: 32,    gain: clamp(axisStates.bass.gain) },       // filter[0]
  { frequency: 64,    gain: clamp(axisStates.bass.gain) },       // filter[1]
  { frequency: 125,   gain: clamp(axisStates.warmth.gain) },     // filter[2]
  { frequency: 250,   gain: clamp(axisStates.warmth.gain) },     // filter[3]
  { frequency: 500,   gain: clamp(axisStates.vocal.gain) },      // filter[4]
  { frequency: 1000,  gain: clamp(axisStates.vocal.gain) },      // filter[5]
  { frequency: 2000,  gain: clamp(axisStates.brightness.gain) }, // filter[6]
  { frequency: 4000,  gain: clamp(axisStates.brightness.gain) }, // filter[7]
  { frequency: 8000,  gain: clamp(axisStates.brightness.gain) }, // filter[8]
  { frequency: 16000, gain: clamp(axisStates.brightness.gain) }, // filter[9]
]
```

### optimalEQ 계산

```ts
optimalEQ.bands[i].gain = clamp(device.baseEQ[i].gain + personalizationDelta[i].gain)
```

기기의 AutoEQ 기본값 위에 사용자의 개인화 델타를 더한다.

### 신뢰도 계산

```ts
avgStd = (bass.bayesStd + warmth.bayesStd + vocal.bayesStd + brightness.bayesStd) / 4
confidence = clamp(1 - avgStd / 6, 0.5, 0.99)
```

`bayesStd`가 작을수록 (= 수렴이 잘 될수록) 신뢰도가 높다.

---

## 10. 결과 저장 및 복원

- **저장**: `completeTest()` 완료 시 `localStorage['eqfreeset.results']`에 자동 저장
- **복원**: `/result?id={uuid}`로 특정 결과 조회, 파라미터 없으면 최신 결과 사용

```ts
// SavedResult 구조
{
  id: string              // crypto.randomUUID()
  deviceId: string
  deviceName: string
  personalizationDelta: EQBand[]
  responses: TestResponse[]
  confidence: number      // 0.5 ~ 0.99
  createdAt: string       // ISO 8601
}
```

---

## 11. 관련 파일

| 파일 | 역할 |
|------|------|
| `src/lib/audio-store.ts` | 핵심 알고리즘 전체 (Bayesian, 구간 분석, EQ 계산, 로컬스토리지 저장) |
| `src/app/test/page.tsx` | 테스트 UI, 라운드 진행, 구간 분석 호출 |
| `src/app/result/page.tsx` | 결과 표시, EQ 그래프, 다운로드 |
| `src/lib/device-db.ts` | 기기별 AutoEQ 기본값 DB |
