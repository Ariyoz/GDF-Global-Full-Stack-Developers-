<template>
  <Transition name="modal">
    <div v-if="modelValue" class="pin-overlay" @click.self="$emit('cancel')">
      <div class="pin-box">

        <!-- Header -->
        <div class="pin-hdr">
          <div class="pin-icon-wrap">
            <span class="material-symbols-outlined" style="font-size:24px;color:var(--primary)">lock</span>
          </div>
          <h3 class="pin-title">Enter Transaction PIN</h3>
          <p class="pin-sub">{{ subtitle || 'Confirm your identity to proceed' }}</p>
        </div>

        <!-- Dots display -->
        <div class="pin-dots">
          <div v-for="i in 4" :key="i" class="pin-dot" :class="{ filled: pin.length >= i }"></div>
        </div>

        <!-- Error message -->
        <p v-if="error" class="pin-error">
          <span class="material-symbols-outlined" style="font-size:16px">error_outline</span>
          {{ error }}
        </p>

        <!-- Numpad -->
        <div class="pin-numpad">
          <button v-for="n in [1,2,3,4,5,6,7,8,9,'',0,'⌫']" :key="n"
            class="pin-key"
            :class="{ 'pin-key-back': n === '⌫', 'pin-key-empty': n === '' }"
            :disabled="n === '' || loading"
            @click="onKey(n)">
            {{ n }}
          </button>
        </div>

        <!-- Actions -->
        <div class="pin-actions">
          <button class="btn-ghost pin-cancel-btn" @click="$emit('cancel')" :disabled="loading">
            Cancel
          </button>
          <button class="btn-primary pin-confirm-btn"
            :disabled="pin.length < 4 || loading"
            @click="submit">
            <span v-if="loading" class="btn-spinner"></span>
            <span v-else class="material-symbols-outlined" style="font-size:18px">check</span>
            {{ loading ? 'Verifying…' : 'Confirm' }}
          </button>
        </div>

        <!-- Forgot PIN -->
        <button class="pin-forgot" @click="$emit('forgot')">Forgot PIN?</button>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import http from '@/services/http'
import { useUiStore } from '@/store/ui'

const props = defineProps({
  modelValue: Boolean,
  subtitle:   String,
})
const emit = defineEmits(['update:modelValue', 'verified', 'cancel', 'forgot'])

const uiStore = useUiStore()
const pin     = ref('')
const error   = ref('')
const loading = ref(false)

watch(() => props.modelValue, (v) => {
  if (v) { pin.value = ''; error.value = ''; loading.value = false }
})

function onKey(k) {
  if (k === '⌫') {
    pin.value = pin.value.slice(0, -1)
    return
  }
  if (pin.value.length >= 4) return
  pin.value += String(k)
  if (pin.value.length === 4) {
    // Auto-submit when 4 digits entered
    setTimeout(submit, 120)
  }
}

async function submit() {
  if (pin.value.length < 4 || loading.value) return
  loading.value = true
  error.value   = ''
  try {
    const res = await http.post('/wallet/pin/verify', { pin: pin.value })
    emit('verified', res.pin_token)
    emit('update:modelValue', false)
  } catch (e) {
    error.value = e?.response?.data?.detail || 'Incorrect PIN'
    pin.value   = ''
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.pin-overlay {
  position: fixed; inset: 0; z-index: 800;
  background: rgba(0,0,0,.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}
.pin-box {
  background: var(--surface-container-lowest);
  border-radius: 28px;
  padding: 2rem 1.75rem 1.75rem;
  width: 100%; max-width: 340px;
  display: flex; flex-direction: column; align-items: center; gap: 1.25rem;
  box-shadow: 0 32px 80px rgba(0,0,0,.35);
  border: 1px solid var(--outline-variant);
}
.pin-hdr { display: flex; flex-direction: column; align-items: center; gap: .5rem; text-align: center; }
.pin-icon-wrap { width: 56px; height: 56px; border-radius: 16px; background: rgba(99,14,212,.1); display: flex; align-items: center; justify-content: center; }
.pin-title { font-family: var(--font-headline); font-size: 1.15rem; font-weight: 800; color: var(--on-surface); }
.pin-sub   { font-size: .82rem; color: var(--on-surface-variant); }

.pin-dots { display: flex; gap: .875rem; }
.pin-dot  { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--outline-variant); background: transparent; transition: all .15s; }
.pin-dot.filled { background: var(--primary); border-color: var(--primary); transform: scale(1.15); }

.pin-error { display: flex; align-items: center; gap: .35rem; font-size: .82rem; color: #ef4444; font-weight: 600; }

.pin-numpad {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: .625rem; width: 100%;
}
.pin-key {
  height: 60px; border-radius: 14px;
  border: 1.5px solid var(--outline-variant);
  background: var(--surface-container-low);
  font-family: var(--font-headline); font-size: 1.3rem; font-weight: 700;
  color: var(--on-surface); cursor: pointer;
  transition: all .12s;
  display: flex; align-items: center; justify-content: center;
}
.pin-key:hover:not(:disabled) { border-color: var(--primary); background: color-mix(in srgb,var(--primary) 8%,transparent); }
.pin-key:active:not(:disabled) { transform: scale(.94); }
.pin-key-back { background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.2); color: #ef4444; font-size: 1.1rem; }
.pin-key-empty { border: none; background: transparent; cursor: default; }
.pin-key:disabled { opacity: .4; cursor: not-allowed; }

.pin-actions { display: flex; gap: .75rem; width: 100%; }
.pin-cancel-btn  { flex: 1; }
.pin-confirm-btn { flex: 2; display: flex; align-items: center; justify-content: center; gap: .4rem; }

.pin-forgot { font-size: .8rem; color: var(--primary); font-weight: 600; background: none; border: none; cursor: pointer; padding: .25rem; }
.pin-forgot:hover { text-decoration: underline; }

.modal-enter-active, .modal-leave-active { transition: all .25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(.95); }
</style>
