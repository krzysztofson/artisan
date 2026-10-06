#!/usr/bin/env node
/**
 * Sanity checks for the built site in dist/ (run after `npm run build`):
 *   - every internal href/src points at an existing file, every #anchor at an existing id
 *   - canonical + hreflang URLs use site.url and point at built pages
 *   - no reference to the retired krokirazem.pl domain
 *   - optional: every URL from a list of old URLs still exists  →  npm run check -- old-urls.txt
 */
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const yaml = require("js-yaml");

const DIST = path.join(__dirname, "..", "dist");
const site = yaml.load(fs.readFileSync(path.join(__dirname, "..", "src/_data/site.yaml"), "utf8"));
const errors = [];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const files = walk(DIST);
const pages = files.filter((f) => f.endsWith(".html"));
const ids = new Map();
const idsOf = (file) => {
  if (!ids.has(file)) {
    const $ = cheerio.load(fs.readFileSync(file, "utf8"));
    ids.set(file, new Set($("[id]").map((_, el) => $(el).attr("id")).get()));
  }
  return ids.get(file);
};
const rel = (f) => path.relative(DIST, f);

for (const file of files.filter((f) => /\.(html|css|js|php)$/.test(f))) {
  if (/krokirazem/i.test(fs.readFileSync(file, "utf8"))) errors.push(`${rel(file)}: mentions krokirazem`);
}

for (const file of pages) {
  if (rel(file) === "brand-kit.html" || rel(file) === "redesign.html") continue; // standalone design references
  const $ = cheerio.load(fs.readFileSync(file, "utf8"));
  $("[href], [src]").each((_, el) => {
    const raw = $(el).attr("href") ?? $(el).attr("src");
    if (!raw || /^(https?:|mailto:|tel:|data:|javascript:|\{\{)/.test(raw)) return;
    const [p, hash] = raw.split("#");
    const target = p ? path.resolve(path.dirname(file), p.split("?")[0]) : file;
    if (!fs.existsSync(target)) return errors.push(`${rel(file)}: broken link ${raw}`);
    if (hash && target.endsWith(".html") && !idsOf(target).has(decodeURIComponent(hash)))
      errors.push(`${rel(file)}: missing anchor ${raw}`);
  });
  $('link[rel="canonical"], link[rel="alternate"][hreflang]').each((_, el) => {
    const href = $(el).attr("href");
    if (!href.startsWith(site.url + "/")) return errors.push(`${rel(file)}: ${$(el).attr("rel")} not on ${site.url}: ${href}`);
    let local = href.slice(site.url.length + 1);
    if (local === "" || local.endsWith("/")) local += "index.html";
    if (!fs.existsSync(path.join(DIST, local))) errors.push(`${rel(file)}: ${$(el).attr("hreflang") || "canonical"} → missing ${local}`);
  });
}

const list = process.argv[2];
if (list) {
  for (const line of fs.readFileSync(list, "utf8").split("\n").map((l) => l.trim()).filter(Boolean)) {
    const p = line.replace(/^dist\//, "");
    if (!fs.existsSync(path.join(DIST, p))) errors.push(`old URL no longer exists: ${p}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n✗ ${errors.length} problem(s) in ${pages.length} pages`);
  process.exit(1);
}
console.log(`✓ ${pages.length} pages: links, anchors, canonical/hreflang OK${list ? ", all old URLs present" : ""}`);
