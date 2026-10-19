# Gurgel

Eine statische Suchmaschinen-Parodie mit regelbasierten Ergebnissen. HTML, CSS und JavaScript, ohne KI, API, externe Bilder, Tracker oder Laufzeit-Abhängigkeiten.

**Website:** [Gurgel öffnen](https://agdnoob.github.io/Gurgel/) · **Repository:** [AGDNoob/Gurgel](https://github.com/AGDNoob/Gurgel)

## Lokal starten

```sh
npm run dev
```

Öffnen: http://127.0.0.1:4173

Die JavaScript-Module benötigen einen HTTP-Server. `index.html` direkt als `file://` zu öffnen ist deshalb nicht der unterstützte Startweg.

## Enthalten

- Vertraute Startseite und Ergebnislisten, Autocomplete mit Tastatursteuerung, Bilder-, Shopping-, Video- und News-Filter, weitere Ergebnisseiten.
- Breiter deutscher/englischer Lebensmittelkatalog sowie prominente Personen und Autos. Unbekannte Eingaben funktionieren ebenfalls.
- 396 deutsche Städte mit mehr als 30.000 Einwohnern, einschließlich Umlautschreibweisen, häufigen Kurzformen und einigen englischen Städtenamen.
- 46 Alltagsthemen wie Wetter, Paketverfolgung, Übersetzen, WLAN, Steuererklärung, Wohnen, Schlafen und Druckerprobleme. Suchabsicht und Ort werden getrennt erkannt, etwa bei „Wetter in München“.
- Handgeschriebene thematische Pointen, Kategorie-Regeln und wechselnde Reihenfolgen. Eine lokale Erinnerung an verwendete Vorlagen reduziert Wiederholungen auch zwischen verschiedenen Suchbegriffen. Der ausgewählte Seed in der URL hält Ergebnisse beim Zurückgehen und Teilen stabil.
- YouTuba mit 24 Startseiten-Videos, verschiedenen Kanälen und Genres, wechselnden Kommentaren und echten Laufzeiten von 3, 8, 12, 30 und 45 Sekunden. Eigene Animationen folgen der tatsächlichen Video-Zeit und reagieren auf Pause und Seek. Auf 2 % der Startseiten erscheint ein seltener tatsächlich hilfreicher Clip (Wahrscheinlichkeit 0,02).
- Buyazon mit lokalen Produktillustrationen, Warenkorb und erfundenen Bestellungen ohne Adresse oder Zahlungsdaten.
- Wickipedia mit Artikeln, Inhaltsnavigation, Infoboxen, Diskussion und Schriftgrößen.
- ChatGPP mit einer absichtlich nutzlosen Gesprächslogik: Aufgabe, Gesprächsschritt, Beobachtungen und Verlauf bleiben erhalten. „2 plus 2“ → „Taschenrechner öffnen“ → „Hab ich“ → ausführliche Tastaturanleitung → „4“ → ChatGPP übernimmt das fremde Ergebnis. Weitere Abläufe für Wetter, Rezepte, Programmieren, Paketverfolgung und Übersetzen.
- Zusätzlich Kleinunzeigen, Schlechtefrage und das Dortmunder Tagesblatt.
- Alle Anbieter besitzen eigene Startseiten. Suchtreffer öffnen den jeweiligen Artikel, das Produkt oder Video. Die Bildersuche auf der Startseite zeigt eine gemischte Entdeckungsgalerie.
- Gähmail: lokale fiktive E-Mail-Adressen mit `@gaehmail.invalid`, mehrere Spaßkonten, Posteingang, Markierungen, Papierkorb, Schreiben und automatische lokale Antworten. Dasselbe Konto funktioniert bei den übrigen Anbietern. Etwa alle fünf Minuten im geöffneten Browser kommen unnötige Mails und eine Benachrichtigung oben rechts. Nach langer Abwesenheit kommt höchstens eine Nachholmail. „Aktualisieren“ fordert sofort eine neue unnötige Mail an.
- Bürgerbürokratie: drei Online-Dienste mit zehn Minuten Frist, gespeicherten Formularentwürfen und absurd vielen Pflichtangaben. Der letzte Buyazon-Kauf und das zuletzt gestartete YouTuba-Video werden gegen die Historie des aktiven Spaßkontos geprüft. Nach Ablauf gibt es den Status „Serverbelastung“. Die Bestätigung landet im Postfach.
- Instakram und Fazebook: wechselnde Feeds, Stories, lokale Beiträge, Kommentare und Likes.
- Lieferlahm: 16 Gerichte und Restaurants, Preisaufschlüsselung, lokale Spaßbestellungen und Mailbestätigungen. Beispielsweise Vada Pav für 0,80 € aus Mumbai mit 223,50 € Versand und erfundener Flugzeit. Es wird kein echter Standort ermittelt.
- Nixflix: 14 langweilige Serien, Episodenlisten, Merkliste und stumme animierte Vorschauen.
- Twatsch: ein einzelner ausführlicher Kanal, **FinnBaut**. Der 20-Cent-PC wird an einer animierten Werkbank zusammengebaut. Strom, HDMI-Anschluss, Monitororientierung, RAM, Schutzfolie, Paste, SSD, Installation, Treiber und Belastungstest haben eigene Zustände. Chat-Tipps wirken verzögert, Korrekturen beziehen sich auf vorherige Nachrichten, frühere Fehler werden später wieder aufgegriffen. Zwölf Stammzuschauer, mehrteilige Nebenunterhaltungen, wirksame Abstimmungen, Kamera-Einlösungen und Kaffeepausen begleiten den Ablauf. Ohne Hilfe findet Finn selbst weiter. Der Stream wird lokal gespeichert und bei Rückkehr fortgesetzt. [Direkt zum Kanal](https://agdnoob.github.io/Gurgel/#/site/twatsch).
- Absurd formulierte Zustimmung beim ersten Start mit deutlich erklärter Parodie. Kein Zugriff auf den PC, keine echten Berechtigungsabfragen, Passwörter oder Kartennummern. Das Zahlungsprofil besteht ausschließlich aus einer nicht funktionsfähigen Beispielkarte.
- Kurze Skeleton-Ladephasen, in den Einstellungen abschaltbar. Bewegungen respektieren `prefers-reduced-motion`.

Alle Anbieter, Angebote, Meldungen und biografisch wirkenden Texte auf den Parodieseiten sind erfunden. Sämtliche Links bleiben innerhalb der Anwendung. Nachrichten und Käufe haben keine externen Auswirkungen.

## GitHub Pages

Das öffentliche Repository heißt **AGDNoob/Gurgel**. GitHub Pages veröffentlicht den Branch **main** aus **/(root)**. Neue Pushes auf `main` aktualisieren die Website automatisch. `index.html` und `.nojekyll` liegen im Stammverzeichnis. Es ist kein eigener Build erforderlich.

Relative Assetpfade und Hash-Routing funktionieren unter `https://agdnoob.github.io/Gurgel/`, ohne Server-Rewrite oder spezielle 404-Seite.

GitHub Pages lässt Browser jede Datei zehn Minuten zwischenspeichern. Damit nach einem Push keine alten und neuen Module gemischt werden, verweist `index.html` auf Stylesheets und Module mit Inhalts-Hash (`app.js?v=…`). Eine Import-Map leitet die relativen Importe der Module auf dieselben Versionen um. Vor jedem Commit, der JavaScript oder CSS ändert:

```sh
npm run stamp
```

`npm test` schlägt fehl, wenn `index.html` nicht mehr zu den Dateien passt.

Das Vorschaubild für geteilte Links (`assets/og-image.png`, 1200 × 630) erzeugt `node scripts/og-image.mjs` mit einem lokalen Chrome oder Edge im Headless-Modus.

## Weiterentwickeln

- `data.js`: Katalog, Suchbegriffe, Seitenmarken und spezifische Pointen.
- `cities.js`: amtlicher Stadtkatalog mit Bevölkerung, Land, AGS und Postleitzahl.
- `search-content.js`: Alltagsthemen, neue Geschichten, Stadtergebnisse und Lebensmittelpointen.
- `engine.js`: Erkennung, Kombination und Auswahl weniger oft verwendeter Ergebnisvorlagen.
- `chat-engine.js`: unabhängige, mehrstufige Gesprächszustände für ChatGPP.
- `video-scenes.js`: lokale Animationen, gesteuert durch den Video-Player.
- `news-copy.js`: verschiedene Formen und Texte der regionalen Meldungen.
- `app.js`: Routing, Darstellung und Interaktionen.
- `world-content.js`: Anbieter, Produkte, Videos, Bewertungen, Kommentare, Speisekarten, Serien, Social-Beiträge und unerwünschte Mails.
- `world-state.js`: unabhängige Konto-, Postfach-, Bestell- und Formularlogik mit prüfbaren Fristen.
- `portals.js`: Startseiten, Anbieteroberflächen und Verbindung zum lokalen Spaßkonto.
- `portals.css`: Layouts der zusätzlichen Anbieter und ihrer Startseiten.
- `twatsch-engine.js`: unabhängige Stream-Simulation, Hardware, Zeit, Chat-Absichten, Abstimmungen und Erinnerung.
- `twatsch-content.js`: Kanal, Stammzuschauer, handgeschriebene Dialoge und Nebenunterhaltungen.
- `twatsch-scene.js`: animierte Canvas-Werkbank und lokal erzeugte Lüfter-, Werkbank- und Alert-Geräusche.
- `twatsch.js` / `twatsch.css`: Player, Live-Chat, Kanalpunkte, lokale Speicherung und responsive Twatsch-Oberfläche. Details: [Twatsch entwickeln](docs/twatsch.md).
- `styles.css`: Layouts der Suchmaschine und einzelnen Parodieseiten.
- `assets/`: selbst gezeichnete lokale SVG-Produktbilder.
- `scripts/assets.mjs`: reproduziert diese Illustrationen.
- `scripts/food-assets.mjs`: reproduziert die sechs Speiseillustrationen.
- `scripts/portal-clips.mjs`: reproduziert die zusätzlichen stummen MP4-Clips mit FFmpeg. FFmpeg wird nur zum Erstellen benötigt, nicht von der Website.
- `scripts/stamp.mjs`: schreibt die versionierten Stylesheets, die Import-Map und das Startmodul in `index.html`.
- `scripts/og-image.mjs`: erzeugt das Open-Graph-Vorschaubild.

```sh
npm test
```

Die Tests prüfen außerdem Kontotrennung, Mail-Takt, Bestell- und Videoverlauf, Formularvalidierung und Fristablauf, Wiederherstellung, verschiedene Laufzeiten und die Häufigkeit des seltenen Clips. Twatsch wird mit virtueller Zeit über längere Verläufe geprüft: Hardware-Folgen, Abkühlung, Installation und Neustarts, Chat-Korrekturen, Negationen, Abstimmungen, Punkte, Spam-Bremse, Nebenunterhaltungen und Wiederaufnahme.

## Datenquelle der Städte

Quelle: [Statistisches Bundesamt, GV-ISys, Jahresausgabe 31.12.2025](https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/Administrativ/Archiv/GVAuszugJ/31122025_Auszug_GV.xlsx?__blob=publicationFile&v=2), Bevölkerung auf Grundlage des Zensus 2022. Gefiltert werden Städte (Textkennzeichen 61, 62, 63, 67) mit **streng mehr als 30.000** Einwohnern. Gemeinden ohne Stadtrecht sind nicht als Städte etikettiert. Die 396 Einträge sind ein dokumentierter Datenstand, keine Live-Bevölkerungsabfrage. Die Suchergebnisse und Meldungen bleiben vollständig erfundene Parodien.

Mit `scripts/import-cities.py` lässt sich der Katalog aus der heruntergeladenen Jahresdatei neu erzeugen. Nur zum Import ist Python mit `openpyxl` nötig; die Website lädt das fertige lokale JavaScript-Modul.

Suchanfragen bleiben im Browser und stehen in der URL. Spaßkonten, Postfächer, Bestellungen, gestartete Videos, Formularentwürfe, Beiträge, Kommentare, Einstellungen, Warenkorb sowie Twatsch-Chat und Streamfortschritt werden in `localStorage` gespeichert. Die Vorlagenerinnerung enthält nur Vorlagenkennungen und einen Hash der Suchanfrage im `sessionStorage` des aktuellen Tabs. Alle lokalen Daten lassen sich unter Datenschutz löschen. Es wird kein vollständiger Suchverlauf gespeichert. Keine externen Nachrichten, Browser-Notifications, echten Standortdaten oder Zahlungsdaten.
