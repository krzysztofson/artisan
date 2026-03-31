/**
 * Comprehensive content translation script for Artisan Clinic EN pages.
 * Handles all common Polish phrases found in procedure pages.
 */
const fs = require('fs');
const path = require('path');

const EN_DIR = path.join(__dirname, '..', 'dist', 'en');

// ─────────────────────────────────────────────────────────────────────────────
// Translation dictionary: ordered from longest/most specific to shortest
// ─────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS = [

  // ── Reviews section ────────────────────────────────────────────────────────
  ['Opinie pozabiegowe naszych Pacjentek', 'Post-procedure reviews from our patients'],
  ['Opinie naszych Pacjentek', 'Reviews from our patients'],
  ['Opinie naszych Pacjentów', 'Reviews from our patients'],
  ['Opinie naszych pacjentów', 'Reviews from our patients'],
  ['Opinie pozabiegowe', 'Post-procedure reviews'],
  ['Bardzo dobry i doświadczony lekarz. Pewna ręka. Ma też świetny zespół ludzi. Polecam, jeśli nie chcesz martwić się o wynik operacji. Dla mnie najlepszy.',
   'A very good and experienced doctor. Steady hand. He also has a great team. I recommend him if you don\'t want to worry about the outcome of the surgery. The best for me.'],
  ['Miałam u Pana Doktora zabieg korekcji uszu. Uszy po zabiegu są piekne! Rekonwalescencja przebiega bez problemów, sam zabieg był szybki i bezproblemowy. Polecam',
   'I had an ear correction procedure with the Doctor. My ears look beautiful after the procedure! Recovery is going smoothly, the procedure itself was quick and problem-free. I recommend.'],
  ['Olbrzymia wiedza, doświadczenie, kompetencje - niczego więcej pacjent nie potrzebuje. Szczerze polecam zawierzyć i oddać się w ręce Pana Doktora i jego Zespołu Specjalistów.',
   'Vast knowledge, experience, and competence – nothing more is needed. I sincerely recommend trusting yourself to the Doctor and his Team of Specialists.'],
  ['Pan doktor bardzo kontaktowy i konkretny. Widać zaangażowanie i chęć pomocy. Recepcja też przyjazna obsługa',
   'The doctor is very approachable and straightforward. You can see the commitment and willingness to help. The reception is also friendly.'],
  ['>Więcej<', '>More reviews<'],

  // ── Contact section ─────────────────────────────────────────────────────────
  ['Skontaktuj się z nami:', 'Get in touch:'],
  ['Skontaktuj się z nami', 'Get in touch'],
  ['Artisan Clinic (zabiegi)', 'Artisan Clinic (procedures)'],
  ['Klinika Dr Witwicki (konsultacje)', 'Dr Witwicki Clinic (consultations)'],
  ['alt="zespół recepcji"', 'alt="reception team"'],
  ['>Umów wizytę<', '>Book Appointment<'],

  // ── Footer ──────────────────────────────────────────────────────────────────
  ['Projekt strony - Krzysztof Dąbrowski', 'Website design - Krzysztof Dąbrowski'],
  ['Projekt strony', 'Website design'],
  ['>Strefa pacjenta<', '>Patient Zone<'],

  // ── Common section headings ──────────────────────────────────────────────────
  ['Wskazania do zabiegu:', 'Indications for the procedure:'],
  ['Wskazania do zabiegu', 'Indications for the procedure'],
  ['Wskazania:', 'Indications:'],
  ['Wskazania', 'Indications'],
  ['Przed zabiegiem:', 'Before the procedure:'],
  ['Przed zabiegiem', 'Before the procedure'],
  ['Przed&nbsp;operacją:', 'Before the surgery:'],
  ['Przed operacją:', 'Before the surgery:'],
  ['Przed operacją', 'Before the surgery'],
  ['Rodzaj znieczulenia:', 'Type of anesthesia:'],
  ['Rodzaj znieczulenia', 'Type of anesthesia'],
  ['Czas trwania zabiegu:', 'Duration of the procedure:'],
  ['Czas trwania zabiegu', 'Duration of the procedure'],
  ['Czas trwania operacji:', 'Duration of the surgery:'],
  ['Czas trwania operacji', 'Duration of the surgery'],
  ['Przebieg zabiegu:', 'Course of the procedure:'],
  ['Przebieg zabiegu', 'Course of the procedure'],
  ['Przebieg operacji:', 'Course of the surgery:'],
  ['Przebieg operacji', 'Course of the surgery'],
  ['Zalecenia pooperacyjne:', 'Postoperative recommendations:'],
  ['Zalecenia pooperacyjne', 'Postoperative recommendations'],
  ['Czas rekonwalescencji:', 'Recovery time:'],
  ['Czas rekonwalescencji', 'Recovery time'],
  ['Efekt zabiegu:', 'Result of the procedure:'],
  ['Efekt zabiegu', 'Result of the procedure'],
  ['Efekty zabiegu:', 'Results of the procedure:'],
  ['Efekty zabiegu', 'Results of the procedure'],
  ['Konsultacja wstępna:', 'Initial consultation:'],
  ['Konsultacja wstępna', 'Initial consultation'],
  ['Przygotowanie do zabiegu:', 'Preparation for the procedure:'],
  ['Przygotowanie do zabiegu', 'Preparation for the procedure'],
  ['Ogólne zalecenia żywieniowe&nbsp;dietetyka&nbsp;przed&nbsp;zabiegiem:', 'General nutritional recommendations before the procedure:'],
  ['Ogólne zalecenia żywieniowe dietetyka przed zabiegiem:', 'General nutritional recommendations before the procedure:'],
  ['zalecenia dietetyka przed zabiegiem', 'nutritional recommendations before the procedure'],
  ['zalecenia dietetyka po zabiegu', 'nutritional recommendations after the procedure'],
  ['zalecenia żywieniowe przed zabiegiem', 'nutritional recommendations before the procedure'],
  ['zalecenia żywieniowe po zabiegu', 'nutritional recommendations after the procedure'],
  ['zalecenia dietetyczne przed zabiegiem', 'dietary recommendations before the procedure'],

  // ── Common dietary text (long paragraphs) ────────────────────────────────────
  ['W celu lepszego przygotowania do zabiegu warto zastosować się również do zaleceń żywieniowych. Dieta przed zabiegiem nie może być restrykcyjna, gdyż niedobór białka utrudnia gojenie się ran pooperacyjnych. Warto jednak wprowadzić pewne modyfikacje. Dieta powinna być lekkostrawna, a produkty tłuste i powodujące wzdęcia wyeliminowane. Należy bezwzględnie zrezygnować z palenia papierosów i picia alkoholu.',
   'For better preparation for the procedure, it is advisable to follow nutritional guidelines. The pre-procedure diet should not be restrictive, as protein deficiency will impede the healing of postoperative wounds. However, certain modifications are recommended. The diet should be easily digestible, and fatty and flatulence-causing products should be eliminated. Smoking and alcohol consumption must be stopped entirely.'],
  ['W&nbsp;celu lepszego przygotowania do&nbsp;zabiegu warto zastosować się również do&nbsp;zaleceń żywieniowych. Dieta przed&nbsp;zabiegiem nie&nbsp;może być restrykcyjna, gdyż&nbsp;niedobór białka utrudnia gojenie się ran pooperacyjnych. Warto jednak wprowadzić pewne modyfikacje. Dieta powinna być lekkostrawna, a&nbsp;produkty tłuste i&nbsp;wzdymające powinny być wyeliminowane. Należy zrezygnować z&nbsp;palenia papierosów i&nbsp;picia alkoholu.',
   'For better preparation for the procedure, it is advisable to follow nutritional guidelines. The pre-procedure diet should not be restrictive, as protein deficiency will impede the healing of postoperative wounds. However, certain modifications are recommended. The diet should be easily digestible, and fatty and flatulence-causing products should be eliminated. Smoking and alcohol consumption must be stopped.'],
  ['Warto również zwrócić uwagę na farmaceutyki, które mogą powodować nadmierne krwawienie np. preparaty z witaminą E, ginkofar oraz leki zawierające kwas acetylosalicylowy (aspiryna i jej pochodne). Zalecane jest również unikanie niektórych przypraw: chili, pieprz cayenne, czosnek, imbir, szafran, cebula, seler i chrzan mogą zwiększać ryzyko krwawienia.',
   'Attention should also be paid to medications that may cause excessive bleeding, such as vitamin E supplements, ginkgo biloba, and medications containing acetylsalicylic acid (aspirin and its derivatives). It is also recommended to avoid certain spices: chili, cayenne pepper, garlic, ginger, saffron, onion, celery, and horseradish may increase the risk of bleeding.'],
  ['Warto&nbsp;również zwrócić uwagę na&nbsp;preparaty, które mogą powodować nadmierne krwawienie np.&nbsp;preparaty z&nbsp;witaminą E, ginkofar oraz&nbsp;leki zawierające kwas acetylosalicylowy (aspiryna i&nbsp;jej pochodne).&nbsp; Także chili, cayenne, czosnek, imbir, szafran, cebula, seler i&nbsp;chrzan mogą zwiększać ryzyko krwawienia.',
   'Attention should also be paid to preparations that may cause excessive bleeding, such as vitamin E supplements, ginkgo biloba, and medications containing acetylsalicylic acid (aspirin and its derivatives). Chili, cayenne, garlic, ginger, saffron, onion, celery, and horseradish may also increase the risk of bleeding.'],

  // ── Anesthesia types ─────────────────────────────────────────────────────────
  ['Znieczulenie ogólne.', 'General anesthesia.'],
  ['znieczuleniu ogólnym', 'general anesthesia'],
  ['znieczulenie ogólne', 'general anesthesia'],
  ['znieczuleniu miejscowym', 'local anesthesia'],
  ['znieczulenie miejscowe', 'local anesthesia'],
  ['znieczuleniu dożylnym', 'intravenous anesthesia'],
  ['znieczulenie dożylne', 'intravenous anesthesia'],
  ['znieczuleniu miejscowym lub dożylnym', 'local or intravenous anesthesia'],
  ['Miejscowe lub dożylne', 'Local or intravenous'],
  ['Ogólne.', 'General anesthesia.'],
  ['Dożylne + miejscowe.', 'Intravenous + local.'],
  ['Dożylne + miejscowe', 'Intravenous + local'],

  // ── Common medical & clinic phrases ──────────────────────────────────────────
  ['Klinika Artisan', 'Artisan Clinic'],
  ['Kliniki Artisan', 'Artisan Clinic'],
  ['chirurg plastyczny', 'plastic surgeon'],
  ['chirurg-plastyk', 'plastic surgeon'],
  ['chirurga plastycznego', 'plastic surgeon'],
  ['chirurga-plastyka', 'plastic surgeon'],
  ['lekarz anestezjolog', 'anesthesiologist'],
  ['lekarza anestezjologa', 'anesthesiologist'],
  ['lekarz specjalista', 'specialist doctor'],
  ['ran pooperacyjnych', 'postoperative wounds'],
  ['rany pooperacyjne', 'postoperative wounds'],
  ['badania przedoperacyjne', 'preoperative tests'],
  ['zalecenia przedoperacyjne', 'preoperative recommendations'],
  ['zalecenia pooperacyjne', 'postoperative recommendations'],
  ['środki przeciwbólowe', 'pain relief medications'],
  ['środków przeciwbólowych', 'pain relief medications'],
  ['biustonosz pooperacyjny', 'postoperative bra'],
  ['biustonosza pooperacyjnego', 'postoperative bra'],
  ['bielizna uciskowa', 'compression garment'],
  ['ubranie uciskowe', 'compression garment'],
  ['drenaż limfatyczny', 'lymphatic drainage'],
  ['karboxyterapia', 'carboxytherapy'],
  ['karboksyterapia', 'carboxytherapy'],
  ['komórki macierzyste', 'stem cells'],
  ['komórkami macierzystymi', 'stem cells'],
  ['osocze bogatopłytkowe', 'platelet-rich plasma'],
  ['osocza bogatopłytkowego', 'platelet-rich plasma'],
  ['PRP', 'PRP'],
  ['kwas hialuronowy', 'hyaluronic acid'],
  ['kwasem hialuronowym', 'hyaluronic acid'],
  ['kwasu hialuronowego', 'hyaluronic acid'],
  ['botoks', 'botulinum toxin (botox)'],
  ['botulina', 'botulinum toxin'],
  ['toksyna botulinowa', 'botulinum toxin'],
  ['nici Aptos', 'Aptos threads'],
  ['nićmi Aptos', 'Aptos threads'],
  ['nicmi Aptos', 'Aptos threads'],
  ['implant piersi', 'breast implant'],
  ['implantów piersi', 'breast implants'],
  ['implanty piersi', 'breast implants'],
  ['otoczka brodawki sutkowej', 'areola'],
  ['brodawka sutkowa', 'nipple'],
  ['brodawki sutkowej', 'nipple'],
  ['powieki górne', 'upper eyelids'],
  ['powieki dolne', 'lower eyelids'],
  ['powiek górnych', 'upper eyelids'],
  ['powiek dolnych', 'lower eyelids'],
  ['tkanka tłuszczowa', 'adipose tissue / fat'],
  ['tkanki tłuszczowej', 'adipose tissue'],
  ['nadmiar tkanki tłuszczowej', 'excess fat / adipose tissue'],
  ['rekonstrukcja piersi', 'breast reconstruction'],
  ['rekonstrukcji piersi', 'breast reconstruction'],
  ['powiększanie piersi', 'breast augmentation'],
  ['powiększenia piersi', 'breast augmentation'],
  ['zmniejszenie piersi', 'breast reduction'],
  ['redukcja piersi', 'breast reduction'],
  ['redukcji piersi', 'breast reduction'],
  ['mammoplastyka', 'mammoplasty'],
  ['mastektomia', 'mastectomy'],
  ['ekspander', 'expander'],
  ['liposukcja', 'liposuction'],
  ['liposukcji', 'liposuction'],
  ['lipofilling', 'lipofilling'],
  ['przeszczep tłuszczu', 'fat transfer'],
  ['przeszczepu tłuszczu', 'fat transfer'],
  ['plastyka brzucha', 'tummy tuck / abdominoplasty'],
  ['plastyki brzucha', 'tummy tuck / abdominoplasty'],
  ['abdominoplastyka', 'abdominoplasty'],
  ['blizna', 'scar'],
  ['blizny', 'scars'],
  ['blizn', 'scars'],
  ['obrzęk', 'swelling'],
  ['obrzęku', 'swelling'],
  ['siniaki', 'bruises'],
  ['siniaków', 'bruises'],
  ['szwy', 'sutures'],
  ['szwów', 'sutures'],
  ['zakładanie szwów', 'suturing'],
  ['zakładanie opatrunków', 'applying dressings'],
  ['opatrunki', 'dressings'],
  ['nacięcie', 'incision'],
  ['nacięcia', 'incisions'],
  ['cięcie', 'incision'],
  ['kaniula', 'cannula'],
  ['endermologia', 'endermologie'],
  ['mezoterapia', 'mesotherapy'],
  ['fototerapia', 'phototherapy'],
  ['fotoodmładzanie', 'photorejuvenation'],
  ['rewitalizacja skóry', 'skin revitalization'],
  ['rewitalizacja', 'revitalization'],
  ['redermalizacja', 'redermalization'],
  ['resurfacing', 'resurfacing'],
  ['depilacja laserowa', 'laser hair removal'],
  ['flebologia', 'phlebology'],
  ['pajączki', 'spider veins'],
  ['teleangiektazje', 'telangiectasia'],
  ['żylaki', 'varicose veins'],
  ['ginekomastia', 'gynecomastia'],
  ['plastyka warg sromowych', 'labiaplasty'],
  ['zmniejszenie warg sromowych', 'labiaplasty'],
  ['korekcja nosa', 'rhinoplasty / nose correction'],
  ['korekta nosa', 'rhinoplasty / nose correction'],
  ['korekta uszu', 'ear correction / otoplasty'],
  ['plastyka uszu', 'ear correction / otoplasty'],
  ['plastyka powiek', 'eyelid surgery / blepharoplasty'],
  ['korekcja powiek', 'eyelid surgery / blepharoplasty'],
  ['lifting twarzy', 'face lift'],
  ['liftingu twarzy', 'face lift'],
  ['plastyka ramion', 'arm lift / brachioplasty'],
  ['plastyki ramion', 'arm lift / brachioplasty'],
  ['plastyka ud', 'thigh lift'],
  ['plastyki ud', 'thigh lift'],
  ['plastyka łydek', 'calf augmentation'],
  ['chirurgia ręki', 'hand surgery'],
  ['chirurgia przepukliny', 'hernia surgery'],
  ['przepuklina', 'hernia'],
  ['przepukliny', 'hernias'],
  ['wycięcie zmiany', 'lesion excision'],
  ['wycięcie znamienia', 'mole removal'],
  ['wycięcie znamion', 'mole removal'],
  ['znamię', 'mole / nevus'],
  ['znamiona', 'moles / nevi'],
  ['zmiana nowotworowa', 'neoplastic lesion'],

  // ── Common action phrases ─────────────────────────────────────────────────────
  ['Przed zabiegiem niezbędna jest konsultacja', 'Before the procedure, a consultation is necessary'],
  ['niezbędna jest konsultacja', 'a consultation is necessary'],
  ['podczas konsultacji', 'during the consultation'],
  ['w trakcie konsultacji', 'during the consultation'],
  ['Po konsultacji', 'After the consultation'],
  ['Bezpieczeństwo Pacjentek jest naszym priorytetem', 'The safety of our patients is our priority'],
  ['Bezpieczeństwo pacjentów jest naszym priorytetem', 'The safety of our patients is our priority'],
  ['pod opieką wykwalifikowanego personelu medycznego', 'under the care of qualified medical staff'],
  ['Pacjentka pozostaje jedną dobę', 'The patient stays for one day'],
  ['Pacjent/-ka pozostaje', 'The patient stays'],
  ['Należy wykonać szereg badań', 'A series of tests must be performed'],
  ['zlecane są podczas konsultacji ze specjalistą', 'ordered during the consultation with a specialist'],
  ['zlecane są&nbsp;podczas konsultacji ze&nbsp;specjalistą', 'ordered during the consultation with a specialist'],
  ['Polecam', 'I recommend'],
  ['polecam', 'I recommend'],
  ['Polecam.', 'I recommend.'],

  // ── Body part names (ONLY as standalone headings - safe to replace) ───────────
  // Note: short word replacements removed to avoid corrupting longer sentences

  // ── Location terms ───────────────────────────────────────────────────────────
  ['Warszawa', 'Warsaw'],
  ['Warszawie', 'Warsaw'],
  ['ul.', 'ul.'],

  // ── Common time/duration phrases ─────────────────────────────────────────────
  ['od momentu podania znieczulenia', 'from the moment anesthesia is administered'],
  ['tygodnie po operacji', 'weeks after surgery'],
  ['miesięcy po operacji', 'months after surgery'],
  ['miesiące po operacji', 'months after surgery'],
  ['po zabiegu', 'after the procedure'],
  ['po operacji', 'after the surgery'],
  ['przed zabiegiem', 'before the procedure'],
  ['przed operacją', 'before the surgery'],
  ['w trakcie zabiegu', 'during the procedure'],
  ['podczas zabiegu', 'during the procedure'],

  // ── Procedure-specific translations ──────────────────────────────────────────
  // Breast augmentation
  ['Powiększanie piersi implantami - konsultacja wstępna', 'Breast Augmentation with Implants – Initial Consultation'],
  ['Powiększanie piersi implantami - zalecenia dietetyka przed zabiegiem', 'Breast Augmentation with Implants – Nutritional Recommendations Before the Procedure'],
  ['Powiększanie piersi implantami – rodzaj znieczulenia', 'Breast Augmentation with Implants – Type of Anesthesia'],
  ['Powiększanie piersi implantami – czas trwania zabiegu', 'Breast Augmentation with Implants – Duration of the Procedure'],
  ['Powiększanie piersi implantami – przebieg zabiegu', 'Breast Augmentation with Implants – Course of the Procedure'],
  ['Powiększenie piersi implantami – po zabiegu', 'Breast Augmentation with Implants – After the Procedure'],
  ['Powiększanie piersi implantami – zalecenia pooperacyjne', 'Breast Augmentation with Implants – Postoperative Recommendations'],
  ['Powiększanie piersi implantami – czas rekonwalescencji', 'Breast Augmentation with Implants – Recovery Time'],
  ['Powiększanie piersi implantami', 'Breast Augmentation with Implants'],
  ['Powiększenie piersi implantami', 'Breast Augmentation with Implants'],
  // Breast reduction
  ['Zmniejszenie (redukcja) piersi - konsultacja wstępna', 'Breast Reduction – Initial Consultation'],
  ['Zmniejszenie (redukcja) piersi - zalecenia dietetyka przed zabiegiem', 'Breast Reduction – Nutritional Recommendations Before the Procedure'],
  ['Zmniejszenie (redukcja) piersi – rodzaj znieczulenia', 'Breast Reduction – Type of Anesthesia'],
  ['Zmniejszenie (redukcja) piersi – czas trwania zabiegu', 'Breast Reduction – Duration of the Procedure'],
  ['Zmniejszenie (redukcja) piersi – przebieg zabiegu', 'Breast Reduction – Course of the Procedure'],
  ['Zmniejszenie (redukcja) piersi – po zabiegu', 'Breast Reduction – After the Procedure'],
  ['Zmniejszenie (redukcja) piersi – zalecenia pooperacyjne', 'Breast Reduction – Postoperative Recommendations'],
  ['Zmniejszenie (redukcja) piersi', 'Breast Reduction'],
  // Liposuction
  ['Zalety liposukcji:', 'Benefits of liposuction:'],
  ['Dr&nbsp;Witwicki o&nbsp;liposukcji –&nbsp;w&nbsp;tym laserowej SlimLipo™ 3D:', 'Dr Witwicki on liposuction – including laser SlimLipo™ 3D:'],
  ['Modelowanie sylwetki metodą liposukcji\u00a0pozwala na\u00a0uzyskanie równomiernego i\u00a0przewidywalnego efektu. Trzeba jednak liczyć się z\u00a0okresem rekonwalescencji, który\u00a0wymagać będzie szczególnej dbałości o\u00a0okolice poddane zabiegowi (bielizna specjalistyczna zapobiegająca nierównościom i\u00a0zbieraniu się płynu, masaże typu drenaż limfatyczny –\u00a0endermologia).',
   'Body contouring through liposuction allows for a smooth and predictable result. However, one must account for a recovery period requiring special care of the treated area (compression garments to prevent irregularities and fluid accumulation, lymphatic drainage massages – endermologie).'],
  ['Ujędrniona skóra', 'Firmer skin'],
  ['Gładsza skóra', 'Smoother skin'],
  ['Łatwiejsza dostępność\u00a0– możliwość wykonania zabiegu zarówno w\u00a0znieczuleniu miejscowym, jak i\u00a0dożylnym',
   'Greater accessibility – the procedure can be performed under both local and intravenous anesthesia'],
  ['Dostępność\u00a0– możliwość przeprowadzenia zabiegu w\u00a0każdym miejscu ciała, gdzie pojawiła się zwiotczała skóra (np.\u00a0szyja, podbródek, brzuch, plecy, pośladki, inne obszary z\u00a0nadmiarem tkanki tłuszczowej).',
   'Availability – the procedure can be performed anywhere on the body where skin laxity has appeared (e.g., neck, chin, abdomen, back, buttocks, other areas with excess fat).'],
  ['nadmiar tkanki tłuszczowej,', 'excess adipose tissue,'],
  ['zwiotczała, obwisła skóra.', 'lax, sagging skin.'],
  ['Należy wykonać szereg badań, które zlecane są\u00a0podczas konsultacji ze\u00a0specjalistą', 'A series of tests must be performed, as ordered during the consultation with a specialist'],
  ['Miejscowe lub dożylne', 'Local or intravenous'],
  ['W\u00a0zależności od\u00a0okolicy poddanej zabiegowi, 1-2 godziny.', 'Depending on the area treated, 1-2 hours.'],
  ['Po\u00a0znieczuleniu, lekarz wykonuje nacięcie ok. 2 mm, w\u00a0który\u00a0wprowadza kaniulę. Tkanka tłuszczowa jest delikatnie usuwana za\u00a0pomocą odessania.',
   'After anesthesia, the doctor makes an incision of approximately 2 mm through which a cannula is inserted. Adipose tissue is gently removed by suction.'],
  ['Po\u00a0zakończeniu zabiegu na\u00a0obszar zabiegowy nakładane jest specjalne ubranie uciskowe, które należy nosić przez\u00a0ok. dwa tygodnie. W\u00a0celu polepszenia efektu i\u00a0przyspieszenia rekonwalescencji polecane są\u00a0zabiegi z\u00a0zakresu endermologii.',
   'After the procedure, a special compression garment is applied to the treated area and must be worn for approximately two weeks. To improve results and speed up recovery, endermologie treatments are recommended.'],
  // Tummy tuck
  ['Dr\u00a0Tadeusz Witwicki o\u00a0plastyce brzucha:', 'Dr Tadeusz Witwicki on tummy tuck / abdominoplasty:'],
  ['Na czym polega abdominoplastyka czyli korekcja brzucha np. po ciąży?', 'What does abdominoplasty (tummy tuck) involve, e.g., after pregnancy?'],
  ['Przed\u00a0przystąpieniem do\u00a0zabiegu plastyki brzucha niezbędna jest konsultacja ze\u00a0specjalistą, podczas której\u00a0pacjent/-ka jest informowany/-a o\u00a0koniecznych cięciach, bliznach a\u00a0także o\u00a0przewidywanym efekcie. Lekarz ocenia czy\u00a0nie\u00a0ma\u00a0przepuklin w\u00a0obrębie powłok brzusznych. Po\u00a0operacji najczęściej zostaje jedynie blizna pozioma w\u00a0okolicy nadłonowej oraz\u00a0zawsze blizna wokół pępka. Niekiedy istnieje konieczność pozostawienia blizny pionowej.',
   'Before the tummy tuck procedure, a consultation with a specialist is necessary, during which the patient is informed about the necessary incisions, scars, and the expected outcome. The doctor assesses whether there are any hernias in the abdominal wall. After surgery, typically only a horizontal scar in the suprapubic area remains, along with a scar around the navel. Sometimes a vertical scar is unavoidable.'],
  ['Przed\u00a0samym zabiegiem plastyki brzucha należy wykonać\u00a0szereg badań.', 'Before the tummy tuck procedure itself, a series of tests must be performed.'],
  ['Proszę pamiętać o\u00a0EKG (pacjentki powyżej 40\u00a0r. życia).', 'Please remember the ECG (patients over 40 years of age).'],
  ['Pacjent/-ka konsultuje się również z\u00a0anestezjologiem, aby uzgodnić szczegóły znieczulenia i\u00a0zwiększyć jego bezpieczeństwo.',
   'The patient also consults with an anesthesiologist to agree on the details of anesthesia and ensure safety.'],
  // Breast reduction specific
  ['Przed zabiegiem mammoplastyki niezbędna jest konsultacja, podczas której Pacjentka prezentuje swoje oczekiwania (wielkość zmniejszonych piersi) oraz poznaje operacyjne sposoby ich redukcji. W trakcie konsultacji chirurg-plastyk, uwzględniając budowę anatomiczną oraz indywidualne preferencje Pacjentki, proponuje optymalny dla niej wygląd zmniejszonych piersi oraz omawia planowaną technikę operacyjną.',
   'Before the mammoplasty procedure, a consultation is necessary during which the patient presents her expectations (the desired size of the reduced breasts) and learns about the surgical methods of reduction. During the consultation, the plastic surgeon, taking into account the anatomical structure and individual preferences of the patient, proposes the optimal appearance of the reduced breasts and discusses the planned surgical technique.'],
  ['Zabieg mammoplastyki wykonywany jest w znieczuleniu ogólnym.', 'The mammoplasty procedure is performed under general anesthesia.'],
  ['Zabieg mammoplastyki od momentu podania znieczulenia do założenia specjalnego biustonosza trwa około 3 godzin.',
   'The mammoplasty procedure, from the moment anesthesia is administered to the fitting of a special bra, takes approximately 3 hours.'],
  ['Zabieg mammoplastyki wykonywany jest w znieczuleniu ogólnym. Istnieją różne techniki operacyjne. Najczęściej chirurg plastyk wykonuje cięcie w kształcie litery T (wokół sutka, następnie pionowo w dół piersi i poziomo wzdłuż fałdu skórnego pod piersią). Niezależnie od wybranej techniki operacyjnej, podczas zabiegu operator usuwa nadmiar tkanki gruczołowej i tłuszczowej, a czasami wycina także nadmiar skóry. Zabieg jest przeprowadzany z dbałością o zachowanie nerwów i gruczołów mlekowych. Następnie zmniejsza i przemieszcza ku górze otoczkę z brodawką. Po założeniu szwów nakładany jest specjalny biustonosz, podtrzymujący i modelujący piersi. Usunięte fragmenty piersi są wysyłane do badania histopatologicznego.',
   'The mammoplasty procedure is performed under general anesthesia. Various surgical techniques exist. Most commonly, the plastic surgeon makes a T-shaped incision (around the nipple, then vertically down the breast and horizontally along the skin fold under the breast). Regardless of the chosen technique, the surgeon removes excess glandular and fatty tissue and sometimes also excises excess skin. The procedure is performed with care to preserve the nerves and mammary glands. The areola with the nipple is then reduced and moved upward. After suturing, a special bra is applied to support and shape the breasts. The removed breast tissue is sent for histopathological examination.'],
  ['Po zabiegu mammoplastyki Pacjentka pozostaje jedną dobę pod opieką wykwalifikowanego personelu medycznego Kliniki Artisan. Po zabiegu przez kilka dni może utrzymywać się obrzęk i tkliwość. Utrzymujące się przez kilka dni dolegliwości bólowe można zniwelować, stosując zalecone przez lekarza środki przeciwbólowe.',
   'After the mammoplasty procedure, the patient stays for one day under the care of qualified medical staff at Artisan Clinic. Swelling and tenderness may persist for several days after the procedure. Pain that persists for several days can be alleviated using pain relief medications recommended by the doctor.'],
  // Breast augmentation content
  ['Przed zabiegiem powiększania piersi implantami niezbędna jest konsultacja, podczas której pacjentka dokonuje wyboru odpowiadających jej implantów oraz metody ich wprowadzenia. W trakcie konsultacji chirurg-plastyk wizualizuje i proponuje optymalny dla Pacjentki rozmiar i kształt implantu. W Klinice Artisan wykorzystujemy wyłącznie implanty renomowanych firm. Oferujemy implanty o różnej objętości i w różnych kształtach np. okrągłe lub anatomiczne. Implanty różnią się także profilem czyli stopniem wypukłości. Szeroka gama wykorzystywanych przez nas implantów pozwala na dobranie ich odpowiedniego rozmiaru, kształtu i profilu do indywidualnych preferencji Pacjentki oraz do jej budowy anatomicznej.',
   'Before the breast augmentation procedure, a consultation is necessary during which the patient selects implants that suit her and the method of placement. During the consultation, the plastic surgeon visualizes and proposes the optimal implant size and shape for the patient. At Artisan Clinic, we use only implants from reputable manufacturers. We offer implants of various volumes and shapes, e.g., round or anatomical. Implants also differ in profile, i.e., the degree of projection. The wide range of implants we use allows us to select the appropriate size, shape, and profile according to the patient\'s individual preferences and anatomical structure.'],
  ['Doświadczenie i wiedza naszych lekarzy pozwalają na optymalny wybór implantów oraz metody ich wprowadzenia.',
   'The experience and knowledge of our doctors enable the optimal selection of implants and the method of placement.'],
  ['Bezpieczeństwo Pacjentek jest naszym priorytetem, każda z Pań spotyka się przed operacją z lekarzem anestezjologiem, aby uzgodnić szczegóły znieczulenia podczas zabiegu.',
   'The safety of our patients is our priority; each patient meets with an anesthesiologist before the operation to agree on the details of anesthesia.'],
  ['Po konsultacji każda z Pacjentek otrzymuje szczegółowe zalecenia przedoperacyjne wraz z informacją o badaniach, które powinna wykonać przed zabiegiem.',
   'After the consultation, each patient receives detailed preoperative recommendations along with information about the tests that should be performed before the procedure.'],
  ['Zabieg powiększenia piersi implantami wykonywany jest w znieczuleniu ogólnym.',
   'The breast augmentation procedure is performed under general anesthesia.'],
  ['Zabieg powiększenia piersi implantami od momentu podania znieczulenia do założenia specjalnego biustonosza trwa od 1,5 do 2 godzin.',
   'The breast augmentation procedure, from the moment anesthesia is administered to the fitting of a special bra, takes 1.5 to 2 hours.'],
  ['Zabieg wykonywany jest w znieczuleniu ogólnym. Chirurg-plastyk wykonuje kilkucentymetrowe nacięcie w fałdzie podpiersiowym lub na brzegu otoczki brodawki sutkowej i unosi mięsień piersiowy większy tworząc „kieszeń", w której umieszcza dopasowany wcześniej implant. Taka lokalizacja sprawia, że implant jest mało widoczny oraz zmniejsza ryzyko wystąpienia powikłań w postaci przykurczu torebki sprawiając równocześnie, że piersi są naturalne w dotyku. Po umieszczeniu implantów chirurg zamyka nacięcia, zakładając szwy i opatrunki. Zabieg kończy założenie specjalnego biustonosza pooperacyjnego, który pełni równocześnie rolę opatrunku oraz pomaga uzyskać optymalny kształt piersi, modelując i stabilizując implanty.',
   'The procedure is performed under general anesthesia. The plastic surgeon makes a small incision in the inframammary fold or at the edge of the areola and lifts the pectoralis major muscle to create a "pocket" in which the previously fitted implant is placed. This location makes the implant less visible and reduces the risk of capsular contracture, while ensuring that the breasts feel natural to the touch. After placing the implants, the surgeon closes the incisions with sutures and dressings. The procedure concludes with the fitting of a special postoperative bra, which also serves as a dressing and helps achieve the optimal breast shape by modeling and stabilizing the implants.'],
  ['Po zabiegu Pacjentka pozostaje jedną dobę pod opieką wykwalifikowanego personelu medycznego Kliniki Artisan. Utrzymujące się przez kilka dni: bolesność, tkliwość oraz uczucie rozpierania w klatce piersiowej można zniwelować, stosując zalecone przez lekarza środki przeciwbólowe. Niektóre Pacjentki sygnalizują obniżone czucie w obrębie brodawki. Ma ono charakter przejściowy i ustępuje po kilku miesiącach.',
   'After the procedure, the patient stays for one day under the care of qualified medical staff at Artisan Clinic. Pain, tenderness, and a feeling of pressure in the chest that persists for several days can be alleviated using pain relief medications recommended by the doctor. Some patients report reduced sensation around the nipple. This is temporary and resolves after a few months.'],
  ['W przypadku dolegliwości bólowych wskazane jest stosowanie zalecanych przez lekarza środków przeciwbólowych.',
   'In case of pain, it is recommended to use pain relief medications recommended by the doctor.'],
  ['Przez 6-8 tygodni konieczne jest noszenie specjalnego biustonosza pooperacyjnego, zapewniającego stabilizację implantom.',
   'For 6-8 weeks, it is necessary to wear a special postoperative bra to stabilize the implants.'],
  ['Blizny pooperacyjne po powiększeniu piersi implantami są z reguły mało widoczne, jednak od 3 tygodnia po operacji zalecane jest stosowanie plastrów lub maści na blizny. Gojące się blizny należy zacząć masować po 4 tygodniach od operacji. Wskazany jest również masaż piersi.',
   'Postoperative scars after breast augmentation with implants are generally not very visible, but from the 3rd week after surgery, it is recommended to use scar patches or ointments. Healing scars should be massaged starting 4 weeks after surgery. Breast massage is also recommended.'],

  // ── Common introductory text patterns ────────────────────────────────────────
  ['Artisan Clinic to nowoczesna klinika chirurgii plastycznej i medycyny estetycznej w Warszawie. Nasza nazwa nie jest przypadkowa, pochodzi od dwóch ważnych dla nas słów - art, czyli sztuka i sanatio oznaczające uzdrowienie. Artisan to nazwa odzwierciedlająca nasze poczucie estetyki, harmonii, piękna, precyzji i szacunku dla zdrowia pacjenta.',
   'Artisan Clinic is a modern plastic surgery and aesthetic medicine clinic in Warsaw. Our name is not coincidental – it comes from two words important to us: "art" meaning artistry, and "sanatio" meaning healing. Artisan is a name that reflects our sense of aesthetics, harmony, beauty, precision, and respect for the patient\'s health.'],
  ['Piersi to nieodłączny atrybut kobiecości. Piękny i jędrny biust to marzenie wielu kobiet, nie wszystkie jednak zostały nim obdarzone przez naturę. Zbyt małe lub zbyt duże piersi, asymetria w ich wyglądzie czy zmiana objętości spowodowana ciążą, karmieniem piersią czy dużą utratą wagi, mogą powodować duży dyskomfort. Klinika Artisan istnieje po to, aby zadbać o dobrostan naszych Pacjentek. Oferujemy Paniom zabiegi, które podkreślają atuty kobiecego ciała, pozwalają skorygować niedoskonałości natury i sprawiają, że nasze Pacjentki czują się piękne.',
   'Breasts are an inseparable attribute of femininity. Beautiful and firm breasts are the dream of many women, though not all have been naturally endowed with them. Breasts that are too small or too large, asymmetry in their appearance, or changes in volume caused by pregnancy, breastfeeding, or significant weight loss can cause significant discomfort. Artisan Clinic exists to take care of the well-being of our patients. We offer procedures that highlight the assets of the female body, allow for the correction of nature\'s imperfections, and make our patients feel beautiful.'],

  // ── Meta/title translations ───────────────────────────────────────────────────
  ['Artisan Clinic Chirurgia plastyczna; Medycyna estetyczna; Warszawa',
   'Artisan Clinic Plastic Surgery; Aesthetic Medicine; Warsaw'],
  ['Chirurgia plastyczna; Medycyna estetyczna; Warszawa',
   'Plastic Surgery; Aesthetic Medicine; Warsaw'],

  // ── Common UI text ────────────────────────────────────────────────────────────
  ['>Dowiedz się więcej<', '>Learn More<'],
  ['>Poznaj nas<', '>Get to Know Us<'],
  ['>Zobacz pełną ofertę<', '>View Full Offer<'],
  ['Wersja polska', 'Polish version'],

  // ── Remove remaining non-breaking space artifacts ─────────────────────────────
];

// ─────────────────────────────────────────────────────────────────────────────
// Process all EN files
// ─────────────────────────────────────────────────────────────────────────────
const files = fs.readdirSync(EN_DIR).filter(f => f.endsWith('.html'));
let totalReplacements = 0;

for (const file of files) {
  const filePath = path.join(EN_DIR, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let fileReplacements = 0;

  for (const [pl, en] of TRANSLATIONS) {
    if (content.includes(pl)) {
      content = content.split(pl).join(en);
      fileReplacements++;
    }
  }

  if (fileReplacements > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalReplacements += fileReplacements;
    console.log(`${file}: ${fileReplacements} replacements`);
  }
}

console.log(`\nTotal: ${totalReplacements} replacements across ${files.length} files`);
