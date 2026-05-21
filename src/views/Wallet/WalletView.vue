<template>
  <div class="wallet-view">
    <div class="page-header">
      <div>
        <h2 class="text-headline-md">Wallet</h2>
        <p class="text-body-md" style="margin-top:0.25rem">Manage your earnings and transactions.</p>
      </div>
    </div>

    <!-- Balance Card -->
    <div class="balance-card">
      <div class="balance-glow" />
      <div class="balance-content">
        <p class="balance-label">Total Balance</p>
        <p class="balance-amount">$4,280.00</p>
        <p class="balance-sub">Available for withdrawal</p>
      </div>
      <div class="balance-stats">
        <div class="bstat">
          <span class="material-symbols-outlined bstat-icon">trending_up</span>
          <div>
            <p class="bstat-value">$2,400</p>
            <p class="bstat-label">This month</p>
          </div>
        </div>
        <div class="bstat-divider" />
        <div class="bstat">
          <span class="material-symbols-outlined bstat-icon">account_balance</span>
          <div>
            <p class="bstat-value">$12,840</p>
            <p class="bstat-label">All time</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <button v-for="action in quickActions" :key="action.label" class="quick-action glass-card" @click="action.handler">
        <div class="qa-icon-wrap" :style="{ background: action.bg }">
          <span class="material-symbols-outlined" :style="{ color: action.color }">{{ action.icon }}</span>
        </div>
        <span class="qa-label">{{ action.label }}</span>
      </button>
    </div>

    <!-- Earnings Chart -->
    <div class="glass-card-static chart-card">
      <div class="card-header">
        <h3 class="text-label-md">Earnings Overview</h3>
        <span class="chip">Last 7 days</span>
      </div>
      <div class="chart-bars">
        <div v-for="(day, i) in chartData" :key="day.label" class="bar-col">
          <span class="bar-value">${{ day.amount }}</span>
          <div class="bar-wrap">
            <div class="bar-fill" :style="{ height: day.pct + '%', animationDelay: i * 0.06 + 's' }" />
          </div>
          <span class="bar-label">{{ day.label }}</span>
        </div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="glass-card-static table-card">
      <div class="card-header" style="margin-bottom:1rem">
        <h3 class="text-label-md">Transaction History</h3>
        <button class="btn-ghost" style="font-size:0.8rem">Export</button>
      </div>

      <!-- Desktop table header — hidden on mobile -->
      <div class="tx-head">
        <span>Transaction</span>
        <span>Date</span>
        <span>Amount</span>
        <span>Status</span>
      </div>

      <!-- Each row is a card on mobile, a grid row on desktop -->
      <div v-for="tx in transactions" :key="tx.id" class="tx-row">
        <!-- Left: icon + name + desc -->
        <div class="tx-info">
          <div class="tx-icon-wrap" :style="{ background: tx.bg }">
            <span class="material-symbols-outlined tx-icon" :style="{ color: tx.color }">{{ tx.icon }}</span>
          </div>
          <div class="tx-text">
            <p class="tx-name">{{ tx.name }}</p>
            <p class="tx-desc">{{ tx.desc }}</p>
          </div>
        </div>

        <!-- Right side: amount + status stacked on mobile, separate cols on desktop -->
        <div class="tx-right">
          <span class="tx-amount" :class="tx.positive ? 'positive' : 'negative'">
            {{ tx.positive ? '+' : '-' }}${{ tx.amount }}
          </span>
          <GfdBadge :variant="tx.statusVariant">{{ tx.status }}</GfdBadge>
        </div>

        <!-- Date — shown inline on mobile below name, separate col on desktop -->
        <span class="tx-date">{{ tx.date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GfdBadge from '@/components/ui/GfdBadge.vue'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()

const quickActions = [
  { label: 'Withdraw',   icon: 'arrow_upward',   bg: 'rgba(99,14,212,0.08)',  color: 'var(--primary)',  handler: () => uiStore.showInfo('Withdrawal coming soon') },
  { label: 'Add Funds',  icon: 'add_circle',     bg: 'rgba(22,163,74,0.08)', color: '#16a34a',          handler: () => uiStore.showInfo('Add funds coming soon') },
  { label: 'Send',       icon: 'send',           bg: 'rgba(161,81,0,0.08)',  color: 'var(--tertiary)',  handler: () => uiStore.showInfo('Send money coming soon') },
]

const chartData = [
  { label: 'Mon', pct: 30,  amount: 200 },
  { label: 'Tue', pct: 60,  amount: 400 },
  { label: 'Wed', pct: 45,  amount: 300 },
  { label: 'Thu', pct: 100, amount: 800 },
  { label: 'Fri', pct: 55,  amount: 350 },
  { label: 'Sat', pct: 20,  amount: 150 },
  { label: 'Sun', pct: 30,  amount: 200 },
]

const transactions = ref([
  { id: 1, icon: 'payments',      color: '#16a34a',         bg: 'rgba(22,163,74,0.08)',  name: 'Project Payment',   desc: 'FinTrack Dashboard',   date: 'Jun 14, 2024', amount: '800.00',  positive: true,  status: 'Completed', statusVariant: 'success' },
  { id: 2, icon: 'work',          color: 'var(--primary)',  bg: 'rgba(99,14,212,0.08)',  name: 'Job Bonus',         desc: 'ShopFlow Mobile',      date: 'Jun 12, 2024', amount: '200.00',  positive: true,  status: 'Completed', statusVariant: 'success' },
  { id: 3, icon: 'arrow_upward',  color: 'var(--error)',    bg: 'rgba(186,26,26,0.08)',  name: 'Withdrawal',        desc: 'Bank Transfer',        date: 'Jun 10, 2024', amount: '500.00',  positive: false, status: 'Completed', statusVariant: 'success' },
  { id: 4, icon: 'payments',      color: '#16a34a',         bg: 'rgba(22,163,74,0.08)',  name: 'Project Payment',   desc: 'MedConnect Portal',    date: 'Jun 8, 2024',  amount: '1200.00', positive: true,  status: 'Pending',   statusVariant: 'warning' },
  { id: 5, icon: 'star',          color: '#f59e0b',         bg: 'rgba(245,158,11,0.08)', name: 'Referral Bonus',    desc: 'New member referral',  date: 'Jun 5, 2024',  amount: '50.00',   positive: true,  status: 'Completed', statusVariant: 'success' },
])
</script>

<style scoped>
.wallet-view { display: flex; flex-direction: column; gap: 1.25rem; }

.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap;
}

/* ── Balance Card — always dark gradient ── */
.balance-card {
  position: relative;
  background: linear-gradient(135deg, #1a0840 0%, #2d1060 60%, #1a1a2e 100%);
  border-radius: var(--radius-2xl);
  padding: 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: 1px solid rgba(168,85,247,0.2);
}

@media (min-width: 640px) {
  .balance-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
  }
}

.balance-glow {
  position: absolute; top: -60px; right: -60px;
  width: 200px; height: 200px; border-radius: 50%;
  background: radial-gradient(circle, rgba(99,14,212,0.4) 0%, transparent 70%);
  pointer-events: none;
}

.balance-label {
  font-size: 0.75rem; color: rgba(255,255,255,0.6);
  font-family: var(--font-headline); text-transform: uppercase; letter-spacing: 0.05em;
}
.balance-amount {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 6vw, 2.5rem);
  font-weight: 700; color: #fff; letter-spacing: -0.02em; margin-top: 0.25rem;
}
.balance-sub { font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-top: 0.2rem; }

.balance-stats { display: flex; align-items: center; gap: 1.25rem; }
.bstat { display: flex; align-items: center; gap: 0.625rem; }
.bstat-icon { font-size: 18px; color: rgba(255,255,255,0.6); }
.bstat-value { font-family: var(--font-headline); font-size: 0.9375rem; font-weight: 700; color: #fff; }
.bstat-label { font-size: 0.68rem; color: rgba(255,255,255,0.5); margin-top: 0.1rem; }
.bstat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.15); }

/* ── Quick Actions ── */
.quick-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }

.quick-action {
  display: flex; flex-direction: column; align-items: center; gap: 0.625rem;
  padding: 1rem 0.5rem;
  cursor: pointer; border: none;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-slow);
}
.quick-action:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

.qa-icon-wrap {
  width: 44px; height: 44px;
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
}
.qa-label { font-family: var(--font-headline); font-size: 0.75rem; font-weight: 600; color: var(--on-surface); }

/* ── Chart ── */
.chart-card { padding: 1.25rem; border-radius: var(--radius-xl); }

.card-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.25rem;
}

.chart-bars {
  display: flex; align-items: flex-end; gap: 0.375rem;
  height: 120px;
}

.bar-col {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
  height: 100%;
}

/* Hide bar values on very small screens */
.bar-value {
  font-size: 0.6rem; color: var(--on-surface-variant);
  font-family: var(--font-headline);
  display: none;
}
@media (min-width: 400px) { .bar-value { display: block; } }

.bar-wrap {
  flex: 1; width: 100%;
  display: flex; align-items: flex-end;
  background: var(--surface-container);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  animation: barGrow 0.6s ease forwards;
}

.bar-label { font-size: 0.65rem; color: var(--on-surface-variant); font-family: var(--font-headline); }

/* ── Transaction Table — mobile-first card layout ── */
.table-card { padding: 1.25rem; border-radius: var(--radius-xl); }

/* Desktop-only header row */
.tx-head {
  display: none;
}
@media (min-width: 640px) {
  .tx-head {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.68rem; font-weight: 700;
    color: var(--on-surface-variant);
    text-transform: uppercase; letter-spacing: 0.05em;
    border-bottom: 1px solid var(--outline-variant);
    margin-bottom: 0.25rem;
  }
}

/* Mobile: card-style row */
.tx-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.875rem 0.5rem;
  border-bottom: 1px solid var(--outline-variant);
  transition: var(--transition-fast);
}
.tx-row:last-child { border-bottom: none; }
.tx-row:hover { background: var(--surface-container-low); border-radius: var(--radius-lg); }

/* Desktop: 4-column grid */
@media (min-width: 640px) {
  .tx-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 0.875rem 0.75rem;
    border-bottom: none;
    border-radius: var(--radius-lg);
  }
  /* On desktop, date is its own column — show it */
  .tx-date { display: block; }
  /* On desktop, right side is just amount + badge in separate cols */
  .tx-right { display: contents; }
}

.tx-info { display: flex; align-items: center; gap: 0.625rem; min-width: 0; flex: 1; }

.tx-icon-wrap {
  width: 36px; height: 36px; border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.tx-icon { font-size: 18px; }

.tx-text { min-width: 0; }
.tx-name { font-family: var(--font-headline); font-size: 0.85rem; font-weight: 600; color: var(--on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tx-desc { font-size: 0.72rem; color: var(--on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Date: hidden on mobile (shown inside tx-text on mobile via pseudo), shown as column on desktop */
.tx-date {
  display: none;
  font-size: 0.78rem; color: var(--on-surface-variant);
  white-space: nowrap;
}

/* Right side: amount + badge stacked on mobile */
.tx-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  flex-shrink: 0;
}

.tx-amount { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700; white-space: nowrap; }
.tx-amount.positive { color: #16a34a; }
.tx-amount.negative { color: var(--error); }

@keyframes barGrow {
  from { height: 0; }
  to   { height: 100%; }
}
</style>
