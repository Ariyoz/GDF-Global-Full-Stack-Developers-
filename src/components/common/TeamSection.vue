<template>
  <section class="section-gfd team-section">
    <div class="container-gfd">
      <SectionHeader
        tag="Leadership"
        title="The Minds Behind GFD"
        subtitle="A team of passionate builders, designers, and community leaders driving the future of software development."
      />

      <!-- Founder -->
      <div class="founder-wrap animate-fade-in-up">
        <div class="founder-card glass-card">
          <div class="founder-left">
            <div class="founder-avatar">
              <span class="avatar-initials">{{ initials(TEAM.founder.name) }}</span>
            </div>
            <span class="founder-badge">Founder</span>
          </div>
          <div class="founder-info">
            <h3 class="founder-name">{{ TEAM.founder.name }}</h3>
            <p class="founder-role">{{ TEAM.founder.role }}</p>
            <p class="founder-bio">{{ TEAM.founder.bio }}</p>
            <div class="social-pills">
              <a v-for="(url, net) in TEAM.founder.social" :key="net" :href="url" class="social-pill" target="_blank" rel="noopener">
                {{ net }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Co-Founders -->
      <div class="cofounders-grid">
        <div
          v-for="(cf, i) in TEAM.coFounders"
          :key="cf.name"
          class="cofounder-card glass-card animate-fade-in-up"
          :class="`delay-${(i + 1) * 100}`"
        >
          <div class="cf-avatar">
            <span class="avatar-initials">{{ initials(cf.name) }}</span>
          </div>
          <span class="cf-badge">Co-Founder</span>
          <h4 class="cf-name">{{ cf.name }}</h4>
          <p class="cf-role">{{ cf.role }}</p>
          <p class="cf-bio">{{ cf.bio }}</p>
          <div class="social-pills">
            <a v-for="(url, net) in cf.social" :key="net" :href="url" class="social-pill" target="_blank" rel="noopener">
              {{ net }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionHeader from '@/components/ui/SectionHeader.vue'
import { TEAM } from '@/constants'

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}
</script>

<style scoped>
/* Subtle tinted background — adapts to dark mode via CSS variable */
.team-section { background: var(--surface-container-low); }

/* Founder */
.founder-wrap { margin-bottom: 1.5rem; }

.founder-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.75rem;
  max-width: 760px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .founder-card { flex-direction: row; align-items: flex-start; }
}

.founder-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;
}

.founder-avatar {
  width: 88px;
  height: 88px;
  border-radius: var(--radius-xl);
  background: var(--primary-fixed);
  border: 2px solid rgba(99,14,212,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(99,14,212,0.15);
}

.avatar-initials {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
}

.founder-badge {
  display: inline-flex;
  padding: 0.2rem 0.625rem;
  background: rgba(99,14,212,0.08);
  border: 1px solid rgba(99,14,212,0.2);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.04em;
}

.founder-info { flex: 1; }

.founder-name {
  font-family: var(--font-headline);
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 0.2rem;
}

.founder-role {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 0.75rem;
}

.founder-bio {
  font-size: 0.9rem;
  color: var(--on-surface-variant);
  line-height: 1.65;
  margin-bottom: 1rem;
}

/* Co-Founders */
.cofounders-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .cofounders-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .cofounders-grid { grid-template-columns: repeat(3, 1fr); }
}

.cofounder-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1.5rem;
}

.cf-avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.cf-badge {
  display: inline-flex;
  padding: 0.15rem 0.5rem;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--on-surface-variant);
  letter-spacing: 0.04em;
}

.cf-name {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
}

.cf-role {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary);
}

.cf-bio {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.6;
  flex: 1;
}

/* Social pills */
.social-pills { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.25rem; }

.social-pill {
  padding: 0.25rem 0.625rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  text-decoration: none;
  text-transform: capitalize;
  transition: all 0.15s ease;
}

.social-pill:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(99,14,212,0.05);
}
</style>
