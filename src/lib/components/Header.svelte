<script>
  import { onMount } from 'svelte';
  
  let isMenuOpen = false;
  let isScrolled = false;
  let currentSection = '';
  
  // Navigation items
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'companies', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
    { id: 'licenses', label: 'Certifications' }
  ];
  
  // Toggle mobile menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  // Close mobile menu
  function closeMenu() {
    isMenuOpen = false;
  }
  
  // Smooth scroll to section
  function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    closeMenu();
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
  
  // Handle escape key to close menu
  function handleKeydown(event) {
    if (event.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  }
  
  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeydown);
    
    // Initial scroll check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<header class="header" class:scrolled={isScrolled}>
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
      <nav class="nav-desktop hide-mobile" aria-label="Main navigation">
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
      
      <!-- Mobile Menu Button -->
      <button
        class="menu-toggle show-mobile"
        class:active={isMenuOpen}
        on:click={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
      >
        <span class="menu-icon">
          <span class="menu-line"></span>
          <span class="menu-line"></span>
          <span class="menu-line"></span>
        </span>
      </button>
    </div>
  </div>
  
  <!-- Mobile Navigation Menu -->
  <nav 
    class="nav-mobile show-mobile"
    class:open={isMenuOpen}
    id="mobile-menu"
    aria-label="Mobile navigation"
  >
    <div class="nav-mobile-content">
      <ul class="nav-mobile-list">
        {#each navItems as item}
          <li class="nav-mobile-item">
            <button
              class="nav-mobile-link"
              class:active={currentSection === item.id}
              on:click={() => scrollToSection(item.id)}
              aria-current={currentSection === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </nav>
  
  <!-- Mobile Menu Overlay -->
  {#if isMenuOpen}
    <div 
      class="menu-overlay show-mobile"
      on:click={closeMenu}
      on:keydown={(e) => e.key === 'Enter' && closeMenu()}
      role="button"
      tabindex="0"
      aria-label="Close menu"
    ></div>
  {/if}
</header>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: all var(--transition-normal);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .header.scrolled {
    background: var(--glass-bg-primary);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border-bottom-color: var(--glass-border);
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
  
  /* Mobile Menu Toggle */
  .menu-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    transition: all var(--transition-normal);
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .menu-toggle:hover {
    background: var(--glass-bg-secondary);
  }
  
  .menu-icon {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 18px;
    height: 14px;
  }
  
  .menu-line {
    width: 100%;
    height: 2px;
    background: var(--text-primary);
    border-radius: 1px;
    transition: all var(--transition-fast);
    transform-origin: center;
  }
  
  .menu-toggle.active .menu-line:nth-child(1) {
    transform: translateY(5px) rotate(45deg);
  }
  
  .menu-toggle.active .menu-line:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }
  
  .menu-toggle.active .menu-line:nth-child(3) {
    transform: translateY(-5px) rotate(-45deg);
  }
  
  /* Mobile Navigation */
  .nav-mobile {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--glass-bg-primary);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border-bottom: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-normal);
  }
  
  .nav-mobile.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-mobile-content {
    padding: var(--space-lg) 0;
  }
  
  .nav-mobile-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .nav-mobile-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .nav-mobile-item:last-child {
    border-bottom: none;
  }
  
  .nav-mobile-link {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-family: var(--font-primary);
    font-size: 1rem;
    font-weight: 500;
    padding: var(--space-md) var(--space-lg);
    width: 100%;
    text-align: left;
    transition: all var(--transition-normal);
    display: block;
  }
  
  .nav-mobile-link:hover {
    color: var(--text-primary);
    background: var(--glass-bg-secondary);
  }
  
  .nav-mobile-link.active {
    color: var(--text-primary);
    background: var(--glass-bg-accent);
    position: relative;
  }
  
  .nav-mobile-link.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: rgba(64, 224, 208, 0.8);
  }
  
  /* Mobile Menu Overlay */
  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: -1;
    cursor: pointer;
  }
  
  /* Focus styles for accessibility */
  .brand-link:focus-visible,
  .nav-link:focus-visible,
  .nav-mobile-link:focus-visible,
  .menu-toggle:focus-visible {
    outline: 2px solid rgba(64, 224, 208, 0.6);
    outline-offset: 2px;
  }
  
  /* Responsive adjustments */
  @media (max-width: 47.9375em) {
    .header-content {
      height: 3.5rem;
    }
    
    .brand-text {
      font-size: 1.25rem;
    }
    
    /* Reduce blur effects on mobile for better performance */
    .header,
    .nav-mobile {
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .nav-link.active::after {
      background: #00ffff;
    }
    
    .nav-mobile-link.active::before {
      background: #00ffff;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .header,
    .nav-mobile,
    .nav-link,
    .nav-mobile-link,
    .menu-toggle,
    .menu-line {
      transition: none;
    }
  }
</style>