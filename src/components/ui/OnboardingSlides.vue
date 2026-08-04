<template>
  <Teleport to="body">
    <Transition name="ob-fade">
      <div v-if="visible" class="ob-overlay">

        <!-- Skip button -->
        <button class="ob-skip" @click="finish">Skip</button>

        <!-- Slides -->
        <div class="ob-stage">
          <Transition :name="dir" mode="out-in">
            <div class="ob-slide" :key="current">

              <!-- Illustration -->
              <div class="ob-illo" :style="{ background: slides[current].bg }">
                <span class="material-symbols-outlined ob-illo-icon" :style="{ color: slides[current].color }">
                  {{ slides[current].icon }}
                </span>
                <div class="ob-illo-ring ob-ring-1" />
                <div class="ob-illo-ring ob-ring-2" />
              </div>

              <!-- Text -->
              <div class="ob-text">
                <p class="ob-tag">{{ slides[current].tag }}</p>
                <h2 class="ob-title">{{ slides[current].title }}</h2>
                <p class="ob-body">{{ slides[current].body }}</p>
              </div>

            </div>
          </Transition>
        </div>

        <!-- Dots -->
        <div class="ob-dots">
          <button
            v-for="(_, i) in slides" :key="i"
            class="ob-dot"
            :class="{ active: i === current }"
            @click="goTo(i)"
          />
        </div>

        <!-- Action -->
        <div class="ob-actions">
          <button
            v-if="current < slides.length - 1"
            class="ob-btn-next"
            @click="next"
          >
            Next
            <span class="material-symbols-outlined" style="font-size:18px">arrow_forward</span>
          </button>
          <button
            v-else
            class="ob-btn-start"
            @click="finish"
          >
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

const STORAGE_KEY = 'gfd_onboarded'
const visible = ref(!localStorage.getItem(STORAGE_KEY))
const current = ref(0)
const dir     = ref('ob-next')

const slides = [
  {
    tag:   'Welcome to GFD',
    title: 'The home for\nserious developers.',
    body:  'Connect with top clients, showcase your projects, and get hired — all in one place built for real developers.',
    icon:  'code',
    bg:    'linear-gradient(135deg, rgba(168,85,247,.18) 0%, rgba(99,14,212,.08) 100%)',
    color: 'var(--primary)',
  },
  {
    tag:   'Find Work & Talent',
    title: 'Hire smarter.\nGet hired faster.',
    body:  'Clients post real projects. Developers apply, chat, and collaborate. No middlemen, no nonsense — just results.',
    icon:  'handshake',
    bg:    'linear-gradient(135deg, rgba(59,130,246,.15) 0%, rgba(99,14,212,.06) 100%)',
    color: '#3b82f6',
  },
  {
    tag:   'Built-in Wallet',
    title: 'Get paid safely.\nEvery time.',
    body:  'Fund your wallet, send money to teammates, and withdraw directly to your bank. Payments are secure and instant.',
    icon:  'account_balance_wallet',
    bg:    'linear-gradient(135deg, rgba(22,163,74,.15) 0%, rgba(99,14,212,.06) 100%)',
    color: '#16a34a',
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
.ob-overlay {
  position: fixed; inset: 0; z-index: 10000;
  background: var(--background);
  display: flex; flex-direction: column;
  align-items: center; justify-content: space-between;
  padding: calc(3rem + env(safe-area-inset-top, 0px)) 1.5rem
           calc(2.5rem + env(safe-area-inset-bottom, 0px));
}

/* Skip */
.ob-skip {
  position: absolute; top: calc(1.25rem + env(safe-area-inset-top, 0px)); right: 1.5rem;
  background: none; border: none; cursor: pointer;
  font-family: var(--font-headline); font-size: .875rem; font-weight: 600;
  color: var(--on-surface-variant);
}
.ob-skip:hover { color: var(--primary); }

/* Stage */
.ob-stage { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; }

.ob-slide {
  display: flex; flex-direction: column; align-items: center;
  gap: 2rem; width: 100%; max-width: 360px; text-align: center;
}

/* Illustration circle */
.ob-illo {
  position: relative; width: 200px; height: 200px; border-radius: 60px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ob-illo-icon { font-size: 80px; position: relative; z-index: 1; }
.ob-illo-ring {
  position: absolute; border-radius: 50%;
  border: 1.5px solid rgba(168,85,247,.15);
  animation: pulse 3s ease-in-out infinite;
}
.ob-ring-1 { width: 240px; height: 240px; animation-delay: 0s; }
.ob-ring-2 { width: 290px; height: 290px; animation-delay: -.8s; opacity: .5; }
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: .5; }
  50%       { transform: scale(1.05); opacity: 1; }
}

/* Text */
.ob-text { display: flex; flex-direction: column; gap: .625rem; }
.ob-tag {
  font-family: var(--font-headline); font-size: .75rem; font-weight: 700;
  color: var(--primary); text-transform: uppercase; letter-spacing: .08em;
}
.ob-title {
  font-family: var(--font-headline); font-size: clamp(1.6rem, 6vw, 2rem);
  font-weight: 900; color: var(--on-surface); letter-spacing: -.02em;
  line-height: 1.15; white-space: pre-line;
}
.ob-body { font-size: .925rem; color: var(--on-surface-variant); line-height: 1.6; }

/* Dots */
.ob-dots { display: flex; gap: .5rem; align-items: center; }
.ob-dot {
  width: 8px; height: 8px; border-radius: 999px;
  background: var(--outline-variant); border: none; cursor: pointer;
  transition: all .25s ease; padding: 0;
}
.ob-dot.active { width: 24px; background: var(--primary); }

/* Actions */
.ob-actions { width: 100%; max-width: 360px; }

.ob-btn-next, .ob-btn-start {
  width: 100%; height: 54px; border-radius: 16px; border: none;
  font-family: var(--font-headline); font-size: 1rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: .5rem;
  transition: opacity .15s, transform .1s;
}
.ob-btn-next {
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  color: var(--on-surface);
}
.ob-btn-next:hover { border-color: var(--primary); color: var(--primary); }
.ob-btn-start {
  background: var(--primary); color: #fff;
  box-shadow: 0 4px 20px rgba(168,85,247,.4);
}
.ob-btn-start:hover { opacity: .9; transform: translateY(-1px); }

/* Slide transitions */
.ob-next-enter-active, .ob-next-leave-active,
.ob-prev-enter-active, .ob-prev-leave-active {
  transition: opacity .25s ease, transform .25s ease;
}
.ob-next-enter-from  { opacity: 0; transform: translateX(40px); }
.ob-next-leave-to    { opacity: 0; transform: translateX(-40px); }
.ob-prev-enter-from  { opacity: 0; transform: translateX(-40px); }
.ob-prev-leave-to    { opacity: 0; transform: translateX(40px); }

/* Overlay fade */
.ob-fade-enter-active, .ob-fade-leave-active { transition: opacity .35s ease; }
.ob-fade-enter-from, .ob-fade-leave-to { opacity: 0; }
</style>
