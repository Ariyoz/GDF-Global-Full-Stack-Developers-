<template>
  <Teleport to="body">
    <Transition name="ob-fade">
      <div v-if="visible" class="ob-shell" :class="[`ob-bg-${current}`, isDark ? 'ob-dark' : 'ob-light']">

        <!-- Top bar -->
        <header class="ob-bar">
          <div class="ob-brand">
            <img src="@/assets/icons/icon.png" alt="GFD" class="ob-logo" />
            <span class="ob-name">GFD</span>
          </div>
          <button class="ob-skip" @click="finish">Skip →</button>
        </header>

        <!-- Main content — centred container -->
        <div class="ob-container">
          <Transition :name="dir" mode="out-in">

            <!-- ───────── SLIDE 0 ───────── -->
            <div v-if="current === 0" key="s0" class="ob-inner">

              <!-- Illustration column -->
              <div class="ob-art">
                <div class="art-wrap">
                  <!-- float top-right -->
                  <div class="fl fl-tr">
                    <span class="fl-ico">🚀</span>
                    <div><p class="fl-t">Available for hire</p><p class="fl-s">Responds in &lt;1hr</p></div>
                    <div class="live-dot" />
                  </div>
                  <!-- main card -->
                  <div class="card card-main">
                    <div class="card-row">
                      <img
                        src="https://api.dicebear.com/7.x/adventurer/svg?seed=AlexMorgan&backgroundColor=b6e3f4"
                        class="av-img" alt="Alex Morgan"
                        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
                      />
                      <div class="av-fallback">A</div>
                      <div class="card-meta">
                        <p class="c-name">Alex Morgan</p>
                        <p class="c-sub">Full-Stack Developer</p>
                      </div>
                      <span class="c-badge">⭐ 4.9</span>
                    </div>
                    <div class="chips">
                      <span class="chip cp">React</span>
                      <span class="chip cp">Node.js</span>
                      <span class="chip cp">Python</span>
                      <span class="chip cp">+4</span>
                    </div>
                    <div class="stats-row">
                      <div class="stat"><b>42</b><span>Projects</span></div>
                      <div class="stat-div" />
                      <div class="stat"><b>₦2.4M</b><span>Earned</span></div>
                      <div class="stat-div" />
                      <div class="stat"><b>100%</b><span>Success</span></div>
                    </div>
                  </div>
                  <!-- float bottom-left -->
                  <div class="fl fl-bl">
                    <span class="fl-ico">💼</span>
                    <div><p class="fl-t">New job offer</p><p class="fl-s">₦450,000 · Remote</p></div>
                    <span class="new-badge">NEW</span>
                  </div>
                </div>
              </div>

              <!-- Text column -->
              <div class="ob-copy">
                <p class="ob-tag">01 — Discover</p>
                <h2 class="ob-h">Find top developers<br>instantly.</h2>
                <p class="ob-p">Browse verified developer profiles, check skills and ratings, then hire in minutes.</p>
              </div>

            </div>

            <!-- ───────── SLIDE 1 ───────── -->
            <div v-else-if="current === 1" key="s1" class="ob-inner">

              <div class="ob-art">
                <div class="art-wrap">
                  <div class="fl fl-tr">
                    <span class="fl-ico">✅</span>
                    <div><p class="fl-t">98% Match</p><p class="fl-s">Perfect fit for you</p></div>
                  </div>
                  <div class="card card-main">
                    <div class="card-row">
                      <img src="@/assets/icons/icon.png" class="co-logo" alt="GFD" />
                      <div class="card-meta">
                        <p class="c-name">Senior React Developer</p>
                        <p class="c-sub">GlobalFD · Remote</p>
                      </div>
                    </div>
                    <div class="chips" style="margin-top:.5rem">
                      <span class="chip cb">Full-time</span>
                      <span class="chip cb">React</span>
                      <span class="chip cb">TypeScript</span>
                    </div>
                    <p class="salary">₦600,000 <span class="salary-sub">/ month</span></p>
                    <div class="app-row">
                      <div class="av-stack">
                        <span class="av-s av-p">A</span>
                        <span class="av-s av-b">B</span>
                        <span class="av-s av-g">C</span>
                      </div>
                      <span class="app-count">24 applicants</span>
                    </div>
                    <button class="apply-btn">Apply Now</button>
                  </div>
                  <div class="fl fl-bl">
                    <span class="fl-ico">💬</span>
                    <div><p class="fl-t">Interview scheduled</p><p class="fl-s">Tomorrow, 10:00 AM</p></div>
                  </div>
                </div>
              </div>

              <div class="ob-copy">
                <p class="ob-tag">02 — Work</p>
                <h2 class="ob-h">Post jobs.<br>Get hired fast.</h2>
                <p class="ob-p">Clients post real projects, developers apply and chat directly. No agencies, no delays.</p>
              </div>

            </div>

            <!-- ───────── SLIDE 2 ───────── -->
            <div v-else key="s2" class="ob-inner">

              <div class="ob-art">
                <div class="art-wrap">
                  <div class="fl fl-tr">
                    <span class="fl-ico">🔒</span>
                    <div><p class="fl-t">Secured payments</p><p class="fl-s">Bank-grade encryption</p></div>
                  </div>
                  <div class="card card-main card-wallet">
                    <div class="w-header">
                      <span class="w-lbl">Total Balance</span>
                      <span>💳</span>
                    </div>
                    <p class="w-bal">₦124,500.00</p>
                    <div class="w-btns">
                      <button class="wb wb-g">+ Fund</button>
                      <button class="wb wb-b">↑ Send</button>
                      <button class="wb wb-p">↓ Withdraw</button>
                    </div>
                    <div class="txs">
                      <div class="tx">
                        <div class="tx-ico" style="background:rgba(22,163,74,.18)">↓</div>
                        <div class="tx-info"><p>Project Payment</p><p class="tx-d">Today</p></div>
                        <span class="cr">+₦45,000</span>
                      </div>
                      <div class="tx">
                        <div class="tx-ico" style="background:rgba(59,130,246,.18)">↑</div>
                        <div class="tx-info"><p>Sent to James</p><p class="tx-d">Yesterday</p></div>
                        <span class="dr">-₦5,000</span>
                      </div>
                      <div class="tx">
                        <div class="tx-ico" style="background:rgba(22,163,74,.18)">↓</div>
                        <div class="tx-info"><p>Freelance Job</p><p class="tx-d">Monday</p></div>
                        <span class="cr">+₦80,000</span>
                      </div>
                    </div>
                  </div>
                  <div class="fl fl-bl">
                    <span class="fl-ico">⚡</span>
                    <div><p class="fl-t">Instant withdrawal</p><p class="fl-s">Any Nigerian bank</p></div>
                  </div>
                </div>
              </div>

              <div class="ob-copy">
                <p class="ob-tag">03 — Get Paid</p>
                <h2 class="ob-h">Your money,<br>your control.</h2>
                <p class="ob-p">Built-in wallet, instant transfers, and direct bank withdrawals. Secure every time.</p>
              </div>

            </div>

          </Transition>
        </div>

        <!-- Footer -->
        <footer class="ob-foot">
          <div class="ob-dots">
            <button v-for="(_, i) in 3" :key="i"
              class="dot" :class="{ active: i === current }"
              @click="goTo(i)" />
          </div>
          <button v-if="current < 2" class="btn-n" @click="next">
            Next
            <span class="material-symbols-outlined" style="font-size:16px;line-height:1">arrow_forward</span>
          </button>
          <button v-else class="btn-s" @click="finish">
            <img src="@/assets/icons/icon.png" alt=""
              style="width:18px;height:18px;border-radius:5px;object-fit:contain;flex-shrink:0" />
            Get Started
          </button>
        </footer>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const PERM_KEY    = 'gfd_onboarded_v2'
const SESSION_KEY = 'gfd_ob_session'
const alreadySeen = sessionStorage.getItem(SESSION_KEY)
const permDone    = localStorage.getItem(PERM_KEY)
const visible     = ref(!alreadySeen || !permDone)
if (!alreadySeen) sessionStorage.setItem(SESSION_KEY, '1')

const current = ref(0)
const dir     = ref('ob-next')

// ── Theme: follow app setting or OS preference ──
const stored = localStorage.getItem('gfd_theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
const isDark = ref(stored ? stored === 'dark' : prefersDark.matches)

// Listen for OS theme changes in real time (no stored pref)
function onOsChange(e) {
  if (!localStorage.getItem('gfd_theme')) isDark.value = e.matches
}
onMounted(()  => prefersDark.addEventListener('change', onOsChange))
onUnmounted(() => prefersDark.removeEventListener('change', onOsChange))

function next()  { dir.value = 'ob-next';  current.value++ }
function goTo(i) { dir.value = i > current.value ? 'ob-next' : 'ob-prev'; current.value = i }
function finish() { localStorage.setItem(PERM_KEY, '1'); visible.value = false }
</script>

<style scoped>
/* ── Shell ── */
.ob-shell {
  position: fixed; inset: 0; z-index: 10000;
  display: flex; flex-direction: column;
  overflow: hidden;
}
/* ── Dark backgrounds ── */
.ob-dark.ob-bg-0 { background: #0f0a1e; }
.ob-dark.ob-bg-1 { background: #040d1f; }
.ob-dark.ob-bg-2 { background: #050e08; }

.ob-dark.ob-bg-0::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 70% 60% at 100% 0%,   rgba(168,85,247,.45) 0%, transparent 55%),
    radial-gradient(ellipse 55% 45% at 0%   100%,  rgba(99,14,212,.3)  0%, transparent 55%);
}
.ob-dark.ob-bg-1::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 70% 60% at 0%   0%,    rgba(59,130,246,.4)  0%, transparent 55%),
    radial-gradient(ellipse 55% 45% at 100% 100%,  rgba(168,85,247,.25) 0%, transparent 55%);
}
.ob-dark.ob-bg-2::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 70% 60% at 100% 0%,   rgba(22,163,74,.4)   0%, transparent 55%),
    radial-gradient(ellipse 55% 45% at 0%   100%,  rgba(99,14,212,.25) 0%, transparent 55%);
}

/* ── Light backgrounds ── */
.ob-light.ob-bg-0 { background: #f5f0ff; }
.ob-light.ob-bg-1 { background: #f0f5ff; }
.ob-light.ob-bg-2 { background: #f0fff5; }

.ob-light.ob-bg-0::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 70% 60% at 100% 0%,   rgba(168,85,247,.18) 0%, transparent 55%),
    radial-gradient(ellipse 55% 45% at 0%   100%,  rgba(99,14,212,.1)  0%, transparent 55%);
}
.ob-light.ob-bg-1::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 70% 60% at 0%   0%,    rgba(59,130,246,.15) 0%, transparent 55%),
    radial-gradient(ellipse 55% 45% at 100% 100%,  rgba(168,85,247,.1)  0%, transparent 55%);
}
.ob-light.ob-bg-2::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 70% 60% at 100% 0%,   rgba(22,163,74,.18) 0%, transparent 55%),
    radial-gradient(ellipse 55% 45% at 0%   100%,  rgba(99,14,212,.1)  0%, transparent 55%);
}

/* dot grid — lighter opacity in light mode */
.ob-shell::after {
  content:''; position:absolute; inset:0; pointer-events:none;
  background-image: radial-gradient(circle, rgba(0,0,0,.06) 1px, transparent 1px);
  background-size: 26px 26px;
  mask-image: radial-gradient(ellipse 90% 90% at 50% 40%, black 0%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 40%, black 0%, transparent 100%);
}
.ob-dark.ob-shell::after {
  background-image: radial-gradient(circle, rgba(255,255,255,.045) 1px, transparent 1px);
}

/* ── Top bar ── */
.ob-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: calc(.875rem + env(safe-area-inset-top,0px)) 1.25rem .5rem;
  position: relative; z-index: 3; flex-shrink: 0;
}
.ob-brand { display: flex; align-items: center; gap: .5rem; }
.ob-logo  { width: 30px; height: 30px; border-radius: 9px; object-fit: contain; display: block; }
.ob-name  {
  font-family: var(--font-headline); font-size: 1.05rem; font-weight: 800;
  color: #fff; letter-spacing: -.01em;
}
.ob-skip {
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
  border-radius: 999px; padding: .3rem .875rem;
  font-family: var(--font-headline); font-size: .8rem; font-weight: 600;
  color: rgba(255,255,255,.7); cursor: pointer; transition: background .15s;
}
.ob-skip:hover { background: rgba(255,255,255,.2); color: #fff; }

/* ── Scrollable container ── */
.ob-container {
  flex: 1; overflow: hidden; position: relative; z-index: 1;
}

/* ── Inner: mobile = column, desktop = row ── */
.ob-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: .5rem 1.25rem 0;
  gap: 1rem;
  overflow: hidden;
}
@media (min-width: 768px) {
  .ob-inner {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 3rem;
    gap: 3rem;
    max-width: 960px;
    margin: 0 auto;
    width: 100%;
  }
}

/* ── Art column ── */
.ob-art {
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
@media (min-width: 768px) {
  .ob-art { flex: 0 0 380px; }
}

/* Art wrap — positions float cards relative to main card */
.art-wrap {
  position: relative;
  width: 100%;
  max-width: 340px;
  /* height is driven by main card + float offsets */
  padding: 28px 0 36px; /* room for float cards */
}
@media (min-width: 768px) {
  .art-wrap { max-width: 380px; }
}

/* ── Main card ── */
.card {
  border-radius: 18px;
  border: 1px solid rgba(168,85,247,.2);
  background: rgba(18,10,36,.92);
  padding: .875rem 1rem;
  box-shadow: 0 16px 48px rgba(0,0,0,.5);
}
.card-wallet {
  border-color: rgba(22,163,74,.2);
  background: rgba(3,12,6,.92);
}
.card-main {
  position: relative; z-index: 1;
}

/* ── Float pills ── */
.fl {
  position: absolute; z-index: 2;
  display: flex; align-items: center; gap: .5rem;
  padding: .45rem .75rem;
  background: rgba(30,20,55,.92);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  max-width: 220px;
}
.fl-tr { top: 0; right: -4px; }
.fl-bl { bottom: 0; left: -4px; }

.fl-ico { font-size: 1rem; flex-shrink: 0; }
.fl-t   { font-family: var(--font-headline); font-size: .78rem; font-weight: 700; color: #fff; white-space: nowrap; }
.fl-s   { font-size: .67rem; color: rgba(255,255,255,.55); }
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 6px #22c55e; margin-left: auto; flex-shrink: 0; }
.new-badge { background: #7c3aed; color: #fff; font-size: .6rem; font-weight: 800; padding: .15rem .45rem; border-radius: 999px; margin-left: auto; flex-shrink: 0; }

/* ── Card internals ── */
.card-row { display: flex; align-items: center; gap: .625rem; margin-bottom: .625rem; }

.av-img { width: 40px; height: 40px; border-radius: 11px; object-fit: cover; background: #b6e3f4; flex-shrink: 0; }
.av-fallback {
  display: none; width: 40px; height: 40px; border-radius: 11px;
  background: rgba(168,85,247,.2); color: #a855f7;
  align-items: center; justify-content: center;
  font-family: var(--font-headline); font-weight: 800; font-size: 1rem; flex-shrink: 0;
}
.co-logo { width: 36px; height: 36px; border-radius: 10px; object-fit: contain; background: rgba(168,85,247,.12); padding: 4px; flex-shrink: 0; }

.card-meta { flex: 1; min-width: 0; }
.c-name { font-family: var(--font-headline); font-size: .875rem; font-weight: 700; color: #fff; }
.c-sub  { font-size: .7rem; color: rgba(255,255,255,.5); margin-top: .1rem; }
.c-badge { background: rgba(245,158,11,.15); color: #fbbf24; border-radius: 999px; padding: .18rem .55rem; font-size: .7rem; font-weight: 700; flex-shrink: 0; }

.chips { display: flex; flex-wrap: wrap; gap: .3rem; margin-bottom: .625rem; }
.chip { padding: .18rem .55rem; border-radius: 999px; font-size: .68rem; font-weight: 600; }
.cp { background: rgba(168,85,247,.18); color: #c4b5fd; }
.cb { background: rgba(59,130,246,.18); color: #93c5fd; }

.stats-row { display: flex; align-items: center; justify-content: space-around; padding-top: .5rem; border-top: 1px solid rgba(255,255,255,.07); }
.stat { display: flex; flex-direction: column; align-items: center; gap: .1rem; }
.stat b { font-family: var(--font-headline); font-size: .875rem; font-weight: 800; color: #fff; }
.stat span { font-size: .62rem; color: rgba(255,255,255,.4); }
.stat-div { width: 1px; height: 22px; background: rgba(255,255,255,.1); }

.salary { font-family: var(--font-headline); font-size: 1.05rem; font-weight: 800; color: #fff; margin: .5rem 0; }
.salary-sub { font-size: .72rem; font-weight: 400; color: rgba(255,255,255,.4); }
.app-row { display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; }
.av-stack { display: flex; }
.av-s {
  width: 22px; height: 22px; border-radius: 999px;
  border: 1.5px solid rgba(18,10,36,.8);
  display: flex; align-items: center; justify-content: center;
  font-size: .6rem; font-weight: 800; margin-left: -6px;
}
.av-s:first-child { margin-left: 0; }
.av-p { background: #7c3aed; color: #fff; }
.av-b { background: #2563eb; color: #fff; }
.av-g { background: #16a34a; color: #fff; }
.app-count { font-size: .7rem; color: rgba(255,255,255,.5); }
.apply-btn {
  width: 100%; padding: .5rem; border-radius: 10px;
  background: #7c3aed; color: #fff; border: none;
  font-family: var(--font-headline); font-size: .82rem; font-weight: 700; cursor: pointer;
  transition: opacity .15s;
}
.apply-btn:hover { opacity: .9; }

/* Wallet card internals */
.w-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: .25rem; }
.w-lbl { font-size: .7rem; color: rgba(255,255,255,.5); }
.w-bal { font-family: var(--font-headline); font-size: 1.4rem; font-weight: 900; color: #fff; letter-spacing: -.02em; margin-bottom: .625rem; }
.w-btns { display: flex; gap: .375rem; margin-bottom: .625rem; }
.wb { flex: 1; padding: .375rem; border-radius: 9px; border: none; font-family: var(--font-headline); font-size: .7rem; font-weight: 700; cursor: pointer; }
.wb-g { background: rgba(22,163,74,.2); color: #4ade80; }
.wb-b { background: rgba(59,130,246,.2); color: #60a5fa; }
.wb-p { background: rgba(168,85,247,.2); color: #c4b5fd; }
.txs { display: flex; flex-direction: column; gap: .3rem; }
.tx { display: flex; align-items: center; gap: .4rem; }
.tx-ico { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: .75rem; flex-shrink: 0; color: #fff; }
.tx-info { flex: 1; min-width: 0; }
.tx-info p:first-child { font-size: .75rem; font-weight: 600; color: #fff; }
.tx-d { font-size: .62rem; color: rgba(255,255,255,.4); }
.cr { font-family: var(--font-headline); font-size: .78rem; font-weight: 700; color: #4ade80; }
.dr { font-family: var(--font-headline); font-size: .78rem; font-weight: 700; color: #f87171; }

/* ── Copy column ── */
.ob-copy {
  display: flex; flex-direction: column; gap: .375rem;
  flex: 1;
}
@media (min-width: 768px) {
  .ob-copy { flex: 1; justify-content: center; }
}
.ob-tag { font-family: var(--font-headline); font-size: .68rem; font-weight: 700; color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: .1em; }
.ob-h {
  font-family: var(--font-headline); font-weight: 900; color: #fff;
  letter-spacing: -.025em; line-height: 1.1;
  font-size: clamp(1.6rem, 4.5vw, 2.6rem);
}
.ob-p { font-size: .9rem; color: rgba(255,255,255,.58); line-height: 1.6; max-width: 380px; }

/* ── Footer ── */
.ob-foot {
  display: flex; align-items: center; justify-content: space-between;
  padding: .75rem 1.25rem calc(.875rem + env(safe-area-inset-bottom,0px));
  position: relative; z-index: 3; flex-shrink: 0;
  border-top: 1px solid rgba(255,255,255,.06); gap: 1rem;
}
.ob-dots { display: flex; gap: .375rem; align-items: center; }
.dot { width: 7px; height: 7px; border-radius: 999px; background: rgba(255,255,255,.22); border: none; cursor: pointer; transition: all .25s; padding: 0; }
.dot.active { width: 22px; background: #fff; }

.btn-n, .btn-s {
  height: 44px; border-radius: 13px; border: none;
  font-family: var(--font-headline); font-size: .9rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  gap: .375rem; padding: 0 1.375rem; white-space: nowrap;
  transition: opacity .15s, transform .1s;
}
.btn-n { background: rgba(255,255,255,.1); border: 1.5px solid rgba(255,255,255,.2); color: #fff; }
.btn-n:hover { background: rgba(255,255,255,.18); }
.btn-s { background: #fff; color: #0d0520; box-shadow: 0 4px 16px rgba(255,255,255,.12); }
.btn-s:hover { opacity: .92; transform: translateY(-1px); }

/* ── Light mode overrides ── */
.ob-light .ob-name        { color: #1a0a3c; }
.ob-light .ob-skip        { background: rgba(0,0,0,.07); border-color: rgba(0,0,0,.15); color: rgba(0,0,0,.6); }
.ob-light .ob-skip:hover  { background: rgba(0,0,0,.12); color: #1a0a3c; }
.ob-light .ob-tag         { color: rgba(0,0,0,.4); }
.ob-light .ob-h           { color: #1a0a3c; }
.ob-light .ob-p           { color: rgba(0,0,0,.55); }
.ob-light .ob-foot        { border-top-color: rgba(0,0,0,.08); }
.ob-light .dot            { background: rgba(0,0,0,.2); }
.ob-light .dot.active     { background: #7c3aed; }
.ob-light .btn-n          { background: rgba(0,0,0,.06); border-color: rgba(0,0,0,.18); color: #1a0a3c; }
.ob-light .btn-n:hover    { background: rgba(0,0,0,.1); }
.ob-light .btn-s          { background: #7c3aed; color: #fff; box-shadow: 0 4px 16px rgba(124,58,237,.3); }
.ob-light .btn-s:hover    { opacity: .9; }

/* Light — cards */
.ob-light .card {
  background: rgba(255,255,255,.85);
  border-color: rgba(124,58,237,.15);
  box-shadow: 0 12px 40px rgba(0,0,0,.1);
}
.ob-light .card-wallet {
  background: rgba(255,255,255,.85);
  border-color: rgba(22,163,74,.2);
}
.ob-light .c-name  { color: #1a0a3c; }
.ob-light .c-sub   { color: rgba(0,0,0,.5); }
.ob-light .stat b  { color: #1a0a3c; }
.ob-light .stat span { color: rgba(0,0,0,.4); }
.ob-light .stat-div  { background: rgba(0,0,0,.1); }
.ob-light .salary    { color: #1a0a3c; }
.ob-light .salary-sub { color: rgba(0,0,0,.4); }
.ob-light .app-count { color: rgba(0,0,0,.5); }
.ob-light .apply-btn { background: #7c3aed; }
.ob-light .w-lbl     { color: rgba(0,0,0,.5); }
.ob-light .w-bal     { color: #1a0a3c; }
.ob-light .tx-info p:first-child { color: #1a0a3c; }
.ob-light .tx-d      { color: rgba(0,0,0,.4); }
.ob-light .stats-row { border-top-color: rgba(0,0,0,.08); }

/* Light — float pills */
.ob-light .fl {
  background: rgba(255,255,255,.92);
  border-color: rgba(0,0,0,.1);
  box-shadow: 0 4px 16px rgba(0,0,0,.1);
}
.ob-light .fl-t { color: #1a0a3c; }
.ob-light .fl-s { color: rgba(0,0,0,.5); }
.ob-light .new-badge { background: #7c3aed; }

/* ── Transitions ── */
.ob-next-enter-active,.ob-next-leave-active,
.ob-prev-enter-active,.ob-prev-leave-active { transition: opacity .28s ease, transform .28s ease; }
.ob-next-enter-from  { opacity:0; transform:translateX(40px);  }
.ob-next-leave-to    { opacity:0; transform:translateX(-40px); }
.ob-prev-enter-from  { opacity:0; transform:translateX(-40px); }
.ob-prev-leave-to    { opacity:0; transform:translateX(40px);  }
.ob-fade-enter-active,.ob-fade-leave-active { transition: opacity .4s ease; }
.ob-fade-enter-from,.ob-fade-leave-to { opacity:0; }
</style>
