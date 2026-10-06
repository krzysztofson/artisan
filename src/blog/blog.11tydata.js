// Blog posts: src/blog/pl/*.md and src/blog/en/*.md → /blog-<slug>.html and /en/blog-<slug>.html
module.exports = {
  layout: "layouts/post.njk",
  eleventyComputed: {
    lang: (d) => (d.page.inputPath.includes("/blog/en/") ? "en" : "pl"),
    permalink: (d) => (d.draft ? false : (d.page.inputPath.includes("/blog/en/") ? "en/" : "") + "blog-" + d.page.fileSlug + ".html"),
    metaTitle: (d) => `${d.title} — Artisan Clinic`,
    metaDescription: (d) => d.excerpt || d.title,
    // `translation`: file slug of the same post in the other language (optional)
    altFileOverride: (d) => (d.translation ? `blog-${d.translation}.html` : "blog.html"),
    // without a translation the language switch goes to the other blog index, but no hreflang pair is claimed
    noHreflang: (d) => !d.translation,
  },
};
