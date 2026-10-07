const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // assets and files that go to the server untouched (brand-kit, PHP form handler, …)
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });
  eleventyConfig.ignores.add("src/static/**");
  eleventyConfig.ignores.add("src/css/**");
  eleventyConfig.ignores.add("src/blog/README.md");
  eleventyConfig.watchIgnores.add("src/css/**");

  // ---- price list helpers (pricing.yaml is the single source of prices) ----
  const nbsp = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const rowsFor = (pricing, id) => {
    const all = pricing.sections
      .flatMap((s) => s.items)
      .filter((r) => r.from && [].concat(r.treatment || []).includes(id));
    const primary = all.filter((r) => r.primary);
    return primary.length ? primary : all;
  };

  /** Lowest price for a treatment, e.g. "od 60 000 PLN"; "" when the price list has none. */
  eleventyConfig.addFilter("priceFrom", function (id, lang, treatments, pricing) {
    const t = treatments[id];
    if (!t) return "";
    const rows = rowsFor(pricing, t.twin || id);
    if (!rows.length) return "";
    const min = Math.min(...rows.map((r) => r.from));
    return `${lang === "en" ? "from" : "od"} ${nbsp(min)} PLN`;
  });

  /** Price-list row from a reference {section, name, heading?} (homepage ledger). Fails the build if it is gone. */
  eleventyConfig.addFilter("priceRef", (ref, pricing) => {
    const sec = pricing.sections.find((s) => s.id === ref.section);
    let heading = "";
    const row = sec && sec.items.find((r) => {
      if (r.heading) { heading = r.heading.pl; return false; }
      return r.name.pl === ref.name && (!ref.heading || heading.includes(ref.heading));
    });
    if (!row) throw new Error(`priceRef: no price-list row ${JSON.stringify(ref)}`);
    return row;
  });

  /** Link target of a price-list row (first treatment wins). */
  eleventyConfig.addFilter("rowHref", (row, lang, treatments) => {
    if (row.href) return row.href;
    const id = [].concat(row.treatment || [])[0];
    if (!id) return "";
    if (!treatments[id]) throw new Error(`rowHref: unknown treatment "${id}" in price-list row "${row.name.pl}"`);
    return `${treatments[id].slug[lang]}.html`;
  });

  /** Splits "60 000 – 85 000 PLN" into the number part and the trailing unit for the ledger. */
  eleventyConfig.addFilter("priceParts", (price) => {
    const m = String(price).match(/^(.*?\d)\s*(PLN.*)$/);
    return m ? { num: m[1], unit: m[2] } : { num: price, unit: "" };
  });

  eleventyConfig.addFilter("treatment", (id, treatments) => {
    if (!treatments[id]) throw new Error(`unknown treatment "${id}"`);
    return { id, ...treatments[id] };
  });

  /** Treatments of a category in price-list-independent, stable order (as listed in treatments.yaml).
      A twin is skipped when its main page is already listed in the same category. */
  eleventyConfig.addFilter("inCategory", (treatments, cat) =>
    Object.entries(treatments)
      .filter(([, t]) => t.categories.includes(cat))
      .filter(([, t]) => !(t.twin && treatments[t.twin] && treatments[t.twin].categories.includes(cat)))
      .map(([id, t]) => ({ id, ...t }))
  );

  eleventyConfig.addFilter("findBy", (list, key, value) => (list || []).find((x) => x[key] === value));
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("plDate", (d, lang) =>
    new Date(d).toLocaleDateString(lang === "en" ? "en-GB" : "pl-PL", { day: "numeric", month: "long", year: "numeric" })
  );
  eleventyConfig.addFilter("stripTags", (s) => String(s || "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim());
  /** Cuts at the last word break before n (or hard at n when there is none nearby) and adds "…". */
  eleventyConfig.addFilter("truncateWords", (s, n) => {
    s = String(s || "");
    if (s.length <= n) return s;
    const cut = s.lastIndexOf(" ", n);
    return s.slice(0, cut > n * 0.6 ? cut : n).trimEnd() + "…";
  });

  // ---- cache busting: ?v=<content hash> on CSS/JS (.htaccess caches them for a month) ----
  const hashes = new Map();
  eleventyConfig.on("eleventy.before", () => hashes.clear());
  const filesIn = (p) =>
    fs.statSync(p).isDirectory() ? fs.readdirSync(p).sort().flatMap((f) => filesIn(path.join(p, f))) : [p];
  /** Short content hash of a source file, or of every file in a source folder (src/css → artisan.css). */
  eleventyConfig.addFilter("assetHash", (p) => {
    if (!hashes.has(p)) {
      const h = crypto.createHash("md5");
      for (const f of filesIn(p)) h.update(fs.readFileSync(f));
      hashes.set(p, h.digest("hex").slice(0, 8));
    }
    return hashes.get(p);
  });

  // ---- blog ----
  for (const lang of ["pl", "en"]) {
    eleventyConfig.addCollection(`posts_${lang}`, (api) =>
      api
        .getFilteredByGlob(`./src/blog/${lang}/*.md`)
        .filter((p) => !p.data.draft)
        .sort((a, b) => b.date - a.date)
    );
  }

  return {
    dir: { input: "src", output: "dist", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "html", "md"],
    // treatment bodies are plain HTML from the old site — never run them through a template engine
    htmlTemplateEngine: false,
    markdownTemplateEngine: "njk",
  };
};
