// import * as THREE from './node_modules/three/build/three.module.js';
// import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';

// async function loadData() {
//     const response = await fetch('data.json');
//     const data = await response.json();
//     return data.points.map(p => p.elevation);
// }

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);

// async function createTerrain() {
//     const elevationData = await loadData();
//     const gridSize = Math.sqrt(elevationData.length);
//     const spacing = 20;

//     const geometry = new THREE.PlaneGeometry(gridSize * spacing, gridSize * spacing, gridSize - 1, gridSize - 1);
//     const vertices = geometry.attributes.position.array;

//     const elevationScale = 30; // Adjust this value as needed
//     for (let i = 0; i < elevationData.length; i++) {
//         vertices[i * 3 + 2] = elevationData[i] * elevationScale; // Scale elevation
//     }

//     geometry.computeVertexNormals();
//     const material = new THREE.MeshStandardMaterial({ color: 0x88cc88, wireframe: false, side: THREE.DoubleSide });
//     const mesh = new THREE.Mesh(geometry, material);
//     mesh.rotation.x = -Math.PI / 2;
//     scene.add(mesh);

//     const light = new THREE.DirectionalLight(0xffffff, 1);
//     light.position.set(0, 50, 50).normalize();
//     scene.add(light);
// }

// createTerrain();

// camera.position.set(0, 200, 200);
// camera.lookAt(0, 0, 0);

// function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
// }

// animate();

// window.addEventListener('resize', () => {
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
// });
