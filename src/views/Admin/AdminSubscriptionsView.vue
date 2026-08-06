<template>
  <div class="admin-subs-view">

    <!-- ── Page Header ── -->
    <div class="page-hdr">
      <div class="page-hdr-left">
        <div class="page-hdr-icon">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">workspace_premium</span>
        </div>
        <div>
          <h1 class="page-title">Subscriptions</h1>
          <p class="page-sub">Manage plans, payments and verified badges</p>
        </div>
      </div>
      <div class="page-hdr-right">
        <button class="btn-fix" @click="fixOrphanedBadges" :disabled="fixing">
          <span class="material-symbols-outlined" style="font-size:15px">auto_fix_high</span>
          {{ fixing ? 'Fixing...' : 'Fix Orphaned Badges' }}
        </button>
        <button class="btn-icon-sm" @click="fetchSubscriptions" :disabled="loading" title="Refresh">
          <span class="material-symbols-outlined" :class="{ spin: loading }">refresh</span>
        </button>
      </div>
    </div>

    <!-- ── Stats Cards ── -->
    <div class="stats-row">
      <div class="stat-card stat-pending" @click="activeTab='pending'; fetchSubscriptions()">
        <div class="stat-ico">
          <span class="material-symbols-outlined">hourglass_empty</span>
        </div>
        <div class="stat-body">
          <span class="stat-num">{{ pendingCount }}</span>
          <span class="stat-lbl">Pending</span>
        </div>
        <span v-if="pendingCount" class="stat-alert">!</span>
      </div>
      <div class="stat-card stat-active" @click="activeTab='active'; fetchSubscriptions()">
        <div class="stat-ico stat-ico-green">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">verified</span>
        </div>
        <div class="stat-body">
          <span class="stat-num stat-num-green">{{ activeCount }}</span>
          <span class="stat-lbl">Active</span>
        </div>
      </div>
      <div class="stat-card" @click="activeTab='cancelled'; fetchSubscriptions()">
        <div class="stat-ico stat-ico-grey">
          <span class="material-symbols-outlined">cancel</span>
        </div>
        <div class="stat-body">
          <span class="stat-num">{{ cancelledCount }}</span>
          <span class="stat-lbl">Cancelled</span>
        </div>
      </div>
    </div>

    <!-- ── Tabs ── -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs" :key="tab.value"
        class="tab-btn" :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value; fetchSubscriptions()"
      >
        <span class="material-symbols-outlined tab-ico">{{ tab.icon }}</span>
        {{ tab.label }}
        <span v-if="tab.value === 'pending' && pendingCount" class="tab-dot">{{ pendingCount }}</span>
      </button>
    </div>

    <!-- ── Skeletons ── -->
    <div v-if="loading" class="sub-list">
      <div v-for="i in 3" :key="i" class="sub-skel shimmer" />
    </div>

    <!-- ── Subscription Cards ── -->
    <div v-else class="sub-list">
      <TransitionGroup name="sub-anim">
        <div v-for="sub in subscriptions" :key="sub.id" class="sub-card">

          <!-- ── Card Header ── -->
          <div class="sub-card-hdr">
            <!-- Avatar -->
            <div class="sub-av">
              <img v-if="sub.user_avatar" :src="sub.user_avatar" class="sub-av-img" alt="" />
              <div v-else class="sub-av-ini">{{ (sub.user_name || 'U')[0].toUpperCase() }}</div>
              <div class="sub-av-dot" :class="`dot-${sub.status}`" />
            </div>

            <!-- Identity -->
            <div class="sub-id">
              <div class="sub-name-row">
                <span class="sub-name">{{ sub.user_name || sub.username || 'Unknown' }}</span>
                <span v-if="sub.is_verified"
                  class="material-symbols-outlined sub-badge-ico"
                  style="font-variation-settings:'FILL' 1"
                  title="Verified">verified</span>
              </div>
              <div class="sub-meta-row">
                <span class="sub-handle">@{{ sub.username || '—' }}</span>
                <span class="sub-sep">·</span>
                <span class="sub-email">{{ sub.user_email || '—' }}</span>
              </div>
            </div>

            <!-- Status pill -->
            <div class="sub-status" :class="`status-${sub.status}`">
              <div class="status-dot" />
              {{ sub.status === 'active' ? 'Active' : sub.status === 'pending' ? 'Pending' : 'Cancelled' }}
            </div>
          </div>

          <!-- ── Plan Info Row ── -->
          <div class="sub-plan-row">
            <div class="plan-badge">
              <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1">workspace_premium</span>
              {{ sub.plan?.replace(/_/g, ' ') || 'Pro' }}
            </div>
            <div class="plan-detail">
              <span class="material-symbols-outlined" style="font-size:13px">calendar_view_month</span>
              {{ sub.billing_cycle || '—' }}
            </div>
            <div class="plan-detail">
              <span class="material-symbols-outlined" style="font-size:13px">event</span>
              Since {{ formatDate(sub.created_at) }}
            </div>
            <div v-if="sub.expires_at && sub.expires_at !== '—'" class="plan-detail plan-expiry">
              <span class="material-symbols-outlined" style="font-size:13px">schedule</span>
              Expires {{ formatDate(sub.expires_at) }}
            </div>
          </div>

          <!-- ── Actions ── -->
          <div class="sub-actions">
            <template v-if="activeTab === 'pending'">
              <button class="action-approve" @click="approveSub(sub)">
                <span class="material-symbols-outlined" style="font-size:16px">check_circle</span>
                Approve & Grant Badge
              </button>
              <button class="action-reject" @click="rejectSub(sub)">
                <span class="material-symbols-outlined" style="font-size:16px">cancel</span>
                Reject
              </button>
            </template>
            <template v-else-if="activeTab === 'active'">
              <button class="action-revoke" @click="revokeSub(sub)">
                <span class="material-symbols-outlined" style="font-size:16px">remove_circle</span>
                Revoke Subscription
              </button>
              <button v-if="sub.is_verified" class="action-badge" @click="removeBadgeDirect(sub)">
                <span class="material-symbols-outlined" style="font-size:16px">verified_off</span>
                Remove Badge Only
              </button>
            </template>
          </div>

        </div>
      </TransitionGroup>

      <!-- ── Empty ── -->
      <div v-if="!loading && !subscriptions.length" class="sub-empty">
        <div class="sub-empty-ico">
          <span class="material-symbols-outlined">{{ activeTab === 'pending' ? 'hourglass_empty' : 'credit_card_off' }}</span>
        </div>
        <p class="sub-empty-title">{{ activeTab === 'pending' ? 'No pending payments' : `No ${activeTab} subscriptions` }}</p>
        <p class="sub-empty-sub">{{ activeTab === 'pending' ? 'New payment confirmations will appear here.' : 'Nothing to show in this category.' }}</p>
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
const activeTab  = ref('pending')
const loading    = ref(false)
const fixing     = ref(false)

const pendingCount   = ref(0)
const activeCount    = ref(0)
const cancelledCount = ref(0)

const tabs = [
  { value: 'pending',   label: 'Pending',   icon: 'hourglass_empty' },
  { value: 'active',    label: 'Active',    icon: 'check_circle'    },
  { value: 'cancelled', label: 'Cancelled', icon: 'cancel'          },
]

async function fetchSubscriptions() {
  loading.value = true
  try {
    const data = await http.get(`/admin/subscriptions?status_filter=${activeTab.value}`)
    subscriptions.value = data.subscriptions || []
    if (activeTab.value === 'pending')   pendingCount.value   = subscriptions.value.length
    if (activeTab.value === 'active')    activeCount.value    = subscriptions.value.length
    if (activeTab.value === 'cancelled') cancelledCount.value = subscriptions.value.length
  } catch { subscriptions.value = [] }
  finally { loading.value = false }
}

async function approveSub(sub) {
  try {
    await http.patch(`/admin/subscriptions/${sub.id}/approve`)
    subscriptions.value = subscriptions.value.filter(s => s.id !== sub.id)
    pendingCount.value = Math.max(pendingCount.value - 1, 0)
    activeCount.value++
    uiStore.showSuccess(`${sub.user_name} approved — verified badge granted`)
  } catch { uiStore.showError('Failed to approve') }
}

async function rejectSub(sub) {
  try {
    await http.patch(`/admin/subscriptions/${sub.id}/revoke`)
    subscriptions.value = subscriptions.value.filter(s => s.id !== sub.id)
    pendingCount.value = Math.max(pendingCount.value - 1, 0)
    uiStore.showSuccess('Subscription rejected')
  } catch { uiStore.showError('Failed to reject') }
}

async function revokeSub(sub) {
  if (!confirm(`Revoke subscription for ${sub.user_name}? This removes their verified badge.`)) return
  try {
    await http.patch(`/admin/subscriptions/${sub.id}/revoke`)
    subscriptions.value = subscriptions.value.filter(s => s.id !== sub.id)
    activeCount.value = Math.max(activeCount.value - 1, 0)
    uiStore.showSuccess('Subscription revoked — badge removed')
  } catch { uiStore.showError('Failed to revoke') }
}

async function removeBadgeDirect(sub) {
  if (!confirm(`Remove verified badge from ${sub.user_name}?`)) return
  try {
    await http.patch(`/admin/users/${sub.user_id}/verify`, { is_verified: false })
    sub.is_verified = false
    uiStore.showSuccess(`Badge removed from ${sub.user_name}`)
  } catch { uiStore.showError('Failed to remove badge') }
}

async function fixOrphanedBadges() {
  if (!confirm('Remove verified badges from ALL users with no active subscription?')) return
  fixing.value = true
  try {
    const result = await http.post('/admin/subscriptions/fix-orphaned-badges')
    const count = result.fixed_users?.length || 0
    uiStore.showSuccess(count > 0
      ? `Removed ${count} orphaned badge(s): ${result.fixed_users.map(u => u.name).join(', ')}`
      : 'No orphaned badges found')
    await fetchSubscriptions()
  } catch { uiStore.showError('Failed to fix orphaned badges') }
  finally { fixing.value = false }
}

function formatDate(d) {
  if (!d || d === '—') return '—'
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
  catch { return '—' }
}

onMounted(async () => {
  await fetchSubscriptions()
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
/* ══ Root ══════════════════════════════════════════════════════════════════ */
.admin-subs-view { display:flex; flex-direction:column; gap:1.5rem; padding-bottom:3rem; }

/* ══ Header ════════════════════════════════════════════════════════════════ */
.page-hdr { display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
.page-hdr-left { display:flex; align-items:center; gap:.875rem; }
.page-hdr-icon {
  width:46px; height:46px; border-radius:13px; flex-shrink:0;
  background:linear-gradient(135deg,rgba(245,158,11,.2),rgba(245,158,11,.08));
  border:1px solid rgba(245,158,11,.3);
  display:flex; align-items:center; justify-content:center;
  color:#f59e0b;
}
.page-hdr-icon .material-symbols-outlined { font-size:22px; }
.page-title { font-family:var(--font-headline); font-size:1.4rem; font-weight:800; color:var(--on-surface); letter-spacing:-.02em; margin:0; }
.page-sub   { font-size:.82rem; color:var(--on-surface-variant); margin:.1rem 0 0; }
.page-hdr-right { display:flex; align-items:center; gap:.625rem; flex-shrink:0; }

.btn-fix {
  display:inline-flex; align-items:center; gap:.35rem;
  padding:.5rem 1rem; border-radius:10px;
  background:rgba(245,158,11,.1); border:1.5px solid rgba(245,158,11,.3);
  color:#d97706; font-family:var(--font-headline); font-size:.8rem; font-weight:700;
  cursor:pointer; transition:all .15s; white-space:nowrap;
}
.btn-fix:hover { background:rgba(245,158,11,.2); }
.btn-fix:disabled { opacity:.5; cursor:not-allowed; }

.btn-icon-sm {
  width:36px; height:36px; border-radius:50%;
  border:1.5px solid var(--outline-variant); background:var(--surface-container);
  color:var(--on-surface-variant); display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:all .15s; flex-shrink:0;
}
.btn-icon-sm:hover { border-color:var(--primary); color:var(--primary); }
.btn-icon-sm .material-symbols-outlined { font-size:18px; }
.spin { animation:spin 1s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

/* ══ Stats Row ══════════════════════════════════════════════════════════════ */
.stats-row {
  display:grid; grid-template-columns:repeat(3,1fr); gap:.875rem;
}
.stat-card {
  display:flex; align-items:center; gap:.875rem;
  padding:1.125rem 1.25rem;
  background:var(--surface-container-lowest);
  border:1.5px solid var(--outline-variant);
  border-radius:16px; cursor:pointer;
  transition:all .2s cubic-bezier(.34,1.56,.64,1);
  position:relative; overflow:hidden;
}
.stat-card::before {
  content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
  background:var(--outline-variant); border-radius:2px 0 0 2px; transition:background .2s;
}
.stat-pending::before   { background:rgba(245,158,11,.6); }
.stat-active::before    { background:rgba(34,197,94,.7); }
.stat-card:hover { border-color:rgba(168,85,247,.3); transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,.08); }

.stat-ico {
  width:40px; height:40px; border-radius:12px; flex-shrink:0;
  background:var(--surface-container);
  display:flex; align-items:center; justify-content:center;
  color:var(--on-surface-variant);
}
.stat-ico .material-symbols-outlined { font-size:20px; }
.stat-ico-green { background:rgba(34,197,94,.1); color:#16a34a; }
.stat-ico-grey  { background:var(--surface-container); color:var(--on-surface-variant); }

.stat-body { flex:1; display:flex; flex-direction:column; gap:.1rem; }
.stat-num {
  font-family:var(--font-headline); font-size:1.6rem; font-weight:800;
  color:var(--on-surface); line-height:1; letter-spacing:-.03em;
}
.stat-num-green { color:#16a34a; }
.stat-lbl { font-size:.72rem; font-weight:600; color:var(--on-surface-variant); text-transform:uppercase; letter-spacing:.07em; }

.stat-alert {
  width:22px; height:22px; border-radius:50%;
  background:#ef4444; color:#fff;
  font-size:.7rem; font-weight:800;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
  animation:pulse-alert 1.5s ease-in-out infinite;
}
@keyframes pulse-alert { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4)} 50%{box-shadow:0 0 0 6px rgba(239,68,68,0)} }

@media (max-width:600px) { .stats-row { grid-template-columns:1fr; } }

/* ══ Tabs ═══════════════════════════════════════════════════════════════════ */
.tab-bar {
  display:flex; gap:.35rem;
  background:var(--surface-container-low);
  border:1px solid var(--outline-variant);
  border-radius:14px; padding:.3rem;
  width:fit-content;
}
.tab-btn {
  display:flex; align-items:center; gap:.35rem;
  padding:.5rem 1.125rem; border-radius:10px; border:none;
  font-family:var(--font-headline); font-size:.85rem; font-weight:600;
  color:var(--on-surface-variant); background:none; cursor:pointer;
  transition:all .2s; white-space:nowrap; position:relative;
}
.tab-ico { font-size:16px; }
.tab-btn:hover { color:var(--on-surface); background:var(--surface-container); }
.tab-btn.active {
  background:var(--surface-container-lowest); color:var(--primary);
  box-shadow:0 1px 6px rgba(0,0,0,.1);
}
.tab-dot {
  min-width:18px; height:18px; border-radius:9px;
  background:#ef4444; color:#fff; font-size:.6rem; font-weight:800;
  display:flex; align-items:center; justify-content:center; padding:0 4px;
}

/* ══ Skeleton ═══════════════════════════════════════════════════════════════ */
.sub-skel { height:120px; border-radius:16px; margin-bottom:.5rem; }
.shimmer {
  background:linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%);
  background-size:200% 100%; animation:shimmer 1.4s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ══ List ═══════════════════════════════════════════════════════════════════ */
.sub-list { display:flex; flex-direction:column; gap:.875rem; }

/* ══ Card ═══════════════════════════════════════════════════════════════════ */
.sub-card {
  background:var(--surface-container-lowest);
  border:1.5px solid var(--outline-variant);
  border-radius:18px;
  overflow:hidden;
  transition:border-color .2s, box-shadow .2s;
}
.sub-card:hover { border-color:rgba(168,85,247,.25); box-shadow:0 4px 20px rgba(99,14,212,.06); }

/* Card header */
.sub-card-hdr {
  display:flex; align-items:center; gap:1rem;
  padding:1.125rem 1.25rem .875rem;
}

/* Avatar */
.sub-av {
  width:46px; height:46px; border-radius:50%;
  position:relative; flex-shrink:0;
}
.sub-av-img { width:100%; height:100%; object-fit:cover; border-radius:50%; display:block; }
.sub-av-ini {
  width:100%; height:100%; border-radius:50%;
  background:var(--gradient-primary); color:#fff;
  display:flex; align-items:center; justify-content:center;
  font-family:var(--font-headline); font-size:1rem; font-weight:800;
}
.sub-av-dot {
  position:absolute; bottom:1px; right:1px;
  width:12px; height:12px; border-radius:50%;
  border:2px solid var(--surface-container-lowest);
}
.dot-pending   { background:#f59e0b; }
.dot-active    { background:#22c55e; }
.dot-cancelled { background:#6b7280; }

/* Identity */
.sub-id { flex:1; min-width:0; display:flex; flex-direction:column; gap:.2rem; }
.sub-name-row { display:flex; align-items:center; gap:.3rem; min-width:0; }
.sub-name {
  font-family:var(--font-headline); font-size:.95rem; font-weight:700;
  color:var(--on-surface); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.sub-badge-ico { font-size:17px; color:var(--primary); flex-shrink:0; }
.sub-meta-row { display:flex; align-items:center; gap:.35rem; flex-wrap:wrap; }
.sub-handle { font-size:.75rem; color:var(--primary); font-weight:600; }
.sub-sep    { color:var(--outline); font-size:.75rem; }
.sub-email  { font-size:.72rem; color:var(--on-surface-variant); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

/* Status pill */
.sub-status {
  display:flex; align-items:center; gap:.3rem;
  padding:.3rem .875rem; border-radius:999px;
  font-family:var(--font-headline); font-size:.72rem; font-weight:700;
  flex-shrink:0;
}
.status-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.status-pending   { background:rgba(245,158,11,.12); color:#d97706; border:1px solid rgba(245,158,11,.25); }
.status-pending   .status-dot { background:#f59e0b; }
.status-active    { background:rgba(34,197,94,.1);   color:#16a34a; border:1px solid rgba(34,197,94,.25); }
.status-active    .status-dot { background:#22c55e; animation:pulse-dot 1.5s ease-in-out infinite; }
.status-cancelled { background:rgba(107,114,128,.1); color:#6b7280; border:1px solid rgba(107,114,128,.2); }
.status-cancelled .status-dot { background:#6b7280; }
@keyframes pulse-dot { 0%,100%{opacity:1}50%{opacity:.4} }

/* Plan info row */
.sub-plan-row {
  display:flex; align-items:center; gap:.5rem; flex-wrap:wrap;
  padding:.625rem 1.25rem;
  background:var(--surface-container-low);
  border-top:1px solid var(--outline-variant);
  border-bottom:1px solid var(--outline-variant);
}
.plan-badge {
  display:inline-flex; align-items:center; gap:.3rem;
  padding:.25rem .7rem; border-radius:8px;
  background:rgba(168,85,247,.12); border:1px solid rgba(168,85,247,.2);
  color:var(--primary); font-family:var(--font-headline); font-size:.75rem; font-weight:700;
  text-transform:capitalize;
}
.plan-detail {
  display:inline-flex; align-items:center; gap:.25rem;
  font-size:.75rem; color:var(--on-surface-variant); font-weight:500;
}
.plan-detail .material-symbols-outlined { font-size:14px; color:var(--outline); }
.plan-expiry { color:#d97706; }
.plan-expiry .material-symbols-outlined { color:#f59e0b; }

/* Actions */
.sub-actions {
  display:flex; align-items:center; gap:.625rem; flex-wrap:wrap;
  padding:.875rem 1.25rem;
}

/* Base action button */
.action-approve, .action-reject, .action-revoke, .action-badge {
  display:inline-flex; align-items:center; gap:.375rem;
  padding:.575rem 1.125rem; border-radius:10px;
  font-family:var(--font-headline); font-size:.82rem; font-weight:700;
  cursor:pointer; transition:all .15s; border:1.5px solid transparent;
  white-space:nowrap;
}

.action-approve {
  background:rgba(34,197,94,.1); border-color:rgba(34,197,94,.3); color:#16a34a;
  flex:1;
}
.action-approve:hover { background:rgba(34,197,94,.2); transform:translateY(-1px); }

.action-reject {
  background:rgba(239,68,68,.08); border-color:rgba(239,68,68,.2); color:#ef4444;
}
.action-reject:hover { background:rgba(239,68,68,.15); }

.action-revoke {
  background:rgba(239,68,68,.08); border-color:rgba(239,68,68,.2); color:#ef4444;
  flex:1;
}
.action-revoke:hover { background:rgba(239,68,68,.15); }

.action-badge {
  background:rgba(245,158,11,.08); border-color:rgba(245,158,11,.25); color:#d97706;
}
.action-badge:hover { background:rgba(245,158,11,.18); }

/* ══ Empty ══════════════════════════════════════════════════════════════════ */
.sub-empty {
  display:flex; flex-direction:column; align-items:center; gap:.75rem;
  padding:3.5rem 1.5rem; text-align:center;
  background:var(--surface-container-low);
  border:1.5px dashed var(--outline-variant); border-radius:18px;
}
.sub-empty-ico {
  width:60px; height:60px; border-radius:50%; background:var(--surface-container);
  display:flex; align-items:center; justify-content:center;
}
.sub-empty-ico .material-symbols-outlined { font-size:28px; color:var(--on-surface-variant); opacity:.4; }
.sub-empty-title { font-family:var(--font-headline); font-size:1rem; font-weight:700; color:var(--on-surface); margin:0; }
.sub-empty-sub   { font-size:.85rem; color:var(--on-surface-variant); margin:0; max-width:320px; }

/* ══ Transitions ════════════════════════════════════════════════════════════ */
.sub-anim-enter-active { transition:all .25s ease; }
.sub-anim-leave-active { transition:all .2s ease; }
.sub-anim-enter-from   { opacity:0; transform:translateY(-8px); }
.sub-anim-leave-to     { opacity:0; transform:translateX(16px); }

/* ══ Mobile ═════════════════════════════════════════════════════════════════ */
@media (max-width:640px) {
  .sub-card-hdr { flex-wrap:wrap; gap:.75rem; }
  .sub-status   { order:-1; }
  .sub-actions  { gap:.5rem; }
  .action-approve, .action-revoke { flex:none; width:100%; justify-content:center; }
  .tab-bar      { width:100%; }
  .tab-btn      { flex:1; justify-content:center; padding:.5rem .75rem; }
  .page-hdr     { gap:.75rem; }
  .btn-fix      { font-size:.75rem; padding:.45rem .75rem; }
}
</style>
