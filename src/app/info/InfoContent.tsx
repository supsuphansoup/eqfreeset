'use client'

import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useLanguage, type LangCode } from '@/lib/language-context'
import { GUIDES } from '@/lib/guides'

type InfoData = {
  label: string
  title: string
  desc: string
  sections: {
    whatIsEq: { heading: string; p1: string; p2: string }
    freqBands: {
      heading: string; intro: string
      bass: { label: string; text: string }
      mid: { label: string; text: string }
      treble: { label: string; text: string }
    }
    abTest: {
      heading: string; p1: string; p2: string
      tipLabel: string
      tips: [string, string, string, string]
    }
    autoeq: { heading: string; p1: string; p2: string; p3: string; linkText: string }
    apply: {
      heading: string
      android: { label: string; text: string }
      ios: { label: string; text: string }
      streaming: { label: string; text: string }
    }
    eqTypes: { heading: string; p1: string; p2: string }
    faq: {
      heading: string
      q1: string; a1: string
      q2: string; a2: string
      q3: string; a3: string
      q4: string; a4: string
      q5: string; a5: string
    }
    moreGuides: {
      heading: string
    }
    contact: string
  }
}

const CONTENT: Record<LangCode, InfoData> = {
  ko: {
    label: '정보',
    title: 'EQ와 이 서비스에 대해',
    desc: 'EQ FreeSet을 처음 만든 이유는 단순합니다. 좋은 이어폰을 샀는데 소리가 마음에 안 들어서 AutoEq를 찾아봤고, 그 데이터를 조금 더 쉽게 쓸 수 있었으면 했습니다. 여기서는 EQ가 어떻게 동작하는지, 이 서비스가 어떤 방식으로 결과를 만드는지 간략히 정리했습니다.',
    sections: {
      whatIsEq: {
        heading: 'EQ가 하는 일',
        p1: '이퀄라이저는 소리를 구성하는 주파수 대역별로 음량을 올리거나 내립니다. 사람이 들을 수 있는 범위는 대략 20Hz에서 20kHz인데, EQ는 이 구간을 여러 밴드로 나누어 각각 따로 조절합니다.',
        p2: '이어폰마다 소리 성향이 다른 건 제조사가 의도적으로 특정 대역을 강조하거나 억제해서 그렇습니다. EQ로 이 성향을 보정하면 같은 기기로도 꽤 다른 소리를 들을 수 있습니다. 물론 드라이버 자체의 한계는 EQ로 극복이 안 됩니다.',
      },
      freqBands: {
        heading: '주파수 대역별 특성',
        intro: '어떤 대역을 조절하면 어떤 소리가 바뀌는지 대략적으로만 알아도 결과를 해석하는 데 도움이 됩니다.',
        bass: { label: '저음 — 20Hz ~ 250Hz', text: '60Hz 아래는 몸으로 느끼는 진동에 가깝습니다. 250Hz 근처까지가 베이스 기타, 킥 드럼의 핵심 음역이고, 음악의 리듬감과 무게감을 담당합니다. 소비자용 이어폰 대부분이 이 구간을 원본보다 강하게 표현합니다.' },
        mid: { label: '중음 — 250Hz ~ 4kHz', text: '보컬과 대부분 악기의 핵심 배음이 이 범위에 있습니다. 250~500Hz 구간이 뭉치면 소리가 먹먹하게 들리고, 2~4kHz가 과하면 오래 듣기 피곤해집니다. 음악 정보의 밀도가 가장 높은 대역이라 조금만 건드려도 체감이 큽니다.' },
        treble: { label: '고음 — 4kHz ~ 20kHz', text: '선명도, 공기감, 해상도를 결정합니다. 개인 청력에 따라 체감 차이가 가장 크게 나는 대역이기도 합니다. 8kHz 이상은 심벌즈 찰랑거림이나 현악기의 질감을 만들고, 12kHz 넘어서면 공간감에 영향을 줍니다.' },
      },
      abTest: {
        heading: 'A/B 블라인드 테스트 방식',
        p1: '두 소리를 번갈아 듣고 어느 쪽이 더 낫게 느껴지는지 고르는 방식입니다. 어느 쪽이 EQ 적용본인지 모르는 상태에서 판단하기 때문에 심리적 편향이 줄어듭니다.',
        p2: '사람의 뇌는 절대적인 기준보다 직접 비교에 훨씬 잘 반응합니다. "이 소리가 좋다"보다 "이게 저것보다 낫다"가 훨씬 판단하기 쉽고 정확합니다.',
        tipLabel: '테스트 팁',
        tips: [
          '조용한 환경에서 하세요. 주변 소음이 있으면 미세한 차이를 놓칩니다.',
          '평소 자주 듣는 곡을 쓰면 차이를 더 잘 잡아냅니다.',
          '피곤한 상태에서는 판단이 흐려집니다. 귀가 쉰 상태에서 시작하세요.',
          '저음에 집중할 땐 킥 드럼과 베이스를, 고음은 심벌즈를 기준으로 삼으면 좋습니다.',
        ],
      },
      autoeq: {
        heading: 'AutoEq 데이터에 대해',
        p1: 'EQ FreeSet은 핀란드 엔지니어 Jaakko Pasanen이 만든 오픈소스 프로젝트 AutoEq의 측정 데이터를 사용합니다. 전문 측정 장비로 각 이어폰의 주파수 응답을 실측한 후, Harman Target이라는 기준 곡선에 맞춰 보정값을 계산한 결과입니다.',
        p2: 'Harman Target은 삼성 산하 오디오 연구소 하만에서 수천 명의 청취 선호도를 조사해 도출한 목표 곡선입니다. 완전히 평탄한 것보다 저음이 약간 강조되고 고음이 자연스럽게 내려가는 형태입니다.',
        p3: '데이터는 MIT 라이선스 하에 공개되어 있습니다. EQ FreeSet은 이를 그대로 가져와서 사용자에게 전달하는 역할만 합니다.',
        linkText: 'AutoEq GitHub 저장소 →',
      },
      apply: {
        heading: 'EQ 결과 적용하는 법',
        android: { label: 'Android — Wavelet (무료)', text: 'AutoEq 데이터베이스가 내장된 시스템 EQ 앱입니다. Bluetooth도 됩니다. 앱 설치 후 기기를 선택하면 자동으로 EQ가 적용됩니다. EQ FreeSet의 파라메트릭 EQ 값으로 추가 미세조정도 가능합니다.' },
        ios: { label: 'iOS', text: 'iOS는 시스템 전역 EQ를 지원하지 않습니다. Apple 음악 앱 내 EQ 설정을 쓰거나, 정밀한 제어가 필요하면 Equalizer Fx 같은 서드파티 앱을 사용해야 합니다.' },
        streaming: { label: '스트리밍 앱 내장 EQ', text: 'Spotify는 홈 → 설정 → 재생 → 이퀄라이저에서 찾을 수 있고, YouTube Music은 프로필 → 설정 → 오디오 품질 → 이퀄라이저에 있습니다. Poweramp나 TIDAL도 자체 EQ를 지원합니다.' },
      },
      eqTypes: {
        heading: '그래픽 EQ vs 파라메트릭 EQ',
        p1: '그래픽 EQ는 미리 정해진 주파수 슬라이더를 올리내리는 방식입니다. 대부분의 음악 앱에 내장되어 있고 직관적이지만, 원하는 정확한 주파수를 타깃하기가 어렵습니다.',
        p2: '파라메트릭 EQ는 중심 주파수, 이득(dB), 대역폭(Q)을 직접 입력합니다. 훨씬 정밀하게 조절할 수 있지만 전용 앱이 필요하고 진입 장벽이 있습니다. EQ FreeSet은 두 방식의 값을 모두 제공합니다.',
      },
      faq: {
        heading: '자주 묻는 것들',
        q1: '무료로 쓸 수 있나요?', a1: '네, 기기 선택부터 테스트, 결과 확인, JSON 다운로드까지 전부 무료입니다. 회원가입도 없습니다.',
        q2: '어떤 기기를 지원하나요?', a2: 'AutoEq 데이터베이스 기반으로 Sony, Sennheiser, Apple AirPods, Samsung Galaxy Buds 등 수백 종이 있습니다. 기기 선택 화면에서 검색해서 확인해보세요.',
        q3: 'EQ를 적용하면 음질이 나빠지나요?', a3: '±6dB 정도의 조절은 음질 저하 없이 적용됩니다. 다만 10dB 이상 올리는 건 드라이버에 부담이 가거나 왜곡이 생길 수 있어 권장하지 않습니다. EQ FreeSet 결과는 ±10dB 이내로 제한됩니다.',
        q4: '내 이어폰이 목록에 없어요', a4: '개발자와 소통 페이지로 요청 주시면 AutoEq에 측정값이 있는 기기는 추가해 드리겠습니다.',
        q5: '테스트 결과가 마음에 안 들면?', a5: '언제든 다시 할 수 있습니다. 귀가 피로할 때나 볼륨이 너무 낮거나 높을 때 결과가 달라지기도 합니다. 조용한 환경에서 적당한 볼륨으로 하는 게 가장 일관된 결과를 줍니다.',
      },
      moreGuides: {
        heading: '더 읽어볼 것들',
      },
      contact: '개발자와 소통 →',
    },
  },
  en: {
    label: 'About',
    title: 'About EQ & This Service',
    desc: 'The reason I built EQ FreeSet is simple. I bought good earphones but wasn\'t satisfied with the sound, so I looked into AutoEq — and wanted to make that data easier to use. Here\'s a brief overview of how EQ works and how this service generates results.',
    sections: {
      whatIsEq: {
        heading: 'What EQ Does',
        p1: 'An equalizer adjusts the volume of individual frequency bands that make up sound. The range humans can hear is roughly 20Hz to 20kHz, and EQ divides this into multiple bands, each adjustable independently.',
        p2: 'Every earphone sounds different because manufacturers intentionally emphasize or suppress certain frequency bands. Correcting this with EQ can produce noticeably different sound from the same device. Of course, the physical limits of the driver cannot be overcome with EQ alone.',
      },
      freqBands: {
        heading: 'Frequency Band Characteristics',
        intro: 'A basic understanding of which band affects which sound helps you interpret your EQ results.',
        bass: { label: 'Bass — 20Hz ~ 250Hz', text: 'Below 60Hz is closer to vibration you feel physically. Up to around 250Hz covers the core range of bass guitar and kick drum, providing rhythmic weight and impact. Most consumer earphones emphasize this range more than the original recording.' },
        mid: { label: 'Mids — 250Hz ~ 4kHz', text: 'This range contains the fundamental harmonics of vocals and most instruments. Muddiness around 250–500Hz can make audio sound stuffy, while excess at 2–4kHz causes listening fatigue. It\'s the densest region of musical information, so small adjustments have a big impact.' },
        treble: { label: 'Treble — 4kHz ~ 20kHz', text: 'Determines clarity, airiness, and resolution. This is also where individual hearing differences show most. Above 8kHz adds shimmer to cymbals and texture to strings, and above 12kHz influences perceived soundstage.' },
      },
      abTest: {
        heading: 'A/B Blind Testing Method',
        p1: 'You listen to two sounds alternately and pick which one sounds better. Since you don\'t know which has the EQ applied, psychological bias is reduced.',
        p2: 'The human brain responds much better to direct comparison than absolute judgment. "This one sounds better than that" is far easier and more accurate than "this sound is good."',
        tipLabel: 'Testing Tips',
        tips: [
          'Test in a quiet environment. Background noise makes subtle differences harder to catch.',
          'Using music you listen to regularly helps you notice differences more easily.',
          'Don\'t test when you\'re tired. Start when your ears are rested.',
          'For bass, focus on kick drums and bass lines. For treble, use cymbals as your reference.',
        ],
      },
      autoeq: {
        heading: 'About AutoEq Data',
        p1: 'EQ FreeSet uses measurement data from AutoEq, an open-source project by Finnish engineer Jaakko Pasanen. It measures the frequency response of each earphone with professional equipment, then calculates correction values to match the Harman Target reference curve.',
        p2: 'The Harman Target is a target curve derived by Samsung\'s Harman audio research lab from listener preference studies with thousands of participants. It features slightly emphasized bass and a natural roll-off in the highs compared to a fully flat response.',
        p3: 'The data is released under the MIT License. EQ FreeSet simply takes this data and presents it to users.',
        linkText: 'AutoEq GitHub Repository →',
      },
      apply: {
        heading: 'How to Apply EQ Results',
        android: { label: 'Android — Wavelet (Free)', text: 'A system EQ app with the AutoEq database built in. Works with Bluetooth too. After installing the app, select your device and EQ is applied automatically. You can also use EQ FreeSet\'s parametric EQ values for further fine-tuning.' },
        ios: { label: 'iOS', text: 'iOS does not support system-wide EQ. You can use the EQ settings within the Apple Music app, or for precise control, use a third-party app like Equalizer Fx.' },
        streaming: { label: 'Streaming App Built-in EQ', text: 'Spotify: Home → Settings → Playback → Equalizer. YouTube Music: Profile → Settings → Audio Quality → Equalizer. Poweramp and TIDAL also support their own EQ.' },
      },
      eqTypes: {
        heading: 'Graphic EQ vs Parametric EQ',
        p1: 'Graphic EQ lets you push preset frequency sliders up or down. It\'s built into most music apps and is intuitive, but it\'s hard to target the exact frequency you want.',
        p2: 'Parametric EQ lets you enter the center frequency, gain (dB), and bandwidth (Q) directly. It\'s far more precise but requires a dedicated app and has a steeper learning curve. EQ FreeSet provides values for both formats.',
      },
      faq: {
        heading: 'Frequently Asked Questions',
        q1: 'Is it free to use?', a1: 'Yes, everything — from device selection to testing, viewing results, and downloading JSON — is completely free. No account required.',
        q2: 'Which devices are supported?', a2: 'Based on the AutoEq database, there are hundreds of devices including Sony, Sennheiser, Apple AirPods, and Samsung Galaxy Buds. Search the device selection screen to check.',
        q3: 'Does applying EQ reduce audio quality?', a3: 'Adjustments of around ±6dB can be applied without audible quality loss. However, boosting by more than 10dB can strain the driver or introduce distortion, so it\'s not recommended. EQ FreeSet results are capped at ±10dB.',
        q4: 'My earphones aren\'t in the list', a4: 'Send a request through the Contact page. If your device has measurement data in AutoEq, I\'ll add it.',
        q5: 'What if I\'m not satisfied with the results?', a5: 'You can redo the test anytime. Results can vary if you\'re tired or the volume is too low or high. A quiet environment with a comfortable volume gives the most consistent results.',
      },
      moreGuides: {
        heading: 'Further Reading',
      },
      contact: 'Contact Developer →',
    },
  },
  zh: {
    label: '关于',
    title: '关于EQ与本服务',
    desc: '制作EQ FreeSet的原因很简单。我买了好的耳机，却不满意音质，于是研究了AutoEq，希望能更方便地使用这些数据。这里简要介绍了EQ的工作原理以及本服务如何生成结果。',
    sections: {
      whatIsEq: {
        heading: 'EQ的作用',
        p1: '均衡器可以调整构成声音的各频率段的音量。人耳可听范围大约为20Hz到20kHz，EQ将这一范围分成多个频段，每个频段可以独立调节。',
        p2: '不同耳机音色各异，是因为厂商有意强调或抑制某些频段。通过EQ校正这些特性，可以从同一设备获得截然不同的声音。当然，驱动单元本身的物理限制无法通过EQ克服。',
      },
      freqBands: {
        heading: '各频段特性',
        intro: '大致了解调节哪个频段会影响哪种声音，有助于解读EQ结果。',
        bass: { label: '低频 — 20Hz ~ 250Hz', text: '60Hz以下接近于身体可以感受到的振动。250Hz附近是贝斯吉他和底鼓的核心音域，负责音乐的节奏感和重量感。大多数消费级耳机会比原始录音更强调这一频段。' },
        mid: { label: '中频 — 250Hz ~ 4kHz', text: '人声和大多数乐器的基音谐波都在这个范围内。250~500Hz浑浊会让声音发闷，2~4kHz过多会导致听觉疲劳。这是音乐信息密度最高的频段，少量调整就会有明显感受。' },
        treble: { label: '高频 — 4kHz ~ 20kHz', text: '决定清晰度、空气感和解析力。也是个体听力差异最明显的频段。8kHz以上产生铙钹的清脆感和弦乐的质感，12kHz以上影响空间感。' },
      },
      abTest: {
        heading: 'A/B盲测方式',
        p1: '交替聆听两种声音，选择听起来更好的那个。由于在不知道哪个应用了EQ的情况下做出判断，心理偏见得以减少。',
        p2: '人脑对直接比较的反应远好于绝对判断。"这个比那个好听"比"这个声音好"要容易判断得多，也更准确。',
        tipLabel: '测试技巧',
        tips: [
          '在安静的环境中进行。背景噪音会让微小差异难以察觉。',
          '使用平时常听的曲目，更容易发现差异。',
          '疲劳时判断力下降。在耳朵休息好的状态下开始。',
          '关注低频时以底鼓和贝斯为基准，关注高频时以铙钹为基准。',
        ],
      },
      autoeq: {
        heading: '关于AutoEq数据',
        p1: 'EQ FreeSet使用芬兰工程师Jaakko Pasanen创建的开源项目AutoEq的测量数据。通过专业测量设备实测各耳机的频率响应，然后根据Harman Target基准曲线计算校正值。',
        p2: 'Harman Target是三星旗下音频研究机构哈曼通过对数千名听众的偏好调查得出的目标曲线。相比完全平坦，低频略有强调，高频自然衰减。',
        p3: '数据在MIT许可证下开放。EQ FreeSet只是获取这些数据并呈现给用户。',
        linkText: 'AutoEq GitHub 仓库 →',
      },
      apply: {
        heading: '如何应用EQ结果',
        android: { label: 'Android — Wavelet（免费）', text: '内置AutoEq数据库的系统EQ应用，支持蓝牙。安装应用后选择设备即自动应用EQ。也可以使用EQ FreeSet的参数EQ值进行进一步微调。' },
        ios: { label: 'iOS', text: 'iOS不支持系统级EQ。您可以使用Apple音乐应用内的EQ设置，或使用Equalizer Fx等第三方应用进行精确控制。' },
        streaming: { label: '流媒体应用内置EQ', text: 'Spotify：主页→设置→播放→均衡器。YouTube Music：个人资料→设置→音频质量→均衡器。Poweramp和TIDAL也支持自有EQ。' },
      },
      eqTypes: {
        heading: '图形EQ vs 参数EQ',
        p1: '图形EQ通过推动预设频率滑块来调节。大多数音乐应用内置此功能，直观易用，但难以精准定位目标频率。',
        p2: '参数EQ可以直接输入中心频率、增益(dB)和带宽(Q)。调节更加精确，但需要专用应用，且有一定学习曲线。EQ FreeSet同时提供两种格式的数值。',
      },
      faq: {
        heading: '常见问题',
        q1: '可以免费使用吗？', a1: '是的，从设备选择到测试、查看结果、下载JSON，全部免费，无需注册账号。',
        q2: '支持哪些设备？', a2: '基于AutoEq数据库，包含Sony、Sennheiser、Apple AirPods、Samsung Galaxy Buds等数百种设备。在设备选择界面搜索确认。',
        q3: '应用EQ会降低音质吗？', a3: '±6dB左右的调整不会造成音质损失。但提升超过10dB可能会给驱动单元带来负担或产生失真，不建议这样做。EQ FreeSet的结果限制在±10dB以内。',
        q4: '我的耳机不在列表中', a4: '请通过联系页面发送请求。如果您的设备在AutoEq中有测量数据，我会将其添加。',
        q5: '对测试结果不满意怎么办？', a5: '随时可以重新测试。在疲劳或音量过低/过高时结果可能有所不同。在安静环境中以适当音量进行测试能获得最稳定的结果。',
      },
      moreGuides: {
        heading: '延伸阅读',
      },
      contact: '联系开发者 →',
    },
  },
  ja: {
    label: '情報',
    title: 'EQとこのサービスについて',
    desc: 'EQ FreeSetを作った理由はシンプルです。良いイヤホンを買ったのに音が気に入らず、AutoEqを調べ、そのデータをもっと簡単に使えればと思ったからです。ここではEQがどのように動作するか、このサービスがどのように結果を生成するかを簡単にまとめました。',
    sections: {
      whatIsEq: {
        heading: 'EQとは何か',
        p1: 'イコライザーは音を構成する周波数帯域ごとに音量を上げ下げします。人が聞ける範囲はおよそ20Hzから20kHzで、EQはこの範囲を複数のバンドに分け、それぞれ個別に調整します。',
        p2: 'イヤホンごとに音の傾向が異なるのは、メーカーが意図的に特定の帯域を強調したり抑制したりしているためです。EQでこの傾向を補正すると、同じデバイスでもかなり異なる音が楽しめます。もちろん、ドライバー自体の限界はEQでは克服できません。',
      },
      freqBands: {
        heading: '周波数帯域別の特性',
        intro: 'どの帯域を調整するとどんな音が変わるかを大まかに知っておくだけで、結果の解釈に役立ちます。',
        bass: { label: '低音 — 20Hz ~ 250Hz', text: '60Hz以下は体で感じる振動に近いです。250Hz付近までがベースギターとキックドラムの核心音域で、音楽のリズム感と重厚感を担います。消費者向けイヤホンの多くはこの帯域を原音より強調します。' },
        mid: { label: '中音 — 250Hz ~ 4kHz', text: 'ボーカルとほとんどの楽器の基音倍音がこの範囲にあります。250~500Hz付近がこもると音が詰まって聞こえ、2~4kHzが過剰だと長時間の聴取が疲れます。音楽情報が最も密集する帯域のため、少し調整するだけで体感変化が大きいです。' },
        treble: { label: '高音 — 4kHz ~ 20kHz', text: '明瞭度、エアー感、解像度を決定します。個人の聴力によって最も体感差が出る帯域でもあります。8kHz以上はシンバルの輝きや弦楽器の質感を生み出し、12kHz以上は空間感に影響します。' },
      },
      abTest: {
        heading: 'A/Bブラインドテスト方式',
        p1: '2つの音を交互に聴いて、どちらが良く聴こえるかを選ぶ方法です。どちらにEQが適用されているかを知らない状態で判断するため、心理的バイアスが軽減されます。',
        p2: '人間の脳は絶対的な基準よりも直接比較に対してはるかによく反応します。「この音が良い」より「こっちの方があっちよりいい」の方が、判断がはるかに簡単で正確です。',
        tipLabel: 'テストのコツ',
        tips: [
          '静かな環境でテストしてください。周囲の雑音があると微妙な差が聞き取りにくくなります。',
          '普段よく聴く曲を使うと、差をより捉えやすくなります。',
          '疲れているときは判断が鈍ります。耳が休んでいる状態で始めましょう。',
          '低音に集中するときはキックドラムとベースを、高音はシンバルを基準にすると良いです。',
        ],
      },
      autoeq: {
        heading: 'AutoEqデータについて',
        p1: 'EQ FreeSetはフィンランドのエンジニア Jaakko Pasanen が作成したオープンソースプロジェクト AutoEq の測定データを使用しています。専門の測定機器で各イヤホンの周波数特性を実測し、Harman Target という基準曲線に合わせて補正値を計算した結果です。',
        p2: 'Harman Target は、Samsung傘下のオーディオ研究機関 Harman が数千人の聴取好みを調査して導き出した目標曲線です。完全にフラットなものより低音がやや強調され、高音が自然に下がる形をしています。',
        p3: 'データはMITライセンスの下で公開されています。EQ FreeSetはこれをそのまま取得し、ユーザーに提供する役割のみを担います。',
        linkText: 'AutoEq GitHubリポジトリ →',
      },
      apply: {
        heading: 'EQ結果の適用方法',
        android: { label: 'Android — Wavelet（無料）', text: 'AutoEqデータベースが内蔵されたシステムEQアプリです。Bluetoothにも対応しています。アプリをインストールしてデバイスを選ぶと自動的にEQが適用されます。EQ FreeSetのパラメトリックEQ値でさらに微調整することも可能です。' },
        ios: { label: 'iOS', text: 'iOSはシステム全体のEQをサポートしていません。Apple Musicアプリ内のEQ設定を使うか、精密な制御が必要な場合はEqualizer Fxなどのサードパーティアプリを使用してください。' },
        streaming: { label: 'ストリーミングアプリ内蔵EQ', text: 'Spotify：ホーム→設定→再生→イコライザー。YouTube Music：プロフィール→設定→音質→イコライザー。PowerampやTIDALも独自EQをサポートしています。' },
      },
      eqTypes: {
        heading: 'グラフィックEQ vs パラメトリックEQ',
        p1: 'グラフィックEQはあらかじめ決められた周波数スライダーを上下するタイプです。ほとんどの音楽アプリに内蔵されており直感的ですが、正確な周波数をターゲットにするのが難しいです。',
        p2: 'パラメトリックEQは中心周波数、ゲイン(dB)、帯域幅(Q)を直接入力します。はるかに精密に調整できますが、専用アプリが必要で敷居があります。EQ FreeSetは両方式の値を提供します。',
      },
      faq: {
        heading: 'よくある質問',
        q1: '無料で使えますか？', a1: 'はい、デバイス選択からテスト、結果確認、JSONダウンロードまですべて無料です。会員登録も不要です。',
        q2: 'どのデバイスに対応していますか？', a2: 'AutoEqデータベースに基づき、Sony、Sennheiser、Apple AirPods、Samsung Galaxy Budsなど数百種類があります。デバイス選択画面で検索して確認してください。',
        q3: 'EQを適用すると音質が下がりますか？', a3: '±6dB程度の調整は音質低下なく適用できます。ただし10dB以上のブーストはドライバーに負担がかかったり歪みが生じる可能性があるため推奨しません。EQ FreeSetの結果は±10dB以内に制限されています。',
        q4: '自分のイヤホンがリストにない', a4: 'お問い合わせページからリクエストをいただければ、AutoEqに測定値があるデバイスは追加します。',
        q5: 'テスト結果が気に入らない場合は？', a5: 'いつでも再テストできます。疲れているときや音量が低すぎたり高すぎたりすると結果が変わることもあります。静かな環境で適切な音量で行うと最も安定した結果が得られます。',
      },
      moreGuides: {
        heading: 'さらに読む',
      },
      contact: '開発者に連絡 →',
    },
  },
}

export default function InfoContent() {
  const { lang } = useLanguage()
  const c = CONTENT[lang] ?? CONTENT.ko
  const s = c.sections

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      {/* Page header */}
      <div className="mb-12">
        <p className="label-xs mb-3">{c.label}</p>
        <h1 className="text-2xl font-bold tracking-tight mb-3">{c.title}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
      </div>

      <div className="space-y-14">
        {/* EQ 기본 */}
        <section id="what-is-eq">
          <h2 className="text-base font-semibold mb-4 text-foreground">{s.whatIsEq.heading}</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>{s.whatIsEq.p1}</p>
            <p>{s.whatIsEq.p2}</p>
          </div>
        </section>

        {/* 주파수 대역 */}
        <section id="frequency-bands">
          <h2 className="text-base font-semibold mb-4 text-foreground">{s.freqBands.heading}</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{s.freqBands.intro}</p>
          <div className="space-y-6 text-sm">
            {([
              s.freqBands.bass,
              s.freqBands.mid,
              s.freqBands.treble,
            ] as const).map((band) => (
              <div key={band.label} className="border-l-2 border-border pl-4 space-y-1.5">
                <p className="font-medium text-foreground">{band.label}</p>
                <p className="text-muted-foreground leading-relaxed">{band.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* A/B 테스트 */}
        <section id="ab-test">
          <h2 className="text-base font-semibold mb-4 text-foreground">{s.abTest.heading}</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>{s.abTest.p1}</p>
            <p>{s.abTest.p2}</p>
          </div>
          <div className="mt-5 bg-muted/40 rounded-xl p-4 text-sm space-y-2">
            <p className="font-medium text-foreground text-xs tracking-widest uppercase mb-3">{s.abTest.tipLabel}</p>
            <ul className="space-y-2 text-muted-foreground">
              {s.abTest.tips.map((tip, i) => (
                <li key={i} className="flex gap-2"><span className="text-primary shrink-0">—</span> {tip}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* AutoEq */}
        <section id="autoeq">
          <h2 className="text-base font-semibold mb-4 text-foreground">{s.autoeq.heading}</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>{s.autoeq.p1}</p>
            <p>{s.autoeq.p2}</p>
            <p>{s.autoeq.p3}</p>
          </div>
          <div className="mt-4">
            <a
              href="https://github.com/jaakkopasanen/AutoEq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              {s.autoeq.linkText}
            </a>
          </div>
        </section>

        {/* 앱 적용 */}
        <section id="apply-guide">
          <h2 className="text-base font-semibold mb-4 text-foreground">{s.apply.heading}</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            {([s.apply.android, s.apply.ios, s.apply.streaming] as const).map((item) => (
              <div key={item.label}>
                <p className="font-medium text-foreground mb-1.5">{item.label}</p>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* EQ 종류 */}
        <section id="eq-types">
          <h2 className="text-base font-semibold mb-4 text-foreground">{s.eqTypes.heading}</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>{s.eqTypes.p1}</p>
            <p>{s.eqTypes.p2}</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <h2 className="text-base font-semibold mb-4 text-foreground">{s.faq.heading}</h2>
          <Accordion type="single" collapsible className="w-full">
            {([
              { q: s.faq.q1, a: s.faq.a1, v: 'q1' },
              { q: s.faq.q2, a: s.faq.a2, v: 'q2' },
              { q: s.faq.q3, a: s.faq.a3, v: 'q3' },
              { q: s.faq.q4, a: s.faq.a4, v: 'q4' },
              { q: s.faq.q5, a: s.faq.a5, v: 'q5' },
            ]).map(({ q, a, v }) => (
              <AccordionItem key={v} value={v}>
                <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-primary py-4">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* 더 읽기 */}
        <section id="guides">
          <h2 className="text-base font-semibold mb-4 text-foreground">{s.moreGuides.heading}</h2>
          <div className="space-y-3">
            {GUIDES.map((g) => ({ href: `/guide/${g.slug}`, title: g.title[lang], sub: g.desc[lang] })).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between py-3 border-b border-border hover:text-primary transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
                <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="pt-4 border-t border-border">
          <Link
            href="/contact"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {s.contact}
          </Link>
        </section>
      </div>
    </main>
  )
}
