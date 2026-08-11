<template>
  <section class="community-section">

    <!-- ═══════════════════════════════════════════════════════════
         STATS ROW
    ═══════════════════════════════════════════════════════════ -->
    <div class="stats-band">
      <div class="container-gfd">
        <div class="stats-grid animate-fade-in-up">
          <div
            v-for="stat in communityStats"
            :key="stat.label"
            class="stat-card glass-card hover-lift"
          >
            <div class="stat-top-bar" aria-hidden="true"></div>
            <span class="stat-value text-gradient">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════
         BENEFITS GRID
    ═══════════════════════════════════════════════════════════ -->
    <div class="benefits-band">
      <div class="container-gfd">
        <!-- Header -->
        <div class="band-header animate-fade-in-up">
          <span class="band-label">WHY GFD</span>
          <h2 class="band-title">Built for Elite Developers</h2>
          <p class="band-sub">Everything you need to collaborate, grow, and get hired — in one ecosystem.</p>
        </div>

        <!-- Grid -->
        <div class="benefits-grid">
          <div
            v-for="(benefit, i) in benefits"
            :key="benefit.title"
            class="benefit-card glass-card animate-fade-in-up"
            :class="`delay-${(i % 4) * 100}`"
          >
            <div class="benefit-icon-wrap">
              <span class="material-symbols-outlined benefit-icon">{{ benefit.icon }}</span>
            </div>
            <h4 class="benefit-title">{{ benefit.title }}</h4>
            <p class="benefit-desc">{{ benefit.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════
         SOCIAL MEDIA SECTION
    ═══════════════════════════════════════════════════════════ -->
    <div class="socials-band">
      <div class="container-gfd">
        <div class="band-header animate-fade-in-up">
          <h2 class="band-title">Join Us on Social Media</h2>
          <p class="band-sub">Follow our community channels, get updates, and connect with the GFD network.</p>
        </div>

        <div class="socials-grid animate-fade-in-up delay-100">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="social-card"
          >
            <!-- Branded top area -->
            <div class="social-top" :style="{ background: social.bg }">
              <img :src="social.logo" :alt="social.label" class="social-logo" />
            </div>
            <!-- Bottom info -->
            <div class="social-bottom">
              <div class="social-info">
                <span class="social-name">{{ social.label }}</span>
                <span class="social-handle">{{ social.handle }}</span>
              </div>
              <span class="material-symbols-outlined social-arrow">arrow_outward</span>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════
         JOIN GFD CTA BANNER
    ═══════════════════════════════════════════════════════════ -->
    <div class="join-band">
      <div class="container-gfd">
        <div class="join-banner animate-fade-in-up delay-200">
          <!-- Ambient orbs inside strip -->
          <div class="join-orb join-orb-1" aria-hidden="true"></div>
          <div class="join-orb join-orb-2" aria-hidden="true"></div>

          <div class="join-text">
            <h3 class="join-title">Ready to Join GFD?</h3>
            <p class="join-desc">
              Apply to become part of our elite developer community. We're always looking for talented engineers.
            </p>
          </div>
          <div class="join-actions">
            <RouterLink to="/auth/register" class="join-btn-white">
              Join the Community
              <span class="material-symbols-outlined" style="font-size:17px">arrow_forward</span>
            </RouterLink>
            <RouterLink to="/auth/register" class="join-btn-outline">
              View Open Roles
            </RouterLink>
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
    const res = await fetch(`${baseUrl}/explore/stats`)
    if (res.ok) {
      const data = await res.json()
      communityStats.value = [
        { value: data.developers > 0 ? data.developers + '+' : '0', label: 'Active Developers' },
        { value: data.companies_hiring > 0 ? data.companies_hiring + '+' : '0', label: 'Companies Hiring' },
        { value: data.projects_delivered > 0 ? data.projects_delivered + '+' : '0', label: 'Projects Delivered' },
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

const socials = [
  {
    label: 'Instagram',
    handle: '@glob.aldevs',
    url: 'https://www.instagram.com/glob.aldevs?igsh=MXZ1dWcyb3JpN2k1cQ%3D%3D&utm_source=qr',
    bg: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
  },
  {
    label: 'TikTok',
    handle: '@global_devs',
    url: 'https://www.tiktok.com/@global_devs',
    bg: '#010101',
    logo: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg',
  },
  {
    label: 'X (Twitter)',
    handle: '@globalfdst',
    url: 'https://x.com/globalfdst',
    bg: '#000000',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg',
  },
  {
    label: 'WhatsApp Community',
    handle: 'Join our group',
    url: 'https://chat.whatsapp.com/BHvYymbItGiBbVGwGaJgRH?s=cl&p=i&ilr=1',
    bg: '#25D366',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
  },
]
</script>

<style scoped>
/* ─── Section shell ─────────────────────────────────────────────── */
.community-section {
  background: var(--background);
  overflow-x: hidden;
}

/* ─── Shared band layout ────────────────────────────────────────── */
.stats-band,
.benefits-band,
.socials-band,
.join-band {
  padding: 4rem 1.25rem;
}
.stats-band    { background: var(--background); }
.benefits-band { background: var(--surface-container-low); }
.socials-band  { background: var(--background); }
.join-band     { background: var(--surface-container-low); padding-bottom: 5rem; }

/* Shared band header */
.band-header {
  text-align: center;
  margin-bottom: 2.5rem;
}
.band-label {
  display: inline-block;
  font-family: var(--font-headline);
  font-size: 0.73rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--primary);
  margin-bottom: 0.6rem;
}
.band-title {
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin: 0 0 0.6rem;
}
.band-sub {
  font-size: 1rem;
  color: var(--on-surface-variant);
  line-height: 1.65;
  max-width: 520px;
  margin: 0 auto;
}

/* ─── STATS ─────────────────────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.875rem;
}
@media (min-width: 768px) {
  .stats-grid { grid-template-columns: repeat(4, 1fr); }
}

.stat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.75rem 1rem;
  text-align: center;
  min-height: 120px;
  overflow: hidden;
}
.stat-top-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--gradient-primary);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}
.stat-value {
  font-family: var(--font-headline);
  font-size: clamp(1.9rem, 5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}
.stat-label {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  line-height: 1.3;
}

/* ─── BENEFITS ──────────────────────────────────────────────────── */
.benefits-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;
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
  gap: 0.75rem;
  padding: 1.5rem;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  cursor: default;
}
.benefit-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(99, 14, 212, 0.3);
}
[data-theme="dark"] .benefit-card:hover {
  border-color: rgba(168, 85, 247, 0.35);
}

.benefit-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-xl);
  background: rgba(99, 14, 212, 0.09);
  border: 1px solid rgba(99, 14, 212, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.22s ease, border-color 0.22s ease;
}
[data-theme="dark"] .benefit-icon-wrap {
  background: rgba(168, 85, 247, 0.12);
  border-color: rgba(168, 85, 247, 0.2);
}
.benefit-card:hover .benefit-icon-wrap {
  background: var(--primary);
  border-color: var(--primary);
}
.benefit-icon {
  font-size: 24px;
  color: var(--primary);
  transition: color 0.22s ease;
}
.benefit-card:hover .benefit-icon {
  color: #ffffff;
}

.benefit-title {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.3;
}
.benefit-desc {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.65;
}

/* ─── SOCIALS ───────────────────────────────────────────────────── */
.socials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.875rem;
}
@media (min-width: 640px) {
  .socials-grid { grid-template-columns: repeat(4, 1fr); }
}

.social-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  text-decoration: none;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  box-shadow: var(--shadow-sm);
}
.social-card:hover {
  transform: scale(1.03) translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Branded top area */
.social-top {
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  flex-shrink: 0;
}
.social-logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

/* Bottom area */
.social-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
}
.social-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}
.social-name {
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.social-handle {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.social-arrow {
  font-size: 18px;
  color: var(--primary);
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.social-card:hover .social-arrow {
  transform: translate(2px, -2px);
}

/* ─── JOIN CTA BANNER ───────────────────────────────────────────── */
.join-banner {
  position: relative;
  background: var(--gradient-primary);
  border-radius: var(--radius-2xl);
  padding: 2.5rem 2rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}
@media (min-width: 768px) {
  .join-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 2.5rem 3rem;
  }
}

.join-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(50px);
}
.join-orb-1 {
  width: 280px; height: 280px;
  background: rgba(255, 255, 255, 0.1);
  top: -100px; left: -60px;
}
.join-orb-2 {
  width: 200px; height: 200px;
  background: rgba(255, 255, 255, 0.07);
  bottom: -60px; right: -40px;
}

.join-text {
  position: relative;
  z-index: 1;
  max-width: 480px;
}
.join-title {
  font-family: var(--font-headline);
  font-size: clamp(1.25rem, 3.5vw, 1.75rem);
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin: 0 0 0.5rem;
}
.join-desc {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.65;
  margin: 0;
}

.join-actions {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}
@media (max-width: 479px) {
  .join-actions { flex-direction: column; }
}

.join-btn-white {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.625rem 1.375rem;
  border-radius: var(--radius-full);
  background: #ffffff;
  color: #630ed4;
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.join-btn-white:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.join-btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.625rem 1.375rem;
  border-radius: var(--radius-full);
  background: transparent;
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.5);
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s ease, transform 0.2s ease;
}
.join-btn-outline:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}
</style>
