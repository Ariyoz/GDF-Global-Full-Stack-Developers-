import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    assetsInlineLimit: 4096,   // only inline very small assets
    cssCodeSplit: true,
    sourcemap: false,
    target: 'es2020',
    rollupOptions: {
      output: {
        // Smart code splitting — keep critical path small
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          // Vue core — always needed
          if (id.includes('/vue/') || id.includes('/vue-router/') || id.includes('/pinia/')) {
            return 'vue-core'
          }
          // Axios — needed for all API calls
          if (id.includes('/axios/')) return 'axios'
          // Capacitor — mobile only, load separately
          if (id.includes('@capacitor')) return 'capacitor'
          // Everything else stays in vendor
          return 'vendor'
        },
        chunkFileNames:  'assets/js/[name]-[hash].js',
        entryFileNames:  'assets/js/[name]-[hash].js',
        assetFileNames:  'assets/[ext]/[name]-[hash].[ext]',
      },
      // Safer treeshake — don't strip side effects in unknown modules
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
      },
    },
    chunkSizeWarningLimit: 1200,
  },

  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios'],
    exclude: ['@capacitor/core'],
  },

  server: {
    hmr: { overlay: false },
  },
})
