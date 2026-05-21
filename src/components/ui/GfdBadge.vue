<template>
  <span class="gfd-badge" :class="`gfd-badge--${variant}`">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default' },
})
</script>

<style scoped>
.gfd-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.625rem;
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: var(--radius-full);
}

.gfd-badge--default {
  background: var(--surface-container);
  color: var(--on-surface-variant);
}

.gfd-badge--primary {
  background: rgba(99,14,212,0.1);
  color: var(--primary);
}

.gfd-badge--success {
  background: rgba(22,163,74,0.1);
  color: #16a34a;
}

.gfd-badge--error {
  background: rgba(186,26,26,0.1);
  color: var(--error);
}

.gfd-badge--warning {
  background: rgba(161,81,0,0.1);
  color: var(--tertiary);
}

.gfd-badge--dark {
  background: var(--surface-container);
  color: var(--on-surface-variant);
}

.gfd-badge--green {
  background: rgba(22,163,74,0.1);
  color: #16a34a;
}
</style>
