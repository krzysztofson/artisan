// Every file in treatments/{pl,en}/ is one treatment page; titles, slugs and the sidebar come from _data/treatments.yaml.
module.exports = {
  layout: "layouts/treatment.njk",
  eleventyComputed: {
    lang: (d) => (d.page.inputPath.includes("/treatments/en/") ? "en" : "pl"),
    permalink: (d) => (d.page.inputPath.includes("/treatments/en/") ? "en/" : "") + d.page.fileSlug + ".html",
    metaTitle: (d) => `${d.treatments[d.id].title[d.lang]} — Artisan Clinic ${d.lang === "en" ? "Warsaw" : "Warszawa"}`,
    metaDescription: (d) => d.lead || d.treatments[d.id].excerpt[d.lang],
  },
};
