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

// ===== CONTROLE DO MOUSE =====

const mouse = { x: 0, y: 0 };
const targetCamera = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;

  targetCamera.x = mouse.x * 0.8;
  targetCamera.y = -mouse.y * 0.8;
});

// ===== ESTRELAS =====

const STAR_COUNT = 6000;
const positions = new Float32Array(STAR_COUNT * 6);
const baseSpeeds = new Float32Array(STAR_COUNT);

for (let i = 0; i < STAR_COUNT; i++) {
  resetStar(i, true);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.LineBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.9,
});

const stars = new THREE.LineSegments(geometry, material);
scene.add(stars);

function resetStar(i, initial = false) {
  const radius = 20;

  const x = (Math.random() - 0.5) * radius;
  const y = (Math.random() - 0.5) * radius;
  const z = initial ? -Math.random() * 200 : -200;

  const base = i * 6;

  positions[base] = x;
  positions[base + 1] = y;
  positions[base + 2] = z;

  positions[base + 3] = x;
  positions[base + 4] = y;
  positions[base + 5] = z;

  baseSpeeds[i] = 0.2 + Math.random() * 0.6;
}

// ===== ACELERAÇÃO =====

let speedMultiplier = 0.03;
let targetSpeed = 10;
let acceleration = 0.02;

function animate() {
  if (speedMultiplier < targetSpeed) {
    speedMultiplier += acceleration;
  }

  // movimento suave da câmera (efeito "pilotando")
  camera.position.x += (targetCamera.x - camera.position.x) * 0.05;
  camera.position.y += (targetCamera.y - camera.position.y) * 0.05;
  camera.lookAt(0, 0, -50);

  for (let i = 0; i < STAR_COUNT; i++) {
    const base = i * 6;
    const speed = baseSpeeds[i] * speedMultiplier;

    positions[base + 2] += speed;

    const tailLength = speed * 2.5;

    positions[base + 3] = positions[base];
    positions[base + 4] = positions[base + 1];
    positions[base + 5] = positions[base + 2] - tailLength;

    if (positions[base + 2] > 5) {
      resetStar(i);
    }
  }

  geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});