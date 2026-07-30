<template>
  <div class="wallet-view">

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
        <button class="icon-only" @click="loadWallet" :disabled="loading">
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
        <!-- Username chip — users share this for transfers -->
        <button v-if="authStore.profile?.username" class="bc-username-chip" @click="copyUsername" :title="usernameCopied ? 'Copied!' : 'Copy your GFD username'">
          <span class="material-symbols-outlined" style="font-size:14px">alternate_email</span>
          {{ authStore.profile.username }}
          <span class="material-symbols-outlined" style="font-size:13px;opacity:.7">{{ usernameCopied ? 'check' : 'content_copy' }}</span>
        </button>
      </div>
      <div class="bc-stats">
        <div class="bc-stat">
          <span class="material-symbols-outlined" style="font-size:18px;opacity:.7">trending_up</span>
          <div>
            <p class="bc-sv">{{ fmtWallet(totalEarned) }}</p>
            <p class="bc-sl">All time earned</p>
          </div>
        </div>
        <div class="bc-div"/>
        <div class="bc-stat">
          <span class="material-symbols-outlined" style="font-size:18px;opacity:.7">arrow_upward</span>
          <div>
            <p class="bc-sv">{{ fmtWallet(totalWithdrawn) }}</p>
            <p class="bc-sl">Withdrawn</p>
          </div>
        </div>
      </div>
    </div>


    <!-- How to Fund -->
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
            <p class="fm-desc">Transfer from any Nigerian bank — credited instantly.</p>
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

    <!-- Virtual Account -->
    <div class="dva-card">
      <div class="dva-hdr">
        <div class="dva-hdr-left">
          <span class="material-symbols-outlined dva-ico">account_balance</span>
          <div>
            <p class="dva-title">Your Personal Account Number</p>
            <p class="dva-sub">Transfer money here from any Nigerian bank — wallet credited instantly</p>
          </div>
        </div>
        <span class="dva-badge">Free · Instant</span>
      </div>
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
          Send from GTBank, Access, Opay, Kuda — anything. Wallet credits in seconds.
        </p>
      </template>
      <template v-else>
        <p class="dva-empty">Get a permanent Wema Bank account number assigned to you. Any transfer auto-tops up your wallet.</p>
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
      <button class="quick-btn" @click="showTransferModal = true">
        <div class="qb-ico" style="background:rgba(59,130,246,.1)">
          <span class="material-symbols-outlined" style="color:#3b82f6">send</span>
        </div>
        <span class="qb-lbl">Transfer</span>
      </button>
      <button class="quick-btn" @click="showWithdrawModal = true">
        <div class="qb-ico" style="background:rgba(22,163,74,.1)">
          <span class="material-symbols-outlined" style="color:#16a34a">arrow_upward</span>
        </div>
        <span class="qb-lbl">Withdraw</span>
      </button>
      <button class="quick-btn" @click="showTxModal = true">
        <div class="qb-ico" style="background:rgba(245,158,11,.1)">
          <span class="material-symbols-outlined" style="color:#f59e0b">receipt_long</span>
        </div>
        <span class="qb-lbl">History</span>
      </button>
    </div>

    <!-- Transaction History -->
    <div class="tx-card">
      <div class="tx-hdr">
        <h3 class="tx-title">Recent Transactions</h3>
        <span class="tx-count" v-if="transactions.length">{{ txTotal }} records</span>
      </div>
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
      <div v-else-if="!transactions.length" class="tx-empty">
        <span class="material-symbols-outlined" style="font-size:2.5rem;opacity:.25">receipt_long</span>
        <p>No transactions yet</p>
        <p class="tx-empty-sub">Fund your wallet to get started</p>
      </div>
      <template v-else>
        <div v-for="tx in transactions" :key="tx.id" class="tx-row">
          <div class="tx-ico-wrap" :style="txStyle(tx).bg">
            <span class="material-symbols-outlined tx-ico" :style="txStyle(tx).color">{{ txIcon(tx) }}</span>
          </div>
          <div class="tx-info">
            <p class="tx-name">{{ tx.description || tx.type }}</p>
            <p class="tx-date">{{ fmtDate(tx.created_at) }}{{ tx.reference ? ' · ' + tx.reference : '' }}</p>
          </div>
          <div class="tx-right">
            <span class="tx-amt" :class="isDebit(tx) ? 'neg' : 'pos'">
              {{ isDebit(tx) ? '-' : '+' }}{{ fmtNgn(tx.amount) }}
            </span>
            <span class="tx-badge" :class="tx.status">{{ tx.status }}</span>
          </div>
        </div>
      </template>
    </div>


    <!-- ── TRANSFER MODAL ── -->
    <Transition name="modal">
      <div v-if="showTransferModal" class="modal-overlay" @click.self="showTransferModal = false">
        <div class="modal-box">
          <div class="modal-hdr">
            <h3 class="modal-title">Send Money</h3>
            <button class="modal-close" @click="showTransferModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="avail-balance">
              Available: <strong>₦{{ fmtNgn(balance) }}</strong>
            </div>
            <div class="field-group">
              <label class="field-label">Recipient (username or email)</label>
              <div class="input-group">
                <span class="inp-prefix">@</span>
                <input v-model="tr.recipient" type="text" class="modal-inp"
                  placeholder="username or email" autocomplete="off" />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Amount (₦)</label>
              <div class="input-group">
                <span class="inp-prefix">₦</span>
                <input v-model.number="tr.amount" type="number" class="modal-inp"
                  placeholder="Min ₦100" min="100" :max="balance" />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Note (optional)</label>
              <input v-model="tr.note" type="text" class="modal-inp" style="border:1.5px solid var(--outline-variant);border-radius:12px;padding:.75rem .875rem;"
                placeholder="What's this for?" maxlength="100" />
            </div>
            <div class="amount-display" v-if="tr.amount > 0 && tr.recipient">
              Sending <strong>₦{{ (tr.amount||0).toLocaleString() }}</strong> to <strong>@{{ tr.recipient }}</strong>
            </div>
            <p class="ps-note">
              <span class="material-symbols-outlined" style="font-size:14px">bolt</span>
              Transfers between GFD users are instant and free
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn-ghost" @click="showTransferModal = false">Cancel</button>
            <button class="btn-primary modal-pay-btn"
              :disabled="!canTransfer || transferring"
              @click="submitTransfer">
              <span v-if="transferring" class="btn-spinner"></span>
              <span class="material-symbols-outlined" v-else style="font-size:18px">send</span>
              {{ transferring ? 'Sending…' : `Send ₦${(tr.amount||0).toLocaleString()}` }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── HISTORY MODAL ── -->
    <Transition name="modal">
      <div v-if="showTxModal" class="modal-overlay" @click.self="showTxModal = false">
        <div class="modal-box" style="max-width:560px">
          <div class="modal-hdr">
            <h3 class="modal-title">Transaction History</h3>
            <button class="modal-close" @click="showTxModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Receipt view -->
          <template v-if="selectedTx">
            <div class="receipt-wrap" ref="receiptRef">
              <div class="receipt-header">
                <div class="receipt-ico-wrap" :style="txStyle(selectedTx).bg">
                  <span class="material-symbols-outlined receipt-ico" :style="txStyle(selectedTx).color">{{ txIcon(selectedTx) }}</span>
                </div>
                <p class="receipt-amt" :class="isDebit(selectedTx) ? 'neg' : 'pos'">
                  {{ isDebit(selectedTx) ? '-' : '+' }}{{ fmtNgn(selectedTx.amount) }}
                </p>
                <span class="tx-badge" :class="selectedTx.status" style="font-size:.8rem;padding:.3rem .75rem">{{ selectedTx.status }}</span>
              </div>
              <div class="receipt-rows">
                <div class="receipt-row">
                  <span class="receipt-lbl">Transaction ID</span>
                  <span class="receipt-val mono">{{ selectedTx.id }}</span>
                </div>
                <div class="receipt-row">
                  <span class="receipt-lbl">Type</span>
                  <span class="receipt-val" style="text-transform:capitalize">{{ selectedTx.type.replace('_',' ') }}</span>
                </div>
                <div class="receipt-row" v-if="selectedTx.reference">
                  <span class="receipt-lbl">Reference</span>
                  <span class="receipt-val mono">{{ selectedTx.reference }}</span>
                </div>
                <div class="receipt-row" v-if="selectedTx.description">
                  <span class="receipt-lbl">Description</span>
                  <span class="receipt-val">{{ selectedTx.description }}</span>
                </div>
                <div class="receipt-row" v-if="selectedTx.fee > 0">
                  <span class="receipt-lbl">Fee</span>
                  <span class="receipt-val">{{ fmtNgn(selectedTx.fee) }}</span>
                </div>
                <div class="receipt-row" v-if="selectedTx.balance_before != null">
                  <span class="receipt-lbl">Balance Before</span>
                  <span class="receipt-val">{{ fmtNgn(selectedTx.balance_before) }}</span>
                </div>
                <div class="receipt-row" v-if="selectedTx.balance_after != null">
                  <span class="receipt-lbl">Balance After</span>
                  <span class="receipt-val">{{ fmtNgn(selectedTx.balance_after) }}</span>
                </div>
                <div class="receipt-row" v-if="selectedTx.provider">
                  <span class="receipt-lbl">Provider</span>
                  <span class="receipt-val" style="text-transform:capitalize">{{ selectedTx.provider }}</span>
                </div>
                <div class="receipt-row">
                  <span class="receipt-lbl">Date & Time</span>
                  <span class="receipt-val">{{ fmtDateFull(selectedTx.created_at) }}</span>
                </div>
              </div>
              <div class="receipt-brand">GFD Wallet · globalfd.xyz</div>
            </div>
            <div class="receipt-actions">
              <button class="btn-ghost" @click="selectedTx = null">
                <span class="material-symbols-outlined" style="font-size:16px">arrow_back</span>
                Back
              </button>
              <button class="btn-ghost" @click="shareReceipt">
                <span class="material-symbols-outlined" style="font-size:16px">share</span>
                Share
              </button>
              <button class="btn-primary" @click="downloadReceipt" style="gap:.4rem">
                <span class="material-symbols-outlined" style="font-size:16px">download</span>
                Download
              </button>
            </div>
          </template>

          <!-- Transaction list -->
          <template v-else>
            <!-- Filter tabs -->
            <div class="hist-tabs">
              <button v-for="tab in histTabs" :key="tab.value"
                class="hist-tab" :class="{ active: txFilter === tab.value }"
                @click="setTxFilter(tab.value)">
                {{ tab.label }}
              </button>
            </div>
            <div class="modal-body" style="padding-top:.5rem;max-height:55vh;overflow-y:auto">
              <div v-if="histLoading" class="tx-empty" style="padding:2rem 0">
                <div class="btn-spinner" style="border-color:rgba(99,14,212,.2);border-top-color:var(--primary);width:24px;height:24px"></div>
              </div>
              <div v-else-if="!histTxs.length" class="tx-empty" style="padding:2rem 0">
                <span class="material-symbols-outlined" style="font-size:2rem;opacity:.25">receipt_long</span>
                <p>No transactions</p>
              </div>
              <template v-else>
                <div v-for="tx in histTxs" :key="tx.id" class="tx-row"
                  style="cursor:pointer;border-radius:10px" @click="selectedTx = tx">
                  <div class="tx-ico-wrap" :style="txStyle(tx).bg">
                    <span class="material-symbols-outlined tx-ico" :style="txStyle(tx).color">{{ txIcon(tx) }}</span>
                  </div>
                  <div class="tx-info">
                    <p class="tx-name">{{ tx.description || tx.type }}</p>
                    <p class="tx-date">{{ fmtDate(tx.created_at) }}{{ tx.reference ? ' · ' + tx.reference : '' }}</p>
                  </div>
                  <div class="tx-right">
                    <span class="tx-amt" :class="isDebit(tx) ? 'neg' : 'pos'">
                      {{ isDebit(tx) ? '-' : '+' }}{{ fmtNgn(tx.amount) }}
                    </span>
                    <span class="tx-badge" :class="tx.status">{{ tx.status }}</span>
                  </div>
                </div>
              </template>
              <!-- Load more -->
              <button v-if="histHasMore && !histLoading"
                class="btn-ghost" style="width:100%;margin-top:.5rem;justify-content:center"
                @click="loadMoreHist">Load more</button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
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
            <p class="modal-sub">Enter amount in Naira (₦) — pay by card, bank transfer or USSD</p>
            <div class="preset-grid">
              <button v-for="p in presets" :key="p"
                class="preset-btn" :class="{ active: fundAmount === p }"
                @click="fundAmount = p">₦{{ p.toLocaleString() }}</button>
            </div>
            <div class="input-group">
              <span class="inp-prefix">₦</span>
              <input v-model.number="fundAmount" type="number" class="modal-inp"
                placeholder="Enter custom amount" min="100" />
            </div>
            <div class="amount-display" v-if="fundAmount > 0">
              You're funding <strong>₦{{ fundAmount.toLocaleString() }}</strong> to your GFD wallet
            </div>
            <p class="ps-note">
              <span class="material-symbols-outlined" style="font-size:14px">lock</span>
              Secured by Paystack — card, bank transfer &amp; USSD accepted
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
              Available: <strong>₦{{ fmtNgn(balance) }}</strong>
              <span class="wd-fee-note"> · ₦50 processing fee applies</span>
            </div>
            <div class="field-group">
              <label class="field-label">Amount (₦)</label>
              <div class="input-group">
                <span class="inp-prefix">₦</span>
                <input v-model.number="wd.amount" type="number" class="modal-inp"
                  placeholder="Min ₦1,000" min="1000" :max="balance" />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Bank Name</label>
              <input v-model="wd.bank_name" type="text" class="modal-inp"
                style="border:1.5px solid var(--outline-variant);border-radius:12px;padding:.75rem .875rem;"
                placeholder="e.g. GTBank, Access, Opay" />
            </div>
            <div class="field-group">
              <label class="field-label">Account Number</label>
              <input v-model="wd.account_number" type="text" class="modal-inp"
                style="border:1.5px solid var(--outline-variant);border-radius:12px;padding:.75rem .875rem;"
                autocomplete="off" placeholder="10-digit NUBAN" maxlength="10" />
            </div>
            <div class="field-group">
              <label class="field-label">Account Name</label>
              <input v-model="wd.account_name" type="text" class="modal-inp"
                style="border:1.5px solid var(--outline-variant);border-radius:12px;padding:.75rem .875rem;"
                placeholder="Name on the account" />
            </div>
            <div class="amount-display" v-if="wd.amount >= 1000 && wd.bank_name && wd.account_number && wd.account_name">
              Withdrawing <strong>₦{{ (wd.amount||0).toLocaleString() }}</strong> to <strong>{{ wd.bank_name }}</strong> · {{ wd.account_number }}
            </div>
            <p class="ps-note">
              <span class="material-symbols-outlined" style="font-size:14px">schedule</span>
              Reviewed and sent to your bank within 24 hours
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

    <!-- ── SUCCESS BANNER ── -->
    <Transition name="slide-up">
      <div v-if="verifyBanner" class="verify-banner">
        <span class="material-symbols-outlined" style="color:#22c55e;font-size:20px">check_circle</span>
        {{ verifyBanner }}
        <button @click="verifyBanner=''" class="vb-close">
          <span class="material-symbols-outlined" style="font-size:16px">close</span>
        </button>
      </div>
    </Transition>

  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { walletService } from '@/services/wallet.service'
import { useUiStore } from '@/store/ui'
import { useCurrencyStore } from '@/store/currency'
import { useAuthStore } from '@/store/auth'

const uiStore       = useUiStore()
const route         = useRoute()
const currencyStore = useCurrencyStore()
const authStore     = useAuthStore()

const NGN_TO_USD = 1 / 1650
function fmtWallet(ngnAmount) {
  return currencyStore.format(Number(ngnAmount || 0) * NGN_TO_USD)
}
function fmtNgn(n) {
  return '₦' + Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ── State ─────────────────────────────────────────────────────────────────
const loading        = ref(false)
const serverWaking   = ref(false)
const balance        = ref(0)
const totalEarned    = ref(0)
const totalWithdrawn = ref(0)
const transactions   = ref([])
const txTotal        = ref(0)

const showFundModal     = ref(false)
const showWithdrawModal = ref(false)
const showTransferModal = ref(false)
const showTxModal       = ref(false)
const fundAmount        = ref(500)
const paying            = ref(false)
const withdrawing       = ref(false)
const transferring      = ref(false)
const verifyBanner      = ref('')

const liveBanks        = ref([])
const banksLoading     = ref(false)
const virtualAccount   = ref(null)
const creatingDVA      = ref(false)
const acctCopied       = ref(false)
const usernameCopied   = ref(false)
const verifyingAccount = ref(false)
let   verifyTimer      = null

// Transfer form
const tr = ref({ recipient: '', amount: 0, note: '' })
const canTransfer = computed(() =>
  tr.value.recipient.trim().length >= 3 &&
  tr.value.amount >= 100 &&
  tr.value.amount <= balance.value
)

// Withdraw form
const wd = ref({ amount: 0, bank_code: '', bank_name: '', account_number: '', account_name: '', verified: false })
const presets = [500, 1000, 2000, 5000, 10000, 20000]
const canWithdraw = computed(() =>
  wd.value.amount >= 1000 &&
  wd.value.amount <= balance.value &&
  wd.value.bank_name.trim() &&
  wd.value.account_number.length >= 10 &&
  wd.value.account_name.trim()
)

// History state
const histTxs    = ref([])
const histPage   = ref(1)
const histHasMore = ref(false)
const histLoading = ref(false)
const txFilter   = ref(null)
const selectedTx = ref(null)
const receiptRef = ref(null)
const histTabs   = [
  { label: 'All',       value: null },
  { label: 'Deposits',  value: 'credit' },
  { label: 'Transfers', value: 'debit' },
  { label: 'Withdrawals', value: 'withdrawal' },
]

// ── Helpers ───────────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}
function fmtDateFull(d) {
  if (!d) return ''
  return new Date(d).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
function isDebit(tx) {
  return ['withdrawal', 'debit', 'escrow_hold'].includes(tx.type)
}
function txIcon(tx) {
  if (tx.type === 'withdrawal')     return 'arrow_upward'
  if (tx.type === 'debit')          return 'send'
  if (tx.type === 'refund')         return 'undo'
  if (tx.type === 'escrow_hold')    return 'lock'
  if (tx.type === 'escrow_release') return 'lock_open'
  return 'add_circle'
}
function txStyle(tx) {
  if (tx.type === 'debit')    return { bg: 'background:rgba(59,130,246,.08)',  color: 'color:#3b82f6' }
  if (isDebit(tx))            return { bg: 'background:rgba(186,26,26,.08)',   color: 'color:#ef4444' }
  if (tx.type === 'refund')   return { bg: 'background:rgba(245,158,11,.1)',   color: 'color:#f59e0b' }
  return { bg: 'background:rgba(99,14,212,.08)', color: 'color:var(--primary)' }
}
function getBankName(code) {
  return liveBanks.value.find(b => b.code === code)?.name || ''
}

// ── Load wallet ───────────────────────────────────────────────────────────
async function wakeAndLoad() {
  const base = (import.meta.env.VITE_API_BASE_URL || 'https://gfd-backend.onrender.com/api/v1').replace('/api/v1', '')
  fetch(`${base}/health`, { cache: 'no-cache' }).catch(() => {})
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      await loadWallet()
      serverWaking.value = false
      return
    } catch {
      if (attempt === 1) serverWaking.value = true
      if (attempt < 8) await new Promise(r => setTimeout(r, 4000))
    }
  }
  serverWaking.value = false
  loading.value = false
}

async function loadWallet() {
  loading.value = true
  try {
    const [wallet, txData] = await Promise.all([
      walletService.getWallet(),
      walletService.getTransactions({ page: 1, pageSize: 30 }),
    ])
    balance.value        = Number(wallet.balance || 0)
    totalEarned.value    = Number(wallet.total_earned || 0)
    totalWithdrawn.value = Number(wallet.total_withdrawn || 0)
    transactions.value   = txData.transactions || []
    txTotal.value        = txData.total || 0
  } finally {
    loading.value = false
  }
}

// ── History modal ─────────────────────────────────────────────────────────
async function setTxFilter(val) {
  txFilter.value = val
  selectedTx.value = null
  histPage.value = 1
  histTxs.value = []
  await loadHist()
}

async function loadHist() {
  histLoading.value = true
  try {
    const data = await walletService.getTransactions({
      page: histPage.value, pageSize: 20, type: txFilter.value,
    })
    histTxs.value = histPage.value === 1
      ? (data.transactions || [])
      : [...histTxs.value, ...(data.transactions || [])]
    histHasMore.value = data.has_more || false
  } catch { /* silent */ }
  finally { histLoading.value = false }
}

async function loadMoreHist() {
  histPage.value++
  await loadHist()
}

// Open history modal — load on first open
const histLoaded = ref(false)
async function openHistory() {
  showTxModal.value = true
  if (!histLoaded.value) {
    histLoaded.value = true
    histTxs.value = []
    histPage.value = 1
    await loadHist()
  }
}

// ── Receipt share / download ──────────────────────────────────────────────
async function shareReceipt() {
  const tx = selectedTx.value
  if (!tx) return
  const text = [
    `GFD Wallet Receipt`,
    `Type: ${tx.type}`,
    `Amount: ${isDebit(tx) ? '-' : '+'}${fmtNgn(tx.amount)}`,
    `Reference: ${tx.reference || 'N/A'}`,
    `Description: ${tx.description || ''}`,
    `Status: ${tx.status}`,
    `Date: ${fmtDateFull(tx.created_at)}`,
    `\nglobalfd.xyz`,
  ].join('\n')

  if (navigator.share) {
    try {
      await navigator.share({ title: 'GFD Payment Receipt', text })
      return
    } catch { /* fallback to copy */ }
  }
  // Fallback: copy to clipboard
  await navigator.clipboard.writeText(text).catch(() => {})
  uiStore.showSuccess('Receipt copied to clipboard!')
}

async function downloadReceipt() {
  const tx = selectedTx.value
  if (!tx) return

  // Build a simple HTML receipt and download as HTML file (works without extra libs)
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>GFD Receipt</title>
<style>
  body{font-family:sans-serif;max-width:420px;margin:40px auto;padding:24px;border:1px solid #e5e7eb;border-radius:16px}
  h2{text-align:center;margin:0 0 4px}
  .amt{text-align:center;font-size:2rem;font-weight:800;margin:8px 0;color:${isDebit(tx)?'#ef4444':'#16a34a'}}
  .badge{display:inline-block;padding:3px 12px;border-radius:999px;font-size:.75rem;font-weight:700;background:${tx.status==='success'?'#dcfce7':tx.status==='pending'?'#fef9c3':'#fee2e2'};color:${tx.status==='success'?'#16a34a':tx.status==='pending'?'#ca8a04':'#ef4444'}}
  .center{text-align:center}
  table{width:100%;border-collapse:collapse;margin-top:16px}
  td{padding:8px 4px;border-bottom:1px solid #f3f4f6;font-size:.875rem}
  td:first-child{color:#6b7280}td:last-child{text-align:right;font-weight:600;word-break:break-all}
  .brand{text-align:center;color:#9ca3af;font-size:.75rem;margin-top:16px}
</style></head><body>
<h2>GFD Wallet Receipt</h2>
<div class="amt">${isDebit(tx)?'-':'+'}${fmtNgn(tx.amount)}</div>
<div class="center"><span class="badge">${tx.status}</span></div>
<table>
  <tr><td>Transaction ID</td><td>${tx.id}</td></tr>
  <tr><td>Type</td><td>${tx.type}</td></tr>
  ${tx.reference ? `<tr><td>Reference</td><td>${tx.reference}</td></tr>` : ''}
  ${tx.description ? `<tr><td>Description</td><td>${tx.description}</td></tr>` : ''}
  ${tx.fee > 0 ? `<tr><td>Fee</td><td>${fmtNgn(tx.fee)}</td></tr>` : ''}
  ${tx.balance_before != null ? `<tr><td>Balance Before</td><td>${fmtNgn(tx.balance_before)}</td></tr>` : ''}
  ${tx.balance_after != null ? `<tr><td>Balance After</td><td>${fmtNgn(tx.balance_after)}</td></tr>` : ''}
  <tr><td>Date</td><td>${fmtDateFull(tx.created_at)}</td></tr>
</table>
<div class="brand">GFD Wallet · globalfd.xyz</div>
</body></html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `GFD-Receipt-${tx.reference || tx.id.slice(0,8)}.html`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Banks ──────────────────────────────────────────────────────────────────
async function loadBanks() {
  banksLoading.value = true
  try { liveBanks.value = await walletService.getBanks() }
  catch { /* silent */ }
  finally { banksLoading.value = false }
}

// ── Virtual account ────────────────────────────────────────────────────────
async function loadVirtualAccount() {
  try {
    const data = await walletService.getVirtualAccount()
    virtualAccount.value = data?.account_number ? data : null
  } catch { /* 404 expected */ }
}

async function createVirtualAccount() {
  creatingDVA.value = true
  try {
    const data = await walletService.createVirtualAccount()
    virtualAccount.value = data?.account_number ? data : data
    uiStore.showSuccess('Your personal account number is ready!')
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Could not create account. Please try again.')
  } finally {
    creatingDVA.value = false
  }
}

async function copyAcctNum() {
  if (!virtualAccount.value?.account_number) return
  await navigator.clipboard.writeText(virtualAccount.value.account_number).catch(() => {})
  acctCopied.value = true
  setTimeout(() => acctCopied.value = false, 2000)
}

async function copyUsername() {
  const username = authStore.profile?.username
  if (!username) return
  await navigator.clipboard.writeText(username).catch(() => {})
  usernameCopied.value = true
  setTimeout(() => usernameCopied.value = false, 2000)
}

// ── Account verification ───────────────────────────────────────────────────
function autoVerifyAccount() {
  clearTimeout(verifyTimer)
  if (wd.value.account_number.length === 10 && wd.value.bank_code)
    verifyTimer = setTimeout(verifyAccount, 800)
}

async function verifyAccount() {
  if (wd.value.account_number.length !== 10 || !wd.value.bank_code) return
  verifyingAccount.value = true
  try {
    const result = await walletService.verifyBankAccount(wd.value.account_number, wd.value.bank_code)
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

// ── Fund via Paystack ──────────────────────────────────────────────────────
async function initiateFund() {
  if (!fundAmount.value || fundAmount.value < 100) return
  paying.value = true
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const data = await walletService.initializePayment(fundAmount.value)
      if (data.payment_url) { window.location.href = data.payment_url; return }
      uiStore.showError('Payment could not be initialized. Please try again.')
      paying.value = false; return
    } catch (e) {
      const s = e?.response?.status
      const d = e?.response?.data?.detail
      if (s === 401) { uiStore.showError('Session expired. Please log in again.'); paying.value = false; return }
      if (s === 403) { uiStore.showError(d || 'Wallet is frozen.'); paying.value = false; return }
      if (e?.response) { uiStore.showError(d || 'Payment failed. Please try again.'); paying.value = false; return }
      if (attempt < 4) { await new Promise(r => setTimeout(r, 5000)); continue }
      uiStore.showError('Connection timed out. Please try again.')
      paying.value = false
    }
  }
}

// ── Verify after Paystack redirect ─────────────────────────────────────────
async function verifyFromUrl() {
  const reference = route.query.ref || route.query.reference || route.query.trxref
  if (!reference) return
  try {
    const result = await walletService.verifyPayment(reference)
    if (result.status === 'success') {
      verifyBanner.value = `₦${Number(result.amount || 0).toLocaleString()} successfully added to your wallet!`
      await loadWallet()
    } else {
      verifyBanner.value = result.message || 'Payment processed.'
    }
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Verification failed. Contact support if money was deducted.')
  }
  const url = new URL(window.location.href)
  ;['ref', 'reference', 'trxref'].forEach(k => url.searchParams.delete(k))
  window.history.replaceState({}, '', url.toString())
}

// ── Transfer ───────────────────────────────────────────────────────────────
async function submitTransfer() {
  if (!canTransfer.value) return
  transferring.value = true
  try {
    const result = await walletService.sendMoney({
      recipient: tr.value.recipient.trim(),
      amount:    tr.value.amount,
      note:      tr.value.note.trim(),
    })
    uiStore.showSuccess(result.message || `₦${tr.value.amount.toLocaleString()} sent!`)
    showTransferModal.value = false
    tr.value = { recipient: '', amount: 0, note: '' }
    await loadWallet()
    // Refresh history if open
    if (showTxModal.value) { histPage.value = 1; histTxs.value = []; await loadHist() }
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Transfer failed. Please try again.')
  } finally {
    transferring.value = false
  }
}

// ── Withdraw ───────────────────────────────────────────────────────────────
async function submitWithdraw() {
  if (!canWithdraw.value) return
  withdrawing.value = true
  try {
    const result = await walletService.requestWithdrawal({
      amount:        wd.value.amount,
      bankName:      wd.value.bank_name,
      bankCode:      wd.value.bank_code || '',
      accountNumber: wd.value.account_number,
      accountName:   wd.value.account_name,
    })
    uiStore.showSuccess(result.message || 'Withdrawal request submitted! You will receive your funds within 24 hours.')
    showWithdrawModal.value = false
    wd.value = { amount: 0, bank_code: '', bank_name: '', account_number: '', account_name: '', verified: false }
    await loadWallet()
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Withdrawal failed. Please try again.')
  } finally {
    withdrawing.value = false
  }
}

// ── Mount ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  await wakeAndLoad()
  loadBanks()
  loadVirtualAccount()
  if (route.query.ref || route.query.reference || route.query.trxref)
    await verifyFromUrl()
})
</script>


<style scoped>
.wallet-view { display: flex; flex-direction: column; gap: 1.25rem; padding-bottom: 2rem; }

/* Header */
.page-hdr { display: flex; align-items: flex-start; justify-content: space-between; }
.pg-title { font-family: var(--font-headline); font-size: 1.5rem; font-weight: 800; color: var(--on-surface); }
.pg-sub   { font-size: .85rem; color: var(--on-surface-variant); margin-top: .25rem; }
.hdr-actions { display: flex; align-items: center; gap: .5rem; }
.curr-chip { display: flex; align-items: center; gap: .3rem; padding: .4rem .75rem; border: 1.5px solid var(--outline-variant); border-radius: 999px; background: var(--surface-container); text-decoration: none; cursor: pointer; transition: border-color .15s; color: var(--on-surface); }
.curr-chip:hover { border-color: var(--primary); color: var(--primary); }
.curr-chip-sym  { font-size: 1rem; font-weight: 800; font-family: var(--font-headline); }
.curr-chip-code { font-size: .78rem; font-weight: 700; font-family: var(--font-headline); }
.icon-only { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.icon-only:hover { border-color: var(--primary); color: var(--primary); }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Balance card */
.balance-card { position: relative; background: linear-gradient(135deg, #1a0840 0%, #2e1065 60%, #0f172a 100%); border-radius: 20px; padding: 1.75rem; overflow: hidden; display: flex; flex-direction: column; gap: 1.25rem; border: 1px solid rgba(168,85,247,.2); }
@media (min-width: 580px) { .balance-card { flex-direction: row; align-items: center; justify-content: space-between; } }
.bc-glow { position: absolute; top: -80px; right: -80px; width: 240px; height: 240px; border-radius: 50%; background: radial-gradient(circle, rgba(99,14,212,.5) 0%, transparent 70%); pointer-events: none; }
.bc-label  { font-size: .72rem; color: rgba(255,255,255,.55); text-transform: uppercase; letter-spacing: .06em; font-family: var(--font-headline); }
.bc-amount { font-family: var(--font-headline); font-size: clamp(1.75rem,6vw,2.5rem); font-weight: 800; color: #fff; margin-top: .2rem; letter-spacing: -.02em; }
.bc-sub    { font-size: .72rem; color: rgba(255,255,255,.4); margin-top: .15rem; }
.bc-curr   { font-size: .7rem; font-weight: 700; opacity: .8; background: rgba(255,255,255,.15); padding: .1rem .4rem; border-radius: 4px; }
.bc-stats  { display: flex; align-items: center; gap: 1.25rem; }
.bc-stat   { display: flex; align-items: center; gap: .625rem; color: rgba(255,255,255,.7); }
.bc-sv { font-family: var(--font-headline); font-size: .9375rem; font-weight: 700; color: #fff; }
.bc-sl { font-size: .68rem; color: rgba(255,255,255,.45); margin-top: .1rem; }
.bc-div { width: 1px; height: 38px; background: rgba(255,255,255,.15); }

/* Fund methods */
.fund-methods-card { background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant); border-radius: 16px; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
.fm-title { display: flex; align-items: center; gap: .5rem; font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }
.fm-grid  { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: .75rem; }
.fm-item  { display: flex; align-items: flex-start; gap: .75rem; padding: .875rem; border-radius: 12px; background: var(--surface-container-low); border: 1px solid var(--outline-variant); }
.fm-ico   { width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.fm-ico .material-symbols-outlined { font-size: 20px; }
.fm-name  { font-family: var(--font-headline); font-size: .875rem; font-weight: 700; color: var(--on-surface); display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
.fm-desc  { font-size: .78rem; color: var(--on-surface-variant); margin-top: .2rem; line-height: 1.4; }
.fm-avail { font-size: .65rem; font-weight: 700; padding: .15rem .45rem; border-radius: 999px; background: rgba(22,163,74,.12); color: #16a34a; }
.fm-active { border-color: rgba(22,163,74,.3) !important; }
.fm-fund-btn { display: flex; align-items: center; gap: .5rem; padding: .75rem 1.75rem; align-self: flex-start; font-size: .95rem; }

/* DVA card */
.dva-card { background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant); border-radius: 16px; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
.dva-hdr { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.dva-hdr-left { display: flex; align-items: flex-start; gap: .75rem; }
.dva-ico   { font-size: 24px; color: var(--primary); margin-top: .1rem; flex-shrink: 0; }
.dva-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }
.dva-sub   { font-size: .8rem; color: var(--on-surface-variant); margin-top: .2rem; }
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

/* Quick actions — 4 columns */
.quick-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: .75rem; }
@media (max-width: 380px) { .quick-grid { grid-template-columns: repeat(2,1fr); } }
.quick-btn { display: flex; flex-direction: column; align-items: center; gap: .625rem; padding: 1rem .5rem; background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); border-radius: 16px; cursor: pointer; transition: border-color .15s, transform .15s; }
.quick-btn:hover { border-color: var(--primary); transform: translateY(-2px); }
.qb-ico { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.qb-ico .material-symbols-outlined { font-size: 22px; }
.qb-lbl { font-family: var(--font-headline); font-size: .78rem; font-weight: 600; color: var(--on-surface); }

/* Transaction card */
.tx-card  { background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); border-radius: 16px; overflow: hidden; }
.tx-hdr   { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem .75rem; border-bottom: 1px solid var(--outline-variant); }
.tx-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }
.tx-count { font-size: .75rem; color: var(--on-surface-variant); background: var(--surface-container); padding: .2rem .6rem; border-radius: 999px; }
.tx-skel  { display: flex; align-items: center; gap: .75rem; padding: .875rem 1.25rem; border-bottom: 1px solid var(--outline-variant); }
.skel-ico { width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0; }
.skel-lines { flex: 1; display: flex; flex-direction: column; gap: .4rem; }
.skel-l1  { height: 12px; border-radius: 4px; width: 55%; }
.skel-l2  { height: 10px; border-radius: 4px; width: 35%; }
.skel-amt { width: 70px; height: 20px; border-radius: 4px; }
.shimmer  { background: linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.tx-empty { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: 3rem 1rem; color: var(--on-surface-variant); font-size: .875rem; }
.tx-empty-sub { font-size: .8rem; opacity: .7; }
.tx-row   { display: flex; align-items: center; gap: .875rem; padding: .875rem 1.25rem; border-bottom: 1px solid var(--outline-variant); transition: background .12s; }
.tx-row:last-child { border-bottom: none; }
.tx-row:hover { background: var(--surface-container-low); }
.tx-ico-wrap { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tx-ico   { font-size: 20px; }
.tx-info  { flex: 1; min-width: 0; }
.tx-name  { font-size: .875rem; font-weight: 600; color: var(--on-surface); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tx-date  { font-size: .72rem; color: var(--on-surface-variant); margin-top: .1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tx-right { display: flex; flex-direction: column; align-items: flex-end; gap: .25rem; flex-shrink: 0; }
.tx-amt   { font-family: var(--font-headline); font-size: .9rem; font-weight: 700; }
.tx-amt.pos { color: #16a34a; }
.tx-amt.neg { color: #ef4444; }
.tx-badge { font-size: .65rem; font-weight: 700; text-transform: uppercase; padding: .15rem .5rem; border-radius: 999px; letter-spacing: .04em; }
.tx-badge.success    { background: rgba(22,163,74,.1);  color: #16a34a; }
.tx-badge.pending    { background: rgba(245,158,11,.1); color: #f59e0b; }
.tx-badge.processing { background: rgba(99,14,212,.1);  color: var(--primary); }
.tx-badge.failed     { background: rgba(239,68,68,.1);  color: #ef4444; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,.55); backdrop-filter: blur(4px); display: flex; align-items: flex-end; justify-content: center; padding: 0; }
@media (min-width: 600px) { .modal-overlay { align-items: center; padding: 1rem; } }
.modal-box { width: 100%; max-width: 480px; background: var(--surface-container-lowest); border-radius: 20px 20px 0 0; display: flex; flex-direction: column; max-height: 92vh; overflow-y: auto; }
@media (min-width: 600px) { .modal-box { border-radius: 20px; } }
.modal-hdr   { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem 0; position: sticky; top: 0; background: var(--surface-container-lowest); z-index: 1; }
.modal-title { font-family: var(--font-headline); font-size: 1.1rem; font-weight: 800; color: var(--on-surface); }
.modal-close { width: 34px; height: 34px; border-radius: 50%; border: none; background: var(--surface-container); color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.modal-close:hover { background: var(--surface-container-high); }
.modal-body  { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.modal-sub   { font-size: .875rem; color: var(--on-surface-variant); }
.avail-balance { font-size: .9rem; color: var(--on-surface-variant); }
.avail-balance strong { color: var(--primary); }
.wd-fee-note { font-size: .78rem; opacity: .7; }
.preset-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: .5rem; }
.preset-btn  { padding: .6rem .25rem; border-radius: 10px; border: 1.5px solid var(--outline-variant); background: var(--surface-container); font-family: var(--font-headline); font-size: .82rem; font-weight: 600; color: var(--on-surface); cursor: pointer; transition: all .12s; }
.preset-btn:hover, .preset-btn.active { border-color: var(--primary); background: color-mix(in srgb,var(--primary) 8%,transparent); color: var(--primary); }
.input-group { display: flex; align-items: center; background: var(--surface-container); border: 1.5px solid var(--outline-variant); border-radius: 12px; overflow: hidden; transition: border-color .15s; }
.input-group:focus-within { border-color: var(--primary); }
.inp-prefix { padding: .75rem 0 .75rem 1rem; font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface-variant); }
.modal-inp  { flex: 1; padding: .75rem .875rem; background: transparent; border: none; outline: none; font-family: var(--font-headline); font-size: .95rem; color: var(--on-surface); }
.modal-inp::placeholder { color: var(--outline); }
.modal-sel  { width: 100%; padding: .75rem .875rem; background: var(--surface-container); border: 1.5px solid var(--outline-variant); border-radius: 12px; font-size: .9rem; color: var(--on-surface); outline: none; transition: border-color .15s; }
.modal-sel:focus { border-color: var(--primary); }
.field-group { display: flex; flex-direction: column; gap: .4rem; }
.field-label { font-size: .8rem; font-weight: 600; color: var(--on-surface-variant); }
.amount-display { padding: .75rem 1rem; background: color-mix(in srgb,var(--primary) 6%,transparent); border: 1px solid color-mix(in srgb,var(--primary) 20%,transparent); border-radius: 10px; font-size: .875rem; color: var(--on-surface); }
.amount-display strong { color: var(--primary); font-weight: 700; }
.ps-note { display: flex; align-items: center; gap: .375rem; font-size: .75rem; color: var(--on-surface-variant); background: var(--surface-container); padding: .625rem .875rem; border-radius: 8px; }
.verify-btn { padding: .5rem .875rem; background: var(--primary); color: #fff; border: none; border-radius: 0 10px 10px 0; cursor: pointer; font-size: .82rem; font-weight: 700; white-space: nowrap; display: flex; align-items: center; gap: .3rem; flex-shrink: 0; }
.verify-btn:disabled { opacity: .6; cursor: not-allowed; }
.account-verified { display: flex; align-items: center; gap: .5rem; padding: .625rem .875rem; background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.25); border-radius: 10px; font-size: .875rem; font-weight: 600; color: var(--on-surface); }
.modal-footer { display: flex; gap: .75rem; justify-content: flex-end; padding: 1rem 1.5rem 1.5rem; border-top: 1px solid var(--outline-variant); }
.btn-ghost   { padding: .625rem 1.25rem; border-radius: 10px; border: 1px solid var(--outline-variant); background: none; color: var(--on-surface-variant); font-size: .875rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: .3rem; }
.btn-ghost:hover { border-color: var(--primary); color: var(--primary); }
.btn-primary { display: flex; align-items: center; gap: .4rem; padding: .7rem 1.5rem; border-radius: 10px; background: var(--primary); color: #fff; border: none; font-family: var(--font-headline); font-size: .9rem; font-weight: 700; cursor: pointer; transition: opacity .15s; }
.btn-primary:disabled { opacity: .5; cursor: not-allowed; }
.btn-primary:not(:disabled):hover { opacity: .9; }
.modal-pay-btn { min-width: 160px; justify-content: center; }
.btn-spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; animation: spin 0.7s linear infinite; flex-shrink: 0; }

/* Success banner */
.verify-banner { position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: .625rem; background: var(--surface-container-highest); border: 1px solid #22c55e; border-radius: 12px; padding: .75rem 1.25rem; font-size: .875rem; font-weight: 600; color: var(--on-surface); box-shadow: 0 8px 24px rgba(0,0,0,.2); white-space: nowrap; z-index: 600; }
.vb-close { background: none; border: none; cursor: pointer; color: var(--on-surface-variant); display: flex; align-items: center; }

/* History filter tabs */
.hist-tabs { display: flex; gap: .375rem; padding: .875rem 1.5rem .25rem; overflow-x: auto; scrollbar-width: none; }
.hist-tabs::-webkit-scrollbar { display: none; }
.hist-tab  { padding: .35rem .875rem; border-radius: 999px; border: 1.5px solid var(--outline-variant); background: none; font-size: .8rem; font-weight: 600; color: var(--on-surface-variant); cursor: pointer; white-space: nowrap; transition: all .15s; flex-shrink: 0; }
.hist-tab:hover { border-color: var(--primary); color: var(--primary); }
.hist-tab.active { border-color: var(--primary); background: color-mix(in srgb,var(--primary) 10%,transparent); color: var(--primary); }

/* Receipt */
.receipt-wrap   { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.receipt-header { display: flex; flex-direction: column; align-items: center; gap: .625rem; padding-bottom: 1rem; border-bottom: 1px solid var(--outline-variant); }
.receipt-ico-wrap { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
.receipt-ico    { font-size: 28px; }
.receipt-amt    { font-family: var(--font-headline); font-size: 2rem; font-weight: 800; }
.receipt-amt.pos { color: #16a34a; }
.receipt-amt.neg { color: #ef4444; }
.receipt-rows   { display: flex; flex-direction: column; }
.receipt-row    { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; padding: .625rem 0; border-bottom: 1px solid var(--outline-variant); }
.receipt-row:last-child { border-bottom: none; }
.receipt-lbl    { font-size: .8rem; color: var(--on-surface-variant); flex-shrink: 0; }
.receipt-val    { font-size: .85rem; font-weight: 600; color: var(--on-surface); text-align: right; word-break: break-all; max-width: 60%; }
.mono           { font-family: monospace; font-size: .75rem !important; }
.receipt-brand  { text-align: center; font-size: .72rem; color: var(--on-surface-variant); opacity: .6; }
.receipt-actions { display: flex; gap: .625rem; padding: .875rem 1.5rem 1.5rem; border-top: 1px solid var(--outline-variant); }
.receipt-actions .btn-ghost { flex: 1; justify-content: center; }

/* Username chip on balance card */
.bc-username-chip { display: inline-flex; align-items: center; gap: .3rem; margin-top: .5rem; padding: .3rem .75rem; border-radius: 999px; border: 1px solid rgba(255,255,255,.25); background: rgba(255,255,255,.08); color: rgba(255,255,255,.85); font-size: .78rem; font-weight: 600; cursor: pointer; transition: background .15s; font-family: monospace; }
.bc-username-chip:hover { background: rgba(255,255,255,.15); }

/* Slide-down for account verified */
.slide-down-enter-active, .slide-down-leave-active { transition: all .2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }

/* Transitions */
.modal-enter-active, .modal-leave-active { transition: all .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: translateY(20px); }
.slide-up-enter-active, .slide-up-leave-active { transition: all .25s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }
</style>
