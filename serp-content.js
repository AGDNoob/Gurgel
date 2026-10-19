// Texte für die modernen Bausteine der Ergebnisseite: Gurgel-Übersicht, Anzeigen,
// Ähnliche Fragen und Knowledge Panel. {n} ist der erkannte Suchbegriff, {place} ein Ort.
// Personen bekommen nur offensichtlich erfundene Meta-Angaben, keine biografischen Behauptungen.

export const overviewLeads = {
  food: [
    '{n} ist ein Lebensmittel, das man essen, kaufen oder ausgiebig ansehen kann. Die meisten Quellen sind sich einig, dass {n} existiert.',
    'Kurz gesagt: {n} ist essbar, sobald der Teller bereitsteht. Vorher steht {n} nur auf der Einkaufsliste.',
    '{n} besteht überwiegend aus {n}. Der Rest ist Verpackung, Preis und Erwartung.'
  ],
  city: [
    '{n} ist eine Stadt in {state} mit {population} Einwohnern, von denen die meisten gerade nicht online sind.',
    '{n} liegt in {state}, genauer gesagt dort, wo die Straßenschilder „{n}“ sagen. Die Postleitzahl {postal} wurde mehrfach gesichtet.',
    'Kurz gesagt: {n} ist ein Ort. Man kann hinfahren, dort sein oder wieder wegfahren. {population} Menschen haben sich für Variante zwei entschieden.'
  ],
  person: [
    'Laut übereinstimmenden Quellen ist {n} eine Person mit einem Namen. Genau dieser Name wurde soeben gesucht.',
    '{n} ist vor allem dafür bekannt, dass sehr viele Menschen „{n}“ in Suchmaschinen eingeben. Über alles Weitere schweigt die Übersicht vorsorglich.',
    'Kurz gesagt: {n} ist nicht in diesem Browser. Die Übersicht hat trotzdem nachgesehen.'
  ],
  car: [
    '{n} bezeichnet ein Fahrzeug mit Rädern, Türen und einem Preis, der sich beim Konfigurieren verdoppelt.',
    'Kurz gesagt: Wer {n} fährt, fährt. Wer {n} parkt, sucht.',
    'Mehrere Quellen bestätigen: {n} hat vorne und hinten jeweils eine Seite. Beim Einparken wechseln sie.'
  ],
  tech: [
    '{n} ist ein Gerät, das funktioniert, bis man es braucht. Danach beginnt ein Update.',
    'Kurz gesagt: {n} ist eingeschaltet schneller als ausgeschaltet. Die meisten Quellen empfehlen eingeschaltet.'
  ],
  object: [
    '{n} ist ein Gegenstand, der meistens dort liegt, wo man nicht gesucht hat.',
    'Kurz gesagt: {n} ist vorhanden. Wo genau, hängt vom Aufräumen ab.'
  ],
  everyday: [
    '{n} ist ein Vorgang, bei dem mindestens ein Browser-Tab offen bleibt. Die meisten Anleitungen beginnen mit „ganz einfach“.',
    'Kurz gesagt: {n} funktioniert, nachdem man es ein zweites Mal versucht hat. Der erste Versuch zählt als Vorbereitung.',
    'Für {n} gibt es drei Wege: den offiziellen, den schnellen und den, den am Ende alle nehmen.'
  ],
  unknown: [
    'Zu „{n}“ gibt es viele Meinungen. Die Übersicht hat sich für alle gleichzeitig entschieden.',
    '„{n}“ ist ein Begriff, der in dieser Suchanfrage vorkommt. Darüber hinaus ist die Quellenlage dünn, aber selbstbewusst.',
    'Kurz gesagt: {n}. Länger gesagt: siehe unten.'
  ]
};

export const intentLeads = {
  buy: 'Kurz gesagt: {n} kaufen ist möglich, sobald Geld und Lieferadresse gleichzeitig vorhanden sind.',
  recipe: 'Für {n} brauchst du Zutaten, einen Herd und jemanden, der hinterher abwäscht. Die Übersicht übernimmt den ersten Punkt nicht.',
  repair: '{n} reparieren gelingt in den meisten Fällen durch Aus- und wieder Einschalten. In den übrigen Fällen durch Kaufen.',
  nutrition: '{n} enthält Nährstoffe. Welche, hängt davon ab, wie genau man hinsieht.'
};

export const groupLeads = {
  weather: 'Das Wetter in {place} findet derzeit draußen statt. Für genauere Angaben empfiehlt die Übersicht ein Fenster.',
  time: 'Es ist gerade jetzt. In wenigen Sekunden wird diese Angabe veraltet sein.',
  parcel: 'Dein Paket befindet sich laut übereinstimmenden Quellen unterwegs, beim Nachbarn oder in einer Filiale, die gleich schließt.',
  password: 'Dein Passwort ist das, das du dir zuletzt sicher gemerkt hattest. Die Übersicht kennt es nicht und findet das richtig.',
  cancel: 'Kündigen geht schriftlich, fristgerecht und vorzugsweise bei jemandem, der den Brief auch öffnet.',
  translate: 'Übersetzen bedeutet, dasselbe noch einmal in anders zu sagen. Die Übersicht sagt es vorsichtshalber auf Deutsch.',
  calculator: 'Das Ergebnis liegt zwischen null und sehr viel. Für eine genauere Zahl empfiehlt die Übersicht den Taschenrechner, den du gerade benutzt.',
  sleep: 'Schlafen funktioniert am besten, wenn man aufhört, danach zu suchen.'
};

// Je Quelle ein Satz, der den echten Treffer als Beleg zitiert.
export const citations = {
  buyazon: ['Laut Buyazon gibt es „{title}“ bereits für {price}.', 'Ein Händler bestätigt: „{title}“. {rating} Sterne sprechen dafür.'],
  youtuba: ['Ein Video mit {views} Aufrufen zeigt außerdem: „{title}“.', 'Visuell belegt wurde das in „{title}“.'],
  wickipedia: ['Wickipedia ordnet ein: „{title}“. {description}', 'Die Fachliteratur führt dazu den Eintrag „{title}“. {description}'],
  chatgpp: ['ChatGPP wurde ebenfalls gefragt: „{title}“. {description}', 'Eine zweite Meinung von ChatGPP lautet: „{title}“'],
  news: ['Das Tagesblatt berichtet: {title}.', 'Lokalmedien melden: {title}. {description}'],
  klein: ['Auf Kleinunzeigen wird derzeit „{title}“ angeboten.', 'Ein privater Anbieter bietet „{title}“ an. {description}'],
  forum: ['Nutzer auf Schlechtefrage fragen sich: „{title}“', 'Auf Schlechtefrage heißt es: „{title}“ {description}']
};

export const overviewMore = [
  'Zusammenfassend lässt sich sagen: Es kommt darauf an. Worauf, ist Gegenstand weiterer Suchen.',
  'Wichtig: {n} sollte nicht mit etwas anderem verwechselt werden. Mit {n} hingegen schon.',
  '{percent} % aller Fragen zu {n} wurden bereits gestellt. Der Rest folgt vermutlich gleich.',
  'Expertinnen und Experten empfehlen, sich zu {n} eine eigene Meinung zu bilden und diese dann zu googeln.',
  'Hinweis: Diese Übersicht ist auf dem Stand von heute Morgen. Seitdem hat sich niemand beschwert.'
];

export const adPools = {
  generic: [
    ['Vergleichsportal24', '{slug}-vergleich-24.invalid', '{n} Vergleich – Testsieger: der Vergleich', 'Wir vergleichen {n} mit {n}. Das Ergebnis überrascht nur uns.', ['Testsieger', 'Über uns', 'Kündigen (nicht verfügbar)']],
    ['NahDran', '{slug}-in-der-naehe.invalid', '{n} in Ihrer Nähe – 0 m entfernt', 'Sie stehen vermutlich gerade drauf. Jetzt Standort bestätigen.', ['Route', 'Öffnungszeiten', 'Bewertungen']],
    ['Fragebogenwerk', 'ist-{slug}-richtig.invalid', 'Ist {n} das Richtige für Sie? Machen Sie den Test', '47 Fragen, 1 Ergebnis: Kommt drauf an. Dauer: ca. 40 Minuten.', ['Test starten', 'Ergebnis vorab']],
    ['Günstig & Gleich', '{slug}-guenstig.invalid', '{n} günstig – Nur heute. Morgen auch.', 'Bis zu 70 % sparen gegenüber einem Preis, den es nie gab.', ['Angebote', 'Gutscheine', 'Versand']],
    ['Expertenrat Plus', '{slug}-experten.invalid', 'Experten für {n} in Ihrer Region', 'Jetzt anrufen. Wir rufen nicht zurück, aber wir denken an Sie.', ['Rückruf anfordern', 'Kontakt']],
    ['Premiumwelt', '{slug}-premium.invalid', '{n} Premium – Jetzt auch mit {n}', 'Das Original, aber teurer. Sie spüren den Unterschied am Kontostand.', ['Modelle', 'Finanzierung']],
    ['Abo-Abteilung', '{slug}-abo.invalid', '{n} im Abo – monatlich kündbar*', '*Kündigung nur am 31. Februar. Erster Monat kostenlos, danach auch nicht.', ['Tarife', 'FAQ']]
  ],
  food: [
    ['Frischekiste', '{slug}-kiste.invalid', '{n}-Abo – jede Woche wieder {n}', 'Wir liefern jede Woche. Sie essen jede Woche. Niemand fragt, warum.', ['Kiste wählen', 'Pausieren']],
    ['Superfood Direkt', 'super-{slug}.invalid', '{n} Superfood – jetzt mit 300 % mehr {n}', 'Wissenschaftlich nicht widerlegt, weil niemand nachgesehen hat.', ['Wirkung', 'Shop']]
  ],
  city: [
    ['Zimmer & Zubehör', 'hotels-{slug}.invalid', 'Hotels in {n} – Zimmer frei, Hotel noch im Bau', 'Jetzt buchen und bei Fertigstellung als Erster einchecken.', ['Angebote', 'Lageplan']],
    ['Umzugsprofi', 'umzug-{slug}.invalid', 'Umzug nach {n}? Wir tragen alles außer Kisten', 'Kisten bitte vorher selbst nach {n} bringen.', ['Preise', 'Termin']]
  ],
  person: [
    ['Ticketecke', '{slug}-tickets.invalid', '{n}-Tickets ab 9.999 € – Sitzplatz mit Blick auf den Hinterkopf', 'Garantiert irgendwo im selben Gebäude. Keine Erstattung bei Anwesenheit.', ['Termine', 'Saalplan']],
    ['Fanartikel Welt', '{slug}-fanshop.invalid', 'Pappaufsteller von {n} – lebensgroß*', '*Größe nach Augenmaß. Rückseite unbedruckt.', ['Größen', 'Versand']]
  ],
  car: [
    ['Leasingzentrale', '{slug}-leasing.invalid', '{n} leasen – 0 € Anzahlung, 0 Räder', 'Räder als Zubehör buchbar. Lenkrad im Komfortpaket.', ['Rechner', 'Probefahrt']],
    ['Autoankauf Sofort', '{slug}-ankauf.invalid', '{n} verkaufen? Wir kaufen alles, auch Fremdes', 'Bewertung in 30 Sekunden, Zahlung in 30 Werktagen.', ['Bewertung', 'Ablauf']]
  ],
  everyday: [
    ['App-Werkstatt', '{slug}-app.invalid', '{n}-App – jetzt mit noch mehr Benachrichtigungen', 'Bleiben Sie informiert. Auch über Dinge, die Sie nie wissen wollten.', ['Download', 'Bewertungen']]
  ]
};

export const adNotes = [
  'Diese Anzeige hat den Werbetreibenden 0,41 € gekostet. Bezahlt haben Sie mit Ihrer Aufmerksamkeit.',
  'Die Zielseite ist ebenfalls eine Anzeige. Wir haben die Weiterleitung deshalb abgekürzt.',
  'Der Werbetreibende freut sich über Ihren Klick und hat sofort zwei weitere Anzeigen gebucht.'
];

// Ähnliche Fragen. Die ersten Fragen passen zur Suche, danach driften sie langsam ab.
export const questionPools = {
  generic: [
    ['Ist {n} gesund?', 'In Maßen ja. In Massen auch, aber dann eher für den Händler.', 'forum'],
    ['Wie lange hält {n}?', 'Bis zum Ablauf der Garantie, plus/minus einen Tag.', 'buyazon'],
    ['Kann man {n} einfrieren?', 'Ja. Das Auftauen ist der schwierigere Teil der Beziehung.', 'forum'],
    ['Was kostet {n}?', 'Zwischen 0,32 € und 6.499,00 €. Der Unterschied liegt im Namen.', 'buyazon'],
    ['Warum heißt {n} {n}?', 'Weil ein anderer Name bereits vergeben war.', 'wickipedia'],
    ['Ist {n} noch erlaubt?', 'Ja, solange niemand fragt. Diese Frage zählt nicht.', 'news'],
    ['Wo bekomme ich {n} her?', 'Meistens von dort, wo es gerade nicht mehr vorrätig ist.', 'klein'],
    ['Kann man {n} zurückgeben?', 'Innerhalb von 14 Tagen, wenn Sie den Karton noch haben und er Sie noch erkennt.', 'buyazon'],
    ['Was ist der Unterschied zwischen {n} und {n}?', 'Optisch keiner. Preislich etwa 40 €.', 'chatgpp']
  ],
  food: [
    ['Wie viele Kalorien hat {n}?', 'Ungefähr so viele, wie man danach bereut.', 'wickipedia'],
    ['Ist {n} Obst oder Gemüse?', 'Juristisch ein Lebensmittel. Emotional eine Entscheidung.', 'forum'],
    ['Kann man {n} roh essen?', 'Man kann. Ob man sollte, ist eine Frage an die Mitbewohner.', 'forum'],
    ['Wie lagert man {n} richtig?', 'Kühl, trocken und außerhalb der Sichtweite hungriger Personen.', 'wickipedia'],
    ['Warum ist {n} so teuer geworden?', 'Inflation, Transport und ein Grafikdesigner für das neue Etikett.', 'news']
  ],
  city: [
    ['Ist {n} eine schöne Stadt?', 'Die Bewertungen schwanken je nach Wetter und Parkplatzsituation.', 'forum'],
    ['Was kann man in {n} unternehmen?', 'Ankommen, Kaffee trinken, nach dem Bahnhof fragen.', 'news'],
    ['Wie viele Einwohner hat {n}?', '{population}. Die Zahl wurde durch Zählen ermittelt.', 'wickipedia'],
    ['Lohnt sich ein Umzug nach {n}?', 'Ja, falls die Wohnung dort bereits auf Sie wartet. Bisher wartet sie nicht.', 'klein'],
    ['Wie spricht man {n} richtig aus?', 'So, wie es geschrieben steht, nur mit mehr Selbstbewusstsein.', 'forum']
  ],
  person: [
    ['Wie groß ist {n}?', 'Auf Fotos unterschiedlich. Der Bildausschnitt spielt eine große Rolle.', 'forum'],
    ['Was macht {n} gerade?', 'Wahrscheinlich nicht dasselbe wie Sie. Beweise liegen nicht vor.', 'news'],
    ['Kennt {n} mich?', 'Bisher gibt es dafür keine Hinweise. Die Hoffnung bleibt im Browser gespeichert.', 'chatgpp'],
    ['Wo wohnt {n}?', 'Diese Information bleibt privat. Das ist auch gut so.', 'wickipedia'],
    ['Hat {n} WLAN?', 'Sehr wahrscheinlich. Das Passwort steht aber nicht hier.', 'forum']
  ],
  car: [
    ['Wie viel verbraucht ein {n}?', 'Laut Hersteller wenig, laut Fahrer mehr, laut Tankstelle alles.', 'forum'],
    ['Ist {n} zuverlässig?', 'Ja, vor allem beim Aufleuchten der Warnlampen.', 'news'],
    ['Passt ein Kinderwagen in den Kofferraum von {n}?', 'Ja. Das Kind fährt dann mit dem Bus hinterher.', 'forum'],
    ['Was kostet {n} gebraucht?', 'Den letzten Preis. Danach kommt der allerletzte Preis.', 'klein'],
    ['Wie schnell fährt ein {n}?', 'So schnell wie das Auto vor ihm.', 'youtuba']
  ],
  everyday: [
    ['Wie funktioniert {n}?', 'Zuerst ganz einfach, dann mit Passwort, dann mit dem Kundenservice.', 'forum'],
    ['Warum geht {n} nicht?', 'Häufigste Ursache: Es wurde benutzt. Zweithäufigste: Es wurde nicht benutzt.', 'forum'],
    ['Wie lange dauert {n}?', 'Ein paar Minuten, laut Anleitung. Den Nachmittag, laut Erfahrung.', 'chatgpp'],
    ['Kann man {n} online erledigen?', 'Ja, nach Ausdrucken, Unterschreiben und Einscannen.', 'news']
  ]
};

export const driftQuestions = [
  ['Warum suche ich das eigentlich?', 'Diese Frage stellen sich laut Statistik 94 % aller Menschen nach der vierten Frage.', 'forum'],
  ['Wie viele ähnliche Fragen gibt es?', 'Mehr als vorher. Mit jedem Klick werden es zwei mehr.', 'wickipedia'],
  ['Kann man „Ähnliche Fragen“ ausschalten?', 'Ja, durch Schließen des Tabs. Die Fragen warten dann geduldig.', 'forum'],
  ['Was wollte ich ursprünglich suchen?', 'Das steht ganz oben im Suchfeld. Sie sind nur sehr weit gescrollt.', 'chatgpp'],
  ['Wie spät ist es eigentlich?', 'Später als beim Öffnen dieser Box.', 'news'],
  ['Habe ich heute schon etwas getrunken?', 'Gute Gelegenheit. Die Fragen laufen nicht weg.', 'forum'],
  ['Warum sind die Fragen nicht mehr ähnlich?', 'Sie sind einander inzwischen sehr ähnlich. Nur nicht mehr Ihrer Suche.', 'wickipedia'],
  ['Wer stellt eigentlich diese Fragen?', 'Andere Menschen. Vermutlich gerade auch in einer sehr langen Liste.', 'chatgpp'],
  ['Ist es zu spät, jetzt noch produktiv zu werden?', 'Nein. Aber diese Antwort lesen gilt noch nicht als produktiv.', 'forum'],
  ['Gibt es ein Ende dieser Liste?', 'Ja. Es ist näher, als Sie denken.', 'news']
];

export const panelFacts = {
  city: [
    ['Fläche', 'reicht bis zum Ortsschild'],
    ['Öffnungszeiten', 'Durchgehend geöffnet · Schließt nie'],
    ['Bürgermeister/in', 'im Rathaus, bitte klingeln'],
    ['Höhe', 'von unten gemessen']
  ],
  person: [
    ['Bekannt durch', 'Suchanfragen wie diese'],
    ['Größe', 'auf Fotos unterschiedlich'],
    ['Aktueller Aufenthaltsort', 'nicht in diesem Browser'],
    ['Lieblingsessen', 'nicht öffentlich, vermutlich essbar']
  ],
  car: [
    ['Höchstgeschwindigkeit', 'laut Prospekt'],
    ['Verbrauch', 'hängt davon ab, wer fragt'],
    ['Sitzplätze', '5, davon einer für die Jacke'],
    ['Kofferraum', 'Getränkekiste oder Kinderwagen, nicht beides'],
    ['Preis', 'ab „auf Anfrage“']
  ],
  tech: [
    ['Akkulaufzeit', 'bis kurz vor Ende des Films'],
    ['Speicher', 'voll'],
    ['Nächstes Update', 'jetzt gleich'],
    ['Gewicht', 'mit Hülle mehr']
  ],
  object: [
    ['Gewicht', 'inklusive Verpackung schwerer'],
    ['Fundort', 'meistens in der anderen Schublade'],
    ['Haltbarkeit', 'bis zum nächsten Umzug']
  ]
};

export const nutrition = [
  ['Brennwert', 'ja'],
  ['Fett', 'etwas, falls vorhanden'],
  ['Kohlenhydrate', 'eher viele als keine'],
  ['Eiweiß', 'freundlich'],
  ['Vitamin C', 'vorhanden, solange keiner nachmisst'],
  ['Salz', 'nach Geschmack der Packung']
];

export const foodKinds = { fruit: 'Obst', vegetable: 'Gemüse', nut: 'Nuss', pantry: 'Vorratsschrank', dairy: 'Milchprodukt', meal: 'Gericht' };

export const panelReviews = {
  city: ['„Zu viele Häuser, aber gut verteilt.“', '„War schon mal da. Hat mich wiedererkannt.“', '„Bahnhof vorhanden. Züge gelegentlich.“'],
  food: ['„Schmeckt wie auf dem Foto, nur weniger glänzend.“', '„Hat mir das Frühstück gerettet und das Mittagessen ersetzt.“'],
  car: ['„Fährt. Mehr wollte ich nicht.“', '„Die Hupe ist das Beste am Auto.“']
};
