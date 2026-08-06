<template>
  <div class="admin-layout">
    <!-- Mobile Header -->
    <header class="admin-mobile-header">
      <button class="mobile-icon-btn" @click="sidebarOpen = true" aria-label="Open menu">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <div class="mobile-logo">
        <div class="mobile-logo-mark">
          <span class="material-symbols-outlined">shield</span>
        </div>
        <div class="mobile-logo-text-wrap">
          <span class="mobile-logo-text">GFD</span>
          <span class="mobile-logo-badge">Admin</span>
        </div>
      </div>
      <button class="mobile-icon-btn" @click="toggle" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <span class="material-symbols-outlined">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
      </button>
    </header>

    <!-- Overlay -->
    <Transition name="overlay-fade">
      <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false" />
    </Transition>

    <!-- Sidebar -->
    <AdminSidebar :class="{ open: sidebarOpen }" @navigate="sidebarOpen = false" />

    <!-- Main Content -->
    <main class="admin-main">
      <div class="admin-main-inner">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import AdminSidebar from '@/components/layout/AdminSidebar.vue'

const { isDark, toggle } = useTheme()
const sidebarOpen = ref(false)
const route = useRoute()

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════
   Admin Layout — Premium Redesign
   ═══════════════════════════════════════════════ */

.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--background);
  position: relative;
}

/* ── Mobile Header ── */
.admin-mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 300;
  height: calc(56px + env(safe-area-inset-top, 0px));
  padding: env(safe-area-inset-top, 0px) 1rem 0;
  background: rgba(var(--surface-container-lowest-rgb, 255,255,255), 0.85);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-bottom: 1px solid var(--outline-variant);
}

@media (max-width: 767px) { .admin-mobile-header { display: flex; } }

.mobile-icon-btn {
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  background: none; border: none; border-radius: var(--radius-lg);
  color: var(--on-surface-variant); cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.mobile-icon-btn:hover {
  background: var(--surface-container);
  color: var(--on-surface);
}
.mobile-icon-btn .material-symbols-outlined { font-size: 22px; }

.mobile-logo {
  display: flex; align-items: center; gap: 0.5rem;
}

.mobile-logo-mark {
  width: 30px; height: 30px;
  background: var(--gradient-primary);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(99,14,212,0.3);
}
.mobile-logo-mark .material-symbols-outlined {
  font-size: 17px;
  color: white;
  font-variation-settings: 'FILL' 1;
}

.mobile-logo-text-wrap { display: flex; align-items: center; gap: 0.35rem; }

.mobile-logo-text {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.02em;
}

.mobile-logo-badge {
  font-family: var(--font-headline);
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--primary);
  background: rgba(99,14,212,0.1);
  border: 1px solid rgba(99,14,212,0.2);
  padding: 0.1rem 0.35rem;
  border-radius: var(--radius-full);
}

[data-theme="dark"] .mobile-logo-badge {
  background: rgba(168,85,247,0.12);
  border-color: rgba(168,85,247,0.25);
}

/* ── Overlay ── */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 399;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

@media (min-width: 768px) { .sidebar-overlay { display: none; } }

.overlay-fade-enter-active, .overlay-fade-leave-active { transition: opacity 0.25s ease; }
.overlay-fade-enter-from, .overlay-fade-leave-to { opacity: 0; }

/* ── Main Content ── */
.admin-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: calc(56px + env(safe-area-inset-top, 0px));
  background: var(--background);
  /* subtle dot pattern */
  background-image: radial-gradient(circle, var(--outline-variant) 1px, transparent 1px);
  background-size: 28px 28px;
  background-attachment: local;
}

@media (min-width: 768px) {
  .admin-main {
    padding-top: 0;
    max-width: calc(100vw - 240px);
  }
}

.admin-main-inner {
  min-height: 100%;
  /* overlay a gradient over the dot bg */
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--background) 85%, transparent) 0%,
    var(--background) 100%
  );
}
</style>
