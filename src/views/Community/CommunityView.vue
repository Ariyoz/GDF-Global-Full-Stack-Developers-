<template>
  <div class="community-view">

    <!-- ═══════════════════════════════════════════════════════════
         HERO SECTION
    ═══════════════════════════════════════════════════════════ -->
    <section class="hero-section">
      <!-- Ambient orbs -->
      <div class="orb orb-1" aria-hidden="true"></div>
      <div class="orb orb-2" aria-hidden="true"></div>
      <div class="orb orb-3" aria-hidden="true"></div>
      <!-- Dot grid overlay -->
      <div class="dot-grid" aria-hidden="true"></div>

      <div class="container-gfd hero-inner">
        <!-- Animated badge -->
        <div class="hero-badge animate-fade-in-up">
          <span class="material-symbols-outlined badge-icon">groups</span>
          <span>Developer Ecosystem</span>
        </div>

        <!-- Headline -->
        <h1 class="hero-headline animate-fade-in-up delay-100">
          <span class="headline-plain">The GFD</span>
          <span class="headline-gradient text-gradient">Community</span>
        </h1>

        <!-- Subtext -->
        <p class="hero-sub animate-fade-in-up delay-200">
          Join 80+ elite developers collaborating, growing, and building the future together.
        </p>

        <!-- CTA buttons -->
        <div class="hero-ctas animate-fade-in-up delay-300">
          <RouterLink to="/auth/register" class="btn-primary hero-btn-primary">
            Join the Community
            <span class="material-symbols-outlined btn-arrow">arrow_forward</span>
          </RouterLink>
          <RouterLink to="/explore" class="btn-outline hero-btn-outline">
            Explore Developers
          </RouterLink>
        </div>

        <!-- Avatar stack -->
        <div class="avatar-stack animate-fade-in-up delay-400">
          <div class="avatars">
            <div class="avatar av-1">AK</div>
            <div class="avatar av-2">MJ</div>
            <div class="avatar av-3">RL</div>
            <div class="avatar av-4">TC</div>
            <div class="avatar av-5">SP</div>
          </div>
          <span class="avatar-label">
            <span class="avatar-dot"></span>
            80+ developers worldwide
          </span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         COMMUNITY SECTION (stats + benefits + socials + cta)
    ═══════════════════════════════════════════════════════════ -->
    <CommunitySection />

    <!-- ═══════════════════════════════════════════════════════════
         OPEN ROLES SECTION
    ═══════════════════════════════════════════════════════════ -->
    <section class="roles-section" id="jobs">
      <!-- Gradient top edge -->
      <div class="roles-top-edge" aria-hidden="true"></div>

      <div class="container-gfd">
        <!-- Section header -->
        <div class="roles-header animate-fade-in-up">
          <span class="roles-label">CAREERS</span>
          <h2 class="roles-title">Open Roles at GFD</h2>
          <p class="roles-sub">
            Join a high-performance team building premium products for global clients.
          </p>
        </div>

        <!-- Job cards -->
        <div class="jobs-list">
          <div
            v-for="(job, i) in jobs"
            :key="job.title"
            class="job-card animate-fade-in-up"
            :class="`delay-${(i % 4) * 100}`"
          >
            <!-- Left: icon box -->
            <div class="job-icon-box">
              <span class="material-symbols-outlined job-icon">{{ job.icon }}</span>
            </div>

            <!-- Middle: info -->
            <div class="job-info">
              <h4 class="job-title">{{ job.title }}</h4>
              <p class="job-desc">{{ job.desc }}</p>
              <div class="job-tags">
                <span v-for="tag in job.tags" :key="tag" class="chip">{{ tag }}</span>
              </div>
            </div>

            <!-- Right: badges + apply -->
            <div class="job-right">
              <div class="job-badges">
                <span class="chip chip-primary">{{ job.type }}</span>
                <span class="chip job-chip-remote">Remote</span>
              </div>
              <RouterLink to="/auth/register" class="btn-primary job-apply-btn">
                Apply
                <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         CTA BANNER
    ═══════════════════════════════════════════════════════════ -->
    <section class="cta-strip">
      <div class="cta-orb cta-orb-1" aria-hidden="true"></div>
      <div class="cta-orb cta-orb-2" aria-hidden="true"></div>

      <div class="container-gfd cta-inner">
        <div class="cta-text">
          <h2 class="cta-headline">Ready to build the future?</h2>
          <p class="cta-subtext">
            Become part of the GFD developer network. Elite projects, real opportunities, global reach.
          </p>
        </div>
        <div class="cta-actions">
          <RouterLink to="/auth/register" class="cta-btn-white">
            Join Now
            <span class="material-symbols-outlined" style="font-size:18px">arrow_forward</span>
          </RouterLink>
          <RouterLink to="/explore" class="cta-btn-outline">
            Learn More
          </RouterLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { useSeo, pageSeo } from '@/composables/useSeo'
import CommunitySection from '@/components/common/CommunitySection.vue'

useSeo(pageSeo.community)

const jobs = [
  { icon: 'palette',        title: 'Senior Frontend Developer', type: 'Full-time', desc: 'Build premium UIs with Vue.js and modern CSS.',                tags: ['Vue.js', 'Tailwind', 'JavaScript'] },
  { icon: 'settings',       title: 'Backend Engineer',          type: 'Full-time', desc: 'Design and build scalable APIs and microservices.',            tags: ['Node.js', 'PostgreSQL', 'Redis'] },
  { icon: 'code',           title: 'Full Stack Developer',      type: 'Contract',  desc: 'End-to-end development for client projects.',                  tags: ['Full Stack', 'React', 'Node.js'] },
  { icon: 'smartphone',     title: 'Mobile Developer',          type: 'Full-time', desc: 'Cross-platform mobile apps with React Native.',                tags: ['React Native', 'iOS', 'Android'] },
  { icon: 'design_services',title: 'UI/UX Designer',            type: 'Full-time', desc: 'Craft premium design systems and user experiences.',           tags: ['Figma', 'Design Systems', 'Prototyping'] },
]
</script>

<style scoped>
/* ─── Base ─────────────────────────────────────────────────────── */
.community-view {
  background: var(--background);
  overflow-x: hidden;
}

/* ─── HERO ──────────────────────────────────────────────────────── */
.hero-section {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  padding: 6rem 1.25rem 4rem;
  overflow: hidden;
  background: var(--background);
  border-bottom: 1px solid var(--outline-variant);
}

/* Ambient orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.45;
}
.orb-1 {
  width: 520px; height: 520px;
  background: radial-gradient(circle, #630ed4 0%, transparent 70%);
  top: -160px; left: -100px;
  opacity: 0.25;
}
.orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
  bottom: -120px; right: -60px;
  opacity: 0.2;
}
.orb-3 {
  width: 260px; height: 260px;
  background: radial-gradient(circle, #a855f7 0%, transparent 70%);
  top: 40%; left: 55%;
  opacity: 0.15;
}

/* Dot grid */
.dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--outline-variant) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.35;
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  max-width: 680px;
  margin: 0 auto;
}

/* Badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.375rem 1rem;
  border-radius: var(--radius-full);
  background: rgba(99, 14, 212, 0.08);
  border: 1px solid rgba(99, 14, 212, 0.22);
  font-family: var(--font-headline);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--primary);
  letter-spacing: 0.02em;
}
[data-theme="dark"] .hero-badge {
  background: rgba(168, 85, 247, 0.12);
  border-color: rgba(168, 85, 247, 0.28);
}
.badge-icon { font-size: 17px; }

/* Headline */
.hero-headline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1em;
  font-family: var(--font-headline);
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--on-surface);
  margin: 0;
}
.headline-plain { display: block; }
.headline-gradient { display: block; }

/* Sub */
.hero-sub {
  font-size: clamp(1rem, 2.2vw, 1.175rem);
  color: var(--on-surface-variant);
  line-height: 1.7;
  max-width: 480px;
  margin: 0;
}

/* CTA buttons */
.hero-ctas {
  display: flex;
  gap: 0.875rem;
  flex-wrap: wrap;
  justify-content: center;
}
.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9375rem;
}
.btn-arrow { font-size: 18px; }
.hero-btn-outline {
  font-size: 0.9375rem;
}

/* Avatar stack */
.avatar-stack {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}
.avatars {
  display: flex;
  align-items: center;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2.5px solid var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-headline);
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  margin-left: -10px;
  position: relative;
  letter-spacing: 0.01em;
}
.avatars .avatar:first-child { margin-left: 0; }
.av-1 { background: linear-gradient(135deg, #630ed4, #7c3aed); z-index: 5; }
.av-2 { background: linear-gradient(135deg, #2563eb, #4f46e5); z-index: 4; }
.av-3 { background: linear-gradient(135deg, #059669, #0d9488); z-index: 3; }
.av-4 { background: linear-gradient(135deg, #d97706, #dc2626); z-index: 2; }
.av-5 { background: linear-gradient(135deg, #7c3aed, #a855f7); z-index: 1; }

.avatar-label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  font-weight: 500;
}
.avatar-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.25);
  flex-shrink: 0;
}

/* ─── OPEN ROLES ────────────────────────────────────────────────── */
.roles-section {
  position: relative;
  background: var(--surface-container-low);
  padding: 5rem 1.25rem;
}
.roles-top-edge {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--gradient-primary);
  opacity: 0.6;
}

/* Header */
.roles-header {
  text-align: center;
  margin-bottom: 2.5rem;
}
.roles-label {
  display: inline-block;
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--primary);
  margin-bottom: 0.75rem;
}
.roles-title {
  font-family: var(--font-headline);
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin: 0 0 0.6rem;
}
.roles-sub {
  font-size: 1rem;
  color: var(--on-surface-variant);
  line-height: 1.65;
  max-width: 480px;
  margin: 0 auto;
}

/* Job list */
.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 900px;
  margin: 0 auto;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  box-shadow: var(--shadow-md);
}

.job-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.375rem 1.5rem;
  border-left: 3px solid transparent;
  border-bottom: 1px solid var(--outline-variant);
  transition: background 0.2s ease, border-color 0.2s ease;
  background: var(--surface-container-lowest);
}
.job-card:last-child {
  border-bottom: none;
}
.job-card:hover {
  background: var(--surface-container-low);
  border-left-color: var(--primary);
}

@media (min-width: 768px) {
  .job-card {
    flex-direction: row;
    align-items: center;
    gap: 1.25rem;
  }
}

/* Icon box */
.job-icon-box {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: rgba(99, 14, 212, 0.08);
  border: 1px solid rgba(99, 14, 212, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s ease;
}
[data-theme="dark"] .job-icon-box {
  background: rgba(168, 85, 247, 0.12);
  border-color: rgba(168, 85, 247, 0.2);
}
.job-card:hover .job-icon-box {
  background: rgba(99, 14, 212, 0.13);
}
.job-icon {
  font-size: 22px;
  color: var(--primary);
}

/* Info */
.job-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}
.job-title {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.job-desc {
  font-size: 0.8375rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
}
.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

/* Right side */
.job-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
@media (min-width: 768px) {
  .job-right {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.625rem;
    flex-shrink: 0;
  }
}
.job-badges {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.job-chip-remote {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.25);
}
[data-theme="dark"] .job-chip-remote {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
  border-color: rgba(74, 222, 128, 0.2);
}
.job-apply-btn {
  font-size: 0.8125rem;
  padding: 0.4rem 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
}

/* ─── CTA STRIP ─────────────────────────────────────────────────── */
.cta-strip {
  position: relative;
  background: var(--gradient-primary);
  padding: 4rem 1.25rem;
  overflow: hidden;
}
.cta-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(60px);
}
.cta-orb-1 {
  width: 340px; height: 340px;
  background: rgba(255, 255, 255, 0.08);
  top: -100px; left: -80px;
}
.cta-orb-2 {
  width: 260px; height: 260px;
  background: rgba(255, 255, 255, 0.07);
  bottom: -80px; right: -40px;
}

.cta-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.75rem;
}
@media (min-width: 768px) {
  .cta-inner {
    flex-direction: row;
    text-align: left;
    justify-content: space-between;
    align-items: center;
  }
}

.cta-text { max-width: 520px; }
.cta-headline {
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin: 0 0 0.6rem;
}
.cta-subtext {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.65;
  margin: 0;
}

.cta-actions {
  display: flex;
  gap: 0.875rem;
  flex-wrap: wrap;
  justify-content: center;
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .cta-actions { justify-content: flex-end; }
}

.cta-btn-white {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius-full);
  background: #ffffff;
  color: #630ed4;
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  white-space: nowrap;
}
.cta-btn-white:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.cta-btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius-full);
  background: transparent;
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.55);
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease;
  white-space: nowrap;
}
.cta-btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}
</style>
