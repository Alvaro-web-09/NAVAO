/* ========================================
   NAVAO | Main
   ======================================== */

(function () {
  "use strict";

  /* ---------- Elementos ---------- */
  const navbar = document.getElementById("navbar");
  const heroMedia = document.querySelector(".hero__media");
  const coordinates = document.querySelector(".hero__ticket-coords");

  /* ---------- Preferencias de movimiento ---------- */
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Navbar: compresion + ocultamiento ---------- */
  const SCROLL_THRESHOLD = 30;
  const HIDE_THRESHOLD = 140;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updatePageMotion() {
    const currentY = window.scrollY;

    if (navbar) {
      navbar.classList.toggle(
        "is-scrolled",
        currentY > SCROLL_THRESHOLD
      );

      const isScrollingDown = currentY > lastScrollY;
      const shouldHide =
        isScrollingDown && currentY > HIDE_THRESHOLD;

      navbar.classList.toggle("is-hidden", shouldHide);
    }

    /* Hero: parallax + zoom sutil */
    if (heroMedia && !reduceMotion) {
      const viewportHeight = Math.max(window.innerHeight, 1);
      const offset = Math.min(currentY, viewportHeight);
      const progress = Math.min(offset / viewportHeight, 1);
      const translateY = offset * 0.18;
      const scale = 1 + progress * 0.08;

      heroMedia.style.transform =
        `translate3d(0, ${translateY}px, 0) scale(${scale})`;
    }

    lastScrollY = currentY;
    ticking = false;
  }

  function handleScroll() {
    if (ticking) return;

    window.requestAnimationFrame(updatePageMotion);
    ticking = true;
  }

  /* ---------- Coordenadas: efecto ruleta ---------- */
  const FINAL_COORDINATES = "11°30'N  85°35'W";
  const ROULETTE_DURATION = 1600;
  const CHANGE_INTERVAL = 70;

  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createRandomCoordinates() {
    const latitudeDegrees = randomInteger(0, 89);
    const latitudeMinutes = randomInteger(0, 59);
    const longitudeDegrees = randomInteger(0, 179);
    const longitudeMinutes = randomInteger(0, 59);

    const latitudeDirection =
      Math.random() >= 0.5 ? "N" : "S";

    const longitudeDirection =
      Math.random() >= 0.5 ? "E" : "W";

    return (
      `${String(latitudeDegrees).padStart(2, "0")}°` +
      `${String(latitudeMinutes).padStart(2, "0")}'` +
      `${latitudeDirection}  ` +
      `${String(longitudeDegrees).padStart(3, "0")}°` +
      `${String(longitudeMinutes).padStart(2, "0")}'` +
      longitudeDirection
    );
  }

  function animateCoordinates() {
    if (!coordinates) return;

    coordinates.setAttribute(
      "aria-label",
      "Ometepe coordinates: 11 degrees 30 minutes north, " +
        "85 degrees 35 minutes west"
    );

    if (reduceMotion) {
      coordinates.textContent = FINAL_COORDINATES;
      return;
    }

    const startTime = performance.now();
    let lastChangeTime = 0;

    function spin(currentTime) {
      const elapsed = currentTime - startTime;

      if (elapsed >= ROULETTE_DURATION) {
        coordinates.textContent = FINAL_COORDINATES;
        return;
      }

      if (currentTime - lastChangeTime >= CHANGE_INTERVAL) {
        coordinates.textContent = createRandomCoordinates();
        lastChangeTime = currentTime;
      }

      window.requestAnimationFrame(spin);
    }

    window.requestAnimationFrame(spin);
  }

  /* ---------- Inicio ---------- */
  window.addEventListener("scroll", handleScroll, {
    passive: true
  });

  updatePageMotion();
  animateCoordinates();
})();