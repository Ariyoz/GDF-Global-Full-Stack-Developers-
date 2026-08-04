<template>
  <section class="hero">
    <!-- Animated mesh background -->
    <div class="hero-mesh" aria-hidden="true">
      <div class="mesh-blob mesh-blob-1" />
      <div class="mesh-blob mesh-blob-2" />
      <div class="mesh-blob mesh-blob-3" />
      <div class="mesh-grid" />
    </div>

    <div class="container-gfd hero-body">

      <!-- Announcement badge -->
      <a href="/explore" class="hero-badge animate-fade-in-up">
        <span class="badge-dot" />
        <span>Now live in 10+ countries</span>
        <span class="material-symbols-outlined" style="font-size:14px">arrow_forward</span>
      </a>

      <!-- Headline -->
      <h1 class="hero-h animate-fade-in-up delay-100">
        Where world-class<br>
        <span class="hero-gradient">developers get hired</span>
      </h1>

      <!-- Sub -->
      <p class="hero-sub animate-fade-in-up delay-200">
        The global marketplace connecting elite full-stack engineers with visionary clients.
        Build your next product with verified talent — faster than ever.
      </p>

      <!-- CTA buttons -->
      <div class="hero-ctas animate-fade-in-up delay-300">
        <RouterLink to="/hire" class="btn-hero-primary">
          <span class="material-symbols-outlined" style="font-size:18px">handshake</span>
          Hire Developers
        </RouterLink>
        <RouterLink to="/auth/register" class="btn-hero-outline">
          Join as Developer
          <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span>
        </RouterLink>
      </div>

      <!-- Social proof row -->
      <div class="hero-proof animate-fade-in-up delay-400">
        <div class="proof-avatars">
          <img v-for="(a, i) in proofAvatars" :key="i"
            :src="a" class="proof-av" :style="`z-index:${6-i}`" alt="Developer" />
        </div>
        <div class="proof-text">
          <div class="proof-stars">★★★★★</div>
          <span>Trusted by <strong>{{ STATS[0].value }}+</strong> developers worldwide</span>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="hero-stats animate-fade-in-up delay-500">
        <div v-for="(s, i) in STATS" :key="s.label" class="hero-stat">
          <span class="stat-num">{{ s.value }}</span>
          <span class="stat-lbl">{{ s.label }}</span>
          <div v-if="i < STATS.length - 1" class="stat-sep" />
        </div>
      </div>

    </div>

    <!-- Floating UI preview cards -->
    <div class="hero-preview" aria-hidden="true">
      <div class="preview-card preview-card-a animate-float">
        <div class="pc-row">
          <div class="pc-av pc-av-1">A</div>
          <div>
            <p class="pc-name">Alex Okonkwo</p>
            <p class="pc-role">Senior React Dev</p>
          </div>
          <span class="pc-avail">Available</span>
        </div>
        <div class="pc-chips">
          <span>React</span><span>Node</span><span>AWS</span>
        </div>
        <div class="pc-rate">₦450k <span>/month</span></div>
      </div>

      <div class="preview-card preview-card-b animate-float" style="animation-delay:.8s">
        <div class="pc-check">
          <span class="material-symbols-outlined" style="font-size:16px;color:#22c55e;font-variation-settings:'FILL' 1">check_circle</span>
          <span>Hired in 2 days</span>
        </div>
        <div class="pc-rating">⭐ 4.98 · 63 reviews</div>
      </div>

      <div class="preview-card preview-card-c animate-float" style="animation-delay:1.4s">
        <p class="pc-notif-title">New project match</p>
        <p class="pc-notif-sub">E-commerce platform · ₦1.2M</p>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const proofAvatars = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Maria&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=James&backgroundColor=d1f0c0',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Sara&backgroundColor=ffeaa7',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=David&backgroundColor=e8daff',
]

const STATS = ref([
  { value: '0', label: 'Developers' },
  { value: '0', label: 'Companies' },
  { value: '0', label: 'Projects' },
  { value: '5+', label: 'Countries' },
])

onMounted(async () => {
  const base = import.meta.env.VITE_API_BASE_URL || 'https://gfd-backend.onrender.com/api/v1'
  const load = async () => {
    try {
      const res = await fetch(`${base}/explore/stats`)
      if (res.ok) {
        const d = await res.json()
        STATS.value = [
          { value: String(d.developers || 0), label: 'Developers' },
          { value: String(d.companies_hiring || 0), label: 'Companies' },
          { value: String(d.projects_delivered || 0), label: 'Projects' },
          { value: '5+', label: 'Countries' },
        ]
        return true
      }
    } catch { }
    return false
  }
  if (!(await load())) setTimeout(load, 3000)
})
</script>

<style scoped>
.hero {
  min-height: 90vh;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: var(--background);
  padding: 5rem 0 4rem;
}

@media (min-width: 1024px) {
  .hero {
    grid-template-columns: 1fr 420px;
    gap: 2rem;
    padding: 6rem 0 5rem;
    min-height: 92vh;
  }
}

/* ── Mesh background ── */
.hero-mesh { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.mesh-blob {
  position: absolute; border-radius: 50%; filter: blur(90px);
}
.mesh-blob-1 {
  width: 600px; height: 500px; top: -150px; right: -100px;
  background: radial-gradient(circle, rgba(99,14,212,.12) 0%, transparent 70%);
  animation: blobFloat 12s ease-in-out infinite;
}
.mesh-blob-2 {
  width: 400px; height: 400px; bottom: -100px; left: -80px;
  background: radial-gradient(circle, rgba(168,85,247,.1) 0%, transparent 70%);
  animation: blobFloat 16s ease-in-out infinite reverse;
}
.mesh-blob-3 {
  width: 300px; height: 300px; top: 40%; left: 40%;
  background: radial-gradient(circle, rgba(99,14,212,.06) 0%, transparent 70%);
  animation: blobFloat 10s ease-in-out infinite 2s;
}
.mesh-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--outline-variant) 1px, transparent 1px),
    linear-gradient(90deg, var(--outline-variant) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: .3;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
}
@keyframes blobFloat {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(30px,-20px) scale(1.05); }
  66%      { transform: translate(-20px,15px) scale(.97); }
}

/* ── Body ── */
.hero-body {
  display: flex; flex-direction: column;
  align-items: flex-start; gap: 1.5rem;
  position: relative; z-index: 1;
  padding-top: 0;
}

/* Badge */
.hero-badge {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .35rem .875rem .35rem .625rem;
  background: var(--surface-container-low);
  border: 1px solid var(--glass-border-primary);
  border-radius: 999px;
  font-family: var(--font-headline); font-size: .8rem; font-weight: 600;
  color: var(--primary); text-decoration: none;
  transition: background .15s;
}
.hero-badge:hover { background: var(--primary-fixed); }
.badge-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,.6);
  flex-shrink: 0;
}

/* Headline */
.hero-h {
  font-family: var(--font-headline);
  font-size: clamp(2.2rem, 6vw, 4rem);
  font-weight: 900; line-height: 1.08;
  letter-spacing: -.035em;
  color: var(--on-surface);
  max-width: 640px;
}
.hero-gradient {
  background: var(--gradient-text);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

/* Sub */
.hero-sub {
  font-size: clamp(.95rem, 2vw, 1.125rem);
  color: var(--on-surface-variant); line-height: 1.65;
  max-width: 520px;
}

/* CTAs */
.hero-ctas { display: flex; gap: .75rem; flex-wrap: wrap; }
.btn-hero-primary {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .8rem 1.75rem; border-radius: 14px;
  background: var(--primary); color: #fff; border: none;
  font-family: var(--font-headline); font-size: .95rem; font-weight: 700;
  text-decoration: none; cursor: pointer;
  box-shadow: 0 6px 24px rgba(99,14,212,.35);
  transition: all .2s ease;
}
.btn-hero-primary:hover { background: var(--primary-container); transform: translateY(-2px); box-shadow: 0 10px 32px rgba(99,14,212,.45); }

.btn-hero-outline {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .8rem 1.5rem; border-radius: 14px;
  background: var(--surface-container-lowest);
  border: 1.5px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .95rem; font-weight: 600;
  color: var(--on-surface); text-decoration: none;
  transition: all .2s ease;
}
.btn-hero-outline:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-fixed); }

/* Proof */
.hero-proof { display: flex; align-items: center; gap: .875rem; }
.proof-avatars { display: flex; }
.proof-av {
  width: 34px; height: 34px; border-radius: 50%;
  border: 2px solid var(--surface-container-lowest);
  background: var(--surface-container-low);
  margin-left: -8px; object-fit: cover;
}
.proof-av:first-child { margin-left: 0; }
.proof-text { display: flex; flex-direction: column; gap: .1rem; }
.proof-stars { color: #f59e0b; font-size: .8rem; letter-spacing: .05em; }
.proof-text span { font-size: .8rem; color: var(--on-surface-variant); }
.proof-text strong { color: var(--on-surface); }

/* Stats */
.hero-stats {
  display: flex; align-items: center; gap: 0;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: 16px; overflow: hidden;
  width: 100%; max-width: 520px;
}
.hero-stat {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  padding: .875rem .5rem; position: relative;
}
.stat-sep {
  position: absolute; right: 0; top: 20%; bottom: 20%;
  width: 1px; background: var(--outline-variant);
}
.stat-num {
  font-family: var(--font-headline); font-size: clamp(1.2rem, 3vw, 1.6rem);
  font-weight: 800; color: var(--primary); letter-spacing: -.03em;
}
.stat-lbl { font-size: .7rem; color: var(--on-surface-variant); font-weight: 500; margin-top: .1rem; }

/* ── Preview cards (desktop only) ── */
.hero-preview {
  display: none;
  position: relative; z-index: 1;
  padding: 1rem 1rem 1rem 0;
}
@media (min-width: 1024px) {
  .hero-preview { display: flex; flex-direction: column; gap: 1rem; justify-content: center; }
}

.preview-card {
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: 18px; padding: 1rem 1.125rem;
  box-shadow: var(--shadow-md);
  min-width: 260px; max-width: 300px;
}
.preview-card-a { align-self: flex-end; }
.preview-card-b { align-self: flex-start; }
.preview-card-c { align-self: flex-end; }

.pc-row { display: flex; align-items: center; gap: .625rem; margin-bottom: .625rem; }
.pc-av {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-headline); font-weight: 800; font-size: .9rem; flex-shrink: 0;
}
.pc-av-1 { background: rgba(99,14,212,.15); color: var(--primary); }
.pc-name { font-family: var(--font-headline); font-size: .85rem; font-weight: 700; color: var(--on-surface); }
.pc-role { font-size: .7rem; color: var(--on-surface-variant); }
.pc-avail {
  margin-left: auto; padding: .15rem .5rem; border-radius: 999px;
  background: rgba(34,197,94,.12); color: #16a34a;
  font-size: .65rem; font-weight: 700; flex-shrink: 0;
}
.pc-chips { display: flex; gap: .3rem; margin-bottom: .625rem; }
.pc-chips span {
  padding: .15rem .5rem; border-radius: 999px;
  background: rgba(99,14,212,.1); color: var(--primary);
  font-size: .68rem; font-weight: 600;
}
.pc-rate { font-family: var(--font-headline); font-size: 1.05rem; font-weight: 800; color: var(--on-surface); }
.pc-rate span { font-size: .75rem; font-weight: 400; color: var(--on-surface-variant); }

.pc-check { display: flex; align-items: center; gap: .4rem; margin-bottom: .25rem; }
.pc-check span { font-family: var(--font-headline); font-size: .82rem; font-weight: 700; color: var(--on-surface); }
.pc-rating { font-size: .78rem; color: var(--on-surface-variant); }

.pc-notif-title { font-family: var(--font-headline); font-size: .85rem; font-weight: 700; color: var(--on-surface); }
.pc-notif-sub { font-size: .75rem; color: var(--on-surface-variant); margin-top: .2rem; }

@media (max-width: 1023px) {
  .hero { text-align: center; }
  .hero-body { align-items: center; }
  .hero-sub { text-align: center; }
  .hero-h { text-align: center; }
  .hero-badge { align-self: center; }
}
@media (max-width: 480px) {
  .hero-ctas { flex-direction: column; width: 100%; }
  .btn-hero-primary, .btn-hero-outline { justify-content: center; }
}
</style>
