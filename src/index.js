import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let scene, camera, renderer, hlight, car, controls;

let scrollRotation = 0;
let lastScrollY = window.scrollY;
let basePosition = new THREE.Vector3(0, 0, 2);
let targetPosition = new THREE.Vector3();
let targetRotation = new THREE.Euler();
const speed = 0.10;
function init() {
  // Create the scene, camera and renderer
  scene = new THREE.Scene();
  // scene.background = new THREE.Color("black");

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    50
  );
  updateCameraPosition();

  controls = new OrbitControls(camera, document.querySelector(".wbgl"));

  controls.update();

  hlight = new THREE.AmbientLight(0x404040, 100);
  scene.add(hlight);

  const directPointLight = new THREE.DirectionalLight("white", 6);

  directPointLight.position.set(0, 1, 0);
  directPointLight.castShadow = true;
  scene.add(directPointLight);

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector(".wbgl"),
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true; // Enable shadows

  // Set up lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  light.castShadow = true;
  scene.add(light);

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.ShadowMaterial({ opacity: 0.5 })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  scene.add(plane);

  let loader = new GLTFLoader();
  loader.load("model/ferrari_laferrari_Black.glb", function (gltf) {
    car = gltf.scene.children[0];
    car.scale.set(56, 56, 56);
    car.rotation.set(4.7, 0, 0);
    car.position.set(0, 1.7, 0);
    scene.add(gltf.scene);

    // Set up shadows
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    targetPosition.copy(car.position);
    targetRotation.copy(car.rotation);

    animate();
  });

  // Define animations for each section
  const carAnimations = [
    {
      sectionClass: "car_brande",
      position: new THREE.Vector3(0, 0, -0),
      rotation: new THREE.Euler(4.7, 0, 0),
      scale: new THREE.Vector3(56, 56, 56),
    },
    {
      sectionClass: "car_name_container",

      position:
        window.innerWidth < 768
          ? new THREE.Vector3(0, 0.5, 5)
          : window.innerWidth < 1200
          ? new THREE.Vector3(0, 0.5, 5)
          : new THREE.Vector3(0, 0.5, 5),

      rotation: new THREE.Euler(4.7, 0, 0),
    },
    {
      sectionClass: "car_feature_info_container",
      rotation: new THREE.Euler(4.8, 0, 1.55),
      position:
        window.innerWidth < 768
          ? new THREE.Vector3(-0.1, -1.2, 5.6)
          : window.innerWidth < 1200
          ? new THREE.Vector3(0, -0.3, 5.2)
          : new THREE.Vector3(0, -0.2, 4.8),
      scale:
        window.innerWidth < 768
          ? new THREE.Vector3(45, 45, 45)
          : window.innerWidth < 1200
          ? new THREE.Vector3(45, 45, 45)
          : new THREE.Vector3(56, 56, 56),
    },
    {
      sectionClass: "car_tire_container",
      rotation: new THREE.Euler(4.7, 0, 1.44),

      position:
        window.innerWidth < 768
          ? new THREE.Vector3(0.7, 1.1, 9.7)
          : window.innerWidth < 1200
          ? new THREE.Vector3(1.3, 0.7, 6.3)
          : new THREE.Vector3(1.3, 0.7, 6.3),

      onEnter: () => {
        const tireItems = document.querySelectorAll(
          ".car_tire_container .car_tire ul li"
        );
        tireItems.forEach((item) => {
          item.classList.add("animated_wheel");
        });
      },
    },
    {
      sectionClass: "car_engin_container",
      rotation: new THREE.Euler(4.7, 0, 1.44),
      position: new THREE.Vector3(6, 0.7, 4.8),
    },
  
  ];

  // Observer to trigger animation per section
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || !car) return;

        const match = carAnimations.find((anim) =>
          entry.target.classList.contains(anim.sectionClass)
        );

        if (match) {
          targetPosition.copy(match.position);
          targetRotation.copy(match.rotation);

          if (match.scale) {
            car.scale.copy(match.scale);
          }
          if (typeof match.onEnter === "function") {
            match.onEnter();
          }
        }
      });
    },
    { threshold: 0.3 }
  ); // visible 30% triggers animation

  // Attach observer
  carAnimations.forEach((anim) => {
    const el = document.querySelector(`.${anim.sectionClass}`);
    if (el) sectionObserver.observe(el);
  });

  window.addEventListener("resize", onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (car) {
    car.position.lerp(targetPosition,speed);

    car.rotation.x = THREE.MathUtils.lerp(
      car.rotation.x,
      targetRotation.x,
     speed
    );
    car.rotation.y = THREE.MathUtils.lerp(
      car.rotation.y,
      targetRotation.y,
     speed
    );
    car.rotation.z = THREE.MathUtils.lerp(
      car.rotation.z,
      targetRotation.z,
     speed
    );
  }

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  updateCameraPosition();
}

function updateCameraPosition() {
  if (window.innerWidth < 768) {
    // Mobile
    camera.position.set(0, 1, 12);
  } else if (window.innerWidth < 1200) {
    // Tablet
    camera.position.set(0, 1, 10);
  } else {
    // Desktop
    camera.position.set(0, 1, 8);
  }
}

init();



































