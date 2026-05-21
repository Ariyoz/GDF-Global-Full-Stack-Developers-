<template>
  <div class="jobs-empty-view">
    <div class="page-header">
      <h1 class="text-headline-lg">My Jobs</h1>
      <p class="text-body-md" style="margin-top:0.25rem">Manage your active applications and current contracts.</p>
    </div>

    <!-- Empty State -->
    <div class="empty-state-wrap">
      <div class="glass-card-static empty-card">
        <!-- Illustration -->
        <div class="empty-illustration">
          <div class="illustration-ring outer" />
          <div class="illustration-ring inner" />
          <div class="illustration-icon-wrap">
            <span class="material-symbols-outlined illustration-icon" style="font-variation-settings:'FILL' 1">rocket_launch</span>
          </div>
        </div>

        <!-- Text -->
        <h2 class="empty-title">No active jobs yet</h2>
        <p class="empty-desc">
          Your professional journey is just a click away. Start by exploring open projects
          or post a job to find your perfect full-stack collaborator.
        </p>

        <!-- Actions -->
        <div class="empty-actions">
          <RouterLink to="/explore" class="btn-primary">
            <span class="material-symbols-outlined" style="font-size:18px">search</span>
            Browse Projects
          </RouterLink>
          <RouterLink to="/projects/upload" class="btn-outline">
            <span class="material-symbols-outlined" style="font-size:18px">add</span>
            Post a Job
          </RouterLink>
        </div>
      </div>

      <!-- Suggestion Chips -->
      <div class="suggestion-chips">
        <button
          v-for="tag in suggestionTags"
          :key="tag"
          class="suggestion-chip"
          @click="$router.push({ path: '/explore', query: { q: tag } })"
        >
          #{{ tag }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const suggestionTags = ['React', 'Node.js', 'Python', 'Cloud Architecture', 'Vue.js', 'TypeScript']
</script>

<style scoped>
.jobs-empty-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: calc(100vh - 200px);
}

.page-header { margin-bottom: 0.5rem; }

.empty-state-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.empty-card {
  max-width: 560px;
  width: 100%;
  padding: 3rem 2rem;
  border-radius: var(--radius-2xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  transition: transform 0.3s ease;
}

.empty-card:hover { transform: perspective(1000px) rotateX(-1deg) rotateY(1deg); }

/* Illustration */
.empty-illustration {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration-ring {
  position: absolute;
  border-radius: 50%;
  animation: pulse 2.5s ease-in-out infinite;
}

.illustration-ring.outer {
  inset: 0;
  background: rgba(168,85,247,0.06);
}

.illustration-ring.inner {
  inset: 16px;
  background: rgba(168,85,247,0.1);
  animation-delay: 0.3s;
}

.illustration-icon-wrap {
  position: relative;
  z-index: 1;
  width: 80px;
  height: 80px;
  border-radius: var(--radius-2xl);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(168,85,247,0.3);
}

.illustration-icon { font-size: 2.5rem; color: #fff; }

.empty-title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--on-surface);
  letter-spacing: -0.02em;
}

.empty-desc {
  font-size: 1rem;
  color: var(--on-surface-variant);
  line-height: 1.65;
  max-width: 420px;
}

.empty-actions {
  display: flex;
  gap: 0.875rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* Suggestion Chips */
.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.625rem;
}

.suggestion-chip {
  padding: 0.4rem 1rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
}

.suggestion-chip:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(168,85,247,0.05);
}
</style>
