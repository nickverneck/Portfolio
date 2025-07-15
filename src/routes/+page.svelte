<script>
  import Background3D from '$lib/components/Background3D.svelte';
  import Header from '$lib/components/Header.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import CompanyCarousel from '$lib/components/CompanyCarousel.svelte';
  import ProjectsSection from '$lib/components/ProjectsSection.svelte';
  import SkillsSection from '$lib/components/SkillsSection.svelte';
  import ContactSection from '$lib/components/ContactSection.svelte';
  import LicensesSection from '$lib/components/LicensesSection.svelte';
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
  
  <!-- Skills Section -->
  <SkillsSection />
  
  <!-- Contact Section -->
  <ContactSection />
  
  <!-- Licenses Section -->
  <LicensesSection />
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
