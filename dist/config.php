<?php
/**
 * Konfiguracja formularza konsultacji online (PHP >=7.4)
 * Artisan Clinic
 */

return [
    // Ustawienia email
    'email' => [
        'to' => 'mikolaj.janusz@intmail.pl', // Adres email, na który będą wysyłane formularze
        'from' => 'noreply@artisanclinic.pl', // Adres nadawcy
        'from_name' => 'Artisan Clinic - Formularz Konsultacji',
        'subject_prefix' => 'Nowe zgłoszenie konsultacji online - '
    ],

    // Ustawienia walidacji
    'validation' => [
        'min_age' => 18,
        'max_age' => 120
    ],

    // Komunikaty
    'messages' => [
        'success' => 'Formularz został wysłany pomyślnie! Skontaktujemy się z Tobą w ciągu 24 godzin.',
        'error_general' => 'Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie lub skontaktuj się z nami telefonicznie.',
        'error_validation' => 'Błędy walidacji',
        'error_method' => 'Metoda niedozwolona'
    ],

    // Mapowanie nazw zabiegów
    'procedures' => [
        'deep-plane-facelift' => 'Deep Plane Facelift',
        'upper-eyelid' => 'Korekcja powiek górnych',
        'lower-eyelid' => 'Korekcja powiek dolnych',
        'nose-correction' => 'Korekcja nosa',
        'ear-correction' => 'Korekcja uszu',
        'other' => 'Inny zabieg'
    ],

    // Mapowanie nazw lekarzy
    'doctors' => [
        'dr-witwicki' => 'dr n. med. Tadeusz St. Witwicki',
        'dr-mazurek' => 'dr n. med. Maciej Mazurek',
        'dr-pietruski' => 'dr hab. n. med. Piotr Pietruski',
        'dr-jonczyk' => 'dr n. med. Justyna Jończyk',
        'any-specialist' => 'Dowolny Specjalista Artisan Clinic'
    ]
];

// Brak znacznika zamykającego PHP – świadomie, aby uniknąć przypadkowego wysyłania outputu
