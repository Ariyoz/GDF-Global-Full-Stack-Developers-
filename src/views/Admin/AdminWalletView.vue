<template>
  <div class="admin-wallet-view">
    <div class="page-header">
      <div>
        <h1 class="pg-title">Wallet Management</h1>
        <p class="pg-sub">Review and process user withdrawal requests.</p>
      </div>
      <button class="btn-refresh" @click="fetchWithdrawals" :disabled="loading">
        <span class="material-symbols-outlined" :class="{ spin: loading }">refresh</span>
      </button>
    </div>

    <!-- Stats bar -->
    <div class="wallet-stats" v-if="stats">
      <div class="wstat">
        <p class="wstat-lbl">Total Wallets</p>
        <p class="wstat-val">{{ stats.total_wallets }}</p>
      </div>
      <div class="wstat">
        <p class="wstat-lbl">Total Balance</p>
        <p class="wstat-val">₦{{ fmt(stats.total_balance) }}</p>
      </div>
      <div class="wstat">
        <p class="wstat-lbl">Total Earned</p>
        <p class="wstat-val">₦{{ fmt(stats.total_earned) }}</p>
      </div>
      <div class="wstat">
        <p class="wstat-lbl">Pending Withdrawals</p>
        <p class="wstat-val" style="color:#f59e0b">{{ stats.pending_withdrawals }}</p>
      </div>
      <div class="wstat">
        <p class="wstat-lbl">Pending Amount</p>
        <p class="wstat-val" style="color:#f59e0b">₦{{ fmt(stats.pending_withdrawal_amount) }}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab" :class="{ active: tab === 'pending' }"
        @click="tab = 'pending'; fetchWithdrawals()">
        Pending
        <span v-if="pendingCount" class="tab-badge">{{ pendingCount }}</span>
      </button>
      <button class="tab" :class="{ active: tab === 'processing' }"
        @click="tab = 'processing'; fetchWithdrawals()">Processing</button>
      <button class="tab" :class="{ active: tab === 'success' }"
        @click="tab = 'success'; fetchWithdrawals()">Completed</button>
      <button class="tab" :class="{ active: tab === 'rejected' }"
        @click="tab = 'rejected'; fetchWithdrawals()">Rejected</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="wd-list">
      <div v-for="i in 3" :key="i" class="wd-skel shimmer"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="!withdrawals.length" class="wd-empty">
      <span class="material-symbols-outlined" style="font-size:2.5rem;opacity:.25">account_balance_wallet</span>
      <p>No {{ tab }} withdrawal requests</p>
    </div>

    <!-- List -->
    <div v-else class="wd-list">
      <div v-for="wd in withdrawals" :key="wd.id" class="wd-card">

        <!-- User -->
        <div class="wd-user-row">
          <div class="wd-avatar">{{ (wd.user_name || 'U')[0].toUpperCase() }}</div>
          <div class="wd-user-info">
            <p class="wd-user-name">{{ wd.user_name }}</p>
            <p class="wd-user-email">{{ wd.user_email }}</p>
          </div>
          <span class="wd-status-pill" :class="wd.status">{{ wd.status }}</span>
        </div>

        <!-- Bank details -->
        <div class="wd-bank-grid">
          <div class="wd-bank-item">
            <span class="wd-lbl">Amount</span>
            <span class="wd-val amt">₦{{ fmt(wd.amount) }}</span>
          </div>
          <div class="wd-bank-item">
            <span class="wd-lbl">Fee</span>
            <span class="wd-val">₦{{ fmt(wd.fee) }}</span>
          </div>
          <div class="wd-bank-item">
            <span class="wd-lbl">Net to Pay</span>
            <span class="wd-val" style="color:#16a34a;font-weight:700">₦{{ fmt(wd.net_amount) }}</span>
          </div>
          <div class="wd-bank-item">
            <span class="wd-lbl">Date</span>
            <span class="wd-val">{{ formatDate(wd.created_at) }}</span>
          </div>
          <div class="wd-bank-item full">
            <span class="wd-lbl">Bank</span>
            <span class="wd-val">{{ wd.bank_name }}</span>
          </div>
          <div class="wd-bank-item full">
            <span class="wd-lbl">Account Name</span>
            <span class="wd-val">{{ wd.account_name }}</span>
          </div>
          <div class="wd-bank-item full">
            <span class="wd-lbl">Account Number</span>
            <span class="wd-val mono">
              {{ wd.account_number }}
              <button class="copy-btn" @click="copy(wd.account_number)" title="Copy">
                <span class="material-symbols-outlined" style="font-size:14px">content_copy</span>
              </button>
            </span>
          </div>
          <div class="wd-bank-item full" v-if="wd.reference">
            <span class="wd-lbl">Reference</span>
            <span class="wd-val mono">{{ wd.reference }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="wd-actions" v-if="tab === 'pending'">
          <button class="btn-approve" @click="approveWd(wd)" :disabled="acting === wd.id">
            <span class="material-symbols-outlined" style="font-size:15px">check_circle</span>
            Approve — Start Processing
          </button>
          <button class="btn-reject" @click="rejectWd(wd)" :disabled="acting === wd.id">
            <span class="material-symbols-outlined" style="font-size:15px">cancel</span>
            Reject & Refund
          </button>
        </div>
        <div class="wd-actions" v-else-if="tab === 'processing'">
          <p class="wd-action-note">
            <span class="material-symbols-outlined" style="font-size:15px;color:#f59e0b">info</span>
            Send ₦{{ fmt(wd.net_amount) }} to <strong>{{ wd.account_number }}</strong> ({{ wd.bank_name }}) manually, then mark as done.
          </p>
          <button class="btn-complete" @click="completeWd(wd)" :disabled="acting === wd.id">
            <span class="material-symbols-outlined" style="font-size:15px">done_all</span>
            Mark as Sent ✓
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/services/http'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()
const loading = ref(false)
const acting  = ref(null)
const tab     = ref('pending')
const withdrawals = ref([])
const pendingCount = ref(0)
const stats = ref(null)

function fmt(n) {
  return Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function fetchWithdrawals() {
  loading.value = true
  try {
    const [wdData, statsData] = await Promise.all([
      http.get(`/admin/wallet/withdrawals?status_filter=${tab.value}`),
      http.get('/admin/wallet/stats').catch(() => null),
    ])
    withdrawals.value = wdData.withdrawals || []
    if (tab.value === 'pending') pendingCount.value = wdData.total || 0
    if (statsData) stats.value = statsData
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Failed to load withdrawals')
  } finally {
    loading.value = false
  }
}

async function approveWd(wd) {
  acting.value = wd.id
  try {
    await http.patch(`/admin/wallet/withdrawals/${wd.id}/approve`)
    uiStore.showSuccess(`Approved — move to Processing`)
    await fetchWithdrawals()
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Failed to approve')
  } finally {
    acting.value = null
  }
}

async function completeWd(wd) {
  acting.value = wd.id
  try {
    await http.patch(`/admin/wallet/withdrawals/${wd.id}/complete`)
    uiStore.showSuccess('Marked as completed')
    await fetchWithdrawals()
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Failed to complete')
  } finally {
    acting.value = null
  }
}

async function rejectWd(wd) {
  if (!confirm(`Reject this withdrawal and refund ₦${fmt(wd.amount)} to ${wd.user_name}?`)) return
  acting.value = wd.id
  try {
    await http.patch(`/admin/wallet/withdrawals/${wd.id}/reject`, { reason: 'Rejected by admin' })
    uiStore.showSuccess('Rejected — funds refunded to user wallet')
    await fetchWithdrawals()
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Failed to reject')
  } finally {
    acting.value = null
  }
}

async function copy(text) {
  await navigator.clipboard.writeText(text).catch(() => {})
  uiStore.showSuccess('Copied!')
}

onMounted(fetchWithdrawals)
</script>

<style scoped>
.admin-wallet-view { display: flex; flex-direction: column; gap: 1.25rem; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; }
.pg-title { font-family: var(--font-headline); font-size: 1.5rem; font-weight: 800; color: var(--on-surface); }
.pg-sub   { font-size: .85rem; color: var(--on-surface-variant); margin-top: .25rem; }
.btn-refresh { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.btn-refresh:hover { border-color: var(--primary); color: var(--primary); }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Stats */
.wallet-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px,1fr)); gap: .75rem; }
.wstat { background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); border-radius: 12px; padding: .875rem 1rem; }
.wstat-lbl { font-size: .72rem; color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: .04em; }
.wstat-val { font-family: var(--font-headline); font-size: 1.125rem; font-weight: 800; color: var(--on-surface); margin-top: .2rem; }

/* Tabs */
.tabs { display: flex; gap: .5rem; flex-wrap: wrap; }
.tab  { padding: .4rem 1rem; border-radius: 999px; border: 1.5px solid var(--outline-variant); background: none; font-size: .82rem; font-weight: 600; color: var(--on-surface-variant); cursor: pointer; display: flex; align-items: center; gap: .35rem; transition: all .15s; }
.tab:hover { border-color: var(--primary); color: var(--primary); }
.tab.active { border-color: var(--primary); background: color-mix(in srgb,var(--primary) 10%,transparent); color: var(--primary); }
.tab-badge { background: #f59e0b; color: #fff; font-size: .65rem; font-weight: 800; padding: .1rem .4rem; border-radius: 999px; }

/* Skeleton */
.wd-skel { height: 180px; border-radius: 16px; }
.shimmer { background: linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Empty */
.wd-empty { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: 3rem; color: var(--on-surface-variant); font-size: .9rem; }

/* Cards */
.wd-list { display: flex; flex-direction: column; gap: .875rem; }
.wd-card { background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); border-radius: 16px; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }

/* User row */
.wd-user-row { display: flex; align-items: center; gap: .875rem; }
.wd-avatar { width: 40px; height: 40px; border-radius: 50%; background: color-mix(in srgb,var(--primary) 15%,transparent); color: var(--primary); font-family: var(--font-headline); font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.wd-user-info { flex: 1; min-width: 0; }
.wd-user-name  { font-family: var(--font-headline); font-size: .95rem; font-weight: 700; color: var(--on-surface); }
.wd-user-email { font-size: .78rem; color: var(--on-surface-variant); margin-top: .1rem; }
.wd-status-pill { padding: .25rem .75rem; border-radius: 999px; font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; flex-shrink: 0; }
.wd-status-pill.pending    { background: rgba(245,158,11,.12); color: #f59e0b; }
.wd-status-pill.processing { background: rgba(99,14,212,.1);   color: var(--primary); }
.wd-status-pill.success    { background: rgba(22,163,74,.12);  color: #16a34a; }
.wd-status-pill.rejected   { background: rgba(239,68,68,.1);  color: #ef4444; }

/* Bank grid */
.wd-bank-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: .625rem .5rem; }
.wd-bank-item { display: flex; flex-direction: column; gap: .15rem; }
.wd-bank-item.full { grid-column: 1 / -1; }
.wd-lbl { font-size: .72rem; color: var(--on-surface-variant); }
.wd-val { font-size: .875rem; font-weight: 600; color: var(--on-surface); display: flex; align-items: center; gap: .35rem; }
.wd-val.amt { font-family: var(--font-headline); font-size: 1.1rem; font-weight: 800; color: var(--primary); }
.mono { font-family: monospace; font-size: .85rem !important; }
.copy-btn { border: none; background: none; cursor: pointer; color: var(--on-surface-variant); display: flex; align-items: center; padding: 0; }
.copy-btn:hover { color: var(--primary); }

/* Actions */
.wd-actions { display: flex; gap: .75rem; flex-wrap: wrap; align-items: center; padding-top: .5rem; border-top: 1px solid var(--outline-variant); }
.wd-action-note { flex: 1; font-size: .82rem; color: var(--on-surface-variant); display: flex; align-items: center; gap: .35rem; }
.btn-approve  { display: flex; align-items: center; gap: .375rem; padding: .55rem 1.25rem; border-radius: 10px; background: color-mix(in srgb,var(--primary) 12%,transparent); color: var(--primary); border: 1.5px solid var(--primary); font-size: .85rem; font-weight: 700; cursor: pointer; transition: all .15s; }
.btn-approve:hover:not(:disabled)  { background: var(--primary); color: #fff; }
.btn-complete { display: flex; align-items: center; gap: .375rem; padding: .55rem 1.25rem; border-radius: 10px; background: rgba(22,163,74,.1); color: #16a34a; border: 1.5px solid #16a34a; font-size: .85rem; font-weight: 700; cursor: pointer; transition: all .15s; }
.btn-complete:hover:not(:disabled) { background: #16a34a; color: #fff; }
.btn-reject   { display: flex; align-items: center; gap: .375rem; padding: .55rem 1.25rem; border-radius: 10px; background: rgba(239,68,68,.08); color: #ef4444; border: 1.5px solid #ef4444; font-size: .85rem; font-weight: 700; cursor: pointer; transition: all .15s; }
.btn-reject:hover:not(:disabled)   { background: #ef4444; color: #fff; }
.btn-approve:disabled, .btn-complete:disabled, .btn-reject:disabled { opacity: .5; cursor: not-allowed; }
</style>
