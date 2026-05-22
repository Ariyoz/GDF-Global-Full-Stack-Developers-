<template>
  <div class="no-results-view">
    <div class="container-gfd no-results-inner">
      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-wrap">
          <span class="material-symbols-outlined search-icon">search</span>
          <input v-model="query" class="search-input" :placeholder="'Search for ' + lastQuery + '...'" @keyup.enter="handleSearch" />
          <button v-if="query" class="btn-ghost clear-btn" @click="query = ''">
            <span class="material-symbols-outlined" style="font-size:18px">close</span>
          </button>
        </div>
      </div>

      <!-- No Results State -->
      <div class="no-results-state animate-fade-in-up">
        <div class="no-results-icon-wrap">
          <span class="material-symbols-outlined no-results-icon">search_off</span>
        </div>
        <h2 class="no-results-title">No results for "{{ lastQuery }}"</h2>
        <p class="no-results-desc">
          We couldn't find any developers or projects matching your search.
          Try different keywords or browse our suggestions below.
        </p>

        <!-- Suggestions -->
        <div class="suggestions">
          <p class="suggestions-label">Try searching for:</p>
          <div class="suggestion-chips">
            <button
              v-for="s in suggestions"
              :key="s"
              class="suggestion-chip"
              @click="query = s; handleSearch()"
            >
              {{ s }}
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="no-results-actions">
          <RouterLink to="/explore" class="btn-primary">Browse All Developers</RouterLink>
          <RouterLink to="/projects" class="btn-outline">Explore Projects</RouterLink>
        </div>
      </div>

      <!-- You Might Like -->
      <div class="might-like">
        <h3 class="might-like-title">You might like</h3>
        <div class="might-like-grid">
          <div v-for="dev in suggestedDevs" :key="dev.name" class="suggested-card glass-card">
            <div class="suggested-avatar">{{ dev.name[0] }}</div>
            <div class="suggested-info">
              <p class="suggested-name">{{ dev.name }}</p>
              <p class="suggested-role">{{ dev.role }}</p>
            </div>
            <RouterLink to="/explore" class="btn-primary suggested-btn">View</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router    = useRouter()
const route     = useRoute()
const lastQuery = ref(route.query.q || 'blockchain developer')
const query     = ref('')

const suggestions = ['Vue.js', 'React', 'Node.js', 'Python', 'Full Stack', 'Mobile Dev', 'UI/UX']

const suggestedDevs = []

function handleSearch() {
  if (query.value.trim()) {
    router.push({ path: '/explore', query: { q: query.value } })
  }
}
</script>

<style scoped>
.no-results-view { background: var(--background); min-height: 100vh; padding: 2rem 0; }
.no-results-inner { padding-top: 1rem; padding-bottom: 3rem; display: flex; flex-direction: column; gap: 2.5rem; }

.search-section { max-width: 560px; }

.search-wrap {
  display: flex; align-items: center; gap: 0.5rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  box-shadow: var(--shadow-sm);
}
.search-wrap:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(168,85,247,0.1); }

.search-icon { color: var(--outline); font-size: 20px; flex-shrink: 0; }

.search-input {
  flex: 1; border: none; background: transparent;
  font-family: var(--font-body); font-size: 1rem; color: var(--on-surface); outline: none;
}

.clear-btn { padding: 0.25rem; }

/* No Results State */
.no-results-state {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 1.5rem;
}

.no-results-icon-wrap {
  width: 96px; height: 96px; border-radius: var(--radius-full);
  background: var(--surface-container);
  display: flex; align-items: center; justify-content: center;
}

.no-results-icon { font-size: 3rem; color: var(--outline); }

.no-results-title {
  font-family: var(--font-headline); font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700; color: var(--on-surface); letter-spacing: -0.02em;
}

.no-results-desc { font-size: 1rem; color: var(--on-surface-variant); max-width: 480px; line-height: 1.65; }

.suggestions { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }

.suggestions-label { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface-variant); }

.suggestion-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }

.suggestion-chip {
  padding: 0.35rem 0.875rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 500;
  color: var(--on-surface-variant); cursor: pointer; transition: all 0.15s ease;
}
.suggestion-chip:hover { border-color: var(--primary); color: var(--primary); background: rgba(168,85,247,0.05); }

.no-results-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }

/* Might Like */
.might-like-title {
  font-family: var(--font-headline); font-size: 1.1rem; font-weight: 700;
  color: var(--on-surface); margin-bottom: 1rem;
}

.might-like-grid { display: flex; flex-direction: column; gap: 0.75rem; }

.suggested-card {
  display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem;
}

.suggested-avatar {
  width: 44px; height: 44px; border-radius: var(--radius-lg);
  background: var(--primary-fixed); color: var(--primary);
  font-family: var(--font-headline); font-size: 1rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.suggested-info { flex: 1; }
.suggested-name { font-family: var(--font-headline); font-size: 0.9rem; font-weight: 700; color: var(--on-surface); }
.suggested-role { font-size: 0.8rem; color: var(--primary); font-family: var(--font-headline); font-weight: 500; }

.suggested-btn { font-size: 0.8rem; padding: 0.4rem 0.875rem; flex-shrink: 0; }
</style>
