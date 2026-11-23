export type TextMemeStyleId =
  | 'big-black'
  | 'big-white'
  | 'panda-board'
  | 'wechat-bubble'
  | 'red-gold'
  | 'cyber-neon'
  | 'sticky-note'
  | 'terminal-err'

export interface TextMemeStyleSpec {
  id: TextMemeStyleId
  name: string
  nameEn: string
  bgColor: string
  textColor: string
  accentColor: string
  defaultFontSize: number
}

export interface TextMemeConfig {
  style: TextMemeStyleId
  text: string
  fontSize: number
  textColor: string
  bgColor: string
  size: number
}

export const TEXT_MEME_STYLES: TextMemeStyleSpec[] = [
  {
    id: 'big-black',
    name: '经典大字报',
    nameEn: 'Classic Dark',
    bgColor: '#0F1115',
    textColor: '#FFFFFF',
    accentColor: '#FACC15',
    defaultFontSize: 64,
  },
  {
    id: 'big-white',
    name: '白底粗黑字',
    nameEn: 'Bold Minimal',
    bgColor: '#FFFFFF',
    textColor: '#111827',
    accentColor: '#111827',
    defaultFontSize: 64,
  },
  {
    id: 'panda-board',
    name: '熊猫举牌',
    nameEn: 'Panda Sign',
    bgColor: '#F8F7F4',
    textColor: '#18181B',
    accentColor: '#D97706',
    defaultFontSize: 48,
  },
  {
    id: 'wechat-bubble',
    name: '微信聊天气泡',
    nameEn: 'Chat Bubble',
    bgColor: '#EDEDED',
    textColor: '#111827',
    accentColor: '#95EC69',
    defaultFontSize: 40,
  },
  {
    id: 'red-gold',
    name: '喜报红金',
    nameEn: 'Festive Gold',
    bgColor: '#B91C1C',
    textColor: '#FDE047',
    accentColor: '#F59E0B',
    defaultFontSize: 56,
  },
  {
    id: 'cyber-neon',
    name: '赛博霓虹',
    nameEn: 'Cyber Neon',
    bgColor: '#09071A',
    textColor: '#22D3EE',
    accentColor: '#F472B6',
    defaultFontSize: 56,
  },
  {
    id: 'sticky-note',
    name: '便利贴手写感',
    nameEn: 'Sticky Note',
    bgColor: '#FEF08A',
    textColor: '#422006',
    accentColor: '#D97706',
    defaultFontSize: 50,
  },
  {
    id: 'terminal-err',
    name: '终端报错风',
    nameEn: 'Terminal Log',
    bgColor: '#111827',
    textColor: '#4ADE80',
    accentColor: '#F87171',
    defaultFontSize: 36,
  },
]

export const TEXT_MEME_PRESETS: string[] = [
  '收到！马上改',
  '代码能跑就别动',
  '今天也在努力摸鱼',
  '已老实，求放过',
  '班味太重了',
  '让我看看是谁在卷',
]

const STYLE_MAP = new Map(TEXT_MEME_STYLES.map((s) => [s.id, s]))
const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export function getTextMemeStyle(id: string): TextMemeStyleSpec | undefined {
  return STYLE_MAP.get(id as TextMemeStyleId)
}

export function buildTextMemeConfig(input: {
  text: unknown
  style?: unknown
  fontSize?: unknown
  textColor?: unknown
  bgColor?: unknown
  size?: unknown
}): { ok: true; config: TextMemeConfig; styleMeta: TextMemeStyleSpec } | { ok: false; error: string } {
  if (typeof input.text !== 'string' || !input.text.trim()) {
    return { ok: false, error: 'Parameter "text" must be a non-empty string' }
  }
  const cleanText = input.text.trim()
  if (cleanText.length > 120) {
    return { ok: false, error: 'Parameter "text" must be 120 characters or fewer' }
  }

  const styleId = input.style === undefined ? 'big-black' : input.style
  if (typeof styleId !== 'string' || !STYLE_MAP.has(styleId as TextMemeStyleId)) {
    return {
      ok: false,
      error: `Invalid style "${String(styleId)}". Valid styles: ${TEXT_MEME_STYLES.map((s) => s.id).join(', ')}`,
    }
  }
  const styleMeta = STYLE_MAP.get(styleId as TextMemeStyleId)!

  let fontSize = styleMeta.defaultFontSize
  if (input.fontSize !== undefined) {
    if (typeof input.fontSize !== 'number' || !Number.isFinite(input.fontSize) || input.fontSize < 24 || input.fontSize > 96) {
      return { ok: false, error: 'Parameter "fontSize" must be a number between 24 and 96' }
    }
    fontSize = Math.round(input.fontSize)
  }

  let textColor = styleMeta.textColor
  if (input.textColor !== undefined) {
    if (typeof input.textColor !== 'string' || !HEX_COLOR_RE.test(input.textColor.trim())) {
      return { ok: false, error: 'Parameter "textColor" must be a valid HEX color like #FFFFFF' }
    }
    textColor = input.textColor.trim().toUpperCase()
  }

  let bgColor = styleMeta.bgColor
  if (input.bgColor !== undefined) {
    if (typeof input.bgColor !== 'string' || !HEX_COLOR_RE.test(input.bgColor.trim())) {
      return { ok: false, error: 'Parameter "bgColor" must be a valid HEX color like #111827' }
    }
    bgColor = input.bgColor.trim().toUpperCase()
  }

  let size = 512
  if (input.size !== undefined) {
    if (typeof input.size !== 'number' || !Number.isFinite(input.size) || input.size < 256 || input.size > 1024) {
      return { ok: false, error: 'Parameter "size" must be a number between 256 and 1024' }
    }
    size = Math.round(input.size)
  }

  return {
    ok: true,
    config: {
      style: styleMeta.id,
      text: cleanText,
      fontSize,
      textColor,
      bgColor,
      size,
    },
    styleMeta,
  }
}

export interface FittedTextBlock {
  lines: string[]
  fontPx: number
  lineHeight: number
  totalHeight: number
}

function tokenizeParagraph(para: string): string[] {
  // Keep ASCII/Latin words together when possible while allowing CJK chars and punctuation to wrap cleanly
  const tokens: string[] = []
  let asciiBuf = ''
  for (const ch of Array.from(para)) {
    if (/[A-Za-z0-9_'-]/.test(ch)) {
      asciiBuf += ch
    } else {
      if (asciiBuf) {
        tokens.push(asciiBuf)
        asciiBuf = ''
      }
      tokens.push(ch)
    }
  }
  if (asciiBuf) tokens.push(asciiBuf)
  return tokens
}

export function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const safeMaxWidth = Math.max(24, maxWidth)
  const paragraphs = text.split(/\r?\n/)
  const lines: string[] = []
  for (const para of paragraphs) {
    if (!para) {
      lines.push('')
      continue
    }
    const tokens = tokenizeParagraph(para)
    let current = ''
    for (const token of tokens) {
      // Skip leading spaces at start of wrapped line
      if (!current && /^\s+$/.test(token)) continue
      const candidate = current + token
      if (ctx.measureText(candidate).width <= safeMaxWidth) {
        current = candidate
        continue
      }
      if (current) {
        lines.push(current.trimEnd())
        current = ''
      }
      if (/^\s+$/.test(token)) continue
      // Single token fits on a fresh line
      if (ctx.measureText(token).width <= safeMaxWidth) {
        current = token
        continue
      }
      // Ultra-long token (e.g. URL or long word): break by character
      for (const ch of Array.from(token)) {
        const next = current + ch
        if (current && ctx.measureText(next).width > safeMaxWidth) {
          lines.push(current)
          current = ch
        } else {
          current = next
        }
      }
    }
    if (current.trimEnd()) lines.push(current.trimEnd())
  }
  return lines.length > 0 ? lines : ['']
}

export function fitCanvasTextBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  opts: {
    maxWidth: number
    maxHeight: number
    initialFontPx: number
    minFontPx?: number
    fontWeight?: number | string
    fontFamily: string
    lineHeightRatio?: number
    linePrefix?: string
  },
): FittedTextBlock {
  const minFontPx = Math.max(12, Math.round(opts.minFontPx ?? 16))
  const weight = opts.fontWeight ?? 900
  const lhRatio = opts.lineHeightRatio ?? 1.24
  const prefix = opts.linePrefix ?? ''

  let fontPx = Math.max(minFontPx, Math.round(opts.initialFontPx))
  let bestLines: string[] = [text]
  let bestLh = fontPx * lhRatio

  while (fontPx >= minFontPx) {
    ctx.font = `${weight} ${fontPx}px ${opts.fontFamily}`
    const prefixW = prefix ? ctx.measureText(prefix).width : 0
    const availW = Math.max(24, opts.maxWidth - prefixW)
    const lines = wrapCanvasText(ctx, text, availW)
    const lh = fontPx * lhRatio
    const totalH = lines.length * lh
    bestLines = lines
    bestLh = lh
    if (totalH <= opts.maxHeight || fontPx === minFontPx) {
      break
    }
    const step = fontPx > 44 ? 3 : 2
    fontPx = Math.max(minFontPx, fontPx - step)
  }

  // Final safety cap if text still exceeds maxHeight at minFontPx
  const maxLines = Math.max(1, Math.floor(opts.maxHeight / bestLh))
  if (bestLines.length > maxLines) {
    const trimmed = bestLines.slice(0, maxLines)
    const last = trimmed[trimmed.length - 1]
    trimmed[trimmed.length - 1] = last.length > 1 ? `${last.slice(0, -1)}…` : '…'
    bestLines = trimmed
  }

  ctx.font = `${weight} ${fontPx}px ${opts.fontFamily}`
  return {
    lines: bestLines,
    fontPx,
    lineHeight: bestLh,
    totalHeight: bestLines.length * bestLh,
  }
}

function drawRoundedRect(
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

export function renderTextMemeToCanvas(canvas: HTMLCanvasElement, config: TextMemeConfig): void {
  const s = config.size
  canvas.width = s
  canvas.height = s
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const scale = s / 512
  const fontPx = Math.round(config.fontSize * scale)

  ctx.save()
  ctx.clearRect(0, 0, s, s)

  if (config.style === 'big-black') {
    ctx.fillStyle = config.bgColor
    ctx.fillRect(0, 0, s, s)
    // subtle editorial corner marks
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)'
    ctx.lineWidth = 3 * scale
    ctx.strokeRect(18 * scale, 18 * scale, s - 36 * scale, s - 36 * scale)
    const fit = fitCanvasTextBlock(ctx, config.text, {
      maxWidth: s * 0.8,
      maxHeight: s * 0.78,
      initialFontPx: fontPx,
      minFontPx: Math.round(18 * scale),
      fontWeight: 900,
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      lineHeightRatio: 1.24,
    })
    ctx.fillStyle = config.textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const startY = s / 2 - ((fit.lines.length - 1) * fit.lineHeight) / 2
    fit.lines.forEach((line, i) => ctx.fillText(line, s / 2, startY + i * fit.lineHeight))
  } else if (config.style === 'big-white') {
    ctx.fillStyle = config.bgColor
    ctx.fillRect(0, 0, s, s)
    ctx.strokeStyle = '#111827'
    ctx.lineWidth = 6 * scale
    ctx.strokeRect(16 * scale, 16 * scale, s - 32 * scale, s - 32 * scale)
    const fit = fitCanvasTextBlock(ctx, config.text, {
      maxWidth: s * 0.8,
      maxHeight: s * 0.78,
      initialFontPx: fontPx,
      minFontPx: Math.round(18 * scale),
      fontWeight: 900,
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      lineHeightRatio: 1.24,
    })
    ctx.fillStyle = config.textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const startY = s / 2 - ((fit.lines.length - 1) * fit.lineHeight) / 2
    fit.lines.forEach((line, i) => ctx.fillText(line, s / 2, startY + i * fit.lineHeight))
  } else if (config.style === 'panda-board') {
    ctx.fillStyle = config.bgColor
    ctx.fillRect(0, 0, s, s)
    // Panda ears peeking behind board
    ctx.fillStyle = '#18181B'
    ctx.beginPath()
    ctx.arc(172 * scale, 82 * scale, 34 * scale, 0, Math.PI * 2)
    ctx.arc(340 * scale, 82 * scale, 34 * scale, 0, Math.PI * 2)
    ctx.fill()
    // Panda head
    ctx.fillStyle = '#FFFFFF'
    ctx.strokeStyle = '#18181B'
    ctx.lineWidth = 6 * scale
    ctx.beginPath()
    ctx.ellipse(256 * scale, 132 * scale, 96 * scale, 78 * scale, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    // Eyes
    ctx.fillStyle = '#18181B'
    ctx.beginPath()
    ctx.ellipse(218 * scale, 128 * scale, 18 * scale, 13 * scale, -0.2, 0, Math.PI * 2)
    ctx.ellipse(294 * scale, 128 * scale, 18 * scale, 13 * scale, 0.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(222 * scale, 125 * scale, 4.5 * scale, 0, Math.PI * 2)
    ctx.arc(290 * scale, 125 * scale, 4.5 * scale, 0, Math.PI * 2)
    ctx.fill()
    // Smirk mouth
    ctx.strokeStyle = '#18181B'
    ctx.lineWidth = 4 * scale
    ctx.beginPath()
    ctx.arc(256 * scale, 152 * scale, 16 * scale, 0.15 * Math.PI, 0.85 * Math.PI)
    ctx.stroke()
    // Signboard
    drawRoundedRect(ctx, 44 * scale, 186 * scale, 424 * scale, 276 * scale, 18 * scale)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()
    ctx.lineWidth = 6 * scale
    ctx.strokeStyle = '#18181B'
    ctx.stroke()
    // Little paws gripping top edge
    ctx.fillStyle = '#18181B'
    ctx.beginPath()
    ctx.ellipse(122 * scale, 186 * scale, 24 * scale, 15 * scale, 0, 0, Math.PI * 2)
    ctx.ellipse(390 * scale, 186 * scale, 24 * scale, 15 * scale, 0, 0, Math.PI * 2)
    ctx.fill()
    // Text on board (strictly inside signboard bounds)
    const fit = fitCanvasTextBlock(ctx, config.text, {
      maxWidth: 368 * scale,
      maxHeight: 224 * scale,
      initialFontPx: fontPx,
      minFontPx: Math.round(16 * scale),
      fontWeight: 900,
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      lineHeightRatio: 1.24,
    })
    ctx.fillStyle = config.textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const startY = 326 * scale - ((fit.lines.length - 1) * fit.lineHeight) / 2
    fit.lines.forEach((line, i) => ctx.fillText(line, 256 * scale, startY + i * fit.lineHeight))
  } else if (config.style === 'wechat-bubble') {
    ctx.fillStyle = config.bgColor
    ctx.fillRect(0, 0, s, s)
    // Timestamp pill
    drawRoundedRect(ctx, 206 * scale, 48 * scale, 100 * scale, 30 * scale, 6 * scale)
    ctx.fillStyle = 'rgba(0,0,0,0.12)'
    ctx.fill()
    ctx.font = `500 ${15 * scale}px sans-serif`
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('刚刚', 256 * scale, 63 * scale)

    // Avatar on right
    drawRoundedRect(ctx, 412 * scale, 156 * scale, 66 * scale, 66 * scale, 10 * scale)
    ctx.fillStyle = '#EAB308'
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(434 * scale, 184 * scale, 5 * scale, 0, Math.PI * 2)
    ctx.arc(456 * scale, 184 * scale, 5 * scale, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 4 * scale
    ctx.beginPath()
    ctx.arc(445 * scale, 194 * scale, 12 * scale, 0.15 * Math.PI, 0.85 * Math.PI)
    ctx.stroke()

    // Measure text for bubble within safe height
    const fit = fitCanvasTextBlock(ctx, config.text, {
      maxWidth: 296 * scale,
      maxHeight: 316 * scale,
      initialFontPx: fontPx,
      minFontPx: Math.round(16 * scale),
      fontWeight: 600,
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      lineHeightRatio: 1.32,
    })
    const maxLineW = Math.max(...fit.lines.map((l) => ctx.measureText(l).width), 80 * scale)
    const padX = 26 * scale
    const padY = 22 * scale
    const bw = Math.min(348 * scale, maxLineW + padX * 2)
    const bh = Math.min(368 * scale, Math.max(78 * scale, fit.totalHeight + padY * 2))
    const bx = 392 * scale - bw
    const by = Math.max(108 * scale, Math.min(s - bh - 24 * scale, 266 * scale - bh / 2))

    // Speech bubble tail
    ctx.fillStyle = '#95EC69'
    ctx.beginPath()
    ctx.moveTo(390 * scale, Math.min(by + 28 * scale, by + bh - 18 * scale))
    ctx.lineTo(404 * scale, Math.min(by + 38 * scale, by + bh - 10 * scale))
    ctx.lineTo(390 * scale, Math.min(by + 48 * scale, by + bh - 2 * scale))
    ctx.closePath()
    ctx.fill()

    drawRoundedRect(ctx, bx, by, bw, bh, 14 * scale)
    ctx.fill()

    ctx.fillStyle = config.textColor
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const startY = by + bh / 2 - ((fit.lines.length - 1) * fit.lineHeight) / 2
    fit.lines.forEach((line, i) => ctx.fillText(line, bx + padX, startY + i * fit.lineHeight))
  } else if (config.style === 'red-gold') {
    const grad = ctx.createLinearGradient(0, 0, 0, s)
    grad.addColorStop(0, '#DC2626')
    grad.addColorStop(1, '#991B1B')
    ctx.fillStyle = config.bgColor === '#B91C1C' ? grad : config.bgColor
    ctx.fillRect(0, 0, s, s)
    // Sunburst subtle rays
    ctx.save()
    ctx.translate(s / 2, s / 2)
    ctx.fillStyle = 'rgba(253, 224, 71, 0.08)'
    for (let i = 0; i < 12; i += 1) {
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, s * 0.8, (i * Math.PI) / 6, (i * Math.PI) / 6 + Math.PI / 14)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
    // Double gold border
    ctx.strokeStyle = '#FDE047'
    ctx.lineWidth = 6 * scale
    ctx.strokeRect(20 * scale, 20 * scale, s - 40 * scale, s - 40 * scale)
    ctx.lineWidth = 2 * scale
    ctx.strokeRect(30 * scale, 30 * scale, s - 60 * scale, s - 60 * scale)
    // Banner title
    drawRoundedRect(ctx, 148 * scale, 48 * scale, 216 * scale, 56 * scale, 28 * scale)
    ctx.fillStyle = '#FDE047'
    ctx.fill()
    ctx.font = `900 ${32 * scale}px "PingFang SC", "Microsoft YaHei", sans-serif`
    ctx.fillStyle = '#991B1B'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('★ 喜  报 ★', 256 * scale, 77 * scale)

    const fit = fitCanvasTextBlock(ctx, config.text, {
      maxWidth: s * 0.76,
      maxHeight: 320 * scale,
      initialFontPx: fontPx,
      minFontPx: Math.round(18 * scale),
      fontWeight: 900,
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      lineHeightRatio: 1.26,
    })
    ctx.fillStyle = config.textColor
    ctx.shadowColor = 'rgba(127, 29, 29, 0.65)'
    ctx.shadowBlur = 8 * scale
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const startY = 300 * scale - ((fit.lines.length - 1) * fit.lineHeight) / 2
    fit.lines.forEach((line, i) => ctx.fillText(line, s / 2, startY + i * fit.lineHeight))
  } else if (config.style === 'cyber-neon') {
    ctx.fillStyle = config.bgColor
    ctx.fillRect(0, 0, s, s)
    // Perspective neon grid
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.2)'
    ctx.lineWidth = 1.5 * scale
    for (let y = 300 * scale; y < s; y += 28 * scale) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(s, y)
      ctx.stroke()
    }
    for (let x = -s; x <= s * 2; x += 64 * scale) {
      ctx.beginPath()
      ctx.moveTo(s / 2, 260 * scale)
      ctx.lineTo(x, s)
      ctx.stroke()
    }
    // Glowing neon frame
    drawRoundedRect(ctx, 26 * scale, 26 * scale, s - 52 * scale, s - 52 * scale, 16 * scale)
    ctx.strokeStyle = '#F472B6'
    ctx.shadowColor = '#F472B6'
    ctx.shadowBlur = 16 * scale
    ctx.lineWidth = 4 * scale
    ctx.stroke()

    const fit = fitCanvasTextBlock(ctx, config.text, {
      maxWidth: s * 0.78,
      maxHeight: s * 0.74,
      initialFontPx: fontPx,
      minFontPx: Math.round(18 * scale),
      fontWeight: 900,
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      lineHeightRatio: 1.26,
    })
    ctx.fillStyle = config.textColor
    ctx.shadowColor = config.textColor
    ctx.shadowBlur = 18 * scale
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const startY = s / 2 - ((fit.lines.length - 1) * fit.lineHeight) / 2
    fit.lines.forEach((line, i) => ctx.fillText(line, s / 2, startY + i * fit.lineHeight))
  } else if (config.style === 'sticky-note') {
    ctx.fillStyle = '#E7E5E4'
    ctx.fillRect(0, 0, s, s)
    ctx.save()
    ctx.translate(s / 2, s / 2)
    ctx.rotate(-0.03)
    ctx.shadowColor = 'rgba(28, 25, 23, 0.22)'
    ctx.shadowBlur = 22 * scale
    ctx.shadowOffsetY = 12 * scale
    ctx.fillStyle = config.bgColor
    ctx.fillRect(-200 * scale, -192 * scale, 400 * scale, 392 * scale)
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0
    // Ruled lines
    ctx.strokeStyle = 'rgba(161, 98, 7, 0.14)'
    ctx.lineWidth = 1.5 * scale
    for (let y = -120 * scale; y <= 168 * scale; y += 48 * scale) {
      ctx.beginPath()
      ctx.moveTo(-176 * scale, y)
      ctx.lineTo(176 * scale, y)
      ctx.stroke()
    }
    // Masking tape
    ctx.fillStyle = 'rgba(255, 255, 255, 0.62)'
    ctx.fillRect(-66 * scale, -214 * scale, 132 * scale, 38 * scale)

    const fit = fitCanvasTextBlock(ctx, config.text, {
      maxWidth: 344 * scale,
      maxHeight: 320 * scale,
      initialFontPx: fontPx,
      minFontPx: Math.round(16 * scale),
      fontWeight: 800,
      fontFamily: '"PingFang SC", "Comic Sans MS", "Microsoft YaHei", sans-serif',
      lineHeightRatio: 1.28,
    })
    ctx.fillStyle = config.textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const startY = 8 * scale - ((fit.lines.length - 1) * fit.lineHeight) / 2
    fit.lines.forEach((line, i) => ctx.fillText(line, 0, startY + i * fit.lineHeight))
    ctx.restore()
  } else if (config.style === 'terminal-err') {
    ctx.fillStyle = '#0B0F19'
    ctx.fillRect(0, 0, s, s)
    drawRoundedRect(ctx, 26 * scale, 26 * scale, s - 52 * scale, s - 52 * scale, 14 * scale)
    ctx.fillStyle = config.bgColor
    ctx.fill()
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 2.5 * scale
    ctx.stroke()

    // Traffic lights
    const dots = ['#EF4444', '#F59E0B', '#22C55E']
    dots.forEach((c, idx) => {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc((54 + idx * 24) * scale, 54 * scale, 7 * scale, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.font = `600 ${15 * scale}px monospace`
    ctx.fillStyle = '#94A3B8'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('bash — funmeme@prod', 256 * scale, 54 * scale)

    // Divider
    ctx.strokeStyle = '#1E293B'
    ctx.beginPath()
    ctx.moveTo(26 * scale, 78 * scale)
    ctx.lineTo(s - 26 * scale, 78 * scale)
    ctx.stroke()

    // Command header
    ctx.font = `700 ${19 * scale}px monospace`
    ctx.fillStyle = '#F59E0B'
    ctx.textAlign = 'left'
    ctx.fillText('$ ./check-mood.sh --now', 50 * scale, 118 * scale)
    ctx.fillStyle = '#F87171'
    ctx.fillText('[WARN] status_code=200_OK_MAYBE', 50 * scale, 150 * scale)

    // Main message (strictly between header y=176 and footer y=432)
    const fit = fitCanvasTextBlock(ctx, config.text, {
      maxWidth: 404 * scale,
      maxHeight: 244 * scale,
      initialFontPx: fontPx,
      minFontPx: Math.round(15 * scale),
      fontWeight: 800,
      fontFamily: '"SF Mono", "PingFang SC", monospace',
      lineHeightRatio: 1.32,
      linePrefix: '> ',
    })
    ctx.fillStyle = config.textColor
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const startY = 302 * scale - ((fit.lines.length - 1) * fit.lineHeight) / 2
    fit.lines.forEach((line, i) => ctx.fillText(`> ${line}`, 50 * scale, startY + i * fit.lineHeight))

    // Footer prompt
    ctx.font = `600 ${16 * scale}px monospace`
    ctx.fillStyle = '#64748B'
    ctx.fillText('Process exited with code 0 (press Ctrl+C to slack)', 50 * scale, 456 * scale)
  }

  ctx.restore()
}

export function renderTextMemeDataUrl(config: TextMemeConfig): string {
  if (typeof document === 'undefined') return ''
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  renderTextMemeToCanvas(canvas, config)
  try {
    return canvas.toDataURL('image/png')
  } catch {
    return ''
  }
}
