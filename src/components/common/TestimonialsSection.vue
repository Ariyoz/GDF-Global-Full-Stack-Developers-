<template>
  <section class="section-gfd t-section">
    <div class="container-gfd">

      <div class="t-header">
        <div class="section-badge">Testimonials</div>
        <h2 class="t-title">Loved by builders<br><span class="text-gradient">everywhere</span></h2>
        <p class="t-sub">Real stories from developers and clients who found their match on GFD.</p>
      </div>

      <div class="t-grid">
        <div v-for="(t, i) in testimonials" :key="t.name"
          class="t-card glass-card animate-fade-in-up"
          :class="`delay-${(i%3)*150}`"
          :style="i===0 ? 'border-color:rgba(99,14,212,.3)' : ''">
          <!-- Quote mark -->
          <div class="t-quote-mark">"</div>
          <!-- Stars -->
          <div class="t-stars">
            <span v-for="n in 5" :key="n" class="t-star" style="font-variation-settings:'FILL' 1">★</span>
          </div>
          <!-- Quote -->
          <p class="t-quote">{{ t.quote }}</p>
          <!-- Author -->
          <div class="t-author">
            <div class="t-av-wrap">
              <img
                v-if="t.avatar"
                :src="t.avatar"
                :alt="t.name"
                class="t-av-img"
                loading="lazy"
                decoding="async"
                width="44"
                height="44"
                @error="$event.target.style.display='none'"
              />
              <div class="t-av-fallback" :style="`background:${t.bg}`">
                <span>{{ t.name[0] }}</span>
              </div>
            </div>
            <div>
              <p class="t-name">{{ t.name }}</p>
              <p class="t-role">{{ t.role }}</p>
            </div>
            <div class="t-type-badge" :class="t.type === 'developer' ? 'badge-dev' : 'badge-client'">
              {{ t.type === 'developer' ? 'Developer' : 'Client' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="t-cta">
        <p>Join thousands of developers and clients building the future</p>
        <RouterLink to="/auth/register" class="btn-primary">Get started free →</RouterLink>
      </div>

    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    name: 'Chidi Okonkwo',
    role: 'Frontend Lead · Lagos',
    type: 'developer',
    quote: 'GFD completely changed how I find clients. Within my first week I landed a ₦600k project. The platform is clean, fast, and the clients are serious.',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face&auto=format',
    bg: '#7c3aed',
  },
  {
    name: 'Amara Diallo',
    role: 'CTO, Fintech Startup · Accra',
    type: 'client',
    quote: 'We hired three developers through GFD and they delivered a production-ready product in 6 weeks. The quality is unmatched compared to other platforms.',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=80&h=80&fit=crop&crop=face&auto=format',
    bg: '#2563eb',
  },
  {
    name: 'Emeka Eze',
    role: 'Full-Stack Developer · Abuja',
    type: 'developer',
    quote: 'I was skeptical at first, but GFD has become my primary income source. The wallet feature is a game changer — withdrawals hit my bank same day.',
    avatar: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=80&h=80&fit=crop&crop=face&auto=format',
    bg: '#16a34a',
  },
  {
    name: 'Tunde Adeyemi',
    role: 'Founder, E-commerce Brand · Lagos',
    type: 'client',
    quote: 'Posted my project and had 12 quality applications within 24 hours. Hired within 48. The vetting process GFD does saves us so much time.',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=80&h=80&fit=crop&crop=face&auto=format',
    bg: '#db2777',
  },
  {
    name: 'Fatima Aliyu',
    role: 'React Native Developer · Kano',
    type: 'developer',
    quote: 'The community here is incredible. Not just jobs — I\'ve found collaborators, mentors, and friends. GFD is building something truly special for Africa.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face&auto=format',
    bg: '#d97706',
  },
  {
    name: 'Kwame Mensah',
    role: 'Product Manager, SaaS Co. · Nairobi',
    type: 'client',
    quote: 'Third time using GFD for projects. Every developer we\'ve hired has been exceptional. The platform keeps getting better with every update.',
    avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=80&h=80&fit=crop&crop=face&auto=format',
    bg: '#0891b2',
  },
]
</script>

<style scoped>
.t-section { background: var(--background); }

.t-header { text-align: center; margin-bottom: 3rem; display: flex; flex-direction: column; align-items: center; gap: .75rem; }

.section-badge {
  display: inline-flex; padding: .3rem .875rem;
  background: var(--primary-fixed); color: var(--primary);
  border-radius: 999px; font-family: var(--font-headline);
  font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
}
.t-title {
  font-family: var(--font-headline); font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 900; letter-spacing: -.03em; line-height: 1.1; color: var(--on-surface);
}
.t-sub { font-size: 1rem; color: var(--on-surface-variant); max-width: 460px; line-height: 1.6; }

.t-grid {
  display: grid; grid-template-columns: 1fr; gap: 1rem;
}
@media (min-width: 640px) { .t-grid { grid-template-columns: repeat(2,1fr); } }
@media (min-width: 1024px) { .t-grid { grid-template-columns: repeat(3,1fr); } }

.t-card {
  display: flex; flex-direction: column; gap: .875rem;
  padding: 1.5rem; position: relative; overflow: hidden;
  transition: transform .2s, border-color .2s, box-shadow .2s;
}
.t-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--primary); }

.t-quote-mark {
  position: absolute; top: -.5rem; right: 1rem;
  font-size: 5rem; line-height: 1; color: var(--primary);
  opacity: .08; font-family: Georgia, serif; font-weight: 900;
  pointer-events: none;
}
.t-stars { display: flex; gap: 1px; }
.t-star { color: #f59e0b; font-size: 1rem; }
.t-quote {
  font-size: .875rem; color: var(--on-surface-variant); line-height: 1.7; flex: 1;
}
.t-author {
  display: flex; align-items: center; gap: .625rem;
  padding-top: .875rem; border-top: 1px solid var(--outline-variant);
}
.t-av-wrap {
  width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
  position: relative; overflow: hidden;
  border: 2px solid var(--outline-variant);
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
}
.t-av-img {
  width: 100%; height: 100%; object-fit: cover;
  display: block; border-radius: 50%;
  position: relative; z-index: 2;
}
.t-av-fallback {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%; z-index: 1;
  font-family: var(--font-headline); font-weight: 800; color: #fff; font-size: .9rem;
}
.t-name { font-family: var(--font-headline); font-size: .875rem; font-weight: 700; color: var(--on-surface); }
.t-role { font-size: .72rem; color: var(--on-surface-variant); margin-top: .1rem; }
.t-type-badge {
  margin-left: auto; padding: .15rem .5rem; border-radius: 999px;
  font-size: .65rem; font-weight: 700; text-transform: capitalize; flex-shrink: 0;
}
.badge-dev  { background: rgba(99,14,212,.12);  color: var(--primary); }
.badge-client { background: rgba(59,130,246,.12); color: #3b82f6; }

/* Bottom CTA */
.t-cta {
  display: flex; flex-direction: column; align-items: center; gap: 1.25rem;
  margin-top: 3rem; text-align: center;
}
.t-cta p { font-size: 1rem; color: var(--on-surface-variant); }
</style>
