<template>
  <div class="courses-view">
    <!-- Header -->
    <div class="courses-hero">
      <div class="hero-badge">
        <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1">school</span>
        Free Learning
      </div>
      <h1 class="hero-title">Learn Tech for Free</h1>
      <p class="hero-sub">Curated free courses from the best platforms — YouTube, freeCodeCamp, The Odin Project, and more.</p>
      <div class="hero-search">
        <span class="material-symbols-outlined search-icon">search</span>
        <input v-model="searchQuery" class="search-input" placeholder="Search courses, topics, languages..." />
      </div>
    </div>

    <!-- Category filters -->
    <div class="category-chips">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="cat-chip"
        :class="{ active: activeCategory === cat.value }"
        @click="activeCategory = cat.value"
      >
        <span class="material-symbols-outlined" style="font-size:16px;">{{ cat.icon }}</span>
        {{ cat.label }}
      </button>
    </div>

    <!-- Courses grid -->
    <div class="courses-grid">
      <a
        v-for="course in filteredCourses"
        :key="course.id"
        :href="course.url"
        target="_blank"
        rel="noopener noreferrer"
        class="course-card glass-card"
      >
        <div class="course-thumb">
          <img v-if="course.thumbnail" :src="course.thumbnail" :alt="course.title" class="thumb-img" loading="lazy" />
          <div v-else class="thumb-placeholder" :style="{ background: course.color }">
            <span class="material-symbols-outlined" style="font-size:2rem;color:#fff;">{{ course.icon }}</span>
          </div>
          <div class="course-source-badge">{{ course.source }}</div>
          <div class="course-free-badge">FREE</div>
        </div>
        <div class="course-body">
          <div class="course-meta">
            <span class="course-category">{{ course.category }}</span>
            <span class="course-level" :class="course.level.toLowerCase()">{{ course.level }}</span>
          </div>
          <h3 class="course-title">{{ course.title }}</h3>
          <p class="course-desc">{{ course.desc }}</p>
          <div class="course-footer">
            <span class="course-duration">
              <span class="material-symbols-outlined" style="font-size:14px;">schedule</span>
              {{ course.duration }}
            </span>
            <span class="course-cta">
              Start Learning
              <span class="material-symbols-outlined" style="font-size:14px;">arrow_forward</span>
            </span>
          </div>
        </div>
      </a>
    </div>

    <div v-if="filteredCourses.length === 0" class="courses-empty">
      <span class="material-symbols-outlined" style="font-size:3rem;color:var(--on-surface-variant)">search_off</span>
      <p>No courses found for "{{ searchQuery }}"</p>
    </div>

    <!-- Submit a course -->
    <div class="submit-section glass-card-static">
      <div class="submit-icon">
        <span class="material-symbols-outlined" style="font-size:28px;color:var(--primary)">add_circle</span>
      </div>
      <div>
        <h3 class="submit-title">Know a great free resource?</h3>
        <p class="submit-desc">Help the community by suggesting a free course or tutorial.</p>
      </div>
      <a href="mailto:hello@gfd.dev?subject=Course Suggestion" class="btn-primary submit-btn">Suggest a Course</a>
    </div>
  </div>
</template>

<script setup>
import { useSeo, pageSeo } from '@/composables/useSeo'
import { ref, computed } from 'vue'

useSeo(pageSeo.courses)

const searchQuery = ref('')
const activeCategory = ref('all')

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
    thumbnail: 'https://www.theodinproject.com/assets/og-logo-022832d4cefeec1d5a4f9a6a4a4a4a4a.png',
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
    thumbnail: 'https://fullstackopen.com/static/og-image-a0e012a3c34b3e4c9f4c36e2c1a1a1a1.png',
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
    title: 'CS50\'s Web Programming with Python',
    desc: 'Harvard\'s free course covering Django, databases, APIs, security and scalability.',
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
    title: 'Git and GitHub — Complete Beginner\'s Guide',
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
</script>

<style scoped>
.courses-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
  background: var(--background);
  min-height: 100vh;
}

/* Hero */
.courses-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.875rem;
  padding: 2rem 1rem 1rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.875rem;
  background: rgba(168,85,247,0.08);
  border: 1px solid rgba(168,85,247,0.2);
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary);
}

.hero-title {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--on-surface);
  letter-spacing: -0.025em;
}

.hero-sub {
  font-size: 0.9375rem;
  color: var(--on-surface-variant);
  max-width: 520px;
  line-height: 1.6;
}

.hero-search {
  position: relative;
  width: 100%;
  max-width: 480px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: var(--on-surface-variant);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  color: var(--on-surface);
  outline: none;
  font-family: var(--font-body);
}

.search-input:focus { border-color: var(--primary); }

/* Categories */
.category-chips {
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.category-chips::-webkit-scrollbar { display: none; }

.cat-chip {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.875rem;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.15s;
  font-family: var(--font-headline);
}

.cat-chip.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

/* Grid */
.courses-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 0 1rem;
}

@media (min-width: 640px) { .courses-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .courses-grid { grid-template-columns: repeat(3, 1fr); } }

/* Course card */
.course-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-xl);
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.course-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}

.course-thumb {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--surface-container);
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-source-badge {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  padding: 0.2rem 0.5rem;
  background: rgba(0,0,0,0.65);
  border-radius: var(--radius-lg);
  font-size: 0.65rem;
  font-weight: 600;
  color: #fff;
  backdrop-filter: blur(4px);
}

.course-free-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.2rem 0.5rem;
  background: #16a34a;
  border-radius: var(--radius-full);
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.05em;
}

.course-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.course-category {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--primary);
  text-transform: capitalize;
  font-family: var(--font-headline);
}

.course-level {
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-full);
  font-size: 0.65rem;
  font-weight: 600;
  font-family: var(--font-headline);
}
.course-level.beginner { background: rgba(22,163,74,0.1); color: #16a34a; }
.course-level.intermediate { background: rgba(245,158,11,0.1); color: #d97706; }
.course-level.advanced { background: rgba(239,68,68,0.1); color: #ef4444; }

.course-title {
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.4;
}

.course-desc {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
  flex: 1;
}

.course-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  border-top: 1px solid var(--outline-variant);
}

.course-duration {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--on-surface-variant);
}

.course-cta {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
  font-family: var(--font-headline);
}

/* Empty */
.courses-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--on-surface-variant);
  font-size: 0.9rem;
}

/* Submit section */
.submit-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-xl);
  margin: 0 1rem;
  flex-wrap: wrap;
}

.submit-icon { flex-shrink: 0; }

.submit-title {
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--on-surface);
}

.submit-desc {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  margin-top: 0.1rem;
}

.submit-btn {
  margin-left: auto;
  white-space: nowrap;
  padding: 0.5rem 1.25rem;
  font-size: 0.85rem;
}
</style>
