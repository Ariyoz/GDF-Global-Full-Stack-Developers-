<template>
  <Teleport to="body">
    <Transition name="ob-fade">
      <div v-if="visible" class="ob-overlay" :class="slides[current].bgClass">

        <button class="ob-skip" @click="finish">Skip</button>

        <div class="ob-stage">
          <Transition :name="dir" mode="out-in">
            <div class="ob-slide" :key="current">

              <div class="ob-illo" :style="{ background: slides[current].illoGrad }">
                <template v-if="current === 0">
                  <img src="@/assets/icons/icon.png" alt="GFD" class="ob-app-icon" />
                </template>
                <template v-else>
                  <span class="material-symbols-outlined ob-illo-icon" :style="{ color: slides[current].color }">
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
            <img src="@/assets/icons/icon.png" alt="" style="width:20px;height:20px;border-radius:6px;object-fit:contain" />
            Get Started
          </button>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const STORAGE_KEY = 'gfd_onboarded_v2'
const visible = ref(!localStorage.getItem(STORAGE_KEY))
const current = ref(0)
const dir = ref('ob-next')

const slides = [
  {
    tag: 'Welcome to GFD',
    title: 'The home for\nserious developers.',
    body: 'Connect with top clients, showcase your projects, and get hired — all in one place built for real developers.',
    icon: 'code',
    illoGrad: 'linear-gradient(135deg, rgba(168,85,247,.2) 0%, rgba(99,14,212,.1) 100%)',
    color: '#a855f7',
    bgClass: 'slide-bg-1',
  },
  {
    tag: 'Find Work & Talent',
    title: 'Hire smarter.\nGet hired faster.',
    body: 'Clients post real projects. Developers apply, chat, and collaborate. No middlemen, no nonsense — just results.',
    icon: 'handshake',
    illoGrad: 'linear-gradient(135deg, rgba(59,130,246,.2) 0%, rgba(99,14,212,.08) 100%)',
    color: '#3b82f6',
    bgClass: 'slide-bg-2',
  },
  {
    tag: 'Built-in Wallet',
    title: 'Get paid safely.\nEvery time.',
    body: 'Fund your wallet, send money to teammates, and withdraw directly to your bank. Payments are secure and instant.',
    icon: 'account_balance_wallet',
    illoGrad: 'linear-gradient(135deg, rgba(22,163,74,.2) 0%, rgba(99,14,212,.08) 100%)',
    color: '#16a34a',
    bgClass: 'slide-bg-3',
  },
]

function next() {
  dir.value = 'ob-next'
  current.value++
}

function goTo(i) {
  dir.value = i > current.value ? 'ob-next' : 'ob-prev'
  current.value = i
}

function finish() {
  localStorage.setItem(STORAGE_KEY, '1')
  visible.value = false
}
</script>

<style scoped>
/* ── Overlay ── */
.ob-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: calc(3rem + env(safe-area-inset-top, 0px)) 1.5rem calc(2.5rem + env(safe-area-inset-bottom, 0px));
  overflow: hidden;
  transition: background 0.5s ease;
}

/* Background per slide */
.slide-bg-1 { background: #0d0520; }
.slide-bg-2 { background: #040d1f; }
.slide-bg-3 { background: #021409; }

/* Decorative radial blobs */
.slide-bg-1::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 50% at 85% 5%, rgba(168,85,247,.35) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 10% 90%, rgba(99,14,212,.25) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 50% 50%, rgba(168,85,247,.06) 0%, transparent 70%);
  pointer-events: none;
}
.slide-bg-2::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 50% at 10% 5%, rgba(59,130,246,.3) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 90% 85%, rgba(168,85,247,.2) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 50% 50%, rgba(59,130,246,.05) 0%, transparent 70%);
  pointer-events: none;
}
.slide-bg-3::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 50% at 85% 10%, rgba(22,163,74,.28) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 15% 85%, rgba(168,85,247,.18) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 50% 50%, rgba(22,163,74,.05) 0%, transparent 70%);
  pointer-events: none;
}

/* Grid dots pattern */
.ob-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle, rgba(255,255,255,.08) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}

/* Skip */
.ob-skip {
  position: absolute;
  top: calc(1.25rem + env(safe-area-inset-top, 0px));
  right: 1.5rem;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 999px;
  padding: .35rem .875rem;
  cursor: pointer;
  font-family: var(--font-headline);
  font-size: .8rem;
  font-weight: 600;
  color: rgba(255,255,255,.7);
  z-index: 1;
}
.ob-skip:hover { color: #fff; background: rgba(255,255,255,.15); }

/* Stage */
.ob-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 1;
}

/* Slide */
.ob-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 360px;
  text-align: center;
}

/* Illustration circle */
.ob-illo {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 20px 60px rgba(0,0,0,.3);
}
.ob-illo-icon {
  font-size: 80px;
  position: relative;
  z-index: 1;
}
.ob-app-icon {
  width: 110px;
  height: 110px;
  border-radius: 28px;
  object-fit: contain;
  position: relative;
  z-index: 1;
  box-shadow: 0 12px 40px rgba(0,0,0,.3);
}

/* Pulse rings */
.ob-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,.12);
  animation: ob-pulse 3s ease-in-out infinite;
}
.ob-ring-1 { width: 250px; height: 250px; animation-delay: 0s; }
.ob-ring-2 { width: 310px; height: 310px; animation-delay: -1s; opacity: .5; }
@keyframes ob-pulse {
  0%, 100% { transform: scale(1); opacity: .4; }
  50%       { transform: scale(1.04); opacity: .8; }
}

/* Text */
.ob-text { display: flex; flex-direction: column; gap: .625rem; }
.ob-tag {
  font-family: var(--font-headline);
  font-size: .72rem;
  font-weight: 700;
  color: rgba(255,255,255,.5);
  text-transform: uppercase;
  letter-spacing: .1em;
}
.ob-title {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 6vw, 2.2rem);
  font-weight: 900;
  color: #fff;
  letter-spacing: -.02em;
  line-height: 1.1;
  white-space: pre-line;
}
.ob-body {
  font-size: .9rem;
  color: rgba(255,255,255,.65);
  line-height: 1.6;
}

/* Dots */
.ob-dots {
  display: flex;
  gap: .5rem;
  align-items: center;
  z-index: 1;
}
.ob-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,.25);
  border: none;
  cursor: pointer;
  transition: all .25s ease;
  padding: 0;
}
.ob-dot.active { width: 24px; background: #fff; }

/* Actions */
.ob-actions {
  width: 100%;
  max-width: 360px;
  z-index: 1;
}

.ob-btn-next, .ob-btn-start {
  width: 100%;
  height: 54px;
  border-radius: 16px;
  border: none;
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  transition: opacity .15s, transform .1s;
}
.ob-btn-next {
  background: rgba(255,255,255,.1);
  border: 1.5px solid rgba(255,255,255,.2);
  color: #fff;
}
.ob-btn-next:hover { background: rgba(255,255,255,.18); }
.ob-btn-start {
  background: #fff;
  color: #0d0520;
}
.ob-btn-start:hover { opacity: .92; transform: translateY(-1px); }

/* Transitions */
.ob-next-enter-active, .ob-next-leave-active,
.ob-prev-enter-active, .ob-prev-leave-active {
  transition: opacity .25s ease, transform .25s ease;
}
.ob-next-enter-from  { opacity: 0; transform: translateX(40px); }
.ob-next-leave-to    { opacity: 0; transform: translateX(-40px); }
.ob-prev-enter-from  { opacity: 0; transform: translateX(-40px); }
.ob-prev-leave-to    { opacity: 0; transform: translateX(40px); }

.ob-fade-enter-active, .ob-fade-leave-active { transition: opacity .35s ease; }
.ob-fade-enter-from, .ob-fade-leave-to { opacity: 0; }
</style>
