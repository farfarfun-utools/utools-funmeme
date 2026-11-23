<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import AppIcon from '../AppIcon.vue'
import { t } from '../../lib/i18n'
import type { Locale } from '../../lib/storage'
import {
  renderTextMemeToCanvas,
  TEXT_MEME_PRESETS,
  TEXT_MEME_STYLES,
  type TextMemeStyleId,
} from '../../lib/text-meme'

const props = defineProps<{
  locale: Locale
  incomingText: string
}>()

const emit = defineEmits<{
  (e: 'copy-image', dataUrl: string, title: string): void
  (e: 'export-image', dataUrl: string, filename: string): void
  (e: 'save-favorite', item: { title: string; dataUrl: string; source: 'textmeme' }): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const activeStyle = ref<TextMemeStyleId>('red-gold')
const text = ref('代码能跑\n就别动！')
const fontSize = ref(58)

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const spec = TEXT_MEME_STYLES.find((s) => s.id === activeStyle.value) ?? TEXT_MEME_STYLES[0]
  renderTextMemeToCanvas(canvas, {
    style: spec.id,
    text: text.value.trim() || 'FunMeme',
    fontSize: fontSize.value,
    textColor: spec.textColor,
    bgColor: spec.bgColor,
    size: 512,
  })
}

watch(
  () => props.incomingText,
  (val) => {
    if (val && val.trim()) {
      text.value = val.trim().slice(0, 80)
      draw()
    }
  },
  { immediate: true },
)

watch([activeStyle, text, fontSize], draw)
onMounted(draw)

function selectStyle(styleId: TextMemeStyleId) {
  activeStyle.value = styleId
  const spec = TEXT_MEME_STYLES.find((s) => s.id === styleId)
  if (spec) fontSize.value = spec.defaultFontSize
}

function getDataUrl(): string {
  return canvasRef.value?.toDataURL('image/png') ?? ''
}

function handleCopy() {
  const url = getDataUrl()
  if (url) emit('copy-image', url, text.value.trim().slice(0, 20) || 'TextMeme')
}

function handleExport() {
  const url = getDataUrl()
  if (url) emit('export-image', url, `funmeme-text-${activeStyle.value}.png`)
}

function handleSave() {
  const url = getDataUrl()
  if (url) {
    emit('save-favorite', {
      title: text.value.trim().slice(0, 24) || '文字表情',
      dataUrl: url,
      source: 'textmeme',
    })
  }
}
</script>

<template>
  <section class="textmeme-layout">
    <!-- Left Preview -->
    <div class="preview-card card">
      <div class="canvas-box">
        <canvas ref="canvasRef" class="textmeme-canvas" width="512" height="512" />
      </div>

      <div class="preview-meta">
        <div class="meta-row">
          <span class="meta-k">{{ locale === 'en' ? 'Style' : '当前风格' }}</span>
          <span class="meta-v">
            {{
              locale === 'en'
                ? TEXT_MEME_STYLES.find((s) => s.id === activeStyle)?.nameEn
                : TEXT_MEME_STYLES.find((s) => s.id === activeStyle)?.name
            }}
          </span>
        </div>
        <div class="meta-row">
          <span class="meta-k">{{ locale === 'en' ? 'Output' : '画布规格' }}</span>
          <span class="meta-v mono">512×512 PNG · {{ fontSize }}px</span>
        </div>
      </div>

      <div class="preview-actions">
        <button type="button" class="btn btn-primary action-main" data-testid="textmeme-copy-btn" @click="handleCopy">
          <AppIcon name="copy" :size="14" />
          <span>{{ t(locale, 'textmeme.copyPng') }}</span>
        </button>
        <button type="button" class="btn" @click="handleExport">
          <AppIcon name="download" :size="14" />
          <span>{{ t(locale, 'textmeme.exportPng') }}</span>
        </button>
        <button type="button" class="btn btn-icon" :title="t(locale, 'textmeme.saveVault')" @click="handleSave">
          <AppIcon name="star" :size="14" />
        </button>
      </div>
    </div>

    <!-- Right Controls -->
    <div class="controls-card card">
      <div class="ctrl-section">
        <h3 class="section-title">{{ t(locale, 'textmeme.styles') }}</h3>
        <div class="style-grid">
          <button
            v-for="s in TEXT_MEME_STYLES"
            :key="s.id"
            type="button"
            class="style-card"
            :class="{ active: activeStyle === s.id }"
            @click="selectStyle(s.id)"
          >
            <span
              class="style-swatch"
              :style="{ backgroundColor: s.bgColor, color: s.textColor, borderColor: s.accentColor }"
            >
              Aa
            </span>
            <span class="style-name">{{ locale === 'en' ? s.nameEn : s.name }}</span>
          </button>
        </div>
      </div>

      <label class="ctrl-section">
        <span class="section-title">{{ t(locale, 'textmeme.content') }}</span>
        <textarea
          v-model="text"
          rows="3"
          maxlength="120"
          class="textarea"
          data-testid="textmeme-input"
        />
      </label>

      <label class="ctrl-section">
        <span class="section-title">{{ t(locale, 'textmeme.fontSize') }}: <strong class="mono">{{ fontSize }}px</strong></span>
        <input v-model.number="fontSize" type="range" min="26" max="84" class="range-input" />
      </label>

      <div class="ctrl-section">
        <h3 class="section-title">{{ t(locale, 'textmeme.presets') }}</h3>
        <div class="preset-list">
          <button
            v-for="preset in TEXT_MEME_PRESETS"
            :key="preset"
            type="button"
            class="chip"
            :class="{ active: text === preset }"
            @click="text = preset"
          >
            {{ preset }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.textmeme-layout {
  display: grid;
  grid-template-columns: minmax(0, 296px) minmax(0, 1fr);
  gap: 12px;
  height: 100%;
  min-height: 0;
}

.preview-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  min-height: 0;
}

.canvas-box {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  overflow: hidden;
  background: var(--bg-subtle);
}

.textmeme-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.preview-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  border-radius: var(--radius-sm);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11.5px;
}

.meta-k {
  color: var(--text-muted);
}

.meta-v {
  color: var(--text-primary);
  font-weight: 600;
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
}

.action-main {
  flex: 1;
}

.controls-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 12px;
  overflow-y: auto;
  min-height: 0;
}

.ctrl-section {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.style-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 9px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-subtle);
  text-align: left;
  transition: border-color 0.14s, background 0.14s;
}

.style-card:hover {
  border-color: var(--border-strong);
}

.style-card.active {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.style-swatch {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 2px solid;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}

.style-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preset-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 640px) {
  .textmeme-layout {
    grid-template-columns: minmax(0, 1fr);
    overflow-y: auto;
  }
  .controls-card {
    overflow: visible;
  }
}
</style>
