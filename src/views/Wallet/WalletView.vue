<template>
  <div class="wallet-view">

    <!-- ══ Page Header ══ -->
    <div class="page-hdr">
      <div>
        <h2 class="pg-title">Wallet</h2>
        <p class="pg-sub">Manage your GFD earnings, payments and crypto</p>
      </div>
      <div class="hdr-actions">
        <RouterLink to="/settings" class="curr-chip" title="Change currency">
          <span class="curr-chip-sym">{{ currencyStore.current.symbol }}</span>
          <span class="curr-chip-code">{{ currencyStore.current.code }}</span>
          <span class="material-symbols-outlined" style="font-size:14px;opacity:.6">tune</span>
        </RouterLink>
        <button class="icon-only" @click="activeTab === 'ngn' ? loadWallet() : loadCrypto()" :disabled="loading || cryptoLoading">
          <span class="material-symbols-outlined" :class="{ spin: loading || cryptoLoading }">refresh</span>
        </button>
      </div>
    </div>

    <!-- ══ Wallet Tabs ══ -->
    <div class="wallet-tabs">
      <button class="wallet-tab" :class="{ active: activeTab === 'ngn' }" @click="activeTab = 'ngn'">
        <span class="material-symbols-outlined" style="font-size:18px">account_balance_wallet</span>
        <span>NGN Wallet</span>
        <span class="tab-currency">₦</span>
      </button>
      <button class="wallet-tab" :class="{ active: activeTab === 'crypto' }" @click="activeTab = 'crypto'; loadCrypto()">
        <span class="wallet-tab-crypto-icons">₿</span>
        <span>Crypto Wallet</span>
        <span class="tab-badge-new">NEW</span>
      </button>
    </div>

    <!-- ══ NGN Wallet Tab ══ -->
    <div v-show="activeTab === 'ngn'">

    <!-- ══ Hero Balance Card ══ -->
    <div class="balance-card">
      <div class="bc-blob bc-blob-1"></div>
      <div class="bc-blob bc-blob-2"></div>
      <div class="bc-grid-overlay"></div>
      <div class="bc-content">
        <div class="bc-left">
          <p class="bc-label">
            <span class="material-symbols-outlined" style="font-size:13px">account_balance_wallet</span>
            Total Balance
          </p>
          <p class="bc-amount">{{ fmtWallet(balance) }}</p>
          <p class="bc-sub">Available for withdrawal &nbsp;<span class="bc-curr-tag">{{ currencyStore.current.code }}</span></p>
          <button v-if="authStore.profile?.username" class="bc-username-chip"
            @click="copyUsername"
            :title="usernameCopied ? 'Copied!' : 'Copy your GFD username'">
            <span class="material-symbols-outlined" style="font-size:13px">alternate_email</span>
            {{ authStore.profile.username }}
            <span class="material-symbols-outlined" style="font-size:12px">{{ usernameCopied ? 'check' : 'content_copy' }}</span>
          </button>
        </div>
        <div class="bc-divider"></div>
        <div class="bc-stats">
          <div class="bc-stat">
            <div class="bc-stat-icon bc-stat-up">
              <span class="material-symbols-outlined">trending_up</span>
            </div>
            <div>
              <p class="bc-sv">{{ fmtWallet(totalEarned) }}</p>
              <p class="bc-sl">Total Earned</p>
            </div>
          </div>
          <div class="bc-stat">
            <div class="bc-stat-icon bc-stat-out">
              <span class="material-symbols-outlined">arrow_outward</span>
            </div>
            <div>
              <p class="bc-sv">{{ fmtWallet(totalWithdrawn) }}</p>
              <p class="bc-sl">Withdrawn</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ Quick Actions ══ -->
    <div class="quick-grid">
      <button class="quick-btn" @click="fundAmount = 500; showFundModal = true">
        <div class="qb-ico qb-purple">
          <span class="material-symbols-outlined">add_circle</span>
        </div>
        <span class="qb-lbl">Fund</span>
      </button>
      <button class="quick-btn" @click="showTransferModal = true">
        <div class="qb-ico qb-blue">
          <span class="material-symbols-outlined">send</span>
        </div>
        <span class="qb-lbl">Transfer</span>
      </button>
      <button class="quick-btn" @click="showWithdrawModal = true">
        <div class="qb-ico qb-green">
          <span class="material-symbols-outlined">arrow_upward</span>
        </div>
        <span class="qb-lbl">Withdraw</span>
      </button>
      <button class="quick-btn" @click="openHistory">
        <div class="qb-ico qb-amber">
          <span class="material-symbols-outlined">receipt_long</span>
        </div>
        <span class="qb-lbl">History</span>
      </button>
    </div>

    <!-- ══ Virtual Account Card ══ -->
    <div class="dva-card">
      <div class="dva-hdr">
        <div class="dva-hdr-left">
          <div class="dva-icon-wrap">
            <span class="material-symbols-outlined">account_balance</span>
          </div>
          <div>
            <p class="dva-title">Personal Bank Account</p>
            <p class="dva-sub">Transfer here from any Nigerian bank — wallet credited instantly</p>
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
          <div class="dva-row dva-row-acct">
            <span class="dva-lbl">Account Number</span>
            <div class="dva-acct-row">
              <span class="dva-acct-num">{{ virtualAccount.account_number }}</span>
              <button class="dva-copy-btn" @click="copyAcctNum" :class="{ copied: acctCopied }">
                <span class="material-symbols-outlined" style="font-size:15px">{{ acctCopied ? 'check' : 'content_copy' }}</span>
                {{ acctCopied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
          </div>
        </div>
        <div class="dva-note">
          <span class="material-symbols-outlined" style="font-size:16px;color:#22c55e">check_circle</span>
          GTBank, Access, Opay, Kuda &amp; all banks supported. Credits in seconds.
        </div>
      </template>
      <template v-else>
        <p class="dva-empty">Get a permanent Wema Bank account number. Any transfer auto-tops up your wallet.</p>
        <button class="btn-primary dva-create-btn" :disabled="creatingDVA" @click="createVirtualAccount">
          <span v-if="creatingDVA" class="btn-spinner"></span>
          <span class="material-symbols-outlined" v-else style="font-size:18px">add_card</span>
          {{ creatingDVA ? 'Creating…' : 'Get My Account Number' }}
        </button>
      </template>
    </div>

    <!-- ══ How to Fund ══ -->
    <div class="fund-methods-card">
      <div class="fm-header">
        <div class="fm-header-left">
          <span class="material-symbols-outlined" style="font-size:20px;color:var(--primary)">payments</span>
          <span class="fm-title">How to Fund Your Wallet</span>
        </div>
        <button class="btn-primary fm-fund-btn" @click="fundAmount = 500; showFundModal = true">
          <span class="material-symbols-outlined" style="font-size:16px">add_circle</span>
          Fund Now
        </button>
      </div>
      <div class="fm-grid">
        <div class="fm-item">
          <div class="fm-ico" style="background:rgba(22,163,74,.1)">
            <span class="material-symbols-outlined" style="color:#16a34a">credit_card</span>
          </div>
          <div>
            <p class="fm-name">Card <span class="fm-avail">✓ Available</span></p>
            <p class="fm-desc">Visa, Mastercard or Verve — instant.</p>
          </div>
        </div>
        <div class="fm-item">
          <div class="fm-ico" style="background:rgba(99,14,212,.08)">
            <span class="material-symbols-outlined" style="color:var(--primary)">account_balance</span>
          </div>
          <div>
            <p class="fm-name">Bank Transfer <span class="fm-avail">✓ Available</span></p>
            <p class="fm-desc">Any Nigerian bank — credited instantly.</p>
          </div>
        </div>
        <div class="fm-item">
          <div class="fm-ico" style="background:rgba(245,158,11,.1)">
            <span class="material-symbols-outlined" style="color:#f59e0b">dialpad</span>
          </div>
          <div>
            <p class="fm-name">USSD <span class="fm-avail">✓ Available</span></p>
            <p class="fm-desc">Dial a shortcode. No internet needed.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ Recent Transactions ══ -->
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
        <div class="tx-empty-icon">
          <span class="material-symbols-outlined">receipt_long</span>
        </div>
        <p class="tx-empty-title">No transactions yet</p>
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
            <span class="tx-badge" :class="tx.status">{{ txStatusLabel(tx) }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- ══ TRANSFER MODAL ══ -->
    <Transition name="modal">
      <div v-if="showTransferModal" class="modal-overlay" @click.self="showTransferModal = false">
        <div class="modal-box">
          <div class="modal-hdr">
            <div class="modal-hdr-icon" style="background:rgba(59,130,246,.1)">
              <span class="material-symbols-outlined" style="color:#3b82f6">send</span>
            </div>
            <h3 class="modal-title">Send Money</h3>
            <button class="modal-close" @click="showTransferModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="avail-balance">
              Available: <strong>{{ fmtNgn(balance) }}</strong>
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
              <input v-model="tr.note" type="text" class="modal-inp-plain"
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

    <!-- ══ HISTORY MODAL ══ -->
    <Transition name="modal">
      <div v-if="showTxModal" class="modal-overlay" @click.self="showTxModal = false">
        <div class="modal-box" style="max-width:560px">
          <div class="modal-hdr">
            <div class="modal-hdr-icon" style="background:rgba(245,158,11,.1)">
              <span class="material-symbols-outlined" style="color:#f59e0b">receipt_long</span>
            </div>
            <h3 class="modal-title">Transaction History</h3>
            <button class="modal-close" @click="showTxModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <template v-if="selectedTx">
            <div class="receipt-wrap" ref="receiptRef">
              <div class="receipt-header">
                <div class="receipt-ico-wrap" :style="txStyle(selectedTx).bg">
                  <span class="material-symbols-outlined receipt-ico" :style="txStyle(selectedTx).color">{{ txIcon(selectedTx) }}</span>
                </div>
                <p class="receipt-amt" :class="isDebit(selectedTx) ? 'neg' : 'pos'">
                  {{ isDebit(selectedTx) ? '-' : '+' }}{{ fmtNgn(selectedTx.amount) }}
                </p>
                <span class="tx-badge" :class="selectedTx.status">{{ txStatusLabel(selectedTx) }}</span>
              </div>
              <div class="receipt-rows">
                <div class="receipt-row"><span class="receipt-lbl">Transaction ID</span><span class="receipt-val mono">{{ selectedTx.id }}</span></div>
                <div class="receipt-row"><span class="receipt-lbl">Type</span><span class="receipt-val" style="text-transform:capitalize">{{ selectedTx.type.replace('_',' ') }}</span></div>
                <div class="receipt-row" v-if="selectedTx.reference"><span class="receipt-lbl">Reference</span><span class="receipt-val mono">{{ selectedTx.reference }}</span></div>
                <div class="receipt-row" v-if="selectedTx.description"><span class="receipt-lbl">Description</span><span class="receipt-val">{{ selectedTx.description }}</span></div>
                <div class="receipt-row" v-if="selectedTx.fee > 0"><span class="receipt-lbl">Fee</span><span class="receipt-val">{{ fmtNgn(selectedTx.fee) }}</span></div>
                <div class="receipt-row" v-if="selectedTx.balance_before != null"><span class="receipt-lbl">Balance Before</span><span class="receipt-val">{{ fmtNgn(selectedTx.balance_before) }}</span></div>
                <div class="receipt-row" v-if="selectedTx.balance_after != null"><span class="receipt-lbl">Balance After</span><span class="receipt-val">{{ fmtNgn(selectedTx.balance_after) }}</span></div>
                <div class="receipt-row" v-if="selectedTx.provider"><span class="receipt-lbl">Provider</span><span class="receipt-val" style="text-transform:capitalize">{{ selectedTx.provider }}</span></div>
                <div class="receipt-row"><span class="receipt-lbl">Date &amp; Time</span><span class="receipt-val">{{ fmtDateFull(selectedTx.created_at) }}</span></div>
              </div>
              <div class="receipt-brand">GFD Wallet · globalfd.xyz</div>
            </div>
            <div class="receipt-actions">
              <button class="btn-ghost" @click="selectedTx = null">
                <span class="material-symbols-outlined" style="font-size:16px">arrow_back</span>Back
              </button>
              <button class="btn-ghost" @click="shareReceipt">
                <span class="material-symbols-outlined" style="font-size:16px">share</span>Share
              </button>
              <button class="btn-primary" @click="downloadReceipt">
                <span class="material-symbols-outlined" style="font-size:16px">download</span>Download
              </button>
            </div>
          </template>
          <template v-else>
            <div class="hist-tabs">
              <button v-for="tab in histTabs" :key="tab.value"
                class="hist-tab" :class="{ active: txFilter === tab.value }"
                @click="setTxFilter(tab.value)">{{ tab.label }}</button>
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
                <div v-for="tx in histTxs" :key="tx.id" class="tx-row tx-row-clickable" @click="selectedTx = tx">
                  <div class="tx-ico-wrap" :style="txStyle(tx).bg">
                    <span class="material-symbols-outlined tx-ico" :style="txStyle(tx).color">{{ txIcon(tx) }}</span>
                  </div>
                  <div class="tx-info">
                    <p class="tx-name">{{ tx.description || tx.type }}</p>
                    <p class="tx-date">{{ fmtDate(tx.created_at) }}{{ tx.reference ? ' · ' + tx.reference : '' }}</p>
                  </div>
                  <div class="tx-right">
                    <span class="tx-amt" :class="isDebit(tx) ? 'neg' : 'pos'">{{ isDebit(tx) ? '-' : '+' }}{{ fmtNgn(tx.amount) }}</span>
                    <span class="tx-badge" :class="tx.status">{{ txStatusLabel(tx) }}</span>
                  </div>
                </div>
              </template>
              <button v-if="histHasMore && !histLoading"
                class="btn-ghost" style="width:100%;margin-top:.5rem;justify-content:center"
                @click="loadMoreHist">Load more</button>
            </div>
          </template>
        </div>
      </div>
    </Transition>

    <!-- ══ FUND MODAL ══ -->
    <Transition name="modal">
      <div v-if="showFundModal" class="modal-overlay" @click.self="showFundModal = false">
        <div class="modal-box">
          <div class="modal-hdr">
            <div class="modal-hdr-icon" style="background:rgba(99,14,212,.1)">
              <span class="material-symbols-outlined" style="color:var(--primary)">payments</span>
            </div>
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

    <!-- ══ WITHDRAW MODAL ══ -->
    <Transition name="modal">
      <div v-if="showWithdrawModal" class="modal-overlay" @click.self="showWithdrawModal = false">
        <div class="modal-box">
          <div class="modal-hdr">
            <div class="modal-hdr-icon" style="background:rgba(22,163,74,.1)">
              <span class="material-symbols-outlined" style="color:#16a34a">arrow_upward</span>
            </div>
            <h3 class="modal-title">Withdraw Funds</h3>
            <button class="modal-close" @click="showWithdrawModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="avail-balance">
              Available: <strong>{{ fmtNgn(balance) }}</strong>
              <span class="wd-fee-note"> · ₦50 processing fee</span>
            </div>
            <div class="field-group">
              <label class="field-label">Amount (₦)</label>
              <div class="input-group">
                <span class="inp-prefix">₦</span>
                <input v-model.number="wd.amount" type="number" class="modal-inp"
                  placeholder="Min ₦100" min="100" :max="balance" />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Bank Name</label>
              <input v-model="wd.bank_name" type="text" class="modal-inp-plain"
                placeholder="e.g. GTBank, Access, Opay" />
            </div>
            <div class="field-group">
              <label class="field-label">Account Number</label>
              <input v-model="wd.account_number" type="text" class="modal-inp-plain"
                autocomplete="off" placeholder="10-digit NUBAN" maxlength="10" />
            </div>
            <div class="field-group">
              <label class="field-label">Account Name</label>
              <input v-model="wd.account_name" type="text" class="modal-inp-plain"
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

    <!-- ══ SUCCESS BANNER ══ -->
    <Transition name="slide-up">
      <div v-if="verifyBanner" class="verify-banner">
        <span class="material-symbols-outlined" style="color:#22c55e;font-size:20px">check_circle</span>
        {{ verifyBanner }}
        <button @click="verifyBanner=''" class="vb-close">
          <span class="material-symbols-outlined" style="font-size:16px">close</span>
        </button>
      </div>
    </Transition>

    </div><!-- end NGN tab -->

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- ══ CRYPTO WALLET TAB ══════════════════════════════════════════════════ -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'crypto'" class="crypto-tab">

      <!-- Skeleton loader -->
      <template v-if="cryptoLoading && !cryptoBalances.length">
        <div class="crypto-hero-skel">
          <div class="shimmer" style="height:140px;border-radius:20px;width:100%"></div>
        </div>
        <div v-for="i in 5" :key="i" class="coin-row-skel">
          <div class="shimmer" style="width:44px;height:44px;border-radius:12px;flex-shrink:0"></div>
          <div style="flex:1;display:flex;flex-direction:column;gap:.35rem">
            <div class="shimmer" style="height:12px;width:40%;border-radius:4px"></div>
            <div class="shimmer" style="height:10px;width:25%;border-radius:4px"></div>
          </div>
          <div class="shimmer" style="width:72px;height:22px;border-radius:6px"></div>
        </div>
      </template>

      <template v-else>

        <!-- ── Crypto Total Value Card ── -->
        <div class="crypto-hero">
          <div class="ch-blob ch-blob-1"></div>
          <div class="ch-blob ch-blob-2"></div>
          <div class="ch-content">
            <div class="ch-left">
              <p class="ch-label">
                <span style="font-size:16px">₿</span>
                Total Crypto Value
              </p>
              <p class="ch-amount">${{ fmtCryptoUsd(cryptoTotalUsd) }}</p>
              <p class="ch-sub">Across {{ cryptoBalances.filter(c => c.balance > 0).length }} asset{{ cryptoBalances.filter(c => c.balance > 0).length !== 1 ? 's' : '' }}</p>
            </div>
            <div class="ch-coins-preview">
              <div v-for="c in cryptoBalances.slice(0,5)" :key="c.coin"
                class="ch-coin-dot" :style="{ background: c.color + '22', border: '2px solid ' + c.color + '44' }"
                :title="c.name">
                <CoinIcon :coin="c.coin" :size="22" />
              </div>
            </div>
          </div>
        </div>

        <!-- ── Quick Actions ── -->
        <div class="crypto-quick-actions">
          <button class="cqa-btn" @click="showCoinPicker = true">
            <div class="cqa-ico" style="background:rgba(22,163,74,.12);color:#16a34a">
              <span class="material-symbols-outlined">arrow_downward</span>
            </div>
            <span class="cqa-lbl">Receive</span>
          </button>
          <button class="cqa-btn" @click="showSendCoinPicker = true">
            <div class="cqa-ico" style="background:rgba(99,14,212,.1);color:var(--primary)">
              <span class="material-symbols-outlined">arrow_upward</span>
            </div>
            <span class="cqa-lbl">Send</span>
          </button>
          <button class="cqa-btn" @click="showCryptoHistoryModal = true">
            <div class="cqa-ico" style="background:rgba(245,158,11,.1);color:#f59e0b">
              <span class="material-symbols-outlined">receipt_long</span>
            </div>
            <span class="cqa-lbl">History</span>
          </button>
          <button class="cqa-btn" @click="loadCrypto">
            <div class="cqa-ico" style="background:rgba(59,130,246,.1);color:#3b82f6">
              <span class="material-symbols-outlined" :class="{ spin: cryptoLoading }">refresh</span>
            </div>
            <span class="cqa-lbl">Refresh</span>
          </button>
        </div>

        <!-- ── Notice bar ── -->
        <div class="crypto-notice">
          <span class="material-symbols-outlined" style="font-size:16px;color:#f59e0b">info</span>
          <span>Deposits are processed via <strong>NOWPayments</strong>. Send only the correct coin on the correct network.</span>
        </div>

        <!-- ── Coin Cards ── -->
        <div class="coin-list">
          <div v-for="coin in cryptoBalances" :key="coin.coin"
            class="coin-card"
            @click="selectCoin(coin)">
            <div class="coin-icon-wrap" :style="{ background: coin.color + '18' }">
              <CoinIcon :coin="coin.coin" :size="32" />
            </div>
            <div class="coin-info">
              <div class="coin-name-row">
                <span class="coin-name">{{ coin.name }}</span>
                <span class="coin-network">{{ coin.network }}</span>
              </div>
              <div class="coin-price-row">
                <span class="coin-symbol">{{ coin.symbol }}</span>
                <span class="coin-live-price" v-if="livePrices[coin.coin]">
                  ${{ livePrices[coin.coin].usd >= 1 ? livePrices[coin.coin].usd.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) : livePrices[coin.coin].usd.toFixed(4) }}
                  <span :class="livePrices[coin.coin].change_24h >= 0 ? 'chg-up' : 'chg-dn'">
                    {{ livePrices[coin.coin].change_24h >= 0 ? '▲' : '▼' }}{{ Math.abs(livePrices[coin.coin].change_24h).toFixed(2) }}%
                  </span>
                </span>
              </div>
            </div>
            <div class="coin-balance-col">
              <span class="coin-balance">{{ fmtCoinAmount(coin.balance, coin.coin) }} {{ coin.symbol }}</span>
              <span class="coin-usd" v-if="coin.balance > 0">
                ≈ ${{ fmtCryptoUsd(coin.balance * livePrices[coin.coin]?.usd) }}
                <span :class="livePrices[coin.coin]?.change_24h >= 0 ? 'chg-up' : 'chg-dn'"
                  v-if="livePrices[coin.coin]?.change_24h !== 0">
                  {{ livePrices[coin.coin]?.change_24h >= 0 ? '+' : '' }}{{ livePrices[coin.coin]?.change_24h?.toFixed(2) }}%
                </span>
              </span>
              <span class="coin-usd zero" v-else>$0.00</span>
            </div>
            <div class="coin-actions-col">
              <button class="coin-action-btn deposit-btn" @click.stop="selectCoin(coin)" title="Deposit">
                <span class="material-symbols-outlined" style="font-size:16px">arrow_downward</span>
              </button>
              <button class="coin-action-btn send-btn" @click.stop="openSendModal(coin)" title="Send"
                :disabled="coin.balance <= 0">
                <span class="material-symbols-outlined" style="font-size:16px">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ── Crypto Transactions ── -->
        <div class="tx-card" style="margin-top:.25rem">
          <div class="tx-hdr">
            <h3 class="tx-title">Crypto History</h3>
            <span class="tx-count" v-if="cryptoTxs.length">{{ cryptoTxs.length }} records</span>
          </div>
          <div v-if="cryptoTxLoading" class="tx-empty" style="padding:2rem 0">
            <div class="btn-spinner" style="border-color:rgba(99,14,212,.15);border-top-color:var(--primary);width:24px;height:24px"></div>
          </div>
          <div v-else-if="!cryptoTxs.length" class="tx-empty">
            <div class="tx-empty-icon"><span class="material-symbols-outlined">currency_bitcoin</span></div>
            <p class="tx-empty-title">No transactions yet</p>
            <p class="tx-empty-sub">Deposit crypto to get started</p>
          </div>
          <template v-else>
            <div v-for="tx in cryptoTxs" :key="tx.id" class="tx-row">
              <div class="tx-ico-wrap" :style="{ background: coinColor(tx.coin) + '18' }">
                <CoinIcon :coin="tx.coin" :size="26" />
              </div>
              <div class="tx-info">
                <p class="tx-name" style="text-transform:capitalize">{{ tx.type }} · {{ tx.symbol }}</p>
                <p class="tx-date">{{ fmtDate(tx.created_at) }}{{ tx.tx_hash ? ' · ' + tx.tx_hash.slice(0,12) + '…' : '' }}</p>
              </div>
              <div class="tx-right">
                <span class="tx-amt pos">+{{ fmtCoinAmount(tx.amount, tx.coin) }} {{ tx.symbol }}</span>
                <span class="tx-badge" :class="tx.status">{{ tx.status }}</span>
              </div>
            </div>
          </template>
        </div>

      </template>

      <!-- ══ CRYPTO HISTORY MODAL ══ -->
      <Transition name="modal">
        <div v-if="showCryptoHistoryModal" class="modal-overlay" @click.self="showCryptoHistoryModal = false">
          <div class="modal-box" style="max-width:560px">
            <div class="modal-hdr">
              <div class="modal-hdr-icon" style="background:rgba(245,158,11,.1)">
                <span class="material-symbols-outlined" style="color:#f59e0b;font-size:20px">receipt_long</span>
              </div>
              <h3 class="modal-title">Crypto History</h3>
              <button class="modal-close" @click="showCryptoHistoryModal = false">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="modal-body" style="padding-top:.5rem;max-height:60vh;overflow-y:auto">
              <div v-if="cryptoTxLoading" class="tx-empty" style="padding:2rem 0">
                <div class="btn-spinner" style="border-color:rgba(99,14,212,.15);border-top-color:var(--primary);width:24px;height:24px"></div>
              </div>
              <div v-else-if="!cryptoTxs.length" class="tx-empty">
                <div class="tx-empty-icon"><span class="material-symbols-outlined">currency_bitcoin</span></div>
                <p class="tx-empty-title">No transactions yet</p>
                <p class="tx-empty-sub">Deposit or send crypto to get started</p>
              </div>
              <template v-else>
                <div v-for="tx in cryptoTxs" :key="tx.id" class="tx-row">
                  <div class="tx-ico-wrap" :style="{ background: coinColor(tx.coin) + '18' }">
                    <CoinIcon :coin="tx.coin" :size="26" />
                  </div>
                  <div class="tx-info">
                    <p class="tx-name" style="text-transform:capitalize">{{ tx.type }} · {{ tx.symbol }}</p>
                    <p class="tx-date">{{ fmtDate(tx.created_at) }}{{ tx.tx_hash ? ' · ' + tx.tx_hash.slice(0,14) + '…' : '' }}</p>
                  </div>
                  <div class="tx-right">
                    <span class="tx-amt" :class="tx.type === 'deposit' ? 'pos' : 'neg'">
                      {{ tx.type === 'deposit' ? '+' : '-' }}{{ fmtCoinAmount(tx.amount, tx.coin) }} {{ tx.symbol }}
                    </span>
                    <span class="tx-badge" :class="tx.status">{{ tx.status }}</span>
                  </div>
                </div>
              </template>
            </div>
            <div class="modal-footer">
              <button class="btn-ghost" @click="showCryptoHistoryModal = false">Close</button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══ COIN PICKER (for Receive) ══ -->
      <Transition name="modal">
        <div v-if="showCoinPicker" class="modal-overlay" @click.self="showCoinPicker = false">
          <div class="modal-box" style="max-width:380px">
            <div class="modal-hdr">
              <div class="modal-hdr-icon" style="background:rgba(22,163,74,.1)">
                <span class="material-symbols-outlined" style="color:#16a34a;font-size:20px">arrow_downward</span>
              </div>
              <h3 class="modal-title">Choose Coin to Receive</h3>
              <button class="modal-close" @click="showCoinPicker = false">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="modal-body" style="padding-top:.5rem">
              <button v-for="coin in cryptoBalances" :key="coin.coin"
                class="coin-picker-row" @click="showCoinPicker=false; selectCoin(coin)">
                <CoinIcon :coin="coin.coin" :size="32" />
                <div class="cp-info">
                  <span class="cp-name">{{ coin.name }}</span>
                  <span class="cp-net">{{ coin.network }}</span>
                </div>
                <span class="material-symbols-outlined" style="font-size:18px;color:var(--on-surface-variant);opacity:.5">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══ SEND COIN PICKER ══ -->
      <Transition name="modal">
        <div v-if="showSendCoinPicker" class="modal-overlay" @click.self="showSendCoinPicker = false">
          <div class="modal-box" style="max-width:380px">
            <div class="modal-hdr">
              <div class="modal-hdr-icon" style="background:rgba(99,14,212,.1)">
                <span class="material-symbols-outlined" style="color:var(--primary);font-size:20px">arrow_upward</span>
              </div>
              <h3 class="modal-title">Choose Coin to Send</h3>
              <button class="modal-close" @click="showSendCoinPicker = false">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="modal-body" style="padding-top:.5rem">
              <button v-for="coin in cryptoBalances.filter(c=>c.balance>0)" :key="coin.coin"
                class="coin-picker-row" @click="showSendCoinPicker=false; openSendModal(coin)">
                <CoinIcon :coin="coin.coin" :size="32" />
                <div class="cp-info">
                  <span class="cp-name">{{ coin.name }}</span>
                  <span class="cp-net">{{ fmtCoinAmount(coin.balance, coin.coin) }} {{ coin.symbol }}</span>
                </div>
                <span class="material-symbols-outlined" style="font-size:18px;color:var(--on-surface-variant);opacity:.5">chevron_right</span>
              </button>
              <p v-if="!cryptoBalances.some(c=>c.balance>0)" class="tx-empty-sub" style="text-align:center;padding:1.5rem 0">
                No balance to send. Deposit first.
              </p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══ SEND MODAL ══ -->
      <Transition name="modal">
        <div v-if="showSendModal && sendCoin" class="modal-overlay" @click.self="showSendModal = false">
          <div class="modal-box">
            <div class="modal-hdr">
              <div class="modal-hdr-icon" :style="{ background: sendCoin.color + '18' }">
                <CoinIcon :coin="sendCoin.coin" :size="28" />
              </div>
              <h3 class="modal-title">Send {{ sendCoin.symbol }}</h3>
              <button class="modal-close" @click="showSendModal = false">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="avail-balance">
                Available: <strong>{{ fmtCoinAmount(sendCoin.balance, sendCoin.coin) }} {{ sendCoin.symbol }}</strong>
                <span v-if="livePrices[sendCoin.coin]"> · ≈ ${{ fmtCryptoUsd(sendCoin.balance * livePrices[sendCoin.coin]?.usd) }}</span>
              </div>
              <div class="field-group">
                <label class="field-label">Destination Address</label>
                <input v-model="sendForm.to_address" type="text" class="modal-inp-plain"
                  :placeholder="`${sendCoin.network} address`" autocomplete="off" spellcheck="false" />
              </div>
              <div class="field-group">
                <label class="field-label">Amount ({{ sendCoin.symbol }})</label>
                <div class="input-group">
                  <span class="inp-prefix">{{ sendCoin.symbol }}</span>
                  <input v-model.number="sendForm.amount" type="number" class="modal-inp"
                    :placeholder="`Min ${sendMinAmount(sendCoin.coin)}`" :max="sendCoin.balance" min="0" step="any" />
                  <button class="inp-max-btn" @click="sendForm.amount = sendCoin.balance">MAX</button>
                </div>
              </div>
              <div class="send-summary" v-if="sendForm.amount > 0 && sendForm.to_address">
                <div class="ss-row"><span>Amount</span><strong>{{ sendForm.amount }} {{ sendCoin.symbol }}</strong></div>
                <div class="ss-row"><span>Network Fee</span><strong>~{{ sendFeeAmount(sendCoin.coin) }} {{ sendCoin.symbol }}</strong></div>
                <div class="ss-row ss-total"><span>You send</span><strong>{{ fmtCoinAmount(sendForm.amount, sendCoin.coin) }} {{ sendCoin.symbol }}</strong></div>
              </div>
              <div class="deposit-warning-box">
                <span class="material-symbols-outlined" style="font-size:18px;flex-shrink:0">error_outline</span>
                <p>Only send to a <strong>{{ sendCoin.network }}</strong> address. Sending to the wrong network will result in permanent loss of funds.</p>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-ghost" @click="showSendModal = false">Cancel</button>
              <button class="btn-primary modal-pay-btn"
                :disabled="!canSend || sending"
                @click="submitSend">
                <span v-if="sending" class="btn-spinner"></span>
                <span class="material-symbols-outlined" v-else style="font-size:18px">arrow_upward</span>
                {{ sending ? 'Sending…' : `Send ${sendCoin.symbol}` }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══ DEPOSIT MODAL ══ -->
      <Transition name="modal">
        <div v-if="showDepositModal && selectedCoin" class="modal-overlay" @click.self="showDepositModal = false">
          <div class="modal-box">
            <div class="modal-hdr">
              <div class="modal-hdr-icon" :style="{ background: selectedCoin.color + '18' }">
                <CoinIcon :coin="selectedCoin.coin" :size="28" />
              </div>
              <h3 class="modal-title">Deposit {{ selectedCoin.symbol }}</h3>
              <button class="modal-close" @click="showDepositModal = false">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div class="modal-body">

              <!-- Loading address -->
              <div v-if="depositAddrLoading" class="deposit-loading">
                <div class="btn-spinner" style="border-color:rgba(99,14,212,.15);border-top-color:var(--primary);width:28px;height:28px"></div>
                <p style="font-size:.875rem;color:var(--on-surface-variant)">Generating deposit address…</p>
              </div>

              <template v-else-if="depositAddr">
                <!-- QR Code -->
                <div class="qr-wrap">
                  <img :src="depositAddr.qr_code" alt="QR Code" class="qr-img" />
                </div>

                <!-- Network badge -->
                <div class="deposit-network-row">
                  <span class="material-symbols-outlined" style="font-size:16px;color:#f59e0b">warning</span>
                  <span>Send only <strong>{{ depositAddr.symbol }}</strong> on the <strong>{{ depositAddr.network }}</strong> network</span>
                </div>

                <!-- Address box -->
                <div class="deposit-addr-box">
                  <div class="dep-addr-label">Deposit Address</div>
                  <div class="dep-addr-row">
                    <code class="dep-addr-code">{{ depositAddr.address }}</code>
                    <button class="dep-copy-btn" @click="copyDepositAddr" :class="{ copied: addrCopied }">
                      <span class="material-symbols-outlined" style="font-size:16px">{{ addrCopied ? 'check' : 'content_copy' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Info rows -->
                <div class="deposit-info-grid">
                  <div class="dep-info-row">
                    <span class="dep-info-lbl">Coin</span>
                    <span class="dep-info-val">{{ depositAddr.name }} ({{ depositAddr.symbol }})</span>
                  </div>
                  <div class="dep-info-row">
                    <span class="dep-info-lbl">Network</span>
                    <span class="dep-info-val">{{ depositAddr.network }}</span>
                  </div>
                  <div class="dep-info-row" v-if="depositAddr.warning">
                    <span class="dep-info-lbl">Note</span>
                    <span class="dep-info-val" style="color:#f59e0b">{{ depositAddr.warning }}</span>
                  </div>
                </div>

                <div class="deposit-warning-box">
                  <span class="material-symbols-outlined" style="font-size:18px;flex-shrink:0">error_outline</span>
                  <p>Sending the wrong coin or using the wrong network will result in permanent loss of funds. Always double-check before sending.</p>
                </div>
              </template>

              <div v-else class="tx-empty" style="padding:2rem 0">
                <p style="color:var(--on-surface-variant);font-size:.875rem">Could not load deposit address. Try again.</p>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn-ghost" @click="showDepositModal = false">Close</button>
              <button class="btn-primary" @click="copyDepositAddr" v-if="depositAddr && !depositAddrLoading">
                <span class="material-symbols-outlined" style="font-size:16px">{{ addrCopied ? 'check' : 'content_copy' }}</span>
                {{ addrCopied ? 'Copied!' : 'Copy Address' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

    </div><!-- end crypto tab -->

  </div><!-- end wallet-view -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CoinIcon from '@/components/CoinIcon.vue'
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

// ── Tab ────────────────────────────────────────────────────────────────────
const activeTab = ref('ngn')

// ── State ──────────────────────────────────────────────────────────────────
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
  wd.value.amount >= 100 &&
  wd.value.amount <= balance.value &&
  wd.value.bank_name.trim() &&
  wd.value.account_number.length >= 10 &&
  wd.value.account_name.trim()
)

// History state
const histTxs     = ref([])
const histPage    = ref(1)
const histHasMore = ref(false)
const histLoading = ref(false)
const txFilter    = ref(null)
const selectedTx  = ref(null)
const receiptRef  = ref(null)
const histLoaded  = ref(false)
const histTabs    = [
  { label: 'All',         value: null },
  { label: 'Deposits',    value: 'credit' },
  { label: 'Transfers',   value: 'debit' },
  { label: 'Withdrawals', value: 'withdrawal' },
]

// ── Helpers ─────────────────────────────────────────────────────────────────
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
function txStatusLabel(tx) {
  if (tx.type === 'withdrawal') {
    if (tx.status === 'success')    return 'Sent ✓'
    if (tx.status === 'pending')    return 'Pending'
    if (tx.status === 'processing') return 'Processing'
    if (tx.status === 'reversed')   return 'Refunded'
    if (tx.status === 'failed')     return 'Failed'
  }
  if (tx.status === 'success')  return 'Success'
  if (tx.status === 'pending')  return 'Pending'
  if (tx.status === 'reversed') return 'Reversed'
  if (tx.status === 'failed')   return 'Failed'
  return tx.status || '—'
}
function getBankName(code) {
  return liveBanks.value.find(b => b.code === code)?.name || ''
}

// ── Load wallet ──────────────────────────────────────────────────────────────
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

// ── History modal ────────────────────────────────────────────────────────────
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

async function openHistory() {
  showTxModal.value = true
  if (!histLoaded.value) {
    histLoaded.value = true
    histTxs.value = []
    histPage.value = 1
    await loadHist()
  }
}

// ── Receipt ──────────────────────────────────────────────────────────────────
async function shareReceipt() {
  const tx = selectedTx.value
  if (!tx) return
  const text = [
    'GFD Wallet Receipt',
    `Type: ${tx.type}`,
    `Amount: ${isDebit(tx) ? '-' : '+'}${fmtNgn(tx.amount)}`,
    `Reference: ${tx.reference || 'N/A'}`,
    `Description: ${tx.description || ''}`,
    `Status: ${tx.status}`,
    `Date: ${fmtDateFull(tx.created_at)}`,
    '\nglobalfd.xyz',
  ].join('\n')
  if (navigator.share) {
    try { await navigator.share({ title: 'GFD Payment Receipt', text }); return } catch { /* fallback */ }
  }
  await navigator.clipboard.writeText(text).catch(() => {})
  uiStore.showSuccess('Receipt copied to clipboard!')
}

async function downloadReceipt() {
  const tx = selectedTx.value
  if (!tx) return
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>GFD Receipt</title>
<style>body{font-family:sans-serif;max-width:420px;margin:40px auto;padding:24px;border:1px solid #e5e7eb;border-radius:16px}h2{text-align:center;margin:0 0 4px}.amt{text-align:center;font-size:2rem;font-weight:800;margin:8px 0;color:${isDebit(tx)?'#ef4444':'#16a34a'}}.badge{display:inline-block;padding:3px 12px;border-radius:999px;font-size:.75rem;font-weight:700;background:${tx.status==='success'?'#dcfce7':'#fef9c3'};color:${tx.status==='success'?'#16a34a':'#ca8a04'}}.center{text-align:center}table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:8px 4px;border-bottom:1px solid #f3f4f6;font-size:.875rem}td:first-child{color:#6b7280}td:last-child{text-align:right;font-weight:600;word-break:break-all}.brand{text-align:center;color:#9ca3af;font-size:.75rem;margin-top:16px}</style></head><body>
<h2>GFD Wallet Receipt</h2><div class="amt">${isDebit(tx)?'-':'+'}${fmtNgn(tx.amount)}</div><div class="center"><span class="badge">${tx.status}</span></div>
<table><tr><td>Transaction ID</td><td>${tx.id}</td></tr><tr><td>Type</td><td>${tx.type}</td></tr>${tx.reference?`<tr><td>Reference</td><td>${tx.reference}</td></tr>`:''}<tr><td>Date</td><td>${fmtDateFull(tx.created_at)}</td></tr></table>
<div class="brand">GFD Wallet · globalfd.xyz</div></body></html>`
  const blob = new Blob([html], { type: 'text/html' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `GFD-Receipt-${tx.reference || tx.id.slice(0,8)}.html`; a.click()
  URL.revokeObjectURL(url)
}

// ── Banks ────────────────────────────────────────────────────────────────────
async function loadBanks() {
  banksLoading.value = true
  try { liveBanks.value = await walletService.getBanks() }
  catch { /* silent */ }
  finally { banksLoading.value = false }
}

// ── Virtual account ──────────────────────────────────────────────────────────
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
  } finally { creatingDVA.value = false }
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

// ── Account verification ─────────────────────────────────────────────────────
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
  } finally { verifyingAccount.value = false }
}

// ── Fund via Paystack ─────────────────────────────────────────────────────────
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

// ── Verify after Paystack redirect ───────────────────────────────────────────
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

// ── Transfer ─────────────────────────────────────────────────────────────────
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
    if (showTxModal.value) { histPage.value = 1; histTxs.value = []; await loadHist() }
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Transfer failed. Please try again.')
  } finally { transferring.value = false }
}

// ── Withdraw ─────────────────────────────────────────────────────────────────
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
    uiStore.showSuccess(result.message || 'Withdrawal request submitted! Funds within 24 hours.')
    showWithdrawModal.value = false
    wd.value = { amount: 0, bank_code: '', bank_name: '', account_number: '', account_name: '', verified: false }
    await loadWallet()
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Withdrawal failed. Please try again.')
  } finally { withdrawing.value = false }
}

// ══════════════════════════════════════════════════════════════════════════════
// ── CRYPTO STATE ──────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

const cryptoLoading      = ref(false)
const cryptoTxLoading    = ref(false)
const cryptoLoaded       = ref(false)
const cryptoBalances     = ref([])
const cryptoTxs          = ref([])
const selectedCoin       = ref(null)
const showDepositModal   = ref(false)
const depositAddr        = ref(null)
const depositAddrLoading = ref(false)
const addrCopied         = ref(false)

// Live prices from CoinGecko
const livePrices = ref({
  btc:  { usd: 67000, change_24h: 0 },
  eth:  { usd: 3500,  change_24h: 0 },
  sol:  { usd: 145,   change_24h: 0 },
  usdt: { usd: 1,     change_24h: 0 },
  usdc: { usd: 1,     change_24h: 0 },
})

// Send state
const showSendModal = ref(false)
const sendCoin      = ref(null)
const sending       = ref(false)
const sendForm      = ref({ to_address: '', amount: 0 })

// Modal state
const showCryptoHistoryModal = ref(false)
const showCoinPicker         = ref(false)
const showSendCoinPicker     = ref(false)

const SEND_MIN  = { btc: 0.00001, eth: 0.0001, sol: 0.01, usdt: 1, usdc: 1 }
const SEND_FEES = { btc: 0.00005, eth: 0.0005,  sol: 0.001, usdt: 1, usdc: 1 }
function sendMinAmount(coin) { return SEND_MIN[coin?.toLowerCase()] ?? 0 }
function sendFeeAmount(coin) { return SEND_FEES[coin?.toLowerCase()] ?? 0 }

const canSend = computed(() =>
  sendForm.value.to_address.trim().length > 10 &&
  sendForm.value.amount > 0 &&
  sendForm.value.amount <= (sendCoin.value?.balance || 0) &&
  sendForm.value.amount >= sendMinAmount(sendCoin.value?.coin)
)

const cryptoTotalUsd = computed(() =>
  cryptoBalances.value.reduce((sum, c) => sum + (c.balance * (livePrices.value[c.coin]?.usd || 1)), 0)
)

function fmtCryptoUsd(n) {
  return Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtCoinAmount(n, coin) {
  const decimals = ['btc', 'eth', 'sol'].includes(coin?.toLowerCase()) ? 6 : 2
  return Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: decimals })
}

const COIN_COLORS = { usdt: '#26A17B', usdc: '#2775CA', btc: '#F7931A', eth: '#627EEA', sol: '#9945FF' }
function coinColor(coin) { return COIN_COLORS[coin?.toLowerCase()] || '#888' }

// ── Load live prices ──────────────────────────────────────────────────────────
async function loadLivePrices() {
  try {
    const data = await walletService.getCryptoPrices()
    if (data?.prices) livePrices.value = { ...livePrices.value, ...data.prices }
  } catch { /* silent — fallback prices stay */ }
}

// ── Load crypto balances + transactions ───────────────────────────────────────
async function loadCrypto() {
  if (cryptoLoading.value) return
  cryptoLoading.value = true
  cryptoTxLoading.value = true
  try {
    const [balData, txData] = await Promise.allSettled([
      walletService.getCryptoBalance(),
      walletService.getCryptoTransactions(),
    ])
    if (balData.status === 'fulfilled') {
      cryptoBalances.value = balData.value.balances || []
    }
    if (txData.status === 'fulfilled') {
      cryptoTxs.value = txData.value.transactions || []
    }
    cryptoLoaded.value = true
    loadLivePrices()
  } finally {
    cryptoLoading.value = false
    cryptoTxLoading.value = false
  }
}

// ── Select coin → open deposit modal ─────────────────────────────────────────
async function selectCoin(coin) {
  selectedCoin.value = coin
  showDepositModal.value = true
  depositAddr.value = null
  addrCopied.value = false
  depositAddrLoading.value = true
  try {
    depositAddr.value = await walletService.getCryptoDepositAddress(coin.coin)
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Could not load deposit address.')
    depositAddr.value = null
  } finally {
    depositAddrLoading.value = false
  }
}

async function copyDepositAddr() {
  const addr = depositAddr.value?.address
  if (!addr) return
  await navigator.clipboard.writeText(addr).catch(() => {})
  addrCopied.value = true
  setTimeout(() => addrCopied.value = false, 2500)
}

// ── Send crypto ───────────────────────────────────────────────────────────────
function openSendModal(coin) {
  sendCoin.value = coin
  sendForm.value = { to_address: '', amount: 0 }
  showSendModal.value = true
}

async function submitSend() {
  if (!canSend.value) return
  sending.value = true
  try {
    const result = await walletService.sendCrypto({
      coin:       sendCoin.value.coin,
      amount:     sendForm.value.amount,
      to_address: sendForm.value.to_address.trim(),
      network:    sendCoin.value.network,
    })
    uiStore.showSuccess(result.message || `${sendForm.value.amount} ${sendCoin.value.symbol} send queued!`)
    showSendModal.value = false
    sendForm.value = { to_address: '', amount: 0 }
    await loadCrypto()
  } catch (e) {
    uiStore.showError(e?.response?.data?.detail || 'Send failed. Please try again.')
  } finally {
    sending.value = false
  }
}

// ── Mount ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await wakeAndLoad()
  loadBanks()
  loadVirtualAccount()
  if (route.query.ref || route.query.reference || route.query.trxref)
    await verifyFromUrl()
})
</script>

<style scoped>
/* ══ Layout ══════════════════════════════════════════════════════════════════ */
.wallet-view {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-bottom: 3rem;
  max-width: 760px;
}

/* ══ Header ══════════════════════════════════════════════════════════════════ */
.page-hdr       { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.pg-title       { font-family: var(--font-headline); font-size: 1.6rem; font-weight: 800; color: var(--on-surface); letter-spacing: -.02em; }
.pg-sub         { font-size: .85rem; color: var(--on-surface-variant); margin-top: .2rem; }
.hdr-actions    { display: flex; align-items: center; gap: .5rem; flex-shrink: 0; margin-top: .25rem; }
.curr-chip      { display: flex; align-items: center; gap: .3rem; padding: .4rem .875rem; border: 1.5px solid var(--outline-variant); border-radius: 999px; background: var(--surface-container); text-decoration: none; cursor: pointer; transition: all .15s; color: var(--on-surface); }
.curr-chip:hover{ border-color: var(--primary); color: var(--primary); }
.curr-chip-sym  { font-size: 1rem; font-weight: 800; font-family: var(--font-headline); }
.curr-chip-code { font-size: .8rem; font-weight: 700; font-family: var(--font-headline); }
.icon-only      { width: 38px; height: 38px; border-radius: 50%; border: 1.5px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; }
.icon-only:hover{ border-color: var(--primary); color: var(--primary); }
.spin           { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ══ Hero Balance Card ═══════════════════════════════════════════════════════ */
.balance-card {
  position: relative;
  background: linear-gradient(135deg, #1a0840 0%, #2d1060 45%, #0a0f2e 100%);
  border-radius: 24px;
  padding: 2rem;
  overflow: hidden;
  border: 1px solid rgba(168,85,247,.25);
  box-shadow: 0 24px 64px rgba(99,14,212,.35), 0 4px 16px rgba(0,0,0,.3);
}
.bc-blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.bc-blob-1 {
  width: 280px; height: 280px;
  top: -100px; right: -60px;
  background: radial-gradient(circle, rgba(120,40,220,.55) 0%, transparent 70%);
}
.bc-blob-2 {
  width: 180px; height: 180px;
  bottom: -60px; left: 10%;
  background: radial-gradient(circle, rgba(60,100,220,.35) 0%, transparent 70%);
}
.bc-grid-overlay {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}
.bc-content {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; gap: 1.5rem;
}
@media (min-width: 560px) {
  .bc-content { flex-direction: row; align-items: center; justify-content: space-between; }
}
.bc-left        { display: flex; flex-direction: column; }
.bc-label       { display: flex; align-items: center; gap: .3rem; font-size: .7rem; color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: .08em; font-family: var(--font-headline); }
.bc-amount      { font-family: var(--font-headline); font-size: clamp(2rem, 7vw, 3rem); font-weight: 800; color: #fff; margin-top: .25rem; letter-spacing: -.03em; line-height: 1; }
.bc-sub         { font-size: .72rem; color: rgba(255,255,255,.38); margin-top: .5rem; display: flex; align-items: center; gap: .35rem; }
.bc-curr-tag    { font-size: .68rem; font-weight: 700; background: rgba(255,255,255,.12); padding: .1rem .4rem; border-radius: 4px; color: rgba(255,255,255,.7); }
.bc-username-chip {
  display: inline-flex; align-items: center; gap: .3rem;
  margin-top: .875rem; padding: .35rem .875rem;
  border-radius: 999px; border: 1px solid rgba(255,255,255,.2);
  background: rgba(255,255,255,.07); color: rgba(255,255,255,.8);
  font-size: .78rem; font-weight: 600; cursor: pointer;
  transition: background .15s; font-family: var(--font-headline); width: fit-content;
}
.bc-username-chip:hover { background: rgba(255,255,255,.14); }
.bc-divider     { width: 1px; height: 80px; background: rgba(255,255,255,.12); flex-shrink: 0; display: none; }
@media (min-width: 560px) { .bc-divider { display: block; } }
.bc-stats       { display: flex; gap: 1.75rem; }
.bc-stat        { display: flex; align-items: center; gap: .75rem; }
.bc-stat-icon   { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.bc-stat-icon .material-symbols-outlined { font-size: 20px; }
.bc-stat-up     { background: rgba(34,197,94,.15); color: #4ade80; }
.bc-stat-out    { background: rgba(251,146,60,.15); color: #fb923c; }
.bc-sv          { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: #fff; line-height: 1.2; }
.bc-sl          { font-size: .67rem; color: rgba(255,255,255,.4); margin-top: .15rem; }

/* ══ Quick Actions ═══════════════════════════════════════════════════════════ */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: .75rem;
}
@media (max-width: 360px) { .quick-grid { grid-template-columns: repeat(2,1fr); } }
.quick-btn {
  display: flex; flex-direction: column; align-items: center; gap: .625rem;
  padding: 1.125rem .5rem;
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--outline-variant);
  border-radius: 18px;
  cursor: pointer;
  transition: all .2s cubic-bezier(0.34,1.56,0.64,1);
}
.quick-btn:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(99,14,212,.12); }
.qb-ico { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
.qb-ico .material-symbols-outlined { font-size: 22px; }
.qb-purple { background: rgba(99,14,212,.1); color: var(--primary); }
.qb-blue   { background: rgba(59,130,246,.1); color: #3b82f6; }
.qb-green  { background: rgba(22,163,74,.1);  color: #16a34a; }
.qb-amber  { background: rgba(245,158,11,.1); color: #f59e0b; }
.qb-lbl    { font-family: var(--font-headline); font-size: .8rem; font-weight: 700; color: var(--on-surface); }

/* ══ DVA Card ════════════════════════════════════════════════════════════════ */
.dva-card {
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--outline-variant);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex; flex-direction: column; gap: 1.125rem;
}
.dva-hdr        { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.dva-hdr-left   { display: flex; align-items: flex-start; gap: .875rem; }
.dva-icon-wrap  { width: 44px; height: 44px; border-radius: 12px; background: rgba(99,14,212,.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dva-icon-wrap .material-symbols-outlined { font-size: 22px; color: var(--primary); }
.dva-title      { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }
.dva-sub        { font-size: .8rem; color: var(--on-surface-variant); margin-top: .2rem; line-height: 1.4; }
.dva-badge      { padding: .3rem .875rem; border-radius: 999px; background: rgba(34,197,94,.1); color: #16a34a; font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; white-space: nowrap; flex-shrink: 0; border: 1px solid rgba(34,197,94,.2); }
.dva-details    { display: flex; flex-direction: column; gap: .75rem; background: var(--surface-container-low); border-radius: 12px; padding: 1rem; }
.dva-row        { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.dva-row-acct   { flex-wrap: nowrap; }
.dva-lbl        { font-size: .78rem; color: var(--on-surface-variant); flex-shrink: 0; }
.dva-val        { font-size: .875rem; font-weight: 600; color: var(--on-surface); text-align: right; }
.dva-acct-row   { display: flex; align-items: center; gap: .75rem; }
.dva-acct-num   { font-family: var(--font-headline); font-size: 1.4rem; font-weight: 800; color: var(--primary); letter-spacing: .1em; }
.dva-copy-btn   { display: flex; align-items: center; gap: .25rem; padding: .4rem .875rem; border-radius: 8px; border: 1.5px solid var(--outline-variant); background: var(--surface-container); font-size: .8rem; font-weight: 700; color: var(--on-surface); cursor: pointer; transition: all .15s; font-family: var(--font-headline); }
.dva-copy-btn:hover { border-color: var(--primary); color: var(--primary); }
.dva-copy-btn.copied { border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,.07); }
.dva-note       { display: flex; align-items: center; gap: .4rem; font-size: .8rem; color: var(--on-surface-variant); background: rgba(34,197,94,.05); padding: .75rem 1rem; border-radius: 10px; border: 1px solid rgba(34,197,94,.2); }
.dva-empty      { font-size: .875rem; color: var(--on-surface-variant); line-height: 1.5; }
.dva-create-btn { display: flex; align-items: center; gap: .5rem; padding: .75rem 1.5rem; align-self: flex-start; }

/* ══ Fund Methods Card ═══════════════════════════════════════════════════════ */
.fund-methods-card {
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--outline-variant);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex; flex-direction: column; gap: 1rem;
}
.fm-header      { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .75rem; }
.fm-header-left { display: flex; align-items: center; gap: .5rem; }
.fm-title       { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }
.fm-fund-btn    { display: flex; align-items: center; gap: .4rem; padding: .55rem 1.125rem; font-size: .85rem; }
.fm-grid        { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px,1fr)); gap: .75rem; }
.fm-item        { display: flex; align-items: flex-start; gap: .75rem; padding: .875rem 1rem; border-radius: 14px; background: var(--surface-container-low); border: 1px solid var(--outline-variant); transition: border-color .15s; }
.fm-item:hover  { border-color: var(--primary); }
.fm-ico         { width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.fm-ico .material-symbols-outlined { font-size: 20px; }
.fm-name        { font-family: var(--font-headline); font-size: .875rem; font-weight: 700; color: var(--on-surface); display: flex; align-items: center; gap: .35rem; flex-wrap: wrap; }
.fm-desc        { font-size: .78rem; color: var(--on-surface-variant); margin-top: .2rem; line-height: 1.4; }
.fm-avail       { font-size: .65rem; font-weight: 700; padding: .15rem .45rem; border-radius: 999px; background: rgba(22,163,74,.1); color: #16a34a; }

/* ══ Transactions Card ═══════════════════════════════════════════════════════ */
.tx-card        { background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant); border-radius: 20px; overflow: hidden; }
.tx-hdr         { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem .875rem; border-bottom: 1px solid var(--outline-variant); }
.tx-title       { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }
.tx-count       { font-size: .75rem; color: var(--on-surface-variant); background: var(--surface-container); padding: .2rem .65rem; border-radius: 999px; }
.tx-skel        { display: flex; align-items: center; gap: .875rem; padding: 1rem 1.5rem; border-bottom: 1px solid var(--outline-variant); }
.skel-ico       { width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0; }
.skel-lines     { flex: 1; display: flex; flex-direction: column; gap: .4rem; }
.skel-l1        { height: 12px; border-radius: 4px; width: 55%; }
.skel-l2        { height: 10px; border-radius: 4px; width: 35%; }
.skel-amt       { width: 72px; height: 22px; border-radius: 6px; }
.shimmer        { background: linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.tx-empty       { display: flex; flex-direction: column; align-items: center; gap: .625rem; padding: 3.5rem 1rem; color: var(--on-surface-variant); }
.tx-empty-icon  { width: 64px; height: 64px; border-radius: 50%; background: var(--surface-container); display: flex; align-items: center; justify-content: center; }
.tx-empty-icon .material-symbols-outlined { font-size: 28px; color: var(--on-surface-variant); opacity: .4; }
.tx-empty-title { font-family: var(--font-headline); font-size: .95rem; font-weight: 700; color: var(--on-surface); margin: 0; }
.tx-empty-sub   { font-size: .82rem; margin: 0; opacity: .7; }
.tx-row         { display: flex; align-items: center; gap: .875rem; padding: .875rem 1.5rem; border-bottom: 1px solid var(--outline-variant); transition: background .12s; }
.tx-row:last-child { border-bottom: none; }
.tx-row:hover   { background: var(--surface-container-low); }
.tx-row-clickable { cursor: pointer; border-radius: 0; }
.tx-ico-wrap    { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tx-ico         { font-size: 20px; }
.tx-info        { flex: 1; min-width: 0; }
.tx-name        { font-size: .9rem; font-weight: 600; color: var(--on-surface); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tx-date        { font-size: .72rem; color: var(--on-surface-variant); margin-top: .15rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tx-right       { display: flex; flex-direction: column; align-items: flex-end; gap: .3rem; flex-shrink: 0; }
.tx-amt         { font-family: var(--font-headline); font-size: .9rem; font-weight: 700; }
.tx-amt.pos     { color: #16a34a; }
.tx-amt.neg     { color: #ef4444; }
.tx-badge       { font-size: .63rem; font-weight: 700; text-transform: uppercase; padding: .15rem .55rem; border-radius: 999px; letter-spacing: .04em; }
.tx-badge.success    { background: rgba(22,163,74,.1);  color: #16a34a; }
.tx-badge.pending    { background: rgba(245,158,11,.1); color: #f59e0b; }
.tx-badge.processing { background: rgba(99,14,212,.1);  color: var(--primary); }
.tx-badge.reversed   { background: rgba(245,158,11,.1); color: #f59e0b; }
.tx-badge.failed     { background: rgba(239,68,68,.1);  color: #ef4444; }

/* ══ Modals ══════════════════════════════════════════════════════════════════ */
.modal-overlay  { position: fixed; inset: 0; z-index: 600; background: rgba(0,0,0,.6); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); display: flex; align-items: flex-end; justify-content: center; padding: 0; }
@media (min-width: 600px) { .modal-overlay { align-items: center; padding: 1rem; } }
.modal-box      { width: 100%; max-width: 480px; background: var(--surface-container-lowest); border-radius: 24px 24px 0 0; display: flex; flex-direction: column; max-height: 92vh; overflow-y: auto; padding-bottom: calc(env(safe-area-inset-bottom,0px)); box-shadow: 0 -8px 40px rgba(0,0,0,.2); }
@media (min-width: 600px) { .modal-box { border-radius: 24px; padding-bottom: 0; box-shadow: var(--shadow-lg); } }
.modal-hdr      { display: flex; align-items: center; gap: .75rem; padding: 1.25rem 1.5rem 0; position: sticky; top: 0; background: var(--surface-container-lowest); z-index: 1; padding-bottom: 1rem; border-bottom: 1px solid var(--outline-variant); }
.modal-hdr-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.modal-hdr-icon .material-symbols-outlined { font-size: 20px; }
.modal-title    { font-family: var(--font-headline); font-size: 1.1rem; font-weight: 800; color: var(--on-surface); flex: 1; }
.modal-close    { width: 34px; height: 34px; border-radius: 50%; border: none; background: var(--surface-container); color: var(--on-surface-variant); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background .15s; }
.modal-close:hover { background: var(--surface-container-high); }
.modal-body     { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.modal-sub      { font-size: .875rem; color: var(--on-surface-variant); }
.avail-balance  { font-size: .9rem; color: var(--on-surface-variant); background: var(--surface-container-low); padding: .75rem 1rem; border-radius: 10px; }
.avail-balance strong { color: var(--primary); font-weight: 700; }
.wd-fee-note    { font-size: .78rem; opacity: .7; }
.preset-grid    { display: grid; grid-template-columns: repeat(3,1fr); gap: .5rem; }
.preset-btn     { padding: .65rem .25rem; border-radius: 12px; border: 1.5px solid var(--outline-variant); background: var(--surface-container); font-family: var(--font-headline); font-size: .82rem; font-weight: 700; color: var(--on-surface); cursor: pointer; transition: all .15s; }
.preset-btn:hover, .preset-btn.active { border-color: var(--primary); background: color-mix(in srgb,var(--primary) 8%,transparent); color: var(--primary); }
.input-group    { display: flex; align-items: center; background: var(--surface-container); border: 1.5px solid var(--outline-variant); border-radius: 14px; overflow: hidden; transition: border-color .15s; }
.input-group:focus-within { border-color: var(--primary); }
.inp-prefix     { padding: .875rem 0 .875rem 1rem; font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface-variant); }
.modal-inp      { flex: 1; padding: .875rem; background: transparent; border: none; outline: none; font-family: var(--font-headline); font-size: .95rem; color: var(--on-surface); }
.modal-inp::placeholder { color: var(--outline); }
.modal-inp-plain { width: 100%; padding: .875rem 1rem; background: var(--surface-container); border: 1.5px solid var(--outline-variant); border-radius: 14px; font-size: .9rem; color: var(--on-surface); outline: none; transition: border-color .15s; box-sizing: border-box; }
.modal-inp-plain:focus { border-color: var(--primary); }
.modal-inp-plain::placeholder { color: var(--outline); }
.field-group    { display: flex; flex-direction: column; gap: .4rem; }
.field-label    { font-size: .8rem; font-weight: 600; color: var(--on-surface-variant); }
.amount-display { padding: .875rem 1rem; background: color-mix(in srgb,var(--primary) 6%,transparent); border: 1px solid color-mix(in srgb,var(--primary) 22%,transparent); border-radius: 12px; font-size: .875rem; color: var(--on-surface); line-height: 1.5; }
.amount-display strong { color: var(--primary); font-weight: 700; }
.ps-note        { display: flex; align-items: center; gap: .375rem; font-size: .75rem; color: var(--on-surface-variant); background: var(--surface-container); padding: .75rem .875rem; border-radius: 10px; }
.modal-footer   { display: flex; gap: .75rem; justify-content: flex-end; padding: 1rem 1.5rem 1.5rem; border-top: 1px solid var(--outline-variant); }
.btn-ghost      { padding: .65rem 1.25rem; border-radius: 12px; border: 1.5px solid var(--outline-variant); background: none; color: var(--on-surface-variant); font-size: .875rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: .3rem; transition: all .15s; }
.btn-ghost:hover{ border-color: var(--primary); color: var(--primary); }
.btn-primary    { display: flex; align-items: center; gap: .4rem; padding: .7rem 1.5rem; border-radius: 12px; background: var(--gradient-primary); color: #fff; border: none; font-family: var(--font-headline); font-size: .9rem; font-weight: 700; cursor: pointer; transition: opacity .15s, transform .15s; }
.btn-primary:disabled { opacity: .5; cursor: not-allowed; }
.btn-primary:not(:disabled):hover { opacity: .9; transform: translateY(-1px); }
.modal-pay-btn  { min-width: 160px; justify-content: center; }
.btn-spinner    { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; animation: spin 0.7s linear infinite; flex-shrink: 0; }

/* ══ History / Receipt ═══════════════════════════════════════════════════════ */
.hist-tabs      { display: flex; gap: .375rem; padding: .875rem 1.5rem .5rem; overflow-x: auto; scrollbar-width: none; }
.hist-tabs::-webkit-scrollbar { display: none; }
.hist-tab       { padding: .35rem .875rem; border-radius: 999px; border: 1.5px solid var(--outline-variant); background: none; font-size: .8rem; font-weight: 600; color: var(--on-surface-variant); cursor: pointer; white-space: nowrap; transition: all .15s; flex-shrink: 0; }
.hist-tab:hover { border-color: var(--primary); color: var(--primary); }
.hist-tab.active{ border-color: var(--primary); background: color-mix(in srgb,var(--primary) 10%,transparent); color: var(--primary); }
.receipt-wrap   { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.125rem; }
.receipt-header { display: flex; flex-direction: column; align-items: center; gap: .625rem; padding-bottom: 1.125rem; border-bottom: 1px solid var(--outline-variant); }
.receipt-ico-wrap { width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
.receipt-ico    { font-size: 28px; }
.receipt-amt    { font-family: var(--font-headline); font-size: 2.25rem; font-weight: 800; }
.receipt-amt.pos{ color: #16a34a; }
.receipt-amt.neg{ color: #ef4444; }
.receipt-rows   { display: flex; flex-direction: column; }
.receipt-row    { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; padding: .625rem 0; border-bottom: 1px solid var(--outline-variant); }
.receipt-row:last-child { border-bottom: none; }
.receipt-lbl    { font-size: .8rem; color: var(--on-surface-variant); flex-shrink: 0; }
.receipt-val    { font-size: .85rem; font-weight: 600; color: var(--on-surface); text-align: right; word-break: break-all; max-width: 60%; }
.mono           { font-family: monospace; font-size: .75rem !important; }
.receipt-brand  { text-align: center; font-size: .72rem; color: var(--on-surface-variant); opacity: .55; }
.receipt-actions{ display: flex; gap: .625rem; padding: .875rem 1.5rem 1.5rem; border-top: 1px solid var(--outline-variant); }
.receipt-actions .btn-ghost { flex: 1; justify-content: center; }

/* ══ Success Banner ══════════════════════════════════════════════════════════ */
.verify-banner  { position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: .625rem; background: var(--surface-container-highest); border: 1.5px solid #22c55e; border-radius: 14px; padding: .875rem 1.25rem; font-size: .875rem; font-weight: 600; color: var(--on-surface); box-shadow: 0 8px 32px rgba(0,0,0,.2); white-space: nowrap; z-index: 700; }
.vb-close       { background: none; border: none; cursor: pointer; color: var(--on-surface-variant); display: flex; align-items: center; margin-left: .25rem; }

/* ══ Transitions ═════════════════════════════════════════════════════════════ */
.modal-enter-active, .modal-leave-active { transition: all .25s cubic-bezier(0.4,0,0.2,1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: translateY(24px); }
.slide-up-enter-active, .slide-up-leave-active { transition: all .3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }

/* ══ Wallet Tabs ══════════════════════════════════════════════════════════ */
.wallet-tabs        { display: flex; gap: .5rem; background: var(--surface-container-low); padding: .4rem; border-radius: 16px; border: 1.5px solid var(--outline-variant); }
.wallet-tab         { flex: 1; display: flex; align-items: center; justify-content: center; gap: .45rem; padding: .65rem 1rem; border-radius: 12px; border: none; background: transparent; cursor: pointer; font-family: var(--font-headline); font-size: .85rem; font-weight: 700; color: var(--on-surface-variant); transition: all .2s; }
.wallet-tab.active  { background: var(--surface-container-highest); color: var(--primary); box-shadow: 0 2px 8px rgba(0,0,0,.08); }
.wallet-tab:hover:not(.active) { color: var(--on-surface); }
.tab-currency       { font-size: .85rem; font-weight: 800; opacity: .5; }
.wallet-tab-crypto-icons { font-size: 1rem; }
.tab-badge-new      { font-size: .58rem; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; padding: .1rem .45rem; border-radius: 999px; background: rgba(249,115,22,.15); color: #f97316; border: 1px solid rgba(249,115,22,.25); }

/* ══ Crypto Tab ══════════════════════════════════════════════════════════ */
.crypto-tab         { display: flex; flex-direction: column; gap: 1.25rem; }

/* hero card */
.crypto-hero {
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, #0f1f0a 0%, #1a3a0e 45%, #0a1f1a 100%);
  border-radius: 22px; padding: 1.75rem;
  border: 1px solid rgba(74,222,128,.2);
  box-shadow: 0 16px 48px rgba(0,0,0,.35);
}
.ch-blob { position: absolute; border-radius: 50%; pointer-events: none; }
.ch-blob-1 { width: 240px; height: 240px; top: -80px; right: -40px; background: radial-gradient(circle, rgba(34,197,94,.3) 0%, transparent 70%); }
.ch-blob-2 { width: 140px; height: 140px; bottom: -50px; left: 8%; background: radial-gradient(circle, rgba(99,14,212,.25) 0%, transparent 70%); }
.ch-content    { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
.ch-left       { display: flex; flex-direction: column; }
.ch-label      { display: flex; align-items: center; gap: .4rem; font-size: .7rem; color: rgba(255,255,255,.45); text-transform: uppercase; letter-spacing: .08em; font-family: var(--font-headline); }
.ch-amount     { font-family: var(--font-headline); font-size: clamp(1.8rem,6vw,2.75rem); font-weight: 800; color: #fff; letter-spacing: -.03em; line-height: 1.1; margin-top: .25rem; }
.ch-sub        { font-size: .72rem; color: rgba(255,255,255,.35); margin-top: .35rem; }
.ch-coins-preview { display: flex; gap: .4rem; flex-wrap: wrap; }
.ch-coin-dot   { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; border: 2px solid rgba(255,255,255,.1); }

/* notice */
.crypto-notice {
  display: flex; align-items: flex-start; gap: .6rem;
  padding: .875rem 1rem; border-radius: 12px;
  background: rgba(245,158,11,.07); border: 1px solid rgba(245,158,11,.2);
  font-size: .8rem; color: var(--on-surface-variant); line-height: 1.4;
}
.crypto-notice strong { color: var(--on-surface); }

/* coin list */
.coin-list  { display: flex; flex-direction: column; gap: .5rem; }
.coin-card  {
  display: flex; align-items: center; gap: .875rem;
  padding: 1rem 1.25rem; border-radius: 16px;
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--outline-variant);
  cursor: pointer; transition: all .2s cubic-bezier(0.34,1.56,0.64,1);
}
.coin-card:hover, .coin-card-active { border-color: var(--primary); background: color-mix(in srgb, var(--primary) 4%, var(--surface-container-lowest)); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99,14,212,.1); }
.coin-icon-wrap  { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.coin-icon       { font-size: 1.4rem; line-height: 1; }
.coin-info       { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: .15rem; }
.coin-name-row   { display: flex; align-items: center; gap: .5rem; }
.coin-name       { font-family: var(--font-headline); font-size: .9rem; font-weight: 700; color: var(--on-surface); }
.coin-network    { font-size: .65rem; font-weight: 700; padding: .1rem .45rem; border-radius: 999px; background: var(--surface-container); color: var(--on-surface-variant); border: 1px solid var(--outline-variant); }
.coin-symbol     { font-size: .75rem; color: var(--on-surface-variant); font-weight: 600; }
.coin-balance-col { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; }
.coin-balance    { font-family: var(--font-headline); font-size: .9rem; font-weight: 700; color: var(--on-surface); }
.coin-usd        { font-size: .73rem; color: #16a34a; margin-top: .1rem; }
.coin-usd.zero   { color: var(--on-surface-variant); opacity: .45; }
.coin-chevron    { font-size: 18px; color: var(--on-surface-variant); opacity: .45; flex-shrink: 0; }

/* coin action buttons */
.coin-actions-col  { display: flex; flex-direction: column; gap: .3rem; flex-shrink: 0; }
.coin-action-btn   { width: 30px; height: 30px; border-radius: 8px; border: 1.5px solid var(--outline-variant); background: var(--surface-container); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; color: var(--on-surface-variant); }
.deposit-btn:hover { border-color: #16a34a; color: #16a34a; background: rgba(22,163,74,.08); }
.send-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); background: rgba(99,14,212,.08); }
.coin-action-btn:disabled { opacity: .3; cursor: not-allowed; }

/* price change chips */
.chg-up { font-size: .68rem; font-weight: 700; color: #16a34a; margin-left: .25rem; }
.chg-dn { font-size: .68rem; font-weight: 700; color: #ef4444; margin-left: .25rem; }

/* send modal summary */
.send-summary { background: var(--surface-container-low); border-radius: 12px; padding: .875rem 1rem; display: flex; flex-direction: column; gap: .5rem; }
.ss-row { display: flex; align-items: center; justify-content: space-between; font-size: .85rem; color: var(--on-surface-variant); }
.ss-row strong { color: var(--on-surface); font-weight: 700; }
.ss-total { border-top: 1px solid var(--outline-variant); padding-top: .5rem; margin-top: .15rem; }
.ss-total span, .ss-total strong { color: var(--on-surface); font-weight: 700; font-family: var(--font-headline); }

/* max button */
.inp-max-btn { padding: .4rem .75rem; margin-right: .375rem; border-radius: 8px; border: 1.5px solid var(--primary); background: rgba(99,14,212,.08); color: var(--primary); font-size: .75rem; font-weight: 800; cursor: pointer; font-family: var(--font-headline); transition: all .15s; flex-shrink: 0; }
.inp-max-btn:hover { background: rgba(99,14,212,.15); }

/* coin price row */
.coin-price-row  { display: flex; align-items: center; gap: .4rem; margin-top: .1rem; }
.coin-live-price { font-size: .72rem; color: var(--on-surface-variant); display: flex; align-items: center; gap: .2rem; }

/* crypto quick actions */
.crypto-quick-actions { display: grid; grid-template-columns: repeat(4,1fr); gap: .625rem; }
.cqa-btn  { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: .875rem .5rem; border-radius: 16px; border: 1.5px solid var(--outline-variant); background: var(--surface-container-lowest); cursor: pointer; transition: all .2s cubic-bezier(0.34,1.56,0.64,1); }
.cqa-btn:hover:not(:disabled) { border-color: var(--primary); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99,14,212,.1); }
.cqa-btn:disabled { opacity: .4; cursor: not-allowed; }
.cqa-ico  { width: 44px; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center; }
.cqa-ico .material-symbols-outlined { font-size: 22px; }
.cqa-lbl  { font-family: var(--font-headline); font-size: .78rem; font-weight: 700; color: var(--on-surface); }

/* coin picker */
.coin-picker-row  { display: flex; align-items: center; gap: .875rem; padding: .875rem 1rem; border-radius: 14px; border: 1.5px solid var(--outline-variant); background: var(--surface-container-lowest); cursor: pointer; transition: all .15s; width: 100%; margin-bottom: .4rem; }
.coin-picker-row:hover { border-color: var(--primary); background: color-mix(in srgb,var(--primary) 4%,var(--surface-container-lowest)); }
.cp-info  { flex: 1; display: flex; flex-direction: column; gap: .1rem; text-align: left; }
.cp-name  { font-family: var(--font-headline); font-size: .9rem; font-weight: 700; color: var(--on-surface); }
.cp-net   { font-size: .75rem; color: var(--on-surface-variant); }

/* hero coin dots with SVG */
.ch-coin-dot  { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

/* skeleton */
.crypto-hero-skel   { width: 100%; }
.coin-row-skel      { display: flex; align-items: center; gap: .875rem; padding: 1rem 1.25rem; border-radius: 16px; background: var(--surface-container-lowest); border: 1.5px solid var(--outline-variant); }

/* ── Deposit Modal ── */
.deposit-loading    { display: flex; flex-direction: column; align-items: center; gap: .875rem; padding: 2.5rem 0; }
.qr-wrap            { display: flex; justify-content: center; padding: .5rem 0; }
.qr-img             { width: 180px; height: 180px; border-radius: 16px; border: 4px solid var(--surface-container); background: #fff; }
.deposit-network-row { display: flex; align-items: center; gap: .45rem; padding: .75rem 1rem; border-radius: 10px; background: rgba(245,158,11,.07); border: 1px solid rgba(245,158,11,.2); font-size: .82rem; color: var(--on-surface-variant); }
.deposit-network-row strong { color: var(--on-surface); }
.deposit-addr-box   { background: var(--surface-container); border: 1.5px solid var(--outline-variant); border-radius: 14px; padding: .875rem 1rem; }
.dep-addr-label     { font-size: .7rem; text-transform: uppercase; letter-spacing: .07em; color: var(--on-surface-variant); margin-bottom: .4rem; font-family: var(--font-headline); }
.dep-addr-row       { display: flex; align-items: center; gap: .625rem; }
.dep-addr-code      { flex: 1; font-family: monospace; font-size: .8rem; color: var(--on-surface); word-break: break-all; line-height: 1.4; }
.dep-copy-btn       { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid var(--outline-variant); background: var(--surface-container-low); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all .15s; color: var(--on-surface-variant); }
.dep-copy-btn:hover { border-color: var(--primary); color: var(--primary); }
.dep-copy-btn.copied { border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,.08); }
.deposit-info-grid  { display: flex; flex-direction: column; gap: .5rem; background: var(--surface-container-low); border-radius: 12px; padding: .875rem 1rem; }
.dep-info-row       { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.dep-info-lbl       { font-size: .78rem; color: var(--on-surface-variant); }
.dep-info-val       { font-size: .82rem; font-weight: 600; color: var(--on-surface); text-align: right; }
.deposit-warning-box { display: flex; align-items: flex-start; gap: .625rem; padding: .875rem 1rem; border-radius: 12px; background: rgba(239,68,68,.06); border: 1px solid rgba(239,68,68,.18); color: var(--on-surface-variant); font-size: .8rem; line-height: 1.45; }
.deposit-warning-box .material-symbols-outlined { color: #ef4444; margin-top: .05rem; }
</style>
