const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector(".menu");

function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  menuButton?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuButton?.addEventListener("click", () => {
  setMenu(!document.body.classList.contains("menu-open"));
});

menu?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenu(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
  }
});
