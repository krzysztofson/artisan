const navBtn = document.querySelector(".js-nav-btn");
const nav = document.querySelector(".js-nav");

function togglenav() {
  nav.classList.toggle("hidden");
  nav.classList.toggle("flex");
}

if (navBtn) {
  navBtn.addEventListener("click", togglenav);
}

const contactBtns = document.querySelectorAll(".js-contact-btn");
const modal = document.querySelector(".js-modal");
const modalBg = document.querySelector(".js-modal-bg");
const modalClose = document.querySelector(".js-modal-close-btn");
const mobileNavBtns = document.querySelectorAll(".js-nav a");

function toggleModal(e) {
  e.stopPropagation();
  e.preventDefault();

  modal.classList.toggle("flex");
  modal.classList.toggle("hidden");
}

if (contactBtns) {
  contactBtns.forEach((btn) => {
    btn.addEventListener("click", toggleModal);
  });
}

if (modalBg && modalClose) {
  modalBg.addEventListener("click", toggleModal);
  modalClose.addEventListener("click", toggleModal);
}

if (mobileNavBtns) {
  mobileNavBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      togglenav();
    });
  });
}

const year = new Date().getFullYear();
document.querySelector("#year").textContent = year;

const navigation = document.querySelectorAll("nav");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  console.log(navigation);

  const currentScrollY = window.scrollY;

  navigation.forEach((nav) => {
    if (currentScrollY > lastScrollY) {
      nav.style.transform = "translateY(-300%)";
    } else {
      nav.style.transform = "translateY(0)";
    }
  });

  lastScrollY = currentScrollY;
});

// const navOffer = document.querySelector("#js-offer");
// if (navOffer) {
//   navOffer.addEventListener("mouseover", () => {
//     if (window.innerWidth > 1023) {
//       document.querySelector(".js-nav-list").classList.toggle("hidden");
//     }
//   });
//   navOffer.addEventListener("click", (e) => {
//     if (window.innerWidth <= 1023) {
//       e.preventDefault();
//       document.querySelector("#js-offer-mobile").classList.toggle("hidden");
//       togglenav();
//     }
//   });
// }
// const closeOffer = document.querySelector(".js-nav-list-close");
// closeOffer.addEventListener("click", () => {
//   document.querySelector(".js-nav-list").classList.toggle("hidden");
// });
