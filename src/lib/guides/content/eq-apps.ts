import type { GuideContent } from '@/lib/guides'

const content: GuideContent = {
  ko: {
    title: '무료 EQ 프로그램·앱 추천',
    subtitle: 'Windows, Mac, 안드로이드, 아이폰에서 쓸 만한 이퀄라이저 고르는 법',
    intro: 'EQ 값을 정했다면 그 값을 넣을 프로그램이 필요합니다. 그런데 운영체제마다 기본으로 들어 있는 EQ의 수준이 다르고, 앱마다 적용 범위와 밴드 방식도 제각각입니다. 이 글에서는 플랫폼별로 널리 쓰이는 무료 또는 무료로 시작할 수 있는 EQ 프로그램과 앱을 정리하고, 어떤 기준으로 고르면 되는지 설명합니다. 값을 실제로 입력하는 단계별 방법은 기기별 EQ 적용 방법 가이드에서 다룹니다.',
    sections: [
      {
        heading: '1. 먼저 알아둘 것: EQ가 걸리는 위치',
        blocks: [
          { type: 'p', text: 'EQ는 어디에 거느냐에 따라 적용 범위가 달라집니다. 같은 값을 넣어도 위치에 따라 일부 앱에만 적용되거나, 이어폰을 다른 기기에 연결해도 그대로 유지되기도 합니다.' },
          {
            type: 'table',
            head: ['위치', '적용 범위', '예시'],
            rows: [
              ['시스템 EQ', '기기에서 나오는 거의 모든 소리', 'Equalizer APO, Wavelet, 갤럭시 기본 이퀄라이저'],
              ['앱 내장 EQ', '그 앱에서 재생하는 소리만', 'Spotify, Apple Music, 일부 음악 플레이어'],
              ['이어폰 저장 EQ', '이어폰을 연결한 모든 기기·앱', '소니·삼성·젠하이저 등 제조사 앱'],
            ],
          },
          { type: 'note', title: 'EQ는 한 곳에서만', text: '시스템 EQ, 앱 EQ, 이어폰 EQ를 동시에 켜면 효과가 겹쳐 의도보다 과하게 들립니다. 하나를 정해서 쓰고 나머지는 꺼 두거나 평탄하게 두세요.' },
        ],
      },
      {
        heading: '2. Windows',
        blocks: [
          { type: 'p', text: 'Windows에는 모든 소리에 적용되는 사용자 EQ가 기본으로 없습니다. 사운드 드라이버에 따라 음량 평준화 같은 효과가 있을 뿐이라, 별도 프로그램을 쓰는 것이 일반적입니다.' },
          {
            type: 'list',
            items: [
              'Equalizer APO: 무료 오픈소스 시스템 EQ입니다. 설치할 때 고른 출력 장치에 EQ가 걸리며, 파라메트릭 EQ와 프리앰프를 지원해 가장 정밀하게 값을 넣을 수 있습니다. 설정은 텍스트 파일로 관리합니다.',
              'Peace: Equalizer APO 위에서 동작하는 무료 GUI입니다. 슬라이더로 조절하고 장치별 프리셋을 저장할 수 있어 설정 파일 편집이 부담스러운 사람에게 맞습니다.',
              'FxSound: 설치가 간단하고 프리셋 위주로 쓰기 쉬운 프로그램입니다. 무료로 사용할 수 있지만 세밀한 파라메트릭 설정보다는 간편함에 초점이 맞춰져 있습니다.',
            ],
          },
          { type: 'p', text: '정확한 값을 그대로 넣고 싶다면 Equalizer APO와 Peace 조합을, 간단히 소리 성향만 바꾸고 싶다면 FxSound를 추천합니다. Equalizer APO는 설치 후 재부팅이 필요하고, 장치를 바꾸면 해당 장치에도 다시 설정해야 합니다.' },
        ],
      },
      {
        heading: '3. Mac',
        blocks: [
          { type: 'p', text: 'macOS에도 시스템 전체 EQ는 없습니다. 음악 앱의 EQ는 Apple Music 재생에만 적용됩니다. 브라우저나 다른 앱 소리까지 바꾸려면 별도 프로그램이 필요합니다.' },
          {
            type: 'list',
            items: [
              'eqMac: 시스템 소리에 EQ를 거는 오픈소스 프로그램입니다. 기본 기능은 무료로 쓸 수 있고, 고급 기능은 유료 버전에서 제공됩니다.',
              'SoundSource: 앱별로 음량과 EQ를 따로 지정할 수 있는 유료 프로그램입니다. 앱마다 다른 EQ가 필요하거나 오디오 플러그인을 쓰고 싶을 때 적합합니다.',
            ],
          },
          { type: 'p', text: 'macOS 업데이트 직후에는 시스템 오디오 드라이버 방식의 프로그램이 잠시 동작하지 않을 수 있습니다. 소리가 나지 않으면 프로그램을 최신 버전으로 업데이트하세요.' },
        ],
      },
      {
        heading: '4. 안드로이드',
        blocks: [
          { type: 'p', text: '갤럭시를 비롯한 많은 안드로이드 기기는 설정에 기본 이퀄라이저가 있습니다. 밴드 수가 적거나 프리셋 위주라 더 정밀하게 쓰고 싶다면 시스템 EQ 앱을 설치하는 방법이 있습니다.' },
          {
            type: 'list',
            items: [
              '기본 이퀄라이저: 별도 설치 없이 쓸 수 있고 배터리 부담이 적습니다. 갤럭시는 설정 → 소리 및 진동 → 음질 및 음향 효과에 있습니다.',
              'Wavelet: 그래픽 EQ와 함께 AutoEq 기반 기기 보정 프로필을 제공하는 앱입니다. 기본 기능은 무료이고 일부 기능은 유료입니다. 여러 앱 소리에 같은 EQ를 걸 수 있습니다.',
              '플레이어 내장 EQ: 특정 음악 플레이어 앱에만 EQ를 걸고 싶다면 앱의 자체 이퀄라이저를 쓰는 것이 가장 간단합니다.',
            ],
          },
          { type: 'p', text: '시스템 EQ 앱은 기기 제조사나 안드로이드 버전, 재생 앱에 따라 일부 앱에 적용되지 않을 수 있습니다. 적용이 안 되는 앱이 있다면 앱 설정의 호환 모드나 재생 앱의 내장 EQ를 확인하세요.' },
        ],
      },
      {
        heading: '5. 아이폰',
        blocks: [
          { type: 'p', text: 'iOS는 다른 앱의 소리를 가로채 EQ를 거는 방식을 허용하지 않아, 모든 앱에 적용되는 사용자 EQ 앱이 사실상 없습니다. 그래서 아래 세 가지 중에서 고르는 것이 현실적입니다.' },
          {
            type: 'list',
            items: [
              '스트리밍 앱 EQ: Spotify처럼 설정에 이퀄라이저가 있는 앱은 그 앱에서 듣는 음악에 밴드별 값을 넣을 수 있습니다.',
              '이어폰 제조사 앱: 이어폰에 EQ가 저장되는 제품이라면 제조사 앱에서 설정한 EQ가 모든 앱에 적용됩니다. 가장 확실한 방법입니다.',
              '헤드폰 조절: AirPods와 일부 Beats 제품은 손쉬운 사용의 헤드폰 조절로 음역대 강조를 바꿀 수 있습니다. 밴드별 조절은 아닙니다.',
            ],
          },
        ],
      },
      {
        heading: '6. 한눈에 비교',
        blocks: [
          {
            type: 'table',
            head: ['플랫폼', '프로그램', '비용', '추천 대상'],
            rows: [
              ['Windows', 'Equalizer APO + Peace', '무료', '정확한 값을 그대로 넣고 싶은 사람'],
              ['Windows', 'FxSound', '무료', '간단하게 성향만 바꾸고 싶은 사람'],
              ['Mac', 'eqMac', '기본 무료', '시스템 전체 EQ가 필요한 사람'],
              ['Mac', 'SoundSource', '유료', '앱마다 다른 EQ가 필요한 사람'],
              ['안드로이드', '기본 이퀄라이저', '무료', '설치 없이 가볍게 쓰려는 사람'],
              ['안드로이드', 'Wavelet', '기본 무료', '여러 밴드를 정밀하게 맞추려는 사람'],
              ['아이폰', '스트리밍 앱·제조사 앱', '무료', '앱이나 이어폰에 EQ를 저장하려는 사람'],
            ],
          },
          { type: 'p', text: '가격과 기능은 앱 업데이트에 따라 바뀔 수 있으니 설치 전에 공식 사이트나 앱 스토어에서 확인하세요. 프로그램은 공식 배포처에서만 내려받는 것이 안전합니다.' },
        ],
      },
      {
        heading: '7. 고를 때 확인할 점',
        blocks: [
          {
            type: 'list',
            items: [
              '프리앰프 지원: 부스트가 있는 EQ는 소리가 찢어지기 쉬우므로 전체 음량을 낮추는 프리앰프 기능이 있는지 확인하세요.',
              '밴드 방식: 10밴드 그래픽 EQ인지, 주파수와 Q까지 지정하는 파라메트릭 EQ인지에 따라 값을 옮기는 방법이 달라집니다.',
              '적용 범위: 시스템 전체, 특정 앱, 특정 출력 장치 중 어디에 걸리는지 확인하세요.',
              '지연과 배터리: 게임이나 영상 통화에서 지연이 느껴지거나 배터리 소모가 늘면 EQ를 끄고 비교해 보세요.',
            ],
          },
          { type: 'note', title: '어떤 값을 넣을지 모르겠다면', text: '프로그램을 골랐는데 어떤 값을 넣어야 할지 막막하다면, EQ FreeSet 테스트로 내 이어폰과 귀에 맞는 10밴드 값을 먼저 찾은 뒤 그대로 옮겨 넣으면 됩니다.' },
        ],
      },
    ],
  },
  en: {
    title: 'Free EQ Apps and Programs',
    subtitle: 'How to choose an equalizer for Windows, Mac, Android and iPhone',
    intro: 'Once you have your EQ values, you need somewhere to put them. Each operating system ships with a different level of built-in EQ, and each app differs in scope and band layout. This guide covers widely used EQ programs and apps that are free or free to start, by platform, and explains how to choose. The step-by-step way to enter values is covered in the How to Apply EQ guide.',
    sections: [
      {
        heading: '1. First: Where the EQ Is Applied',
        blocks: [
          { type: 'p', text: 'Where you apply EQ decides its scope. The same values may affect only one app, or stay with your earphones on every device.' },
          {
            type: 'table',
            head: ['Location', 'Scope', 'Examples'],
            rows: [
              ['System EQ', 'Almost all sound from the device', 'Equalizer APO, Wavelet, Galaxy equalizer'],
              ['In-app EQ', 'Only what that app plays', 'Spotify, Apple Music, some music players'],
              ['On-earphone EQ', 'Every device and app the earphones connect to', 'Maker apps from Sony, Samsung, Sennheiser and others'],
            ],
          },
          { type: 'note', title: 'Use one EQ at a time', text: 'Turning on system, app and earphone EQ together stacks the effect. Pick one and keep the others off or flat.' },
        ],
      },
      {
        heading: '2. Windows',
        blocks: [
          { type: 'p', text: 'Windows has no built-in user EQ for all sound. Some sound drivers offer effects like loudness equalization, so a separate program is the usual route.' },
          {
            type: 'list',
            items: [
              'Equalizer APO: A free, open-source system EQ. It applies to the output devices chosen during install and supports parametric EQ and preamp for the most precise entry. Settings live in a text file.',
              'Peace: A free GUI on top of Equalizer APO. It offers sliders and per-device presets for people who would rather not edit config files.',
              'FxSound: Easy to install and preset-focused. It is free to use but aims at simplicity more than detailed parametric control.',
            ],
          },
          { type: 'p', text: 'For exact values, use Equalizer APO with Peace. For a quick change in character, FxSound is enough. Equalizer APO needs a reboot after install, and a new output device has to be configured again.' },
        ],
      },
      {
        heading: '3. Mac',
        blocks: [
          { type: 'p', text: 'macOS has no system-wide EQ either. The Music app EQ only affects Apple Music playback. To change browser or other app audio, you need a separate program.' },
          {
            type: 'list',
            items: [
              'eqMac: An open-source program that applies EQ to system audio. Basic features are free, with advanced features in a paid version.',
              'SoundSource: A paid program that sets volume and EQ per app. Good when different apps need different EQ or you want audio plug-ins.',
            ],
          },
          { type: 'p', text: 'Right after a macOS update, programs that use a system audio driver may briefly stop working. If you lose sound, update the program.' },
        ],
      },
      {
        heading: '4. Android',
        blocks: [
          { type: 'p', text: 'Many Android phones, including Galaxy, have an equalizer in settings. If it has few bands or only presets, a system EQ app gives more precision.' },
          {
            type: 'list',
            items: [
              'Built-in equalizer: No install and little battery impact. On Galaxy it is under Settings → Sounds and vibration → Sound quality and effects.',
              'Wavelet: An app with a graphic EQ and AutoEq-based device correction profiles. Basic features are free, some are paid. It can apply one EQ to many apps.',
              'Player EQ: To EQ only one music player, its own equalizer is the simplest option.',
            ],
          },
          { type: 'p', text: 'System EQ apps may not work with some apps depending on the phone maker, Android version or player. If an app is not affected, check the EQ app’s compatibility mode or the player’s built-in EQ.' },
        ],
      },
      {
        heading: '5. iPhone',
        blocks: [
          { type: 'p', text: 'iOS does not let apps intercept other apps’ audio, so there is effectively no user EQ app that works across all apps. These three options are the practical ones.' },
          {
            type: 'list',
            items: [
              'Streaming app EQ: Apps with an equalizer in settings, such as Spotify, accept band values for music played in that app.',
              'Earphone maker app: If the earphones store EQ on the device, the maker app’s EQ applies to every app. This is the most reliable route.',
              'Headphone Accommodations: AirPods and some Beats can emphasize ranges via Accessibility. It is not per-band control.',
            ],
          },
        ],
      },
      {
        heading: '6. Comparison at a Glance',
        blocks: [
          {
            type: 'table',
            head: ['Platform', 'Program', 'Cost', 'Best for'],
            rows: [
              ['Windows', 'Equalizer APO + Peace', 'Free', 'Entering exact values'],
              ['Windows', 'FxSound', 'Free', 'Quick changes in character'],
              ['Mac', 'eqMac', 'Free basic', 'System-wide EQ'],
              ['Mac', 'SoundSource', 'Paid', 'Different EQ per app'],
              ['Android', 'Built-in equalizer', 'Free', 'Light use without installs'],
              ['Android', 'Wavelet', 'Free basic', 'Precise multi-band tuning'],
              ['iPhone', 'Streaming or maker app', 'Free', 'Storing EQ in an app or on earphones'],
            ],
          },
          { type: 'p', text: 'Prices and features change with updates, so check the official site or app store before installing. Download only from official sources.' },
        ],
      },
      {
        heading: '7. What to Check When Choosing',
        blocks: [
          {
            type: 'list',
            items: [
              'Preamp support: Boosted EQ clips easily, so check for a preamp that lowers the overall level.',
              'Band type: Moving values differs between a 10-band graphic EQ and a parametric EQ with frequency and Q.',
              'Scope: Check whether it applies system-wide, to one app or to one output device.',
              'Latency and battery: If games or calls feel delayed or battery drains faster, compare with EQ off.',
            ],
          },
          { type: 'note', title: 'Not sure what values to enter?', text: 'If you have the program but not the values, find 10-band values for your earphones and ears with the EQ FreeSet test first, then copy them over.' },
        ],
      },
    ],
  },
  zh: {
    title: '免费EQ软件与应用推荐',
    subtitle: '如何为Windows、Mac、Android和iPhone选择均衡器',
    intro: '确定了EQ数值，还需要能输入这些数值的软件。不同操作系统内置EQ的程度不同，各应用的作用范围和频段方式也各不相同。本文按平台整理了常用的免费或可免费开始使用的EQ软件与应用，并说明选择标准。具体的数值输入步骤请参阅“各设备EQ设置方法”指南。',
    sections: [
      {
        heading: '1. 先了解：EQ作用在哪里',
        blocks: [
          { type: 'p', text: 'EQ设置的位置决定了作用范围。同样的数值，有时只对某个应用生效，有时换设备连接耳机也会保留。' },
          {
            type: 'table',
            head: ['位置', '作用范围', '示例'],
            rows: [
              ['系统EQ', '设备发出的几乎所有声音', 'Equalizer APO、Wavelet、Galaxy内置均衡器'],
              ['应用内EQ', '仅该应用播放的声音', 'Spotify、Apple Music、部分音乐播放器'],
              ['耳机存储EQ', '耳机连接的所有设备与应用', '索尼、三星、森海塞尔等厂商应用'],
            ],
          },
          { type: 'note', title: 'EQ只开一处', text: '同时开启系统EQ、应用EQ和耳机EQ会叠加效果。选定一个使用，其余关闭或保持平直。' },
        ],
      },
      {
        heading: '2. Windows',
        blocks: [
          { type: 'p', text: 'Windows没有内置作用于所有声音的用户EQ，部分声卡驱动只提供响度均衡之类的效果，因此通常需要单独的软件。' },
          {
            type: 'list',
            items: [
              'Equalizer APO：免费开源的系统EQ。作用于安装时选择的输出设备，支持参数EQ和前级增益，可最精确地输入数值。设置以文本文件管理。',
              'Peace：基于Equalizer APO的免费图形界面。可用滑块调节并按设备保存预设，适合不想编辑配置文件的人。',
              'FxSound：安装简单、以预设为主，免费可用，但侧重便捷而非精细的参数调节。',
            ],
          },
          { type: 'p', text: '想原样输入精确数值，推荐Equalizer APO加Peace；只想简单改变听感，FxSound就够了。Equalizer APO安装后需要重启，更换输出设备后也需要重新设置。' },
        ],
      },
      {
        heading: '3. Mac',
        blocks: [
          { type: 'p', text: 'macOS同样没有系统级EQ。音乐应用的EQ只作用于Apple Music播放。要改变浏览器或其他应用的声音，需要单独的软件。' },
          {
            type: 'list',
            items: [
              'eqMac：为系统声音加EQ的开源软件。基础功能免费，高级功能在付费版中提供。',
              'SoundSource：可按应用分别设置音量和EQ的付费软件。适合不同应用需要不同EQ或想使用音频插件的情况。',
            ],
          },
          { type: 'p', text: 'macOS更新后，使用系统音频驱动方式的软件可能暂时无法工作。如果没有声音，请把软件更新到最新版本。' },
        ],
      },
      {
        heading: '4. Android',
        blocks: [
          { type: 'p', text: '包括Galaxy在内的许多Android设备在设置中内置均衡器。如果频段少或以预设为主，想更精细可以安装系统EQ应用。' },
          {
            type: 'list',
            items: [
              '内置均衡器：无需安装，耗电少。Galaxy位于设置 → 声音和振动 → 音质和音效。',
              'Wavelet：提供图形EQ和基于AutoEq的设备校正配置。基础功能免费，部分功能付费，可对多个应用应用同一EQ。',
              '播放器内置EQ：只想给某个音乐播放器加EQ，使用其自带均衡器最简单。',
            ],
          },
          { type: 'p', text: '系统EQ应用可能因厂商、Android版本或播放应用而对部分应用不生效。如遇不生效的应用，请检查EQ应用的兼容模式或播放器内置EQ。' },
        ],
      },
      {
        heading: '5. iPhone',
        blocks: [
          { type: 'p', text: 'iOS不允许应用截取其他应用的声音，因此实际上没有能作用于所有应用的用户EQ应用。现实的选择有以下三种。' },
          {
            type: 'list',
            items: [
              '流媒体应用EQ：Spotify等设置中带均衡器的应用，可为该应用中播放的音乐输入频段数值。',
              '耳机厂商应用：如果耳机本身存储EQ，厂商应用中的EQ会作用于所有应用，这是最可靠的方法。',
              '耳机调节：AirPods和部分Beats可在辅助功能中强调某些音域，但不是按频段调节。',
            ],
          },
        ],
      },
      {
        heading: '6. 一览对比',
        blocks: [
          {
            type: 'table',
            head: ['平台', '软件', '费用', '适合人群'],
            rows: [
              ['Windows', 'Equalizer APO + Peace', '免费', '想原样输入精确数值'],
              ['Windows', 'FxSound', '免费', '只想简单改变听感'],
              ['Mac', 'eqMac', '基础免费', '需要系统级EQ'],
              ['Mac', 'SoundSource', '付费', '不同应用需要不同EQ'],
              ['Android', '内置均衡器', '免费', '不想安装、轻度使用'],
              ['Android', 'Wavelet', '基础免费', '想精细调整多个频段'],
              ['iPhone', '流媒体应用·厂商应用', '免费', '想把EQ保存在应用或耳机中'],
            ],
          },
          { type: 'p', text: '价格与功能会随更新变化，安装前请在官网或应用商店确认。请只从官方渠道下载软件。' },
        ],
      },
      {
        heading: '7. 选择时要确认的事项',
        blocks: [
          {
            type: 'list',
            items: [
              '前级增益：有提升的EQ容易削波，请确认是否有降低整体音量的前级增益功能。',
              '频段方式：10段图形EQ与可指定频率和Q值的参数EQ，迁移数值的方法不同。',
              '作用范围：确认是作用于整个系统、特定应用还是特定输出设备。',
              '延迟与耗电：如果游戏或通话有延迟感、耗电增加，请关闭EQ对比一下。',
            ],
          },
          { type: 'note', title: '不知道该输入什么数值？', text: '选好了软件却不知道输入什么数值，可以先用EQ FreeSet测试找到适合你耳机和耳朵的10段数值，再原样填入。' },
        ],
      },
    ],
  },
  ja: {
    title: '無料EQソフト・アプリのおすすめ',
    subtitle: 'Windows、Mac、Android、iPhoneで使えるイコライザーの選び方',
    intro: 'EQの値が決まったら、その値を入れるソフトが必要です。OSごとに標準搭載のEQのレベルが違い、アプリごとに適用範囲やバンド方式もさまざまです。この記事では、プラットフォーム別によく使われる無料、または無料で始められるEQソフトとアプリを整理し、選び方を説明します。値を実際に入力する手順は「機器別EQの適用方法」ガイドで扱っています。',
    sections: [
      {
        heading: '1. まず知っておきたいこと：EQがかかる場所',
        blocks: [
          { type: 'p', text: 'EQをどこにかけるかで適用範囲が変わります。同じ値でも、一部のアプリだけに適用されたり、イヤホンを別の機器につないでもそのまま維持されたりします。' },
          {
            type: 'table',
            head: ['場所', '適用範囲', '例'],
            rows: [
              ['システムEQ', '端末から出るほぼすべての音', 'Equalizer APO、Wavelet、Galaxy標準イコライザー'],
              ['アプリ内EQ', 'そのアプリで再生する音だけ', 'Spotify、Apple Music、一部の音楽プレーヤー'],
              ['イヤホン保存EQ', 'イヤホンをつないだすべての機器・アプリ', 'ソニー、サムスン、ゼンハイザーなどのメーカーアプリ'],
            ],
          },
          { type: 'note', title: 'EQは一か所だけ', text: 'システムEQ、アプリEQ、イヤホンEQを同時にオンにすると効果が重なります。一つに決めて、ほかはオフかフラットにしてください。' },
        ],
      },
      {
        heading: '2. Windows',
        blocks: [
          { type: 'p', text: 'Windowsにはすべての音に適用されるユーザーEQが標準ではありません。サウンドドライバーによってラウドネス等化のような効果がある程度なので、別のソフトを使うのが一般的です。' },
          {
            type: 'list',
            items: [
              'Equalizer APO：無料のオープンソースのシステムEQです。インストール時に選んだ出力デバイスにEQがかかり、パラメトリックEQとプリアンプに対応しているため最も精密に値を入れられます。設定はテキストファイルで管理します。',
              'Peace：Equalizer APO上で動く無料のGUIです。スライダーで調整でき、デバイスごとにプリセットを保存できるので、設定ファイルの編集が苦手な人に向いています。',
              'FxSound：インストールが簡単でプリセット中心の使いやすいソフトです。無料で使えますが、細かいパラメトリック設定より手軽さを重視しています。',
            ],
          },
          { type: 'p', text: '正確な値をそのまま入れたいならEqualizer APOとPeaceの組み合わせ、手軽に音の傾向だけ変えたいならFxSoundがおすすめです。Equalizer APOはインストール後に再起動が必要で、出力デバイスを変えたらそのデバイスにも設定し直す必要があります。' },
        ],
      },
      {
        heading: '3. Mac',
        blocks: [
          { type: 'p', text: 'macOSにもシステム全体のEQはありません。ミュージックアプリのEQはApple Musicの再生にだけ適用されます。ブラウザーやほかのアプリの音まで変えるには別のソフトが必要です。' },
          {
            type: 'list',
            items: [
              'eqMac：システムの音にEQをかけるオープンソースのソフトです。基本機能は無料で、高度な機能は有料版で提供されます。',
              'SoundSource：アプリごとに音量とEQを個別に設定できる有料ソフトです。アプリごとに違うEQが必要な場合やオーディオプラグインを使いたい場合に向いています。',
            ],
          },
          { type: 'p', text: 'macOSのアップデート直後は、システムオーディオドライバー方式のソフトが一時的に動かないことがあります。音が出ない場合はソフトを最新版に更新してください。' },
        ],
      },
      {
        heading: '4. Android',
        blocks: [
          { type: 'p', text: 'Galaxyをはじめ多くのAndroid端末は設定に標準イコライザーがあります。バンド数が少なかったりプリセット中心だったりするので、より精密に使いたいならシステムEQアプリを入れる方法があります。' },
          {
            type: 'list',
            items: [
              '標準イコライザー：インストール不要でバッテリー負担も少なめです。Galaxyでは設定 → サウンドとバイブ → 音質とエフェクトにあります。',
              'Wavelet：グラフィックEQとAutoEqベースの機器補正プロファイルを備えたアプリです。基本機能は無料で、一部機能は有料です。複数のアプリに同じEQをかけられます。',
              'プレーヤー内蔵EQ：特定の音楽プレーヤーだけにEQをかけたいなら、そのアプリのイコライザーを使うのが最も簡単です。',
            ],
          },
          { type: 'p', text: 'システムEQアプリは、メーカーやAndroidのバージョン、再生アプリによって一部のアプリに適用されないことがあります。適用されないアプリがあれば、EQアプリの互換モードや再生アプリの内蔵EQを確認してください。' },
        ],
      },
      {
        heading: '5. iPhone',
        blocks: [
          { type: 'p', text: 'iOSはほかのアプリの音を横取りしてEQをかける方式を認めていないため、すべてのアプリに適用されるユーザーEQアプリは事実上ありません。現実的には次の3つから選びます。' },
          {
            type: 'list',
            items: [
              'ストリーミングアプリのEQ：Spotifyのように設定にイコライザーがあるアプリなら、そのアプリで聴く音楽に帯域ごとの値を入れられます。',
              'イヤホンメーカーのアプリ：イヤホン本体にEQを保存する製品なら、メーカーアプリで設定したEQがすべてのアプリに適用されます。最も確実な方法です。',
              'ヘッドフォン調整：AirPodsと一部のBeatsはアクセシビリティのヘッドフォン調整で音域の強調を変えられます。帯域ごとの調整ではありません。',
            ],
          },
        ],
      },
      {
        heading: '6. ひと目で比較',
        blocks: [
          {
            type: 'table',
            head: ['プラットフォーム', 'ソフト', '費用', 'おすすめの人'],
            rows: [
              ['Windows', 'Equalizer APO + Peace', '無料', '正確な値をそのまま入れたい人'],
              ['Windows', 'FxSound', '無料', '手軽に傾向だけ変えたい人'],
              ['Mac', 'eqMac', '基本無料', 'システム全体のEQが必要な人'],
              ['Mac', 'SoundSource', '有料', 'アプリごとに違うEQが必要な人'],
              ['Android', '標準イコライザー', '無料', 'インストールせず軽く使いたい人'],
              ['Android', 'Wavelet', '基本無料', '複数の帯域を精密に合わせたい人'],
              ['iPhone', 'ストリーミング・メーカーアプリ', '無料', 'アプリやイヤホンにEQを保存したい人'],
            ],
          },
          { type: 'p', text: '価格や機能はアップデートで変わることがあるので、インストール前に公式サイトやアプリストアで確認してください。ソフトは公式の配布元からだけダウンロードするのが安全です。' },
        ],
      },
      {
        heading: '7. 選ぶときに確認すること',
        blocks: [
          {
            type: 'list',
            items: [
              'プリアンプ対応：ブーストのあるEQは音割れしやすいので、全体の音量を下げるプリアンプ機能があるか確認してください。',
              'バンド方式：10バンドのグラフィックEQか、周波数とQまで指定するパラメトリックEQかで値の移し方が変わります。',
              '適用範囲：システム全体、特定のアプリ、特定の出力デバイスのどこにかかるか確認してください。',
              '遅延とバッテリー：ゲームやビデオ通話で遅延を感じたり、バッテリー消費が増えたりしたら、EQをオフにして比べてみてください。',
            ],
          },
          { type: 'note', title: 'どんな値を入れればいいかわからないなら', text: 'ソフトを選んだものの入れる値がわからない場合は、EQ FreeSetのテストで自分のイヤホンと耳に合う10バンドの値を先に見つけ、そのまま入力すれば大丈夫です。' },
        ],
      },
    ],
  },
}

export default content
