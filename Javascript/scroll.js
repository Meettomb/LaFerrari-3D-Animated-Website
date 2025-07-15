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
    ".car_name_container, .car_feature_info_container, .car_tire_container, .car_engin_container, .car_film_container, .car_sound_container, .threeD_view"
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
  let closestIndex = 0;
  let closestDistance = Infinity;

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const distance = Math.abs(rect.top);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  currentIndex = closestIndex;
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
    }, 1000);
  }
});

// Arrow key scroll
window.addEventListener("keydown", (e) => {
  if (isScrolling) return;

  let direction = 0;

  if (e.key === "ArrowDown") direction = 1;
  else if (e.key === "ArrowUp") direction = -1;
  else return;

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

// Touch swipe scroll
let touchStartY = 0;
let touchEndY = 0;

window.addEventListener("touchstart", (e) => {
  touchStartY = e.changedTouches[0].screenY;
});

window.addEventListener("touchend", (e) => {
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  if (isScrolling) return;

  const threshold = 50;
  const swipeDistance = touchStartY - touchEndY;

  if (Math.abs(swipeDistance) < threshold) return;

  const direction = swipeDistance > 0 ? 1 : -1;
  const nextIndex = currentIndex + direction;

  if (nextIndex >= 0 && nextIndex < sections.length) {
    isScrolling = true;
    currentIndex = nextIndex;

    sections[currentIndex].scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  }
}

// Show/hide WebGL canvas on 3D view section
document.addEventListener("DOMContentLoaded", () => {
  const wbgl = document.querySelector(".wbgl");
  const wbgl2 = document.querySelector(".wbgl2");
  const threeDViewSection = document.querySelector(".threeD_view");

  if (!wbgl || !wbgl2 || !threeDViewSection) {
    console.warn("One or more required elements (.wbgl, .wbgl2, .threeD_view) are missing.");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === threeDViewSection) {
          wbgl.style.display = entry.isIntersecting ? "none" : "block";
          wbgl2.style.display = entry.isIntersecting ? "block" : "none";
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(threeDViewSection);
});

// Auto-snap when 20% visible
const snapScrollObserver = new IntersectionObserver(
  (entries) => {
    if (isScrolling) return;

    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
        const index = Array.from(sections).indexOf(entry.target);
        if (index !== -1 && index !== currentIndex) {
          isScrolling = true;
          currentIndex = index;
          entry.target.scrollIntoView({ behavior: "smooth" });

          setTimeout(() => {
            isScrolling = false;
          }, 1000);
        }
      }
    });
  },
  {
    threshold: [0.2],
  }
);

// Apply to all snap-section elements
sections.forEach((section) => {
  snapScrollObserver.observe(section);
});



















const snapSections = document.querySelectorAll(".snap-section");
const progressDotsContainer = document.querySelector(".prgress_dots");

// Section labels (must match order of your snap sections)
const sectionLabels = [
  "Company Name",
  "Car Name",
  "Features",
  "Tires",
  "Engine",
  "3D View"
];

// Clear existing content
progressDotsContainer.innerHTML = "";

// Create a dot + label for each section
snapSections.forEach((_, index) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("dot-wrapper");

  const dot = document.createElement("div");
  dot.classList.add("dot");
  dot.dataset.index = index;

  const label = document.createElement("span");
  label.classList.add("dot-label");
  label.textContent = sectionLabels[index] || `Section ${index + 1}`;

  wrapper.appendChild(dot);
  wrapper.appendChild(label);
  progressDotsContainer.appendChild(wrapper);
});

// Track all dots
const allDots = document.querySelectorAll(".prgress_dots .dot");

// Observer for dot highlighting
const dotObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = Array.from(snapSections).indexOf(entry.target);
        if (index !== -1) {
          allDots.forEach(dot => dot.classList.remove("active"));
          allDots[index].classList.add("active");
        }
      }
    });
  },
  { threshold: 0.5 }
);

snapSections.forEach(section => dotObserver.observe(section));

// Optional: click to scroll
allDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    snapSections[index].scrollIntoView({ behavior: "smooth" });
  });
});


