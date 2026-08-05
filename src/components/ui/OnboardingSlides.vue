<template>
  <Teleport to="body">
    <Transition name="ob-fade">
      <div v-if="visible" class="ob-shell" :class="[`slide-${current}`, isDark ? 'is-dark' : 'is-light']">

        <!-- Full-screen gradient background -->
        <div class="ob-bg" aria-hidden="true">
          <div class="ob-blob ob-blob-1" />
          <div class="ob-blob ob-blob-2" />
          <div class="ob-blob ob-blob-3" />
          <div class="ob-grid" />
        </div>

        <!-- Top bar -->
        <header class="ob-bar">
          <div class="ob-brand">
            <div class="ob-logo-wrap">
              <img src="@/assets/icons/icon.png" alt="GFD" class="ob-logo" />
            </div>
            <span class="ob-name">GFD</span>
          </div>
          <button class="ob-skip" @click="finish">Skip</button>
        </header>

        <!-- Slide content -->
        <div class="ob-stage">
          <Transition :name="dir" mode="out-in">

            <!-- ── SLIDE 0: Discover ── -->
            <div v-if="current === 0" key="s0" class="ob-slide">
              <div class="ob-visual">
                <div class="visual-frame">
                  <!-- Floating badge top -->
                  <div class="float-pill float-top-right">
                    <div class="fp-dot fp-green" />
                    <span class="fp-text">Available now</span>
                  </div>
                  <!-- Main dev card -->
                  <div class="mock-card mc-dev">
                    <div class="mc-cover" />
                    <div class="mc-avatar">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format" alt="" class="mc-av-img" />
                    </div>
                    <div class="mc-body">
                      <div class="mc-name-row">
                        <span class="mc-name">Alex Morgan</span>
                        <span class="mc-verified material-symbols-outlined">verified</span>
                      </div>
                      <span class="mc-role">Full-Stack Developer</span>
                      <div class="mc-chips">
                        <span class="mc-chip mc-chip-p">React</span>
                        <span class="mc-chip mc-chip-p">Node.js</span>
                        <span class="mc-chip mc-chip-p">+4</span>
                      </div>
                      <div class="mc-stats">
                        <div class="mc-stat"><strong>42</strong><span>Projects</span></div>
                        <div class="mc-divider" />
                        <div class="mc-stat"><strong>4.9★</strong><span>Rating</span></div>
                        <div class="mc-divider" />
                        <div class="mc-stat"><strong>100%</strong><span>Success</span></div>
                      </div>
                      <button class="mc-hire-btn">Hire Now</button>
                    </div>
                  </div>
                  <!-- Floating badge bottom -->
                  <div class="float-pill float-bot-left">
                    <span class="fp-emoji">💼</span>
                    <div>
                      <div class="fp-title">New offer received</div>
                      <div class="fp-sub">₦450,000 · Remote</div>
                    </div>
                    <span class="fp-new">NEW</span>
                  </div>
                  <!-- Background cards -->
                  <div class="bg-card bc-1" />
                  <div class="bg-card bc-2" />
                </div>
              </div>
              <div class="ob-copy">
                <div class="ob-step-badge">
                  <span class="step-num">01</span>
                  <span class="step-line" />
                  <span class="step-label">Discover</span>
                </div>
                <h2 class="ob-h">Find top developers<br><span class="ob-h-accent">instantly.</span></h2>
                <p class="ob-p">Browse GitHub-verified developer profiles, check skills and ratings, then hire in minutes.</p>
                <div class="ob-trust-row">
                  <div class="trust-av-stack">
                    <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&crop=face&auto=format" class="trust-av" alt="" />
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face&auto=format" class="trust-av" alt="" />
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format" class="trust-av" alt="" />
                    <div class="trust-av trust-av-count">+2k</div>
                  </div>
                  <span class="trust-text">2,000+ developers ready to hire</span>
                </div>
              </div>
            </div>

            <!-- ── SLIDE 1: Work ── -->
            <div v-else-if="current === 1" key="s1" class="ob-slide">
              <div class="ob-visual">
                <div class="visual-frame">
                  <div class="float-pill float-top-right">
                    <span class="fp-emoji">✅</span>
                    <span class="fp-text">98% match found</span>
                  </div>
                  <div class="mock-card mc-job">
                    <div class="mj-header">
                      <div class="mj-logo">
                        <img src="@/assets/icons/icon.png" alt="GFD" class="mj-logo-img" />
                      </div>
                      <div class="mj-meta">
                        <span class="mj-title">Senior React Developer</span>
                        <span class="mj-company">GlobalFD · Remote</span>
                      </div>
                      <span class="mj-new">NEW</span>
                    </div>
                    <div class="mj-chips">
                      <span class="mc-chip mc-chip-b">Full-time</span>
                      <span class="mc-chip mc-chip-b">React</span>
                      <span class="mc-chip mc-chip-b">TypeScript</span>
                    </div>
                    <div class="mj-salary">
                      <span class="mj-amount">₦600,000</span>
                      <span class="mj-period">/month</span>
                    </div>
                    <div class="mj-applicants">
                      <div class="trust-av-stack trust-av-sm">
                        <div class="trust-av trust-av-p">A</div>
                        <div class="trust-av trust-av-b">B</div>
                        <div class="trust-av trust-av-g">C</div>
                      </div>
                      <span class="mj-count">24 applicants</span>
                    </div>
                    <button class="mc-hire-btn mj-apply">Apply Now →</button>
                  </div>
                  <div class="float-pill float-bot-left">
                    <span class="fp-emoji">💬</span>
                    <div>
                      <div class="fp-title">Interview scheduled</div>
                      <div class="fp-sub">Tomorrow 10:00 AM</div>
                    </div>
                  </div>
                  <div class="bg-card bc-1" />
                  <div class="bg-card bc-2" />
                </div>
              </div>
              <div class="ob-copy">
                <div class="ob-step-badge">
                  <span class="step-num">02</span>
                  <span class="step-line" />
                  <span class="step-label">Work</span>
                </div>
                <h2 class="ob-h">Post jobs.<br><span class="ob-h-accent">Get hired fast.</span></h2>
                <p class="ob-p">Clients post real projects, developers apply and chat directly. No agencies, no delays.</p>
                <div class="ob-feature-list">
                  <div class="ob-feat"><span class="of-dot of-green" />Post a job in 2 minutes</div>
                  <div class="ob-feat"><span class="of-dot of-blue" />Direct messaging built-in</div>
                  <div class="ob-feat"><span class="of-dot of-purple" />Contract signing included</div>
                </div>
              </div>
            </div>

            <!-- ── SLIDE 2: Get Paid ── -->
            <div v-else key="s2" class="ob-slide">
              <div class="ob-visual">
                <div class="visual-frame">
                  <div class="float-pill float-top-right">
                    <span class="fp-emoji">🔒</span>
                    <span class="fp-text">Bank-grade security</span>
                  </div>
                  <div class="mock-card mc-wallet">
                    <div class="mw-top">
                      <div>
                        <div class="mw-label">Total Balance</div>
                        <div class="mw-balance">₦124,500.00</div>
                      </div>
                      <div class="mw-icon">💳</div>
                    </div>
                    <div class="mw-actions">
                      <div class="mw-action mw-a-green">
                        <span class="material-symbols-outlined" style="font-size:14px">add_circle</span>Fund
                      </div>
                      <div class="mw-action mw-a-blue">
                        <span class="material-symbols-outlined" style="font-size:14px">send</span>Send
                      </div>
                      <div class="mw-action mw-a-purple">
                        <span class="material-symbols-outlined" style="font-size:14px">arrow_upward</span>Out
                      </div>
                    </div>
                    <div class="mw-txs">
                      <div class="mw-tx">
                        <div class="mw-tx-ico mw-tx-cr">
                          <span class="material-symbols-outlined" style="font-size:13px">add</span>
                        </div>
                        <div class="mw-tx-info">
                          <span class="mw-tx-name">Project Payment</span>
                          <span class="mw-tx-date">Today</span>
                        </div>
                        <span class="mw-tx-amt mw-pos">+₦45,000</span>
                      </div>
                      <div class="mw-tx">
                        <div class="mw-tx-ico mw-tx-dr">
                          <span class="material-symbols-outlined" style="font-size:13px">send</span>
                        </div>
                        <div class="mw-tx-info">
                          <span class="mw-tx-name">Sent to James</span>
                          <span class="mw-tx-date">Yesterday</span>
                        </div>
                        <span class="mw-tx-amt mw-neg">-₦5,000</span>
                      </div>
                      <div class="mw-tx">
                        <div class="mw-tx-ico mw-tx-cr">
                          <span class="material-symbols-outlined" style="font-size:13px">add</span>
                        </div>
                        <div class="mw-tx-info">
                          <span class="mw-tx-name">Freelance Job</span>
                          <span class="mw-tx-date">Monday</span>
                        </div>
                        <span class="mw-tx-amt mw-pos">+₦80,000</span>
                      </div>
                    </div>
                  </div>
                  <div class="float-pill float-bot-left">
                    <span class="fp-emoji">⚡</span>
                    <div>
                      <div class="fp-title">Instant withdrawal</div>
                      <div class="fp-sub">Any Nigerian bank</div>
                    </div>
                  </div>
                  <div class="bg-card bc-1" />
                  <div class="bg-card bc-2" />
                </div>
              </div>
              <div class="ob-copy">
                <div class="ob-step-badge">
                  <span class="step-num">03</span>
                  <span class="step-line" />
                  <span class="step-label">Get Paid</span>
                </div>
                <h2 class="ob-h">Your money,<br><span class="ob-h-accent">your control.</span></h2>
                <p class="ob-p">Built-in wallet, instant transfers, and direct bank withdrawals. Secure every time.</p>
                <div class="ob-feature-list">
                  <div class="ob-feat"><span class="of-dot of-green" />Withdraw to any bank</div>
                  <div class="ob-feat"><span class="of-dot of-green" />Escrow protection</div>
                  <div class="ob-feat"><span class="of-dot of-green" />Zero hidden fees</div>
                </div>
              </div>
            </div>

          </Transition>
        </div>

        <!-- Footer -->
        <footer class="ob-foot">
          <div class="ob-progress">
            <button v-for="(_, i) in 3" :key="i"
              class="ob-dot" :class="{ active: i === current }"
              @click="goTo(i)" />
          </div>
          <div class="ob-foot-right">
            <button v-if="current < 2" class="ob-btn ob-btn-next" @click="next">
              Next
              <span class="material-symbols-outlined" style="font-size:17px;line-height:1">arrow_forward</span>
            </button>
            <button v-else class="ob-btn ob-btn-start" @click="finish">
              <img src="@/assets/icons/icon.png" alt="" class="ob-btn-icon" />
              Get Started
            </button>
          </div>
        </footer>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const PERM_KEY    = 'gfd_onboarded_v2'
const SESSION_KEY = 'gfd_ob_session'

const visible = ref(false)
const current = ref(0)
const dir     = ref('ob-next')
const isDark  = ref(false)

onMounted(() => {
  const alreadySeen = sessionStorage.getItem(SESSION_KEY)
  const permDone    = localStorage.getItem(PERM_KEY)
  visible.value = !alreadySeen || !permDone
  if (!alreadySeen) sessionStorage.setItem(SESSION_KEY, '1')

  const stored = localStorage.getItem('gfd_theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
  isDark.value = stored ? stored === 'dark' : prefersDark.matches
  prefersDark.addEventListener('change', onOsChange)
})

function onOsChange(e) {
  if (!localStorage.getItem('gfd_theme')) isDark.value = e.matches
}
onUnmounted(() => {
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', onOsChange)
})

function next()  { dir.value = 'ob-next';  current.value++ }
function goTo(i) { dir.value = i > current.value ? 'ob-next' : 'ob-prev'; current.value = i }
function finish() { localStorage.setItem(PERM_KEY, '1'); visible.value = false }
</script>

<style scoped>
/* ══ SHELL ══════════════════════════════════════════════════════════════════ */
.ob-shell {
  position: fixed; inset: 0; z-index: 10000;
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: var(--font-body);
}

/* ══ BACKGROUND ═════════════════════════════════════════════════════════════ */
.ob-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
}
.ob-blob {
  position: absolute; border-radius: 50%;
  filter: blur(80px); transition: all 1.2s cubic-bezier(0.4,0,0.2,1);
}
/* Slide 0 — Purple/Blue */
.slide-0 .ob-blob-1 { width: 400px; height: 400px; top: -120px; right: -80px; background: radial-gradient(circle, rgba(99,14,212,.55) 0%, transparent 70%); }
.slide-0 .ob-blob-2 { width: 300px; height: 300px; bottom: -60px; left: -60px;  background: radial-gradient(circle, rgba(59,130,246,.45) 0%, transparent 70%); }
.slide-0 .ob-blob-3 { width: 200px; height: 200px; top: 40%;    left: 30%;     background: radial-gradient(circle, rgba(168,85,247,.3) 0%, transparent 70%); }
/* Slide 1 — Blue/Teal */
.slide-1 .ob-blob-1 { width: 380px; height: 380px; top: -100px; left: -80px;   background: radial-gradient(circle, rgba(37,99,235,.5) 0%, transparent 70%); }
.slide-1 .ob-blob-2 { width: 280px; height: 280px; bottom: -40px; right: -40px; background: radial-gradient(circle, rgba(99,14,212,.45) 0%, transparent 70%); }
.slide-1 .ob-blob-3 { width: 180px; height: 180px; top: 35%;   right: 25%;     background: radial-gradient(circle, rgba(139,92,246,.35) 0%, transparent 70%); }
/* Slide 2 — Green/Purple */
.slide-2 .ob-blob-1 { width: 380px; height: 380px; top: -80px;  right: -60px;  background: radial-gradient(circle, rgba(16,185,129,.45) 0%, transparent 70%); }
.slide-2 .ob-blob-2 { width: 300px; height: 300px; bottom: -80px; left: -40px; background: radial-gradient(circle, rgba(99,14,212,.5) 0%, transparent 70%); }
.slide-2 .ob-blob-3 { width: 200px; height: 200px; top: 45%;   left: 20%;      background: radial-gradient(circle, rgba(52,211,153,.3) 0%, transparent 70%); }

/* Dark backgrounds */
.is-dark  { background: #080612; }
.is-dark.slide-1 { background: #060a1f; }
.is-dark.slide-2 { background: #060e0a; }
/* Light backgrounds */
.is-light { background: #f4f0ff; }
.is-light.slide-1 { background: #eff6ff; }
.is-light.slide-2 { background: #f0fdf4; }
.is-light .ob-blob-1, .is-light .ob-blob-2, .is-light .ob-blob-3 { opacity: .45; }

/* Dot grid overlay */
.ob-grid {
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, black 0%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, black 0%, transparent 100%);
}
.is-light .ob-grid { background-image: radial-gradient(circle, rgba(0,0,0,.05) 1px, transparent 1px); }

/* ══ TOP BAR ════════════════════════════════════════════════════════════════ */
.ob-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: calc(.875rem + env(safe-area-inset-top,0px)) 1.25rem .625rem;
  position: relative; z-index: 10; flex-shrink: 0;
}
.ob-brand { display: flex; align-items: center; gap: .5rem; }
.ob-logo-wrap {
  width: 34px; height: 34px; border-radius: 10px;
  background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.is-light .ob-logo-wrap { background: rgba(99,14,212,.1); border-color: rgba(99,14,212,.2); }
.ob-logo { width: 26px; height: 26px; object-fit: contain; display: block; }
.ob-name {
  font-family: var(--font-headline); font-size: 1.1rem; font-weight: 900;
  color: #fff; letter-spacing: -.02em;
}
.is-light .ob-name { color: #1a0a3c; }
.ob-skip {
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18);
  border-radius: 999px; padding: .35rem 1rem;
  font-family: var(--font-headline); font-size: .78rem; font-weight: 600;
  color: rgba(255,255,255,.65); cursor: pointer; transition: all .15s;
}
.ob-skip:hover { background: rgba(255,255,255,.2); color: #fff; }
.is-light .ob-skip { background: rgba(0,0,0,.06); border-color: rgba(0,0,0,.12); color: rgba(0,0,0,.55); }
.is-light .ob-skip:hover { background: rgba(0,0,0,.1); color: #1a0a3c; }

/* ══ STAGE ══════════════════════════════════════════════════════════════════ */
.ob-stage {
  flex: 1; overflow: hidden; position: relative; z-index: 2;
  display: flex; flex-direction: column;
}
.ob-slide {
  height: 100%; width: 100%;
  display: flex; flex-direction: column;
  padding: .5rem 1.25rem 0;
  gap: 1.25rem; overflow: hidden;
  align-items: center;
}
@media (min-width: 640px) {
  .ob-slide {
    flex-direction: row; align-items: center; justify-content: center;
    padding: 1.5rem 2.5rem; gap: 2.5rem;
    max-width: 900px; margin: 0 auto; width: 100%;
  }
}

/* ══ VISUAL ═════════════════════════════════════════════════════════════════ */
.ob-visual {
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; width: 100%;
}
@media (min-width: 640px) { .ob-visual { width: 320px; } }
@media (min-width: 768px) { .ob-visual { width: 360px; } }

.visual-frame {
  position: relative;
  width: 100%; max-width: 300px;
  padding: 32px 8px 40px;
}
@media (min-width: 640px) { .visual-frame { max-width: 320px; padding: 36px 4px 44px; } }

/* Background decorative cards behind the main card */
.bg-card {
  position: absolute; border-radius: 18px;
  border: 1px solid rgba(255,255,255,.08);
  backdrop-filter: blur(4px);
  z-index: 0;
}
.is-dark .bg-card { background: rgba(255,255,255,.03); }
.is-light .bg-card { background: rgba(255,255,255,.5); border-color: rgba(255,255,255,.7); }
.bc-1 { width: 88%; height: 90%; top: 4%; left: 6%; transform: rotate(-4deg); }
.bc-2 { width: 84%; height: 88%; top: 6%; left: 8%; transform: rotate(-8deg); opacity: .6; }

/* ── Main card ── */
.mock-card {
  position: relative; z-index: 2;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,.5), 0 8px 24px rgba(0,0,0,.3);
}
.is-dark  .mock-card { background: rgba(18,12,40,.95); border: 1px solid rgba(168,85,247,.2); }
.is-light .mock-card { background: rgba(255,255,255,.92); border: 1px solid rgba(99,14,212,.12); box-shadow: 0 16px 48px rgba(0,0,0,.15); }

/* Dev card cover banner */
.mc-cover {
  height: 56px;
  background: linear-gradient(135deg, #1a0840 0%, #3b0f82 50%, #0a1855 100%);
  position: relative;
}
.mc-cover::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(99,14,212,.6) 0%, rgba(59,130,246,.4) 100%);
}

/* Dev card avatar */
.mc-avatar {
  width: 52px; height: 52px; border-radius: 50%;
  border: 3px solid rgba(18,12,40,.95);
  overflow: hidden; position: absolute;
  top: 30px; left: 14px; z-index: 3;
  box-shadow: 0 4px 16px rgba(0,0,0,.4);
}
.is-light .mc-avatar { border-color: rgba(255,255,255,.95); }
.mc-av-img { width: 100%; height: 100%; object-fit: cover; display: block; }

.mc-body { padding: 2rem .875rem .875rem; display: flex; flex-direction: column; gap: .5rem; }

.mc-name-row { display: flex; align-items: center; gap: .3rem; }
.mc-name { font-family: var(--font-headline); font-size: .95rem; font-weight: 800; color: #fff; }
.is-light .mc-name { color: #1a0a3c; }
.mc-verified { font-size: 16px; color: #a855f7; font-variation-settings: 'FILL' 1; flex-shrink: 0; }
.mc-role { font-size: .72rem; color: rgba(255,255,255,.5); font-weight: 600; }
.is-light .mc-role { color: rgba(0,0,0,.45); }

.mc-chips { display: flex; flex-wrap: wrap; gap: .3rem; }
.mc-chip {
  padding: .2rem .55rem; border-radius: 999px;
  font-family: var(--font-headline); font-size: .65rem; font-weight: 700;
}
.mc-chip-p { background: rgba(168,85,247,.2); color: #c4b5fd; }
.mc-chip-b { background: rgba(59,130,246,.2); color: #93c5fd; }
.is-light .mc-chip-p { background: rgba(99,14,212,.1); color: #7c3aed; }
.is-light .mc-chip-b { background: rgba(37,99,235,.1); color: #1d4ed8; }

.mc-stats {
  display: flex; align-items: center; justify-content: space-around;
  padding: .5rem 0; border-top: 1px solid rgba(255,255,255,.07); border-bottom: 1px solid rgba(255,255,255,.07);
}
.is-light .mc-stats { border-color: rgba(0,0,0,.07); }
.mc-stat { display: flex; flex-direction: column; align-items: center; gap: .1rem; }
.mc-stat strong { font-family: var(--font-headline); font-size: .82rem; font-weight: 800; color: #fff; }
.mc-stat span   { font-size: .58rem; color: rgba(255,255,255,.4); }
.is-light .mc-stat strong { color: #1a0a3c; }
.is-light .mc-stat span   { color: rgba(0,0,0,.4); }
.mc-divider { width: 1px; height: 24px; background: rgba(255,255,255,.1); }
.is-light .mc-divider { background: rgba(0,0,0,.1); }

.mc-hire-btn {
  width: 100%; padding: .55rem; border-radius: 12px; border: none;
  background: linear-gradient(135deg, #630ed4 0%, #7c3aed 100%);
  color: #fff; font-family: var(--font-headline); font-size: .82rem; font-weight: 700;
  cursor: pointer; transition: opacity .15s; box-shadow: 0 4px 16px rgba(99,14,212,.4);
}
.mc-hire-btn:hover { opacity: .9; }

/* ── Job card ── */
.mc-job { padding: .875rem; }
.mj-header { display: flex; align-items: center; gap: .625rem; margin-bottom: .625rem; }
.mj-logo { width: 36px; height: 36px; border-radius: 10px; background: rgba(168,85,247,.15); border: 1px solid rgba(168,85,247,.25); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.mj-logo-img { width: 28px; height: 28px; object-fit: contain; }
.mj-meta { flex: 1; min-width: 0; }
.mj-title { display: block; font-family: var(--font-headline); font-size: .875rem; font-weight: 700; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mj-company { font-size: .68rem; color: rgba(255,255,255,.45); }
.is-light .mj-title { color: #1a0a3c; }
.is-light .mj-company { color: rgba(0,0,0,.45); }
.mj-new { background: rgba(168,85,247,.25); color: #c4b5fd; font-size: .6rem; font-weight: 800; padding: .15rem .45rem; border-radius: 999px; flex-shrink: 0; }
.mj-chips { display: flex; flex-wrap: wrap; gap: .25rem; margin-bottom: .5rem; }
.mj-salary { display: flex; align-items: baseline; gap: .3rem; margin-bottom: .5rem; }
.mj-amount { font-family: var(--font-headline); font-size: 1.15rem; font-weight: 900; color: #fff; }
.mj-period { font-size: .7rem; color: rgba(255,255,255,.4); }
.is-light .mj-amount { color: #1a0a3c; }
.mj-applicants { display: flex; align-items: center; gap: .5rem; margin-bottom: .625rem; }
.mj-count { font-size: .7rem; color: rgba(255,255,255,.45); }
.is-light .mj-count { color: rgba(0,0,0,.45); }
.mj-apply { background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%); box-shadow: 0 4px 16px rgba(37,99,235,.4); }

/* Trust avatar stack */
.trust-av-stack { display: flex; }
.trust-av {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid rgba(18,12,40,.8);
  margin-left: -8px; overflow: hidden; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-headline); font-size: .62rem; font-weight: 800; color: #fff;
}
.trust-av:first-child { margin-left: 0; }
.trust-av img { width: 100%; height: 100%; object-fit: cover; }
.trust-av-count { background: rgba(168,85,247,.3); color: #c4b5fd; font-size: .55rem; }
.trust-av-p { background: #7c3aed; }
.trust-av-b { background: #2563eb; }
.trust-av-g { background: #16a34a; }
.trust-av-sm .trust-av { width: 22px; height: 22px; }
.is-light .trust-av { border-color: rgba(255,255,255,.9); }

/* ── Wallet card ── */
.mc-wallet { padding: 1rem; }
.mw-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: .75rem; }
.mw-label { font-size: .65rem; color: rgba(255,255,255,.45); text-transform: uppercase; letter-spacing: .06em; margin-bottom: .2rem; }
.is-light .mw-label { color: rgba(0,0,0,.4); }
.mw-balance { font-family: var(--font-headline); font-size: 1.3rem; font-weight: 900; color: #fff; letter-spacing: -.02em; }
.is-light .mw-balance { color: #1a0a3c; }
.mw-icon { font-size: 1.4rem; }
.mw-actions { display: flex; gap: .4rem; margin-bottom: .75rem; }
.mw-action {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: .25rem;
  padding: .4rem .25rem; border-radius: 10px;
  font-family: var(--font-headline); font-size: .68rem; font-weight: 700; cursor: default;
}
.mw-a-green  { background: rgba(16,185,129,.15); color: #34d399; }
.mw-a-blue   { background: rgba(59,130,246,.15);  color: #60a5fa; }
.mw-a-purple { background: rgba(168,85,247,.15);   color: #c4b5fd; }
.mw-txs { display: flex; flex-direction: column; gap: .4rem; padding-top: .625rem; border-top: 1px solid rgba(255,255,255,.07); }
.is-light .mw-txs { border-color: rgba(0,0,0,.07); }
.mw-tx { display: flex; align-items: center; gap: .5rem; }
.mw-tx-ico { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; }
.mw-tx-cr { background: rgba(16,185,129,.2); color: #34d399; }
.mw-tx-dr { background: rgba(59,130,246,.2); color: #60a5fa; }
.mw-tx-info { flex: 1; min-width: 0; }
.mw-tx-name { display: block; font-family: var(--font-headline); font-size: .75rem; font-weight: 600; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mw-tx-date { font-size: .62rem; color: rgba(255,255,255,.4); }
.is-light .mw-tx-name { color: #1a0a3c; }
.is-light .mw-tx-date { color: rgba(0,0,0,.4); }
.mw-tx-amt { font-family: var(--font-headline); font-size: .8rem; font-weight: 800; flex-shrink: 0; }
.mw-pos { color: #34d399; }
.mw-neg { color: #f87171; }

/* ── Float pills ── */
.float-pill {
  position: absolute; z-index: 4;
  display: flex; align-items: center; gap: .5rem;
  padding: .5rem .75rem;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,.4);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  max-width: 200px;
  animation: pill-float 3s ease-in-out infinite;
}
.is-dark  .float-pill { background: rgba(22,14,48,.9); border: 1px solid rgba(255,255,255,.12); }
.is-light .float-pill { background: rgba(255,255,255,.9); border: 1px solid rgba(99,14,212,.15); box-shadow: 0 8px 24px rgba(0,0,0,.12); }
@keyframes pill-float {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-4px); }
}
.float-top-right { top: 0; right: 0; animation-delay: 0s; }
.float-bot-left  { bottom: 0; left: 0; animation-delay: 1.5s; }

.fp-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.fp-green { background: #22c55e; box-shadow: 0 0 8px rgba(34,197,94,.8); animation: glow-pulse 1.5s ease-in-out infinite; }
@keyframes glow-pulse { 0%,100%{ box-shadow: 0 0 6px rgba(34,197,94,.8); } 50%{ box-shadow: 0 0 14px rgba(34,197,94,1); } }
.fp-emoji { font-size: .9rem; flex-shrink: 0; }
.fp-text  { font-family: var(--font-headline); font-size: .72rem; font-weight: 700; color: #fff; white-space: nowrap; }
.fp-title { font-family: var(--font-headline); font-size: .72rem; font-weight: 700; color: #fff; white-space: nowrap; }
.fp-sub   { font-size: .62rem; color: rgba(255,255,255,.5); white-space: nowrap; }
.fp-new   { background: #7c3aed; color: #fff; font-size: .58rem; font-weight: 800; padding: .12rem .4rem; border-radius: 999px; margin-left: auto; flex-shrink: 0; }
.is-light .fp-text  { color: #1a0a3c; }
.is-light .fp-title { color: #1a0a3c; }
.is-light .fp-sub   { color: rgba(0,0,0,.45); }

/* ══ COPY ════════════════════════════════════════════════════════════════════ */
.ob-copy {
  display: flex; flex-direction: column; gap: .75rem;
  flex: 1; min-width: 0;
}
@media (min-width: 640px) { .ob-copy { justify-content: center; max-width: 380px; } }

.ob-step-badge {
  display: inline-flex; align-items: center; gap: .5rem;
  width: fit-content;
}
.step-num {
  font-family: var(--font-headline); font-size: .65rem; font-weight: 900;
  color: rgba(255,255,255,.35); letter-spacing: .1em;
}
.is-light .step-num { color: rgba(0,0,0,.3); }
.step-line { width: 24px; height: 1px; background: rgba(255,255,255,.2); }
.is-light .step-line { background: rgba(0,0,0,.15); }
.step-label {
  font-family: var(--font-headline); font-size: .65rem; font-weight: 700;
  color: rgba(255,255,255,.35); text-transform: uppercase; letter-spacing: .1em;
}
.is-light .step-label { color: rgba(0,0,0,.3); }

.ob-h {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 5vw, 2.8rem);
  font-weight: 900; line-height: 1.08; letter-spacing: -.035em;
  color: #fff; margin: 0;
}
.is-light .ob-h { color: #1a0a3c; }
.ob-h-accent {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #60a5fa 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.slide-2 .ob-h-accent {
  background: linear-gradient(135deg, #34d399 0%, #10b981 50%, #a855f7 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ob-p {
  font-size: .9rem; color: rgba(255,255,255,.55); line-height: 1.65;
  max-width: 360px; margin: 0;
}
.is-light .ob-p { color: rgba(0,0,0,.5); }

/* Trust row */
.ob-trust-row {
  display: flex; align-items: center; gap: .75rem;
  padding: .625rem .875rem;
  background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
  border-radius: 14px; width: fit-content; margin-top: .25rem;
}
.is-light .ob-trust-row { background: rgba(99,14,212,.05); border-color: rgba(99,14,212,.12); }
.trust-text { font-size: .75rem; color: rgba(255,255,255,.55); font-weight: 500; }
.is-light .trust-text { color: rgba(0,0,0,.5); }

/* Feature list */
.ob-feature-list { display: flex; flex-direction: column; gap: .45rem; margin-top: .25rem; }
.ob-feat {
  display: flex; align-items: center; gap: .5rem;
  font-size: .82rem; color: rgba(255,255,255,.6); font-weight: 500;
}
.is-light .ob-feat { color: rgba(0,0,0,.55); }
.of-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.of-green  { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,.5); }
.of-blue   { background: #3b82f6; box-shadow: 0 0 6px rgba(59,130,246,.5); }
.of-purple { background: #a855f7; box-shadow: 0 0 6px rgba(168,85,247,.5); }

/* ══ FOOTER ══════════════════════════════════════════════════════════════════ */
.ob-foot {
  display: flex; align-items: center; justify-content: space-between;
  padding: .75rem 1.25rem calc(.875rem + env(safe-area-inset-bottom,0px));
  position: relative; z-index: 10; flex-shrink: 0;
  border-top: 1px solid rgba(255,255,255,.07);
}
.is-light .ob-foot { border-top-color: rgba(0,0,0,.07); }

.ob-progress { display: flex; gap: .375rem; align-items: center; }
.ob-dot {
  height: 6px; border-radius: 999px;
  background: rgba(255,255,255,.2); border: none; cursor: pointer;
  transition: all .3s cubic-bezier(0.34,1.56,0.64,1); padding: 0;
  width: 6px;
}
.ob-dot.active { width: 28px; background: #fff; }
.is-light .ob-dot { background: rgba(0,0,0,.18); }
.is-light .ob-dot.active { background: #7c3aed; }

.ob-foot-right { display: flex; align-items: center; }
.ob-btn {
  height: 46px; border-radius: 14px; border: none;
  font-family: var(--font-headline); font-size: .9rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  gap: .4rem; padding: 0 1.5rem; white-space: nowrap;
  transition: all .2s cubic-bezier(0.34,1.56,0.64,1);
}
.ob-btn-next {
  background: rgba(255,255,255,.1);
  border: 1.5px solid rgba(255,255,255,.2);
  color: #fff;
}
.ob-btn-next:hover { background: rgba(255,255,255,.18); transform: translateX(2px); }
.is-light .ob-btn-next { background: rgba(0,0,0,.06); border-color: rgba(0,0,0,.15); color: #1a0a3c; }

.ob-btn-start {
  background: #fff;
  color: #0d0520;
  box-shadow: 0 4px 20px rgba(255,255,255,.15), 0 8px 32px rgba(99,14,212,.2);
}
.ob-btn-start:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(255,255,255,.2), 0 12px 40px rgba(99,14,212,.25); }
.is-light .ob-btn-start { background: #630ed4; color: #fff; box-shadow: 0 4px 20px rgba(99,14,212,.35); }
.ob-btn-icon { width: 18px; height: 18px; border-radius: 5px; object-fit: contain; flex-shrink: 0; }

/* ══ TRANSITIONS ══════════════════════════════════════════════════════════════ */
.ob-fade-enter-active { transition: opacity .4s ease; }
.ob-fade-leave-active { transition: opacity .3s ease; }
.ob-fade-enter-from, .ob-fade-leave-to { opacity: 0; }

.ob-next-enter-active, .ob-next-leave-active,
.ob-prev-enter-active, .ob-prev-leave-active {
  transition: all .35s cubic-bezier(0.4,0,0.2,1);
  position: absolute; width: 100%; height: 100%;
}
.ob-next-enter-from  { opacity: 0; transform: translateX(40px); }
.ob-next-leave-to    { opacity: 0; transform: translateX(-40px); }
.ob-prev-enter-from  { opacity: 0; transform: translateX(-40px); }
.ob-prev-leave-to    { opacity: 0; transform: translateX(40px); }
</style>
