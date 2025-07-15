<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  
  export let companies = [];
  
  let carousel;
  let currentIndex = 0;
  let isAutoPlaying = true;
  let autoPlayInterval;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let translateX = 0;
  
  // Auto-play functionality
  function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
      if (isAutoPlaying) {
        nextSlide();
      }
    }, 4000);
  }
  
  function stopAutoPlay() {
    isAutoPlaying = false;
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
  }
  
  function resumeAutoPlay() {
    isAutoPlaying = true;
    startAutoPlay();
  }
  
  // Navigation functions
  function nextSlide() {
    currentIndex = (currentIndex + 1) % companies.length;
    updateCarousel();
  }
  
  function prevSlide() {
    currentIndex = currentIndex === 0 ? companies.length - 1 : currentIndex - 1;
    updateCarousel();
  }
  
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }
  
  function updateCarousel() {
    if (carousel) {
      translateX = -currentIndex * 100;
    }
  }
  
  // Touch/swipe support
  function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoPlay();
  }
  
  function handleTouchMove(e) {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    
    // Add some resistance to the drag
    const resistance = Math.abs(diffX) > 50 ? 0.5 : 1;
    translateX = -currentIndex * 100 + (diffX / carousel.offsetWidth * 100) * resistance;
  }
  
  function handleTouchEnd() {
    if (!isDragging) return;
    
    const diffX = currentX - startX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    } else {
      updateCarousel();
    }
    
    isDragging = false;
    setTimeout(resumeAutoPlay, 1000);
  }
  
  // Mouse drag support for desktop
  function handleMouseDown(e) {
    startX = e.clientX;
    isDragging = true;
    stopAutoPlay();
    e.preventDefault();
  }
  
  function handleMouseMove(e) {
    if (!isDragging) return;
    currentX = e.clientX;
    const diffX = currentX - startX;
    
    const resistance = Math.abs(diffX) > 50 ? 0.5 : 1;
    translateX = -currentIndex * 100 + (diffX / carousel.offsetWidth * 100) * resistance;
  }
  
  function handleMouseUp() {
    if (!isDragging) return;
    
    const diffX = currentX - startX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    } else {
      updateCarousel();
    }
    
    isDragging = false;
    setTimeout(resumeAutoPlay, 1000);
  }
  
  // Handle company logo click
  function handleCompanyClick(company) {
    window.open(company.url, '_blank', 'noopener,noreferrer');
  }
  
  onMount(() => {
    if (companies.length > 1) {
      startAutoPlay();
    }
    
    // Add global mouse event listeners
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  });
</script>

<section class="company-carousel-section">
  <div class="container">
    <h2 class="section-title">Companies I've Worked With</h2>
    
    <div class="carousel-container">
      <!-- Navigation arrows -->
      {#if companies.length > 1}
        <button 
          class="nav-arrow nav-arrow-left glass-button"
          on:click={prevSlide}
          on:mouseenter={stopAutoPlay}
          on:mouseleave={resumeAutoPlay}
          aria-label="Previous company"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        
        <button 
          class="nav-arrow nav-arrow-right glass-button"
          on:click={nextSlide}
          on:mouseenter={stopAutoPlay}
          on:mouseleave={resumeAutoPlay}
          aria-label="Next company"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      {/if}
      
      <!-- Carousel -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <div 
        class="carousel"
        role="region"
        aria-label="Company carousel"
        bind:this={carousel}
        on:touchstart={handleTouchStart}
        on:touchmove={handleTouchMove}
        on:touchend={handleTouchEnd}
        on:mousedown={handleMouseDown}
        on:mouseenter={stopAutoPlay}
        on:mouseleave={resumeAutoPlay}
      >
        <div 
          class="carousel-track"
          style="transform: translateX({translateX}%); transition: {isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'}"
        >
          {#each companies as company, index}
            <div class="company-card glass-card">
              <button
                class="company-logo-button"
                on:click={() => handleCompanyClick(company)}
                aria-label="Visit {company.name} website"
              >
                <img 
                  src={base + company.logo} 
                  alt={company.alt}
                  class="company-logo"
                  loading="lazy"
                />
                <div class="company-name">{company.name}</div>
              </button>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Dots indicator -->
      {#if companies.length > 1}
        <div class="carousel-dots">
          {#each companies as _, index}
            <button
              class="dot {index === currentIndex ? 'active' : ''}"
              on:click={() => goToSlide(index)}
              on:mouseenter={stopAutoPlay}
              on:mouseleave={resumeAutoPlay}
              aria-label="Go to company {index + 1}"
            ></button>
          {/each}
        </div>
      {/if}
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
  
  .carousel-container {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .carousel {
    overflow: hidden;
    border-radius: 20px;
    cursor: grab;
    user-select: none;
  }
  
  .carousel:active {
    cursor: grabbing;
  }
  
  .carousel-track {
    display: flex;
    width: 100%;
  }
  
  .company-card {
    flex: 0 0 100%;
    padding: 3rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    margin: 0;
    transition: all 0.3s ease;
  }
  
  .company-card:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }
  
  .company-logo-button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 12px;
    transition: all 0.3s ease;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .company-logo-button:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
  
  .company-logo {
    max-width: 200px;
    max-height: 80px;
    width: auto;
    height: auto;
    object-fit: contain;
    filter: brightness(0.9) contrast(1.1);
    transition: filter 0.3s ease;
  }
  
  .company-logo-button:hover .company-logo {
    filter: brightness(1.1) contrast(1.2);
  }
  
  .company-name {
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
  
  .company-logo-button:hover .company-name {
    opacity: 1;
  }
  
  .nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .nav-arrow:hover {
    color: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.1);
  }
  
  .nav-arrow-left {
    left: -24px;
  }
  
  .nav-arrow-right {
    right: -24px;
  }
  
  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
  }
  
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .dot:hover {
    background: rgba(255, 255, 255, 0.6);
    transform: scale(1.2);
  }
  
  .dot.active {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.3);
  }
  
  /* Glass button styling */
  .glass-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
  }
  
  .glass-button:hover {
    background: rgba(255, 255, 255, 0.2);
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
    
    .company-card {
      padding: 2rem 1rem;
    }
    
    .company-logo {
      max-width: 150px;
      max-height: 60px;
    }
    
    .nav-arrow {
      width: 40px;
      height: 40px;
    }
    
    .nav-arrow-left {
      left: -20px;
    }
    
    .nav-arrow-right {
      right: -20px;
    }
    
    .company-name {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .nav-arrow-left {
      left: -10px;
    }
    
    .nav-arrow-right {
      right: -10px;
    }
    
    .company-card {
      padding: 1.5rem 0.5rem;
    }
    
    .company-logo {
      max-width: 120px;
      max-height: 50px;
    }
  }
</style>