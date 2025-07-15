import * as THREE from 'three';

export class ThreeBackground {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      mouseInteraction: true,
      animationSpeed: 0.4, // Slower, more elegant animation
      particleCount: 200, // Moderate number for good topology
      connectionDistance: 180, // Larger for better network structure
      maxConnections: 4, // Limit connections per node for cleaner topology
      isMobile: false,
      ...options
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.connections = null;
    this.mouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };
    this.animationId = null;
    this.time = 0;
    this.nodeData = []; // Store node information for topology

    // Adjust settings for mobile
    if (this.options.isMobile) {
      this.options.particleCount = 120;
      this.options.connectionDistance = 150;
      this.options.maxConnections = 3;
      this.options.animationSpeed = 0.3;
    }
  }

  init() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.createParticleSystem();
    
    if (!this.options.isMobile) {
      this.createConnections();
    }

    this.setupEventListeners();
    this.animate();
  }

  setupScene() {
    this.scene = new THREE.Scene();
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 300;
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.options.isMobile,
      alpha: true,
      powerPreference: this.options.isMobile ? 'low-power' : 'high-performance'
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.options.isMobile ? 1 : 2));
    this.renderer.setClearColor(0x000000, 0);
    
    // Ensure canvas has correct styling
    const canvas = this.renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-10';
    canvas.style.pointerEvents = 'none';
    
    this.container.appendChild(canvas);
  }

  createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.options.particleCount * 3);
    const velocities = new Float32Array(this.options.particleCount * 3);
    const colors = new Float32Array(this.options.particleCount * 3);
    const sizes = new Float32Array(this.options.particleCount);

    // Create structured topology-like placement
    this.nodeData = [];
    
    for (let i = 0; i < this.options.particleCount; i++) {
      const i3 = i * 3;
      
      // Create clusters and structured placement for topology
      const clusterIndex = Math.floor(i / (this.options.particleCount / 8)); // 8 clusters
      const clusterAngle = (clusterIndex / 8) * Math.PI * 2;
      const clusterRadius = 200 + Math.random() * 300;
      
      // Base cluster position
      const clusterX = Math.cos(clusterAngle) * clusterRadius;
      const clusterY = Math.sin(clusterAngle) * clusterRadius;
      
      // Add some randomness within cluster
      const localRadius = Math.random() * 120;
      const localAngle = Math.random() * Math.PI * 2;
      
      positions[i3] = clusterX + Math.cos(localAngle) * localRadius;
      positions[i3 + 1] = clusterY + Math.sin(localAngle) * localRadius;
      positions[i3 + 2] = (Math.random() - 0.5) * 300;

      // Much slower, gentler velocities for topology
      velocities[i3] = (Math.random() - 0.5) * 0.2;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.2;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;

      // Node importance for topology (some nodes are more important)
      const importance = Math.random();
      const nodeType = importance > 0.8 ? 'hub' : importance > 0.6 ? 'connector' : 'node';
      
      // Store node data for intelligent connections
      this.nodeData.push({
        index: i,
        type: nodeType,
        importance: importance,
        cluster: clusterIndex,
        connections: 0
      });

      // Sophisticated color scheme based on node type
      if (nodeType === 'hub') {
        // Hub nodes - bright cyan/white
        colors[i3] = 0.8 + Math.random() * 0.2; // Red
        colors[i3 + 1] = 0.9 + Math.random() * 0.1; // Green
        colors[i3 + 2] = 1.0; // Blue
        sizes[i] = this.options.isMobile ? 6 : 8; // Larger hubs
      } else if (nodeType === 'connector') {
        // Connector nodes - bright teal
        colors[i3] = 0.1 + Math.random() * 0.2; // Red
        colors[i3 + 1] = 0.7 + Math.random() * 0.2; // Green
        colors[i3 + 2] = 0.9 + Math.random() * 0.1; // Blue
        sizes[i] = this.options.isMobile ? 4 : 6; // Medium connectors
      } else {
        // Regular nodes - soft blue/purple
        colors[i3] = 0.3 + Math.random() * 0.3; // Red
        colors[i3 + 1] = 0.4 + Math.random() * 0.3; // Green
        colors[i3 + 2] = 0.8 + Math.random() * 0.2; // Blue
        sizes[i] = this.options.isMobile ? 2 : 4; // Smaller regular nodes
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create circular particle texture for better visual appeal
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    
    // Create radial gradient for circular particles
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      map: texture,
      alphaTest: 0.001
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createConnections() {
    const positions = this.particles.geometry.attributes.position.array;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const lineColors = [];

    // Reset connection counts
    this.nodeData.forEach(node => node.connections = 0);

    // Create intelligent topology-based connections
    for (let i = 0; i < this.options.particleCount; i++) {
      const nodeA = this.nodeData[i];
      if (nodeA.connections >= this.options.maxConnections) continue;

      const i3 = i * 3;
      const pos1 = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);

      // Find potential connections sorted by priority
      const candidates = [];
      
      for (let j = i + 1; j < this.options.particleCount; j++) {
        const nodeB = this.nodeData[j];
        if (nodeB.connections >= this.options.maxConnections) continue;

        const j3 = j * 3;
        const pos2 = new THREE.Vector3(positions[j3], positions[j3 + 1], positions[j3 + 2]);
        const distance = pos1.distanceTo(pos2);
        
        if (distance < this.options.connectionDistance) {
          // Calculate connection priority based on node types and clusters
          let priority = 1 - (distance / this.options.connectionDistance);
          
          // Prefer connections between different node types (hub-connector, connector-node)
          if ((nodeA.type === 'hub' && nodeB.type === 'connector') ||
              (nodeA.type === 'connector' && nodeB.type === 'hub') ||
              (nodeA.type === 'connector' && nodeB.type === 'node') ||
              (nodeA.type === 'node' && nodeB.type === 'connector')) {
            priority *= 1.5;
          }
          
          // Slightly prefer intra-cluster connections for local topology
          if (nodeA.cluster === nodeB.cluster) {
            priority *= 1.2;
          }
          
          // Prefer connecting to more important nodes
          priority *= (nodeB.importance + 0.5);
          
          candidates.push({ index: j, distance, priority, node: nodeB });
        }
      }
      
      // Sort by priority and connect to best candidates
      candidates.sort((a, b) => b.priority - a.priority);
      
      const maxConnectionsForThisNode = Math.min(
        this.options.maxConnections - nodeA.connections,
        nodeA.type === 'hub' ? 4 : nodeA.type === 'connector' ? 3 : 2
      );
      
      for (let k = 0; k < Math.min(candidates.length, maxConnectionsForThisNode); k++) {
        const candidate = candidates[k];
        const j = candidate.index;
        const j3 = j * 3;
        
        // Create connection
        linePositions.push(pos1.x, pos1.y, pos1.z);
        linePositions.push(positions[j3], positions[j3 + 1], positions[j3 + 2]);

        // Sophisticated connection colors based on node types
        const alpha = candidate.priority * 0.6; // More subtle connections
        let r, g, b;
        
        if (nodeA.type === 'hub' || candidate.node.type === 'hub') {
          // Hub connections - bright cyan
          r = 0.2; g = 0.8; b = 1.0;
        } else if (nodeA.type === 'connector' || candidate.node.type === 'connector') {
          // Connector connections - teal
          r = 0.1; g = 0.7; b = 0.9;
        } else {
          // Regular connections - soft blue
          r = 0.3; g = 0.5; b = 0.8;
        }
        
        lineColors.push(r, g, b, alpha);
        lineColors.push(r, g, b, alpha);
        
        // Update connection counts
        nodeA.connections++;
        candidate.node.connections++;
        
        if (candidate.node.connections >= this.options.maxConnections) break;
      }
    }

    if (linePositions.length > 0) {
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4));

      const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.4, // Slightly more visible than before
        blending: THREE.AdditiveBlending
      });

      this.connections = new THREE.LineSegments(lineGeometry, lineMaterial);
      this.scene.add(this.connections);
    }
  }

  setupEventListeners() {
    if (this.options.mouseInteraction) {
      if (!this.options.isMobile) {
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
      } else {
        window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
      }
    }

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  onMouseMove(event) {
    this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onTouchMove(event) {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.targetMouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));

    // Smooth mouse following
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    this.updateParticles();
    this.renderer.render(this.scene, this.camera);
  }

  updateParticles() {
    if (!this.particles) return;

    this.time += 0.005 * this.options.animationSpeed;
    const positions = this.particles.geometry.attributes.position.array;
    const velocities = this.particles.geometry.attributes.velocity.array;

    for (let i = 0; i < this.options.particleCount; i++) {
      const i3 = i * 3;

      // Very gentle floating motion with sine waves
      const offsetX = Math.sin(this.time + i * 0.02) * 0.3;
      const offsetY = Math.cos(this.time + i * 0.015) * 0.2;
      const offsetZ = Math.sin(this.time * 0.5 + i * 0.01) * 0.1;

      positions[i3] += velocities[i3] * this.options.animationSpeed + offsetX;
      positions[i3 + 1] += velocities[i3 + 1] * this.options.animationSpeed + offsetY;
      positions[i3 + 2] += velocities[i3 + 2] * this.options.animationSpeed + offsetZ;

      // Subtle mouse interaction - much gentler
      if (this.options.mouseInteraction) {
        const mousePos = new THREE.Vector3(this.mouse.x * 300, this.mouse.y * 300, 0);
        const particlePos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
        const distance = particlePos.distanceTo(mousePos);
        
        if (distance < 150) {
          const force = (150 - distance) / 150 * 0.5; // Much gentler force
          const direction = particlePos.clone().sub(mousePos).normalize();
          
          positions[i3] += direction.x * force * 0.5;
          positions[i3 + 1] += direction.y * force * 0.5;
        }
      }

      // Smooth boundary wrapping with larger boundaries
      if (positions[i3] > 600) positions[i3] = -600;
      if (positions[i3] < -600) positions[i3] = 600;
      if (positions[i3 + 1] > 500) positions[i3 + 1] = -500;
      if (positions[i3 + 1] < -500) positions[i3 + 1] = 500;
      if (positions[i3 + 2] > 300) positions[i3 + 2] = -300;
      if (positions[i3 + 2] < -300) positions[i3 + 2] = 300;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;

    // Very slow, subtle rotation of the entire system
    this.particles.rotation.y += 0.0002 * this.options.animationSpeed;
    this.particles.rotation.x += 0.0001 * this.options.animationSpeed;
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }

    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('touchmove', this.onTouchMove.bind(this));
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  static checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  static isMobileDevice() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}