import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector(".canvas-wrap").appendChild(renderer.domElement);

// ===== ESTRELAS =====

const STAR_COUNT = 6000;
const positions = new Float32Array(STAR_COUNT * 3);
const baseSpeeds = new Float32Array(STAR_COUNT);

for (let i = 0; i < STAR_COUNT; i++) {
  resetStar(i, true);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.02,
  sizeAttenuation: true,
});

const stars = new THREE.Points(geometry, material);
scene.add(stars);

function resetStar(i, initial = false) {
  const radius = 20;

  const x = (Math.random() - 0.5) * radius;
  const y = (Math.random() - 0.5) * radius;
  const z = initial ? -Math.random() * 200 : -200;

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;

  baseSpeeds[i] = 0.2 + Math.random() * 0.6;
}

// ===== ACELERAÇÃO GLOBAL =====

let speedMultiplier = 0.05;   // começa quase parado
let targetSpeed = 8;          // velocidade final
let acceleration = 0.02;      // taxa de aceleração

// ===== ANIMAÇÃO =====

function animate() {
  // aumenta gradualmente até atingir a velocidade máxima
  if (speedMultiplier < targetSpeed) {
    speedMultiplier += acceleration;
  }

  for (let i = 0; i < STAR_COUNT; i++) {
    positions[i * 3 + 2] += baseSpeeds[i] * speedMultiplier;

    if (positions[i * 3 + 2] > 5) {
      resetStar(i);
    }
  }

  geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// ===== RESPONSIVO =====

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});