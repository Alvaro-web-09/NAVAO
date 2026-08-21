/* ========================================
   NAVAO | Reveal Animations
   ======================================== */

(function () {
  "use strict";

  const revealElements = Array.from(
    document.querySelectorAll("[data-reveal]")
  );

  if (revealElements.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function revealElement(element) {
    element.classList.add("is-revealed");
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(revealElement);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        revealElement(entry.target);
        activeObserver.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
})();
