<template>
  <div class="app-shell">
    <nav class="top-nav">
      <router-link to="/projects" class="nav-brand">网文转剧本</router-link>
      <div class="nav-links">
        <router-link to="/projects">项目</router-link>
        <router-link to="/settings">API 设置</router-link>
      </div>
    </nav>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>
