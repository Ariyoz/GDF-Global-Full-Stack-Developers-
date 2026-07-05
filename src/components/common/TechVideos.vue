<template>
  <section class="section-gfd tech-videos-section">
    <div class="container-gfd">

      <!-- Header -->
      <div class="section-top">
        <div>
          <h2 class="text-headline-lg">Tech in 60 Seconds</h2>
          <p class="text-body-md" style="margin-top:0.25rem">
            Bite-sized videos on the tools, trends, and tech that matter.
          </p>
        </div>
        <a href="https://youtube.com" target="_blank" rel="noopener" class="view-all-link">
          More videos
          <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span>
        </a>
      </div>

      <!-- Video Grid -->
      <div class="videos-grid">
        <div
          v-for="(video, i) in videos"
          :key="video.id"
          class="video-card animate-fade-in-up"
          :class="{ 'video-card-featured': i === 0 }"
          @click="openVideo(video)"
        >
          <!-- Thumbnail -->
          <div class="video-thumb">
            <img :src="video.thumb" :alt="video.title" class="video-thumb-img" loading="lazy" />
            <div class="video-overlay">
              <button class="play-btn" :aria-label="'Play ' + video.title">
                <span class="material-symbols-outlined play-icon">play_circle</span>
              </button>
            </div>
            <span class="video-duration">{{ video.duration }}</span>
            <span class="video-badge" :style="{ background: video.badgeColor }">{{ video.badge }}</span>
          </div>

          <!-- Info -->
          <div class="video-info">
            <span class="video-category">{{ video.category }}</span>
            <h3 class="video-title">{{ video.title }}</h3>
            <p class="video-desc">{{ video.desc }}</p>
            <div class="video-meta">
              <span class="video-meta-item">
                <span class="material-symbols-outlined">visibility</span>
                {{ video.views }}
              </span>
              <span class="video-meta-item">
                <span class="material-symbols-outlined">schedule</span>
                {{ video.ago }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="activeVideo" class="modal-backdrop" @click.self="closeVideo" role="dialog" :aria-label="activeVideo.title">
            <div class="modal-box">
              <button class="modal-close" @click="closeVideo" aria-label="Close video">
                <span class="material-symbols-outlined">close</span>
              </button>
              <div class="modal-embed">
                <iframe
                  :src="activeVideo.embedUrl + '?autoplay=1&rel=0'"
                  :title="activeVideo.title"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                />
              </div>
              <div class="modal-info">
                <span class="video-badge" :style="{ background: activeVideo.badgeColor }">{{ activeVideo.badge }}</span>
                <h3 class="modal-title">{{ activeVideo.title }}</h3>
                <p class="modal-desc">{{ activeVideo.desc }}</p>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const videos = [
  {
    id: 1,
    title: 'How AI is Changing Software Development',
    desc: 'From Copilot to autonomous agents — a quick look at what AI really means for devs in 2025.',
    category: 'AI & Dev Tools',
    badge: 'HOT',
    badgeColor: 'var(--primary)',
    duration: '1:42',
    views: '128k',
    ago: '2 days ago',
    thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 2,
    title: 'WebSockets vs Server-Sent Events',
    desc: 'Which real-time protocol should you pick? We break it down in under 2 minutes.',
    category: 'Backend',
    badge: 'NEW',
    badgeColor: '#16a34a',
    duration: '1:58',
    views: '54k',
    ago: '5 days ago',
    thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 3,
    title: 'CSS Container Queries Explained',
    desc: 'Stop relying on viewport breakpoints — containers are the future of responsive design.',
    category: 'Frontend',
    badge: 'TIPS',
    badgeColor: '#0284c7',
    duration: '2:10',
    views: '39k',
    ago: '1 week ago',
    thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 4,
    title: 'Why Every Dev Should Know Docker',
    desc: 'Containers in 90 seconds: what they are, why they matter, and how to get started.',
    category: 'DevOps',
    badge: 'QUICK',
    badgeColor: '#b45309',
    duration: '1:30',
    views: '72k',
    ago: '3 days ago',
    thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
]

const activeVideo = ref(null)

function openVideo(video) {
  activeVideo.value = video
  document.body.style.overflow = 'hidden'
}

function closeVideo() {
  activeVideo.value = null
  document.body.style.overflow = ''
}
</script>

<style scoped>
.tech-videos-section {
  background: var(--surface-container-low);
}

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

/* ── Grid ── */
.videos-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .videos-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .videos-grid { grid-template-columns: repeat(4, 1fr); }
  .video-card-featured { grid-column: span 2; }
}

/* ── Card ── */
.video-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  flex-direction: column;
}

.video-card:hover {
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(99, 14, 212, 0.12);
}

/* ── Thumbnail ── */
.video-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--surface-container);
}

.video-card-featured .video-thumb {
  aspect-ratio: 16 / 8;
}

.video-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.video-card:hover .video-thumb-img {
  transform: scale(1.04);
}

.video-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.video-card:hover .video-overlay {
  opacity: 1;
}

.play-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: transform 0.15s ease;
}

.play-btn:hover { transform: scale(1.1); }

.play-icon {
  font-size: 3.5rem;
  color: #fff;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
}

.video-card-featured .play-icon {
  font-size: 4.5rem;
}

.video-duration {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-sm, 4px);
  letter-spacing: 0.03em;
}

.video-badge {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  color: #fff;
  font-family: var(--font-headline);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  padding: 0.18rem 0.5rem;
  border-radius: var(--radius-full);
}

/* ── Info ── */
.video-info {
  padding: 1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}

.video-category {
  font-family: var(--font-headline);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: var(--primary);
  text-transform: uppercase;
}

.video-title {
  font-family: var(--font-headline);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.35;
}

.video-card-featured .video-title {
  font-size: 1.15rem;
}

.video-desc {
  font-size: 0.82rem;
  color: var(--on-surface-variant);
  line-height: 1.55;
  flex: 1;
}

.video-meta {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-top: 0.25rem;
  padding-top: 0.625rem;
  border-top: 1px solid var(--outline-variant);
}

.video-meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.76rem;
  color: var(--on-surface-variant);
}

.video-meta-item .material-symbols-outlined {
  font-size: 14px;
}

/* ── Modal ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-box {
  background: var(--surface-container-lowest);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 820px;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--outline-variant);
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: var(--radius-full);
  color: #fff;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;
}
.modal-close:hover { background: rgba(0, 0, 0, 0.85); }

.modal-embed {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
}

.modal-embed iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.modal-info {
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-info .video-badge {
  position: static;
  width: fit-content;
}

.modal-title {
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--on-surface);
}

.modal-desc {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  line-height: 1.55;
}

/* ── Transition ── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
  transition: transform 0.2s ease;
}
.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
  transform: scale(0.94) translateY(12px);
}
</style>
