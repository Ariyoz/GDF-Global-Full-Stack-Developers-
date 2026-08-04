<template>
  <section class="section-gfd cta-section">
    <div class="container-gfd">
      <div class="cta-wrap">

        <!-- Background glow -->
        <div class="cta-glow-1" />
        <div class="cta-glow-2" />
        <div class="cta-grid" />

        <div class="cta-inner">

          <!-- Left: text -->
          <div class="cta-body">
            <div class="section-badge">Get started today</div>
            <h2 class="cta-title">
              Ready to build something<br>
              <span class="cta-gradient">extraordinary?</span>
            </h2>
            <p class="cta-sub">
              Join 10,000+ developers and companies already building the future on GFD.
              No subscription fees, no middlemen.
            </p>

            <div class="cta-buttons">
              <RouterLink to="/auth/register" class="cta-btn-primary">
                <span class="material-symbols-outlined" style="font-size:18px">rocket_launch</span>
                Start for free
              </RouterLink>
              <RouterLink to="/explore" class="cta-btn-ghost">
                Browse developers →
              </RouterLink>
            </div>

            <!-- Mini stats -->
            <div class="cta-mini-stats">
              <div class="mini-stat">
                <span class="material-symbols-outlined" style="font-size:16px;font-variation-settings:'FILL' 1;color:#22c55e">check_circle</span>
                Free to join
              </div>
              <div class="mini-stat">
                <span class="material-symbols-outlined" style="font-size:16px;font-variation-settings:'FILL' 1;color:#22c55e">check_circle</span>
                No hidden fees
              </div>
              <div class="mini-stat">
                <span class="material-symbols-outlined" style="font-size:16px;font-variation-settings:'FILL' 1;color:#22c55e">check_circle</span>
                Instant payments
              </div>
            </div>
          </div>

          <!-- Right: feature cards -->
          <div class="cta-cards">
            <div class="cta-card" v-for="f in features" :key="f.title">
              <div class="cta-card-ico" :style="`background:${f.bg}`">
                <span class="material-symbols-outlined" :style="`color:${f.color};font-size:20px`">{{ f.icon }}</span>
              </div>
              <div>
                <p class="cta-card-title">{{ f.title }}</p>
                <p class="cta-card-desc">{{ f.desc }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  { icon: 'verified_user', title: 'Verified talent', desc: 'Every developer is GitHub-verified', bg: 'rgba(99,14,212,.15)', color: '#a855f7' },
  { icon: 'account_balance_wallet', title: 'Built-in wallet', desc: 'Instant payments & withdrawals', bg: 'rgba(22,163,74,.15)', color: '#16a34a' },
  { icon: 'chat', title: 'Direct messaging', desc: 'No middlemen, talk directly', bg: 'rgba(59,130,246,.15)', color: '#3b82f6' },
  { icon: 'analytics', title: 'Smart matching', desc: 'AI-powered talent discovery', bg: 'rgba(245,158,11,.15)', color: '#f59e0b' },
]
</script>

<style scoped>
.cta-section { background: var(--surface-container-low); }

.cta-wrap {
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, #0d0520 0%, #1a0840 50%, #0a0a18 100%);
  border-radius: 24px; border: 1px solid rgba(168,85,247,.2);
}

.cta-glow-1 {
  position: absolute; width: 500px; height: 400px;
  top: -150px; right: -100px; border-radius: 50%;
  background: radial-gradient(circle, rgba(168,85,247,.25) 0%, transparent 70%);
  pointer-events: none; filter: blur(40px);
}
.cta-glow-2 {
  position: absolute; width: 400px; height: 400px;
  bottom: -150px; left: -100px; border-radius: 50%;
  background: radial-gradient(circle, rgba(99,14,212,.2) 0%, transparent 70%);
  pointer-events: none; filter: blur(40px);
}
.cta-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(168,85,247,.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(168,85,247,.06) 1px, transparent 1px);
  background-size: 50px 50px;
}

.cta-inner {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 1fr;
  gap: 2.5rem; padding: 2.5rem 1.5rem;
}
@media (min-width: 768px) { .cta-inner { padding: 3.5rem 3rem; } }
@media (min-width: 1024px) {
  .cta-inner { grid-template-columns: 1fr 1fr; align-items: center; padding: 4rem; }
}

/* Text side */
.cta-body { display: flex; flex-direction: column; gap: 1.25rem; }

.section-badge {
  display: inline-flex; padding: .3rem .875rem;
  background: rgba(168,85,247,.2); color: #c4b5fd;
  border-radius: 999px; font-family: var(--font-headline);
  font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
  width: fit-content;
}

.cta-title {
  font-family: var(--font-headline); font-size: clamp(1.75rem, 4vw, 2.6rem);
  font-weight: 900; letter-spacing: -.03em; line-height: 1.1; color: #fff;
}
.cta-gradient {
  background: linear-gradient(135deg, #a855f7, #c084fc, #818cf8);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.cta-sub { font-size: .95rem; color: rgba(255,255,255,.6); line-height: 1.65; max-width: 460px; }

.cta-buttons { display: flex; gap: .75rem; flex-wrap: wrap; }
.cta-btn-primary {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .8rem 1.75rem; border-radius: 14px; border: none;
  background: #fff; color: #0d0520;
  font-family: var(--font-headline); font-size: .95rem; font-weight: 700;
  text-decoration: none; cursor: pointer;
  box-shadow: 0 6px 24px rgba(255,255,255,.15);
  transition: all .2s;
}
.cta-btn-primary:hover { opacity: .92; transform: translateY(-2px); }
.cta-btn-ghost {
  display: inline-flex; align-items: center;
  padding: .8rem 1.5rem; border-radius: 14px;
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.18);
  font-family: var(--font-headline); font-size: .95rem; font-weight: 600;
  color: rgba(255,255,255,.85); text-decoration: none;
  transition: all .2s;
}
.cta-btn-ghost:hover { background: rgba(255,255,255,.14); color: #fff; }

.cta-mini-stats { display: flex; flex-wrap: wrap; gap: .875rem; }
.mini-stat {
  display: flex; align-items: center; gap: .375rem;
  font-size: .82rem; color: rgba(255,255,255,.6);
  font-family: var(--font-headline); font-weight: 500;
}

/* Feature cards */
.cta-cards { display: grid; grid-template-columns: 1fr 1fr; gap: .875rem; }

.cta-card {
  display: flex; align-items: flex-start; gap: .75rem;
  padding: .875rem 1rem;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 14px;
  transition: background .15s, border-color .15s;
}
.cta-card:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.2); }

.cta-card-ico {
  width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.cta-card-title { font-family: var(--font-headline); font-size: .82rem; font-weight: 700; color: #fff; }
.cta-card-desc { font-size: .72rem; color: rgba(255,255,255,.5); margin-top: .15rem; line-height: 1.4; }

@media (max-width: 479px) {
  .cta-buttons { flex-direction: column; }
  .cta-btn-primary, .cta-btn-ghost { justify-content: center; }
  .cta-cards { grid-template-columns: 1fr; }
}
</style>
