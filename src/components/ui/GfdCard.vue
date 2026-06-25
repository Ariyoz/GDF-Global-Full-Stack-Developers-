<template>
  <div
    class="gfd-card"
    :class="[`gfd-card--${variant}`, { 'gfd-card--hoverable': hoverable }]"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  variant:   { type: String, default: 'default' },
  hoverable: { type: Boolean, default: false },
})
</script>

<style scoped>
.gfd-card {
  border-radius: var(--radius-xl);
  padding: var(--space-md);
  transition: var(--transition-slow);
}

.gfd-card--default {
  background: var(--glass-bg);
  -webkit-backdrop-filter: var(--glass-blur);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm);
}

.gfd-card--surface {
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
}

.gfd-card--elevated {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  box-shadow: var(--shadow-md);
}

.gfd-card--primary {
  background: rgba(99,14,212,0.05);
  border: 1px solid rgba(99,14,212,0.15);
}

.gfd-card--hoverable:hover {
  transform: translateY(-4px);
  border-color: rgba(124,58,237,0.3);
  box-shadow: var(--shadow-md);
}
</style>
