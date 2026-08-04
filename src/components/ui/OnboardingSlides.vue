<template>
  <Teleport to="body">
    <Transition name="ob-fade">
      <div v-if="visible" class="ob-overlay" :class="`slide-bg-${current + 1}`">

        <button class="ob-skip" @click="finish">Skip</button>

        <div class="ob-stage">
          <Transition :name="dir" mode="out-in">
            <div class="ob-slide" :key="current">

              <!-- Illustration -->
              <div class="ob-illo" :style="{ background: slides[current].illoGrad }">
                <template v-if="current === 0">
                  <img src="@/assets/icons/icon.png" alt="GFD" class="ob-app-icon" />
                </template>
                <template v-else>
                  <span class="material-symbols-outlined ob-illo-icon"
                    :style="{ color: slides[current].color }">
                    {{ slides[current].icon }}
                  </span>
                </template>
                <div class="ob-ring ob-ring-1" />
                <div class="ob-ring ob-ring-2" />
              </div>

              <div class="ob-text">
                <p class="ob-tag">{{ slides[current].tag }}</p>
                <h2 class="ob-title">{{ slides[current].title }}</h2>
                <p class="ob-body">{{ slides[current].body }}</p>
              </div>

            </div>
          </Transition>
        </div>

        <div class="ob-dots">
          <button v-for="(_, i) in slides" :key="i"
            class="ob-dot" :class="{ active: i === current }"
            @click="goTo(i)" />
        </div>

        <div class="ob-actions">
          <button v-if="current < slides.length - 1" class="ob-btn-next" @click="next">
            Next
            <span class="material-symbols-outlined" style="font-size:18px">arrow_forward</span>
          </button>
          <button v-else class="ob-btn-start" @click="finish">
            <img src="@/assets/icons/icon.png" alt=""
              style="width:20px;height:20px;border-radius:6px;object-fit:contain" />
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
    tag:       'Welcome to GFD',
    title:     'The home for\nserious developers.',
    body:      'Connect with top clients, showcase your projects, and get hired — all in one place built for real developers.',
    icon:      'code',
    illoGrad:  'linear-gradient(135deg,rgba(168,85,247,.25) 0%,rgba(99,14,212,.15) 100%)',
    color:     '#a855f7',
    bgClass:   'slide-bg-1',
  },
  {
    tag:       'Find Work & Talent',
    title:     'Hire smarter.\nGet hired faster.',
    body:      'Clients post real projects. Developers apply, chat, and collaborate. No middlemen — just results.',
    icon:      'handshake',
    illoGrad:  'linear-gradient(135deg,rgba(59,130,246,.25) 0%,rgba(99,14,212,.1) 100%)',
    color:     '#3b82f6',
    bgClass:   'slide-bg-2',
  },
  {
    tag:       'Built-in Wallet',
    title:     'Get paid safely.\nEvery time.',
    body:      'Fund your wallet, send money to teammates, and withdraw to your bank. Secure and instant.',
    icon:      'account_balance_wallet',
    illoGrad:  'linear-gradient(135deg,rgba(22,163,74,.25) 0%,rgba(99,14,212,.1) 100%)',
    color:     '#16a34a',
    bgClass:   'slide-bg-3',
  },
]

function next()  { dir.value = 'ob-next'; current.value++ }
function goTo(i) { dir.value = i > current.value ? 'ob-next' : 'ob-prev'; current.value = i }
function finish() { localStorage.setItem(PERM_KEY, '1'); visible.value = false }
</script>

<style scoped>
/* ── Overlay ── */
.ob-overlay {
  position: fixed; inset: 0; z-index: 10000;
  display: flex; flex-direction: column;
  align-items: center; justify-content: space-between;
  padding: calc(3rem + env(safe-area-inset-top,0px)) 1.5rem
           calc(2.5rem + env(safe-area-inset-bottom,0px));
  overflow: hidden;
}

/* Dark backgrounds */
.slide-bg-1 { background: #0d0520; }
.slide-bg-2 { background: #04101f; }
.slide-bg-3 { background: #021409; }

/* Colour blobs */
.slide-bg-1::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 70% 50% at 90% 5%,  rgba(168,85,247,.4)  0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 10% 90%, rgba(99,14,212,.25)  0%, transparent 60%);
}
.slide-bg-2::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 70% 50% at 10% 5%,  rgba(59,130,246,.35) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 90% 88%, rgba(168,85,247,.2)  0%, transparent 60%);
}
.slide-bg-3::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 70% 50% at 85% 8%,  rgba(22,163,74,.3)   0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 15% 88%, rgba(168,85,247,.18) 0%, transparent 60%);
}

/* Dot grid */
.ob-overlay::after {
  content:''; position:absolute; inset:0; pointer-events:none;
  background-image: radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 30px 30px;
  mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 100%);
}

/* Skip */
.ob-skip {
  position: absolute;
  top: calc(1.25rem + env(safe-area-inset-top,0px)); right: 1.5rem;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18);
  border-radius: 999px; padding: .35rem .875rem;
  font-family: var(--font-headline); font-size: .8rem; font-weight: 600;
  color: rgba(255,255,255,.7); cursor: pointer; z-index: 2;
  transition: background .15s;
}
.ob-skip:hover { background: rgba(255,255,255,.18); color: #fff; }

/* Stage */
.ob-stage {
  flex: 1; display: flex; align-items: center;
  justify-content: center; width: 100%; z-index: 1;
}

/* Slide */
.ob-slide {
  display: flex; flex-direction: column; align-items: center;
  gap: 2rem; width: 100%; max-width: 360px; text-align: center;
}

/* Illustration circle */
.ob-illo {
  position: relative; width: 200px; height: 200px; border-radius: 56px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 20px 60px rgba(0,0,0,.35);
}
.ob-illo-icon { font-size: 80px; position: relative; z-index: 1; }
.ob-app-icon {
  width: 110px; height: 110px; border-radius: 26px;
  object-fit: contain; position: relative; z-index: 1;
  box-shadow: 0 8px 32px rgba(0,0,0,.35);
}

/* Pulse rings */
.ob-ring {
  position: absolute; border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,.1);
  animation: obpulse 3s ease-in-out infinite;
}
.ob-ring-1 { width: 255px; height: 255px; animation-delay: 0s; }
.ob-ring-2 { width: 315px; height: 315px; animation-delay: -1s; opacity: .5; }
@keyframes obpulse {
  0%,100% { transform:scale(1);    opacity:.35; }
  50%     { transform:scale(1.04); opacity:.75; }
}

/* Text */
.ob-text { display: flex; flex-direction: column; gap: .625rem; }
.ob-tag {
  font-family: var(--font-headline); font-size: .7rem; font-weight: 700;
  color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: .1em;
}
.ob-title {
  font-family: var(--font-headline); font-size: clamp(1.75rem,6vw,2.2rem);
  font-weight: 900; color: #fff; letter-spacing: -.02em;
  line-height: 1.1; white-space: pre-line;
}
.ob-body { font-size: .9rem; color: rgba(255,255,255,.6); line-height: 1.6; }

/* Dots */
.ob-dots { display: flex; gap: .5rem; align-items: center; z-index: 1; }
.ob-dot {
  width: 8px; height: 8px; border-radius: 999px;
  background: rgba(255,255,255,.25); border: none; cursor: pointer;
  transition: all .25s ease; padding: 0;
}
.ob-dot.active { width: 24px; background: #fff; }

/* Actions */
.ob-actions { width: 100%; max-width: 360px; z-index: 1; }
.ob-btn-next, .ob-btn-start {
  width: 100%; height: 54px; border-radius: 16px; border: none;
  font-family: var(--font-headline); font-size: 1rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  gap: .5rem; transition: opacity .15s, transform .1s;
}
.ob-btn-next {
  background: rgba(255,255,255,.1);
  border: 1.5px solid rgba(255,255,255,.22);
  color: #fff;
}
.ob-btn-next:hover { background: rgba(255,255,255,.18); }
.ob-btn-start { background: #fff; color: #0d0520; }
.ob-btn-start:hover { opacity: .9; transform: translateY(-1px); }

/* Transitions */
.ob-next-enter-active,.ob-next-leave-active,
.ob-prev-enter-active,.ob-prev-leave-active { transition: opacity .25s ease, transform .25s ease; }
.ob-next-enter-from  { opacity:0; transform:translateX(40px);  }
.ob-next-leave-to    { opacity:0; transform:translateX(-40px); }
.ob-prev-enter-from  { opacity:0; transform:translateX(-40px); }
.ob-prev-leave-to    { opacity:0; transform:translateX(40px);  }
.ob-fade-enter-active,.ob-fade-leave-active { transition: opacity .35s ease; }
.ob-fade-enter-from,.ob-fade-leave-to { opacity:0; }
</style>
