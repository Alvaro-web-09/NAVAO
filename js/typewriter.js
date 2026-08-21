/* ========================================
   NAVAO | Typewriter
   ======================================== */

(function () {
  "use strict";

  const elements = Array.from(
    document.querySelectorAll("[data-typewriter]")
  );

  if (elements.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const TYPING_SPEED = 22;

  function typeElement(element) {
    const fullText = element.dataset.typewriterText || "";

    if (!fullText) return;

    element.textContent = "";
    element.classList.add("is-typing");

    let charIndex = 0;

    function typeNextChar() {
      if (charIndex >= fullText.length) {
        element.classList.remove("is-typing");
        return;
      }

      element.textContent += fullText.charAt(charIndex);
      charIndex += 1;

      window.setTimeout(typeNextChar, TYPING_SPEED);
    }

    typeNextChar();
  }

  function prepare(element) {
    const originalText = element.textContent.trim();

    element.dataset.typewriterText = originalText;

    if (prefersReducedMotion) return;

    element.textContent = "";
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    return;
  }

  elements.forEach(prepare);

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        typeElement(entry.target);
        activeObserver.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -18% 0px",
      threshold: 0.4
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
})();