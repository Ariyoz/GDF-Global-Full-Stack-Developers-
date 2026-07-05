<template>
  <section class="section-gfd tech-videos-section">
    <div class="container-gfd">

      <div class="section-top">
        <div>
          <h2 class="text-headline-lg">The World Builds Here</h2>
          <p class="text-body-md" style="margin-top:0.25rem">
            Developers, designers, and data experts — all in one place.
          </p>
        </div>
      </div>

      <!-- Video Grid -->
      <div class="videos-grid">
        <div
          v-for="(video, i) in videos"
          :key="video.id"
          class="video-card animate-fade-in-up"
          :class="{ 'video-card-featured': i === 0 }"
        >
          <div class="video-thumb">
            <video
              class="video-player"
              autoplay
              muted
              loop
              playsinline
              preload="auto"
              crossorigin="anonymous"
              @canplay="(e) => e.target.play()"
            >
              <source :src="video.src" type="video/mp4" />
            </video>
            <div class="video-label-bar">
              <span class="video-badge" :style="{ background: video.badgeColor }">{{ video.badge }}</span>
              <span class="video-title-overlay">{{ video.title }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// Using Coverr.co — free stock videos with proper CORS headers for autoplay
const videos = [
  {
    id: 1,
    title: 'Developer coding',
    badge: 'CODE',
    badgeColor: 'var(--primary)',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-developer-working-on-a-laptop-1587-large.mp4',
  },
  {
    id: 2,
    title: 'Team collaboration',
    badge: 'COLLAB',
    badgeColor: '#16a34a',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-programmer-typing-code-on-laptop-15-large.mp4',
  },
  {
    id: 3,
    title: 'Data analysis',
    badge: 'DATA',
    badgeColor: '#0284c7',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-4781-large.mp4',
  },
  {
    id: 4,
    title: 'Tech innovation',
    badge: 'TECH',
    badgeColor: '#b45309',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-at-night-13-large.mp4',
  },
  {
    id: 5,
    title: 'Product design',
    badge: 'DESIGN',
    badgeColor: '#7c3aed',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-at-her-laptop-computer-in-a-dark-room-47754-large.mp4',
  },
  {
    id: 6,
    title: 'Cloud infrastructure',
    badge: 'CLOUD',
    badgeColor: '#0891b2',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-programmer-working-in-dark-office-2539-large.mp4',
  },
]

// Ensure all videos autoplay after mount
onMounted(() => {
  setTimeout(() => {
    document.querySelectorAll('.video-player').forEach(v => {
      v.muted = true
      v.play().catch(() => {})
    })
  }, 300)
})
</script>

<style scoped>
.tech-videos-section { background: var(--surface-container-low); }

.section-top { margin-bottom: 1.5rem; }

/* ── Grid: 2 cols mobile, 3 cols tablet, 6 cols desktop ── */
.videos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .videos-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) {
  .videos-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  .video-card-featured {
    grid-column: span 2;
  }
}

/* ── Card ── */
.video-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--outline-variant);
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  cursor: default;
}

.video-card:hover {
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(99, 14, 212, 0.15);
}

/* ── Thumbnail ── */
.video-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 14;
  overflow: hidden;
  background: #111;
}

.video-card-featured .video-thumb {
  aspect-ratio: 9 / 7;
}

@media (min-width: 1024px) {
  .video-thumb { aspect-ratio: 9 / 16; }
  .video-card-featured .video-thumb { aspect-ratio: 9 / 8; }
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Label overlay */
.video-label-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.72));
  padding: 1.5rem 0.625rem 0.625rem;
  display: flex;
  align-items: flex-end;
  gap: 0.4rem;
}

.video-badge {
  color: #fff;
  font-family: var(--font-headline);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 0.12rem 0.4rem;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.video-title-overlay {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  line-height: 1.3;
  text-shadow: 0 1px 4px rgba(0,0,0,0.6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
