import type { GuideContent } from '@/lib/guides'

const content: GuideContent = {
  ko: {
    title: '블라인드 테스트로 귀를 믿는 법',
    subtitle: '귀가 속는 이유와, 공정하게 듣고 고르는 방법',
    intro: '"이 이어폰이 확실히 더 좋다"는 느낌은 생각보다 쉽게 흔들립니다. 조금 더 크게 들리는 쪽, 비싸거나 유명한 쪽, 마지막에 들은 쪽이 좋게 느껴지는 경향이 있기 때문입니다. 블라인드 테스트는 이런 편향을 걷어 내고 소리 자체만으로 판단하기 위한 방법입니다. 이 글에서는 귀가 속는 대표적인 이유, 공정한 비교의 조건, 집에서 직접 해 볼 수 있는 요령, 그리고 EQ FreeSet 테스트가 이 원칙을 어떻게 적용하는지 설명합니다.',
    sections: [
      {
        heading: '1. 귀가 속는 네 가지 이유',
        blocks: [
          {
            type: 'list',
            items: [
              '음량 편향: 두 소리 중 조금이라도 큰 쪽이 더 선명하고 풍성하게 느껴집니다. 1dB 정도의 작은 차이도 선택을 바꿀 수 있어서, 비교할 때는 음량을 맞추는 것이 가장 중요합니다.',
              '기대 편향: 가격, 브랜드, 디자인, 리뷰 평가를 알고 들으면 실제 소리와 상관없이 평가가 달라집니다. 하만 등의 스피커 청취 연구에서도 제품을 보고 들을 때와 가리고 들을 때 평가가 달라지는 현상이 확인되었습니다.',
              '청각 기억의 한계: 소리의 미세한 질감을 정확히 기억하는 시간은 몇 초에 불과합니다. 몇 분씩 듣고 바꾸면 이전 소리를 기억이 아닌 인상으로 비교하게 됩니다.',
              '적응 효과: 같은 소리를 오래 들으면 뇌가 그 음색에 적응해서 처음엔 어색했던 소리도 자연스럽게 느껴집니다. 새 이어폰이 며칠 지나 좋아졌다고 느끼는 이유 중 하나입니다.',
            ],
          },
        ],
      },
      {
        heading: '2. 공정한 비교를 위한 조건',
        blocks: [
          {
            type: 'list',
            items: [
              '음량 맞추기: 비교하는 두 소리의 전체 음량을 최대한 같게 맞춥니다.',
              '정보 가리기: 어떤 쪽이 어떤 설정인지 모르는 상태에서 듣습니다.',
              '같은 구간 반복: 곡의 다른 부분을 비교하면 음악 자체의 차이를 소리 차이로 착각할 수 있습니다.',
              '짧게 자주 전환: 수 초 단위로 번갈아 들어야 청각 기억이 생생할 때 비교할 수 있습니다.',
              '모르겠다는 답 허용: 차이가 느껴지지 않을 때 억지로 고르면 판단에 우연이 섞입니다.',
            ],
          },
        ],
      },
      {
        heading: '3. ABX 테스트: 정말 차이를 듣는지 확인하기',
        blocks: [
          { type: 'p', text: '"더 좋다"를 고르는 A/B 테스트와 달리, ABX 테스트는 "구분할 수 있는가"를 확인합니다. A와 B를 들려준 뒤, 둘 중 하나를 무작위로 X로 제시하고 X가 A인지 B인지 맞히게 합니다. 차이를 못 듣는다면 정답률은 동전 던지기처럼 50% 근처에 머뭅니다.' },
          { type: 'p', text: '한두 번 맞힌 것은 우연일 수 있으므로 여러 번 반복해야 합니다. 예를 들어 16번 중 12번 이상 맞힐 확률은 순전히 찍었을 때 약 4%에 불과하기 때문에, 이 정도면 실제로 차이를 듣고 있다고 볼 수 있습니다. 고음질 음원과 일반 음원, 코덱 사이의 차이처럼 논란이 많은 주제를 스스로 확인해 볼 때 유용합니다.' },
        ],
      },
      {
        heading: '4. 집에서 듣고 고를 때의 요령',
        blocks: [
          {
            type: 'list',
            items: [
              '조용한 환경: 주변 소음은 저음과 미세한 디테일을 가장 먼저 가립니다.',
              '평소 볼륨: 실제로 음악을 듣는 볼륨에서 비교해야 일상에서도 같은 결과가 나옵니다.',
              '익숙한 곡: 수없이 들어 본 곡일수록 무엇이 달라졌는지 빠르게 알아챌 수 있습니다.',
              '귀 휴식: 20~30분 이상 집중해서 들었다면 잠시 쉬세요. 피로한 귀는 고음을 다르게 느끼고 판단이 흐려집니다.',
              '첫 판단 존중: 계속 번갈아 듣다 보면 오히려 헷갈립니다. 처음 몇 번의 전환에서 느낀 차이가 가장 정확한 경우가 많습니다.',
            ],
          },
        ],
      },
      {
        heading: '5. EQ FreeSet 테스트에 적용된 원칙',
        blocks: [
          { type: 'p', text: 'EQ FreeSet의 A/B 테스트는 위의 원칙을 바탕으로 설계되었습니다. 테스트 중에는 A와 B에 적용된 dB 값을 보여 주지 않아 숫자에 대한 선입견 없이 소리만으로 고르게 합니다. EQ로 특정 대역을 올리면 전체 음량이 커지므로, 올린 만큼 전체 볼륨을 보정해 단지 더 크게 들린다는 이유로 선택되는 일을 줄입니다.' },
          { type: 'p', text: '또한 저음, 따뜻함, 보컬, 밝기 중 지금 비교하는 특성이 잘 드러나는 음악 구간을 자동으로 골라 들려주고, 차이를 모르겠다면 "비슷함"을 선택할 수 있습니다. 16번의 선택이 쌓일수록 각 특성의 탐색 범위가 좁혀져, 마지막에는 내 귀가 실제로 선호한 방향의 EQ가 남습니다.' },
        ],
      },
    ],
  },
  en: {
    title: 'Why Blind Listening Tests Work',
    subtitle: 'Why our ears get fooled, and how to listen and choose fairly',
    intro: 'The feeling that one earphone is clearly better is easier to sway than you might think. We tend to prefer whatever is slightly louder, more expensive or more famous, or whatever we heard last. Blind testing removes these biases so the sound can be judged on its own. This guide covers the main reasons our ears get fooled, the conditions for a fair comparison, tips you can try at home, and how the EQ FreeSet test applies these principles.',
    sections: [
      {
        heading: '1. Four Reasons Our Ears Get Fooled',
        blocks: [
          {
            type: 'list',
            items: [
              'Loudness bias: Whichever of two sounds is even slightly louder seems clearer and fuller. A difference of around 1 dB can change a choice, so matching levels is the most important part of any comparison.',
              'Expectation bias: Knowing the price, brand, design or review scores changes how we rate a sound, regardless of the sound itself. Loudspeaker listening studies, including Harman’s, have shown ratings differ between sighted and blind listening.',
              'Short auditory memory: We can only remember fine details of a sound accurately for a few seconds. Switching after several minutes means comparing an impression, not a memory.',
              'Adaptation: Listen to the same sound long enough and your brain adjusts to it, so a sound that felt odd at first starts to seem natural. This is one reason new earphones seem to improve after a few days.',
            ],
          },
        ],
      },
      {
        heading: '2. Conditions for a Fair Comparison',
        blocks: [
          {
            type: 'list',
            items: [
              'Match levels: Make the overall loudness of the two sounds as equal as possible.',
              'Hide the labels: Listen without knowing which option is which setting.',
              'Repeat the same passage: Comparing different parts of a song can make musical differences seem like sound differences.',
              'Switch quickly and often: Alternating every few seconds lets you compare while your auditory memory is still fresh.',
              'Allow "I can’t tell": Forcing a choice when you hear no difference mixes chance into the result.',
            ],
          },
        ],
      },
      {
        heading: '3. ABX Testing: Do You Really Hear a Difference?',
        blocks: [
          { type: 'p', text: 'Unlike an A/B test that asks which is better, an ABX test asks whether you can tell them apart. After hearing A and B, one of them is presented at random as X, and you identify whether X is A or B. If you cannot hear a difference, your score stays near 50%, like flipping a coin.' },
          { type: 'p', text: 'Getting one or two right could be luck, so many trials are needed. For example, the chance of getting 12 or more out of 16 right by pure guessing is only about 4%, so a score like that suggests you really hear a difference. It is a useful way to check controversial topics for yourself, such as hi-res versus standard files or differences between codecs.' },
        ],
      },
      {
        heading: '4. Tips for Listening at Home',
        blocks: [
          {
            type: 'list',
            items: [
              'Quiet room: Background noise masks bass and fine detail first.',
              'Usual volume: Compare at the volume you actually listen at so the result holds in daily life.',
              'Familiar tracks: The better you know a song, the faster you notice what changed.',
              'Rest your ears: After 20–30 minutes of focused listening, take a break. Tired ears perceive treble differently and judgment gets fuzzy.',
              'Trust first impressions: Switching back and forth endlessly causes confusion. The difference you notice in the first few switches is often the most accurate.',
            ],
          },
        ],
      },
      {
        heading: '5. How the EQ FreeSet Test Applies These Principles',
        blocks: [
          { type: 'p', text: 'The EQ FreeSet A/B test is built on these principles. During the test, the dB values applied to A and B are hidden, so you choose by sound alone without being influenced by numbers. Because boosting a band with EQ raises overall loudness, the test compensates the overall volume by the boost, reducing the chance that an option wins just because it sounds louder.' },
          { type: 'p', text: 'It also automatically picks music passages where the trait being compared (bass, warmth, vocal or brightness) stands out, and you can choose "Similar" when you cannot hear a difference. As your 16 choices add up, the search range for each trait narrows, leaving an EQ that reflects what your ears actually preferred.' },
        ],
      },
    ],
  },
  zh: {
    title: '为什么要做盲听测试',
    subtitle: '耳朵为什么会被欺骗，以及如何公平地聆听与选择',
    intro: '“这款耳机明显更好”的感觉，比想象中更容易动摇。人们往往会偏爱稍微更响的、更贵或更有名的，或者最后听到的那一个。盲听测试就是为了排除这些偏差，只凭声音本身做判断。本文介绍耳朵被欺骗的主要原因、公平比较的条件、在家可以尝试的技巧，以及EQ FreeSet测试如何运用这些原则。',
    sections: [
      {
        heading: '1. 耳朵被欺骗的四个原因',
        blocks: [
          {
            type: 'list',
            items: [
              '音量偏差：两个声音中哪怕稍微响一点的那个，听起来也会更清晰、更饱满。1dB左右的小差异就可能改变选择，因此对比时最重要的是统一音量。',
              '预期偏差：知道价格、品牌、外观或评测分数后再听，评价就会改变，与实际声音无关。包括哈曼在内的音箱聆听研究也证实，看着产品听和遮住产品听，评价会不同。',
              '听觉记忆有限：能准确记住声音细微质感的时间只有几秒。听几分钟再切换，比较的就是印象而不是记忆。',
              '适应效应：同一种声音听久了，大脑会适应它的音色，起初觉得别扭的声音也会变得自然。这也是新耳机过几天听起来变好的原因之一。',
            ],
          },
        ],
      },
      {
        heading: '2. 公平比较的条件',
        blocks: [
          {
            type: 'list',
            items: [
              '统一音量：尽量让两个声音的整体响度相同。',
              '隐藏信息：在不知道哪个是哪种设置的状态下聆听。',
              '重复同一段落：比较歌曲的不同部分，容易把音乐本身的差异误认为声音差异。',
              '短时间频繁切换：每隔几秒交替聆听，才能在听觉记忆清晰时进行比较。',
              '允许“分不出来”：听不出差异时硬要选择，结果中就会混入偶然因素。',
            ],
          },
        ],
      },
      {
        heading: '3. ABX测试：确认是否真的听得出差异',
        blocks: [
          { type: 'p', text: '与选出“哪个更好”的A/B测试不同，ABX测试确认的是“能否区分”。先听A和B，然后随机把其中一个作为X播放，让你判断X是A还是B。如果听不出差异，正确率会像抛硬币一样停留在50%左右。' },
          { type: 'p', text: '答对一两次可能只是运气，所以需要多次重复。例如纯靠猜测在16次中答对12次以上的概率只有约4%，达到这个水平就可以认为确实听出了差异。想亲自验证高解析音源与普通音源、不同编解码器之间的差异等争议话题时，这种方法很有用。' },
        ],
      },
      {
        heading: '4. 在家聆听选择的技巧',
        blocks: [
          {
            type: 'list',
            items: [
              '安静的环境：环境噪音最先掩盖的是低频和细节。',
              '平时的音量：在实际听音乐的音量下比较，日常聆听时结果才一致。',
              '熟悉的歌曲：听过无数遍的歌，更能迅速察觉哪里变了。',
              '让耳朵休息：专注聆听20~30分钟以上后请稍作休息。疲劳的耳朵对高频的感知会改变，判断也会模糊。',
              '相信第一判断：反复切换反而容易混淆。最初几次切换时感受到的差异往往最准确。',
            ],
          },
        ],
      },
      {
        heading: '5. EQ FreeSet测试运用的原则',
        blocks: [
          { type: 'p', text: 'EQ FreeSet的A/B测试正是基于这些原则设计的。测试中不显示A和B所应用的dB数值，让你不受数字先入为主的影响，只凭声音选择。用EQ提升某个频段会使整体音量变大，因此测试会按提升量补偿整体音量，减少仅因听起来更响而被选中的情况。' },
          { type: 'p', text: '此外，测试会自动挑选能突出当前比较特性（低音、温暖感、人声、明亮度）的音乐段落播放；听不出差异时可以选择“差不多”。随着16次选择的累积，每个特性的搜索范围逐渐缩小，最后留下的就是你的耳朵真正偏好的EQ。' },
        ],
      },
    ],
  },
  ja: {
    title: 'ブラインドテストで耳を信じる方法',
    subtitle: '耳がだまされる理由と、公平に聴き比べて選ぶ方法',
    intro: '「このイヤホンのほうが明らかにいい」という感覚は、思ったより簡単に揺らぎます。少し大きく聞こえるほう、高価だったり有名だったりするほう、最後に聴いたほうを良いと感じる傾向があるからです。ブラインドテストは、こうしたバイアスを取り除き、音そのものだけで判断するための方法です。この記事では、耳がだまされる代表的な理由、公平な比較の条件、自宅で試せるコツ、そしてEQ FreeSetのテストがこの原則をどう取り入れているかを説明します。',
    sections: [
      {
        heading: '1. 耳がだまされる4つの理由',
        blocks: [
          {
            type: 'list',
            items: [
              '音量バイアス：2つの音のうち少しでも大きいほうが、より鮮明で豊かに感じられます。1dB程度の小さな差でも選択が変わることがあるため、比較では音量をそろえることが最も重要です。',
              '期待バイアス：価格、ブランド、デザイン、レビュー評価を知ってから聴くと、実際の音とは関係なく評価が変わります。ハーマンなどのスピーカー試聴研究でも、製品を見ながら聴く場合と隠して聴く場合で評価が変わることが確認されています。',
              '聴覚記憶の限界：音の細かな質感を正確に覚えていられるのは数秒程度です。数分ずつ聴いてから切り替えると、記憶ではなく印象で比べることになります。',
              '順応効果：同じ音を長く聴くと脳がその音色に慣れ、最初は違和感のあった音も自然に感じられるようになります。新しいイヤホンが数日で良くなったと感じる理由の一つです。',
            ],
          },
        ],
      },
      {
        heading: '2. 公平な比較のための条件',
        blocks: [
          {
            type: 'list',
            items: [
              '音量をそろえる：比べる2つの音の全体の音量をできるだけ同じにします。',
              '情報を隠す：どちらがどの設定かわからない状態で聴きます。',
              '同じ箇所を繰り返す：曲の別の部分を比べると、音楽自体の違いを音の違いと勘違いしやすくなります。',
              '短く頻繁に切り替える：数秒ごとに交互に聴くことで、聴覚記憶が鮮明なうちに比べられます。',
              '「わからない」を認める：違いを感じないのに無理に選ぶと、判断に偶然が混ざります。',
            ],
          },
        ],
      },
      {
        heading: '3. ABXテスト：本当に違いが聞こえるか確かめる',
        blocks: [
          { type: 'p', text: '「どちらが良いか」を選ぶA/Bテストと違い、ABXテストは「聴き分けられるか」を確かめます。AとBを聴いたあと、どちらかをランダムにXとして提示し、XがAかBかを当てます。違いが聞こえなければ、正答率はコイン投げのように50%前後にとどまります。' },
          { type: 'p', text: '1〜2回当たっただけでは偶然かもしれないので、何度も繰り返す必要があります。たとえば16回中12回以上当たる確率は、完全に当てずっぽうなら約4%しかないため、このくらい当たれば実際に違いを聴き取れていると考えられます。ハイレゾ音源と通常音源、コーデック間の違いなど、議論の多いテーマを自分で確かめるときに役立ちます。' },
        ],
      },
      {
        heading: '4. 自宅で聴き比べるときのコツ',
        blocks: [
          {
            type: 'list',
            items: [
              '静かな環境：周囲の騒音は、低音と細かなディテールを真っ先に覆い隠します。',
              'いつもの音量：実際に音楽を聴く音量で比べれば、日常でも同じ結果になります。',
              '聴き慣れた曲：何度も聴いた曲ほど、何が変わったかにすぐ気づけます。',
              '耳を休める：20〜30分以上集中して聴いたら少し休みましょう。疲れた耳は高音の感じ方が変わり、判断が鈍ります。',
              '最初の判断を大切に：何度も切り替えているとかえって迷います。最初の数回の切り替えで感じた違いが最も正確なことが多いです。',
            ],
          },
        ],
      },
      {
        heading: '5. EQ FreeSetのテストに取り入れた原則',
        blocks: [
          { type: 'p', text: 'EQ FreeSetのA/Bテストは、これらの原則をもとに設計されています。テスト中はAとBに適用されたdB値を表示しないため、数字への先入観なしに音だけで選べます。EQで特定の帯域を上げると全体の音量が大きくなるので、上げた分だけ全体の音量を補正し、単に大きく聞こえるという理由で選ばれることを減らしています。' },
          { type: 'p', text: 'さらに、低音・温かみ・ボーカル・明るさのうち、いま比べている特性がよく表れる音楽の区間を自動で選んで再生し、違いがわからなければ「同じくらい」を選べます。16回の選択が積み重なるほど各特性の探索範囲が狭まり、最後には自分の耳が実際に好んだ方向のEQが残ります。' },
        ],
      },
    ],
  },
}

export default content
