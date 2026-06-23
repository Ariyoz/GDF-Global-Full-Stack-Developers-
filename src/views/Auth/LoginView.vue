<template>
  <div class="auth-card glass-modal">
    <div class="auth-head">
      <h1 class="auth-title">Welcome back</h1>
      <p class="auth-sub">Sign in to your GFD account</p>
    </div>

    <!-- Inline error banner -->
    <Transition name="err-slide">
      <div v-if="loginError" class="login-error-banner">
        <span class="material-symbols-outlined" style="font-size:18px;flex-shrink:0">error</span>
        <span>{{ loginError }}</span>
        <button class="err-close" @click="loginError = ''">
          <span class="material-symbols-outlined" style="font-size:16px">close</span>
        </button>
      </div>
    </Transition>

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
      <button class="social-btn" type="button" @click="loginWithGitHub">
        <span class="material-symbols-outlined" style="font-size:18px;">hub</span>
        GitHub
      </button>
      <button class="social-btn" type="button" @click="loginWithGoogle">
        <span style="font-size:14px;font-weight:700;color:#4285f4;">G</span>
        Google
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUiStore }   from '@/store/ui'
import GfdInput  from '@/components/ui/GfdInput.vue'
import GfdButton from '@/components/ui/GfdButton.vue'

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()
const uiStore   = useUiStore()

const loading    = ref(false)
const loginError = ref('')                        // inline error shown in banner
const form       = reactive({ email: '', password: '' })
const errors     = reactive({ email: '', password: '' })

// Silently pre-warm server when login page loads
onMounted(() => {
  const base = (import.meta.env.VITE_API_BASE_URL || 'https://gfd-backend.onrender.com/api/v1').replace('/api/v1', '')
  fetch(`${base}/health`, { method: 'GET', cache: 'no-cache' }).catch(() => {})
})

function validate() {
  errors.email = errors.password = ''
  loginError.value = ''
  let ok = true
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    ok = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    ok = false
  }
  if (!form.password) {
    errors.password = 'Password is required'
    ok = false
  }
  return ok
}

async function handleLogin() {
  // Always prevent default — no page refresh
  if (!validate()) return

  loading.value = true
  loginError.value = ''

  try {
    const result = await authStore.login(form)

    if (!result) {
      loginError.value = 'Login failed. Please check your credentials.'
      return
    }

    // Success — navigate without adding auth page to history
    const redirect = route.query.redirect
    const dest = (redirect && !redirect.toString().startsWith('/auth'))
      ? redirect.toString()
      : '/dashboard'
    router.replace(dest)

  } catch (err) {
    // Map common error messages to user-friendly text
    const raw = err?.response?.data?.detail || err?.message || ''
    if (err?.response?.status === 401 || raw.toLowerCase().includes('invalid') || raw.toLowerCase().includes('incorrect')) {
      loginError.value = 'Incorrect email or password. Please try again.'
    } else if (err?.response?.status === 403) {
      loginError.value = 'Your account has been suspended. Contact support.'
    } else if (!err?.response) {
      loginError.value = 'Cannot connect to server. Check your internet connection.'
    } else {
      loginError.value = raw || 'Login failed. Please try again.'
    }
    // Clear password field on error
    form.password = ''
  } finally {
    loading.value = false
  }
}

async function loginWithGitHub() {
  try { await authStore.loginWithProvider('github') }
  catch { loginError.value = 'GitHub login failed. Please try again.' }
}

async function loginWithGoogle() {
  try { await authStore.loginWithProvider('google') }
  catch { loginError.value = 'Google login failed. Please try again.' }
}
</script>

<style scoped>
.auth-card {
  padding: 2.5rem;
  width: 100%;
}

.auth-head { text-align: center; margin-bottom: 1.5rem; }

/* ── Inline error banner ── */
.login-error-banner {
  display: flex;
  align-items: center;
  gap: .625rem;
  padding: .75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-lg);
  color: #dc2626;
  font-size: .875rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
  line-height: 1.4;
}
:global([data-theme="dark"]) .login-error-banner {
  background: rgba(220, 38, 38, 0.12);
  border-color: rgba(220, 38, 38, 0.3);
  color: #f87171;
}
.err-close {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: .7;
  padding: 0;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.err-close:hover { opacity: 1; }

/* Error slide animation */
.err-slide-enter-active,
.err-slide-leave-active { transition: all .2s ease; }
.err-slide-enter-from,
.err-slide-leave-to { opacity: 0; transform: translateY(-8px); }

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

.demo-credentials {
  margin-top: 0.5rem;
  text-align: center;
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

.demo-title {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.demo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.demo-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-fast);
}
.demo-btn:hover {
  border-color: var(--primary);
  background: rgba(99,14,212,0.03);
}
.demo-btn--admin:hover {
  border-color: #e65100;
  background: rgba(230,81,0,0.03);
}

.demo-role {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary);
}
.demo-btn--admin .demo-role {
  color: #e65100;
}

.demo-email {
  font-size: 0.72rem;
  color: var(--on-surface-variant);
}

.demo-hint {
  font-size: 0.78rem;
  color: var(--on-surface-variant);
}
.demo-hint strong {
  color: var(--primary);
  font-weight: 600;
}
</style>
