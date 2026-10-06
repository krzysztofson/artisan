#!/usr/bin/env node
/**
 * One-off migration: old hand-edited dist/ (Tailwind) -> Eleventy sources in src/.
 *
 *   node scripts/migrate-to-11ty.js <path-to-old-dist>
 *
 * Writes:
 *   src/treatments/{pl,en}/<slug>.html   content + front matter
 *   src/_data/treatments.yaml            treatment registry (titles, slugs, categories, excerpts, summary)
 *   src/_data/pricing.yaml               price list (PL+EN paired by position)
 *   src/_data/team.yaml                  doctors
 *   src/_data/reviews.yaml               review cards
 *   src/_includes/forms/consultation-{pl,en}.html
 *   scripts/migration-report.md
 */
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const yaml = require("js-yaml");

const OLD = path.resolve(process.argv[2] || "");
if (!process.argv[2] || !fs.existsSync(path.join(OLD, "index.html"))) {
  console.error("Usage: node scripts/migrate-to-11ty.js <path-to-old-dist>");
  process.exit(1);
}
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");
const report = [];
const curation = require("./migration-curation");

// ---------------------------------------------------------------- helpers
const read = (rel) =>
  fs
    .readFileSync(path.join(OLD, rel), "utf8")
    // broken attributes from the old EN find-and-replace: class=”x” -> class="x"
    .replace(/([a-z-]+)=[”“]([^”“"]*)[”“]/g, '$1="$2"');
const load = (rel) => cheerio.load(read(rel), { decodeEntities: false });
const write = (rel, content) => {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};
const text = (s) => s.replace(/ |&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const dumpYaml = (obj) => yaml.dump(obj, { lineWidth: -1, noRefs: true, quotingType: '"' });
const dedent = (html) => {
  const lines = html.replace(/^\s*\n/, "").replace(/\s+$/, "").split("\n");
  const ind = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(ind)).join("\n") + "\n";
};
const parsePrice = (s) => {
  const m = text(s).match(/\d[\d ]*/);
  return m ? parseInt(m[0].replace(/ /g, ""), 10) : null;
};

// ---------------------------------------------------------------- slug map (from the old scripts/build-en.js, commit 5a627d7)
const legacy = require("child_process").execSync("git show 5a627d7:scripts/build-en.js", { cwd: ROOT, encoding: "utf8" });
const FILE_MAP = {};
for (const m of legacy.matchAll(/'([^']+\.html)': '([^']+\.html)'/g)) FILE_MAP[m[1]] = m[2];
const PAGES = ["index.html", "zabiegi.html", "cennik.html", "zespol.html", "konsultacja-online.html"];
const TREATMENTS = Object.keys(FILE_MAP).filter((f) => !PAGES.includes(f));
const id = (file) => file.replace(/\.html$/, "");
const EN_TO_ID = Object.fromEntries(TREATMENTS.map((f) => [FILE_MAP[f], id(f)]));

// ---------------------------------------------------------------- categories + excerpts (zabiegi / services)
const CATS = { pl: ["twarz", "cialo", "piersi", "skora"], en: ["face", "body", "breasts", "skin"] };
const cards = { pl: {}, en: {} };
const membership = {};
for (const [lang, file] of [["pl", "zabiegi.html"], ["en", "en/services.html"]]) {
  const $ = load(file);
  CATS[lang].forEach((cat, ci) => {
    $(`section#${cat} a[href$=".html"]`).each((_, a) => {
      const href = $(a).attr("href").replace(/^\.?\//, "");
      const tid = lang === "pl" ? id(href) : EN_TO_ID[href];
      if (!tid) return;
      const card = $(a).closest("div");
      if (!cards[lang][tid])
        cards[lang][tid] = { title: text(card.find("h3").first().text()), excerpt: text(card.find("p").first().text()) };
      if (lang === "pl") {
        membership[tid] = membership[tid] || [];
        if (!membership[tid].includes(CATS.pl[ci])) membership[tid].push(CATS.pl[ci]);
      }
    });
  });
}

// ---------------------------------------------------------------- summary extraction
const FIELDS = {
  anesthesia: { pl: /znieczuleni/i, en: /an(a)?esthe/i },
  duration: { pl: /czas trwania|jak długo trwa|czas zabiegu|długość zabiegu/i, en: /duration|how long|procedure time/i },
  recovery: { pl: /rekonwalescencj/i, en: /recovery|convalescen/i },
  stay: { pl: /pobyt w klinice/i, en: /stay in the clinic|hospital stay|clinic stay/i },
};
function extractSummary($, root, lang) {
  const out = {};
  root.find("h2,h3,h4,h5,h6").each((_, h) => {
    const head = text($(h).text());
    if (head.length > 90) return;
    for (const [key, re] of Object.entries(FIELDS)) {
      if (out[key] || !re[lang].test(head)) continue;
      const next = $(h).nextAll().first();
      if (!next.length || next[0].tagName !== "p") continue;
      const val = text(next.text()).replace(/\.$/, "");
      if (val) out[key] = val;
    }
  });
  return out;
}

// ---------------------------------------------------------------- de-duplicate pasted-twice content
// Pattern in the old pages: a draft block [0..start) followed by the full version that
// re-starts with the same elements. Drop the repeated run from the full version, so blocks
// unique to either copy survive in their natural order.
function dedupeChildren($, root, label) {
  const kids = root.children().toArray();
  const keys = kids.map((k) => text($(k).text()).replace(/\s/g, "") || k.tagName);
  for (let start = 3; start <= kids.length / 2; start++) {
    let m = 0;
    while (m < start && start + m < kids.length && keys[start + m] === keys[m]) m++;
    if (m >= 3 && m >= start - 1) {
      kids.slice(start, start + m).forEach((k) => $(k).remove());
      report.push(`- \`${label}\`: usunięto zdublowaną treść (${m} bloków)`);
      return;
    }
  }
}

// ---------------------------------------------------------------- treatments
const treatments = {};
const raw = {};
for (const file of TREATMENTS) {
  const tid = id(file);
  const entry = { slug: { pl: tid, en: id(FILE_MAP[file]) }, title: {}, categories: membership[tid] || [], excerpt: {}, summary: {}, related: [] };
  for (const lang of ["pl", "en"]) {
    const rel = lang === "pl" ? file : `en/${FILE_MAP[file]}`;
    if (!fs.existsSync(path.join(OLD, rel))) {
      report.push(`- brak pliku \`${rel}\``);
      continue;
    }
    const $ = load(rel);
    const title = text($("#hero h1").text()).replace(/^>\s*/, "");
    const leadEl = $("#hero p").first();
    const lead = text(leadEl.html() || "").replace(/^<strong>\s*<\/strong>/, "");
    const container = $("section.content .container").first();
    const root = container.find(".page-content").length ? container.find(".page-content").first() : container;
    dedupeChildren($, root, rel);
    // links to other old pages are fine as they are (same flat structure)
    const body = dedent(root.html());

    entry.title[lang] = title;
    entry.excerpt[lang] = cards[lang][tid]?.excerpt || text(cheerio.load(lead).text()).split(/(?<=\.)\s/)[0];
    // raw extraction only feeds the report; the published values come from migration-curation.js
    const sum = extractSummary($, root, lang);
    for (const [k, v] of Object.entries(sum)) (raw[tid] = raw[tid] || {})[`${k}.${lang}`] = v;

    const fm = dumpYaml({ id: tid, lead });
    write(`src/treatments/${lang}/${entry.slug[lang]}.html`, `---\n${fm}---\n${body}`);
  }
  entry.summary = curation.summary[tid] || {};
  if (curation.twins[tid]) entry.twin = curation.twins[tid];
  entry.related = curation.related[tid] || [];
  if (!entry.categories.length && curation.categories[tid]) entry.categories = curation.categories[tid];
  if (!entry.categories.length) report.push(`- \`${tid}\` nie ma kategorii w zabiegi.html — do uzupełnienia ręcznie`);
  treatments[tid] = entry;
}

for (const [tid, t] of Object.entries(treatments))
  for (const r of t.related)
    if (!treatments[r] || r === tid) throw new Error(`related: ${tid} -> ${r} is invalid`);

// ---------------------------------------------------------------- pricing (cennik + en/pricing, paired by position)
const P = { pl: load("cennik.html"), en: load("en/pricing.html") };
const secs = { pl: P.pl(".pricing-main section.pt-20").toArray(), en: P.en(".pricing-main section.pt-20").toArray() };
if (secs.pl.length !== secs.en.length) throw new Error("PL/EN pricing section count differs");
const sections = secs.pl.map((sPl, i) => {
  const $p = P.pl, $e = P.en, sEn = secs.en[i];
  const kp = $p(sPl).find(".max-w-3xl").children().toArray();
  const ke = $e(sEn).find(".max-w-3xl").children().toArray();
  if (kp.length !== ke.length) throw new Error(`row count differs in ${$p(sPl).attr("id")}`);
  const items = kp.map((cp, j) => {
    const ce = ke[j];
    const isRow = $p(cp).children("p").length === 2;
    if (!isRow) return { heading: { pl: text($p(cp).text()), en: text($e(ce).text()) } };
    const [nP, prP] = $p(cp).children("p").toArray().map((x) => text($p(x).text()));
    const [nE, prE] = $e(ce).children("p").toArray().map((x) => text($e(x).text()));
    const row = { name: { pl: nP, en: nE }, price: { pl: prP, en: prE }, from: parsePrice(prP) };
    const href = $p(cp).attr("href");
    if (href) {
      const h = href.replace(/^\.?\//, "");
      if (/^https?:/.test(h)) row.href = h;
      else if (treatments[id(h)]) row.treatment = id(h);
      else report.push(`- cennik: nieznany link \`${h}\``);
    }
    return row;
  });
  return {
    id: $p(sPl).attr("id"), // anchors are shared by both languages (old EN ids were garbled by find-and-replace)
    title: { pl: text($p(sPl).find("h2").first().text()), en: text($e(sEn).find("h2").first().text()) },
    items,
  };
});
// groups: the tile grids above the list
const groups = [];
{
  const $ = P.pl, $e = P.en;
  const box = $(".pricing-main").length ? $("section.pb-4.pt-12 .container").first() : null;
  const boxE = $e("section.pb-4.pt-12 .container").first();
  const grids = box.children("div.grid").toArray();
  const gridsE = boxE.children("div.grid").toArray();
  const tiles = (g, $$) => $$(g).find("a").toArray().map((a) => ({ href: $$(a).attr("href").slice(1), name: text($$(a).text()) }));
  // first grid: consultations
  const g0 = tiles(grids[0], $), g0e = tiles(gridsE[0], $e);
  groups.push({ name: { pl: g0[0].name, en: g0e[0].name }, sections: [g0[0].href] });
  // grids[1] = top-level shortcut tiles; then h2 + grid pairs
  box.children("h2").each((k, h) => {
    const g = $(h).next("div.grid");
    const hE = boxE.children("h2").eq(k);
    groups.push({
      name: { pl: text($(h).text()), en: text($e(hE).text()) },
      sections: tiles(g, $).map((t) => t.href),
    });
  });
}
// curated price-list links (see migration-curation.js)
for (const rule of curation.pricing) {
  const sec = sections.find((s) => s.id === rule.section);
  if (!sec) throw new Error(`pricing rule: no section ${rule.section}`);
  let heading = "", hits = 0;
  for (const row of sec.items) {
    if (row.heading) { heading = row.heading.pl; continue; }
    if (curation.MASK.test(row.name.pl)) continue;
    if (rule.heading && !rule.heading.test(heading)) continue;
    if (rule.name && !rule.name.test(row.name.pl)) continue;
    if (rule.onlyUnlinked && row.treatment) continue;
    hits++;
    if (rule.unlink) delete row.treatment;
    if (rule.treatment) row.treatment = rule.treatment;
    if (rule.primary) row.primary = true;
  }
  if (!hits) throw new Error(`pricing rule matched nothing: ${JSON.stringify(rule, (k, v) => (v instanceof RegExp ? String(v) : v))}`);
}
for (const row of sections.flatMap((s) => s.items))
  for (const t of [].concat(row.treatment || [])) if (!treatments[t]) throw new Error(`pricing: unknown treatment ${t}`);
const known = new Set(sections.map((s) => s.id));
for (const g of groups)
  g.sections = g.sections.map((s) => {
    if (known.has(s)) return s;
    const fix = [...known].find((k) => k.replace(/-/g, "") === s.replace(/-/g, "").replace("brodawkek", "brodawek"));
    report.push(`- cennik: kafelek \`#${s}\` nie pasował do sekcji → ${fix ? `\`${fix}\`` : "USUNIĘTO"}`);
    return fix;
  }).filter(Boolean);
const orphan = [...known].filter((s) => !groups.some((g) => g.sections.includes(s)));
if (orphan.length) report.push(`- cennik: sekcje bez grupy: ${orphan.join(", ")}`);

// ---------------------------------------------------------------- team
const team = [];
{
  const $ = load("zespol.html"), $e = load("en/team.html");
  $("section.py-16[id]").each((i, s) => {
    const sid = $(s).attr("id");
    const sE = $e(`section.py-16[id="${sid}"]`);
    const one = ($$, sec) => {
      const col = $$(sec).find("h2").first().parent();
      const role = col.find("p.italic").first();
      const bio = col.children("p").not(role).toArray().map((p) => `<p>${$$(p).html().trim()}</p>`).join("\n");
      return { name: text(col.find("h2").first().text()), role: text(role.text() || ""), bio };
    };
    const pl = one($, s);
    const en = sE.length ? one($e, sE) : { role: "", bio: "" };
    team.push({
      id: sid,
      name: pl.name,
      photo: $(s).find("img").first().attr("src").replace(/^\.?\/?assets\//, ""),
      specialty: curation.teamSpecialty[sid],
      role: { pl: pl.role, en: en.role },
      bio: { pl: pl.bio, en: en.bio },
    });
  });
}

// ---------------------------------------------------------------- reviews
const reviews = { pl: [], en: [] };
for (const [lang, file] of [["pl", "liposukcja.html"], ["en", "en/liposuction.html"]]) {
  const $ = load(file);
  reviews[lang + "_heading"] = text($("#opinie h2").first().text());
  $("#opinie .rounded-lg").each((_, c) => reviews[lang].push({ name: text($(c).find("h3").text()), text: text($(c).find("p").text()) }));
}
if (reviews.pl.some((r) => /^x+$/i.test(r.name))) report.push(`- opinie: jedna karta podpisana „Xxx” — do poprawy w \`src/_data/reviews.yaml\``);

// ---------------------------------------------------------------- consultation form markup
const FORM_CLASS_MAP = [
  [/^procedure-option\b/, "procedure-option"],
  [/^mt-2 hidden space-y-3$/, "cform-uploads hidden"],
  [/^mb-6 border-l-4 border-blue-400/, "cform-note"],
  [/^flex cursor-pointer items-center space-x-4$/, "cform-opt"],
  [/^flex cursor-pointer items-center space-x-3 rounded-lg/, "cform-doc"],
  [/^h-12 w-12 rounded-lg object-cover$/, "cform-thumb"],
  [/^h-12 w-12 rounded-full object-cover$/, "cform-avatar"],
  [/^grid grid-cols-1 gap-4/, "cform-grid"],
  [/^mt-1 text-sm text-gray-600$/, "cform-hint"],
  [/^mb-3 text-sm text-gray-600$/, "cform-hint"],
  [/^mb-3 text-sm font-medium text-gray-700$/, "cform-q"],
  [/^text-sm font-medium text-gray-700$/, "cform-q"],
  [/^mb-1 block text-xs font-medium text-gray-700$/, "cform-label"],
  [/^space-x-6$/, "cform-radios"],
  [/^flex items-start space-x-3$/, "cform-check"],
  [/^text-lg font-semibold text-gray-900$/, "cform-h"],
  [/^space-y-[2-6]$/, "cform-stack"],
  [/^block font-medium text-gray-900$/, "cform-opt-name"],
  [/^w-full rounded-md bg-accent/, "btn cform-submit"],
];
for (const [lang, file] of [["pl", "konsultacja-online.html"], ["en", "en/online-consultation.html"]]) {
  const $ = load(file);
  const form = $("#consultation-form");
  form.find("svg").closest(".flex-shrink-0").remove();
  form.find("*").each((_, el) => {
    const cls = $(el).attr("class");
    if (!cls) return;
    const hit = FORM_CLASS_MAP.find(([re]) => re.test(cls));
    if (hit) $(el).attr("class", hit[1]);
    else $(el).removeAttr("class");
  });
  form.attr("class", "cform").attr("action", "{{ root }}process-form.php");
  form.find("a[href^='assets/'], a[href^='../assets/']").each((_, a) => {
    $(a).attr("href", "{{ root }}" + $(a).attr("href").replace(/^(\.\.\/)?/, ""));
  });
  write(
    `src/_includes/forms/consultation-${lang}.html`,
    `{#- Consultation form markup (migrated from the old ${file}). Logic: assets/js/consultation-form.js -#}\n` + $.html(form) + "\n"
  );
  report.push(`- formularz \`${lang}\`: action → \`{{ root }}process-form.php\``);
}

// ---------------------------------------------------------------- write data
// keep the order of the old offer page (zabiegi.html); pages not listed there go last
const order = Object.keys(cards.pl);
const sorted = Object.fromEntries(
  Object.entries(treatments).sort(([a], [b]) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999))
);
for (const k of Object.keys(treatments)) delete treatments[k];
Object.assign(treatments, sorted);
write("src/_data/treatments.yaml", "# SSoT zabiegów. Klucz = id (slug PL). Ceny NIE tutaj — patrz pricing.yaml (treatment: id).\n" + dumpYaml(treatments));
write("src/_data/pricing.yaml", "# SSoT cennika. Wiersz z `treatment: <id>` zasila sidebar „Koszt” (minimum `from`).\n" + dumpYaml({ groups, sections }));
write("src/_data/team.yaml", dumpYaml(team));
write("src/_data/reviews.yaml", dumpYaml(reviews));

// ---------------------------------------------------------------- report
const priceRows = (tid) => {
  const all = sections.flatMap((s) => s.items).filter((r) => [].concat(r.treatment || []).includes(tid) && r.from);
  const prim = all.filter((r) => r.primary);
  return prim.length ? prim : all;
};
const priceOf = (tid) => {
  const rows = priceRows(treatments[tid].twin || tid);
  return rows.length ? Math.min(...rows.map((r) => r.from)) : "";
};
const priced = new Set(Object.keys(treatments).filter((t) => priceOf(t) !== ""));
const lines = ["# Raport migracji", "", "## Uwagi", ...report, "", "## Dane do sidebara (wyciągnięte z treści)", ""];
lines.push("Wartości opublikowane (z `scripts/migration-curation.js`, skrócone z treści strony). Puste = strona nie podaje.", "");
lines.push("| zabieg | od (cennik) | czas | znieczulenie | rekonwalescencja | efekt | pobyt | zabiegi | dla kogo |", "|---|---|---|---|---|---|---|---|---|");
for (const [tid, t] of Object.entries(treatments)) {
  const min = priceOf(tid);
  const s = t.summary;
  const c = (k) => s[k]?.pl || "";
  lines.push(`| ${tid} | ${min} | ${c("duration")} | ${c("anesthesia")} | ${c("recovery")} | ${c("result")} | ${c("stay")} | ${c("sessions")} | ${c("forWhom")} |`);
}
lines.push("", "## Zabiegi bez ceny w cenniku", "", ...Object.keys(treatments).filter((t) => !priced.has(t)).map((t) => `- ${t}`));
write("scripts/migration-report.md", lines.join("\n") + "\n");
console.log(`treatments: ${Object.keys(treatments).length}, pricing sections: ${sections.length}, team: ${team.length}`);
console.log(`report: scripts/migration-report.md (${report.length} notes)`);
