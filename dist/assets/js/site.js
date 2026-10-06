/* Artisan Clinic — shared page behaviour (from the approved redesign). Every block is guarded,
   so the same file runs on the homepage and on sub-pages. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---- header height -> --navh (hero tucks under it) ---- */
  var nav = document.getElementById("nav");
  function measure() {
    /* only the un-stuck header height is the one the hero tucks under */
    if (!nav || nav.classList.contains("is-stuck")) return;
    document.documentElement.style.setProperty("--navh", nav.offsetHeight + "px");
  }
  measure();
  window.addEventListener("resize", measure, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  /* ---- sticky nav + progress + floating cta ---- */
  var bar = document.getElementById("progress");
  var fcta = document.getElementById("floatCta");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (nav) nav.classList.toggle("is-stuck", y > 60);
    if (bar) bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    if (fcta) fcta.classList.toggle("show", y > window.innerHeight * 0.85);
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  /* ---- mobile sheet ---- */
  var burger = document.getElementById("burger");
  function closeSheet() {
    document.body.classList.remove("is-open");
    document.body.style.overflow = "";
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) {
    burger.addEventListener("click", function () {
      var open = document.body.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    document.querySelectorAll("#sheet a").forEach(function (a) {
      a.addEventListener("click", closeSheet);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("is-open")) closeSheet();
    });
    /* the burger is hidden above 1080px (chrome.css), so close the sheet when the viewport grows past it */
    var desktop = window.matchMedia("(min-width: 1081px)");
    var onDesktop = function (e) {
      if (e.matches && document.body.classList.contains("is-open")) closeSheet();
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onDesktop);
    else if (desktop.addListener) desktop.addListener(onDesktop);
  }

  /* ---- scroll reveals ---- */
  var targets = document.querySelectorAll(".rv, .mask, .step");
  if (!("IntersectionObserver" in window) || reduce) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---- counters ---- */
  var nums = document.querySelectorAll("[data-count]");
  if (nums.length && "IntersectionObserver" in window && !reduce) {
    var nio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          nio.unobserve(el);
          var end = parseInt(el.getAttribute("data-count"), 10);
          var sfx = el.getAttribute("data-suffix") || "";
          var t0 = null;
          var dur = 1300;
          function tick(ts) {
            if (!t0) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(end * eased) + (p === 1 ? sfx : "");
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 }
    );
    nums.forEach(function (n) { nio.observe(n); });
  }

  /* ---- offer tabs (homepage) ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab[aria-controls]"));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (!panel) return;
      panel.classList.toggle("is-active", on);
      if (on) { panel.removeAttribute("hidden"); } else { panel.setAttribute("hidden", ""); }
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(t); });
    t.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      select(next);
    });
  });

  /* ---- team rail: drag + arrows (homepage) ---- */
  var rail = document.getElementById("rail");
  if (rail) {
    var step = function () {
      var card = rail.querySelector(".member");
      return card ? card.getBoundingClientRect().width + 20 : 300;
    };
    var next = document.getElementById("railNext");
    var prev = document.getElementById("railPrev");
    if (next) next.addEventListener("click", function () {
      rail.scrollBy({ left: step() * 2, behavior: reduce ? "auto" : "smooth" });
    });
    if (prev) prev.addEventListener("click", function () {
      rail.scrollBy({ left: -step() * 2, behavior: reduce ? "auto" : "smooth" });
    });

    var down = false, startX = 0, startLeft = 0, moved = 0;
    rail.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      down = true;
      moved = 0;
      startX = e.clientX;
      startLeft = rail.scrollLeft;
      rail.classList.add("dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.abs(dx);
      rail.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!down) return;
      down = false;
      rail.classList.remove("dragging");
    });
    rail.addEventListener("click", function (e) {
      if (moved > 8) e.preventDefault();
    }, true);
  }
})();
