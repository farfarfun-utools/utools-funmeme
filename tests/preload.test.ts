import fs from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import vm from 'node:vm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const PRELOAD_PATH = path.resolve(__dirname, '../utools/preload.js')
const PRELOAD_CODE = fs.readFileSync(PRELOAD_PATH, 'utf8')

function loadPreload() {
  let enterCb: ((action: unknown) => void) | null = null
  const utoolsMock = {
    onPluginEnter: vi.fn((cb: (action: unknown) => void) => {
      enterCb = cb
    }),
    showOpenDialog: vi.fn(),
    showSaveDialog: vi.fn(),
    copyImage: vi.fn(() => true),
  }

  const sandboxWindow: Record<string, unknown> = {}
  const mod = { exports: {} as Record<string, unknown> }
  const context = vm.createContext({
    require: createRequire(PRELOAD_PATH),
    module: mod,
    exports: mod.exports,
    window: sandboxWindow,
    utools: utoolsMock,
    Buffer,
    URL,
    console,
    queueMicrotask,
  })
  vm.runInContext(PRELOAD_CODE, context, { filename: PRELOAD_PATH })

  return {
    window: sandboxWindow as unknown as { funmeme: NonNullable<Window['funmeme']> },
    exports: mod.exports as {
      readImageAsDataUrl: (p: string) => { name: string; mime: string; dataUrl: string }
      isAllowedHttpsUrl: (url: string) => boolean
    },
    triggerEnter: (action: unknown) => {
      if (enterCb) enterCb(action)
    },
    utoolsMock,
  }
}

describe('utools/preload.js', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'funmeme-preload-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('reads supported image files as base64 data URLs and rejects unsupported files', () => {
    const { exports: modExports } = loadPreload()
    const pngPath = path.join(tmpDir, 'sample.png')
    const txtPath = path.join(tmpDir, 'notes.txt')
    fs.writeFileSync(pngPath, Buffer.from([0x89, 0x50, 0x4e, 0x47]))
    fs.writeFileSync(txtPath, 'hello')

    const loaded = modExports.readImageAsDataUrl(pngPath)
    expect(loaded.name).toBe('sample.png')
    expect(loaded.mime).toBe('image/png')
    expect(loaded.dataUrl).toMatch(/^data:image\/png;base64,/)

    expect(() => modExports.readImageAsDataUrl(txtPath)).toThrow('Unsupported image format')
    expect(() => modExports.readImageAsDataUrl(path.join(tmpDir, 'missing.png'))).toThrow()
  })

  it('enforces public HTTPS-only URL validation for online fetching', () => {
    const { exports: modExports } = loadPreload()
    expect(modExports.isAllowedHttpsUrl('https://api.imgflip.com/get_memes')).toBe(true)
    expect(modExports.isAllowedHttpsUrl('https://api.giphy.com/v1/gifs/search?q=cat')).toBe(true)

    expect(modExports.isAllowedHttpsUrl('http://api.imgflip.com/get_memes')).toBe(false)
    expect(modExports.isAllowedHttpsUrl('https://localhost/api')).toBe(false)
    expect(modExports.isAllowedHttpsUrl('https://127.0.0.1/api')).toBe(false)
    expect(modExports.isAllowedHttpsUrl('https://192.168.1.1/api')).toBe(false)
    expect(modExports.isAllowedHttpsUrl('https://10.0.0.1/api')).toBe(false)
    expect(modExports.isAllowedHttpsUrl('https://user:pass@api.example.com/')).toBe(false)
    expect(modExports.isAllowedHttpsUrl('file:///etc/passwd')).toBe(false)
  })

  it('buffers early onPluginEnter actions and delegates copyImageDataUrl / saveImageDataUrl', async () => {
    const { window: win, triggerEnter, utoolsMock } = loadPreload()
    const payload = { code: 'meme-over', type: 'over', payload: '收到！马上改' }
    triggerEnter(payload)

    const received: unknown[] = []
    const off = win.funmeme.onEnter((a) => received.push(a))
    await Promise.resolve()
    expect(received).toEqual([payload])
    off()

    const validDataUrl = 'data:image/png;base64,iVBORw0KGgo='
    expect(win.funmeme.copyImageDataUrl(validDataUrl)).toBe(true)
    expect(utoolsMock.copyImage).toHaveBeenCalledWith(validDataUrl)
    expect(win.funmeme.copyImageDataUrl('https://evil.example/x.png')).toBe(false)

    const savePath = path.join(tmpDir, 'exported.png')
    utoolsMock.showSaveDialog.mockReturnValue(savePath)
    expect(win.funmeme.saveImageDataUrl('my-meme.png', validDataUrl)).toBe(true)
    expect(fs.existsSync(savePath)).toBe(true)
  })
})
