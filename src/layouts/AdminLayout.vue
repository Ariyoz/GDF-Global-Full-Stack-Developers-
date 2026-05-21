<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/layout/AdminSidebar.vue'
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--background);
}

.admin-main {
  flex: 1;
  overflow-y: auto;
  max-width: 1200px;
}
</style>
