/**
 * Regenerates the garbled EN files from PL originals.
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const EN_DIR = path.join(DIST, 'en');

// FILE_MAP: EN filename -> PL filename
const GARBLED = {
  'breast-augmentation.html': 'powiekszanie-piersi.html',
  'breast-augmentation-fat-transfer.html': 'powiekszanie-piersi-wlasnym-tluszczem.html',
  'breast-lift-aptos-threads.html': 'podniesienie-piersi-nicmi-aptos-podskorny-biustonosz.html',
  'breast-lift.html': 'podniesienie-piersi.html',
  'breast-reduction.html': 'redukcja-piersi.html',
  'immediate-breast-reconstruction.html': 'natychmiastowa-rekonstrukcja-piersi-po-amputacji.html',
  'microneedle-mesotherapy-micropen.html': 'mezoterapia-microiglowa-micropen.html',
  'microneedling-mesotherapy-micropen.html': 'mezoterapia-mikroiglowa-micropen.html',
  'needle-mesotherapy.html': 'mezoterapia-iglowa.html',
};

// Full file map for link updates
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

const PL_FLAG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10" width="24" height="15"><rect width="16" height="5" fill="#fff"/><rect width="16" height="5" y="5" fill="#dc143c"/></svg>`;

for (const [enFile, plFile] of Object.entries(GARBLED)) {
  const srcPath = path.join(DIST, plFile);
  const destPath = path.join(EN_DIR, enFile);

  if (!fs.existsSync(srcPath)) {
    console.warn(`SKIP: ${plFile} not found`);
    continue;
  }

  let content = fs.readFileSync(srcPath, 'utf-8');

  // Apply the same mechanical transforms as build-en.js
  content = content.replace('lang="pl"', 'lang="en"');
  content = content.replace(/href="\.\/assets\//g, 'href="../assets/');
  content = content.replace(/src="\.\/assets\//g, 'src="../assets/');
  content = content.replace(/src="assets\//g, 'src="../assets/');
  content = content.replace(/href="assets\//g, 'href="../assets/');
  content = content.replace(/poster="assets\//g, 'poster="../assets/');

  for (const [plLink, enLink] of Object.entries(FILE_MAP)) {
    const plLinkEscaped = plLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    content = content.replace(new RegExp(`href="${plLinkEscaped}"`, 'g'), `href="${enLink}"`);
    content = content.replace(new RegExp(`href="\\.\/${plLinkEscaped}"`, 'g'), `href="${enLink}"`);
  }

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

  const textReplacements = [
    ['>O nas<', '>About<'],
    ['>Oferta<', '>Services<'],
    ['>Cennik<', '>Pricing<'],
    ['>Zespół<', '>Team<'],
    ['>Konsultacja online<', '>Online Consultation<'],
    ['>Kontakt<', '>Contact<'],
    ['>Umów wizytę<', '>Book Appointment<'],
    ['Pon-PT 8:00-20:00', 'Mon-Fri 8:00 AM - 8:00 PM'],
    ['>Na skróty<', '>Quick Links<'],
    ['>O klinice<', '>About Clinic<'],
    ['>Polub nas<', '>Follow Us<'],
    ['>Strefa pacjenta<', '>Patient Zone<'],
    ['>Blog<', '>Blog<'],
    ['>Dowiedz się więcej<', '>Learn More<'],
    ['>Zobacz pełną ofertę<', '>View Full Offer<'],
    ['>Poznaj nas<', '>Get to Know Us<'],
    ['Rezerwacje:', 'Reservations:'],
    ['Wszystkie terminy dostępne są w rezerwacji telefonicznej pod nr tel.', 'All appointments are available by phone at'],
    ['Wybrane terminy dostępne są również on-line:', 'Selected appointments are also available online:'],
    ['>Znany Lekarz<', '>Docplanner<'],
    ['Widget umówienia wizyty lekarskiej', 'Appointment Booking Widget'],
  ];

  for (const [from, to] of textReplacements) {
    content = content.split(from).join(to);
  }

  // Add PL flag switcher
  const langSwitcher = `<a href="../${plFile}" class="flex items-center pr-2 pl-4" title="Wersja polska">${PL_FLAG_SVG}</a>`;
  content = content.replace(
    '<button class="js-nav-btn',
    `${langSwitcher}\n            <button class="js-nav-btn`
  );

  // Add hreflang
  const hreflangTags = `    <link rel="alternate" hreflang="pl" href="https://krokirazem.pl/${plFile}" />\n    <link rel="alternate" hreflang="en" href="https://krokirazem.pl/en/${enFile}" />\n`;
  content = content.replace('</head>', `${hreflangTags}  </head>`);

  fs.writeFileSync(destPath, content, 'utf-8');
  console.log(`Regenerated: ${enFile}`);
}

console.log('Done. Now run translate-content.js (safe version) on these files.');
