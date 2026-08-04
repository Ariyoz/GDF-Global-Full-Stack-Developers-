<template>
  <div class="auth-shell">

    <!-- Show onboarding if not seen yet — works even when navigating to /auth/login -->

    <!-- Animated background mesh -->
    <div class="auth-mesh">
      <div class="mesh-orb mesh-orb-1" />
      <div class="mesh-orb mesh-orb-2" />
      <div class="mesh-orb mesh-orb-3" />
    </div>

    <!-- Top brand bar -->
    <header class="auth-header">
      <RouterLink to="/" class="brand-mark">
        <img src="@/assets/icons/icon.png" alt="GFD" class="brand-logo" />
        <span class="brand-text">GFD</span>
      </RouterLink>
    </header>

    <!-- Page content -->
    <main class="auth-body">
      <RouterView v-slot="{ Component }">
        <Transition name="slide-up" mode="out-in">
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
/* ── Shell ── */
.auth-shell {
  min-height: 100dvh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* ── Animated background ── */
.auth-mesh { position: fixed; inset: 0; pointer-events: none; z-index: 0; }

.mesh-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 8s ease-in-out infinite;
}
.mesh-orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%);
  top: -200px; right: -100px;
  animation-delay: 0s;
}
.mesh-orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(99,14,212,0.12) 0%, transparent 70%);
  bottom: -100px; left: -150px;
  animation-delay: -3s;
}
.mesh-orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%);
  top: 40%; left: 30%;
  animation-delay: -5s;
}
@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-30px) scale(1.05); }
}

/* ── Header ── */
.auth-header {
  position: relative; z-index: 10;
  padding: calc(1.25rem + env(safe-area-inset-top, 0px)) 1.5rem 0;
}
.brand-mark {
  display: inline-flex; align-items: center; gap: 0.625rem;
  text-decoration: none;
}
.brand-logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: contain;
}
.brand-text {
  font-family: var(--font-headline);
  font-size: 1.1rem; font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.02em;
}

/* ── Body ── */
.auth-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem 1rem calc(2rem + env(safe-area-inset-bottom, 0px));
  position: relative; z-index: 10;
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
}

/* ── Page transition ── */
.slide-up-enter-active, .slide-up-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.slide-up-enter-from { opacity: 0; transform: translateY(16px); }
.slide-up-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>
