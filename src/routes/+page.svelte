<script>
  import Background3D from '$lib/components/Background3D.svelte';
  import Header from '$lib/components/Header.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import CompanyCarousel from '$lib/components/CompanyCarousel.svelte';
  import ProjectsSection from '$lib/components/ProjectsSection.svelte';
  import companiesData from '$lib/data/companies.json';
  
  const companies = companiesData.companies;
</script>

<Background3D />
<Header />

<main class="main-content">
  <!-- Hero Section -->
  <section id="hero" class="hero-section">
    <Hero />
  </section>
  
  <!-- Companies Section -->
  <section id="companies" class="section">
    <CompanyCarousel {companies} />
  </section>
  
  <!-- Projects Section -->
  <ProjectsSection />
  
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
    z-index: 10;
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
      padding-top: 0; /* No top header on mobile */
      padding-bottom: 80px; /* Account for bottom navigation */
    }
    
    .hero-section {
      min-height: calc(100vh - 80px);
    }
  }
</style>
