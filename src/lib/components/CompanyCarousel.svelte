<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  
  export let companies = [];
  
  let scrollContainer;
  let isScrolling = false;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let animationId;
  let scrollSpeed = 0.5; // pixels per frame
  
  // Create duplicated companies for infinite scroll effect
  $: duplicatedCompanies = companies.length > 0 ? [...companies, ...companies, ...companies] : [];
  
  function startAutoScroll() {
    if (animationId) cancelAnimationFrame(animationId);
    
    function animate() {
      if (!isDragging && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        
        // Reset scroll position for infinite effect
        const maxScroll = scrollContainer.scrollWidth / 3; // Since we have 3 copies
        if (scrollContainer.scrollLeft >= maxScroll) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  function stopAutoScroll() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
  
  // Mouse drag functionality
  function handleMouseDown(e) {
    isDragging = true;
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
    scrollContainer.style.cursor = 'grabbing';
    e.preventDefault();
  }
  
  function handleMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainer.scrollLeft = scrollLeft - walk;
  }
  
  function handleMouseUp() {
    isDragging = false;
    scrollContainer.style.cursor = 'grab';
  }
  
  // Touch support
  function handleTouchStart(e) {
    isDragging = true;
    startX = e.touches[0].pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  }
  
  function handleTouchMove(e) {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainer.scrollLeft = scrollLeft - walk;
  }
  
  function handleTouchEnd() {
    isDragging = false;
  }
  
  // Wheel scroll support
  function handleWheel(e) {
    e.preventDefault();
    scrollContainer.scrollLeft += e.deltaY;
  }
  
  // Handle company logo click
  function handleCompanyClick(company, e) {
    // Only open link if not dragging
    if (!isDragging) {
      window.open(company.url, '_blank', 'noopener,noreferrer');
    }
    e.preventDefault();
  }
  
  onMount(() => {
    if (companies.length > 0) {
      startAutoScroll();
    }
    
    // Add global mouse event listeners
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      stopAutoScroll();
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  });
</script>

<section class="company-carousel-section">
  <div class="container">
    <h2 class="section-title">Companies I've Worked With</h2>
    
    <!-- Infinite Scroll Container -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div 
      class="scroll-container"
      role="region"
      aria-label="Company logos carousel - drag to scroll"
      bind:this={scrollContainer}
      on:mousedown={handleMouseDown}
      on:touchstart={handleTouchStart}
      on:touchmove={handleTouchMove}
      on:touchend={handleTouchEnd}
      on:wheel={handleWheel}
    >
      <div class="logos-track">
        {#each duplicatedCompanies as company, index}
          <button
            class="logo-item"
            on:click={(e) => handleCompanyClick(company, e)}
            aria-label="Visit {company.name} website"
          >
            <img 
              src={base + company.logo} 
              alt={company.alt}
              class="company-logo"
              loading="lazy"
            />
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .company-carousel-section {
    padding: 4rem 0;
    position: relative;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 3rem;
    color: rgba(255, 255, 255, 0.9);
    font-family: 'Space Grotesk', sans-serif;
  }
  
  .scroll-container {
    overflow-x: auto;
    overflow-y: hidden;
    cursor: grab;
    user-select: none;
    padding: 2rem 0;
    /* Hide scrollbar */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  
  .scroll-container::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  .scroll-container:active {
    cursor: grabbing;
  }
  
  .logos-track {
    display: flex;
    gap: 3rem;
    align-items: center;
    width: max-content;
    animation: none; /* We'll handle animation with JS */
  }
  
  .logo-item {
    background: none;
    border: none;
    cursor: pointer;
    padding: 1rem;
    border-radius: 12px;
    transition: all 0.3s ease;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .logo-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-4px) scale(1.05);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .company-logo {
    max-width: 120px;
    max-height: 60px;
    width: auto;
    height: auto;
    object-fit: contain;
    filter: brightness(0.8) contrast(1.1);
    transition: filter 0.3s ease;
  }
  
  .logo-item:hover .company-logo {
    filter: brightness(1) contrast(1.2);
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .company-carousel-section {
      padding: 3rem 0;
    }
    
    .container {
      padding: 0 1rem;
    }
    
    .section-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    
    .scroll-container {
      padding: 1.5rem 0;
    }
    
    .logos-track {
      gap: 2rem;
    }
    
    .logo-item {
      padding: 0.75rem;
    }
    
    .company-logo {
      max-width: 100px;
      max-height: 50px;
    }
  }
  
  @media (max-width: 480px) {
    .section-title {
      font-size: 1.75rem;
    }
    
    .logos-track {
      gap: 1.5rem;
    }
    
    .logo-item {
      padding: 0.5rem;
    }
    
    .company-logo {
      max-width: 80px;
      max-height: 40px;
    }
  }
</style>