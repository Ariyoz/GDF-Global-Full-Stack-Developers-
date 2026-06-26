import { fileURLToPath, URL } from 'node:url'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    splitVendorChunkPlugin(), // splits node_modules into separate cacheable chunk
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
        manualChunks: {
          'vue-core':   ['vue', 'vue-router', 'pinia'],
          'axios':      ['axios'],
          'capacitor':  [
            '@capacitor/core',
            '@capacitor/android',
            '@capacitor/ios',
          ],
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
