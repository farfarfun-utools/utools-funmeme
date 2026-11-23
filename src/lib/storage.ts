export type ViewId = 'discover' | 'maker' | 'textmeme' | 'emoji' | 'vault'
export type ThemeMode = 'system' | 'light' | 'dark'
export type Locale = 'zh-CN' | 'en'

export interface SavedMemeItem {
  id: string
  title: string
  dataUrl: string
  source: 'discover' | 'maker' | 'textmeme' | 'emoji'
  createdAt: number
}

export interface OnlineApiSettings {
  giphyApiKey: string
  tenorApiKey: string
  customApiUrl: string
}

export interface FunMemeState {
  version: number
  activeView: ViewId
  favorites: SavedMemeItem[]
  apiSettings: OnlineApiSettings
  settings: {
    theme: ThemeMode
    locale: Locale
  }
}

const STORAGE_KEY = 'funmeme_studio_v1'
const MAX_SAVED_MEMES = 36

const VALID_VIEWS = new Set<ViewId>(['discover', 'maker', 'textmeme', 'emoji', 'vault'])
const VALID_THEMES = new Set<ThemeMode>(['system', 'light', 'dark'])
const VALID_LOCALES = new Set<Locale>(['zh-CN', 'en'])

export function createDefaultState(): FunMemeState {
  return {
    version: 1,
    activeView: 'discover',
    favorites: [],
    apiSettings: {
      giphyApiKey: '',
      tenorApiKey: '',
      customApiUrl: '',
    },
    settings: {
      theme: 'system',
      locale: 'zh-CN',
    },
  }
}

export function loadStudioState(): FunMemeState {
  const fallback = createDefaultState()
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<FunMemeState>
    const activeView = VALID_VIEWS.has(parsed.activeView as ViewId)
      ? (parsed.activeView as ViewId)
      : fallback.activeView
    const theme = VALID_THEMES.has(parsed.settings?.theme as ThemeMode)
      ? (parsed.settings!.theme as ThemeMode)
      : fallback.settings.theme
    const locale = VALID_LOCALES.has(parsed.settings?.locale as Locale)
      ? (parsed.settings!.locale as Locale)
      : fallback.settings.locale
    const favorites = Array.isArray(parsed.favorites)
      ? parsed.favorites
          .filter(
            (item): item is SavedMemeItem =>
              Boolean(item) &&
              typeof item.id === 'string' &&
              typeof item.title === 'string' &&
              typeof item.dataUrl === 'string' &&
              (item.dataUrl.startsWith('data:image/') || item.dataUrl.startsWith('https://')),
          )
          .slice(0, MAX_SAVED_MEMES)
      : []
    const apiSettings: OnlineApiSettings = {
      giphyApiKey: typeof parsed.apiSettings?.giphyApiKey === 'string' ? parsed.apiSettings.giphyApiKey.slice(0, 128) : '',
      tenorApiKey: typeof parsed.apiSettings?.tenorApiKey === 'string' ? parsed.apiSettings.tenorApiKey.slice(0, 128) : '',
      customApiUrl: typeof parsed.apiSettings?.customApiUrl === 'string' ? parsed.apiSettings.customApiUrl.slice(0, 512) : '',
    }
    return {
      version: 1,
      activeView,
      favorites,
      apiSettings,
      settings: { theme, locale },
    }
  } catch {
    return fallback
  }
}

export function saveStudioState(state: FunMemeState): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    const payload: FunMemeState = {
      version: 1,
      activeView: state.activeView,
      favorites: state.favorites.slice(0, MAX_SAVED_MEMES),
      apiSettings: {
        giphyApiKey: state.apiSettings.giphyApiKey.trim().slice(0, 128),
        tenorApiKey: state.apiSettings.tenorApiKey.trim().slice(0, 128),
        customApiUrl: state.apiSettings.customApiUrl.trim().slice(0, 512),
      },
      settings: {
        theme: state.settings.theme,
        locale: state.settings.locale,
      },
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // storage quota exceeded — trim favorites gracefully
    try {
      const compact: FunMemeState = {
        ...state,
        favorites: state.favorites.slice(0, 8),
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(compact))
    } catch {
      // ignore if still unavailable
    }
  }
}

export function addFavoriteItem(
  list: SavedMemeItem[],
  item: Omit<SavedMemeItem, 'id' | 'createdAt'>,
): SavedMemeItem[] {
  const existingIdx = list.findIndex((x) => x.dataUrl === item.dataUrl && x.title === item.title)
  if (existingIdx >= 0) {
    return list
  }
  const next: SavedMemeItem = {
    ...item,
    id: `meme_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: Date.now(),
  }
  return [next, ...list].slice(0, MAX_SAVED_MEMES)
}

export function removeFavoriteItem(list: SavedMemeItem[], id: string): SavedMemeItem[] {
  return list.filter((item) => item.id !== id)
}
