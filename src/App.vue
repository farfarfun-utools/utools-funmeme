<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import AppIcon, { type IconName } from './components/AppIcon.vue'
import DiscoverView from './components/views/DiscoverView.vue'
import EmojiView from './components/views/EmojiView.vue'
import MakerView from './components/views/MakerView.vue'
import TextMemeView from './components/views/TextMemeView.vue'
import VaultView from './components/views/VaultView.vue'
import { registerFunMemeAiTools } from './lib/ai-tools'
import { t } from './lib/i18n'
import {
  addFavoriteItem,
  loadStudioState,
  removeFavoriteItem,
  sanitizeExportFilename,
  saveStudioState,
  type OnlineApiSettings,
  type ThemeMode,
  type ViewId,
} from './lib/storage'
import type { MemeTemplateId } from './lib/templates'
import logoUrl from '../utools/logo.png'

const state = reactive(loadStudioState())
const sidebarCollapsed = ref(false)
const toastText = ref('')
const incomingImage = ref<{ url: string; name: string } | null>(null)
const incomingPreset = ref<{
  templateId: MemeTemplateId
  topText: string
  bottomText: string
  nonce: number
} | null>(null)
const incomingTextMeme = ref('')
const vaultInitialTab = ref<'favorites' | 'settings'>('favorites')

let toastTimer: number | null = null
let unsubscribeEnter: (() => void) | null = null

const navItems: Array<{ id: ViewId; icon: IconName; labelKey: Parameters<typeof t>[1] }> = [
  { id: 'discover', icon: 'flame', labelKey: 'nav.discover' },
  { id: 'maker', icon: 'image', labelKey: 'nav.maker' },
  { id: 'textmeme', icon: 'type', labelKey: 'nav.textmeme' },
  { id: 'emoji', icon: 'smile', labelKey: 'nav.emoji' },
  { id: 'vault', icon: 'bookmark', labelKey: 'nav.vault' },
]

const activeNavLabel = computed(() => {
  const item = navItems.find((n) => n.id === state.activeView)
  return item ? t(state.settings.locale, item.labelKey) : t(state.settings.locale, 'app.name')
})

function showToast(msg: string) {
  toastText.value = msg
  if (toastTimer !== null) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toastText.value = ''
  }, 2000)
}

function resolveSystemDark(): boolean {
  if (typeof window.utools?.isDarkColors === 'function') {
    try {
      return window.utools.isDarkColors()
    } catch {
      // ignore
    }
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

function applyTheme(mode: ThemeMode) {
  const effective = mode === 'system' ? (resolveSystemDark() ? 'dark' : 'light') : mode
  document.documentElement.dataset.theme = effective
}

function persist() {
  return saveStudioState({
    version: state.version,
    activeView: state.activeView,
    favorites: [...state.favorites],
    apiSettings: { ...state.apiSettings },
    settings: { ...state.settings },
  })
}

watch(
  () => state.settings.theme,
  (mode) => {
    applyTheme(mode)
    persist()
  },
  { immediate: true },
)

watch(() => [state.activeView, state.settings.locale], persist)

function cycleTheme() {
  const order: ThemeMode[] = ['system', 'light', 'dark']
  state.settings.theme = order[(order.indexOf(state.settings.theme) + 1) % order.length]
}

function toggleLocale() {
  state.settings.locale = state.settings.locale === 'zh-CN' ? 'en' : 'zh-CN'
}

async function copyText(text: string, label?: string) {
  try {
    if (window.utools?.copyText) {
      window.utools.copyText(text)
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    }
    const prefix = t(state.settings.locale, 'toast.copiedText')
    showToast(label ? `${prefix} ${label}: ${text.slice(0, 24)}` : `${prefix}: ${text.slice(0, 24)}`)
  } catch {
    showToast(t(state.settings.locale, 'toast.copyFailed'))
  }
}

async function urlToPngDataUrl(src: string): Promise<string | null> {
  if (src.startsWith('data:image/')) return src
  try {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('load failed'))
      img.src = src
    })
    const canvas = document.createElement('canvas')
    canvas.width = Math.min(1024, img.naturalWidth || 512)
    canvas.height = Math.min(1024, img.naturalHeight || 512)
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png')
  } catch {
    return null
  }
}

async function copyImage(dataUrlOrUrl: string, title: string) {
  try {
    const dataUrl = await urlToPngDataUrl(dataUrlOrUrl)
    if (dataUrl && window.funmeme?.copyImageDataUrl?.(dataUrl)) {
      showToast(`${t(state.settings.locale, 'toast.copiedImage')} · ${title}`)
      return
    }
    if (dataUrl && window.utools?.copyImage?.(dataUrl)) {
      showToast(`${t(state.settings.locale, 'toast.copiedImage')} · ${title}`)
      return
    }
    if (dataUrl && typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([new ClipboardItem({ [blob.type || 'image/png']: blob })])
      showToast(`${t(state.settings.locale, 'toast.copiedImage')} · ${title}`)
      return
    }
    if (dataUrlOrUrl.startsWith('https://')) {
      await copyText(dataUrlOrUrl, title)
      return
    }
    showToast(t(state.settings.locale, 'toast.copyFailed'))
  } catch {
    showToast(t(state.settings.locale, 'toast.copyFailed'))
  }
}

async function exportImage(dataUrlOrUrl: string, filename: string) {
  const dataUrl = await urlToPngDataUrl(dataUrlOrUrl)
  if (!dataUrl) {
    showToast(t(state.settings.locale, 'toast.copyFailed'))
    return
  }
  const safeName = sanitizeExportFilename(filename, 'funmeme')
  if (window.funmeme?.saveImageDataUrl) {
    const ok = window.funmeme.saveImageDataUrl(safeName, dataUrl)
    if (ok) showToast(`${t(state.settings.locale, 'toast.exported')} (${safeName})`)
    return
  }
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = safeName
  a.click()
  showToast(`${t(state.settings.locale, 'toast.exported')} (${safeName})`)
}

function handleOpenLocalImage() {
  if (window.funmeme?.openImageFile) {
    const file = window.funmeme.openImageFile()
    if (!file) return
    incomingImage.value = { url: file.dataUrl, name: file.name }
    state.activeView = 'maker'
    return
  }
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/png,image/jpeg,image/webp,image/gif,image/bmp'
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        incomingImage.value = { url: reader.result, name: file.name }
        state.activeView = 'maker'
      }
    }
    reader.readAsDataURL(file)
  }
  input.click()
}

function handleSendToMaker(payload: {
  url?: string
  templateId?: MemeTemplateId
  topText?: string
  bottomText?: string
  title: string
}) {
  if (payload.templateId) {
    incomingImage.value = null
    incomingPreset.value = {
      templateId: payload.templateId,
      topText: payload.topText ?? '',
      bottomText: payload.bottomText ?? '',
      nonce: Date.now(),
    }
  } else if (payload.url) {
    incomingImage.value = { url: payload.url, name: payload.title }
  }
  state.activeView = 'maker'
  showToast(t(state.settings.locale, 'toast.sentToMaker'))
}

function handleSaveFavorite(item: {
  title: string
  dataUrl: string
  source: 'discover' | 'maker' | 'textmeme' | 'emoji'
}) {
  const prev = [...state.favorites]
  state.favorites = addFavoriteItem(state.favorites, item)
  const res = persist()
  if (!res.ok && res.reason === 'quota') {
    state.favorites = prev
    showToast(t(state.settings.locale, 'toast.storageFull'))
    return
  }
  if (res.trimmed && res.keptFavorites) {
    state.favorites = res.keptFavorites
    showToast(t(state.settings.locale, 'toast.storageTrimmed'))
    return
  }
  showToast(t(state.settings.locale, 'toast.saved'))
}

function handleRemoveFavorite(id: string) {
  state.favorites = removeFavoriteItem(state.favorites, id)
  persist()
  showToast(t(state.settings.locale, 'toast.removed'))
}

function handleUpdateApiSettings(next: OnlineApiSettings) {
  const cleared = !next.giphyApiKey && !next.tenorApiKey && !next.customApiUrl
  state.apiSettings = { ...next }
  persist()
  showToast(t(state.settings.locale, cleared ? 'toast.settingsCleared' : 'toast.settingsSaved'))
}

function handleOpenApiSettings() {
  vaultInitialTab.value = 'settings'
  state.activeView = 'vault'
}

function handlePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items) return
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (!file) continue
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          incomingImage.value = { url: reader.result, name: file.name || 'clipboard.png' }
          state.activeView = 'maker'
        }
      }
      reader.readAsDataURL(file)
      return
    }
  }
}

onMounted(() => {
  registerFunMemeAiTools()
  window.addEventListener('paste', handlePaste)

  if (window.funmeme?.onEnter) {
    unsubscribeEnter = window.funmeme.onEnter((action) => {
      if (action.code === 'meme-make') {
        state.activeView = 'textmeme'
        return
      }
      if (action.code === 'meme-emoji') {
        state.activeView = 'emoji'
        return
      }
      if (action.code === 'meme-files' && Array.isArray(action.payload)) {
        const loaded = window.funmeme?.readEntryImageFiles?.(
          action.payload as Array<string | { path?: string }>,
        )
        if (loaded && loaded.length > 0) {
          incomingImage.value = { url: loaded[0].dataUrl, name: loaded[0].name }
          state.activeView = 'maker'
        }
        return
      }
      if (action.code === 'meme-over' && typeof action.payload === 'string' && action.payload.trim()) {
        incomingTextMeme.value = action.payload.trim()
        state.activeView = 'textmeme'
      }
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('paste', handlePaste)
  unsubscribeEnter?.()
  if (toastTimer !== null) window.clearTimeout(toastTimer)
})
</script>

<template>
  <div class="studio-shell">
    <!-- Left Collapsible Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="brand-row">
        <img :src="logoUrl" alt="FunMeme" class="brand-logo" />
        <div v-if="!sidebarCollapsed" class="brand-text">
          <div class="brand-title">{{ t(state.settings.locale, 'app.name') }}</div>
          <div class="brand-sub">{{ t(state.settings.locale, 'app.subtitle') }}</div>
        </div>
      </div>

      <div v-if="!sidebarCollapsed" class="nav-label">
        {{ t(state.settings.locale, 'nav.section') }}
      </div>

      <nav class="nav-list" :aria-label="t(state.settings.locale, 'nav.section')">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="nav-item"
          :class="{ active: state.activeView === item.id }"
          :data-testid="`nav-${item.id}`"
          :title="t(state.settings.locale, item.labelKey)"
          @click="
            () => {
              if (item.id === 'vault') vaultInitialTab = 'favorites'
              state.activeView = item.id
            }
          "
        >
          <AppIcon :name="item.icon" :size="15" />
          <span v-if="!sidebarCollapsed" class="nav-text">
            {{ t(state.settings.locale, item.labelKey) }}
          </span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button
          type="button"
          class="btn btn-ghost btn-icon"
          data-testid="theme-btn"
          :title="state.settings.theme"
          @click="cycleTheme"
        >
          <AppIcon
            :name="
              state.settings.theme === 'dark'
                ? 'moon'
                : state.settings.theme === 'light'
                  ? 'sun'
                  : 'monitor'
            "
            :size="14"
          />
        </button>
        <button
          v-if="!sidebarCollapsed"
          type="button"
          class="btn btn-ghost btn-sm mono"
          data-testid="locale-btn"
          @click="toggleLocale"
        >
          {{ state.settings.locale === 'zh-CN' ? 'EN' : '中' }}
        </button>
        <button
          type="button"
          class="btn btn-ghost btn-icon"
          :title="sidebarCollapsed ? 'Expand' : 'Collapse'"
          @click="sidebarCollapsed = !sidebarCollapsed"
        >
          <AppIcon name="panel-left" :size="14" />
        </button>
      </div>
    </aside>

    <!-- Main Workspace Column -->
    <div class="workspace-col">
      <!-- Slim Topbar -->
      <header class="topbar">
        <div class="topbar-title-group">
          <span class="topbar-badge" />
          <span class="topbar-title">{{ activeNavLabel }}</span>
        </div>

        <div class="topbar-actions">
          <button type="button" class="btn btn-sm" @click="handleOpenLocalImage">
            <AppIcon name="upload" :size="13" />
            <span class="hide-narrow">{{ t(state.settings.locale, 'topbar.import') }}</span>
          </button>
          <button type="button" class="btn btn-sm btn-primary" @click="state.activeView = 'textmeme'">
            <AppIcon name="type" :size="13" />
            <span class="hide-narrow">{{ t(state.settings.locale, 'topbar.quickText') }}</span>
          </button>
          <button
            type="button"
            class="btn btn-sm"
            @click="
              () => {
                vaultInitialTab = 'favorites'
                state.activeView = 'vault'
              }
            "
          >
            <AppIcon name="star-fill" :size="12" style="color: #eab308" />
            <span class="mono">{{ state.favorites.length }}</span>
          </button>
        </div>
      </header>

      <!-- Active View Stage -->
      <main class="main-stage">
        <DiscoverView
          v-if="state.activeView === 'discover'"
          :locale="state.settings.locale"
          :favorites="state.favorites"
          :api-settings="state.apiSettings"
          @copy-image="copyImage"
          @send-to-maker="handleSendToMaker"
          @save-favorite="handleSaveFavorite"
          @open-api-settings="handleOpenApiSettings"
        />

        <MakerView
          v-else-if="state.activeView === 'maker'"
          :locale="state.settings.locale"
          :incoming-image="incomingImage"
          :incoming-preset="incomingPreset"
          @copy-image="copyImage"
          @export-image="exportImage"
          @save-favorite="handleSaveFavorite"
          @open-local-image="handleOpenLocalImage"
          @clear-incoming-image="incomingImage = null"
          @drop-image="(url, name) => (incomingImage = { url, name })"
        />

        <TextMemeView
          v-else-if="state.activeView === 'textmeme'"
          :locale="state.settings.locale"
          :incoming-text="incomingTextMeme"
          @copy-image="copyImage"
          @export-image="exportImage"
          @save-favorite="handleSaveFavorite"
        />

        <EmojiView
          v-else-if="state.activeView === 'emoji'"
          :locale="state.settings.locale"
          @copy-text="copyText"
          @copy-image="copyImage"
          @export-image="exportImage"
        />

        <VaultView
          v-else
          :locale="state.settings.locale"
          :favorites="state.favorites"
          :api-settings="state.apiSettings"
          :initial-tab="vaultInitialTab"
          @copy-image="copyImage"
          @export-image="exportImage"
          @send-to-maker="handleSendToMaker"
          @remove-favorite="handleRemoveFavorite"
          @update-settings="handleUpdateApiSettings"
          @go-maker="state.activeView = 'maker'"
        />
      </main>

      <!-- Slim Status Bar -->
      <footer class="statusbar">
        <span class="status-left">
          <span class="status-dot" />
          <span class="status-msg">{{ t(state.settings.locale, 'status.offline') }}</span>
        </span>
        <span v-if="toastText" class="status-toast">
          <AppIcon name="check" :size="12" />
          {{ toastText }}
        </span>
        <span v-else class="status-right mono">
          {{ state.favorites.length }} ★ {{ t(state.settings.locale, 'status.savedCount') }}
        </span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.studio-shell {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg-app);
}

.sidebar {
  width: 156px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 10px 8px 8px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  transition: width 0.16s ease;
}

.sidebar.collapsed {
  width: 54px;
  align-items: center;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 4px 10px;
}

.brand-logo {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  flex-shrink: 0;
}

.brand-text {
  min-width: 0;
}

.brand-title {
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.brand-sub {
  font-size: 10.5px;
  color: var(--text-muted);
}

.nav-label {
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  width: 100%;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 33px;
  padding: 0 9px;
  border-radius: 7px;
  color: var(--text-secondary);
  font-size: 12.5px;
  font-weight: 500;
  width: 100%;
  text-align: left;
  transition: background 0.14s, color 0.14s;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 0;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--bg-active);
  color: var(--accent);
  font-weight: 600;
}

.nav-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
  width: 100%;
}

.sidebar.collapsed .sidebar-footer {
  flex-direction: column;
}

.workspace-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 44px;
  padding: 0 12px;
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.topbar-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.topbar-badge {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #eab308, #d97706);
  flex-shrink: 0;
}

.topbar-title {
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.main-stage {
  flex: 1;
  min-height: 0;
  padding: 12px;
  overflow: hidden;
}

.statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 26px;
  padding: 0 12px;
  background: var(--bg-panel);
  border-top: 1px solid var(--border);
  font-size: 11px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.status-left {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
}

.status-msg {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;
}

.status-toast {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--accent);
  font-weight: 600;
  white-space: nowrap;
}

.status-right {
  white-space: nowrap;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .sidebar {
    width: 50px;
    align-items: center;
    padding: 8px 4px;
  }
  .brand-text,
  .nav-label,
  .nav-text,
  .hide-narrow {
    display: none;
  }
  .nav-item {
    justify-content: center;
    padding: 0;
  }
  .sidebar-footer {
    flex-direction: column;
  }
  .main-stage {
    padding: 8px;
  }
}
</style>
