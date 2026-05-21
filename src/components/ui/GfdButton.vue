<template>
  <component
    :is="tag"
    class="gfd-btn"
    :class="[`gfd-btn--${variant}`, `gfd-btn--${size}`, { 'gfd-btn--loading': loading, 'gfd-btn--full': full }]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn-spinner" aria-hidden="true" />
    <span v-if="icon && !loading" class="material-symbols-outlined btn-icon">{{ icon }}</span>
    <span class="btn-label"><slot /></span>
    <span v-if="iconRight && !loading" class="material-symbols-outlined btn-icon-right">{{ iconRight }}</span>
  </component>
</template>

<script setup>
defineProps({
  variant:   { type: String, default: 'primary' },
  size:      { type: String, default: 'md' },
  tag:       { type: String, default: 'button' },
  loading:   { type: Boolean, default: false },
  disabled:  { type: Boolean, default: false },
  full:      { type: Boolean, default: false },
  icon:      { type: String, default: null },
  iconRight: { type: String, default: null },
})
</script>

<style scoped>
.gfd-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-family: var(--font-headline);
  font-weight: 500;
  letter-spacing: 0.01em;
  border: none;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: var(--transition-spring);
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
}

.gfd-btn:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
.gfd-btn--full    { width: 100%; }

/* Sizes */
.gfd-btn--sm { padding: 0.4rem 1rem; font-size: 0.8rem; }
.gfd-btn--md { padding: 0.625rem 1.5rem; font-size: 0.875rem; }
.gfd-btn--lg { padding: 0.75rem 2rem; font-size: 1rem; }

/* Variants */
.gfd-btn--primary {
  background: var(--primary);
  color: var(--on-primary);
  box-shadow: 0 4px 20px rgba(99,14,212,0.2);
}
.gfd-btn--primary:hover:not(:disabled) {
  background: var(--primary-container);
  transform: translateY(-1px);
  box-shadow: 0 8px 32px rgba(99,14,212,0.3);
}
.gfd-btn--primary:active:not(:disabled) { transform: scale(0.97); }

.gfd-btn--outline {
  background: transparent;
  color: var(--on-surface);
  border: 1px solid var(--outline-variant);
}
.gfd-btn--outline:hover:not(:disabled) {
  background: var(--surface-container-low);
  border-color: var(--outline);
  color: var(--on-surface);
}

.gfd-btn--ghost {
  background: transparent;
  color: var(--on-surface-variant);
}
.gfd-btn--ghost:hover:not(:disabled) {
  color: var(--primary);
  background: rgba(99,14,212,0.05);
}

.gfd-btn--danger {
  background: rgba(186,26,26,0.1);
  color: var(--error);
  border: 1px solid rgba(186,26,26,0.2);
}
.gfd-btn--danger:hover:not(:disabled) {
  background: rgba(186,26,26,0.18);
}

/* Icons */
.btn-icon, .btn-icon-right { font-size: 18px; }

/* Spinner */
.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spinSlow 0.7s linear infinite;
  flex-shrink: 0;
}

.gfd-btn--loading { pointer-events: none; }
</style>
