<script>
  import { onMount } from 'svelte';
  import { initGlassmorphism } from '$lib/utils/glassmorphism.js';
  import '../app.css';

  onMount(() => {
    initGlassmorphism();
  });
</script>

<main class="app">
  <slot />
</main>

<style>
  :global(html) {
    height: 100%;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0a0a0a;
    color: rgba(255, 255, 255, 0.9);
    overflow-x: hidden;
  }

  .app {
    min-height: 100vh;
    position: relative;
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(a) {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  :global(a:hover) {
    color: rgba(255, 255, 255, 1);
  }
</style>