import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    // Larger inline limit = fewer round trips for small assets
    assetsInlineLimit: 4096,
    // CSS code splitting: each async chunk gets its own CSS
    cssCodeSplit: true,
    // Source maps off in prod (saves ~40% bundle size)
    sourcemap: false,
    // Target modern browsers — smaller output
    target: 'es2020',
    rollupOptions: {
      output: {
        // Manual chunk splitting for big deps
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) return 'vue-core'
            if (id.includes('axios')) return 'axios'
          }
        },
        // Predictable filenames for long-term caching
        chunkFileNames:  'assets/js/[name]-[hash].js',
        entryFileNames:  'assets/js/[name]-[hash].js',
        assetFileNames:  'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },

  // Pre-bundle deps for faster dev startup
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios'],
  },
})
