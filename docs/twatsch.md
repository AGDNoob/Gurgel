# Twatsch / FinnBaut

Ein einzelner fiktiver Kanal mit einer fortlaufenden Simulation. Alles läuft als ES-Module auf GitHub Pages. Es gibt weder Sprachmodell noch Chat-Server, API-Schlüssel, echte Zuschauer oder externe Streams.

## Ablauf und Folgen

Finn baut den 20-Cent-PC von Buyazon. Der Rechner hat getrennte Zustände für Strom, HDMI-Anschluss, RAM, Kühlerfolie, Wärmeleitpaste, SSD, Installationsstick, Betriebssystem, Treiber, Takt, Kabelordnung und Gehäusedeckel. Der Monitor kann unabhängig vom Rechner gedreht werden.

Temperatur folgt einer zeitabhängigen Annäherung an die jeweilige Last- und Kühltemperatur. Falsche Kühlung kann den Rechner abschalten. Ausgeschaltete Hardware kühlt weiter ab. Installation benötigt Strom, RAM, SSD und Stick. Bei einem Neustart geht Fortschritt bis zum letzten Kontrollpunkt verloren. Grafiktreiber entfernen vorübergehend das Bild. Ein geschlossener Deckel benötigt geordnete Kabel.

Ohne Publikum arbeitet Finn selbstständig an der aktuellen Baustelle weiter. Fehler, Abstimmungen, Wartezeiten und Nutzeraktionen verändern die Dauer. Die ungestörten Testabläufe umfassen viele Minuten, anschließend läuft ein Langzeittest. Es gibt keinen kurzen Video-Loop und keinen automatischen Reset auf den Anfang.

## Chat

Beispiele für Eingriffe:

- `Dreh den Stecker um` lässt Finn den Monitor drehen.
- `Nein, den Stecker!` korrigiert den Anschluss unter Bezug auf die vorherige Aktion. Der Monitor bleibt dabei gedreht.
- `Monitor wieder richtig rum` behebt die Orientierung getrennt.
- `RAM richtig einsetzen`, `Folie vom Kühler ab`, `Wärmeleitpaste`, `SSD einbauen`, `Installationsstick rein`, `Installieren`, `Treiber installieren`, `Crysis starten` greifen in die entsprechenden Zustände ein.
- `Keine Zahnpasta` verhindert den Handgriff, bis eine ausdrückliche gegenteilige Anweisung kommt.
- `USB-Stick raus`, `Neustart`, `Ausschalten` und `Turbo an` können etwas verschlimmern.
- `Temperatur messen`, `Warte` und `Kaffee holen` haben ebenfalls Auswirkungen.

Eingaben werden auf wenige konkrete Absichten geprüft. Nicht erkannte freie Nachrichten dürfen im Chat stehen bleiben und werden nicht als angeblich verstandene Anweisung zurückgespiegelt. Unterstützt werden deutsche und einige englische Formulierungen; es ist kein allgemeines Sprachverständnis. Aktionen erreichen Finn nach ungefähr drei bis fünf Sekunden. Bestimmte Tipps werden nach ein bis zwei Minuten unter Bezug auf Absender und aktuellen Zustand erneut aufgegriffen.

Zwölf erfundene Zuschauer haben feste Namen und Rollen. Kommentare beziehen sich auf die jeweilige Baustelle. Zwölf zusätzliche mehrteilige Unterhaltungen verteilen sich über den Stream und wiederholen innerhalb eines Themenzyklus kein Thema. Kurze Reaktionsfolgen werden durch konkrete Ereignisse ausgelöst. Einfache Spam-Bremse und Entdopplung verhindern mehrfach ausgelöste Handgriffe durch schnelle gleiche Nachrichten.

## Player und Konto

- Pause hält die Wiedergabe an; die Simulation und der Chat laufen weiter. „Zum Livestream“ springt auf den aktuellen Zustand.
- 360p, 480p und 720p ändern die Canvas-Auflösung. Die kurze Pufferanzeige ist Teil der Parodie.
- Ton wird erst per Klick freigeschaltet. Er besteht aus lokal erzeugten Lüfter-, Werkbank- und Alert-Geräuschen. Finns Äußerungen stehen in Untertiteln; es gibt keine aufgezeichnete oder generierte Stimme.
- Untertitel, Theatermodus, Vollbild und Lautstärke sind bedienbar. Chat-Einstellungen bieten Zeitstempel, optionales Untertitelprotokoll und Screenreader-Ankündigungen.
- Fiktive Schraubenpunkte entstehen nur während sichtbarer laufender Wiedergabe. Einlösungen verändern Kamera, Messung, Monitororientierung oder Kaffeepause. Es gibt keine Zahlung.
- Gähmail-Konten geben den Chatnamen vor. Gäste können einen lokalen Namen wählen. Folgen und ein fertig gebauter PC erzeugen bei angemeldetem Spaßkonto unnötige lokale Mails.

## Speicherung und Zeit

`gurgel-twatsch-v1` enthält Simulation, Zufallszustand, Hardware, maximal 140 Nachrichten, begrenzte Erinnerungen, zukünftige Ereignisse, Punkte und Einstellungen. Die Speicherung erfolgt regelmäßig, bei Aktionen und beim Verlassen. Eine neue URL-Zufallszahl startet keinen zweiten Stream. Bei Rückkehr wird verstrichene Zeit nachgeholt; maximal 45 Minuten werden im Detail simuliert. Längere Abwesenheit verschiebt verbleibende Ereignisse, ohne eine ganze Woche Chat nachzuspielen. Ohne verfügbaren Speicher funktioniert die aktuelle Sitzung weiter.

„Lokale Daten löschen“ unter Datenschutz entfernt auch diesen Zustand. Geräte und Browser teilen keine Session. Mehrere gleichzeitig geöffnete Tabs sind keine synchronisierte Mehrspielerwelt.

## Darstellung und Prüfung

Die Twatsch-Oberfläche folgt dem Twitch-Aufbau mit dunklem Header, Kanalleiste, 16:9-Player, Kanalinformationen und seitlichem Chat. Unter 980 Pixeln sitzt der Chat darunter und die Werkbank bleibt beim Scrollen sichtbar. Die Illustration ist bewusst direkt mit Canvas gezeichnet: Hardwareteile, Anzeige, Hände, Lüfter, Rauch, Orientierung und Kamera lesen denselben Simulationszustand. Es werden keine KI-Bilder geladen.

Browserprüfung: Desktop bei 1280 × 720 und Mobilansicht bei 390 × 844, Chat-Folgenachricht, Nahaufnahme, Pause/Live, Tonfreigabe, 480p, Untertitelprotokoll, gespeicherte Wiederaufnahme und Navigation. Geprüft wurden außerdem Palette, Seitenaufbau, Schriftgrößen, Player-Proportionen, lesbare Untertitel und horizontaler Überlauf. Der Desktop-Chat berücksichtigt die Gurgel-Rücksprungleiste, damit das Eingabefeld im Fenster bleibt. Beendete Abstimmungen verschwinden nach kurzer Zeit aus dem Panel; ihr Ergebnis bleibt im Chat.

`npm test` prüft längere Abläufe ohne echte Wartezeit sowie gezielte Eingriffe und Wiederherstellung.
