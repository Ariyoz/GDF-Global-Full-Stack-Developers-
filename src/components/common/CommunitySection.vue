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

      <!-- Socials -->
      <div class="socials-wrap animate-fade-in-up delay-300">
        <h3 class="socials-title">Join Us on Social Media</h3>
        <p class="socials-sub">Follow our community channels, get updates, and connect with the GFD network.</p>
        <div class="socials-grid">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="social-card glass-card"
          >
            <div class="social-icon-wrap" :style="{ background: social.bg }">
              <img :src="social.logo" :alt="social.label" class="social-logo" />
            </div>
            <div class="social-info">
              <span class="social-label">{{ social.label }}</span>
              <span class="social-handle">{{ social.handle }}</span>
            </div>
            <span class="material-symbols-outlined social-arrow">arrow_outward</span>
          </a>
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
    const res = await fetch(`${baseUrl}/explore/stats`)
    if (res.ok) {
      const data = await res.json()
      communityStats.value = [
        { value: String(data.developers || 0), label: 'Active Developers' },
        { value: String(data.companies_hiring || 0), label: 'Companies Hiring' },
        { value: String(data.projects_delivered || 0), label: 'Projects Delivered' },
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

/* Socials */
.socials-wrap {
  margin-bottom: 2rem;
  text-align: center;
}

.socials-title {
  font-family: var(--font-headline);
  font-size: clamp(1.1rem, 3vw, 1.375rem);
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 0.375rem;
}

.socials-sub {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.socials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.875rem;
  text-align: left;
}

@media (min-width: 640px) {
  .socials-grid { grid-template-columns: repeat(4, 1fr); }
}

.social-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.25rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.social-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.social-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 10px;
}

.social-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.social-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.social-label {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--on-surface);
}

.social-handle {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
}

.social-arrow {
  font-size: 18px;
  color: var(--primary);
  align-self: flex-end;
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
