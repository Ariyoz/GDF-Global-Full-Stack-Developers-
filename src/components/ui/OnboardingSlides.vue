<template>
  <Teleport to="body">
    <Transition name="ob-fade">
      <div v-if="visible" class="ob-overlay" :class="`slide-bg-${current + 1}`">

        <button class="ob-skip" @click="finish">Skip</button>

        <!-- Slide content -->
        <div class="ob-stage">
          <Transition :name="dir" mode="out-in">
            <div class="ob-slide" :key="current">

              <!-- Illustration -->
              <div class="ob-illo-wrap">

                <!-- Slide 1: Developer at work -->
                <svg v-if="current === 0" viewBox="0 0 320 260" class="ob-svg" xmlns="http://www.w3.org/2000/svg">
                  <!-- Monitor -->
                  <rect x="60" y="40" width="200" height="140" rx="12" fill="#1e1040" stroke="#7c3aed" stroke-width="2"/>
                  <rect x="68" y="50" width="184" height="116" rx="6" fill="#0d0520"/>
                  <!-- Code lines -->
                  <rect x="82" y="66" width="60" height="7" rx="3" fill="#7c3aed" opacity=".9"/>
                  <rect x="82" y="82" width="100" height="7" rx="3" fill="#a78bfa" opacity=".6"/>
                  <rect x="94" y="98" width="80" height="7" rx="3" fill="#3b82f6" opacity=".7"/>
                  <rect x="94" y="114" width="50" height="7" rx="3" fill="#a78bfa" opacity=".5"/>
                  <rect x="82" y="130" width="70" height="7" rx="3" fill="#7c3aed" opacity=".8"/>
                  <rect x="82" y="146" width="90" height="7" rx="3" fill="#3b82f6" opacity=".4"/>
                  <!-- Cursor blink -->
                  <rect x="176" y="146" width="3" height="8" rx="1" fill="#a78bfa">
                    <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite"/>
                  </rect>
                  <!-- Monitor stand -->
                  <rect x="148" y="180" width="24" height="20" rx="2" fill="#1e1040"/>
                  <rect x="128" y="198" width="64" height="8" rx="4" fill="#1e1040"/>
                  <!-- App icon floating -->
                  <image href="@/assets/icons/icon.png" x="230" y="30" width="44" height="44" clip-path="url(#iconClip)"/>
                  <defs>
                    <clipPath id="iconClip">
                      <rect x="230" y="30" width="44" height="44" rx="10"/>
                    </clipPath>
                  </defs>
                  <!-- Stars/dots -->
                  <circle cx="52" cy="60" r="3" fill="#a78bfa" opacity=".5">
                    <animate attributeName="opacity" values=".5;1;.5" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="278" cy="180" r="2" fill="#3b82f6" opacity=".6">
                    <animate attributeName="opacity" values=".6;1;.6" dur="1.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="40" cy="180" r="4" fill="#7c3aed" opacity=".4">
                    <animate attributeName="opacity" values=".4;.9;.4" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                  <!-- GFD Label -->
                  <text x="160" y="240" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#a78bfa" letter-spacing="2">GLOBAL FULL-STACK DEV</text>
                </svg>

                <!-- Slide 2: Handshake / hiring -->
                <svg v-else-if="current === 1" viewBox="0 0 320 260" class="ob-svg" xmlns="http://www.w3.org/2000/svg">
                  <!-- Left person card -->
                  <rect x="20" y="60" width="110" height="130" rx="14" fill="#1e1040" stroke="#3b82f6" stroke-width="1.5"/>
                  <circle cx="75" cy="105" r="24" fill="#0d0520" stroke="#3b82f6" stroke-width="1.5"/>
                  <circle cx="75" cy="98" r="10" fill="#3b82f6" opacity=".7"/>
                  <ellipse cx="75" cy="118" rx="14" ry="8" fill="#3b82f6" opacity=".4"/>
                  <rect x="36" y="136" width="78" height="7" rx="3" fill="#a78bfa" opacity=".7"/>
                  <rect x="46" y="150" width="58" height="6" rx="3" fill="#3b82f6" opacity=".4"/>
                  <rect x="36" y="163" width="38" height="16" rx="8" fill="#3b82f6" opacity=".8"/>
                  <text x="55" y="175" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="700" fill="#fff">HIRE</text>
                  <!-- Right person card -->
                  <rect x="190" y="60" width="110" height="130" rx="14" fill="#1e1040" stroke="#7c3aed" stroke-width="1.5"/>
                  <circle cx="245" cy="105" r="24" fill="#0d0520" stroke="#7c3aed" stroke-width="1.5"/>
                  <circle cx="245" cy="98" r="10" fill="#7c3aed" opacity=".7"/>
                  <ellipse cx="245" cy="118" rx="14" ry="8" fill="#7c3aed" opacity=".4"/>
                  <rect x="206" y="136" width="78" height="7" rx="3" fill="#a78bfa" opacity=".7"/>
                  <rect x="216" y="150" width="58" height="6" rx="3" fill="#7c3aed" opacity=".4"/>
                  <rect x="206" y="163" width="78" height="16" rx="8" fill="#7c3aed" opacity=".8"/>
                  <text x="245" y="175" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="700" fill="#fff">DEVELOPER</text>
                  <!-- Connection line with handshake icon -->
                  <line x1="132" y1="125" x2="188" y2="125" stroke="#a78bfa" stroke-width="2" stroke-dasharray="4 3" opacity=".6"/>
                  <circle cx="160" cy="125" r="18" fill="#1e1040" stroke="#a78bfa" stroke-width="1.5"/>
                  <!-- Handshake symbol -->
                  <path d="M152 122 L157 118 L163 122 L168 118" stroke="#a78bfa" stroke-width="2" fill="none" stroke-linecap="round"/>
                  <path d="M152 128 L157 124 L163 128 L168 124" stroke="#7c3aed" stroke-width="2" fill="none" stroke-linecap="round"/>
                  <!-- Check badge -->
                  <circle cx="160" cy="220" r="16" fill="#16a34a" opacity=".2" stroke="#16a34a" stroke-width="1.5"/>
                  <path d="M153 220 l5 5 l9-10" stroke="#16a34a" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                  <!-- Floating dots -->
                  <circle cx="30" cy="45" r="3" fill="#3b82f6" opacity=".5"><animate attributeName="opacity" values=".5;1;.5" dur="2s" repeatCount="indefinite"/></circle>
                  <circle cx="290" cy="50" r="2" fill="#a78bfa" opacity=".6"><animate attributeName="opacity" values=".6;1;.6" dur="1.8s" repeatCount="indefinite"/></circle>
                </svg>

                <!-- Slide 3: Wallet / payment -->
                <svg v-else viewBox="0 0 320 260" class="ob-svg" xmlns="http://www.w3.org/2000/svg">
                  <!-- Phone -->
                  <rect x="100" y="30" width="120" height="200" rx="18" fill="#1e1040" stroke="#16a34a" stroke-width="2"/>
                  <rect x="108" y="46" width="104" height="168" rx="10" fill="#0d0520"/>
                  <!-- Home indicator -->
                  <rect x="138" y="220" width="44" height="4" rx="2" fill="#16a34a" opacity=".5"/>
                  <!-- Wallet card inside phone -->
                  <rect x="116" y="54" width="88" height="52" rx="10" fill="url(#walletGrad)"/>
                  <defs>
                    <linearGradient id="walletGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stop-color="#16a34a"/>
                      <stop offset="100%" stop-color="#059669"/>
                    </linearGradient>
                  </defs>
                  <circle cx="200" cy="70" r="18" fill="#15803d" opacity=".5"/>
                  <circle cx="214" cy="70" r="18" fill="#16a34a" opacity=".5"/>
                  <text x="155" y="95" font-family="monospace" font-size="8" fill="rgba(255,255,255,.7)">**** **** 4521</text>
                  <!-- Balance row -->
                  <text x="160" y="125" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#16a34a" opacity=".8">BALANCE</text>
                  <text x="160" y="140" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="900" fill="#fff">₦24,500</text>
                  <!-- Action buttons -->
                  <rect x="120" y="152" width="36" height="28" rx="8" fill="#16a34a" opacity=".15" stroke="#16a34a" stroke-width="1"/>
                  <text x="138" y="170" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#16a34a">Fund</text>
                  <rect x="162" y="152" width="36" height="28" rx="8" fill="#3b82f6" opacity=".15" stroke="#3b82f6" stroke-width="1"/>
                  <text x="180" y="170" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#3b82f6">Send</text>
                  <!-- Tx list -->
                  <rect x="116" y="188" width="88" height="10" rx="4" fill="#16a34a" opacity=".08"/>
                  <circle cx="124" cy="193" r="4" fill="#16a34a" opacity=".5"/>
                  <rect x="132" y="190" width="44" height="4" rx="2" fill="#a78bfa" opacity=".35"/>
                  <rect x="183" y="190" width="14" height="4" rx="2" fill="#16a34a" opacity=".6"/>
                  <!-- Floating coins -->
                  <circle cx="60" cy="90" r="18" fill="#16a34a" opacity=".12" stroke="#16a34a" stroke-width="1.5"/>
                  <text x="60" y="95" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#16a34a" opacity=".8">₦</text>
                  <circle cx="262" cy="150" r="14" fill="#16a34a" opacity=".1" stroke="#16a34a" stroke-width="1.5"/>
                  <text x="262" y="155" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#16a34a" opacity=".7">₦</text>
                  <!-- Shield -->
                  <path d="M50 160 L50 145 Q50 140 55 138 L62 135 L69 138 Q74 140 74 145 L74 160 Q74 168 62 172 Q50 168 50 160Z" fill="#16a34a" opacity=".15" stroke="#16a34a" stroke-width="1.5"/>
                  <path d="M57 153 l4 4 l7-8" stroke="#16a34a" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

              </div>

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
          <button v-for="(_, i) in slides" :key="i"
            class="ob-dot" :class="{ active: i === current }"
            @click="goTo(i)" />
        </div>

        <!-- Action -->
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

const STORAGE_KEY = 'gfd_onboarded_v2'
const visible = ref(!localStorage.getItem(STORAGE_KEY))
const current = ref(0)
const dir = ref('ob-next')

const slides = [
  {
    tag: 'Welcome to GFD',
    title: 'The home for\nserious developers.',
    body: 'Connect with top clients, showcase your work, and get hired — all in one place built for real developers.',
  },
  {
    tag: 'Find Work & Talent',
    title: 'Hire smarter.\nGet hired faster.',
    body: 'Clients post real projects. Developers apply, chat, and collaborate. No middlemen — just results.',
  },
  {
    tag: 'Built-in Wallet',
    title: 'Get paid safely.\nEvery time.',
    body: 'Fund your wallet, send money to teammates, and withdraw directly to your bank. Secure and instant.',
  },
]

function next() { dir.value = 'ob-next'; current.value++ }
function goTo(i) { dir.value = i > current.value ? 'ob-next' : 'ob-prev'; current.value = i }
function finish() { localStorage.setItem(STORAGE_KEY, '1'); visible.value = false }
</script>

<style scoped>
.ob-overlay {
  position: fixed; inset: 0; z-index: 10000;
  display: flex; flex-direction: column;
  align-items: center; justify-content: space-between;
  padding: calc(3rem + env(safe-area-inset-top,0px)) 1.5rem
           calc(2.5rem + env(safe-area-inset-bottom,0px));
  overflow: hidden;
}

.slide-bg-1 { background: #0d0520; }
.slide-bg-2 { background: #04101f; }
.slide-bg-3 { background: #021409; }

.slide-bg-1::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 70% 50% at 90% 5%, rgba(168,85,247,.4) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 10% 90%, rgba(99,14,212,.25) 0%, transparent 60%);
}
.slide-bg-2::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 70% 50% at 10% 5%, rgba(59,130,246,.35) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 90% 88%, rgba(168,85,247,.2) 0%, transparent 60%);
}
.slide-bg-3::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 70% 50% at 85% 8%, rgba(22,163,74,.3) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 15% 88%, rgba(168,85,247,.18) 0%, transparent 60%);
}
.ob-overlay::after {
  content:''; position:absolute; inset:0; pointer-events:none;
  background-image: radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 30px 30px;
  mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 100%);
}

.ob-skip {
  position: absolute;
  top: calc(1.25rem + env(safe-area-inset-top,0px)); right: 1.5rem;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18);
  border-radius: 999px; padding: .35rem .875rem;
  font-family: var(--font-headline); font-size: .8rem; font-weight: 600;
  color: rgba(255,255,255,.7); cursor: pointer; z-index: 2;
}
.ob-skip:hover { background: rgba(255,255,255,.18); color: #fff; }

.ob-stage {
  flex: 1; display: flex; align-items: center;
  justify-content: center; width: 100%; z-index: 1;
}

.ob-slide {
  display: flex; flex-direction: column; align-items: center;
  gap: 1.75rem; width: 100%; max-width: 340px; text-align: center;
}

/* SVG illustration */
.ob-illo-wrap {
  width: 100%; max-width: 320px;
  filter: drop-shadow(0 20px 50px rgba(0,0,0,.5));
}
.ob-svg { width: 100%; height: auto; }

/* Text */
.ob-text { display: flex; flex-direction: column; gap: .5rem; }
.ob-tag {
  font-family: var(--font-headline); font-size: .7rem; font-weight: 700;
  color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: .1em;
}
.ob-title {
  font-family: var(--font-headline); font-size: clamp(1.65rem,6vw,2.1rem);
  font-weight: 900; color: #fff; letter-spacing: -.02em;
  line-height: 1.1; white-space: pre-line;
}
.ob-body { font-size: .875rem; color: rgba(255,255,255,.6); line-height: 1.6; }

/* Dots */
.ob-dots { display: flex; gap: .5rem; align-items: center; z-index: 1; }
.ob-dot {
  width: 8px; height: 8px; border-radius: 999px;
  background: rgba(255,255,255,.25); border: none; cursor: pointer;
  transition: all .25s ease; padding: 0;
}
.ob-dot.active { width: 24px; background: #fff; }

/* Actions */
.ob-actions { width: 100%; max-width: 340px; z-index: 1; }
.ob-btn-next, .ob-btn-start {
  width: 100%; height: 54px; border-radius: 16px; border: none;
  font-family: var(--font-headline); font-size: 1rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  gap: .5rem; transition: opacity .15s, transform .1s;
}
.ob-btn-next {
  background: rgba(255,255,255,.1); border: 1.5px solid rgba(255,255,255,.22); color: #fff;
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
