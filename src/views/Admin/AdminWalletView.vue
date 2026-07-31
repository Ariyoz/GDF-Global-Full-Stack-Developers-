<template>
  <div class="admin-wallet-view">

    <!-- Header -->
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
        <p class="wstat-lbl">Pending</p>
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
        @click="switchTab('pending')">
        Pending
        <span v-if="pendingCount" class="tab-badge">{{ pendingCount }}</span>
      </button>
      <button class="tab" :class="{ active: tab === 'processing' }"
        @click="switchTab('processing')">Processing</button>
      <button class="tab" :class="{ active: tab === 'success' }"
        @click="switchTab('success')">Completed</button>
      <button class="tab" :class="{ active: tab === 'rejected' }"
        @click="switchTab('rejected')">Rejected</button>
    </div>

    <!-- Loading skeletons -->
    <div v-if="loading" class="wd-list">
      <div v-for="i in 3" :key="i" class="wd-skel shimmer"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!withdrawals.length" class="wd-empty">
      <span class="material-symbols-outlined" style="font-size:2.5rem;opacity:.25">account_balance_wallet</span>
      <p>No {{ tab }} withdrawal requests</p>
    </div>

    <!-- Withdrawal cards -->
    <div v-else class="wd-list">
      <div v-for="wd in withdrawals" :key="wd.id" class="wd-card">

        <!-- User row -->
        <div class="wd-user-row">
          <div class="wd-avatar">{{ (wd.user_name || 'U')[0].toUpperCase() }}</div>
          <div class="wd-user-info">
            <p class="wd-user-name">{{ wd.user_name }}</p>
            <p class="wd-user-email">{{ wd.user_email }}</p>
          </div>
          <span class="wd-status-pill" :class="wd.status">{{ wd.status }}</span>
        </div>

        <!-- Bank details grid -->
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
            <span class="wd-val green">₦{{ fmt(wd.net_amount) }}</span>
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

        <!-- Pending actions -->
        <div class="wd-actions" v-if="tab === 'pending'">
          <div class="wd-action-info">
            <span class="material-symbols-outlined" style="font-size:15px;color:#f59e0b">info</span>
            Send ₦{{ fmt(wd.net_amount) }} to <strong>{{ wd.account_number }}</strong> ({{ wd.bank_name }}) from your bank first, then press Approve.
          </div>
          <button
            class="btn-approve"
            :disabled="busyId === wd.id"
            @click.prevent="handleApprove(wd.id)"
          >
            <span v-if="busyId === wd.id" class="btn-spinner"></span>
            <span v-else class="material-symbols-outlined" style="font-size:16px">check_circle</span>
            {{ busyId === wd.id ? 'Saving…' : 'I\'ve Sent It — Approve' }}
          </button>
          <button
            class="btn-reject"
            :disabled="busyId === wd.id"
            @click.prevent="openRejectModal(wd)"
          >
            <span class="material-symbols-outlined" style="font-size:16px">cancel</span>
            Reject & Refund
          </button>
        </div>

        <!-- Processing actions -->
        <div class="wd-actions" v-else-if="tab === 'processing'">
          <p class="wd-action-note">
            <span class="material-symbols-outlined" style="font-size:15px;color:#f59e0b">info</span>
            Send ₦{{ fmt(wd.net_amount) }} to <strong>{{ wd.account_number }}</strong>
            ({{ wd.bank_name }}) then mark done.
          </p>
          <button
            class="btn-complete"
            :disabled="busyId === wd.id"
            @click.prevent="handleComplete(wd.id)"
          >
            <span v-if="busyId === wd.id" class="btn-spinner"></span>
            <span v-else class="material-symbols-outlined" style="font-size:16px">done_all</span>
            {{ busyId === wd.id ? 'Saving…' : 'Mark as Sent ✓' }}
          </button>
        </div>

      </div>
    </div>

    <!-- ── Reject Modal ── -->
    <Teleport to="body">
      <Transition name="mfade">
        <div v-if="modal.open" class="modal-backdrop" @click.self="modal.open = false">
          <div class="modal-box">
            <h3 class="modal-title">Reject Withdrawal</h3>
            <p class="modal-sub">
              This will refund <strong>₦{{ fmt(modal.amount) }}</strong> back to
              <strong>{{ modal.user_name }}</strong>'s wallet.
            </p>
            <label class="modal-label">Reason (optional)</label>
            <textarea
              v-model="modal.reason"
              class="modal-textarea"
              rows="3"
              placeholder="e.g. Invalid bank details, suspicious activity…"
            />
            <div class="modal-actions">
              <button class="btn-ghost-sm" :disabled="modal.busy" @click="modal.open = false">
                Cancel
              </button>
              <button class="btn-reject-sm" :disabled="modal.busy" @click="handleReject">
                <span v-if="modal.busy" class="btn-spinner" style="border-color:rgba(255,255,255,.3);border-top-color:#fff"></span>
                <span v-else class="material-symbols-outlined" style="font-size:15px">cancel</span>
                {{ modal.busy ? 'Rejecting…' : 'Confirm Reject & Refund' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/services/http'
import { useUiStore } from '@/store/ui'

const ui = useUiStore()

// ── state ──────────────────────────────────────────────────────────────────
const loading      = ref(false)
const busyId       = ref(null)   // id of the card currently being processed
const tab          = ref('pending')
const withdrawals  = ref([])
const pendingCount = ref(0)
const stats        = ref(null)

// reject modal
const modal = ref({
  open: false, busy: false,
  id: null, user_name: '', amount: 0, reason: '',
})

// ── helpers ────────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatDate = (d) => d
  ? new Date(d).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—'

// ── data fetching ──────────────────────────────────────────────────────────
async function fetchWithdrawals() {
  loading.value = true
  try {
    const [wdRes, statsRes] = await Promise.allSettled([
      http.get(`/admin/wallet/withdrawals?status_filter=${tab.value}`),
      http.get('/admin/wallet/stats'),
    ])
    if (wdRes.status === 'fulfilled') {
      withdrawals.value = wdRes.value?.withdrawals || []
      if (tab.value === 'pending') pendingCount.value = wdRes.value?.total || 0
    } else {
      ui.showError('Failed to load withdrawals: ' + (wdRes.reason?.response?.data?.detail || wdRes.reason?.message || 'unknown error'))
    }
    if (statsRes.status === 'fulfilled') stats.value = statsRes.value
  } finally {
    loading.value = false
  }
}

function switchTab(t) {
  tab.value = t
  fetchWithdrawals()
}

// ── approve ────────────────────────────────────────────────────────────────
async function handleApprove(id) {
  if (busyId.value === id) return   // already in flight
  busyId.value = id
  try {
    const res = await http.patch(`/admin/wallet/withdrawals/${id}/approve`)
    ui.showSuccess(res?.message || '✅ Approved — user notified')
    await fetchWithdrawals()
  } catch (err) {
    const msg = err?.response?.data?.detail || err?.message || 'Approve failed'
    ui.showError('❌ ' + msg)
    console.error('[approve]', err)
  } finally {
    busyId.value = null
  }
}

// ── complete (processing → success) ───────────────────────────────────────
async function handleComplete(id) {
  if (busyId.value === id) return
  busyId.value = id
  try {
    const res = await http.patch(`/admin/wallet/withdrawals/${id}/complete`)
    ui.showSuccess(res?.message || '✅ Marked as completed')
    await fetchWithdrawals()
  } catch (err) {
    const msg = err?.response?.data?.detail || err?.message || 'Complete failed'
    ui.showError('❌ ' + msg)
    console.error('[complete]', err)
  } finally {
    busyId.value = null
  }
}

// ── reject ─────────────────────────────────────────────────────────────────
function openRejectModal(wd) {
  modal.value = {
    open: true, busy: false,
    id: wd.id,
    user_name: wd.user_name,
    amount: wd.amount,
    reason: '',
  }
}

async function handleReject() {
  if (modal.value.busy) return
  modal.value.busy = true
  const { id, reason } = modal.value
  try {
    const res = await http.patch(`/admin/wallet/withdrawals/${id}/reject`, {
      reason: reason.trim() || 'Rejected by admin',
    })
    ui.showSuccess(res?.message || '✅ Rejected — funds refunded to user wallet')
    modal.value.open = false
    await fetchWithdrawals()
  } catch (err) {
    const msg = err?.response?.data?.detail || err?.message || 'Reject failed'
    ui.showError('❌ ' + msg)
    console.error('[reject]', err)
  } finally {
    modal.value.busy = false
  }
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text) } catch {}
  ui.showSuccess('Copied!')
}

onMounted(fetchWithdrawals)
</script>

<style scoped>
/* ── Layout ── */
.admin-wallet-view { display:flex; flex-direction:column; gap:1.25rem; padding:1rem; }
@media(min-width:768px){ .admin-wallet-view{ padding:1.5rem 2rem; } }

.page-header { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; }
.pg-title { font-family:var(--font-headline); font-size:1.3rem; font-weight:800; color:var(--on-surface); }
@media(min-width:480px){ .pg-title{ font-size:1.5rem; } }
.pg-sub { font-size:.85rem; color:var(--on-surface-variant); margin-top:.25rem; }

.btn-refresh { width:38px; height:38px; flex-shrink:0; border-radius:50%; border:1px solid var(--outline-variant); background:var(--surface-container); color:var(--on-surface-variant); display:flex; align-items:center; justify-content:center; cursor:pointer; }
.btn-refresh:hover { border-color:var(--primary); color:var(--primary); }
.spin { animation:spin 1s linear infinite; }
@keyframes spin{ to{ transform:rotate(360deg); } }

/* Stats */
.wallet-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:.625rem; }
@media(min-width:480px){ .wallet-stats{ grid-template-columns:repeat(3,1fr); } }
@media(min-width:768px){ .wallet-stats{ grid-template-columns:repeat(5,1fr); } }
.wstat { background:var(--surface-container-lowest); border:1px solid var(--outline-variant); border-radius:12px; padding:.75rem 1rem; }
.wstat-lbl { font-size:.68rem; color:var(--on-surface-variant); text-transform:uppercase; letter-spacing:.04em; }
.wstat-val { font-family:var(--font-headline); font-size:1.05rem; font-weight:800; color:var(--on-surface); margin-top:.2rem; }

/* Tabs */
.tabs { display:flex; gap:.375rem; flex-wrap:wrap; }
.tab { padding:.4rem .875rem; border-radius:999px; border:1.5px solid var(--outline-variant); background:none; font-size:.78rem; font-weight:600; color:var(--on-surface-variant); cursor:pointer; display:flex; align-items:center; gap:.3rem; transition:all .15s; white-space:nowrap; }
.tab:hover { border-color:var(--primary); color:var(--primary); }
.tab.active { border-color:var(--primary); background:color-mix(in srgb,var(--primary) 10%,transparent); color:var(--primary); }
.tab-badge { background:#f59e0b; color:#fff; font-size:.62rem; font-weight:800; padding:.1rem .35rem; border-radius:999px; }

/* Skeleton */
.wd-skel { height:180px; border-radius:16px; }
.shimmer { background:linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
@keyframes shimmer{ 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Empty */
.wd-empty { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:3rem 1rem; color:var(--on-surface-variant); font-size:.9rem; text-align:center; }

/* Cards */
.wd-list { display:flex; flex-direction:column; gap:.875rem; }
.wd-card { background:var(--surface-container-lowest); border:1px solid var(--outline-variant); border-radius:16px; padding:1rem; display:flex; flex-direction:column; gap:.875rem; }
@media(min-width:480px){ .wd-card{ padding:1.25rem; gap:1rem; } }

/* User row */
.wd-user-row { display:flex; align-items:center; gap:.75rem; }
.wd-avatar { width:38px; height:38px; border-radius:50%; background:color-mix(in srgb,var(--primary) 15%,transparent); color:var(--primary); font-family:var(--font-headline); font-weight:800; font-size:1rem; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.wd-user-info { flex:1; min-width:0; }
.wd-user-name { font-family:var(--font-headline); font-size:.9rem; font-weight:700; color:var(--on-surface); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.wd-user-email { font-size:.75rem; color:var(--on-surface-variant); margin-top:.1rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.wd-status-pill { padding:.2rem .6rem; border-radius:999px; font-size:.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.04em; flex-shrink:0; }
.wd-status-pill.pending    { background:rgba(245,158,11,.12); color:#f59e0b; }
.wd-status-pill.processing { background:rgba(99,14,212,.1);   color:var(--primary); }
.wd-status-pill.success    { background:rgba(22,163,74,.12);  color:#16a34a; }
.wd-status-pill.rejected   { background:rgba(239,68,68,.1);   color:#ef4444; }

/* Bank grid */
.wd-bank-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:.5rem; }
.wd-bank-item { display:flex; flex-direction:column; gap:.15rem; min-width:0; }
.wd-bank-item.full { grid-column:1/-1; }
.wd-lbl { font-size:.68rem; color:var(--on-surface-variant); }
.wd-val { font-size:.85rem; font-weight:600; color:var(--on-surface); display:flex; align-items:center; gap:.3rem; flex-wrap:wrap; word-break:break-word; }
.wd-val.amt { font-family:var(--font-headline); font-size:1.05rem; font-weight:800; color:var(--primary); }
.wd-val.green { color:#16a34a; font-weight:700; }
.mono { font-family:monospace; font-size:.82rem !important; word-break:break-all; }
.copy-btn { border:none; background:none; cursor:pointer; color:var(--on-surface-variant); display:flex; align-items:center; padding:0; flex-shrink:0; }
.copy-btn:hover { color:var(--primary); }

/* Actions */
.wd-actions { display:flex; gap:.625rem; flex-wrap:wrap; align-items:center; padding-top:.75rem; border-top:1px solid var(--outline-variant); }
.wd-action-info { flex:1 1 100%; font-size:.8rem; color:var(--on-surface-variant); display:flex; align-items:flex-start; gap:.35rem; flex-wrap:wrap; padding:.5rem .75rem; background:rgba(245,158,11,.07); border-radius:8px; border:1px solid rgba(245,158,11,.2); }
.wd-action-note { flex:1 1 100%; font-size:.8rem; color:var(--on-surface-variant); display:flex; align-items:flex-start; gap:.35rem; flex-wrap:wrap; }
@media(min-width:600px){ .wd-action-note{ flex:1 1 auto; } }

/* Action buttons */
.btn-approve, .btn-reject, .btn-complete {
  display:flex; align-items:center; justify-content:center; gap:.4rem;
  padding:.65rem 1.25rem; border-radius:10px; font-size:.85rem; font-weight:700;
  cursor:pointer; transition:all .15s; flex:1 1 auto;
  min-height:42px;
}
@media(min-width:480px){ .btn-approve,.btn-reject,.btn-complete{ flex:0 1 auto; } }
.btn-approve { background:color-mix(in srgb,var(--primary) 12%,transparent); color:var(--primary); border:1.5px solid var(--primary); }
.btn-approve:hover:not(:disabled) { background:var(--primary); color:#fff; }
.btn-complete { background:rgba(22,163,74,.1); color:#16a34a; border:1.5px solid #16a34a; }
.btn-complete:hover:not(:disabled) { background:#16a34a; color:#fff; }
.btn-reject { background:rgba(239,68,68,.08); color:#ef4444; border:1.5px solid #ef4444; }
.btn-reject:hover:not(:disabled) { background:#ef4444; color:#fff; }
.btn-approve:disabled, .btn-complete:disabled, .btn-reject:disabled { opacity:.4; cursor:not-allowed; }

/* Spinner inside button */
.btn-spinner {
  width:14px; height:14px; border-radius:50%; flex-shrink:0;
  border:2px solid rgba(99,14,212,.25);
  border-top-color:var(--primary);
  animation:spin .7s linear infinite;
}

/* Reject Modal */
.modal-backdrop { position:fixed; inset:0; z-index:1000; background:rgba(0,0,0,.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:1rem; }
.modal-box { background:var(--surface-container-lowest); border:1px solid var(--outline-variant); border-radius:18px; padding:1.5rem; width:100%; max-width:420px; display:flex; flex-direction:column; gap:.875rem; }
.modal-title { font-family:var(--font-headline); font-size:1.1rem; font-weight:800; color:var(--on-surface); }
.modal-sub { font-size:.875rem; color:var(--on-surface-variant); }
.modal-label { font-size:.75rem; font-weight:600; color:var(--on-surface-variant); }
.modal-textarea { width:100%; padding:.625rem .75rem; resize:vertical; background:var(--surface-container); border:1.5px solid var(--outline-variant); border-radius:10px; color:var(--on-surface); font-size:.875rem; font-family:inherit; box-sizing:border-box; }
.modal-textarea:focus { outline:none; border-color:var(--primary); }
.modal-actions { display:flex; gap:.625rem; justify-content:flex-end; flex-wrap:wrap; }
.btn-ghost-sm { padding:.5rem 1rem; border-radius:8px; border:1px solid var(--outline-variant); background:none; color:var(--on-surface-variant); font-size:.82rem; font-weight:600; cursor:pointer; }
.btn-ghost-sm:hover:not(:disabled) { background:var(--surface-container); }
.btn-reject-sm { display:flex; align-items:center; gap:.4rem; padding:.55rem 1.1rem; border-radius:8px; background:#ef4444; color:#fff; border:none; font-size:.82rem; font-weight:700; cursor:pointer; min-height:38px; }
.btn-reject-sm:hover:not(:disabled) { background:#dc2626; }
.btn-reject-sm:disabled, .btn-ghost-sm:disabled { opacity:.5; cursor:not-allowed; }

.mfade-enter-active, .mfade-leave-active { transition:opacity .2s ease; }
.mfade-enter-from, .mfade-leave-to { opacity:0; }
</style>
