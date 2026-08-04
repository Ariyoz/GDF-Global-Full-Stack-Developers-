<template>
  <Teleport to="body">
    <Transition name="ob-fade">
      <div v-if="visible" class="ob-overlay" :class="`ob-bg-${current}`">

        <!-- Skip -->
        <div class="ob-topbar">
          <div class="ob-brand">
            <img src="@/assets/icons/icon.png" alt="GFD" class="ob-brand-ico" />
            <span class="ob-brand-name">GFD</span>
          </div>
          <button class="ob-skip" @click="finish">Skip →</button>
        </div>

        <!-- Floating UI mockup -->
        <div class="ob-mockup-area">
          <Transition :name="dir" mode="out-in">

            <!-- Slide 0: Developer profile cards -->
            <div v-if="current === 0" key="m0" class="ob-mockup">
              <!-- Profile card 1 -->
              <div class="mc-card mc-card-main">
                <div class="mc-card-header">
                  <div class="mc-avatar mc-avatar-purple">A</div>
                  <div>
                    <p class="mc-name">Alex Morgan</p>
                    <p class="mc-role">Full-Stack Developer</p>
                  </div>
                  <div class="mc-badge">⭐ 4.9</div>
                </div>
                <div class="mc-skills">
                  <span class="mc-skill">React</span>
                  <span class="mc-skill">Node.js</span>
                  <span class="mc-skill">Python</span>
                  <span class="mc-skill">+4</span>
                </div>
                <div class="mc-stat-row">
                  <div class="mc-stat"><span class="mc-stat-n">42</span><span class="mc-stat-l">Projects</span></div>
                  <div class="mc-stat"><span class="mc-stat-n">₦2.4M</span><span class="mc-stat-l">Earned</span></div>
                  <div class="mc-stat"><span class="mc-stat-n">100%</span><span class="mc-stat-l">Success</span></div>
                </div>
              </div>
              <!-- Floating hire button card -->
              <div class="mc-card mc-card-float mc-card-top">
                <span class="mc-float-ico">🚀</span>
                <div>
                  <p class="mc-float-title">Available for hire</p>
                  <p class="mc-float-sub">Responds in &lt; 1hr</p>
                </div>
                <div class="mc-float-dot mc-dot-green" />
              </div>
              <!-- Notification card -->
              <div class="mc-card mc-card-float mc-card-bottom">
                <span class="mc-float-ico">💼</span>
                <div>
                  <p class="mc-float-title">New job offer</p>
                  <p class="mc-float-sub">₦450,000 · Remote</p>
                </div>
                <span class="mc-new-badge">NEW</span>
              </div>
            </div>

            <!-- Slide 1: Project & hiring flow -->
            <div v-else-if="current === 1" key="m1" class="ob-mockup">
              <!-- Job card -->
              <div class="mc-card mc-card-main">
                <div class="mc-job-header">
                  <div class="mc-co-logo">GC</div>
                  <div>
                    <p class="mc-name">Senior React Developer</p>
                    <p class="mc-role">GlobalCorp · Remote</p>
                  </div>
                </div>
                <div class="mc-skills" style="margin-top:.5rem">
                  <span class="mc-skill mc-skill-blue">Full-time</span>
                  <span class="mc-skill mc-skill-blue">React</span>
                  <span class="mc-skill mc-skill-blue">TypeScript</span>
                </div>
                <div class="mc-salary">₦600,000 <span class="mc-salary-period">/ month</span></div>
                <div class="mc-applicants">
                  <div class="mc-avatar-stack">
                    <div class="mc-av-sm mc-av-p">A</div>
                    <div class="mc-av-sm mc-av-b">B</div>
                    <div class="mc-av-sm mc-av-g">C</div>
                  </div>
                  <span class="mc-ap-count">24 applicants</span>
                </div>
                <button class="mc-apply-btn">Apply Now</button>
              </div>
              <!-- Match card -->
              <div class="mc-card mc-card-float mc-card-top">
                <span class="mc-float-ico">✅</span>
                <div>
                  <p class="mc-float-title">98% Match</p>
                  <p class="mc-float-sub">Perfect fit for you</p>
                </div>
              </div>
              <!-- Message card -->
              <div class="mc-card mc-card-float mc-card-bottom">
                <span class="mc-float-ico">💬</span>
                <div>
                  <p class="mc-float-title">Interview scheduled</p>
                  <p class="mc-float-sub">Tomorrow, 10:00 AM</p>
                </div>
              </div>
            </div>

            <!-- Slide 2: Wallet -->
            <div v-else key="m2" class="ob-mockup">
              <!-- Wallet card -->
              <div class="mc-card mc-card-wallet">
                <div class="mc-wallet-header">
                  <span class="mc-wallet-lbl">Total Balance</span>
                  <span class="mc-wallet-ico">💳</span>
                </div>
                <p class="mc-wallet-bal">₦124,500.00</p>
                <div class="mc-wallet-actions">
                  <button class="mc-w-btn mc-w-fund">+ Fund</button>
                  <button class="mc-w-btn mc-w-send">↑ Send</button>
                  <button class="mc-w-btn mc-w-wd">↓ Withdraw</button>
                </div>
                <!-- Tx list -->
                <div class="mc-tx-list">
                  <div class="mc-tx">
                    <div class="mc-tx-ico" style="background:rgba(22,163,74,.15)">↓</div>
                    <div class="mc-tx-info"><p>Project Payment</p><p class="mc-tx-date">Today</p></div>
                    <span class="mc-tx-amt mc-tx-cr">+₦45,000</span>
                  </div>
                  <div class="mc-tx">
                    <div class="mc-tx-ico" style="background:rgba(59,130,246,.15)">↑</div>
                    <div class="mc-tx-info"><p>Sent to James</p><p class="mc-tx-date">Yesterday</p></div>
                    <span class="mc-tx-amt mc-tx-dr">-₦5,000</span>
                  </div>
                  <div class="mc-tx">
                    <div class="mc-tx-ico" style="background:rgba(22,163,74,.15)">↓</div>
                    <div class="mc-tx-info"><p>Freelance Job</p><p class="mc-tx-date">Mon</p></div>
                    <span class="mc-tx-amt mc-tx-cr">+₦80,000</span>
                  </div>
                </div>
              </div>
              <!-- Shield float -->
              <div class="mc-card mc-card-float mc-card-top">
                <span class="mc-float-ico">🔒</span>
                <div>
                  <p class="mc-float-title">Secured payments</p>
                  <p class="mc-float-sub">Bank-grade encryption</p>
                </div>
              </div>
              <!-- Instant float -->
              <div class="mc-card mc-card-float mc-card-bottom">
                <span class="mc-float-ico">⚡</span>
                <div>
                  <p class="mc-float-title">Instant withdrawal</p>
                  <p class="mc-float-sub">To any Nigerian bank</p>
                </div>
              </div>
            </div>

          </Transition>
        </div>

        <!-- Text -->
        <div class="ob-text-area">
          <Transition :name="dir" mode="out-in">
            <div :key="`t${current}`" class="ob-text">
              <p class="ob-tag">{{ slides[current].tag }}</p>
              <h2 class="ob-title">{{ slides[current].title }}</h2>
              <p class="ob-body">{{ slides[current].body }}</p>
            </div>
          </Transition>
        </div>

        <!-- Dots + action -->
        <div class="ob-bottom">
          <div class="ob-dots">
            <button v-for="(_, i) in slides" :key="i"
              class="ob-dot" :class="{ active: i === current }"
              @click="goTo(i)" />
          </div>
          <button v-if="current < slides.length - 1" class="ob-btn-next" @click="next">
            Next <span class="material-symbols-outlined" style="font-size:17px">arrow_forward</span>
          </button>
          <button v-else class="ob-btn-start" @click="finish">
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

const slides = [
  {
    tag:   '01 — Discover',
    title: 'Find top developers\ninstantly.',
    body:  'Browse verified developer profiles, check skills, ratings and past work — then hire in minutes.',
  },
  {
    tag:   '02 — Work',
    title: 'Post jobs.\nGet hired fast.',
    body:  'Clients post real projects, developers apply and chat directly. No agencies, no delays.',
  },
  {
    tag:   '03 — Get Paid',
    title: 'Your money,\nyour control.',
    body:  'Built-in wallet, instant transfers, and direct bank withdrawals. Secure payments every time.',
  },
]

function next()  { dir.value = 'ob-next';  current.value++ }
function goTo(i) { dir.value = i > current.value ? 'ob-next' : 'ob-prev'; current.value = i }
function finish() { localStorage.setItem(PERM_KEY, '1'); visible.value = false }
</script>

<style scoped>
/* ── Shell ── */
.ob-overlay {
  position: fixed; inset: 0; z-index: 10000;
  display: flex; flex-direction: column;
  padding: env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px);
  overflow: hidden;
}

.ob-bg-0 { background: #0f0a1e; }
.ob-bg-1 { background: #040d1f; }
.ob-bg-2 { background: #050e08; }

.ob-bg-0::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 80% 60% at 100% 0%,   rgba(168,85,247,.45) 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 0%   100%,  rgba(99,14,212,.3)  0%, transparent 55%);
}
.ob-bg-1::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 80% 60% at 0%   0%,   rgba(59,130,246,.4)  0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 100% 100%, rgba(168,85,247,.25) 0%, transparent 55%);
}
.ob-bg-2::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 80% 60% at 100% 0%,   rgba(22,163,74,.4)   0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 0%   100%,  rgba(99,14,212,.25) 0%, transparent 55%);
}
.ob-overlay::after {
  content:''; position:absolute; inset:0; pointer-events:none;
  background-image: radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 10%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 10%, transparent 100%);
}

/* Top bar */
.ob-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.5rem; position: relative; z-index: 2;
}
.ob-brand { display: flex; align-items: center; gap: .5rem; }
.ob-brand-ico { width: 28px; height: 28px; border-radius: 8px; object-fit: contain; }
.ob-brand-name {
  font-family: var(--font-headline); font-size: 1rem; font-weight: 800;
  color: #fff; letter-spacing: -.01em;
}
.ob-skip {
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18);
  border-radius: 999px; padding: .3rem .875rem;
  font-family: var(--font-headline); font-size: .8rem; font-weight: 600;
  color: rgba(255,255,255,.7); cursor: pointer;
}
.ob-skip:hover { background: rgba(255,255,255,.2); color: #fff; }

/* ── Mockup area ── */
.ob-mockup-area {
  flex: 1; position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: center;
  padding: 0 1.5rem;
  overflow: visible;
}

.ob-mockup {
  position: relative; width: 100%; max-width: 320px; height: 280px;
}

/* ── Cards ── */
.mc-card {
  background: rgba(255,255,255,.07);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 18px;
  padding: 1rem;
}

.mc-card-main {
  position: absolute; left: 0; right: 0; top: 20px;
  z-index: 2;
  background: rgba(20,12,40,.85);
  border-color: rgba(168,85,247,.2);
  box-shadow: 0 20px 60px rgba(0,0,0,.5);
}

.mc-card-float {
  position: absolute; z-index: 3;
  display: flex; align-items: center; gap: .625rem;
  padding: .625rem .875rem;
  background: rgba(255,255,255,.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-color: rgba(255,255,255,.18);
  box-shadow: 0 8px 32px rgba(0,0,0,.3);
}
.mc-card-top    { top: -12px;  right: -8px; }
.mc-card-bottom { bottom: -16px; left: -8px; }

/* Profile card content */
.mc-card-header { display: flex; align-items: center; gap: .625rem; margin-bottom: .75rem; }
.mc-avatar { width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: var(--font-headline); font-weight: 800; font-size: 1rem; flex-shrink: 0; }
.mc-avatar-purple { background: rgba(168,85,247,.25); color: #a855f7; }
.mc-name  { font-family: var(--font-headline); font-size: .875rem; font-weight: 700; color: #fff; }
.mc-role  { font-size: .72rem; color: rgba(255,255,255,.5); margin-top: .1rem; }
.mc-badge { margin-left: auto; background: rgba(245,158,11,.15); color: #f59e0b; border-radius: 999px; padding: .2rem .6rem; font-size: .72rem; font-weight: 700; flex-shrink: 0; }

.mc-skills { display: flex; flex-wrap: wrap; gap: .375rem; margin-bottom: .75rem; }
.mc-skill {
  padding: .2rem .625rem; border-radius: 999px;
  background: rgba(168,85,247,.15); color: #c4b5fd;
  font-size: .7rem; font-weight: 600;
}
.mc-skill-blue { background: rgba(59,130,246,.15); color: #93c5fd; }

.mc-stat-row { display: flex; justify-content: space-around; padding-top: .625rem; border-top: 1px solid rgba(255,255,255,.07); }
.mc-stat { display: flex; flex-direction: column; align-items: center; gap: .1rem; }
.mc-stat-n { font-family: var(--font-headline); font-size: .875rem; font-weight: 800; color: #fff; }
.mc-stat-l { font-size: .65rem; color: rgba(255,255,255,.45); }

/* Job card content */
.mc-job-header { display: flex; align-items: center; gap: .625rem; }
.mc-co-logo { width: 36px; height: 36px; border-radius: 10px; background: rgba(59,130,246,.2); color: #60a5fa; display: flex; align-items: center; justify-content: center; font-size: .75rem; font-weight: 800; flex-shrink: 0; }
.mc-salary { font-family: var(--font-headline); font-size: 1.1rem; font-weight: 800; color: #fff; margin: .625rem 0; }
.mc-salary-period { font-size: .75rem; font-weight: 400; color: rgba(255,255,255,.4); }
.mc-applicants { display: flex; align-items: center; gap: .5rem; margin-bottom: .625rem; }
.mc-avatar-stack { display: flex; }
.mc-av-sm { width: 22px; height: 22px; border-radius: 999px; border: 1.5px solid rgba(20,12,40,.8); display: flex; align-items: center; justify-content: center; font-size: .6rem; font-weight: 800; margin-left: -6px; }
.mc-av-sm:first-child { margin-left: 0; }
.mc-av-p { background: #7c3aed; color: #fff; }
.mc-av-b { background: #2563eb; color: #fff; }
.mc-av-g { background: #16a34a; color: #fff; }
.mc-ap-count { font-size: .72rem; color: rgba(255,255,255,.5); }
.mc-apply-btn { width: 100%; padding: .5rem; border-radius: 10px; background: #7c3aed; color: #fff; border: none; font-family: var(--font-headline); font-size: .82rem; font-weight: 700; cursor: pointer; }

/* Wallet card */
.mc-card-wallet { background: rgba(5,20,10,.85); border-color: rgba(22,163,74,.2); box-shadow: 0 20px 60px rgba(0,0,0,.5); position: absolute; left: 0; right: 0; top: 20px; z-index: 2; }
.mc-wallet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: .25rem; }
.mc-wallet-lbl { font-size: .72rem; color: rgba(255,255,255,.5); }
.mc-wallet-ico { font-size: 1rem; }
.mc-wallet-bal { font-family: var(--font-headline); font-size: 1.5rem; font-weight: 900; color: #fff; letter-spacing: -.02em; margin-bottom: .75rem; }
.mc-wallet-actions { display: flex; gap: .5rem; margin-bottom: .75rem; }
.mc-w-btn { flex: 1; padding: .4rem; border-radius: 10px; border: none; font-family: var(--font-headline); font-size: .72rem; font-weight: 700; cursor: pointer; }
.mc-w-fund { background: rgba(22,163,74,.2); color: #4ade80; }
.mc-w-send { background: rgba(59,130,246,.2); color: #60a5fa; }
.mc-w-wd   { background: rgba(168,85,247,.2); color: #c4b5fd; }
.mc-tx-list { display: flex; flex-direction: column; gap: .375rem; }
.mc-tx { display: flex; align-items: center; gap: .5rem; }
.mc-tx-ico { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: .8rem; flex-shrink: 0; }
.mc-tx-info { flex: 1; min-width: 0; }
.mc-tx-info p:first-child { font-size: .78rem; font-weight: 600; color: #fff; }
.mc-tx-date { font-size: .65rem; color: rgba(255,255,255,.4); }
.mc-tx-amt { font-family: var(--font-headline); font-size: .8rem; font-weight: 700; }
.mc-tx-cr { color: #4ade80; }
.mc-tx-dr { color: #f87171; }

/* Float card content */
.mc-float-ico   { font-size: 1.25rem; flex-shrink: 0; }
.mc-float-title { font-family: var(--font-headline); font-size: .78rem; font-weight: 700; color: #fff; }
.mc-float-sub   { font-size: .68rem; color: rgba(255,255,255,.55); margin-top: .1rem; }
.mc-float-dot   { width: 8px; height: 8px; border-radius: 50%; margin-left: auto; flex-shrink: 0; }
.mc-dot-green   { background: #22c55e; box-shadow: 0 0 6px #22c55e; }
.mc-new-badge   { background: #7c3aed; color: #fff; font-size: .6rem; font-weight: 800; padding: .15rem .4rem; border-radius: 999px; margin-left: auto; flex-shrink: 0; }

/* Text */
.ob-text-area {
  padding: 0 1.5rem; position: relative; z-index: 1;
  min-height: 120px;
}
.ob-text { display: flex; flex-direction: column; gap: .4rem; }
.ob-tag {
  font-family: var(--font-headline); font-size: .7rem; font-weight: 700;
  color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: .1em;
}
.ob-title {
  font-family: var(--font-headline); font-size: clamp(1.6rem,5.5vw,2rem);
  font-weight: 900; color: #fff; letter-spacing: -.02em;
  line-height: 1.1; white-space: pre-line;
}
.ob-body { font-size: .875rem; color: rgba(255,255,255,.55); line-height: 1.55; }

/* Bottom */
.ob-bottom {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.5rem calc(1.5rem + env(safe-area-inset-bottom,0px));
  position: relative; z-index: 2; gap: 1rem;
}
.ob-dots { display: flex; gap: .4rem; align-items: center; }
.ob-dot {
  width: 7px; height: 7px; border-radius: 999px;
  background: rgba(255,255,255,.22); border: none; cursor: pointer;
  transition: all .25s; padding: 0;
}
.ob-dot.active { width: 22px; background: #fff; }

.ob-btn-next, .ob-btn-start {
  height: 46px; border-radius: 14px; border: none;
  font-family: var(--font-headline); font-size: .9rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  gap: .4rem; padding: 0 1.5rem; transition: opacity .15s, transform .1s;
  white-space: nowrap;
}
.ob-btn-next {
  background: rgba(255,255,255,.1); border: 1.5px solid rgba(255,255,255,.2); color: #fff;
}
.ob-btn-next:hover { background: rgba(255,255,255,.18); }
.ob-btn-start { background: #fff; color: #0d0520; box-shadow: 0 4px 20px rgba(255,255,255,.15); }
.ob-btn-start:hover { opacity: .92; transform: translateY(-1px); }

/* Transitions */
.ob-next-enter-active,.ob-next-leave-active,
.ob-prev-enter-active,.ob-prev-leave-active { transition: opacity .3s ease, transform .3s ease; }
.ob-next-enter-from  { opacity:0; transform:translateX(50px);  }
.ob-next-leave-to    { opacity:0; transform:translateX(-50px); }
.ob-prev-enter-from  { opacity:0; transform:translateX(-50px); }
.ob-prev-leave-to    { opacity:0; transform:translateX(50px);  }
.ob-fade-enter-active,.ob-fade-leave-active { transition: opacity .4s ease; }
.ob-fade-enter-from,.ob-fade-leave-to { opacity:0; }
</style>
