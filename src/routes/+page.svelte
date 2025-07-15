<script>
  import { onMount } from 'svelte';
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

  // Smooth scrolling implementation
  onMount(() => {
    // Enable smooth scrolling for the entire document
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add intersection observer for section animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => observer.observe(section));
    
    return () => {
      observer.disconnect();
    };
  });
</script>

<Background3D />
<Header />

<main class="main-content">
  <!-- Hero Section -->
  <div id="hero" class="hero-section">
    <Hero />
  </div>
  
  <!-- Companies Section -->
  <section id="companies" class="section companies-section">
    <div class="section-container">
      <h2 class="section-title">Experience</h2>
      <CompanyCarousel {companies} />
    </div>
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
  
  /* Section base styles */
  .section {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    scroll-margin-top: 5rem; /* For smooth scroll offset */
  }
  
  :global(.section.animate-in) {
    opacity: 1;
    transform: translateY(0);
  }
  
  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding-top: 0;
    opacity: 1; /* Hero should be visible immediately */
    transform: none;
  }
  
  .section-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 3rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(64, 224, 208, 0.8));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Individual section styling */
  .companies-section {
    padding: 5rem 0;
    min-height: auto;
    background: linear-gradient(180deg, transparent 0%, rgba(64, 224, 208, 0.02) 50%, transparent 100%);
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .main-content {
      padding-top: 0; /* No top header on mobile */
      padding-bottom: 80px; /* Account for bottom navigation */
    }
    
    .hero-section {
      min-height: calc(100vh - 80px);
    }
    
    .section-container {
      padding: 0 1rem;
    }
    
    .section-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    
    .companies-section {
      padding: 3rem 0;
    }
    
    .section {
      scroll-margin-top: 2rem;
    }
  }
  
  @media (max-width: 480px) {
    .section-title {
      font-size: 1.75rem;
    }
    
    .companies-section {
      padding: 2rem 0;
    }
  }
  
  /* Large desktop optimization */
  @media (min-width: 1400px) {
    .section-container {
      max-width: 1400px;
    }
    
    .section-title {
      font-size: 3rem;
    }
  }
  
  /* Animation delays for staggered effect */
  .companies-section {
    transition-delay: 0.1s;
  }
</style>
