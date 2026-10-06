# Blog

Każdy wpis to plik Markdown w `src/blog/pl/` (lub `src/blog/en/`). Nazwa pliku = adres:
`src/blog/pl/jak-przygotowac-sie-do-liftingu.md` → `blog-jak-przygotowac-sie-do-liftingu.html`.

```markdown
---
title: Jak przygotować się do liftingu twarzy
date: 2026-10-20
excerpt: Krótki opis na listę wpisów i do wyszukiwarek (1–2 zdania).
cover: imgs/blog/lifting.jpg          # opcjonalnie, plik w src/assets/
related_treatments: [lifting-twarzy, korekcja-powiek]   # id z _data/treatments.yaml (max 3)
translation: how-to-prepare-for-a-face-lift            # opcjonalnie: slug wersji EN
draft: true                                            # usuń, gdy wpis ma się opublikować
---

Treść wpisu w Markdown…
```

Link „Poczytaj” w menu pojawia się po ustawieniu `blogEnabled: true` w `src/_data/site.yaml`.
