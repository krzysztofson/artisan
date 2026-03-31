const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const EN_DIR = path.join(DIST, 'en');

// Full file mapping: polish filename -> english filename
const FILE_MAP = {
  'index.html': 'index.html',
  'zabiegi.html': 'services.html',
  'cennik.html': 'pricing.html',
  'zespol.html': 'team.html',
  'konsultacja-online.html': 'online-consultation.html',
  // Twarz
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
  // Piersi
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
  // Cialo
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
  // Skora / Medycyna estetyczna
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
  // Komorki macierzyste / PRP
  'komorki-macierzyste-lipogems-odmladzanie-grzbietow-rak.html': 'stem-cells-lipogems-hand-rejuvenation.html',
  'komorki-macierzyste-lipogems-odmladzanie-i-rewitalizacja-skory.html': 'stem-cells-lipogems-skin-rejuvenation.html',
  'lipo-gems-innowacyjna-metoda-modelowania-tluszczem-bogatym-w-komorki-macierzyste.html': 'lipogems-fat-modelling-stem-cells.html',
  'rewitalizacja-skory-komorkami-macierzystymi.html': 'skin-revitalization-stem-cells.html',
  'podanie-osocza-bogatoplytkowego2.html': 'prp-treatment.html',
  'regeneracja-stawow-komorkami-macierzystymi.html': 'joint-regeneration-stem-cells.html',
  // Chirurgia / Flebologia
  'chirurgia-przepukliny-brzuszne.html': 'abdominal-hernia-surgery.html',
  'chirurgia-reki.html': 'hand-surgery.html',
  'flebologia.html': 'phlebology.html',
  'flebologia-laseroterapia.html': 'phlebology-laser-therapy.html',
};

// Reverse map for PL pages to find their EN counterpart
const REVERSE_MAP = {};
for (const [pl, en] of Object.entries(FILE_MAP)) {
  REVERSE_MAP[en] = pl;
}

// UK flag SVG (inline)
const UK_FLAG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="24" height="12"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`;

// PL flag SVG (inline)
const PL_FLAG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10" width="24" height="15"><rect width="16" height="5" fill="#fff"/><rect width="16" height="5" y="5" fill="#dc143c"/></svg>`;

// Step 1: Create EN directory
if (!fs.existsSync(EN_DIR)) {
  fs.mkdirSync(EN_DIR, { recursive: true });
  console.log('Created dist/en/');
}

// Step 2: Copy files from PL originals to EN with new names
let copied = 0;
let skipped = 0;

for (const [plFile, enFile] of Object.entries(FILE_MAP)) {
  const srcPath = path.join(DIST, plFile);
  const destPath = path.join(EN_DIR, enFile);

  if (!fs.existsSync(srcPath)) {
    console.warn(`SKIP: ${plFile} not found`);
    skipped++;
    continue;
  }

  let content = fs.readFileSync(srcPath, 'utf-8');

  // 2a. Change lang attribute
  content = content.replace('lang="pl"', 'lang="en"');

  // 2b. Fix asset paths: ./assets/ -> ../assets/ and assets/ -> ../assets/ (but not ../assets/)
  content = content.replace(/href="\.\/assets\//g, 'href="../assets/');
  content = content.replace(/src="\.\/assets\//g, 'src="../assets/');
  content = content.replace(/src="assets\//g, 'src="../assets/');
  content = content.replace(/href="assets\//g, 'href="../assets/');
  // Fix poster attribute too
  content = content.replace(/poster="assets\//g, 'poster="../assets/');

  // 2c. Update internal navigation links to EN equivalents
  for (const [plLink, enLink] of Object.entries(FILE_MAP)) {
    // Replace href="plFile.html" with href="enFile.html" (within en/ folder)
    // Be careful to match exact filenames, not partial matches
    const plLinkEscaped = plLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match href="filename.html" but not href="../filename.html" or href="http..."
    const regex = new RegExp(`href="${plLinkEscaped}"`, 'g');
    content = content.replace(regex, `href="${enLink}"`);
    // Also match with ./ prefix
    const regex2 = new RegExp(`href="\\.\/${plLinkEscaped}"`, 'g');
    content = content.replace(regex2, `href="${enLink}"`);
  }

  // 2d. Update anchor links
  content = content.replace(/href="index\.html#onas"/g, 'href="index.html#about"');
  content = content.replace(/id="onas"/g, 'id="about"');
  content = content.replace(/href="#onas"/g, 'href="#about"');
  content = content.replace(/href="#kontakt"/g, 'href="#contact"');
  content = content.replace(/id="kontakt"/g, 'id="contact"');
  content = content.replace(/href="#twarz"/g, 'href="#face"');
  content = content.replace(/id="twarz"/g, 'id="face"');
  content = content.replace(/href="#cialo"/g, 'href="#body"');
  content = content.replace(/id="cialo"/g, 'id="body"');
  content = content.replace(/href="#piersi"/g, 'href="#breasts"');
  content = content.replace(/id="piersi"/g, 'id="breasts"');
  content = content.replace(/href="#skora"/g, 'href="#skin"');
  content = content.replace(/id="skora"/g, 'id="skin"');

  // 2e. Translate common navigation and footer text
  const textReplacements = [
    // Navigation
    ['>O nas<', '>About<'],
    ['>Oferta<', '>Services<'],
    ['>Cennik<', '>Pricing<'],
    // careful with Zespół - has special char
    ['>Zespół<', '>Team<'],
    ['>Konsultacja online<', '>Online Consultation<'],
    ['>Kontakt<', '>Contact<'],
    ['>Umów wizytę<', '>Book Appointment<'],
    // Top bar
    ['Pon-PT 8:00-20:00', 'Mon-Fri 8:00 AM - 8:00 PM'],
    // Footer
    ['>Na skróty<', '>Quick Links<'],
    ['>O klinice<', '>About Clinic<'],
    ['>Polub nas<', '>Follow Us<'],
    ['>Strefa pacjenta<', '>Patient Zone<'],
    ['>Blog<', '>Blog<'],
    // Buttons
    ['>Dowiedz się więcej<', '>Learn More<'],
    ['>Zobacz pełną ofertę<', '>View Full Offer<'],
    ['>Poznaj nas<', '>Get to Know Us<'],
    // Contact section
    ['Rezerwacje:', 'Reservations:'],
    ['Wszystkie terminy dostępne są w rezerwacji telefonicznej pod nr tel.', 'All appointments are available by phone at'],
    ['Wybrane terminy dostępne są również on-line:', 'Selected appointments are also available online:'],
    ['>Znany Lekarz<', '>Docplanner<'],
    ['Widget umówienia wizyty lekarskiej', 'Appointment Booking Widget'],
  ];

  for (const [from, to] of textReplacements) {
    content = content.split(from).join(to);
  }

  // 2f. Add language switcher (PL flag) to EN pages - before the hamburger button
  const plFileName = plFile === 'index.html' ? '../index.html' : `../${plFile}`;
  const langSwitcher = `<a href="${plFileName}" class="flex items-center px-2" title="Wersja polska">${PL_FLAG_SVG}</a>`;

  // Insert before the hamburger button (js-nav-btn)
  content = content.replace(
    '<button class="js-nav-btn',
    `${langSwitcher}\n            <button class="js-nav-btn`
  );

  fs.writeFileSync(destPath, content, 'utf-8');
  copied++;
}

console.log(`Copied ${copied} files to dist/en/`);
if (skipped > 0) console.log(`Skipped ${skipped} files (not found)`);

// Step 3: Add language switcher (UK flag) to PL pages + hreflang
let updated = 0;
for (const [plFile, enFile] of Object.entries(FILE_MAP)) {
  const filePath = path.join(DIST, plFile);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already has language switcher
  if (content.includes('English version')) {
    console.log(`SKIP PL update: ${plFile} (already has switcher)`);
    continue;
  }

  // Add UK flag before hamburger button
  const langSwitcher = `<a href="en/${enFile}" class="flex items-center px-2" title="English version">${UK_FLAG_SVG}</a>`;
  content = content.replace(
    '<button class="js-nav-btn',
    `${langSwitcher}\n            <button class="js-nav-btn`
  );

  // Add hreflang tags in <head> before </head>
  const hreflangTags = `    <link rel="alternate" hreflang="pl" href="https://krokirazem.pl/${plFile}" />\n    <link rel="alternate" hreflang="en" href="https://krokirazem.pl/en/${enFile}" />\n`;
  content = content.replace('</head>', `${hreflangTags}  </head>`);

  fs.writeFileSync(filePath, content, 'utf-8');
  updated++;
}

console.log(`Updated ${updated} PL files with language switcher and hreflang`);

// Step 4: Also add hreflang to EN pages
for (const [plFile, enFile] of Object.entries(FILE_MAP)) {
  const filePath = path.join(EN_DIR, enFile);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Add hreflang tags in <head> before </head>
  if (!content.includes('hreflang')) {
    const hreflangTags = `    <link rel="alternate" hreflang="pl" href="https://krokirazem.pl/${plFile}" />\n    <link rel="alternate" hreflang="en" href="https://krokirazem.pl/en/${enFile}" />\n`;
    content = content.replace('</head>', `${hreflangTags}  </head>`);
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

console.log('Added hreflang tags to EN pages');

// Step 5: Clean up copy files
let removed = 0;
const copyFiles = fs.readdirSync(DIST).filter(f => f.includes(' copy.html'));
for (const copyFile of copyFiles) {
  fs.unlinkSync(path.join(DIST, copyFile));
  removed++;
}
console.log(`Removed ${removed} copy files from dist/`);

// Also clean up copy PHP files
const copyPhpFiles = fs.readdirSync(DIST).filter(f => f.includes(' copy.php'));
for (const copyFile of copyPhpFiles) {
  fs.unlinkSync(path.join(DIST, copyFile));
  removed++;
}

console.log('Done! Next step: translate content in each EN file.');
