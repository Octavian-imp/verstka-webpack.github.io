import Swiper from "swiper";
import { FreeMode, Pagination } from "swiper/modules";

import "@/index.scss";
import { createIcons, icons } from "lucide";

createIcons({ icons });

const swiperOptions = {
  modules: [FreeMode, Pagination],
  spaceBetween: 16,
  freeMode: true,
  width: 240,
  pagination: { clickable: true, el: ".swiper-pagination" },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
  },
  on: {
    resize: initBrandsSlider,
  },
};

let swiperBrands = new Swiper(".brands-slider", swiperOptions);
function initBrandsSlider() {
  if (!swiperBrands && window.innerWidth < 768) {
    swiperBrands = new Swiper(".brands-slider", swiperOptions);
  }
  if (swiperBrands && window.innerWidth >= 768) {
    swiperBrands.destroy(true, true);
    swiperBrands = null;
  }
}

window.addEventListener("resize", initBrandsSlider);

const brandsSliderWrapperSelector = "brands-slider__wrapper";
const brandsSliderWrapperActiveSelector = "brands-slider__wrapper--active";

const moreButtonSelector = "brands-slider__more-button";
const moreButtonActiveSelector = "brands-slider__more-button--active";

const brandsSliderWrapper = document.querySelector(
  "." + brandsSliderWrapperSelector
);

const moreButton = document.getElementById(moreButtonSelector);

moreButton.addEventListener("click", () => {
  if (
    brandsSliderWrapper.classList.contains(brandsSliderWrapperActiveSelector)
  ) {
    brandsSliderWrapper.classList.remove(brandsSliderWrapperActiveSelector);

    moreButton.querySelector("span").textContent = "Показать все";
    moreButton.classList.remove(moreButtonActiveSelector);
  } else {
    brandsSliderWrapper.classList.add(brandsSliderWrapperActiveSelector);

    moreButton.classList.add(moreButtonActiveSelector);
    moreButton.querySelector("span").textContent = "Скрыть все";
  }
});

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
