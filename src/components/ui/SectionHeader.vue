<template>
  <div class="section-header" :class="`section-header--${align}`">
    <div v-if="tag" class="section-tag">{{ tag }}</div>
    <h2 class="text-headline-lg section-title">
      <slot name="title">{{ title }}</slot>
    </h2>
    <p v-if="subtitle || $slots.subtitle" class="text-body-lg section-subtitle">
      <slot name="subtitle">{{ subtitle }}</slot>
    </p>
  </div>
</template>

<script setup>
defineProps({
  tag:      { type: String, default: null },
  title:    { type: String, default: '' },
  subtitle: { type: String, default: null },
  align:    { type: String, default: 'center' },
})
</script>

<style scoped>
.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: var(--space-lg);
}

.section-header--center {
  align-items: center;
  text-align: center;
}

.section-header--left {
  align-items: flex-start;
  text-align: left;
}

/* Section tag — uses design tokens so it adapts to dark mode */
.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  background: var(--surface-container-low);
  border: 1px solid var(--glass-border-primary);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
}

.section-title { max-width: 700px; }
.section-subtitle { max-width: 600px; }
</style>
