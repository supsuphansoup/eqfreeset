import type { GuideContent } from '@/lib/guides'

const content: GuideContent = {
  ko: {
    title: '주파수 응답 그래프와 타깃 커브 읽는 법',
    subtitle: '측정 그래프를 해석하고, 같은 이어폰이 사람마다 다르게 들리는 이유 이해하기',
    intro: '이어폰 리뷰나 AutoEq 같은 프로젝트에서 자주 보이는 구불구불한 선이 주파수 응답(Frequency Response, FR) 그래프입니다. 이 그래프는 이어폰이 어떤 대역을 강조하고 어떤 대역을 덜 내는지 보여 주는 가장 기본적인 자료입니다. 이 글에서는 그래프의 축과 모양을 읽는 법, 많은 보정 EQ의 기준이 되는 하만 타깃의 의미, 그리고 측정값만으로는 내 귀에 맞는 소리를 다 설명할 수 없는 이유를 정리합니다.',
    sections: [
      {
        heading: '1. 그래프의 축 이해하기',
        blocks: [
          {
            type: 'list',
            items: [
              '가로축(주파수): 왼쪽이 저음(20Hz), 오른쪽이 고음(20kHz)입니다. 사람의 음높이 감각에 맞추기 위해 로그 눈금을 쓰므로 20~200Hz, 200Hz~2kHz, 2~20kHz가 같은 폭을 차지합니다.',
              '세로축(음압 레벨): 각 주파수가 얼마나 크게 나오는지를 dB로 나타냅니다. 절대값보다는 대역 사이의 상대적인 높낮이가 중요합니다.',
              '선의 개수: 왼쪽과 오른쪽 채널을 따로 그린 경우가 많습니다. 두 선이 크게 어긋나면 좌우 편차가 있다는 뜻입니다.',
            ],
          },
          { type: 'p', text: 'dB는 로그 단위라서 +6dB는 음압이 약 두 배, +10dB는 체감상 약 두 배 크게 들리는 정도입니다. 그래서 그래프에서 3~4dB 차이로 보이는 언덕도 실제로는 꽤 뚜렷하게 들립니다.' },
        ],
      },
      {
        heading: '2. 평평한 그래프가 정답이 아닌 이유',
        blocks: [
          { type: 'p', text: '이어폰 측정 그래프를 처음 보면 대부분 2~3kHz 근처에 큰 봉우리가 있어서 고음이 과한 것처럼 보입니다. 하지만 이것은 정상입니다. 스피커 소리가 우리 귀에 도달할 때는 머리, 귓바퀴, 외이도를 거치면서 이 대역이 자연스럽게 10dB 안팎 강조됩니다. 이를 귀 이득(ear gain)이라고 부릅니다.' },
          { type: 'p', text: '이어폰은 이 경로를 건너뛰고 외이도에 바로 소리를 넣기 때문에, 측정용 귀 모형(이어 시뮬레이터)으로 재면 이 봉우리가 있어야 자연스럽게 들립니다. 오히려 그래프가 완전히 평평하면 실제로는 답답하고 어둡게 들립니다. 그래서 측정 그래프는 아무것도 없는 평평한 선이 아니라 타깃 커브와 비교해서 읽어야 합니다.' },
        ],
      },
      {
        heading: '3. 하만 타깃이란',
        blocks: [
          { type: 'p', text: '하만 타깃은 오디오 기업 하만(Harman)의 연구팀이 수년간 진행한 청취 실험을 바탕으로 만든 기준 곡선입니다. 다양한 EQ 곡선을 적용한 헤드폰과 이어폰을 많은 사람에게 블라인드로 들려주고, 평균적으로 가장 선호도가 높았던 응답을 곡선으로 정리했습니다. 헤드폰용(Over-Ear)과 이어폰용(In-Ear)이 따로 있습니다.' },
          {
            type: 'list',
            items: [
              '저음 셸프: 약 100Hz 아래를 완만하게 끌어올린 형태입니다. 실험 참가자들이 무게감 있는 저음을 선호한 결과가 반영되었습니다.',
              '귀 이득 구간: 2~4kHz 부근의 봉우리로, 자연스러운 청취 상태를 재현합니다.',
              '완만한 고음 하강: 높은 주파수로 갈수록 서서히 내려가 날카로움을 줄입니다.',
            ],
          },
          { type: 'note', title: '타깃은 평균값입니다', text: '같은 연구에서도 저음을 더 원하는 그룹과 덜 원하는 그룹이 나뉘었고, 나이와 청취 경험에 따라서도 선호가 달랐습니다. 하만 타깃은 많은 사람이 무난하게 좋아할 출발점이지, 모든 사람에게 맞는 정답은 아닙니다.' },
        ],
      },
      {
        heading: '4. 그래프를 읽는 실전 순서',
        blocks: [
          {
            type: 'list',
            items: [
              '저음 비교: 100Hz 아래가 타깃보다 높으면 저음이 강한 성향, 낮으면 담백한 성향입니다.',
              '중저음 확인: 200~500Hz가 타깃보다 솟아 있으면 먹먹하거나 탁하게 들릴 가능성이 큽니다.',
              '귀 이득 구간: 2~4kHz가 타깃보다 높으면 보컬이 가깝고 날카로운 쪽, 낮으면 부드럽지만 흐릿한 쪽입니다.',
              '고음 봉우리: 5~10kHz의 좁고 높은 봉우리는 치찰음이나 피로감의 원인이 되는 경우가 많습니다.',
            ],
          },
        ],
      },
      {
        heading: '5. 측정값의 한계',
        blocks: [
          { type: 'p', text: '측정 그래프는 표준화된 귀 모형에서 얻은 결과입니다. 실제 사람의 외이도 길이와 모양, 이어팁이 들어가는 깊이는 저마다 다르기 때문에, 특히 8kHz 이상의 고음은 측정값과 실제 귀에서의 소리가 크게 달라질 수 있습니다. 이어폰이 귀를 제대로 막지 못하면 저음도 측정값보다 훨씬 적게 들립니다.' },
          { type: 'p', text: 'AutoEq는 측정 그래프와 타깃의 차이를 계산해 보정 EQ를 만드는 오픈소스 프로젝트입니다. EQ FreeSet은 이 데이터를 출발점으로 삼은 뒤, A/B 블라인드 테스트로 개인의 귀 구조와 취향에 맞게 저음, 따뜻함, 보컬, 밝기를 다시 조정합니다. 측정으로 기기의 특성을 잡고, 청취로 개인 차이를 메우는 방식입니다.' },
        ],
      },
    ],
  },
  en: {
    title: 'Reading Frequency Response Graphs & Target Curves',
    subtitle: 'Interpreting measurements, and why the same earphone sounds different to each person',
    intro: 'The wiggly line you often see in earphone reviews and projects like AutoEq is a frequency response (FR) graph. It is the most basic data showing which bands an earphone emphasizes and which it holds back. This guide explains how to read the axes and shape of the graph, what the Harman target that many correction EQs are based on actually means, and why measurements alone cannot fully describe the sound that suits your ears.',
    sections: [
      {
        heading: '1. Understanding the Axes',
        blocks: [
          {
            type: 'list',
            items: [
              'Horizontal axis (frequency): Bass (20 Hz) on the left, treble (20 kHz) on the right. It uses a logarithmic scale to match how we perceive pitch, so 20–200 Hz, 200 Hz–2 kHz and 2–20 kHz take up equal widths.',
              'Vertical axis (sound pressure level): How loud each frequency is, in dB. The relative height between bands matters more than the absolute value.',
              'Number of lines: Left and right channels are often drawn separately. If the two lines differ a lot, there is a channel imbalance.',
            ],
          },
          { type: 'p', text: 'Because dB is logarithmic, +6 dB is roughly double the sound pressure, and +10 dB is perceived as roughly twice as loud. A hill that looks like only 3–4 dB on the graph can therefore be clearly audible.' },
        ],
      },
      {
        heading: '2. Why a Flat Graph Is Not the Goal',
        blocks: [
          { type: 'p', text: 'The first time you look at an earphone graph, most show a big peak around 2–3 kHz that looks like too much treble. This is normal. When sound from a speaker reaches us, our head, outer ear and ear canal naturally boost this region by around 10 dB. This is called ear gain.' },
          { type: 'p', text: 'Earphones skip that path and deliver sound straight into the ear canal, so when measured on an ear simulator, this peak needs to be present for the sound to feel natural. A perfectly flat graph would actually sound dull and dark. That is why measurements should be read against a target curve, not against a flat line.' },
        ],
      },
      {
        heading: '3. What the Harman Target Is',
        blocks: [
          { type: 'p', text: 'The Harman target is a reference curve developed from years of listening experiments by a research team at the audio company Harman. Many listeners blindly compared headphones and earphones with different EQ curves applied, and the response that was preferred on average was formalized into a curve. There are separate versions for over-ear headphones and in-ear earphones.' },
          {
            type: 'list',
            items: [
              'Bass shelf: A gentle lift below about 100 Hz, reflecting listeners’ preference for weighty bass.',
              'Ear gain region: A peak around 2–4 kHz that recreates natural listening.',
              'Gentle treble roll-off: A gradual decline toward high frequencies to reduce harshness.',
            ],
          },
          { type: 'note', title: 'The target is an average', text: 'Even within the same research, listeners split into groups wanting more or less bass, and preferences also varied with age and listening experience. The Harman target is a starting point that many people find pleasant, not the right answer for everyone.' },
        ],
      },
      {
        heading: '4. A Practical Reading Order',
        blocks: [
          {
            type: 'list',
            items: [
              'Compare the bass: Above target below 100 Hz means a bass-heavy tuning; below target means a lean one.',
              'Check the low mids: If 200–500 Hz rises above target, the sound is likely to be muffled or muddy.',
              'Ear gain region: Above target at 2–4 kHz means forward, sharper vocals; below means smoother but less clear.',
              'Treble peaks: Narrow, tall peaks between 5 and 10 kHz often cause sibilance or fatigue.',
            ],
          },
        ],
      },
      {
        heading: '5. Limits of Measurements',
        blocks: [
          { type: 'p', text: 'Measurement graphs come from a standardized ear model. Real ear canals vary in length and shape, and ear tips sit at different depths, so treble above 8 kHz in particular can differ greatly between the measurement and your own ears. If an earphone does not seal properly, you will also hear far less bass than measured.' },
          { type: 'p', text: 'AutoEq is an open-source project that calculates correction EQ from the difference between a measurement and a target. EQ FreeSet uses this data as a starting point, then uses an A/B blind test to readjust bass, warmth, vocal and brightness for your ear anatomy and taste. Measurements capture the device; listening fills in the individual differences.' },
        ],
      },
    ],
  },
  zh: {
    title: '如何读懂频响曲线与目标曲线',
    subtitle: '解读测量曲线，理解同一款耳机为何因人而异',
    intro: '在耳机评测或AutoEq等项目中常见的弯弯曲曲的线，就是频率响应（Frequency Response，FR）曲线。它是展示耳机强调哪些频段、削弱哪些频段的最基本资料。本文介绍如何解读曲线的坐标与形状、许多校正EQ所依据的哈曼目标曲线的含义，以及为什么仅凭测量数据无法完全描述适合你耳朵的声音。',
    sections: [
      {
        heading: '1. 理解坐标轴',
        blocks: [
          {
            type: 'list',
            items: [
              '横轴（频率）：左边是低频（20Hz），右边是高频（20kHz）。为符合人对音高的感知，采用对数刻度，因此20~200Hz、200Hz~2kHz、2~20kHz占据相同宽度。',
              '纵轴（声压级）：以dB表示各频率的响度。比起绝对值，频段之间的相对高低更重要。',
              '线条数量：左右声道常分开绘制。两条线差异很大，说明存在左右偏差。',
            ],
          },
          { type: 'p', text: 'dB是对数单位，+6dB约为声压的两倍，+10dB在听感上约响一倍。因此曲线上看起来只有3~4dB的小山，实际听起来也相当明显。' },
        ],
      },
      {
        heading: '2. 为什么平直的曲线不是答案',
        blocks: [
          { type: 'p', text: '第一次看耳机测量曲线时，大多会在2~3kHz附近看到一个大峰，好像高频过多。其实这是正常的。音箱的声音传到我们耳中时，经过头部、耳廓和外耳道，这一频段会自然提升10dB左右，称为耳道增益（ear gain）。' },
          { type: 'p', text: '耳机跳过了这条路径，直接把声音送进外耳道，所以用测量用的人工耳（耳模拟器）测量时，必须有这个峰听起来才自然。反而完全平直的曲线实际听起来会发闷、偏暗。因此测量曲线应与目标曲线对比来读，而不是与一条平直线对比。' },
        ],
      },
      {
        heading: '3. 什么是哈曼目标曲线',
        blocks: [
          { type: 'p', text: '哈曼目标曲线是音频公司哈曼（Harman）的研究团队根据多年聆听实验制定的参考曲线。研究让大量听众盲听应用了不同EQ曲线的头戴式耳机和入耳式耳机，把平均最受欢迎的响应整理成曲线。头戴式（Over-Ear）与入耳式（In-Ear）各有一版。' },
          {
            type: 'list',
            items: [
              '低频搁架：在约100Hz以下平缓抬升，反映了听众对有分量低频的偏好。',
              '耳道增益区：2~4kHz附近的峰，用于还原自然的聆听状态。',
              '高频平缓下降：向高频逐渐降低，减少尖锐感。',
            ],
          },
          { type: 'note', title: '目标曲线是平均值', text: '即使在同一研究中，听众也分为想要更多低频和更少低频的群体，年龄和聆听经验也会影响偏好。哈曼目标曲线是许多人都会觉得不错的起点，而不是适合所有人的标准答案。' },
        ],
      },
      {
        heading: '4. 实用的读图顺序',
        blocks: [
          {
            type: 'list',
            items: [
              '比较低频：100Hz以下高于目标为低频强劲型，低于目标则为清淡型。',
              '检查中低频：200~500Hz高出目标时，听起来很可能发闷或浑浊。',
              '耳道增益区：2~4kHz高于目标时人声靠前且偏尖锐，低于目标则柔和但不够清晰。',
              '高频峰：5~10kHz间又窄又高的峰常是齿音或听感疲劳的原因。',
            ],
          },
        ],
      },
      {
        heading: '5. 测量数据的局限',
        blocks: [
          { type: 'p', text: '测量曲线来自标准化的人工耳。真实的外耳道长度和形状、耳塞插入深度因人而异，尤其是8kHz以上的高频，测量值与实际耳中的声音可能相差很大。如果耳机没有密封好，听到的低频也会远少于测量值。' },
          { type: 'p', text: 'AutoEq是一个根据测量曲线与目标曲线的差异计算校正EQ的开源项目。EQ FreeSet以这些数据为起点，再通过A/B盲听测试，根据个人的耳朵结构与喜好重新调整低音、温暖感、人声和明亮度。用测量把握设备特性，用聆听弥补个人差异。' },
        ],
      },
    ],
  },
  ja: {
    title: '周波数特性グラフとターゲットカーブの読み方',
    subtitle: '測定グラフを読み解き、同じイヤホンが人によって違って聞こえる理由を理解する',
    intro: 'イヤホンのレビューやAutoEqなどのプロジェクトでよく見かける波打った線が、周波数特性（Frequency Response、FR）グラフです。このグラフは、イヤホンがどの帯域を強調し、どの帯域を控えめに出すかを示す最も基本的な資料です。この記事では、グラフの軸と形の読み方、多くの補正EQの基準となるハーマンターゲットの意味、そして測定値だけでは自分の耳に合う音を説明しきれない理由をまとめます。',
    sections: [
      {
        heading: '1. グラフの軸を理解する',
        blocks: [
          {
            type: 'list',
            items: [
              '横軸（周波数）：左が低音（20Hz）、右が高音（20kHz）です。人の音程の感じ方に合わせて対数目盛を使うため、20〜200Hz、200Hz〜2kHz、2〜20kHzが同じ幅になります。',
              '縦軸（音圧レベル）：各周波数がどれだけ大きく出るかをdBで表します。絶対値よりも帯域間の相対的な高低が重要です。',
              '線の本数：左右のチャンネルを別々に描くことが多く、2本の線が大きくずれていれば左右差があるということです。',
            ],
          },
          { type: 'p', text: 'dBは対数単位なので、+6dBは音圧が約2倍、+10dBは体感で約2倍の大きさになります。そのためグラフ上で3〜4dBに見える丘でも、実際にはかなりはっきり聞こえます。' },
        ],
      },
      {
        heading: '2. 平らなグラフが正解ではない理由',
        blocks: [
          { type: 'p', text: 'イヤホンの測定グラフを初めて見ると、ほとんどが2〜3kHz付近に大きな山があり、高音が多すぎるように見えます。しかしこれは正常です。スピーカーの音が耳に届くとき、頭、耳介、外耳道を通ることでこの帯域が自然に10dB前後強調されます。これを耳の利得（イヤーゲイン）と呼びます。' },
          { type: 'p', text: 'イヤホンはこの経路を飛ばして外耳道に直接音を入れるため、測定用の耳モデル（イヤーシミュレーター）で測るとこの山があってはじめて自然に聞こえます。むしろグラフが完全に平らだと、実際にはこもって暗く聞こえます。そのため測定グラフは平らな線ではなく、ターゲットカーブと比べて読む必要があります。' },
        ],
      },
      {
        heading: '3. ハーマンターゲットとは',
        blocks: [
          { type: 'p', text: 'ハーマンターゲットは、オーディオ企業ハーマン（Harman）の研究チームが長年行ってきた試聴実験をもとに作られた基準カーブです。さまざまなEQカーブを適用したヘッドホンやイヤホンを多くの人にブラインドで聴いてもらい、平均して最も好まれた特性をカーブにまとめました。ヘッドホン用（Over-Ear）とイヤホン用（In-Ear）が別々にあります。' },
          {
            type: 'list',
            items: [
              '低域シェルフ：約100Hz以下をなだらかに持ち上げた形で、参加者が重みのある低音を好んだ結果が反映されています。',
              'イヤーゲイン区間：2〜4kHz付近の山で、自然な聴取状態を再現します。',
              'なだらかな高域の下降：高い周波数に向かって徐々に下がり、鋭さを抑えます。',
            ],
          },
          { type: 'note', title: 'ターゲットは平均値です', text: '同じ研究の中でも、低音をもっと欲しいグループと少なめを好むグループに分かれ、年齢や試聴経験によっても好みが異なりました。ハーマンターゲットは多くの人が無難に好む出発点であって、すべての人にとっての正解ではありません。' },
        ],
      },
      {
        heading: '4. グラフを読む実践的な順序',
        blocks: [
          {
            type: 'list',
            items: [
              '低音を比較：100Hz以下がターゲットより高ければ低音が強めの傾向、低ければあっさりした傾向です。',
              '中低域を確認：200〜500Hzがターゲットより盛り上がっていると、こもったり濁ったりして聞こえる可能性が高いです。',
              'イヤーゲイン区間：2〜4kHzがターゲットより高ければボーカルが近く鋭め、低ければ柔らかいがぼやけ気味です。',
              '高域のピーク：5〜10kHzの細く高いピークは、歯擦音や聴き疲れの原因になることが多いです。',
            ],
          },
        ],
      },
      {
        heading: '5. 測定値の限界',
        blocks: [
          { type: 'p', text: '測定グラフは標準化された耳モデルで得た結果です。実際の外耳道の長さや形、イヤーピースの挿入深さは人それぞれなので、特に8kHz以上の高音は測定値と実際の耳での音が大きく異なることがあります。イヤホンが耳をしっかり密閉できていないと、低音も測定値よりずっと少なく聞こえます。' },
          { type: 'p', text: 'AutoEqは、測定グラフとターゲットの差を計算して補正EQを作るオープンソースプロジェクトです。EQ FreeSetはこのデータを出発点とし、A/Bブラインドテストで個人の耳の構造と好みに合わせて低音、温かみ、ボーカル、明るさを再調整します。測定で機器の特性をとらえ、試聴で個人差を埋める方式です。' },
        ],
      },
    ],
  },
}

export default content
