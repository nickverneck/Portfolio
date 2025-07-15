<script>
  import { onMount } from 'svelte';
  
  let isScrolled = false;
  let currentSection = '';
  
  // Navigation items with SVG icons
  const navItems = [
    { 
      id: 'hero', 
      label: 'Home', 
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>` 
    },
    { 
      id: 'companies', 
      label: 'Experience', 
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>` 
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
        <path d="M9 18h6"/>
        <path d="M10 22h4"/>
      </svg>` 
    },
    { 
      id: 'skills', 
      label: 'Skills', 
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
      </svg>` 
    },
    { 
      id: 'contact', 
      label: 'Contact', 
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>` 
    },
    { 
      id: 'licenses', 
      label: 'Certifications', 
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>` 
    }
  ];
  
  // Smooth scroll to section
  function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
  
  // Handle scroll events for sticky header and active section
  function handleScroll() {
    isScrolled = window.scrollY > 50;
    
    // Update active section based on scroll position
    const sections = navItems.map(item => document.getElementById(item.id)).filter(Boolean);
    const scrollPosition = window.scrollY + 150; // Offset for header height
    
    let activeSection = '';
    
    // Find which section we're currently in
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        // Check if scroll position is within this section's boundaries
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          activeSection = section.id;
          break;
        }
      }
    }
    
    // If no section is found (e.g., at very bottom), use the last section
    if (!activeSection && sections.length > 0) {
      const lastSection = sections[sections.length - 1];
      if (lastSection && scrollPosition >= lastSection.offsetTop) {
        activeSection = lastSection.id;
      }
    }
    
    // Default to hero if we're at the top
    if (!activeSection) {
      activeSection = 'hero';
    }
    
    currentSection = activeSection;
  }
  
  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    
    // Initial scroll check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<!-- Desktop Header -->
<header class="header-desktop hide-mobile" class:scrolled={isScrolled}>
  <div class="container">
    <div class="header-content">
      <!-- Logo/Brand -->
      <div class="brand">
        <button 
          class="brand-link"
          on:click={() => scrollToSection('hero')}
          aria-label="Go to top"
        >
          <span class="brand-text">NV</span>
        </button>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="nav-desktop" aria-label="Main navigation">
        <ul class="nav-list">
          {#each navItems as item}
            <li class="nav-item">
              <button
                class="nav-link"
                class:active={currentSection === item.id}
                on:click={() => scrollToSection(item.id)}
                aria-current={currentSection === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            </li>
          {/each}
        </ul>
      </nav>
    </div>
  </div>
</header>

<!-- Mobile Bottom Navigation -->
<nav class="nav-bottom show-mobile" aria-label="Mobile navigation">
  <div class="nav-bottom-content">
    {#each navItems as item}
      <button
        class="nav-bottom-item"
        class:active={currentSection === item.id}
        on:click={() => scrollToSection(item.id)}
        aria-current={currentSection === item.id ? 'page' : undefined}
        aria-label={item.label}
      >
        <span class="nav-icon">{@html item.icon}</span>
        <span class="nav-label">{item.label}</span>
      </button>
    {/each}
  </div>
</nav>

<style>
  /* Desktop Header */
  .header-desktop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: all var(--transition-normal);
    background: var(--glass-bg-secondary);
    backdrop-filter: blur(var(--glass-blur-light));
    -webkit-backdrop-filter: blur(var(--glass-blur-light));
    border-bottom: 1px solid var(--glass-border);
  }
  
  .header-desktop.scrolled {
    background: var(--glass-bg-primary);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border-bottom-color: var(--glass-border-hover);
    box-shadow: var(--glass-shadow);
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
    padding: 0;
  }
  
  /* Brand/Logo */
  .brand-link {
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    transition: all var(--transition-normal);
  }
  
  .brand-link:hover {
    background: var(--glass-bg-secondary);
  }
  
  .brand-text {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }
  
  /* Desktop Navigation */
  .nav-desktop {
    display: flex;
  }
  
  .nav-list {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .nav-link {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-family: var(--font-primary);
    font-size: 0.9rem;
    font-weight: 500;
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-sm);
    transition: all var(--transition-normal);
    position: relative;
  }
  
  .nav-link:hover {
    color: var(--text-primary);
    background: var(--glass-bg-secondary);
  }
  
  .nav-link.active {
    color: var(--text-primary);
    background: var(--glass-bg-accent);
  }
  
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background: rgba(64, 224, 208, 0.8);
    border-radius: 50%;
  }
  
  /* Mobile Bottom Navigation */
  .nav-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: var(--glass-bg-primary);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border-top: 1px solid var(--glass-border);
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.1);
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .nav-bottom-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: var(--space-sm) var(--space-md);
    max-width: 100%;
    overflow-x: auto;
  }
  
  .nav-bottom-item {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    transition: all var(--transition-normal);
    min-width: 60px;
    flex: 1;
    max-width: 80px;
  }
  
  .nav-bottom-item:hover {
    background: var(--glass-bg-secondary);
  }
  
  .nav-bottom-item.active {
    background: var(--glass-bg-accent);
  }
  
  .nav-icon {
    width: 20px;
    height: 20px;
    margin-bottom: 4px;
    display: block;
    color: var(--text-secondary);
    transition: color var(--transition-normal);
  }
  
  .nav-icon :global(svg) {
    width: 100%;
    height: 100%;
    stroke: currentColor;
  }
  
  .nav-bottom-item.active .nav-icon {
    color: var(--text-primary);
  }
  
  .nav-label {
    font-family: var(--font-primary);
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-secondary);
    text-align: center;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  
  .nav-bottom-item.active .nav-label {
    color: var(--text-primary);
  }
  
  /* Focus styles for accessibility */
  .brand-link:focus-visible,
  .nav-link:focus-visible,
  .nav-bottom-item:focus-visible {
    outline: 2px solid rgba(64, 224, 208, 0.6);
    outline-offset: 2px;
  }
  
  /* Responsive adjustments */
  @media (max-width: 47.9375em) {
    /* Reduce blur effects on mobile for better performance */
    .nav-bottom {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    
    .nav-bottom-content {
      padding: var(--space-sm) var(--space-xs);
    }
    
    .nav-bottom-item {
      min-width: 50px;
      padding: var(--space-xs);
    }
    
    .nav-icon {
      font-size: 1.1rem;
    }
    
    .nav-label {
      font-size: 0.65rem;
    }
  }
  
  /* Very small screens */
  @media (max-width: 320px) {
    .nav-label {
      display: none;
    }
    
    .nav-icon {
      font-size: 1.3rem;
      margin-bottom: 0;
    }
    
    .nav-bottom-item {
      min-width: 40px;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .nav-link.active::after {
      background: #00ffff;
    }
    
    .nav-bottom-item.active {
      border: 2px solid #00ffff;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .header-desktop,
    .nav-link,
    .nav-bottom-item,
    .brand-link {
      transition: none;
    }
  }
</style>