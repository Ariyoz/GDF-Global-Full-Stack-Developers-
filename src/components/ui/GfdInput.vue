<template>
  <div class="gfd-field">
    <label v-if="label" :for="inputId" class="gfd-label">
      {{ label }}
      <span v-if="required" class="gfd-label-required" aria-hidden="true">*</span>
    </label>
    <div class="gfd-input-wrap" :class="{ 'has-error': error, 'has-prefix': prefix }">
      <span v-if="prefix" class="gfd-input-prefix">{{ prefix }}</span>
      <component
        :is="type === 'textarea' ? 'textarea' : 'input'"
        :id="inputId"
        class="gfd-input"
        :type="type !== 'textarea' ? type : undefined"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :rows="rows"
        v-bind="$attrs"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <p v-if="error" class="gfd-field-error" role="alert">{{ error }}</p>
    <p v-else-if="hint" class="gfd-field-hint">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue:  { type: [String, Number], default: '' },
  label:       { type: String, default: null },
  type:        { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error:       { type: String, default: null },
  hint:        { type: String, default: null },
  prefix:      { type: String, default: null },
  disabled:    { type: Boolean, default: false },
  required:    { type: Boolean, default: false },
  rows:        { type: Number, default: 4 },
})

defineEmits(['update:modelValue'])

const inputId = computed(() => `gfd-input-${Math.random().toString(36).slice(2, 7)}`)
</script>

<style scoped>
.gfd-field { display: flex; flex-direction: column; gap: 0.35rem; }

.gfd-label {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface);
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.gfd-label-required { color: var(--error); }

.gfd-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.gfd-input-wrap.has-error .gfd-input {
  border-color: var(--error);
}

.gfd-input-prefix {
  position: absolute;
  left: 0.875rem;
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  pointer-events: none;
  white-space: nowrap;
}

.gfd-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  color: var(--on-surface);
  font-family: var(--font-body);
  font-size: 1rem;
  transition: var(--transition-base);
  resize: vertical;
}

.has-prefix .gfd-input { padding-left: 2.5rem; }

.gfd-input::placeholder { color: var(--outline); }

.gfd-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(168,85,247,0.12);
}

.gfd-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--surface-container);
}

.gfd-field-error { font-size: 0.8rem; color: var(--error); }
.gfd-field-hint  { font-size: 0.8rem; color: var(--on-surface-variant); }
</style>
