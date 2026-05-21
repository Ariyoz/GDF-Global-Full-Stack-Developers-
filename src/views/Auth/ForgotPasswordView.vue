<template>
  <div class="auth-card glass-modal">
    <div class="auth-card-header">
      <h1 class="auth-title">Reset Password</h1>
      <p class="auth-subtitle">Enter your email and we'll send a reset link</p>
    </div>

    <div v-if="!sent">
      <form class="auth-form" @submit.prevent="handleSubmit">
        <GfdInput v-model="email" label="Email" type="email" placeholder="you@example.com" :error="error" required />
        <GfdButton type="submit" variant="primary" :loading="loading" full>
          Send Reset Link
        </GfdButton>
      </form>
    </div>

    <div v-else class="sent-state">
      <div class="sent-icon">✉️</div>
      <h3 class="sent-title">Check your inbox</h3>
      <p class="sent-desc">We sent a password reset link to <strong>{{ email }}</strong></p>
    </div>

    <p class="auth-footer-text" style="margin-top:1.5rem;">
      <RouterLink to="/auth/login" class="auth-link">← Back to Sign In</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GfdInput  from '@/components/ui/GfdInput.vue'
import GfdButton from '@/components/ui/GfdButton.vue'

const email   = ref('')
const error   = ref('')
const loading = ref(false)
const sent    = ref(false)

async function handleSubmit() {
  if (!email.value) { error.value = 'Email is required'; return }
  loading.value = true
  await new Promise(r => setTimeout(r, 1000)) // simulate API
  sent.value    = true
  loading.value = false
}
</script>

<style scoped>
.auth-card { padding: 2.5rem; width: 100%; }
.auth-card-header { text-align: center; margin-bottom: 2rem; }
.auth-title { font-size: 1.75rem; font-weight: 800; color: var(--gfd-white); margin-bottom: 0.4rem; }
.auth-subtitle { font-size: 0.9rem; color: var(--gfd-gray-600); }
.auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
.auth-link { font-size: 0.85rem; color: var(--gfd-green); text-decoration: none; font-weight: 600; }
.auth-footer-text { text-align: center; font-size: 0.875rem; color: var(--gfd-gray-600); }

.sent-state { text-align: center; padding: 1rem 0; }
.sent-icon  { font-size: 3rem; margin-bottom: 1rem; }
.sent-title { font-size: 1.2rem; font-weight: 700; color: var(--gfd-white); margin-bottom: 0.5rem; }
.sent-desc  { font-size: 0.9rem; color: var(--gfd-gray-600); line-height: 1.6; }
</style>
