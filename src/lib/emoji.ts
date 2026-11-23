export interface EmojiItem {
  symbol: string
  name: string
  nameEn: string
  category: 'faces' | 'gestures' | 'work' | 'animals' | 'symbols' | 'food'
  keywords: string[]
}

export interface KaomojiItem {
  symbol: string
  name: string
  nameEn: string
  category: 'happy' | 'shock' | 'love' | 'angry' | 'shrug' | 'sparkle'
  keywords: string[]
}

export const EMOJI_CATEGORIES = [
  { id: 'all', label: '全部', labelEn: 'All' },
  { id: 'faces', label: '情绪表情', labelEn: 'Faces' },
  { id: 'gestures', label: '手势点赞', labelEn: 'Gestures' },
  { id: 'work', label: '打工摸鱼', labelEn: 'Work' },
  { id: 'animals', label: '萌宠动物', labelEn: 'Animals' },
  { id: 'symbols', label: '符号特效', labelEn: 'Symbols' },
  { id: 'food', label: '吃喝续命', labelEn: 'Food' },
] as const

export const KAOMOJI_CATEGORIES = [
  { id: 'all', label: '全部', labelEn: 'All' },
  { id: 'happy', label: '开心卖萌', labelEn: 'Happy' },
  { id: 'shock', label: '震惊无语', labelEn: 'Shock' },
  { id: 'love', label: '贴贴比心', labelEn: 'Love' },
  { id: 'angry', label: '生气掀桌', labelEn: 'Angry' },
  { id: 'shrug', label: '摊手摸鱼', labelEn: 'Shrug' },
  { id: 'sparkle', label: '庆祝炫耀', labelEn: 'Sparkle' },
] as const

export const EMOJI_LIBRARY: EmojiItem[] = [
  // Faces (24)
  { symbol: '😂', name: '笑哭', nameEn: 'Joy', category: 'faces', keywords: ['笑死', '哈哈', 'laugh', 'lol', 'tears'] },
  { symbol: '🤣', name: '笑到打滚', nameEn: 'ROFL', category: 'faces', keywords: ['爆笑', '笑死', 'rofl', 'funny'] },
  { symbol: '😅', name: '流汗尬笑', nameEn: 'Sweat Smile', category: 'faces', keywords: ['尴尬', '汗', 'awkward', 'nervous'] },
  { symbol: '😊', name: '微笑开心', nameEn: 'Blush', category: 'faces', keywords: ['微笑', '谢谢', 'smile', 'happy'] },
  { symbol: '😍', name: '花痴爱心眼', nameEn: 'Heart Eyes', category: 'faces', keywords: ['喜欢', '爱了', 'love', 'crush'] },
  { symbol: '🥰', name: '超级喜欢', nameEn: 'Smiling Hearts', category: 'faces', keywords: ['贴贴', '温柔', 'adore', 'sweet'] },
  { symbol: '😎', name: '墨镜装酷', nameEn: 'Cool', category: 'faces', keywords: ['大佬', '稳了', 'cool', 'boss'] },
  { symbol: '🤩', name: '星星眼', nameEn: 'Star Struck', category: 'faces', keywords: ['哇塞', '厉害', 'wow', 'amazing'] },
  { symbol: '🤔', name: '沉思思考', nameEn: 'Thinking', category: 'faces', keywords: ['思考', '怀疑', 'hmm', 'think'] },
  { symbol: '🤨', name: '挑眉怀疑', nameEn: 'Raised Eyebrow', category: 'faces', keywords: ['质疑', '真的吗', 'skeptical', 'sus'] },
  { symbol: '🙄', name: '翻白眼', nameEn: 'Eye Roll', category: 'faces', keywords: ['无语', '白眼', 'eyeroll', 'whatever'] },
  { symbol: '😏', name: '滑稽坏笑', nameEn: 'Smirk', category: 'faces', keywords: ['滑稽', '懂的都懂', 'smirk', 'cheeky'] },
  { symbol: '🫠', name: '融化了', nameEn: 'Melting', category: 'faces', keywords: ['破防', '社死', 'melt', 'done'] },
  { symbol: '🤯', name: '大脑爆炸', nameEn: 'Mind Blown', category: 'faces', keywords: ['震惊', '离谱', 'shock', 'wow'] },
  { symbol: '😱', name: '惊恐尖叫', nameEn: 'Scream', category: 'faces', keywords: ['吓死', '震惊', 'scared', 'omg'] },
  { symbol: '😭', name: '大哭破防', nameEn: 'Sob', category: 'faces', keywords: ['哭了', '求放过', 'cry', 'sad'] },
  { symbol: '🥺', name: '委屈巴巴', nameEn: 'Pleading', category: 'faces', keywords: ['求求', '可怜', 'please', 'cute'] },
  { symbol: '😤', name: '生气哼', nameEn: 'Triumph', category: 'faces', keywords: ['气死', '哼', 'angry', 'mad'] },
  { symbol: '🤡', name: '小丑竟是我', nameEn: 'Clown', category: 'faces', keywords: ['小丑', '破防', 'clown', 'fool'] },
  { symbol: '💀', name: '寄了骷髅', nameEn: 'Skull', category: 'faces', keywords: ['笑死', '寄了', 'dead', 'rip'] },
  { symbol: '👻', name: '幽灵调皮', nameEn: 'Ghost', category: 'faces', keywords: ['鬼', '溜了', 'ghost', 'boo'] },
  { symbol: '🥳', name: '派对庆祝', nameEn: 'Party', category: 'faces', keywords: ['庆祝', '撒花', 'party', 'yay'] },
  { symbol: '😴', name: '困了睡觉', nameEn: 'Sleeping', category: 'faces', keywords: ['困', '晚安', 'sleep', 'tired'] },
  { symbol: '🤓', name: '书呆子眼镜', nameEn: 'Nerd', category: 'faces', keywords: ['学霸', '代码', 'nerd', 'geek'] },

  // Gestures (14)
  { symbol: '👍', name: '点赞牛哇', nameEn: 'Thumbs Up', category: 'gestures', keywords: ['点赞', '收到', 'ok', 'good', 'like'] },
  { symbol: '👎', name: '踩一下', nameEn: 'Thumbs Down', category: 'gestures', keywords: ['拒绝', '不行', 'bad', 'no'] },
  { symbol: '👌', name: 'OK 没问题', nameEn: 'OK Hand', category: 'gestures', keywords: ['ok', '收到', '好的', 'sure'] },
  { symbol: '🙏', name: '拜托感谢', nameEn: 'Folded Hands', category: 'gestures', keywords: ['谢谢', '求求', 'thanks', 'please'] },
  { symbol: '👏', name: '鼓掌夸夸', nameEn: 'Clap', category: 'gestures', keywords: ['夸夸', '厉害', 'clap', 'bravo'] },
  { symbol: '🤝', name: '握手合作', nameEn: 'Handshake', category: 'gestures', keywords: ['成交', '合作', 'deal', 'agree'] },
  { symbol: '🫡', name: '敬礼收到', nameEn: 'Salute', category: 'gestures', keywords: ['收到', '尊重', 'respect', 'sir'] },
  { symbol: '🫶', name: '比心手势', nameEn: 'Heart Hands', category: 'gestures', keywords: ['比心', '爱你', 'heart', 'love'] },
  { symbol: '✌️', name: '耶胜利', nameEn: 'Victory', category: 'gestures', keywords: ['耶', '开心', 'peace', 'win'] },
  { symbol: '💪', name: '加油打气', nameEn: 'Muscle', category: 'gestures', keywords: ['加油', '冲鸭', 'strong', 'fight'] },
  { symbol: '🤙', name: '666 手势', nameEn: 'Call Me', category: 'gestures', keywords: ['666', '稳', 'call', 'chill'] },
  { symbol: '👀', name: '暗中观察', nameEn: 'Eyes', category: 'gestures', keywords: ['吃瓜', '看看', 'look', 'watch'] },
  { symbol: '🤦', name: '捂脸无语', nameEn: 'Facepalm', category: 'gestures', keywords: ['无语', '离谱', 'facepalm', 'sigh'] },
  { symbol: '🤷', name: '摊手随缘', nameEn: 'Shrug', category: 'gestures', keywords: ['摊手', '不知道', 'shrug', 'dunno'] },

  // Work & Tech (14)
  { symbol: '💻', name: '写代码笔记本', nameEn: 'Laptop', category: 'work', keywords: ['代码', '打工人', 'code', 'dev', 'work'] },
  { symbol: '🐛', name: 'Bug 虫子', nameEn: 'Bug', category: 'work', keywords: ['bug', '报错', '代码', 'debug'] },
  { symbol: '🔥', name: '火热爆款', nameEn: 'Fire', category: 'work', keywords: ['火', '厉害', 'lit', 'hot', 'bug'] },
  { symbol: '🚀', name: '上线起飞', nameEn: 'Rocket', category: 'work', keywords: ['上线', '发布', 'launch', 'ship'] },
  { symbol: '🐟', name: '摸鱼小鱼', nameEn: 'Fish', category: 'work', keywords: ['摸鱼', '划水', 'fish', 'slack'] },
  { symbol: '🧱', name: '搬砖打工人', nameEn: 'Brick', category: 'work', keywords: ['搬砖', '打工人', 'work', 'grind'] },
  { symbol: '💼', name: '公文包上班', nameEn: 'Briefcase', category: 'work', keywords: ['上班', '班味', 'office', 'job'] },
  { symbol: '⏰', name: '闹钟下班', nameEn: 'Alarm Clock', category: 'work', keywords: ['下班', 'ddl', 'time', 'deadline'] },
  { symbol: '💸', name: '钱飞走了', nameEn: 'Money Wings', category: 'work', keywords: ['工资', '穷', 'money', 'broke'] },
  { symbol: '📈', name: '业绩暴涨', nameEn: 'Chart Up', category: 'work', keywords: ['涨', '成功', 'stonks', 'growth'] },
  { symbol: '🧠', name: '动脑思考', nameEn: 'Brain', category: 'work', keywords: ['聪明', '智商', 'brain', 'smart'] },
  { symbol: '⚡', name: '闪电效率', nameEn: 'Zap', category: 'work', keywords: ['快', '秒回', 'fast', 'power'] },
  { symbol: '🎯', name: '精准命中', nameEn: 'Target', category: 'work', keywords: ['精准', '目标', 'goal', 'hit'] },
  { symbol: '🛠️', name: '修 Bug 工具', nameEn: 'Tools', category: 'work', keywords: ['修复', '开发', 'fix', 'build'] },

  // Animals (12)
  { symbol: '🐱', name: '猫猫头像', nameEn: 'Cat', category: 'animals', keywords: ['猫猫', '猫咪', 'cat', 'kitty', 'meow'] },
  { symbol: '🐶', name: '修勾狗头', nameEn: 'Dog', category: 'animals', keywords: ['狗头', '修勾', 'dog', 'doge'] },
  { symbol: '🐼', name: '熊猫头', nameEn: 'Panda', category: 'animals', keywords: ['熊猫', '国宝', 'panda', 'meme'] },
  { symbol: '🐸', name: '青蛙梗图', nameEn: 'Frog', category: 'animals', keywords: ['青蛙', '孤寡', 'frog', 'pepe'] },
  { symbol: '🦊', name: '小狐狸', nameEn: 'Fox', category: 'animals', keywords: ['狐狸', '机智', 'fox', 'cute'] },
  { symbol: '🦆', name: '冲鸭小鸭', nameEn: 'Duck', category: 'animals', keywords: ['冲鸭', '鸭子', 'duck', 'go'] },
  { symbol: '🦄', name: '独角兽', nameEn: 'Unicorn', category: 'animals', keywords: ['神奇', '稀有', 'unicorn', 'magic'] },
  { symbol: '🐷', name: '小猪佩奇', nameEn: 'Pig', category: 'animals', keywords: ['猪猪', '可爱', 'pig', 'oink'] },
  { symbol: '🐰', name: '小兔子', nameEn: 'Rabbit', category: 'animals', keywords: ['兔兔', '乖巧', 'bunny', 'rabbit'] },
  { symbol: '🐻', name: '小熊', nameEn: 'Bear', category: 'animals', keywords: ['熊', '抱抱', 'bear', 'hug'] },
  { symbol: '🐧', name: '企鹅', nameEn: 'Penguin', category: 'animals', keywords: ['企鹅', 'linux', 'penguin'] },
  { symbol: '🦋', name: '蝴蝶', nameEn: 'Butterfly', category: 'animals', keywords: ['仙女', '美丽', 'butterfly'] },

  // Symbols (12)
  { symbol: '✨', name: '闪亮星星', nameEn: 'Sparkles', category: 'symbols', keywords: ['闪耀', '高级', 'sparkle', 'magic'] },
  { symbol: '❤️', name: '红心爱心', nameEn: 'Red Heart', category: 'symbols', keywords: ['爱', '心', 'love', 'heart'] },
  { symbol: '💯', name: '一百分满分', nameEn: '100', category: 'symbols', keywords: ['满分', '赞', 'perfect', '100'] },
  { symbol: '❓', name: '红问号', nameEn: 'Question', category: 'symbols', keywords: ['问号', '黑人问号', 'what', 'question'] },
  { symbol: '❗', name: '感叹号', nameEn: 'Exclamation', category: 'symbols', keywords: ['重要', '震惊', 'alert', 'important'] },
  { symbol: '🎉', name: '礼花撒花', nameEn: 'Tada', category: 'symbols', keywords: ['恭喜', '喜报', 'congrats', 'party'] },
  { symbol: '🏆', name: '冠军奖杯', nameEn: 'Trophy', category: 'symbols', keywords: ['第一', '赢了', 'win', 'award'] },
  { symbol: '💡', name: '灵感灯泡', nameEn: 'Bulb', category: 'symbols', keywords: ['想法', '灵感', 'idea', 'tip'] },
  { symbol: '✅', name: '已完成勾', nameEn: 'Check', category: 'symbols', keywords: ['完成', '通过', 'done', 'ok'] },
  { symbol: '🚫', name: '禁止达咩', nameEn: 'Prohibited', category: 'symbols', keywords: ['达咩', '不行', 'no', 'ban'] },
  { symbol: '💢', name: '怒气青筋', nameEn: 'Anger', category: 'symbols', keywords: ['生气', '暴躁', 'angry', 'mad'] },
  { symbol: '💤', name: '摸鱼打盹', nameEn: 'Zzz', category: 'symbols', keywords: ['睡觉', '摸鱼', 'sleep', 'zzz'] },

  // Food (10)
  { symbol: '☕', name: '续命咖啡', nameEn: 'Coffee', category: 'food', keywords: ['咖啡', '续命', '打工人', 'coffee'] },
  { symbol: '🧋', name: '快乐奶茶', nameEn: 'Bubble Tea', category: 'food', keywords: ['奶茶', '快乐水', 'boba', 'tea'] },
  { symbol: '🍉', name: '吃瓜西瓜', nameEn: 'Watermelon', category: 'food', keywords: ['吃瓜', '瓜', 'gossip', 'melon'] },
  { symbol: '🍺', name: '干杯啤酒', nameEn: 'Beer', category: 'food', keywords: ['干杯', '下班', 'cheers', 'beer'] },
  { symbol: '🍕', name: '披萨画饼', nameEn: 'Pizza', category: 'food', keywords: ['画饼', '吃啥', 'pizza', 'food'] },
  { symbol: '🍗', name: '加鸡腿', nameEn: 'Poultry Leg', category: 'food', keywords: ['鸡腿', '奖励', 'chicken', 'reward'] },
  { symbol: '🍰', name: '小蛋糕', nameEn: 'Cake', category: 'food', keywords: ['生日', '甜品', 'cake', 'sweet'] },
  { symbol: '🍜', name: '干饭拉面', nameEn: 'Ramen', category: 'food', keywords: ['干饭', '宵夜', 'noodle', 'eat'] },
  { symbol: '🍦', name: '冰淇淋', nameEn: 'Ice Cream', category: 'food', keywords: ['冰激凌', '夏天', 'icecream'] },
  { symbol: '🌶️', name: '辣眼睛辣椒', nameEn: 'Chili', category: 'food', keywords: ['辣', '够劲', 'spicy', 'hot'] },
]

export const KAOMOJI_LIBRARY: KaomojiItem[] = [
  // Happy (12)
  { symbol: '(｡･ω･｡)', name: '乖巧卖萌', nameEn: 'Cute', category: 'happy', keywords: ['卖萌', '乖', 'cute', 'happy'] },
  { symbol: '(≧▽≦)', name: '超级开心', nameEn: 'Joyful', category: 'happy', keywords: ['开心', '哈哈', 'joy', 'yay'] },
  { symbol: '(๑•̀ㅂ•́)و✧', name: '元气加油', nameEn: 'Fighting', category: 'happy', keywords: ['加油', '冲鸭', 'fight', 'go'] },
  { symbol: 'ヾ(≧▽≦*)o', name: '雀跃欢呼', nameEn: 'Excited', category: 'happy', keywords: ['欢呼', '耶', 'excited', 'happy'] },
  { symbol: '(^・ω・^ )', name: '小猫微笑', nameEn: 'Kitty', category: 'happy', keywords: ['猫猫', '可爱', 'cat', 'smile'] },
  { symbol: '(*^▽^*)', name: '灿烂笑脸', nameEn: 'Beaming', category: 'happy', keywords: ['笑', '开心', 'smile', 'happy'] },
  { symbol: '(o´▽`o)', name: '温柔微笑', nameEn: 'Warm Smile', category: 'happy', keywords: ['温柔', '微笑', 'warm', 'nice'] },
  { symbol: '٩(ˊᗜˋ*)و', name: '举手开心', nameEn: 'Cheer', category: 'happy', keywords: ['开心', '胜利', 'cheer', 'win'] },
  { symbol: '(•̀ᴗ•́)و', name: '稳了加油', nameEn: 'Got This', category: 'happy', keywords: ['稳', '加油', 'yes', 'ok'] },
  { symbol: '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', name: '魔法撒花', nameEn: 'Magic', category: 'happy', keywords: ['撒花', '魔法', 'magic', 'sparkle'] },
  { symbol: '(=^･ω･^=)', name: '喵星人', nameEn: 'Meow', category: 'happy', keywords: ['猫', '喵', 'cat', 'meow'] },
  { symbol: '(´∀`)', name: '悠闲笑', nameEn: 'Chill Smile', category: 'happy', keywords: ['悠闲', '舒服', 'chill', 'happy'] },

  // Shock (12)
  { symbol: '(⊙_⊙;)', name: '呆住流汗', nameEn: 'Stunned', category: 'shock', keywords: ['震惊', '呆住', 'shock', 'what'] },
  { symbol: 'Σ(°△°|||)', name: '瞳孔地震', nameEn: 'Mind Blown', category: 'shock', keywords: ['震惊', '吓死', 'omg', 'shock'] },
  { symbol: '(°ロ°) !', name: '目瞪口呆', nameEn: 'Gasp', category: 'shock', keywords: ['啊这', '惊呆', 'gasp', 'wow'] },
  { symbol: '(・_・;)', name: '尴尬无语', nameEn: 'Awkward', category: 'shock', keywords: ['无语', '尴尬', 'awkward', 'sweat'] },
  { symbol: '(¬_¬)', name: '斜眼无语', nameEn: 'Side Eye', category: 'shock', keywords: ['无语', '嫌弃', 'annoyed', 'sus'] },
  { symbol: '(；一_一)', name: '一脸黑线', nameEn: 'Deadpan', category: 'shock', keywords: ['无语', '黑线', 'deadpan', 'sigh'] },
  { symbol: '(ﾟДﾟ*)ﾉ', name: '等等什么', nameEn: 'Wait What', category: 'shock', keywords: ['什么', '等等', 'wait', 'what'] },
  { symbol: '(((;°▽°))', name: '瑟瑟发抖', nameEn: 'Shaking', category: 'shock', keywords: ['发抖', '害怕', 'scared', 'nervous'] },
  { symbol: '(°ー°〃)', name: '装傻充愣', nameEn: 'Clueless', category: 'shock', keywords: ['装傻', '不懂', 'blank', 'huh'] },
  { symbol: '(-_-;)', name: '叹气汗颜', nameEn: 'Sigh', category: 'shock', keywords: ['叹气', '无语', 'sigh', 'tired'] },
  { symbol: 'Σ(っ °Д °;)っ', name: '惊慌失措', nameEn: 'Panic', category: 'shock', keywords: ['慌了', '救命', 'panic', 'omg'] },
  { symbol: '(O_O)', name: '震惊瞪眼', nameEn: 'Wide Eyes', category: 'shock', keywords: ['瞪眼', '惊了', 'stare', 'shock'] },

  // Love (10)
  { symbol: '(´▽`ʃ♡ƪ)', name: '比心贴贴', nameEn: 'Heart Hug', category: 'love', keywords: ['比心', '贴贴', 'love', 'heart'] },
  { symbol: '(♥ω♥*)', name: '爱心眼', nameEn: 'Heart Eyes', category: 'love', keywords: ['喜欢', '花痴', 'love', 'adore'] },
  { symbol: '(づ￣ ³￣)づ', name: '飞吻抱抱', nameEn: 'Kiss Hug', category: 'love', keywords: ['抱抱', '亲亲', 'hug', 'kiss'] },
  { symbol: '(っ´▽`)っ', name: '张手抱抱', nameEn: 'Hug', category: 'love', keywords: ['抱抱', '安慰', 'hug', 'warm'] },
  { symbol: '(｡♥‿♥｡)', name: '满眼是你', nameEn: 'In Love', category: 'love', keywords: ['爱了', '喜欢', 'love', 'sweet'] },
  { symbol: '(´ε｀ )♡', name: '啾咪比心', nameEn: 'Smooch', category: 'love', keywords: ['亲亲', '爱', 'kiss', 'heart'] },
  { symbol: '( ˘ ³˘)♥', name: '甜蜜飞吻', nameEn: 'Blow Kiss', category: 'love', keywords: ['飞吻', '甜', 'kiss', 'love'] },
  { symbol: '(*˘︶˘*).｡.:*♡', name: '幸福陶醉', nameEn: 'Bliss', category: 'love', keywords: ['幸福', '开心', 'bliss', 'sweet'] },
  { symbol: '♡(ŐωŐ人)', name: '诚挚喜欢', nameEn: 'Cherish', category: 'love', keywords: ['喜欢', '拜托', 'love', 'cute'] },
  { symbol: '(つ✧ω✧)つ', name: '冲过来贴贴', nameEn: 'Rush Hug', category: 'love', keywords: ['贴贴', '抱抱', 'hug', 'cute'] },

  // Angry (10)
  { symbol: '(╯°□°）╯︵ ┻━┻', name: '经典掀桌', nameEn: 'Flip Table', category: 'angry', keywords: ['掀桌', '生气', '不干了', 'tableflip', 'angry'] },
  { symbol: '┬─┬ノ( º _ ºノ)', name: '冷静放桌', nameEn: 'Put Table Back', category: 'angry', keywords: ['放桌', '冷静', 'calm', 'table'] },
  { symbol: '(╬ಠ益ಠ)', name: '怒火中烧', nameEn: 'Furious', category: 'angry', keywords: ['暴怒', '生气', 'mad', 'angry'] },
  { symbol: '(｀皿´＃)', name: '青筋暴起', nameEn: 'Vein Pop', category: 'angry', keywords: ['气死', '哼', 'angry', 'rage'] },
  { symbol: '(#`Д´)ﾉ', name: '拍桌怒吼', nameEn: 'Yelling', category: 'angry', keywords: ['怒吼', '生气', 'yell', 'mad'] },
  { symbol: '(・`ω´・)', name: '奶凶生气', nameEn: 'Grumpy Cute', category: 'angry', keywords: ['奶凶', '哼', 'grumpy', 'pout'] },
  { symbol: '(ノಠ益ಠ)ノ彡┻━┻', name: '超级掀桌', nameEn: 'Mega Flip', category: 'angry', keywords: ['掀桌', '加班', 'rage', 'flip'] },
  { symbol: 'ヽ(`Д´)ﾉ', name: '气急败坏', nameEn: 'Fuming', category: 'angry', keywords: ['生气', '崩溃', 'mad', 'angry'] },
  { symbol: '(；￣Д￣)', name: '无语吐槽', nameEn: 'Disbelief', category: 'angry', keywords: ['吐槽', '离谱', 'wtf', 'annoyed'] },
  { symbol: '(￣^￣)', name: '哼不理你', nameEn: 'Hmph', category: 'angry', keywords: ['哼', '傲娇', 'hmph', 'pout'] },

  // Shrug & Slack (10)
  { symbol: '¯\\_(ツ)_/¯', name: '经典摊手', nameEn: 'Shrug', category: 'shrug', keywords: ['摊手', '不知道', '随便', 'shrug', 'dunno'] },
  { symbol: '┐(￣ヘ￣)┌', name: '无奈摊手', nameEn: 'Helpless Shrug', category: 'shrug', keywords: ['无奈', '摊手', 'shrug', 'meh'] },
  { symbol: '(￣▽￣)ノ', name: '溜了拜拜', nameEn: 'Bye Wave', category: 'shrug', keywords: ['溜了', '下班', 'bye', 'wave'] },
  { symbol: '_(:з」∠)_', name: '咸鱼躺平', nameEn: 'Lying Flat', category: 'shrug', keywords: ['躺平', '摸鱼', '咸鱼', 'lazy', 'slack'] },
  { symbol: '(:3[▓▓]', name: '钻进被窝', nameEn: 'In Bed', category: 'shrug', keywords: ['睡觉', '躺平', 'sleep', 'bed'] },
  { symbol: '(¦3[▓▓]', name: '摸鱼打盹', nameEn: 'Nap', category: 'shrug', keywords: ['摸鱼', '困', 'nap', 'sleep'] },
  { symbol: '( ´_ゝ`)', name: '冷漠看戏', nameEn: 'Unimpressed', category: 'shrug', keywords: ['冷漠', '吃瓜', 'meh', 'bored'] },
  { symbol: '(￣﹃￣)', name: '发呆流口水', nameEn: 'Drooling', category: 'shrug', keywords: ['发呆', '馋', 'drool', 'hungry'] },
  { symbol: 'ε=ε=ε=┏(゜ロ゜;)┛', name: '光速溜走', nameEn: 'Run Away', category: 'shrug', keywords: ['跑路', '溜了', 'run', 'escape'] },
  { symbol: '( •_•)>⌐■-■', name: '戴上墨镜', nameEn: 'Deal With It', category: 'shrug', keywords: ['装酷', '墨镜', 'cool', 'deal'] },

  // Sparkle & Celebrate (10)
  { symbol: '(★ ω ★)', name: '星星眼炫酷', nameEn: 'Star Eyes', category: 'sparkle', keywords: ['星星眼', '厉害', 'star', 'wow'] },
  { symbol: '✧*｡٩(ˊᗜˋ*)و✧*｡', name: '闪耀庆祝', nameEn: 'Sparkle Cheer', category: 'sparkle', keywords: ['庆祝', '喜报', 'party', 'yay'] },
  { symbol: '♪(´▽｀)', name: '哼歌愉快', nameEn: 'Singing', category: 'sparkle', keywords: ['哼歌', '下班', 'music', 'happy'] },
  { symbol: '(*•̀ᴗ•́*)و ̑̑', name: '超棒点赞', nameEn: 'Awesome', category: 'sparkle', keywords: ['赞', '优秀', 'great', 'nice'] },
  { symbol: '(☞ﾟヮﾟ)☞', name: '就是你了', nameEn: 'Point Right', category: 'sparkle', keywords: ['就是你', '懂我', 'point', 'eyy'] },
  { symbol: '☜(ﾟヮﾟ☜)', name: '你也很棒', nameEn: 'Point Left', category: 'sparkle', keywords: ['互夸', '厉害', 'point', 'eyy'] },
  { symbol: '┌(・。・)┘♪', name: '开心跳舞', nameEn: 'Dancing', category: 'sparkle', keywords: ['跳舞', '嗨', 'dance', 'party'] },
  { symbol: '(⌐■_■)', name: '大佬墨镜', nameEn: 'Cool Boss', category: 'sparkle', keywords: ['大佬', '稳了', 'cool', 'boss'] },
  { symbol: '☆*:.｡.o(≧▽≦)o.｡.:*☆', name: '隆重撒花', nameEn: 'Grand Cheer', category: 'sparkle', keywords: ['撒花', '恭喜', 'celebrate', 'congrats'] },
  { symbol: '(ง •̀_•́)ง', name: '干劲满满', nameEn: 'Determined', category: 'sparkle', keywords: ['冲', '卷', 'fight', 'work'] },
]

export interface SearchEmojiResult {
  kind: 'emoji' | 'kaomoji'
  symbol: string
  name: string
  nameEn: string
  category: string
  keywords: string[]
}

export function searchEmojiKaomoji(opts: {
  query?: string
  kind?: 'all' | 'emoji' | 'kaomoji'
  category?: string
  limit?: number
}): SearchEmojiResult[] {
  const q = (opts.query ?? '').trim().toLowerCase()
  const kind = opts.kind ?? 'all'
  const category = (opts.category ?? '').trim().toLowerCase()
  const limit = Math.max(1, Math.min(200, Math.round(opts.limit ?? 120)))

  const pool: SearchEmojiResult[] = []
  if (kind === 'all' || kind === 'emoji') {
    for (const item of EMOJI_LIBRARY) {
      pool.push({ kind: 'emoji', ...item })
    }
  }
  if (kind === 'all' || kind === 'kaomoji') {
    for (const item of KAOMOJI_LIBRARY) {
      pool.push({ kind: 'kaomoji', ...item })
    }
  }

  return pool
    .filter((item) => {
      if (category && category !== 'all' && item.category.toLowerCase() !== category) {
        return false
      }
      if (!q) return true
      return (
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      )
    })
    .slice(0, limit)
}

export function renderEmojiStickerDataUrl(
  emoji: string,
  options: { withBorder?: boolean; size?: number } = {},
): string {
  const size = options.size ?? 512
  const withBorder = options.withBorder ?? true
  if (typeof document === 'undefined') return ''
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  ctx.clearRect(0, 0, size, size)
  const cx = size / 2
  const cy = size / 2 + size * 0.04
  const fontSize = Math.round(size * 0.64)
  ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (withBorder) {
    ctx.save()
    ctx.shadowColor = 'rgba(15, 23, 42, 0.22)'
    ctx.shadowBlur = Math.round(size * 0.045)
    ctx.shadowOffsetY = Math.round(size * 0.018)
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size * 0.43, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    ctx.save()
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)'
    ctx.lineWidth = Math.max(3, Math.round(size * 0.012))
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size * 0.43, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  ctx.fillText(emoji, cx, cy)
  try {
    return canvas.toDataURL('image/png')
  } catch {
    return ''
  }
}
