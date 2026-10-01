import type { GuideContent } from '@/lib/guides'

const content: GuideContent = {
  ko: {
    title: '주파수 대역별 소리 가이드',
    subtitle: '저음부터 초고음까지, EQ 슬라이더 하나하나가 무엇을 바꾸는지',
    intro: 'EQ 화면에는 60Hz, 250Hz, 4kHz처럼 숫자만 적혀 있어서 어떤 슬라이더를 움직여야 원하는 소리가 나는지 감을 잡기 어렵습니다. 하지만 대역별로 담당하는 소리와, 너무 많거나 적을 때 나타나는 증상을 알고 나면 "먹먹하다", "귀가 아프다" 같은 느낌을 정확한 주파수로 바꿀 수 있습니다. 이 글은 사람이 들을 수 있는 약 20Hz~20kHz 범위를 일곱 구간으로 나눠 설명합니다.',
    sections: [
      {
        heading: '1. 한눈에 보는 대역별 특징',
        blocks: [
          {
            type: 'table',
            head: ['대역', '범위', '담당하는 소리', '많으면', '적으면'],
            rows: [
              ['초저음', '20~60Hz', '몸으로 느끼는 울림, 킥과 신스 베이스의 바닥', '웅웅거리고 쉽게 피곤함', '가볍고 무게감이 없음'],
              ['저음', '60~250Hz', '베이스 기타, 킥 드럼의 펀치, 따뜻함', '둔탁하고 보컬을 덮음', '힘이 없고 얇음'],
              ['중저음', '250~500Hz', '악기의 몸통, 남성 보컬의 두께', '탁하고 먹먹함', '차갑고 속이 빈 느낌'],
              ['중음', '500Hz~2kHz', '보컬과 악기의 본체, 멜로디', '콧소리, 통 속에서 울리는 소리', '보컬이 멀어짐'],
              ['중고음', '2~4kHz', '명료도, 말소리 이해도', '쏘고 귀가 아픔', '흐릿하고 답답함'],
              ['프레즌스', '4~8kHz', '자음, 심벌 어택, 치찰음', '"ㅅ·ㅊ" 소리가 거슬림', '둔하고 생기가 없음'],
              ['초고음', '8~20kHz', '공기감, 공간감, 배음', '날카롭고 쉭쉭거림', '답답하고 좁게 들림'],
            ],
          },
          { type: 'p', text: '경계는 정확히 나뉘는 것이 아니라 서로 겹칩니다. 예를 들어 킥 드럼은 60Hz 근처의 울림과 3kHz 근처의 "탁" 하는 어택을 동시에 가지고 있어서, 저음만 올리면 둥둥거리기만 하고 타격감은 그대로일 수 있습니다.' },
        ],
      },
      {
        heading: '2. 귀가 가장 예민한 2~5kHz',
        blocks: [
          { type: 'p', text: '사람의 외이도는 길이가 약 2.5cm인 관이라서 3kHz 전후에서 자연스럽게 공명이 일어납니다. 그래서 같은 크기의 소리라도 이 대역을 가장 크게 느낍니다. 말소리의 자음 정보도 이 근처에 몰려 있어서, 사람의 청각은 이 대역에 특히 민감하게 진화했습니다.' },
          { type: 'p', text: '이 때문에 2~5kHz는 1~2dB만 바꿔도 체감 차이가 큽니다. 소리가 날카롭다고 느껴질 때 고음 전체를 깎기보다 이 구간을 먼저 살짝 줄여 보는 것이 효과적이고, 반대로 보컬이 묻힌다면 이 구간을 조금만 올려도 충분한 경우가 많습니다.' },
        ],
      },
      {
        heading: '3. 느낌을 주파수로 바꾸는 법',
        blocks: [
          { type: 'p', text: '소리에 대한 흔한 표현과 그에 해당하는 대역을 정리하면 다음과 같습니다. 문제가 느껴지면 표현을 먼저 고르고, 해당 대역을 1~2dB씩 조절해 보세요.' },
          {
            type: 'list',
            items: [
              '먹먹하다, 탁하다: 200~400Hz를 1~3dB 낮춰 보세요.',
              '붕붕거린다, 저음이 퍼진다: 100~200Hz를 낮추고 60Hz 이하는 유지합니다.',
              '얇다, 힘이 없다: 80~150Hz를 조금 올립니다.',
              '통 속에서 울리는 것 같다: 700Hz~1kHz 근처를 좁게 낮춥니다.',
              '쏜다, 귀가 아프다: 2.5~4kHz를 낮춥니다.',
              '"ㅅ" 소리가 찌른다: 5~8kHz에서 거슬리는 지점을 찾아 좁게 낮춥니다.',
              '답답하다, 공간이 좁다: 10kHz 이상을 1~2dB 올립니다.',
            ],
          },
          { type: 'note', title: '정확한 지점 찾기: 스윕 기법', text: '파라메트릭 EQ가 있다면 Q를 4 정도로 좁게 하고 +6dB 정도 올린 뒤 주파수를 천천히 움직여 보세요. 문제가 가장 심해지는 지점이 바로 그 주파수입니다. 위치를 찾았으면 게인을 마이너스로 바꿔 2~3dB 정도 낮추면 됩니다.' },
        ],
      },
      {
        heading: '4. 볼륨에 따라 균형이 달라지는 이유',
        blocks: [
          { type: 'p', text: '사람의 귀는 작은 소리에서 저음과 초고음을 덜 느낍니다. 이것을 등청감 곡선(Fletcher–Munson 곡선, 현재 표준은 ISO 226)이라고 부릅니다. 같은 음악을 작게 들으면 저음이 빠진 것처럼, 크게 들으면 저음과 고음이 풍부한 것처럼 느껴집니다.' },
          {
            type: 'list',
            items: [
              '평소 듣는 볼륨에서 판단: EQ는 실제로 음악을 듣는 볼륨에서 맞춰야 일상에서도 같은 균형으로 들립니다.',
              '큰 볼륨으로 맞추지 않기: 크게 듣고 맞춘 EQ는 평소 볼륨에서 밋밋하게 들리고, 그만큼 볼륨을 더 올리게 되어 청력에도 좋지 않습니다.',
              '작게 들을 때의 보완: 밤에 작게 듣는다면 저음과 초고음을 1~2dB 올린 별도 프리셋을 만들어 두는 것도 방법입니다.',
            ],
          },
        ],
      },
      {
        heading: '5. EQ FreeSet의 네 가지 축과의 관계',
        blocks: [
          { type: 'p', text: 'EQ FreeSet 테스트의 네 가지 비교 항목은 위의 대역을 사람이 이해하기 쉬운 특성으로 묶은 것입니다. 10밴드 기준으로 저음은 32Hz와 64Hz(초저음~저음), 따뜻함은 125Hz와 250Hz(저음 위쪽~중저음), 보컬은 500Hz와 1kHz(중음), 밝기는 2kHz부터 16kHz까지(중고음~초고음)를 함께 움직입니다. 그래서 테스트에서 어떤 항목을 선호했는지를 보면 내 취향이 어느 대역에 있는지도 함께 알 수 있습니다.' },
        ],
      },
    ],
  },
  en: {
    title: 'Frequency Band Sound Guide',
    subtitle: 'From sub-bass to air: what each EQ slider actually changes',
    intro: 'EQ screens only show numbers like 60 Hz, 250 Hz or 4 kHz, which makes it hard to know which slider gives you the sound you want. Once you know what each band carries and what happens when there is too much or too little, you can translate feelings like "muffled" or "it hurts my ears" into specific frequencies. This guide splits the roughly 20 Hz to 20 kHz range of human hearing into seven regions.',
    sections: [
      {
        heading: '1. Bands at a Glance',
        blocks: [
          {
            type: 'table',
            head: ['Band', 'Range', 'What it carries', 'Too much', 'Too little'],
            rows: [
              ['Sub-bass', '20–60 Hz', 'Rumble you feel, the floor of kicks and synth bass', 'Boomy, tiring', 'Light, no weight'],
              ['Bass', '60–250 Hz', 'Bass guitar, kick punch, warmth', 'Thick, covers vocals', 'Weak, thin'],
              ['Low mids', '250–500 Hz', 'Body of instruments, thickness of male vocals', 'Muddy, muffled', 'Cold, hollow'],
              ['Mids', '500 Hz–2 kHz', 'Core of vocals and instruments, melody', 'Nasal, boxy', 'Vocals sound distant'],
              ['Upper mids', '2–4 kHz', 'Clarity, speech intelligibility', 'Shouty, painful', 'Dull, veiled'],
              ['Presence', '4–8 kHz', 'Consonants, cymbal attack, sibilance', 'Harsh "s" sounds', 'Lifeless'],
              ['Air', '8–20 kHz', 'Airiness, space, overtones', 'Sharp, hissy', 'Closed-in, narrow'],
            ],
          },
          { type: 'p', text: 'These boundaries overlap rather than split cleanly. A kick drum, for example, has both a rumble near 60 Hz and a click of attack near 3 kHz, so boosting only the bass can make it boom more without adding any punch.' },
        ],
      },
      {
        heading: '2. Why 2–5 kHz Is So Sensitive',
        blocks: [
          { type: 'p', text: 'The human ear canal is a tube about 2.5 cm long, so it naturally resonates around 3 kHz. As a result, we hear this region as louder than others at the same level. Much of the consonant information in speech also sits here, so our hearing has evolved to be especially sensitive to it.' },
          { type: 'p', text: 'That is why even a 1–2 dB change between 2 and 5 kHz is very noticeable. If sound feels sharp, try trimming this region slightly before cutting all the treble. If vocals feel buried, a small lift here is often enough.' },
        ],
      },
      {
        heading: '3. Turning Feelings into Frequencies',
        blocks: [
          { type: 'p', text: 'Here are common descriptions of sound and the bands they usually point to. When something bothers you, pick the description first, then adjust that band by 1–2 dB at a time.' },
          {
            type: 'list',
            items: [
              'Muffled or muddy: Try cutting 200–400 Hz by 1–3 dB.',
              'Boomy, bass spreads everywhere: Cut 100–200 Hz while leaving below 60 Hz alone.',
              'Thin or weak: Raise 80–150 Hz a little.',
              'Sounds like it is in a box: Make a narrow cut around 700 Hz–1 kHz.',
              'Shouty or painful: Cut 2.5–4 kHz.',
              'Piercing "s" sounds: Find the harsh spot between 5 and 8 kHz and make a narrow cut.',
              'Closed-in, no space: Lift above 10 kHz by 1–2 dB.',
            ],
          },
          { type: 'note', title: 'Finding the exact spot: the sweep technique', text: 'With a parametric EQ, set a narrow Q of about 4, boost by around +6 dB, and slowly move the frequency. The point where the problem gets worst is the frequency you are looking for. Once found, flip the gain negative and cut by 2–3 dB.' },
        ],
      },
      {
        heading: '4. Why Balance Changes with Volume',
        blocks: [
          { type: 'p', text: 'Our ears perceive less bass and extreme treble at low volume. This is described by equal-loudness contours (the Fletcher–Munson curves, standardized today as ISO 226). Music played quietly seems to lose its bass, while the same music played loudly seems rich in bass and treble.' },
          {
            type: 'list',
            items: [
              'Judge at your usual volume: Set EQ at the volume you actually listen at so the balance holds in daily use.',
              'Do not tune loud: EQ tuned at high volume sounds flat at normal volume, which tempts you to turn it up, and that is bad for your hearing.',
              'For quiet listening: If you listen quietly at night, consider a separate preset with bass and air raised by 1–2 dB.',
            ],
          },
        ],
      },
      {
        heading: '5. How This Maps to EQ FreeSet’s Four Axes',
        blocks: [
          { type: 'p', text: 'The four comparisons in the EQ FreeSet test group these bands into traits that are easy to recognize. On the 10-band EQ, bass moves 32 Hz and 64 Hz (sub-bass to bass), warmth moves 125 Hz and 250 Hz (upper bass to low mids), vocal moves 500 Hz and 1 kHz (mids), and brightness moves 2 kHz through 16 kHz (upper mids to air). So the options you preferred in the test also reveal which bands your taste leans toward.' },
        ],
      },
    ],
  },
  zh: {
    title: '各频段声音指南',
    subtitle: '从超低频到极高频，每个EQ滑块到底改变了什么',
    intro: 'EQ界面上只写着60Hz、250Hz、4kHz这样的数字，很难知道该动哪个滑块才能得到想要的声音。但只要了解各频段负责的声音，以及过多或过少时的表现，就能把“发闷”“刺耳”这类感受转换成具体的频率。本文把人耳可听的约20Hz~20kHz范围分为七个区段进行说明。',
    sections: [
      {
        heading: '1. 各频段特点一览',
        blocks: [
          {
            type: 'table',
            head: ['频段', '范围', '负责的声音', '过多时', '过少时'],
            rows: [
              ['超低频', '20~60Hz', '身体感受到的震动，底鼓与合成器贝斯的下潜', '轰鸣、容易疲劳', '轻飘、没有重量感'],
              ['低频', '60~250Hz', '贝斯、底鼓的冲击力、温暖感', '浑厚压人、盖住人声', '无力、单薄'],
              ['中低频', '250~500Hz', '乐器的琴体感、男声的厚度', '浑浊、发闷', '冷淡、空洞'],
              ['中频', '500Hz~2kHz', '人声与乐器的主体、旋律', '鼻音重、像在箱子里', '人声显得遥远'],
              ['中高频', '2~4kHz', '清晰度、语音可懂度', '喊叫感、刺耳', '朦胧、发闷'],
              ['临场感', '4~8kHz', '辅音、镲片起音、齿音', '“s”音刺耳', '呆板、缺乏生气'],
              ['极高频', '8~20kHz', '空气感、空间感、泛音', '尖锐、嘶嘶声', '憋闷、狭窄'],
            ],
          },
          { type: 'p', text: '各频段的边界并非截然分开，而是相互重叠的。例如底鼓同时含有60Hz附近的震动和3kHz附近的“嗒”声起音，只提升低频可能只会更轰鸣，冲击力却没有变化。' },
        ],
      },
      {
        heading: '2. 耳朵最敏感的2~5kHz',
        blocks: [
          { type: 'p', text: '人的外耳道是长约2.5cm的管道，在3kHz左右会自然产生共振。因此即使声音大小相同，我们也会觉得这个频段最响。语音中的辅音信息也集中在这附近，所以人的听觉对这一频段特别敏感。' },
          { type: 'p', text: '因此在2~5kHz之间，哪怕只改动1~2dB，听感差异也很大。觉得声音尖锐时，与其削减全部高频，不如先稍微降低这一段；反之如果人声被掩盖，稍微提升这里往往就足够了。' },
        ],
      },
      {
        heading: '3. 把感受转换成频率',
        blocks: [
          { type: 'p', text: '下面整理了常见的声音描述及其对应的频段。感觉有问题时，先选出对应的描述，再以1~2dB为单位调整该频段。' },
          {
            type: 'list',
            items: [
              '发闷、浑浊：尝试把200~400Hz降低1~3dB。',
              '轰鸣、低频发散：降低100~200Hz，60Hz以下保持不变。',
              '单薄、无力：稍微提升80~150Hz。',
              '像在箱子里：在700Hz~1kHz附近做窄幅衰减。',
              '刺耳、耳朵疼：降低2.5~4kHz。',
              '“s”音扎耳：在5~8kHz间找到刺耳点并窄幅衰减。',
              '憋闷、空间狭窄：把10kHz以上提升1~2dB。',
            ],
          },
          { type: 'note', title: '找到准确位置：扫频法', text: '如果有参数EQ，把Q设为4左右的窄值，提升约+6dB后慢慢移动频率。问题最明显的位置就是要找的频率。找到后把增益改为负值，衰减2~3dB即可。' },
        ],
      },
      {
        heading: '4. 音量不同，平衡也不同',
        blocks: [
          { type: 'p', text: '人耳在小音量时对低频和极高频的感知会减弱，这可以用等响曲线（Fletcher–Munson曲线，现行标准为ISO 226）来描述。同一首歌小声听时好像少了低频，大声听时则觉得低频和高频都很丰富。' },
          {
            type: 'list',
            items: [
              '在平时的音量下判断：在实际听音乐的音量下调整EQ，日常聆听时才能保持同样的平衡。',
              '不要大声调音：在大音量下调好的EQ，在正常音量下会显得平淡，让人不自觉调高音量，对听力不利。',
              '小音量时的补偿：如果晚上常小声听，可以另存一个低频和极高频提升1~2dB的预设。',
            ],
          },
        ],
      },
      {
        heading: '5. 与EQ FreeSet四个维度的关系',
        blocks: [
          { type: 'p', text: 'EQ FreeSet测试的四个对比项目，是把上述频段归纳成易于理解的特性。以10段EQ为准，低音调整32Hz和64Hz（超低频~低频），温暖感调整125Hz和250Hz（低频上部~中低频），人声调整500Hz和1kHz（中频），明亮度调整2kHz至16kHz（中高频~极高频）。因此从测试中偏好的选项，也能看出自己的喜好偏向哪些频段。' },
        ],
      },
    ],
  },
  ja: {
    title: '周波数帯域別サウンドガイド',
    subtitle: '超低域から超高域まで、EQのスライダーが何を変えるのか',
    intro: 'EQ画面には60Hz、250Hz、4kHzのような数字しか書かれていないため、どのスライダーを動かせば欲しい音になるのか感覚をつかみにくいものです。しかし帯域ごとに担当する音と、多すぎる・少なすぎるときの症状を知れば、「こもる」「耳が痛い」といった感覚を具体的な周波数に置き換えられます。この記事では、人が聞こえる約20Hz〜20kHzの範囲を7つの区間に分けて説明します。',
    sections: [
      {
        heading: '1. 帯域ごとの特徴一覧',
        blocks: [
          {
            type: 'table',
            head: ['帯域', '範囲', '担当する音', '多すぎると', '少なすぎると'],
            rows: [
              ['超低域', '20〜60Hz', '体で感じる響き、キックやシンセベースの底', 'ブーミーで疲れやすい', '軽く重みがない'],
              ['低域', '60〜250Hz', 'ベース、キックのパンチ、温かみ', '鈍くボーカルを覆う', '力がなく薄い'],
              ['中低域', '250〜500Hz', '楽器の胴鳴り、男性ボーカルの厚み', '濁ってこもる', '冷たく中身がない'],
              ['中域', '500Hz〜2kHz', 'ボーカルと楽器の本体、メロディ', '鼻にかかった、箱鳴り', 'ボーカルが遠い'],
              ['中高域', '2〜4kHz', '明瞭さ、言葉の聞き取りやすさ', '刺さって耳が痛い', 'ぼやけて曇る'],
              ['プレゼンス', '4〜8kHz', '子音、シンバルのアタック、歯擦音', '「サ行」が耳障り', '鈍く生気がない'],
              ['超高域', '8〜20kHz', '空気感、空間、倍音', '鋭くシャリシャリ', '詰まって狭い'],
            ],
          },
          { type: 'p', text: '境界はきっちり分かれているわけではなく、互いに重なっています。たとえばキックドラムは60Hz付近の響きと3kHz付近の「パツッ」というアタックを同時に持っているため、低域だけを上げてもドンドン響くだけで、打撃感は変わらないことがあります。' },
        ],
      },
      {
        heading: '2. 耳が最も敏感な2〜5kHz',
        blocks: [
          { type: 'p', text: '人の外耳道は長さ約2.5cmの管なので、3kHz前後で自然に共鳴が起こります。そのため同じ大きさの音でも、この帯域を最も大きく感じます。話し声の子音の情報もこの付近に集まっており、人の聴覚はこの帯域に特に敏感です。' },
          { type: 'p', text: 'そのため2〜5kHzは1〜2dB変えるだけでも体感差が大きくなります。音が鋭いと感じたら高域全体を削る前にこの区間を少し下げてみるのが効果的で、逆にボーカルが埋もれるならここを少し上げるだけで十分なことが多いです。' },
        ],
      },
      {
        heading: '3. 感覚を周波数に置き換える方法',
        blocks: [
          { type: 'p', text: '音に関するよくある表現と、それに対応する帯域をまとめました。気になる点があれば、まず表現を選び、その帯域を1〜2dBずつ調整してみてください。' },
          {
            type: 'list',
            items: [
              'こもる・濁る：200〜400Hzを1〜3dB下げてみましょう。',
              'ブーミー・低音が広がる：100〜200Hzを下げ、60Hz以下はそのままにします。',
              '薄い・力がない：80〜150Hzを少し上げます。',
              '箱の中で鳴っているよう：700Hz〜1kHz付近を狭く下げます。',
              '刺さる・耳が痛い：2.5〜4kHzを下げます。',
              '「サ行」が刺さる：5〜8kHzで耳障りなポイントを探し、狭く下げます。',
              '詰まった感じ・空間が狭い：10kHz以上を1〜2dB上げます。',
            ],
          },
          { type: 'note', title: '正確なポイントを探す：スイープ法', text: 'パラメトリックEQがあれば、Qを4程度に狭くして+6dBほど上げ、周波数をゆっくり動かしてみてください。問題が最もひどくなる位置がその周波数です。見つかったらゲインをマイナスにして2〜3dBほど下げればOKです。' },
        ],
      },
      {
        heading: '4. 音量でバランスが変わる理由',
        blocks: [
          { type: 'p', text: '人の耳は小さな音では低域と超高域を感じにくくなります。これを等ラウドネス曲線（フレッチャー・マンソン曲線、現在の規格はISO 226）と呼びます。同じ曲でも小さく聴くと低音が抜けたように、大きく聴くと低音と高音が豊かに感じられます。' },
          {
            type: 'list',
            items: [
              'いつもの音量で判断：EQは実際に音楽を聴く音量で合わせると、日常でも同じバランスで聴こえます。',
              '大音量で合わせない：大きな音で合わせたEQは普段の音量では物足りなく聴こえ、つい音量を上げてしまうので聴力にもよくありません。',
              '小音量のときの補正：夜に小さく聴くなら、低域と超高域を1〜2dB上げた別のプリセットを用意しておくのも一つの方法です。',
            ],
          },
        ],
      },
      {
        heading: '5. EQ FreeSetの4つの軸との関係',
        blocks: [
          { type: 'p', text: 'EQ FreeSetテストの4つの比較項目は、上の帯域をわかりやすい特性にまとめたものです。10バンド基準で、低音は32Hzと64Hz（超低域〜低域）、温かみは125Hzと250Hz（低域上部〜中低域）、ボーカルは500Hzと1kHz（中域）、明るさは2kHzから16kHz（中高域〜超高域）をまとめて動かします。そのため、テストでどの選択肢を好んだかを見れば、自分の好みがどの帯域にあるかもわかります。' },
        ],
      },
    ],
  },
}

export default content
