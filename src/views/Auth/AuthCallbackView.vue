<template>
  <div class="auth-callback">
    <div class="callback-spinner">
      <span class="material-symbols-outlined spinning">progress_activity</span>
      <p>Signing you in...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  // Demo mode — just redirect to dashboard or login
  await new Promise(r => setTimeout(r, 500))

  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  } else {
    router.push('/auth/login')
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
