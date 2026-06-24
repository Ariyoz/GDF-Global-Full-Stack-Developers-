<template>
  <div class="admin-subs-view">
    <div class="page-header">
      <div>
        <h1 class="pg-title">Subscriptions</h1>
        <p class="pg-sub">Approve payments and manage verified badges.</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="subs-tabs">
      <button class="subs-tab" :class="{ active: activeTab === 'pending' }"
        @click="activeTab = 'pending'; fetchSubscriptions()">
        Pending Approval
        <span v-if="pendingCount" class="tab-badge">{{ pendingCount }}</span>
      </button>
      <button class="subs-tab" :class="{ active: activeTab === 'active' }"
        @click="activeTab = 'active'; fetchSubscriptions()">
        Active
      </button>
      <button class="subs-tab" :class="{ active: activeTab === 'cancelled' }"
        @click="activeTab = 'cancelled'; fetchSubscriptions()">
        Cancelled
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="subs-list">
      <div v-for="i in 3" :key="i" class="sub-skel shimmer"></div>
    </div>

    <!-- Subscriptions List -->
    <div v-else class="subs-list">
      <div v-for="sub in subscriptions" :key="sub.id" class="sub-card">

        <!-- Row 1: Avatar + User info -->
        <div class="sub-row sub-user">
          <div class="sub-avatar">
            <img v-if="sub.user_avatar" :src="sub.user_avatar" class="sub-avatar-img" />
            <span v-else class="sub-avatar-ini">{{ (sub.user_name || 'U')[0].toUpperCase() }}</span>
          </div>
          <div class="sub-user-info">
            <p class="sub-user-name">
              {{ sub.user_name || 'Unknown User' }}
              <span v-if="sub.is_verified" class="material-symbols-outlined verified-ico">verified</span>
            </p>
            <p class="sub-user-handle">@{{ sub.username || '—' }}</p>
            <p class="sub-user-email">{{ sub.user_email || '—' }}</p>
          </div>
          <!-- Status pill top-right -->
          <span class="sub-status-pill" :class="sub.status">{{ sub.status }}</span>
        </div>

        <!-- Row 2: Plan details -->
        <div class="sub-row sub-details">
          <span class="sub-plan-badge">{{ sub.plan }}</span>
          <span class="sub-cycle">{{ sub.billing_cycle }}</span>
          <span class="sub-date">
            <span class="material-symbols-outlined" style="font-size:13px;vertical-align:middle">calendar_today</span>
            {{ formatDate(sub.created_at) }}
          </span>
          <span v-if="sub.expires_at && sub.expires_at !== '—'" class="sub-expires">
            <span class="material-symbols-outlined" style="font-size:13px;vertical-align:middle">schedule</span>
            Expires {{ formatDate(sub.expires_at) }}
          </span>
        </div>

        <!-- Row 3: Actions -->
        <div class="sub-actions">
          <template v-if="activeTab === 'pending'">
            <button class="btn-approve" @click="approveSub(sub)">
              <span class="material-symbols-outlined" style="font-size:16px">check_circle</span>
              Approve
            </button>
            <button class="btn-revoke" @click="rejectSub(sub)">
              <span class="material-symbols-outlined" style="font-size:16px">cancel</span>
              Reject
            </button>
          </template>
          <button v-else-if="activeTab === 'active'" class="btn-revoke" @click="revokeSub(sub)">
            <span class="material-symbols-outlined" style="font-size:16px">remove_circle</span>
            Revoke
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!loading && subscriptions.length === 0" class="subs-empty">
        <span class="material-symbols-outlined empty-ico">
          {{ activeTab === 'pending' ? 'hourglass_empty' : 'credit_card_off' }}
        </span>
        <h3 class="empty-title">
          {{ activeTab === 'pending' ? 'No Pending Payments' : 'No Subscriptions' }}
        </h3>
        <p class="empty-sub">
          {{ activeTab === 'pending' ? 'New payment confirmations will appear here.' : 'No subscriptions in this category.' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/services/http'
import { useUiStore } from '@/store/ui'

const uiStore       = useUiStore()
const subscriptions = ref([])
const activeTab     = ref('pending')
const pendingCount  = ref(0)
const loading       = ref(false)

async function fetchSubscriptions() {
  loading.value = true
  try {
    const data = await http.get(`/admin/subscriptions?status_filter=${activeTab.value}`)
    subscriptions.value = data.subscriptions || []
    if (activeTab.value === 'pending') pendingCount.value = subscriptions.value.length
  } catch (err) {
    console.error('Failed to fetch subscriptions:', err)
    subscriptions.value = []
  } finally {
    loading.value = false
  }
}

async function approveSub(sub) {
  try {
    await http.patch(`/admin/subscriptions/${sub.id}/approve`)
    subscriptions.value = subscriptions.value.filter(s => s.id !== sub.id)
    pendingCount.value = Math.max(pendingCount.value - 1, 0)
    uiStore.showSuccess(`${sub.user_name} approved — verified badge granted`)
  } catch {
    uiStore.showError('Failed to approve')
  }
}

async function rejectSub(sub) {
  try {
    await http.patch(`/admin/subscriptions/${sub.id}/revoke`)
    subscriptions.value = subscriptions.value.filter(s => s.id !== sub.id)
    pendingCount.value = Math.max(pendingCount.value - 1, 0)
    uiStore.showSuccess('Subscription rejected')
  } catch {
    uiStore.showError('Failed to reject')
  }
}

async function revokeSub(sub) {
  if (!confirm(`Revoke subscription for ${sub.user_name}? This removes their verified badge.`)) return
  try {
    await http.patch(`/admin/subscriptions/${sub.id}/revoke`)
    subscriptions.value = subscriptions.value.filter(s => s.id !== sub.id)
    uiStore.showSuccess('Subscription revoked, badge removed')
  } catch {
    uiStore.showError('Failed to revoke')
  }
}

function formatDate(dateStr) {
  if (!dateStr || dateStr === '—') return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return '—' }
}

onMounted(fetchSubscriptions)
</script>

<style scoped>
.admin-subs-view { display: flex; flex-direction: column; gap: 1.25rem; }

.pg-title { font-family: var(--font-headline); font-size: 1.5rem; font-weight: 800; color: var(--on-surface); }
.pg-sub   { font-size: .85rem; color: var(--on-surface-variant); margin-top: .25rem; }

/* ── Tabs ── */
.subs-tabs {
  display: flex; gap: 0; overflow-x: auto; scrollbar-width: none;
  border-bottom: 1px solid var(--outline-variant);
}
.subs-tabs::-webkit-scrollbar { display: none; }
.subs-tab {
  display: flex; align-items: center; gap: .4rem;
  padding: .625rem 1.125rem;
  background: none; border: none; border-bottom: 2.5px solid transparent;
  font-family: var(--font-headline); font-size: .875rem; font-weight: 500;
  color: var(--on-surface-variant); cursor: pointer; white-space: nowrap;
  margin-bottom: -1px; transition: color .15s;
}
.subs-tab:hover { color: var(--primary); }
.subs-tab.active { color: var(--primary); border-bottom-color: var(--primary); }
.tab-badge {
  min-width: 18px; height: 18px; border-radius: 9px;
  background: #ef4444; color: #fff;
  font-size: .6rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center; padding: 0 4px;
}

/* ── List ── */
.subs-list { display: flex; flex-direction: column; gap: .75rem; }

/* Skeleton */
.sub-skel { height: 110px; border-radius: 14px; }
.shimmer {
  background: linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ── Card ── */
.sub-card {
  display: flex;
  flex-direction: column;
  gap: .75rem;
  padding: 1rem 1.125rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: 14px;
  transition: border-color .15s;
}
.sub-card:hover { border-color: rgba(168,85,247,.3); }

.sub-row { display: flex; align-items: center; gap: .75rem; }

/* User row */
.sub-user { position: relative; }

.sub-avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--primary-fixed);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: hidden;
}
.sub-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.sub-avatar-ini {
  font-family: var(--font-headline); font-weight: 700;
  font-size: 1rem; color: var(--primary);
}

.sub-user-info { flex: 1; min-width: 0; }
.sub-user-name {
  font-family: var(--font-headline); font-size: .9rem; font-weight: 700;
  color: var(--on-surface);
  display: flex; align-items: center; gap: .25rem;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.verified-ico {
  font-size: 15px; color: var(--primary);
  font-variation-settings: 'FILL' 1;
}
.sub-user-handle { font-size: .75rem; color: var(--primary); font-weight: 600; margin-top: .1rem; }
.sub-user-email  { font-size: .72rem; color: var(--on-surface-variant); margin-top: .05rem; }

/* Status pill */
.sub-status-pill {
  margin-left: auto; flex-shrink: 0;
  padding: .2rem .625rem; border-radius: 999px;
  font-size: .67rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
}
.sub-status-pill.pending  { background: rgba(245,158,11,.12); color: #d97706; }
.sub-status-pill.active   { background: rgba(34,197,94,.1);  color: #16a34a; }
.sub-status-pill.cancelled{ background: rgba(239,68,68,.1);  color: #ef4444; }

/* Details row */
.sub-details {
  display: flex; flex-wrap: wrap; align-items: center; gap: .5rem;
  padding: .5rem .75rem;
  background: var(--surface-container-low);
  border-radius: 8px;
}
.sub-plan-badge {
  padding: .2rem .6rem; border-radius: 999px;
  background: rgba(168,85,247,.1); color: var(--primary);
  font-size: .72rem; font-weight: 700; text-transform: capitalize;
}
.sub-cycle { font-size: .75rem; color: var(--on-surface-variant); text-transform: capitalize; }
.sub-date  { font-size: .72rem; color: var(--on-surface-variant); display: flex; align-items: center; gap: .2rem; }
.sub-expires { font-size: .72rem; color: #f59e0b; font-weight: 500; display: flex; align-items: center; gap: .2rem; }

/* Actions */
.sub-actions { display: flex; gap: .5rem; }

.btn-approve {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: .3rem;
  padding: .55rem .875rem;
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.3);
  border-radius: 10px; color: #16a34a;
  font-family: var(--font-headline); font-size: .82rem; font-weight: 700; cursor: pointer;
  transition: background .15s;
}
.btn-approve:hover { background: rgba(34,197,94,.2); }

.btn-revoke {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: .3rem;
  padding: .55rem .875rem;
  background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.25);
  border-radius: 10px; color: #ef4444;
  font-family: var(--font-headline); font-size: .82rem; font-weight: 700; cursor: pointer;
  transition: background .15s;
}
.btn-revoke:hover { background: rgba(239,68,68,.15); }

/* Empty */
.subs-empty {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 3rem 2rem; gap: .5rem;
  background: var(--surface-container-low);
  border: 1px dashed var(--outline-variant);
  border-radius: 16px;
}
.empty-ico  { font-size: 3rem; color: var(--outline); }
.empty-title{ font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }
.empty-sub  { font-size: .85rem; color: var(--on-surface-variant); }
</style>
