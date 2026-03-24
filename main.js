import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';


const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const hint = document.getElementById("hint");


scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

let stars;
function createGalaxy() {
  const positions = [];
  for (let i = 0; i < 3000; i++) {
    positions.push(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    );
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
  stars = new THREE.Points(geo, mat);
  scene.add(stars);
}
createGalaxy();

let cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshStandardMaterial({ color: 0x00aaff })
);
scene.add(cube);

let clicked = false;
let leftCube, rightCube;
let portal;
let textParticles;
let targetPositions;
let forming = false;

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hit = raycaster.intersectObject(cube);

  if (hit.length > 0 && !clicked) {
    clicked = true;

    if (hint) hint.style.opacity = 0;

    splitCube();
  }
});

function updateHintPosition() {
  if (!cube || clicked) return;

  const vector = cube.position.clone();
  vector.y -= 1.2;

  vector.project(camera);

  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

  if (hint) {
    hint.style.left = `${x}px`;
    hint.style.top = `${y}px`;
    hint.style.transform = "translate(-50%, -50%)";
  }
}


function splitCube() {
  scene.remove(cube);

  const geo = new THREE.BoxGeometry(1, 1, 0.5);
  const mat = new THREE.MeshStandardMaterial({ color: 0x00aaff });

  leftCube = new THREE.Mesh(geo, mat);
  rightCube = new THREE.Mesh(geo, mat);

  leftCube.position.z = -0.25;
  rightCube.position.z = 0.25;

  scene.add(leftCube, rightCube);

  openCube();
}

function openCube() {
  let p = 0;
  function animateOpen() {
    p += 0.02;
    leftCube.position.x = -p * 2;
    rightCube.position.x = p * 2;

    if (p < 1) requestAnimationFrame(animateOpen);
    else showPortal();
  }
  animateOpen();
}

function showPortal() {
  portal = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true })
  );
  scene.add(portal);
  createParticles();
}

function createParticles() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1024;
  canvas.height = 512;

  ctx.fillStyle = "white";
  ctx.font = "bold 50px Arial";
  ctx.textAlign = "center";

  ctx.fillText("تقبل اللہ منا ومنکم", 512, 180);
  ctx.fillText("عِيد مُبَارَك", 512, 260);
  ctx.fillText("Murtaza Ahmed", 512, 340);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const particles = [];
  targetPositions = [];

  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const i = (y * canvas.width + x) * 4;
      if (data[i] > 128) {
        targetPositions.push(
          (x - 512) / 100,
          -(y - 256) / 100 + 1.2,
          0
        );

        particles.push(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        );
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(particles, 3));

  const mat = new THREE.PointsMaterial({ color: 0xffd700, size: 0.03 });

  textParticles = new THREE.Points(geo, mat);
  textParticles.position.z = -1;

  scene.add(textParticles);

  setTimeout(() => forming = true, 800);
}

function animate() {
  requestAnimationFrame(animate);

  if (!clicked && cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }
  updateHintPosition();

  
  camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
  camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;

  if (portal) portal.rotation.y += 0.02;
  if (stars) stars.rotation.y += 0.0005;

  if (textParticles) {
    const pos = textParticles.geometry.attributes.position.array;

    for (let i = 0; i < pos.length; i += 3) {
      if (forming) {
        pos[i] += (targetPositions[i] - pos[i]) * 0.05;
        pos[i + 1] += (targetPositions[i + 1] - pos[i + 1]) * 0.05;
        pos[i + 2] += (targetPositions[i + 2] - pos[i + 2]) * 0.05;
      }
    }

    textParticles.geometry.attributes.position.needsUpdate = true;
  }

  if (clicked && camera.position.z > 2) {
    camera.position.z -= 0.05;
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});