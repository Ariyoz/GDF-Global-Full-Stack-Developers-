import { fileURLToPath, URL } from 'node:url'
import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

const require = createRequire(import.meta.url)
const vitePrerender = require('vite-plugin-prerender')
const path = require('path')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    vitePrerender({
      // Where the compiled production files live
      staticDir: path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist'),
      // The routes you want to pre-render into HTML files
      routes: ['/', '/about', '/services', '/contact', '/explore', '/community', '/projects', '/careers', '/hire', '/jobs', '/courses', '/report', '/privacy-policy'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
