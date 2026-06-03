const fs = require('fs');
const path = require('path');

const row = (title, price, href) => {
  const tag = href ? 'a' : 'div';
  const hrefAttr = href ? ` href="${href}"` : '';
  const target = href && href.startsWith('http') ? ' target="_blank"' : '';
  return `          <${tag}${hrefAttr}${target}
            class="mb-2 flex justify-between border-l-4 border-accent py-2 pl-2 transition duration-300 hover:bg-gray-100"
          >
            <p class="flex-1 pr-8 font-semibold">${title}</p>
            <p>${price}</p>
          </${tag}>`;
};

const h3 = (title) =>
  `          <h3 class="mb-3 mt-6 text-xl font-semibold text-gray-800">${title}</h3>`;

const h3sub = (title) =>
  `          <h3 class="mb-4 mt-8 text-xl font-semibold text-gray-800">${title}</h3>`;

const productBlock = (title, items) => [h3(title), ...items.map(([t, p]) => row(t, p))].join('\n');

const pl = {
  navStymulatory: { href: '#skora-stymulatory-tkankowe', label: 'STYMULATORY TKANKOWE' },
  masażTitle: 'Masaż ciała',
  masażNav: 'MASAŻ CIAŁA',
  masażSection: 'Masaż ciała pozabiegowy',
  prpLink: 'podanie-osocza-bogatoplytkowego2.html',
  stymulatory: [
    productBlock('Jalupro Young Eye', [
      ['Okolica oczu', '1 000 PLN'],
    ]),
    productBlock('Jalupro Super Hydro', [['Twarz', '1 500 PLN']]),
    productBlock('Jalupro HMW', [['Twarz', '1 100 PLN']]),
    productBlock('Jalupro Classic', [
      ['Twarz', '800 PLN'],
      ['Twarz w serii 2 zabiegów', '1 300 PLN'],
      ['Pakiet Jalupro Full Face (Super Hydro + Young Eye + HMW)', '3 000 PLN'],
    ]),
    productBlock('Nucleofill Soft Eyes – biostymulacja okolicy oczu', [
      ['Okolica oczu lub dowolna 1 okolica', '1 100 PLN'],
      ['Okolica oczu lub dowolna 1 okolica w serii 3 zabiegów', '2 700 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Nucleofill Medium – biostymulacja polinukleotydami', [
      ['Twarz', '1 200 PLN'],
      ['Twarz w serii 3 zabiegów', '3 000 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Nucleofill Strong – intensywna biostymulacja polinukleotydami', [
      ['Twarz', '1 300 PLN'],
      ['Twarz w serii 3 zabiegów', '3 300 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Linerase – kolagenowa odbudowa skóry', [
      ['Twarz', '1 300 PLN'],
      ['Twarz + szyja', '1 500 PLN'],
      ['Twarz + szyja + dekolt', '1 700 PLN'],
      ['Twarz w serii 3 zabiegów', '3 200 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Tropokolagen GUNA – MD-Tissue, MD-Matrix i MD-Lumbar', [
      ['1 ampułka (okolica oczu)', '600 PLN'],
      ['2 ampułki', '800 PLN'],
      ['3 ampułki', '1 000 PLN'],
      ['Każda dodatkowa ampułka (2 ml)', '200 PLN'],
    ]),
    productBlock('Profhilo – bioremodeling skóry', [
      ['Twarz', '1 500 PLN'],
      ['Twarz w serii 2 zabiegów', '2 600 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Profhilo Structura', [
      ['Twarz', '1 900 PLN'],
      ['Twarz w serii 2 zabiegów', '3 200 PLN'],
    ]),
    productBlock('Sunekos 1200 – intensywna odbudowa i lifting skóry', [
      ['Twarz', '1 500 PLN'],
      ['Twarz + szyja', '2 100 PLN'],
      ['Twarz + szyja + dekolt', '2 600 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Sunekos 200 – regeneracja i odbudowa skóry', [
      ['Twarz', '1 000 PLN'],
      ['Twarz w serii 4 zabiegów', '3 400 PLN'],
      ['Twarz + szyja', '1 500 PLN'],
      ['Twarz + szyja + dekolt', '1 900 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Sunekos 1200 + 200 – kompleksowa odbudowa i odmłodzenie skóry', [
      ['Twarz', '1 800 PLN'],
      ['Pełna seria zabiegowa (Sunekos 1200 i 3× Sunekos 200)', '4 200 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    row('Kwas polimlekowy – 1 ampułka', '2 200 PLN'),
    row('Hydroxyapatyt wapnia – 1 ampułka', 'od 1 800 PLN'),
    productBlock('Mezoterapia igłowa Viscoderm Hydrobooster', [
      ['Twarz', '1 500 PLN'],
      ['Twarz w serii 2 zabiegów', '2 300 PLN'],
    ]),
    productBlock('Electri – zagęszczenie i odmłodzenie skóry', [
      ['Twarz', '800 PLN'],
      ['Twarz + szyja', '1 300 PLN'],
      ['Twarz + szyja + dekolt', '1 800 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Xela Rederm 1.1% – intensywna regeneracja i odmłodzenie skóry', [
      ['Twarz', '900 PLN'],
      ['Twarz + szyja', '1 500 PLN'],
      ['Twarz + szyja + dekolt', '2 000 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Xela Rederm 1.8% – intensywna odbudowa i lifting skóry', [
      ['Twarz', '1 000 PLN'],
      ['Twarz + szyja', '1 600 PLN'],
      ['Twarz + szyja + dekolt', '2 100 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Xela Rederm 2.2% – odbudowa i zagęszczenie', [
      ['Twarz', '1 100 PLN'],
      ['Twarz + szyja', '1 700 PLN'],
      ['Twarz + szyja + dekolt', '2 200 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Neauvia Hydro Delux – nawilżanie i rewitalizacja', [
      ['Twarz', '800 PLN'],
      ['Twarz + szyja', '1 300 PLN'],
      ['Twarz + szyja + dekolt', '1 700 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
  ].join('\n'),
  mezoterapia: [
    h3sub('Mezoterapia igłowa okolic oczu'),
    row('RRS HA Eyes', '500 PLN'),
    row('Nucleofill Soft Eyes', '1 100 PLN'),
    h3sub('Mezoterapia igłowa skóry głowy – regeneracja i stymulacja wzrostu włosów'),
    row('RRS XL Hair', '600 PLN'),
    row('DR.CYJ', '800 PLN'),
    h3sub('Mezoterapia preparatami autologicznymi'),
    row('Osocze bogatopłytkowe – jeden obszar', '900 PLN', 'podanie-osocza-bogatoplytkowego2.html'),
    row('Osocze bogatopłytkowe – dwa obszary', '1 200 PLN', 'podanie-osocza-bogatoplytkowego2.html'),
    row('Osocze bogatopłytkowe – okolica skóry głowy', '900 PLN', 'podanie-osocza-bogatoplytkowego2.html'),
    row('Fibryna bogatopłytkowa – twarz', '900 – 1 500 PLN'),
    h3sub('Dermapen 4.0 – mikronakłuwanie skóry'),
    productBlock('Dermapen 4.0 z mezokoktajlem DP Dermaceuticals', [
      ['Twarz', '800 PLN'],
      ['Twarz + szyja', '1 000 PLN'],
      ['Twarz + szyja + dekolt', '1 200 PLN'],
      ['Twarz w serii 3 zabiegów', '2 100 PLN'],
      ['Twarz + szyja w serii 3 zabiegów', '2 700 PLN'],
      ['Twarz + szyja + dekolt w serii 3 zabiegów', '3 300 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Dermapen 4.0 – zabieg z użyciem kwasów', [
      ['Twarz', '950 PLN'],
      ['Twarz + szyja', '1 250 PLN'],
      ['Twarz + szyja + dekolt', '1 550 PLN'],
      ['Twarz w serii 3 zabiegów', '2 400 PLN'],
      ['Twarz + szyja w serii 3 zabiegów', '3 300 PLN'],
      ['Twarz + szyja + dekolt w serii 3 zabiegów', '3 900 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
  ].join('\n'),
  peelingi: [
    h3sub('Monopeelingi Peel Mission'),
    row('Fitowy – oczyszczający i antybakteryjny', '400 PLN'),
    row('Azelainowy – redukcja niedoskonałości', '400 PLN'),
    row('Ferulowy – antyoksydacyjny i rozświetlający', '400 PLN'),
    row('Laktobionowy – nawilżenie i blask', '400 PLN'),
    row('Migdałowy – rozjaśniający i delikatny', '400 PLN'),
    row('Biorepeel – peeling rewitalizujący', '400 PLN'),
    h3sub('Peeling kawitacyjny – oczyszczanie ultradźwiękami'),
    row('Wersja podstawowa', '300 PLN'),
    row('Wersja rozszerzona – z peelingiem chemicznym', '450 PLN'),
    row('Maska do zabiegu', '200 PLN'),
  ].join('\n'),
  laser: [
    productBlock('Laser Nordlys™ Ellipse PR530/Vl 555 – laserowe usuwanie przebarwień', [
      ['Twarz', '600 PLN'],
      ['Szyja', '400 PLN'],
      ['Dekolt', '500 PLN'],
      ['Twarz + szyja', '800 PLN'],
      ['Twarz + dekolt', '900 PLN'],
      ['Twarz + szyja + dekolt', '1 100 PLN'],
      ['Pojedyncze przebarwienie', '200 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Laser Nordlys™ Ellipse PR530/Vl555 – laserowe usuwanie naczynek i rumienia', [
      ['Twarz', '600 PLN'],
      ['Szyja', '400 PLN'],
      ['Dekolt', '500 PLN'],
      ['Twarz + szyja', '800 PLN'],
      ['Twarz + dekolt', '900 PLN'],
      ['Twarz + szyja + dekolt', '1 100 PLN'],
      ['Pojedyncze naczynko / rubinek', '200 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Laser Nordlys™ Ellipse PR530 – fotoodmładzanie laserowe', [
      ['Twarz', '600 PLN'],
      ['Szyja', '400 PLN'],
      ['Dekolt', '500 PLN'],
      ['Twarz + szyja', '800 PLN'],
      ['Twarz + dekolt', '900 PLN'],
      ['Twarz + szyja + dekolt', '1 100 PLN'],
      ['Pojedyncze naczynko / rubinek', '200 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Laser Nordlys™ Ellipse Frax 1550 – resurfacing, odmładzenie skóry', [
      ['Twarz', '1 100 PLN'],
      ['Szyja', '500 PLN'],
      ['Dekolt', '800 PLN'],
      ['Twarz + szyja', '1 400 PLN'],
      ['Twarz + szyja + dekolt', '1 700 PLN'],
      ['Dłonie', '500 PLN'],
      ['Ramiona', '1 500 PLN'],
      ['Brzuch', '2 000 PLN'],
      ['Maska do zabiegu', '200 PLN'],
    ]),
    productBlock('Laser Nordlys™ Ellipse – procedura łączona (Frax + IPL), zaawansowane odmładzanie skóry', [
      ['Twarz', '1 500 PLN'],
      ['Twarz + szyja', '2 000 PLN'],
      ['Twarz + szyja + dekolt', '2 400 PLN'],
    ]),
    productBlock('Laser Nordlys™ Ellipse Nd:YAG – zamykanie naczynek na nogach', [
      ['Pojedyncze naczynko', '200 PLN'],
      ['Mini zabieg (2–5 zmian)', '400 PLN'],
      ['Mały zabieg (6–10 zmian)', '700 PLN'],
      ['Średni zabieg (11–20 zmian)', '1 200 PLN'],
      ['Duży zabieg (21–30 zmian)', '1 600 PLN'],
    ]),
    productBlock('Laser Nordlys™ Ellipse – laserowa redukcja blizn (Frax 1550, IPL)', [
      ['Blizny chirurgiczne do 2 cm', '200 PLN'],
      ['Blizny chirurgiczne 2–5 cm', '250 PLN'],
      ['Blizny chirurgiczne 5–10 cm', '350 PLN'],
      ['Blizny chirurgiczne powyżej 10 cm', '400 PLN'],
    ]),
    productBlock('Laser Nordlys™ Ellipse – laserowa redukcja rozstępów (Frax 1550, IPL)', [
      ['Pojedynczy rozstęp', '250 PLN'],
      ['Obszar 10 cm × 10 cm', '600 PLN'],
      ['Ramiona', '1 200 PLN'],
      ['Biodra', '1 200 PLN'],
      ['Brzuch', '1 200 PLN'],
      ['Piersi', '1 200 PLN'],
      ['Pośladki', '1 200 PLN'],
      ['Uda (obszar 20 cm × 20 cm)', '1 200 PLN'],
    ]),
  ].join('\n'),
  depilacja: [
    h3sub('Depilacja laserowa Vectus Palomar'),
    ...[
      ['Twarz', '350 PLN'],
      ['Górna warga', '200 PLN'],
      ['Baki', '200 PLN'],
      ['Broda', '200 PLN'],
      ['Szyja', '300 PLN'],
      ['Kark', '300 PLN'],
      ['Brzuch', '400 PLN'],
      ['Klatka piersiowa', '400 PLN'],
      ['Plecy', '500 PLN'],
      ['Pachy', '300 PLN'],
      ['Sutki', '200 PLN'],
      ['Przedramiona', '300 PLN'],
      ['Ramiona', '300 PLN'],
      ['Całe ręce', '500 PLN'],
      ['Bikini', '500 PLN'],
      ['Pośladki', '400 PLN'],
      ['Szpara pośladkowa', '300 PLN'],
      ['Uda', '400 PLN'],
      ['Łydki', '400 PLN'],
      ['Całe nogi', '600 PLN'],
    ].map(([t, p]) => row(t, p)),
    h3sub('Pakiety – Vectus Palomar'),
    ...[
      ['Twarz w serii 4 zabiegów (250 PLN/zabieg)', '1 000 PLN'],
      ['Górna warga w serii 4 zabiegów (150 PLN/zabieg)', '600 PLN'],
      ['Baki w serii 4 zabiegów (150 PLN/zabieg)', '600 PLN'],
      ['Broda w serii 4 zabiegów (150 PLN/zabieg)', '600 PLN'],
      ['Szyja w serii 4 zabiegów (200 PLN/zabieg)', '800 PLN'],
      ['Kark w serii 4 zabiegów (200 PLN/zabieg)', '800 PLN'],
      ['Brzuch w serii 4 zabiegów (300 PLN/zabieg)', '1 200 PLN'],
      ['Klatka piersiowa w serii 4 zabiegów (300 PLN/zabieg)', '1 200 PLN'],
      ['Plecy w serii 4 zabiegów (400 PLN/zabieg)', '1 600 PLN'],
      ['Pachy w serii 4 zabiegów (200 PLN/zabieg)', '800 PLN'],
      ['Sutki w serii 4 zabiegów (150 PLN/zabieg)', '600 PLN'],
      ['Przedramiona w serii 4 zabiegów (200 PLN/zabieg)', '800 PLN'],
      ['Ramiona w serii 4 zabiegów (200 PLN/zabieg)', '800 PLN'],
      ['Całe ręce w serii 4 zabiegów (400 PLN/zabieg)', '1 600 PLN'],
      ['Bikini w serii 4 zabiegów (400 PLN/zabieg)', '1 600 PLN'],
      ['Pośladki w serii 4 zabiegów (300 PLN/zabieg)', '1 200 PLN'],
      ['Szpara pośladkowa w serii 4 zabiegów (200 PLN/zabieg)', '800 PLN'],
      ['Uda w serii 4 zabiegów (300 PLN/zabieg)', '1 200 PLN'],
      ['Łydki w serii 4 zabiegów (300 PLN/zabieg)', '1 200 PLN'],
      ['Całe nogi w serii 4 zabiegów (450 PLN/zabieg)', '1 800 PLN'],
    ].map(([t, p]) => row(t, p)),
  ].join('\n'),
  masaz: [
    h3sub('Masaż ciała pozabiegowy'),
    ...[
      ['Masaż ciała manualny 40 min', '320 PLN'],
      ['Masaż manualny po zabiegu liposukcji 40 min', '320 PLN'],
      ['Masaż manualny po zabiegach chirurgicznych 40 min', '320 PLN'],
      ['Terapia blizny manualna 30 min', '320 PLN'],
    ].map(([t, p]) => row(t, p)),
    h3sub('Endermologia LPG®'),
    ...[
      ['Zabieg na ciało 40 minut', '290 PLN'],
      ['Zabieg na ciało 50 minut', '340 PLN'],
      ['Zabieg na ciało 60 minut', '390 PLN'],
      ['Endermolift – zabieg na twarz 40 minut', '290 PLN'],
      ['Ubranko do zabiegu na ciało (do pakietu GRATIS)', '120 PLN'],
    ].map(([t, p]) => row(t, p, 'endermologia-lpg-lipomassage.html')),
    h3sub('Endermologia (Lipomassage™) – terapia wspomagająca'),
    ...[
      ['Endermologia – przygotowanie do operacji chirurgicznej – 40 minut', '290 PLN'],
      ['Endermologia regeneracyjna po operacji chirurgicznej – 40 minut', '290 PLN'],
      ['Endermologia – przygotowanie do zabiegu liposukcji – 40 minut', '290 PLN'],
      ['Endermologia regeneracyjna po zabiegu liposukcji – 40 minut', '290 PLN'],
      ['Endermolift – przygotowanie do operacji twarzy 40 minut', '290 PLN'],
      ['Endermolift regeneracyjny po zabiegu na twarz 40 minut', '290 PLN'],
    ].map(([t, p]) => row(t, p, 'endermologia-lpg-lipomassage.html')),
    h3sub('Pakiety Endermologia LPG®'),
    ...[
      ['Zabieg na ciało 40 minut w serii 5 zabiegów (270 PLN/zabieg)', '1 350 PLN'],
      ['Zabieg na ciało 40 minut w serii 10 zabiegów (250 PLN/zabieg)', '2 500 PLN'],
      ['Zabieg na ciało 40 minut w serii 15 zabiegów (225 PLN/zabieg)', '3 375 PLN'],
      ['Zabieg na ciało 50 minut w serii 5 zabiegów (325 PLN/zabieg)', '1 625 PLN'],
      ['Zabieg na ciało 50 minut w serii 10 zabiegów (300 PLN/zabieg)', '3 000 PLN'],
      ['Zabieg na ciało 50 minut w serii 15 zabiegów (275 PLN/zabieg)', '4 125 PLN'],
      ['Zabieg na ciało 60 minut w serii 5 zabiegów (370 PLN/zabieg)', '1 850 PLN'],
      ['Zabieg na ciało 60 minut w serii 10 zabiegów (350 PLN/zabieg)', '3 500 PLN'],
      ['Zabieg na ciało 60 minut w serii 15 zabiegów (325 PLN/zabieg)', '4 875 PLN'],
    ].map(([t, p]) => row(t, p, 'endermologia-lpg-lipomassage.html')),
  ].join('\n'),
};

const en = {
  navStymulatory: { href: '#skora-stymulatory-tkankowe', label: 'TISSUE STIMULATORS' },
  masażTitle: 'Body massage',
  masażNav: 'BODY MASSAGE',
  masażSection: 'Post-procedure body massage',
  prpLink: 'prp-treatment.html',
  stymulatory: [
    productBlock('Jalupro Young Eye', [['Eye area', '1 000 PLN']]),
    productBlock('Jalupro Super Hydro', [['Face', '1 500 PLN']]),
    productBlock('Jalupro HMW', [['Face', '1 100 PLN']]),
    productBlock('Jalupro Classic', [
      ['Face', '800 PLN'],
      ['Face – series of 2 treatments', '1 300 PLN'],
      ['Jalupro Full Face package (Super Hydro + Young Eye + HMW)', '3 000 PLN'],
    ]),
    productBlock('Nucleofill Soft Eyes – eye area biostimulation', [
      ['Eye area or any single area', '1 100 PLN'],
      ['Eye area or any single area – series of 3 treatments', '2 700 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Nucleofill Medium – polynucleotide biostimulation', [
      ['Face', '1 200 PLN'],
      ['Face – series of 3 treatments', '3 000 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Nucleofill Strong – intensive polynucleotide biostimulation', [
      ['Face', '1 300 PLN'],
      ['Face – series of 3 treatments', '3 300 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Linerase – collagen skin reconstruction', [
      ['Face', '1 300 PLN'],
      ['Face + neck', '1 500 PLN'],
      ['Face + neck + decolletage', '1 700 PLN'],
      ['Face – series of 3 treatments', '3 200 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Tropocollagen GUNA – MD-Tissue, MD-Matrix and MD-Lumbar', [
      ['1 vial (eye area)', '600 PLN'],
      ['2 vials', '800 PLN'],
      ['3 vials', '1 000 PLN'],
      ['Each additional vial (2 ml)', '200 PLN'],
    ]),
    productBlock('Profhilo – skin bioremodeling', [
      ['Face', '1 500 PLN'],
      ['Face – series of 2 treatments', '2 600 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Profhilo Structura', [
      ['Face', '1 900 PLN'],
      ['Face – series of 2 treatments', '3 200 PLN'],
    ]),
    productBlock('Sunekos 1200 – intensive skin reconstruction and lifting', [
      ['Face', '1 500 PLN'],
      ['Face + neck', '2 100 PLN'],
      ['Face + neck + decolletage', '2 600 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Sunekos 200 – skin regeneration and reconstruction', [
      ['Face', '1 000 PLN'],
      ['Face – series of 4 treatments', '3 400 PLN'],
      ['Face + neck', '1 500 PLN'],
      ['Face + neck + decolletage', '1 900 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Sunekos 1200 + 200 – comprehensive skin reconstruction and rejuvenation', [
      ['Face', '1 800 PLN'],
      ['Full treatment series (Sunekos 1200 and 3× Sunekos 200)', '4 200 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    row('Poly-L-lactic acid – 1 vial', '2 200 PLN'),
    row('Calcium hydroxyapatite – 1 vial', 'from 1 800 PLN'),
    productBlock('Viscoderm Hydrobooster needle mesotherapy', [
      ['Face', '1 500 PLN'],
      ['Face – series of 2 treatments', '2 300 PLN'],
    ]),
    productBlock('Electri – skin densification and rejuvenation', [
      ['Face', '800 PLN'],
      ['Face + neck', '1 300 PLN'],
      ['Face + neck + decolletage', '1 800 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Xela Rederm 1.1% – intensive skin regeneration and rejuvenation', [
      ['Face', '900 PLN'],
      ['Face + neck', '1 500 PLN'],
      ['Face + neck + decolletage', '2 000 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Xela Rederm 1.8% – intensive skin reconstruction and lifting', [
      ['Face', '1 000 PLN'],
      ['Face + neck', '1 600 PLN'],
      ['Face + neck + decolletage', '2 100 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Xela Rederm 2.2% – reconstruction and densification', [
      ['Face', '1 100 PLN'],
      ['Face + neck', '1 700 PLN'],
      ['Face + neck + decolletage', '2 200 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Neauvia Hydro Delux – hydration and revitalization', [
      ['Face', '800 PLN'],
      ['Face + neck', '1 300 PLN'],
      ['Face + neck + decolletage', '1 700 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
  ].join('\n'),
  mezoterapia: [
    h3sub('Needle mesotherapy – eye area'),
    row('RRS HA Eyes', '500 PLN'),
    row('Nucleofill Soft Eyes', '1 100 PLN'),
    h3sub('Needle mesotherapy – scalp regeneration and hair growth stimulation'),
    row('RRS XL Hair', '600 PLN'),
    row('DR.CYJ', '800 PLN'),
    h3sub('Autologous mesotherapy'),
    row('Platelet-rich plasma – one area', '900 PLN', 'prp-treatment.html'),
    row('Platelet-rich plasma – two areas', '1 200 PLN', 'prp-treatment.html'),
    row('Platelet-rich plasma – scalp area', '900 PLN', 'prp-treatment.html'),
    row('Platelet-rich fibrin – face', '900 – 1 500 PLN'),
    h3sub('Dermapen 4.0 – skin microneedling'),
    productBlock('Dermapen 4.0 with DP Dermaceuticals meso cocktail', [
      ['Face', '800 PLN'],
      ['Face + neck', '1 000 PLN'],
      ['Face + neck + decolletage', '1 200 PLN'],
      ['Face in a series of 3 treatments', '2 100 PLN'],
      ['Face + neck in a series of 3 treatments', '2 700 PLN'],
      ['Face + neck + decolletage in a series of 3 treatments', '3 300 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Dermapen 4.0 – treatment with acids', [
      ['Face', '950 PLN'],
      ['Face + neck', '1 250 PLN'],
      ['Face + neck + decolletage', '1 550 PLN'],
      ['Face in a series of 3 treatments', '2 400 PLN'],
      ['Face + neck in a series of 3 treatments', '3 300 PLN'],
      ['Face + neck + decolletage in a series of 3 treatments', '3 900 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
  ].join('\n'),
  peelingi: [
    h3sub('Peel Mission monopeels'),
    row('Phytic – cleansing and antibacterial', '400 PLN'),
    row('Azelaic – imperfection reduction', '400 PLN'),
    row('Ferulic – antioxidant and brightening', '400 PLN'),
    row('Lactobionic – hydration and glow', '400 PLN'),
    row('Almond – brightening and gentle', '400 PLN'),
    row('Biorepeel – revitalizing peel', '400 PLN'),
    h3sub('Ultrasonic cavitation peel'),
    row('Basic version', '300 PLN'),
    row('Extended version – with chemical peel', '450 PLN'),
    row('Treatment mask', '200 PLN'),
  ].join('\n'),
  laser: [
    productBlock('Nordlys™ Ellipse PR530/Vl 555 laser – pigmentation removal', [
      ['Face', '600 PLN'],
      ['Neck', '400 PLN'],
      ['Decolletage', '500 PLN'],
      ['Face + neck', '800 PLN'],
      ['Face + decolletage', '900 PLN'],
      ['Face + neck + decolletage', '1 100 PLN'],
      ['Single pigmentation spot', '200 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Nordlys™ Ellipse PR530/Vl555 laser – vessel and redness removal', [
      ['Face', '600 PLN'],
      ['Neck', '400 PLN'],
      ['Decolletage', '500 PLN'],
      ['Face + neck', '800 PLN'],
      ['Face + decolletage', '900 PLN'],
      ['Face + neck + decolletage', '1 100 PLN'],
      ['Single vessel / ruby spot', '200 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Nordlys™ Ellipse PR530 laser – laser photorejuvenation', [
      ['Face', '600 PLN'],
      ['Neck', '400 PLN'],
      ['Decolletage', '500 PLN'],
      ['Face + neck', '800 PLN'],
      ['Face + decolletage', '900 PLN'],
      ['Face + neck + decolletage', '1 100 PLN'],
      ['Single vessel / ruby spot', '200 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Nordlys™ Ellipse Frax 1550 laser – resurfacing, skin rejuvenation', [
      ['Face', '1 100 PLN'],
      ['Neck', '500 PLN'],
      ['Decolletage', '800 PLN'],
      ['Face + neck', '1 400 PLN'],
      ['Face + neck + decolletage', '1 700 PLN'],
      ['Hands', '500 PLN'],
      ['Arms', '1 500 PLN'],
      ['Abdomen', '2 000 PLN'],
      ['Treatment mask', '200 PLN'],
    ]),
    productBlock('Nordlys™ Ellipse – combined procedure (Frax + IPL), advanced skin rejuvenation', [
      ['Face', '1 500 PLN'],
      ['Face + neck', '2 000 PLN'],
      ['Face + neck + decolletage', '2 400 PLN'],
    ]),
    productBlock('Nordlys™ Ellipse Nd:YAG laser – leg vein closure', [
      ['Single vessel', '200 PLN'],
      ['Mini treatment (2–5 lesions)', '400 PLN'],
      ['Small treatment (6–10 lesions)', '700 PLN'],
      ['Medium treatment (11–20 lesions)', '1 200 PLN'],
      ['Large treatment (21–30 lesions)', '1 600 PLN'],
    ]),
    productBlock('Nordlys™ Ellipse laser – scar reduction (Frax 1550, IPL)', [
      ['Surgical scars up to 2 cm', '200 PLN'],
      ['Surgical scars 2–5 cm', '250 PLN'],
      ['Surgical scars 5–10 cm', '350 PLN'],
      ['Surgical scars over 10 cm', '400 PLN'],
    ]),
    productBlock('Nordlys™ Ellipse laser – stretch mark reduction (Frax 1550, IPL)', [
      ['Single stretch mark', '250 PLN'],
      ['Area 10 cm × 10 cm', '600 PLN'],
      ['Arms', '1 200 PLN'],
      ['Hips', '1 200 PLN'],
      ['Abdomen', '1 200 PLN'],
      ['Breasts', '1 200 PLN'],
      ['Buttocks', '1 200 PLN'],
      ['Thighs (20 cm × 20 cm area)', '1 200 PLN'],
    ]),
  ].join('\n'),
  depilacja: [
    h3sub('Vectus Palomar laser hair removal'),
    ...[
      ['Face', '350 PLN'],
      ['Upper lip', '200 PLN'],
      ['Sideburns', '200 PLN'],
      ['Chin', '200 PLN'],
      ['Neck', '300 PLN'],
      ['Nape', '300 PLN'],
      ['Abdomen', '400 PLN'],
      ['Chest', '400 PLN'],
      ['Back', '500 PLN'],
      ['Underarms', '300 PLN'],
      ['Nipples', '200 PLN'],
      ['Forearms', '300 PLN'],
      ['Arms', '300 PLN'],
      ['Full arms', '500 PLN'],
      ['Bikini', '500 PLN'],
      ['Buttocks', '400 PLN'],
      ['Intergluteal cleft', '300 PLN'],
      ['Thighs', '400 PLN'],
      ['Calves', '400 PLN'],
      ['Full legs', '600 PLN'],
    ].map(([t, p]) => row(t, p)),
    h3sub('Packages – Vectus Palomar'),
    ...[
      ['Face in a series of 4 treatments (250 PLN/treatment)', '1 000 PLN'],
      ['Upper lip in a series of 4 treatments (150 PLN/treatment)', '600 PLN'],
      ['Sideburns in a series of 4 treatments (150 PLN/treatment)', '600 PLN'],
      ['Chin in a series of 4 treatments (150 PLN/treatment)', '600 PLN'],
      ['Neck in a series of 4 treatments (200 PLN/treatment)', '800 PLN'],
      ['Nape in a series of 4 treatments (200 PLN/treatment)', '800 PLN'],
      ['Abdomen in a series of 4 treatments (300 PLN/treatment)', '1 200 PLN'],
      ['Chest in a series of 4 treatments (300 PLN/treatment)', '1 200 PLN'],
      ['Back in a series of 4 treatments (400 PLN/treatment)', '1 600 PLN'],
      ['Underarms in a series of 4 treatments (200 PLN/treatment)', '800 PLN'],
      ['Nipples in a series of 4 treatments (150 PLN/treatment)', '600 PLN'],
      ['Forearms in a series of 4 treatments (200 PLN/treatment)', '800 PLN'],
      ['Arms in a series of 4 treatments (200 PLN/treatment)', '800 PLN'],
      ['Full arms in a series of 4 treatments (400 PLN/treatment)', '1 600 PLN'],
      ['Bikini in a series of 4 treatments (400 PLN/treatment)', '1 600 PLN'],
      ['Buttocks in a series of 4 treatments (300 PLN/treatment)', '1 200 PLN'],
      ['Intergluteal cleft in a series of 4 treatments (200 PLN/treatment)', '800 PLN'],
      ['Thighs in a series of 4 treatments (300 PLN/treatment)', '1 200 PLN'],
      ['Calves in a series of 4 treatments (300 PLN/treatment)', '1 200 PLN'],
      ['Full legs in a series of 4 treatments (450 PLN/treatment)', '1 800 PLN'],
    ].map(([t, p]) => row(t, p)),
  ].join('\n'),
  masaz: [
    h3sub('Post-procedure body massage'),
    ...[
      ['Manual body massage 40 min', '320 PLN'],
      ['Manual massage after liposuction 40 min', '320 PLN'],
      ['Manual massage after surgical procedures 40 min', '320 PLN'],
      ['Manual scar therapy 30 min', '320 PLN'],
    ].map(([t, p]) => row(t, p)),
    h3sub('LPG® Endermologie'),
    ...[
      ['Body treatment 40 minutes', '290 PLN'],
      ['Body treatment 50 minutes', '340 PLN'],
      ['Body treatment 60 minutes', '390 PLN'],
      ['Endermolift – facial treatment 40 minutes', '290 PLN'],
      ['Bodysuit for body treatment (FREE with package)', '120 PLN'],
    ].map(([t, p]) => row(t, p, 'endermologie-lpg-lipomassage.html')),
    h3sub('Endermologie (Lipomassage™) – supportive therapy'),
    ...[
      ['Endermologie – preparation for surgical procedure – 40 minutes', '290 PLN'],
      ['Regenerative endermologie after surgical procedure – 40 minutes', '290 PLN'],
      ['Endermologie – preparation for liposuction – 40 minutes', '290 PLN'],
      ['Regenerative endermologie after liposuction – 40 minutes', '290 PLN'],
      ['Endermolift – preparation for facial surgery 40 minutes', '290 PLN'],
      ['Regenerative endermolift after facial procedure 40 minutes', '290 PLN'],
    ].map(([t, p]) => row(t, p, 'endermologie-lpg-lipomassage.html')),
    h3sub('LPG® Endermologie packages'),
    ...[
      ['Body treatment 40 min – series of 5 (270 PLN/treatment)', '1 350 PLN'],
      ['Body treatment 40 min – series of 10 (250 PLN/treatment)', '2 500 PLN'],
      ['Body treatment 40 min – series of 15 (225 PLN/treatment)', '3 375 PLN'],
      ['Body treatment 50 min – series of 5 (325 PLN/treatment)', '1 625 PLN'],
      ['Body treatment 50 min – series of 10 (300 PLN/treatment)', '3 000 PLN'],
      ['Body treatment 50 min – series of 15 (275 PLN/treatment)', '4 125 PLN'],
      ['Body treatment 60 min – series of 5 (370 PLN/treatment)', '1 850 PLN'],
      ['Body treatment 60 min – series of 10 (350 PLN/treatment)', '3 500 PLN'],
      ['Body treatment 60 min – series of 15 (325 PLN/treatment)', '4 875 PLN'],
    ].map(([t, p]) => row(t, p, 'endermologie-lpg-lipomassage.html')),
  ].join('\n'),
};

// Fix PL mezoterapia PRP links
pl.mezoterapia = pl.mezoterapia.replace(/podanie-osocza-bogatoplytkowego2.html/g, pl.prpLink);

const section = (id, title, content) => `    <section class="pt-20" id="${id}">
      <div class="container mx-auto px-4">
        <h2 class="text-center text-4xl text-accent">${title}</h2>
        <div class="mx-auto max-w-3xl pt-4">
${content}
        </div>
      </div>
    </section>`;

function buildBlock(lang) {
  const L = lang === 'pl' ? pl : en;
  const mesoId = lang === 'pl' ? 'skora-mezoterapia' : 'skora-mesotherapy';
  return [
    section(
      'skora-stymulatory-tkankowe',
      lang === 'pl' ? 'Stymulatory tkankowe' : 'Tissue stimulators',
      L.stymulatory
    ),
    section(mesoId, lang === 'pl' ? 'Mezoterapia' : 'Mesotherapy', L.mezoterapia),
    section('skora-peelingi', lang === 'pl' ? 'Peelingi' : 'Peels', L.peelingi),
    section('skora-laseroterapia', lang === 'pl' ? 'Laseroterapia' : 'Laser therapy', L.laser),
    section(
      'skora-depilacja-laserowa',
      lang === 'pl' ? 'Depilacja laserowa' : 'Laser hair removal',
      L.depilacja
    ),
    section('skora-masaz-ciala', L.masażTitle, L.masaz),
  ].join('\n\n');
}

function patchFile(filePath, lang) {
  let html = fs.readFileSync(filePath, 'utf8');
  const L = lang === 'pl' ? pl : en;

  html = html.replace(
    /href="#skora-biostymulatory"[\s\S]*?>BIOSTYMULATORY<\/a/,
    `href="${L.navStymulatory.href}"\n            class="block w-full bg-accent px-2 py-5 text-center font-heading text-2xl lowercase text-white transition duration-300 first-letter:uppercase hover:bg-opacity-90"\n            >${L.navStymulatory.label}</a`
  );
  html = html.replace(
    /href="#skora-biostymulatory"[\s\S]*?>BIOSTIMULATORS<\/a/,
    `href="${L.navStymulatory.href}"\n            class="block w-full bg-accent px-2 py-5 text-center font-heading text-2xl lowercase text-white transition duration-300 first-letter:uppercase hover:bg-opacity-90"\n            >${L.navStymulatory.label}</a`
  );

  html = html.replace(
    />\s*MASAŻ CIAŁA\s*<\/a\s*>\s*<a[\s\S]*?href="#skora-argo-plasma"[\s\S]*?>ARGO PLASMA<\/a/,
    `>${L.masażNav}</a`
  );
  html = html.replace(
    />\s*BODY MASSAGE<\/a\s*>\s*<a[\s\S]*?href="#skora-argo-plasma"[\s\S]*?>ARGO PLASMA<\/a/,
    `>BODY MASSAGE</a`
  );

  let start = html.indexOf('    <section class="pt-20" id="skora-stymulatory-tkankowe">');
  if (start === -1) start = html.indexOf('    <section class="pt-20" id="skora-biostymulatory">');
  const end = html.indexOf('    <section class="relative mt-16 bg-accent py-10">');
  if (start === -1 || end === -1) {
    throw new Error(`Markers not found in ${filePath}`);
  }

  html = html.slice(0, start) + buildBlock(lang) + '\n\n' + html.slice(end);
  fs.writeFileSync(filePath, html);
  console.log('Updated', filePath);
}

patchFile(path.join(__dirname, '../dist/cennik.html'), 'pl');
patchFile(path.join(__dirname, '../dist/en/pricing.html'), 'en');
