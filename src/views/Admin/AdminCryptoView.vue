<template>
  <div class="admin-crypto-view">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="pg-title">Crypto Wallet</h1>
        <p class="pg-sub">Live overview of all user crypto deposits, sends, and balances.</p>
      </div>
      <button class="btn-refresh" @click="load" :disabled="loading">
        <span class="material-symbols-outlined" :class="{ spin: loading }">refresh</span>
      </button>
    </div>

    <!-- Stats cards -->
    <div class="crypto-stats" v-if="overview">
      <div class="cs-card">
        <div class="cs-icon" style="background:rgba(247,147,26,.12);color:#F7931A">₿</div>
        <div>
          <p class="cs-lbl">Active Users</p>
          <p class="cs-val">{{ overview.total_users }}</p>
        </div>
      </div>
      <div class="cs-card" v-for="c in overview.by_coin" :key="c.coin">
        <CoinIcon :coin="c.coin" :size="36" class="cs-coin-icon" />
        <div>
          <p class="cs-lbl">{{ c.symbol }} Balance</p>
          <p class="cs-val">{{ fmtCoin(c.net_balance, c.coin) }}</p>
          <p class="cs-sub">{{ c.deposit_count }} deposits · {{ c.withdrawal_count }} sends</p>
        </div>
      </div>
      <div class="cs-card pending-card" v-if="overview.pending_sends > 0">
        <div class="cs-icon" style="background:rgba(245,158,11,.12);color:#f59e0b">
          <span class="material-symbols-outlined">schedule</span>
        </div>
        <div>
          <p class="cs-lbl">Pending Sends</p>
          <p class="cs-val" style="color:#f59e0b">{{ overview.pending_sends }}</p>
          <p class="cs-sub">Awaiting manual broadcast</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-row">
      <div class="filter-tabs">
        <button v-for="t in typeTabs" :key="t.value"
          class="filter-tab" :class="{ active: filterType === t.value }"
          @click="filterType = t.value; loadTxs()">{{ t.label }}</button>
      </div>
      <div class="filter-right">
        <select class="filter-select" v-model="filterCoin" @change="loadTxs()">
          <option value="">All Coins</option>
          <option value="btc">BTC</option>
          <option value="eth">ETH</option>
          <option value="sol">SOL</option>
          <option value="usdt">USDT</option>
          <option value="usdc">USDC</option>
        </select>
        <select class="filter-select" v-model="filterStatus" @change="loadTxs()">
          <option value="">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
    </div>

    <!-- Transactions table -->
    <div class="tx-table-card">
      <div class="tx-table-hdr">
        <h3 class="tx-table-title">Transactions</h3>
        <span class="tx-table-count">{{ totalTxs }} records</span>
      </div>

      <div v-if="txLoading" class="tx-empty-state">
        <div class="spinner"></div>
      </div>
      <div v-else-if="!txs.length" class="tx-empty-state">
        <span class="material-symbols-outlined" style="font-size:2.5rem;opacity:.2">currency_bitcoin</span>
        <p>No transactions found</p>
      </div>

      <div v-else class="tx-table-wrap">
        <table class="tx-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Coin</th>
              <th>Type</th>
              <th>Amount</th>
              <th>USD</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in txs" :key="tx.id">
              <td>
                <div class="user-cell">
                  <img v-if="tx.user_avatar" :src="tx.user_avatar" class="user-av" />
                  <div v-else class="user-av-placeholder">{{ tx.user_name?.[0] }}</div>
                  <div>
                    <p class="user-name">{{ tx.user_name }}</p>
                    <p class="user-email">{{ tx.user_email }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="coin-cell">
                  <CoinIcon :coin="tx.coin" :size="22" />
                  <span>{{ tx.symbol }}</span>
                </div>
              </td>
              <td>
                <span class="type-badge" :class="tx.type">{{ tx.type }}</span>
              </td>
              <td class="amount-cell" :class="tx.type === 'deposit' ? 'pos' : 'neg'">
                {{ tx.type === 'deposit' ? '+' : '-' }}{{ fmtCoin(tx.amount, tx.coin) }}
              </td>
              <td class="usd-cell">${{ fmtUsd(tx.usd_value) }}</td>
              <td>
                <span class="status-badge" :class="tx.status">{{ tx.status }}</span>
              </td>
              <td class="date-cell">{{ fmtDate(tx.created_at) }}</td>
              <td>
                <div v-if="tx.type === 'withdrawal' && tx.status === 'pending'" class="action-cell">
                  <button class="btn-complete" @click="completeSend(tx)"
                    :disabled="completing === tx.id">
                    <span v-if="completing === tx.id" class="btn-spinner-sm"></span>
                    <span v-else class="material-symbols-outlined" style="font-size:15px">check</span>
                    Mark Sent
                  </button>
                  <p class="to-addr" v-if="tx.to_address" :title="tx.to_address">
                    → {{ tx.to_address.slice(0,10) }}…
                  </p>
                </div>
                <span v-else-if="tx.tx_hash" class="tx-hash" :title="tx.tx_hash">
                  {{ tx.tx_hash.slice(0,10) }}…
                </span>
                <span v-else class="no-action">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalTxs > pageSize">
        <button class="pg-btn" :disabled="page <= 1" @click="page--; loadTxs()">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <span class="pg-info">Page {{ page }} of {{ Math.ceil(totalTxs / pageSize) }}</span>
        <button class="pg-btn" :disabled="page * pageSize >= totalTxs" @click="page++; loadTxs()">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>

    <!-- Recent activity (from overview) -->
    <div class="recent-card" v-if="overview?.recent_txs?.length">
      <h3 class="recent-title">Recent Activity</h3>
      <div v-for="tx in overview.recent_txs" :key="tx.id" class="recent-row">
        <CoinIcon :coin="tx.coin" :size="28" />
        <div class="recent-info">
          <p class="recent-main">
            <strong>{{ tx.user_name }}</strong>
            {{ tx.type === 'deposit' ? 'deposited' : 'sent' }}
            <strong>{{ fmtCoin(tx.amount, tx.coin) }} {{ tx.symbol }}</strong>
          </p>
          <p class="recent-sub">{{ tx.user_email }} · {{ fmtDate(tx.created_at) }}</p>
        </div>
        <span class="status-badge" :class="tx.status">{{ tx.status }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CoinIcon from '@/components/CoinIcon.vue'
import http from '@/services/http'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()

const loading    = ref(false)
const txLoading  = ref(false)
const overview   = ref(null)
const txs        = ref([])
const totalTxs   = ref(0)
const page       = ref(1)
const pageSize   = 50
const filterType   = ref('')
const filterCoin   = ref('')
const filterStatus = ref('')
const completing   = ref(null)

const typeTabs = [
  { label: 'All',       value: '' },
  { label: 'Deposits',  value: 'deposit' },
  { label: 'Sends',     value: 'withdrawal' },
]

function fmtCoin(n, coin) {
  const decimals = ['btc','eth','sol'].includes(coin?.toLowerCase()) ? 6 : 2
  return Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: decimals })
}
function fmtUsd(n) {
  return Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-NG', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

async function load() {
  loading.value = true
  try {
    const data = await http.get('/crypto/admin/overview')
    overview.value = data
  } catch { /* silent */ }
  finally { loading.value = false }
  await loadTxs()
}

async function loadTxs() {
  txLoading.value = true
  try {
    const params = new URLSearchParams({
      page: page.value,
      page_size: pageSize,
    })
    if (filterType.value)   params.append('tx_type', filterType.value)
    if (filterCoin.value)   params.append('coin', filterCoin.value)
    if (filterStatus.value) params.append('status', filterStatus.value)
    const data = await http.get(`/crypto/admin/transactions?${params}`)
    txs.value      = data.transactions || []
    totalTxs.value = data.total || 0
  } catch { /* silent */ }
  finally { txLoading.value = false }
}

async function completeSend(tx) {
  completing.value = tx.id
  try {
    await http.patch(`/crypto/admin/transactions/${tx.id}/complete`, {})
    uiStore.showSuccess(`${tx.symbol} send marked as completed`)
    await load()
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Failed to update transaction')
  } finally { completing.value = null }
}

onMounted(load)
</script>

<style scoped>
.admin-crypto-view { display: flex; flex-direction: column; gap: 1.5rem; padding-bottom: 3rem; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.pg-title    { font-family: var(--font-headline); font-size: 1.5rem; font-weight: 800; color: var(--on-surface); }
.pg-sub      { font-size: .85rem; color: var(--on-surface-variant); margin-top: .2rem; }
.btn-refresh { width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; flex-shrink: 0; }
.btn-refresh:hover { border-color: var(--primary); color: var(--primary); }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Stats */
.crypto-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr)); gap: .875rem; }
.cs-card      { background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant); border-radius: 16px; padding: 1rem 1.25rem; display: flex; align-items: center; gap: .875rem; }
.cs-icon      { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; flex-shrink: 0; }
.cs-coin-icon { flex-shrink: 0; }
.cs-lbl       { font-size: .73rem; color: var(--on-surface-variant); margin-bottom: .2rem; }
.cs-val       { font-family: var(--font-headline); font-size: 1.1rem; font-weight: 800; color: var(--on-surface); }
.cs-sub       { font-size: .68rem; color: var(--on-surface-variant); margin-top: .15rem; }
.pending-card { border-color: rgba(245,158,11,.3); }

/* Filters */
.filters-row   { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.filter-tabs   { display: flex; gap: .375rem; background: var(--surface-container-low); padding: .3rem; border-radius: 12px; }
.filter-tab    { padding: .45rem 1rem; border-radius: 9px; border: none; background: transparent; font-family: var(--font-headline); font-size: .82rem; font-weight: 700; color: var(--on-surface-variant); cursor: pointer; transition: all .15s; }
.filter-tab.active { background: var(--surface-container-highest); color: var(--primary); }
.filter-right  { display: flex; gap: .5rem; }
.filter-select { padding: .5rem .875rem; border-radius: 10px; border: 1.5px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface); font-size: .83rem; cursor: pointer; }

/* Table card */
.tx-table-card  { background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant); border-radius: 20px; overflow: hidden; }
.tx-table-hdr   { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--outline-variant); }
.tx-table-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }
.tx-table-count { font-size: .75rem; color: var(--on-surface-variant); background: var(--surface-container); padding: .2rem .65rem; border-radius: 999px; }
.tx-empty-state { display: flex; flex-direction: column; align-items: center; gap: .75rem; padding: 3rem 1rem; color: var(--on-surface-variant); }
.spinner        { width: 28px; height: 28px; border-radius: 50%; border: 3px solid rgba(99,14,212,.15); border-top-color: var(--primary); animation: spin 1s linear infinite; }
.tx-table-wrap  { overflow-x: auto; }
.tx-table       { width: 100%; border-collapse: collapse; font-size: .83rem; }
.tx-table th    { padding: .75rem 1rem; text-align: left; font-size: .7rem; text-transform: uppercase; letter-spacing: .06em; color: var(--on-surface-variant); font-family: var(--font-headline); background: var(--surface-container-low); border-bottom: 1px solid var(--outline-variant); white-space: nowrap; }
.tx-table td    { padding: .875rem 1rem; border-bottom: 1px solid var(--outline-variant); vertical-align: middle; }
.tx-table tr:last-child td { border-bottom: none; }
.tx-table tr:hover td { background: var(--surface-container-low); }

.user-cell      { display: flex; align-items: center; gap: .625rem; min-width: 160px; }
.user-av        { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.user-av-placeholder { width: 32px; height: 32px; border-radius: 50%; background: var(--surface-container-high); display: flex; align-items: center; justify-content: center; font-family: var(--font-headline); font-size: .85rem; font-weight: 700; color: var(--on-surface-variant); flex-shrink: 0; }
.user-name      { font-weight: 600; color: var(--on-surface); font-size: .83rem; white-space: nowrap; }
.user-email     { font-size: .72rem; color: var(--on-surface-variant); white-space: nowrap; }
.coin-cell      { display: flex; align-items: center; gap: .4rem; font-weight: 700; font-family: var(--font-headline); }
.type-badge     { font-size: .68rem; font-weight: 800; text-transform: uppercase; padding: .2rem .55rem; border-radius: 999px; letter-spacing: .04em; }
.type-badge.deposit    { background: rgba(22,163,74,.1);  color: #16a34a; }
.type-badge.withdrawal { background: rgba(239,68,68,.1);  color: #ef4444; }
.amount-cell    { font-family: var(--font-headline); font-weight: 700; white-space: nowrap; }
.amount-cell.pos { color: #16a34a; }
.amount-cell.neg { color: #ef4444; }
.usd-cell       { color: var(--on-surface-variant); }
.date-cell      { color: var(--on-surface-variant); font-size: .78rem; white-space: nowrap; }
.status-badge   { font-size: .68rem; font-weight: 800; text-transform: uppercase; padding: .2rem .55rem; border-radius: 999px; letter-spacing: .04em; }
.status-badge.confirmed { background: rgba(22,163,74,.1); color: #16a34a; }
.status-badge.pending   { background: rgba(245,158,11,.1); color: #f59e0b; }
.status-badge.failed    { background: rgba(239,68,68,.1);  color: #ef4444; }
.action-cell    { display: flex; flex-direction: column; gap: .25rem; }
.btn-complete   { display: flex; align-items: center; gap: .3rem; padding: .35rem .75rem; border-radius: 8px; background: rgba(22,163,74,.1); border: 1.5px solid rgba(22,163,74,.2); color: #16a34a; font-size: .75rem; font-weight: 700; cursor: pointer; transition: all .15s; white-space: nowrap; }
.btn-complete:hover { background: rgba(22,163,74,.2); }
.btn-complete:disabled { opacity: .5; cursor: not-allowed; }
.btn-spinner-sm { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(22,163,74,.2); border-top-color: #16a34a; animation: spin 1s linear infinite; }
.to-addr        { font-size: .68rem; color: var(--on-surface-variant); font-family: monospace; }
.tx-hash        { font-family: monospace; font-size: .75rem; color: var(--on-surface-variant); }
.no-action      { color: var(--on-surface-variant); opacity: .4; }

/* Pagination */
.pagination  { display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 1rem; border-top: 1px solid var(--outline-variant); }
.pg-btn      { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid var(--outline-variant); background: var(--surface-container); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; color: var(--on-surface-variant); }
.pg-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
.pg-btn:disabled { opacity: .35; cursor: not-allowed; }
.pg-info     { font-size: .83rem; color: var(--on-surface-variant); }

/* Recent card */
.recent-card   { background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant); border-radius: 20px; padding: 1.5rem; }
.recent-title  { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); margin-bottom: 1rem; }
.recent-row    { display: flex; align-items: center; gap: .875rem; padding: .75rem 0; border-bottom: 1px solid var(--outline-variant); }
.recent-row:last-child { border-bottom: none; }
.recent-info   { flex: 1; min-width: 0; }
.recent-main   { font-size: .875rem; color: var(--on-surface); line-height: 1.4; }
.recent-main strong { font-weight: 700; }
.recent-sub    { font-size: .72rem; color: var(--on-surface-variant); margin-top: .15rem; }
</style>
