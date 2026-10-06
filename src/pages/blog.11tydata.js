// The blog index is only built once the blog is switched on (site.yaml → blogEnabled).
module.exports = {
  eleventyComputed: {
    permalink: (d) => (d.site.blogEnabled ? (d.lang === "pl" ? "" : "en/") + d.pages.blog[d.lang] : false),
  },
};
