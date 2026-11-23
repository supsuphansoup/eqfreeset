import type { LangCode } from '@/lib/language-context'
import type { DeviceProfile, TestAxis } from '@/lib/audio-store'
import type { GuideArticle, GuideBlock, GuideContent } from '@/lib/guides'
import { findDeviceById } from '@/lib/device-db'
import { AXIS_FREQUENCIES, getPreampDb } from '@/lib/eq-processing'

/**
 * 기기별 EQ 설정 페이지 (/eq/{id}/)
 * - DB의 baseEQ는 기기를 타깃 커브에 맞추는 보정값이므로, 부호를 뒤집으면
 *   "타깃 대비 이 기기의 원래 소리 성향"이 된다. 10밴드 보정이라 대략적인 경향만 나타낸다.
 */

type DeviceForm = 'sealed' | 'open' | 'headphones'

type FeaturedDevice = { id: string; koName: string; form: DeviceForm }

// 국내 검색 수요가 큰 인기 기기부터 선정 (추가 시 이 목록에만 넣으면 페이지·사이트맵이 생성됨)
export const FEATURED_DEVICES: FeaturedDevice[] = [
  { id: 'apple-airpods-pro-2nd-gen', koName: '에어팟 프로 2', form: 'sealed' },
  { id: 'apple-airpods-4-anc', koName: '에어팟 4 (ANC)', form: 'open' },
  { id: 'apple-airpods-4', koName: '에어팟 4', form: 'open' },
  { id: 'apple-airpods-max', koName: '에어팟 맥스', form: 'headphones' },
  { id: 'samsung-galaxy-buds4-pro', koName: '갤럭시 버즈4 프로', form: 'sealed' },
  { id: 'samsung-galaxy-buds3-pro', koName: '갤럭시 버즈3 프로', form: 'sealed' },
  { id: 'samsung-galaxy-buds3', koName: '갤럭시 버즈3', form: 'open' },
  { id: 'samsung-galaxy-buds-fe', koName: '갤럭시 버즈 FE', form: 'sealed' },
  { id: 'sony-wf-1000xm5', koName: '소니 WF-1000XM5', form: 'sealed' },
  { id: 'sony-wh-1000xm5', koName: '소니 WH-1000XM5', form: 'headphones' },
  { id: 'apple-airpods-pro-1st-gen', koName: '에어팟 프로 1', form: 'sealed' },
  { id: 'apple-airpods-3rd-gen', koName: '에어팟 3', form: 'open' },
  { id: 'apple-airpods-2nd-gen', koName: '에어팟 2', form: 'open' },
  { id: 'samsung-galaxy-buds2-pro', koName: '갤럭시 버즈2 프로', form: 'sealed' },
  { id: 'samsung-galaxy-buds2', koName: '갤럭시 버즈2', form: 'sealed' },
  { id: 'sony-wh-1000xm6', koName: '소니 WH-1000XM6', form: 'headphones' },
  { id: 'sony-wf-1000xm4', koName: '소니 WF-1000XM4', form: 'sealed' },
  { id: 'sony-wh-1000xm4', koName: '소니 WH-1000XM4', form: 'headphones' },
  { id: 'qcy-t13', koName: 'QCY T13', form: 'sealed' },
  { id: 'bose-quietcomfort-ultra-earbuds', koName: '보스 QC 울트라 이어버드', form: 'sealed' },
  { id: 'bose-quietcomfort-ultra-headphones', koName: '보스 QC 울트라 헤드폰', form: 'headphones' },
  { id: 'sennheiser-mtw-4', koName: '젠하이저 모멘텀 트루 와이어리스 4', form: 'sealed' },
  { id: 'sennheiser-momentum-4', koName: '젠하이저 모멘텀 4', form: 'headphones' },
]

const AXES: TestAxis[] = ['bass', 'warmth', 'vocal', 'brightness']

// 타깃 대비 ±1.5 dB 이내는 "기준과 비슷함"으로 본다 (10밴드 보정의 해상도를 고려한 표시용 기준)
const CLOSE_RANGE_DB = 1.5

export type DeviceTraits = Record<TestAxis, number>

const round05 = (value: number) => Math.round(value * 2) / 2 || 0

/**
 * 축별 타깃 대비 편차(dB). 양수면 기준보다 많고, 음수면 적다.
 * 보정값에는 전체 음량 차이(모든 밴드가 함께 내려가는 등)가 섞여 있어
 * 네 축 평균을 빼고 대역 간 상대적인 균형만 남긴다.
 */
export function getDeviceTraits(device: DeviceProfile): DeviceTraits {
  const raw = AXES.map((axis) => {
    const gains = device.baseEQ.filter((b) => AXIS_FREQUENCIES[axis].includes(b.frequency)).map((b) => b.gain)
    return -gains.reduce((sum, g) => sum + g, 0) / gains.length
  })
  const mean = raw.reduce((sum, v) => sum + v, 0) / raw.length
  const traits = {} as DeviceTraits
  AXES.forEach((axis, i) => { traits[axis] = round05(raw[i] - mean) })
  return traits
}

export function getTraitLevel(value: number): 'more' | 'less' | 'close' {
  if (value >= CLOSE_RANGE_DB) return 'more'
  if (value <= -CLOSE_RANGE_DB) return 'less'
  return 'close'
}

export function getFeaturedDevice(id: string) {
  const featured = FEATURED_DEVICES.find((d) => d.id === id)
  const device = featured ? findDeviceById(id) : null
  return featured && device ? { featured, device } : null
}

export function getDeviceDisplayName(id: string, lang: LangCode) {
  const found = getFeaturedDevice(id)
  if (!found) return id
  return lang === 'ko' ? found.featured.koName : `${found.device.brand} ${found.device.name}`
}

type Copy = {
  axis: Record<TestAxis, string>
  effect: Record<TestAxis, { more: string; less: string }>
  close: string
  diff: (v: number) => string
  title: (name: string) => string
  subtitle: string
  intro: (name: string) => string
  traitHeading: string
  traitIntro: (name: string) => string
  traitHead: [string, string, string]
  summary: (name: string, parts: string[]) => string
  summaryFlat: (name: string) => string
  eqHeading: string
  eqIntro: string
  eqHead: [string, string, string]
  type: Record<'lowshelf' | 'peaking' | 'highshelf', string>
  preampNote: (preamp: number) => string
  applyHeading: (name: string) => string
  formHeading: string
  form: Record<DeviceForm, string[]>
  limitsHeading: string
  limits: string[]
  personalNote: { title: string; text: string }
  moreDevices: string
  allDevices: string
}

const COPY: Record<LangCode, Copy> = {
  ko: {
    axis: { bass: '저음 (32–64Hz)', warmth: '중저음 (125–250Hz)', vocal: '보컬 (500Hz–1kHz)', brightness: '고음 (2–16kHz)' },
    effect: {
      bass: { more: '킥과 베이스가 묵직하고 풍성하게 들림', less: '저음이 가볍고 단단함은 덜함' },
      warmth: { more: '소리가 따뜻하지만 답답하거나 뭉칠 수 있음', less: '소리가 얇고 깔끔하게 들림' },
      vocal: { more: '보컬과 악기가 앞으로 나와 들림', less: '보컬이 한 발 뒤로 물러나 들림' },
      brightness: { more: '선명하지만 치찰음이나 피로감이 생길 수 있음', less: '부드럽지만 디테일과 공간감이 덜함' },
    },
    close: '기준과 비슷함',
    diff: (v) => `${v > 0 ? '+' : ''}${v} dB`,
    title: (name) => `${name} EQ 설정값 추천`,
    subtitle: '측정 데이터로 본 소리 성향과 10밴드 보정값',
    intro: (name) => `${name}의 소리는 어떤 성향이고, EQ를 어떻게 넣으면 기준에 가까운 균형을 얻을 수 있을까요? 이 페이지는 AutoEq·RTINGS 공개 측정을 바탕으로 정리한 ${name}의 소리 성향과 10밴드 EQ 보정값, 적용 방법을 담고 있습니다. 여기 나온 값은 모든 사람에게 같은 '정답'이 아니라 출발점입니다. 내 귀와 취향에 맞는 값은 블라인드 테스트로 이어서 찾을 수 있습니다.`,
    traitHeading: '1. 측정으로 본 소리 성향',
    traitIntro: (name) => `아래 표는 ${name}의 원래 소리가 타깃 커브(하만 계열 기준)보다 대역별로 얼마나 많거나 적은지를 나타냅니다. 각 대역 보정값의 평균을 뒤집은 뒤 전체 음량 차이를 빼서 대역 간 상대적인 균형만 나타낸 대략적인 경향이며, 0.5dB 단위로 반올림했습니다.`,
    traitHead: ['대역', '기준 대비', '들리는 느낌'],
    summary: (name, parts) => `${name}에서 기준과 차이가 큰 대역은 ${parts.join(', ')}입니다. 아래 보정값은 이 차이를 반대 방향으로 채워 균형을 맞춥니다.`,
    summaryFlat: (name) => `${name}의 소리는 네 대역 모두 기준과 큰 차이가 없는, 비교적 균형 잡힌 성향입니다.`,
    eqHeading: '2. 10밴드 EQ 보정값',
    eqIntro: '타깃 커브에 가깝게 맞추는 기본 보정값입니다. 32Hz는 로우셸프, 16kHz는 하이셸프, 나머지는 Q 1.4 피킹 필터 기준입니다. 앱의 필터 방식이나 주파수가 다르면 가장 가까운 슬라이더에 비슷한 값을 넣으면 됩니다.',
    eqHead: ['주파수', '게인', '필터'],
    type: { lowshelf: '로우셸프', peaking: '피킹', highshelf: '하이셸프' },
    preampNote: (p) => p < 0 ? `부스트가 있어 소리가 찢어지지 않도록 프리앰프(전체 음량)를 ${p} dB로 낮춰 주세요. 프리앰프를 지원하지 않는 앱이라면 기기 볼륨을 조금 높여 들으면 됩니다.` : '이 보정값은 부스트가 없어 프리앰프를 낮추지 않아도 됩니다.',
    applyHeading: (name) => `3. ${name}에 EQ 넣는 방법`,
    formHeading: '4. 착용 방식에 따른 주의점',
    form: {
      sealed: ['커널형은 이어팁 밀착이 저음을 좌우합니다. 저음이 표보다 약하게 들리면 EQ를 올리기 전에 이어팁 크기부터 바꿔 보세요.', '팁을 바꾸거나 깊이 넣는 정도가 달라지면 고음 성향도 바뀔 수 있습니다.'],
      open: ['오픈형은 귀 모양과 착용 각도에 따라 저음이 크게 달라져, 측정값과 실제 소리의 차이가 커널형보다 큽니다.', '저음을 한 번에 크게 올리면 소리가 찌그러지거나 음량이 크게 떨어질 수 있으니 조금씩 올려 보세요.'],
      headphones: ['헤드폰은 이어패드 밀착이 저음에 영향을 줍니다. 안경을 쓰거나 머리카락이 패드 사이에 끼면 저음이 줄어듭니다.', '이어패드가 낡으면 측정 때와 소리가 달라질 수 있습니다.'],
    },
    limitsHeading: '5. 이 값의 한계',
    limits: [
      '측정 기준: 공개 측정 장비(귀 모형) 결과이므로 실제 사람 귀에서는 차이가 있습니다.',
      '개체 차이: 같은 모델이라도 생산 시기와 펌웨어에 따라 소리가 조금씩 다를 수 있습니다.',
      '해상도: 10밴드 보정이라 좁은 피크나 딥까지 정밀하게 다루지는 못합니다.',
      '노이즈 캔슬링·음향 효과: ANC, 공간 음향, 제조사 EQ 설정에 따라 결과가 달라질 수 있으니 비교할 때는 설정을 고정하세요.',
    ],
    personalNote: { title: '내 귀에 맞는 값은 따로 있습니다', text: '보정값은 기준 소리에 가깝게 맞추는 값일 뿐, 내가 좋아하는 소리와는 다를 수 있습니다. EQ FreeSet 테스트에서 이 기기를 선택하면 보정값을 출발점으로 A/B 블라인드 비교를 거쳐 내 취향에 맞는 값을 찾아 줍니다.' },
    moreDevices: '다른 기기 EQ 설정',
    allDevices: '전체 기기 목록 보기 →',
  },
  en: {
    axis: { bass: 'Bass (32–64Hz)', warmth: 'Upper bass (125–250Hz)', vocal: 'Vocals (500Hz–1kHz)', brightness: 'Treble (2–16kHz)' },
    effect: {
      bass: { more: 'Kick and bass sound full and weighty', less: 'Bass sounds light with less impact' },
      warmth: { more: 'Warm, but can get muddy or congested', less: 'Thin and clean' },
      vocal: { more: 'Vocals and instruments sit forward', less: 'Vocals sit a step back' },
      brightness: { more: 'Clear, but may be sibilant or fatiguing', less: 'Smooth, with less detail and air' },
    },
    close: 'Close to target',
    diff: (v) => `${v > 0 ? '+' : ''}${v} dB`,
    title: (name) => `${name} EQ Settings`,
    subtitle: 'Sound signature from measurements and a 10-band correction',
    intro: (name) => `How does the ${name} sound, and what EQ brings it closer to a balanced target? This page summarizes the ${name}'s sound signature, a 10-band EQ correction and how to apply it, based on public AutoEq and RTINGS measurements. These values are a starting point, not a universal answer. You can find values that fit your own ears with the blind test.`,
    traitHeading: '1. Sound Signature from Measurements',
    traitIntro: (name) => `The table shows how much more or less each range of the ${name} has compared to a target curve (Harman-style). It is a rough trend: the average correction per range is inverted and the overall level difference removed, leaving only the relative balance between ranges, rounded to 0.5 dB.`,
    traitHead: ['Range', 'vs. target', 'How it sounds'],
    summary: (name, parts) => `The ranges where the ${name} differs most from the target are ${parts.join(', ')}. The correction below offsets these differences in the opposite direction.`,
    summaryFlat: (name) => `The ${name} stays close to the target in all four ranges, a relatively balanced signature.`,
    eqHeading: '2. 10-Band EQ Correction',
    eqIntro: 'A baseline correction toward the target curve. 32Hz is a low shelf, 16kHz a high shelf, and the rest are peaking filters with Q 1.4. If your app uses different filters or frequencies, enter similar values on the nearest sliders.',
    eqHead: ['Frequency', 'Gain', 'Filter'],
    type: { lowshelf: 'Low shelf', peaking: 'Peaking', highshelf: 'High shelf' },
    preampNote: (p) => p < 0 ? `Because of the boosts, lower the preamp (overall level) to ${p} dB to avoid clipping. If the app has no preamp, simply raise the device volume a little.` : 'This correction has no boosts, so no preamp reduction is needed.',
    applyHeading: (name) => `3. How to Apply EQ on the ${name}`,
    formHeading: '4. Fit Considerations',
    form: {
      sealed: ['With in-ear earbuds, the tip seal controls the bass. If bass sounds weaker than the table suggests, try a different tip size before boosting.', 'Changing tips or insertion depth can also shift the treble.'],
      open: ['Open-fit earbuds vary a lot in bass depending on ear shape and angle, so measurements differ from real listening more than with sealed earbuds.', 'Large bass boosts can distort or drop the volume, so raise bass gradually.'],
      headphones: ['With headphones, the pad seal affects bass. Glasses or hair under the pads reduce bass.', 'Worn ear pads can make the sound differ from the measurement.'],
    },
    limitsHeading: '5. Limits of These Values',
    limits: [
      'Measurement rig: These are results from an ear simulator, so real ears will differ.',
      'Unit variation: The same model can vary by production batch and firmware.',
      'Resolution: A 10-band correction cannot precisely handle narrow peaks or dips.',
      'ANC and effects: Noise cancelling, spatial audio and the maker’s EQ can change the result, so keep them fixed while comparing.',
    ],
    personalNote: { title: 'Your ears have their own answer', text: 'A correction only moves the sound toward a target, which may not be what you like. Pick this device in the EQ FreeSet test to start from this correction and find your preferred values through A/B blind comparisons.' },
    moreDevices: 'EQ settings for other devices',
    allDevices: 'See all devices →',
  },
  zh: {
    axis: { bass: '低音 (32–64Hz)', warmth: '中低音 (125–250Hz)', vocal: '人声 (500Hz–1kHz)', brightness: '高音 (2–16kHz)' },
    effect: {
      bass: { more: '鼓点和贝斯厚实饱满', less: '低音偏轻，冲击力较弱' },
      warmth: { more: '声音温暖，但可能发闷或浑浊', less: '声音偏薄、干净' },
      vocal: { more: '人声和乐器靠前', less: '人声略微靠后' },
      brightness: { more: '清晰，但可能有齿音或易疲劳', less: '柔和，但细节和空间感较少' },
    },
    close: '接近基准',
    diff: (v) => `${v > 0 ? '+' : ''}${v} dB`,
    title: (name) => `${name} EQ设置推荐`,
    subtitle: '基于测量数据的声音倾向与10段校正值',
    intro: (name) => `${name}的声音有什么特点？怎样设置EQ才能接近均衡的基准？本页基于AutoEq与RTINGS的公开测量，整理了${name}的声音倾向、10段EQ校正值及设置方法。这些数值只是起点，并非对所有人都适用的“标准答案”。适合你耳朵和喜好的数值可以通过盲听测试继续寻找。`,
    traitHeading: '1. 测量所见的声音倾向',
    traitIntro: (name) => `下表显示${name}原本的声音在各频段比目标曲线（哈曼类基准）多或少多少。这是将各频段校正值的平均取反并去除整体音量差后、仅表示频段间相对平衡的大致趋势，按0.5dB取整。`,
    traitHead: ['频段', '相对基准', '听感'],
    summary: (name, parts) => `${name}与基准差距较大的频段是${parts.join('、')}。下面的校正值会朝相反方向补偿这些差距，使声音更均衡。`,
    summaryFlat: (name) => `${name}在四个频段都与基准差距不大，属于较为均衡的倾向。`,
    eqHeading: '2. 10段EQ校正值',
    eqIntro: '这是向目标曲线靠拢的基础校正值。32Hz为低架滤波，16kHz为高架滤波，其余为Q 1.4的峰值滤波。如果应用的滤波方式或频点不同，在最接近的滑块上填入相近的数值即可。',
    eqHead: ['频率', '增益', '滤波器'],
    type: { lowshelf: '低架', peaking: '峰值', highshelf: '高架' },
    preampNote: (p) => p < 0 ? `由于有提升，请将前级增益（整体音量）降到 ${p} dB，以免削波失真。如果应用不支持前级增益，把设备音量稍微调高即可。` : '该校正值没有提升，无需降低前级增益。',
    applyHeading: (name) => `3. 在${name}上设置EQ的方法`,
    formHeading: '4. 佩戴方式的注意事项',
    form: {
      sealed: ['入耳式耳机的低音取决于耳塞的密封。如果低音比表中弱，先换耳塞尺寸再考虑提升EQ。', '更换耳塞或改变佩戴深度，高音倾向也可能变化。'],
      open: ['半入耳式耳机的低音会随耳形和佩戴角度大幅变化，测量值与实际听感的差距比入耳式更大。', '一次大幅提升低音可能导致失真或音量下降，请逐步调整。'],
      headphones: ['头戴式耳机的低音受耳垫密封影响。戴眼镜或头发夹在耳垫间都会让低音减少。', '耳垫老化后声音可能与测量时不同。'],
    },
    limitsHeading: '5. 这些数值的局限',
    limits: [
      '测量基准：来自公开测量设备（人工耳）的结果，与真人耳朵存在差异。',
      '个体差异：同一型号也可能因生产批次和固件不同而略有差别。',
      '分辨率：10段校正无法精确处理很窄的峰谷。',
      '降噪与音效：ANC、空间音频和厂商EQ设置会影响结果，比较时请保持设置不变。',
    ],
    personalNote: { title: '适合你耳朵的数值另有答案', text: '校正值只是让声音接近基准，未必是你喜欢的声音。在EQ FreeSet测试中选择该设备，即可以校正值为起点，通过A/B盲听比较找到符合你喜好的数值。' },
    moreDevices: '其他设备的EQ设置',
    allDevices: '查看全部设备 →',
  },
  ja: {
    axis: { bass: '低音 (32–64Hz)', warmth: '中低音 (125–250Hz)', vocal: 'ボーカル (500Hz–1kHz)', brightness: '高音 (2–16kHz)' },
    effect: {
      bass: { more: 'キックやベースが重厚で豊か', less: '低音が軽く、迫力は控えめ' },
      warmth: { more: '温かいが、こもったりにじんだりしやすい', less: '薄くすっきりした音' },
      vocal: { more: 'ボーカルや楽器が前に出る', less: 'ボーカルが一歩下がって聞こえる' },
      brightness: { more: '明瞭だが、歯擦音や聴き疲れが出やすい', less: '柔らかいが、細部や空気感は控えめ' },
    },
    close: '基準に近い',
    diff: (v) => `${v > 0 ? '+' : ''}${v} dB`,
    title: (name) => `${name} EQ設定のおすすめ`,
    subtitle: '測定データから見た音の傾向と10バンド補正値',
    intro: (name) => `${name}はどんな音で、どうEQを入れれば基準に近いバランスになるのでしょうか。このページでは、AutoEqとRTINGSの公開測定をもとに、${name}の音の傾向、10バンドEQ補正値、設定方法をまとめました。ここの値は誰にとっても同じ「正解」ではなく出発点です。自分の耳と好みに合う値はブラインドテストで探せます。`,
    traitHeading: '1. 測定から見た音の傾向',
    traitIntro: (name) => `下の表は、${name}本来の音がターゲットカーブ（ハーマン系の基準）より帯域ごとにどれだけ多いか少ないかを示します。各帯域の補正値の平均を反転し、全体の音量差を除いて帯域間の相対的なバランスだけを示した大まかな傾向で、0.5dB単位で丸めています。`,
    traitHead: ['帯域', '基準との差', '聞こえ方'],
    summary: (name, parts) => `${name}で基準との差が大きい帯域は${parts.join('、')}です。下の補正値はこの差を逆方向に埋めてバランスを整えます。`,
    summaryFlat: (name) => `${name}は4つの帯域すべてで基準との差が小さい、比較的バランスの取れた傾向です。`,
    eqHeading: '2. 10バンドEQ補正値',
    eqIntro: 'ターゲットカーブに近づけるための基本補正値です。32Hzはローシェルフ、16kHzはハイシェルフ、それ以外はQ 1.4のピーキングフィルター基準です。アプリのフィルター方式や周波数が違う場合は、最も近いスライダーに近い値を入れてください。',
    eqHead: ['周波数', 'ゲイン', 'フィルター'],
    type: { lowshelf: 'ローシェルフ', peaking: 'ピーキング', highshelf: 'ハイシェルフ' },
    preampNote: (p) => p < 0 ? `ブーストがあるため、音割れを防ぐにはプリアンプ（全体音量）を ${p} dB に下げてください。プリアンプのないアプリなら、端末の音量を少し上げて聴けば大丈夫です。` : 'この補正値にはブーストがないため、プリアンプを下げる必要はありません。',
    applyHeading: (name) => `3. ${name}にEQを設定する方法`,
    formHeading: '4. 装着方式による注意点',
    form: {
      sealed: ['カナル型はイヤーピースの密閉が低音を左右します。表より低音が弱く感じたら、EQを上げる前にイヤーピースのサイズを変えてみてください。', 'イヤーピースや差し込む深さが変わると、高音の傾向も変わることがあります。'],
      open: ['インナーイヤー型は耳の形や装着角度で低音が大きく変わり、測定値と実際の音の差がカナル型より大きくなります。', '低音を一度に大きく上げると歪んだり音量が下がったりするので、少しずつ上げてください。'],
      headphones: ['ヘッドホンはイヤーパッドの密着が低音に影響します。眼鏡や髪がパッドに挟まると低音が減ります。', 'イヤーパッドが劣化すると、測定時と音が変わることがあります。'],
    },
    limitsHeading: '5. この値の限界',
    limits: [
      '測定基準：公開されている測定器（擬似耳）の結果なので、実際の耳とは差があります。',
      '個体差：同じモデルでも製造時期やファームウェアで音が少し異なることがあります。',
      '分解能：10バンド補正のため、狭いピークやディップまでは精密に扱えません。',
      'ノイキャン・音響効果：ANC、空間オーディオ、メーカーEQの設定で結果が変わるため、比較時は設定を固定してください。',
    ],
    personalNote: { title: '自分の耳に合う値は別にあります', text: '補正値は基準の音に近づけるだけで、自分の好きな音とは違うかもしれません。EQ FreeSetのテストでこの機器を選ぶと、補正値を出発点にA/Bブラインド比較で好みの値を見つけられます。' },
    moreDevices: 'ほかの機器のEQ設定',
    allDevices: '機器一覧を見る →',
  },
}

// 브랜드별 EQ 적용 경로 (메뉴 이름은 앱·OS 버전에 따라 다를 수 있음을 본문에 명시)
const BRAND_APPLY: Record<string, Record<LangCode, string[]>> = {
  Apple: {
    ko: [
      '에어팟 자체 EQ 없음: 에어팟에는 사용자가 밴드별로 조절하는 EQ가 없어서, 듣는 기기나 앱 쪽에서 EQ를 걸어야 합니다.',
      '아이폰: 설정 → 손쉬운 사용 → 오디오 및 시각 → 헤드폰 조절에서 음역대 강조를 조정할 수 있지만 밴드별 조절은 아닙니다. 밴드별 값은 Spotify처럼 EQ가 내장된 스트리밍 앱에 넣는 것이 현실적입니다.',
      '안드로이드: Wavelet 같은 시스템 EQ 앱에 위 10밴드 값을 넣으면 대부분의 앱 소리에 적용됩니다.',
      'Windows·Mac: Equalizer APO(Windows)나 eqMac(Mac) 같은 프로그램에 값을 입력하세요.',
    ],
    en: [
      'No built-in EQ: AirPods have no user-adjustable band EQ, so apply EQ on the playback device or app.',
      'iPhone: Settings → Accessibility → Audio & Visual → Headphone Accommodations can emphasize ranges, but not per band. For band values, a streaming app with a built-in EQ such as Spotify is the practical choice.',
      'Android: Enter the 10-band values in a system-wide EQ app such as Wavelet to apply them to most apps.',
      'Windows and Mac: Enter the values in Equalizer APO (Windows) or eqMac (Mac).',
    ],
    zh: [
      '耳机本身没有EQ：AirPods没有可按频段调节的EQ，需要在播放设备或应用中设置。',
      'iPhone：设置 → 辅助功能 → 音频与视觉 → 耳机调节可以强调某些音域，但不能按频段调节。要输入频段数值，使用Spotify等内置EQ的流媒体应用更现实。',
      'Android：在Wavelet等全局EQ应用中输入上面的10段数值，即可作用于大多数应用。',
      'Windows与Mac：在Equalizer APO（Windows）或eqMac（Mac）中输入数值。',
    ],
    ja: [
      '本体にEQなし：AirPodsには帯域ごとに調整できるEQがないため、再生する端末やアプリ側でEQをかけます。',
      'iPhone：設定 → アクセシビリティ → オーディオとビジュアル → ヘッドフォン調整で音域を強調できますが、帯域ごとの調整ではありません。帯域の値はSpotifyなどEQ内蔵のストリーミングアプリに入れるのが現実的です。',
      'Android：Waveletなどのシステム全体EQアプリに上の10バンド値を入れると、ほとんどのアプリに適用されます。',
      'Windows・Mac：Equalizer APO（Windows）やeqMac（Mac）に値を入力してください。',
    ],
  },
  Samsung: {
    ko: [
      'Galaxy Wearable 앱: 이어버드 설정의 이퀄라이저에서 프리셋을 고르거나, 모델과 앱 버전에 따라 세부 밴드를 조절할 수 있습니다. 이어버드에 저장되는 설정이라 모든 앱에 적용됩니다.',
      '갤럭시 휴대폰 EQ: 설정 → 소리 및 진동 → 음질 및 음향 효과 → 이퀄라이저에서 사용자 설정을 고르면 밴드별로 조절할 수 있습니다.',
      'EQ는 한 곳에서만: Wearable 앱 EQ와 휴대폰 EQ를 동시에 켜면 효과가 겹치므로, 한쪽은 기본값으로 두세요.',
      '더 정밀하게: 10밴드를 그대로 넣고 싶다면 Wavelet 같은 시스템 EQ 앱을 쓰는 방법도 있습니다.',
    ],
    en: [
      'Galaxy Wearable app: In the earbud settings equalizer, choose a preset or, depending on the model and app version, adjust detailed bands. The setting is stored on the earbuds and applies to every app.',
      'Galaxy phone EQ: Settings → Sounds and vibration → Sound quality and effects → Equalizer, then choose Custom to adjust each band.',
      'One EQ at a time: Using the Wearable EQ and the phone EQ together stacks the effect, so leave one at default.',
      'More precision: To enter all 10 bands as-is, use a system-wide EQ app such as Wavelet.',
    ],
    zh: [
      'Galaxy Wearable应用：在耳机设置的均衡器中选择预设，或根据型号和应用版本调节细分频段。设置保存在耳机上，对所有应用生效。',
      'Galaxy手机EQ：设置 → 声音和振动 → 音质和音效 → 均衡器，选择自定义即可按频段调节。',
      'EQ只开一处：同时开启Wearable应用EQ和手机EQ会叠加效果，请将其中一个保持默认。',
      '更精细：想原样输入10段数值，可以使用Wavelet等全局EQ应用。',
    ],
    ja: [
      'Galaxy Wearableアプリ：イヤホン設定のイコライザーでプリセットを選ぶか、モデルやアプリのバージョンによっては細かい帯域を調整できます。イヤホン本体に保存されるので、すべてのアプリに適用されます。',
      'Galaxyスマホのイコライザー：設定 → サウンドとバイブ → 音質とエフェクト → イコライザーでカスタムを選ぶと帯域ごとに調整できます。',
      'EQは一か所だけ：WearableアプリのEQとスマホのEQを同時に使うと効果が重なるので、片方はデフォルトにしてください。',
      'より精密に：10バンドをそのまま入れたい場合は、Waveletなどのシステム全体EQアプリを使う方法もあります。',
    ],
  },
  Sony: {
    ko: [
      'Sony Sound Connect 앱(이전 Headphones Connect): 사운드 설정의 이퀄라이저에서 5밴드와 Clear Bass를 조절할 수 있습니다. 이어폰에 저장되어 모든 앱에 적용됩니다.',
      '10밴드를 5밴드로: 앱의 각 밴드에 가장 가까운 주파수 값을 넣고, 32·64Hz 저음 보정은 Clear Bass로 맞추면 됩니다. 값이 완전히 같을 필요는 없습니다.',
      '더 정밀하게: 안드로이드는 Wavelet, Windows는 Equalizer APO에 10밴드 값을 그대로 넣을 수 있습니다. 이때 앱 EQ는 끄거나 평탄하게 두세요.',
    ],
    en: [
      'Sony Sound Connect app (formerly Headphones Connect): The equalizer in the sound settings offers 5 bands plus Clear Bass. It is stored on the device and applies to every app.',
      'From 10 bands to 5: Put the nearest-frequency values on each app band and use Clear Bass for the 32 and 64Hz bass correction. Values do not need to match exactly.',
      'More precision: Enter the 10-band values as-is in Wavelet on Android or Equalizer APO on Windows, and keep the app EQ off or flat.',
    ],
    zh: [
      'Sony Sound Connect应用（原Headphones Connect）：声音设置中的均衡器提供5段调节和Clear Bass。设置保存在耳机上，对所有应用生效。',
      '10段转5段：在应用每个频段填入最接近频率的数值，32与64Hz的低音校正用Clear Bass调整即可。数值不必完全一致。',
      '更精细：Android可用Wavelet、Windows可用Equalizer APO原样输入10段数值，此时请关闭应用EQ或保持平直。',
    ],
    ja: [
      'Sony Sound Connectアプリ（旧Headphones Connect）：サウンド設定のイコライザーで5バンドとClear Bassを調整できます。本体に保存され、すべてのアプリに適用されます。',
      '10バンドを5バンドに：アプリの各バンドに最も近い周波数の値を入れ、32・64Hzの低音補正はClear Bassで合わせます。値が完全に一致する必要はありません。',
      'より精密に：AndroidならWavelet、WindowsならEqualizer APOに10バンド値をそのまま入れられます。その際、アプリのEQはオフかフラットにしてください。',
    ],
  },
  Bose: {
    ko: [
      'Bose 앱: 이어폰 설정의 이퀄라이저에서 저음·중음·고음 3개 슬라이더를 조절할 수 있습니다. 이어폰에 저장되어 모든 앱에 적용됩니다.',
      '10밴드를 3밴드로: 위 표에서 32~125Hz 평균은 저음, 250Hz~1kHz 평균은 중음, 2k~16kHz 평균은 고음 슬라이더에 대략 옮기세요. 3밴드라 세밀한 보정은 어렵습니다.',
      '더 정밀하게: 안드로이드는 Wavelet, Windows는 Equalizer APO에 10밴드 값을 그대로 넣을 수 있습니다. 이때 Bose 앱 EQ는 평탄하게 두세요.',
    ],
    en: [
      'Bose app: The equalizer in the earbud settings has three sliders for bass, mid and treble. It is stored on the device and applies to every app.',
      'From 10 bands to 3: Roughly move the average of 32–125Hz to bass, 250Hz–1kHz to mid and 2k–16kHz to treble. Three bands cannot reproduce fine corrections.',
      'More precision: Enter the 10-band values as-is in Wavelet on Android or Equalizer APO on Windows, and keep the Bose app EQ flat.',
    ],
    zh: [
      'Bose应用：耳机设置中的均衡器提供低音、中音、高音三个滑块。设置保存在耳机上，对所有应用生效。',
      '10段转3段：将上表32–125Hz的平均值大致对应到低音，250Hz–1kHz对应中音，2k–16kHz对应高音。3段无法实现精细校正。',
      '更精细：Android可用Wavelet、Windows可用Equalizer APO原样输入10段数值，此时请将Bose应用EQ保持平直。',
    ],
    ja: [
      'Boseアプリ：イヤホン設定のイコライザーで低音・中音・高音の3つのスライダーを調整できます。本体に保存され、すべてのアプリに適用されます。',
      '10バンドを3バンドに：上の表の32〜125Hzの平均を低音、250Hz〜1kHzを中音、2k〜16kHzを高音のスライダーにおおよそ移してください。3バンドなので細かい補正はできません。',
      'より精密に：AndroidならWavelet、WindowsならEqualizer APOに10バンド値をそのまま入れられます。その際、BoseアプリのEQはフラットにしてください。',
    ],
  },
  Sennheiser: {
    ko: [
      'Sennheiser Smart Control 앱: 사운드 설정의 이퀄라이저에서 대역별로 조절할 수 있습니다. 밴드 수는 모델과 앱 버전에 따라 다릅니다.',
      '10밴드를 앱 밴드로: 앱의 각 밴드에 가장 가까운 주파수의 값을 넣으세요. 값이 완전히 같을 필요는 없습니다.',
      '더 정밀하게: 안드로이드는 Wavelet, Windows는 Equalizer APO에 10밴드 값을 그대로 넣을 수 있습니다. 이때 앱 EQ는 평탄하게 두세요.',
    ],
    en: [
      'Sennheiser Smart Control app: Adjust each range in the equalizer under the sound settings. The number of bands depends on the model and app version.',
      'Mapping 10 bands: Put the nearest-frequency value on each app band. Values do not need to match exactly.',
      'More precision: Enter the 10-band values as-is in Wavelet on Android or Equalizer APO on Windows, and keep the app EQ flat.',
    ],
    zh: [
      'Sennheiser Smart Control应用：在声音设置的均衡器中按频段调节。频段数量因型号和应用版本而异。',
      '10段对应：在应用每个频段填入最接近频率的数值即可，数值不必完全一致。',
      '更精细：Android可用Wavelet、Windows可用Equalizer APO原样输入10段数值，此时请将应用EQ保持平直。',
    ],
    ja: [
      'Sennheiser Smart Controlアプリ：サウンド設定のイコライザーで帯域ごとに調整できます。バンド数はモデルやアプリのバージョンによって異なります。',
      '10バンドの対応：アプリの各バンドに最も近い周波数の値を入れてください。値が完全に一致する必要はありません。',
      'より精密に：AndroidならWavelet、WindowsならEqualizer APOに10バンド値をそのまま入れられます。その際、アプリのEQはフラットにしてください。',
    ],
  },
  QCY: {
    ko: [
      'QCY 앱: 이퀄라이저 메뉴에서 프리셋을 고르거나 사용자 설정 EQ를 조절할 수 있습니다. 지원 여부와 밴드 수는 모델에 따라 다릅니다.',
      '10밴드를 앱 밴드로: 앱의 각 밴드에 가장 가까운 주파수의 값을 넣으세요.',
      '더 정밀하게: 안드로이드는 Wavelet, Windows는 Equalizer APO에 10밴드 값을 그대로 넣을 수 있습니다. 이때 QCY 앱 EQ는 기본값으로 두세요.',
    ],
    en: [
      'QCY app: In the equalizer menu, choose a preset or adjust a custom EQ. Support and band count depend on the model.',
      'Mapping 10 bands: Put the nearest-frequency value on each app band.',
      'More precision: Enter the 10-band values as-is in Wavelet on Android or Equalizer APO on Windows, and keep the QCY app EQ at default.',
    ],
    zh: [
      'QCY应用：在均衡器菜单中选择预设或调节自定义EQ。是否支持及频段数量因型号而异。',
      '10段对应：在应用每个频段填入最接近频率的数值。',
      '更精细：Android可用Wavelet、Windows可用Equalizer APO原样输入10段数值，此时请将QCY应用EQ保持默认。',
    ],
    ja: [
      'QCYアプリ：イコライザーメニューでプリセットを選ぶか、カスタムEQを調整できます。対応状況とバンド数はモデルによって異なります。',
      '10バンドの対応：アプリの各バンドに最も近い周波数の値を入れてください。',
      'より精密に：AndroidならWavelet、WindowsならEqualizer APOに10バンド値をそのまま入れられます。その際、QCYアプリのEQはデフォルトにしてください。',
    ],
  },
}

const formatGain = (gain: number) => `${gain > 0 ? '+' : ''}${gain.toFixed(1)} dB`
const formatFreq = (f: number) => (f >= 1000 ? `${f / 1000}kHz` : `${f}Hz`)

export function buildDeviceArticle(id: string, lang: LangCode): GuideArticle | null {
  const found = getFeaturedDevice(id)
  if (!found) return null
  const { featured, device } = found
  const c = COPY[lang]
  const name = getDeviceDisplayName(id, lang)
  const traits = getDeviceTraits(device)
  const preamp = getPreampDb(device.baseEQ)

  const summaryParts = AXES.filter((a) => getTraitLevel(traits[a]) !== 'close').map((a) => `${c.axis[a]} ${c.diff(traits[a])}`)

  const traitTable: GuideBlock = {
    type: 'table',
    head: c.traitHead,
    rows: AXES.map((a) => {
      const level = getTraitLevel(traits[a])
      return [c.axis[a], c.diff(traits[a]), level === 'close' ? c.close : c.effect[a][level]]
    }),
  }

  return {
    title: c.title(name),
    subtitle: c.subtitle,
    intro: c.intro(name),
    sections: [
      {
        heading: c.traitHeading,
        blocks: [
          { type: 'p', text: c.traitIntro(name) },
          traitTable,
          { type: 'p', text: summaryParts.length ? c.summary(name, summaryParts) : c.summaryFlat(name) },
        ],
      },
      {
        heading: c.eqHeading,
        blocks: [
          { type: 'p', text: c.eqIntro },
          {
            type: 'table',
            head: c.eqHead,
            rows: device.baseEQ.map((b) => [formatFreq(b.frequency), formatGain(b.gain), c.type[b.type as keyof Copy['type']] ?? b.type]),
          },
          { type: 'p', text: c.preampNote(preamp) },
        ],
      },
      { heading: c.applyHeading(name), blocks: [{ type: 'list', items: BRAND_APPLY[device.brand]?.[lang] ?? [] }] },
      { heading: c.formHeading, blocks: [{ type: 'list', items: c.form[featured.form] }] },
      { heading: c.limitsHeading, blocks: [{ type: 'list', items: c.limits }, { type: 'note', ...c.personalNote }] },
    ],
  }
}

export function buildDeviceContent(id: string): GuideContent | null {
  const langs: LangCode[] = ['ko', 'en', 'zh', 'ja']
  const entries = langs.map((lang) => [lang, buildDeviceArticle(id, lang)] as const)
  if (entries.some(([, article]) => !article)) return null
  return Object.fromEntries(entries) as GuideContent
}

export const DEVICE_PAGE_COPY: Record<LangCode, { moreDevices: string; allDevices: string }> = {
  ko: { moreDevices: COPY.ko.moreDevices, allDevices: COPY.ko.allDevices },
  en: { moreDevices: COPY.en.moreDevices, allDevices: COPY.en.allDevices },
  zh: { moreDevices: COPY.zh.moreDevices, allDevices: COPY.zh.allDevices },
  ja: { moreDevices: COPY.ja.moreDevices, allDevices: COPY.ja.allDevices },
}

/** 결과 페이지의 기기 이름(DB name)으로 기기별 EQ 페이지를 찾는다. 없으면 null */
export function findFeaturedIdByDeviceName(name: string): string | null {
  return FEATURED_DEVICES.find((d) => findDeviceById(d.id)?.name === name)?.id ?? null
}

const DEVICE_LINK_TEXT: Record<LangCode, (name: string) => string> = {
  ko: (name) => `${name} EQ 설정 자세히 보기`,
  en: (name) => `${name} EQ settings in detail`,
  zh: (name) => `查看${name}的EQ设置详情`,
  ja: (name) => `${name}のEQ設定を詳しく見る`,
}

export function getDeviceLinkText(id: string, lang: LangCode) {
  return DEVICE_LINK_TEXT[lang](getDeviceDisplayName(id, lang))
}

/** 기기 목록 카드용 한 줄 요약 (차이가 큰 대역 최대 2개) */
export function getDeviceHighlights(id: string, lang: LangCode): string {
  const found = getFeaturedDevice(id)
  if (!found) return ''
  const c = COPY[lang]
  const traits = getDeviceTraits(found.device)
  const top = AXES.filter((a) => getTraitLevel(traits[a]) !== 'close')
    .sort((a, b) => Math.abs(traits[b]) - Math.abs(traits[a]))
    .slice(0, 2)
    .map((a) => `${c.axis[a].split(' (')[0]} ${c.diff(traits[a])}`)
  return top.length ? top.join(' · ') : c.close
}
