# Website bearbeiten – Kurzanleitung / Editing guide

Du bearbeitest die Website unter **/admin/** (mit deinem Netlify-Login).
Nach dem Klick auf **„Publish" / „Veröffentlichen"** werden deine Änderungen
veröffentlicht. Netlify braucht danach normalerweise ein paar Minuten.

You edit the site at **/admin/** (with your Netlify login). After clicking
**Publish**, your changes are published. Netlify usually needs a few minutes.

---

## 🇩🇪 Das Wichtigste

- **Seiten finden:** Wähle links **Deutsch** oder **English** und dann die
  gewünschte Seite, z.B. **Startseite**, **Beratung** oder **Preise**. So
  bearbeitest du immer nur eine Seite auf einmal.
- **Texte ändern:** Schreibe einfach den gewünschten Text in das passende Feld.
  Du brauchst keine HTML-Zeichen oder Formatierungscodes einzugeben.
- **Vorschau:** Mit dem Augensymbol oben rechts kannst du die Vorschau ein- oder
  ausblenden, wenn du mehr Platz zum Bearbeiten brauchst.
- **Felder sind nicht Pflicht.** Leere ein Feld nur, wenn der entsprechende
  Text wirklich von der Website verschwinden soll.
- **Listen (z.B. Absätze, Karten, Preise, Bewertungen, Galerie):**
  - **Hinzufügen:** unten auf **„Add …"** klicken.
  - **Entfernen:** beim Eintrag auf das **Papierkorb-/×-Symbol** klicken.
  - **Verschieben:** Einträge per **Ziehen (Drag)** neu anordnen.
- **Inhalts-Bausteine** (Beratung, Supervision, Über mich, Preise, AGB,
  Datenschutz, Nutzung): Du kannst frei **Überschrift, Absatz, Zitat,
  Aufzählung, Button, Bild** oder **Abstand** hinzufügen, löschen und sortieren.
- **Preise ändern:** Seite „Preise" → „Preiskarten" → Feld **„Betrag"**
  (nur die Zahl, z.B. `120`).
- **Speichern:** Oben auf **„Publish" / „Veröffentlichen"** klicken.

## 🇬🇧 In short

- Choose **Deutsch** or **English** on the left, then select the page you want
  to edit.
- Enter normal text in the fields; no HTML or formatting codes are needed.
- Use the eye icon at the top right to show or hide the preview.
- **Fields are optional.** Clear a field only if you want that text removed
  from the website.
- **Lists** (paragraphs, cards, prices, testimonials, gallery): use **Add** to
  add, the **trash/×** icon to remove, and **drag** to reorder.
- **Content blocks** let you add/remove/reorder headings, paragraphs, quotes,
  bullet lists, buttons, images and spacers freely.
- **Change a price:** Pricing page → Price cards → **Amount** field (number only).
- Click **Publish** to go live.

---

### Für Entwickler / For developers

Inhalte liegen pro Sprache und Seite unter `content/de/` und `content/en/`.
Einfache Felder werden über `data-i18n` eingesetzt; wiederholbare Inhalte
rendert `main.js` aus Arrays:

- `data-list="KEY"` – wiederholt das enthaltene `<template>` pro Array-Eintrag
  (Felder via `data-field` / `data-field-html` / `data-href-field` / `data-src-field`).
- `data-blocks="KEY"` – typisierte Liste (heading, subheading, text, quote,
  bullets, button, image, spacer).

Statische Kinder mit `data-default` dienen als Fallback und werden nur ersetzt,
wenn die CMS-Liste tatsächlich Inhalte hat. Neue bearbeitbare Felder: Feld in
`admin/config.yml` ergänzen und passendes `data-…`-Markup im HTML setzen.
