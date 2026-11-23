<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AppIcon from '../AppIcon.vue'
import { t } from '../../lib/i18n'
import type { Locale } from '../../lib/storage'
import {
  getTemplateThumbnail,
  MEME_TEMPLATES,
  QUICK_STICKER_BADGES,
  renderMemeToCanvas,
  type MemeAlign,
  type MemeShape,
  type MemeTemplateId,
} from '../../lib/templates'

const props = defineProps<{
  locale: Locale
  incomingImage: { url: string; name: string } | null
  incomingPreset: {
    templateId: MemeTemplateId
    topText: string
    bottomText: string
    nonce: number
  } | null
}>()

const emit = defineEmits<{
  (e: 'copy-image', dataUrl: string, title: string): void
  (e: 'export-image', dataUrl: string, filename: string): void
  (e: 'save-favorite', item: { title: string; dataUrl: string; source: 'maker' }): void
  (e: 'open-local-image'): void
  (e: 'clear-incoming-image'): void
  (e: 'drop-image', dataUrl: string, name: string): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const templateId = ref<MemeTemplateId>('panda-think')
const topText = ref('让我仔细想想')
const bottomText = ref('这需求到底合不合理')
const fontSize = ref(42)
const fillColor = ref('#FFFFFF')
const strokeColor = ref('#111827')
const strokeWidth = ref(5)
const align = ref<MemeAlign>('center')
const shape = ref<MemeShape>('square')
const badge = ref('笑死')
const dragging = ref(false)
const loadedImg = ref<HTMLImageElement | null>(null)

const quickFillColors = ['#FFFFFF', '#FDE047', '#111827', '#EF4444', '#38BDF8']
const quickStrokeColors = ['#111827', '#FFFFFF', '#991B1B', '#1D4ED8', '#B45309']

const templateCards = computed(() =>
  MEME_TEMPLATES.map((tpl) => ({
    ...tpl,
    thumb: getTemplateThumbnail(tpl.id),
  })),
)

const currentTitle = computed(() => {
  const txt = [topText.value.trim(), bottomText.value.trim()].filter(Boolean).join(' · ')
  if (txt) return txt.slice(0, 28)
  const tpl = MEME_TEMPLATES.find((x) => x.id === templateId.value)
  return tpl ? (props.locale === 'en' ? tpl.nameEn : tpl.name) : 'FunMeme'
})

function drawPreview() {
  const canvas = canvasRef.value
  if (!canvas) return
  renderMemeToCanvas(canvas, {
    templateId: templateId.value,
    customImage: loadedImg.value,
    topText: topText.value,
    bottomText: bottomText.value,
    fontSize: fontSize.value,
    fillColor: fillColor.value,
    strokeColor: strokeColor.value,
    strokeWidth: strokeWidth.value,
    align: align.value,
    shape: shape.value,
    badge: badge.value,
    size: 512,
  })
}

watch(
  () => props.incomingImage,
  (imgInfo) => {
    if (!imgInfo?.url) {
      loadedImg.value = null
      drawPreview()
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      loadedImg.value = img
      drawPreview()
    }
    img.onerror = () => {
      loadedImg.value = null
      drawPreview()
    }
    img.src = imgInfo.url
  },
  { immediate: true },
)

watch(
  () => props.incomingPreset,
  (preset) => {
    if (!preset) return
    loadedImg.value = null
    emit('clear-incoming-image')
    templateId.value = preset.templateId
    topText.value = preset.topText
    bottomText.value = preset.bottomText
    drawPreview()
  },
)

watch(
  [templateId, topText, bottomText, fontSize, fillColor, strokeColor, strokeWidth, align, shape, badge],
  drawPreview,
)

onMounted(drawPreview)

function selectTemplate(id: MemeTemplateId) {
  templateId.value = id
  loadedImg.value = null
  emit('clear-incoming-image')
  const spec = MEME_TEMPLATES.find((x) => x.id === id)
  if (spec) {
    topText.value = spec.defaultTop
    bottomText.value = spec.defaultBottom
  }
}

function getCanvasDataUrl(): string {
  const canvas = canvasRef.value
  if (!canvas) return ''
  try {
    return canvas.toDataURL('image/png')
  } catch {
    return ''
  }
}

function handleCopy() {
  const url = getCanvasDataUrl()
  if (url) emit('copy-image', url, currentTitle.value)
}

function handleExport() {
  const url = getCanvasDataUrl()
  if (url) emit('export-image', url, `funmeme-${templateId.value}.png`)
}

function handleSave() {
  const url = getCanvasDataUrl()
  if (url) emit('save-favorite', { title: currentTitle.value, dataUrl: url, source: 'maker' })
}

function handleDrop(e: DragEvent) {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      emit('drop-image', reader.result, file.name)
    }
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <section class="maker-layout">
    <!-- Left Live Canvas Preview Column -->
    <div class="maker-stage card">
      <div
        class="canvas-frame checker-bg"
        :class="{ dragging }"
        @dragover.prevent="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="handleDrop"
      >
        <canvas ref="canvasRef" class="maker-canvas" width="512" height="512" />
      </div>

      <div class="stage-meta">
        <span class="drop-hint">{{ t(locale, 'maker.dropHint') }}</span>
        <span class="pill pill-neutral mono">512×512 PNG</span>
      </div>

      <div class="stage-info-card">
        <div class="info-row">
          <span class="info-key">{{ locale === 'en' ? 'Active Template' : '当前画布' }}</span>
          <span class="info-val">{{ incomingImage ? incomingImage.name : currentTitle }}</span>
        </div>
        <div class="info-row">
          <span class="info-key">{{ locale === 'en' ? 'Output Frame' : '输出裁切' }}</span>
          <span class="info-val">
            {{
              shape === 'circle'
                ? t(locale, 'maker.shapeCircle')
                : shape === 'rounded'
                  ? t(locale, 'maker.shapeRounded')
                  : t(locale, 'maker.shapeSquare')
            }}
            <template v-if="badge"> · 🏷️ {{ badge }}</template>
          </span>
        </div>
        <div v-if="incomingImage" class="info-row">
          <button type="button" class="btn btn-xs" @click="emit('clear-incoming-image')">
            {{ t(locale, 'maker.clearImage') }}
          </button>
        </div>
      </div>

      <div class="stage-actions">
        <button type="button" class="btn btn-primary action-main" data-testid="maker-copy-btn" @click="handleCopy">
          <AppIcon name="copy" :size="14" />
          <span>{{ t(locale, 'maker.copyPng') }}</span>
        </button>
        <button type="button" class="btn" @click="handleExport">
          <AppIcon name="download" :size="14" />
          <span>{{ t(locale, 'maker.exportPng') }}</span>
        </button>
        <button type="button" class="btn btn-icon" :title="t(locale, 'maker.saveVault')" @click="handleSave">
          <AppIcon name="star" :size="14" />
        </button>
        <button type="button" class="btn btn-icon" :title="t(locale, 'maker.upload')" @click="emit('open-local-image')">
          <AppIcon name="upload" :size="14" />
        </button>
      </div>
    </div>

    <!-- Right Controls Column -->
    <div class="maker-controls card">
      <!-- Built-in Templates Strip -->
      <div class="ctrl-block">
        <div class="ctrl-header">
          <span class="section-title">{{ t(locale, 'maker.templates') }}</span>
          <span v-if="incomingImage" class="pill pill-accent">
            {{ t(locale, 'maker.customImage') }}: {{ incomingImage.name }}
          </span>
        </div>
        <div class="tpl-strip">
          <button
            v-for="tpl in templateCards"
            :key="tpl.id"
            type="button"
            class="tpl-item"
            :class="{ active: !incomingImage && templateId === tpl.id }"
            @click="selectTemplate(tpl.id)"
          >
            <img v-if="tpl.thumb" :src="tpl.thumb" :alt="tpl.name" class="tpl-thumb" />
            <span v-else class="tpl-thumb-ph" :style="{ background: tpl.bgColor }" />
            <span class="tpl-name">{{ locale === 'en' ? tpl.nameEn : tpl.name }}</span>
          </button>
        </div>
      </div>

      <!-- Captions -->
      <div class="ctrl-grid-2">
        <label class="field">
          <span class="field-label">{{ t(locale, 'maker.topText') }}</span>
          <input v-model="topText" type="text" class="input" data-testid="maker-top-input" />
        </label>
        <label class="field">
          <span class="field-label">{{ t(locale, 'maker.bottomText') }}</span>
          <input v-model="bottomText" type="text" class="input" data-testid="maker-bottom-input" />
        </label>
      </div>

      <!-- Typography Sliders -->
      <div class="ctrl-grid-2">
        <label class="field">
          <span class="field-label">{{ t(locale, 'maker.fontSize') }}: <strong class="mono">{{ fontSize }}px</strong></span>
          <input v-model.number="fontSize" type="range" min="22" max="72" class="range-input" />
        </label>
        <label class="field">
          <span class="field-label">{{ t(locale, 'maker.strokeWidth') }}: <strong class="mono">{{ strokeWidth }}px</strong></span>
          <input v-model.number="strokeWidth" type="range" min="0" max="10" class="range-input" />
        </label>
      </div>

      <!-- Align & Shape -->
      <div class="ctrl-grid-2">
        <div class="field">
          <span class="field-label">{{ t(locale, 'maker.align') }}</span>
          <div class="seg-group">
            <button type="button" class="seg-btn" :class="{ active: align === 'left' }" @click="align = 'left'">L</button>
            <button type="button" class="seg-btn" :class="{ active: align === 'center' }" @click="align = 'center'">C</button>
            <button type="button" class="seg-btn" :class="{ active: align === 'right' }" @click="align = 'right'">R</button>
          </div>
        </div>
        <div class="field">
          <span class="field-label">{{ t(locale, 'maker.shape') }}</span>
          <div class="seg-group">
            <button type="button" class="seg-btn" :class="{ active: shape === 'square' }" @click="shape = 'square'">
              {{ t(locale, 'maker.shapeSquare') }}
            </button>
            <button type="button" class="seg-btn" :class="{ active: shape === 'rounded' }" @click="shape = 'rounded'">
              {{ t(locale, 'maker.shapeRounded') }}
            </button>
            <button type="button" class="seg-btn" :class="{ active: shape === 'circle' }" @click="shape = 'circle'">
              {{ t(locale, 'maker.shapeCircle') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Fill & Stroke Colors -->
      <div class="ctrl-grid-2">
        <div class="field">
          <span class="field-label">{{ t(locale, 'maker.fillColor') }}</span>
          <div class="color-row">
            <input v-model="fillColor" type="color" class="color-picker" aria-label="Fill color" />
            <button
              v-for="c in quickFillColors"
              :key="c"
              type="button"
              class="color-dot"
              :class="{ active: fillColor.toUpperCase() === c }"
              :style="{ backgroundColor: c }"
              @click="fillColor = c"
            />
          </div>
        </div>
        <div class="field">
          <span class="field-label">{{ t(locale, 'maker.strokeColor') }}</span>
          <div class="color-row">
            <input v-model="strokeColor" type="color" class="color-picker" aria-label="Stroke color" />
            <button
              v-for="c in quickStrokeColors"
              :key="c"
              type="button"
              class="color-dot"
              :class="{ active: strokeColor.toUpperCase() === c }"
              :style="{ backgroundColor: c }"
              @click="strokeColor = c"
            />
          </div>
        </div>
      </div>

      <!-- Quick Sticker Badges -->
      <div class="ctrl-block">
        <span class="field-label">{{ t(locale, 'maker.badge') }}</span>
        <div class="badge-list">
          <button
            type="button"
            class="chip"
            :class="{ active: badge === '' }"
            @click="badge = ''"
          >
            {{ t(locale, 'maker.badgeNone') }}
          </button>
          <button
            v-for="b in QUICK_STICKER_BADGES"
            :key="b"
            type="button"
            class="chip"
            :class="{ active: badge === b }"
            @click="badge = b"
          >
            {{ b }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.maker-layout {
  display: grid;
  grid-template-columns: minmax(0, 296px) minmax(0, 1fr);
  gap: 12px;
  height: 100%;
  min-height: 0;
}

.maker-stage {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  min-height: 0;
}

.canvas-frame {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;
}

.canvas-frame.dragging {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.maker-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.stage-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.stage-info-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  border-radius: var(--radius-sm);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11.5px;
}

.info-key {
  color: var(--text-muted);
  flex-shrink: 0;
}

.info-val {
  color: var(--text-primary);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drop-hint {
  font-size: 11px;
  color: var(--text-muted);
}

.stage-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
}

.action-main {
  flex: 1;
}

.maker-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  overflow-y: auto;
  min-height: 0;
}

.ctrl-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ctrl-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.tpl-strip {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
}

.tpl-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 4px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-subtle);
  transition: border-color 0.14s, background 0.14s;
}

.tpl-item:hover {
  border-color: var(--border-strong);
}

.tpl-item.active {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.tpl-thumb,
.tpl-thumb-ph {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  object-fit: cover;
  display: block;
}

.tpl-name {
  font-size: 10px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.ctrl-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.field-label {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-secondary);
}

.color-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-picker {
  width: 26px;
  height: 24px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
}

.color-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid rgba(128, 128, 128, 0.45);
}

.color-dot.active {
  box-shadow: 0 0 0 2px var(--bg-panel), 0 0 0 3.5px var(--accent);
}

.badge-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

@media (max-width: 640px) {
  .maker-layout {
    grid-template-columns: minmax(0, 1fr);
    overflow-y: auto;
  }
  .maker-controls {
    overflow: visible;
  }
  .ctrl-grid-2 {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
