(function () {
  var figures = document.querySelectorAll(".pub-figure");
  if (!figures.length) return;

  var hover = window.matchMedia("(hover: hover) and (pointer: fine)");
  var active = null;
  var pinned = null;

  function closeAll() {
    Array.prototype.forEach.call(figures, function (figure) {
      figure.classList.remove("is-open");
      figure.setAttribute("aria-expanded", "false");
    });
    active = null;
    pinned = null;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function open(figure) {
    var image = figure.querySelector("img");
    if (!image || !image.offsetWidth || !image.offsetHeight) return;
    closeAll();

    // Measure the unchanged button, not the transformed image.
    var rect = figure.getBoundingClientRect();
    var width = image.offsetWidth;
    var height = image.offsetHeight;
    var viewportWidth = document.documentElement.clientWidth;
    var viewportHeight = window.innerHeight;
    var margin = 16;
    var scale = Math.max(1, Math.min(2.2,
      (viewportWidth - margin * 2) / width,
      (viewportHeight - margin * 2) / height));
    var extraHeight = height * (scale - 1) / 2;
    var x = clamp(-width * (scale - 1) / 2,
      margin - rect.left, viewportWidth - margin - rect.left - width * scale);
    var y = clamp(0, margin - rect.top + extraHeight,
      viewportHeight - margin - rect.top - height - extraHeight);

    image.style.setProperty("--preview-scale", scale.toFixed(4));
    image.style.setProperty("--preview-x", x.toFixed(2) + "px");
    image.style.setProperty("--preview-y", y.toFixed(2) + "px");
    figure.classList.add("is-open");
    figure.setAttribute("aria-expanded", "true");
    active = figure;
  }

  Array.prototype.forEach.call(figures, function (figure) {
    figure.addEventListener("pointerenter", function (event) {
      if (hover.matches && event.pointerType !== "touch") open(figure);
    });

    figure.addEventListener("pointerleave", function () {
      if (active === figure && pinned !== figure) closeAll();
    });

    // Click/tap or Enter/Space pins the preview; activate again to close it.
    figure.addEventListener("click", function () {
      if (pinned === figure) {
        closeAll();
      } else {
        open(figure);
        pinned = active;
      }
    });

    figure.addEventListener("blur", function () {
      if (active === figure) closeAll();
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".pub-figure")) closeAll();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeAll();
  });

  // A new viewport or scroll position invalidates the fitted preview bounds.
  window.addEventListener("resize", closeAll);
  window.addEventListener("scroll", closeAll, { passive: true });
  hover.addEventListener("change", closeAll);
})();
