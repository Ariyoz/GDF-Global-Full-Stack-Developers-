<template>
  <section class="section-gfd services-section">
    <div class="container-gfd">
      <div class="section-top">
        <h2 class="text-headline-lg">Services Built for Scale</h2>
        <p class="text-body-md section-sub">
          From MVPs to enterprise platforms — end-to-end software solutions that drive real results.
        </p>
      </div>

      <div class="services-grid">
        <div
          v-for="(service, i) in SERVICES"
          :key="service.id"
          class="service-card glass-card animate-fade-in-up"
          :class="`delay-${(i % 4) * 100}`"
        >
          <div class="service-icon-wrap">
            <span class="material-symbols-outlined service-icon">{{ service.icon }}</span>
          </div>
          <h3 class="service-title">{{ service.title }}</h3>
          <p class="service-desc">{{ service.description }}</p>
          <div class="service-tags">
            <span v-for="tag in service.tags" :key="tag" class="chip">{{ tag }}</span>
          </div>
          <RouterLink to="/services" class="service-link">
            Learn more
            <span class="material-symbols-outlined" style="font-size:16px;">arrow_forward</span>
          </RouterLink>
        </div>
      </div>

      <div class="services-cta">
        <RouterLink to="/hire" class="btn-primary">Start Your Project →</RouterLink>
        <RouterLink to="/services" class="btn-outline">View All Services</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { SERVICES } from '@/constants'
</script>

<style scoped>
.services-section { background: var(--background); }

.section-top { text-align: center; margin-bottom: var(--space-lg); }

/* Section subtitle — uses design token for dark mode compatibility */
.section-sub {
  max-width: 560px;
  margin: 0.75rem auto 0;
  color: var(--on-surface-variant);
}

.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

@media (min-width: 640px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .services-grid { grid-template-columns: repeat(4, 1fr); }
}

.service-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: var(--space-md);
}

.service-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: rgba(99,14,212,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-icon { font-size: 24px; color: var(--primary); }

.service-title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
}

.service-desc {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.6;
  flex: 1;
}

.service-tags { display: flex; flex-wrap: wrap; gap: var(--space-xs); }

.service-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  margin-top: 0.25rem;
  transition: var(--transition-fast);
}
.service-link:hover { text-decoration: underline; }

.services-cta {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
