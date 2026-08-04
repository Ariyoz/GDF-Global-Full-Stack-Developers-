<template>
  <Teleport to="body">
    <Transition name="ob-fade">
      <div v-if="visible" class="ob-overlay" :class="`ob-bg-${current}`">

        <!-- Top bar -->
        <div class="ob-topbar">
          <div class="ob-brand">
            <img src="@/assets/icons/icon.png" alt="GFD" class="ob-brand-ico" />
            <span class="ob-brand-name">GFD</span>
          </div>
          <button class="ob-skip" @click="finish">Skip →</button>
        </div>

        <!-- Slide area — takes all remaining space -->
        <div class="ob-body">
          <Transition :name="dir" mode="out-in">

            <!-- ── Slide 0: Developer profile ── -->
            <div v-if="current === 0" key="s0" class="ob-slide">
              <div class="ob-cards">
                <!-- Top float -->
                <div class="mc-float mc-float-tr">
                  <span class="mc-float-ico">🚀</span>
                  <div><p class="mc-ft">Available for hire</p><p class="mc-fs">Responds in &lt; 1hr</p></div>
                  <div class="mc-live-dot" />
                </div>

                <!-- Main card -->
                <div class="mc-main">
                  <div class="mc-row">
                    <!-- Real man avatar using DiceBear -->
                    <img
                      src="https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&backgroundColor=b6e3f4"
                      alt="Alex Morgan"
                      class="mc-avatar-img"
                    />
                    <div class="mc-info">
                      <p class="mc-name">Alex Morgan</p>
                      <p class="mc-role">Full-Stack Developer</p>
                    </div>
                    <div class="mc-badge">⭐ 4.9</div>
                  </div>
                  <div class="mc-chips">
                    <span class="chip chip-p">React</span>
                    <span class="chip chip-p">Node.js</span>
                    <span class="chip chip-p">Python</span>
                    <span class="chip chip-p">+4</span>
                  </div>
                  <div class="mc-stats">
                    <div class="mc-stat"><b>42</b><span>Projects</span></div>
                    <div class="mc-divv" />
                    <div class="mc-stat"><b>₦2.4M</b><span>Earned</span></div>
                    <div class="mc-divv" />
                    <div class="mc-stat"><b>100%</b><span>Success</span></div>
                  </div>
                </div>

                <!-- Bottom float -->
                <div class="mc-float mc-float-bl">
                  <span class="mc-float-ico">💼</span>
                  <div><p class="mc-ft">New job offer</p><p class="mc-fs">₦450,000 · Remote</p></div>
                  <span class="mc-new">NEW</span>
                </div>
              </div>

              <div class="ob-text">
                <p class="ob-tag">01 — Discover</p>
                <h2 class="ob-title">Find top developers<br>instantly.</h2>
                <p class="ob-desc">Browse verified developer profiles, check skills and ratings, then hire in minutes.</p>
              </div>
            </div>

            <!-- ── Slide 1: Job board ── -->
            <div v-else-if="current === 1" key="s1" class="ob-slide">
              <div class="ob-cards">
                <!-- Top float -->
                <div class="mc-float mc-float-tr">
                  <span class="mc-float-ico">✅</span>
                  <div><p class="mc-ft">98% Match</p><p class="mc-fs">Perfect fit for you</p></div>
                </div>

                <!-- Main card -->
                <div class="mc-main">
                  <div class="mc-row">
                    <!-- GFD logo for company -->
                    <img src="@/assets/icons/icon.png" alt="GFD" class="mc-co-logo" />
                    <div class="mc-info">
                      <p class="mc-name">Senior React Developer</p>
                      <p class="mc-role">GlobalFD · Remote</p>
                    </div>
                  </div>
                  <div class="mc-chips" style="margin-top:.625rem">
                    <span class="chip chip-b">Full-time</span>
                    <span class="chip chip-b">React</span>
                    <span class="chip chip-b">TypeScript</span>
                  </div>
                  <p class="mc-salary">₦600,000 <span class="mc-per">/ month</span></p>
                  <div class="mc-applicants">
                    <div class="mc-avstack">
                      <span class="mc-av av-p">A</span>
                      <span class="mc-av av-b">B</span>
                      <span class="mc-av av-g">C</span>
                    </div>
                    <span class="mc-apcount">24 applicants</span>
                  </div>
                  <button class="mc-apply">Apply Now</button>
                </div>

                <!-- Bottom float -->
                <div class="mc-float mc-float-bl">
                  <span class="mc-float-ico">💬</span>
                  <div><p class="mc-ft">Interview scheduled</p><p class="mc-fs">Tomorrow, 10:00 AM</p></div>
                </div>
              </div>

              <div class="ob-text">
                <p class="ob-tag">02 — Work</p>
                <h2 class="ob-title">Post jobs.<br>Get hired fast.</h2>
                <p class="ob-desc">Clients post real projects, developers apply and chat directly. No agencies, no delays.</p>
              </div>
            </div>

            <!-- ── Slide 2: Wallet ── -->
            <div v-else key="s2" class="ob-slide">
              <div class="ob-cards">
                <!-- Top float -->
                <div class="mc-float mc-float-tr">
                  <span class="mc-float-ico">🔒</span>
                  <div><p class="mc-ft">Secured payments</p><p class="mc-fs">Bank-grade encryption</p></div>
                </div>

                <!-- Main card (wallet) -->
                <div class="mc-main mc-wallet">
                  <div class="mc-wrow">
                    <span class="mc-wlbl">Total Balance</span>
                    <span>💳</span>
                  </div>
                  <p class="mc-wbal">₦124,500.00</p>
                  <div class="mc-wbtns">
                    <button class="mc-wb mc-wb-g">+ Fund</button>
                    <button class="mc-wb mc-wb-b">↑ Send</button>
                    <button class="mc-wb mc-wb-p">↓ Withdraw</button>
                  </div>
                  <div class="mc-txs">
                    <div class="mc-tx">
                      <div class="mc-txico" style="background:rgba(22,163,74,.18)">↓</div>
                      <div class="mc-txinfo"><p>Project Payment</p><p class="mc-txd">Today</p></div>
                      <span class="mc-cr">+₦45,000</span>
                    </div>
                    <div class="mc-tx">
                      <div class="mc-txico" style="background:rgba(59,130,246,.18)">↑</div>
                      <div class="mc-txinfo"><p>Sent to James</p><p class="mc-txd">Yesterday</p></div>
                      <span class="mc-dr">-₦5,000</span>
                    </div>
                    <div class="mc-tx">
                      <div class="mc-txico" style="background:rgba(22,163,74,.18)">↓</div>
                      <div class="mc-txinfo"><p>Freelance Job</p><p class="mc-txd">Monday</p></div>
                      <span class="mc-cr">+₦80,000</span>
                    </div>
                  </div>
                </div>

                <!-- Bottom float -->
                <div class="mc-float mc-float-bl">
                  <span class="mc-float-ico">⚡</span>
                  <div><p class="mc-ft">Instant withdrawal</p><p class="mc-fs">To any Nigerian bank</p></div>
                </div>
              </div>

              <div class="ob-text">
                <p class="ob-tag">03 — Get Paid</p>
                <h2 class="ob-title">Your money,<br>your control.</h2>
                <p class="ob-desc">Built-in wallet, instant transfers, and direct bank withdrawals. Secure every time.</p>
              </div>
            </div>

          </Transition>
        </div>

        <!-- Bottom: dots + button -->
        <div class="ob-footer">
          <div class="ob-dots">
            <button v-for="(_, i) in 3" :key="i"
              class="ob-dot" :class="{ active: i === current }"
              @click="goTo(i)" />
          </div>
          <button v-if="current < 2" class="ob-btn-n" @click="next">
            Next <span class="material-symbols-outlined" style="font-size:16px;line-height:1">arrow_forward</span>
          </button>
          <button v-else class="ob-btn-s" @click="finish">
            <img src="@/assets/icons/icon.png" alt=""
              style="width:18px;height:18px;border-radius:5px;object-fit:contain;flex-shrink:0" />
            Get Started
          </button>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const PERM_KEY    = 'gfd_onboarded_v2'
const SESSION_KEY = 'gfd_ob_session'
const alreadySeen = sessionStorage.getItem(SESSION_KEY)
const permDone    = localStorage.getItem(PERM_KEY)
const visible     = ref(!alreadySeen || !permDone)
if (!alreadySeen) sessionStorage.setItem(SESSION_KEY, '1')

const current = ref(0)
const dir     = ref('ob-next')

function next()  { dir.value = 'ob-next';  current.value++ }
function goTo(i) { dir.value = i > current.value ? 'ob-next' : 'ob-prev'; current.value = i }
function finish() { localStorage.setItem(PERM_KEY, '1'); visible.value = false }
</script>

<style scoped>
/* ── Shell ── */
.ob-overlay {
  position: fixed; inset: 0; z-index: 10000;
  display: flex; flex-direction: column;
  overflow: hidden;
}
.ob-bg-0 { background: #0f0a1e; }
.ob-bg-1 { background: #040d1f; }
.ob-bg-2 { background: #050e08; }

.ob-bg-0::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 75% 55% at 100% 0%,  rgba(168,85,247,.45) 0%, transparent 55%),
    radial-gradient(ellipse 55% 45% at 0%   100%, rgba(99,14,212,.3)  0%, transparent 55%);
}
.ob-bg-1::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 75% 55% at 0%   0%,   rgba(59,130,246,.4)  0%, transparent 55%),
    radial-gradient(ellipse 55% 45% at 100% 100%, rgba(168,85,247,.25) 0%, transparent 55%);
}
.ob-bg-2::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 75% 55% at 100% 0%,  rgba(22,163,74,.4)   0%, transparent 55%),
    radial-gradient(ellipse 55% 45% at 0%   100%, rgba(99,14,212,.25) 0%, transparent 55%);
}
.ob-overlay::after {
  content:''; position:absolute; inset:0; pointer-events:none;
  background-image: radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 90% 90% at 50% 40%, black 10%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 40%, black 10%, transparent 100%);
}

/* Top bar */
.ob-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: calc(1rem + env(safe-area-inset-top,0px)) 1.25rem .5rem;
  position: relative; z-index: 3; flex-shrink: 0;
}
.ob-brand { display: flex; align-items: center; gap: .5rem; }
.ob-brand-ico { width: 30px; height: 30px; border-radius: 9px; object-fit: contain; }
.ob-brand-name {
  font-family: var(--font-headline); font-size: 1.05rem; font-weight: 800;
  color: #fff; letter-spacing: -.01em;
}
.ob-skip {
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18);
  border-radius: 999px; padding: .3rem .875rem;
  font-family: var(--font-headline); font-size: .8rem; font-weight: 600;
  color: rgba(255,255,255,.7); cursor: pointer; transition: background .15s;
}
.ob-skip:hover { background: rgba(255,255,255,.2); color: #fff; }

/* Body — flex 1 so it fills between topbar and footer */
.ob-body {
  flex: 1; min-height: 0;
  display: flex; flex-direction: column;
  position: relative; z-index: 1;
  overflow: hidden;
}

/* Each slide = cards + text stacked */
.ob-slide {
  flex: 1; display: flex; flex-direction: column;
  padding: .5rem 1.25rem 0;
  gap: .875rem;
}

/* Cards container — relative, fixed height so floats don't overflow into text */
.ob-cards {
  position: relative;
  height: 220px;
  flex-shrink: 0;
}

/* Main card */
.mc-main {
  position: absolute; left: 0; right: 0; top: 28px;
  background: rgba(18,10,36,.9);
  border: 1px solid rgba(168,85,247,.2);
  border-radius: 18px; padding: .875rem;
  box-shadow: 0 16px 50px rgba(0,0,0,.5);
  z-index: 1;
}
.mc-wallet {
  border-color: rgba(22,163,74,.2);
  background: rgba(3,14,8,.9);
}

/* Float cards */
.mc-float {
  position: absolute; z-index: 2;
  display: flex; align-items: center; gap: .5rem;
  padding: .5rem .75rem;
  background: rgba(255,255,255,.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,.3);
  min-width: 0;
}
.mc-float-tr { top: 0; right: 0; }
.mc-float-bl { bottom: 0; left: 0; }

.mc-float-ico { font-size: 1.1rem; flex-shrink: 0; }
.mc-ft { font-family: var(--font-headline); font-size: .78rem; font-weight: 700; color: #fff; white-space: nowrap; }
.mc-fs { font-size: .67rem; color: rgba(255,255,255,.55); white-space: nowrap; }
.mc-live-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 6px #22c55e; margin-left: auto; flex-shrink: 0; }
.mc-new { background: #7c3aed; color: #fff; font-size: .6rem; font-weight: 800; padding: .15rem .45rem; border-radius: 999px; margin-left: auto; flex-shrink: 0; white-space: nowrap; }

/* Profile slide internals */
.mc-row { display: flex; align-items: center; gap: .625rem; margin-bottom: .625rem; }
.mc-avatar-img {
  width: 42px; height: 42px; border-radius: 12px; object-fit: cover;
  background: #b6e3f4; flex-shrink: 0;
}
.mc-co-logo {
  width: 38px; height: 38px; border-radius: 10px; object-fit: contain;
  background: rgba(168,85,247,.15); padding: 4px; flex-shrink: 0;
}
.mc-info { flex: 1; min-width: 0; }
.mc-name { font-family: var(--font-headline); font-size: .875rem; font-weight: 700; color: #fff; }
.mc-role { font-size: .7rem; color: rgba(255,255,255,.5); margin-top: .1rem; }
.mc-badge {
  background: rgba(245,158,11,.15); color: #fbbf24;
  border-radius: 999px; padding: .2rem .6rem;
  font-size: .72rem; font-weight: 700; flex-shrink: 0;
}

/* Chips */
.mc-chips { display: flex; flex-wrap: wrap; gap: .3rem; margin-bottom: .625rem; }
.chip { padding: .18rem .55rem; border-radius: 999px; font-size: .68rem; font-weight: 600; }
.chip-p { background: rgba(168,85,247,.18); color: #c4b5fd; }
.chip-b { background: rgba(59,130,246,.18); color: #93c5fd; }

/* Stats */
.mc-stats { display: flex; align-items: center; justify-content: space-around; padding-top: .5rem; border-top: 1px solid rgba(255,255,255,.07); }
.mc-stat { display: flex; flex-direction: column; align-items: center; gap: .1rem; }
.mc-stat b { font-family: var(--font-headline); font-size: .875rem; font-weight: 800; color: #fff; }
.mc-stat span { font-size: .62rem; color: rgba(255,255,255,.4); }
.mc-divv { width: 1px; height: 24px; background: rgba(255,255,255,.1); }

/* Job slide */
.mc-salary { font-family: var(--font-headline); font-size: 1.05rem; font-weight: 800; color: #fff; margin: .5rem 0; }
.mc-per { font-size: .72rem; font-weight: 400; color: rgba(255,255,255,.4); }
.mc-applicants { display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; }
.mc-avstack { display: flex; }
.mc-av {
  width: 22px; height: 22px; border-radius: 999px; border: 1.5px solid rgba(18,10,36,.8);
  display: flex; align-items: center; justify-content: center;
  font-size: .6rem; font-weight: 800; margin-left: -6px;
}
.mc-av:first-child { margin-left: 0; }
.av-p { background: #7c3aed; color: #fff; }
.av-b { background: #2563eb; color: #fff; }
.av-g { background: #16a34a; color: #fff; }
.mc-apcount { font-size: .7rem; color: rgba(255,255,255,.5); }
.mc-apply {
  width: 100%; padding: .5rem; border-radius: 10px;
  background: #7c3aed; color: #fff; border: none;
  font-family: var(--font-headline); font-size: .82rem; font-weight: 700; cursor: pointer;
}

/* Wallet slide */
.mc-wrow { display: flex; justify-content: space-between; align-items: center; margin-bottom: .25rem; }
.mc-wlbl { font-size: .7rem; color: rgba(255,255,255,.5); }
.mc-wbal { font-family: var(--font-headline); font-size: 1.4rem; font-weight: 900; color: #fff; letter-spacing: -.02em; margin-bottom: .625rem; }
.mc-wbtns { display: flex; gap: .4rem; margin-bottom: .625rem; }
.mc-wb { flex: 1; padding: .4rem; border-radius: 9px; border: none; font-family: var(--font-headline); font-size: .7rem; font-weight: 700; cursor: pointer; }
.mc-wb-g { background: rgba(22,163,74,.2); color: #4ade80; }
.mc-wb-b { background: rgba(59,130,246,.2); color: #60a5fa; }
.mc-wb-p { background: rgba(168,85,247,.2); color: #c4b5fd; }
.mc-txs { display: flex; flex-direction: column; gap: .3rem; }
.mc-tx { display: flex; align-items: center; gap: .4rem; }
.mc-txico { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: .78rem; flex-shrink: 0; color: #fff; }
.mc-txinfo { flex: 1; min-width: 0; }
.mc-txinfo p:first-child { font-size: .75rem; font-weight: 600; color: #fff; }
.mc-txd { font-size: .62rem; color: rgba(255,255,255,.4); }
.mc-cr { font-family: var(--font-headline); font-size: .78rem; font-weight: 700; color: #4ade80; }
.mc-dr { font-family: var(--font-headline); font-size: .78rem; font-weight: 700; color: #f87171; }

/* Text section */
.ob-text { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: .375rem; justify-content: center; }
.ob-tag { font-family: var(--font-headline); font-size: .68rem; font-weight: 700; color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: .1em; }
.ob-title { font-family: var(--font-headline); font-size: clamp(1.5rem,5vw,1.9rem); font-weight: 900; color: #fff; letter-spacing: -.02em; line-height: 1.1; }
.ob-desc { font-size: .85rem; color: rgba(255,255,255,.55); line-height: 1.55; }

/* Footer */
.ob-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: .75rem 1.25rem calc(.875rem + env(safe-area-inset-bottom,0px));
  position: relative; z-index: 3; flex-shrink: 0; gap: 1rem;
  border-top: 1px solid rgba(255,255,255,.06);
}
.ob-dots { display: flex; gap: .375rem; align-items: center; }
.ob-dot { width: 7px; height: 7px; border-radius: 999px; background: rgba(255,255,255,.22); border: none; cursor: pointer; transition: all .25s; padding: 0; }
.ob-dot.active { width: 22px; background: #fff; }

.ob-btn-n, .ob-btn-s {
  height: 44px; border-radius: 13px; border: none;
  font-family: var(--font-headline); font-size: .9rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  gap: .375rem; padding: 0 1.375rem; white-space: nowrap;
  transition: opacity .15s, transform .1s;
}
.ob-btn-n { background: rgba(255,255,255,.1); border: 1.5px solid rgba(255,255,255,.2); color: #fff; }
.ob-btn-n:hover { background: rgba(255,255,255,.18); }
.ob-btn-s { background: #fff; color: #0d0520; box-shadow: 0 4px 16px rgba(255,255,255,.12); }
.ob-btn-s:hover { opacity: .92; transform: translateY(-1px); }

/* Transitions */
.ob-next-enter-active,.ob-next-leave-active,
.ob-prev-enter-active,.ob-prev-leave-active { transition: opacity .28s ease, transform .28s ease; }
.ob-next-enter-from  { opacity:0; transform:translateX(45px);  }
.ob-next-leave-to    { opacity:0; transform:translateX(-45px); }
.ob-prev-enter-from  { opacity:0; transform:translateX(-45px); }
.ob-prev-leave-to    { opacity:0; transform:translateX(45px);  }
.ob-fade-enter-active,.ob-fade-leave-active { transition: opacity .4s ease; }
.ob-fade-enter-from,.ob-fade-leave-to { opacity:0; }
</style>
