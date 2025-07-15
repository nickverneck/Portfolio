// Test file to verify Three.js import works
import * as THREE from 'three';

export function testThreeJS(): boolean {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    // If we can create these objects, Three.js is working
    return scene instanceof THREE.Scene && 
           camera instanceof THREE.PerspectiveCamera && 
           renderer instanceof THREE.WebGLRenderer;
  } catch (error) {
    console.error('Three.js test failed:', error);
    return false;
  }
}