import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    outDir: 'utools/dist',
    emptyOutDir: true,
    target: 'chrome120',
  },
  test: {
    environment: 'jsdom',
  },
})
