<template>
  <section class="section-gfd why-section">
    <div class="container-gfd">

      <div class="why-header">
        <div class="section-badge">Why GFD</div>
        <h2 class="why-title">Everything you need to<br><span class="text-gradient">hire or get hired</span></h2>
        <p class="why-sub">One platform. Every tool. Zero friction.</p>
      </div>

      <div class="why-grid">

        <!-- Big feature card -->
        <div class="feat-card feat-big glass-card animate-fade-in-up">
          <div class="feat-top">
            <div class="feat-ico-wrap feat-ico-purple">
              <span class="material-symbols-outlined feat-ico">verified_user</span>
            </div>
            <h3 class="feat-title">GitHub-verified profiles</h3>
            <p class="feat-desc">Every developer on GFD connects their GitHub account, giving you real proof of their skills — not just buzzwords on a CV.</p>
          </div>
          <div class="feat-visual">
            <div class="gh-bar" v-for="(b, i) in ghBars" :key="i"
              :style="`height:${b}px;background:${b > 50 ? 'var(--primary)' : 'var(--outline-variant)'};opacity:${b > 50 ? 1 : 0.4}`" />
          </div>
        </div>

        <!-- Small cards -->
        <div class="feat-card glass-card animate-fade-in-up delay-100">
          <div class="feat-ico-wrap feat-ico-blue">
            <span class="material-symbols-outlined feat-ico">account_balance_wallet</span>
          </div>
          <h3 class="feat-title">Built-in wallet</h3>
          <p class="feat-desc">Fund, send, and withdraw directly to any Nigerian bank. No third-party apps needed.</p>
        </div>

        <div class="feat-card glass-card animate-fade-in-up delay-200">
          <div class="feat-ico-wrap feat-ico-green">
            <span class="material-symbols-outlined feat-ico">bolt</span>
          </div>
          <h3 class="feat-title">Hire in 48 hours</h3>
          <p class="feat-desc">Post a job and receive qualified applications from verified developers in under 24 hours.</p>
        </div>

        <div class="feat-card glass-card animate-fade-in-up delay-100">
          <div class="feat-ico-wrap feat-ico-orange">
            <span class="material-symbols-outlined feat-ico">forum</span>
          </div>
          <h3 class="feat-title">Direct messaging</h3>
          <p class="feat-desc">Chat directly with clients and developers, share files, and close deals fast.</p>
        </div>

        <!-- Big feature card 2 -->
        <div class="feat-card feat-big-2 glass-card animate-fade-in-up delay-200">
          <div class="feat-top">
            <div class="feat-ico-wrap feat-ico-pink">
              <span class="material-symbols-outlined feat-ico">analytics</span>
            </div>
            <h3 class="feat-title">Real-time analytics</h3>
            <p class="feat-desc">Track profile views, application stats, and earnings — all in your personal dashboard.</p>
          </div>
          <div class="analytics-mini">
            <div v-for="(v, i) in analyticsData" :key="i" class="analytics-bar-col">
              <div class="analytics-bar"
                :style="`height:${v}%;background:${i===analyticsData.length-1?'var(--primary)':'var(--surface-container-high)'}`" />
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
const ghBars = [20, 35, 15, 55, 70, 45, 80, 60, 90, 40, 65, 50, 75, 30, 85]
const analyticsData = [30, 45, 35, 60, 50, 70, 55, 80, 65, 90, 75, 100]
</script>

<style scoped>
.why-section { background: var(--surface-container-low); }

.why-header { text-align: center; margin-bottom: 3rem; display: flex; flex-direction: column; align-items: center; gap: .75rem; }
.section-badge {
  display: inline-flex; padding: .3rem .875rem;
  background: var(--primary-fixed); color: var(--primary);
  border-radius: 999px; font-family: var(--font-headline);
  font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
}
.why-title {
  font-family: var(--font-headline); font-size: clamp(1.75rem,4vw,2.75rem);
  font-weight: 900; letter-spacing: -.03em; line-height: 1.1; color: var(--on-surface);
}
.why-sub { font-size: 1rem; color: var(--on-surface-variant); max-width: 400px; line-height: 1.6; }

/* Grid */
.why-grid {
  display: grid; grid-template-columns: 1fr; gap: 1rem;
}
@media (min-width: 640px) {
  .why-grid { grid-template-columns: repeat(2,1fr); }
}
@media (min-width: 1024px) {
  .why-grid { grid-template-columns: repeat(3,1fr); }
  .feat-big { grid-column: span 2; }
  .feat-big-2 { grid-column: span 2; }
}

.feat-card {
  display: flex; flex-direction: column; gap: .75rem;
  padding: 1.5rem; transition: transform .2s, box-shadow .2s, border-color .2s;
}
.feat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--primary); }

/* Groups icon + title + desc so visual always goes below */
.feat-top { display: flex; flex-direction: column; gap: .75rem; }

.feat-ico-wrap {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.feat-ico-purple { background: rgba(99,14,212,.12); }
.feat-ico-blue   { background: rgba(59,130,246,.12); }
.feat-ico-green  { background: rgba(22,163,74,.12); }
.feat-ico-orange { background: rgba(245,158,11,.12); }
.feat-ico-pink   { background: rgba(236,72,153,.12); }

.feat-ico { font-size: 1.5rem; color: var(--primary); }
.feat-ico-wrap.feat-ico-blue .feat-ico   { color: #3b82f6; }
.feat-ico-wrap.feat-ico-green .feat-ico  { color: #16a34a; }
.feat-ico-wrap.feat-ico-orange .feat-ico { color: #f59e0b; }
.feat-ico-wrap.feat-ico-pink .feat-ico   { color: #ec4899; }

.feat-title {
  font-family: var(--font-headline); font-size: 1.05rem; font-weight: 800;
  color: var(--on-surface); letter-spacing: -.02em;
}
.feat-desc { font-size: .875rem; color: var(--on-surface-variant); line-height: 1.6; }

/* GitHub bar chart visual */
.feat-visual {
  margin-top: .5rem;
  display: flex; align-items: flex-end; gap: 3px; height: 56px;
  padding-top: .75rem;
  border-top: 1px solid var(--outline-variant);
  overflow: hidden;
}
.gh-bar { width: 8px; border-radius: 3px 3px 0 0; flex-shrink: 0; min-height: 4px; }

/* Analytics bar chart */
.analytics-mini {
  margin-top: .5rem;
  display: flex; align-items: flex-end; gap: 4px; height: 64px;
  padding-top: .75rem;
  border-top: 1px solid var(--outline-variant);
  overflow: hidden;
}
.analytics-bar-col { flex: 1; display: flex; align-items: flex-end; }
.analytics-bar { width: 100%; border-radius: 4px 4px 0 0; }
</style>
