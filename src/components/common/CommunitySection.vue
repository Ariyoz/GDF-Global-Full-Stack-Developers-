<template>
  <section class="section-gfd community-section">
    <div class="container-gfd">
      <SectionHeader
        tag="Developer Community"
        title="Join the GFD Ecosystem"
        subtitle="Connect with 80+ elite developers, collaborate on real projects, grow your skills, and unlock career opportunities worldwide."
      />

      <!-- Stats -->
      <div class="community-stats animate-fade-in-up">
        <div v-for="stat in communityStats" :key="stat.label" class="cstat glass-card">
          <span class="cstat-value">{{ stat.value }}</span>
          <span class="cstat-label">{{ stat.label }}</span>
        </div>
      </div>

      <!-- Benefits -->
      <div class="benefits-grid">
        <div
          v-for="(benefit, i) in benefits"
          :key="benefit.title"
          class="benefit-card glass-card animate-fade-in-up"
          :class="`delay-${i * 100}`"
        >
          <div class="benefit-icon-wrap">
            <span class="material-symbols-outlined benefit-icon">{{ benefit.icon }}</span>
          </div>
          <h4 class="benefit-title">{{ benefit.title }}</h4>
          <p class="benefit-desc">{{ benefit.desc }}</p>
        </div>
      </div>

      <!-- CTA Banner -->
      <div class="community-cta animate-fade-in-up delay-400">
        <div class="cta-banner">
          <div class="cta-text">
            <h3 class="cta-title">Ready to Join GFD?</h3>
            <p class="cta-desc">Apply to become part of our elite developer community. We're always looking for talented engineers.</p>
          </div>
          <div class="cta-actions">
            <RouterLink to="/community" class="btn-primary">Join the Community →</RouterLink>
            <RouterLink to="/careers" class="btn-outline">View Open Roles</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

const communityStats = ref([
  { value: '—', label: 'Active Developers' },
  { value: '—', label: 'Companies Hiring' },
  { value: '—', label: 'Projects Delivered' },
  { value: '—', label: 'Countries' },
])

onMounted(async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://gfd-backend.onrender.com/api/v1'
    const res = await fetch(`${baseUrl}/explore/developers?limit=1`)
    if (res.ok) {
      const devs = await res.json()
      communityStats.value = [
        { value: String(devs.total || devs.developers?.length || 0), label: 'Developers' },
        { value: '0', label: 'Companies Hiring' },
        { value: '0', label: 'Projects Delivered' },
        { value: '5+', label: 'Countries' },
      ]
    }
  } catch { /* leave defaults */ }
})

const benefits = [
  { icon: 'handshake',     title: 'Real Collaboration',  desc: 'Work alongside senior developers on live client projects.' },
  { icon: 'trending_up',   title: 'Career Growth',       desc: 'Mentorship, code reviews, and skill development programs.' },
  { icon: 'work',          title: 'Job Opportunities',   desc: 'Access exclusive job board with vetted tech companies.' },
  { icon: 'public',        title: 'Global Network',      desc: 'Connect with developers across multiple countries.' },
  { icon: 'emoji_events',  title: 'Recognition',         desc: 'Get featured for your contributions and achievements.' },
  { icon: 'bolt',          title: 'Modern Tech Stack',   desc: 'Work with the latest tools, frameworks, and best practices.' },
]
</script>

<style scoped>
.community-section { background: var(--background); }

/* Stats — always 2×2 grid on mobile, 4 cols on desktop */
.community-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.875rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .community-stats { grid-template-columns: repeat(4, 1fr); }
}

.cstat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  text-align: center;
  /* Ensure the card fills its grid cell */
  width: 100%;
  min-height: 110px;
  justify-content: center;
}

.cstat-value {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 5vw, 2.25rem);
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.03em;
  line-height: 1;
}

.cstat-label {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  font-weight: 500;
  line-height: 1.3;
}

/* Benefits — 1 col mobile, 2 col tablet, 3 col desktop */
.benefits-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;
  margin-bottom: 2rem;
}

@media (min-width: 480px) {
  .benefits-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .benefits-grid { grid-template-columns: repeat(3, 1fr); }
}

.benefit-card {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.25rem;
}

.benefit-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: rgba(99,14,212,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefit-icon { font-size: 22px; color: var(--primary); }

.benefit-title {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--on-surface);
}

.benefit-desc {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.6;
}

/* CTA Banner */
/* CTA banner — uses design tokens so it adapts to dark mode */
.cta-banner {
  background: var(--surface-container-low);
  border: 1px solid var(--glass-border-primary);
  border-radius: var(--radius-xl);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .cta-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 2.5rem;
  }
}

.cta-title {
  font-family: var(--font-headline);
  font-size: clamp(1.1rem, 3vw, 1.375rem);
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 0.4rem;
}

.cta-desc {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.6;
  max-width: 460px;
}

.cta-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

@media (max-width: 479px) {
  .cta-actions { flex-direction: column; }
  .cta-actions .btn-primary,
  .cta-actions .btn-outline { justify-content: center; }
}
</style>
