'use client'

import Link from '@/components/locale-link'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useLanguage, type LangCode } from '@/lib/language-context'
import {
  SLIDER_STEPS, SWEEP_MAX_HZ, SWEEP_MIN_HZ, SWEEP_SECONDS,
  formatHz, frequencyToSlider, levelFromSamples, sliderToFrequency, sweepFrequencyAt,
} from '@/lib/tone-tools'

type Playing = 'left' | 'center' | 'right' | 'sweep' | 'tone' | null
type MicState = 'idle' | 'listening' | 'recording' | 'denied' | 'nodevice' | 'unsupported' | 'error'

// 청력 보호: 모든 테스트 음은 낮은 고정 음량으로 재생
const OUTPUT_GAIN = 0.12
const RECORD_SECONDS = 5

type Copy = {
  label: string; title: string; desc: string
  warnTitle: string; warn: string
  lr: { heading: string; desc: string; left: string; center: string; right: string; playing: string; check: string[] }
  freq: { heading: string; desc: string; sweep: string; tone: string; stop: string; current: string; check: string[] }
  mic: { heading: string; desc: string; start: string; stop: string; record: string; recording: string; playback: string; level: string; privacy: string; check: string[]; errors: Record<'denied' | 'nodevice' | 'unsupported' | 'error', string> }
  checkTitle: string
  more: { heading: string; troubleshooting: string; hearing: string; test: string }
}

const COPY: Record<LangCode, Copy> = {
  ko: {
    label: '테스트 도구',
    title: '이어폰 좌우·주파수·마이크 테스트',
    desc: '설치 없이 브라우저에서 이어폰의 좌우 채널, 들리는 주파수 범위, 마이크(핸즈프리) 상태를 확인할 수 있습니다. 모든 소리는 기기 안에서 만들어지며 녹음한 목소리도 서버로 전송되지 않습니다.',
    warnTitle: '시작 전에 볼륨을 낮춰 주세요',
    warn: '테스트 음은 일정한 크기의 순음이라 음악보다 크게 느껴질 수 있습니다. 기기 볼륨을 평소보다 낮게 시작하고 필요할 때만 조금씩 올리세요.',
    lr: {
      heading: '1. 좌우 채널 테스트',
      desc: '버튼을 누르면 해당 방향에서 짧은 비프음이 세 번 납니다. 왼쪽 버튼은 왼쪽 이어폰에서만, 오른쪽 버튼은 오른쪽에서만 들려야 정상입니다.',
      left: '왼쪽', center: '가운데', right: '오른쪽', playing: '재생 중',
      check: [
        '반대쪽에서 들림: 이어폰을 좌우 바꿔 꼈거나, 기기의 오디오 밸런스 설정이 바뀌었을 수 있습니다.',
        '가운데가 한쪽으로 쏠림: 한쪽이 귀지나 이물질로 막혔거나 착용 깊이가 다를 수 있습니다. 접근성 설정의 좌우 밸런스도 확인하세요.',
        '한쪽이 전혀 안 들림: 해당 이어폰의 연결과 배터리를 확인하고, 다시 페어링해 보세요.',
      ],
    },
    freq: {
      heading: '2. 주파수 테스트',
      desc: `스윕은 ${SWEEP_MIN_HZ}Hz부터 ${SWEEP_MAX_HZ / 1000}kHz까지 ${SWEEP_SECONDS}초 동안 음을 올립니다. 톤은 슬라이더로 원하는 주파수의 음을 계속 들려줍니다. 특정 구간에서 소리가 갑자기 커지거나 작아지는지, 떨림이나 잡음이 생기는지 들어 보세요.`,
      sweep: '스윕 재생', tone: '톤 재생', stop: '정지', current: '현재 주파수',
      check: [
        '아주 낮은 음(20–40Hz)이 안 들림: 작은 이어폰, 특히 오픈형에서는 흔한 일입니다. 커널형이라면 이어팁 밀착을 확인하세요.',
        '높은 음(15kHz 이상)이 안 들림: 나이가 들수록 고음 청취 범위가 자연스럽게 줄어듭니다. 이어폰 문제가 아닐 수 있습니다.',
        '특정 구간에서 떨림·찌직 소리: 그 주파수에서 이어폰이나 주변 물체가 공진하는 것일 수 있습니다. 볼륨을 낮춰도 계속되면 드라이버 이상을 의심해 보세요.',
      ],
    },
    mic: {
      heading: '3. 마이크(핸즈프리) 테스트',
      desc: '마이크 권한을 허용하면 입력 레벨이 막대로 표시됩니다. 녹음 버튼을 누르면 5초 동안 녹음한 뒤 바로 들어볼 수 있어, 통화할 때 상대에게 내 목소리가 어떻게 들리는지 확인할 수 있습니다.',
      start: '마이크 켜기', stop: '마이크 끄기', record: `${RECORD_SECONDS}초 녹음`, recording: '녹음 중…', playback: '녹음 다시 듣기', level: '입력 레벨',
      privacy: '녹음은 이 기기에서만 재생되며 페이지를 나가면 사라집니다.',
      check: [
        '레벨이 움직이지 않음: 브라우저나 기기에서 다른 마이크(노트북 내장 마이크 등)가 선택되어 있을 수 있습니다. 시스템 사운드 설정의 입력 장치를 확인하세요.',
        '목소리가 작거나 멀게 들림: 블루투스 이어폰 마이크는 입에서 멀어 원래 작게 녹음되는 편입니다. 마이크 구멍이 막히지 않았는지 확인하세요.',
        '통화 중 음악 음질이 나빠짐: 블루투스는 마이크를 쓰는 동안 통화용 프로필로 바뀌어 음질이 떨어집니다. 정상 동작입니다.',
      ],
      errors: {
        denied: '마이크 권한이 거부되었습니다. 브라우저 주소창의 권한 설정에서 마이크를 허용한 뒤 다시 시도하세요.',
        nodevice: '연결된 마이크를 찾지 못했습니다. 이어폰 연결 상태를 확인하세요.',
        unsupported: '이 브라우저에서는 마이크 테스트를 지원하지 않습니다. 최신 Chrome, Safari, Edge에서 시도해 보세요.',
        error: '마이크를 시작하지 못했습니다. 다른 앱이 마이크를 사용 중인지 확인하세요.',
      },
    },
    checkTitle: '결과 확인',
    more: { heading: '더 알아보기', troubleshooting: '이어폰 소리 문제 해결 가이드', hearing: '청력 보호 가이드', test: '내 이어폰에 맞는 EQ 찾기' },
  },
  en: {
    label: 'Test Tools',
    title: 'Earphone Left/Right, Frequency and Mic Test',
    desc: 'Check your earphones’ left and right channels, audible frequency range and microphone (hands-free) in the browser with no install. All sounds are generated on your device, and your recording is never sent to a server.',
    warnTitle: 'Lower the volume before you start',
    warn: 'Test tones are steady pure tones and can feel louder than music. Start with your device volume lower than usual and raise it only as needed.',
    lr: {
      heading: '1. Left/Right Channel Test',
      desc: 'Each button plays three short beeps from that direction. The left button should only sound in the left earphone, and the right button only in the right.',
      left: 'Left', center: 'Center', right: 'Right', playing: 'Playing',
      check: [
        'Sound from the wrong side: The earphones may be swapped, or the device’s audio balance may be changed.',
        'Center leans to one side: One side may be blocked by earwax or inserted at a different depth. Also check the balance in accessibility settings.',
        'One side is silent: Check that earphone’s connection and battery, then try pairing again.',
      ],
    },
    freq: {
      heading: '2. Frequency Test',
      desc: `The sweep rises from ${SWEEP_MIN_HZ}Hz to ${SWEEP_MAX_HZ / 1000}kHz over ${SWEEP_SECONDS} seconds. The tone keeps playing the frequency you pick with the slider. Listen for ranges that suddenly get louder or quieter, or that buzz or rattle.`,
      sweep: 'Play Sweep', tone: 'Play Tone', stop: 'Stop', current: 'Current frequency',
      check: [
        'Very low notes (20–40Hz) are inaudible: Common with small earphones, especially open-fit ones. With in-ears, check the tip seal.',
        'High notes (above 15kHz) are inaudible: Our upper hearing range shrinks naturally with age. It may not be the earphones.',
        'Buzzing at a certain range: The earphones or a nearby object may resonate at that frequency. If it persists at lower volume, suspect the driver.',
      ],
    },
    mic: {
      heading: '3. Microphone (Hands-free) Test',
      desc: 'After you allow microphone access, the input level appears as a bar. Press record to capture 5 seconds and play it back right away, so you can hear how you sound to others on a call.',
      start: 'Turn On Mic', stop: 'Turn Off Mic', record: `Record ${RECORD_SECONDS}s`, recording: 'Recording…', playback: 'Play back recording', level: 'Input level',
      privacy: 'The recording plays only on this device and disappears when you leave the page.',
      check: [
        'The level does not move: The browser or device may be using another mic, such as a laptop’s built-in one. Check the input device in system sound settings.',
        'Your voice sounds quiet or distant: Bluetooth earphone mics sit far from the mouth and record quietly by nature. Make sure the mic holes are not blocked.',
        'Music quality drops during calls: Bluetooth switches to a call profile while the mic is in use, lowering quality. This is normal.',
      ],
      errors: {
        denied: 'Microphone access was denied. Allow the microphone in the site permissions next to the address bar and try again.',
        nodevice: 'No microphone was found. Check your earphone connection.',
        unsupported: 'This browser does not support the microphone test. Try the latest Chrome, Safari or Edge.',
        error: 'Could not start the microphone. Check whether another app is using it.',
      },
    },
    checkTitle: 'Reading the result',
    more: { heading: 'Learn More', troubleshooting: 'Earphone Sound Troubleshooting', hearing: 'Hearing Protection Guide', test: 'Find EQ for your earphones' },
  },
  zh: {
    label: '测试工具',
    title: '耳机左右声道·频率·麦克风测试',
    desc: '无需安装，在浏览器中即可检查耳机的左右声道、可听频率范围和麦克风（免提）状态。所有声音都在设备内生成，录下的声音也不会上传到服务器。',
    warnTitle: '开始前请调低音量',
    warn: '测试音是音量恒定的纯音，可能比音乐听起来更响。请先把设备音量调得比平时低，需要时再逐步调高。',
    lr: {
      heading: '1. 左右声道测试',
      desc: '按下按钮会从对应方向发出三声短促的提示音。按左边时只应从左耳机听到，按右边时只应从右耳机听到。',
      left: '左', center: '中', right: '右', playing: '播放中',
      check: [
        '从相反一侧听到：可能左右耳机戴反了，或设备的音频平衡设置被更改。',
        '中间偏向一侧：可能一侧被耳垢或异物堵住，或佩戴深度不同。也请检查辅助功能中的左右平衡。',
        '一侧完全听不到：检查该侧耳机的连接与电量，并尝试重新配对。',
      ],
    },
    freq: {
      heading: '2. 频率测试',
      desc: `扫频会在${SWEEP_SECONDS}秒内从${SWEEP_MIN_HZ}Hz升到${SWEEP_MAX_HZ / 1000}kHz。单音会持续播放滑块所选的频率。请留意某些频段声音是否突然变大或变小，是否有震颤或杂音。`,
      sweep: '播放扫频', tone: '播放单音', stop: '停止', current: '当前频率',
      check: [
        '听不到极低音（20–40Hz）：小尺寸耳机，尤其是半入耳式很常见。入耳式请检查耳塞的密封。',
        '听不到高音（15kHz以上）：随着年龄增长，高音听觉范围会自然缩小，未必是耳机的问题。',
        '某个频段震颤或刺啦声：耳机或周围物体可能在该频率共振。调低音量后仍持续，可能是单元异常。',
      ],
    },
    mic: {
      heading: '3. 麦克风（免提）测试',
      desc: '允许麦克风权限后，输入电平会以条形显示。按下录音可录制5秒并立即回放，确认通话时对方听到的你的声音。',
      start: '打开麦克风', stop: '关闭麦克风', record: `录音${RECORD_SECONDS}秒`, recording: '录音中…', playback: '回放录音', level: '输入电平',
      privacy: '录音只在本设备播放，离开页面后即消失。',
      check: [
        '电平不动：浏览器或设备可能选择了其他麦克风（如笔记本内置麦克风）。请检查系统声音设置中的输入设备。',
        '声音小或听起来很远：蓝牙耳机麦克风离嘴较远，录音本来就偏小。请确认麦克风孔没有被堵住。',
        '通话时音乐音质变差：蓝牙在使用麦克风时会切换到通话配置，音质会下降，这是正常现象。',
      ],
      errors: {
        denied: '麦克风权限被拒绝。请在地址栏旁的网站权限中允许麦克风后重试。',
        nodevice: '未找到已连接的麦克风。请检查耳机连接状态。',
        unsupported: '此浏览器不支持麦克风测试。请使用最新版Chrome、Safari或Edge。',
        error: '无法启动麦克风。请检查是否有其他应用正在使用。',
      },
    },
    checkTitle: '结果判断',
    more: { heading: '了解更多', troubleshooting: '耳机声音问题排查指南', hearing: '听力保护指南', test: '寻找适合你耳机的EQ' },
  },
  ja: {
    label: 'テストツール',
    title: 'イヤホンの左右・周波数・マイクテスト',
    desc: 'インストール不要で、ブラウザからイヤホンの左右チャンネル、聞こえる周波数範囲、マイク（ハンズフリー）の状態を確認できます。音はすべて端末内で生成され、録音した声もサーバーには送信されません。',
    warnTitle: '始める前に音量を下げてください',
    warn: 'テスト音は一定の大きさの純音なので、音楽より大きく感じることがあります。端末の音量をいつもより低くして始め、必要なときだけ少しずつ上げてください。',
    lr: {
      heading: '1. 左右チャンネルテスト',
      desc: 'ボタンを押すと、その方向から短いビープ音が3回鳴ります。左ボタンは左のイヤホンだけ、右ボタンは右だけから聞こえれば正常です。',
      left: '左', center: '中央', right: '右', playing: '再生中',
      check: [
        '反対側から聞こえる：イヤホンの左右を逆に着けているか、端末のオーディオバランス設定が変わっている可能性があります。',
        '中央が片側に寄る：片側が耳あかや異物でふさがっているか、装着の深さが違う可能性があります。アクセシビリティの左右バランスも確認してください。',
        '片側がまったく聞こえない：そのイヤホンの接続とバッテリーを確認し、ペアリングし直してみてください。',
      ],
    },
    freq: {
      heading: '2. 周波数テスト',
      desc: `スイープは${SWEEP_SECONDS}秒かけて${SWEEP_MIN_HZ}Hzから${SWEEP_MAX_HZ / 1000}kHzまで音を上げます。トーンはスライダーで選んだ周波数の音を鳴らし続けます。特定の帯域で音が急に大きく・小さくなったり、震えやノイズが出たりしないか聴いてみてください。`,
      sweep: 'スイープ再生', tone: 'トーン再生', stop: '停止', current: '現在の周波数',
      check: [
        'ごく低い音（20–40Hz）が聞こえない：小さなイヤホン、特にインナーイヤー型ではよくあることです。カナル型ならイヤーピースの密閉を確認してください。',
        '高い音（15kHz以上）が聞こえない：年齢とともに高音の可聴範囲は自然に狭くなります。イヤホンの問題ではないかもしれません。',
        '特定の帯域でビビリ音：その周波数でイヤホンや周囲の物が共振している可能性があります。音量を下げても続くならドライバーの異常を疑ってください。',
      ],
    },
    mic: {
      heading: '3. マイク（ハンズフリー）テスト',
      desc: 'マイクの許可を出すと入力レベルがバーで表示されます。録音ボタンを押すと5秒間録音してすぐに再生でき、通話相手に自分の声がどう聞こえるか確認できます。',
      start: 'マイクをオン', stop: 'マイクをオフ', record: `${RECORD_SECONDS}秒録音`, recording: '録音中…', playback: '録音を再生', level: '入力レベル',
      privacy: '録音はこの端末でのみ再生され、ページを離れると消えます。',
      check: [
        'レベルが動かない：ブラウザーや端末で別のマイク（ノートPC内蔵マイクなど）が選ばれている可能性があります。システムのサウンド設定で入力デバイスを確認してください。',
        '声が小さい・遠い：Bluetoothイヤホンのマイクは口から離れているため、もともと小さめに録音されます。マイク穴がふさがっていないか確認してください。',
        '通話中に音楽の音質が落ちる：Bluetoothはマイク使用中に通話用プロファイルに切り替わり音質が下がります。正常な動作です。',
      ],
      errors: {
        denied: 'マイクの許可が拒否されました。アドレスバー横のサイト設定でマイクを許可してから、もう一度お試しください。',
        nodevice: '接続されたマイクが見つかりません。イヤホンの接続状態を確認してください。',
        unsupported: 'このブラウザーはマイクテストに対応していません。最新のChrome、Safari、Edgeでお試しください。',
        error: 'マイクを開始できませんでした。ほかのアプリがマイクを使用していないか確認してください。',
      },
    },
    checkTitle: '結果の見方',
    more: { heading: 'さらに詳しく', troubleshooting: 'イヤホンの音のトラブル解決ガイド', hearing: '聴力保護ガイド', test: '自分のイヤホンに合うEQを探す' },
  },
}

function CheckList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5">
      <p className="text-sm font-semibold text-foreground mb-2">{title}</p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground leading-relaxed">
        {items.map((item) => {
          const idx = item.search(/[:：]/)
          return idx > 0 && idx < 40
            ? <li key={item}><strong className="text-foreground">{item.slice(0, idx + 1)}</strong>{item.slice(idx + 1)}</li>
            : <li key={item}>{item}</li>
        })}
      </ul>
    </div>
  )
}

export default function ToolsContent() {
  const { lang } = useLanguage()
  const c = COPY[lang] ?? COPY.ko

  const [playing, setPlaying] = useState<Playing>(null)
  const [frequency, setFrequency] = useState(1000)
  const [mic, setMic] = useState<MicState>('idle')
  const [level, setLevel] = useState(0)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)

  const ctxRef = useRef<AudioContext | null>(null)
  const stopRef = useRef<(() => void) | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const micRafRef = useRef<number | null>(null)
  const urlRef = useRef<string | null>(null)

  const getContext = async () => {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      ctxRef.current = new Ctor()
    }
    if (ctxRef.current.state === 'suspended') await ctxRef.current.resume()
    return ctxRef.current
  }

  const stopSound = () => {
    stopRef.current?.()
    stopRef.current = null
    oscRef.current = null
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    setPlaying(null)
  }

  const stopMic = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (micRafRef.current !== null) cancelAnimationFrame(micRafRef.current)
    micRafRef.current = null
    setLevel(0)
  }

  useEffect(() => () => {
    stopRef.current?.()
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    if (micRafRef.current !== null) cancelAnimationFrame(micRafRef.current)
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    void ctxRef.current?.close()
  }, [])

  // 출력 경로: 오실레이터 → (패너) → 고정 음량 → 스피커. 정지 함수에서 짧게 페이드아웃해 클릭음을 막음
  const startOscillator = (ctx: AudioContext, hz: number, pan = 0) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const panner = ctx.createStereoPanner()
    osc.frequency.value = hz
    panner.pan.value = pan
    gain.gain.value = 0
    gain.gain.setTargetAtTime(OUTPUT_GAIN, ctx.currentTime, 0.01)
    osc.connect(panner).connect(gain).connect(ctx.destination)
    osc.start()
    return {
      osc,
      stop: () => {
        const t = ctx.currentTime
        gain.gain.cancelScheduledValues(t)
        gain.gain.setTargetAtTime(0, t, 0.01)
        osc.stop(t + 0.08)
      },
    }
  }

  const playChannel = async (side: 'left' | 'center' | 'right') => {
    stopSound()
    const ctx = await getContext()
    if (!ctx) return
    const pan = side === 'left' ? -1 : side === 'right' ? 1 : 0
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const panner = ctx.createStereoPanner()
    osc.frequency.value = 880
    panner.pan.value = pan
    gain.gain.value = 0
    const t0 = ctx.currentTime + 0.05
    for (let i = 0; i < 3; i++) {
      const s = t0 + i * 0.4
      gain.gain.setValueAtTime(0, s)
      gain.gain.linearRampToValueAtTime(OUTPUT_GAIN, s + 0.02)
      gain.gain.setValueAtTime(OUTPUT_GAIN, s + 0.2)
      gain.gain.linearRampToValueAtTime(0, s + 0.24)
    }
    osc.connect(panner).connect(gain).connect(ctx.destination)
    osc.start(t0)
    const end = t0 + 1.3
    osc.stop(end)
    osc.onended = () => setPlaying((p) => (p === side ? null : p))
    stopRef.current = () => { try { osc.stop() } catch { /* 이미 정지됨 */ } }
    setPlaying(side)
  }

  const playSweep = async () => {
    stopSound()
    const ctx = await getContext()
    if (!ctx) return
    const { osc, stop } = startOscillator(ctx, SWEEP_MIN_HZ)
    const start = ctx.currentTime
    osc.frequency.setValueAtTime(SWEEP_MIN_HZ, start)
    osc.frequency.exponentialRampToValueAtTime(SWEEP_MAX_HZ, start + SWEEP_SECONDS)
    stopRef.current = stop
    setPlaying('sweep')
    const tick = () => {
      const elapsed = ctx.currentTime - start
      setFrequency(Math.round(sweepFrequencyAt(elapsed)))
      if (elapsed >= SWEEP_SECONDS) { stopSound(); return }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const playTone = async () => {
    stopSound()
    const ctx = await getContext()
    if (!ctx) return
    const { osc, stop } = startOscillator(ctx, frequency)
    oscRef.current = osc
    stopRef.current = stop
    setPlaying('tone')
  }

  const changeFrequency = (position: number) => {
    const hz = sliderToFrequency(position)
    setFrequency(hz)
    const osc = oscRef.current
    if (osc && ctxRef.current) osc.frequency.setTargetAtTime(hz, ctxRef.current.currentTime, 0.02)
  }

  const startMic = async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setMic('unsupported'); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = await getContext()
      if (!ctx) { stream.getTracks().forEach((track) => track.stop()); setMic('unsupported'); return }
      streamRef.current = stream
      // 분석만 하고 소리는 내보내지 않음 (하울링 방지). 출력에 연결되지 않은 노드는
      // 일부 브라우저가 처리하지 않으므로 음량 0인 노드를 거쳐 출력에 연결해 둔다
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      const mute = ctx.createGain()
      mute.gain.value = 0
      ctx.createMediaStreamSource(stream).connect(analyser).connect(mute).connect(ctx.destination)
      const buffer = new Float32Array(analyser.fftSize)
      const tick = () => {
        analyser.getFloatTimeDomainData(buffer)
        setLevel(levelFromSamples(buffer))
        micRafRef.current = requestAnimationFrame(tick)
      }
      micRafRef.current = requestAnimationFrame(tick)
      setMic('listening')
    } catch (err) {
      const name = err instanceof DOMException ? err.name : ''
      setMic(name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : name === 'NotFoundError' ? 'nodevice' : 'error')
    }
  }

  const turnOffMic = () => {
    stopMic()
    setMic('idle')
  }

  const record = () => {
    const stream = streamRef.current
    if (!stream || typeof MediaRecorder === 'undefined') { setMic('unsupported'); return }
    const recorder = new MediaRecorder(stream)
    const chunks: Blob[] = []
    recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data) }
    recorder.onstop = () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
      const url = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }))
      urlRef.current = url
      setRecordingUrl(url)
      setMic(streamRef.current ? 'listening' : 'idle')
    }
    recorder.start()
    setMic('recording')
    window.setTimeout(() => { if (recorder.state === 'recording') recorder.stop() }, RECORD_SECONDS * 1000)
  }

  const micActive = mic === 'listening' || mic === 'recording'
  const micError = mic === 'denied' || mic === 'nodevice' || mic === 'unsupported' || mic === 'error' ? c.mic.errors[mic] : null
  const sideButton = (side: 'left' | 'center' | 'right', label: string) => (
    <Button variant={playing === side ? 'default' : 'outline'} className={playing === side ? 'playing-ring' : undefined} onClick={() => void playChannel(side)} aria-pressed={playing === side}>
      {label}
    </Button>
  )

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="mb-8">
        <p className="label-xs mb-3">{c.label}</p>
        <h1 className="text-2xl font-bold tracking-tight mb-3">{c.title}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
      </div>

      <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-md mb-10">
        <p className="font-bold text-foreground mb-1">{c.warnTitle}</p>
        <p className="text-sm text-muted-foreground">{c.warn}</p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b">{c.lr.heading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.lr.desc}</p>
          <div className="grid grid-cols-3 gap-2">
            {sideButton('left', c.lr.left)}
            {sideButton('center', c.lr.center)}
            {sideButton('right', c.lr.right)}
          </div>
          <p className="text-xs text-muted-foreground mt-2 h-4" aria-live="polite">
            {playing === 'left' || playing === 'center' || playing === 'right' ? `${c.lr.playing}: ${c.lr[playing]}` : ''}
          </p>
          <CheckList title={c.checkTitle} items={c.lr.check} />
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b">{c.freq.heading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.freq.desc}</p>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">{c.freq.current}</p>
            <p className="text-3xl font-bold tabular-nums text-foreground mb-4" aria-live="off">{formatHz(frequency)}</p>
            <input
              type="range"
              min={0}
              max={SLIDER_STEPS}
              value={frequencyToSlider(frequency)}
              onChange={(e) => changeFrequency(Number(e.target.value))}
              disabled={playing === 'sweep'}
              aria-label={c.freq.current}
              className="w-full accent-[hsl(var(--primary))]"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1 mb-4">
              <span>{formatHz(SWEEP_MIN_HZ)}</span>
              <span>{formatHz(SWEEP_MAX_HZ)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button variant={playing === 'sweep' ? 'default' : 'outline'} className={playing === 'sweep' ? 'playing-ring' : undefined} onClick={() => void playSweep()}>{c.freq.sweep}</Button>
              <Button variant={playing === 'tone' ? 'default' : 'outline'} className={playing === 'tone' ? 'playing-ring' : undefined} onClick={() => void playTone()}>{c.freq.tone}</Button>
              <Button variant="ghost" onClick={stopSound} disabled={playing !== 'sweep' && playing !== 'tone'}>{c.freq.stop}</Button>
            </div>
          </div>
          <CheckList title={c.checkTitle} items={c.freq.check} />
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b">{c.mic.heading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.mic.desc}</p>
          <div className="rounded-xl border border-border p-4 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{c.mic.level}</p>
              <div className="h-3 rounded-full bg-muted overflow-hidden" role="meter" aria-label={c.mic.level} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(level * 100)}>
                <div className="h-full bg-primary transition-[width] duration-75" style={{ width: `${level * 100}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {micActive
                ? <Button variant="outline" onClick={turnOffMic} disabled={mic === 'recording'}>{c.mic.stop}</Button>
                : <Button variant="outline" onClick={() => void startMic()}>{c.mic.start}</Button>}
              <Button onClick={record} disabled={mic !== 'listening'} className={mic === 'recording' ? 'playing-ring !opacity-100' : undefined}>{mic === 'recording' ? c.mic.recording : c.mic.record}</Button>
            </div>
            {micError && <p className="text-sm text-destructive" role="alert">{micError}</p>}
            {recordingUrl && (
              <div className="fade-up">
                <p className="text-xs text-muted-foreground mb-1">{c.mic.playback}</p>
                <audio controls src={recordingUrl} className="w-full" />
              </div>
            )}
            <p className="text-xs text-muted-foreground">{c.mic.privacy}</p>
          </div>
          <CheckList title={c.checkTitle} items={c.mic.check} />
        </section>
      </div>

      <section className="pt-12">
        <h2 className="text-base font-semibold mb-4 text-foreground">{c.more.heading}</h2>
        <div className="space-y-3">
          {[
            { href: '/guide/troubleshooting', label: c.more.troubleshooting },
            { href: '/guide/hearing-health', label: c.more.hearing },
            { href: '/test', label: c.more.test },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center justify-between py-3 border-b border-border group">
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</span>
              <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
