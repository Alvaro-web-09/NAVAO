/* ========================================
   NAVAO | Quote → WhatsApp
   ======================================== */

(function () {
  "use strict";

  const WHATSAPP_NUMBER = "5058936583";

  const form = document.querySelector("[data-quote-form]");
  if (!form) return;

  function clean(value) {
    return (value || "").trim();
  }

  function buildMessage(data) {
    const lines = [
      "Hello NAVAO, I would like a private transportation quote.",
      ""
    ];

    if (data.name) lines.push("Name: " + data.name);
    if (data.date) lines.push("Travel date: " + data.date);
    if (data.passengers) lines.push("Passengers: " + data.passengers);
    if (data.from) lines.push("Pick-up: " + data.from);
    if (data.to) lines.push("Destination: " + data.to);
    if (data.notes) lines.push("Notes: " + data.notes);

    return lines.join("\n");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
      name: clean(form.name && form.name.value),
      date: clean(form.date && form.date.value),
      passengers: clean(form.passengers && form.passengers.value),
      from: clean(form.from && form.from.value),
      to: clean(form.to && form.to.value),
      notes: clean(form.notes && form.notes.value)
    };

    const message = buildMessage(data);

    const url =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);

    window.open(url, "_blank", "noopener");
  });
})();
