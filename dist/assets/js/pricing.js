/* Price list: live search over rows + highlighting the current section in the table of contents. */
(function () {
  "use strict";
  var input = document.getElementById("price-search");
  var empty = document.getElementById("price-empty");
  var groups = Array.prototype.slice.call(document.querySelectorAll("[data-group]"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-section]"));
  var toc = document.querySelector(".pricing-toc details");

  var norm = function (s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l");
  };

  if (input) {
    input.addEventListener("input", function () {
      var q = norm(input.value.trim());
      var any = false;
      sections.forEach(function (sec) {
        var title = norm((sec.querySelector("h3") || {}).textContent || "");
        var hitTitle = q.length > 1 && title.indexOf(q) !== -1;
        var shown = 0;
        sec.querySelectorAll("[data-row]").forEach(function (row) {
          var on = q.length < 2 || hitTitle || norm(row.textContent).indexOf(q) !== -1;
          row.hidden = !on;
          if (on) shown++;
        });
        sec.querySelectorAll("[data-heading]").forEach(function (h) { h.hidden = q.length >= 2 && !hitTitle; });
        sec.hidden = shown === 0;
        if (shown) any = true;
      });
      groups.forEach(function (g) {
        g.hidden = !g.querySelector("[data-section]:not([hidden])");
      });
      if (empty) empty.hidden = any;
    });
  }

  /* collapse the table of contents on small screens */
  var mq = window.matchMedia("(max-width: 960px)");
  function syncToc() { if (toc) toc.open = !mq.matches; }
  syncToc();
  if (mq.addEventListener) mq.addEventListener("change", syncToc);
  if (toc) toc.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { if (mq.matches) toc.open = false; });
  });

  /* current section in the TOC */
  var links = {};
  document.querySelectorAll(".toc-group a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var current = null;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          if (current) current.classList.remove("is-current");
          current = links[en.target.id];
          if (current) current.classList.add("is-current");
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach(function (s) { io.observe(s); });
  }
})();
