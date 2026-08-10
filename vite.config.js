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
    assetsInlineLimit: 2048,     // inline only <2KB assets
    cssCodeSplit: true,
    sourcemap: false,
    target: 'es2020',
    minify: 'esbuild',
    reportCompressedSize: false, // faster builds
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          // Vue ecosystem — always needed first
          if (id.includes('/vue/') || id.includes('/vue-demi/')) return 'vue'
          if (id.includes('/vue-router/'))  return 'vue-router'
          if (id.includes('/pinia/'))       return 'pinia'

          // HTTP client
          if (id.includes('/axios/'))       return 'axios'

          // Capacitor — mobile only, isolated chunk
          if (id.includes('@capacitor'))    return 'capacitor'

          // Tailwind runtime (if any)
          if (id.includes('tailwindcss'))   return 'tailwind'

          return 'vendor'
        },
        chunkFileNames:  'assets/js/[name]-[hash].js',
        entryFileNames:  'assets/js/[name]-[hash].js',
        assetFileNames:  'assets/[ext]/[name]-[hash].[ext]',
        compact: true,
      },
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    chunkSizeWarningLimit: 800,
  },

  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios'],
    exclude: ['@capacitor/core', '@capacitor/android', '@capacitor/ios'],
  },

  server: {
    hmr: { overlay: true },
    warmup: {
      clientFiles: [
        './src/main.js',
        './src/App.vue',
        './src/layouts/DashboardLayout.vue',
        './src/views/Home/HomeView.vue',
        './src/views/Auth/LoginView.vue',
      ],
    },
  },

  // Enable gzip/brotli hints for Vercel/Netlify deployments
  esbuild: {
    drop: ['console', 'debugger'], // strip all console.log in prod
    legalComments: 'none',
  },
})
