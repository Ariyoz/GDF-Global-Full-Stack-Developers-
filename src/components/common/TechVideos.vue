<template>
  <section class="section-gfd tech-videos-section">
    <div class="container-gfd">

      <!-- Header -->
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
          <!-- Inline autoplay video -->
          <div class="video-thumb">
            <video
              class="video-player"
              :src="video.src"
              autoplay
              muted
              loop
              playsinline
              preload="metadata"
            />
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
const videos = [
  {
    id: 1,
    title: 'Developer at work',
    badge: 'CODE',
    badgeColor: 'var(--primary)',
    src: 'https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4',
  },
  {
    id: 2,
    title: 'Team collaboration',
    badge: 'COLLAB',
    badgeColor: '#16a34a',
    src: 'https://videos.pexels.com/video-files/3205571/3205571-hd_1920_1080_25fps.mp4',
  },
  {
    id: 3,
    title: 'Data analysis',
    badge: 'DATA',
    badgeColor: '#0284c7',
    src: 'https://videos.pexels.com/video-files/7989672/7989672-hd_1920_1080_25fps.mp4',
  },
  {
    id: 4,
    title: 'Building the future',
    badge: 'BUILD',
    badgeColor: '#b45309',
    src: 'https://videos.pexels.com/video-files/3194128/3194128-hd_1920_1080_25fps.mp4',
  },
]
</script>

<style scoped>
.tech-videos-section {
  background: var(--surface-container-low);
}

.section-top {
  margin-bottom: 1.5rem;
}

/* ── Grid ── */
.videos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
}

@media (min-width: 768px) {
  .videos-grid {
    grid-template-columns: repeat(4, 1fr);
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
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.video-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 14, 212, 0.12);
}

/* ── Thumbnail ── */
.video-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  overflow: hidden;
  background: #111;
}

.video-card-featured .video-thumb {
  aspect-ratio: 16 / 9;
}

@media (min-width: 768px) {
  .video-thumb {
    aspect-ratio: 9 / 14;
  }
  .video-card-featured .video-thumb {
    aspect-ratio: 16 / 10;
  }
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Label bar at bottom */
.video-label-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  padding: 1.5rem 0.75rem 0.75rem;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.video-badge {
  color: #fff;
  font-family: var(--font-headline);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.video-title-overlay {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.3;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}
</style>
