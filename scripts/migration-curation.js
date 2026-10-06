// Hand-curated data merged into treatments.yaml by migrate-to-11ty.js.
// Summary values are shortened from what each treatment page itself says (see migration-report.md);
// nothing here is invented beyond the page content.

const v = (pl, en) => ({ pl, en });
const LOCAL = v("Miejscowe", "Local");
const GENERAL = v("Ogólne", "General");
const LOCAL_IV = v("Miejscowe lub dożylne", "Local or intravenous");
const NONE = v("Nie jest wymagane", "Not required");
const H1 = v("ok. 1 godz.", "approx. 1 hour");
const M40 = v("40–60 min", "40–60 min");
const HEAL = v("Do zagojenia rany", "Until the wound heals");
const R46M = v("po 4–6 miesiącach", "after 4–6 months");
const R3M = v("po ok. 3 miesiącach", "after approx. 3 months");
const FEW_M = v("po kilku miesiącach", "after a few months");

const summary = {
  "argo-plasma-obkurczanie-skory": { anesthesia: LOCAL_IV, duration: M40 },
  "botox-leczenie-bolow-migrenowych": { duration: v("ok. 30 min", "approx. 30 min") },
  "leczenie-bolow-migrenowych-botox": { duration: v("ok. 30 min", "approx. 30 min") },
  "chirurgia-przepukliny-brzuszne": { anesthesia: v("Ogólne lub dolędźwiowe", "General or spinal"), stay: v("1 doba", "1 day") },
  "dla-mezczyzn-ginekomastia": { anesthesia: GENERAL, duration: v("60–90 min", "60–90 min"), stay: v("1 doba", "1 day"), result: v("po ok. miesiącu", "after approx. 1 month"), forWhom: v("Mężczyźni", "Men") },
  "endermologia-lpg-lipomassage": { anesthesia: NONE, duration: v("ok. 35 min", "approx. 35 min"), recovery: v("Natychmiastowa", "Immediate"), sessions: v("Seria ok. 15 (efekty po 3)", "Series of approx. 15 (effects after 3)") },
  "face-lift-calkowity-czesciowy-3": { anesthesia: LOCAL, duration: M40 },
  "face-lift-calkowity-czesciowy-4": { anesthesia: v("Brak lub maść znieczulająca", "None or anaesthetic cream"), duration: v("20–40 min", "20–40 min"), result: v("po 2–7 dniach, utrzymuje się 4–6 mies.", "after 2–7 days, lasts 4–6 months") },
  "face-lift-nicmi": { anesthesia: LOCAL_IV, duration: M40, recovery: v("Obrzęk do kilku dni", "Swelling for a few days") },
  "face-lift-nicmi-2": { anesthesia: LOCAL_IV, duration: M40, recovery: v("Obrzęk do kilku dni", "Swelling for a few days") },
  "fotoodmladzanie": { duration: v("do 20 min (twarz)", "up to 20 min (face)"), sessions: v("1–3 zabiegi", "1–3 sessions") },
  "fotoodmladzanie-laserowe-laser-ipl": { duration: v("do 20 min (twarz)", "up to 20 min (face)"), sessions: v("1–3 zabiegi", "1–3 sessions") },
  "korekcja-blizn-chirurgiczna": { anesthesia: LOCAL, duration: H1, recovery: HEAL },
  "korekcja-nosa-nicmi-aptos": { anesthesia: LOCAL, duration: H1, recovery: v("Obrzęk do 3–4 tygodni", "Swelling up to 3–4 weeks"), result: v("po ok. miesiącu", "after approx. 1 month") },
  "korekcja-nosa": { anesthesia: v("Miejscowe lub ogólne", "Local or general"), duration: v("1–1,5 godz.", "1–1.5 hours"), result: R46M },
  "korekcja-powiek": { anesthesia: LOCAL, duration: v("ok. 1,5 godz.", "approx. 1.5 hours"), result: v("po kilku tygodniach", "after a few weeks") },
  "lifting-twarzy": { anesthesia: v("Dożylne + miejscowe", "Intravenous + local"), duration: v("2,5–4 godz.", "2.5–4 hours"), result: v("po 3–5 miesiącach", "after 3–5 months") },
  "liposukcja-laserowa-slimlipo-3d": { anesthesia: LOCAL_IV, duration: v("do 1 godz.", "up to 1 hour"), recovery: v("Od razu lub 1–3 dni", "Immediate or 1–3 days"), result: FEW_M },
  "liposukcja": { anesthesia: LOCAL_IV, duration: v("1–2 godz.", "1–2 hours"), recovery: v("Od razu lub 1–3 dni", "Immediate or 1–3 days"), result: FEW_M },
  "mezoterapia-iglowa": { anesthesia: v("Krem znieczulający", "Anaesthetic cream"), sessions: v("Seria kilku, co 2–3 tygodnie", "Series of several, every 2–3 weeks") },
  "mezoterapia-komorkami-macierzystymi": { anesthesia: LOCAL, duration: v("60–90 min", "60–90 min"), recovery: v("Kilka dni", "A few days") },
  "mezoterapia-osoczem-bogatoplytkowym-prp": { duration: v("20–60 min", "20–60 min") },
  "podanie-osocza-bogatoplytkowego2": { duration: v("20–60 min", "20–60 min") },
  "miejscowe-modelowanie-sylwetki-preparatem-aqualyx": { anesthesia: NONE, recovery: v("Natychmiastowa", "Immediate") },
  "natychmiastowa-rekonstrukcja-piersi-po-amputacji": { anesthesia: GENERAL, duration: v("3–5 godz.", "3–5 hours"), stay: v("1 doba", "1 day"), recovery: v("3–4 tygodnie", "3–4 weeks") },
  "plastyka-brzucha": { anesthesia: GENERAL, duration: v("2–3 godz.", "2–3 hours"), result: R46M },
  "plastyka-lydek-powiekszenie-implantami": { anesthesia: LOCAL_IV, duration: H1, recovery: v("7–10 dni", "7–10 days") },
  "plastyka-odstajacych-uszu": { anesthesia: LOCAL, duration: v("1–1,5 godz.", "1–1.5 hours"), result: v("po 6 tygodniach", "after 6 weeks") },
  "plastyka-ramion": { anesthesia: GENERAL, duration: v("2–3 godz.", "2–3 hours"), result: R46M },
  "plastyka-ud": { anesthesia: GENERAL, duration: v("ok. 3 godz.", "approx. 3 hours"), result: R46M },
  "plastyka-wciagnietych-brodawek": { anesthesia: LOCAL, duration: H1 },
  "podniesienie-piersi-nicmi-aptos-podskorny-biustonosz": { anesthesia: v("Miejscowe lub ogólne", "Local or general"), duration: v("ok. 3 godz.", "approx. 3 hours"), result: v("po 3 miesiącach", "after 3 months") },
  "podniesienie-piersi": { anesthesia: v("Ogólne lub miejscowe", "General or local"), duration: v("ok. 3 godz.", "approx. 3 hours"), result: FEW_M },
  "powiekszanie-piersi-wlasnym-tluszczem": { anesthesia: v("Miejscowe, dożylne lub ogólne", "Local, intravenous or general"), duration: v("2–3 godz.", "2–3 hours"), result: FEW_M },
  "powiekszanie-piersi": { anesthesia: GENERAL, duration: v("1,5–2 godz.", "1.5–2 hours"), result: R3M },
  "przeszczep-tluszczu": { anesthesia: LOCAL_IV, duration: v("2–3 godz.", "2–3 hours"), result: v("po 3 miesiącach", "after 3 months") },
  "redukcja-piersi": { anesthesia: GENERAL, duration: v("ok. 3 godz.", "approx. 3 hours"), result: R3M },
  "rekonstrukcja-piersi-ekspanderoproteza": { anesthesia: GENERAL, duration: v("1,5–4 godz.", "1.5–4 hours"), stay: v("2–5 dni", "2–5 days"), recovery: v("3–8 tygodni", "3–8 weeks") },
  "rekonstrukcja-piersi-wlasnym-tluszczem": { anesthesia: v("Dożylne lub miejscowe", "Intravenous or local"), duration: v("1,5–3 godz.", "1.5–3 hours"), stay: v("Kilka godzin", "A few hours"), result: v("po 4–6 tygodniach", "after 4–6 weeks") },
  "rekonstrukcja-piersi": { anesthesia: v("Ogólne lub dożylne", "General or intravenous"), duration: v("1,5–4 godz.", "1.5–4 hours"), recovery: v("3–8 tygodni", "3–8 weeks") },
  "resurfacing": { anesthesia: v("Krem znieczulający", "Anaesthetic cream"), result: v("po kilku tygodniach", "after a few weeks") },
  "vectus-bezpieczna-depilacja-laserowa-np-nogi-pachy-plecy": { anesthesia: v("Nie jest wymagane (chłodzenie)", "Not required (contact cooling)"), duration: v("Od kilku minut, zależnie od okolicy", "From a few minutes, depending on area"), sessions: v("Seria kilku zabiegów", "A series of several") },
  "vectus-depilacja-laserowa-twarzy": { anesthesia: v("Nie jest wymagane (chłodzenie)", "Not required (contact cooling)"), duration: v("Od kilku minut, zależnie od okolicy", "From a few minutes, depending on area") },
  "wszczepienie-implantu-w-twarz": { anesthesia: v("Ogólne lub miejscowe", "General or local"), duration: v("1,5–2 godz.", "1.5–2 hours"), recovery: v("Obrzęk ok. 2 tygodni", "Swelling approx. 2 weeks"), result: v("po 4–6 tygodniach", "after 4–6 weeks") },
  "wyciecie-zmiany-nowotworowej": { anesthesia: LOCAL, duration: M40, recovery: v("Zdjęcie szwów po 7–14 dniach", "Stitches removed after 7–14 days") },
  "wyciecie-znamienia-z-plastyka-miejscowa": { anesthesia: LOCAL, duration: H1, recovery: HEAL },
  "wyciecie-znamienia": { anesthesia: LOCAL, duration: M40, recovery: v("Zdjęcie szwów po 5–14 dniach", "Stitches removed after 5–14 days") },
  "zmniejszenie-warg-sromowych": { anesthesia: LOCAL, duration: H1, recovery: v("7–10 dni", "7–10 days"), forWhom: v("Kobiety", "Women") },
};

// Twins (near-identical pages) are never suggested for each other; links point at the first of each pair.
const related = {
  "lifting-twarzy": ["korekcja-powiek", "face-lift-nicmi", "wszczepienie-implantu-w-twarz"],
  "face-lift-nicmi": ["lifting-twarzy", "wolumetria-twarzy-kwasem-hialuronowym", "porazenie-nerwu-twarzowego-nici-aptos"],
  "face-lift-nicmi-2": ["lifting-twarzy", "wolumetria-twarzy-kwasem-hialuronowym", "porazenie-nerwu-twarzowego-nici-aptos"],
  "korekcja-powiek": ["lifting-twarzy", "face-lift-calkowity-czesciowy-4", "korekcja-nosa"],
  "korekcja-nosa": ["korekcja-nosa-nicmi-aptos", "korekcja-nosa-kwasem-hialuronowym", "korekcja-powiek"],
  "korekcja-nosa-nicmi-aptos": ["korekcja-nosa", "korekcja-nosa-kwasem-hialuronowym", "face-lift-nicmi"],
  "korekcja-nosa-kwasem-hialuronowym": ["korekcja-nosa", "korekcja-nosa-nicmi-aptos", "wolumetria-twarzy-kwasem-hialuronowym"],
  "plastyka-odstajacych-uszu": ["face-lift-calkowity-czesciowy-3", "korekcja-nosa", "korekcja-powiek"],
  "face-lift-calkowity-czesciowy-3": ["plastyka-odstajacych-uszu", "korekcja-blizn-chirurgiczna", "wyciecie-znamienia"],
  "wszczepienie-implantu-w-twarz": ["lifting-twarzy", "modelowanie-twarzy-naturalnym-wypelniaczem-algeness-na-bazie-agarozy", "wolumetria-twarzy-kwasem-hialuronowym"],
  "lipoliza-podbrodek": ["lifting-twarzy", "miejscowe-modelowanie-sylwetki-preparatem-aqualyx", "liposukcja"],
  "porazenie-nerwu-twarzowego-nici-aptos": ["face-lift-nicmi", "lifting-twarzy", "wszczepienie-implantu-w-twarz"],
  "face-lift-calkowity-czesciowy-4": ["redukcja-zmarszczek", "wolumetria-twarzy-kwasem-hialuronowym", "botox-leczenie-bolow-migrenowych"],
  "redukcja-zmarszczek": ["face-lift-calkowity-czesciowy-4", "wolumetria-twarzy-kwasem-hialuronowym", "redermalizacja"],
  "wolumetria-twarzy-kwasem-hialuronowym": ["redukcja-zmarszczek", "modelowanie-twarzy-naturalnym-wypelniaczem-algeness-na-bazie-agarozy", "powiekszenie-ust-kwasem-hialuronowym"],
  "powiekszenie-ust-kwasem-hialuronowym": ["wolumetria-twarzy-kwasem-hialuronowym", "redukcja-zmarszczek", "face-lift-calkowity-czesciowy-4"],
  "modelowanie-twarzy-naturalnym-wypelniaczem-algeness-na-bazie-agarozy": ["wolumetria-twarzy-kwasem-hialuronowym", "lipo-gems-innowacyjna-metoda-modelowania-tluszczem-bogatym-w-komorki-macierzyste", "redukcja-zmarszczek"],
  "lipo-gems-innowacyjna-metoda-modelowania-tluszczem-bogatym-w-komorki-macierzyste": ["przeszczep-tluszczu", "komorki-macierzyste-lipogems-odmladzanie-i-rewitalizacja-skory", "wolumetria-twarzy-kwasem-hialuronowym"],
  "botox-leczenie-bolow-migrenowych": ["face-lift-calkowity-czesciowy-4", "redukcja-zmarszczek", "wolumetria-twarzy-kwasem-hialuronowym"],
  "leczenie-bolow-migrenowych-botox": ["face-lift-calkowity-czesciowy-4", "redukcja-zmarszczek", "wolumetria-twarzy-kwasem-hialuronowym"],
  "mezoterapia-iglowa": ["mezoterapia-mikroiglowa-micropen", "mezoterapia-osoczem-bogatoplytkowym-prp", "redermalizacja"],
  "mezoterapia-mikroiglowa-micropen": ["mezoterapia-iglowa", "resurfacing", "mezoterapia-osoczem-bogatoplytkowym-prp"],
  "mezoterapia-microiglowa-micropen": ["mezoterapia-iglowa", "resurfacing", "mezoterapia-osoczem-bogatoplytkowym-prp"],
  "mezoterapia-komorkami-macierzystymi": ["rewitalizacja-skory-komorkami-macierzystymi", "komorki-macierzyste-lipogems-odmladzanie-i-rewitalizacja-skory", "mezoterapia-osoczem-bogatoplytkowym-prp"],
  "mezoterapia-osoczem-bogatoplytkowym-prp": ["mezoterapia-iglowa", "mezoterapia-komorkami-macierzystymi", "redermalizacja"],
  "podanie-osocza-bogatoplytkowego2": ["mezoterapia-iglowa", "mezoterapia-komorkami-macierzystymi", "redermalizacja"],
  "redermalizacja": ["mezoterapia-iglowa", "redukcja-zmarszczek", "mezoterapia-osoczem-bogatoplytkowym-prp"],
  "redermalizacja-nowy-zabieg-anti-aging": ["mezoterapia-iglowa", "redukcja-zmarszczek", "mezoterapia-osoczem-bogatoplytkowym-prp"],
  "resurfacing": ["fotoodmladzanie", "mezoterapia-mikroiglowa-micropen", "korekcja-blizn-chirurgiczna"],
  "fotoodmladzanie": ["resurfacing", "pajaczki-teleangiektazje", "endermolift-2-zabieg-odmladzajacy"],
  "fotoodmladzanie-laserowe-laser-ipl": ["resurfacing", "pajaczki-teleangiektazje", "endermolift-2-zabieg-odmladzajacy"],
  "endermolift-2-zabieg-odmladzajacy": ["endermologia-lpg-lipomassage", "fotoodmladzanie", "redermalizacja"],
  "endermolift-2-zabiegi-przeciwzmarszczkowe": ["endermologia-lpg-lipomassage", "fotoodmladzanie", "redermalizacja"],
  "rewitalizacja-skory-komorkami-macierzystymi": ["mezoterapia-komorkami-macierzystymi", "komorki-macierzyste-lipogems-odmladzanie-i-rewitalizacja-skory", "lipo-gems-innowacyjna-metoda-modelowania-tluszczem-bogatym-w-komorki-macierzyste"],
  "komorki-macierzyste-lipogems-odmladzanie-i-rewitalizacja-skory": ["komorki-macierzyste-lipogems-odmladzanie-grzbietow-rak", "rewitalizacja-skory-komorkami-macierzystymi", "lipo-gems-innowacyjna-metoda-modelowania-tluszczem-bogatym-w-komorki-macierzyste"],
  "komorki-macierzyste-lipogems-odmladzanie-grzbietow-rak": ["komorki-macierzyste-lipogems-odmladzanie-i-rewitalizacja-skory", "przeszczep-tluszczu", "rewitalizacja-skory-komorkami-macierzystymi"],
  "vectus-depilacja-laserowa-twarzy": ["vectus-bezpieczna-depilacja-laserowa-np-nogi-pachy-plecy", "fotoodmladzanie", "resurfacing"],
  "vectus-bezpieczna-depilacja-laserowa-np-nogi-pachy-plecy": ["vectus-depilacja-laserowa-twarzy", "endermologia-lpg-lipomassage", "pajaczki-teleangiektazje"],
  "pajaczki-teleangiektazje": ["flebologia", "fotoodmladzanie", "resurfacing"],
  "flebologia": ["pajaczki-teleangiektazje", "endermologia-lpg-lipomassage", "fotoodmladzanie"],
  "flebologia-laseroterapia": ["pajaczki-teleangiektazje", "endermologia-lpg-lipomassage", "fotoodmladzanie"],
  "korekcja-blizn-chirurgiczna": ["wyciecie-znamienia-z-plastyka-miejscowa", "resurfacing", "wyciecie-znamienia"],
  "wyciecie-znamienia": ["wyciecie-znamienia-z-plastyka-miejscowa", "wyciecie-zmiany-nowotworowej", "korekcja-blizn-chirurgiczna"],
  "wyciecie-znamienia-z-plastyka-miejscowa": ["wyciecie-znamienia", "wyciecie-zmiany-nowotworowej", "korekcja-blizn-chirurgiczna"],
  "wyciecie-zmiany-nowotworowej": ["wyciecie-znamienia", "wyciecie-znamienia-z-plastyka-miejscowa", "korekcja-blizn-chirurgiczna"],
  "liposukcja": ["liposukcja-laserowa-slimlipo-3d", "argo-plasma-obkurczanie-skory", "plastyka-brzucha"],
  "liposukcja-laserowa-slimlipo-3d": ["liposukcja", "argo-plasma-obkurczanie-skory", "miejscowe-modelowanie-sylwetki-preparatem-aqualyx"],
  "argo-plasma-obkurczanie-skory": ["liposukcja", "liposukcja-laserowa-slimlipo-3d", "plastyka-ramion"],
  "plastyka-brzucha": ["liposukcja", "chirurgia-przepukliny-brzuszne", "plastyka-ud"],
  "plastyka-ramion": ["plastyka-ud", "liposukcja", "argo-plasma-obkurczanie-skory"],
  "plastyka-ud": ["plastyka-ramion", "plastyka-brzucha", "liposukcja"],
  "plastyka-lydek-powiekszenie-implantami": ["przeszczep-tluszczu", "plastyka-ud", "liposukcja"],
  "przeszczep-tluszczu": ["lipo-gems-innowacyjna-metoda-modelowania-tluszczem-bogatym-w-komorki-macierzyste", "powiekszanie-piersi-wlasnym-tluszczem", "liposukcja"],
  "miejscowe-modelowanie-sylwetki-preparatem-aqualyx": ["liposukcja-laserowa-slimlipo-3d", "lipoliza-podbrodek", "endermologia-lpg-lipomassage"],
  "endermologia-lpg-lipomassage": ["endermolift-2-zabieg-odmladzajacy", "miejscowe-modelowanie-sylwetki-preparatem-aqualyx", "liposukcja"],
  "zmniejszenie-warg-sromowych": ["plastyka-brzucha", "liposukcja", "przeszczep-tluszczu"],
  "chirurgia-przepukliny-brzuszne": ["plastyka-brzucha", "liposukcja", "chirurgia-reki"],
  "chirurgia-reki": ["regeneracja-stawow-komorkami-macierzystymi", "korekcja-blizn-chirurgiczna", "chirurgia-przepukliny-brzuszne"],
  "regeneracja-stawow-komorkami-macierzystymi": ["chirurgia-reki", "lipo-gems-innowacyjna-metoda-modelowania-tluszczem-bogatym-w-komorki-macierzyste", "mezoterapia-komorkami-macierzystymi"],
  "powiekszanie-piersi": ["powiekszanie-piersi-wlasnym-tluszczem", "podniesienie-piersi", "plastyka-wciagnietych-brodawek"],
  "powiekszanie-piersi-wlasnym-tluszczem": ["powiekszanie-piersi", "przeszczep-tluszczu", "rekonstrukcja-piersi-wlasnym-tluszczem"],
  "podniesienie-piersi": ["podniesienie-piersi-nicmi-aptos-podskorny-biustonosz", "powiekszanie-piersi", "redukcja-piersi"],
  "podniesienie-piersi-nicmi-aptos-podskorny-biustonosz": ["podniesienie-piersi", "powiekszanie-piersi", "face-lift-nicmi"],
  "redukcja-piersi": ["podniesienie-piersi", "dla-mezczyzn-ginekomastia", "plastyka-wciagnietych-brodawek"],
  "plastyka-wciagnietych-brodawek": ["powiekszanie-piersi", "podniesienie-piersi", "redukcja-piersi"],
  "rekonstrukcja-piersi": ["rekonstrukcja-piersi-ekspanderoproteza", "rekonstrukcja-piersi-tkankami-wlasnymi", "rekonstrukcja-piersi-wlasnym-tluszczem"],
  "rekonstrukcja-piersi-ekspanderoproteza": ["natychmiastowa-rekonstrukcja-piersi-po-amputacji", "rekonstrukcja-piersi-tkankami-wlasnymi", "rekonstrukcja-piersi-wlasnym-tluszczem"],
  "rekonstrukcja-piersi-tkankami-wlasnymi": ["rekonstrukcja-piersi-ekspanderoproteza", "rekonstrukcja-piersi-wlasnym-tluszczem", "natychmiastowa-rekonstrukcja-piersi-po-amputacji"],
  "rekonstrukcja-piersi-wlasnym-tluszczem": ["rekonstrukcja-piersi-tkankami-wlasnymi", "powiekszanie-piersi-wlasnym-tluszczem", "rekonstrukcja-piersi-ekspanderoproteza"],
  "natychmiastowa-rekonstrukcja-piersi-po-amputacji": ["rekonstrukcja-piersi", "rekonstrukcja-piersi-ekspanderoproteza", "rekonstrukcja-piersi-tkankami-wlasnymi"],
  "dla-mezczyzn-ginekomastia": ["liposukcja", "redukcja-piersi", "plastyka-brzucha"],
};

const categories = { liposukcja: ["cialo"] };

// Near-identical pages: the second shares the first one's price list entry.
const twins = {
  "leczenie-bolow-migrenowych-botox": "botox-leczenie-bolow-migrenowych",
  "redermalizacja-nowy-zabieg-anti-aging": "redermalizacja",
  "endermolift-2-zabiegi-przeciwzmarszczkowe": "endermolift-2-zabieg-odmladzajacy",
  "mezoterapia-microiglowa-micropen": "mezoterapia-mikroiglowa-micropen",
  "face-lift-nicmi-2": "face-lift-nicmi",
  "mezoterapia-osoczem-bogatoplytkowym-prp": "podanie-osocza-bogatoplytkowego2",
  "flebologia-laseroterapia": "flebologia",
  "fotoodmladzanie-laserowe-laser-ipl": "fotoodmladzanie",
};

// Price-list links that are unambiguous from row/heading names. `treatment` may be a list:
// the first id is the link target in the price list, every id gets the row in its "od" price.
// `primary`: when a treatment has primary rows, only those count for its "od" price.
const MASK = /^Maska do zabiegu/;
const FACE_AREAS = /^(Twarz|Górna warga|Baki|Broda|Szyja)\b/;
const pricing = [
  { section: "twarz", name: /^Lifting twarzy i szyi Deep Plane$/, primary: true },
  { section: "skora-botox", name: /^Botox – (jedna|dwie|trzy) okolic/, treatment: "face-lift-calkowity-czesciowy-4" },
  { section: "skora-botox", name: /^Leczenie migreny$/, treatment: "botox-leczenie-bolow-migrenowych" },
  { section: "skora-wypelniacze", name: /^Powiększanie ust kwasem/, treatment: "powiekszenie-ust-kwasem-hialuronowym" },
  { section: "skora-wypelniacze", name: /^Wolumetria twarzy kwasem/, treatment: "wolumetria-twarzy-kwasem-hialuronowym" },
  { section: "skora-wypelniacze", name: /^Wypełnianie bruzd i zmarszczek/, treatment: "redukcja-zmarszczek" },
  { section: "skora-mezoterapia", heading: /^Xela Rederm/, treatment: "redermalizacja" },
  { section: "skora-mezoterapia", heading: /^Mezoterapia igłowa/, treatment: "mezoterapia-iglowa" },
  { section: "skora-dermapen", heading: /^Dermapen 4.0 z mezokoktajlem/, treatment: "mezoterapia-mikroiglowa-micropen" },
  { section: "skora-laseroterapia", heading: /fotoodmładzanie laserowe$/, name: /^(?!Pojedyncze)/, treatment: "fotoodmladzanie" },
  { section: "skora-laseroterapia", heading: /Frax 1550 – resurfacing/, treatment: "resurfacing" },
  { section: "skora-laseroterapia", heading: /zamykanie naczynek na nogach/, treatment: ["flebologia", "pajaczki-teleangiektazje"] },
  { section: "skora-depilacja-laserowa", name: FACE_AREAS, treatment: "vectus-depilacja-laserowa-twarzy" },
  { section: "skora-depilacja-laserowa", name: /./, treatment: "vectus-bezpieczna-depilacja-laserowa-np-nogi-pachy-plecy", onlyUnlinked: true },
  { section: "skora-endermologia-lpg", name: /^Endermolift/, treatment: "endermolift-2-zabieg-odmladzajacy" },
  { section: "skora-endermologia-lpg", name: /^Ubranko/, unlink: true },
  { section: "rekonstrukcja-piersi", name: /ekspanderoprotezą/, treatment: ["rekonstrukcja-piersi-ekspanderoproteza", "rekonstrukcja-piersi"] },
  { section: "rekonstrukcja-piersi", name: /własnym tłuszczem/, treatment: ["rekonstrukcja-piersi-wlasnym-tluszczem", "rekonstrukcja-piersi"] },
  { section: "rekonstrukcja-piersi", name: /tk\. własnymi/, treatment: ["rekonstrukcja-piersi-tkankami-wlasnymi", "rekonstrukcja-piersi"] },
];

// Short specialty shown on the homepage rail (from the approved redesign).
const teamSpecialty = {
  Witwicki: v("Chirurgia plastyczna, rekonstrukcyjna i&nbsp;estetyczna", "Plastic, reconstructive and aesthetic surgery"),
  Mazurek: v("Chirurgia plastyczna", "Plastic surgery"),
  Pietruski: v("Chirurgia plastyczna i&nbsp;rekonstrukcyjna", "Plastic and reconstructive surgery"),
  Mazur: v("Chirurgia onkologiczna", "Surgical oncology"),
  Jonczyk: v("Chirurgia plastyczna", "Plastic surgery"),
  Winiarska: v("Medycyna estetyczna", "Aesthetic medicine"),
  Korab: v("Chirurgia ogólna, onkologiczna, otolaryngologia", "General and oncological surgery, otolaryngology"),
  Grous: v("Chirurgia ogólna i&nbsp;onkologiczna", "General and oncological surgery"),
  Latala: v("Medycyna estetyczna", "Aesthetic medicine"),
  Krawczyk: v("Kosmetologia", "Cosmetology"),
  Kukwa: v("Otolaryngologia", "Otolaryngology"),
};

module.exports = { summary, related, categories, twins, pricing, MASK, teamSpecialty };
