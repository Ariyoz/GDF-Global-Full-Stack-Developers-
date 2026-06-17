<template>
  <div class="auth-layout">
    <!-- Background -->
    <div class="auth-bg">
      <div class="glow-orb glow-orb-primary" style="width:500px;height:500px;top:-150px;right:-150px;opacity:0.5;" />
      <div class="glow-orb glow-orb-primary" style="width:300px;height:300px;bottom:-100px;left:-100px;opacity:0.25;" />
    </div>

    <!-- Brand -->
    <RouterLink to="/" class="auth-brand">
      <img src="@/assets/logo.png" alt="GFD" class="auth-brand-logo-img" />
      <span class="auth-brand-name">Global Full-Stack Developers</span>
    </RouterLink>

    <!-- Content -->
    <main class="auth-main">
      <RouterView v-slot="{ Component }">
        <Transition name="auth-page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <ToastContainer />
  </div>
</template>

<script setup>
import ToastContainer from '@/components/ui/ToastContainer.vue'
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: calc(2rem + env(safe-area-inset-top, 0px)) 1.5rem calc(2rem + env(safe-area-inset-bottom, 0px));
  transition: background-color 0.3s ease;
}

.auth-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.auth-brand {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  z-index: 10;
}

.auth-brand-logo-img {
  height: 28px;
  width: auto;
  display: block;
  object-fit: contain;
}

.auth-brand-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  display: none;
}

@media (min-width: 640px) {
  .auth-brand-name { display: block; }
}

.auth-main {
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 10;
}

.auth-page-enter-active,
.auth-page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.auth-page-enter-from { opacity: 0; transform: scale(0.98); }
.auth-page-leave-to   { opacity: 0; transform: scale(1.01); }
</style>
