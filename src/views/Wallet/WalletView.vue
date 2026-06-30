<template>
  <div class="wallet-view">

    <!-- ── PHASE 2 OVERLAY ── -->
    <div class="phase2-overlay">
      <div class="phase2-box">
        <span class="material-symbols-outlined phase2-ico">rocket_launch</span>
        <h2 class="phase2-title">Come Back in Phase 2</h2>
        <p class="phase2-sub">The wallet is being built. Full payment, withdrawal and earnings features are coming very soon.</p>
      </div>
    </div>

    <!-- Blurred content below -->
    <div class="wallet-blur-wrap">
        <span class="waking-spinner"></span>
        <span>Server is starting up — this takes about 30 seconds on the first visit…</span>
      </div>
    </Transition>

    <!-- Header -->
    <div class="page-hdr">
      <div>
        <h2 class="pg-title">Wallet</h2>
        <p class="pg-sub">Manage your GFD earnings and payments</p>
      </div>
      <div class="hdr-actions">
        <RouterLink to="/settings" class="curr-chip" title="Change currency">
          <span class="curr-chip-sym">{{ currencyStore.current.symbol }}</span>
          <span class="curr-chip-code">{{ currencyStore.current.code }}</span>
          <span class="material-symbols-outlined" style="font-size:14px;opacity:.6">tune</span>
        </RouterLink>
        <button class="btn-refresh icon-only" @click="loadWallet" :disabled="loading">
          <span class="material-symbols-outlined" :class="{ spin: loading }">refresh</span>
        </button>
      </div>
    </div>

    <!-- Balance Card -->
    <div class="balance-card">
      <div class="bc-glow"/>
      <div class="bc-left">
        <p class="bc-label">Total Balance</p>
        <p class="bc-amount">{{ fmtWallet(balance) }}</p>
        <p class="bc-sub">Available for withdrawal · <span class="bc-curr">{{ currencyStore.current.code }}</span></p>
      </div>
      <div class="bc-stats">
        <div class="bc-stat">
          <span class="material-symbols-outlined" style="font-size:18px;opacity:.7">trending_up</span>
          <div>
            <p class="bc-sv">{{ fmtWallet(monthlyEarnings) }}</p>
            <p class="bc-sl">This month</p>
          </div>
        </div>
        <div class="bc-div"/>
        <div class="bc-stat">
          <span class="material-symbols-outlined" style="font-size:18px;opacity:.7">account_balance</span>
          <div>
            <p class="bc-sv">{{ fmtWallet(totalEarned) }}</p>
            <p class="bc-sl">All time</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── How to Fund card ── -->
    <div class="fund-methods-card">
      <div class="fm-title">
        <span class="material-symbols-outlined" style="font-size:20px;color:var(--primary)">payments</span>
        How to Fund Your Wallet
      </div>
      <div class="fm-grid">
        <div class="fm-item fm-active">
          <div class="fm-ico" style="background:rgba(22,163,74,.1)">
            <span class="material-symbols-outlined" style="color:#16a34a">credit_card</span>
          </div>
          <div>
            <p class="fm-name">Card <span class="fm-avail">✓ Available</span></p>
            <p class="fm-desc">Visa, Mastercard or Verve — instant.</p>
          </div>
        </div>
        <div class="fm-item fm-active">
          <div class="fm-ico" style="background:rgba(99,14,212,.08)">
            <span class="material-symbols-outlined" style="color:var(--primary)">account_balance</span>
          </div>
          <div>
            <p class="fm-name">Bank Transfer <span class="fm-avail">✓ Available</span></p>
            <p class="fm-desc">Transfer from any Nigerian bank — credited in seconds.</p>
          </div>
        </div>
        <div class="fm-item fm-active">
          <div class="fm-ico" style="background:rgba(245,158,11,.1)">
            <span class="material-symbols-outlined" style="color:#f59e0b">dialpad</span>
          </div>
          <div>
            <p class="fm-name">USSD <span class="fm-avail">✓ Available</span></p>
            <p class="fm-desc">Dial a shortcode from any phone. No internet needed.</p>
          </div>
        </div>
      </div>
      <button class="btn-primary fm-fund-btn" @click="fundAmount = 500; showFundModal = true">
        <span class="material-symbols-outlined" style="font-size:18px">add_circle</span>
        Fund Wallet
      </button>
    </div>

    <!-- ── Your Virtual Account (permanent account number per user) ── -->
    <div class="dva-card">
      <div class="dva-hdr">
        <div class="dva-hdr-left">
          <span class="material-symbols-outlined dva-ico">account_balance</span>
          <div>
            <p class="dva-title">Your Personal Account Number</p>
            <p class="dva-sub">Transfer money here from any Nigerian bank — wallet credited instantly, always</p>
          </div>
        </div>
        <span class="dva-badge">Free · Instant</span>
      </div>

      <!-- Has account -->
      <template v-if="virtualAccount">
        <div class="dva-details">
          <div class="dva-row">
            <span class="dva-lbl">Bank</span>
            <span class="dva-val">{{ virtualAccount.bank_name }}</span>
          </div>
          <div class="dva-row">
            <span class="dva-lbl">Account Name</span>
            <span class="dva-val">{{ virtualAccount.account_name }}</span>
          </div>
          <div class="dva-row">
            <span class="dva-lbl">Account Number</span>
            <div class="dva-acct-row">
              <span class="dva-acct-num">{{ virtualAccount.account_number }}</span>
              <button class="dva-copy-btn" @click="copyAcctNum" :class="{ copied: acctCopied }">
                <span class="material-symbols-outlined" style="font-size:16px">{{ acctCopied ? 'check' : 'content_copy' }}</span>
                {{ acctCopied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
          </div>
        </div>
        <p class="dva-note">
          <span class="material-symbols-outlined" style="font-size:14px;color:#22c55e">check_circle</span>
          Send money to this account from GTBank, Access, Opay, Kuda — anything. Wallet credits in seconds.
        </p>
      </template>

      <!-- No account yet -->
      <template v-else>
        <p class="dva-empty">Get a permanent Wema/Sterling Bank account number assigned just to you. Any transfer to it tops up your wallet automatically.</p>
        <button class="btn-primary dva-create-btn" :disabled="creatingDVA" @click="createVirtualAccount">
          <span v-if="creatingDVA" class="btn-spinner"/>
          <span class="material-symbols-outlined" v-else style="font-size:18px">add_card</span>
          {{ creatingDVA ? 'Creating…' : 'Get My Account Number' }}
        </button>
      </template>
    </div>

    <!-- Quick Actions -->
    <div class="quick-grid">
      <button class="quick-btn" @click="fundAmount = 500; showFundModal = true">
        <div class="qb-ico" style="background:rgba(99,14,212,.12)">
          <span class="material-symbols-outlined" style="color:var(--primary)">add_circle</span>
        </div>
        <span class="qb-lbl">Fund Wallet</span>
      </button>
      <button class="quick-btn" @click="showWithdrawModal = true">
        <div class="qb-ico" style="background:rgba(22,163,74,.1)">
          <span class="material-symbols-outlined" style="color:#16a34a">arrow_upward</span>
        </div>
        <span class="qb-lbl">Withdraw</span>
      </button>
      <button class="quick-btn" @click="showWithdrawModal = true">
        <div class="qb-ico" style="background:rgba(245,158,11,.1)">
          <span class="material-symbols-outlined" style="color:#f59e0b">send</span>
        </div>
        <span class="qb-lbl">Transfer</span>
      </button>
    </div>

    <!-- Transaction History -->
    <div class="tx-card">
      <div class="tx-hdr">
        <h3 class="tx-title">Transaction History</h3>
        <span class="tx-count" v-if="transactions.length">{{ transactions.length }} records</span>
      </div>

      <!-- Loading -->
      <template v-if="loading && !transactions.length">
        <div v-for="i in 4" :key="i" class="tx-skel">
          <div class="shimmer skel-ico"></div>
          <div class="skel-lines">
            <div class="shimmer skel-l1"></div>
            <div class="shimmer skel-l2"></div>
          </div>
          <div class="shimmer skel-amt"></div>
        </div>
      </template>

      <!-- Empty -->
      <div v-else-if="!transactions.length" class="tx-empty">
        <span class="material-symbols-outlined" style="font-size:2.5rem;opacity:.25">receipt_long</span>
        <p>No transactions yet</p>
        <p class="tx-empty-sub">Fund your wallet to get started</p>
      </div>

      <!-- List -->
      <template v-else>
        <div v-for="tx in transactions" :key="tx.id" class="tx-row">
          <div class="tx-ico-wrap" :style="txStyle(tx).bg">
            <span class="material-symbols-outlined tx-ico" :style="txStyle(tx).color">
              {{ txIcon(tx) }}
            </span>
          </div>
          <div class="tx-info">
            <p class="tx-name">{{ tx.description || tx.type }}</p>
            <p class="tx-date">{{ fmtDate(tx.created_at) }} · {{ tx.reference }}</p>
          </div>
          <div class="tx-right">
            <span class="tx-amt" :class="tx.type === 'withdrawal' ? 'neg' : 'pos'">
              {{ tx.type === 'withdrawal' ? '-' : '+' }}{{ fmtWallet(tx.amount) }}
            </span>
            <span class="tx-badge" :class="tx.status">{{ tx.status }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- ── FUND WALLET MODAL ── -->
    <Transition name="modal">
      <div v-if="showFundModal" class="modal-overlay" @click.self="showFundModal = false">
        <div class="modal-box">
          <div class="modal-hdr">
            <h3 class="modal-title">Fund Wallet</h3>
            <button class="modal-close" @click="showFundModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="modal-body">
            <p class="modal-sub">Enter amount in Nigerian Naira (₦) — pay by card, bank transfer or USSD</p>

            <!-- Amount presets -->
            <div class="preset-grid">
              <button v-for="p in presets" :key="p"
                class="preset-btn" :class="{ active: fundAmount === p }"
                @click="fundAmount = p">
                ₦{{ p.toLocaleString() }}
              </button>
            </div>

            <div class="input-group">
              <span class="inp-prefix">₦</span>
              <input
                v-model.number="fundAmount"
                type="number"
                class="modal-inp"
                placeholder="Enter custom amount"
                min="100"
              />
            </div>

            <div class="amount-display" v-if="fundAmount > 0">
              You're funding <strong>₦{{ fundAmount.toLocaleString() }}</strong> to your GFD wallet
            </div>

            <p class="ps-note">
              <span class="material-symbols-outlined" style="font-size:14px">lock</span>
              Secured by Flutterwave — card, bank transfer & USSD all accepted
            </p>
          </div>

          <div class="modal-footer">
            <button class="btn-ghost" @click="showFundModal = false">Cancel</button>
            <button class="btn-primary modal-pay-btn"
              :disabled="!fundAmount || fundAmount < 100 || paying"
              @click="initiateFund">
              <span v-if="paying" class="btn-spinner"></span>
              <span class="material-symbols-outlined" v-else style="font-size:18px">payments</span>
              {{ paying ? 'Processing…' : `Pay ₦${(fundAmount||0).toLocaleString()}` }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── WITHDRAW MODAL ── -->
    <Transition name="modal">
      <div v-if="showWithdrawModal" class="modal-overlay" @click.self="showWithdrawModal = false">
        <div class="modal-box">
          <div class="modal-hdr">
            <h3 class="modal-title">Withdraw Funds</h3>
            <button class="modal-close" @click="showWithdrawModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="modal-body">
            <div class="avail-balance">
              Available: <strong>₦{{ fmt(balance) }}</strong>
              <span v-if="currencyStore.code !== 'NGN'" class="avail-converted">
                ≈ {{ fmtWallet(balance) }}
              </span>
            </div>

            <div class="field-group">
              <label class="field-label">Amount (₦)</label>
              <div class="input-group">
                <span class="inp-prefix">₦</span>
                <input v-model.number="wd.amount" name="withdrawal_amount" type="number" class="modal-inp"
                  placeholder="Min ₦500" min="500" :max="balance" />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Bank</label>
              <select v-model="wd.bank_code" class="modal-sel" @change="wd.account_name = ''; wd.verified = false">
                <option value="">{{ banksLoading ? 'Loading banks…' : 'Select your bank…' }}</option>
                <option v-for="b in liveBanks" :key="b.code" :value="b.code">{{ b.name }}</option>
              </select>
            </div>

            <div class="field-group">
              <label class="field-label">Account Number</label>
              <div class="input-group">
                <input v-model="wd.account_number" name="account_number" autocomplete="off" type="text" class="modal-inp"
                  placeholder="10-digit NUBAN" maxlength="10"
                  @input="wd.account_name = ''; wd.verified = false; autoVerifyAccount()" />
                <button v-if="wd.account_number.length === 10 && wd.bank_code && !wd.verified"
                  class="verify-btn" :disabled="verifyingAccount" @click="verifyAccount">
                  <span v-if="verifyingAccount" class="btn-spinner"></span>
                  <span v-else>Verify</span>
                </button>
              </div>
            </div>

            <!-- Account name (auto-filled after verification) -->
            <Transition name="slide-down">
              <div v-if="wd.account_name" class="account-verified">
                <span class="material-symbols-outlined" style="color:#22c55e;font-size:18px">check_circle</span>
                <span>{{ wd.account_name }}</span>
              </div>
            </Transition>

            <p class="ps-note">
              <span class="material-symbols-outlined" style="font-size:14px">schedule</span>
              Withdrawals are processed instantly via Flutterwave
            </p>
          </div>

          <div class="modal-footer">
            <button class="btn-ghost" @click="showWithdrawModal = false">Cancel</button>
            <button class="btn-primary modal-pay-btn"
              :disabled="!canWithdraw || withdrawing"
              @click="submitWithdraw">
              <span v-if="withdrawing" class="btn-spinner"></span>
              <span class="material-symbols-outlined" v-else style="font-size:18px">arrow_upward</span>
              {{ withdrawing ? 'Processing…' : `Withdraw ₦${(wd.amount||0).toLocaleString()}` }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── SUCCESS BANNER (shown after payment is verified) ── -->
    <Transition name="slide-up">
      <div v-if="verifyBanner" class="verify-banner">
        <span class="material-symbols-outlined" style="color:#22c55e;font-size:20px">check_circle</span>
        {{ verifyBanner }}
        <button @click="verifyBanner=''" class="vb-close">
          <span class="material-symbols-outlined" style="font-size:16px">close</span>
        </button>
      </div>
    </Transition>

  </div><!-- end wallet-blur-wrap -->

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { walletService } from '@/services/wallet.service'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { useCurrencyStore } from '@/store/currency'

const authStore     = useAuthStore()
const uiStore       = useUiStore()
const route         = useRoute()
const currencyStore = useCurrencyStore()

// NGN → user's chosen currency display
const NGN_TO_USD = 1 / 1650
function fmtWallet(ngnAmount) {
  const usd = Number(ngnAmount || 0) * NGN_TO_USD
  return currencyStore.format(usd)
}

// ── State ──
const loading         = ref(false)
const serverWaking    = ref(false)
const balance         = ref(0)
const monthlyEarnings = ref(0)
const totalEarned     = ref(0)
const transactions    = ref([])

const showFundModal     = ref(false)
const showWithdrawModal = ref(false)
const fundAmount  = ref(500)  // default to ₦500 so button is never disabled on open
const paying            = ref(false)
const withdrawing       = ref(false)
const verifyBanner      = ref('')

// Live bank list from Paystack
const liveBanks      = ref([])
const banksLoading   = ref(false)

// Dedicated Virtual Account
const virtualAccount = ref(null)
const creatingDVA    = ref(false)
const acctCopied     = ref(false)
const dvaNotAvailable = ref(false)

// Withdraw form
const verifyingAccount = ref(false)
let   verifyTimer      = null

const wd = ref({
  amount:         0,
  bank_code:      '',
  account_number: '',
  account_name:   '',
  verified:       false,
})

const canWithdraw = computed(() =>
  wd.value.amount >= 500 &&
  wd.value.amount <= balance.value &&
  wd.value.bank_code &&
  wd.value.account_number.length === 10 &&
  wd.value.verified &&
  wd.value.account_name.trim()
)

const presets = [500, 1000, 2000, 5000, 10000, 20000]

// ── Helpers ──
function fmt(n) {
  return Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function fmtDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}
function txIcon(tx) {
  if (tx.type === 'withdrawal') return 'arrow_upward'
  if (tx.type === 'earning')    return 'star'
  return 'add_circle'
}
function txStyle(tx) {
  if (tx.type === 'withdrawal') return { bg: 'background:rgba(186,26,26,.08)', color: 'color:#ef4444' }
  if (tx.type === 'earning')    return { bg: 'background:rgba(245,158,11,.1)',  color: 'color:#f59e0b' }
  return { bg: 'background:rgba(99,14,212,.08)', color: 'color:var(--primary)' }
}

// ── Wake up server then load wallet ──
async function wakeAndLoad() {
  const base = (import.meta.env.VITE_API_BASE_URL || 'https://gfd-backend.onrender.com/api/v1').replace('/api/v1', '')

  // Try to load wallet — if it fails (server sleeping), show banner and retry
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      await loadWallet()
      serverWaking.value = false
      return // success
    } catch (e) {
      if (attempt === 1) {
        // First failure — server is sleeping, show banner and wake it
        serverWaking.value = true
        fetch(`${base}/health`, { cache: 'no-cache' }).catch(() => {})
      }
      if (attempt < 6) {
        // Wait 5s before retrying
        await new Promise(r => setTimeout(r, 5000))
      }
    }
  }
  serverWaking.value = false
  uiStore.showError('Server took too long to start. Please refresh the page.')
}

// ── Load wallet data ──
async function loadWallet() {
  loading.value = true
  try {
    const [wallet, txns] = await Promise.all([
      walletService.getWallet(),
      walletService.getTransactions(),
    ])
    balance.value         = Number(wallet.balance || 0)
    totalEarned.value     = Number(wallet.total_earned || 0)
    monthlyEarnings.value = Number(wallet.monthly_earnings || 0)
    transactions.value    = txns
  } finally {
    loading.value = false
  }
}

// ── Load live bank list ──
async function loadBanks() {
  banksLoading.value = true
  try {
    liveBanks.value = await walletService.getBanks()
  } catch {
    // silent fallback
  } finally {
    banksLoading.value = false
  }
}

// ── Load virtual account ──
async function loadVirtualAccount() {
  try {
    const data = await walletService.getVirtualAccount()
    virtualAccount.value = data.virtual_account
  } catch { /* silent */ }
}

// ── Create virtual account ──
async function createVirtualAccount() {
  creatingDVA.value = true
  try {
    const data = await walletService.createVirtualAccount()
    virtualAccount.value = data.virtual_account
    uiStore.showSuccess(data.message || 'Your personal account number is ready!')
  } catch (e) {
    const msg = e?.response?.data?.detail || ''
    // If DVA not enabled, show the "coming soon" state instead of an error
    if (e?.response?.status === 503 || msg.toLowerCase().includes('not enabled') || msg.toLowerCase().includes('not available')) {
      dvaNotAvailable.value = true
    } else {
      uiStore.showError(msg || 'Could not create account. Please try again.')
    }
  } finally {
    creatingDVA.value = false
  }
}

// ── Copy account number ──
async function copyAcctNum() {
  if (!virtualAccount.value?.account_number) return
  await navigator.clipboard.writeText(virtualAccount.value.account_number).catch(() => {})
  acctCopied.value = true
  setTimeout(() => acctCopied.value = false, 2000)
}

// ── Auto-verify account number after user stops typing ──
function autoVerifyAccount() {
  clearTimeout(verifyTimer)
  if (wd.value.account_number.length === 10 && wd.value.bank_code) {
    verifyTimer = setTimeout(verifyAccount, 800)
  }
}

async function verifyAccount() {
  if (wd.value.account_number.length !== 10 || !wd.value.bank_code) return
  verifyingAccount.value = true
  try {
    const result = await walletService.verifyBankAccount(
      wd.value.account_number,
      wd.value.bank_code,
    )
    wd.value.account_name = result.account_name
    wd.value.verified     = true
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Could not verify account number')
    wd.value.account_name = ''
    wd.value.verified     = false
  } finally {
    verifyingAccount.value = false
  }
}

// ── Fund wallet via Flutterwave ──
async function initiateFund() {
  if (!fundAmount.value || fundAmount.value < 100) return
  paying.value = true
  try {
    const data = await walletService.initializePayment(
      fundAmount.value,
      window.location.origin + '/wallet',
    )
    if (data.payment_link) {
      window.location.href = data.payment_link
    } else {
      uiStore.showError('No payment link returned. Please try again.')
      paying.value = false
    }
  } catch (e) {
    if (!e?.response) {
      // Server still waking — retry once after 5s
      uiStore.showError('Server is starting up — retrying in 5 seconds…')
      setTimeout(async () => {
        try {
          const data = await walletService.initializePayment(
            fundAmount.value,
            window.location.origin + '/wallet',
          )
          if (data.payment_link) window.location.href = data.payment_link
          else uiStore.showError('Payment link not returned. Please try again.')
        } catch (e2) {
          uiStore.showError(e2?.response?.data?.detail || 'Payment failed. Please refresh and try again.')
        } finally {
          paying.value = false
        }
      }, 5000)
    } else {
      const msg = e?.response?.data?.detail || e?.message || 'Payment initialization failed'
      uiStore.showError(msg)
      paying.value = false
    }
  }
}

// ── Verify after Flutterwave redirect ──
// Flutterwave appends: ?tx_ref=xxx&transaction_id=xxx&status=successful
async function verifyFromUrl() {
  const txRef         = route.query.tx_ref
  const transactionId = route.query.transaction_id
  const status        = route.query.status

  if (!txRef && !transactionId) return

  if (status === 'cancelled') {
    uiStore.showError('Payment was cancelled.')
    cleanUrl()
    return
  }

  try {
    const result = await walletService.verifyPayment({ txRef, transactionId, status })
    if (result.credited) {
      verifyBanner.value = `₦${Number(result.amount).toLocaleString()} successfully added to your wallet!`
      await loadWallet()
    } else {
      verifyBanner.value = 'Payment already processed.'
    }
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Verification failed. Contact support if money was deducted.')
  }
  cleanUrl()
}

function cleanUrl() {
  const url = new URL(window.location.href)
  url.searchParams.delete('tx_ref')
  url.searchParams.delete('transaction_id')
  url.searchParams.delete('status')
  window.history.replaceState({}, '', url.toString())
}

// ── Withdraw via Paystack Transfer ──
async function submitWithdraw() {
  if (!canWithdraw.value) return
  withdrawing.value = true
  try {
    const result = await walletService.requestWithdrawal({
      amount:        wd.value.amount,
      bankCode:      wd.value.bank_code,
      accountNumber: wd.value.account_number,
      accountName:   wd.value.account_name,
    })
    uiStore.showSuccess(result.message || 'Withdrawal initiated!')
    showWithdrawModal.value = false
    wd.value = { amount: 0, bank_code: '', account_number: '', account_name: '', verified: false }
    await loadWallet()
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Withdrawal failed. Please try again.')
  } finally {
    withdrawing.value = false
  }
}

onMounted(async () => {
  await wakeAndLoad()
  loadBanks()
  loadVirtualAccount()
  if (route.query.tx_ref || route.query.transaction_id) {
    await verifyFromUrl()
  }
})
</script>

<style scoped>
.wallet-view { display: flex; flex-direction: column; gap: 1.25rem; padding-bottom: 2rem; position: relative; }

/* ── Phase 2 overlay ── */
.phase2-overlay {
  position: absolute;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(0,0,0,0.35);
  border-radius: 16px;
  min-height: 100%;
}
.phase2-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2.5rem 2rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
  max-width: 380px;
}
.phase2-ico {
  font-size: 3rem;
  color: var(--primary);
}
.phase2-title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--on-surface);
}
.phase2-sub {
  font-size: .9rem;
  color: var(--on-surface-variant);
  line-height: 1.6;
}
.wallet-blur-wrap {
  filter: blur(4px);
  pointer-events: none;
  user-select: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Server waking banner */
.waking-banner {
  display: flex; align-items: center; gap: .75rem;
  padding: .875rem 1.25rem;
  background: color-mix(in srgb,var(--primary) 8%,transparent);
  border: 1px solid color-mix(in srgb,var(--primary) 25%,transparent);
  border-radius: 12px;
  font-size: .875rem; color: var(--on-surface);
}
.waking-spinner {
  width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
  border: 2.5px solid color-mix(in srgb,var(--primary) 30%,transparent);
  border-top-color: var(--primary);
  animation: spin 0.8s linear infinite;
}
.slide-down-enter-active, .slide-down-leave-active { transition: all .3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }

/* Header */
.page-hdr { display: flex; align-items: flex-start; justify-content: space-between; }
.pg-title { font-family: var(--font-headline); font-size: 1.5rem; font-weight: 800; color: var(--on-surface); }
.pg-sub   { font-size: .85rem; color: var(--on-surface-variant); margin-top: .25rem; }
.hdr-actions { display: flex; align-items: center; gap: .5rem; }
.curr-chip {
  display: flex; align-items: center; gap: .3rem;
  padding: .4rem .75rem;
  border: 1.5px solid var(--outline-variant);
  border-radius: 999px;
  background: var(--surface-container);
  text-decoration: none; cursor: pointer;
  transition: border-color .15s;
  color: var(--on-surface);
}
.curr-chip:hover { border-color: var(--primary); color: var(--primary); }
.curr-chip-sym { font-size: 1rem; font-weight: 800; font-family: var(--font-headline); }
.curr-chip-code { font-size: .78rem; font-weight: 700; font-family: var(--font-headline); }
.icon-only { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.icon-only:hover { border-color: var(--primary); color: var(--primary); }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.bc-curr { font-size: .7rem; font-weight: 700; opacity: .8; background: rgba(255,255,255,.15); padding: .1rem .4rem; border-radius: 4px; }
.avail-converted { font-size: .8rem; color: var(--primary); margin-left: .35rem; }

/* Account verify */
.verify-btn {
  padding: .5rem .875rem; background: var(--primary); color: #fff;
  border: none; border-radius: 0 10px 10px 0; cursor: pointer;
  font-size: .82rem; font-weight: 700; white-space: nowrap;
  display: flex; align-items: center; gap: .3rem;
  flex-shrink: 0;
}
.verify-btn:disabled { opacity: .6; cursor: not-allowed; }
.account-verified {
  display: flex; align-items: center; gap: .5rem;
  padding: .625rem .875rem;
  background: rgba(34,197,94,.08);
  border: 1px solid rgba(34,197,94,.25);
  border-radius: 10px;
  font-size: .875rem; font-weight: 600; color: var(--on-surface);
}
.slide-down-enter-active, .slide-down-leave-active { transition: all .2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }

/* Balance Card */
.balance-card {
  position: relative;
  background: linear-gradient(135deg, #1a0840 0%, #2e1065 60%, #0f172a 100%);
  border-radius: 20px;
  padding: 1.75rem;
  overflow: hidden;
  display: flex; flex-direction: column; gap: 1.25rem;
  border: 1px solid rgba(168,85,247,.2);
}
@media (min-width: 580px) {
  .balance-card { flex-direction: row; align-items: center; justify-content: space-between; }
}
.bc-glow {
  position: absolute; top: -80px; right: -80px;
  width: 240px; height: 240px; border-radius: 50%;
  background: radial-gradient(circle, rgba(99,14,212,.5) 0%, transparent 70%);
  pointer-events: none;
}
.bc-label { font-size: .72rem; color: rgba(255,255,255,.55); text-transform: uppercase; letter-spacing: .06em; font-family: var(--font-headline); }
.bc-amount { font-family: var(--font-headline); font-size: clamp(1.75rem,6vw,2.5rem); font-weight: 800; color: #fff; margin-top: .2rem; letter-spacing: -.02em; }
.bc-sub { font-size: .72rem; color: rgba(255,255,255,.4); margin-top: .15rem; }
.bc-stats { display: flex; align-items: center; gap: 1.25rem; }
.bc-stat { display: flex; align-items: center; gap: .625rem; color: rgba(255,255,255,.7); }
.bc-sv { font-family: var(--font-headline); font-size: .9375rem; font-weight: 700; color: #fff; }
.bc-sl { font-size: .68rem; color: rgba(255,255,255,.45); margin-top: .1rem; }
.bc-div { width: 1px; height: 38px; background: rgba(255,255,255,.15); }

/* ── How to Fund card ── */
.fund-methods-card {
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--outline-variant);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex; flex-direction: column; gap: 1rem;
}
.fm-title {
  display: flex; align-items: center; gap: .5rem;
  font-family: var(--font-headline); font-size: 1rem; font-weight: 700;
  color: var(--on-surface);
}
.fm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: .75rem;
}
.fm-item {
  display: flex; align-items: flex-start; gap: .75rem;
  padding: .875rem; border-radius: 12px;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
}
.fm-ico {
  width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.fm-ico .material-symbols-outlined { font-size: 20px; }
.fm-name { font-family: var(--font-headline); font-size: .875rem; font-weight: 700; color: var(--on-surface); display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
.fm-desc { font-size: .78rem; color: var(--on-surface-variant); margin-top: .2rem; line-height: 1.4; }
.fm-avail { font-size: .65rem; font-weight: 700; padding: .15rem .45rem; border-radius: 999px; background: rgba(22,163,74,.12); color: #16a34a; }
.fm-pending { font-size: .65rem; font-weight: 700; padding: .15rem .45rem; border-radius: 999px; background: rgba(168,85,247,.1); color: var(--primary); }
.fm-active { border-color: rgba(22,163,74,.3) !important; }
.fm-soon { opacity: .75; }
.fm-fund-btn {
  display: flex; align-items: center; gap: .5rem;
  padding: .75rem 1.75rem; align-self: flex-start;
  font-size: .95rem;
}

/* ── Virtual Account Card ── */
.dva-card { background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant); border-radius: 16px; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
.dva-hdr { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.dva-hdr-left { display: flex; align-items: flex-start; gap: .75rem; }
.dva-ico { font-size: 24px; color: var(--primary); margin-top: .1rem; flex-shrink: 0; }
.dva-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }
.dva-sub { font-size: .8rem; color: var(--on-surface-variant); margin-top: .2rem; }
.dva-badge { padding: .25rem .75rem; border-radius: 999px; background: rgba(34,197,94,.1); color: #16a34a; font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; white-space: nowrap; flex-shrink: 0; }
.dva-details { display: flex; flex-direction: column; gap: .625rem; }
.dva-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.dva-lbl { font-size: .8rem; color: var(--on-surface-variant); flex-shrink: 0; }
.dva-val { font-size: .875rem; font-weight: 600; color: var(--on-surface); }
.dva-acct-row { display: flex; align-items: center; gap: .625rem; }
.dva-acct-num { font-family: var(--font-headline); font-size: 1.3rem; font-weight: 800; color: var(--primary); letter-spacing: .08em; }
.dva-copy-btn { display: flex; align-items: center; gap: .25rem; padding: .35rem .75rem; border-radius: 8px; border: 1.5px solid var(--outline-variant); background: var(--surface-container); font-size: .78rem; font-weight: 600; color: var(--on-surface); cursor: pointer; transition: all .15s; }
.dva-copy-btn:hover { border-color: var(--primary); color: var(--primary); }
.dva-copy-btn.copied { border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,.08); }
.dva-note { display: flex; align-items: center; gap: .4rem; font-size: .8rem; color: var(--on-surface-variant); background: rgba(34,197,94,.06); padding: .625rem .875rem; border-radius: 8px; border: 1px solid rgba(34,197,94,.2); }
.dva-empty { font-size: .875rem; color: var(--on-surface-variant); }
.dva-create-btn { display: flex; align-items: center; gap: .5rem; padding: .75rem 1.5rem; align-self: flex-start; }

/* Quick actions */
.quick-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: .75rem; }.quick-btn {
  display: flex; flex-direction: column; align-items: center; gap: .625rem;
  padding: 1rem .5rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: 16px; cursor: pointer;
  transition: border-color .15s, transform .15s;
}
.quick-btn:hover { border-color: var(--primary); transform: translateY(-2px); }
.qb-ico { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.qb-ico .material-symbols-outlined { font-size: 22px; }
.qb-lbl { font-family: var(--font-headline); font-size: .78rem; font-weight: 600; color: var(--on-surface); }

/* Transaction card */
.tx-card { background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); border-radius: 16px; overflow: hidden; }
.tx-hdr { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem .75rem; border-bottom: 1px solid var(--outline-variant); }
.tx-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }
.tx-count { font-size: .75rem; color: var(--on-surface-variant); background: var(--surface-container); padding: .2rem .6rem; border-radius: 999px; }

/* Skeletons */
.tx-skel { display: flex; align-items: center; gap: .75rem; padding: .875rem 1.25rem; border-bottom: 1px solid var(--outline-variant); }
.skel-ico { width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0; }
.skel-lines { flex: 1; display: flex; flex-direction: column; gap: .4rem; }
.skel-l1 { height: 12px; border-radius: 4px; width: 55%; }
.skel-l2 { height: 10px; border-radius: 4px; width: 35%; }
.skel-amt { width: 70px; height: 20px; border-radius: 4px; }
.shimmer { background: linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Empty */
.tx-empty { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: 3rem 1rem; color: var(--on-surface-variant); font-size: .875rem; }
.tx-empty-sub { font-size: .8rem; opacity: .7; }

/* Transaction row */
.tx-row { display: flex; align-items: center; gap: .875rem; padding: .875rem 1.25rem; border-bottom: 1px solid var(--outline-variant); transition: background .12s; }
.tx-row:last-child { border-bottom: none; }
.tx-row:hover { background: var(--surface-container-low); }
.tx-ico-wrap { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tx-ico { font-size: 20px; }
.tx-info { flex: 1; min-width: 0; }
.tx-name { font-size: .875rem; font-weight: 600; color: var(--on-surface); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tx-date { font-size: .72rem; color: var(--on-surface-variant); margin-top: .1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tx-right { display: flex; flex-direction: column; align-items: flex-end; gap: .25rem; flex-shrink: 0; }
.tx-amt { font-family: var(--font-headline); font-size: .9rem; font-weight: 700; }
.tx-amt.pos { color: #16a34a; }
.tx-amt.neg { color: #ef4444; }
.tx-badge { font-size: .65rem; font-weight: 700; text-transform: uppercase; padding: .15rem .5rem; border-radius: 999px; letter-spacing: .04em; }
.tx-badge.success  { background: rgba(22,163,74,.1); color: #16a34a; }
.tx-badge.pending  { background: rgba(245,158,11,.1); color: #f59e0b; }
.tx-badge.failed   { background: rgba(239,68,68,.1); color: #ef4444; }

/* ── MODAL ── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0,0,0,.55); backdrop-filter: blur(4px);
  display: flex; align-items: flex-end; justify-content: center;
  padding: 0;
}
@media (min-width: 600px) {
  .modal-overlay { align-items: center; padding: 1rem; }
}
.modal-box {
  width: 100%; max-width: 480px;
  background: var(--surface-container-lowest);
  border-radius: 20px 20px 0 0;
  display: flex; flex-direction: column;
  max-height: 92vh; overflow-y: auto;
}
@media (min-width: 600px) {
  .modal-box { border-radius: 20px; }
}
.modal-hdr {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.5rem 0;
}
.modal-title { font-family: var(--font-headline); font-size: 1.1rem; font-weight: 800; color: var(--on-surface); }
.modal-close {
  width: 34px; height: 34px; border-radius: 50%; border: none;
  background: var(--surface-container); color: var(--on-surface-variant);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.modal-close:hover { background: var(--surface-container-high); color: var(--on-surface); }
.modal-body { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.modal-sub { font-size: .875rem; color: var(--on-surface-variant); }
.avail-balance { font-size: .9rem; color: var(--on-surface-variant); }
.avail-balance strong { color: var(--primary); }

/* Amount presets */
.preset-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: .5rem; }
.preset-btn {
  padding: .6rem .25rem; border-radius: 10px;
  border: 1.5px solid var(--outline-variant);
  background: var(--surface-container);
  font-family: var(--font-headline); font-size: .82rem; font-weight: 600;
  color: var(--on-surface); cursor: pointer; transition: all .12s;
}
.preset-btn:hover, .preset-btn.active {
  border-color: var(--primary);
  background: color-mix(in srgb,var(--primary) 8%,transparent);
  color: var(--primary);
}

/* Input group */
.input-group { display: flex; align-items: center; background: var(--surface-container); border: 1.5px solid var(--outline-variant); border-radius: 12px; overflow: hidden; transition: border-color .15s; }
.input-group:focus-within { border-color: var(--primary); }
.inp-prefix { padding: .75rem 0 .75rem 1rem; font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface-variant); }
.modal-inp { flex: 1; padding: .75rem .875rem; background: transparent; border: none; outline: none; font-family: var(--font-headline); font-size: .95rem; color: var(--on-surface); }
.modal-inp::placeholder { color: var(--outline); }

/* Select */
.modal-sel { width: 100%; padding: .75rem .875rem; background: var(--surface-container); border: 1.5px solid var(--outline-variant); border-radius: 12px; font-size: .9rem; color: var(--on-surface); outline: none; transition: border-color .15s; }
.modal-sel:focus { border-color: var(--primary); }

/* Field group */
.field-group { display: flex; flex-direction: column; gap: .4rem; }
.field-label { font-size: .8rem; font-weight: 600; color: var(--on-surface-variant); }

.amount-display {
  padding: .75rem 1rem; background: color-mix(in srgb,var(--primary) 6%,transparent);
  border: 1px solid color-mix(in srgb,var(--primary) 20%,transparent);
  border-radius: 10px; font-size: .875rem; color: var(--on-surface);
}
.amount-display strong { color: var(--primary); font-weight: 700; }

.ps-note {
  display: flex; align-items: center; gap: .375rem;
  font-size: .75rem; color: var(--on-surface-variant);
  background: var(--surface-container); padding: .625rem .875rem; border-radius: 8px;
}

.modal-footer { display: flex; gap: .75rem; justify-content: flex-end; padding: 1rem 1.5rem 1.5rem; border-top: 1px solid var(--outline-variant); }
.btn-ghost { padding: .625rem 1.25rem; border-radius: 10px; border: 1px solid var(--outline-variant); background: none; color: var(--on-surface-variant); font-size: .875rem; font-weight: 600; cursor: pointer; }
.btn-ghost:hover { border-color: var(--primary); color: var(--primary); }
.btn-primary { display: flex; align-items: center; gap: .4rem; padding: .7rem 1.5rem; border-radius: 10px; background: var(--primary); color: #fff; border: none; font-family: var(--font-headline); font-size: .9rem; font-weight: 700; cursor: pointer; transition: opacity .15s; }
.btn-primary:disabled { opacity: .5; cursor: not-allowed; }
.btn-primary:not(:disabled):hover { opacity: .9; }
.modal-pay-btn { min-width: 160px; justify-content: center; }
.btn-spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; animation: spin 0.7s linear infinite; flex-shrink: 0; }

/* Verify banner */
.verify-banner {
  position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: .625rem;
  background: var(--surface-container-highest);
  border: 1px solid #22c55e;
  border-radius: 12px; padding: .75rem 1.25rem;
  font-size: .875rem; font-weight: 600; color: var(--on-surface);
  box-shadow: 0 8px 24px rgba(0,0,0,.2);
  white-space: nowrap; z-index: 600;
}
.vb-close { background: none; border: none; cursor: pointer; color: var(--on-surface-variant); display: flex; align-items: center; }

/* Transitions */
.modal-enter-active, .modal-leave-active { transition: all .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: translateY(20px); }
.slide-up-enter-active, .slide-up-leave-active { transition: all .25s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }
</style>
