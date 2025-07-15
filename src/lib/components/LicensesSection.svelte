<script>
  import { onMount } from 'svelte';
  import licensesData from '$lib/data/licenses.json';

  let certifications = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      certifications = licensesData.certifications;
    } catch (err) {
      console.error('Error loading certifications:', err);
      error = err.message;
    } finally {
      loading = false;
    }
  });

  function handleCertificationClick(url) {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
</script>

<section class="licenses-section" id="licenses">
  <div class="container">
    <h2 class="section-title">Licenses & Certifications</h2>
    
    {#if loading}
      <div class="loading-state">
        <div class="glass-card loading-card">
          <p>Loading certifications...</p>
        </div>
      </div>
    {:else if error}
      <div class="error-state">
        <div class="glass-card error-card">
          <p>Error loading certifications: {error}</p>
        </div>
      </div>
    {:else if certifications.length > 0}
      <div class="certifications-grid">
        {#each certifications as cert}
          <div 
            class="certification-card glass-card"
            role="button"
            tabindex="0"
            on:click={() => handleCertificationClick(cert.url)}
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCertificationClick(cert.url);
              }
            }}
          >
            <div class="cert-header">
              {#if cert.logo}
                <img 
                  src={cert.logo} 
                  alt="{cert.institution} logo"
                  class="institution-logo"
                  loading="lazy"
                />
              {/if}
              <div class="cert-meta">
                <h3 class="cert-title">{cert.title}</h3>
                <p class="cert-institution">{cert.institution}</p>
                <p class="cert-date">{cert.issueDate}</p>
              </div>
            </div>
            
            <div class="cert-body">
              <p class="cert-description">{cert.description}</p>
            </div>
            
            <div class="cert-footer">
              <span class="verify-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
                View Certificate
              </span>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="empty-state">
        <div class="glass-card empty-card">
          <p>No certifications available.</p>
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .licenses-section {
    padding: 4rem 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    width: 100%;
  }

  .section-title {
    font-size: 3rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 3rem;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .certifications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .certification-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }

  .certification-card:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .certification-card:focus {
    outline: 2px solid rgba(64, 224, 208, 0.5);
    outline-offset: 2px;
  }

  .certification-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #40e0d0, #48cae4, #40e0d0);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .certification-card:hover::before {
    opacity: 1;
  }

  .cert-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .institution-logo {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    padding: 8px;
    flex-shrink: 0;
  }

  .cert-meta {
    flex: 1;
  }

  .cert-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
  }

  .cert-institution {
    font-size: 1rem;
    font-weight: 500;
    color: rgba(64, 224, 208, 0.9);
    margin: 0 0 0.25rem 0;
  }

  .cert-date {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }

  .cert-body {
    margin-bottom: 1.5rem;
  }

  .cert-description {
    font-size: 0.95rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }

  .cert-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .verify-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(64, 224, 208, 0.9);
    transition: color 0.3s ease;
  }

  .certification-card:hover .verify-link {
    color: rgba(64, 224, 208, 1);
  }

  .verify-link svg {
    transition: transform 0.3s ease;
  }

  .certification-card:hover .verify-link svg {
    transform: translateX(2px);
  }

  /* Loading, Error, and Empty States */
  .loading-state,
  .error-state,
  .empty-state {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .loading-card,
  .error-card,
  .empty-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .loading-card p,
  .error-card p,
  .empty-card p {
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    font-size: 1rem;
  }

  .error-card {
    border-color: rgba(255, 99, 99, 0.3);
  }

  .error-card p {
    color: rgba(255, 99, 99, 0.9);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .licenses-section {
      padding: 2rem 0;
    }

    .container {
      padding: 0 1rem;
    }

    .section-title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }

    .certifications-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .certification-card {
      padding: 1.5rem;
    }

    .cert-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
    }

    .institution-logo {
      width: 56px;
      height: 56px;
    }

    .cert-title {
      font-size: 1.125rem;
    }
  }

  @media (max-width: 480px) {
    .section-title {
      font-size: 2rem;
    }

    .certification-card {
      padding: 1rem;
    }

    .cert-title {
      font-size: 1rem;
    }

    .cert-description {
      font-size: 0.875rem;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .certification-card {
      border-width: 2px;
    }

    .cert-title,
    .cert-institution,
    .verify-link {
      font-weight: 600;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .certification-card,
    .verify-link svg {
      transition: none;
    }

    .certification-card:hover {
      transform: none;
    }

    .certification-card:hover .verify-link svg {
      transform: none;
    }
  }
</style>