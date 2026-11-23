// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.vue'

describe('FunMeme App UI', () => {
  beforeEach(() => {
    const store = new Map<string, string>()
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, String(v))
        },
        removeItem: (k: string) => {
          store.delete(k)
        },
        clear: () => {
          store.clear()
        },
      },
    })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    delete document.documentElement.dataset.theme
    window.funmeme = undefined
    window.utools = undefined
  })

  it('mounts cleanly and switches across all 5 workspace views', async () => {
    const wrapper = mount(App)
    expect(wrapper.find('.discover-view').exists()).toBe(true)

    await wrapper.find('[data-testid="nav-maker"]').trigger('click')
    expect(wrapper.find('.maker-layout').exists()).toBe(true)

    await wrapper.find('[data-testid="nav-textmeme"]').trigger('click')
    expect(wrapper.find('.textmeme-layout').exists()).toBe(true)

    await wrapper.find('[data-testid="nav-emoji"]').trigger('click')
    expect(wrapper.find('.emoji-view').exists()).toBe(true)
    await wrapper.find('[data-testid="tab-kaomoji"]').trigger('click')
    expect(wrapper.find('.kaomoji-grid').exists()).toBe(true)

    await wrapper.find('[data-testid="nav-vault"]').trigger('click')
    expect(wrapper.find('.vault-view').exists()).toBe(true)
    await wrapper.find('[data-testid="vault-tab-settings"]').trigger('click')
    expect(wrapper.find('.settings-panel').exists()).toBe(true)

    wrapper.unmount()
  })

  it('cycles theme mode and toggles zh-CN/EN locale', async () => {
    const wrapper = mount(App)
    const themeBtn = wrapper.find('[data-testid="theme-btn"]')
    await themeBtn.trigger('click') // light
    expect(document.documentElement.dataset.theme).toBe('light')
    await themeBtn.trigger('click') // dark
    expect(document.documentElement.dataset.theme).toBe('dark')

    const localeBtn = wrapper.find('[data-testid="locale-btn"]')
    expect(localeBtn.text()).toBe('EN')
    await localeBtn.trigger('click')
    expect(localeBtn.text()).toBe('中')
    expect(wrapper.text()).toContain('Meme Discover')

    wrapper.unmount()
  })
})
