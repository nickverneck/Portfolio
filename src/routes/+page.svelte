<script>
  import Background3D from '$lib/components/Background3D.svelte';
  import Header from '$lib/components/Header.svelte';
  import Hero from '$lib/components/Hero.svelte';
</script>

<Background3D />
<Header />

<main class="main-content">
  <Hero />
  
  <!-- Other sections will be added in subsequent tasks -->
  <section class="section container">
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 class="heading-2">Portfolio Refactor in Progress</h2>
      <p class="body-normal">The glassmorphism design system and responsive layout are now implemented.</p>
      <button class="glass-button">Explore More</button>
    </div>
  </section>
</main>

<style>
  .main-content {
    position: relative;
    z-index: 1;
  }
</style>
