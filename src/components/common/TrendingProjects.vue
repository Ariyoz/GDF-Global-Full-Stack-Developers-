<template>
  <section class="section-gfd trending-section">
    <div class="container-gfd">
      <!-- Header -->
      <div class="section-top">
        <div>
          <h2 class="text-headline-lg">Trending Projects</h2>
          <p class="text-body-md" style="margin-top:0.25rem">Exceptional work from our global community.</p>
        </div>
        <RouterLink to="/projects" class="view-all-link">
          View all
          <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span>
        </RouterLink>
      </div>

      <!-- Mobile: stacked list -->
      <div class="bento-mobile">
        <div
          v-for="project in mobileProjects"
          :key="project.title"
          class="mobile-project-card"
          :style="{ background: project.gradient }"
        >
          <div class="mobile-card-overlay">
            <span v-if="project.badge" class="bento-badge">{{ project.badge }}</span>
            <h3 class="mobile-card-title">{{ project.title }}</h3>
            <p class="mobile-card-desc">{{ project.desc }}</p>
          </div>
        </div>

        <!-- CTA card -->
        <div class="mobile-cta-card" @click="$router.push('/projects')">
          <span class="material-symbols-outlined" style="font-size:2rem;color:var(--primary)">add_circle</span>
          <p class="mobile-cta-title">Submit Yours</p>
          <p class="mobile-cta-desc">Showcase to 500+ top companies.</p>
        </div>
      </div>

      <!-- Desktop: bento grid -->
      <div class="bento-desktop">
        <!-- Large featured (col-span-2, row-span-2) -->
        <div class="bento-large">
          <div class="bento-overlay">
            <span class="bento-badge">EDITOR'S CHOICE</span>
            <h3 class="bento-title-lg">Vortex Analytics Engine</h3>
            <p class="bento-desc">Real-time data visualization for cloud-native infrastructure.</p>
            <div class="bento-meta">
              <span class="bento-meta-item">
                <span class="material-symbols-outlined" style="font-size:15px">visibility</span> 12.4k
              </span>
              <span class="bento-meta-item">
                <span class="material-symbols-outlined" style="font-size:15px">favorite</span> 2.1k
              </span>
            </div>
          </div>
        </div>

        <!-- Medium (col-span-2) -->
        <div class="bento-medium">
          <div class="bento-overlay-dark">
            <h3 class="bento-title-md">Prism Design System</h3>
            <div class="bento-author">
              <div class="author-dot" />
              <span>by David Kim</span>
            </div>
          </div>
        </div>

        <!-- Small 1 -->
        <div class="bento-small">
          <div class="bento-overlay-dark">
            <h4 class="bento-title-sm">Nexus Core API</h4>
            <span class="bento-category">Fintech</span>
          </div>
        </div>

        <!-- CTA -->
        <div class="bento-cta" @click="$router.push('/projects')">
          <span class="material-symbols-outlined bento-cta-icon">add_circle</span>
          <h4 class="bento-cta-title">Submit Yours</h4>
          <p class="bento-cta-desc">Showcase to 500+ top companies.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const mobileProjects = [
  { title: 'Vortex Analytics Engine', desc: 'Real-time data visualization for cloud-native infrastructure.', badge: "EDITOR'S CHOICE", gradient: 'linear-gradient(135deg,#1a0840 0%,#630ed4 100%)' },
  { title: 'Prism Design System',     desc: 'Comprehensive design system for enterprise SaaS.',             badge: null,             gradient: 'linear-gradient(135deg,#2a1060 0%,#1a0840 100%)' },
  { title: 'Nexus Core API',          desc: 'High-throughput payment processing API for fintech.',           badge: null,             gradient: 'linear-gradient(135deg,#1a0840 0%,#0d0520 100%)' },
]
</script>

<style scoped>
.trending-section { background: var(--background); }

.section-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 0.25rem;
}
.view-all-link:hover { text-decoration: underline; }

/* ── Mobile Layout ── */
.bento-mobile {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

@media (min-width: 768px) {
  .bento-mobile { display: none; }
}

.mobile-project-card {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  min-height: 140px;
  cursor: pointer;
}

.mobile-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.25rem;
}

.mobile-card-title {
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.25rem;
}

.mobile-card-desc {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.4;
}

.mobile-cta-card {
  border-radius: var(--radius-xl);
  /* Always dark — doesn't flip in light mode */
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem;
  cursor: pointer;
  gap: 0.5rem;
  transition: background 0.25s;
  min-height: 120px;
  border: 1px solid rgba(168,85,247,0.15);
}

.mobile-cta-card:hover { background: var(--primary); }
.mobile-cta-card:hover .mobile-cta-title,
.mobile-cta-card:hover .mobile-cta-desc { color: rgba(255,255,255,0.9); }
.mobile-cta-card:hover .material-symbols-outlined { color: #fff; }

.mobile-cta-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: #fff; }
.mobile-cta-desc  { font-size: 0.8rem; color: rgba(255,255,255,0.6); }

/* ── Desktop Bento Grid ── */
.bento-desktop { display: none; }

@media (min-width: 768px) {
  .bento-desktop {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 280px 280px;
    gap: 1rem;
  }
}

/* Large — always dark gradient */
.bento-large {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: linear-gradient(135deg, #1a0840 0%, #1a1040 100%);
  grid-column: span 2;
  grid-row: span 2;
  cursor: pointer;
}

.bento-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
}

.bento-badge {
  display: inline-block;
  padding: 0.2rem 0.625rem;
  background: var(--primary);
  color: var(--on-primary);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
  width: fit-content;
}

.bento-title-lg {
  font-family: var(--font-headline);
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.35rem;
}

.bento-desc {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 0.875rem;
  line-height: 1.5;
}

.bento-meta { display: flex; gap: 0.875rem; }

.bento-meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
}

/* Medium */
.bento-medium {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: linear-gradient(135deg, #2a1060 0%, #1a0840 100%);
  grid-column: span 2;
  cursor: pointer;
}

.bento-overlay-dark {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  transition: background 0.25s;
}

.bento-medium:hover .bento-overlay-dark,
.bento-small:hover .bento-overlay-dark {
  background: rgba(0,0,0,0.2);
}

.bento-title-md {
  font-family: var(--font-headline);
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
}

.bento-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.85);
}

.author-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--surface-container);
  border: 1px solid rgba(255,255,255,0.2);
}

/* Small */
.bento-small {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: linear-gradient(135deg, #1a0840 0%, #0d0520 100%);
  cursor: pointer;
}

.bento-title-sm {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.bento-category {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  margin-top: 2px;
}

/* CTA — always dark */
.bento-cta {
  border-radius: var(--radius-xl);
  background: #1a1a2e;
  border: 1px solid rgba(168,85,247,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem;
  cursor: pointer;
  transition: background 0.25s;
  gap: 0.5rem;
}

.bento-cta:hover { background: var(--primary); }

.bento-cta-icon {
  font-size: 2.5rem;
  color: var(--primary);
  transition: color 0.25s;
}

.bento-cta:hover .bento-cta-icon { color: #fff; }

.bento-cta-title {
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.bento-cta-desc {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.55);
  transition: color 0.25s;
}

.bento-cta:hover .bento-cta-desc { color: rgba(255,255,255,0.8); }
</style>
