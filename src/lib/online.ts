import type { OnlineApiSettings } from './storage'

export type OnlineSourceId = 'offline' | 'imgflip' | 'giphy' | 'tenor' | 'custom'

export interface MemeFeedItem {
  id: string
  title: string
  url: string
  previewUrl: string
  source: OnlineSourceId
  tags: string[]
  templateId?: string
  topText?: string
  bottomText?: string
}

function isSafeImageUrl(val: unknown): val is string {
  if (typeof val !== 'string') return false
  const s = val.trim()
  return s.startsWith('https://') || s.startsWith('data:image/')
}

export function parseOnlineResponse(
  source: Exclude<OnlineSourceId, 'offline'>,
  payload: unknown,
  query = '',
): MemeFeedItem[] {
  const q = query.trim().toLowerCase()

  if (source === 'imgflip') {
    const rec = payload as { success?: boolean; data?: { memes?: Array<Record<string, unknown>> } }
    const rawList = Array.isArray(rec?.data?.memes) ? rec.data.memes : []
    const items: MemeFeedItem[] = []
    for (const m of rawList) {
      if (!isSafeImageUrl(m?.url)) continue
      const title = typeof m.name === 'string' && m.name.trim() ? m.name.trim() : 'Meme Template'
      if (q && !title.toLowerCase().includes(q)) continue
      items.push({
        id: `imgflip_${String(m.id ?? items.length)}`,
        title,
        url: m.url,
        previewUrl: m.url,
        source: 'imgflip',
        tags: ['imgflip'],
      })
      if (items.length >= 30) break
    }
    return items
  }

  if (source === 'giphy') {
    const rec = payload as { data?: Array<Record<string, any>> }
    const rawList = Array.isArray(rec?.data) ? rec.data : []
    const items: MemeFeedItem[] = []
    for (const item of rawList) {
      const fullUrl = item?.images?.original?.url ?? item?.images?.downsized?.url
      const thumbUrl = item?.images?.fixed_width?.url ?? fullUrl
      if (!isSafeImageUrl(fullUrl)) continue
      items.push({
        id: `giphy_${String(item.id ?? items.length)}`,
        title: typeof item.title === 'string' && item.title.trim() ? item.title.trim() : 'GIPHY Meme',
        url: fullUrl,
        previewUrl: isSafeImageUrl(thumbUrl) ? thumbUrl : fullUrl,
        source: 'giphy',
        tags: ['giphy'],
      })
      if (items.length >= 24) break
    }
    return items
  }

  if (source === 'tenor') {
    const rec = payload as { results?: Array<Record<string, any>> }
    const rawList = Array.isArray(rec?.results) ? rec.results : []
    const items: MemeFeedItem[] = []
    for (const item of rawList) {
      const formats = item?.media_formats ?? {}
      const fullUrl = formats?.gif?.url ?? formats?.mediumgif?.url ?? formats?.tinygif?.url
      const thumbUrl = formats?.tinygif?.url ?? formats?.nanogif?.url ?? fullUrl
      if (!isSafeImageUrl(fullUrl)) continue
      items.push({
        id: `tenor_${String(item.id ?? items.length)}`,
        title:
          typeof item.content_description === 'string' && item.content_description.trim()
            ? item.content_description.trim()
            : typeof item.title === 'string' && item.title.trim()
              ? item.title.trim()
              : 'Tenor Meme',
        url: fullUrl,
        previewUrl: isSafeImageUrl(thumbUrl) ? thumbUrl : fullUrl,
        source: 'tenor',
        tags: Array.isArray(item.tags) ? item.tags.filter((x: unknown) => typeof x === 'string').slice(0, 4) : ['tenor'],
      })
      if (items.length >= 24) break
    }
    return items
  }

  // Custom flexible JSON parser
  const container = payload as Record<string, unknown> | unknown[]
  let list: unknown[] = []
  if (Array.isArray(container)) {
    list = container
  } else if (container && typeof container === 'object') {
    const dataObj = container.data as Record<string, unknown> | unknown[] | undefined
    if (Array.isArray(dataObj)) {
      list = dataObj
    } else if (dataObj && typeof dataObj === 'object' && Array.isArray(dataObj.memes)) {
      list = dataObj.memes
    } else if (Array.isArray(container.results)) {
      list = container.results
    } else if (Array.isArray(container.items)) {
      list = container.items
    } else if (Array.isArray(container.memes)) {
      list = container.memes
    }
  }

  const items: MemeFeedItem[] = []
  for (let i = 0; i < list.length; i += 1) {
    const entry = list[i] as Record<string, unknown>
    if (!entry || typeof entry !== 'object') continue
    const candidateUrl = entry.url ?? entry.image ?? entry.src ?? entry.gif
    const candidatePreview = entry.preview ?? entry.thumbnail ?? candidateUrl
    if (!isSafeImageUrl(candidateUrl)) continue
    const title = String(entry.title ?? entry.name ?? entry.caption ?? `Meme #${i + 1}`).trim()
    items.push({
      id: `custom_${String(entry.id ?? i)}`,
      title: title || `Meme #${i + 1}`,
      url: candidateUrl,
      previewUrl: isSafeImageUrl(candidatePreview) ? candidatePreview : candidateUrl,
      source: 'custom',
      tags: ['custom'],
    })
    if (items.length >= 30) break
  }
  return items
}

export function buildOnlineEndpointUrl(
  source: Exclude<OnlineSourceId, 'offline'>,
  query: string,
  settings: OnlineApiSettings,
): { ok: true; url: string } | { ok: false; code: 'need_key' | 'need_url' | 'invalid_url' } {
  const q = encodeURIComponent(query.trim() || 'funny')
  if (source === 'imgflip') {
    return { ok: true, url: 'https://api.imgflip.com/get_memes' }
  }
  if (source === 'giphy') {
    const key = settings.giphyApiKey.trim()
    if (!key) return { ok: false, code: 'need_key' }
    return {
      ok: true,
      url: `https://api.giphy.com/v1/gifs/search?api_key=${encodeURIComponent(key)}&q=${q}&limit=24&rating=g`,
    }
  }
  if (source === 'tenor') {
    const key = settings.tenorApiKey.trim()
    if (!key) return { ok: false, code: 'need_key' }
    return {
      ok: true,
      url: `https://tenor.googleapis.com/v2/search?key=${encodeURIComponent(key)}&q=${q}&limit=24&media_filter=tinygif,gif`,
    }
  }
  const tpl = settings.customApiUrl.trim()
  if (!tpl) return { ok: false, code: 'need_url' }
  const built = tpl.includes('{query}') ? tpl.replace(/\{query\}/g, q) : tpl
  try {
    const parsed = new URL(built)
    if (parsed.protocol !== 'https:') return { ok: false, code: 'invalid_url' }
    return { ok: true, url: parsed.toString() }
  } catch {
    return { ok: false, code: 'invalid_url' }
  }
}

export async function fetchOnlineMemes(
  source: Exclude<OnlineSourceId, 'offline'>,
  query: string,
  settings: OnlineApiSettings,
): Promise<MemeFeedItem[]> {
  const built = buildOnlineEndpointUrl(source, query, settings)
  if (!built.ok) {
    throw new Error(built.code)
  }

  let json: unknown
  if (typeof window !== 'undefined' && window.funmeme?.fetchOnlineJson) {
    json = await window.funmeme.fetchOnlineJson(built.url)
  } else {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    try {
      const res = await fetch(built.url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      json = await res.json()
    } finally {
      clearTimeout(timer)
    }
  }

  return parseOnlineResponse(source, json, source === 'imgflip' ? query : '')
}
