import * as THREE from 'three';

export class ThreeBackground {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      mouseInteraction: true,
      animationSpeed: 1.0,
      particleCount: 1000,
      connectionDistance: 150,
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

    // Adjust settings for mobile
    if (this.options.isMobile) {
      this.options.particleCount = 300;
      this.options.connectionDistance = 100;
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
    
    this.container.appendChild(this.renderer.domElement);
  }

  createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.options.particleCount * 3);
    const velocities = new Float32Array(this.options.particleCount * 3);
    const colors = new Float32Array(this.options.particleCount * 3);

    for (let i = 0; i < this.options.particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions within a sphere
      positions[i3] = (Math.random() - 0.5) * 800;
      positions[i3 + 1] = (Math.random() - 0.5) * 800;
      positions[i3 + 2] = (Math.random() - 0.5) * 400;

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.5;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.5;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;

      // Gradient colors from blue to cyan
      const t = Math.random();
      colors[i3] = 0.2 + t * 0.3; // Red
      colors[i3 + 1] = 0.6 + t * 0.4; // Green
      colors[i3 + 2] = 0.8 + t * 0.2; // Blue
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: this.options.isMobile ? 2 : 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createConnections() {
    const positions = this.particles.geometry.attributes.position.array;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const lineColors = [];

    for (let i = 0; i < this.options.particleCount; i++) {
      const i3 = i * 3;
      const pos1 = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);

      for (let j = i + 1; j < this.options.particleCount; j++) {
        const j3 = j * 3;
        const pos2 = new THREE.Vector3(positions[j3], positions[j3 + 1], positions[j3 + 2]);
        
        const distance = pos1.distanceTo(pos2);
        
        if (distance < this.options.connectionDistance) {
          linePositions.push(pos1.x, pos1.y, pos1.z);
          linePositions.push(pos2.x, pos2.y, pos2.z);

          const alpha = 1 - (distance / this.options.connectionDistance);
          lineColors.push(0.3, 0.7, 1.0, alpha);
          lineColors.push(0.3, 0.7, 1.0, alpha);
        }
      }
    }

    if (linePositions.length > 0) {
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4));

      const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
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

    const positions = this.particles.geometry.attributes.position.array;
    const velocities = this.particles.geometry.attributes.velocity.array;
    const time = Date.now() * 0.001 * this.options.animationSpeed;

    for (let i = 0; i < this.options.particleCount; i++) {
      const i3 = i * 3;

      // Base animation
      positions[i3] += velocities[i3] * this.options.animationSpeed;
      positions[i3 + 1] += velocities[i3 + 1] * this.options.animationSpeed;
      positions[i3 + 2] += velocities[i3 + 2] * this.options.animationSpeed;

      // Mouse interaction
      if (this.options.mouseInteraction) {
        const mousePos = new THREE.Vector3(this.mouse.x * 400, this.mouse.y * 400, 0);
        const particlePos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
        const distance = particlePos.distanceTo(mousePos);
        
        if (distance < 200) {
          const force = (200 - distance) / 200;
          const direction = particlePos.clone().sub(mousePos).normalize();
          
          positions[i3] += direction.x * force * 2;
          positions[i3 + 1] += direction.y * force * 2;
        }
      }

      // Boundary wrapping
      if (positions[i3] > 400) positions[i3] = -400;
      if (positions[i3] < -400) positions[i3] = 400;
      if (positions[i3 + 1] > 400) positions[i3 + 1] = -400;
      if (positions[i3 + 1] < -400) positions[i3 + 1] = 400;
      if (positions[i3 + 2] > 200) positions[i3 + 2] = -200;
      if (positions[i3 + 2] < -200) positions[i3 + 2] = 200;

      // Organic sine wave motion
      positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.5;
      positions[i3 + 2] += Math.cos(time + i * 0.1) * 0.3;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;

    // Rotate the entire system
    this.particles.rotation.y += 0.001 * this.options.animationSpeed;
    this.particles.rotation.x += 0.0005 * this.options.animationSpeed;
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