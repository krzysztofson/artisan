(function () {
  const tocRoot = document.getElementById("pricing-toc");
  const navContainers = ["pricing-toc-nav", "pricing-toc-nav-mobile"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!tocRoot || !navContainers.length) return;

  const EXCLUDED_IDS = new Set(["kontakt", "contact"]);
  const SCROLL_MARKER_OFFSET = 130;

  const sections = [...document.querySelectorAll(".pricing-main section.pt-20[id]")].filter(
    (section) => !EXCLUDED_IDS.has(section.id)
  );

  if (!sections.length) return;

  const sectionById = new Map(sections.map((section) => [section.id, section]));

  function getMainCategories() {
    const layout = document.querySelector(".pricing-layout");
    if (!layout) return [];

    let navSection = null;
    let el = layout.previousElementSibling;
    while (el) {
      if (el.tagName === "SECTION" && el.id !== "search") {
        const grids = el.querySelectorAll(".grid.grid-cols-2");
        if (grids.length >= 2) {
          navSection = el;
          break;
        }
      }
      el = el.previousElementSibling;
    }
    if (!navSection) return [];

    const mainGrids = navSection.querySelectorAll(".grid.grid-cols-2");
    const links = [];

    [mainGrids[0], mainGrids[1]].forEach((grid) => {
      if (!grid) return;
      grid.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        const anchorId = anchor.getAttribute("href").slice(1);
        if (!anchorId || EXCLUDED_IDS.has(anchorId)) return;
        links.push({
          label: anchor.textContent.trim(),
          anchorId,
        });
      });
    });

    return links
      .map((category, index) => {
        const nextAnchorId = links[index + 1]?.anchorId;
        const startIdx = sections.findIndex((section) => section.id === category.anchorId);
        if (startIdx === -1) return null;

        let endIdx = sections.length;
        if (nextAnchorId) {
          const nextIdx = sections.findIndex((section) => section.id === nextAnchorId);
          if (nextIdx !== -1) endIdx = nextIdx;
        }

        return {
          ...category,
          sectionIds: sections.slice(startIdx, endIdx).map((section) => section.id),
        };
      })
      .filter(Boolean);
  }

  const categories = getMainCategories();
  if (!categories.length) return;

  const chevronSvg =
    '<svg class="pricing-toc__group-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const entryBySectionId = new Map();
  categories.forEach((category) => {
    category.sectionIds.forEach((sectionId) => {
      const section = sectionById.get(sectionId);
      if (!section || entryBySectionId.has(sectionId)) return;
      const titleEl = section.querySelector("h2");
      entryBySectionId.set(sectionId, {
        section,
        label: titleEl ? titleEl.textContent.trim() : section.id,
        links: [],
      });
    });
  });

  const entryList = [...entryBySectionId.values()];
  const categoryGroups = [];

  function createSectionLink(entry, options = {}) {
    const link = document.createElement("a");
    link.href = `#${entry.section.id}`;
    link.className = "pricing-toc__link";
    if (options.topLevel) link.classList.add("pricing-toc__link--top");
    link.textContent = entry.label;
    link.dataset.sectionId = entry.section.id;
    entry.links.push(link);
    return link;
  }

  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${sectionId}`);
    closeMobilePanel();
  }

  function buildAccordionNav(container) {
    const accordion = document.createElement("div");
    accordion.className = "pricing-toc__accordion";
    const groups = [];

    categories.forEach((category) => {
      const groupEl = document.createElement("div");
      groupEl.className = "pricing-toc__group";
      groupEl.dataset.categoryId = category.anchorId;

      const groupLinks = [];

      if (category.sectionIds.length === 1) {
        const entry = entryBySectionId.get(category.sectionIds[0]);
        if (entry) {
          const link = createSectionLink(entry, { topLevel: true });
          link.textContent = category.label;
          accordion.appendChild(link);
          groups.push({ category, groupEl: link, toggle: null, panel: null, links: [link], isSingle: true });
        }
        return;
      }

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "pricing-toc__group-toggle";
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = `<span class="pricing-toc__group-label">${category.label}</span>${chevronSvg}`;

      const panel = document.createElement("div");
      panel.className = "pricing-toc__group-panel";
      panel.hidden = true;

      category.sectionIds.forEach((sectionId) => {
        const entry = entryBySectionId.get(sectionId);
        if (!entry) return;
        const link = createSectionLink(entry);
        panel.appendChild(link);
        groupLinks.push(link);
      });

      toggle.addEventListener("click", () => scrollToSection(category.anchorId));

      groupEl.appendChild(toggle);
      groupEl.appendChild(panel);
      accordion.appendChild(groupEl);
      groups.push({ category, groupEl, toggle, panel, links: groupLinks, isSingle: false });
    });

    container.appendChild(accordion);
    return groups;
  }

  navContainers.forEach((container) => {
    categoryGroups.push(...buildAccordionNav(container));
  });

  const pricingLayout = document.querySelector(".pricing-layout");
  const toggleBtns = tocRoot.querySelectorAll(".js-pricing-toc-toggle");
  const panel = tocRoot.querySelector(".js-pricing-toc-panel");
  const backdrop = tocRoot.querySelector(".js-pricing-toc-backdrop");

  let activeSectionId = "";
  let filterActive = false;
  let scrollTicking = false;

  function getVisibleSections() {
    return sections.filter((section) => section.style.display !== "none");
  }

  function getActiveSectionIdFromScroll() {
    const visibleSections = getVisibleSections();
    if (!visibleSections.length) return sections[0]?.id || "";

    const marker = window.scrollY + SCROLL_MARKER_OFFSET;
    let current = visibleSections[0].id;

    for (const section of visibleSections) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      if (top <= marker + 1) current = section.id;
      else break;
    }

    const lastSection = visibleSections[visibleSections.length - 1];
    const nearBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 48;

    if (nearBottom) return lastSection.id;

    return current;
  }

  function findCategoryForSection(sectionId) {
    return categories.find((category) => category.sectionIds.includes(sectionId));
  }

  function setCategoryOpen(group, isOpen) {
    if (group.isSingle) return;
    group.groupEl.classList.toggle("is-open", isOpen);
    group.groupEl.classList.toggle("has-active", isOpen);
    group.toggle.setAttribute("aria-expanded", String(isOpen));
    group.panel.hidden = !isOpen;
  }

  function syncAccordionState() {
    const activeCategory = findCategoryForSection(activeSectionId);

    categoryGroups.forEach((group) => {
      if (group.isSingle) return;

      if (filterActive) {
        const hasVisibleLinks = group.links.some((link) => !link.hidden && !link.classList.contains("is-hidden"));
        setCategoryOpen(group, hasVisibleLinks);
        return;
      }

      const isOpen = activeCategory ? group.category.anchorId === activeCategory.anchorId : false;
      setCategoryOpen(group, isOpen);
    });
  }

  function isPricingInView() {
    if (!pricingLayout) return true;
    const rect = pricingLayout.getBoundingClientRect();
    return rect.bottom > 80 && rect.top < window.innerHeight - 40;
  }

  function updateMobileToggleVisibility() {
    if (window.innerWidth >= 1024 || tocRoot.classList.contains("is-open")) return;
    const inView = isPricingInView();
    toggleBtns.forEach((btn) => btn.classList.toggle("is-hidden", !inView));
  }

  function syncLinksWithSearch() {
    const searchInput = document.getElementById("searchInput");
    const term = searchInput ? searchInput.value.trim() : "";
    filterActive = term.length >= 2;

    entryList.forEach(({ section, links }) => {
      const hidden = filterActive && section.style.display === "none";
      links.forEach((link) => {
        link.hidden = hidden;
        link.classList.toggle("is-hidden", hidden);
      });
    });

    syncAccordionState();
  }

  function scrollActiveLinkIntoView(link) {
    if (!link) return;

    const scrollContainer = link.closest(".pricing-toc__inner") || link.closest(".pricing-toc__nav");
    if (!scrollContainer) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    if (linkRect.top < containerRect.top + 8) {
      scrollContainer.scrollTop -= containerRect.top - linkRect.top + 8;
    } else if (linkRect.bottom > containerRect.bottom - 8) {
      scrollContainer.scrollTop += linkRect.bottom - containerRect.bottom + 8;
    }
  }

  syncLinksWithSearch();
  updateMobileToggleVisibility();
  window.addEventListener(
    "resize",
    () => {
      updateMobileToggleVisibility();
      updateActiveFromScroll();
    },
    { passive: true }
  );
  window.addEventListener(
    "scroll",
    () => {
      updateMobileToggleVisibility();
      if (!scrollTicking) {
        requestAnimationFrame(updateActiveFromScroll);
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  function openMobilePanel() {
    tocRoot.classList.add("is-open");
    toggleBtns.forEach((btn) => {
      btn.setAttribute("aria-expanded", "true");
      btn.classList.remove("is-hidden");
    });
    if (panel) panel.removeAttribute("hidden");
    document.body.classList.add("pricing-toc-open");
    syncAccordionState();
  }

  function closeMobilePanel() {
    tocRoot.classList.remove("is-open");
    toggleBtns.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
    if (panel) panel.setAttribute("hidden", "");
    document.body.classList.remove("pricing-toc-open");
    updateMobileToggleVisibility();
  }

  navContainers.forEach((container) => {
    container.addEventListener("click", (event) => {
      const link = event.target.closest(".pricing-toc__link");
      if (!link) return;
      event.preventDefault();
      scrollToSection(link.dataset.sectionId);
    });
  });

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (tocRoot.classList.contains("is-open")) closeMobilePanel();
      else openMobilePanel();
    });
  });

  backdrop?.addEventListener("click", closeMobilePanel);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobilePanel();
  });

  function setActive(id) {
    if (!id || id === activeSectionId) return;
    activeSectionId = id;

    entryList.forEach(({ section, links }) => {
      const isActive = section.id === id;
      links.forEach((link) => {
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "true");
          const desktopLink = link.closest("#pricing-toc-nav") ? link : null;
          if (desktopLink) scrollActiveLinkIntoView(desktopLink);
          if (tocRoot.classList.contains("is-open")) scrollActiveLinkIntoView(link);
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });

    syncAccordionState();
  }

  function updateActiveFromScroll() {
    setActive(getActiveSectionIdFromScroll());
    scrollTicking = false;
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      window.setTimeout(syncLinksWithSearch, 0);
    });
  }

  document.addEventListener("pricing-filter-change", syncLinksWithSearch);

  const hashId = location.hash ? location.hash.slice(1) : "";
  if (hashId && document.getElementById(hashId)) {
    window.setTimeout(() => setActive(hashId), 100);
  } else {
    updateActiveFromScroll();
  }
})();
