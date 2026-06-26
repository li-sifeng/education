// 译林版（苏州）英语 四年级上册 4A 听写词句库（初稿）
// ============================================================
// 数据结构：按 Unit 分组。每个 Unit 含 unit(单元号)、title(单元标题)、
//   words(单词数组) 和 sentences(句子数组，可选)。
//   每个词条：{ en: "英文", zh: "中文意思", tip: "可选额外提示" }
//
// ⚠️⚠️ 重要：以下为「小胖」依据译林版（译林出版社）小学英语 4A 四年级上册
//   整理的【初稿】，供丰哥/家长校对。教材以课本「单词表 / Checkout time」为准。
//   联网搜索当时受限（百度/Bing 反爬），单词为标准教材内容，请对照孩子课本核对：
//   - 划掉多余、补上遗漏、改正拼写
//   - 直接编辑本文件对应词条即可，保存后刷新网页生效
//
// 听写玩法：播放英文发音 + 显示中文意思 → 小朋友键盘打出英文单词/句子。
// confidence: high=较有把握 / check=请重点核对
// ============================================================

window.ENGLISH_DATA = {
  grade: "四年级上册 (4A)",
  version: "译林版（苏州）",
  lessons: [
    // ===================== Unit 1 =====================
    {
      unit: 1, title: "I like dogs", confidence: "high",
      words: [
        { en: "dog", zh: "狗" },
        { en: "cat", zh: "猫" },
        { en: "tiger", zh: "老虎" },
        { en: "monkey", zh: "猴子" },
        { en: "panda", zh: "熊猫" },
        { en: "elephant", zh: "大象" },
        { en: "lion", zh: "狮子" },
        { en: "zebra", zh: "斑马" },
        { en: "fox", zh: "狐狸" },
        { en: "horse", zh: "马" },
        { en: "like", zh: "喜欢" },
        { en: "they", zh: "他们；它们" },
        { en: "them", zh: "他们；它们（宾格）" },
        { en: "really", zh: "真地；确实" },
        { en: "so", zh: "如此；这么" },
        { en: "cute", zh: "可爱的" }
      ],
      sentences: [
        { en: "I like dogs.", zh: "我喜欢狗。" },
        { en: "Do you like cats?", zh: "你喜欢猫吗？" },
        { en: "I don't like tigers.", zh: "我不喜欢老虎。" },
        { en: "They are so cute.", zh: "它们如此可爱。" }
      ]
    },

    // ===================== Unit 2 =====================
    {
      unit: 2, title: "Let's make a fruit salad", confidence: "high",
      words: [
        { en: "fruit", zh: "水果" },
        { en: "salad", zh: "沙拉" },
        { en: "apple", zh: "苹果" },
        { en: "banana", zh: "香蕉" },
        { en: "orange", zh: "橙子" },
        { en: "mango", zh: "芒果" },
        { en: "pineapple", zh: "菠萝" },
        { en: "grape", zh: "葡萄" },
        { en: "make", zh: "制作" },
        { en: "have", zh: "有；吃" },
        { en: "any", zh: "一些；任何" },
        { en: "some", zh: "一些" },
        { en: "wait", zh: "等待" },
        { en: "great", zh: "太好了；极好的" }
      ],
      sentences: [
        { en: "Let's make a fruit salad.", zh: "让我们做一份水果沙拉。" },
        { en: "Have we got any grapes?", zh: "我们有葡萄吗？" },
        { en: "I've got a mango.", zh: "我有一个芒果。" }
      ]
    },

    // ===================== Unit 3 =====================
    {
      unit: 3, title: "How many?", confidence: "high",
      words: [
        { en: "many", zh: "许多" },
        { en: "how many", zh: "多少（数量）" },
        { en: "crayon", zh: "蜡笔" },
        { en: "pen", zh: "钢笔" },
        { en: "pencil", zh: "铅笔" },
        { en: "ruler", zh: "尺子" },
        { en: "rubber", zh: "橡皮" },
        { en: "book", zh: "书" },
        { en: "pencil box", zh: "铅笔盒" },
        { en: "schoolbag", zh: "书包" },
        { en: "twelve", zh: "十二" },
        { en: "thirteen", zh: "十三" },
        { en: "fifteen", zh: "十五" },
        { en: "eighteen", zh: "十八" },
        { en: "twenty", zh: "二十" }
      ],
      sentences: [
        { en: "How many crayons have you got?", zh: "你有多少支蜡笔？" },
        { en: "I've got twelve.", zh: "我有十二支。" },
        { en: "Look at my pencils.", zh: "看我的铅笔。" }
      ]
    },

    // ===================== Unit 4 =====================
    {
      unit: 4, title: "I can play basketball", confidence: "high",
      words: [
        { en: "can", zh: "能；会" },
        { en: "play", zh: "玩；打（球）" },
        { en: "basketball", zh: "篮球" },
        { en: "football", zh: "足球" },
        { en: "table tennis", zh: "乒乓球" },
        { en: "jump", zh: "跳" },
        { en: "run", zh: "跑" },
        { en: "swim", zh: "游泳" },
        { en: "skate", zh: "滑冰" },
        { en: "sing", zh: "唱歌" },
        { en: "dance", zh: "跳舞" },
        { en: "great", zh: "棒极了" },
        { en: "come on", zh: "加油；快点" },
        { en: "try", zh: "尝试" }
      ],
      sentences: [
        { en: "I can play basketball.", zh: "我会打篮球。" },
        { en: "Can you swim?", zh: "你会游泳吗？" },
        { en: "I can't skate.", zh: "我不会滑冰。" }
      ]
    },

    // ===================== Unit 5 =====================
    {
      unit: 5, title: "Our new home", confidence: "high",
      words: [
        { en: "home", zh: "家" },
        { en: "new", zh: "新的" },
        { en: "bedroom", zh: "卧室" },
        { en: "kitchen", zh: "厨房" },
        { en: "bathroom", zh: "浴室；卫生间" },
        { en: "living room", zh: "客厅" },
        { en: "study", zh: "书房" },
        { en: "table", zh: "桌子" },
        { en: "chair", zh: "椅子" },
        { en: "sofa", zh: "沙发" },
        { en: "bed", zh: "床" },
        { en: "fridge", zh: "冰箱" },
        { en: "where", zh: "在哪里" },
        { en: "in", zh: "在……里面" },
        { en: "on", zh: "在……上面" },
        { en: "behind", zh: "在……后面" }
      ],
      sentences: [
        { en: "Where are the books?", zh: "书在哪里？" },
        { en: "They're on the table.", zh: "它们在桌子上。" },
        { en: "This is our new home.", zh: "这是我们的新家。" }
      ]
    },

    // ===================== Unit 6 =====================
    {
      unit: 6, title: "At the snack bar", confidence: "high",
      words: [
        { en: "snack bar", zh: "小吃店" },
        { en: "hamburger", zh: "汉堡包" },
        { en: "hot dog", zh: "热狗" },
        { en: "noodles", zh: "面条" },
        { en: "rice", zh: "米饭" },
        { en: "bread", zh: "面包" },
        { en: "biscuit", zh: "饼干" },
        { en: "juice", zh: "果汁" },
        { en: "milk", zh: "牛奶" },
        { en: "tea", zh: "茶" },
        { en: "coffee", zh: "咖啡" },
        { en: "water", zh: "水" },
        { en: "want", zh: "想要" },
        { en: "help", zh: "帮助" }
      ],
      sentences: [
        { en: "What would you like?", zh: "你想要什么？" },
        { en: "I'd like a hot dog.", zh: "我想要一个热狗。" },
        { en: "A glass of milk, please.", zh: "请来一杯牛奶。" }
      ]
    },

    // ===================== Unit 7 =====================
    {
      unit: 7, title: "How much?", confidence: "high",
      words: [
        { en: "how much", zh: "多少钱" },
        { en: "much", zh: "许多（不可数）" },
        { en: "umbrella", zh: "雨伞" },
        { en: "scarf", zh: "围巾" },
        { en: "gloves", zh: "手套" },
        { en: "skirt", zh: "短裙" },
        { en: "T-shirt", zh: "T恤衫" },
        { en: "shirt", zh: "衬衫" },
        { en: "sweater", zh: "毛衣" },
        { en: "coat", zh: "外套" },
        { en: "yuan", zh: "元（人民币）" },
        { en: "nice", zh: "漂亮的；好的" },
        { en: "buy", zh: "买" },
        { en: "for", zh: "为了；给" }
      ],
      sentences: [
        { en: "How much is this scarf?", zh: "这条围巾多少钱？" },
        { en: "It's ninety yuan.", zh: "它九十元。" },
        { en: "I like this T-shirt.", zh: "我喜欢这件T恤。" }
      ]
    },

    // ===================== Unit 8 =====================
    {
      unit: 8, title: "Dolls", confidence: "high",
      words: [
        { en: "doll", zh: "玩具娃娃" },
        { en: "head", zh: "头" },
        { en: "hair", zh: "头发" },
        { en: "face", zh: "脸" },
        { en: "ear", zh: "耳朵" },
        { en: "eye", zh: "眼睛" },
        { en: "nose", zh: "鼻子" },
        { en: "mouth", zh: "嘴" },
        { en: "arm", zh: "手臂" },
        { en: "hand", zh: "手" },
        { en: "leg", zh: "腿" },
        { en: "foot", zh: "脚" },
        { en: "big", zh: "大的" },
        { en: "small", zh: "小的" },
        { en: "long", zh: "长的" },
        { en: "short", zh: "短的" }
      ],
      sentences: [
        { en: "This is my doll.", zh: "这是我的玩具娃娃。" },
        { en: "Her hair is long.", zh: "她的头发很长。" },
        { en: "It has a big nose.", zh: "它有一个大鼻子。" }
      ]
    }
  ]
};
