<template>
  <div class="careers-view">
    <!-- Hero -->
    <section class="page-hero section-gfd">
      <div class="container-gfd hero-inner">
        <div class="hero-tag animate-fade-in-up">
          <span class="status-dot status-dot-green" />
          We're Hiring
        </div>
        <h1 class="text-headline-xl animate-fade-in-up delay-100">
          Build Your Career at <span class="text-gradient">GFD</span>
        </h1>
        <p class="text-body-lg animate-fade-in-up delay-200" style="max-width:560px;text-align:center;">
          Join a team of world-class developers building premium digital products.
          Remote-first, growth-focused, and developer-obsessed.
        </p>
      </div>
    </section>

    <!-- Jobs -->
    <section class="section-gfd jobs-section">
      <div class="container-gfd">
        <div class="section-header-row">
          <h2 class="text-headline-lg">Open Positions</h2>
          <span class="chip chip-primary">{{ openRoles.length }} roles</span>
        </div>

        <div class="jobs-list">
          <div
            v-for="(job, i) in openRoles"
            :key="job.title"
            class="job-card glass-card animate-fade-in-up"
            :class="`delay-${i * 50}`"
          >
            <div class="job-icon-wrap">
              <span class="material-symbols-outlined job-icon">{{ job.icon }}</span>
            </div>
            <div class="job-info">
              <div class="job-header">
                <h3 class="job-title">{{ job.title }}</h3>
                <div class="job-badges">
                  <span class="chip chip-primary">{{ job.type }}</span>
                  <span class="chip">{{ job.location }}</span>
                </div>
              </div>
              <p class="job-desc">{{ job.desc }}</p>
              <div class="job-tags">
                <span v-for="tag in job.tags" :key="tag" class="chip">{{ tag }}</span>
              </div>
            </div>
            <RouterLink to="/auth/register" class="btn-primary job-apply">Apply Now →</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Perks -->
    <section class="section-gfd perks-section">
      <div class="container-gfd">
        <div class="section-header-row" style="margin-bottom:2rem">
          <h2 class="text-headline-lg">Why Join GFD?</h2>
        </div>
        <div class="perks-grid">
          <div v-for="(perk, i) in perks" :key="perk.title" class="perk-card glass-card animate-fade-in-up" :class="`delay-${i * 50}`">
            <div class="perk-icon-wrap">
              <span class="material-symbols-outlined perk-icon">{{ perk.icon }}</span>
            </div>
            <h4 class="perk-title">{{ perk.title }}</h4>
            <p class="perk-desc">{{ perk.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const openRoles = [
  { icon: 'palette',      title: 'Senior Frontend Developer', type: 'Full-time', location: 'Remote', desc: 'Lead frontend development with Vue.js, building premium UIs for global clients.', tags: ['Vue.js', 'JavaScript', 'Tailwind CSS'] },
  { icon: 'settings',     title: 'Backend Engineer',          type: 'Full-time', location: 'Remote', desc: 'Design scalable APIs and microservices handling millions of requests.', tags: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'] },
  { icon: 'smartphone',   title: 'Mobile Developer',          type: 'Full-time', location: 'Remote', desc: 'Build cross-platform mobile apps with React Native.', tags: ['React Native', 'iOS', 'Android'] },
  { icon: 'design_services', title: 'UI/UX Designer',         type: 'Full-time', location: 'Remote', desc: 'Create premium design systems and user experiences for top-tier clients.', tags: ['Figma', 'Design Systems', 'Prototyping'] },
  { icon: 'cloud',        title: 'DevOps Engineer',           type: 'Contract',  location: 'Remote', desc: 'Manage cloud infrastructure, CI/CD pipelines, and deployment automation.', tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'] },
]

const perks = [
  { icon: 'public',       title: 'Remote First',    desc: 'Work from anywhere in the world.' },
  { icon: 'trending_up',  title: 'Career Growth',   desc: 'Mentorship, learning budget, and clear progression.' },
  { icon: 'payments',     title: 'Competitive Pay', desc: 'Market-rate salaries with performance bonuses.' },
  { icon: 'code',         title: 'Modern Stack',    desc: 'Work with the latest tools and technologies.' },
  { icon: 'groups',       title: 'Great Team',      desc: 'Collaborate with senior engineers worldwide.' },
  { icon: 'schedule',     title: 'Flexible Hours',  desc: 'Async-first culture with flexible scheduling.' },
]
</script>

<style scoped>
.careers-view { background: var(--background); }

.page-hero { padding-top: 5rem; }

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.875rem;
  background: rgba(22,163,74,0.08);
  border: 1px solid rgba(22,163,74,0.2);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 600;
  color: #16a34a;
}

/* Jobs section — uses design token for dark mode */
.jobs-section { background: var(--surface-container-low); }

.section-header-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.jobs-list { display: flex; flex-direction: column; gap: 1rem; }

.job-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .job-card { flex-direction: row; align-items: center; }
}

.job-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-lg);
  background: rgba(99,14,212,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.job-icon { font-size: 26px; color: var(--primary); }

.job-info { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }

.job-header { display: flex; align-items: flex-start; gap: 0.75rem; flex-wrap: wrap; }

.job-title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
}

.job-badges { display: flex; gap: 0.4rem; flex-wrap: wrap; }

.job-desc { font-size: 0.875rem; color: var(--on-surface-variant); line-height: 1.6; }

.job-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }

.job-apply { flex-shrink: 0; font-size: 0.875rem; }

/* Perks */
.perks-section { background: var(--background); }

.perks-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 1024px) {
  .perks-grid { grid-template-columns: repeat(3, 1fr); }
}

.perk-card {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.5rem;
}

.perk-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: rgba(99,14,212,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.perk-icon { font-size: 22px; color: var(--primary); }

.perk-title { font-family: var(--font-headline); font-size: 0.95rem; font-weight: 700; color: var(--on-surface); }
.perk-desc  { font-size: 0.875rem; color: var(--on-surface-variant); line-height: 1.5; }
</style>
