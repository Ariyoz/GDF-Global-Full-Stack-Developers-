<template>
  <div class="admin-subs-view">

    <!-- Header -->
    <div class="subs-header">
      <div class="subs-header-left">
        <div class="subs-header-icon">
          <span class="material-symbols-outlined" style="font-size:22px;font-variation-settings:'FILL' 1">workspace_premium</span>
        </div>
        <div>
          <h1 class="pg-title">Subscriptions</h1>
          <p class="pg-sub">Approve payments and manage verified badges</p>
        </div>
      </div>
      <button class="subs-refresh" @click="fetchSubscriptions" :disabled="loading">
        <span class="material-symbols-outlined" :class="{ spin: loading }">refresh</span>
      </button>
    </div>

    <!-- Stats row -->
    <div class="subs-stats">
      <div class="sstat">
        <span class="sstat-val">{{ pendingCount }}</span>
        <span class="sstat-lbl">Pending</span>
      </div>
      <div class="sstat sstat-active">
        <span class="sstat-val">{{ activeCount }}</span>
        <span class="sstat-lbl">Active</span>
      </div>
      <div class="sstat">
        <span class="sstat-val">{{ cancelledCount }}</span>
        <span class="sstat-lbl">Cancelled</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="subs-tabs">
      <button class="subs-tab" :class="{ active: activeTab === 'pending' }"
        @click="activeTab = 'pending'; fetchSubscriptions()">
        <span class="material-symbols-outlined" style="font-size:16px">hourglass_empty</span>
        Pending
        <span v-if="pendingCount" class="tab-badge">{{ pendingCount }}</span>
      </button>
      <button class="subs-tab" :class="{ active: activeTab === 'active' }"
        @click="activeTab = 'active'; fetchSubscriptions()">
        <span class="material-symbols-outlined" style="font-size:16px">check_circle</span>
        Active
      </button>
      <button class="subs-tab" :class="{ active: activeTab === 'cancelled' }"
        @click="activeTab = 'cancelled'; fetchSubscriptions()">
        <span class="material-symbols-outlined" style="font-size:16px">cancel</span>
        Cancelled
      </button>
    </div>

    <!-- Loading skeletons -->
    <div v-if="loading" class="subs-list">
      <div v-for="i in 3" :key="i" class="sub-skel shimmer"></div>
    </div>

    <!-- List -->
    <div v-else class="subs-list">
      <TransitionGroup name="sub-list">
        <div v-for="sub in subscriptions" :key="sub.id" class="sub-card">

          <!-- Card top: avatar + name + status -->
          <div class="sub-top">
            <div class="sub-av-wrap">
              <img v-if="sub.user_avatar" :src="sub.user_avatar" class="sub-av-img" alt="" />
              <span v-else class="sub-av-ini">{{ (sub.user_name || 'U')[0].toUpperCase() }}</span>
              <div class="sub-av-status" :class="`av-status-${sub.status}`" />
            </div>
            <div class="sub-identity">
              <div class="sub-name-row">
                <span class="sub-name">{{ sub.user_name || 'Unknown' }}</span>
                <span v-if="sub.is_verified" class="material-symbols-outlined sub-verified" style="font-variation-settings:'FILL' 1">verified</span>
              </div>
              <span class="sub-handle">@{{ sub.username || '—' }}</span>
              <span class="sub-email">{{ sub.user_email || '—' }}</span>
            </div>
            <span class="sub-status-pill" :class="`pill-${sub.status}`">
              {{ sub.status === 'pending' ? '⏳ Pending' : sub.status === 'active' ? '✓ Active' : '✗ Cancelled' }}
            </span>
          </div>

          <!-- Card body: plan details chips -->
          <div class="sub-body">
            <div class="sub-chips">
              <span class="sub-chip sub-chip-plan">
                <span class="material-symbols-outlined" style="font-size:13px;font-variation-settings:'FILL' 1">workspace_premium</span>
                {{ sub.plan?.replace('_', ' ') || 'Free' }}
              </span>
              <span class="sub-chip sub-chip-cycle">
                <span class="material-symbols-outlined" style="font-size:13px">calendar_view_month</span>
                {{ sub.billing_cycle || '—' }}
              </span>
              <span class="sub-chip">
                <span class="material-symbols-outlined" style="font-size:13px">today</span>
                {{ formatDate(sub.created_at) }}
              </span>
              <span v-if="sub.expires_at && sub.expires_at !== '—'" class="sub-chip sub-chip-expiry">
                <span class="material-symbols-outlined" style="font-size:13px">schedule</span>
                Expires {{ formatDate(sub.expires_at) }}
              </span>
            </div>
          </div>

          <!-- Card actions -->
          <div class="sub-actions">
            <template v-if="activeTab === 'pending'">
              <button class="sub-btn sub-btn-approve" @click="approveSub(sub)">
                <span class="material-symbols-outlined" style="font-size:16px">check_circle</span>
                Approve & Grant Badge
              </button>
              <button class="sub-btn sub-btn-reject" @click="rejectSub(sub)">
                <span class="material-symbols-outlined" style="font-size:16px">cancel</span>
                Reject
              </button>
            </template>
            <button v-else-if="activeTab === 'active'" class="sub-btn sub-btn-reject" @click="revokeSub(sub)">
              <span class="material-symbols-outlined" style="font-size:16px">remove_circle</span>
              Revoke Badge
            </button>
          </div>

        </div>
      </TransitionGroup>

      <!-- Empty state -->
      <div v-if="!loading && !subscriptions.length" class="subs-empty">
        <div class="empty-icon-wrap">
          <span class="material-symbols-outlined">{{ activeTab === 'pending' ? 'hourglass_empty' : 'credit_card_off' }}</span>
        </div>
        <h3 class="empty-title">
          {{ activeTab === 'pending' ? 'No pending payments' : 'No subscriptions here' }}
        </h3>
        <p class="empty-sub">
          {{ activeTab === 'pending' ? 'New payment confirmations will appear here.' : 'Nothing to show in this category.' }}
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import http from '@/services/http'
import { useUiStore } from '@/store/ui'

const uiStore       = useUiStore()
const subscriptions = ref([])
const activeTab     = ref('pending')
const loading       = ref(false)

const pendingCount   = ref(0)
const activeCount    = ref(0)
const cancelledCount = ref(0)

async function fetchSubscriptions() {
  loading.value = true
  try {
    const data = await http.get(`/admin/subscriptions?status_filter=${activeTab.value}`)
    subscriptions.value = data.subscriptions || []
    // Update counts
    if (activeTab.value === 'pending')   pendingCount.value   = subscriptions.value.length
    if (activeTab.value === 'active')    activeCount.value    = subscriptions.value.length
    if (activeTab.value === 'cancelled') cancelledCount.value = subscriptions.value.length
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
    activeCount.value++
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
    activeCount.value = Math.max(activeCount.value - 1, 0)
    uiStore.showSuccess('Subscription revoked — badge removed')
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

onMounted(async () => {
  await fetchSubscriptions()
  // Pre-load counts for other tabs
  try {
    const [a, c] = await Promise.all([
      http.get('/admin/subscriptions?status_filter=active'),
      http.get('/admin/subscriptions?status_filter=cancelled'),
    ])
    activeCount.value    = (a.subscriptions || []).length
    cancelledCount.value = (c.subscriptions || []).length
  } catch {}
})
</script>

<style scoped>
/* ══ Layout ══════════════════════════════════════════════════════════════════ */
.admin-subs-view { display: flex; flex-direction: column; gap: 1.25rem; padding-bottom: 3rem; }

/* ══ Header ══════════════════════════════════════════════════════════════════ */
.subs-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.subs-header-left { display: flex; align-items: center; gap: .875rem; }
.subs-header-icon {
  width: 48px; height: 48px; border-radius: 14px; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(245,158,11,.15) 0%, rgba(245,158,11,.08) 100%);
  border: 1px solid rgba(245,158,11,.25);
  display: flex; align-items: center; justify-content: center; color: #f59e0b;
}
.pg-title { font-family: var(--font-headline); font-size: 1.35rem; font-weight: 800; color: var(--on-surface); letter-spacing: -.02em; margin: 0; }
.pg-sub   { font-size: .82rem; color: var(--on-surface-variant); margin: .15rem 0 0; }
.subs-refresh {
  width: 38px; height: 38px; border-radius: 50%;
  border: 1.5px solid var(--outline-variant); background: var(--surface-container);
  color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .15s; flex-shrink: 0;
}
.subs-refresh:hover { border-color: var(--primary); color: var(--primary); }
.subs-refresh .material-symbols-outlined { font-size: 18px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ══ Stats ═══════════════════════════════════════════════════════════════════ */
.subs-stats {
  display: flex; gap: .75rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: 16px; padding: 1rem 1.25rem;
}
.sstat {
  display: flex; flex-direction: column; align-items: center; gap: .2rem;
  flex: 1; text-align: center;
  padding: .5rem; border-radius: 10px;
  transition: background .15s;
}
.sstat:hover { background: var(--surface-container); }
.sstat-val {
  font-family: var(--font-headline); font-size: 1.75rem; font-weight: 800;
  color: var(--on-surface); line-height: 1;
}
.sstat-lbl { font-size: .7rem; font-weight: 600; color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: .06em; }
.sstat-active .sstat-val { color: #16a34a; }

/* ══ Tabs ════════════════════════════════════════════════════════════════════ */
.subs-tabs {
  display: flex; gap: 0; overflow-x: auto; scrollbar-width: none;
  border-bottom: 2px solid var(--outline-variant);
}
.subs-tabs::-webkit-scrollbar { display: none; }
.subs-tab {
  display: flex; align-items: center; gap: .35rem;
  padding: .625rem 1rem; white-space: nowrap;
  background: none; border: none; border-bottom: 2.5px solid transparent;
  font-family: var(--font-headline); font-size: .85rem; font-weight: 600;
  color: var(--on-surface-variant); cursor: pointer;
  margin-bottom: -2px; transition: all .15s;
}
.subs-tab:hover { color: var(--primary); }
.subs-tab.active { color: var(--primary); border-bottom-color: var(--primary); }
.tab-badge {
  min-width: 18px; height: 18px; border-radius: 9px;
  background: #ef4444; color: #fff; font-size: .6rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center; padding: 0 4px;
}

/* ══ List ════════════════════════════════════════════════════════════════════ */
.subs-list { display: flex; flex-direction: column; gap: .875rem; }

/* Skeleton */
.sub-skel { height: 130px; border-radius: 16px; }
.shimmer {
  background: linear-gradient(90deg, var(--surface-container) 25%, var(--surface-container-high) 50%, var(--surface-container) 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ══ Card ════════════════════════════════════════════════════════════════════ */
.sub-card {
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--outline-variant);
  border-radius: 18px; padding: 1.125rem;
  display: flex; flex-direction: column; gap: .875rem;
  transition: border-color .2s, box-shadow .2s;
}
.sub-card:hover { border-color: rgba(168,85,247,.3); box-shadow: 0 4px 20px rgba(99,14,212,.06); }

/* Top: avatar + identity + status */
.sub-top {
  display: flex; align-items: center; gap: .875rem; flex-wrap: wrap;
}
.sub-av-wrap {
  width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; position: relative;
}
.sub-av-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
.sub-av-ini {
  width: 100%; height: 100%; border-radius: 50%;
  background: var(--gradient-primary); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-headline); font-size: 1rem; font-weight: 800;
}
.sub-av-status {
  position: absolute; bottom: 0; right: 0;
  width: 13px; height: 13px; border-radius: 50%;
  border: 2px solid var(--surface-container-lowest);
}
.av-status-pending   { background: #f59e0b; }
.av-status-active    { background: #22c55e; }
.av-status-cancelled { background: #6b7280; }

.sub-identity { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: .15rem; }
.sub-name-row { display: flex; align-items: center; gap: .25rem; min-width: 0; }
.sub-name {
  font-family: var(--font-headline); font-size: .9rem; font-weight: 700; color: var(--on-surface);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sub-verified { font-size: 16px; color: var(--primary); flex-shrink: 0; }
.sub-handle { font-size: .75rem; color: var(--primary); font-weight: 600; }
.sub-email  { font-size: .72rem; color: var(--on-surface-variant); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.sub-status-pill {
  flex-shrink: 0; padding: .25rem .75rem; border-radius: 999px;
  font-size: .7rem; font-weight: 700; letter-spacing: .02em;
  align-self: flex-start;
}
.pill-pending   { background: rgba(245,158,11,.12); color: #d97706; border: 1px solid rgba(245,158,11,.25); }
.pill-active    { background: rgba(34,197,94,.1);   color: #16a34a; border: 1px solid rgba(34,197,94,.25); }
.pill-cancelled { background: rgba(239,68,68,.1);   color: #ef4444; border: 1px solid rgba(239,68,68,.2); }

/* Body: chips */
.sub-body { }
.sub-chips { display: flex; flex-wrap: wrap; gap: .4rem; }
.sub-chip {
  display: inline-flex; align-items: center; gap: .25rem;
  padding: .25rem .625rem; border-radius: 8px;
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  font-size: .72rem; font-weight: 600; color: var(--on-surface-variant);
}
.sub-chip-plan   { background: rgba(168,85,247,.1); border-color: rgba(168,85,247,.2); color: var(--primary); }
.sub-chip-cycle  { background: rgba(59,130,246,.08); border-color: rgba(59,130,246,.15); color: #3b82f6; }
.sub-chip-expiry { background: rgba(245,158,11,.1); border-color: rgba(245,158,11,.2); color: #d97706; }

/* Actions */
.sub-actions { display: flex; gap: .625rem; flex-wrap: wrap; }
.sub-btn {
  flex: 1; min-width: 120px; display: flex; align-items: center; justify-content: center; gap: .375rem;
  padding: .625rem 1rem; border-radius: 12px;
  font-family: var(--font-headline); font-size: .82rem; font-weight: 700;
  cursor: pointer; transition: all .15s; border: 1.5px solid transparent; white-space: nowrap;
}
.sub-btn-approve {
  background: rgba(34,197,94,.1); border-color: rgba(34,197,94,.3); color: #16a34a;
}
.sub-btn-approve:hover { background: rgba(34,197,94,.2); transform: translateY(-1px); }
.sub-btn-reject {
  background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.25); color: #ef4444;
}
.sub-btn-reject:hover { background: rgba(239,68,68,.15); transform: translateY(-1px); }

/* Empty */
.subs-empty {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 3.5rem 1.5rem; gap: .75rem;
  background: var(--surface-container-low);
  border: 1.5px dashed var(--outline-variant); border-radius: 18px;
}
.empty-icon-wrap {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--surface-container);
  display: flex; align-items: center; justify-content: center;
}
.empty-icon-wrap .material-symbols-outlined { font-size: 28px; color: var(--on-surface-variant); opacity: .4; }
.empty-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); margin: 0; }
.empty-sub   { font-size: .85rem; color: var(--on-surface-variant); margin: 0; max-width: 320px; }

/* Transition */
.sub-list-enter-active { transition: all .25s ease; }
.sub-list-leave-active { transition: all .2s ease; }
.sub-list-enter-from   { opacity: 0; transform: translateY(-8px); }
.sub-list-leave-to     { opacity: 0; transform: translateX(16px); }

/* ══ Mobile ══════════════════════════════════════════════════════════════════ */
@media (max-width: 600px) {
  .sub-top { flex-wrap: wrap; }
  .sub-status-pill { order: -1; align-self: auto; }
  .sub-btn { min-width: 0; font-size: .78rem; padding: .55rem .75rem; }
  .pg-title { font-size: 1.15rem; }
  .subs-stats { padding: .75rem 1rem; gap: .5rem; }
  .sstat-val { font-size: 1.35rem; }
}
</style>
