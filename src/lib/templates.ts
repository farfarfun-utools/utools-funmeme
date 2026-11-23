import { wrapCanvasText } from './text-meme'

export type MemeTemplateId =
  | 'panda-think'
  | 'panda-sign'
  | 'doge-stare'
  | 'shocked-q'
  | 'drake-split'
  | 'code-works'
  | 'boss-pie'
  | 'slacking-cat'
  | 'soul-artist'
  | 'thumbs-praise'

export type MemeShape = 'square' | 'rounded' | 'circle'
export type MemeAlign = 'left' | 'center' | 'right'

export interface MemeTemplateSpec {
  id: MemeTemplateId
  name: string
  nameEn: string
  category: 'panda' | 'reaction' | 'work' | 'tech'
  tags: string[]
  defaultTop: string
  defaultBottom: string
  bgColor: string
}

export interface MemeRenderOptions {
  templateId: MemeTemplateId
  customImage?: HTMLImageElement | null
  topText: string
  bottomText: string
  fontSize: number
  fillColor: string
  strokeColor: string
  strokeWidth: number
  align: MemeAlign
  shape: MemeShape
  badge: string
  size?: number
}

export interface StarterMemeSpec {
  id: string
  title: string
  templateId: MemeTemplateId
  topText: string
  bottomText: string
  badge: string
  tags: string[]
  fillColor?: string
  strokeColor?: string
}

export const HOT_DISCOVER_TAGS = [
  '打工人',
  '摸鱼',
  '震惊',
  'OK',
  '无语',
  '点赞',
  '猫猫',
  '代码',
] as const

export const QUICK_STICKER_BADGES = [
  '笑死',
  '破防',
  '666',
  '摸鱼',
  '收到',
  '已老实',
  '尊重',
  'respect',
] as const

export const MEME_TEMPLATES: MemeTemplateSpec[] = [
  {
    id: 'panda-think',
    name: '熊猫思考',
    nameEn: 'Panda Think',
    category: 'panda',
    tags: ['无语', '思考', '熊猫', '打工人'],
    defaultTop: '让我仔细想想',
    defaultBottom: '这需求到底合不合理',
    bgColor: '#F6F4EE',
  },
  {
    id: 'panda-sign',
    name: '熊猫举牌',
    nameEn: 'Panda Sign',
    category: 'panda',
    tags: ['OK', '收到', '熊猫', '打工人'],
    defaultTop: '重要通知',
    defaultBottom: '收到！马上安排',
    bgColor: '#FFFBEB',
  },
  {
    id: 'doge-stare',
    name: '滑稽盯',
    nameEn: 'Cheeky Stare',
    category: 'reaction',
    tags: ['无语', '滑稽', '吃瓜'],
    defaultTop: '哦？是吗',
    defaultBottom: '我就静静看你表演',
    bgColor: '#FEF3C7',
  },
  {
    id: 'shocked-q',
    name: '震撼问号',
    nameEn: 'Shocked ???',
    category: 'reaction',
    tags: ['震惊', '问号', '离谱'],
    defaultTop: '？？？？？',
    defaultBottom: '你刚才说什么再说一遍',
    bgColor: '#EEF2FF',
  },
  {
    id: 'drake-split',
    name: '拒绝真香',
    nameEn: 'Reject/Yes',
    category: 'reaction',
    tags: ['真香', '打工人', 'OK'],
    defaultTop: '加班改十版需求 ✗',
    defaultBottom: '准点下班去吃火锅 ✓',
    bgColor: '#FFF7ED',
  },
  {
    id: 'code-works',
    name: '代码别动',
    nameEn: 'Code Works',
    category: 'tech',
    tags: ['代码', '打工人', '程序员'],
    defaultTop: '生产环境稳定运行中',
    defaultBottom: '代码能跑就千万别动！',
    bgColor: '#0F172A',
  },
  {
    id: 'boss-pie',
    name: '老板画饼',
    nameEn: 'Boss Pie',
    category: 'work',
    tags: ['打工人', '无语', '画饼'],
    defaultTop: '今年好好干',
    defaultBottom: '明年给你画个更大的饼',
    bgColor: '#FFFBEB',
  },
  {
    id: 'slacking-cat',
    name: '摸鱼猫猫',
    nameEn: 'Slack Cat',
    category: 'work',
    tags: ['摸鱼', '猫猫', '打工人'],
    defaultTop: '带薪摸鱼中',
    defaultBottom: '非紧急事务请明天再说',
    bgColor: '#ECFEFF',
  },
  {
    id: 'soul-artist',
    name: '灵魂画手',
    nameEn: 'Soul Art',
    category: 'reaction',
    tags: ['无语', '搞笑', 'OK'],
    defaultTop: '不要质疑我的审美',
    defaultBottom: '这就是顶级抽象艺术',
    bgColor: '#FAF5FF',
  },
  {
    id: 'thumbs-praise',
    name: '超级点赞',
    nameEn: 'Thumbs Up',
    category: 'reaction',
    tags: ['点赞', 'OK', '夸夸'],
    defaultTop: '太强了大佬！',
    defaultBottom: '必须给你点个大大的赞',
    bgColor: '#FEF9C3',
  },
]

export const OFFLINE_STARTER_MEMES: StarterMemeSpec[] = [
  {
    id: 'starter-1',
    title: '带薪摸鱼 · 勿扰模式',
    templateId: 'slacking-cat',
    topText: '正在努力摸鱼',
    bottomText: '有事请发邮件给明天的我',
    badge: '摸鱼',
    tags: ['摸鱼', '猫猫', '打工人'],
  },
  {
    id: 'starter-2',
    title: '代码能跑千万别动',
    templateId: 'code-works',
    topText: '别问为什么能跑',
    bottomText: '能跑就千万别动！',
    badge: 'respect',
    tags: ['代码', '打工人'],
  },
  {
    id: 'starter-3',
    title: '收到！马上改',
    templateId: 'panda-sign',
    topText: '好的老板',
    bottomText: '收到！这就去改',
    badge: '收到',
    tags: ['OK', '打工人'],
  },
  {
    id: 'starter-4',
    title: '震撼我一整年',
    templateId: 'shocked-q',
    topText: '？？？？',
    bottomText: '这需求是认真的吗',
    badge: '破防',
    tags: ['震惊', '无语', '打工人'],
  },
  {
    id: 'starter-5',
    title: '滑稽暗中观察',
    templateId: 'doge-stare',
    topText: '懂的都懂',
    bottomText: '我就静静看你演',
    badge: '笑死',
    tags: ['无语', '震惊'],
  },
  {
    id: 'starter-6',
    title: '超级点赞 666',
    templateId: 'thumbs-praise',
    topText: '太强了大佬',
    bottomText: '直接封神 666！',
    badge: '666',
    tags: ['点赞', 'OK'],
  },
  {
    id: 'starter-7',
    title: '熊猫头陷入沉思',
    templateId: 'panda-think',
    topText: '思考人生',
    bottomText: '今天中午到底吃什么',
    badge: '已老实',
    tags: ['无语', '打工人'],
  },
  {
    id: 'starter-8',
    title: '又香又脆的大饼',
    templateId: 'boss-pie',
    topText: '饼已经画好了',
    bottomText: '大家吃饱继续冲',
    badge: '笑死',
    tags: ['打工人', '无语'],
  },
  {
    id: 'starter-9',
    title: '拒绝内卷 · 真香下班',
    templateId: 'drake-split',
    topText: '通宵加班写 PPT ✗',
    bottomText: '六点准时打卡干饭 ✓',
    badge: '尊重',
    tags: ['打工人', '摸鱼', 'OK'],
  },
  {
    id: 'starter-10',
    title: '灵魂画手出击',
    templateId: 'soul-artist',
    topText: '原型图画完了',
    bottomText: '前端大佬应该看得懂吧',
    badge: '破防',
    tags: ['代码', '无语'],
  },
  {
    id: 'starter-11',
    title: '猫猫已老实求放过',
    templateId: 'slacking-cat',
    topText: '喵喵已老实',
    bottomText: '求放过别再提 Bug 了',
    badge: '已老实',
    tags: ['猫猫', '代码', '摸鱼'],
  },
  {
    id: 'starter-12',
    title: '给大佬递茶点赞',
    templateId: 'thumbs-praise',
    topText: '一次构建直接过',
    bottomText: '优雅！实在太优雅了',
    badge: 'respect',
    tags: ['点赞', '代码', 'OK'],
  },
]

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawPandaFace(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  scale: number,
  expression: 'think' | 'smile',
) {
  // Ears
  ctx.fillStyle = '#18181B'
  ctx.beginPath()
  ctx.arc(cx - r * 0.78, cy - r * 0.72, r * 0.32, 0, Math.PI * 2)
  ctx.arc(cx + r * 0.78, cy - r * 0.72, r * 0.32, 0, Math.PI * 2)
  ctx.fill()

  // Face oval
  ctx.fillStyle = '#FFFFFF'
  ctx.strokeStyle = '#18181B'
  ctx.lineWidth = 6 * scale
  ctx.beginPath()
  ctx.ellipse(cx, cy, r * 1.05, r * 0.92, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // Eye patches
  ctx.fillStyle = '#18181B'
  ctx.beginPath()
  ctx.ellipse(cx - r * 0.38, cy - r * 0.08, r * 0.24, r * 0.17, -0.22, 0, Math.PI * 2)
  ctx.ellipse(cx + r * 0.38, cy - r * 0.08, r * 0.24, r * 0.17, 0.22, 0, Math.PI * 2)
  ctx.fill()

  if (expression === 'think') {
    // Expressive squinting eyes looking up-right
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.ellipse(cx - r * 0.33, cy - r * 0.1, r * 0.1, r * 0.06, 0, 0, Math.PI * 2)
    ctx.ellipse(cx + r * 0.43, cy - r * 0.1, r * 0.1, r * 0.06, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#18181B'
    ctx.beginPath()
    ctx.arc(cx - r * 0.29, cy - r * 0.11, r * 0.045, 0, Math.PI * 2)
    ctx.arc(cx + r * 0.47, cy - r * 0.11, r * 0.045, 0, Math.PI * 2)
    ctx.fill()
    // Raised brow
    ctx.strokeStyle = '#18181B'
    ctx.lineWidth = 4.5 * scale
    ctx.beginPath()
    ctx.moveTo(cx - r * 0.56, cy - r * 0.34)
    ctx.lineTo(cx - r * 0.2, cy - r * 0.3)
    ctx.moveTo(cx + r * 0.2, cy - r * 0.36)
    ctx.quadraticCurveTo(cx + r * 0.4, cy - r * 0.46, cx + r * 0.58, cy - r * 0.34)
    ctx.stroke()
    // Thinking wavy mouth
    ctx.beginPath()
    ctx.moveTo(cx - r * 0.22, cy + r * 0.36)
    ctx.quadraticCurveTo(cx, cy + r * 0.28, cx + r * 0.22, cy + r * 0.36)
    ctx.stroke()
  } else {
    // Cheerful shiny eyes
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(cx - r * 0.34, cy - r * 0.11, r * 0.08, 0, Math.PI * 2)
    ctx.arc(cx + r * 0.34, cy - r * 0.11, r * 0.08, 0, Math.PI * 2)
    ctx.fill()
    // Rosy cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.28)'
    ctx.beginPath()
    ctx.ellipse(cx - r * 0.56, cy + r * 0.22, r * 0.14, r * 0.08, 0, 0, Math.PI * 2)
    ctx.ellipse(cx + r * 0.56, cy + r * 0.22, r * 0.14, r * 0.08, 0, 0, Math.PI * 2)
    ctx.fill()
    // Happy grin
    ctx.strokeStyle = '#18181B'
    ctx.lineWidth = 4.5 * scale
    ctx.beginPath()
    ctx.arc(cx, cy + r * 0.22, r * 0.22, 0.15 * Math.PI, 0.85 * Math.PI)
    ctx.stroke()
  }
}

export function drawTemplateBase(
  ctx: CanvasRenderingContext2D,
  templateId: MemeTemplateId,
  size: number,
): void {
  const s = size
  const k = s / 512

  ctx.save()
  if (templateId === 'panda-think') {
    const grad = ctx.createRadialGradient(s * 0.5, s * 0.48, 30 * k, s * 0.5, s * 0.5, 340 * k)
    grad.addColorStop(0, '#FFFFFF')
    grad.addColorStop(1, '#E7E2D5')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, s, s)

    // Subtle halftone dots
    ctx.fillStyle = 'rgba(217, 119, 6, 0.12)'
    for (let x = 36 * k; x < s; x += 48 * k) {
      for (let y = 36 * k; y < s; y += 48 * k) {
        ctx.beginPath()
        ctx.arc(x, y, 3.5 * k, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    drawPandaFace(ctx, 252 * k, 256 * k, 116 * k, k, 'think')

    // Thinking hand on chin
    ctx.fillStyle = '#FDE68A'
    ctx.strokeStyle = '#18181B'
    ctx.lineWidth = 5 * k
    roundedRectPath(ctx, 198 * k, 336 * k, 92 * k, 40 * k, 18 * k)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(222 * k, 336 * k)
    ctx.lineTo(208 * k, 306 * k)
    ctx.stroke()

    // Floating ? icons
    ctx.font = `900 ${54 * k}px sans-serif`
    ctx.fillStyle = '#D97706'
    ctx.fillText('?', 92 * k, 178 * k)
    ctx.fillStyle = '#EA580C'
    ctx.font = `900 ${42 * k}px sans-serif`
    ctx.fillText('?', 406 * k, 184 * k)
  } else if (templateId === 'panda-sign') {
    ctx.fillStyle = '#FFFBEB'
    ctx.fillRect(0, 0, s, s)
    // Sunburst pastel stripes
    ctx.fillStyle = 'rgba(251, 191, 36, 0.14)'
    ctx.beginPath()
    ctx.arc(256 * k, 260 * k, 206 * k, 0, Math.PI * 2)
    ctx.fill()

    drawPandaFace(ctx, 256 * k, 200 * k, 92 * k, k, 'smile')

    // Wooden sign board
    ctx.save()
    ctx.translate(256 * k, 326 * k)
    ctx.rotate(-0.025)
    roundedRectPath(ctx, -162 * k, -66 * k, 324 * k, 132 * k, 16 * k)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()
    ctx.lineWidth = 6 * k
    ctx.strokeStyle = '#18181B'
    ctx.stroke()
    // Gold tape accents
    ctx.fillStyle = '#F59E0B'
    ctx.fillRect(-146 * k, -52 * k, 40 * k, 10 * k)
    ctx.fillRect(106 * k, 42 * k, 40 * k, 10 * k)
    ctx.restore()

    // Paws holding sign
    ctx.fillStyle = '#18181B'
    ctx.beginPath()
    ctx.ellipse(130 * k, 262 * k, 24 * k, 15 * k, -0.1, 0, Math.PI * 2)
    ctx.ellipse(382 * k, 254 * k, 24 * k, 15 * k, 0.1, 0, Math.PI * 2)
    ctx.fill()
  } else if (templateId === 'doge-stare') {
    const grad = ctx.createRadialGradient(256 * k, 256 * k, 30 * k, 256 * k, 256 * k, 310 * k)
    grad.addColorStop(0, '#FEF08A')
    grad.addColorStop(1, '#F59E0B')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, s, s)

    // Speed lines
    ctx.strokeStyle = 'rgba(255,255,255,0.45)'
    ctx.lineWidth = 4 * k
    for (let i = 0; i < 16; i += 1) {
      const a = (i * Math.PI) / 8
      ctx.beginPath()
      ctx.moveTo(256 * k + Math.cos(a) * 165 * k, 256 * k + Math.sin(a) * 165 * k)
      ctx.lineTo(256 * k + Math.cos(a) * 280 * k, 256 * k + Math.sin(a) * 280 * k)
      ctx.stroke()
    }

    // Cheeky gold face orb
    const orb = ctx.createRadialGradient(220 * k, 210 * k, 20 * k, 256 * k, 256 * k, 138 * k)
    orb.addColorStop(0, '#FEF08A')
    orb.addColorStop(0.75, '#FACC15')
    orb.addColorStop(1, '#D97706')
    ctx.fillStyle = orb
    ctx.strokeStyle = '#92400E'
    ctx.lineWidth = 6 * k
    ctx.beginPath()
    ctx.arc(256 * k, 256 * k, 132 * k, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Rosy blush
    ctx.fillStyle = 'rgba(249, 115, 22, 0.45)'
    ctx.beginPath()
    ctx.ellipse(174 * k, 274 * k, 24 * k, 13 * k, 0, 0, Math.PI * 2)
    ctx.ellipse(338 * k, 274 * k, 24 * k, 13 * k, 0, 0, Math.PI * 2)
    ctx.fill()

    // Iconic huaji arched eyes looking right
    for (const ex of [204 * k, 308 * k]) {
      ctx.fillStyle = '#FFFFFF'
      ctx.strokeStyle = '#451A03'
      ctx.lineWidth = 4.5 * k
      ctx.beginPath()
      ctx.ellipse(ex, 232 * k, 32 * k, 16 * k, 0, Math.PI, Math.PI * 2)
      ctx.quadraticCurveTo(ex, 226 * k, ex - 32 * k, 232 * k)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#1C1917'
      ctx.beginPath()
      ctx.arc(ex + 14 * k, 225 * k, 8 * k, 0, Math.PI * 2)
      ctx.fill()
    }
    // High brows
    ctx.strokeStyle = '#451A03'
    ctx.lineWidth = 5 * k
    ctx.beginPath()
    ctx.arc(204 * k, 208 * k, 28 * k, 1.15 * Math.PI, 1.85 * Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(308 * k, 200 * k, 28 * k, 1.15 * Math.PI, 1.85 * Math.PI)
    ctx.stroke()
    // Smug wide smile
    ctx.beginPath()
    ctx.arc(256 * k, 268 * k, 68 * k, 0.14 * Math.PI, 0.86 * Math.PI)
    ctx.stroke()
  } else if (templateId === 'shocked-q') {
    const grad = ctx.createLinearGradient(0, 0, s, s)
    grad.addColorStop(0, '#312E81')
    grad.addColorStop(1, '#4C1D95')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, s, s)

    // Starburst comic explosion
    ctx.fillStyle = '#FACC15'
    ctx.beginPath()
    const spikes = 14
    for (let i = 0; i < spikes * 2; i += 1) {
      const rad = i % 2 === 0 ? 186 * k : 134 * k
      const a = (i * Math.PI) / spikes
      const x = 256 * k + Math.cos(a) * rad
      const y = 256 * k + Math.sin(a) * rad
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()

    // Shocked cartoon head
    ctx.fillStyle = '#FFFFFF'
    ctx.strokeStyle = '#18181B'
    ctx.lineWidth = 6 * k
    ctx.beginPath()
    ctx.arc(256 * k, 260 * k, 96 * k, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Wide stunned eyes
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(222 * k, 244 * k, 22 * k, 0, Math.PI * 2)
    ctx.arc(290 * k, 244 * k, 22 * k, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#18181B'
    ctx.beginPath()
    ctx.arc(222 * k, 244 * k, 6 * k, 0, Math.PI * 2)
    ctx.arc(290 * k, 244 * k, 6 * k, 0, Math.PI * 2)
    ctx.fill()

    // O mouth
    ctx.fillStyle = '#EF4444'
    ctx.beginPath()
    ctx.ellipse(256 * k, 304 * k, 22 * k, 28 * k, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Floating colorful ?
    const qs: Array<[number, number, number, string]> = [
      [96, 178, 66, '#F43F5E'],
      [414, 186, 62, '#38BDF8'],
      [112, 370, 52, '#A7F3D0'],
      [398, 362, 56, '#FB923C'],
    ]
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (const [qx, qy, qsize, qcol] of qs) {
      ctx.font = `900 ${qsize * k}px sans-serif`
      ctx.lineWidth = 6 * k
      ctx.strokeStyle = '#18181B'
      ctx.strokeText('?', qx * k, qy * k)
      ctx.fillStyle = qcol
      ctx.fillText('?', qx * k, qy * k)
    }
  } else if (templateId === 'drake-split') {
    // Top panel (Reject)
    ctx.fillStyle = '#FEE2E2'
    ctx.fillRect(0, 0, s, s / 2)
    // Bottom panel (Approve)
    ctx.fillStyle = '#DCFCE7'
    ctx.fillRect(0, s / 2, s, s / 2)
    // Divider
    ctx.fillStyle = '#18181B'
    ctx.fillRect(0, s / 2 - 3 * k, s, 6 * k)

    // Left badge icons
    ctx.fillStyle = '#EF4444'
    ctx.beginPath()
    ctx.arc(102 * k, 134 * k, 52 * k, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 10 * k
    ctx.beginPath()
    ctx.moveTo(82 * k, 114 * k)
    ctx.lineTo(122 * k, 154 * k)
    ctx.moveTo(122 * k, 114 * k)
    ctx.lineTo(82 * k, 154 * k)
    ctx.stroke()

    ctx.fillStyle = '#16A34A'
    ctx.beginPath()
    ctx.arc(102 * k, 382 * k, 52 * k, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 10 * k
    ctx.beginPath()
    ctx.moveTo(78 * k, 382 * k)
    ctx.lineTo(96 * k, 400 * k)
    ctx.lineTo(128 * k, 364 * k)
    ctx.stroke()

    // Expressive mini faces on right side
    ctx.fillStyle = '#FDE047'
    ctx.strokeStyle = '#18181B'
    ctx.lineWidth = 5 * k
    // Top grumpy face
    ctx.beginPath()
    ctx.arc(406 * k, 134 * k, 44 * k, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(386 * k, 122 * k)
    ctx.lineTo(398 * k, 128 * k)
    ctx.moveTo(426 * k, 122 * k)
    ctx.lineTo(414 * k, 128 * k)
    ctx.moveTo(390 * k, 154 * k)
    ctx.quadraticCurveTo(406 * k, 142 * k, 422 * k, 154 * k)
    ctx.stroke()

    // Bottom happy wink face
    ctx.beginPath()
    ctx.arc(406 * k, 382 * k, 44 * k, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#18181B'
    ctx.beginPath()
    ctx.arc(392 * k, 372 * k, 5.5 * k, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(420 * k, 372 * k, 7 * k, Math.PI, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(406 * k, 386 * k, 20 * k, 0.15 * Math.PI, 0.85 * Math.PI)
    ctx.stroke()
  } else if (templateId === 'code-works') {
    ctx.fillStyle = '#0F172A'
    ctx.fillRect(0, 0, s, s)
    // Subtle matrix grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)'
    ctx.lineWidth = 1.5 * k
    for (let i = 0; i < s; i += 32 * k) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, s)
      ctx.moveTo(0, i)
      ctx.lineTo(s, i)
      ctx.stroke()
    }
    // Terminal card in center
    roundedRectPath(ctx, 56 * k, 126 * k, 400 * k, 256 * k, 16 * k)
    ctx.fillStyle = '#1E293B'
    ctx.fill()
    ctx.strokeStyle = '#38BDF8'
    ctx.lineWidth = 3.5 * k
    ctx.stroke()
    // Traffic lights
    const cols = ['#EF4444', '#F59E0B', '#22C55E']
    cols.forEach((c, idx) => {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc((84 + idx * 24) * k, 154 * k, 7 * k, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.font = `700 ${20 * k}px monospace`
    ctx.textAlign = 'left'
    ctx.fillStyle = '#4ADE80'
    ctx.fillText('✓ Build passed (0 errors)', 84 * k, 210 * k)
    ctx.fillStyle = '#FACC15'
    ctx.fillText('⚠ 42 legacy hacks inside', 84 * k, 246 * k)
    ctx.fillStyle = '#38BDF8'
    ctx.fillText('$ git status -> clean', 84 * k, 282 * k)

    // Warning stripe banner
    ctx.fillStyle = '#FACC15'
    ctx.fillRect(78 * k, 314 * k, 356 * k, 44 * k)
    ctx.font = `900 ${22 * k}px sans-serif`
    ctx.fillStyle = '#0F172A'
    ctx.textAlign = 'center'
    ctx.fillText('DO NOT TOUCH · 勿动源码', 256 * k, 344 * k)
  } else if (templateId === 'boss-pie') {
    const grad = ctx.createLinearGradient(0, 0, 0, s)
    grad.addColorStop(0, '#FEF3C7')
    grad.addColorStop(1, '#FDE68A')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, s, s)

    // Giant glowing golden pie!
    ctx.save()
    ctx.shadowColor = 'rgba(217, 119, 6, 0.35)'
    ctx.shadowBlur = 24 * k
    ctx.fillStyle = '#F59E0B'
    ctx.strokeStyle = '#92400E'
    ctx.lineWidth = 7 * k
    ctx.beginPath()
    ctx.arc(256 * k, 250 * k, 118 * k, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.restore()

    // Inner pie lattice & sparkle
    ctx.fillStyle = '#FDE047'
    ctx.beginPath()
    ctx.arc(256 * k, 250 * k, 96 * k, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#B45309'
    ctx.lineWidth = 4 * k
    ctx.setLineDash([10 * k, 8 * k])
    ctx.beginPath()
    ctx.arc(256 * k, 250 * k, 74 * k, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.font = `900 ${46 * k}px "PingFang SC", sans-serif`
    ctx.fillStyle = '#78350F'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('大 饼', 256 * k, 248 * k)

    // Sparkles
    ctx.fillStyle = '#FFFFFF'
    for (const [sx, sy] of [
      [112, 168],
      [402, 162],
      [392, 338],
      [118, 332],
    ]) {
      ctx.beginPath()
      ctx.arc(sx * k, sy * k, 9 * k, 0, Math.PI * 2)
      ctx.fill()
    }
  } else if (templateId === 'slacking-cat') {
    const grad = ctx.createLinearGradient(0, 0, 0, s)
    grad.addColorStop(0, '#E0F2FE')
    grad.addColorStop(1, '#BAE6FD')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, s, s)

    // Cozy desk
    ctx.fillStyle = '#FDE68A'
    ctx.fillRect(0, 344 * k, s, 168 * k)
    ctx.strokeStyle = '#92400E'
    ctx.lineWidth = 4 * k
    ctx.beginPath()
    ctx.moveTo(0, 344 * k)
    ctx.lineTo(s, 344 * k)
    ctx.stroke()

    // Ginger cat ears
    ctx.fillStyle = '#FB923C'
    ctx.strokeStyle = '#7C2D12'
    ctx.lineWidth = 5 * k
    ctx.beginPath()
    ctx.moveTo(166 * k, 224 * k)
    ctx.lineTo(154 * k, 134 * k)
    ctx.lineTo(222 * k, 178 * k)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(346 * k, 224 * k)
    ctx.lineTo(358 * k, 134 * k)
    ctx.lineTo(290 * k, 178 * k)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Cat head
    ctx.fillStyle = '#FDBA74'
    ctx.beginPath()
    ctx.ellipse(256 * k, 252 * k, 108 * k, 88 * k, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Cool sunglasses on cat
    ctx.fillStyle = '#18181B'
    roundedRectPath(ctx, 174 * k, 222 * k, 72 * k, 38 * k, 10 * k)
    ctx.fill()
    roundedRectPath(ctx, 266 * k, 222 * k, 72 * k, 38 * k, 10 * k)
    ctx.fill()
    ctx.fillRect(244 * k, 232 * k, 24 * k, 8 * k)
    // Gloss on glasses
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 4 * k
    ctx.beginPath()
    ctx.moveTo(188 * k, 232 * k)
    ctx.lineTo(202 * k, 248 * k)
    ctx.moveTo(280 * k, 232 * k)
    ctx.lineTo(294 * k, 248 * k)
    ctx.stroke()

    // Little cat :3 mouth
    ctx.strokeStyle = '#7C2D12'
    ctx.lineWidth = 4.5 * k
    ctx.beginPath()
    ctx.arc(244 * k, 282 * k, 12 * k, 0, Math.PI)
    ctx.arc(268 * k, 282 * k, 12 * k, 0, Math.PI)
    ctx.stroke()

    // Cute fish floating beside cat
    ctx.fillStyle = '#38BDF8'
    ctx.strokeStyle = '#0369A1'
    ctx.lineWidth = 4 * k
    ctx.beginPath()
    ctx.ellipse(396 * k, 166 * k, 28 * k, 16 * k, -0.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(422 * k, 162 * k)
    ctx.lineTo(444 * k, 146 * k)
    ctx.lineTo(446 * k, 178 * k)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  } else if (templateId === 'soul-artist') {
    ctx.fillStyle = '#FFFDF7'
    ctx.fillRect(0, 0, s, s)
    // Notebook grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)'
    ctx.lineWidth = 1.5 * k
    for (let x = 28 * k; x < s; x += 28 * k) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, s)
      ctx.stroke()
    }
    for (let y = 28 * k; y < s; y += 28 * k) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(s, y)
      ctx.stroke()
    }
    // Paint splashes
    const splashes: Array<[number, number, number, string]> = [
      [130, 198, 42, 'rgba(244, 63, 94, 0.35)'],
      [388, 210, 48, 'rgba(56, 189, 248, 0.35)'],
      [350, 336, 38, 'rgba(250, 204, 21, 0.45)'],
    ]
    for (const [bx, by, br, bc] of splashes) {
      ctx.fillStyle = bc
      ctx.beginPath()
      ctx.arc(bx * k, by * k, br * k, 0, Math.PI * 2)
      ctx.fill()
    }
    // Quirky doodle character
    ctx.strokeStyle = '#1E293B'
    ctx.lineWidth = 6 * k
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.ellipse(250 * k, 224 * k, 68 * k, 62 * k, 0.08, 0, Math.PI * 2)
    ctx.stroke()
    // Goofy eyes
    ctx.beginPath()
    ctx.arc(226 * k, 214 * k, 14 * k, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(278 * k, 218 * k, 9 * k, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = '#1E293B'
    ctx.beginPath()
    ctx.arc(228 * k, 214 * k, 4.5 * k, 0, Math.PI * 2)
    ctx.arc(276 * k, 218 * k, 4 * k, 0, Math.PI * 2)
    ctx.fill()
    // Squiggle smile + stick body
    ctx.beginPath()
    ctx.moveTo(222 * k, 252 * k)
    ctx.quadraticCurveTo(252 * k, 272 * k, 280 * k, 248 * k)
    ctx.moveTo(250 * k, 286 * k)
    ctx.lineTo(250 * k, 366 * k)
    ctx.moveTo(250 * k, 316 * k)
    ctx.lineTo(324 * k, 294 * k)
    ctx.moveTo(250 * k, 316 * k)
    ctx.lineTo(184 * k, 342 * k)
    ctx.stroke()
    // Paintbrush
    ctx.strokeStyle = '#D97706'
    ctx.lineWidth = 9 * k
    ctx.beginPath()
    ctx.moveTo(316 * k, 306 * k)
    ctx.lineTo(366 * k, 248 * k)
    ctx.stroke()
  } else if (templateId === 'thumbs-praise') {
    const grad = ctx.createRadialGradient(256 * k, 256 * k, 24 * k, 256 * k, 256 * k, 320 * k)
    grad.addColorStop(0, '#FEF9C3')
    grad.addColorStop(1, '#F59E0B')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, s, s)

    // Radiant rays
    ctx.save()
    ctx.translate(256 * k, 256 * k)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.24)'
    for (let i = 0; i < 12; i += 1) {
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, 340 * k, (i * Math.PI) / 6, (i * Math.PI) / 6 + Math.PI / 14)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()

    // Golden badge circle
    ctx.fillStyle = '#FFFFFF'
    ctx.strokeStyle = '#B45309'
    ctx.lineWidth = 7 * k
    ctx.beginPath()
    ctx.arc(256 * k, 256 * k, 124 * k, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Stylized thumbs-up vector
    ctx.fillStyle = '#FACC15'
    ctx.strokeStyle = '#78350F'
    ctx.lineWidth = 6 * k
    // Cuff
    roundedRectPath(ctx, 174 * k, 242 * k, 46 * k, 84 * k, 10 * k)
    ctx.fillStyle = '#2563EB'
    ctx.fill()
    ctx.stroke()
    // Fist & thumb
    ctx.fillStyle = '#FACC15'
    ctx.beginPath()
    ctx.moveTo(222 * k, 244 * k)
    ctx.quadraticCurveTo(246 * k, 176 * k, 272 * k, 176 * k)
    ctx.quadraticCurveTo(294 * k, 176 * k, 286 * k, 224 * k)
    ctx.lineTo(324 * k, 224 * k)
    ctx.quadraticCurveTo(344 * k, 224 * k, 340 * k, 252 * k)
    ctx.lineTo(332 * k, 304 * k)
    ctx.quadraticCurveTo(326 * k, 326 * k, 300 * k, 326 * k)
    ctx.lineTo(222 * k, 326 * k)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
  ctx.restore()
}

function drawCaptionBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  yAnchor: 'top' | 'bottom',
  opts: MemeRenderOptions,
  s: number,
) {
  const clean = text.trim()
  if (!clean) return
  const k = s / 512
  const fontPx = Math.round(opts.fontSize * k)
  ctx.save()
  ctx.font = `900 ${fontPx}px Impact, "PingFang SC", "Microsoft YaHei", sans-serif`
  ctx.textAlign = opts.align
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'
  ctx.miterLimit = 2

  const maxW = s * 0.86
  const lines = wrapCanvasText(ctx, clean, maxW)
  const lh = fontPx * 1.18
  const x = opts.align === 'left' ? s * 0.07 : opts.align === 'right' ? s * 0.93 : s / 2

  const startY =
    yAnchor === 'top'
      ? Math.max(fontPx * 0.72, 26 * k + fontPx * 0.52)
      : s - Math.max(fontPx * 0.72, 26 * k + fontPx * 0.52) - (lines.length - 1) * lh

  for (let i = 0; i < lines.length; i += 1) {
    const lineY = startY + i * lh
    if (opts.strokeWidth > 0) {
      ctx.strokeStyle = opts.strokeColor
      ctx.lineWidth = opts.strokeWidth * 2 * k
      ctx.strokeText(lines[i], x, lineY)
    }
    ctx.fillStyle = opts.fillColor
    ctx.fillText(lines[i], x, lineY)
  }
  ctx.restore()
}

function drawStickerBadge(ctx: CanvasRenderingContext2D, badge: string, s: number) {
  const clean = badge.trim()
  if (!clean) return
  const k = s / 512
  ctx.save()
  ctx.translate(s - 82 * k, 88 * k)
  ctx.rotate(0.18)
  ctx.font = `900 ${24 * k}px "PingFang SC", "Microsoft YaHei", sans-serif`
  const tw = ctx.measureText(clean).width
  const pw = Math.max(76 * k, tw + 28 * k)
  const ph = 42 * k

  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)'
  ctx.shadowBlur = 10 * k
  ctx.shadowOffsetY = 4 * k
  roundedRectPath(ctx, -pw / 2, -ph / 2, pw, ph, 12 * k)
  ctx.fillStyle = '#EF4444'
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.lineWidth = 3.5 * k
  ctx.strokeStyle = '#FFFFFF'
  ctx.stroke()

  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(clean, 0, 1 * k)
  ctx.restore()
}

export function renderMemeToCanvas(canvas: HTMLCanvasElement, opts: MemeRenderOptions): void {
  const s = opts.size ?? 512
  canvas.width = s
  canvas.height = s
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, s, s)
  ctx.save()

  if (opts.shape === 'circle') {
    ctx.beginPath()
    ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
  } else if (opts.shape === 'rounded') {
    roundedRectPath(ctx, 0, 0, s, s, Math.round(s * 0.08))
    ctx.clip()
  }

  if (opts.customImage && opts.customImage.naturalWidth > 0 && opts.customImage.naturalHeight > 0) {
    const iw = opts.customImage.naturalWidth
    const ih = opts.customImage.naturalHeight
    const scale = Math.max(s / iw, s / ih)
    const dw = iw * scale
    const dh = ih * scale
    ctx.drawImage(opts.customImage, (s - dw) / 2, (s - dh) / 2, dw, dh)
  } else {
    drawTemplateBase(ctx, opts.templateId, s)
  }

  drawCaptionBlock(ctx, opts.topText, 'top', opts, s)
  drawCaptionBlock(ctx, opts.bottomText, 'bottom', opts, s)
  if (opts.badge) {
    drawStickerBadge(ctx, opts.badge, s)
  }

  ctx.restore()
}

export function renderMemeDataUrl(opts: MemeRenderOptions): string {
  if (typeof document === 'undefined') return ''
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  renderMemeToCanvas(canvas, opts)
  try {
    return canvas.toDataURL('image/png')
  } catch {
    return ''
  }
}

const templateThumbCache = new Map<string, string>()

export function getTemplateThumbnail(templateId: MemeTemplateId): string {
  const cached = templateThumbCache.get(templateId)
  if (cached) return cached
  const url = renderMemeDataUrl({
    templateId,
    topText: '',
    bottomText: '',
    fontSize: 36,
    fillColor: '#FFFFFF',
    strokeColor: '#111827',
    strokeWidth: 4,
    align: 'center',
    shape: 'rounded',
    badge: '',
    size: 160,
  })
  if (url) templateThumbCache.set(templateId, url)
  return url
}

const starterCache = new Map<string, string>()

export function getStarterMemeDataUrl(spec: StarterMemeSpec): string {
  const cached = starterCache.get(spec.id)
  if (cached) return cached
  const url = renderMemeDataUrl({
    templateId: spec.templateId,
    topText: spec.topText,
    bottomText: spec.bottomText,
    fontSize: 40,
    fillColor: spec.fillColor ?? '#FFFFFF',
    strokeColor: spec.strokeColor ?? '#111827',
    strokeWidth: 5,
    align: 'center',
    shape: 'square',
    badge: spec.badge,
    size: 384,
  })
  if (url) starterCache.set(spec.id, url)
  return url
}
