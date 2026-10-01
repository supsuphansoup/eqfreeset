import type { GuideContent } from '@/lib/guides'

const content: GuideContent = {
  ko: {
    title: '블루투스 코덱 비교 (SBC·AAC·aptX·LDAC)',
    subtitle: '무선 이어폰의 음질과 지연을 결정하는 코덱, 얼마나 중요할까',
    intro: '무선 이어폰은 휴대폰에서 음악을 그대로 보내는 것이 아니라, 블루투스로 보낼 수 있을 만큼 압축해서 전송합니다. 이때 쓰이는 압축 방식이 코덱입니다. 제품 상자에 적힌 aptX, LDAC 같은 이름이 바로 이것입니다. 이 글에서는 주요 코덱의 특징과 차이, 내 기기에서 어떤 코덱이 쓰이는지 확인하는 방법, 그리고 코덱이 실제 체감 음질에서 차지하는 비중을 정리했습니다.',
    sections: [
      {
        heading: '1. 코덱이 하는 일',
        blocks: [
          { type: 'p', text: 'CD 음질의 무손실 음악은 초당 약 1,411kbps의 데이터가 필요합니다. 일반적인 블루투스 오디오 연결로는 이 양을 안정적으로 보내기 어려워서, 사람이 잘 느끼지 못하는 정보를 덜어 내는 손실 압축을 거칩니다. 압축을 얼마나 효율적으로 하느냐, 그리고 데이터를 얼마나 많이 보낼 수 있느냐에 따라 음질과 연결 안정성, 지연 시간이 달라집니다.' },
          { type: 'p', text: '코덱은 휴대폰과 이어폰이 모두 지원해야 쓸 수 있습니다. 한쪽만 LDAC를 지원하면 둘 다 지원하는 다른 코덱, 보통 AAC나 SBC로 자동 연결됩니다.' },
        ],
      },
      {
        heading: '2. 주요 코덱 비교',
        blocks: [
          {
            type: 'table',
            head: ['코덱', '최대 전송률', '특징'],
            rows: [
              ['SBC', '약 328kbps', '모든 블루투스 오디오 기기가 지원하는 기본 코덱. 구현 품질에 따라 편차가 큼'],
              ['AAC', '약 256kbps', '애플 기기에서 품질이 안정적. 안드로이드는 기기별로 인코딩 품질 차이가 있음'],
              ['aptX', '352~384kbps', '퀄컴 코덱. 16비트, 비교적 낮은 지연'],
              ['aptX HD', '576kbps', '24비트/48kHz 지원'],
              ['aptX Adaptive', '약 279~420kbps', '전파 환경에 따라 전송률을 자동 조절. 지원 칩에서 무손실 모드 제공'],
              ['LDAC', '330/660/990kbps', '소니 코덱. 최대 24비트/96kHz. 고전송률은 혼잡한 환경에서 끊기기 쉬움'],
              ['LC3', '가변', 'LE Audio의 표준 코덱. 낮은 전송률에서도 효율이 좋고 전력 소모가 적음'],
            ],
          },
          { type: 'p', text: '삼성 갤럭시 버즈를 갤럭시 휴대폰과 함께 쓰면 삼성 자체 코덱이 쓰이는 등, 제조사 생태계 안에서만 동작하는 코덱도 있습니다.' },
        ],
      },
      {
        heading: '3. 아이폰과 안드로이드의 차이',
        blocks: [
          {
            type: 'list',
            items: [
              '아이폰: 블루투스 오디오는 AAC와 SBC만 지원합니다. 이어폰이 LDAC나 aptX를 지원해도 아이폰에서는 AAC로 연결됩니다. 대신 애플의 AAC 인코더 품질이 좋아 실사용 음질은 안정적인 편입니다.',
              '안드로이드: 기기에 따라 AAC, aptX 계열, LDAC 등을 폭넓게 지원합니다. 같은 코덱이라도 휴대폰 칩셋과 설정에 따라 실제 전송률이 달라질 수 있습니다.',
            ],
          },
          { type: 'note', title: '안드로이드에서 현재 코덱 확인하기', text: '설정 → 휴대전화 정보 → 소프트웨어 정보에서 빌드 번호를 일곱 번 누르면 개발자 옵션이 열립니다. 이어폰을 연결한 상태에서 개발자 옵션의 블루투스 오디오 코덱 항목을 보면 현재 쓰이는 코덱을 확인할 수 있고, LDAC는 같은 메뉴에서 전송 품질 모드도 볼 수 있습니다. 메뉴 위치는 제조사마다 조금 다를 수 있습니다.' },
        ],
      },
      {
        heading: '4. 지연 시간과 영상·게임',
        blocks: [
          { type: 'p', text: '블루투스 오디오는 압축, 전송, 해제 과정 때문에 보통 0.1~0.3초 정도 늦게 들립니다. 유튜브나 넷플릭스 같은 영상 앱은 이 지연만큼 화면을 맞춰 주기 때문에 대부분 어긋남을 느끼지 못합니다. 반면 게임이나 악기 연주 앱은 입력에 즉시 반응해야 해서 지연이 그대로 드러납니다.' },
          {
            type: 'list',
            items: [
              '게임 모드 활용: 많은 무선 이어폰이 지연을 줄이는 게임 모드를 제공합니다. 대신 연결 안정성이나 음질이 조금 낮아질 수 있습니다.',
              '저지연 코덱: aptX Adaptive나 LE Audio(LC3)를 양쪽 기기가 지원하면 지연이 줄어드는 경우가 많습니다.',
              '리듬 게임과 연주: 지연에 민감한 용도라면 유선 이어폰이 가장 확실합니다.',
            ],
          },
        ],
      },
      {
        heading: '5. 코덱은 음질에서 얼마나 중요할까',
        blocks: [
          { type: 'p', text: '전송률이 높은 코덱이 이론적으로 더 많은 정보를 담는 것은 사실입니다. 하지만 일반적인 청취 환경에서 AAC나 aptX와 고전송률 LDAC를 블라인드로 구분하기는 생각보다 어렵다는 경험담이 많습니다. 스트리밍 음원 자체가 이미 손실 압축된 경우도 많고, 지하철이나 거리처럼 소음이 있는 곳에서는 미세한 차이가 더 묻힙니다.' },
          { type: 'p', text: '반면 이어폰의 주파수 응답, 이어팁 착용 상태, EQ는 누구나 바로 느낄 수 있을 만큼 소리를 크게 바꿉니다. 그래서 체감 음질을 높이고 싶다면 코덱보다 착용감과 차폐를 먼저 점검하고, 내 귀에 맞는 EQ를 찾는 것이 훨씬 효과적입니다. 코덱은 연결이 자주 끊기지 않는 선에서 가능한 좋은 것을 고르면 충분합니다.' },
        ],
      },
    ],
  },
  en: {
    title: 'Bluetooth Codecs Compared (SBC, AAC, aptX, LDAC)',
    subtitle: 'The codec decides wireless sound quality and latency, but how much does it matter?',
    intro: 'Wireless earphones do not receive music from your phone as is. The audio is compressed enough to fit over Bluetooth, and the method used for that is the codec. Names printed on the box such as aptX or LDAC refer to it. This guide covers the main codecs and how they differ, how to check which codec your device is using, and how much the codec actually contributes to the sound quality you hear.',
    sections: [
      {
        heading: '1. What a Codec Does',
        blocks: [
          { type: 'p', text: 'CD-quality lossless music needs about 1,411 kbps of data. A typical Bluetooth audio link cannot carry that reliably, so the audio goes through lossy compression that removes information people are less likely to notice. How efficiently the codec compresses, and how much data it can send, determines sound quality, connection stability and latency.' },
          { type: 'p', text: 'Both the phone and the earphones must support a codec to use it. If only one side supports LDAC, they automatically connect with another codec both support, usually AAC or SBC.' },
        ],
      },
      {
        heading: '2. Main Codecs Compared',
        blocks: [
          {
            type: 'table',
            head: ['Codec', 'Max bitrate', 'Notes'],
            rows: [
              ['SBC', '~328 kbps', 'The baseline codec every Bluetooth audio device supports. Quality varies widely by implementation'],
              ['AAC', '~256 kbps', 'Consistent quality on Apple devices. Encoder quality varies across Android phones'],
              ['aptX', '352–384 kbps', 'Qualcomm codec. 16-bit, relatively low latency'],
              ['aptX HD', '576 kbps', 'Supports 24-bit/48 kHz'],
              ['aptX Adaptive', '~279–420 kbps', 'Adjusts bitrate to radio conditions. Lossless mode on supported chips'],
              ['LDAC', '330/660/990 kbps', 'Sony codec. Up to 24-bit/96 kHz. High bitrates drop out easily in crowded environments'],
              ['LC3', 'Variable', 'Standard codec for LE Audio. Efficient at low bitrates with low power use'],
            ],
          },
          { type: 'p', text: 'Some codecs only work within a brand ecosystem. For example, Samsung Galaxy Buds paired with a Galaxy phone can use Samsung’s own codec.' },
        ],
      },
      {
        heading: '3. iPhone vs Android',
        blocks: [
          {
            type: 'list',
            items: [
              'iPhone: Bluetooth audio supports only AAC and SBC. Even if your earphones support LDAC or aptX, an iPhone connects with AAC. Apple’s AAC encoder is good, so real-world quality is consistent.',
              'Android: Depending on the phone, AAC, the aptX family and LDAC are widely supported. Even with the same codec, the actual bitrate can vary with the phone’s chipset and settings.',
            ],
          },
          { type: 'note', title: 'Checking the current codec on Android', text: 'Go to Settings → About phone → Software information and tap Build number seven times to unlock Developer options. With your earphones connected, the Bluetooth audio codec entry in Developer options shows which codec is in use, and for LDAC the same menu shows the playback quality mode. Menu locations differ slightly between manufacturers.' },
        ],
      },
      {
        heading: '4. Latency, Video and Games',
        blocks: [
          { type: 'p', text: 'Because of compression, transmission and decoding, Bluetooth audio usually arrives about 0.1 to 0.3 seconds late. Video apps such as YouTube and Netflix shift the picture to match, so most people never notice. Games and music-making apps must respond to input instantly, so the delay shows.' },
          {
            type: 'list',
            items: [
              'Use game mode: Many wireless earphones offer a low-latency game mode, sometimes at a small cost to stability or sound quality.',
              'Low-latency codecs: When both devices support aptX Adaptive or LE Audio (LC3), latency is often lower.',
              'Rhythm games and playing music: For latency-sensitive uses, wired earphones remain the most reliable choice.',
            ],
          },
        ],
      },
      {
        heading: '5. How Much Does the Codec Matter?',
        blocks: [
          { type: 'p', text: 'It is true that higher-bitrate codecs can carry more information in theory. In everyday listening, however, many people report that telling AAC or aptX apart from high-bitrate LDAC in a blind test is harder than expected. Streaming audio is often already lossy, and in noisy places like the subway or street, subtle differences are masked even further.' },
          { type: 'p', text: 'By contrast, an earphone’s frequency response, how well the tips fit, and EQ change the sound enough for anyone to notice immediately. If you want better sound, check fit and seal first, then find an EQ that suits your ears; that is far more effective than chasing codecs. For the codec, choosing the best one that stays connected reliably is enough.' },
        ],
      },
    ],
  },
  zh: {
    title: '蓝牙编解码器对比（SBC·AAC·aptX·LDAC）',
    subtitle: '决定无线耳机音质与延迟的编解码器，到底有多重要',
    intro: '无线耳机并不是原样接收手机里的音乐，而是先把音频压缩到能通过蓝牙传输的大小再发送，这时使用的压缩方式就是编解码器。包装盒上印着的aptX、LDAC等名称指的就是它。本文整理主要编解码器的特点与区别、如何查看设备正在使用的编解码器，以及编解码器在实际听感中所占的比重。',
    sections: [
      {
        heading: '1. 编解码器的作用',
        blocks: [
          { type: 'p', text: 'CD音质的无损音乐每秒约需1,411kbps的数据。一般的蓝牙音频连接难以稳定传输这么多数据，因此要经过有损压缩，去掉人耳不易察觉的信息。压缩效率以及能传输的数据量，决定了音质、连接稳定性和延迟。' },
          { type: 'p', text: '手机和耳机都支持同一编解码器时才能使用。如果只有一方支持LDAC，就会自动改用双方都支持的其他编解码器，通常是AAC或SBC。' },
        ],
      },
      {
        heading: '2. 主要编解码器对比',
        blocks: [
          {
            type: 'table',
            head: ['编解码器', '最大码率', '特点'],
            rows: [
              ['SBC', '约328kbps', '所有蓝牙音频设备都支持的基础编解码器，实现质量差异较大'],
              ['AAC', '约256kbps', '在苹果设备上质量稳定，安卓设备的编码质量因机型而异'],
              ['aptX', '352~384kbps', '高通编解码器，16bit，延迟相对较低'],
              ['aptX HD', '576kbps', '支持24bit/48kHz'],
              ['aptX Adaptive', '约279~420kbps', '根据无线环境自动调整码率，支持的芯片上提供无损模式'],
              ['LDAC', '330/660/990kbps', '索尼编解码器，最高24bit/96kHz，高码率在拥挤环境中容易断连'],
              ['LC3', '可变', 'LE Audio的标准编解码器，低码率下效率高、功耗低'],
            ],
          },
          { type: 'p', text: '也有只在品牌生态内使用的编解码器。例如三星Galaxy Buds搭配Galaxy手机时会使用三星自有的编解码器。' },
        ],
      },
      {
        heading: '3. iPhone与安卓的区别',
        blocks: [
          {
            type: 'list',
            items: [
              'iPhone：蓝牙音频只支持AAC和SBC。即使耳机支持LDAC或aptX，在iPhone上也会以AAC连接。不过苹果的AAC编码器质量很好，实际音质较为稳定。',
              '安卓：视机型广泛支持AAC、aptX系列和LDAC等。即使是同一编解码器，实际码率也可能因手机芯片和设置而不同。',
            ],
          },
          { type: 'note', title: '在安卓上查看当前编解码器', text: '在 设置 → 关于手机 → 软件信息 中连续点按版本号七次即可开启开发者选项。连接耳机后，查看开发者选项中的“蓝牙音频编解码器”就能知道当前使用的编解码器，LDAC还可在同一菜单中查看播放质量模式。菜单位置因厂商而略有不同。' },
        ],
      },
      {
        heading: '4. 延迟与视频、游戏',
        blocks: [
          { type: 'p', text: '由于压缩、传输和解码过程，蓝牙音频通常会延迟约0.1~0.3秒。YouTube、Netflix等视频应用会把画面同步调整，所以大多数人察觉不到。而游戏或乐器演奏类应用需要对输入立即响应，延迟就会直接显现。' },
          {
            type: 'list',
            items: [
              '使用游戏模式：许多无线耳机提供降低延迟的游戏模式，但连接稳定性或音质可能略有下降。',
              '低延迟编解码器：双方设备都支持aptX Adaptive或LE Audio（LC3）时，延迟通常会更低。',
              '节奏游戏与演奏：对延迟敏感的用途，有线耳机仍是最可靠的选择。',
            ],
          },
        ],
      },
      {
        heading: '5. 编解码器对音质有多重要',
        blocks: [
          { type: 'p', text: '高码率编解码器在理论上能承载更多信息，这是事实。但许多人反映，在日常聆听中通过盲听区分AAC或aptX与高码率LDAC比想象中难。流媒体音源本身常常已是有损压缩，在地铁或街道等嘈杂环境中，细微差异更会被掩盖。' },
          { type: 'p', text: '相比之下，耳机的频率响应、耳塞佩戴状态和EQ对声音的改变，任何人都能立刻听出来。想提升实际听感，先检查佩戴与密封，再找到适合自己耳朵的EQ，远比追求编解码器有效。编解码器只要在不频繁断连的前提下尽量选好的就足够了。' },
        ],
      },
    ],
  },
  ja: {
    title: 'Bluetoothコーデック比較（SBC・AAC・aptX・LDAC）',
    subtitle: 'ワイヤレスイヤホンの音質と遅延を決めるコーデック、どれくらい重要？',
    intro: 'ワイヤレスイヤホンは、スマホの音楽をそのまま受け取っているわけではありません。Bluetoothで送れるサイズまで圧縮して伝送しており、そのときに使われる圧縮方式がコーデックです。製品の箱に書かれたaptXやLDACといった名前がそれにあたります。この記事では、主なコーデックの特徴と違い、使用中のコーデックの確認方法、そしてコーデックが実際の音質に占める割合をまとめました。',
    sections: [
      {
        heading: '1. コーデックの役割',
        blocks: [
          { type: 'p', text: 'CD品質のロスレス音楽には、毎秒約1,411kbpsのデータが必要です。一般的なBluetoothオーディオ接続ではこの量を安定して送るのが難しいため、人が気づきにくい情報を削る非可逆圧縮を行います。どれだけ効率よく圧縮できるか、どれだけ多くのデータを送れるかによって、音質、接続の安定性、遅延が変わります。' },
          { type: 'p', text: 'コーデックはスマホとイヤホンの両方が対応していないと使えません。片方だけがLDACに対応している場合、両方が対応する別のコーデック、通常はAACかSBCで自動的に接続されます。' },
        ],
      },
      {
        heading: '2. 主なコーデックの比較',
        blocks: [
          {
            type: 'table',
            head: ['コーデック', '最大ビットレート', '特徴'],
            rows: [
              ['SBC', '約328kbps', 'すべてのBluetoothオーディオ機器が対応する基本コーデック。実装によって品質差が大きい'],
              ['AAC', '約256kbps', 'Apple製品では品質が安定。Androidは機種によってエンコード品質に差がある'],
              ['aptX', '352〜384kbps', 'クアルコムのコーデック。16bit、比較的低遅延'],
              ['aptX HD', '576kbps', '24bit/48kHzに対応'],
              ['aptX Adaptive', '約279〜420kbps', '電波状況に応じてビットレートを自動調整。対応チップではロスレスモードあり'],
              ['LDAC', '330/660/990kbps', 'ソニーのコーデック。最大24bit/96kHz。高ビットレートは混雑した環境で途切れやすい'],
              ['LC3', '可変', 'LE Audioの標準コーデック。低ビットレートでも効率がよく消費電力が少ない'],
            ],
          },
          { type: 'p', text: 'メーカーのエコシステム内でのみ動作するコーデックもあります。たとえばSamsung Galaxy BudsをGalaxyスマホと組み合わせると、Samsung独自のコーデックが使われます。' },
        ],
      },
      {
        heading: '3. iPhoneとAndroidの違い',
        blocks: [
          {
            type: 'list',
            items: [
              'iPhone：BluetoothオーディオはAACとSBCのみに対応しています。イヤホンがLDACやaptXに対応していても、iPhoneではAACで接続されます。その代わりAppleのAACエンコーダーは品質がよく、実用上の音質は安定しています。',
              'Android：機種によってAAC、aptX系、LDACなどに幅広く対応しています。同じコーデックでも、スマホのチップセットや設定によって実際のビットレートが変わることがあります。',
            ],
          },
          { type: 'note', title: 'Androidで現在のコーデックを確認する', text: '設定 → デバイス情報 → ソフトウェア情報 でビルド番号を7回タップすると開発者向けオプションが有効になります。イヤホンを接続した状態で開発者向けオプションの「Bluetoothオーディオコーデック」を見れば、使用中のコーデックを確認でき、LDACは同じメニューで再生品質モードも確認できます。メニューの場所はメーカーによって多少異なります。' },
        ],
      },
      {
        heading: '4. 遅延と動画・ゲーム',
        blocks: [
          { type: 'p', text: 'Bluetoothオーディオは圧縮・伝送・復号の過程があるため、通常0.1〜0.3秒ほど遅れて聞こえます。YouTubeやNetflixなどの動画アプリはこの遅延に合わせて映像を調整するため、ほとんどの人はずれに気づきません。一方、ゲームや楽器演奏アプリは入力に即座に反応する必要があるため、遅延がそのまま表れます。' },
          {
            type: 'list',
            items: [
              'ゲームモードを活用：多くのワイヤレスイヤホンに遅延を減らすゲームモードがあります。ただし接続の安定性や音質が少し下がることがあります。',
              '低遅延コーデック：両方の機器がaptX AdaptiveやLE Audio（LC3）に対応していれば、遅延が小さくなることが多いです。',
              'リズムゲームや演奏：遅延に敏感な用途では、有線イヤホンが最も確実です。',
            ],
          },
        ],
      },
      {
        heading: '5. コーデックは音質にどれくらい重要か',
        blocks: [
          { type: 'p', text: 'ビットレートの高いコーデックが理論上より多くの情報を運べるのは事実です。しかし普段の聴取環境では、AACやaptXと高ビットレートのLDACをブラインドで聴き分けるのは思ったより難しいという声が多くあります。ストリーミング音源自体がすでに非可逆圧縮されていることも多く、電車や街中など騒がしい場所では微妙な差はさらに埋もれます。' },
          { type: 'p', text: '一方、イヤホンの周波数特性、イヤーピースの装着状態、EQは、誰でもすぐにわかるほど音を大きく変えます。体感の音質を上げたいなら、コーデックよりも先に装着感と密閉を確認し、自分の耳に合うEQを見つけるほうがはるかに効果的です。コーデックは、接続が頻繁に途切れない範囲でできるだけ良いものを選べば十分です。' },
        ],
      },
    ],
  },
}

export default content
