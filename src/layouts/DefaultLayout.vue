<template>
  <div class="layout-default">
    <TheNavbar />

    <main class="layout-main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <TheFooter />

    <!-- Mobile Bottom Nav (hidden on desktop) -->
    <nav class="mobile-bottom-nav" aria-label="Mobile navigation">
      <RouterLink
        to="/"
        class="bottom-nav-item"
        :class="{ active: $route.path === '/' }"
        aria-label="Home"
      >
        <span
          class="material-symbols-outlined"
          :style="$route.path === '/' ? 'font-variation-settings:\'FILL\' 1' : ''"
        >home</span>
        <span class="nav-label">Home</span>
      </RouterLink>

      <RouterLink
        to="/explore"
        class="bottom-nav-item"
        :class="{ active: $route.path.startsWith('/explore') }"
        aria-label="Explore"
      >
        <span class="material-symbols-outlined">search</span>
        <span class="nav-label">Explore</span>
      </RouterLink>

      <!-- Floating action button -->
      <RouterLink to="/hire" class="bottom-nav-fab" aria-label="Post a project">
        <div class="fab-btn">
          <span class="material-symbols-outlined">add</span>
        </div>
        <span class="nav-label">Post</span>
      </RouterLink>

      <RouterLink
        to="/jobs"
        class="bottom-nav-item"
        :class="{ active: $route.path.startsWith('/jobs') }"
        aria-label="Jobs"
      >
        <span class="material-symbols-outlined">work</span>
        <span class="nav-label">Jobs</span>
      </RouterLink>

      <RouterLink
        to="/auth/login"
        class="bottom-nav-item"
        aria-label="Profile"
      >
        <span class="material-symbols-outlined">person</span>
        <span class="nav-label">Profile</span>
      </RouterLink>
    </nav>

    <ToastContainer />
  </div>
</template>

<script setup>
import TheNavbar      from '@/components/layout/TheNavbar.vue'
import TheFooter      from '@/components/layout/TheFooter.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
</script>

<style scoped>
.layout-default {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--background);
  transition: background-color 0.3s ease;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}

.layout-main {
  flex: 1;
  padding-top: calc(72px + env(safe-area-inset-top, 0px));
}

/* ── Mobile Bottom Nav ── */
.mobile-bottom-nav {
  /* hidden on desktop */
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 500;
  align-items: center;
  justify-content: space-around;
  /* safe area for notched phones */
  padding: 0.5rem 0.5rem calc(0.75rem + env(safe-area-inset-bottom, 0px));
  background: var(--surface-container-lowest);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--outline-variant);
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.06);
  transition: background-color 0.3s ease;
}

@media (max-width: 767px) {
  .mobile-bottom-nav { display: flex; }
  /* push content above the nav bar */
  .layout-main { padding-bottom: 72px; }
}

/* Nav items */
.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  text-decoration: none;
  color: var(--on-surface-variant);
  transition: color 0.15s ease;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-lg);
  min-width: 48px;
}

.bottom-nav-item .material-symbols-outlined {
  font-size: 22px;
  transition: color 0.15s ease;
}

.bottom-nav-item.active,
.bottom-nav-item:hover {
  color: var(--primary);
}

.nav-label {
  font-family: var(--font-headline);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

/* FAB (floating action button) */
.bottom-nav-fab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-decoration: none;
  color: var(--on-surface-variant);
  /* lift it above the bar */
  margin-top: -1.5rem;
}

.fab-btn {
  width: 50px;
  height: 50px;
  background: var(--primary);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--on-primary);
  box-shadow: 0 4px 16px rgba(99, 14, 212, 0.45);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fab-btn .material-symbols-outlined { font-size: 24px; }

.bottom-nav-fab:hover .fab-btn,
.bottom-nav-fab:active .fab-btn {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(99, 14, 212, 0.55);
}

.bottom-nav-fab .nav-label { color: var(--on-surface-variant); }

/* ── Page transition ── */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
