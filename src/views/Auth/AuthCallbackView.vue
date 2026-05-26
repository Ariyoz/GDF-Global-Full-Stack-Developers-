<template>
  <div class="auth-callback">
    <div class="callback-spinner">
      <span class="material-symbols-outlined spinning">progress_activity</span>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const message = ref('Signing you in...')

onMounted(async () => {
  try {
    // Check for tokens in URL params (from backend OAuth redirect)
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      await authStore.handleOAuthCallback({
        access_token: accessToken,
        refresh_token: refreshToken,
        user_id: params.get('user_id'),
        role: params.get('role'),
      })
      router.replace('/dashboard')
      return
    }

    // No tokens — redirect to login
    message.value = 'Redirecting...'
    router.replace('/auth/login')
  } catch (err) {
    console.error('OAuth callback error:', err)
    message.value = 'Login failed. Redirecting...'
    setTimeout(() => router.replace('/auth/login'), 1500)
  }
})
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background);
}

.callback-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--on-surface-variant);
}

.spinning {
  font-size: 2.5rem;
  color: var(--primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
