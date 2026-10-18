(function () {
  var links = document.querySelectorAll(".lang-switch a");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function () {
      if (this.getAttribute("aria-current") === "true") return;
      var href = (this.getAttribute("href") || "").split("#")[0];
      if (window.location.hash) this.setAttribute("href", href + window.location.hash);
    });
  }
})();
