import type { GuideContent } from '@/lib/guides'

const content: GuideContent = {
  ko: {
    title: '이어폰 소리 문제 해결 가이드',
    subtitle: '고장인 줄 알았던 문제, 대부분은 몇 가지 점검으로 해결됩니다',
    intro: '새로 산 이어폰의 저음이 약하게 느껴지거나, 어느 날 한쪽 소리가 작아지거나, 지하철에서만 소리가 자꾸 끊긴다면 먼저 고장을 의심하게 됩니다. 하지만 실제로는 착용 상태, 설정, 전파 환경 때문인 경우가 훨씬 많습니다. 이 글은 흔한 증상별로 원인을 짚고, 비용이 들지 않는 점검부터 순서대로 정리했습니다. EQ를 조절하기 전에 이 단계들을 먼저 확인하면 훨씬 정확한 결과를 얻을 수 있습니다.',
    sections: [
      {
        heading: '1. 저음이 약하고 소리가 얇을 때',
        blocks: [
          { type: 'p', text: '커널형 이어폰의 저음은 이어팁이 귓구멍을 얼마나 잘 막느냐에 크게 좌우됩니다. 작은 틈만 있어도 저음이 빠져나가서 측정값보다 훨씬 가볍게 들립니다. EQ로 저음을 올리기 전에 차폐부터 확인하세요.' },
          {
            type: 'list',
            items: [
              '이어팁 크기 바꾸기: 기본 장착된 M 사이즈가 맞지 않는 경우가 많습니다. 한 단계 큰 팁을 끼워 보고, 좌우 귀 크기가 다르면 양쪽을 다른 크기로 써도 됩니다.',
              '착용 각도와 깊이: 이어폰을 살짝 돌리거나 귓바퀴를 위로 당기면서 넣으면 더 깊고 안정적으로 밀착됩니다.',
              '착용감 테스트 활용: 많은 노이즈 캔슬링 이어폰이 제조사 앱이나 설정에서 이어팁 착용 테스트를 제공합니다.',
              '폼팁 시도: 메모리폼 팁은 귓구멍 모양에 맞게 부풀어 차폐가 좋아지고 저음이 늘어나는 경우가 많습니다.',
            ],
          },
          { type: 'note', title: '간단한 차폐 확인법', text: '음악을 재생한 상태에서 이어폰을 손가락으로 귀 쪽으로 살짝 눌러 보세요. 이때 저음이 확 늘어난다면 평소 차폐가 부족하다는 뜻입니다. 팁 크기나 착용 방법을 바꿔야 할 신호입니다.' },
        ],
      },
      {
        heading: '2. 한쪽 소리만 작거나 다르게 들릴 때',
        blocks: [
          {
            type: 'list',
            items: [
              '노즐 청소: 이어폰 소리가 나오는 망에 귀지가 쌓이면 그쪽 소리가 작고 먹먹해집니다. 마른 부드러운 솔로 망을 살살 털어 내고, 물이나 액체를 직접 넣지 마세요.',
              '좌우 밸런스 설정 확인: 아이폰은 손쉬운 사용 → 오디오 및 시각, 안드로이드는 접근성 설정의 오디오 항목에 좌우 균형 슬라이더가 있습니다. 실수로 한쪽으로 치우쳐 있지 않은지 확인하세요.',
              '좌우 바꿔 끼우기: 좌우를 바꿔 착용했을 때 작은 쪽이 따라오면 이어폰 문제, 같은 귀에서 계속 작으면 착용이나 귀의 문제일 가능성이 큽니다.',
              '청력 확인: 이어폰을 바꿔도 계속 한쪽 귀가 작게 들린다면 귀지가 쌓였거나 청력에 차이가 있을 수 있으니 이비인후과 검진을 권합니다.',
            ],
          },
        ],
      },
      {
        heading: '3. 소리가 자주 끊길 때',
        blocks: [
          { type: 'p', text: '블루투스는 Wi-Fi, 전자레인지 등과 같은 2.4GHz 대역을 씁니다. 사람의 몸은 이 전파를 잘 흡수하기 때문에, 휴대폰과 이어폰 사이에 몸이 가로막히거나 주변에 무선 기기가 많으면 끊김이 생기기 쉽습니다. 출퇴근 시간 지하철에서 유독 끊기는 이유입니다.' },
          {
            type: 'list',
            items: [
              '휴대폰 위치: 뒷주머니나 가방 깊은 곳보다 이어폰과 같은 쪽 앞주머니에 두면 연결이 안정적입니다.',
              '코덱 품질 낮추기: LDAC를 쓰고 있다면 개발자 옵션에서 연결 우선 모드로 바꾸면 끊김이 크게 줄어듭니다.',
              '멀티포인트 끄기: 두 기기에 동시에 연결하는 기능은 편리하지만 끊김의 원인이 되기도 합니다.',
              '재페어링과 업데이트: 블루투스 목록에서 기기를 삭제하고 다시 연결하고, 제조사 앱에서 펌웨어를 최신으로 유지하세요.',
            ],
          },
        ],
      },
      {
        heading: '4. 소리가 지글거리거나 찢어질 때',
        blocks: [
          {
            type: 'list',
            items: [
              'EQ 클리핑: EQ로 특정 대역을 크게 올리면 큰 소리에서 신호가 잘려 지글거립니다. 가장 많이 올린 값만큼 프리앰프나 전체 밴드를 낮춰 보세요.',
              '음원 확인: 같은 곡을 다른 앱이나 다른 이어폰으로 들어 보세요. 그래도 같은 소리가 나면 음원 자체의 문제입니다.',
              '중복 효과 끄기: 음장 효과, 베이스 부스트, 앱 EQ가 겹치면 과도한 증폭이 일어날 수 있습니다.',
              '착용 시 딸깍 소리: 일부 이어폰은 끼울 때 귓속 압력 때문에 진동판이 눌리며 딸깍 소리가 나는데, 이를 드라이버 플렉스라고 합니다. 보통 고장이 아니며 천천히 끼우면 줄어듭니다.',
            ],
          },
        ],
      },
      {
        heading: '5. 고음이 찌르거나 금방 귀가 피곤할 때',
        blocks: [
          { type: 'p', text: '이어폰을 넣는 깊이에 따라 외이도 안의 공명 위치가 바뀌어 고음 특성이 달라집니다. 같은 이어폰이라도 얕게 끼우면 특정 고음이 찌르고, 깊게 끼우면 부드러워지는 경우가 있습니다. 착용을 바꿔도 해결되지 않으면 5~8kHz 근처를 좁게 2~3dB 낮춰 보세요.' },
          { type: 'p', text: '무엇보다 귀가 쉽게 피곤하다면 볼륨이 너무 높은 것은 아닌지 점검해야 합니다. 시끄러운 곳에서는 무의식적으로 볼륨을 올리게 되므로, 노이즈 캔슬링을 활용해 주변 소음을 줄이고 낮은 볼륨으로 듣는 습관이 청력 보호에도 좋습니다.' },
        ],
      },
      {
        heading: '6. 그래도 해결되지 않는다면',
        blocks: [
          {
            type: 'list',
            items: [
              '초기화: 대부분의 무선 이어폰은 케이스 버튼이나 터치 조작으로 공장 초기화를 할 수 있습니다. 방법은 제조사 설명서를 참고하세요.',
              '다른 기기에서 확인: 다른 휴대폰이나 PC에 연결해도 같은 증상이 나타나면 이어폰 쪽 문제일 가능성이 큽니다.',
              'A/S 문의: 보증 기간 안이라면 증상과 점검한 내용을 정리해 제조사 서비스 센터에 문의하세요.',
            ],
          },
        ],
      },
    ],
  },
  en: {
    title: 'Earphone Sound Troubleshooting',
    subtitle: 'Most problems that look like a defect can be fixed with a few checks',
    intro: 'When new earphones sound weak in the bass, one side suddenly gets quieter, or the sound keeps dropping out only on the subway, it is natural to suspect a defect. In practice, fit, settings and radio conditions are far more often the cause. This guide walks through common symptoms and their causes, starting with checks that cost nothing. Going through these steps before adjusting EQ will give you much more accurate results.',
    sections: [
      {
        heading: '1. Weak Bass and Thin Sound',
        blocks: [
          { type: 'p', text: 'Bass from in-ear earphones depends heavily on how well the ear tip seals the ear canal. Even a small gap lets bass leak out, so the sound is much lighter than the measurements suggest. Check the seal before boosting bass with EQ.' },
          {
            type: 'list',
            items: [
              'Try a different tip size: The pre-installed medium tips often do not fit. Try one size up, and feel free to use different sizes for each ear if your ears differ.',
              'Angle and depth: Twisting the earphone slightly, or pulling your outer ear upward while inserting, gives a deeper, more stable seal.',
              'Use a fit test: Many noise-cancelling earphones offer an ear tip fit test in the brand app or settings.',
              'Try foam tips: Memory foam tips expand to the shape of your ear canal, often improving the seal and adding bass.',
            ],
          },
          { type: 'note', title: 'A quick seal check', text: 'While music plays, gently press the earphones into your ears with your fingers. If the bass suddenly gets much stronger, your usual seal is not good enough, which is a sign to change tip size or how you wear them.' },
        ],
      },
      {
        heading: '2. One Side Quieter or Different',
        blocks: [
          {
            type: 'list',
            items: [
              'Clean the nozzle: Earwax building up on the mesh where sound comes out makes that side quieter and muffled. Gently brush the mesh with a soft, dry brush and never put water or liquid directly on it.',
              'Check balance settings: iPhone has a left/right balance slider under Accessibility → Audio & Visual, and Android has one in the audio section of Accessibility settings. Make sure it has not been shifted by accident.',
              'Swap sides: If the quiet side follows the earphone when you swap left and right, the earphone is the issue; if the same ear stays quiet, fit or the ear itself is more likely.',
              'Check your hearing: If one ear stays quieter even with different earphones, it could be earwax buildup or a hearing difference, so an ENT checkup is recommended.',
            ],
          },
        ],
      },
      {
        heading: '3. Frequent Dropouts',
        blocks: [
          { type: 'p', text: 'Bluetooth uses the same 2.4 GHz band as Wi-Fi and microwave ovens. The human body absorbs these signals well, so dropouts happen easily when your body blocks the path between phone and earphones or when many wireless devices are nearby. That is why rush-hour subways are especially bad.' },
          {
            type: 'list',
            items: [
              'Phone position: A front pocket on the same side as the earphones is more stable than a back pocket or the bottom of a bag.',
              'Lower codec quality: If you use LDAC, switching to the connection-priority mode in Developer options greatly reduces dropouts.',
              'Turn off multipoint: Connecting to two devices at once is convenient but can cause dropouts.',
              'Re-pair and update: Remove the device from your Bluetooth list and pair again, and keep firmware up to date in the brand app.',
            ],
          },
        ],
      },
      {
        heading: '4. Crackling or Distorted Sound',
        blocks: [
          {
            type: 'list',
            items: [
              'EQ clipping: Large EQ boosts clip the signal during loud passages and cause crackling. Lower the preamp or all bands by your largest boost.',
              'Check the source: Play the same song in another app or on other earphones. If it sounds the same, the recording itself is the problem.',
              'Turn off stacked effects: Sound field effects, bass boost and app EQ combined can over-amplify the signal.',
              'Clicking when inserting: Some earphones click as pressure in the ear canal pushes the diaphragm when you put them in. This is called driver flex, is usually not a defect, and inserting more slowly reduces it.',
            ],
          },
        ],
      },
      {
        heading: '5. Piercing Treble or Quick Ear Fatigue',
        blocks: [
          { type: 'p', text: 'How deep you insert an earphone shifts the resonance inside the ear canal and changes the treble. The same earphone can sound piercing when worn shallow and smoother when inserted deeper. If changing the fit does not help, try a narrow 2–3 dB cut around 5–8 kHz.' },
          { type: 'p', text: 'Above all, if your ears tire quickly, check whether the volume is too high. In noisy places we unconsciously turn it up, so using noise cancelling to reduce background noise and listening at a lower volume is also good for protecting your hearing.' },
        ],
      },
      {
        heading: '6. If Nothing Works',
        blocks: [
          {
            type: 'list',
            items: [
              'Factory reset: Most wireless earphones can be reset with a case button or touch gesture. See the manufacturer’s manual for the steps.',
              'Test with another device: If the same issue appears when connected to another phone or PC, the earphones are likely at fault.',
              'Contact support: If still under warranty, note the symptoms and what you have checked, then contact the manufacturer’s service center.',
            ],
          },
        ],
      },
    ],
  },
  zh: {
    title: '耳机声音问题排查指南',
    subtitle: '看似故障的问题，大多通过几项检查就能解决',
    intro: '新买的耳机低频偏弱、某天一侧声音突然变小、只在地铁里频繁断连时，人们往往先怀疑是故障。但实际上，佩戴状态、设置和无线环境才是更常见的原因。本文按常见症状梳理原因，并从不花钱的检查开始依次介绍。调整EQ之前先完成这些步骤，能得到准确得多的结果。',
    sections: [
      {
        heading: '1. 低频弱、声音单薄',
        blocks: [
          { type: 'p', text: '入耳式耳机的低频在很大程度上取决于耳塞对耳道的密封程度。哪怕只有很小的缝隙，低频也会泄漏，听起来比测量值轻得多。用EQ提升低频之前，请先检查密封。' },
          {
            type: 'list',
            items: [
              '更换耳塞尺寸：出厂装配的M号往往并不合适。试试大一号的耳塞；如果左右耳大小不同，两侧用不同尺寸也可以。',
              '佩戴角度与深度：稍微转动耳机，或一边向上拉耳廓一边塞入，能贴合得更深更稳。',
              '利用佩戴检测：许多降噪耳机在品牌应用或设置中提供耳塞贴合度检测。',
              '尝试海绵耳塞：记忆海绵耳塞会贴合耳道形状膨胀，常能改善密封并增加低频。',
            ],
          },
          { type: 'note', title: '简单的密封检查方法', text: '播放音乐时，用手指把耳机轻轻往耳朵里按。如果低频突然明显增加，说明平时的密封不够，这是需要更换耳塞尺寸或佩戴方式的信号。' },
        ],
      },
      {
        heading: '2. 单侧声音偏小或听起来不同',
        blocks: [
          {
            type: 'list',
            items: [
              '清洁出音嘴：出音口滤网积了耳垢，那一侧声音就会变小发闷。用干燥柔软的刷子轻轻刷掉，切勿直接用水或液体。',
              '检查左右平衡设置：iPhone在 辅助功能 → 音频与视觉，安卓在无障碍设置的音频项目中有左右平衡滑块。请确认没有被误调到一侧。',
              '左右互换佩戴：互换后声音小的一侧跟着耳机走，就是耳机问题；同一只耳朵一直偏小，则更可能是佩戴或耳朵本身的问题。',
              '检查听力：换了耳机后同一侧仍然偏小，可能是耳垢堆积或听力差异，建议到耳鼻喉科检查。',
            ],
          },
        ],
      },
      {
        heading: '3. 频繁断连',
        blocks: [
          { type: 'p', text: '蓝牙与Wi-Fi、微波炉等使用相同的2.4GHz频段。人体很容易吸收这一频段的信号，所以当身体挡在手机与耳机之间，或周围无线设备很多时，就容易断连。这也是早晚高峰地铁里特别容易断的原因。' },
          {
            type: 'list',
            items: [
              '手机位置：放在与耳机同侧的前口袋，比放在后口袋或包的深处更稳定。',
              '降低编解码器质量：如果在用LDAC，在开发者选项中改为连接优先模式，断连会大幅减少。',
              '关闭多点连接：同时连接两台设备虽然方便，但也可能导致断连。',
              '重新配对与更新：从蓝牙列表中删除设备后重新连接，并在品牌应用中保持固件为最新。',
            ],
          },
        ],
      },
      {
        heading: '4. 声音沙沙作响或破音',
        blocks: [
          {
            type: 'list',
            items: [
              'EQ削波：用EQ大幅提升某个频段，大音量段落会出现信号截断而沙沙作响。按最大提升量降低前级或所有频段。',
              '检查音源：用其他应用或其他耳机播放同一首歌。如果声音一样，就是音源本身的问题。',
              '关闭叠加音效：音场效果、低音增强和应用EQ叠加，可能造成过度放大。',
              '佩戴时的咔哒声：有些耳机在塞入时，耳道内的压力会推动振膜发出咔哒声，这叫作振膜褶皱（driver flex），通常不是故障，慢慢塞入可以减轻。',
            ],
          },
        ],
      },
      {
        heading: '5. 高频刺耳或耳朵很快疲劳',
        blocks: [
          { type: 'p', text: '耳机插入的深度会改变耳道内的共振位置，从而改变高频特性。同一款耳机浅戴时某些高频会刺耳，深戴时则可能变得柔和。调整佩戴仍无改善时，可在5~8kHz附近做2~3dB的窄幅衰减。' },
          { type: 'p', text: '最重要的是，如果耳朵很快疲劳，要检查音量是否过高。在嘈杂环境中人们会不自觉地调高音量，因此利用降噪减少环境噪音、养成低音量聆听的习惯，也有助于保护听力。' },
        ],
      },
      {
        heading: '6. 仍然无法解决时',
        blocks: [
          {
            type: 'list',
            items: [
              '恢复出厂设置：大多数无线耳机可以通过充电盒按键或触控操作恢复出厂设置，具体方法请参阅厂商说明书。',
              '在其他设备上确认：连接其他手机或电脑后仍出现同样症状，很可能是耳机本身的问题。',
              '联系售后：如果仍在保修期内，整理好症状和已检查的内容，联系厂商售后服务中心。',
            ],
          },
        ],
      },
    ],
  },
  ja: {
    title: 'イヤホンの音のトラブル解決ガイド',
    subtitle: '故障だと思った問題も、ほとんどはいくつかの確認で解決します',
    intro: '買ったばかりのイヤホンの低音が弱く感じる、ある日片側の音が小さくなった、電車の中でだけ音がよく途切れる。そんなとき、まず故障を疑いがちです。しかし実際には、装着状態や設定、電波環境が原因であることのほうがはるかに多いのです。この記事では、よくある症状ごとに原因を整理し、費用のかからない確認から順に紹介します。EQを調整する前にこれらを確認しておけば、ずっと正確な結果が得られます。',
    sections: [
      {
        heading: '1. 低音が弱く音が薄いとき',
        blocks: [
          { type: 'p', text: 'カナル型イヤホンの低音は、イヤーピースが耳の穴をどれだけしっかり密閉するかに大きく左右されます。わずかなすき間でも低音が逃げ、測定値よりずっと軽く聞こえます。EQで低音を上げる前に、まず密閉を確認しましょう。' },
          {
            type: 'list',
            items: [
              'イヤーピースのサイズを変える：最初から付いているMサイズが合わないことはよくあります。ワンサイズ大きいものを試し、左右の耳の大きさが違うなら左右で別のサイズを使ってもかまいません。',
              '装着の角度と深さ：イヤホンを少しひねったり、耳たぶを上に引っ張りながら入れたりすると、より深く安定して密着します。',
              '装着テストを活用：多くのノイズキャンセリングイヤホンは、メーカーアプリや設定でイヤーピースの装着テストを提供しています。',
              'フォームチップを試す：メモリーフォームのイヤーピースは耳の穴の形に合わせて膨らむため、密閉性が上がり低音が増えることが多いです。',
            ],
          },
          { type: 'note', title: '簡単な密閉チェック', text: '音楽を再生しながら、イヤホンを指で耳のほうへ軽く押してみてください。そのとき低音が一気に増えるなら、普段の密閉が足りていないということです。イヤーピースのサイズや装着方法を変えるべきサインです。' },
        ],
      },
      {
        heading: '2. 片側だけ音が小さい・違って聞こえるとき',
        blocks: [
          {
            type: 'list',
            items: [
              'ノズルの掃除：音が出るメッシュに耳垢がたまると、その側の音が小さくこもります。乾いた柔らかいブラシでやさしく払い、水や液体を直接入れないでください。',
              '左右バランス設定の確認：iPhoneは アクセシビリティ → オーディオとビジュアル、Androidはユーザー補助設定のオーディオ項目に左右バランスのスライダーがあります。誤って片側に寄っていないか確認しましょう。',
              '左右を入れ替える：左右を入れ替えて小さい側がイヤホンについてくるならイヤホンの問題、同じ耳で小さいままなら装着か耳の問題の可能性が高いです。',
              '聴力の確認：イヤホンを替えても同じ耳が小さく聞こえるなら、耳垢がたまっているか聴力に差がある可能性があるので、耳鼻咽喉科での検査をおすすめします。',
            ],
          },
        ],
      },
      {
        heading: '3. 音がよく途切れるとき',
        blocks: [
          { type: 'p', text: 'BluetoothはWi-Fiや電子レンジと同じ2.4GHz帯を使います。人の体はこの電波をよく吸収するため、スマホとイヤホンの間に体が入ったり、周囲に無線機器が多かったりすると途切れやすくなります。通勤時間帯の電車で特に途切れるのはこのためです。' },
          {
            type: 'list',
            items: [
              'スマホの位置：後ろポケットやかばんの奥より、イヤホンと同じ側の前ポケットに入れたほうが接続が安定します。',
              'コーデックの品質を下げる：LDACを使っているなら、開発者向けオプションで接続優先モードに変えると途切れが大きく減ります。',
              'マルチポイントをオフに：2台に同時接続する機能は便利ですが、途切れの原因になることもあります。',
              '再ペアリングとアップデート：Bluetoothの一覧から機器を削除して接続し直し、メーカーアプリでファームウェアを最新に保ちましょう。',
            ],
          },
        ],
      },
      {
        heading: '4. 音がジリジリする・割れるとき',
        blocks: [
          {
            type: 'list',
            items: [
              'EQのクリッピング：EQで特定の帯域を大きく上げると、大きな音の部分で信号が切れてジリジリします。最も大きく上げた分だけプリアンプか全バンドを下げてみてください。',
              '音源を確認：同じ曲を別のアプリや別のイヤホンで聴いてみましょう。それでも同じ音がするなら音源自体の問題です。',
              '重複するエフェクトをオフに：音場効果、低音ブースト、アプリのEQが重なると過度な増幅が起こることがあります。',
              '装着時のパキッという音：一部のイヤホンは、入れるときの耳の中の圧力で振動板が押されてパキッと鳴ります。これをドライバーフレックスといい、通常は故障ではなく、ゆっくり入れると軽減します。',
            ],
          },
        ],
      },
      {
        heading: '5. 高音が刺さる・すぐ耳が疲れるとき',
        blocks: [
          { type: 'p', text: 'イヤホンを入れる深さによって外耳道内の共鳴位置が変わり、高音の特性が変わります。同じイヤホンでも浅く入れると特定の高音が刺さり、深く入れると柔らかくなることがあります。装着を変えても改善しなければ、5〜8kHz付近を狭く2〜3dB下げてみてください。' },
          { type: 'p', text: '何よりも、耳がすぐ疲れるなら音量が大きすぎないか確認が必要です。騒がしい場所では無意識に音量を上げてしまうので、ノイズキャンセリングで周囲の騒音を減らし、小さな音量で聴く習慣が聴力の保護にもつながります。' },
        ],
      },
      {
        heading: '6. それでも解決しないとき',
        blocks: [
          {
            type: 'list',
            items: [
              '初期化：ほとんどのワイヤレスイヤホンは、ケースのボタンやタッチ操作で工場出荷状態に戻せます。方法はメーカーの説明書を参照してください。',
              '別の機器で確認：別のスマホやPCにつないでも同じ症状が出るなら、イヤホン側の問題である可能性が高いです。',
              'サポートに問い合わせ：保証期間内であれば、症状と確認した内容をまとめてメーカーのサービスセンターに問い合わせましょう。',
            ],
          },
        ],
      },
    ],
  },
}

export default content
