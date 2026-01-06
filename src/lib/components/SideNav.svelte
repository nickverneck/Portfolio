<script>
  import { onMount } from 'svelte';

  export let isExpanded = false;

  let currentSection = '';
  let hasManualToggle = false;

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

  function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  function toggleNav() {
    isExpanded = !isExpanded;
    hasManualToggle = true;
  }

  function handleScroll() {
    const sections = navItems.map(item => document.getElementById(item.id)).filter(Boolean);
    const scrollPosition = window.scrollY + 120;
    let activeSection = '';

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        activeSection = section.id;
        break;
      }
    }

    if (!activeSection && sections.length > 0) {
      const lastSection = sections[sections.length - 1];
      if (scrollPosition >= lastSection.offsetTop) {
        activeSection = lastSection.id;
      }
    }

    currentSection = activeSection || 'hero';
  }

  onMount(() => {
    const mediaQuery = window.matchMedia('(min-width: 64em)');
    const addMediaListener = mediaQuery.addEventListener ? 'addEventListener' : 'addListener';
    const removeMediaListener = mediaQuery.removeEventListener ? 'removeEventListener' : 'removeListener';
    const syncWithViewport = () => {
      if (!hasManualToggle) {
        isExpanded = mediaQuery.matches;
      }
    };

    syncWithViewport();
    mediaQuery[addMediaListener]('change', syncWithViewport);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      mediaQuery[removeMediaListener]('change', syncWithViewport);
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<aside class="side-nav" class:expanded={isExpanded} aria-label="Primary navigation">
  <div class="side-nav-content">
    <div class="side-nav-header">
      <button
        class="brand-button"
        on:click={() => scrollToSection('hero')}
        aria-label="Go to top"
        type="button"
      >
        <span class="brand-mark">NV</span>
        <span class="brand-name">Nicollas Verneck</span>
      </button>

      <button
        class="toggle-button"
        on:click={toggleNav}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Collapse menu' : 'Expand menu'}
        type="button"
      >
        <span class="toggle-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </span>
      </button>
    </div>

    <nav class="side-nav-links" aria-label="Sections">
      <ul class="nav-list">
        {#each navItems as item}
          <li>
            <button
              class="nav-item"
              class:active={currentSection === item.id}
              on:click={() => scrollToSection(item.id)}
              aria-current={currentSection === item.id ? 'page' : undefined}
              aria-label={item.label}
              type="button"
            >
              <span class="nav-icon">{@html item.icon}</span>
              <span class="nav-label">{item.label}</span>
            </button>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</aside>

<style>
  .side-nav {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: var(--side-nav-collapsed);
    padding: var(--space-lg) var(--space-sm);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03));
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border-right: 1px solid var(--glass-border);
    z-index: 1000;
    transition: width var(--transition-normal), padding var(--transition-normal);
  }

  .side-nav.expanded {
    width: var(--side-nav-expanded);
    padding: var(--space-lg) var(--space-md);
  }

  .side-nav-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: var(--space-xl);
  }

  .side-nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .brand-button {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    background: none;
    border: none;
    padding: var(--space-xs);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    cursor: pointer;
    transition: background var(--transition-normal);
    min-width: 0;
  }

  .brand-button:hover {
    background: var(--glass-bg-secondary);
  }

  .brand-mark {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: var(--glass-bg-secondary);
    color: var(--text-primary);
    font-family: var(--font-heading);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .brand-name {
    font-family: var(--font-heading);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    max-width: 0;
    opacity: 0;
    transform: translateX(-6px);
    overflow: hidden;
    transition: all var(--transition-normal);
  }

  .side-nav.expanded .brand-name {
    max-width: 220px;
    opacity: 1;
    transform: translateX(0);
  }

  .toggle-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--glass-bg-secondary);
    border: 1px solid var(--glass-border);
    color: var(--text-primary);
    border-radius: var(--radius-sm);
    padding: var(--space-xs);
    cursor: pointer;
    transition: all var(--transition-normal);
  }

  .toggle-button:hover {
    background: var(--glass-bg-hover);
    border-color: var(--glass-border-hover);
  }

  .toggle-icon {
    width: 16px;
    height: 16px;
    display: block;
    transition: transform var(--transition-normal);
  }

  .toggle-icon :global(svg) {
    width: 100%;
    height: 100%;
  }

  .side-nav.expanded .toggle-icon {
    transform: rotate(180deg);
  }

  .side-nav-links {
    flex: 1;
  }

  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .nav-item {
    width: 100%;
    border: none;
    background: none;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-normal);
    position: relative;
  }

  .side-nav.expanded .nav-item {
    justify-content: flex-start;
    padding: var(--space-sm) var(--space-md);
  }

  .side-nav:not(.expanded) .nav-item,
  .side-nav:not(.expanded) .brand-button {
    gap: 0;
  }

  .nav-item:hover {
    color: var(--text-primary);
    background: var(--glass-bg-secondary);
  }

  .nav-item.active {
    color: var(--text-primary);
    background: var(--glass-bg-accent);
    box-shadow: 0 10px 24px rgba(64, 224, 208, 0.15);
  }

  .nav-icon {
    width: 20px;
    height: 20px;
    display: block;
    color: currentColor;
  }

  .nav-icon :global(svg) {
    width: 100%;
    height: 100%;
    stroke: currentColor;
  }

  .nav-label {
    font-family: var(--font-primary);
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
    max-width: 0;
    opacity: 0;
    transform: translateX(-6px);
    overflow: hidden;
    transition: all var(--transition-normal);
  }

  .side-nav.expanded .nav-label {
    max-width: 180px;
    opacity: 1;
    transform: translateX(0);
  }

  .nav-item:focus-visible,
  .toggle-button:focus-visible,
  .brand-button:focus-visible {
    outline: 2px solid rgba(64, 224, 208, 0.6);
    outline-offset: 2px;
  }

  @media (max-width: 48em) {
    .side-nav {
      padding: var(--space-md) var(--space-xs);
    }

    .side-nav.expanded {
      width: min(80vw, var(--side-nav-expanded));
      box-shadow: 20px 0 40px rgba(0, 0, 0, 0.35);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .side-nav,
    .nav-item,
    .nav-label,
    .brand-name,
    .toggle-icon,
    .brand-button,
    .toggle-button {
      transition: none;
    }
  }
</style>
