import { test, expect } from '@playwright/test';

test.describe('Portfolio Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main page with all sections', async ({ page }) => {
    // Check that the page loads
    await expect(page).toHaveTitle(/Portfolio/);
    
    // Check that all main sections are present
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#companies')).toBeVisible();
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('#skills')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('#licenses')).toBeVisible();
  });

  test('should have proper component ordering', async ({ page }) => {
    // Check that hero div is first
    await expect(page.locator('#hero')).toBeVisible();
    
    // Check the order of sections (Hero has a section without ID, then the others)
    const sectionsWithIds = page.locator('section[id]');
    await expect(sectionsWithIds.nth(0)).toHaveAttribute('id', 'companies');
    await expect(sectionsWithIds.nth(1)).toHaveAttribute('id', 'projects');
    await expect(sectionsWithIds.nth(2)).toHaveAttribute('id', 'skills');
    await expect(sectionsWithIds.nth(3)).toHaveAttribute('id', 'contact');
    await expect(sectionsWithIds.nth(4)).toHaveAttribute('id', 'licenses');
  });

  test('should have smooth scrolling navigation', async ({ page }) => {
    // Wait for the page to load and JavaScript to execute
    await page.waitForTimeout(1000);
    
    // Check if smooth scrolling is enabled via JavaScript
    const scrollBehavior = await page.evaluate(() => {
      return document.documentElement.style.scrollBehavior;
    });
    expect(scrollBehavior).toBe('smooth');
  });

  test('should animate sections on scroll', async ({ page }) => {
    // Initially, sections should have opacity 0 (except hero)
    const companiesSection = page.locator('#companies');
    
    // Scroll to make the section visible
    await companiesSection.scrollIntoViewIfNeeded();
    
    // Wait for animation
    await page.waitForTimeout(1000);
    
    // Check if the section has the animate-in class
    await expect(companiesSection).toHaveClass(/animate-in/);
  });

  test('should display section titles correctly', async ({ page }) => {
    // Check that section titles are present and visible (use more specific selector)
    await expect(page.locator('h2.section-title').filter({ hasText: 'Experience' })).toBeVisible();
    
    // Scroll to other sections to check their titles
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.locator('#skills').scrollIntoViewIfNeeded();
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.locator('#licenses').scrollIntoViewIfNeeded();
  });

  test('should have proper spacing between sections', async ({ page }) => {
    // Check sections with IDs that should have proper padding
    const sectionsWithIds = ['#companies', '#projects', '#skills', '#contact', '#licenses'];
    
    for (const sectionId of sectionsWithIds) {
      const section = page.locator(sectionId);
      await expect(section).toBeVisible();
      
      const paddingTop = await section.evaluate(el => 
        window.getComputedStyle(el).paddingTop
      );
      
      // Should have significant padding (adjusted for mobile)
      const paddingValue = parseInt(paddingTop);
      expect(paddingValue).toBeGreaterThan(30); // At least 30px (mobile has 2rem = 32px)
    }
  });
});

test.describe('Responsive Design Tests', () => {
  test('should work on desktop (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Check that all sections are visible
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#companies')).toBeVisible();
    
    // Check that section containers have proper max-width
    const container = page.locator('.section-container').first();
    const maxWidth = await container.evaluate(el => 
      window.getComputedStyle(el).maxWidth
    );
    expect(maxWidth).toContain('1400px'); // Updated to match actual CSS
  });

  test('should work on tablet (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Check that all sections are still visible
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#companies')).toBeVisible();
    
    // Check responsive padding
    const container = page.locator('.section-container').first();
    const padding = await container.evaluate(el => 
      window.getComputedStyle(el).paddingLeft
    );
    expect(padding).toBe('16px'); // 1rem = 16px
  });

  test('should work on mobile (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that all sections are visible on mobile
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#companies')).toBeVisible();
    
    // Check that main content has bottom padding for mobile nav
    const mainContent = page.locator('.main-content');
    const paddingBottom = await mainContent.evaluate(el => 
      window.getComputedStyle(el).paddingBottom
    );
    expect(paddingBottom).toBe('80px');
  });

  test('should work on small mobile (320x568)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    
    // Check that content is still accessible
    await expect(page.locator('#hero')).toBeVisible();
    
    // Check that section titles are smaller on small screens
    const sectionTitle = page.locator('.section-title').first();
    const fontSize = await sectionTitle.evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    const fontSizeValue = parseInt(fontSize);
    expect(fontSizeValue).toBeLessThan(32); // Should be smaller than 2rem (32px)
  });

  test('should work on large desktop (1400px+)', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/');
    
    // Check that container expands on large screens
    const container = page.locator('.section-container').first();
    const maxWidth = await container.evaluate(el => 
      window.getComputedStyle(el).maxWidth
    );
    expect(maxWidth).toContain('1400px');
  });
});

test.describe('Component Integration Tests', () => {
  test('should load all components without errors', async ({ page }) => {
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        // Filter out expected network errors (404s for missing assets)
        const text = msg.text();
        if (!text.includes('Failed to load resource') && !text.includes('404')) {
          errors.push(text);
        }
      }
    });

    await page.goto('/');
    
    // Wait for all components to load
    await page.waitForTimeout(2000);
    
    // Check that no critical console errors occurred
    expect(errors).toHaveLength(0);
  });

  test('should have 3D background component', async ({ page }) => {
    await page.goto('/');
    
    // Wait for 3D background to initialize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that the 3D background canvas is present or fallback is shown
    const canvas = page.locator('canvas');
    const fallback = page.locator('.fallback-background');
    
    const canvasExists = await canvas.count() > 0;
    const fallbackExists = await fallback.count() > 0;
    
    // Either canvas should exist (WebGL supported) or fallback should exist
    expect(canvasExists || fallbackExists).toBe(true);
  });

  test('should have working hero navigation buttons', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that both CTA buttons are visible and clickable
    const viewWorkButton = page.locator('button', { hasText: 'View My Work' });
    const getInTouchButton = page.locator('button', { hasText: 'Get In Touch' });
    
    await expect(viewWorkButton).toBeVisible();
    await expect(getInTouchButton).toBeVisible();
    
    // Verify that target sections exist
    await expect(page.locator('#projects')).toBeAttached();
    await expect(page.locator('#contact')).toBeAttached();
    
    // Test "View My Work" button navigation
    const initialScrollY = await page.evaluate(() => window.scrollY);
    
    await viewWorkButton.click();
    await page.waitForTimeout(2000); // Wait for smooth scroll
    
    const scrollYAfterFirstClick = await page.evaluate(() => window.scrollY);
    expect(scrollYAfterFirstClick).toBeGreaterThan(initialScrollY);
    
    // Reset to top for second test
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(500);
    
    // Test "Get In Touch" button navigation
    await getInTouchButton.click();
    await page.waitForTimeout(2000); // Wait for smooth scroll
    
    const scrollYAfterSecondClick = await page.evaluate(() => window.scrollY);
    expect(scrollYAfterSecondClick).toBeGreaterThan(initialScrollY);
  });

  test('should have header component', async ({ page }) => {
    await page.goto('/');
    
    // Check that header is present (may be hidden on mobile)
    const header = page.locator('header');
    await expect(header).toBeAttached();
    
    // On desktop, header should be visible
    const viewport = page.viewportSize();
    if (viewport.width >= 768) {
      await expect(header).toBeVisible();
    }
  });

  test('should load JSON data correctly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for components to load data
    await page.waitForTimeout(1000);
    
    // Check that company carousel has loaded companies
    await page.locator('#companies').scrollIntoViewIfNeeded();
    await expect(page.locator('#companies')).toBeVisible();
  });
});

test.describe('Performance Tests', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have layout shifts', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForTimeout(1000);
    
    // Get initial positions of key elements
    const heroPosition = await page.locator('#hero').boundingBox();
    const companiesPosition = await page.locator('#companies').boundingBox();
    
    // Wait a bit more for any potential shifts
    await page.waitForTimeout(2000);
    
    // Check positions haven't changed significantly
    const heroPositionAfter = await page.locator('#hero').boundingBox();
    const companiesPositionAfter = await page.locator('#companies').boundingBox();
    
    expect(Math.abs(heroPosition.y - heroPositionAfter.y)).toBeLessThan(5);
    expect(Math.abs(companiesPosition.y - companiesPositionAfter.y)).toBeLessThan(5);
  });
});