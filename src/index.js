import Swiper from "swiper"
import { FreeMode, Pagination } from "swiper/modules"

import "@/index.scss"
import { createIcons, icons } from "lucide"

createIcons({ icons })

// слайдеры

let swiper = {
  // active: true только когда все слайдеры инициализированы
  active: false,
  sliders: [],
}

function initSliders() {
  document.querySelectorAll(".swiper-container").forEach((el, indx) => {
    swiper.active = window.innerWidth < 768 && true
    swiper.sliders.push(
      new Swiper(el, {
        modules: [FreeMode, Pagination],
        spaceBetween: 16,
        freeMode: true,
        width: 240,
        breakpoints: {
          320: {
            slidesPerView: 1,
          },
        },
        on: {
          resize: () => {
            if (window.innerWidth >= 768) {
              if (swiper.sliders[indx] !== null) {
                swiper.sliders[indx].destroy(true, true)
                swiper.sliders[indx] = null
              }
            }
          },
        },
        pagination: {
          clickable: true,
          el: el.querySelector(".swiper-pagination"),
        },
      })
    )
  })
}

initSliders()

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    if (swiper.active) {
      swiper.sliders = swiper.sliders.map((el) => {
        if (el !== null) {
          el.destroy(true, true)
        }
        return null
      })
      swiper.active = false
    }
  } else {
    initSliders()
  }
})

// кнопки "показать все"
const slidersWrapperSelectors = [
  {
    defaultClass: "technics-slider__wrapper",
    activeClass: "technics-slider__wrapper--active",
    idBtn: "brands-slider__more-button",
    activeBtnClass: "more-button--active",
  },
  {
    defaultClass: "type-technics-slider__wrapper",
    activeClass: "type-technics-slider__wrapper--active",
    idBtn: "type-technics-slider__more-button",
    activeBtnClass: "more-button--active",
  },
]

slidersWrapperSelectors.forEach((el) => {
  const btn = document.getElementById(el.idBtn)
  btn.addEventListener("click", () => {
    if (
      document
        .querySelector("." + el.defaultClass)
        .classList.contains(el.activeClass)
    ) {
      document
        .querySelector("." + el.defaultClass)
        .classList.remove(el.activeClass)
      btn.classList.remove(el.activeBtnClass)
      btn.querySelector("span").textContent = "Показать все"
    } else {
      document
        .querySelector("." + el.defaultClass)
        .classList.add(el.activeClass)
      btn.classList.add(el.activeBtnClass)
      btn.querySelector("span").textContent = "Скрыть все"
    }
  })
})

// мобильное меню
const menuClassActive = "responsive-menu--active"
const burgerBtn = document.getElementById("menuBurger")
const menuBtn = document.getElementById("mob-menu")
const closeBtn = document.getElementById("responsive-menu__close")

burgerBtn.addEventListener("click", (e) => {
  e.stopPropagation()
  menuBtn.classList.add(menuClassActive)
  document.body.style.overflowY = "hidden"
})

closeBtn.addEventListener("click", () => {
  menuBtn.classList.remove(menuClassActive)
  document.body.style.overflowY = "auto"
})

// модалки
// для работы нужно кнопке добавить класс btn-open-modal и атрибут data-modal-id с id модального окна

const btnOpenModalSelectorClass = "btn-open-modal"
const modalActiveClass = "modal__wrapper--active"
const btnCloseModalSelectorClass = "modal__btn-close"

document.querySelectorAll("." + btnOpenModalSelectorClass).forEach((el) => {
  el.addEventListener("click", (e) => {
    e.stopPropagation()

    document.body.style.overflowY = "hidden"

    const modalId = e.target.dataset.modalId
    const modal = document.getElementById(modalId)

    modal.classList.add(modalActiveClass)

    function closeModal() {
      document.body.style.overflowY = "auto"
      const timingAnimation = 200
      modal.animate([{ opacity: "1" }, { opacity: "0" }], {
        duration: timingAnimation,
        easing: "ease-out",
      })
      setTimeout(() => {
        modal.classList.remove(modalActiveClass)
      }, timingAnimation)
    }

    // закрытие по клику на кнопку
    modal
      .querySelector("." + btnCloseModalSelectorClass)
      .addEventListener("click", closeModal, { once: true })

    // закрытие по клику вне модального окна
    document.addEventListener(
      "click",
      (e) => {
        if (
          !(
            modal.firstElementChild.contains(e.target) ||
            e.target === modal.firstChild
          )
        ) {
          closeModal()
        }
      },
      { once: true }
    )
  })
})
