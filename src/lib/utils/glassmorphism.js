/**
 * Glassmorphism utility functions and constants
 */

// Glassmorphism CSS custom properties
export const glassmorphismVars = {
  '--glass-bg-primary': 'rgba(255, 255, 255, 0.1)',
  '--glass-bg-secondary': 'rgba(255, 255, 255, 0.05)',
  '--glass-bg-accent': 'rgba(64, 224, 208, 0.2)',
  '--glass-border': 'rgba(255, 255, 255, 0.2)',
  '--glass-blur': '10px',
  '--glass-blur-light': '8px',
  '--glass-shadow': '0 8px 32px rgba(0, 0, 0, 0.1)',
  '--glass-shadow-hover': '0 12px 40px rgba(0, 0, 0, 0.15)'
};

// Apply glassmorphism variables to document root
export function initGlassmorphism() {
  const root = document.documentElement;
  Object.entries(glassmorphismVars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

// Generate glassmorphism card styles
export function getGlassCardStyles(opacity = 0.1) {
  return {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: 'blur(var(--glass-blur))',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    boxShadow: 'var(--glass-shadow)'
  };
}

// Generate glassmorphism button styles
export function getGlassButtonStyles(opacity = 0.15) {
  return {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: 'blur(var(--glass-blur-light))',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    transition: 'all 0.3s ease'
  };
}