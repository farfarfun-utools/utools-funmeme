<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '../AppIcon.vue'
import {
  EMOJI_CATEGORIES,
  KAOMOJI_CATEGORIES,
  renderEmojiStickerDataUrl,
  searchEmojiKaomoji,
} from '../../lib/emoji'
import { t } from '../../lib/i18n'
import type { Locale } from '../../lib/storage'

defineProps<{
  locale: Locale
}>()

const emit = defineEmits<{
  (e: 'copy-text', text: string, label?: string): void
  (e: 'copy-image', dataUrl: string, title: string): void
  (e: 'export-image', dataUrl: string, filename: string): void
}>()

const tab = ref<'emoji' | 'kaomoji'>('emoji')
const query = ref('')
const category = ref('all')
const selectedEmoji = ref('😂')
const selectedEmojiName = ref('笑哭')
const withBorder = ref(true)

const categories = computed(() => (tab.value === 'emoji' ? EMOJI_CATEGORIES : KAOMOJI_CATEGORIES))

const filteredItems = computed(() =>
  searchEmojiKaomoji({
    query: query.value,
    kind: tab.value,
    category: category.value,
    limit: 120,
  }),
)

function switchTab(next: 'emoji' | 'kaomoji') {
  tab.value = next
  category.value = 'all'
}

function handleItemClick(symbol: string, name: string) {
  if (tab.value === 'emoji') {
    selectedEmoji.value = symbol
    selectedEmojiName.value = name
  }
  emit('copy-text', symbol, name)
}

function handleCopySticker() {
  const url = renderEmojiStickerDataUrl(selectedEmoji.value, { withBorder: withBorder.value, size: 512 })
  if (url) emit('copy-image', url, `${selectedEmojiName.value} 贴纸`)
}

function handleExportSticker() {
  const url = renderEmojiStickerDataUrl(selectedEmoji.value, { withBorder: withBorder.value, size: 512 })
  if (url) emit('export-image', url, `funmeme-sticker.png`)
}
</script>

<template>
  <section class="emoji-view">
    <!-- Top Segmented Tabs + Search -->
    <div class="emoji-toolbar card">
      <div class="seg-group">
        <button
          type="button"
          class="seg-btn"
          :class="{ active: tab === 'emoji' }"
          data-testid="tab-emoji"
          @click="switchTab('emoji')"
        >
          {{ t(locale, 'emoji.tabEmoji') }}
        </button>
        <button
          type="button"
          class="seg-btn"
          :class="{ active: tab === 'kaomoji' }"
          data-testid="tab-kaomoji"
          @click="switchTab('kaomoji')"
        >
          {{ t(locale, 'emoji.tabKaomoji') }}
        </button>
      </div>

      <div class="search-wrap">
        <AppIcon name="search" :size="14" class="search-ico" />
        <input
          v-model="query"
          type="text"
          class="input search-field"
          :placeholder="t(locale, 'emoji.searchPlaceholder')"
          @keydown.escape="query = ''"
        />
        <button
          v-if="query"
          type="button"
          class="clear-btn"
          :aria-label="locale === 'en' ? 'Clear search' : '清空搜索'"
          @click="query = ''"
        >
          <AppIcon name="x" :size="13" />
        </button>
      </div>
    </div>

    <!-- Category Pills -->
    <div class="cat-strip">
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        class="chip"
        :class="{ active: category === cat.id }"
        @click="category = cat.id"
      >
        {{ locale === 'en' ? cat.labelEn : cat.label }}
      </button>
    </div>

    <!-- Main Grid -->
    <div v-if="filteredItems.length > 0" :class="tab === 'emoji' ? 'emoji-grid' : 'kaomoji-grid'">
      <button
        v-for="item in filteredItems"
        :key="`${item.kind}-${item.symbol}`"
        type="button"
        class="symbol-card card"
        :class="{ selected: tab === 'emoji' && selectedEmoji === item.symbol }"
        @click="handleItemClick(item.symbol, locale === 'en' ? item.nameEn : item.name)"
      >
        <span :class="tab === 'emoji' ? 'emoji-glyph' : 'kaomoji-glyph'">{{ item.symbol }}</span>
        <span class="symbol-name">{{ locale === 'en' ? item.nameEn : item.name }}</span>
      </button>
    </div>

    <div v-else class="empty-panel card">
      <span>{{ t(locale, 'emoji.empty') }}</span>
    </div>

    <!-- Sticker Generator Bar (Emoji mode) -->
    <div v-if="tab === 'emoji'" class="sticker-bar card">
      <div class="sticker-preview checker-bg">
        <span class="sticker-bubble" :class="{ bordered: withBorder }">{{ selectedEmoji }}</span>
      </div>
      <div class="sticker-info">
        <div class="sticker-title">
          {{ t(locale, 'emoji.stickerTitle') }} · <strong>{{ selectedEmojiName }}</strong>
        </div>
        <label class="sticker-check">
          <input v-model="withBorder" type="checkbox" />
          <span>{{ t(locale, 'emoji.stickerBorder') }}</span>
        </label>
      </div>
      <div class="sticker-actions">
        <button type="button" class="btn btn-sm btn-primary" data-testid="copy-sticker-btn" @click="handleCopySticker">
          <AppIcon name="sparkles" :size="13" />
          <span>{{ t(locale, 'emoji.copySticker') }}</span>
        </button>
        <button type="button" class="btn btn-sm" @click="handleExportSticker">
          <AppIcon name="download" :size="13" />
          <span class="hide-sm">{{ t(locale, 'emoji.saveSticker') }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.emoji-view {
  display: flex;
  flex-direction: column;
  gap: 9px;
  height: 100%;
  min-height: 0;
}

.emoji-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.search-wrap {
  position: relative;
  flex: 1 1 180px;
  min-width: 0;
  display: flex;
  align-items: center;
}

.search-ico {
  position: absolute;
  left: 9px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-field {
  width: 100%;
  padding-left: 30px;
  padding-right: 28px;
}

.clear-btn {
  position: absolute;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.14s, color 0.14s;
}

.clear-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.cat-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex-shrink: 0;
}

.emoji-grid {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 7px;
  padding-right: 2px;
  align-content: start;
}

.kaomoji-grid {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding-right: 2px;
  align-content: start;
}

.symbol-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 9px 6px;
  transition: border-color 0.14s, background 0.14s, transform 0.12s;
}

.symbol-card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.symbol-card.selected {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.emoji-glyph {
  font-size: 26px;
  line-height: 1.15;
}

.kaomoji-glyph {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  word-break: break-word;
}

.symbol-name {
  font-size: 10.5px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.sticker-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  flex-shrink: 0;
}

.sticker-preview {
  width: 44px;
  height: 44px;
  border-radius: 9px;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sticker-bubble {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  border-radius: 50%;
}

.sticker-bubble.bordered {
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
}

.sticker-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sticker-title {
  font-size: 12px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sticker-check {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-muted);
  cursor: pointer;
}

.sticker-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.empty-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

@media (max-width: 560px) {
  .emoji-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .kaomoji-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .hide-sm {
    display: none;
  }
}
</style>
