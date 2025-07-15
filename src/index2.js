import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let scene2, camera2, renderer2, hlight2, controls2, model;
const loader = new GLTFLoader(); // make loader global

function init2() {
  scene2 = new THREE.Scene();

  camera2 = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
  updateCameraPosition2();

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

  loadModel("model/ferrari_laferrari_Black.glb"); // Load default model

  animate2();
}

function loadModel(path, scale = 50) {
  if (model) {
    scene2.remove(model);
    model = null;
  }

  loader.load(
    path,
    (gltf) => {
      model = gltf.scene;

      // Use custom scale
      model.scale.set(scale, scale, scale);
      model.position.set(0, -0.5, 0);
      model.rotation.set(-0.1, 0, 0);

      scene2.add(model);
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );
}


function animate2() {
  requestAnimationFrame(animate2);
  if (model) {
    model.rotation.y += 0.005;
  }
  controls2.update();
  renderer2.render(scene2, camera2);
}

function updateCameraPosition2() {
  if (window.innerWidth < 768) {
    camera2.position.set(0, 1, 8);
  } else if (window.innerWidth < 1200) {
    camera2.position.set(0, 1, 5);
  } else {
    camera2.position.set(0, 0.5, 3);
  }
}

window.addEventListener("resize", () => {
  updateCameraPosition2();
  camera2.aspect = window.innerWidth / window.innerHeight;
  camera2.updateProjectionMatrix();
  renderer2.setSize(window.innerWidth, window.innerHeight);
});


function actuallyLoadNewModel(path) {
  loader.load(
    path,
    (gltf) => {
      model = gltf.scene;

      // ✅ Reset scale, position, and rotation
      model.scale.set(20, 20, 20);
      model.position.set(0, -0.5, -350);
      model.rotation.set(-0.1, 0, 0);

      setModelOpacity(model, 0); // for fade-in effect (optional)
      scene2.add(model);
      fadeInModel(model); // smooth transition (if defined)
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );
}


// Color switch click handlers
document.querySelector(".color_black").addEventListener("click", () => {
  loadModel("model/ferrari_laferrari_Black.glb"); // default scale 50
});

document.querySelector(".color_red").addEventListener("click", () => {
  loadModel("model/2014_ferrari_laferrari.glb"); // default scale 50
});

document.querySelector(".color_white").addEventListener("click", () => {
  loadModel("model/ferrari_laferrari_White.glb", 1.3); // scale reduced
});



init2();
