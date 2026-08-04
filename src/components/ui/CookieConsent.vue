<template>
  <Teleport to="body">
    <Transition name="cc-slide">
      <div v-if="visible" class="cc-overlay">
        <div class="cc-sheet">

          <!-- Handle -->
          <div class="cc-handle" />

          <!-- Icon -->
          <div class="cc-icon-wrap">
            <span class="material-symbols-outlined cc-icon">cookie</span>
          </div>

          <h2 class="cc-title">Before you dive in</h2>
          <p class="cc-sub">
            GFD uses cookies and collects minimal data to keep your account secure,
            personalise your experience, and improve the platform.
          </p>

          <!-- Permissions list -->
          <div class="cc-items">
            <div v-for="item in items" :key="item.label" class="cc-item">
              <div class="cc-item-left">
                <div class="cc-item-ico">
                  <span class="material-symbols-outlined" style="font-size:18px">{{ item.icon }}</span>
                </div>
                <div>
                  <p class="cc-item-lbl">{{ item.label }}</p>
                  <p class="cc-item-desc">{{ item.desc }}</p>
                </div>
              </div>
              <span class="cc-req" v-if="item.required">Required</span>
              <span class="cc-opt" v-else>Optional</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="cc-actions">
            <button class="cc-btn-accept" @click="acceptAll">
              <span class="material-symbols-outlined" style="font-size:18px">check_circle</span>
              Accept All & Continue
            </button>
            <button class="cc-btn-essential" @click="acceptEssential">
              Essential only
            </button>
          </div>

          <p class="cc-policy">
            By continuing you agree to our
            <RouterLink to="/privacy-policy" class="cc-link" @click="acceptAll">Privacy Policy</RouterLink>.
          </p>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'gfd_cookie_consent_v2'
const visible = ref(false)

// Wait a short moment after mount — if onboarding is already done show immediately,
// otherwise the onboarding overlay covers it anyway and we show after a delay
onMounted(() => {
  if (localStorage.getItem(STORAGE_KEY)) return
  const onboarded = !!localStorage.getItem('gfd_onboarded_v2')
  setTimeout(() => { visible.value = true }, onboarded ? 400 : 3200)
})

const items = [
  {
    icon: 'security',
    label: 'Essential Cookies',
    desc: 'Keep you logged in and secure your session.',
    required: true,
  },
  {
    icon: 'tune',
    label: 'Personalisation',
    desc: 'Remember your preferences and theme settings.',
    required: false,
  },
  {
    icon: 'analytics',
    label: 'Analytics',
    desc: 'Help us understand how the app is used (anonymous).',
    required: false,
  },
  {
    icon: 'notifications',
    label: 'Push Notifications',
    desc: 'Notify you about messages, hires, and wallet updates.',
    required: false,
  },
]

function acceptAll() {
  localStorage.setItem(STORAGE_KEY, 'all')
  visible.value = false
}

function acceptEssential() {
  localStorage.setItem(STORAGE_KEY, 'essential')
  visible.value = false
}
</script>

<style scoped>
.cc-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,.5); backdrop-filter: blur(4px);
  display: flex; align-items: flex-end; justify-content: center;
}

.cc-sheet {
  width: 100%; max-width: 480px;
  background: var(--surface-container-lowest);
  border-radius: 24px 24px 0 0;
  padding: .75rem 1.5rem calc(2rem + env(safe-area-inset-bottom, 0px));
  display: flex; flex-direction: column; gap: 1rem;
  max-height: 92vh; overflow-y: auto;
}

@media (min-width: 480px) {
  .cc-overlay { align-items: center; }
  .cc-sheet { border-radius: 24px; max-height: 85vh; margin: 1rem; }
}

.cc-handle {
  width: 36px; height: 4px; border-radius: 999px;
  background: var(--outline-variant); margin: 0 auto .25rem;
}
@media (min-width: 480px) { .cc-handle { display: none; } }

/* Icon */
.cc-icon-wrap {
  width: 52px; height: 52px; border-radius: 16px;
  background: rgba(168,85,247,.12);
  display: flex; align-items: center; justify-content: center;
}
.cc-icon { font-size: 28px; color: var(--primary); }

/* Text */
.cc-title {
  font-family: var(--font-headline); font-size: 1.3rem; font-weight: 800;
  color: var(--on-surface); letter-spacing: -.02em;
}
.cc-sub { font-size: .875rem; color: var(--on-surface-variant); line-height: 1.55; }

/* Items */
.cc-items { display: flex; flex-direction: column; gap: .625rem; }
.cc-item {
  display: flex; align-items: center; justify-content: space-between; gap: .75rem;
  padding: .75rem; background: var(--surface-container-low);
  border: 1px solid var(--outline-variant); border-radius: 14px;
}
.cc-item-left { display: flex; align-items: flex-start; gap: .75rem; flex: 1; min-width: 0; }
.cc-item-ico {
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
  background: rgba(168,85,247,.1); color: var(--primary);
  display: flex; align-items: center; justify-content: center;
}
.cc-item-lbl { font-family: var(--font-headline); font-size: .875rem; font-weight: 700; color: var(--on-surface); }
.cc-item-desc { font-size: .75rem; color: var(--on-surface-variant); margin-top: .15rem; line-height: 1.4; }
.cc-req {
  font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
  color: var(--primary); background: rgba(168,85,247,.1); padding: .2rem .5rem;
  border-radius: 999px; flex-shrink: 0;
}
.cc-opt {
  font-size: .68rem; font-weight: 600; text-transform: uppercase; letter-spacing: .04em;
  color: var(--on-surface-variant); background: var(--surface-container);
  padding: .2rem .5rem; border-radius: 999px; flex-shrink: 0;
}

/* Actions */
.cc-actions { display: flex; flex-direction: column; gap: .625rem; }
.cc-btn-accept {
  width: 100%; height: 52px; border-radius: 14px; border: none;
  background: var(--primary); color: #fff;
  font-family: var(--font-headline); font-size: .95rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: .5rem;
  box-shadow: 0 4px 16px rgba(168,85,247,.35);
  transition: opacity .15s;
}
.cc-btn-accept:hover { opacity: .9; }

.cc-btn-essential {
  width: 100%; height: 46px; border-radius: 14px;
  border: 1.5px solid var(--outline-variant); background: none;
  font-family: var(--font-headline); font-size: .875rem; font-weight: 600;
  color: var(--on-surface-variant); cursor: pointer;
  transition: border-color .15s, color .15s;
}
.cc-btn-essential:hover { border-color: var(--primary); color: var(--primary); }

.cc-policy { text-align: center; font-size: .78rem; color: var(--on-surface-variant); }
.cc-link { color: var(--primary); font-weight: 600; text-decoration: none; }
.cc-link:hover { text-decoration: underline; }

/* Transition */
.cc-slide-enter-active, .cc-slide-leave-active { transition: all .3s ease; }
.cc-slide-enter-from, .cc-slide-leave-to { opacity: 0; transform: translateY(40px); }
@media (min-width: 480px) {
  .cc-slide-enter-from, .cc-slide-leave-to { transform: scale(.96) translateY(0); }
}
</style>
