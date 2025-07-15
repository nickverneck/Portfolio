<script>
  import Background3D from '$lib/components/Background3D.svelte';
  import Header from '$lib/components/Header.svelte';
  import Hero from '$lib/components/Hero.svelte';
</script>

<Background3D />
<Header />

<main class="main-content">
  <!-- Hero Section -->
  <section id="hero" class="hero-section">
    <Hero />
  </section>
  
  <!-- Companies Section (placeholder for task 7) -->
  <section id="companies" class="section container">
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 class="heading-2">Experience</h2>
      <p class="body-normal">Company carousel will be implemented in task 7.</p>
    </div>
  </section>
  
  <!-- Projects Section (placeholder for task 8) -->
  <section id="projects" class="section container">
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 class="heading-2">Projects</h2>
      <p class="body-normal">Projects showcase will be implemented in task 8.</p>
    </div>
  </section>
  
  <!-- Skills Section (placeholder for task 9) -->
  <section id="skills" class="section container">
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 class="heading-2">Skills</h2>
      <p class="body-normal">Skills section with search will be implemented in task 9.</p>
    </div>
  </section>
  
  <!-- Contact Section (placeholder for task 10) -->
  <section id="contact" class="section container">
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 class="heading-2">Contact</h2>
      <p class="body-normal">Contact information will be implemented in task 10.</p>
    </div>
  </section>
  
  <!-- Licenses Section (placeholder for task 11) -->
  <section id="licenses" class="section container">
    <div class="glass-card" style="padding: 2rem; text-align: center;">
      <h2 class="heading-2">Certifications</h2>
      <p class="body-normal">Licenses and certifications will be implemented in task 11.</p>
    </div>
  </section>
</main>

<style>
  .main-content {
    position: relative;
    z-index: 1;
    padding-top: 4rem; /* Account for fixed header */
  }
  
  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding-top: 0;
  }
  
  /* Adjust for mobile */
  @media (max-width: 47.9375em) {
    .main-content {
      padding-top: 3.5rem;
    }
  }
</style>
