import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";



let scene2, camera2, renderer2, hlight2, controls2, model;

function init2() {
  scene2 = new THREE.Scene();

  camera2 = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    5000
  );
  camera2.position.set(0, 0.5, 3);

  hlight2 = new THREE.AmbientLight(0x404040, 100);
  scene2.add(hlight2);

  const directPointLight = new THREE.DirectionalLight("white", 6);
  directPointLight.position.set(0, 1, 0);
  directPointLight.castShadow = true;
  scene2.add(directPointLight);

  renderer2 = new THREE.WebGLRenderer({
    canvas: document.querySelector(".wbgl2"),
    antialias: true,
    alpha: true,
  });
  renderer2.setSize(window.innerWidth, window.innerHeight);
  renderer2.setPixelRatio(window.devicePixelRatio);

  // OrbitControls
  controls2 = new OrbitControls(camera2, renderer2.domElement);
  controls2.enableDamping = true;
  controls2.dampingFactor = 0.1;
  controls2.enableZoom = false;

  // Load Model
  const loader = new GLTFLoader();
  loader.load("Model/ferrari_laferrari_Black.glb", function (gltf) {
    model = gltf.scene;
    model.scale.set(50, 50, 50);
    model.position.set(0, -0.5, 0);
    model.rotation.x = -0.1;
    scene2.add(model);
  });

  animate2();
}

function animate2() {
  requestAnimationFrame(animate2);
  if (model) {
    model.rotation.y += 0.005;
  }
  controls2.update();
  renderer2.render(scene2, camera2);
}

init2();




