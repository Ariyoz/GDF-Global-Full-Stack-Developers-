<template>
  <div class="login-wrap">

    <!-- Hero text -->
    <div class="login-hero">
      <h1 class="login-title">Welcome<br>back<span class="dot">.</span></h1>
      <p class="login-sub">Sign in to your GFD account</p>
    </div>

    <!-- Error banner -->
    <Transition name="err-drop">
      <div v-if="loginError" class="error-banner">
        <span class="material-symbols-outlined" style="font-size:16px;flex-shrink:0">error_outline</span>
        {{ loginError }}
        <button class="err-x" @click="loginError = ''">
          <span class="material-symbols-outlined" style="font-size:15px">close</span>
        </button>
      </div>
    </Transition>

    <!-- Form -->
    <form class="login-form" @submit.prevent="handleLogin" novalidate>

      <!-- Email -->
      <div class="field-wrap">
        <label class="field-lbl">Email</label>
        <div class="input-row" :class="{ 'input-err': errors.email, 'input-focus': focusEmail }">
          <span class="material-symbols-outlined inp-ico">mail</span>
          <input
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            class="inp"
            autocomplete="email"
            inputmode="email"
            @focus="focusEmail = true"
            @blur="focusEmail = false"
          />
        </div>
        <p v-if="errors.email" class="field-err">{{ errors.email }}</p>
      </div>

      <!-- Password -->
      <div class="field-wrap">
        <div class="lbl-row">
          <label class="field-lbl">Password</label>
          <RouterLink to="/auth/forgot-password" class="forgot-lnk">Forgot?</RouterLink>
        </div>
        <div class="input-row" :class="{ 'input-err': errors.password, 'input-focus': focusPass }">
          <span class="material-symbols-outlined inp-ico">lock</span>
          <input
            v-model="form.password"
            :type="showPass ? 'text' : 'password'"
            placeholder="••••••••"
            class="inp"
            autocomplete="current-password"
            @focus="focusPass = true"
            @blur="focusPass = false"
          />
          <button type="button" class="eye-btn" @click="showPass = !showPass" tabindex="-1">
            <span class="material-symbols-outlined" style="font-size:18px">
              {{ showPass ? 'visibility_off' : 'visibility' }}
            </span>
          </button>
        </div>
        <p v-if="errors.password" class="field-err">{{ errors.password }}</p>
      </div>

      <!-- Submit -->
      <button type="submit" class="btn-signin" :disabled="loading">
        <span v-if="loading" class="btn-spin" />
        <span v-else>Sign In</span>
      </button>

    </form>

    <!-- Divider -->
    <div class="or-row"><span>or</span></div>

    <!-- Social -->
    <div class="social-row">
      <button class="social-btn" type="button" @click="loginWithGitHub">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/>
        </svg>
        Continue with GitHub
      </button>
      <button class="social-btn" type="button" @click="loginWithGoogle">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
    </div>

    <!-- Sign up link -->
    <p class="signup-nudge">
      No account?
      <RouterLink to="/auth/register" class="signup-lnk">Create one free →</RouterLink>
    </p>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()

const loading    = ref(false)
const loginError = ref('')
const showPass   = ref(false)
const focusEmail = ref(false)
const focusPass  = ref(false)
const form       = reactive({ email: '', password: '' })
const errors     = reactive({ email: '', password: '' })

onMounted(() => {
  const base = (import.meta.env.VITE_API_BASE_URL || 'https://gfd-backend.onrender.com/api/v1').replace('/api/v1', '')
  fetch(`${base}/health`, { cache: 'no-cache' }).catch(() => {})
})

function validate() {
  errors.email = errors.password = ''
  loginError.value = ''
  let ok = true
  if (!form.email.trim()) { errors.email = 'Email is required'; ok = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Enter a valid email'; ok = false }
  if (!form.password) { errors.password = 'Password is required'; ok = false }
  return ok
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  try {
    await authStore.login(form)
    const dest = route.query.redirect && !route.query.redirect.toString().startsWith('/auth')
      ? route.query.redirect.toString() : '/dashboard'
    router.replace(dest)
  } catch (err) {
    const raw = err?.response?.data?.detail || err?.message || ''
    if (err?.response?.status === 401 || raw.toLowerCase().includes('invalid') || raw.toLowerCase().includes('incorrect')) {
      loginError.value = 'Incorrect email or password.'
    } else if (err?.response?.status === 403) {
      loginError.value = 'Account suspended. Contact support.'
    } else if (!err?.response) {
      loginError.value = 'No connection. Check your internet.'
    } else {
      loginError.value = raw || 'Login failed. Try again.'
    }
    form.password = ''
  } finally {
    loading.value = false
  }
}

async function loginWithGitHub() {
  try { await authStore.loginWithProvider('github') }
  catch { loginError.value = 'GitHub login failed.' }
}
async function loginWithGoogle() {
  try { await authStore.loginWithProvider('google') }
  catch { loginError.value = 'Google login failed.' }
}
</script>

<style scoped>
.login-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

/* Hero */
.login-hero { margin-bottom: .25rem; }
.login-title {
  font-family: var(--font-headline);
  font-size: clamp(2.4rem, 8vw, 3.2rem);
  font-weight: 900;
  line-height: 1.05;
  color: var(--on-surface);
  letter-spacing: -0.03em;
}
.dot { color: var(--primary); }
.login-sub { font-size: .95rem; color: var(--on-surface-variant); margin-top: .5rem; }

/* Error */
.error-banner {
  display: flex; align-items: center; gap: .5rem;
  padding: .75rem 1rem;
  background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.25);
  border-radius: 12px; color: #ef4444; font-size: .85rem; font-weight: 500;
}
.err-x { margin-left:auto; background:none; border:none; cursor:pointer; color:inherit; display:flex; align-items:center; padding:0; opacity:.7; }
.err-x:hover { opacity:1; }
.err-drop-enter-active, .err-drop-leave-active { transition: all .2s ease; }
.err-drop-enter-from, .err-drop-leave-to { opacity:0; transform:translateY(-8px); }

/* Form */
.login-form { display:flex; flex-direction:column; gap:1rem; }

.field-wrap { display:flex; flex-direction:column; gap:.375rem; }
.lbl-row { display:flex; align-items:center; justify-content:space-between; }
.field-lbl { font-size:.8rem; font-weight:600; color:var(--on-surface-variant); letter-spacing:.01em; }
.field-err { font-size:.75rem; color:#ef4444; }
.forgot-lnk { font-size:.8rem; font-weight:600; color:var(--primary); text-decoration:none; }

.input-row {
  display: flex; align-items: center; gap: .5rem;
  padding: 0 1rem;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  border-radius: 14px;
  height: 52px;
  transition: border-color .15s, box-shadow .15s;
}
.input-row.input-focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(168,85,247,.12); }
.input-row.input-err   { border-color: #ef4444; }

.inp-ico { font-size: 18px; color: var(--on-surface-variant); flex-shrink: 0; }
.inp {
  flex: 1; border: none; background: transparent; outline: none;
  font-size: .95rem; color: var(--on-surface); font-family: var(--font-body);
}
.inp::placeholder { color: var(--outline); }
.eye-btn { background:none; border:none; cursor:pointer; color:var(--on-surface-variant); display:flex; align-items:center; padding:0; }
.eye-btn:hover { color: var(--primary); }

/* Submit */
.btn-signin {
  width: 100%; height: 52px; border-radius: 14px;
  background: var(--primary); color: #fff; border: none;
  font-family: var(--font-headline); font-size: 1rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  letter-spacing: .01em;
  box-shadow: 0 4px 20px rgba(168,85,247,.35);
  transition: opacity .15s, transform .1s;
  margin-top: .25rem;
}
.btn-signin:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
.btn-signin:active:not(:disabled) { transform: translateY(0); }
.btn-signin:disabled { opacity: .6; cursor: not-allowed; }
.btn-spin {
  width: 20px; height: 20px; border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,.3); border-top-color: #fff;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Or divider */
.or-row {
  display: flex; align-items: center; gap: .875rem;
  color: var(--on-surface-variant); font-size: .8rem;
}
.or-row::before, .or-row::after { content:''; flex:1; height:1px; background:var(--outline-variant); }

/* Social */
.social-row { display: flex; flex-direction: column; gap: .625rem; }
.social-btn {
  width: 100%; height: 50px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; gap: .625rem;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .9rem; font-weight: 600;
  color: var(--on-surface); cursor: pointer;
  transition: border-color .15s, background .15s;
}
.social-btn:hover { border-color: var(--primary); background: rgba(168,85,247,.05); }

/* Sign up nudge */
.signup-nudge {
  text-align: center; font-size: .875rem; color: var(--on-surface-variant);
  padding-bottom: .5rem;
}
.signup-lnk {
  font-weight: 700; color: var(--primary); text-decoration: none;
}
.signup-lnk:hover { text-decoration: underline; }
</style>
