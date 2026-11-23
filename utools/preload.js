'use strict'

const fs = require('node:fs')
const https = require('node:https')
const net = require('node:net')
const path = require('node:path')

const MAX_IMAGE_BYTES = 12 * 1024 * 1024
const MAX_JSON_BYTES = 2 * 1024 * 1024
const FETCH_TIMEOUT_MS = 8000

const IMAGE_MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
}

function isPrivateOrLoopbackHost(hostname) {
  const host = String(hostname || '').toLowerCase().replace(/^\[|\]$/g, '')
  if (!host) return true
  if (
    host === 'localhost' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    return true
  }
  const ipType = net.isIP(host)
  if (ipType === 4) {
    const parts = host.split('.').map(Number)
    if (parts[0] === 10 || parts[0] === 127 || parts[0] === 0) return true
    if (parts[0] === 169 && parts[1] === 254) return true
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true
    if (parts[0] === 192 && parts[1] === 168) return true
  } else if (ipType === 6) {
    if (host === '::' || host === '::1' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80')) {
      return true
    }
  }
  return false
}

function isAllowedHttpsUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim() || rawUrl.length > 2048) {
    return false
  }
  try {
    const parsed = new URL(rawUrl.trim())
    if (parsed.protocol !== 'https:') return false
    if (parsed.username || parsed.password) return false
    if (isPrivateOrLoopbackHost(parsed.hostname)) return false
    return true
  } catch {
    return false
  }
}

function readImageAsDataUrl(filePath) {
  if (typeof filePath !== 'string' || !filePath.trim()) {
    throw new Error('Invalid image path')
  }
  const resolved = path.resolve(filePath)
  const ext = path.extname(resolved).toLowerCase()
  const mime = IMAGE_MIME[ext]
  if (!mime) {
    throw new Error(`Unsupported image format: ${ext || 'unknown'}`)
  }
  const stat = fs.lstatSync(resolved)
  if (!stat.isFile() || stat.isSymbolicLink()) {
    throw new Error('Only regular local image files are supported')
  }
  if (stat.size <= 0 || stat.size > MAX_IMAGE_BYTES) {
    throw new Error('Image size must be between 1 byte and 12 MB')
  }
  const buf = fs.readFileSync(resolved)
  return {
    name: path.basename(resolved),
    mime,
    size: stat.size,
    dataUrl: `data:${mime};base64,${buf.toString('base64')}`,
  }
}

function openImageFile() {
  if (typeof utools === 'undefined' || typeof utools.showOpenDialog !== 'function') {
    return null
  }
  const picked = utools.showOpenDialog({
    title: '选择本地图片制作表情包',
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'] }],
  })
  if (!Array.isArray(picked) || picked.length === 0) return null
  return readImageAsDataUrl(picked[0])
}

function readEntryImageFiles(entries) {
  if (!Array.isArray(entries)) return []
  const out = []
  for (const item of entries.slice(0, 1)) {
    const p = typeof item === 'string' ? item : item && typeof item.path === 'string' ? item.path : ''
    if (!p) continue
    try {
      out.push(readImageAsDataUrl(p))
    } catch {
      // skip invalid file
    }
  }
  return out
}

function copyImageDataUrl(dataUrl) {
  if (typeof dataUrl !== 'string' || !/^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(dataUrl)) {
    return false
  }
  if (typeof utools !== 'undefined' && typeof utools.copyImage === 'function') {
    try {
      return Boolean(utools.copyImage(dataUrl))
    } catch {
      return false
    }
  }
  return false
}

function saveImageDataUrl(defaultName, dataUrl) {
  if (typeof dataUrl !== 'string') {
    throw new Error('Invalid image dataUrl')
  }
  const match = /^data:image\/(?:png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl)
  if (!match) {
    throw new Error('Unsupported image dataUrl format')
  }
  if (typeof utools === 'undefined' || typeof utools.showSaveDialog !== 'function') {
    return false
  }
  const safeName = String(defaultName || 'funmeme.png').replace(/[\\/:*?"<>|]/g, '_')
  const target = utools.showSaveDialog({
    title: '导出表情包图片',
    defaultPath: safeName.endsWith('.png') ? safeName : `${safeName}.png`,
    filters: [{ name: 'PNG Image', extensions: ['png'] }],
  })
  if (!target) return false
  const buf = Buffer.from(match[1], 'base64')
  if (buf.length <= 0 || buf.length > MAX_IMAGE_BYTES) {
    throw new Error('Image size exceeds limit')
  }
  fs.writeFileSync(path.resolve(target), buf)
  return true
}

function fetchOnlineJson(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (!isAllowedHttpsUrl(url)) {
      reject(new Error('Only public HTTPS URLs are allowed'))
      return
    }
    if (redirectCount > 3) {
      reject(new Error('Too many redirects'))
      return
    }
    const req = https.get(
      url,
      {
        timeout: FETCH_TIMEOUT_MS,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'FunMeme-uTools/0.1.0',
        },
      },
      (res) => {
        const status = res.statusCode || 0
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume()
          try {
            const nextUrl = new URL(res.headers.location, url).toString()
            resolve(fetchOnlineJson(nextUrl, redirectCount + 1))
          } catch {
            reject(new Error('Invalid redirect URL'))
          }
          return
        }
        if (status < 200 || status >= 300) {
          res.resume()
          reject(new Error(`HTTP ${status}`))
          return
        }
        const chunks = []
        let total = 0
        res.on('data', (chunk) => {
          total += chunk.length
          if (total > MAX_JSON_BYTES) {
            req.destroy(new Error('JSON response exceeds 2 MB limit'))
            return
          }
          chunks.push(chunk)
        })
        res.on('end', () => {
          try {
            const text = Buffer.concat(chunks).toString('utf8')
            resolve(JSON.parse(text))
          } catch {
            reject(new Error('Failed to parse JSON response'))
          }
        })
      },
    )
    req.on('timeout', () => {
      req.destroy(new Error('Request timed out after 8s'))
    })
    req.on('error', (err) => {
      reject(err)
    })
  })
}

let pendingEnter = null
const enterListeners = new Set()

if (typeof utools !== 'undefined' && typeof utools.onPluginEnter === 'function') {
  utools.onPluginEnter((action) => {
    pendingEnter = action
    for (const cb of enterListeners) {
      try {
        cb(action)
      } catch {
        // ignore listener errors
      }
    }
  })
}

function onEnter(callback) {
  if (typeof callback !== 'function') return () => {}
  enterListeners.add(callback)
  if (pendingEnter) {
    const queued = pendingEnter
    pendingEnter = null
    queueMicrotask(() => callback(queued))
  }
  return () => {
    enterListeners.delete(callback)
  }
}

const api = {
  openImageFile,
  readEntryImageFiles,
  copyImageDataUrl,
  saveImageDataUrl,
  fetchOnlineJson,
  onEnter,
}

if (typeof window !== 'undefined') {
  window.funmeme = api
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ...api, readImageAsDataUrl, isAllowedHttpsUrl }
}
