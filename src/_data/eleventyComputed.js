// Values every page gets, derived from its `lang` and either `id` (treatment) or `key` (page in pages.yaml).
const other = (lang) => (lang === "en" ? "pl" : "en");
const abs = (site, url) => site.url + url.replace(/index\.html$/, "");

module.exports = {
  // prefix from the current page to the site root ("" for PL pages, "../" for pages in /en/)
  root: (d) => (d.lang === "en" ? "../" : ""),
  // file of this page in the other language, relative to that language's folder
  altFile: (d) => {
    if (!d.lang) return undefined;
    if (d.id && d.treatments && d.treatments[d.id]) return `${d.treatments[d.id].slug[other(d.lang)]}.html`;
    if (d.altFileOverride) return d.altFileOverride;
    if (d.key && d.pages && d.pages[d.key]) return d.pages[d.key][other(d.lang)];
    return "index.html";
  },
  // link from this page to its other-language version
  altHref: (d) => (d.lang === "en" ? "../" : "en/") + (d.altFile || "index.html"),
  canonical: (d) => (d.page && d.page.url ? abs(d.site, d.page.url) : undefined),
  hreflang: (d) => {
    if (!d.page || !d.page.url || !d.lang || d.noHreflang) return {};
    const own = d.page.url;
    const alt = (d.lang === "en" ? "/" : "/en/") + (d.altFile || "index.html");
    return d.lang === "pl" ? { pl: abs(d.site, own), en: abs(d.site, alt) } : { pl: abs(d.site, alt), en: abs(d.site, own) };
  },
};
