<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Glassmorphism enhancement for glass cards */
.glass-card,
.glass-modal {
  background: rgba(var(--surface-rgb, 20, 15, 30), 0.75) !important;
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  border: 1px solid rgba(168, 85, 247, 0.08);
}

[data-theme="dark"] .glass-card,
[data-theme="dark"] .glass-modal {
  background: rgba(20, 15, 35, 0.8) !important;
  backdrop-filter: blur(20px) saturate(1.3);
  -webkit-backdrop-filter: blur(20px) saturate(1.3);
  border: 1px solid rgba(168, 85, 247, 0.12);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

/* Premium glassmorphism for modals */
.modal-overlay .edit-modal,
.modal-overlay .compose-modal,
.modal-overlay .glass-modal {
  background: rgba(20, 15, 35, 0.92) !important;
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(168, 85, 247, 0.15);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(168, 85, 247, 0.1);
}
</style>
