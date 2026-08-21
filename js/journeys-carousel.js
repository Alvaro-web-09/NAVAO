/* ========================================
   NAVAO | Journeys Carousel
   ======================================== */

(function () {
  "use strict";

  const carousel = document.querySelector("[data-journeys-carousel]");
  const services = Array.from(
    document.querySelectorAll("[data-journey-service]")
  );

  if (!carousel) return;

  const slides = Array.from(
    carousel.querySelectorAll(".journeys__slide")
  );

  const previousButton = carousel.querySelector(
    "[data-carousel-previous]"
  );

  const nextButton = carousel.querySelector(
    "[data-carousel-next]"
  );

  const label = carousel.querySelector("[data-carousel-label]");
  const location = carousel.querySelector("[data-carousel-location]");
  const index = carousel.querySelector("[data-carousel-index]");
  const progress = carousel.querySelector("[data-carousel-progress]");

  if (slides.length === 0) return;

  const AUTOPLAY_DELAY = 5000;
  const SWIPE_THRESHOLD = 48;

  /*
    Relacion entre fotografias y servicios:
    0 = Airport to Destination
    1 = Custom Routes
    2 = Custom Routes
    3 = Full-Day Mobility
  */
  const SLIDE_TO_SERVICE = [0, 1, 1, 3];

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let activeIndex = Math.max(
    slides.findIndex((slide) => slide.classList.contains("is-active")),
    0
  );

  let autoplayTimer = null;
  let touchStartX = 0;
  let touchEndX = 0;

  function formatNumber(value) {
    return String(value).padStart(2, "0");
  }

  function updateProgress() {
    if (!progress) return;

    const progressPercentage =
      ((activeIndex + 1) / slides.length) * 100;

    progress.style.width = `${progressPercentage}%`;
  }

  function updateActiveService() {
    const linkedService = SLIDE_TO_SERVICE[activeIndex];

    services.forEach((service) => {
      const serviceIndex = Number(service.dataset.journeyService);
      const isActive = serviceIndex === linkedService;

      service.classList.toggle("is-active", isActive);
      service.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function updateSlide(nextIndex) {
    activeIndex =
      (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;

      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    const activeSlide = slides[activeIndex];

    if (label) {
      label.textContent = activeSlide.dataset.label || "Journey";
    }

    if (location) {
      location.textContent =
        activeSlide.dataset.location || "Nicaragua, your way.";
    }

    if (index) {
      index.textContent =
        `${formatNumber(activeIndex + 1)} / ${formatNumber(slides.length)}`;
    }

    updateProgress();
    updateActiveService();
  }

  function stopAutoplay() {
    if (autoplayTimer === null) return;

    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();

    if (prefersReducedMotion || slides.length < 2) return;

    autoplayTimer = window.setInterval(() => {
      updateSlide(activeIndex + 1);
    }, AUTOPLAY_DELAY);
  }

  /* Reinicia el temporizador tras una accion manual,
     pero el carrusel nunca se detiene por hover. */
  function restartAutoplay() {
    startAutoplay();
  }

  function goToPreviousSlide() {
    updateSlide(activeIndex - 1);
    restartAutoplay();
  }

  function goToNextSlide() {
    updateSlide(activeIndex + 1);
    restartAutoplay();
  }

  function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].clientX;
  }

  function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;

    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) < SWIPE_THRESHOLD) return;

    if (distance > 0) {
      goToPreviousSlide();
    } else {
      goToNextSlide();
    }
  }

  previousButton?.addEventListener("click", goToPreviousSlide);
  nextButton?.addEventListener("click", goToNextSlide);

  /* Solo el clic o el teclado saltan a un servicio.
     El hover ya no interrumpe el movimiento automatico. */
  services.forEach((service) => {
    service.addEventListener("click", () => {
      const targetIndex = Number(service.dataset.journeyService);

      if (Number.isInteger(targetIndex)) {
        updateSlide(targetIndex);
        restartAutoplay();
      }
    });

    service.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();

      const targetIndex = Number(service.dataset.journeyService);

      if (Number.isInteger(targetIndex)) {
        updateSlide(targetIndex);
        restartAutoplay();
      }
    });
  });

  carousel.addEventListener("touchstart", handleTouchStart, {
    passive: true
  });
  carousel.addEventListener("touchend", handleTouchEnd, {
    passive: true
  });

  /* Pausa unicamente cuando la pestana no esta visible. */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  updateSlide(activeIndex);
  startAutoplay();
})();
