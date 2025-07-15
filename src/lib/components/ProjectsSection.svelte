<script>
  import { onMount } from 'svelte';
  import projectsData from '$lib/data/projects.json';
  
  let projects = [];
  let loading = true;
  let error = null;

  // Load projects data from JSON
  onMount(async () => {
    try {
      projects = projectsData.projects || [];
      loading = false;
    } catch (err) {
      console.error('Error loading projects:', err);
      error = err.message;
      loading = false;
    }
  });

  // Handle GitHub repository link clicks
  function openGitHub(url) {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  // Get technology tags display
  function getTechTags(technologies) {
    return technologies?.slice(0, 4) || []; // Limit to 4 tags for clean display
  }
</script>

<section class="projects-section section" id="projects">
  <div class="container">
    <div class="section-header">
      <h2 class="heading-2">Featured Projects</h2>
      <p class="body-large section-description">
        Explore my latest work and contributions to open source projects
      </p>
    </div>

    {#if loading}
      <div class="loading-state">
        <div class="glass-card loading-card">
          <div class="loading-spinner"></div>
          <p class="body-normal">Loading projects...</p>
        </div>
      </div>
    {:else if error}
      <div class="error-state">
        <div class="glass-card error-card">
          <p class="body-normal">Failed to load projects: {error}</p>
          <button class="glass-button" on:click={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    {:else if projects.length === 0}
      <div class="empty-state">
        <div class="glass-card empty-card">
          <p class="body-normal">No projects found</p>
        </div>
      </div>
    {:else}
      <div class="projects-grid grid">
        {#each projects as project, index}
          <article 
            class="project-card glass-card fade-in" 
            style="animation-delay: {index * 0.1}s"
            class:featured={project.featured}
          >
            {#if project.image}
              <div class="project-image">
                <img 
                  src={project.image} 
                  alt="{project.name} preview"
                  loading="lazy"
                  on:error={(e) => e.target.style.display = 'none'}
                />
              </div>
            {/if}
            
            <div class="project-content">
              <div class="project-header">
                <h3 class="heading-3 project-title">{project.name}</h3>
                {#if project.featured}
                  <span class="featured-badge">Featured</span>
                {/if}
              </div>
              
              <p class="body-normal project-description">
                {project.description}
              </p>
              
              {#if project.technologies && project.technologies.length > 0}
                <div class="tech-tags">
                  {#each getTechTags(project.technologies) as tech}
                    <span class="tech-tag">{tech}</span>
                  {/each}
                  {#if project.technologies.length > 4}
                    <span class="tech-tag more-tag">+{project.technologies.length - 4}</span>
                  {/if}
                </div>
              {/if}
              
              <div class="project-actions">
                <button 
                  class="glass-button primary-button"
                  on:click={() => openGitHub(project.githubUrl)}
                  aria-label="View {project.name} on GitHub"
                >
                  <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Code
                </button>
              </div>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .projects-section {
    position: relative;
    z-index: 2;
  }

  .section-header {
    text-align: center;
    margin-bottom: var(--space-3xl);
  }

  .section-description {
    margin-top: var(--space-md);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Loading, Error, and Empty States */
  .loading-state,
  .error-state,
  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }

  .loading-card,
  .error-card,
  .empty-card {
    text-align: center;
    padding: var(--space-2xl);
    max-width: 400px;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--glass-border);
    border-top: 3px solid var(--text-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto var(--space-lg);
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-card button {
    margin-top: var(--space-lg);
  }

  /* Projects Grid */
  .projects-grid {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }

  /* Project Card */
  .project-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all var(--transition-normal);
    position: relative;
  }

  .project-card.featured {
    border-color: var(--glass-bg-accent);
    box-shadow: 0 8px 32px rgba(64, 224, 208, 0.1);
  }

  .project-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--glass-shadow-hover);
  }

  .project-card.featured:hover {
    box-shadow: 0 16px 48px rgba(64, 224, 208, 0.2);
  }

  /* Project Image */
  .project-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: var(--glass-bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
  }

  .project-card:hover .project-image img {
    transform: scale(1.05);
  }

  /* Project Content */
  .project-content {
    padding: var(--space-lg);
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .project-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: var(--space-md);
    gap: var(--space-md);
  }

  .project-title {
    flex: 1;
    margin: 0;
  }

  .featured-badge {
    background: var(--glass-bg-accent);
    color: var(--text-primary);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
    border: 1px solid rgba(64, 224, 208, 0.3);
  }

  .project-description {
    margin-bottom: var(--space-lg);
    flex: 1;
    line-height: 1.6;
  }

  /* Technology Tags */
  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .tech-tag {
    background: var(--glass-bg-secondary);
    color: var(--text-secondary);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid var(--glass-border);
    transition: all var(--transition-fast);
  }

  .tech-tag:hover {
    background: var(--glass-bg-primary);
    color: var(--text-primary);
  }

  .more-tag {
    background: var(--glass-bg-accent);
    color: var(--text-primary);
    border-color: rgba(64, 224, 208, 0.3);
  }

  /* Project Actions */
  .project-actions {
    margin-top: auto;
  }

  .primary-button {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    width: 100%;
    justify-content: center;
    padding: var(--space-md) var(--space-lg);
    font-weight: 600;
    background: var(--glass-bg-accent);
    border-color: rgba(64, 224, 208, 0.3);
  }

  .primary-button:hover {
    background: rgba(64, 224, 208, 0.3);
    transform: translateY(-2px);
  }

  .github-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  /* Responsive Design */
  
  /* Small Mobile (480px+) */
  @media (min-width: 30em) {
    .projects-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Tablet (768px+) */
  @media (min-width: 48em) {
    .projects-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .project-content {
      padding: var(--space-xl);
    }

    .project-image {
      height: 220px;
    }
  }

  /* Desktop (1024px+) */
  @media (min-width: 64em) {
    .projects-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .project-image {
      height: 240px;
    }

    .project-card:hover {
      transform: translateY(-12px);
    }
  }

  /* Large Desktop (1440px+) */
  @media (min-width: 90em) {
    .projects-grid {
      gap: var(--space-2xl);
    }
  }

  /* Mobile-specific optimizations */
  @media (max-width: 47.9375em) {
    .project-card {
      margin: 0 var(--space-xs);
    }

    .project-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-sm);
    }

    .featured-badge {
      align-self: flex-start;
    }

    .tech-tags {
      margin-bottom: var(--space-md);
    }

    .project-actions {
      margin-top: var(--space-md);
    }
  }

  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .project-card:hover {
      transform: none;
    }

    .project-card:active {
      transform: scale(0.98);
    }

    .project-image img {
      transform: none;
    }

    .project-card:hover .project-image img {
      transform: none;
    }
  }

  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .project-card,
    .project-image img,
    .tech-tag,
    .primary-button {
      transition: none;
    }

    .project-card:hover {
      transform: none;
    }

    .loading-spinner {
      animation: none;
    }

    .fade-in {
      animation: none;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .project-card {
      border-width: 2px;
    }

    .featured-badge,
    .tech-tag,
    .primary-button {
      border-width: 2px;
    }
  }
</style>