/* ========================================
   NAVAO | Footer — Social "coming soon"
   ======================================== */

(function () {
  "use strict";

  const triggers = Array.from(
    document.querySelectorAll("[data-social-soon]")
  );

  const toast = document.querySelector("[data-footer-toast]");

  if (triggers.length === 0 || !toast) return;

  let hideTimer = null;

  function showToast() {
    if (hideTimer !== null) {
      window.clearTimeout(hideTimer);
    }

    toast.classList.add("is-visible");
    toast.setAttribute("aria-hidden", "false");

    hideTimer = window.setTimeout(hideToast, 4200);
  }

  function hideToast() {
    toast.classList.remove("is-visible");
    toast.setAttribute("aria-hidden", "true");
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      showToast();
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      hideToast();
    }
  });
})();
