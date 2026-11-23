import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import {
  buildTextMemeConfigTool,
  listMemeTemplatesTool,
  registerFunMemeAiTools,
  searchEmojiKaomojiTool,
} from '../src/lib/ai-tools'

describe('FunMeme AI / MCP tools', () => {
  it('searches built-in emoji and kaomoji library with boundary validation', () => {
    const res = searchEmojiKaomojiTool({ query: '摸鱼', kind: 'all', limit: 10 })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.total).toBeGreaterThan(0)
      expect(res.items.length).toBeLessThanOrEqual(10)
    }

    expect(searchEmojiKaomojiTool({ kind: 'invalid' }).ok).toBe(false)
    expect(searchEmojiKaomojiTool({ limit: 999 }).ok).toBe(false)
  })

  it('lists built-in meme templates with optional category filter', () => {
    const allRes = listMemeTemplatesTool({})
    expect(allRes.ok).toBe(true)
    if (allRes.ok) {
      expect(allRes.total).toBe(10)
      expect(allRes.templates[0]).toHaveProperty('defaultTop')
    }

    const pandaRes = listMemeTemplatesTool({ category: 'panda' })
    expect(pandaRes.ok).toBe(true)
    if (pandaRes.ok) {
      expect(pandaRes.total).toBe(2)
      expect(pandaRes.templates.every((t) => t.category === 'panda')).toBe(true)
    }

    expect(listMemeTemplatesTool({ category: 'unknown' }).ok).toBe(false)
  })

  it('builds and validates structured text meme configurations', () => {
    const res = buildTextMemeConfigTool({
      text: '收到！马上改',
      style: 'red-gold',
      fontSize: 56,
    })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.config.style).toBe('red-gold')
      expect(res.config.text).toBe('收到！马上改')
      expect(res.config.size).toBe(512)
    }

    expect(buildTextMemeConfigTool(null).ok).toBe(false)
    expect(buildTextMemeConfigTool({ text: '' }).ok).toBe(false)
    expect(buildTextMemeConfigTool({ text: 'ok', style: 'bad-style' }).ok).toBe(false)
  })

  it('registers exact tool names matching utools/plugin.json', () => {
    const manifestPath = path.resolve(process.cwd(), 'utools/plugin.json')
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
      tools: Record<string, unknown>
      features: Array<{ code: string; cmds: unknown[] }>
    }

    // Also assert uTools strict rule: every feature has 1..5 cmds
    for (const feat of manifest.features) {
      expect(feat.cmds.length).toBeGreaterThanOrEqual(1)
      expect(feat.cmds.length).toBeLessThanOrEqual(5)
    }

    const registerTool = vi.fn()
    ;(globalThis as unknown as { window: { utools: { registerTool: typeof registerTool } } }).window =
      {
        utools: { registerTool },
      }

    registerFunMemeAiTools()
    const registeredNames = registerTool.mock.calls.map((c) => c[0]).sort()
    expect(registeredNames).toEqual(Object.keys(manifest.tools).sort())
  })
})
