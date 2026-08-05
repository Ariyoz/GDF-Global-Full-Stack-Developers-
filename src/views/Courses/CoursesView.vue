<template>
  <div class="courses-view">

    <!-- ═══════════════════════════════ HERO ═══════════════════════════════ -->
    <section class="courses-hero">
      <!-- Ambient background -->
      <div class="hero-bg" aria-hidden="true">
        <div class="hero-orb hero-orb--1"></div>
        <div class="hero-orb hero-orb--2"></div>
        <div class="hero-dot-grid"></div>
      </div>

      <div class="hero-content">
        <!-- Badge -->
        <div class="hero-badge animate-fade-in-up">
          <span class="material-symbols-outlined hero-badge__icon" style="font-variation-settings:'FILL' 1">school</span>
          Free Learning
        </div>

        <!-- Headline -->
        <h1 class="hero-title animate-fade-in-up delay-100">
          Learn Tech<br />
          <span class="text-gradient">For Free</span>
        </h1>

        <!-- Subtext -->
        <p class="hero-sub animate-fade-in-up delay-200">
          Curated free courses from the best platforms — YouTube, freeCodeCamp,
          The Odin Project, and more.
        </p>

        <!-- Search bar -->
        <div class="hero-search-wrap animate-fade-in-up delay-300">
          <div class="hero-search" :class="{ 'hero-search--focused': searchFocused }">
            <span class="material-symbols-outlined hero-search__icon">search</span>
            <input
              v-model="searchQuery"
              name="search"
              autocomplete="off"
              class="hero-search__input"
              placeholder="Search courses, topics, languages…"
              @focus="searchFocused = true"
              @blur="searchFocused = false"
            />
            <button
              v-if="searchQuery"
              class="hero-search__clear"
              @click="searchQuery = ''"
              aria-label="Clear search"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <!-- Stat pills -->
        <div class="hero-stats animate-fade-in-up delay-400">
          <div class="hero-stat">
            <span class="material-symbols-outlined hero-stat__icon">menu_book</span>
            <span>20+ Courses</span>
          </div>
          <div class="hero-stat">
            <span class="material-symbols-outlined hero-stat__icon">category</span>
            <span>8 Categories</span>
          </div>
          <div class="hero-stat">
            <span class="material-symbols-outlined hero-stat__icon">workspace_premium</span>
            <span>100% Free</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════ STICKY CATEGORY BAR ════════════════════════ -->
    <div class="category-bar">
      <div class="category-bar__inner">
        <div class="category-chips">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="cat-chip"
            :class="{ 'cat-chip--active': activeCategory === cat.value }"
            @click="activeCategory = cat.value"
          >
            <span class="material-symbols-outlined cat-chip__icon">{{ cat.icon }}</span>
            {{ cat.label }}
          </button>
        </div>
      </div>
      <!-- Progress bar -->
      <div class="category-progress">
        <div
          class="category-progress__bar"
          :style="{ width: progressWidth }"
        ></div>
      </div>
      <!-- Results count -->
      <div class="category-results">
        Showing <strong>{{ filteredCourses.length }}</strong> course{{ filteredCourses.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- ══════════════════════════ COURSES GRID ══════════════════════════ -->
    <section class="courses-section">
      <div class="courses-grid" v-if="filteredCourses.length > 0">
        <a
          v-for="course in filteredCourses"
          :key="course.id + '-' + course.title"
          :href="course.url"
          target="_blank"
          rel="noopener noreferrer"
          class="course-card"
        >
          <!-- Thumbnail -->
          <div class="course-thumb">
            <img
              v-if="course.thumbnail"
              :src="course.thumbnail"
              :alt="course.title"
              class="course-thumb__img"
              loading="lazy"
              @error="course.thumbnail = null"
            />
            <div
              v-else
              class="course-thumb__placeholder"
              :style="{ background: course.color }"
            >
              <span class="material-symbols-outlined course-thumb__placeholder-icon" style="font-variation-settings:'FILL' 1">{{ course.icon }}</span>
            </div>

            <!-- Hover overlay -->
            <div class="course-thumb__overlay" aria-hidden="true"></div>

            <!-- Source badge top-left -->
            <div class="badge badge--source">{{ course.source }}</div>

            <!-- FREE badge top-right -->
            <div class="badge badge--free">FREE</div>

            <!-- Level badge bottom-left -->
            <div class="badge badge--level" :class="'badge--level-' + course.level.toLowerCase()">
              {{ course.level }}
            </div>
          </div>

          <!-- Card body -->
          <div class="course-body">
            <div class="course-meta">
              <span class="course-category">{{ course.category }}</span>
            </div>
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-desc">{{ course.desc }}</p>
            <div class="course-footer">
              <span class="course-duration">
                <span class="material-symbols-outlined course-duration__icon">schedule</span>
                {{ course.duration }}
              </span>
              <span class="course-cta">
                Start Learning
                <span class="material-symbols-outlined course-cta__arrow">arrow_forward</span>
              </span>
            </div>
          </div>
        </a>
      </div>

      <!-- Empty state -->
      <div v-else class="courses-empty">
        <div class="courses-empty__icon-wrap">
          <span class="material-symbols-outlined courses-empty__icon">search_off</span>
        </div>
        <h3 class="courses-empty__title">No courses found</h3>
        <p class="courses-empty__sub">
          No results for "<em>{{ searchQuery }}</em>". Try a different keyword or category.
        </p>
        <button class="btn-outline courses-empty__btn" @click="searchQuery = ''; activeCategory = 'all'">
          Clear filters
        </button>
      </div>
    </section>

    <!-- ═══════════════════════ SUGGEST CTA STRIP ═══════════════════════ -->
    <section class="suggest-strip">
      <!-- Ambient orbs -->
      <div class="suggest-strip__orb suggest-strip__orb--1" aria-hidden="true"></div>
      <div class="suggest-strip__orb suggest-strip__orb--2" aria-hidden="true"></div>

      <div class="suggest-strip__inner">
        <div class="suggest-strip__left">
          <div class="suggest-strip__icon-circle">
            <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;font-size:1.75rem;color:#fff">lightbulb</span>
          </div>
          <div>
            <h3 class="suggest-strip__title">Know a great free resource?</h3>
            <p class="suggest-strip__sub">Help the community by suggesting a free course or tutorial.</p>
          </div>
        </div>
        <a
          href="mailto:hello@gfd.dev?subject=Course Suggestion"
          class="suggest-strip__btn"
        >
          Suggest a Course
        </a>
      </div>
    </section>

  </div>
</template>

<script setup>
import { useSeo, pageSeo } from '@/composables/useSeo'
import { ref, computed } from 'vue'

useSeo(pageSeo.courses)

const searchQuery = ref('')
const activeCategory = ref('all')
const searchFocused = ref(false)

const categories = [
  { value: 'all',        label: 'All',          icon: 'apps' },
  { value: 'web',        label: 'Web Dev',       icon: 'code' },
  { value: 'mobile',     label: 'Mobile',        icon: 'smartphone' },
  { value: 'backend',    label: 'Backend',       icon: 'dns' },
  { value: 'ai',         label: 'AI / ML',       icon: 'psychology' },
  { value: 'database',   label: 'Databases',     icon: 'storage' },
  { value: 'devops',     label: 'DevOps',        icon: 'rocket_launch' },
  { value: 'design',     label: 'UI / Design',   icon: 'palette' },
]

const courses = [
  // Web Dev
  {
    id: 1, category: 'web', level: 'Beginner',
    title: 'The Odin Project — Full Stack Path',
    desc: 'Complete free full-stack curriculum covering HTML, CSS, JavaScript, React, Node.js and more.',
    source: 'The Odin Project', duration: 'Self-paced',
    url: 'https://www.theodinproject.com',
    thumbnail: 'https://img.youtube.com/vi/nu_pCVPKzTk/mqdefault.jpg',
    color: '#e34c26', icon: 'code',
  },
  {
    id: 2, category: 'web', level: 'Beginner',
    title: 'freeCodeCamp — Responsive Web Design',
    desc: 'Learn HTML, CSS, Flexbox, Grid and build 5 certification projects for free.',
    source: 'freeCodeCamp', duration: '300 hours',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design',
    thumbnail: 'https://img.youtube.com/vi/zJSY8tbf_ys/mqdefault.jpg',
    color: '#0a0a23', icon: 'web',
  },
  {
    id: 3, category: 'web', level: 'Intermediate',
    title: 'JavaScript Algorithms and Data Structures',
    desc: 'Deep dive into JavaScript — ES6+, OOP, functional programming, regex and algorithms.',
    source: 'freeCodeCamp', duration: '300 hours',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures',
    thumbnail: 'https://img.youtube.com/vi/PkZNo7MFNFg/mqdefault.jpg',
    color: '#f7df1e', icon: 'javascript',
  },
  {
    id: 4, category: 'web', level: 'Intermediate',
    title: 'Full Stack Open — Modern Web Dev',
    desc: 'University of Helsinki free course on React, Node, TypeScript, GraphQL and testing.',
    source: 'University of Helsinki', duration: '9 parts',
    url: 'https://fullstackopen.com/en',
    thumbnail: 'https://img.youtube.com/vi/a_7Z7C_JCyo/mqdefault.jpg',
    color: '#3776ab', icon: 'school',
  },
  {
    id: 5, category: 'web', level: 'Beginner',
    title: 'Vue.js 3 — Complete Tutorial',
    desc: 'Full Vue 3 course with Composition API, Pinia, Vue Router, and real projects.',
    source: 'YouTube', duration: '11 hours',
    url: 'https://www.youtube.com/watch?v=VeNfHj6MhgA',
    thumbnail: 'https://img.youtube.com/vi/VeNfHj6MhgA/mqdefault.jpg',
    color: '#42b883', icon: 'play_circle',
  },
  {
    id: 6, category: 'web', level: 'Intermediate',
    title: 'React — The Complete Course',
    desc: 'Free React tutorial covering hooks, context, Redux and building real projects.',
    source: 'YouTube', duration: '12 hours',
    url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
    thumbnail: 'https://img.youtube.com/vi/bMknfKXIFA8/mqdefault.jpg',
    color: '#61dafb', icon: 'play_circle',
  },
  // Backend
  {
    id: 7, category: 'backend', level: 'Beginner',
    title: 'FastAPI — Full Course',
    desc: 'Build fast REST APIs with Python FastAPI, SQLAlchemy, auth and deployment.',
    source: 'YouTube', duration: '6 hours',
    url: 'https://www.youtube.com/watch?v=7t2alSnE2-I',
    thumbnail: 'https://img.youtube.com/vi/7t2alSnE2-I/mqdefault.jpg',
    color: '#009688', icon: 'play_circle',
  },
  {
    id: 8, category: 'backend', level: 'Beginner',
    title: 'Node.js and Express — Full Course',
    desc: 'Complete backend with Node.js, Express, REST APIs, authentication and MongoDB.',
    source: 'freeCodeCamp', duration: '8 hours',
    url: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
    thumbnail: 'https://img.youtube.com/vi/Oe421EPjeBE/mqdefault.jpg',
    color: '#68a063', icon: 'play_circle',
  },
  {
    id: 9, category: 'backend', level: 'Intermediate',
    title: "CS50's Web Programming with Python",
    desc: "Harvard's free course covering Django, databases, APIs, security and scalability.",
    source: 'Harvard CS50', duration: 'Self-paced',
    url: 'https://cs50.harvard.edu/web',
    thumbnail: 'https://img.youtube.com/vi/3jSfxHYPiMs/mqdefault.jpg',
    color: '#a51c30', icon: 'school',
  },
  // Database
  {
    id: 10, category: 'database', level: 'Beginner',
    title: 'SQL for Beginners — Complete Course',
    desc: 'Learn SQL from scratch — SELECT, JOIN, subqueries, indexes and performance.',
    source: 'freeCodeCamp', duration: '4 hours',
    url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    thumbnail: 'https://img.youtube.com/vi/HXV3zeQKqGY/mqdefault.jpg',
    color: '#f29111', icon: 'storage',
  },
  {
    id: 11, category: 'database', level: 'Beginner',
    title: 'PostgreSQL Tutorial',
    desc: 'Full PostgreSQL course covering queries, tables, functions, triggers and more.',
    source: 'YouTube', duration: '4 hours',
    url: 'https://www.youtube.com/watch?v=SpfIwlAYaKk',
    thumbnail: 'https://img.youtube.com/vi/SpfIwlAYaKk/mqdefault.jpg',
    color: '#336791', icon: 'storage',
  },
  // Mobile
  {
    id: 12, category: 'mobile', level: 'Beginner',
    title: 'React Native — The Full Guide',
    desc: 'Build iOS and Android apps with React Native from scratch with real projects.',
    source: 'YouTube', duration: '10 hours',
    url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc',
    thumbnail: 'https://img.youtube.com/vi/0-S5a0eXPoc/mqdefault.jpg',
    color: '#61dafb', icon: 'smartphone',
  },
  {
    id: 13, category: 'mobile', level: 'Intermediate',
    title: 'Flutter & Dart — The Complete Guide',
    desc: 'Build beautiful cross-platform apps with Flutter. Free full course with projects.',
    source: 'YouTube', duration: '10 hours',
    url: 'https://www.youtube.com/watch?v=VPvVD8t02U8',
    thumbnail: 'https://img.youtube.com/vi/VPvVD8t02U8/mqdefault.jpg',
    color: '#54c5f8', icon: 'smartphone',
  },
  // AI / ML
  {
    id: 14, category: 'ai', level: 'Beginner',
    title: 'Machine Learning for Everybody',
    desc: 'Free ML course with Python — regression, classification, neural networks explained simply.',
    source: 'freeCodeCamp', duration: '4 hours',
    url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
    thumbnail: 'https://img.youtube.com/vi/i_LwzRVP7bg/mqdefault.jpg',
    color: '#ff6f00', icon: 'psychology',
  },
  {
    id: 15, category: 'ai', level: 'Intermediate',
    title: 'fast.ai — Practical Deep Learning',
    desc: 'Top-down approach to deep learning. Free course used by industry practitioners.',
    source: 'fast.ai', duration: 'Self-paced',
    url: 'https://course.fast.ai',
    thumbnail: 'https://img.youtube.com/vi/8SF_h3xF3cE/mqdefault.jpg',
    color: '#009bd5', icon: 'school',
  },
  {
    id: 16, category: 'ai', level: 'Beginner',
    title: 'ChatGPT Prompt Engineering for Developers',
    desc: 'Free DeepLearning.AI course on how to build with LLMs using prompt engineering.',
    source: 'DeepLearning.AI', duration: '1 hour',
    url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers',
    thumbnail: 'https://img.youtube.com/vi/eTieetk2dSw/mqdefault.jpg',
    color: '#10a37f', icon: 'psychology',
  },
  // DevOps
  {
    id: 17, category: 'devops', level: 'Beginner',
    title: "Git and GitHub — Complete Beginner's Guide",
    desc: 'Everything you need to know about Git version control and GitHub workflows.',
    source: 'freeCodeCamp', duration: '5 hours',
    url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
    thumbnail: 'https://img.youtube.com/vi/RGOj5yH7evk/mqdefault.jpg',
    color: '#f05032', icon: 'rocket_launch',
  },
  {
    id: 18, category: 'devops', level: 'Intermediate',
    title: 'Docker Full Course',
    desc: 'Learn Docker from scratch — containers, images, Compose and deployment.',
    source: 'YouTube', duration: '5 hours',
    url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
    thumbnail: 'https://img.youtube.com/vi/fqMOX6JJhGo/mqdefault.jpg',
    color: '#2496ed', icon: 'rocket_launch',
  },
  // Design
  {
    id: 19, category: 'design', level: 'Beginner',
    title: 'UI Design Fundamentals',
    desc: 'Learn the core principles of good UI design — spacing, typography, colour and layout.',
    source: 'YouTube', duration: '3 hours',
    url: 'https://www.youtube.com/watch?v=tRpoI6vkqLs',
    thumbnail: 'https://img.youtube.com/vi/tRpoI6vkqLs/mqdefault.jpg',
    color: '#f24e1e', icon: 'palette',
  },
  {
    id: 20, category: 'design', level: 'Beginner',
    title: 'Figma Complete Course',
    desc: 'Design beautiful apps and websites in Figma — free course from scratch.',
    source: 'YouTube', duration: '6 hours',
    url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
    thumbnail: 'https://img.youtube.com/vi/FTFaQWZBqQ8/mqdefault.jpg',
    color: '#a259ff', icon: 'palette',
  },
]

const filteredCourses = computed(() => {
  let list = courses
  if (activeCategory.value !== 'all') {
    list = list.filter(c => c.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.source.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    )
  }
  return list
})

const progressWidth = computed(() => {
  const total = courses.length
  const shown = filteredCourses.value.length
  return total === 0 ? '0%' : `${Math.round((shown / total) * 100)}%`
})
</script>

<style scoped>
/* ─── Base ─────────────────────────────────────────────────────────────── */
.courses-view {
  display: flex;
  flex-direction: column;
  background: var(--background);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ─── Hero ──────────────────────────────────────────────────────────────── */
.courses-hero {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem 3rem;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.25;
}

.hero-orb--1 {
  width: 500px;
  height: 500px;
  background: var(--primary);
  top: -180px;
  left: -120px;
}

.hero-orb--2 {
  width: 350px;
  height: 350px;
  background: #7c3aed;
  bottom: -100px;
  right: -80px;
  opacity: 0.18;
}

.hero-dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--outline-variant) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.45;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  max-width: 680px;
  width: 100%;
}

/* Hero badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 1.1rem;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  box-shadow: var(--shadow-primary);
  letter-spacing: 0.01em;
}

.hero-badge__icon {
  font-size: 16px;
}

/* Headline */
.hero-title {
  font-family: var(--font-headline);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  color: var(--on-surface);
  line-height: 1.15;
  letter-spacing: -0.035em;
}

/* Subtext */
.hero-sub {
  font-size: clamp(0.9375rem, 2vw, 1.0625rem);
  color: var(--on-surface-variant);
  max-width: 520px;
  line-height: 1.65;
}

/* Search bar */
.hero-search-wrap {
  width: 100%;
  max-width: 560px;
}

.hero-search {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  border-radius: var(--radius-full);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.hero-search--focused {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 14, 212, 0.18);
}

.hero-search__icon {
  position: absolute;
  left: 1.1rem;
  font-size: 22px;
  color: var(--on-surface-variant);
  pointer-events: none;
  flex-shrink: 0;
}

.hero-search__input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3.25rem;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.9375rem;
  color: var(--on-surface);
  font-family: var(--font-body);
  border-radius: var(--radius-full);
}

.hero-search__input::placeholder {
  color: var(--on-surface-variant);
  opacity: 0.75;
}

.hero-search__clear {
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: var(--surface-container-high);
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
  flex-shrink: 0;
}

.hero-search__clear:hover {
  background: var(--outline-variant);
  color: var(--on-surface);
}

.hero-search__clear .material-symbols-outlined {
  font-size: 16px;
}

/* Stat pills */
.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
}

.hero-stat {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.9rem;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
}

.hero-stat__icon {
  font-size: 15px;
  color: var(--primary);
}

/* ─── Category Bar ──────────────────────────────────────────────────────── */
.category-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--background);
  border-bottom: 1px solid var(--outline-variant);
  padding: 0.875rem 1.25rem 0;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.category-bar__inner {
  overflow: hidden;
}

.category-chips {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 0.875rem;
}

.category-chips::-webkit-scrollbar { display: none; }

.cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 1rem;
  background: transparent;
  border: 1.5px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  font-family: var(--font-headline);
  transition: all var(--transition-fast);
}

.cat-chip:hover:not(.cat-chip--active) {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(99, 14, 212, 0.06);
}

.cat-chip--active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: #fff;
  box-shadow: var(--shadow-primary);
}

.cat-chip__icon {
  font-size: 15px;
}

/* Progress bar */
.category-progress {
  height: 2px;
  background: var(--outline-variant);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.category-progress__bar {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-base);
}

/* Results count */
.category-results {
  padding: 0.5rem 0.25rem;
  font-size: 0.775rem;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
}

.category-results strong {
  color: var(--primary);
}

/* ─── Courses Section ───────────────────────────────────────────────────── */
.courses-section {
  padding: 2rem 1.25rem 2.5rem;
}

.courses-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .courses-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .courses-grid { grid-template-columns: repeat(3, 1fr); }
}

/* ─── Course Card ───────────────────────────────────────────────────────── */
.course-card {
  display: flex;
  flex-direction: column;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
  overflow: hidden;
  text-decoration: none;
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base),
    border-color var(--transition-base);
  border-left: 3px solid transparent;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-left-color: var(--primary);
}

/* Thumbnail */
.course-thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--surface-container);
  flex-shrink: 0;
}

.course-thumb__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.course-card:hover .course-thumb__img {
  transform: scale(1.04);
}

.course-thumb__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-thumb__placeholder-icon {
  font-size: 2.5rem;
  color: rgba(255,255,255,0.9);
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
}

/* Hover overlay */
.course-thumb__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%);
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}

.course-card:hover .course-thumb__overlay {
  opacity: 1;
}

/* Badges */
.badge {
  position: absolute;
  font-size: 0.65rem;
  font-weight: 700;
  font-family: var(--font-headline);
  letter-spacing: 0.04em;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full);
  line-height: 1.4;
}

.badge--source {
  top: 0.6rem;
  left: 0.6rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.12);
}

.badge--free {
  top: 0.6rem;
  right: 0.6rem;
  background: #16a34a;
  color: #fff;
}

.badge--level {
  bottom: 0.6rem;
  left: 0.6rem;
}

.badge--level-beginner     { background: rgba(22,163,74,0.85);  color: #fff; }
.badge--level-intermediate { background: rgba(217,119,6,0.85);  color: #fff; }
.badge--level-advanced     { background: rgba(220,38,38,0.85);  color: #fff; }

/* ─── Card Body ─────────────────────────────────────────────────────────── */
.course-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.125rem;
  flex: 1;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.course-category {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-family: var(--font-headline);
}

.course-title {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-desc {
  font-size: 0.8125rem;
  color: var(--on-surface-variant);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.course-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  margin-top: auto;
  border-top: 1px solid var(--outline-variant);
}

.course-duration {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: var(--on-surface-variant);
}

.course-duration__icon {
  font-size: 14px;
}

.course-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--primary);
  font-family: var(--font-headline);
  transition: gap var(--transition-fast);
}

.course-card:hover .course-cta {
  gap: 0.4rem;
}

.course-cta__arrow {
  font-size: 14px;
  transition: transform var(--transition-fast);
}

.course-card:hover .course-cta__arrow {
  transform: translateX(3px);
}

/* ─── Empty State ───────────────────────────────────────────────────────── */
.courses-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 1rem;
  text-align: center;
}

.courses-empty__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border-radius: var(--radius-2xl);
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
}

.courses-empty__icon {
  font-size: 2.5rem;
  color: var(--on-surface-variant);
}

.courses-empty__title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--on-surface);
}

.courses-empty__sub {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  max-width: 340px;
  line-height: 1.55;
}

.courses-empty__btn {
  margin-top: 0.25rem;
  padding: 0.6rem 1.5rem;
  font-size: 0.875rem;
}

/* ─── Suggest Strip ─────────────────────────────────────────────────────── */
.suggest-strip {
  position: relative;
  background: var(--gradient-primary);
  overflow: hidden;
  padding: 2.5rem 1.5rem;
  margin-top: auto;
}

.suggest-strip__orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.suggest-strip__orb--1 {
  width: 320px;
  height: 320px;
  background: rgba(255,255,255,0.08);
  top: -120px;
  left: -80px;
  filter: blur(60px);
}

.suggest-strip__orb--2 {
  width: 220px;
  height: 220px;
  background: rgba(255,255,255,0.06);
  bottom: -80px;
  right: -40px;
  filter: blur(50px);
}

.suggest-strip__inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  max-width: 900px;
  margin: 0 auto;
}

.suggest-strip__left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
  min-width: 0;
}

.suggest-strip__icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.25);
  flex-shrink: 0;
}

.suggest-strip__title {
  font-family: var(--font-headline);
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
}

.suggest-strip__sub {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.8);
  margin-top: 0.25rem;
  line-height: 1.5;
}

.suggest-strip__btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.75rem;
  background: #fff;
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: var(--radius-full);
  text-decoration: none;
  white-space: nowrap;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  flex-shrink: 0;
}

.suggest-strip__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}

/* ─── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .suggest-strip__inner {
    flex-direction: column;
    align-items: flex-start;
  }
  .suggest-strip__btn {
    width: 100%;
    justify-content: center;
  }
  .hero-stats {
    flex-direction: column;
    align-items: center;
  }
}

/* ─── Dark mode tweaks ──────────────────────────────────────────────────── */
[data-theme="dark"] .hero-dot-grid {
  opacity: 0.25;
}

[data-theme="dark"] .hero-search {
  background: var(--surface-container);
}

[data-theme="dark"] .course-card {
  background: var(--surface-container-low);
}

[data-theme="dark"] .category-bar {
  background: rgba(var(--background-rgb, 18,18,18), 0.9);
}
</style>
