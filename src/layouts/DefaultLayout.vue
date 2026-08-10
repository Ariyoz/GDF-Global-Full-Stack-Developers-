<template>
  <div class="layout-default">
    <TheNavbar />

    <main class="layout-main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <TheFooter />

    <!-- Mobile Bottom Nav — floating pill (same as dashboard) -->
    <nav class="mobile-bottom-nav" aria-label="Mobile navigation">
      <div class="nav-pill">
        <RouterLink to="/" class="pill-item" :class="{ active: $route.path === '/' }">
          <span class="material-symbols-outlined" :style="$route.path === '/' ? 'font-variation-settings:\'FILL\' 1' : ''">home</span>
          <span class="pill-label">Home</span>
        </RouterLink>

        <RouterLink to="/explore" class="pill-item" :class="{ active: $route.path.startsWith('/explore') }">
          <span class="material-symbols-outlined" :style="$route.path.startsWith('/explore') ? 'font-variation-settings:\'FILL\' 1' : ''">search</span>
          <span class="pill-label">Explore</span>
        </RouterLink>

        <!-- Center floating + button -->
        <RouterLink to="/hire" class="pill-center-btn" aria-label="Post a project">
          <span class="material-symbols-outlined">add</span>
        </RouterLink>

        <RouterLink to="/jobs" class="pill-item" :class="{ active: $route.path.startsWith('/jobs') }">
          <span class="material-symbols-outlined" :style="$route.path.startsWith('/jobs') ? 'font-variation-settings:\'FILL\' 1' : ''">work_outline</span>
          <span class="pill-label">Jobs</span>
        </RouterLink>

        <RouterLink to="/auth/login" class="pill-item" :class="{ active: $route.path.startsWith('/auth') }">
          <span class="material-symbols-outlined">person</span>
          <span class="pill-label">Profile</span>
        </RouterLink>
      </div>
    </nav>

    <ToastContainer />
  </div>
</template>

<script setup>
import TheNavbar      from '@/components/layout/TheNavbar.vue'
import TheFooter      from '@/components/layout/TheFooter.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
</script>

<style scoped>
.layout-default { min-height:100vh; display:flex; flex-direction:column; background:var(--background); transition:background-color .3s; overflow-x:hidden; width:100%; max-width:100vw; }
.layout-main { flex:1; padding-top:calc(72px + env(safe-area-inset-top,0px)); }

/* Floating pill nav */
.mobile-bottom-nav { display:none; position:fixed; bottom:0; left:0; right:0; z-index:500; justify-content:center; align-items:flex-end; padding:0 1rem calc(.875rem + env(safe-area-inset-bottom,0px)); background:transparent; pointer-events:none; }
@media(max-width:767px){
  .mobile-bottom-nav { display:flex; }
  .layout-main { padding-bottom: calc(100px + env(safe-area-inset-bottom, 0px)); }
}
.nav-pill { display:flex; align-items:center; justify-content:space-around; background:var(--surface-container-lowest); border:1px solid var(--outline-variant); border-radius:999px; padding:.5rem .75rem; box-shadow:0 4px 24px rgba(0,0,0,.15),0 1px 4px rgba(0,0,0,.08); width:100%; max-width:420px; position:relative; pointer-events:all; height:64px; box-sizing:border-box; }
.pill-item { display:flex; flex-direction:column; align-items:center; gap:2px; text-decoration:none; color:var(--on-surface-variant); font-family:var(--font-headline); font-size:.6rem; font-weight:600; padding:.35rem .6rem; border-radius:999px; transition:all .2s cubic-bezier(0.34,1.56,0.64,1); background:none; border:none; cursor:pointer; position:relative; flex:1; min-width:0; }
.pill-item .material-symbols-outlined { font-size:22px; transition:transform .2s cubic-bezier(0.34,1.56,0.64,1); }
.pill-item.active { color:var(--primary); background:rgba(99,14,212,.1); }
.pill-item.active .material-symbols-outlined { transform:scale(1.1); }
.pill-label { font-size:.65rem; font-weight:600; white-space:nowrap; }
.pill-center-btn { width:56px; height:56px; border-radius:50%; background:var(--gradient-primary); border:none; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; margin:-22px .35rem 0; box-shadow:0 4px 20px rgba(99,14,212,.55),0 0 0 4px var(--surface-container-lowest),0 0 0 5px rgba(99,14,212,.15); transition:transform .18s cubic-bezier(0.34,1.56,0.64,1),box-shadow .18s; position:relative; z-index:1; text-decoration:none; }
.pill-center-btn:hover { transform:scale(1.07); }
.pill-center-btn:active { transform:scale(.93); }
.pill-center-btn .material-symbols-outlined { font-size:26px; }
</style>
