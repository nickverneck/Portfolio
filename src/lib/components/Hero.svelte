<script>
  import { onMount } from 'svelte';
  
  // Hero content data
  const heroData = {
    name: "Nicollas Verneck",
    title: "Full Stack Developer",
    subtitle: "Crafting innovative solutions with modern web technologies and AI"
  };
  
  // Animation state
  let mounted = false;
  let nameVisible = false;
  let titleVisible = false;
  let subtitleVisible = false;
  
  onMount(() => {
    mounted = true;
    
    // Staggered animation reveals
    setTimeout(() => nameVisible = true, 200);
    setTimeout(() => titleVisible = true, 600);
    setTimeout(() => subtitleVisible = true, 1000);
  });
</script>

<section class="hero">
  <div class="hero-container">
    <div class="hero-content glass-card" class:mounted>
      <div class="hero-text">
        <h1 
          class="hero-name heading-1" 
          class:visible={nameVisible}
          aria-label="Nicollas Verneck - Full Stack Developer"
        >
          {heroData.name}
        </h1>
        
        <h2 
          class="hero-title heading-2" 
          class:visible={titleVisible}
        >
          {heroData.title}
        </h2>
        
        <p 
          class="hero-subtitle body-large" 
          class:visible={subtitleVisible}
        >
          {heroData.subtitle}
        </p>
      </div>
      
      <div class="hero-cta" class:visible={subtitleVisible}>
        <button class="glass-button cta-button" aria-label="View my work">
          View My Work
        </button>
        <button class="glass-button cta-button secondary" aria-label="Get in touch">
          Get In Touch
        </button>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    overflow: hidden;
  }
  
  .hero-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-lg);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .hero-content {
    position: relative;
    text-align: center;
    padding: var(--space-3xl) var(--space-2xl);
    max-width: 800px;
    width: 100%;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .hero-content.mounted {
    opacity: 1;
    transform: translateY(0);
  }
  
  .hero-text {
    margin-bottom: var(--space-2xl);
  }
  
  .hero-name {
    margin-bottom: var(--space-md);
    background: linear-gradient(135deg, var(--text-primary), rgba(64, 224, 208, 0.8));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .hero-name.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .hero-title {
    margin-bottom: var(--space-lg);
    color: var(--text-primary);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  }
  
  .hero-title.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .hero-subtitle {
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto var(--space-xl);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
  }
  
  .hero-subtitle.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .hero-cta {
    display: flex;
    gap: var(--space-lg);
    justify-content: center;
    flex-wrap: wrap;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
  }
  
  .hero-cta.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .cta-button {
    padding: var(--space-md) var(--space-xl);
    font-size: 1.1rem;
    font-weight: 600;
    min-width: 160px;
    position: relative;
    overflow: hidden;
  }
  
  .cta-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  .cta-button:hover::before {
    left: 100%;
  }
  
  .cta-button.secondary {
    background: var(--glass-bg-secondary);
    border-color: var(--glass-border);
  }
  
  .cta-button.secondary:hover {
    background: var(--glass-bg-primary);
    border-color: var(--glass-border-hover);
  }
  
  /* Responsive Design */
  
  /* Small Mobile (up to 480px) */
  @media (max-width: 30em) {
    .hero {
      min-height: 90vh;
      padding: var(--space-lg) 0;
    }
    
    .hero-container {
      padding: 0 var(--space-md);
    }
    
    .hero-content {
      padding: var(--space-2xl) var(--space-lg);
    }
    
    .hero-name {
      font-size: clamp(1.75rem, 8vw, 2.5rem);
      line-height: 1.1;
    }
    
    .hero-title {
      font-size: clamp(1.25rem, 6vw, 1.75rem);
    }
    
    .hero-subtitle {
      font-size: 1rem;
      line-height: 1.5;
    }
    
    .hero-cta {
      flex-direction: column;
      align-items: center;
      gap: var(--space-md);
    }
    
    .cta-button {
      width: 100%;
      max-width: 280px;
      padding: var(--space-md) var(--space-lg);
      font-size: 1rem;
    }
  }
  
  /* Mobile (481px - 768px) */
  @media (min-width: 30.0625em) and (max-width: 48em) {
    .hero {
      min-height: 95vh;
    }
    
    .hero-content {
      padding: var(--space-2xl) var(--space-xl);
    }
    
    .hero-cta {
      gap: var(--space-md);
    }
    
    .cta-button {
      min-width: 140px;
      font-size: 1rem;
    }
  }
  
  /* Tablet (769px - 1024px) */
  @media (min-width: 48.0625em) and (max-width: 64em) {
    .hero-content {
      padding: var(--space-3xl) var(--space-2xl);
    }
    
    .hero-name {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
    }
    
    .hero-title {
      font-size: clamp(1.75rem, 4vw, 2.25rem);
    }
  }
  
  /* Desktop (1025px+) */
  @media (min-width: 64.0625em) {
    .hero {
      min-height: 100vh;
    }
    
    .hero-content {
      padding: var(--space-3xl) var(--space-2xl);
    }
    
    .hero-name {
      font-size: clamp(3rem, 5vw, 4rem);
    }
    
    .hero-title {
      font-size: clamp(2rem, 4vw, 2.5rem);
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
    }
    
    .cta-button {
      font-size: 1.1rem;
      padding: var(--space-md) var(--space-xl);
    }
  }
  
  /* Large Desktop (1441px+) */
  @media (min-width: 90.0625em) {
    .hero-content {
      padding: 4rem 3rem;
    }
    
    .hero-name {
      font-size: 4.5rem;
    }
    
    .hero-title {
      font-size: 2.75rem;
    }
    
    .hero-subtitle {
      font-size: 1.375rem;
    }
  }
  
  /* Accessibility and Performance */
  
  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .hero-content,
    .hero-name,
    .hero-title,
    .hero-subtitle,
    .hero-cta {
      transition: none;
      animation: none;
    }
    
    .hero-content.mounted,
    .hero-name.visible,
    .hero-title.visible,
    .hero-subtitle.visible,
    .hero-cta.visible {
      opacity: 1;
      transform: none;
    }
    
    .cta-button::before {
      display: none;
    }
  }
  
  /* High contrast mode */
  @media (prefers-contrast: high) {
    .hero-name {
      background: none;
      -webkit-text-fill-color: var(--text-primary);
      color: var(--text-primary);
    }
    
    .hero-content {
      border: 2px solid var(--glass-border);
    }
  }
  
  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .cta-button:hover::before {
      left: -100%;
    }
    
    .cta-button:active {
      transform: scale(0.98);
    }
  }
  
  /* Focus styles for accessibility */
  .cta-button:focus-visible {
    outline: 2px solid rgba(64, 224, 208, 0.6);
    outline-offset: 4px;
  }
</style>