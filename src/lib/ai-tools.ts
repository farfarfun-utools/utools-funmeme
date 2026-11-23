import { searchEmojiKaomoji } from './emoji'
import { MEME_TEMPLATES } from './templates'
import { buildTextMemeConfig } from './text-meme'

const VALID_KINDS = new Set(['all', 'emoji', 'kaomoji'])
const VALID_TEMPLATE_CATEGORIES = new Set(['all', 'panda', 'reaction', 'work', 'tech'])

export function searchEmojiKaomojiTool(params: unknown) {
  const rec = params && typeof params === 'object' ? (params as Record<string, unknown>) : {}
  const query = rec.query === undefined ? '' : rec.query
  if (typeof query !== 'string' || query.length > 80) {
    return { ok: false as const, error: 'Parameter "query" must be a string up to 80 characters' }
  }
  const kind = rec.kind === undefined ? 'all' : rec.kind
  if (typeof kind !== 'string' || !VALID_KINDS.has(kind)) {
    return { ok: false as const, error: 'Parameter "kind" must be "all", "emoji", or "kaomoji"' }
  }
  const category = rec.category === undefined ? '' : rec.category
  if (typeof category !== 'string' || category.length > 40) {
    return { ok: false as const, error: 'Parameter "category" must be a string' }
  }
  let limit = 12
  if (rec.limit !== undefined) {
    if (typeof rec.limit !== 'number' || !Number.isFinite(rec.limit) || rec.limit < 1 || rec.limit > 50) {
      return { ok: false as const, error: 'Parameter "limit" must be a number between 1 and 50' }
    }
    limit = Math.round(rec.limit)
  }

  const items = searchEmojiKaomoji({
    query,
    kind: kind as 'all' | 'emoji' | 'kaomoji',
    category,
    limit,
  })
  return {
    ok: true as const,
    total: items.length,
    items,
  }
}

export function listMemeTemplatesTool(params: unknown) {
  const rec = params && typeof params === 'object' ? (params as Record<string, unknown>) : {}
  const category = rec.category === undefined ? 'all' : rec.category
  if (typeof category !== 'string' || !VALID_TEMPLATE_CATEGORIES.has(category)) {
    return {
      ok: false as const,
      error: 'Parameter "category" must be one of: all, panda, reaction, work, tech',
    }
  }
  const templates = MEME_TEMPLATES.filter((t) => category === 'all' || t.category === category).map(
    (t) => ({
      id: t.id,
      name: t.name,
      nameEn: t.nameEn,
      category: t.category,
      tags: t.tags,
      defaultTop: t.defaultTop,
      defaultBottom: t.defaultBottom,
    }),
  )
  return {
    ok: true as const,
    total: templates.length,
    templates,
  }
}

export function buildTextMemeConfigTool(params: unknown) {
  if (!params || typeof params !== 'object') {
    return { ok: false as const, error: 'Parameters must be an object with a "text" string' }
  }
  const rec = params as Record<string, unknown>
  const built = buildTextMemeConfig({
    text: rec.text,
    style: rec.style,
    fontSize: rec.fontSize,
    textColor: rec.textColor,
    bgColor: rec.bgColor,
    size: rec.size,
  })
  if (!built.ok) {
    return { ok: false as const, error: built.error }
  }
  return {
    ok: true as const,
    styleName: built.styleMeta.name,
    styleNameEn: built.styleMeta.nameEn,
    config: built.config,
  }
}

export function registerFunMemeAiTools(): void {
  if (typeof window === 'undefined' || typeof window.utools?.registerTool !== 'function') {
    return
  }
  window.utools.registerTool('search_emoji_kaomoji', searchEmojiKaomojiTool)
  window.utools.registerTool('list_meme_templates', listMemeTemplatesTool)
  window.utools.registerTool('build_text_meme_config', buildTextMemeConfigTool)
}
