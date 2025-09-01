<script setup lang="ts">
import CryptoDashboard from './components/CryptoDashboard.vue';
</script>

<template>
  <div id="app">
    <CryptoDashboard />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #0f0f23;
  min-height: 100vh;
  color: #ffffff;
}

#app {
  min-height: 100vh;
  padding: 0;
}

/* Global styles for better UX */
button {
  font-family: inherit;
}

input, select {
  font-family: inherit;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Focus styles for accessibility */
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
</style>
