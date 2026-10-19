// Drehbücher für YouTuba. Jeder Beat: [Sekunde, Untertitel, Optionen].
// Dauerhafte Optionen gelten bis zur nächsten Änderung (null entfernt sie):
//   bg, a (Pose Hauptobjekt), p (Pose Requisite), pa (Requisitenbild), face (Facecam-Emoji), flip, smile,
//   count (Schild), timer ('run', 'stop' oder Startwert in Sekunden), bar (Ladebalken %), bars (Empfang 0–4),
//   screen (Anzeige), pages (Papierstapel), sheet (Formblatt), sieve, rain.
// Einmalige Optionen gelten nur im Beat: big (Meme-Text), cam ('zoom', 'wide'), fx ('shake', 'spin', 'bounce'),
//   circle, arrow, slow, sub (Abo-Knopf wird gedrückt), sponsor ({ name, line }), end (Endscreen).

export const catalogScripts = {
  'Ich habe 24 STUNDEN nicht geatmet (GONE WRONG)': { beats: [
    [0, 'Tag 1. Ab jetzt atme ich nicht mehr.', { a: 'center', face: '😤', timer: 0 }],
    [1.1, '[angestrengtes Schweigen]', { face: '😳', fx: 'shake', cam: 'zoom', timer: 'run' }],
    [2.1, '*atmet*', { face: '😮', big: 'GONE WRONG', timer: 'stop' }]
  ] },
  '80 Kartons auspacken, um einen Karton zu finden': { beats: [
    [0, 'Moin, KartonKalle hier. Heute ein ganz besonderes Paket.', { a: 'center', face: '😀', count: '0 / 80' }],
    [2.5, 'Karton Nummer 1. Darin: ein Karton.', { a: 'center', fx: 'shake', count: '1 / 80' }],
    [4.5, 'Karton 23. Darin: Karton. Der Inhalt ist sehr konstant.', { a: 'small', count: '23 / 80', face: '😐' }],
    [7, 'Karton 79. Leute, ich spüre, wir sind nah dran.', { a: 'tiny', count: '79 / 80', face: '😮', cam: 'zoom' }],
    [9, 'Karton 80! Und darin …', { a: 'tiny', count: '80 / 80', fx: 'shake', face: '🤩' }],
    [10.4, '… ein Gutschein für 80 Kartons.', { big: 'KEIN CLICKBAIT', face: '😐', circle: true }]
  ] },
  'Wir lernen die Farben! Heute: Beige. Morgen: Beige.': { face: false, beats: [
    [0, 'Hallo Kinder! Hier ist wieder der Karottenbus!', { bg: 'beige', a: 'offleft' }],
    [1, 'Brumm, brumm!', { a: 'center', slow: true, fx: 'bounce' }],
    [4, 'Heute lernen wir eine Farbe. Wisst ihr schon, welche?', { a: 'center', fx: 'bounce' }],
    [7, 'Ganz genau: BEIGE!', { big: 'BEIGE!', fx: 'spin' }],
    [10, 'Was ist noch beige? Die Wand! Der Boden! Die Decke!', { a: 'left', cam: 'wide' }],
    [14, 'Und welche Farbe hat der Himmel?', { a: 'right' }],
    [17, 'Beige! Super gemacht!', { big: '⭐ BEIGE ⭐', fx: 'bounce' }],
    [20, 'Jetzt singen wir das Beige-Lied: Beige, beige, beige …', { a: 'center', fx: 'bounce' }],
    [23.5, '… beige, beige, beige, beige, beige.', { fx: 'bounce', cam: 'zoom' }],
    [26.5, 'Morgen lernen wir eine neue Farbe: Beige! Tschüss!', { a: 'offright', slow: true, end: true }]
  ] },
  'Ich habe meinen Drucker beleidigt. Er druckt meinen Lebenslauf.': { beats: [
    [0, 'Ich muss morgen meinen Lebenslauf abgeben. Also: drucken.', { bg: 'office', a: 'center', face: '🙂', pages: 0 }],
    [1.8, '[Drucker denkt nach]', { screen: 'BITTE WARTEN', face: '😐' }],
    [3.2, 'Du bist ein schlechter Drucker. So, jetzt ist es raus.', { screen: null, face: '😠', cam: 'zoom' }],
    [4.8, '…', { pages: 84, fx: 'shake', face: '😳' }],
    [6.2, '84 Seiten. Alle mit der Überschrift „Schwächen“.', { big: 'ER WEISS ES', pages: 84, face: '😭' }]
  ] },
  'Dortmund Speedrun: am Bahnhof umgedreht': { beats: [
    [0, 'Dortmund Speedrun, Any %. Timer läuft.', { bg: 'outdoor', a: 'center', face: '😤', timer: 'run' }],
    [2, 'Hauptbahnhof erreicht. Jetzt kommt der Glitch:', { a: 'left', fx: 'shake' }],
    [4, 'Umdrehen.', { a: 'center', fx: 'spin', cam: 'zoom' }],
    [5.4, 'Zurück im Zug. Dortmund: gesehen.', { a: 'offright', slow: true, timer: 'stop', big: 'WELTREKORD' }],
    [7, 'Unter acht Sekunden ist geschummelt.', { face: '😎' }]
  ] },
  'GURKE vs. HYDRAULIKPRESSE (Presse nicht geliefert)': { beats: [
    [0, 'Heute: Gurke gegen Hydraulikpresse!', { a: 'center', face: '😁' }],
    [2.4, 'Kleines Problem: Die Presse ist noch in der Zustellung.', { count: 'PRESSE: IN ZUSTELLUNG', face: '😬' }],
    [5, 'Plan B: Ich drücke sehr, sehr fest mit dem Daumen.', { count: null, fx: 'shake', cam: 'zoom', face: '😤' }],
    [7.5, '[Gurke zeigt keinerlei Reaktion]', { face: '😐' }],
    [9, 'Okay. Ich setze mich drauf.', { a: 'small', fx: 'shake', face: '😣' }],
    [10.6, 'Endstand: Gurke 1, Finn 0.', { a: 'center', big: 'SIE HAT GEWONNEN', circle: true, face: '😵' }]
  ] },
  'Mein WLAN braucht einen Sitzplatz im Bus': { beats: [
    [0, 'Mein Router hat nur noch einen Balken. Er ist müde.', { a: 'center', bars: 1, face: '😟' }],
    [2, 'Also fahren wir zusammen mit dem Bus in die Stadt.', { bg: 'outdoor', a: 'left', pa: 'car', p: 'right' }],
    [4, 'Haltestelle Innenstadt: DREI BALKEN!', { bars: 3, face: '😃', big: '3 BALKEN', fx: 'bounce' }],
    [6, 'Ich musste aussteigen. Er fährt jetzt alleine weiter.', { a: 'offright', p: 'offright', slow: true, bars: 0, face: '😢' }]
  ] },
  'ASMR: Formblatt 28b wird NICHT umgeblättert': { beats: [
    [0, '*flüstert* Hallo. Heute bei mir: Formblatt 28b.', { bg: 'night', a: 'gone', sheet: true, face: '😌' }],
    [5, '*flüstert* Wir werden es nicht umblättern.', {}],
    [10, '[Papier liegt]', { cam: 'zoom' }],
    [15, '*flüstert* Hört ihr das? Das ist die Rückseite. Sie bleibt hinten.', { face: '🤫' }],
    [20, '*flüstert* Dieses Video wird präsentiert von Stempelkissen Direkt.', { sponsor: { name: 'Stempelkissen Direkt', line: 'Für Stempel, die bleiben.' } }],
    [26, '[Papier liegt weiterhin]', { face: '😌' }],
    [31, '*flüstert* Eine Ecke hat sich bewegt. Das war der Wind. Ich entschuldige mich.', { fx: 'shake', face: '😳' }],
    [37, '*flüstert* Zur Entspannung: Feld 14 bleibt frei.', { circle: true, face: '😌' }],
    [41, '*flüstert* Danke fürs Nicht-Umblättern. Nächste Woche: Formblatt 28c.', { end: true }]
  ] },
  'Oma bewertet meine 6.499-Euro-Büroklammer': { beats: [
    [0, 'Hallo, hier ist die Oma. Mein Enkel hat was gekauft.', { bg: 'living', a: 'center', face: '👵' }],
    [4, 'Das ist eine Büroklammer für 6.499 Euro.', { count: '6.499 €', circle: true }],
    [8, 'Er sagt, die hat eine Premium-Biegung.', { fx: 'spin', face: '🤨' }],
    [11.5, 'Moment, ich hab da was in der Schublade.', { a: 'left', pa: 'clip', p: 'right', count: null }],
    [15, 'Die hier hab ich seit 1974. Die biegt sich auch.', { arrow: true, face: '😏' }],
    [19, 'Die hat zwei Pfennig gekostet. Und ich hab noch 99 davon.', { count: '0,01 €' }],
    [23, 'Ich gebe der teuren drei Sterne. Weil sie so schön glänzt.', { count: '★★★☆☆', face: '👵' }],
    [26.5, 'Jonas, wie macht man das aus? Jonas?', { cam: 'zoom', end: true }]
  ] },
  '10 Dinge, die du über Mangos wissen musst. Nummer 1: Mango.': { beats: [
    [0, '10 Dinge über Mangos. Los geht’s.', { a: 'center', face: '🤓' }],
    [1.6, 'Nummer 10: Mango.', { big: '#10' }],
    [3.2, 'Nummer 9: auch Mango.', { big: '#9' }],
    [4.8, 'Nummer 8 bis 3 hat mein Praktikant gegessen.', { a: 'small', big: '#8–3', face: '😬' }],
    [7, 'Nummer 2 fehlt.', { big: '#2 ???', face: '😐' }],
    [8.6, 'Und Nummer 1, ihr ahnt es …', { a: 'huge', slow: true, cam: 'zoom' }],
    [10.4, 'Mango.', { a: 'center', big: 'MANGO', circle: true, face: '😌' }]
  ] },
  'Ich baue ein Auto aus einem Auto (Tutorial)': { beats: [
    [0, 'Servus! Heute bauen wir ein Auto. Aus einem Auto.', { bg: 'garage', a: 'center', face: '😀' }],
    [4, 'Ihr braucht: ein Auto. Und Werkzeug, das ihr nicht benutzt.', { count: 'MATERIAL: 1 AUTO' }],
    [8, 'Schritt 1: Das Auto steht da. Sehr gut.', { count: null, big: 'SCHRITT 1', arrow: true }],
    [12, 'Schritt 2: Nichts anfassen. Das ist der schwierigste Teil.', { big: 'SCHRITT 2', face: '😬', fx: 'shake' }],
    [16, 'Kurze Werbung, dann geht’s weiter.', { sponsor: { name: 'Schraubenpaket XXL', line: '487 Schrauben. Passt zu keinem Auto.' } }],
    [23, 'Schritt 3: Einsteigen. Hier zeigt sich, ob es ein Auto ist.', { a: 'left', big: 'SCHRITT 3', face: '🤔' }],
    [28, 'Schritt 4: Losfahren …', { a: 'offright', slow: true, cam: 'wide' }],
    [32, '… es fährt! Wir haben aus einem Auto ein Auto gebaut!', { a: 'center', big: 'ES FÄHRT', face: '🤩', fx: 'bounce' }],
    [37, 'Ich hatte am Ende drei Schrauben übrig. Die gehören so.', { count: 'ÜBRIG: 3 SCHRAUBEN', face: '🙂' }],
    [41, 'Nächste Woche: ein Fahrrad aus einem Fahrrad.', { count: null, end: true }]
  ] },
  'Der Karottenbus fährt rückwärts zur Kita': { face: false, beats: [
    [0, 'Brumm, brumm! Hier kommt der Karottenbus!', { bg: 'beige', a: 'right', fx: 'bounce' }],
    [4, 'Oh nein! Der Karottenbus fährt heute … rückwärts!', { flip: true, big: 'RÜCKWÄRTS!', fx: 'shake' }],
    [8, 'Piep, piep, piep! So klingt rückwärts.', { a: 'left', slow: true }],
    [12, 'Kinder, wo ist beim Karottenbus vorne? Genau: hinten!', { big: 'HINTEN!', fx: 'bounce' }],
    [16, 'Wir sind an der Kita. Mit dem Kofferraum zuerst.', { a: 'center', pa: 'city', p: 'right', slow: true }],
    [21, 'Alle Karotten steigen aus. Vorne. Das ist verwirrend.', { fx: 'shake' }],
    [25, 'Heute gelernt: Rückwärts ist auch eine Richtung. Tschüss!', { fx: 'bounce', end: true }]
  ] },
  'UPDATE: Wir sind immer noch bei 99 Prozent': { beats: [
    [0, 'Leute, kurzes Update zum Update.', { bg: 'office', a: 'small', bar: 99, face: '😐' }],
    [4, 'Wir sind weiterhin bei 99 Prozent. Live.', { big: '99 %' }],
    [8, 'Ich hab mit dem Ladebalken gesprochen. Er braucht noch einen Moment.', { face: '🤔' }],
    [12, 'Zwischendurch ein kurzer Sponsor.', { sponsor: { name: 'TurboUpdate Pro', line: 'Macht 99 % noch schneller.' } }],
    [18, 'Wir sind zurück. Stand: 99 Prozent.', { face: '😐' }],
    [22, 'Moment … er bewegt sich!', { bar: 99.5, face: '😮', cam: 'zoom' }],
    [26, '99,9 Prozent! Ich hab Gänsehaut.', { bar: 99.9, big: '99,9 %', fx: 'shake', face: '🤩' }],
    [31, '„Neustart erforderlich.“', { bar: 0, big: 'NEIN', face: '😱', cam: 'zoom' }],
    [35, 'Neustart. Wir sind bei 1 Prozent.', { bar: 1, face: '😶' }],
    [39, 'Teil 2 kommt, sobald es fertig ist. Also nie.', { end: true }]
  ] },
  'Ich habe Wasser durch ein Sieb gegossen. Wissenschaft!': { beats: [
    [0, 'Wissenschaft! Ich gieße Wasser in ein Sieb.', { bg: 'lab', a: 'high', sieve: true, face: '🤓' }],
    [2, '[Wasser]', { rain: true }],
    [3.6, 'Hypothese: Das Wasser bleibt im Sieb.', { face: '🧐' }],
    [5.4, 'Ergebnis: Das Wasser ist auf dem Boden. Und in meinen Socken.', { rain: false, big: 'WO IST ES HIN?', face: '😧' }],
    [7.2, 'Peer-Review folgt.', { face: '🤓' }]
  ] },
  'Zimmerpflanze reagiert auf mein Entschuldigungsvideo': { beats: [
    [0, 'Ich hab meine Pflanze drei Wochen nicht gegossen. Das ist meine Entschuldigung.', { bg: 'living', a: 'center', face: '🥺' }],
    [3.6, 'Ich habe mich verändert. Ich hab jetzt eine Gießkannen-App.', { cam: 'zoom' }],
    [6.6, '[Pflanze reagiert nicht]', { face: '😶' }],
    [8.6, 'Sie lässt ein Blatt fallen. Ich deute das als Ja.', { a: 'tilt', face: '😭' }],
    [10.6, '', { big: 'KEINE ANTWORT' }]
  ] },
  'VLOG: Heute fast die Mülltonne rausgestellt': { asset: 'portrait', beats: [
    [0, 'Guten Morgen! Heute ist Dienstag. Mülltag.', { bg: 'outdoor', a: 'center', face: '☕' }],
    [4, 'Ich habe schon Schuhe an. Das ist ein großer Schritt.', { count: 'SCHUHE ✓' }],
    [8, 'Weg zur Tonne: 14 Meter. Wir schaffen das.', { a: 'left', count: '14 m', face: '😤' }],
    [12, 'Halbe Strecke. Kurze Trinkpause.', { a: 'center', count: '7 m', face: '😮', pa: 'car', p: 'offleft' }],
    [16, 'Oh. Die Müllabfuhr ist gerade vorbeigefahren.', { p: 'offright', slow: true, big: 'NEIN', cam: 'zoom', face: '😱' }],
    [20, 'So nah dran. Nächsten Dienstag wieder.', { a: 'right', count: null, face: '😔' }],
    [24, 'Euer knappstes Mülltonnen-Erlebnis? Ab in die Kommentare.', { sub: true, end: true }]
  ] },
  'Dieser PC kostet 20 Cent. Kann er Crysis öffnen?': { beats: [
    [0, 'Ein PC für 20 Cent. Wir starten Crysis.', { bg: 'office', a: 'center', face: '😎' }],
    [2, 'Er lädt …', { bar: 37 }],
    [3.5, 'Er lädt immer noch …', { bar: 38, face: '😐' }],
    [5, 'Er zeigt die Verknüpfung! Das Symbol ist gestochen scharf!', { bar: null, big: '20 CENT GAMING', circle: true, face: '🤩' }],
    [6.8, '4K. Ein Bild pro Woche.', { count: '0,0001 FPS' }]
  ] },
  '3 Zutaten, 0 Gerichte: Ich habe vergessen zu kochen': { beats: [
    [0, 'Heute ganz einfach: drei Zutaten.', { bg: 'kitchen', a: 'left', pa: 'potato', p: 'right', face: '😀' }],
    [3, 'Tomate. Kartoffel. Und … Tomate. Ich hab mich verzählt.', { count: 'ZUTATEN: 2' }],
    [6, 'Jetzt alles in den Topf und …', { face: '🤔', count: null }],
    [8, '… wir haben gar keinen Topf.', { face: '😶', big: 'BON APPETIT?', cam: 'zoom' }],
    [10, 'Serviervorschlag: einzeln, roh, mit Blickkontakt.', { a: 'center', p: 'small', face: '🙂' }]
  ] },
  'Banane zeichnet ein Gesicht und beantragt ein Konto': { face: false, beats: [
    [0, 'Hallo Kinder! Banane hat heute einen großen Tag!', { bg: 'beige', a: 'center', fx: 'bounce' }],
    [4, 'Zuerst malen wir ein Gesicht. Zwei Augen und ein Mund!', { smile: '🙂', fx: 'bounce' }],
    [9, 'Toll! Jetzt gehen wir zur Bank und beantragen ein Konto!', { a: 'left', pa: 'city', p: 'right', slow: true }],
    [13, 'Die Bank sagt: Wir brauchen einen Ausweis.', { big: 'AUSWEIS?', smile: '😮' }],
    [17, 'Banane hat keinen Ausweis. Banane hat nur ein Gesicht.', { smile: '🙁' }],
    [21, 'Zählen wir die Formulare! Eins, zwei, drei … siebzehn!', { count: '17 FORMULARE', fx: 'bounce' }],
    [25, 'Morgen lernen wir ein neues Wort: Schufa! Tschüss!', { count: null, smile: '🙂', fx: 'bounce', end: true }]
  ] },
  '24 Stunden in der Warteschleife (Teil 6)': { beats: [
    [0, 'Teil 6. Wir hängen weiterhin in der Warteschleife.', { a: 'small', timer: 83647, face: '😑' }],
    [5, '[Wartemusik, Takt 2.418]', {}],
    [10, '„Ihr Anruf ist uns wichtig.“ Danke. Ihr mir auch.', { face: '🙂' }],
    [15, 'Kurz gesponsert, die Warteschleife läuft weiter.', { sponsor: { name: 'Hotline-Kopfhörer Comfort', line: 'Damit die Wartemusik auch hinten ankommt.' } }],
    [21, '„Sie sind die Nummer 1 in der Warteschlange.“', { big: 'NUMMER 1!', face: '😮', cam: 'zoom' }],
    [26, 'Es klingelt …', { fx: 'shake', face: '😳' }],
    [30, '„Unsere Servicezeiten sind Montag bis Freitag …“', { face: '😐' }],
    [35, 'Heute ist Samstag.', { big: 'TEIL 7 FOLGT', face: '💀', timer: 'stop' }],
    [40, 'Bitte abonnieren, falls ich hier nicht mehr rauskomme.', { sub: true, end: true }]
  ] },
  'Ich verkaufe meine Wohnung als USB-Stick': { asset: 'city', beats: [
    [0, 'Wohnung zu groß zum Verkaufen? Ich mach sie einfach kleiner.', { a: 'center', face: '😏' }],
    [3, 'Alles auf einen USB-Stick: zwei Zimmer, 8 GB.', { a: 'tiny', count: '2 ZIMMER · 8 GB' }],
    [6, 'Problem: Der Balkon passt nicht durch den Anschluss.', { fx: 'shake', face: '😬' }],
    [8.4, 'Ein Interessent bietet 12 Euro. Mit Balkon 13.', { count: 'VB 12 €', face: '🤔' }],
    [10.4, 'Verkauft. Ich wohne jetzt im Ordner „Neuer Ordner (3)“.', { big: 'VERKAUFT', face: '🙃' }]
  ] },
  'Wie man ein Passwort vergisst. Fortgeschritten.': { beats: [
    [0, 'Schritt 1: Ein sicheres Passwort ausdenken.', { bg: 'office', a: 'gone', screen: 'Passwort: ____', face: '🙂' }],
    [2, 'Groß, klein, Zahl, Sonderzeichen, Geburtstag der Katze.', { screen: 'Passwort: ••••••••••••', face: '😤' }],
    [4, 'Schritt 2: Kurz an etwas anderes denken. Zum Beispiel Pizza.', { pa: 'pizza', p: 'right', face: '😋' }],
    [6, 'Und … weg. So einfach.', { screen: 'Passwort: ?', p: 'offright', big: 'JETZT IST ES WEG', face: '😶' }]
  ] },
  'Rasen mähen ohne Rasen: Nachbar ruft trotzdem Polizei': { beats: [
    [0, 'Sonntag, 7 Uhr. Perfekte Zeit zum Rasenmähen.', { bg: 'outdoor', a: 'left', face: '😀' }],
    [4, 'Kleines Problem: kein Rasen. Und kein Mäher.', { face: '🤔' }],
    [8, 'Ich mache einfach das Geräusch. BRRRRRRRR.', { fx: 'shake', big: 'BRRRRRR', cam: 'zoom', face: '😤' }],
    [12, 'BRRRRRRRRRRRRRRR.', { a: 'right', slow: true, fx: 'shake' }],
    [16, 'Oh. Der Nachbar steht am Zaun.', { face: '😬', pa: 'car', p: 'offright' }],
    [20, '[Blaulicht]', { p: 'center', big: 'ER HÖRT ES!' }],
    [24, 'Die Polizei sagt, das Geräusch war täuschend echt. Bußgeld: 0 Euro.', { count: '0 €', face: '😎' }],
    [27, 'Nächsten Sonntag: Laub blasen ohne Laub.', { count: null, end: true }]
  ] },
  'Die ganze Wahrheit über diesen einen Parkplatz': { asset: 'car', beats: [
    [0, '[ernste Musik] Dieser Parkplatz. Was verschweigt er uns?', { bg: 'outdoor', a: 'gone', count: 'P 3', face: '🧐' }],
    [5, '1987. Hier steht ein roter Kombi. Niemand stellt Fragen.', { a: 'center', count: '1987' }],
    [10, '1994. Der Kombi fährt weg. Die Lücke bleibt.', { a: 'offright', slow: true, count: '1994' }],
    [15, '2003. Ein anderes Auto parkt hier. Zufall?', { a: 'center', count: '2003', face: '🤨' }],
    [20, 'Diese Doku wird unterstützt von Parkscheibe Premium.', { sponsor: { name: 'Parkscheibe Premium', line: 'Jetzt mit zwei Seiten.' } }],
    [26, 'Heute. Der Parkplatz ist frei. Und doch …', { a: 'gone', count: 'HEUTE', cam: 'zoom' }],
    [31, '… steht da ein Schild: „Nur für Kunden“. Welche Kunden?', { big: 'WELCHE KUNDEN?', face: '😨' }],
    [36, 'Wir haben den Parkplatz um ein Interview gebeten. Er wollte nichts sagen.', { face: '😔' }],
    [40, 'Teil 2: Der Parkplatz nebenan. Er weiß mehr.', { end: true }]
  ] },
  '2 + 2, ohne Intro und ohne Sponsor': { face: false, beats: [
    [0, '2 + 2 = 4.', { bg: 'lab', a: 'gone', screen: '2 + 2 = 4' }],
    [2, 'Das war’s.', { screen: '4' }],
    [4.5, '[Hier wäre normalerweise der Sponsor.]', {}],
    [6.5, 'Danke.', {}]
  ] }
};

// Bausteine für Videos aus der Suche. {n} ist der Suchbegriff, {title} der Videotitel.
export const intros = [
  ['Was geht ab, Leute! Heute: „{title}“.', { face: '😀' }],
  ['Willkommen zurück! Ihr habt es euch gewünscht, also machen wir es.', { face: '😁' }],
  ['Bevor ihr fragt: Ja, das ist echt.', { face: '😤' }],
  ['Okay, ich hab das schon dreimal aufgenommen. Diesmal klappt’s.', { face: '😅' }],
  ['Hallo zusammen. Heute wird es emotional.', { face: '🥲' }]
];

export const begs = [
  'Wenn ihr neu seid: Abonnieren und die Glocke! Die Glocke ist wichtig.',
  '87 % von euch haben noch nicht abonniert. Ich hab nachgezählt.',
  'Kurz: Wenn wir 10.000 Abos schaffen, mache ich das noch mal. Mit {n}.'
];

export const sponsors = [
  { name: 'KartonKönig VPN', line: 'Verschlüsselt sogar Ihre Kartons.' },
  { name: 'Raid: Shadow Ladekabel', line: 'Jetzt installieren. Noch 99 %.' },
  { name: 'Fruchtfreund-Abo', line: 'Obst, das Sie nicht bestellt haben.' },
  { name: 'Stuhlkissen Pro', line: 'Für alle, die lange Videos schauen.' },
  { name: 'Gähmail Premium', line: 'Doppelt so viele unnötige Mails.' }
];

export const endings = [
  ['GONE WRONG', 'Das war … nicht der Plan.', '😱'],
  ['KEIN CLICKBAIT', 'Wie versprochen. Ungefähr.', '😎'],
  ['UNGLAUBLICH', 'Ich hab keine Worte. Also wenige.', '🤯'],
  ['FORTSETZUNG FOLGT', 'Teil 2 kommt, wenn ich mich erholt habe.', '😵'],
  ['WISSENSCHAFT', 'Ergebnis notiert. Notiz verloren.', '🤓']
];

export const outros = [
  'Schreibt in die Kommentare, was ich als Nächstes kaputt machen soll.',
  'Daumen hoch, wenn du bis hier geschaut hast. Also du.',
  'Das war’s. Abonnieren nicht vergessen, die Glocke auch nicht.',
  'Bis zum nächsten Mal. Gleiche Zeit, anderer Fehler.'
];

export const bodies = {
  drop: [
    ['Versuchsaufbau: {n}, eine Höhe, ein Boden.', { a: 'high' }],
    ['3 … 2 … 1 …', { fx: 'shake', cam: 'zoom', face: '😬' }],
    ['[Fallgeräusch]', { a: 'ground' }],
    ['{n} liegt. Der Boden ebenfalls.', { circle: true, face: '😮' }],
    ['Jetzt in Zeitlupe!', { cam: 'zoom', face: '🤓' }],
    ['In Zeitlupe liegt es langsamer.', { face: '🤔' }]
  ],
  spin: [
    ['Das ist {n}. Von vorne.', { a: 'center' }],
    ['Und jetzt von hinten.', { fx: 'spin' }],
    ['Von vorne war besser.', { face: '🤔' }],
    ['Wir drehen es noch einmal. Für die Wissenschaft.', { fx: 'spin', cam: 'zoom' }],
    ['Mir ist schwindelig. {n} nicht.', { a: 'tilt', face: '😵' }]
  ],
  unbox: [
    ['Paket ist da. Inhalt laut Etikett: {n}.', { a: 'gone', pa: 'parcel', p: 'center' }],
    ['Vorsichtig aufmachen …', { fx: 'shake' }],
    ['Noch ein Karton.', { count: 'KARTON 2' }],
    ['Und noch einer.', { count: 'KARTON 7', face: '😐' }],
    ['Da ist es! {n}!', { a: 'center', p: 'offright', count: null, big: 'ENDLICH', face: '🤩' }],
    ['Leider in der falschen Farbe.', { face: '😐' }]
  ],
  race: [
    ['{n} gegen einen Einkaufswagen. Fairer Test.', { bg: 'outdoor', a: 'left', timer: 0 }],
    ['Auf die Plätze …', { fx: 'shake', face: '😤' }],
    ['LOS!', { a: 'right', slow: true, timer: 'run', big: 'LOS!' }],
    ['Der Einkaufswagen hat nicht mitgemacht.', { timer: 'stop', face: '🤨' }],
    ['Wir werten das als Sieg.', { big: 'SIEG?', circle: true }]
  ],
  city: [
    ['Wir sind in {n}. Hier ist alles.', { bg: 'outdoor', a: 'center' }],
    ['Sehenswürdigkeit Nummer 1: dieses Schild.', { count: '{n}', arrow: true }],
    ['Sehenswürdigkeit Nummer 2: das gleiche Schild von hinten.', { fx: 'spin', face: '🤓' }],
    ['Kurze Pause beim Bäcker. Er hat zu.', { face: '😐' }],
    ['Fazit: {n} existiert. Daumen hoch.', { count: null, big: '10/10' }]
  ],
  rain: [
    ['Wetterbericht, live vom Balkon.', { bg: 'outdoor', a: 'high' }],
    ['Die Wolke ist in Position.', { face: '🧐' }],
    ['Es regnet!', { rain: true, big: 'NASS!', face: '😮' }],
    ['Ich fange es mit einem Sieb auf.', { sieve: true }],
    ['Bilanz: 0 Liter Regen, 2 nasse Socken.', { rain: false, count: '0 LITER', face: '😧' }]
  ],
  signal: [
    ['Wir messen den Empfang. Thema: {n}.', { bars: 2 }],
    ['Ich halte es höher.', { a: 'high', bars: 3 }],
    ['Noch höher!', { bars: 4, cam: 'zoom', face: '😃' }],
    ['Ich stehe jetzt auf dem Stuhl.', { bars: 1, fx: 'shake', face: '😬' }],
    ['Kein Empfang. Aber gute Aussicht.', { bars: 0, big: '0 BALKEN' }]
  ],
  calculator: [
    ['Live gerechnet: zwei plus zwei.', { a: 'gone', screen: '2 + 2' }],
    ['Der Rechner denkt …', { screen: '…', face: '🤔' }],
    ['Ergebnis: ein Fehler.', { screen: 'ERROR', face: '😐' }],
    ['Wir rechnen im Kopf. Vier.', { screen: '4', big: 'MATHE!', face: '🤓' }]
  ],
  identity: [
    ['Das hier ist {n}. Ganz sicher.', { a: 'center', circle: true }],
    ['Moment.', { pa: 'parcel', p: 'right', face: '🤨' }],
    ['Oder ist das hier {n}?', { a: 'right', p: 'left', slow: true }],
    ['Ich habe die beiden verwechselt.', { fx: 'shake', face: '😳' }],
    ['Wir haben es nie herausgefunden.', { big: 'VERWECHSELT' }]
  ],
  loading: [
    ['{n} wird geladen.', { bar: 12 }],
    ['Fast da.', { bar: 87, face: '🙂' }],
    ['99 Prozent.', { bar: 99, cam: 'zoom' }],
    ['Immer noch 99 Prozent.', { face: '😐' }],
    ['„Neustart erforderlich.“', { bar: 0, big: 'NEIN', face: '😱' }]
  ],
  sleep: [
    ['24 Stunden mit {n}. Kamera läuft.', { a: 'center', count: '00:00' }],
    ['Stunde 1: {n} liegt.', { count: '01:00' }],
    ['Stunde 9: {n} liegt anders.', { a: 'tilt', count: '09:00', face: '😮' }],
    ['Stunde 17: Ich bin eingeschlafen.', { count: '17:00', face: '😴' }],
    ['Stunde 24: {n} liegt. Wie erwartet.', { count: '24:00', big: 'KRASS' }]
  ],
  printer: [
    ['{n} ausdrucken. Eine Seite.', { bg: 'office', pages: 0 }],
    ['Der Drucker möchte Magenta.', { screen: 'MAGENTA LEER', face: '😐' }],
    ['Dann eben schwarz-weiß.', { screen: null, pages: 1 }],
    ['Er druckt …', { pages: 12, fx: 'shake' }],
    ['84 Seiten Fehlermeldung.', { pages: 84, big: 'ER DRUCKT!', face: '😱' }]
  ],
  kids: [
    ['Hallo Kinder! Heute: {n}!', { bg: 'beige', fx: 'bounce' }],
    ['Welche Farbe hat {n}? Genau: Beige!', { big: 'BEIGE!' }],
    ['Wir zählen: eins, eins, eins!', { count: '1', fx: 'bounce' }],
    ['Super gemacht! Tschüss!', { count: null, fx: 'bounce' }]
  ]
};

// Eigene Abläufe für die häufigsten Titelmuster aus der Suche, damit das Video zum Titel passt.
export const titleBodies = [
  [/NUR DIE WERBUNG AUFGENOMMEN/i, { ads: true, beats: [
    ['Hallo Leute! Bevor es losgeht, ganz kurz der Sponsor.', { face: '😀' }],
    ['Dieses Video wird präsentiert von KartonKönig VPN.', { sponsor: { name: 'KartonKönig VPN', line: 'Verschlüsselt sogar Ihre Kartons.' } }],
    ['Und von Stuhlkissen Pro.', { sponsor: { name: 'Stuhlkissen Pro', line: 'Für alle, die lange Videos schauen.' }, face: '😅' }],
    ['Und von Gähmail Premium.', { sponsor: { name: 'Gähmail Premium', line: 'Doppelt so viele unnötige Mails.' } }],
    ['So. Jetzt aber zu {n} …', { face: '😀', arrow: true }],
    ['… der Speicher ist voll.', { a: 'gone', big: 'SPEICHER VOLL', face: '😱' }]
  ] }],
  [/80 MAL NEU VERPACKT/i, { beats: [
    ['{n}, frisch ausgepackt. Jetzt kommt es wieder rein.', { a: 'center', pa: 'parcel', p: 'right' }],
    ['Verpackung Nummer 1.', { a: 'small', count: '1 / 80' }],
    ['Nummer 40. Der Karton hat inzwischen Untermieter.', { a: 'tiny', count: '40 / 80', face: '😤', fx: 'shake' }],
    ['Nummer 80. Fertig. Moment … wo ist {n}?', { a: 'gone', count: '80 / 80', face: '😳', big: 'WO IST ES?' }],
    ['Es ist in Karton 1. Ich fange wieder an.', { face: '😩' }]
  ] }],
  [/ein Passwort behalten/i, { beats: [
    ['Ich sage {n} jetzt mein Passwort. Ganz leise.', { a: 'center', screen: 'Passwort: ••••••' }],
    ['Hast du es dir gemerkt?', { face: '🤔' }],
    ['[{n} schweigt]', { cam: 'zoom' }],
    ['Sehr sicher. Es hat es niemandem verraten.', { big: '100 % SICHER', circle: true, face: '😎' }],
    ['Mir leider auch nicht. Ich hab es jetzt vergessen.', { screen: 'Passwort: ?', face: '😶' }]
  ] }],
  [/AUS DEM BILD GESCHOBEN/i, { beats: [
    ['Das ist {n}. Noch voll im Bild.', { a: 'center' }],
    ['Ich schiebe jetzt. Ganz langsam.', { a: 'right', slow: true, face: '😤' }],
    ['Fast draußen …', { fx: 'shake', cam: 'zoom' }],
    ['Weg. Komplett aus dem Bild.', { a: 'offright', big: 'KEIN CLICKBAIT', face: '😎' }],
    ['Ihr wolltet es sehen. Jetzt seht ihr es nicht mehr.', { face: '🙂' }]
  ] }],
  [/IN 3 SEKUNDEN BESICHTIGT/i, { beats: [
    ['Besichtigung von {n}. Timer läuft.', { a: 'center', timer: 'run' }],
    ['Vorne: gesehen.', { fx: 'spin' }],
    ['Hinten: auch gesehen.', { face: '😤' }],
    ['Fertig!', { timer: 'stop', big: 'BESICHTIGT' }],
    ['Ich habe nichts verstanden, aber ich war da.', { face: '😅' }]
  ] }],
  [/IN ZEITLUPE VERWECHSELT/i, { beats: [
    ['Das hier ist {n}. Das daneben nicht.', { a: 'left', pa: 'parcel', p: 'right' }],
    ['Jetzt in Zeitlupe …', { cam: 'zoom', face: '🤓' }],
    ['Die beiden tauschen ganz langsam die Plätze …', { a: 'right', p: 'left', slow: true }],
    ['… und ich weiß nicht mehr, welches {n} ist.', { face: '😵', big: 'VERWECHSELT' }],
    ['In Echtzeit wäre das nicht passiert.', { face: '😔' }]
  ] }],
  [/ANLEITUNG WAR AUF DER RÜCKSEITE/i, { beats: [
    ['Test von {n}. Anleitung brauche ich nicht, ich bin Profi.', { a: 'center', face: '😎' }],
    ['Schritt 1: Einschalten. Es gibt keinen Schalter.', { fx: 'shake', face: '🤔' }],
    ['Ich drehe es mal um …', { fx: 'spin' }],
    ['Die Anleitung klebt hinten drauf.', { big: 'ANLEITUNG!', arrow: true, face: '😳' }],
    ['Schritt 1 lautet: „Nicht umdrehen.“', { face: '😐' }]
  ] }],
  [/einen Drucker ersetzen/i, { beats: [
    ['{n} gegen Drucker. Wer druckt besser?', { bg: 'office', a: 'left', pa: 'pc', p: 'right' }],
    ['Druckauftrag an {n} gesendet.', { screen: 'DRUCKE …' }],
    ['{n} druckt nicht. Beschwert sich aber auch nicht über Magenta.', { screen: null, face: '🤔' }],
    ['Der Drucker druckt 84 Seiten Fehlermeldung.', { pages: 84, fx: 'shake', face: '😱' }],
    ['Sieger: {n}. Deutlich weniger Papierstau.', { big: 'ERSETZT', circle: true }]
  ] }],
  [/24 STUNDEN LANG BEOBACHTET/i, { kind: 'sleep' }],
  [/IN EINEN ANDEREN RAUM GESTELLT/i, { beats: [
    ['Hier steht {n}. Im Wohnzimmer.', { bg: 'living', a: 'center' }],
    ['Ich trage es jetzt in die Küche.', { a: 'offright', slow: true }],
    ['Küche.', { bg: 'kitchen', a: 'center' }],
    ['Kein Unterschied.', { face: '😐', cam: 'zoom' }],
    ['Die Raumtour kommt separat.', { big: 'NEUER RAUM', face: '😎' }]
  ] }],
  [/gegen einen Einkaufswagen/i, { kind: 'race' }],
  [/0 AUF 100 IM WOHNZIMMER/i, { beats: [
    ['{n}: 0 auf 100 im Wohnzimmer. Der Couchtisch ist weggeräumt.', { bg: 'living', a: 'left' }],
    ['Los!', { a: 'right', timer: 'run', fx: 'shake', face: '😤' }],
    ['Tempo 12. Dann kam die Wand.', { timer: 'stop', big: '0 AUF 12', face: '😬' }],
    ['Der Couchtisch steht jetzt im Garten.', { face: '😶' }]
  ] }],
  [/24 STUNDEN NICHT/i, { beats: [
    ['24 Stunden lang nicht {n}. Die Challenge startet.', { a: 'center', count: '00:00' }],
    ['Stunde 3: Ich bin weiterhin nicht {n}.', { count: '03:00', face: '😐' }],
    ['Stunde 12: Leichte Nebenwirkungen. Ich bin immer noch ich.', { count: '12:00', face: '🥴' }],
    ['Stunde 24: Geschafft. Hat problemlos funktioniert.', { count: '24:00', big: 'GESCHAFFT', face: '😎' }]
  ] }],
  [/alleine nach Hause finden/i, { beats: [
    ['{n} startet hier. Zuhause ist da drüben.', { bg: 'outdoor', a: 'left' }],
    ['Ich lasse es jetzt alleine.', { face: '🥲' }],
    ['[{n} bewegt sich nicht]', { cam: 'zoom' }],
    ['Ich trage es nach Hause. Zählt als Ja.', { a: 'right', slow: true, big: 'ZUHAUSE' }]
  ] }]
];
