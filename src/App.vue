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
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
}

[data-theme="dark"] .glass-card,
[data-theme="dark"] .glass-modal {
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Modal styling */
.modal-overlay .edit-modal,
.modal-overlay .compose-modal,
.modal-overlay .glass-modal {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
}

[data-theme="dark"] .modal-overlay .edit-modal,
[data-theme="dark"] .modal-overlay .compose-modal,
[data-theme="dark"] .modal-overlay .glass-modal {
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}
</style>
