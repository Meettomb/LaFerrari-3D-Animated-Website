import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { hilbert2D } from "three/examples/jsm/utils/GeometryUtils.js";

let scene,
  camera,
  renderer,
  hlight,
  car,
  light,
  light2,
  light3,
  light4,
  controls;

let scrollRotation = 0;
let lastScrollY = window.scrollY;
let basePosition = new THREE.Vector3(0, 0, 2);
let targetPosition = new THREE.Vector3();
let targetRotation = new THREE.Euler();

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
  camera.position.set(0, 1, 8);

  controls = new OrbitControls(camera, document.querySelector(".wbgl"));
  controls.addEventListener("change", renderer);

  // const axisHelper = new THREE.AxesHelper(5);
  // scene.add(axisHelper);

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
  loader.load("/Model/2014_ferrari_laferrari.glb", function (gltf) {
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
      scale: new THREE.Vector3(0, 0, 0),
    },
    {
      sectionClass: "car_name_container",
      position: new THREE.Vector3(0, 0.5, 5),
      rotation: new THREE.Euler(4.7, 0, 0),
    },
    {
      sectionClass: "car_feature_info_container",
      rotation: new THREE.Euler(4.8, 0, 1.55),
      position: new THREE.Vector3(0, -0.2, 4.8),
    },
    {
      sectionClass: "car_tire_container",
      rotation: new THREE.Euler(4.7, 0, 1.44),
      position: new THREE.Vector3(1.3, 0.7, 6.3),
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
    {
      sectionClass: "car_film_container",
      position: new THREE.Vector3(1.2, 1.2, 5),
      rotation: new THREE.Euler(-0.5, 0.1, 5.4),
    },
    {
      sectionClass: "car_sound_container",
      position: new THREE.Vector3(0, 0.4, 4),
      rotation: new THREE.Euler(4.7, 0, 0),
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

  if (car) {
    car.position.lerp(targetPosition, 0.05);

    car.rotation.x = THREE.MathUtils.lerp(
      car.rotation.x,
      targetRotation.x,
      0.05
    );
    car.rotation.y = THREE.MathUtils.lerp(
      car.rotation.y,
      targetRotation.y,
      0.05
    );
    car.rotation.z = THREE.MathUtils.lerp(
      car.rotation.z,
      targetRotation.z,
      0.05
    );
  }

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();

// ========== INTERSECTION OBSERVERS ========== //

// Section Observer (20% visibility)
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

// .carInfo Observer (80% visibility)
const carInfoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.8 }
);

// Observe main sections (at 20% visibility)
document
  .querySelectorAll(
    ".car_name_container, .car_feature_info_container, .car_tire_container, .car_engin_container, .car_film_container, .car_sound_container"
  )
  .forEach((section) => {
    sectionObserver.observe(section);
  });

// Observe .carInfo elements (at 50% visibility)
document.querySelectorAll(".carInfo").forEach((el) => {
  carInfoObserver.observe(el);
});

// ========== SCROLL & NAVIGATION ========== //

let isScrolling = false;
const sections = document.querySelectorAll(".snap-section");
let currentIndex = 0;

// Update currentIndex on manual scroll
window.addEventListener("scroll", () => {
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
      currentIndex = index;
    }
  });
});

// Wheel scroll with smooth snap
window.addEventListener("wheel", (e) => {
  if (isScrolling) return;

  const direction = e.deltaY > 0 ? 1 : -1;
  const nextIndex = currentIndex + direction;

  if (nextIndex >= 0 && nextIndex < sections.length) {
    isScrolling = true;
    currentIndex = nextIndex;

    sections[currentIndex].scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      isScrolling = false;
    }, 1000); // Adjust delay to match scroll duration
  }
});

// Arrow key scroll with same behavior
window.addEventListener("keydown", (e) => {
  if (isScrolling) return;

  let direction = 0;

  if (e.key === "ArrowDown") {
    direction = 1;
  } else if (e.key === "ArrowUp") {
    direction = -1;
  } else {
    return; // Ignore other keys
  }

  const nextIndex = currentIndex + direction;

  if (nextIndex >= 0 && nextIndex < sections.length) {
    isScrolling = true;
    currentIndex = nextIndex;

    sections[currentIndex].scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  }
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (scrollTop / docHeight) * 100;
  document.querySelector(".scroll-progress-bar").style.width = `${scrolled}%`;
});
