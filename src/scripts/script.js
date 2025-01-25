import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import testVertexShader from "../shaders/test/vertex.glsl";
import testFragmentShader from "../shaders/test/fragment.glsl";
import { setupGUI } from "./gui";

/**
 * Base
 */
const uniforms = {
  uTime: { value: 0.0 },
  uTimeMultiplier: { value: 1.0 },
  uAmplitudeMultiplier: { value: 5.0 },
  uNoiseScale: { value: 30.0 },
  uFreq: { value: 20.0 },
  uStrengthOffset: { value: 2.0 },
  uCol1: { value: new THREE.Color(0x0008ff) },
  uCol2: { value: new THREE.Color(0x7300ff) },
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.TorusGeometry(0.5, 0.2, 160, 100);

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
  uniforms: uniforms,
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotateY(Math.PI);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Debug
/**
 * GUI Setup
 */
setupGUI(uniforms, camera);

/**
 * Animate
 */
const clock = new THREE.Clock(); // Create a clock to track elapsed time

const tick = () => {
  // Update controls
  controls.update();
  const elapsedTime = clock.getElapsedTime();
  uniforms.uTime.value = elapsedTime;
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
