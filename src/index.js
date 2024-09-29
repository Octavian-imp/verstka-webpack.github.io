import "@/index.scss";

const menuClassActive = "mob-menu--active";
const burgerBtn = document.getElementById("menuBurger");
const menuBtn = document.getElementById("mob-menu");
const closeBtn = document.getElementById("mob-menu__close");

burgerBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  menuBtn.classList.add(menuClassActive);
});

closeBtn.addEventListener("click", () => {
  menuBtn.classList.remove(menuClassActive);
});
