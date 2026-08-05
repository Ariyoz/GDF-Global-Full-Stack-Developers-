<template>
  <section class="section-gfd feat-section">
    <div class="container-gfd">

      <div class="feat-head">
        <div>
          <div class="section-badge">Featured talent</div>
          <h2 class="feat-title">Top developers<br><span class="text-gradient">ready to hire</span></h2>
          <p class="feat-sub">Verified full-stack engineers available for your next project.</p>
        </div>
        <RouterLink to="/explore" class="feat-view-all">
          Browse all developers
          <span class="material-symbols-outlined" style="font-size:15px">arrow_forward</span>
        </RouterLink>
      </div>

      <!-- Skeleton -->
      <div v-if="loading" class="dev-grid">
        <div v-for="i in 6" :key="i" class="dev-skel shimmer" />
      </div>

      <!-- Cards -->
      <div v-else-if="developers.length" class="dev-grid">
        <div v-for="(dev, i) in developers" :key="dev.id"
          class="dev-card animate-fade-in-up"
          :class="[`delay-${i * 80}`, i >= 4 ? 'hide-mobile' : '']">

          <!-- Cover — uses user's banner if set, otherwise gradient -->
          <div class="dev-cover"
            :style="dev.banner
              ? `background-image:url('${dev.banner}');background-size:cover;background-position:center`
              : `background:${coverGrad(i)}`">
            <span v-if="dev.available" class="dev-live">
              <span class="live-dot" />Available
            </span>
          </div>

          <!-- Avatar sits OUTSIDE the cover, pulled up with negative margin — never clipped -->
          <div class="dev-av-wrap">
            <img v-if="dev.avatar" :src="dev.avatar" :alt="dev.name" class="dev-av-img" />
            <div v-else class="dev-av-ini" :style="`background:${avatarColor(i)}`">
              {{ initials(dev.name) }}
            </div>
          </div>

          <!-- Body -->
          <div class="dev-body">
            <div class="dev-name-row">
              <div>
                <h3 class="dev-name">{{ dev.name }}</h3>
                <p class="dev-role">{{ dev.role }}</p>
              </div>
              <div class="dev-rating">
                <span class="material-symbols-outlined" style="font-size:13px;color:#f59e0b;font-variation-settings:'FILL' 1">star</span>
                {{ dev.rating }}
              </div>
            </div>

            <p class="dev-bio">{{ dev.bio }}</p>

            <!-- Skills -->
            <div class="dev-skills">
              <span v-for="tag in dev.tags.slice(0, 3)" :key="tag" class="dev-skill">{{ tag }}</span>
              <span v-if="dev.tags.length > 3" class="dev-skill dev-skill-more">+{{ dev.tags.length - 3 }}</span>
            </div>

            <!-- Footer -->
            <div class="dev-foot">
              <div class="dev-meta">
                <span class="material-symbols-outlined" style="font-size:14px;color:var(--outline)">work_outline</span>
                <span class="dev-meta-txt">{{ dev.projects }} projects</span>
              </div>
              <div class="dev-foot-btns">
                <RouterLink :to="`/developer/${dev.id}`" class="dev-btn-portfolio">Portfolio</RouterLink>
                <RouterLink :to="`/hire?dev=${dev.id}&name=${encodeURIComponent(dev.name)}`" class="dev-btn-hire">
                  <span class="material-symbols-outlined" style="font-size:13px">handshake</span>
                  Hire
                </RouterLink>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Empty -->
      <div v-else class="feat-empty">
        <span class="material-symbols-outlined" style="font-size:2.5rem;opacity:.2">people</span>
        <p>Be the first to <RouterLink to="/auth/register" style="color:var(--primary)">join GFD</RouterLink> as a developer!</p>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/services/http'

const developers = ref([])
const loading    = ref(true)

const COVER_GRADS = [
  'linear-gradient(135deg,#1a0840 0%,#3b0f82 100%)',
  'linear-gradient(135deg,#041036 0%,#0c2ea8 100%)',
  'linear-gradient(135deg,#052010 0%,#0a6630 100%)',
  'linear-gradient(135deg,#2a0020 0%,#8b0060 100%)',
  'linear-gradient(135deg,#1a1000 0%,#7a4500 100%)',
  'linear-gradient(135deg,#000f2a 0%,#00408a 100%)',
]
const AVATAR_COLORS = ['#7c3aed','#2563eb','#16a34a','#db2777','#d97706','#0891b2']

function coverGrad(i) { return COVER_GRADS[i % COVER_GRADS.length] }
function avatarColor(i) { return AVATAR_COLORS[i % AVATAR_COLORS.length] }
function initials(name) {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

onMounted(async () => {
  try {
    const data = await http.get('/explore/developers?limit=8')
    developers.value = (data.developers || []).map(d => ({
      id:        d.id,
      name:      d.full_name || d.username || 'Developer',
      role:      d.job_title || d.experience_level || 'Full-Stack Developer',
      avatar:    d.avatar,
      banner:    d.banner || d.cover_image || d.banner_image || null,
      tags:      (d.skills || []).slice(0, 5),
      bio:       d.bio?.slice(0, 70) || 'Available for hire on GFD.',
      rating:    '5.0',
      projects:  d.projects_count || 0,
      available: d.available_for_hire !== false,
    }))
  } catch { /* not authenticated or API error */ }
  finally { loading.value = false }
})
</script>

<style scoped>
.feat-section { background: var(--background); }

/* Header */
.feat-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;
}
.section-badge {
  display: inline-flex; padding: .3rem .875rem; margin-bottom: .5rem;
  background: var(--primary-fixed); color: var(--primary);
  border-radius: 999px; font-family: var(--font-headline);
  font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
}
.feat-title {
  font-family: var(--font-headline); font-size: clamp(1.5rem, 3.5vw, 2.2rem);
  font-weight: 900; letter-spacing: -.03em; line-height: 1.1; color: var(--on-surface);
}
.feat-sub { font-size: .9rem; color: var(--on-surface-variant); margin-top: .375rem; }
.feat-view-all {
  display: inline-flex; align-items: center; gap: .3rem;
  font-family: var(--font-headline); font-size: .875rem; font-weight: 600;
  color: var(--primary); text-decoration: none; white-space: nowrap; flex-shrink: 0;
  transition: gap .15s;
}
.feat-view-all:hover { gap: .5rem; }

/* Grid — single col on very small screens to prevent clipping */
.dev-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: .875rem;
}
@media (min-width: 480px)  { .dev-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px)  { .dev-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1100px) { .dev-grid { grid-template-columns: repeat(4, 1fr); } }

/* Skeleton */
.dev-skel { height: 220px; border-radius: 16px; }
.shimmer {
  background: linear-gradient(90deg, var(--surface-container) 25%, var(--surface-container-high) 50%, var(--surface-container) 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Card */
.dev-card {
  border-radius: 16px;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  transition: transform .2s, box-shadow .2s, border-color .2s;
  position: relative; /* needed for absolute avatar */
  overflow: visible;  /* must NOT clip the avatar */
}
.dev-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--primary); }

/* Hide cards 5-8 on mobile — only show 4 */
@media (max-width: 767px) { .hide-mobile { display: none; } }

/* Cover */
.dev-cover {
  position: relative; height: 64px;
  border-radius: 15px 15px 0 0; overflow: hidden;
}
.dev-live {
  position: absolute; top: .5rem; right: .5rem;
  display: inline-flex; align-items: center; gap: .3rem;
  padding: .18rem .55rem; border-radius: 999px;
  background: rgba(0,0,0,.4); backdrop-filter: blur(6px);
  color: #4ade80; font-size: .62rem; font-weight: 700;
  border: 1px solid rgba(34,197,94,.3);
}
.live-dot { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }

/* Avatar — absolute positioned over the cover/body boundary */
.dev-card { position: relative; }
.dev-av-wrap {
  width: 56px; height: 56px; border-radius: 50%;
  border: 3px solid var(--surface-container-lowest);
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,.25);
  background: var(--surface-container);
  position: absolute;
  top: 36px; /* cover is 64px tall, avatar is 56px — centres it at the boundary: 64 - 56/2 = 36 */
  left: .875rem;
  z-index: 10;
}
.dev-av-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.dev-av-ini {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-headline); font-size: 1rem; font-weight: 800; color: #fff;
}

/* Body — top padding leaves room for the half-protruding avatar (56px avatar, 64px cover = 28px hangs below cover) */
.dev-body { padding: 2rem .875rem .875rem; display: flex; flex-direction: column; gap: .375rem; }
.dev-name-row { display: flex; align-items: flex-start; justify-content: space-between; gap: .375rem; margin-top: .25rem; }
.dev-name { font-family: var(--font-headline); font-size: .875rem; font-weight: 800; color: var(--on-surface); line-height: 1.2; }
.dev-role { font-size: .7rem; color: var(--primary); font-weight: 600; margin-top: .1rem; }
.dev-rating {
  display: flex; align-items: center; gap: .15rem;
  font-family: var(--font-headline); font-size: .72rem; font-weight: 700;
  color: var(--on-surface-variant); flex-shrink: 0;
}
.dev-bio {
  font-size: .75rem; color: var(--on-surface-variant); line-height: 1.45;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}
.dev-skills { display: flex; flex-wrap: wrap; gap: .25rem; }
.dev-skill {
  padding: .12rem .45rem; border-radius: 999px;
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .62rem; font-weight: 600;
  color: var(--on-surface-variant);
}
.dev-skill-more { background: var(--primary-fixed); color: var(--primary); border-color: transparent; }

/* Footer */
.dev-foot {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: .5rem; border-top: 1px solid var(--outline-variant); gap: .375rem;
  flex-wrap: nowrap; /* keep on one line always */
}
.dev-meta { display: flex; align-items: center; gap: .25rem; min-width: 0; flex-shrink: 1; }
.dev-meta-txt { font-size: .7rem; color: var(--on-surface-variant); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dev-foot-btns { display: flex; gap: .3rem; flex-shrink: 0; }

.dev-btn-portfolio {
  padding: .3rem .5rem; border-radius: 7px;
  background: var(--surface-container-high); border: 1px solid var(--outline-variant);
  font-family: var(--font-headline); font-size: .7rem; font-weight: 600;
  color: var(--on-surface); text-decoration: none; transition: all .15s;
  white-space: nowrap;
}
.dev-btn-portfolio:hover { border-color: var(--outline); }

.dev-btn-hire {
  display: inline-flex; align-items: center; gap: .25rem;
  padding: .4rem .65rem; border-radius: 8px;
  background: var(--primary); color: #fff; border: none;
  font-family: var(--font-headline); font-size: .75rem; font-weight: 700;
  text-decoration: none; transition: opacity .15s;
  box-shadow: 0 2px 10px rgba(99,14,212,.25); white-space: nowrap;
}
.dev-btn-hire:hover { opacity: .9; }

/* Empty */
.feat-empty {
  display: flex; flex-direction: column; align-items: center; gap: .5rem;
  padding: 4rem 1rem; color: var(--on-surface-variant); font-size: .9rem; text-align: center;
}
</style>
