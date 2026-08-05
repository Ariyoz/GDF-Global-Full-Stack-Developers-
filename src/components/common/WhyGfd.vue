<template>
  <section class="section-gfd why-section">
    <div class="container-gfd">

      <!-- Header -->
      <div class="why-header">
        <div class="section-badge">
          <span class="badge-dot"></span>
          Why GFD
        </div>
        <h2 class="why-title">Everything you need to<br><span class="text-gradient">hire or get hired</span></h2>
        <p class="why-sub">One platform. Every tool. Zero friction.</p>
      </div>

      <!-- Bento Grid -->
      <div class="bento-grid">

        <!-- Card 1 — GitHub verified (wide) -->
        <div class="bento-card bento-github animate-fade-in-up">
          <div class="card-glow card-glow-purple"></div>
          <div class="card-top">
            <div class="ico-wrap ico-purple">
              <span class="material-symbols-outlined">verified_user</span>
            </div>
            <div class="card-label">Trust & Verification</div>
          </div>
          <h3 class="card-title">GitHub-verified profiles</h3>
          <p class="card-desc">Every developer connects their GitHub account, giving you real proof of their skills — not just buzzwords on a CV.</p>
          <div class="gh-visual">
            <div class="gh-chart">
              <div v-for="(b, i) in ghBars" :key="i" class="gh-bar"
                :style="`height:${b}%;animation-delay:${i * 60}ms`"
                :class="b > 55 ? 'gh-bar-hi' : b > 35 ? 'gh-bar-mid' : 'gh-bar-lo'" />
            </div>
            <div class="gh-streak">
              <span class="streak-num">{{ currentStreak }}</span>
              <span class="streak-label">day streak</span>
            </div>
          </div>
        </div>

        <!-- Card 2 — Wallet (tall) -->
        <div class="bento-card bento-wallet animate-fade-in-up delay-100">
          <div class="card-glow card-glow-blue"></div>
          <div class="card-top">
            <div class="ico-wrap ico-blue">
              <span class="material-symbols-outlined">account_balance_wallet</span>
            </div>
          </div>
          <h3 class="card-title">Built-in wallet</h3>
          <p class="card-desc">Fund, send, and withdraw directly to any Nigerian bank. No third-party apps needed.</p>
          <div class="wallet-visual">
            <div class="wallet-bal-row">
              <span class="wallet-bal-label">Balance</span>
              <span class="wallet-bal-amt">₦124,500</span>
            </div>
            <div class="wallet-actions">
              <div class="wa-btn wa-btn-fund">
                <span class="material-symbols-outlined" style="font-size:14px">add</span>Fund
              </div>
              <div class="wa-btn wa-btn-send">
                <span class="material-symbols-outlined" style="font-size:14px">send</span>Send
              </div>
              <div class="wa-btn wa-btn-out">
                <span class="material-symbols-outlined" style="font-size:14px">arrow_upward</span>Out
              </div>
            </div>
            <div class="wallet-txs">
              <div class="wtx" v-for="tx in walletTxs" :key="tx.label">
                <div class="wtx-ico" :style="`background:${tx.bg}`">
                  <span class="material-symbols-outlined" :style="`color:${tx.color};font-size:13px`">{{ tx.icon }}</span>
                </div>
                <span class="wtx-label">{{ tx.label }}</span>
                <span class="wtx-amt" :class="tx.credit ? 'wtx-pos' : 'wtx-neg'">{{ tx.credit ? '+' : '-' }}{{ tx.amt }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3 — Hire fast -->
        <div class="bento-card bento-hire animate-fade-in-up delay-150">
          <div class="card-glow card-glow-green"></div>
          <div class="card-top">
            <div class="ico-wrap ico-green">
              <span class="material-symbols-outlined">bolt</span>
            </div>
          </div>
          <h3 class="card-title">Hire in 48 hours</h3>
          <p class="card-desc">Post a job and receive qualified applications from verified developers in under 24 hours.</p>
          <div class="hire-visual">
            <div class="hire-timeline">
              <div class="ht-step" v-for="(s, i) in hireSteps" :key="i" :class="{ 'ht-done': s.done, 'ht-active': s.active }">
                <div class="ht-dot">
                  <span v-if="s.done" class="material-symbols-outlined" style="font-size:11px">check</span>
                </div>
                <span class="ht-label">{{ s.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 4 — Messaging -->
        <div class="bento-card bento-msg animate-fade-in-up delay-200">
          <div class="card-glow card-glow-orange"></div>
          <div class="card-top">
            <div class="ico-wrap ico-orange">
              <span class="material-symbols-outlined">forum</span>
            </div>
          </div>
          <h3 class="card-title">Direct messaging</h3>
          <p class="card-desc">Chat directly with clients and developers, share files, and close deals fast.</p>
          <div class="msg-visual">
            <div class="msg-bubble msg-theirs">
              <span>Hey, can you start Monday?</span>
            </div>
            <div class="msg-bubble msg-mine">
              <span>Absolutely! 🚀</span>
              <span class="msg-tick material-symbols-outlined">done_all</span>
            </div>
            <div class="msg-bubble msg-theirs">
              <span>Contract sent ✅</span>
            </div>
          </div>
        </div>

        <!-- Card 5 — Analytics (wide) -->
        <div class="bento-card bento-analytics animate-fade-in-up delay-250">
          <div class="card-glow card-glow-pink"></div>
          <div class="card-top">
            <div class="ico-wrap ico-pink">
              <span class="material-symbols-outlined">analytics</span>
            </div>
            <div class="card-label">Live insights</div>
          </div>
          <h3 class="card-title">Real-time analytics</h3>
          <p class="card-desc">Track profile views, application stats, and earnings — all in your personal dashboard.</p>
          <div class="analytics-visual">
            <div class="av-stats">
              <div class="av-stat" v-for="s in analyticsStats" :key="s.label">
                <span class="av-val">{{ s.val }}</span>
                <span class="av-lbl">{{ s.label }}</span>
                <span class="av-delta" :class="s.up ? 'delta-up' : 'delta-dn'">
                  <span class="material-symbols-outlined" style="font-size:11px">{{ s.up ? 'trending_up' : 'trending_down' }}</span>
                  {{ s.delta }}
                </span>
              </div>
            </div>
            <div class="av-chart">
              <div v-for="(v, i) in analyticsData" :key="i" class="av-bar-col">
                <div class="av-bar"
                  :style="`height:${v}%;animation-delay:${i * 50}ms`"
                  :class="i === analyticsData.length - 1 ? 'av-bar-hi' : ''"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 6 — Escrow -->
        <div class="bento-card bento-escrow animate-fade-in-up delay-300">
          <div class="card-glow card-glow-teal"></div>
          <div class="card-top">
            <div class="ico-wrap ico-teal">
              <span class="material-symbols-outlined">lock</span>
            </div>
          </div>
          <h3 class="card-title">Escrow protection</h3>
          <p class="card-desc">Funds are held securely until work is approved. Both parties are always protected.</p>
          <div class="escrow-visual">
            <div class="escrow-flow">
              <div class="ef-node ef-client">
                <span class="material-symbols-outlined" style="font-size:16px">person</span>
                <span>Client</span>
              </div>
              <div class="ef-arrow">
                <div class="ef-line"></div>
                <div class="ef-lock">
                  <span class="material-symbols-outlined" style="font-size:14px">lock</span>
                </div>
                <div class="ef-line"></div>
              </div>
              <div class="ef-node ef-dev">
                <span class="material-symbols-outlined" style="font-size:16px">code</span>
                <span>Dev</span>
              </div>
            </div>
            <p class="escrow-note">Funds released on approval</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
const ghBars = [20, 38, 15, 58, 72, 45, 82, 60, 92, 42, 68, 52, 78, 30, 88]
const currentStreak = 47
const analyticsData = [30, 45, 35, 60, 50, 70, 55, 80, 65, 90, 75, 100]

const walletTxs = [
  { label: 'Payment received', amt: '₦45,000', credit: true,  icon: 'add_circle',  bg: 'rgba(22,163,74,.12)',   color: '#16a34a' },
  { label: 'Withdrawal',       amt: '₦10,000', credit: false, icon: 'arrow_upward', bg: 'rgba(239,68,68,.12)',  color: '#ef4444' },
  { label: 'Escrow release',   amt: '₦80,000', credit: true,  icon: 'lock_open',   bg: 'rgba(99,14,212,.12)',  color: '#7c3aed' },
]

const hireSteps = [
  { label: 'Post a job',         done: true,  active: false },
  { label: 'Receive applicants', done: true,  active: false },
  { label: 'Review profiles',    done: false, active: true  },
  { label: 'Hire & contract',    done: false, active: false },
]

const analyticsStats = [
  { label: 'Profile views', val: '2.4k', delta: '+18%', up: true  },
  { label: 'Applications',  val: '34',   delta: '+6',   up: true  },
  { label: 'Earnings',      val: '₦580k',delta: '+22%', up: true  },
]
</script>

<style scoped>
/* ══ Section ═══════════════════════════════════════════════════════════════ */
.why-section {
  background: var(--background);
  position: relative;
  overflow: hidden;
}
.why-section::before {
  content: '';
  position: absolute;
  top: -200px; left: 50%;
  transform: translateX(-50%);
  width: 800px; height: 600px;
  background: radial-gradient(ellipse, rgba(99,14,212,.06) 0%, transparent 70%);
  pointer-events: none;
}

/* ══ Header ════════════════════════════════════════════════════════════════ */
.why-header {
  text-align: center;
  margin-bottom: 3.5rem;
  display: flex; flex-direction: column; align-items: center; gap: .875rem;
}
.section-badge {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .3rem .875rem;
  background: var(--primary-fixed); color: var(--primary);
  border-radius: 999px; font-family: var(--font-headline);
  font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
  border: 1px solid rgba(99,14,212,.2);
}
.badge-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 6px rgba(99,14,212,.6);
  animation: badgePulse 2s ease-in-out infinite;
}
@keyframes badgePulse { 0%,100%{opacity:1} 50%{opacity:.4} }
.why-title {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 900; letter-spacing: -.03em; line-height: 1.1;
  color: var(--on-surface);
}
.why-sub { font-size: 1rem; color: var(--on-surface-variant); max-width: 380px; line-height: 1.6; }

/* ══ Bento Grid ════════════════════════════════════════════════════════════ */
.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 640px) {
  .bento-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
  }
  .bento-github   { grid-column: span 2; }
  .bento-wallet   { grid-row: span 2; }
  .bento-analytics { grid-column: span 2; }
}

/* ══ Base Card ═════════════════════════════════════════════════════════════ */
.bento-card {
  position: relative;
  display: flex; flex-direction: column; gap: .875rem;
  padding: 1.75rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: 20px;
  overflow: hidden;
  transition: transform .25s cubic-bezier(0.34,1.56,0.64,1), box-shadow .25s, border-color .25s;
}
.bento-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: color-mix(in srgb, var(--primary) 35%, var(--outline-variant));
}

/* Glow blobs */
.card-glow {
  position: absolute;
  width: 200px; height: 200px;
  border-radius: 50%;
  top: -80px; right: -60px;
  pointer-events: none;
  transition: opacity .3s;
}
.bento-card:hover .card-glow { opacity: 1.5; }
.card-glow-purple { background: radial-gradient(circle, rgba(99,14,212,.12) 0%, transparent 70%); }
.card-glow-blue   { background: radial-gradient(circle, rgba(59,130,246,.12) 0%, transparent 70%); }
.card-glow-green  { background: radial-gradient(circle, rgba(22,163,74,.12) 0%, transparent 70%); }
.card-glow-orange { background: radial-gradient(circle, rgba(245,158,11,.12) 0%, transparent 70%); }
.card-glow-pink   { background: radial-gradient(circle, rgba(236,72,153,.12) 0%, transparent 70%); }
.card-glow-teal   { background: radial-gradient(circle, rgba(20,184,166,.12) 0%, transparent 70%); }

/* Card top row */
.card-top {
  display: flex; align-items: center; gap: .75rem;
}
.card-label {
  font-family: var(--font-headline); font-size: .68rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .08em;
  color: var(--on-surface-variant); opacity: .7;
}

/* Icon wraps */
.ico-wrap {
  width: 44px; height: 44px; border-radius: 13px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.ico-wrap .material-symbols-outlined { font-size: 22px; }
.ico-purple { background: rgba(99,14,212,.12);  }  .ico-purple .material-symbols-outlined { color: var(--primary); }
.ico-blue   { background: rgba(59,130,246,.12); }  .ico-blue   .material-symbols-outlined { color: #3b82f6; }
.ico-green  { background: rgba(22,163,74,.12);  }  .ico-green  .material-symbols-outlined { color: #16a34a; }
.ico-orange { background: rgba(245,158,11,.12); }  .ico-orange .material-symbols-outlined { color: #f59e0b; }
.ico-pink   { background: rgba(236,72,153,.12); }  .ico-pink   .material-symbols-outlined { color: #ec4899; }
.ico-teal   { background: rgba(20,184,166,.12); }  .ico-teal   .material-symbols-outlined { color: #14b8a6; }

.card-title {
  font-family: var(--font-headline); font-size: 1.05rem; font-weight: 800;
  color: var(--on-surface); letter-spacing: -.02em; line-height: 1.3;
}
.card-desc {
  font-size: .875rem; color: var(--on-surface-variant); line-height: 1.65;
  flex: 1;
}

/* ══ GitHub Visual ═════════════════════════════════════════════════════════ */
.gh-visual {
  margin-top: auto;
  display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--outline-variant);
}
.gh-chart {
  display: flex; align-items: flex-end; gap: 4px;
  height: 56px; flex: 1;
}
.gh-bar {
  flex: 1; border-radius: 3px 3px 0 0; min-height: 4px;
  animation: barRise .6s cubic-bezier(0.34,1.56,0.64,1) both;
}
.gh-bar-hi  { background: var(--primary); box-shadow: 0 0 8px rgba(99,14,212,.4); }
.gh-bar-mid { background: color-mix(in srgb, var(--primary) 55%, transparent); }
.gh-bar-lo  { background: var(--surface-container-high); }
@keyframes barRise { from { transform: scaleY(0); transform-origin: bottom; } to { transform: scaleY(1); } }

.gh-streak {
  display: flex; flex-direction: column; align-items: center;
  background: linear-gradient(135deg, rgba(99,14,212,.15) 0%, rgba(99,14,212,.05) 100%);
  border: 1px solid rgba(99,14,212,.2); border-radius: 12px;
  padding: .5rem .875rem; flex-shrink: 0;
}
.streak-num  { font-family: var(--font-headline); font-size: 1.5rem; font-weight: 900; color: var(--primary); line-height: 1; }
.streak-label{ font-size: .62rem; font-weight: 600; color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: .05em; margin-top: 2px; }

/* ══ Wallet Visual ═════════════════════════════════════════════════════════ */
.wallet-visual {
  display: flex; flex-direction: column; gap: .75rem;
  margin-top: auto;
  background: linear-gradient(135deg, rgba(59,130,246,.07) 0%, rgba(99,14,212,.05) 100%);
  border: 1px solid rgba(59,130,246,.15); border-radius: 14px;
  padding: .875rem;
}
.wallet-bal-row {
  display: flex; align-items: baseline; justify-content: space-between;
}
.wallet-bal-label { font-size: .7rem; color: var(--on-surface-variant); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
.wallet-bal-amt   { font-family: var(--font-headline); font-size: 1.25rem; font-weight: 800; color: var(--on-surface); }
.wallet-actions   { display: flex; gap: .4rem; }
.wa-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: .25rem;
  padding: .4rem .3rem; border-radius: 9px;
  font-family: var(--font-headline); font-size: .68rem; font-weight: 700;
  cursor: default;
}
.wa-btn-fund { background: rgba(99,14,212,.12);  color: var(--primary); }
.wa-btn-send { background: rgba(59,130,246,.12); color: #3b82f6; }
.wa-btn-out  { background: rgba(22,163,74,.12);  color: #16a34a; }

.wallet-txs  { display: flex; flex-direction: column; gap: .5rem; }
.wtx {
  display: flex; align-items: center; gap: .5rem;
  font-size: .75rem;
}
.wtx-ico   { width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.wtx-label { flex: 1; color: var(--on-surface-variant); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wtx-amt   { font-family: var(--font-headline); font-weight: 700; font-size: .78rem; flex-shrink: 0; }
.wtx-pos   { color: #16a34a; }
.wtx-neg   { color: #ef4444; }

/* ══ Hire Timeline ═════════════════════════════════════════════════════════ */
.hire-visual { margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--outline-variant); }
.hire-timeline { display: flex; flex-direction: column; gap: .5rem; }
.ht-step {
  display: flex; align-items: center; gap: .625rem;
  font-size: .8rem; color: var(--on-surface-variant);
  opacity: .5; transition: opacity .2s;
}
.ht-step.ht-done   { opacity: 1; color: var(--on-surface); }
.ht-step.ht-active { opacity: 1; color: var(--primary); font-weight: 700; }
.ht-dot {
  width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
  border: 2px solid var(--outline-variant);
  display: flex; align-items: center; justify-content: center;
  font-size: .65rem; color: #fff;
  transition: all .2s;
}
.ht-done   .ht-dot { background: #16a34a; border-color: #16a34a; }
.ht-active .ht-dot {
  background: var(--primary); border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(99,14,212,.2);
  animation: activePulse 1.8s ease-in-out infinite;
}
@keyframes activePulse {
  0%,100% { box-shadow: 0 0 0 4px rgba(99,14,212,.2); }
  50%     { box-shadow: 0 0 0 8px rgba(99,14,212,.05); }
}
.ht-label { line-height: 1; }

/* ══ Messaging Visual ══════════════════════════════════════════════════════ */
.msg-visual {
  display: flex; flex-direction: column; gap: .5rem;
  margin-top: auto; padding-top: 1rem;
  border-top: 1px solid var(--outline-variant);
}
.msg-bubble {
  display: inline-flex; align-items: center; gap: .3rem;
  padding: .5rem .875rem; border-radius: 14px;
  font-size: .78rem; max-width: 85%; line-height: 1.4;
  animation: bubblePop .4s cubic-bezier(0.34,1.56,0.64,1) both;
}
.msg-theirs {
  background: var(--surface-container);
  color: var(--on-surface);
  border-bottom-left-radius: 4px;
  align-self: flex-start;
  border: 1px solid var(--outline-variant);
}
.msg-mine {
  background: var(--gradient-primary);
  color: #fff;
  border-bottom-right-radius: 4px;
  align-self: flex-end;
  box-shadow: 0 4px 12px rgba(99,14,212,.3);
}
.msg-tick { font-size: 12px; opacity: .8; flex-shrink: 0; }
@keyframes bubblePop { from { opacity: 0; transform: scale(.85); } to { opacity: 1; transform: scale(1); } }
.msg-bubble:nth-child(2) { animation-delay: .15s; }
.msg-bubble:nth-child(3) { animation-delay: .3s; }

/* ══ Analytics Visual ══════════════════════════════════════════════════════ */
.analytics-visual {
  margin-top: auto;
  display: flex; flex-direction: column; gap: .875rem;
  padding-top: 1rem;
  border-top: 1px solid var(--outline-variant);
}
.av-stats {
  display: flex; gap: 1.25rem;
}
.av-stat {
  display: flex; flex-direction: column; gap: .1rem;
}
.av-val   { font-family: var(--font-headline); font-size: 1rem; font-weight: 800; color: var(--on-surface); }
.av-lbl   { font-size: .68rem; color: var(--on-surface-variant); }
.av-delta { display: flex; align-items: center; gap: .1rem; font-size: .65rem; font-weight: 700; }
.delta-up { color: #16a34a; }
.delta-dn { color: #ef4444; }

.av-chart {
  display: flex; align-items: flex-end; gap: 4px; height: 52px;
}
.av-bar-col { flex: 1; display: flex; align-items: flex-end; height: 100%; }
.av-bar {
  width: 100%; border-radius: 4px 4px 0 0; min-height: 4px;
  background: var(--surface-container-high);
  animation: barRise .5s cubic-bezier(0.34,1.56,0.64,1) both;
}
.av-bar-hi {
  background: var(--gradient-primary) !important;
  box-shadow: 0 0 10px rgba(99,14,212,.4);
}

/* ══ Escrow Visual ═════════════════════════════════════════════════════════ */
.escrow-visual {
  margin-top: auto; padding-top: 1rem;
  border-top: 1px solid var(--outline-variant);
  display: flex; flex-direction: column; gap: .625rem;
}
.escrow-flow {
  display: flex; align-items: center; gap: .5rem;
}
.ef-node {
  display: flex; flex-direction: column; align-items: center; gap: .25rem;
  padding: .5rem .75rem; border-radius: 12px;
  font-size: .65rem; font-weight: 700; color: var(--on-surface-variant);
  background: var(--surface-container); border: 1px solid var(--outline-variant);
}
.ef-client .material-symbols-outlined { color: #3b82f6; }
.ef-dev    .material-symbols-outlined { color: var(--primary); }
.ef-arrow {
  flex: 1; display: flex; align-items: center; gap: .25rem;
}
.ef-line  { flex: 1; height: 2px; background: var(--outline-variant); border-radius: 1px; }
.ef-lock  {
  width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
  background: rgba(20,184,166,.12); border: 1px solid rgba(20,184,166,.3);
  display: flex; align-items: center; justify-content: center;
  color: #14b8a6;
}
.escrow-note {
  text-align: center; font-size: .72rem; color: #14b8a6;
  font-weight: 600; letter-spacing: .01em;
}

/* ══ Dark mode tweaks ══════════════════════════════════════════════════════ */
[data-theme="dark"] .bento-card {
  background: var(--surface-container-lowest);
}
[data-theme="dark"] .bento-card:hover {
  box-shadow: 0 16px 48px rgba(0,0,0,.5), 0 0 0 1px rgba(168,85,247,.2);
}
</style>
