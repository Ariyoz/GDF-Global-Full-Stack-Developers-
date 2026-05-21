<template>
  <div class="community-view">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container-gfd hero-inner">
        <div class="hero-tag animate-fade-in-up">Developer Ecosystem</div>
        <h1 class="hero-headline animate-fade-in-up delay-100">
          The GFD <span class="text-gradient">Community</span>
        </h1>
        <p class="hero-sub animate-fade-in-up delay-200">
          Join 80+ elite developers collaborating, growing, and building the future together.
        </p>
        <RouterLink to="/auth/register" class="btn-primary animate-fade-in-up delay-300" style="margin-top:0.5rem">
          Join the Community →
        </RouterLink>
      </div>
    </section>

    <CommunitySection />

    <!-- Jobs -->
    <section class="section-gfd jobs-section" id="jobs">
      <div class="container-gfd">
        <div class="jobs-header">
          <h2 class="text-headline-lg">Open Roles at GFD</h2>
          <p class="text-body-md" style="margin-top:0.25rem">Find your next opportunity in our growing team.</p>
        </div>

        <div class="jobs-list">
          <div v-for="job in jobs" :key="job.title" class="job-card glass-card">
            <div class="job-icon-wrap">
              <span class="material-symbols-outlined job-icon">{{ job.icon }}</span>
            </div>
            <div class="job-info">
              <div class="job-header-row">
                <h4 class="job-title">{{ job.title }}</h4>
                <div class="job-badges">
                  <span class="chip chip-primary">{{ job.type }}</span>
                  <span class="chip">Remote</span>
                </div>
              </div>
              <p class="job-desc">{{ job.desc }}</p>
              <div class="job-tags">
                <span v-for="tag in job.tags" :key="tag" class="chip">{{ tag }}</span>
              </div>
            </div>
            <RouterLink to="/auth/register" class="btn-primary job-apply">Apply →</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import CommunitySection from '@/components/common/CommunitySection.vue'

const jobs = [
  { icon: 'palette',        title: 'Senior Frontend Developer', type: 'Full-time', desc: 'Build premium UIs with Vue.js and modern CSS.',                tags: ['Vue.js', 'Tailwind', 'JavaScript'] },
  { icon: 'settings',       title: 'Backend Engineer',          type: 'Full-time', desc: 'Design and build scalable APIs and microservices.',            tags: ['Node.js', 'PostgreSQL', 'Redis'] },
  { icon: 'code',           title: 'Full Stack Developer',      type: 'Contract',  desc: 'End-to-end development for client projects.',                  tags: ['Full Stack', 'React', 'Node.js'] },
  { icon: 'smartphone',     title: 'Mobile Developer',          type: 'Full-time', desc: 'Cross-platform mobile apps with React Native.',                tags: ['React Native', 'iOS', 'Android'] },
  { icon: 'design_services',title: 'UI/UX Designer',            type: 'Full-time', desc: 'Craft premium design systems and user experiences.',           tags: ['Figma', 'Design Systems', 'Prototyping'] },
]
</script>

<style scoped>
.community-view { background: var(--background); }

/* Hero border uses design token */
.page-hero {
  background: var(--background);
  padding: 5rem 1.25rem 3rem;
  border-bottom: 1px solid var(--outline-variant);
}

@media (min-width: 640px) {
  .page-hero { padding: 6rem 1.5rem 3.5rem; }
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
}

/* Hero tag — uses design tokens for dark mode */
.hero-tag {
  display: inline-flex;
  padding: 0.3rem 0.875rem;
  background: var(--surface-container-low);
  border: 1px solid var(--glass-border-primary);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
}

.hero-headline {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: var(--on-surface);
  max-width: 640px;
}

.hero-sub {
  font-size: clamp(0.95rem, 2vw, 1.125rem);
  color: var(--on-surface-variant);
  line-height: 1.65;
  max-width: 520px;
}

/* Jobs section — uses design token for dark mode */
.jobs-section { background: var(--surface-container-low); }

.jobs-header { margin-bottom: 1.5rem; }

.jobs-list { display: flex; flex-direction: column; gap: 0.875rem; }

.job-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
}

@media (min-width: 768px) {
  .job-card {
    flex-direction: row;
    align-items: center;
    padding: 1.25rem 1.5rem;
  }
}

.job-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: rgba(99,14,212,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.job-icon { font-size: 24px; color: var(--primary); }

.job-info { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; min-width: 0; }

.job-header-row {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.job-title {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--on-surface);
}

.job-badges { display: flex; gap: 0.375rem; flex-wrap: wrap; }

.job-desc {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
}

.job-tags { display: flex; flex-wrap: wrap; gap: 0.375rem; }

.job-apply {
  flex-shrink: 0;
  font-size: 0.875rem;
  padding: 0.5rem 1.25rem;
  align-self: flex-start;
}

@media (min-width: 768px) {
  .job-apply { align-self: center; }
}
</style>
