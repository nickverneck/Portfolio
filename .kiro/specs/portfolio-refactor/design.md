# Design Document

## Overview

The portfolio refactor will transform the existing HTML/CSS/JS site into a modern, interactive Svelte application featuring glassmorphism design elements and a Three.js-powered background. The architecture follows a component-based approach with JSON-driven content management, optimized for static site generation and GitHub Pages deployment.

The design emphasizes visual hierarchy through glassmorphism effects, smooth animations, and responsive layouts that work seamlessly across desktop and mobile devices. The interactive 3D background provides an engaging user experience while maintaining performance and accessibility.

## Architecture

### Technology Stack
- **Frontend Framework**: Svelte with SvelteKit for static site generation
- **3D Graphics**: Three.js for interactive background animations
- **Styling**: CSS3 with custom properties for glassmorphism effects
- **Data Management**: JSON files for content storage
- **Build System**: Vite (integrated with SvelteKit)
- **Deployment**: GitHub Pages with static adapter

### Project Structure
```
src/
├── lib/
│   ├── components/
│   │   ├── Background3D.svelte
│   │   ├── CompanyCarousel.svelte
│   │   ├── ContactSection.svelte
│   │   ├── Header.svelte
│   │   ├── Hero.svelte
│   │   ├── LicensesSection.svelte
│   │   ├── ProjectsSection.svelte
│   │   └── SkillsSection.svelte
│   ├── data/
│   │   ├── companies.json
│   │   ├── projects.json
│   │   ├── skills.json
│   │   └── licenses.json
│   ├── stores/
│   │   └── theme.js
│   └── utils/
│       ├── glassmorphism.js
│       └── three-background.js
├── routes/
│   ├── +layout.svelte
│   └── +page.svelte
└── app.html
static/
├── assets/
│   ├── images/
│   └── company-logos/
└── favicon.ico
```

### Data Architecture
Each content section will be driven by JSON files with the following structures:

**companies.json**
```json
{
  "companies": [
    {
      "name": "KatapultQ2",
      "logo": "/assets/company-logos/katapultq2.png",
      "url": "https://katapultq2.com",
      "alt": "KatapultQ2 Logo"
    }
  ]
}
```

**projects.json**
```json
{
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief project description",
      "technologies": ["React", "Node.js"],
      "githubUrl": "https://github.com/username/repo",
      "featured": true
    }
  ]
}
```

**skills.json**
```json
{
  "categories": [
    {
      "name": "Frontend Framework",
      "skills": ["React", "Angular", "Svelte", "NextJS", "EmberJS"]
    }
  ]
}
```

**licenses.json**
```json
{
  "certifications": [
    {
      "title": "Building RAG Agents with LLMs",
      "institution": "NVIDIA",
      "description": "Advanced certification in RAG implementation",
      "url": "https://certification-url.com",
      "issueDate": "2024"
    }
  ]
}
```

## Components and Interfaces

### Background3D Component
**Purpose**: Renders the interactive Three.js background with topology/fractal patterns
**Props**: 
- `mouseInteraction: boolean` - Enable/disable mouse responsiveness
- `animationSpeed: number` - Control background animation speed

**Key Features**:
- Responsive particle system or geometric topology
- Mouse position tracking for interactive effects
- Performance optimization for mobile devices
- Smooth transitions and continuous animation loops

### Header Component
**Purpose**: Navigation and branding
**Props**: 
- `currentSection: string` - Active navigation item

**Key Features**:
- Glassmorphism styling with backdrop blur
- Smooth scroll navigation to sections
- Mobile-responsive hamburger menu
- Sticky positioning with transparency effects

### Hero Component
**Purpose**: Main introduction section with name and title
**Props**: 
- `name: string`
- `title: string`
- `subtitle: string`

**Key Features**:
- Large typography with glassmorphism card
- Animated text reveals
- Responsive scaling for mobile
- Integration with 3D background

### CompanyCarousel Component
**Purpose**: Display company logos in an interactive carousel
**Props**: 
- `companies: Array<Company>` - Company data from JSON

**Key Features**:
- Smooth carousel transitions
- Click-to-navigate functionality
- Glassmorphism card styling for each logo
- Touch/swipe support for mobile
- Auto-play with pause on hover

### ProjectsSection Component
**Purpose**: Showcase GitHub projects in card layout
**Props**: 
- `projects: Array<Project>` - Project data from JSON

**Key Features**:
- Grid layout with glassmorphism cards
- Hover effects and animations
- Responsive grid (3 columns desktop, 1-2 mobile)
- Featured project highlighting

### SkillsSection Component
**Purpose**: Searchable skills display with categories
**Props**: 
- `skills: SkillsData` - Skills data from JSON

**Key Features**:
- Real-time search filtering
- Category-based organization
- Tag-style skill display
- Glassmorphism search input
- Responsive grid layout

### ContactSection Component
**Purpose**: Contact information and social links
**Props**: 
- `contactInfo: ContactData` - Contact details

**Key Features**:
- Glassmorphism contact cards
- Clickable phone/email/social links
- Icon integration for social platforms
- Mobile-optimized layout

### LicensesSection Component
**Purpose**: Display certifications and licenses
**Props**: 
- `licenses: Array<License>` - License data from JSON

**Key Features**:
- Card-based layout with glassmorphism
- External link integration
- Institution branding
- Responsive grid system

## Data Models

### Company Interface
```typescript
interface Company {
  name: string;
  logo: string;
  url: string;
  alt: string;
}
```

### Project Interface
```typescript
interface Project {
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  featured: boolean;
  image?: string;
}
```

### Skill Category Interface
```typescript
interface SkillCategory {
  name: string;
  skills: string[];
}

interface SkillsData {
  categories: SkillCategory[];
}
```

### License Interface
```typescript
interface License {
  title: string;
  institution: string;
  description: string;
  url: string;
  issueDate: string;
}
```

### Contact Interface
```typescript
interface ContactInfo {
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  instagram: string;
}
```

## Glassmorphism Design System

### Core CSS Properties
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-button {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}
```

### Color Palette
- **Primary Glass**: `rgba(255, 255, 255, 0.1)`
- **Secondary Glass**: `rgba(255, 255, 255, 0.05)`
- **Accent Glass**: `rgba(64, 224, 208, 0.2)`
- **Text Primary**: `rgba(255, 255, 255, 0.9)`
- **Text Secondary**: `rgba(255, 255, 255, 0.7)`
- **Border**: `rgba(255, 255, 255, 0.2)`

### Typography
- **Primary Font**: 'Inter', sans-serif
- **Heading Font**: 'Space Grotesk', sans-serif
- **Code Font**: 'JetBrains Mono', monospace

## Three.js Background Implementation

### Scene Setup
- **Renderer**: WebGL with alpha transparency
- **Camera**: Perspective camera with responsive aspect ratio
- **Scene**: Dark background with ambient lighting

### Geometry Options
1. **Topology Approach**: Interconnected nodes with dynamic connections
2. **Fractal Approach**: Recursive geometric patterns
3. **Particle System**: Floating particles with physics simulation

### Animation System
- **Base Animation**: Continuous slow rotation and movement
- **Mouse Interaction**: Particle attraction/repulsion based on cursor position
- **Performance Optimization**: Frame rate limiting and LOD system
- **Mobile Adaptation**: Reduced particle count and simplified shaders

### Interaction Logic
```javascript
// Mouse position tracking
const mouse = { x: 0, y: 0 };
const onMouseMove = (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

// Particle response to mouse
particles.forEach(particle => {
  const distance = particle.position.distanceTo(mousePosition);
  const force = Math.max(0, 1 - distance / maxDistance);
  particle.velocity.add(forceVector.multiplyScalar(force));
});
```

## Responsive Design Strategy

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Layout Adaptations
- **Mobile**: Single column layout, simplified 3D background, touch-optimized interactions
- **Tablet**: Two-column grid for projects/skills, medium complexity background
- **Desktop**: Multi-column layouts, full 3D background complexity, hover effects

### Performance Considerations
- **Mobile**: Reduced Three.js complexity, optimized images, lazy loading
- **Desktop**: Full visual effects, higher quality textures, advanced animations

## Error Handling

### Three.js Fallbacks
- WebGL not supported: Display static gradient background
- Performance issues: Automatically reduce particle count
- Mobile limitations: Switch to CSS-only animations

### Data Loading
- JSON fetch failures: Display placeholder content
- Image loading errors: Show default placeholders
- Network issues: Graceful degradation with cached content

### User Experience
- Loading states for all async operations
- Smooth transitions between states
- Error messages with retry options
- Accessibility considerations for screen readers

## Testing Strategy

### Unit Testing
- Component rendering with mock data
- Utility function validation
- Data transformation logic
- Responsive behavior testing

### Integration Testing
- JSON data loading and parsing
- Three.js scene initialization
- Component interaction flows
- Navigation and routing

### Performance Testing
- 3D background frame rate monitoring
- Mobile device performance validation
- Bundle size optimization
- Loading time measurements

### Cross-browser Testing
- Modern browser compatibility
- Mobile browser testing
- WebGL support validation
- Fallback behavior verification

## Deployment Configuration

### SvelteKit Static Adapter
```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null,
      precompress: false
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/portfolio' : ''
    }
  }
};
```

### GitHub Pages Setup
- Build process generates static files in `/build` directory
- GitHub Actions workflow for automated deployment
- Proper asset path handling for subdirectory deployment
- CNAME configuration for custom domain support

### Asset Optimization
- Image compression and WebP format support
- CSS/JS minification and bundling
- Tree shaking for unused code elimination
- Lazy loading for non-critical resources