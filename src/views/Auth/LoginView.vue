<template>
  <div class="auth-card glass-modal">
    <div class="auth-head">
      <h1 class="auth-title">Welcome back</h1>
      <p class="auth-sub">Sign in to your GFD account</p>
    </div>

    <form class="auth-form" @submit.prevent="handleLogin" novalidate>
      <GfdInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        :error="errors.email"
        required
      />
      <div class="password-field">
        <GfdInput
          v-model="form.password"
          label="Password"
          type="password"
          placeholder="••••••••"
          :error="errors.password"
          required
        />
        <RouterLink to="/auth/forgot-password" class="forgot-link">Forgot password?</RouterLink>
      </div>

      <GfdButton type="submit" variant="primary" :loading="loading" full>
        Sign In
      </GfdButton>
    </form>

    <p class="auth-footer">
      Don't have an account?
      <RouterLink to="/auth/register" class="auth-link">Create one →</RouterLink>
    </p>

    <div class="auth-divider">
      <span>or continue with</span>
    </div>

    <div class="social-grid">
      <button class="social-btn" type="button">
        <span class="material-symbols-outlined" style="font-size:18px;">hub</span>
        GitHub
      </button>
      <button class="social-btn" type="button">
        <span style="font-size:14px;font-weight:700;color:#4285f4;">G</span>
        Google
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUiStore }   from '@/store/ui'
import GfdInput  from '@/components/ui/GfdInput.vue'
import GfdButton from '@/components/ui/GfdButton.vue'

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()
const uiStore   = useUiStore()

const loading = ref(false)
const form    = reactive({ email: '', password: '' })
const errors  = reactive({ email: '', password: '' })

function validate() {
  errors.email = errors.password = ''
  let ok = true
  if (!form.email)    { errors.email    = 'Email is required';    ok = false }
  if (!form.password) { errors.password = 'Password is required'; ok = false }
  return ok
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  try {
    await authStore.login(form)
    uiStore.showSuccess('Welcome back!')
    router.push(route.query.redirect || '/dashboard')
  } catch {
    uiStore.showError(authStore.error || 'Login failed. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card {
  padding: 2.5rem;
  width: 100%;
}

.auth-head { text-align: center; margin-bottom: 2rem; }

.auth-title {
  font-family: var(--font-headline);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--on-surface);
  letter-spacing: -0.02em;
}

.auth-sub {
  font-size: 0.9rem;
  color: var(--on-surface-variant);
  margin-top: 0.35rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.password-field { display: flex; flex-direction: column; gap: 0.35rem; }

.forgot-link {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
  text-align: right;
  transition: var(--transition-fast);
}
.forgot-link:hover { text-decoration: underline; }

.auth-footer {
  text-align: center;
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  margin-bottom: 1.5rem;
}

.auth-link {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
}
.auth-link:hover { text-decoration: underline; }

.auth-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--outline-variant);
}
.auth-divider span {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  white-space: nowrap;
}

.social-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--on-surface);
  cursor: pointer;
  transition: var(--transition-fast);
}
.social-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(99,14,212,0.03);
}
</style>
