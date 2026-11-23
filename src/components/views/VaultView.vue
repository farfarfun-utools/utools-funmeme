<script setup lang="ts">
import { ref, watch } from 'vue'
import AppIcon from '../AppIcon.vue'
import { t } from '../../lib/i18n'
import type { Locale, OnlineApiSettings, SavedMemeItem } from '../../lib/storage'

const props = defineProps<{
  locale: Locale
  favorites: SavedMemeItem[]
  apiSettings: OnlineApiSettings
  initialTab?: 'favorites' | 'settings'
}>()

const emit = defineEmits<{
  (e: 'copy-image', dataUrl: string, title: string): void
  (e: 'export-image', dataUrl: string, filename: string): void
  (e: 'send-to-maker', payload: { url: string; title: string }): void
  (e: 'remove-favorite', id: string): void
  (e: 'update-settings', next: OnlineApiSettings): void
  (e: 'go-maker'): void
}>()

const subTab = ref<'favorites' | 'settings'>(props.initialTab ?? 'favorites')
const giphyKey = ref(props.apiSettings.giphyApiKey)
const tenorKey = ref(props.apiSettings.tenorApiKey)
const customUrl = ref(props.apiSettings.customApiUrl)

watch(
  () => props.initialTab,
  (val) => {
    if (val) subTab.value = val
  },
)

watch(
  () => props.apiSettings,
  (val) => {
    giphyKey.value = val.giphyApiKey
    tenorKey.value = val.tenorApiKey
    customUrl.value = val.customApiUrl
  },
  { deep: true },
)

function handleSaveSettings() {
  emit('update-settings', {
    giphyApiKey: giphyKey.value.trim(),
    tenorApiKey: tenorKey.value.trim(),
    customApiUrl: customUrl.value.trim(),
  })
}

function handleClearSettings() {
  giphyKey.value = ''
  tenorKey.value = ''
  customUrl.value = ''
  emit('update-settings', {
    giphyApiKey: '',
    tenorApiKey: '',
    customApiUrl: '',
  })
}
</script>

<template>
  <section class="vault-view">
    <div class="vault-header card">
      <div class="seg-group">
        <button
          type="button"
          class="seg-btn"
          :class="{ active: subTab === 'favorites' }"
          data-testid="vault-tab-favs"
          @click="subTab = 'favorites'"
        >
          {{ t(locale, 'vault.tabFavorites') }} ({{ favorites.length }})
        </button>
        <button
          type="button"
          class="seg-btn"
          :class="{ active: subTab === 'settings' }"
          data-testid="vault-tab-settings"
          @click="subTab = 'settings'"
        >
          {{ t(locale, 'vault.tabSettings') }}
        </button>
      </div>
    </div>

    <!-- Favorites Grid -->
    <template v-if="subTab === 'favorites'">
      <div v-if="favorites.length > 0" class="fav-grid">
        <article v-for="item in favorites" :key="item.id" class="fav-card card">
          <div class="fav-thumb-wrap">
            <img :src="item.dataUrl" :alt="item.title" class="fav-thumb" />
          </div>
          <div class="fav-body">
            <div class="fav-title" :title="item.title">{{ item.title }}</div>
            <div class="fav-actions">
              <button
                type="button"
                class="btn btn-xs btn-primary flex-1"
                @click="emit('copy-image', item.dataUrl, item.title)"
              >
                <AppIcon name="copy" :size="11" />
                <span>{{ t(locale, 'vault.copy') }}</span>
              </button>
              <button
                type="button"
                class="btn btn-xs"
                :title="t(locale, 'vault.edit')"
                @click="emit('send-to-maker', { url: item.dataUrl, title: item.title })"
              >
                <AppIcon name="wand" :size="11" />
              </button>
              <button
                type="button"
                class="btn btn-xs"
                :title="t(locale, 'vault.download')"
                @click="emit('export-image', item.dataUrl, `${item.title}.png`)"
              >
                <AppIcon name="download" :size="11" />
              </button>
              <button
                type="button"
                class="btn btn-xs"
                :title="t(locale, 'vault.delete')"
                @click="emit('remove-favorite', item.id)"
              >
                <AppIcon name="trash" :size="11" />
              </button>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="empty-vault card">
        <AppIcon name="bookmark" :size="30" class="empty-ico" />
        <div class="empty-title">{{ t(locale, 'vault.emptyTitle') }}</div>
        <p class="empty-desc">{{ t(locale, 'vault.emptyDesc') }}</p>
        <button type="button" class="btn btn-primary" @click="emit('go-maker')">
          <AppIcon name="wand" :size="14" />
          <span>{{ t(locale, 'vault.goMaker') }}</span>
        </button>
      </div>
    </template>

    <!-- API Settings Panel -->
    <div v-else class="settings-panel card">
      <h3 class="settings-title">{{ t(locale, 'vault.settingsTitle') }}</h3>

      <div class="privacy-box">
        <AppIcon name="shield" :size="16" class="shield-ico" />
        <p class="privacy-text">{{ t(locale, 'vault.privacyNotice') }}</p>
      </div>

      <label class="form-field">
        <span class="form-label">{{ t(locale, 'vault.giphyLabel') }}</span>
        <input
          v-model="giphyKey"
          type="password"
          autocomplete="off"
          class="input"
          placeholder="dc6zaTOxFJmzC..."
        />
      </label>

      <label class="form-field">
        <span class="form-label">{{ t(locale, 'vault.tenorLabel') }}</span>
        <input
          v-model="tenorKey"
          type="password"
          autocomplete="off"
          class="input"
          placeholder="AIzaSy..."
        />
      </label>

      <label class="form-field">
        <span class="form-label">{{ t(locale, 'vault.customLabel') }}</span>
        <input
          v-model="customUrl"
          type="url"
          class="input mono"
          placeholder="https://example.com/api/memes?q={query}"
        />
      </label>

      <div class="settings-actions">
        <button type="button" class="btn btn-primary" @click="handleSaveSettings">
          <AppIcon name="check" :size="14" />
          <span>{{ t(locale, 'vault.saveSettings') }}</span>
        </button>
        <button type="button" class="btn" @click="handleClearSettings">
          <AppIcon name="trash" :size="13" />
          <span>{{ t(locale, 'vault.clearKeys') }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.vault-view {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  min-height: 0;
}

.vault-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  flex-shrink: 0;
}

.fav-grid {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  align-content: start;
}

.fav-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.fav-thumb-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: var(--bg-subtle);
}

.fav-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fav-body {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fav-title {
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fav-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.flex-1 {
  flex: 1;
}

.empty-vault {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
}

.empty-ico {
  color: var(--accent);
}

.empty-title {
  font-size: 14px;
  font-weight: 700;
}

.empty-desc {
  margin: 0 0 6px;
  max-width: 340px;
  font-size: 12px;
  color: var(--text-muted);
}

.settings-panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}

.privacy-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
}

.shield-ico {
  color: var(--accent);
  flex-shrink: 0;
  margin-top: 2px;
}

.privacy-text {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.settings-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 4px;
}

@media (max-width: 560px) {
  .fav-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
