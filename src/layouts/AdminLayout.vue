<template>
  <div class="admin-layout">
    <!-- Mobile Header -->
    <header class="admin-mobile-header">
      <button class="mobile-menu-btn" @click="sidebarOpen = true">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <div class="mobile-logo">
        <span class="material-symbols-outlined" style="color:var(--primary);font-size:20px">shield</span>
        <span class="mobile-logo-text">GFD Admin</span>
      </div>
      <button class="mobile-menu-btn" @click="toggle">
        <span class="material-symbols-outlined">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
      </button>
    </header>

    <!-- Overlay -->
    <Transition name="fade">
      <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false" />
    </Transition>

    <!-- Sidebar -->
    <AdminSidebar :class="{ open: sidebarOpen }" @navigate="sidebarOpen = false" />

    <!-- Main Content -->
    <main class="admin-main">
      <router-view />
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
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--background);
}

/* Mobile Header */
.admin-mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 300;
  height: calc(56px + env(safe-area-inset-top, 0px));
  padding: env(safe-area-inset-top, 0px) 1rem 0;
  background: var(--surface-container-lowest);
  border-bottom: 1px solid var(--outline-variant);
}

@media (min-width: 768px) { .admin-mobile-header { display: none; } }

.mobile-menu-btn {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  background: none; border: none; border-radius: var(--radius-lg);
  color: var(--on-surface); cursor: pointer;
  transition: background 0.15s ease;
}
.mobile-menu-btn:hover { background: var(--surface-container); }

.mobile-logo {
  display: flex; align-items: center; gap: 0.4rem;
}

.mobile-logo-text {
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--on-surface);
}

/* Overlay */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 399;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(2px);
}

@media (min-width: 768px) { .sidebar-overlay { display: none; } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Main */
.admin-main {
  flex: 1;
  min-width: 0;           /* prevent flex child overflow */
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: calc(56px + env(safe-area-inset-top, 0px));
  /* mobile: full width below the fixed top header */
  width: 100%;
}

@media (min-width: 768px) {
  .admin-main {
    padding-top: 0;
    /* desktop: sidebar is sticky inside the flex row, main takes remaining space */
    max-width: calc(100vw - 260px);
  }
}
</style>
