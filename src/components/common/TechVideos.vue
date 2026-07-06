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
          :class="video.orientation === 'landscape' ? 'video-card-landscape' : 'video-card-portrait'"
        >
          <div class="video-thumb">
            <video
              class="video-player"
              muted
              loop
              playsinline
              preload="metadata"
              controls
              crossorigin="anonymous"
            >
              <source :src="video.src" type="video/mp4" />
            </video>
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
    orientation: 'portrait',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-developer-working-on-a-laptop-1587-large.mp4',
  },
  {
    id: 2,
    orientation: 'landscape',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-programmer-typing-code-on-laptop-15-large.mp4',
  },
  {
    id: 3,
    orientation: 'portrait',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-4781-large.mp4',
  },
  {
    id: 4,
    orientation: 'landscape',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-at-night-13-large.mp4',
  },
  {
    id: 5,
    orientation: 'portrait',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-at-her-laptop-computer-in-a-dark-room-47754-large.mp4',
  },
  {
    id: 6,
    orientation: 'landscape',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-programmer-working-in-dark-office-2539-large.mp4',
  },
  {
    id: 7,
    orientation: 'portrait',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-programmer-working-late-at-night-1034-large.mp4',
  },
]
</script>

<style scoped>
.tech-videos-section { background: var(--surface-container-low); }

.section-top { margin-bottom: 1.5rem; }

/* ── Grid: 2 cols mobile → auto-flow masonry-like on larger screens ── */
.videos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  align-items: start;
}

@media (min-width: 640px) {
  .videos-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) {
  .videos-grid { grid-template-columns: repeat(4, 1fr); }
  /* Landscape cards span 2 columns on desktop */
  .video-card-landscape { grid-column: span 2; }
}

/* ── Card ── */
.video-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--outline-variant);
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  cursor: default;
  background: #111;
}

.video-card:hover {
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(99, 14, 212, 0.15);
}

/* ── Thumbnail aspect ratios ── */
.video-thumb {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #111;
}

/* Portrait: 9:16 */
.video-card-portrait .video-thumb {
  aspect-ratio: 9 / 16;
}

/* Landscape: 16:9 */
.video-card-landscape .video-thumb {
  aspect-ratio: 16 / 9;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
