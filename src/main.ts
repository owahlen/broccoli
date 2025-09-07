import * as THREE from 'three';
import { createBroccoli } from './broccoli';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add light to the scene
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3);
directionalLight1.position.set(1, 1, 1).normalize();
scene.add(directionalLight1);
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight2.position.set(-1, -1, -1).normalize();
scene.add(directionalLight2);

// Generate the fractal
const initialSize = 1;
const initialDepth = 6;
const rootObject = createBroccoli(initialSize, initialDepth);

// Create a pivot object to rotate around
const pivot = new THREE.Object3D();
const cylinderHeight = initialSize * 2.5;
pivot.position.y = cylinderHeight;
scene.add(pivot);

// Add the broccoli to the pivot and offset it so it's centered on the pivot
rootObject.position.y = -cylinderHeight;
pivot.add(rootObject);

// Position the camera
camera.position.y = 4;
camera.position.z = 10;

// Variables to handle mouse interaction
let isDragging = false;
let previousPosition = { x: 0, y: 0 };
const canvas = renderer.domElement;

// Mouse event handlers
canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  previousPosition = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const deltaMove = {
    x: e.clientX - previousPosition.x,
    y: e.clientY - previousPosition.y,
  };
  pivot.rotation.y += deltaMove.x * 0.01;
  pivot.rotation.x += deltaMove.y * 0.01;
  previousPosition = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

// Touch event handlers
canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    isDragging = true;
    previousPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
});

canvas.addEventListener('touchmove', (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  const deltaMove = {
    x: e.touches[0].clientX - previousPosition.x,
    y: e.touches[0].clientY - previousPosition.y,
  };
  pivot.rotation.y += deltaMove.x * 0.01;
  pivot.rotation.x += deltaMove.y * 0.01;
  previousPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

canvas.addEventListener('touchend', () => {
  isDragging = false;
});

// Animate the scene
function animate(): void {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});