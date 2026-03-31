/**
 * Fix all broken links in dist/en/ pages:
 * 1. Garbled PL hreflang/back-links (e.g. lifting-facey.html → lifting-twarzy.html)
 * 2. Wrong en/ prefix on EN→EN internal links
 * 3. zabiegi.html → services.html
 * 4. nosee- typo → nose-
 * 5. blog.html → remove or point to PL
 */

const fs = require('fs');
const path = require('path');

const EN_DIR = path.join(__dirname, '..', 'dist', 'en');

// PL filename → EN filename mapping (from build-en.js)
const FILE_MAP = {
  'index.html': 'index.html',
  'zabiegi.html': 'services.html',
  'cennik.html': 'pricing.html',
  'zespol.html': 'team.html',
  'konsultacja-online.html': 'online-consultation.html',
  'lifting-twarzy.html': 'face-lifting.html',
  'face-lift-nicmi.html': 'thread-face-lift.html',
  'face-lift-nicmi-2.html': 'thread-face-lift-2.html',
  'face-lift-calkowity-czesciowy-3.html': 'full-partial-face-lift-3.html',
  'face-lift-calkowity-czesciowy-4.html': 'full-partial-face-lift-4.html',
  'korekcja-nosa.html': 'rhinoplasty.html',
  'korekcja-nosa-kwasem-hialuronowym.html': 'nose-correction-hyaluronic-acid.html',
  'korekcja-nosa-nicmi-aptos.html': 'nose-correction-aptos-threads.html',
  'korekcja-powiek.html': 'eyelid-surgery.html',
  'plastyka-odstajacych-uszu.html': 'ear-correction.html',
  'wszczepienie-implantu-w-twarz.html': 'facial-implant.html',
  'wolumetria-twarzy-kwasem-hialuronowym.html': 'facial-volumetry-hyaluronic-acid.html',
  'modelowanie-twarzy-naturalnym-wypelniaczem-algeness-na-bazie-agarozy.html': 'facial-modelling-algeness.html',
  'powiekszenie-ust-kwasem-hialuronowym.html': 'lip-augmentation-hyaluronic-acid.html',
  'lipoliza-podbrodek.html': 'chin-lipolysis.html',
  'porazenie-nerwu-twarzowego-nici-aptos.html': 'facial-nerve-palsy-aptos-threads.html',
  'powiekszanie-piersi.html': 'breast-augmentation.html',
  'powiekszanie-piersi-wlasnym-tluszczem.html': 'breast-augmentation-fat-transfer.html',
  'podniesienie-piersi.html': 'breast-lift.html',
  'podniesienie-piersi-nicmi-aptos-podskorny-biustonosz.html': 'breast-lift-aptos-threads.html',
  'redukcja-piersi.html': 'breast-reduction.html',
  'rekonstrukcja-piersi.html': 'breast-reconstruction.html',
  'rekonstrukcja-piersi-ekspanderoproteza.html': 'breast-reconstruction-expander.html',
  'rekonstrukcja-piersi-tkankami-wlasnymi.html': 'breast-reconstruction-own-tissue.html',
  'rekonstrukcja-piersi-wlasnym-tluszczem.html': 'breast-reconstruction-fat-transfer.html',
  'natychmiastowa-rekonstrukcja-piersi-po-amputacji.html': 'immediate-breast-reconstruction.html',
  'plastyka-wciagnietych-brodawek.html': 'inverted-nipple-correction.html',
  'plastyka-brzucha.html': 'tummy-tuck.html',
  'plastyka-ud.html': 'thigh-lift.html',
  'plastyka-ramion.html': 'arm-lift.html',
  'plastyka-lydek-powiekszenie-implantami.html': 'calf-augmentation-implants.html',
  'liposukcja.html': 'liposuction.html',
  'liposukcja-laserowa-slimlipo-3d.html': 'laser-liposuction-slimlipo.html',
  'przeszczep-tluszczu.html': 'fat-transfer.html',
  'dla-mezczyzn-ginekomastia.html': 'gynecomastia.html',
  'zmniejszenie-warg-sromowych.html': 'labiaplasty.html',
  'miejscowe-modelowanie-sylwetki-preparatem-aqualyx.html': 'body-contouring-aqualyx.html',
  'redukcja-zmarszczek.html': 'wrinkle-reduction.html',
  'botox-leczenie-bolow-migrenowych.html': 'botox-migraine-treatment.html',
  'leczenie-bolow-migrenowych-botox.html': 'migraine-treatment-botox.html',
  'argo-plasma-obkurczanie-skory.html': 'argo-plasma-skin-tightening.html',
  'fotoodmladzanie.html': 'photorejuvenation.html',
  'fotoodmladzanie-laserowe-laser-ipl.html': 'laser-photorejuvenation-ipl.html',
  'resurfacing.html': 'resurfacing.html',
  'redermalizacja.html': 'redermalization.html',
  'redermalizacja-nowy-zabieg-anti-aging.html': 'redermalization-anti-aging.html',
  'mezoterapia-iglowa.html': 'needle-mesotherapy.html',
  'mezoterapia-microiglowa-micropen.html': 'microneedle-mesotherapy-micropen.html',
  'mezoterapia-mikroiglowa-micropen.html': 'microneedling-mesotherapy-micropen.html',
  'mezoterapia-osoczem-bogatoplytkowym-prp.html': 'prp-mesotherapy.html',
  'mezoterapia-komorkami-macierzystymi.html': 'stem-cell-mesotherapy.html',
  'endermolift-2-zabieg-odmladzajacy.html': 'endermolift-rejuvenation.html',
  'endermolift-2-zabiegi-przeciwzmarszczkowe.html': 'endermolift-anti-wrinkle.html',
  'endermologia-lpg-lipomassage.html': 'endermologie-lpg-lipomassage.html',
  'vectus-bezpieczna-depilacja-laserowa-np-nogi-pachy-plecy.html': 'vectus-laser-hair-removal-body.html',
  'vectus-depilacja-laserowa-twarzy.html': 'vectus-laser-hair-removal-face.html',
  'pajaczki-teleangiektazje.html': 'spider-veins-telangiectasia.html',
  'korekcja-blizn-chirurgiczna.html': 'surgical-scar-correction.html',
  'wyciecie-znamienia.html': 'mole-removal.html',
  'wyciecie-znamienia-z-plastyka-miejscowa.html': 'mole-removal-local-flap.html',
  'wyciecie-zmiany-nowotworowej.html': 'tumor-excision.html',
  'komorki-macierzyste-lipogems-odmladzanie-grzbietow-rak.html': 'stem-cells-lipogems-hand-rejuvenation.html',
  'komorki-macierzyste-lipogems-odmladzanie-i-rewitalizacja-skory.html': 'stem-cells-lipogems-skin-rejuvenation.html',
  'lipo-gems-innowacyjna-metoda-modelowania-tluszczem-bogatym-w-komorki-macierzyste.html': 'lipogems-fat-modelling-stem-cells.html',
  'rewitalizacja-skory-komorkami-macierzystymi.html': 'skin-revitalization-stem-cells.html',
  'podanie-osocza-bogatoplytkowego2.html': 'prp-treatment.html',
  'regeneracja-stawow-komorkami-macierzystymi.html': 'joint-regeneration-stem-cells.html',
  'chirurgia-przepukliny-brzuszne.html': 'abdominal-hernia-surgery.html',
  'chirurgia-reki.html': 'hand-surgery.html',
  'flebologia.html': 'phlebology.html',
  'flebologia-laseroterapia.html': 'phlebology-laser-therapy.html',
};

// EN filename → PL filename (reverse)
const REVERSE_MAP = {};
for (const [pl, en] of Object.entries(FILE_MAP)) {
  REVERSE_MAP[en] = pl;
}

// All valid EN filenames
const EN_FILES = new Set(Object.values(FILE_MAP));

const files = fs.readdirSync(EN_DIR).filter(f => f.endsWith('.html'));
let totalFixes = 0;

files.forEach(file => {
  let content = fs.readFileSync(path.join(EN_DIR, file), 'utf8');
  let original = content;

  // ---------------------------------------------------------------
  // 1. Fix hreflang PL URL pointing to garbled/wrong PL filenames
  //    Pattern: href="https://krokirazem.pl/WRONG.html"
  //    Should be: href="https://krokirazem.pl/CORRECT_PL.html"
  // ---------------------------------------------------------------
  const plFile = REVERSE_MAP[file];
  if (plFile) {
    // Fix hreflang pl tag
    content = content.replace(
      /(<link rel="alternate" hreflang="pl" href="https:\/\/krokirazem\.pl\/)([^"]+)(")/g,
      (match, pre, wrongPath, post) => {
        if (wrongPath !== plFile) {
          console.log(`  [hreflang-pl] ${file}: ${wrongPath} → ${plFile}`);
          return pre + plFile + post;
        }
        return match;
      }
    );

    // Fix hreflang en tag (should point to en/ENFILE)
    content = content.replace(
      /(<link rel="alternate" hreflang="en" href="https:\/\/krokirazem\.pl\/en\/)([^"]+)(")/g,
      (match, pre, wrongPath, post) => {
        if (wrongPath !== file) {
          console.log(`  [hreflang-en] ${file}: ${wrongPath} → ${file}`);
          return pre + file + post;
        }
        return match;
      }
    );

    // Fix "../WRONG.html" back-link to PL version (language switcher and canonical)
    // These should point to the correct PL filename
    content = content.replace(
      /href="\.\.\/([^"#]+\.html)([^"]*)"/g,
      (match, wrongPlFile, anchor) => {
        // Skip assets and external-looking refs
        if (wrongPlFile.startsWith('assets/')) return match;

        // If it's already the correct PL file, leave it
        if (wrongPlFile === plFile) return match;

        // Check if the wrongPlFile is some garbled variant that maps to this EN file
        // We check by looking at all PL files - if wrongPlFile doesn't exist in FILE_MAP
        // but the current EN file's plFile does, fix it
        if (!FILE_MAP[wrongPlFile] && plFile) {
          console.log(`  [back-link] ${file}: ../${wrongPlFile} → ../${plFile}`);
          return `href="../${plFile}${anchor}"`;
        }
        return match;
      }
    );
  }

  // ---------------------------------------------------------------
  // 2. Fix "en/filename.html" → "filename.html" (wrong extra en/ prefix)
  // ---------------------------------------------------------------
  content = content.replace(/href="en\/([^"]+\.html[^"]*)"/g, (match, enPath) => {
    console.log(`  [en-prefix] ${file}: en/${enPath} → ${enPath}`);
    return `href="${enPath}"`;
  });

  // ---------------------------------------------------------------
  // 3. Fix zabiegi.html → services.html (only relative EN-internal links,
  //    NOT back-links like ../zabiegi.html and NOT hreflang pl URLs)
  // ---------------------------------------------------------------
  if (content.includes('href="zabiegi.html')) {
    console.log(`  [zabiegi] ${file}: href="zabiegi.html → href="services.html`);
    content = content.replace(/href="zabiegi\.html/g, 'href="services.html');
  }

  // ---------------------------------------------------------------
  // 4. Fix "nosee-correction" typo → "nose-correction"
  // ---------------------------------------------------------------
  if (content.includes('nosee-correction')) {
    console.log(`  [nosee-typo] ${file}: nosee-correction → nose-correction`);
    content = content.replace(/nosee-correction/g, 'nose-correction');
  }

  // ---------------------------------------------------------------
  // 5. Fix blog.html → remove link or point to PL (no EN blog yet)
  //    Replace href="blog.html" with href="../blog.html"
  //    (pointing to PL blog if it exists, otherwise just "#")
  // ---------------------------------------------------------------
  if (content.includes('href="blog.html"')) {
    const plBlogExists = fs.existsSync(path.join(__dirname, '..', 'dist', 'blog.html'));
    if (plBlogExists) {
      console.log(`  [blog] ${file}: blog.html → ../blog.html`);
      content = content.replace(/href="blog\.html"/g, 'href="../blog.html"');
    } else {
      console.log(`  [blog] ${file}: blog.html → # (no blog page)`);
      content = content.replace(/href="blog\.html"/g, 'href="#"');
    }
  }

  // ---------------------------------------------------------------
  // Save if changed
  // ---------------------------------------------------------------
  if (content !== original) {
    fs.writeFileSync(path.join(EN_DIR, file), content, 'utf8');
    totalFixes++;
  }
});

console.log(`\nDone. Fixed ${totalFixes} files.`);

// ---------------------------------------------------------------
// Post-fix verification
// ---------------------------------------------------------------
console.log('\n--- Verifying remaining broken links ---');
let remaining = 0;
const allEnFiles = new Set(fs.readdirSync(EN_DIR).filter(f => f.endsWith('.html')));

files.forEach(file => {
  const content = fs.readFileSync(path.join(EN_DIR, file), 'utf8');
  const hrefs = [...content.matchAll(/href="([^\"#]+)(#[^\"]*)?/g)];
  hrefs.forEach(match => {
    const href = match[1];
    if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('../assets')) return;
    if (!href || href === '#') return;

    if (href.startsWith('../')) {
      const localPath = href.slice(3);
      const plFullPath = path.join(__dirname, '..', 'dist', localPath);
      if (!fs.existsSync(plFullPath)) {
        console.log(`  STILL BROKEN: ${file} → ${href}`);
        remaining++;
      }
    } else {
      if (!allEnFiles.has(href.split('?')[0])) {
        console.log(`  STILL BROKEN: ${file} → ${href}`);
        remaining++;
      }
    }
  });
});

console.log(`\nRemaining broken: ${remaining}`);
