import { beforeEach, describe, expect, it } from 'vitest'
import { EMOJI_LIBRARY, KAOMOJI_LIBRARY, searchEmojiKaomoji } from '../src/lib/emoji'
import { buildOnlineEndpointUrl, parseOnlineResponse } from '../src/lib/online'
import {
  addFavoriteItem,
  loadStudioState,
  removeFavoriteItem,
  saveStudioState,
} from '../src/lib/storage'
import { MEME_TEMPLATES, OFFLINE_STARTER_MEMES } from '../src/lib/templates'
import { buildTextMemeConfig, TEXT_MEME_PRESETS, TEXT_MEME_STYLES } from '../src/lib/text-meme'

describe('FunMeme core libraries', () => {
  beforeEach(() => {
    const store = new Map<string, string>()
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, String(v))
        },
        removeItem: (k: string) => {
          store.delete(k)
        },
        clear: () => {
          store.clear()
        },
      },
    })
  })

  it('ships 10 built-in meme templates and 12 offline starter memes', () => {
    expect(MEME_TEMPLATES).toHaveLength(10)
    expect(new Set(MEME_TEMPLATES.map((t) => t.id)).size).toBe(10)
    expect(OFFLINE_STARTER_MEMES.length).toBeGreaterThanOrEqual(12)
    const ids = new Set(MEME_TEMPLATES.map((t) => t.id))
    for (const starter of OFFLINE_STARTER_MEMES) {
      expect(ids.has(starter.templateId)).toBe(true)
    }
  })

  it('validates and normalizes text meme configs across all 8 viral styles', () => {
    expect(TEXT_MEME_STYLES).toHaveLength(8)
    expect(TEXT_MEME_PRESETS).toHaveLength(6)

    const built = buildTextMemeConfig({
      text: '  代码能跑就别动  ',
      style: 'cyber-neon',
      fontSize: 52,
      textColor: '#22d3ee',
      bgColor: '#09071a',
      size: 640,
    })
    expect(built.ok).toBe(true)
    if (built.ok) {
      expect(built.config.text).toBe('代码能跑就别动')
      expect(built.config.style).toBe('cyber-neon')
      expect(built.config.textColor).toBe('#22D3EE')
      expect(built.config.size).toBe(640)
    }

    expect(buildTextMemeConfig({ text: '' }).ok).toBe(false)
    expect(buildTextMemeConfig({ text: 'ok', style: 'nonexistent' }).ok).toBe(false)
    expect(buildTextMemeConfig({ text: 'ok', fontSize: 120 }).ok).toBe(false)
    expect(buildTextMemeConfig({ text: 'ok', textColor: 'red' }).ok).toBe(false)
    expect(buildTextMemeConfig({ text: 'ok', size: 128 }).ok).toBe(false)
  })

  it('searches 80+ emojis and 60+ kaomojis by Chinese/English keywords and categories', () => {
    expect(EMOJI_LIBRARY.length).toBeGreaterThanOrEqual(80)
    expect(KAOMOJI_LIBRARY.length).toBeGreaterThanOrEqual(60)

    const fishHits = searchEmojiKaomoji({ query: '摸鱼', kind: 'all' })
    expect(fishHits.some((x) => x.kind === 'emoji' && x.symbol === '🐟')).toBe(true)
    expect(fishHits.some((x) => x.kind === 'kaomoji')).toBe(true)

    const shrugHits = searchEmojiKaomoji({ query: 'shrug', kind: 'kaomoji' })
    expect(shrugHits.some((x) => x.symbol.includes('ツ'))).toBe(true)

    const catEmoji = searchEmojiKaomoji({ query: 'cat', kind: 'emoji', category: 'animals' })
    expect(catEmoji.some((x) => x.symbol === '🐱')).toBe(true)
  })

  it('parses Imgflip, GIPHY, Tenor, and Custom JSON responses safely', () => {
    const imgflip = parseOnlineResponse(
      'imgflip',
      {
        success: true,
        data: {
          memes: [
            { id: '1', name: 'Drake Hotline Bling', url: 'https://i.imgflip.com/drake.jpg' },
            { id: '2', name: 'Distracted Boyfriend', url: 'http://insecure.example/x.jpg' },
          ],
        },
      },
      'drake',
    )
    expect(imgflip).toHaveLength(1)
    expect(imgflip[0].title).toBe('Drake Hotline Bling')

    const giphy = parseOnlineResponse('giphy', {
      data: [
        {
          id: 'g1',
          title: 'Coding Cat',
          images: {
            original: { url: 'https://media.giphy.com/cat.gif' },
            fixed_width: { url: 'https://media.giphy.com/cat-thumb.gif' },
          },
        },
      ],
    })
    expect(giphy).toHaveLength(1)
    expect(giphy[0].previewUrl).toBe('https://media.giphy.com/cat-thumb.gif')

    const tenor = parseOnlineResponse('tenor', {
      results: [
        {
          id: 't1',
          content_description: 'Happy Dance',
          media_formats: {
            gif: { url: 'https://media.tenor.com/dance.gif' },
            tinygif: { url: 'https://media.tenor.com/dance-tiny.gif' },
          },
        },
      ],
    })
    expect(tenor).toHaveLength(1)
    expect(tenor[0].title).toBe('Happy Dance')

    const custom = parseOnlineResponse('custom', {
      items: [
        { id: 9, title: 'My Meme', image: 'https://cdn.example.com/m.png' },
        { id: 10, title: 'Unsafe', image: 'javascript:alert(1)' },
      ],
    })
    expect(custom).toHaveLength(1)
    expect(custom[0].url).toBe('https://cdn.example.com/m.png')
  })

  it('builds validated online endpoint URLs and guards missing keys or non-HTTPS URLs', () => {
    const empty = { giphyApiKey: '', tenorApiKey: '', customApiUrl: '' }
    expect(buildOnlineEndpointUrl('imgflip', '', empty)).toEqual({
      ok: true,
      url: 'https://api.imgflip.com/get_memes',
    })
    expect(buildOnlineEndpointUrl('giphy', 'cat', empty)).toEqual({ ok: false, code: 'need_key' })
    expect(buildOnlineEndpointUrl('tenor', 'cat', empty)).toEqual({ ok: false, code: 'need_key' })
    expect(buildOnlineEndpointUrl('custom', 'cat', empty)).toEqual({ ok: false, code: 'need_url' })
    expect(
      buildOnlineEndpointUrl('custom', 'cat', { ...empty, customApiUrl: 'http://insecure.com/api' }),
    ).toEqual({ ok: false, code: 'invalid_url' })
    const customOk = buildOnlineEndpointUrl('custom', '摸鱼', {
      ...empty,
      customApiUrl: 'https://memes.example.com/search?q={query}',
    })
    expect(customOk.ok).toBe(true)
    if (customOk.ok) {
      expect(customOk.url).toContain('%E6%91%B8%E9%B1%BC')
    }
  })

  it('persists favorites and settings safely in localStorage', () => {
    const state = loadStudioState()
    expect(state.activeView).toBe('discover')
    expect(state.favorites).toEqual([])

    const nextFavs = addFavoriteItem(state.favorites, {
      title: '测试表情',
      dataUrl: 'data:image/png;base64,AAAA',
      source: 'maker',
    })
    expect(nextFavs).toHaveLength(1)
    // Deduplicates identical item
    expect(
      addFavoriteItem(nextFavs, {
        title: '测试表情',
        dataUrl: 'data:image/png;base64,AAAA',
        source: 'maker',
      }),
    ).toHaveLength(1)

    state.favorites = nextFavs
    state.apiSettings.giphyApiKey = 'demo-key'
    saveStudioState(state)

    const reloaded = loadStudioState()
    expect(reloaded.favorites).toHaveLength(1)
    expect(reloaded.apiSettings.giphyApiKey).toBe('demo-key')

    const afterRemove = removeFavoriteItem(reloaded.favorites, reloaded.favorites[0].id)
    expect(afterRemove).toHaveLength(0)
  })
})
