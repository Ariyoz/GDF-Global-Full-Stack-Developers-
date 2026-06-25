<template>
  <section class="section-gfd trending-section">
    <div class="container-gfd">
      <!-- Header -->
      <div class="section-top">
        <div>
          <h2 class="text-headline-lg">Trending Projects</h2>
          <p class="text-body-md" style="margin-top:0.25rem">Exceptional work from our global community.</p>
        </div>
        <RouterLink to="/projects" class="view-all-link">
          View all
          <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span>
        </RouterLink>
      </div>

      <!-- Projects Grid -->
      <div class="trending-grid" v-if="projects.length">
        <div
          v-for="(project, i) in projects.slice(0, 4)"
          :key="project.id"
          class="trending-card"
          :class="{ 'trending-card-large': i === 0 }"
        >
          <div class="trending-card-inner">
            <span v-if="i === 0" class="trending-badge">TRENDING</span>

            <div class="trending-card-content">
              <h3 class="trending-card-title">{{ project.title }}</h3>
              <p class="trending-card-desc">
                {{ project.description?.slice(0, 100) }}{{ (project.description?.length || 0) > 100 ? '…' : '' }}
              </p>

              <!-- Tech skills -->
              <div v-if="project.skills_needed?.length" class="trending-card-skills">
                <span v-for="skill in project.skills_needed.slice(0, 3)" :key="skill" class="trending-skill">{{ skill }}</span>
              </div>
            </div>

            <!-- Footer: links + stats -->
            <div class="trending-card-footer">
              <!-- URL Links -->
              <div class="trending-links">
                <a v-if="project.live_url" :href="project.live_url" target="_blank" rel="noopener"
                  class="trend-link-btn" title="Live Demo" @click.stop>
                  <span class="material-symbols-outlined" style="font-size:15px">rocket_launch</span>
                  Demo
                </a>
                <a v-if="project.repo_url" :href="project.repo_url" target="_blank" rel="noopener"
                  class="trend-link-btn" title="Source Code" @click.stop>
                  <span class="material-symbols-outlined" style="font-size:15px">code</span>
                  Code
                </a>
              </div>

              <!-- Stats -->
              <div class="trending-card-stats">
                <span class="trending-stat">
                  <span class="material-symbols-outlined">visibility</span>
                  {{ formatCount(project.view_count) }}
                </span>
                <button
                  class="trending-stat like-stat"
                  :class="{ liked: project.is_liked }"
                  @click.stop="likeProject(project)"
                  :title="project.is_liked ? 'Unlike' : 'Like'"
                >
                  <span class="material-symbols-outlined"
                    :style="project.is_liked ? 'font-variation-settings:\'FILL\' 1' : ''">favorite</span>
                  {{ formatCount(project.like_count) }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Card -->
        <div class="trending-card trending-cta" @click="$router.push('/projects/upload')">
          <div class="trending-cta-inner">
            <span class="material-symbols-outlined" style="font-size:2.5rem;color:var(--primary)">add_circle</span>
            <h4 class="trending-cta-title">Submit Yours</h4>
            <p class="trending-cta-desc">Showcase to 500+ top companies.</p>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!loading" class="trending-empty">
        <p>No projects yet. Be the first to <RouterLink to="/projects/upload" style="color:var(--primary)">submit one</RouterLink>!</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/services/http'

const router = useRouter()
const projects = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await http.get('/projects?limit=4&sort=trending')
    projects.value = (data.projects || []).map(p => ({
      ...p,
      is_liked:  false,
      repo_url:  p.repository_url || p.github_url || p.repo_url || null,
      live_url:  p.live_url || null,
    }))
  } catch (err) {
    console.error('Failed to fetch trending projects:', err)
  } finally {
    loading.value = false
  }
})

async function likeProject(project) {
  try {
    const res = await http.post(`/projects/${project.id}/like`)
    // Backend returns { liked: true/false }
    project.is_liked   = res.liked
    project.like_count = res.liked
      ? (project.like_count || 0) + 1
      : Math.max((project.like_count || 1) - 1, 0)
  } catch (err) {
    // If not logged in, redirect to auth
    if (err?.response?.status === 401) {
      router.push('/auth/login')
    }
  }
}

function formatCount(count) {
  if (!count) return '0'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'k'
  return String(count)
}
</script>

<style scoped>
.trending-section { background: var(--background); }

.section-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
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

/* ── Trending Grid ── */
.trending-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .trending-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .trending-grid { grid-template-columns: repeat(3, 1fr); }
  .trending-card-large { grid-column: span 2; }
}

.trending-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.trending-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.trending-card-inner {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 180px;
}

.trending-badge {
  display: inline-block;
  padding: 0.2rem 0.625rem;
  background: var(--primary);
  color: var(--on-primary);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  width: fit-content;
}

.trending-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.trending-card-title {
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--on-surface);
}

.trending-card-large .trending-card-title {
  font-size: 1.3rem;
}

.trending-card-desc {
  font-size: 0.85rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
}

.trending-card-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: auto;
}

.trending-skill {
  padding: 0.2rem 0.5rem;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--on-surface-variant);
}

.trending-card-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 0.75rem;
}

/* Footer row: links on left, stats on right */
.trending-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--outline-variant);
  flex-wrap: wrap;
}

.trending-links {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.trend-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  text-decoration: none;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.trend-link-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(168,85,247,0.06);
}

.trending-stat {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: var(--on-surface-variant);
}

.trending-stat .material-symbols-outlined {
  font-size: 16px;
}

.like-stat {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  transition: all 0.15s ease;
}

.like-stat:hover {
  background: rgba(233, 30, 99, 0.08);
  color: #e91e63;
}

.like-stat.liked {
  color: #e91e63;
}

/* CTA Card */
.trending-cta {
  background: var(--surface-container-low);
  border: 1px dashed var(--outline-variant);
}

.trending-cta:hover {
  border-color: var(--primary);
  border-style: solid;
  background: var(--primary-fixed);
}

.trending-cta-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1.5rem;
  min-height: 180px;
  gap: 0.5rem;
}

.trending-cta-title {
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--on-surface);
}

.trending-cta-desc {
  font-size: 0.85rem;
  color: var(--on-surface-variant);
}

.trending-empty {
  text-align: center;
  padding: 2rem;
  color: var(--on-surface-variant);
  font-size: 0.9rem;
}
</style>
