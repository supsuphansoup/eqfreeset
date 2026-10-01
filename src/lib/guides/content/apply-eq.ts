import type { GuideContent } from '@/lib/guides'

const content: GuideContent = {
  ko: {
    title: '기기별 EQ 적용 방법',
    subtitle: '찾은 EQ 값을 스마트폰과 PC에 실제로 입력하는 법',
    intro: 'EQ 값을 찾았더라도 기기에 제대로 입력하지 않으면 의미가 없습니다. 그런데 EQ를 넣는 위치는 운영체제마다, 앱마다 다르고, 지원하는 밴드 수와 방식도 제각각입니다. 이 글에서는 그래픽 EQ와 파라메트릭 EQ의 차이부터 갤럭시, 아이폰, Windows, Mac에서 EQ를 적용하는 대표적인 방법, 그리고 소리가 찢어지는 클리핑을 막는 프리앰프 설정까지 순서대로 정리했습니다.',
    sections: [
      {
        heading: '1. 그래픽 EQ와 파라메트릭 EQ',
        blocks: [
          { type: 'p', text: 'EQ는 크게 두 종류로 나뉩니다. 대부분의 스마트폰 설정 화면에 있는 막대 슬라이더형 EQ가 그래픽 EQ(GEQ)이고, PC용 프로그램이나 일부 전문 앱에서 쓰는 방식이 파라메트릭 EQ(PEQ)입니다.' },
          {
            type: 'table',
            head: ['구분', '그래픽 EQ (GEQ)', '파라메트릭 EQ (PEQ)'],
            rows: [
              ['조절 항목', '정해진 주파수의 게인(dB)만 조절', '주파수, 게인, Q(폭)를 모두 지정'],
              ['장점', '직관적이고 거의 모든 기기에서 지원', '좁은 문제 구간만 정밀하게 보정 가능'],
              ['단점', '밴드 사이 구간을 세밀하게 다루기 어려움', '설정 항목이 많아 처음엔 어렵게 느껴짐'],
              ['주로 쓰는 곳', '스마트폰 기본 설정, 음악 앱', 'Equalizer APO, Wavelet, 일부 제조사 앱'],
            ],
          },
          { type: 'p', text: 'Q 값은 조절 범위의 폭을 뜻합니다. Q가 클수록 좁은 범위만, 작을수록 넓은 범위를 함께 움직입니다. 예를 들어 Q 0.7은 완만한 언덕처럼 넓게, Q 4는 뾰족한 산처럼 좁게 작용합니다. 특정 고음이 찌르는 문제처럼 좁은 구간을 다룰 때는 PEQ가 훨씬 정확합니다.' },
        ],
      },
      {
        heading: '2. 안드로이드 (갤럭시 포함)',
        blocks: [
          { type: 'p', text: '삼성 갤럭시는 기본 설정에 이퀄라이저가 들어 있습니다. 보통 설정 → 소리 및 진동 → 음질 및 음향 효과 → 이퀄라이저 경로에 있으며, 프리셋 대신 사용자 설정을 고르면 밴드별 슬라이더를 직접 움직일 수 있습니다. One UI 버전에 따라 메뉴 이름이나 밴드 수가 조금씩 다를 수 있습니다.' },
          { type: 'p', text: '기본 EQ보다 정밀하게 쓰고 싶다면 시스템 전체에 EQ를 적용하는 앱을 쓰는 방법이 있습니다. 대표적으로 Wavelet 같은 앱은 그래픽 EQ와 함께 AutoEq 기반 기기 보정 프로필을 지원해, 유튜브나 스트리밍 앱 등 대부분의 앱 소리에 같은 EQ를 걸 수 있습니다.' },
          {
            type: 'list',
            items: [
              '음향 효과 중복 끄기: Dolby Atmos, 적응형 사운드 같은 효과가 켜져 있으면 EQ 결과가 다르게 들릴 수 있으니 비교할 때는 꺼 두세요.',
              'EQ는 한 곳에서만: 시스템 EQ, 음악 앱 EQ, 이어폰 제조사 앱 EQ를 동시에 켜면 효과가 겹쳐 과해집니다.',
              '블루투스 이어폰 앱 확인: 일부 무선 이어폰은 이어폰 자체에 EQ를 저장하므로, 제조사 앱 EQ가 기본값인지 먼저 확인하세요.',
            ],
          },
        ],
      },
      {
        heading: '3. 아이폰 (iOS)',
        blocks: [
          { type: 'p', text: 'iOS에는 모든 앱에 적용되는 사용자 지정 EQ가 없습니다. 설정 → 앱 → 음악에 있는 EQ는 Apple Music 재생에만 적용되며, 정해진 프리셋 중에서 고르는 방식입니다. 그래서 아이폰에서는 아래 방법 중 하나를 고르는 것이 현실적입니다.' },
          {
            type: 'list',
            items: [
              '스트리밍 앱 내장 EQ: Spotify처럼 앱 설정에 자체 이퀄라이저가 있는 경우, 해당 앱에서 듣는 음악에 밴드별 값을 넣을 수 있습니다.',
              '이어폰 제조사 앱: 소니, 젠하이저, 앤커(사운드코어) 등 많은 브랜드가 iOS용 앱에서 커스텀 EQ를 제공하며, 설정이 이어폰에 저장되어 모든 앱에 적용되는 경우가 많습니다.',
              '헤드폰 조절(손쉬운 사용): AirPods와 일부 Beats 제품은 설정 → 손쉬운 사용 → 오디오 및 시각 → 헤드폰 조절에서 음역대 강조를 조정할 수 있습니다. 밴드별 조절은 아니지만 고음 선명도를 보완하는 데 도움이 됩니다.',
            ],
          },
          { type: 'note', title: '밴드 수가 다를 때', text: '앱이 지원하는 밴드가 EQ FreeSet 결과의 10밴드와 다르면, 가장 가까운 주파수의 슬라이더에 값을 넣고 사이 대역은 양옆 값의 중간 정도로 맞추면 됩니다. 1dB 이하의 작은 차이는 대부분 체감되지 않으니 지나치게 정확하게 맞추려 하지 않아도 됩니다.' },
        ],
      },
      {
        heading: '4. Windows PC',
        blocks: [
          { type: 'p', text: 'Windows에서 가장 널리 쓰이는 무료 도구는 Equalizer APO입니다. 설치할 때 EQ를 적용할 출력 장치(헤드폰, USB DAC 등)를 고르면 시스템 전체 소리에 EQ가 걸립니다. 설정 파일을 직접 편집하거나, Peace 같은 GUI 확장을 함께 설치해 화면에서 조절할 수 있습니다.' },
          { type: 'p', text: '파라메트릭 EQ 값은 아래처럼 한 줄에 필터 하나씩 입력합니다. 첫 줄의 Preamp는 전체 음량을 미리 낮춰 클리핑을 막는 값입니다.' },
          {
            type: 'list',
            items: [
              '예시 1: Preamp: -4 dB',
              '예시 2: Filter 1: ON PK Fc 105 Hz Gain 3.5 dB Q 0.70',
              '예시 3: Filter 2: ON PK Fc 3200 Hz Gain -2.0 dB Q 2.00',
            ],
          },
          { type: 'p', text: 'PK는 피킹(종 모양) 필터, Fc는 중심 주파수, Gain은 올리거나 내릴 양, Q는 폭을 뜻합니다. 저음 전체를 올릴 때는 PK 대신 LSC(로우 셸프) 필터를 쓰기도 합니다.' },
        ],
      },
      {
        heading: '5. Mac (macOS)',
        blocks: [
          { type: 'p', text: 'macOS도 시스템 전체에 적용되는 기본 EQ가 없어서 별도 앱이 필요합니다. eqMac처럼 무료 기능이 있는 앱이나 SoundSource 같은 유료 앱이 대표적이며, 앱마다 그래픽 EQ만 지원하는지 파라메트릭 EQ까지 지원하는지가 다릅니다. 설치 후 출력 장치를 이어폰이나 헤드폰으로 지정했는지 꼭 확인하세요.' },
        ],
      },
      {
        heading: '6. 클리핑을 막는 프리앰프 설정',
        blocks: [
          { type: 'p', text: '디지털 오디오에는 넘을 수 없는 최대 음량(0dBFS)이 있습니다. 이미 크게 녹음된 음악에서 특정 대역을 +5dB 올리면 그 부분이 한계를 넘어 잘려 나가고, 지글거리거나 찢어지는 소리가 납니다. 이것을 클리핑이라고 합니다.' },
          {
            type: 'list',
            items: [
              '기본 원칙: EQ에서 가장 많이 올린 값만큼 프리앰프(또는 전체 게인)를 낮춥니다. 최대 부스트가 +5dB라면 프리앰프를 -5dB로 설정합니다.',
              '볼륨은 기기에서 보충: 프리앰프를 낮추면 전체 소리가 작아지므로 휴대폰이나 PC 볼륨을 조금 올려 맞추면 됩니다.',
              '올리기보다 깎기: 저음을 강조하고 싶다면 저음을 올리는 대신 중고음을 조금 낮추는 방식이 같은 효과를 더 깨끗하게 냅니다.',
            ],
          },
          { type: 'note', title: '프리앰프 설정이 없는 기기라면', text: '스마트폰 기본 EQ처럼 프리앰프 항목이 없다면 모든 밴드를 같은 값만큼 함께 내려서 최댓값이 0dB 근처가 되도록 맞추는 방법을 쓸 수 있습니다. 상대적인 모양은 그대로이므로 음색은 유지되고 클리핑 위험만 줄어듭니다.' },
        ],
      },
    ],
  },
  en: {
    title: 'How to Apply EQ on Your Device',
    subtitle: 'Getting your EQ values into your phone and computer',
    intro: 'Finding the right EQ values only helps if you can actually enter them on your device. Where EQ lives differs by operating system and app, and so do the number of bands and the type of EQ. This guide walks through the difference between graphic and parametric EQ, the most common ways to apply EQ on Galaxy, iPhone, Windows and Mac, and how to set the preamp so your music does not clip.',
    sections: [
      {
        heading: '1. Graphic EQ vs Parametric EQ',
        blocks: [
          { type: 'p', text: 'There are two main kinds of EQ. The slider-style EQ found in most phone settings is a graphic EQ (GEQ). The kind used in PC tools and some advanced apps is a parametric EQ (PEQ).' },
          {
            type: 'table',
            head: ['', 'Graphic EQ (GEQ)', 'Parametric EQ (PEQ)'],
            rows: [
              ['What you control', 'Gain (dB) at fixed frequencies', 'Frequency, gain and Q (width)'],
              ['Strength', 'Intuitive, supported almost everywhere', 'Can precisely fix a narrow problem area'],
              ['Weakness', 'Hard to shape the space between bands', 'More settings, feels harder at first'],
              ['Typical use', 'Phone settings, music apps', 'Equalizer APO, Wavelet, some brand apps'],
            ],
          },
          { type: 'p', text: 'Q describes how wide the adjustment is. A higher Q affects a narrower range; a lower Q moves a wider range together. Q 0.7 acts like a gentle hill, while Q 4 acts like a sharp peak. For problems like one piercing treble frequency, PEQ is far more accurate.' },
        ],
      },
      {
        heading: '2. Android (including Galaxy)',
        blocks: [
          { type: 'p', text: 'Samsung Galaxy phones include an equalizer in the system settings, usually under Settings → Sounds and vibration → Sound quality and effects → Equalizer. Choosing Custom instead of a preset lets you move each band slider yourself. Menu names and the number of bands may vary slightly between One UI versions.' },
          { type: 'p', text: 'For finer control, you can use an app that applies EQ system-wide. Apps such as Wavelet offer a graphic EQ along with AutoEq-based device correction profiles, so the same EQ applies to most apps including YouTube and streaming services.' },
          {
            type: 'list',
            items: [
              'Turn off overlapping effects: Dolby Atmos or adaptive sound features can change how the EQ sounds, so switch them off while comparing.',
              'Use EQ in one place only: Running system EQ, a music app EQ and an earphone brand app EQ at once stacks the effects and overdoes it.',
              'Check your earphone app: Some wireless earphones store EQ on the earbuds themselves, so make sure the brand app EQ is set to default first.',
            ],
          },
        ],
      },
      {
        heading: '3. iPhone (iOS)',
        blocks: [
          { type: 'p', text: 'iOS has no custom EQ that applies to every app. The EQ under Settings → Apps → Music only affects Apple Music playback and only offers fixed presets. On iPhone, one of the following is usually the practical option.' },
          {
            type: 'list',
            items: [
              'Streaming app EQ: Apps such as Spotify have their own equalizer in settings, letting you enter band values for music played in that app.',
              'Earphone brand apps: Many brands, including Sony, Sennheiser and Anker (Soundcore), offer custom EQ in their iOS apps, often saved to the earphones so it applies to every app.',
              'Headphone Accommodations: AirPods and some Beats products can adjust tonal emphasis under Settings → Accessibility → Audio & Visual → Headphone Accommodations. It is not band-by-band, but it can help with treble clarity.',
            ],
          },
          { type: 'note', title: 'When the number of bands differs', text: 'If your app has different bands from the 10-band EQ FreeSet result, put each value on the closest frequency slider and set in-between bands roughly halfway between their neighbors. Differences under 1 dB are rarely noticeable, so there is no need to be overly precise.' },
        ],
      },
      {
        heading: '4. Windows PC',
        blocks: [
          { type: 'p', text: 'The most widely used free tool on Windows is Equalizer APO. During installation you choose the output device (headphones, USB DAC, etc.), and the EQ then applies to all system audio. You can edit the configuration file directly or install a GUI add-on such as Peace to adjust it on screen.' },
          { type: 'p', text: 'Parametric EQ values are entered one filter per line, as shown below. The Preamp line lowers overall level in advance to prevent clipping.' },
          {
            type: 'list',
            items: [
              'Example 1: Preamp: -4 dB',
              'Example 2: Filter 1: ON PK Fc 105 Hz Gain 3.5 dB Q 0.70',
              'Example 3: Filter 2: ON PK Fc 3200 Hz Gain -2.0 dB Q 2.00',
            ],
          },
          { type: 'p', text: 'PK is a peaking (bell-shaped) filter, Fc is the center frequency, Gain is how much to boost or cut, and Q is the width. To lift the whole bass region, an LSC (low shelf) filter is sometimes used instead of PK.' },
        ],
      },
      {
        heading: '5. Mac (macOS)',
        blocks: [
          { type: 'p', text: 'macOS also lacks a built-in system-wide EQ, so you need a separate app. Common choices include eqMac, which has free features, and paid apps such as SoundSource. Apps differ in whether they support only graphic EQ or parametric EQ as well. After installing, make sure the output device is set to your earphones or headphones.' },
        ],
      },
      {
        heading: '6. Setting the Preamp to Prevent Clipping',
        blocks: [
          { type: 'p', text: 'Digital audio has a hard maximum level (0 dBFS). If you boost a band by +5 dB on music that is already mastered loud, that part exceeds the limit and gets cut off, producing a crackling or harsh sound. This is called clipping.' },
          {
            type: 'list',
            items: [
              'Basic rule: Lower the preamp (or overall gain) by the largest boost in your EQ. If the maximum boost is +5 dB, set the preamp to -5 dB.',
              'Make up volume on the device: Lowering the preamp makes everything quieter, so raise your phone or PC volume slightly to compensate.',
              'Cut rather than boost: To emphasize bass, cutting the mids and treble slightly achieves the same balance more cleanly than boosting the bass.',
            ],
          },
          { type: 'note', title: 'If your device has no preamp setting', text: 'If there is no preamp option, as with most built-in phone EQs, lower all bands by the same amount so the highest value sits near 0 dB. The relative shape stays the same, so the tonal balance is preserved while the risk of clipping drops.' },
        ],
      },
    ],
  },
  zh: {
    title: '各设备EQ设置方法',
    subtitle: '把找到的EQ数值真正输入到手机和电脑中',
    intro: '即使找到了合适的EQ数值，如果不能正确输入到设备中也没有意义。EQ的设置位置因操作系统和应用而异，支持的频段数量和EQ类型也各不相同。本文依次介绍图示EQ与参数EQ的区别、在Galaxy、iPhone、Windows和Mac上应用EQ的常见方法，以及防止声音削波失真的前级增益设置。',
    sections: [
      {
        heading: '1. 图示EQ与参数EQ',
        blocks: [
          { type: 'p', text: 'EQ主要分为两类。大多数手机设置中的滑块式EQ是图示EQ（GEQ），而电脑软件和部分专业应用使用的是参数EQ（PEQ）。' },
          {
            type: 'table',
            head: ['', '图示EQ（GEQ）', '参数EQ（PEQ）'],
            rows: [
              ['可调项目', '仅调整固定频率的增益（dB）', '可指定频率、增益和Q值（宽度）'],
              ['优点', '直观，几乎所有设备都支持', '可精确修正狭窄的问题频段'],
              ['缺点', '难以细致处理频段之间的区域', '参数较多，初学时感觉较难'],
              ['常见场景', '手机系统设置、音乐应用', 'Equalizer APO、Wavelet、部分品牌应用'],
            ],
          },
          { type: 'p', text: 'Q值表示调整范围的宽度。Q值越大，作用范围越窄；越小，则同时影响越宽的范围。例如Q 0.7像平缓的小山，Q 4则像尖锐的山峰。处理某个刺耳高频这类窄范围问题时，参数EQ要准确得多。' },
        ],
      },
      {
        heading: '2. 安卓（含Galaxy）',
        blocks: [
          { type: 'p', text: '三星Galaxy手机的系统设置中自带均衡器，通常位于 设置 → 声音和振动 → 音质和音效 → 均衡器。选择“自定义”而非预设，即可逐个调整频段滑块。不同One UI版本的菜单名称和频段数量可能略有不同。' },
          { type: 'p', text: '如果想要更精细的控制，可以使用对整个系统生效的EQ应用。例如Wavelet等应用除图示EQ外，还支持基于AutoEq的设备校正配置，可让YouTube和流媒体等大多数应用使用同一套EQ。' },
          {
            type: 'list',
            items: [
              '关闭重叠音效：开启杜比全景声或自适应音效时，EQ听感可能不同，对比时请先关闭。',
              'EQ只在一处设置：同时开启系统EQ、音乐应用EQ和耳机品牌应用EQ，效果会叠加而过度。',
              '检查耳机应用：部分无线耳机会把EQ保存在耳机内，请先确认品牌应用的EQ是否为默认。',
            ],
          },
        ],
      },
      {
        heading: '3. iPhone（iOS）',
        blocks: [
          { type: 'p', text: 'iOS没有适用于所有应用的自定义EQ。设置 → App → 音乐 中的EQ只对Apple Music播放生效，且只能从固定预设中选择。因此在iPhone上，通常选择以下方法之一比较现实。' },
          {
            type: 'list',
            items: [
              '流媒体应用内置EQ：Spotify等应用在设置中自带均衡器，可为该应用中播放的音乐输入各频段数值。',
              '耳机品牌应用：索尼、森海塞尔、Anker（Soundcore）等许多品牌在iOS应用中提供自定义EQ，设置通常保存在耳机中，对所有应用生效。',
              '耳机调节（辅助功能）：AirPods及部分Beats产品可在 设置 → 辅助功能 → 音频与视觉 → 耳机调节 中调整声音侧重。虽不能逐频段调整，但有助于提升高频清晰度。',
            ],
          },
          { type: 'note', title: '频段数量不同时', text: '如果应用的频段与EQ FreeSet结果的10个频段不同，把数值填到最接近频率的滑块上，中间频段大致取两侧数值的中间值即可。1dB以下的差异通常听不出来，无需过分追求精确。' },
        ],
      },
      {
        heading: '4. Windows电脑',
        blocks: [
          { type: 'p', text: 'Windows上最常用的免费工具是Equalizer APO。安装时选择要应用EQ的输出设备（耳机、USB DAC等），之后EQ就会作用于整个系统的声音。可以直接编辑配置文件，也可以安装Peace等图形界面扩展在屏幕上调整。' },
          { type: 'p', text: '参数EQ数值按每行一个滤波器输入，如下所示。第一行的Preamp用于预先降低整体音量以防止削波。' },
          {
            type: 'list',
            items: [
              '示例1：Preamp: -4 dB',
              '示例2：Filter 1: ON PK Fc 105 Hz Gain 3.5 dB Q 0.70',
              '示例3：Filter 2: ON PK Fc 3200 Hz Gain -2.0 dB Q 2.00',
            ],
          },
          { type: 'p', text: 'PK表示峰值（钟形）滤波器，Fc为中心频率，Gain为提升或衰减量，Q为宽度。若要整体提升低频，有时会用LSC（低架）滤波器代替PK。' },
        ],
      },
      {
        heading: '5. Mac（macOS）',
        blocks: [
          { type: 'p', text: 'macOS同样没有系统级的内置EQ，需要另外安装应用。常见选择有提供免费功能的eqMac，以及SoundSource等付费应用。各应用支持的是仅图示EQ还是包括参数EQ也不尽相同。安装后请务必确认输出设备已设为你的耳机。' },
        ],
      },
      {
        heading: '6. 防止削波的前级增益设置',
        blocks: [
          { type: 'p', text: '数字音频存在无法超越的最大电平（0dBFS）。如果在本已响度很高的音乐上把某个频段提升+5dB，该部分就会超出上限被截断，产生噼啪声或撕裂感，这就是削波。' },
          {
            type: 'list',
            items: [
              '基本原则：EQ中提升最多的数值是多少，就把前级增益（或整体增益）降低多少。最大提升为+5dB时，前级设为-5dB。',
              '用设备音量补偿：降低前级后整体声音变小，适当调高手机或电脑音量即可。',
              '多衰减少提升：想强调低频时，略微降低中高频比直接提升低频能更干净地达到同样效果。',
            ],
          },
          { type: 'note', title: '设备没有前级设置时', text: '如果像大多数手机自带EQ一样没有前级选项，可以把所有频段同时降低相同数值，使最大值接近0dB。曲线的相对形状不变，音色得以保留，而削波风险会降低。' },
        ],
      },
    ],
  },
  ja: {
    title: 'デバイス別EQの適用方法',
    subtitle: '見つけたEQ値をスマホとPCに実際に入力する方法',
    intro: 'EQ値を見つけても、デバイスに正しく入力できなければ意味がありません。EQを設定する場所はOSやアプリによって異なり、対応するバンド数やEQの方式もさまざまです。この記事では、グラフィックEQとパラメトリックEQの違いから、Galaxy、iPhone、Windows、MacでEQを適用する代表的な方法、そして音割れ（クリッピング）を防ぐプリアンプ設定までを順に説明します。',
    sections: [
      {
        heading: '1. グラフィックEQとパラメトリックEQ',
        blocks: [
          { type: 'p', text: 'EQは大きく2種類に分かれます。多くのスマホの設定画面にあるスライダー型のEQがグラフィックEQ（GEQ）で、PC用ソフトや一部の専門アプリで使われるのがパラメトリックEQ（PEQ）です。' },
          {
            type: 'table',
            head: ['', 'グラフィックEQ（GEQ）', 'パラメトリックEQ（PEQ）'],
            rows: [
              ['調整項目', '決まった周波数のゲイン（dB）のみ', '周波数・ゲイン・Q（幅）をすべて指定'],
              ['長所', '直感的でほぼすべての機器が対応', '狭い問題箇所だけを精密に補正できる'],
              ['短所', 'バンド間の細かい調整が難しい', '設定項目が多く最初は難しく感じる'],
              ['主な用途', 'スマホの標準設定、音楽アプリ', 'Equalizer APO、Wavelet、一部メーカーアプリ'],
            ],
          },
          { type: 'p', text: 'Q値は調整範囲の幅を表します。Qが大きいほど狭い範囲だけ、小さいほど広い範囲がまとめて動きます。たとえばQ 0.7はなだらかな丘のように広く、Q 4は尖った山のように狭く作用します。特定の高音が刺さるような狭い範囲の問題には、PEQのほうがはるかに正確です。' },
        ],
      },
      {
        heading: '2. Android（Galaxyを含む）',
        blocks: [
          { type: 'p', text: 'Samsung Galaxyには標準設定にイコライザーがあり、通常は 設定 → サウンドとバイブ → 音質とエフェクト → イコライザー にあります。プリセットではなく「カスタム」を選ぶと、各バンドのスライダーを自分で動かせます。One UIのバージョンによってメニュー名やバンド数が多少異なる場合があります。' },
          { type: 'p', text: 'より細かく調整したい場合は、システム全体にEQをかけるアプリを使う方法があります。代表的なWaveletなどのアプリは、グラフィックEQに加えてAutoEqベースのデバイス補正プロファイルに対応しており、YouTubeやストリーミングなどほとんどのアプリに同じEQを適用できます。' },
          {
            type: 'list',
            items: [
              '重複するエフェクトをオフに：Dolby Atmosや適応サウンドがオンだとEQの聞こえ方が変わるため、比較するときはオフにしてください。',
              'EQは1か所だけで：システムEQ、音楽アプリのEQ、イヤホンメーカーアプリのEQを同時に使うと効果が重なり過剰になります。',
              'イヤホンアプリを確認：一部のワイヤレスイヤホンはEQをイヤホン本体に保存するため、まずメーカーアプリのEQが初期値か確認しましょう。',
            ],
          },
        ],
      },
      {
        heading: '3. iPhone（iOS）',
        blocks: [
          { type: 'p', text: 'iOSにはすべてのアプリに適用できるカスタムEQがありません。設定 → アプリ → ミュージック にあるEQはApple Musicの再生にのみ適用され、決まったプリセットから選ぶ方式です。そのためiPhoneでは、次のいずれかを選ぶのが現実的です。' },
          {
            type: 'list',
            items: [
              'ストリーミングアプリ内蔵EQ：Spotifyのように設定に独自のイコライザーがあるアプリなら、そのアプリで聴く音楽にバンドごとの値を入力できます。',
              'イヤホンメーカーのアプリ：ソニー、ゼンハイザー、Anker（Soundcore）など多くのブランドがiOSアプリでカスタムEQを提供しており、設定がイヤホンに保存されてすべてのアプリに適用されることが多いです。',
              'ヘッドフォン調整（アクセシビリティ）：AirPodsと一部のBeats製品は 設定 → アクセシビリティ → オーディオとビジュアル → ヘッドフォン調整 で音域の強調を調整できます。バンドごとの調整ではありませんが、高音の明瞭さを補うのに役立ちます。',
            ],
          },
          { type: 'note', title: 'バンド数が違う場合', text: 'アプリのバンドがEQ FreeSetの10バンドと異なる場合は、最も近い周波数のスライダーに値を入れ、間の帯域は両隣の値の中間くらいに合わせればOKです。1dB以下の差はほとんど体感できないので、厳密に合わせすぎる必要はありません。' },
        ],
      },
      {
        heading: '4. Windows PC',
        blocks: [
          { type: 'p', text: 'Windowsで最も広く使われている無料ツールはEqualizer APOです。インストール時にEQを適用する出力デバイス（ヘッドホン、USB DACなど）を選ぶと、システム全体の音にEQがかかります。設定ファイルを直接編集するか、PeaceなどのGUI拡張を一緒に入れて画面上で調整できます。' },
          { type: 'p', text: 'パラメトリックEQの値は、次のように1行に1つのフィルターを入力します。最初の行のPreampは、クリッピングを防ぐためにあらかじめ全体の音量を下げる値です。' },
          {
            type: 'list',
            items: [
              '例1：Preamp: -4 dB',
              '例2：Filter 1: ON PK Fc 105 Hz Gain 3.5 dB Q 0.70',
              '例3：Filter 2: ON PK Fc 3200 Hz Gain -2.0 dB Q 2.00',
            ],
          },
          { type: 'p', text: 'PKはピーキング（ベル型）フィルター、Fcは中心周波数、Gainは上げ下げする量、Qは幅を意味します。低音全体を持ち上げるときは、PKの代わりにLSC（ローシェルフ）フィルターを使うこともあります。' },
        ],
      },
      {
        heading: '5. Mac（macOS）',
        blocks: [
          { type: 'p', text: 'macOSにもシステム全体に適用される標準EQがないため、別途アプリが必要です。無料機能のあるeqMacや、有料のSoundSourceなどが代表的で、グラフィックEQのみか、パラメトリックEQにも対応するかはアプリによって異なります。インストール後、出力デバイスがイヤホンやヘッドホンになっているか必ず確認してください。' },
        ],
      },
      {
        heading: '6. クリッピングを防ぐプリアンプ設定',
        blocks: [
          { type: 'p', text: 'デジタルオーディオには超えられない最大レベル（0dBFS）があります。すでに大きな音量で制作された音楽で特定の帯域を+5dB上げると、その部分が上限を超えて切り取られ、ジリジリした音や割れた音になります。これがクリッピングです。' },
          {
            type: 'list',
            items: [
              '基本ルール：EQで最も大きく上げた値の分だけプリアンプ（または全体ゲイン）を下げます。最大ブーストが+5dBならプリアンプは-5dBにします。',
              '音量はデバイスで補う：プリアンプを下げると全体が小さくなるので、スマホやPCの音量を少し上げて合わせます。',
              '上げるより削る：低音を強調したいなら、低音を上げる代わりに中高音を少し下げるほうが、同じバランスをよりクリアに実現できます。',
            ],
          },
          { type: 'note', title: 'プリアンプ設定がないデバイスの場合', text: 'スマホ標準のEQのようにプリアンプ項目がない場合は、すべてのバンドを同じ量だけ下げて最大値が0dB付近になるように調整する方法があります。相対的な形は変わらないので音色は保たれ、クリッピングのリスクだけが減ります。' },
        ],
      },
    ],
  },
}

export default content
