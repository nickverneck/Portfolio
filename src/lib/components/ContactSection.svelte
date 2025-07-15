<script>
  import { onMount } from 'svelte';
  
  // Props
  export let contactInfo = null;
  
  // State
  let isLoading = true;
  let error = null;
  
  // Load contact data if not provided as prop
  onMount(async () => {
    if (!contactInfo) {
      try {
        // Import the JSON data directly for better build compatibility
        const contactModule = await import('$lib/data/contact.json');
        contactInfo = contactModule.default;
      } catch (err) {
        error = err.message;
        console.error('Error loading contact info:', err);
      }
    }
    isLoading = false;
  });
  
  // Handle phone click
  function handlePhoneClick() {
    if (contactInfo?.phone) {
      window.location.href = `tel:${contactInfo.phone.replace(/[^\d]/g, '')}`;
    }
  }
  
  // Handle email click
  function handleEmailClick() {
    if (contactInfo?.email) {
      window.location.href = `mailto:${contactInfo.email}`;
    }
  }
  
  // Handle social link click
  function handleSocialClick(url) {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
</script>

<section class="contact-section section" id="contact">
  <div class="container">
    <div class="contact-header">
      <h2 class="heading-2">Get In Touch</h2>
      <p class="body-large">
        Ready to collaborate? Let's connect and discuss opportunities.
      </p>
    </div>
    
    <!-- Loading State -->
    {#if isLoading}
      <div class="loading-state">
        <div class="glass-card loading-card">
          <div class="loading-spinner"></div>
          <p class="body-normal">Loading contact information...</p>
        </div>
      </div>
    {/if}
    
    <!-- Error State -->
    {#if error}
      <div class="error-state">
        <div class="glass-card error-card">
          <p class="body-normal">Failed to load contact information: {error}</p>
        </div>
      </div>
    {/if}
    
    <!-- Contact Information -->
    {#if !isLoading && !error && contactInfo}
      <div class="contact-grid">
        <!-- Location Card -->
        <div class="contact-card glass-card fade-in">
          <div class="contact-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="contact-content">
            <h3 class="contact-title heading-3">Location</h3>
            <p class="contact-detail body-normal">{contactInfo.location}</p>
          </div>
        </div>
        
        <!-- Phone Card -->
        <div class="contact-card glass-card fade-in" role="button" tabindex="0" on:click={handlePhoneClick} on:keydown={(e) => e.key === 'Enter' && handlePhoneClick()}>
          <div class="contact-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div class="contact-content">
            <h3 class="contact-title heading-3">Phone</h3>
            <p class="contact-detail body-normal contact-link">{contactInfo.phone}</p>
          </div>
        </div>
        
        <!-- Email Card -->
        <div class="contact-card glass-card fade-in" role="button" tabindex="0" on:click={handleEmailClick} on:keydown={(e) => e.key === 'Enter' && handleEmailClick()}>
          <div class="contact-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <div class="contact-content">
            <h3 class="contact-title heading-3">Email</h3>
            <p class="contact-detail body-normal contact-link">{contactInfo.email}</p>
          </div>
        </div>
        
        <!-- Social Media Cards -->
        {#if contactInfo.social}
          <!-- LinkedIn Card -->
          {#if contactInfo.social.linkedin}
            <div class="contact-card glass-card fade-in" role="button" tabindex="0" on:click={() => handleSocialClick(contactInfo.social.linkedin.url)} on:keydown={(e) => e.key === 'Enter' && handleSocialClick(contactInfo.social.linkedin.url)}>
              <div class="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </div>
              <div class="contact-content">
                <h3 class="contact-title heading-3">{contactInfo.social.linkedin.display}</h3>
                <p class="contact-detail body-normal contact-link">{contactInfo.social.linkedin.username}</p>
              </div>
            </div>
          {/if}
          
          <!-- Instagram Card -->
          {#if contactInfo.social.instagram}
            <div class="contact-card glass-card fade-in" role="button" tabindex="0" on:click={() => handleSocialClick(contactInfo.social.instagram.url)} on:keydown={(e) => e.key === 'Enter' && handleSocialClick(contactInfo.social.instagram.url)}>
              <div class="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div class="contact-content">
                <h3 class="contact-title heading-3">{contactInfo.social.instagram.display}</h3>
                <p class="contact-detail body-normal contact-link">{contactInfo.social.instagram.username}</p>
              </div>
            </div>
          {/if}
        {/if}
      </div>
    {/if}
  </div>
</section>

<style>
  .contact-section {
    position: relative;
    z-index: 2;
  }
  
  .contact-header {
    text-align: center;
    margin-bottom: var(--space-2xl);
  }
  
  .contact-header h2 {
    margin-bottom: var(--space-md);
  }
  
  .contact-header p {
    max-width: 600px;
    margin: 0 auto;
  }
  
  /* Loading and Error States */
  .loading-state,
  .error-state {
    display: flex;
    justify-content: center;
    margin: var(--space-2xl) 0;
  }
  
  .loading-card,
  .error-card {
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
  
  /* Contact Grid */
  .contact-grid {
    display: grid;
    gap: var(--space-lg);
    grid-template-columns: 1fr;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .contact-card {
    padding: var(--space-xl);
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    transition: all var(--transition-normal);
    cursor: default;
  }
  
  .contact-card[role="button"] {
    cursor: pointer;
  }
  
  .contact-card[role="button"]:hover {
    background: var(--glass-bg-hover);
    border-color: var(--glass-border-hover);
    box-shadow: var(--glass-shadow-hover);
    transform: translateY(-2px);
  }
  
  .contact-card[role="button"]:focus-visible {
    outline: 2px solid rgba(64, 224, 208, 0.6);
    outline-offset: 2px;
  }
  
  .contact-icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--glass-bg-secondary);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    transition: all var(--transition-normal);
  }
  
  .contact-card[role="button"]:hover .contact-icon {
    background: var(--glass-bg-accent);
    color: rgba(64, 224, 208, 1);
    box-shadow: 0 0 20px rgba(64, 224, 208, 0.2);
  }
  
  .contact-content {
    flex: 1;
    min-width: 0;
  }
  
  .contact-title {
    margin-bottom: var(--space-xs);
    color: var(--text-primary);
  }
  
  .contact-detail {
    margin: 0;
    color: var(--text-secondary);
    word-break: break-word;
  }
  
  .contact-link {
    transition: color var(--transition-fast);
  }
  
  .contact-card[role="button"]:hover .contact-link {
    color: var(--text-primary);
  }
  
  /* Responsive Design */
  
  /* Small Mobile (480px+) */
  @media (min-width: 30em) {
    .contact-grid {
      grid-template-columns: 1fr;
    }
    
    .contact-card {
      padding: var(--space-lg) var(--space-xl);
    }
  }
  
  /* Tablet (768px+) */
  @media (min-width: 48em) {
    .contact-grid {
      grid-template-columns: repeat(2, 1fr);
      max-width: 900px;
    }
    
    .contact-card {
      padding: var(--space-xl);
      flex-direction: column;
      text-align: center;
      gap: var(--space-md);
    }
    
    .contact-icon {
      width: 56px;
      height: 56px;
    }
  }
  
  /* Desktop (1024px+) */
  @media (min-width: 64em) {
    .contact-grid {
      grid-template-columns: repeat(3, 1fr);
      max-width: 1000px;
    }
    
    .contact-card {
      padding: var(--space-2xl);
    }
    
    .contact-icon {
      width: 64px;
      height: 64px;
    }
  }
  
  /* Large Desktop (1440px+) */
  @media (min-width: 90em) {
    .contact-grid {
      max-width: 1200px;
    }
  }
  
  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .contact-card[role="button"]:hover {
      transform: none;
      background: var(--glass-bg-primary);
      border-color: var(--glass-border);
      box-shadow: var(--glass-shadow);
    }
    
    .contact-card[role="button"]:hover .contact-icon {
      background: var(--glass-bg-secondary);
      color: var(--text-primary);
      box-shadow: none;
    }
    
    .contact-card[role="button"]:hover .contact-link {
      color: var(--text-secondary);
    }
    
    .contact-card[role="button"]:active {
      transform: scale(0.98);
      background: var(--glass-bg-hover);
    }
    
    .contact-card[role="button"]:active .contact-icon {
      background: var(--glass-bg-accent);
      color: rgba(64, 224, 208, 1);
    }
    
    .contact-card[role="button"]:active .contact-link {
      color: var(--text-primary);
    }
  }
  
  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .contact-card,
    .contact-icon,
    .contact-link {
      transition: none;
    }
    
    .loading-spinner {
      animation: none;
    }
    
    .contact-card[role="button"]:hover {
      transform: none;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .contact-card {
      border-width: 2px;
    }
    
    .contact-icon {
      border: 1px solid var(--glass-border);
    }
    
    .contact-card[role="button"]:hover .contact-icon {
      border-color: rgba(64, 224, 208, 1);
    }
  }
  
  /* Focus management for keyboard navigation */
  .contact-card[role="button"]:focus {
    outline: none;
  }
  
  .contact-card[role="button"]:focus-visible {
    outline: 2px solid rgba(64, 224, 208, 0.6);
    outline-offset: 2px;
  }
  

</style>