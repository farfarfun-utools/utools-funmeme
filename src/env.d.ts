/// <reference types="vite/client" />

export interface FunMemeImageFile {
  name: string
  mime: string
  size: number
  dataUrl: string
}

export interface FunMemeEnterAction {
  code: string
  type: string
  payload: unknown
}

export interface FunMemeBridge {
  openImageFile: () => FunMemeImageFile | null
  readEntryImageFiles: (entries: Array<string | { path?: string }>) => FunMemeImageFile[]
  copyImageDataUrl: (dataUrl: string) => boolean
  saveImageDataUrl: (defaultName: string, dataUrl: string) => boolean
  fetchOnlineJson: (url: string) => Promise<unknown>
  onEnter: (callback: (action: FunMemeEnterAction) => void) => () => void
}

declare global {
  interface Window {
    funmeme?: FunMemeBridge
    utools?: {
      isDarkColors?: () => boolean
      copyText?: (text: string) => boolean
      copyImage?: (image: string) => boolean
      registerTool?: (name: string, handler: (params: unknown) => unknown) => void
    }
  }
}

export {}
