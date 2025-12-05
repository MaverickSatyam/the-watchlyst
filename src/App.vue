<!-- src/App.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import NavBar from './components/NavBar.vue';
import Footer from './components/Foot.vue';

const showFooter = ref(false);

onMounted(() => {
  // Simulate waiting for router-view to mount or load
  // (In a real app, use route guards or events if needed)
  setTimeout(() => {
    showFooter.value = true;
  }, 100); // slight delay to simulate last-load
});
</script>

<template>
  <div id="app">
    <NavBar />
    <router-view />
    <Footer v-if="showFooter" />
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
