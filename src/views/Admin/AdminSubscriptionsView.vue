<template>
  <div class="admin-subs-view">
    <div class="page-header">
      <div>
        <h1 class="text-headline-lg">Subscriptions</h1>
        <p class="text-body-md" style="margin-top:0.25rem">Manage user subscriptions and verified badges.</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="subs-stats">
      <div class="stat-card glass-card-static">
        <span class="material-symbols-outlined stat-icon" style="color:var(--primary)">verified</span>
        <div>
          <p class="stat-value">{{ subscriptions.length }}</p>
          <p class="stat-label">Active Subscribers</p>
        </div>
      </div>
    </div>

    <!-- Subscriptions List -->
    <div class="subs-list">
      <div v-for="sub in subscriptions" :key="sub.id" class="sub-card glass-card-static">
        <div class="sub-user">
          <div class="sub-avatar">
            <img v-if="sub.user_avatar" :src="sub.user_avatar" class="sub-avatar-img" />
            <span v-else>{{ (sub.user_name || 'U')[0] }}</span>
          </div>
          <div class="sub-user-info">
            <p class="sub-user-name">
              {{ sub.user_name }}
              <span v-if="sub.is_verified" class="material-symbols-outlined" style="font-size:14px;color:var(--primary);font-variation-settings:'FILL' 1;">verified</span>
            </p>
            <p class="sub-user-email">{{ sub.user_email }}</p>
          </div>
        </div>
        <div class="sub-details">
          <span class="sub-plan-badge">{{ sub.plan }}</span>
          <span class="sub-cycle">{{ sub.billing_cycle }}</span>
          <span class="sub-date">Since {{ formatDate(sub.started_at) }}</span>
        </div>
        <div class="sub-actions">
          <button v-if="!sub.is_verified" class="btn-approve" @click="approveSub(sub)">
            <span class="material-symbols-outlined" style="font-size:16px;">check</span>
            Approve
          </button>
          <button class="btn-revoke" @click="revokeSub(sub)">
            <span class="material-symbols-outlined" style="font-size:16px;">close</span>
            Revoke
          </button>
        </div>
      </div>

      <div v-if="subscriptions.length === 0" class="subs-empty glass-card-static">
        <span class="material-symbols-outlined" style="font-size:3rem;color:var(--outline)">credit_card_off</span>
        <h3>No Active Subscriptions</h3>
        <p>Subscriptions will appear here when users subscribe.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/services/http'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()
const subscriptions = ref([])

async function fetchSubscriptions() {
  try {
    const data = await http.get('/admin/subscriptions?status_filter=active')
    subscriptions.value = data.subscriptions || []
  } catch (err) {
    console.error('Failed to fetch subscriptions:', err)
  }
}

async function approveSub(sub) {
  try {
    await http.patch(`/admin/subscriptions/${sub.id}/approve`)
    sub.is_verified = true
    uiStore.showSuccess(`${sub.user_name} verified!`)
  } catch {
    uiStore.showError('Failed to approve')
  }
}

async function revokeSub(sub) {
  if (!confirm(`Revoke subscription for ${sub.user_name}?`)) return
  try {
    await http.patch(`/admin/subscriptions/${sub.id}/revoke`)
    subscriptions.value = subscriptions.value.filter(s => s.id !== sub.id)
    uiStore.showSuccess('Subscription revoked')
  } catch {
    uiStore.showError('Failed to revoke')
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(fetchSubscriptions)
</script>

<style scoped>
.admin-subs-view { display: flex; flex-direction: column; gap: 1.5rem; }

.subs-stats { display: flex; gap: 1rem; flex-wrap: wrap; }
.stat-card { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; border-radius: var(--radius-xl); }
.stat-icon { font-size: 28px; }
.stat-value { font-family: var(--font-headline); font-size: 1.5rem; font-weight: 700; color: var(--on-surface); }
.stat-label { font-size: 0.78rem; color: var(--on-surface-variant); }

.subs-list { display: flex; flex-direction: column; gap: 0.75rem; }

.sub-card { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border-radius: var(--radius-xl); flex-wrap: wrap; }

.sub-user { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 180px; }
.sub-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--primary-fixed); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; font-family: var(--font-headline); font-weight: 700; color: var(--primary); }
.sub-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.sub-user-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; color: var(--on-surface); display: flex; align-items: center; gap: 0.25rem; }
.sub-user-email { font-size: 0.75rem; color: var(--on-surface-variant); }

.sub-details { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.sub-plan-badge { padding: 0.2rem 0.6rem; background: rgba(168,85,247,0.1); border-radius: var(--radius-full); font-size: 0.72rem; font-weight: 600; color: var(--primary); text-transform: capitalize; }
.sub-cycle { font-size: 0.75rem; color: var(--on-surface-variant); text-transform: capitalize; }
.sub-date { font-size: 0.72rem; color: var(--outline); }

.sub-actions { display: flex; gap: 0.5rem; margin-left: auto; }
.btn-approve { display: flex; align-items: center; gap: 0.25rem; padding: 0.4rem 0.75rem; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: var(--radius-lg); color: #16a34a; font-size: 0.78rem; font-weight: 600; cursor: pointer; }
.btn-approve:hover { background: rgba(34,197,94,0.2); }
.btn-revoke { display: flex; align-items: center; gap: 0.25rem; padding: 0.4rem 0.75rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: var(--radius-lg); color: #ef4444; font-size: 0.78rem; font-weight: 600; cursor: pointer; }
.btn-revoke:hover { background: rgba(239,68,68,0.2); }

.subs-empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 3rem 2rem; gap: 0.5rem; border-radius: var(--radius-xl); }
.subs-empty h3 { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }
.subs-empty p { font-size: 0.85rem; color: var(--on-surface-variant); }
</style>
