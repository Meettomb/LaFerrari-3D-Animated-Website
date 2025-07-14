
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

  const threshold = 50; // Minimum distance to be considered a swipe
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
          if (entry.isIntersecting) {
            wbgl.style.display = "none";
            wbgl2.style.display = "block";
          } else {
            
            wbgl.style.display = "block";
            wbgl2.style.display = "none";
          }
        }
      });
    },
    { threshold: 0.3 } // Adjust if needed
  );

  observer.observe(threeDViewSection);
});





