# Artisan Clinic — strona www

Źródła w `src/` (Eleventy + dane YAML), wynik w `dist/` — czysty HTML/CSS/JS wysyłany na serwer przez FTP.
**Nie edytuj plików w `dist/`** — każdy build kasuje ten katalog i generuje go od nowa.

```bash
npm install
npm start        # podgląd na żywo: http://localhost:8080
npm run build    # produkcyjny build do dist/
npm run check    # linki, kotwice, canonical/hreflang w dist/
```

Wdrożenie: `npm run build && npm run check`, potem wyślij **całą zawartość `dist/`** przez FTP.

## Gdzie co jest (jedno źródło prawdy)

| Co zmieniasz | Plik |
|---|---|
| Telefon, e-mail, link ZnanyLekarz, social, GTM, domena, włączenie bloga | `src/_data/site.yaml` |
| **Ceny** (cennik, ceny „od” w sidebarze zabiegów, ledger na stronie głównej) | `src/_data/pricing.yaml` |
| Zabiegi: tytuł, slug PL/EN, kategorie, opis na karcie, **sidebar „W skrócie”**, **powiązane zabiegi** | `src/_data/treatments.yaml` |
| Treść strony zabiegu | `src/treatments/pl/<slug>.html`, `src/treatments/en/<slug>.html` |
| Zespół (zdjęcie, rola, biogram) | `src/_data/team.yaml` |
| Opinie pacjentów | `src/_data/reviews.yaml` |
| Teksty strony głównej | `src/_data/home.yaml` |
| Teksty interfejsu (menu, stopka, etykiety, nagłówki podstron) | `src/_data/i18n.yaml` |
| Kategorie (Twarz / Ciało / Piersi / Skóra) | `src/_data/categories.yaml` |
| Wpisy bloga | `src/blog/pl/*.md`, `src/blog/en/*.md` — instrukcja w `src/blog/README.md` |
| Style | `src/css/parts/*.css` (tokeny i baza: `base.css`) |
| Skrypty | `src/assets/js/` |
| Pliki kopiowane 1:1 (brand-kit, PHP formularza, `.htaccess`) | `src/static/` |

### Cena „od” w sidebarze
Wiersz cennika z `treatment: <id>` jest liczony do ceny zabiegu (najniższe `from`). Jeśli któryś wiersz zabiegu ma
`primary: true`, liczą się tylko wiersze `primary`. Strony-bliźniaki (`twin:` w `treatments.yaml`) dzielą cenę.
`treatment` może być listą — pierwszy zabieg dostaje link w cenniku, wszystkie dostają cenę.

### Sidebar „W skrócie”
Pola w `treatments.yaml → summary` (`duration`, `anesthesia`, `recovery`, `result`, `stay`, `sessions`, `forWhom`),
każde `{pl, en}`. Brak pola = brak wiersza. „Obszar” wynika z kategorii, „Koszt” z cennika.

### Nowy zabieg
1. Dodaj wpis w `src/_data/treatments.yaml` (klucz = slug PL).
2. Dodaj `src/treatments/pl/<slug-pl>.html` i `src/treatments/en/<slug-en>.html` (front matter: `id`, `lead`).
3. Podepnij wiersze w `pricing.yaml` (`treatment: <id>`) i ewentualnie dopisz go do `related` innych zabiegów.

## Historia
Do października 2026 strona była ręcznie edytowanym HTML-em z Tailwindem. Jednorazowa migracja:
`scripts/migrate-to-11ty.js` (+ ręczne poprawki danych w `scripts/migration-curation.js`, raport w
`scripts/migration-report.md`). Po migracji źródłem są pliki w `src/` — **nie uruchamiaj skryptu ponownie**, bo nadpisze zmiany w danych i treściach.
