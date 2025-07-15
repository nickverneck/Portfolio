<script>
  import { onMount } from 'svelte';
  
  // Props
  export let skills = null;
  
  // State
  let searchTerm = '';
  let filteredCategories = [];
  let isLoading = true;
  let error = null;
  
  // Load skills data if not provided as prop
  onMount(async () => {
    if (!skills) {
      try {
        // Import the JSON data directly for better build compatibility
        const skillsModule = await import('$lib/data/skills.json');
        skills = skillsModule.default;
      } catch (err) {
        error = err.message;
        console.error('Error loading skills:', err);
      }
    }
    isLoading = false;
  });
  
  // Reactive filtering based on search term
  $: if (skills && skills.categories) {
    if (!searchTerm.trim()) {
      filteredCategories = skills.categories;
    } else {
      const searchLower = searchTerm.toLowerCase().trim();
      filteredCategories = skills.categories
        .map(category => ({
          ...category,
          skills: category.skills.filter(skill => 
            skill.toLowerCase().includes(searchLower) ||
            category.name.toLowerCase().includes(searchLower)
          )
        }))
        .filter(category => category.skills.length > 0);
    }
  }
  
  // Clear search
  function clearSearch() {
    searchTerm = '';
  }
  
  // Handle search input
  function handleSearchInput(event) {
    searchTerm = event.target.value;
  }
</script>

<section class="skills-section section" id="skills">
  <div class="container">
    <div class="skills-header">
      <h2 class="heading-2">Skills & Technologies</h2>
      <p class="body-large">
        Explore my technical expertise across various domains and technologies.
      </p>
    </div>
    
    <!-- Search Input -->
    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          type="text"
          placeholder="Search skills or categories..."
          class="glass-input search-input"
          bind:value={searchTerm}
          on:input={handleSearchInput}
          aria-label="Search skills and technologies"
        />
        {#if searchTerm}
          <button
            class="clear-search-btn"
            on:click={clearSearch}
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        {/if}
      </div>
      
      {#if searchTerm}
        <div class="search-results-info">
          <span class="body-small">
            {filteredCategories.reduce((total, cat) => total + cat.skills.length, 0)} skills found
          </span>
        </div>
      {/if}
    </div>
    
    <!-- Loading State -->
    {#if isLoading}
      <div class="loading-state">
        <div class="glass-card loading-card">
          <div class="loading-spinner"></div>
          <p class="body-normal">Loading skills...</p>
        </div>
      </div>
    {/if}
    
    <!-- Error State -->
    {#if error}
      <div class="error-state">
        <div class="glass-card error-card">
          <p class="body-normal">Failed to load skills: {error}</p>
        </div>
      </div>
    {/if}
    
    <!-- Skills Categories -->
    {#if !isLoading && !error && filteredCategories.length > 0}
      <div class="skills-grid">
        {#each filteredCategories as category (category.name)}
          <div class="skill-category glass-card fade-in">
            <h3 class="category-title heading-3">{category.name}</h3>
            <div class="skills-tags">
              {#each category.skills as skill (skill)}
                <span class="skill-tag glass-button" class:highlighted={searchTerm && skill.toLowerCase().includes(searchTerm.toLowerCase())}>
                  {skill}
                </span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
    
    <!-- No Results State -->
    {#if !isLoading && !error && searchTerm && filteredCategories.length === 0}
      <div class="no-results-state">
        <div class="glass-card no-results-card">
          <h3 class="heading-3">No skills found</h3>
          <p class="body-normal">
            No skills match your search term "{searchTerm}". Try a different keyword or 
            <button class="clear-link" on:click={clearSearch}>clear your search</button>.
          </p>
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .skills-section {
    position: relative;
    z-index: 2;
  }
  
  .skills-header {
    text-align: center;
    margin-bottom: var(--space-2xl);
  }
  
  .skills-header h2 {
    margin-bottom: var(--space-md);
  }
  
  .skills-header p {
    max-width: 600px;
    margin: 0 auto;
  }
  
  /* Search Container */
  .search-container {
    margin-bottom: var(--space-2xl);
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .search-input {
    width: 100%;
    padding: var(--space-md) var(--space-lg);
    font-size: 1rem;
    border-radius: var(--radius-lg);
    padding-right: 3rem;
  }
  
  .clear-search-btn {
    position: absolute;
    right: var(--space-md);
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: var(--space-xs);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .clear-search-btn:hover {
    color: var(--text-primary);
    background: var(--glass-bg-secondary);
  }
  
  .search-results-info {
    margin-top: var(--space-sm);
    text-align: center;
  }
  
  /* Loading and Error States */
  .loading-state,
  .error-state,
  .no-results-state {
    display: flex;
    justify-content: center;
    margin: var(--space-2xl) 0;
  }
  
  .loading-card,
  .error-card,
  .no-results-card {
    padding: var(--space-2xl);
    text-align: center;
    max-width: 400px;
  }
  
  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 2px solid var(--glass-border);
    border-top: 2px solid var(--text-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto var(--space-md);
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .clear-link {
    background: none;
    border: none;
    color: rgba(64, 224, 208, 0.8);
    cursor: pointer;
    text-decoration: underline;
    font-size: inherit;
    padding: 0;
    transition: color var(--transition-fast);
  }
  
  .clear-link:hover {
    color: rgba(64, 224, 208, 1);
  }
  
  /* Skills Grid */
  .skills-grid {
    display: grid;
    gap: var(--space-lg);
    grid-template-columns: 1fr;
  }
  
  .skill-category {
    padding: var(--space-xl);
    transition: all var(--transition-normal);
  }
  
  .category-title {
    margin-bottom: var(--space-lg);
    color: var(--text-primary);
    text-align: center;
  }
  
  .skills-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    justify-content: center;
  }
  
  .skill-tag {
    padding: var(--space-sm) var(--space-md);
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: var(--radius-md);
    transition: all var(--transition-normal);
    cursor: default;
    user-select: none;
  }
  
  .skill-tag.highlighted {
    background: var(--glass-bg-accent);
    border-color: rgba(64, 224, 208, 0.4);
    color: rgba(64, 224, 208, 1);
    box-shadow: 0 0 20px rgba(64, 224, 208, 0.2);
  }
  
  .skill-tag:hover {
    transform: translateY(-1px);
    box-shadow: var(--glass-shadow-hover);
  }
  
  /* Responsive Design */
  
  /* Small Mobile (480px+) */
  @media (min-width: 30em) {
    .skills-grid {
      grid-template-columns: 1fr;
    }
    
    .skills-tags {
      justify-content: flex-start;
    }
  }
  
  /* Tablet (768px+) */
  @media (min-width: 48em) {
    .skills-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .skill-category {
      padding: var(--space-2xl);
    }
    
    .category-title {
      text-align: left;
    }
    
    .skills-tags {
      justify-content: flex-start;
    }
  }
  
  /* Desktop (1024px+) */
  @media (min-width: 64em) {
    .skills-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .search-container {
      max-width: 600px;
    }
  }
  
  /* Large Desktop (1440px+) */
  @media (min-width: 90em) {
    .skills-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .skill-tag:hover {
      transform: none;
    }
    
    .skill-tag:active {
      transform: scale(0.95);
    }
    
    .clear-search-btn {
      padding: var(--space-sm);
    }
  }
  
  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .skill-tag,
    .skill-category,
    .clear-search-btn {
      transition: none;
    }
    
    .loading-spinner {
      animation: none;
    }
    
    .skill-tag:hover,
    .skill-category:hover {
      transform: none;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .skill-tag {
      border-width: 2px;
    }
    
    .skill-tag.highlighted {
      border-color: rgba(64, 224, 208, 1);
      background: rgba(64, 224, 208, 0.3);
    }
  }
</style>