<template>
  <section class="section-gfd featured-section">
    <div class="container-gfd">
      <!-- Header -->
      <div class="section-top">
        <div>
          <h2 class="text-headline-lg">Featured Developers</h2>
          <p class="text-body-md" style="margin-top:0.25rem">Top-rated full-stack talent currently available for hire.</p>
        </div>
        <RouterLink to="/explore" class="view-all-link">
          View all
          <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span>
        </RouterLink>
      </div>

      <!-- Grid -->
      <div class="devs-grid">
        <div
          v-for="(dev, i) in developers"
          :key="dev.name"
          class="dev-card glass-card animate-fade-in-up"
          :class="`delay-${i * 100}`"
        >
          <!-- Card Header -->
          <div class="dev-card-header">
            <div class="dev-avatar">
              <img v-if="dev.avatar" :src="dev.avatar" :alt="dev.name" class="dev-avatar-img" />
              <span v-else class="dev-initials">{{ initials(dev.name) }}</span>
              <span v-if="dev.available" class="dev-online-dot" />
            </div>
            <div class="dev-meta">
              <h3 class="dev-name">{{ dev.name }}</h3>
              <p class="dev-role">{{ dev.role }}</p>
            </div>
          </div>

          <!-- Tags -->
          <div class="dev-tags">
            <span v-for="tag in dev.tags" :key="tag" class="chip">{{ tag }}</span>
          </div>

          <!-- Bio -->
          <p class="dev-bio">{{ dev.bio }}</p>

          <!-- Footer -->
          <div class="dev-footer">
            <div class="dev-stats">
              <span class="dev-stat">
                <span class="material-symbols-outlined" style="font-size:13px;color:#f59e0b;font-variation-settings:'FILL' 1">star</span>
                {{ dev.rating }}
              </span>
              <span class="dev-stat">
                <span class="material-symbols-outlined" style="font-size:13px;color:var(--outline)">work</span>
                {{ dev.projects }} projects
              </span>
            </div>
            <div class="dev-footer-actions">
              <RouterLink :to="`/developer/${dev.id}`" class="btn-view">
                <span class="material-symbols-outlined" style="font-size:14px">person</span>
                Portfolio
              </RouterLink>
              <RouterLink :to="`/hire?dev=${dev.id}&name=${encodeURIComponent(dev.name)}`" class="btn-hire">
                <span class="material-symbols-outlined" style="font-size:14px">handshake</span>
                Hire
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/services/http'

const developers = ref([])

onMounted(async () => {
  try {
    const data = await http.get('/explore/developers?limit=6')
    developers.value = (data.developers || []).map(d => ({
      id: d.id,
      name: d.full_name || d.username,
      role: d.experience_level || 'Developer',
      avatar: d.avatar,
      tags: (d.skills || []).slice(0, 3),
      bio: d.bio || 'Available for hire on GFD.',
      rating: '5.0',
      projects: 0,
      available: d.available_for_hire !== false,
    }))
  } catch {
    // Not logged in or API error — show empty
  }
})

function initials(name) {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<style scoped>
/* Subtle tinted background — adapts to dark mode via CSS variable */
.featured-section {
  background: var(--surface-container-low);
}

/* Section header */
.section-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 0.25rem;
}
.view-all-link:hover { text-decoration: underline; }

/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */
.devs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 0 0.25rem;
}

@media (min-width: 640px) {
  .devs-grid { grid-template-columns: repeat(2, 1fr); padding: 0; }
}

@media (min-width: 1024px) {
  .devs-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Card */
.dev-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
}

/* Card header */
.dev-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dev-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--primary-fixed);
  border: 2px solid rgba(99,14,212,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.dev-initials {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
}

.dev-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-full);
}

.dev-online-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid var(--surface-container-lowest);
}

.dev-meta { min-width: 0; }

.dev-name {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dev-role {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--primary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Tags */
.dev-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

/* Bio */
.dev-bio {
  font-size: 0.82rem;
  color: var(--on-surface-variant);
  line-height: 1.45;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.dev-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--outline-variant);
}

.dev-stats {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.dev-stat {
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  white-space: nowrap;
}

/* Action buttons — side by side, equal width, compact */
.dev-footer-actions {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.btn-view,
.btn-hire {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.45rem 0.5rem;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline);
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-base);
  white-space: nowrap;
  border: none;
}

/* Portfolio — outlined style */
.btn-view {
  background: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  color: var(--on-surface);
}
.btn-view:hover {
  background: var(--surface-container-highest);
  border-color: var(--outline);
  color: var(--on-surface);
}

/* Hire — primary purple */
.btn-hire {
  background: var(--primary);
  color: var(--on-primary);
  box-shadow: 0 2px 10px rgba(99,14,212,0.25);
}
.btn-hire:hover {
  background: var(--primary-container);
  color: var(--on-primary);
  transform: translateY(-1px);
}
</style>
