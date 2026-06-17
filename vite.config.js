import { fileURLToPath, URL } from 'node:url'
import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

const require = createRequire(import.meta.url)
const path = require('path')

// Prerender only works locally — Vercel/CI doesn't have the required
// system libraries (libnss3) for Puppeteer to launch Chrome.
const isCI = process.env.CI || process.env.VERCEL
const prerenderPlugin = isCI
  ? null
  : (() => {
      const vitePrerender = require('vite-plugin-prerender')
      return vitePrerender({
        staticDir: path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist'),
        routes: ['/', '/about', '/services', '/contact', '/explore', '/community', '/projects', '/careers', '/hire', '/jobs', '/courses', '/report', '/privacy-policy'],
      })
    })()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    prerenderPlugin,
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
