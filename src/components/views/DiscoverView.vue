<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '../AppIcon.vue'
import { t } from '../../lib/i18n'
import { fetchOnlineMemes, type MemeFeedItem, type OnlineSourceId } from '../../lib/online'
import type { Locale, OnlineApiSettings, SavedMemeItem } from '../../lib/storage'
import {
  getStarterMemeDataUrl,
  HOT_DISCOVER_TAGS,
  OFFLINE_STARTER_MEMES,
  type MemeTemplateId,
} from '../../lib/templates'

const props = defineProps<{
  locale: Locale
  favorites: SavedMemeItem[]
  apiSettings: OnlineApiSettings
}>()

const emit = defineEmits<{
  (e: 'copy-image', dataUrlOrUrl: string, title: string): void
  (
    e: 'send-to-maker',
    payload: {
      url?: string
      templateId?: MemeTemplateId
      topText?: string
      bottomText?: string
      title: string
    },
  ): void
  (e: 'save-favorite', item: { title: string; dataUrl: string; source: 'discover' }): void
  (e: 'open-api-settings'): void
}>()

const source = ref<OnlineSourceId>('offline')
const searchQuery = ref('')
const activeTag = ref<string>('all')
const loading = ref(false)
const errorMsg = ref('')
const needConfigKind = ref<'' | 'key' | 'url'>('')
const onlineItems = ref<MemeFeedItem[]>([])
const hasFetchedOnline = ref(false)

const offlineCards = computed<MemeFeedItem[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const tag = activeTag.value
  return OFFLINE_STARTER_MEMES.filter((spec) => {
    if (tag !== 'all' && !spec.tags.includes(tag)) return false
    if (!q) return true
    return (
      spec.title.toLowerCase().includes(q) ||
      spec.topText.toLowerCase().includes(q) ||
      spec.bottomText.toLowerCase().includes(q) ||
      spec.tags.some((tg) => tg.toLowerCase().includes(q))
    )
  }).map((spec) => {
    const dataUrl = getStarterMemeDataUrl(spec)
    return {
      id: spec.id,
      title: spec.title,
      url: dataUrl,
      previewUrl: dataUrl,
      source: 'offline',
      tags: spec.tags,
      templateId: spec.templateId,
      topText: spec.topText,
      bottomText: spec.bottomText,
    }
  })
})

const displayCards = computed<MemeFeedItem[]>(() =>
  source.value === 'offline' ? offlineCards.value : onlineItems.value,
)

const favoriteSet = computed(() => new Set(props.favorites.map((f) => `${f.title}::${f.dataUrl}`)))

function isSaved(card: MemeFeedItem): boolean {
  return favoriteSet.value.has(`${card.title}::${card.url}`)
}

function selectTag(tag: string) {
  activeTag.value = tag
  if (source.value !== 'offline' && tag !== 'all') {
    searchQuery.value = tag
  }
}

function handleSourceChange() {
  errorMsg.value = ''
  needConfigKind.value = ''
  hasFetchedOnline.value = false
  onlineItems.value = []
}

async function handleOnlineFetch() {
  if (source.value === 'offline') {
    source.value = 'imgflip'
  }
  const activeSource = source.value as Exclude<OnlineSourceId, 'offline'>
  loading.value = true
  errorMsg.value = ''
  needConfigKind.value = ''
  try {
    const res = await fetchOnlineMemes(activeSource, searchQuery.value, props.apiSettings)
    onlineItems.value = res
    hasFetchedOnline.value = true
  } catch (err) {
    const code = err instanceof Error ? err.message : String(err)
    if (code === 'need_key') {
      needConfigKind.value = 'key'
    } else if (code === 'need_url' || code === 'invalid_url') {
      needConfigKind.value = 'url'
    } else {
      errorMsg.value =
        props.locale === 'en'
          ? `Online fetch failed (${code}). You can switch back to the offline pack anytime.`
          : `联网拉取失败（${code}），可随时切回「内置精选」离线使用。`
    }
  } finally {
    loading.value = false
  }
}

function handleSearchSubmit() {
  if (source.value !== 'offline') {
    void handleOnlineFetch()
  }
}

function handleSendToMaker(card: MemeFeedItem) {
  if (card.source === 'offline' && card.templateId) {
    emit('send-to-maker', {
      templateId: card.templateId as MemeTemplateId,
      topText: card.topText ?? '',
      bottomText: card.bottomText ?? '',
      title: card.title,
    })
    return
  }
  emit('send-to-maker', {
    url: card.url,
    title: card.title,
  })
}
</script>

<template>
  <section class="discover-view">
    <!-- Top Search & Source Bar -->
    <div class="discover-toolbar card">
      <div class="search-box">
        <AppIcon name="search" :size="14" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          class="input search-input"
          :placeholder="t(locale, 'discover.searchPlaceholder')"
          @keydown.enter="handleSearchSubmit"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="clear-btn"
          aria-label="Clear search"
          @click="searchQuery = ''"
        >
          <AppIcon name="x" :size="13" />
        </button>
      </div>

      <div class="source-controls">
        <select
          v-model="source"
          class="select source-select"
          aria-label="Meme Source"
          @change="handleSourceChange"
        >
          <option value="offline">{{ t(locale, 'discover.source.offline') }}</option>
          <option value="imgflip">{{ t(locale, 'discover.source.imgflip') }}</option>
          <option value="giphy">{{ t(locale, 'discover.source.giphy') }}</option>
          <option value="tenor">{{ t(locale, 'discover.source.tenor') }}</option>
          <option value="custom">{{ t(locale, 'discover.source.custom') }}</option>
        </select>

        <button
          type="button"
          class="btn btn-primary fetch-btn"
          :disabled="loading"
          data-testid="discover-fetch-btn"
          @click="handleOnlineFetch"
        >
          <AppIcon :name="loading ? 'refresh-cw' : 'globe'" :size="13" />
          <span>{{ loading ? t(locale, 'discover.fetching') : t(locale, 'discover.fetchBtn') }}</span>
        </button>
      </div>
    </div>

    <!-- Hot Tag Chips -->
    <div class="tag-strip">
      <button
        type="button"
        class="chip"
        :class="{ active: activeTag === 'all' }"
        @click="selectTag('all')"
      >
        {{ t(locale, 'discover.allTag') }}
      </button>
      <button
        v-for="tag in HOT_DISCOVER_TAGS"
        :key="tag"
        type="button"
        class="chip"
        :class="{ active: activeTag === tag }"
        @click="selectTag(tag)"
      >
        #{{ tag }}
      </button>
    </div>

    <!-- Online Prompts / Error Banner -->
    <div v-if="needConfigKind" class="notice-card card">
      <AppIcon name="settings" :size="16" class="notice-icon" />
      <div class="notice-body">
        {{ needConfigKind === 'key' ? t(locale, 'discover.needKey') : t(locale, 'discover.needCustomUrl') }}
      </div>
      <button type="button" class="btn btn-sm btn-primary" @click="emit('open-api-settings')">
        {{ t(locale, 'discover.goSettings') }}
      </button>
    </div>

    <div v-else-if="errorMsg" class="notice-card card notice-err">
      <AppIcon name="globe" :size="16" class="notice-icon" />
      <div class="notice-body">{{ errorMsg }}</div>
      <button type="button" class="btn btn-sm" @click="source = 'offline'">
        {{ t(locale, 'discover.source.offline') }}
      </button>
    </div>

    <div v-else-if="source !== 'offline' && !hasFetchedOnline && !loading" class="notice-card card">
      <AppIcon name="shield" :size="16" class="notice-icon" />
      <div class="notice-body">{{ t(locale, 'discover.onlineHint') }}</div>
      <button type="button" class="btn btn-sm btn-primary" @click="handleOnlineFetch">
        {{ t(locale, 'discover.fetchBtn') }}
      </button>
    </div>

    <!-- Meme Gallery Grid -->
    <div v-if="displayCards.length > 0" class="meme-grid">
      <article v-for="card in displayCards" :key="card.id" class="meme-card card">
        <div class="meme-thumb-wrap">
          <img
            v-if="card.previewUrl"
            :src="card.previewUrl"
            :alt="card.title"
            class="meme-thumb"
            loading="lazy"
          />
          <div v-else class="meme-thumb-fallback">
            <span>{{ card.title }}</span>
          </div>
          <span v-if="card.source === 'offline'" class="source-badge">
            {{ card.tags[0] || 'HOT' }}
          </span>
        </div>

        <div class="meme-card-meta">
          <div class="meme-title" :title="card.title">{{ card.title }}</div>
          <div class="meme-actions">
            <button
              type="button"
              class="btn btn-xs btn-primary action-flex"
              @click="emit('copy-image', card.url, card.title)"
            >
              <AppIcon name="copy" :size="11" />
              <span>{{ t(locale, 'discover.copy') }}</span>
            </button>
            <button
              type="button"
              class="btn btn-xs action-flex"
              @click="handleSendToMaker(card)"
            >
              <AppIcon name="wand" :size="11" />
              <span>{{ t(locale, 'discover.edit') }}</span>
            </button>
            <button
              type="button"
              class="btn btn-xs star-btn"
              :title="isSaved(card) ? t(locale, 'discover.saved') : t(locale, 'discover.save')"
              @click="emit('save-favorite', { title: card.title, dataUrl: card.url, source: 'discover' })"
            >
              <AppIcon
                :name="isSaved(card) ? 'star-fill' : 'star'"
                :size="12"
                :style="isSaved(card) ? { color: '#EAB308' } : undefined"
              />
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-else-if="source === 'offline' || hasFetchedOnline" class="empty-box card">
      <AppIcon name="smile" :size="28" class="empty-icon" />
      <p>{{ t(locale, 'discover.empty') }}</p>
    </div>
  </section>
</template>

<style scoped>
.discover-view {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  min-height: 0;
}

.discover-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.search-box {
  position: relative;
  flex: 1 1 200px;
  min-width: 0;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 9px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding-left: 30px;
  padding-right: 26px;
}

.clear-btn {
  position: absolute;
  right: 7px;
  color: var(--text-muted);
  display: inline-flex;
  padding: 2px;
}

.source-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  max-width: 100%;
}

.source-select {
  max-width: 184px;
  font-size: 12px;
}

.tag-strip {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.notice-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--bg-subtle);
  flex-shrink: 0;
}

.notice-err {
  border-color: var(--err-text);
}

.notice-icon {
  color: var(--accent);
  flex-shrink: 0;
}

.notice-body {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.meme-grid {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: max-content;
  gap: 10px;
  padding-right: 2px;
  align-content: start;
}

.meme-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.14s ease, border-color 0.14s ease;
}

.meme-card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.meme-thumb-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
  background: var(--bg-subtle);
  overflow: hidden;
}

.meme-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.meme-thumb-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  text-align: center;
  font-weight: 700;
  color: var(--text-secondary);
}

.source-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  padding: 1px 6px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  background: rgba(28, 25, 23, 0.72);
  color: #fde047;
  backdrop-filter: blur(4px);
}

.meme-card-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
}

.meme-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meme-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-flex {
  flex: 1;
  min-width: 0;
}

.star-btn {
  width: 24px;
  padding: 0;
  flex-shrink: 0;
}

.empty-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-muted);
}

.empty-icon {
  color: var(--accent);
}

@media (max-width: 560px) {
  .meme-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .source-controls {
    width: 100%;
  }
  .source-select {
    flex: 1;
    max-width: none;
  }
}
</style>
