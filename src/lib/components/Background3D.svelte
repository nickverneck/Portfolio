<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { ThreeBackground } from '$lib/utils/three-background.js';

  export let mouseInteraction = true;
  export let animationSpeed = 1.0;

  let container;
  let threeBackground;
  let isWebGLSupported = true;
  let isMobile = false;

  onMount(() => {
    // Only run in browser environment
    if (!browser) return;

    // Check device capabilities
    isMobile = ThreeBackground.isMobileDevice();
    isWebGLSupported = ThreeBackground.checkWebGLSupport();

    if (!isWebGLSupported) {
      return;
    }

    // Initialize Three.js background
    threeBackground = new ThreeBackground(container, {
      mouseInteraction,
      animationSpeed,
      isMobile
    });

    threeBackground.init();
  });

  onDestroy(() => {
    if (!browser) return;
    
    if (threeBackground) {
      threeBackground.dispose();
    }
  });
</script>

<div class="background-3d" bind:this={container}>
  {#if !isWebGLSupported}
    <div class="fallback-background">
      <div class="gradient-animation"></div>
    </div>
  {/if}
</div>

<style>
  .background-3d {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  }

  .fallback-background {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
    position: relative;
  }

  .gradient-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(64, 224, 208, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(100, 149, 237, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(138, 43, 226, 0.05) 0%, transparent 50%);
    animation: gradientShift 10s ease-in-out infinite alternate;
  }

  @keyframes gradientShift {
    0% {
      transform: scale(1) rotate(0deg);
      opacity: 0.3;
    }
    100% {
      transform: scale(1.1) rotate(5deg);
      opacity: 0.5;
    }
  }

  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    .gradient-animation {
      animation: none;
    }
  }
</style>