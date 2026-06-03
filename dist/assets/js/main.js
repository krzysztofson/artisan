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

function toggleModal() {
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
const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = year;

const siteNav = document.querySelector("nav.is-transparent");
if (siteNav) {
  let lastScrollY = window.scrollY;
  let scrollTicking = false;

  function getTransparentThreshold() {
    const hero = document.getElementById("hero");
    return hero ? Math.max(hero.offsetHeight - 100, 30) : 30;
  }

  function updateNavAppearance(currentScrollY) {
    if (currentScrollY < getTransparentThreshold()) {
      siteNav.classList.add("is-transparent");
    } else {
      siteNav.classList.remove("is-transparent");
    }
  }

  function updateSiteNavOnScroll() {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    updateNavAppearance(currentScrollY);

    if (currentScrollY < 80) {
      siteNav.classList.remove("is-nav-hidden");
    } else if (delta > 4) {
      siteNav.classList.add("is-nav-hidden");
    } else if (delta < -4) {
      siteNav.classList.remove("is-nav-hidden");
    }

    lastScrollY = currentScrollY;
    scrollTicking = false;
  }

  updateNavAppearance(window.scrollY);

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        requestAnimationFrame(updateSiteNavOnScroll);
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", () => updateNavAppearance(window.scrollY), { passive: true });
}

// Search functionality for pricing page
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector("#searchInput");
  console.log("DOM loaded, searching for input:", searchInput);

  if (searchInput) {
    console.log("Search input found, adding event listener");
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase().trim();
      console.log("Search term entered:", searchTerm);

      // Only filter if 2 or more characters are entered
      if (searchTerm.length >= 2) {
        console.log("Filtering items for:", searchTerm);
        filterPricingItems(searchTerm);
      } else {
        // Show all items if less than 2 characters
        console.log("Showing all items");
        showAllPricingItems();
      }
    });
  } else {
    console.log("Search input not found!");
  }
});

function dispatchPricingFilterChange() {
  document.dispatchEvent(new CustomEvent("pricing-filter-change"));
}

function filterPricingItems(searchTerm) {
  console.log("filterPricingItems called with:", searchTerm);
  // Get all pricing sections (sections with h2 titles and pricing items)
  const pricingSections = document.querySelectorAll("section[id]:not(#search):not(#hero)");
  console.log("Found sections:", pricingSections.length);

  pricingSections.forEach((section) => {
    console.log("Processing section:", section.id);
    const sectionTitle = section.querySelector("h2");
    const pricingItems = section.querySelectorAll(".mx-auto.max-w-3xl a, .mx-auto.max-w-3xl > div");
    console.log("Found pricing items in section:", pricingItems.length);
    let hasVisibleItems = false;

    // Filter items within this section
    pricingItems.forEach((item) => {
      // Check if this is actually a pricing item (has pricing text structure)
      const itemText = item.querySelector("p.font-semibold");
      if (!itemText) return;

      const itemContent = itemText.textContent.toLowerCase();
      const priceElement = item.querySelector("p:not(.font-semibold)");
      const priceText = priceElement ? priceElement.textContent.toLowerCase() : "";

      // Search in both item name and section title
      const sectionTitleText = sectionTitle ? sectionTitle.textContent.toLowerCase() : "";
      const shouldShow =
        itemContent.includes(searchTerm) || sectionTitleText.includes(searchTerm) || priceText.includes(searchTerm);

      if (shouldShow) {
        item.style.display = "";
        hasVisibleItems = true;
      } else {
        item.style.display = "none";
      }
    });

    // Hide/show section based on whether it has visible items
    if (sectionTitle) {
      if (hasVisibleItems) {
        section.style.display = "";
      } else {
        section.style.display = "none";
      }
    }
  });
  dispatchPricingFilterChange();
}

function showAllPricingItems() {
  // Show all sections and items
  const pricingSections = document.querySelectorAll("section[id]:not(#search):not(#hero)");

  pricingSections.forEach((section) => {
    section.style.display = "";

    const pricingItems = section.querySelectorAll(".mx-auto.max-w-3xl a, .mx-auto.max-w-3xl > div");
    pricingItems.forEach((item) => {
      item.style.display = "";
    });
  });
  dispatchPricingFilterChange();
}

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
