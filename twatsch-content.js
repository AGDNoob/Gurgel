export const CHANNEL = { name: 'FinnBaut', handle: 'finnbaut', person: 'Finn', description: 'Ich baue den 20-Cent-PC von Buyazon. Rückgabe wäre teurer.', category: 'Basteln & Hardware', followers: 12847 };
export const CHATTERS = [
  { name: 'KabelsalatMax', color: '#55d6be', role: 'vip' },
  { name: 'NeleSchraubt', color: '#ffbb69', role: '' },
  { name: 'UteMitBanhammer', color: '#65d888', role: 'mod' },
  { name: 'KartonKalle', color: '#dc94ff', role: 'sub' },
  { name: 'OmaIstImChat', color: '#ff8fa4', role: '' },
  { name: 'LarsHatEinMultimeter', color: '#68baff', role: 'sub' },
  { name: 'nurkurzhier', color: '#e8df7e', role: '' },
  { name: 'keinBildAberRGB', color: '#c0a3ff', role: 'sub' },
  { name: 'MertMitKabel', color: '#fa977a', role: '' },
  { name: 'BrotMitTreibern', color: '#9ed87b', role: '' },
  { name: 'pixelpaula', color: '#84cfed', role: 'vip' },
  { name: 'HerrWerkseinstellung', color: '#d49eba', role: '' }
];
export const REWARDS = [
  { id: 'hands', title: 'Kamera auf die Hände', cost: 150, description: '30 Sekunden Nahaufnahme. Endlich Beweismaterial.' },
  { id: 'measure', title: 'Bitte einmal nachmessen', cost: 250, description: 'Finn prüft den aktuellen Fehler und die Temperatur.' },
  { id: 'upright', title: 'Richtig rum, bitte', cost: 300, description: 'Der Monitor bekommt seine ursprüngliche Orientierung zurück.' },
  { id: 'coffee', title: 'Kaffeepause genehmigen', cost: 450, description: 'Finn ist kurz weg. Der PC macht trotzdem weiter.' }
];
export const GOAL_NAMES = {
  power: 'Erst mal Strom finden', cable: 'Kein Bild. Aber ein sehr teures Kabel.', ram: 'RAM macht nur fast klick',
  film: 'Die Folie ist noch am Kühler', paste: 'Wärmeleitpaste. Keine Zahnpasta.', drive: 'Das Betriebssystem braucht ein Zuhause',
  usb: 'Installationsstick gesucht', install: 'Installation läuft. Laut eigener Aussage.', drivers: 'Grafikkarte sucht sich selbst',
  benchmark: 'Kann der 20-Cent-PC Crysis?', tidy: 'Der Deckel möchte nicht mitspielen', stable: '20 Cent im Langzeittest'
};
export const LINES = {
  power: ['Das Netzteil ist an. Also der Schalter. Der Rest muss sich noch beweisen.', 'Da ist Strom drauf. Der Lüfter hat es zuerst bemerkt.', 'Ich habe jetzt hinten eingeschaltet. Vorne weiß noch keiner Bescheid.'],
  cableWrong: ['Das passt da rein, wenn ich es nicht ganz reinstecke.', 'Im Mainboard ist auch so ein Loch. Ich nehme erst mal das.', 'Der Stecker hat jetzt einen anderen Parkplatz. Bild ist noch nicht dabei.'],
  cable: ['Jetzt steckt das HDMI-Kabel in der Grafikkarte. Das war erstaunlich spezifisch.', 'Bild! Ich fasse ab jetzt nur noch Sachen an, die nicht dafür zuständig sind.', 'Die Grafikkarte bekommt jetzt auch das Kabel. Wir führen die beiden mal zusammen.'],
  rotate: ['Ich drehe das mal um. Den Monitor kann man wenigstens gut anfassen.', 'So. Andere Richtung. Das muss das Kabel jetzt selbst verstehen.', 'Monitor gedreht. Der Stecker sieht von hier aus tatsächlich anders aus.'],
  correct: ['Ach so. Den STECKER. Ja, das ist ein anderes Bauteil.', 'Du meintest das Kabel. Ich habe inzwischen auch die anderen Wörter gelesen.', 'Okay, ich ändere den Anschluss. Der Bildschirm bleibt erst mal in seiner neuen Position.'],
  upright: ['Der Monitor steht wieder richtig. Die Tischplatte kann aufatmen.', 'Wieder waagerecht. Bitte merken, welche Seite vorher oben war.', 'Das Bild war nicht kaputt, es war nur sehr seitlich.'],
  ram: ['Jetzt hat es geklickt. Vorher war das offenbar nur ein dekorativer RAM.', 'Der Riegel sitzt. Ich habe aufgehört, ihn von oben zu überreden.', 'RAM neu eingesetzt. Auf der Verpackung stand tatsächlich nicht „lose beilegen“.'],
  film: ['Da ist eine Folie. Die war also nicht Teil der Kühlung.', 'Die Schutzfolie hat bis gerade sehr zuverlässig vor Wärmeübertragung geschützt.', 'Abgezogen. Der Kühler darf jetzt an der Arbeit teilnehmen.'],
  paste: ['Ein kleiner Punkt Paste. Ich benutze ausnahmsweise nicht den ganzen Lieferumfang.', 'Wärmeleitpaste drauf. Die Tube darf den Rest behalten.', 'Neue Paste, Kühler wieder drauf. Das war jetzt auffällig vernünftig.'],
  toothpaste: ['Die Tube stand daneben. Das konnte ich vorher nicht wissen.', 'Zahnpasta drauf. Falls es nicht kühlt, ist es wenigstens sehr frisch.', 'Minze ist auch eine Sorte Kühlung. Auf dem Etikett zumindest.'],
  wipe: ['Ich mache die Zahnpasta wieder runter. Der Prozessor hat keine Zähne.', 'Alles sauber. Die Tube kommt jetzt ins andere Zimmer.', 'Die Minze ist entfernt. War vermutlich kein Treiberproblem.'],
  drive: ['SSD sitzt. Das Betriebssystem hat jetzt eine Adresse.', 'Ein Datenträger. Der Karton war bis gerade mein größtes Speichermedium.', 'Da passt sie hin. Nicht in den RAM-Slot. Das schreiben wir gleich noch dazu.'],
  usb: ['Installationsstick steckt. Der PC hat jetzt etwas zum Lesen.', 'USB wieder drin. Die Installation hatte sich schon nach ihm umgesehen.', 'Der Stick darf bis zum Ende bleiben. Niemand schmeißt hier Datenträger raus.'],
  unplug: ['Stick raus. Die Installation hat sofort aufgehört. Sehr direktes Feedback.', 'Er ist draußen. Jetzt installiert sich erst mal nichts weiter.', 'Das war der Installationsstick. Betonung liegt inzwischen auf „war“.'],
  install: ['Ich drücke auf Installieren. Die Prozentzahl übernimmt ab hier die Unterhaltung.', 'Installation läuft. Wir schauen gemeinsam einer Zahl beim Größerwerden zu.', 'Er kopiert Dateien. Ich habe diesmal sogar welche dabei.'],
  installed: ['Desktop. Der hat länger gebraucht als der Versand.', 'Das Betriebssystem ist da. Ich würde es gern kurz behalten.', 'Wir haben einen Desktop. Für 20 Cent finde ich den schon recht vollständig.'],
  drivers: ['Treiberinstallation. Wenn das Bild gleich weg ist, hoffen wir mal, dass es dazugehört.', 'Ich installiere den Grafiktreiber. Der Bildschirm bekommt dafür kurz frei.', 'Der Treiber weiß angeblich, welche Grafikkarte das ist. Schön, wenn es einer weiß.'],
  driverDone: ['Bild wieder da. Das war ausnahmsweise angekündigt.', 'Treiber fertig. Ich kann jetzt dieselben Fenster etwas flüssiger verschieben.', 'Grafikkarte erkannt. Wir sind uns auch beim Namen noch nicht ganz einig.'],
  benchmark: ['Crysis ist offen. Wir sind im Menü. Ich würde das erst mal als Level zählen.', 'Der Test läuft. Die FPS kommen einzeln, damit wir sie kennenlernen können.', 'Jetzt wird gespielt. Vorläufig gegen die Einstellungen.'],
  tidy: ['Kabelbinder dran. Das Kabel wohnt jetzt innerhalb des Gehäuses.', 'Aufgeräumt. Der Deckel hat seine Meinung geändert.', 'Die Kabel liegen jetzt so, als hätte ich vor dem Zusammenbau davon gewusst.'],
  lidBlocked: ['Der Deckel geht nicht zu. Das Kabel hat offenbar Mietrecht.', 'Ich drücke nicht weiter. Das Geräusch klang nach Zusatzkosten.', 'Das Gehäuse ist voll. Der Deckel ist damit noch nicht einverstanden.'],
  boost: ['Turbo an. Die Temperatur hat sofort Interesse gezeigt.', 'Übertaktet. Wir tauschen gerade Ruhe gegen ungefähr vier Bilder.', 'Mehr Takt. Falls das schiefgeht, war der PC immer noch billiger als der Strom.'],
  normal: ['Wieder Standardtakt. Der Lüfter klingt nicht mehr wie eine Wegbeschreibung zum Flughafen.', 'Turbo aus. Die Temperatur darf wieder sitzen bleiben.', 'Werkseinstellung. Ein sehr unterschätztes Zubehörteil.'],
  reset: ['Neustart. Der Rechner hat kurz so getan, als würde er mich nicht kennen.', 'Er startet neu. Bitte bis dahin nichts bestellen, das hier auch noch reinmuss.', 'Reset gedrückt. Alle aktuellen Probleme treffen sich gleich wieder im BIOS.'],
  waiting: ['Okay, wir warten. Ich lasse zur Abwechslung die Finger da liegen.', 'Nicht anfassen. Das ist bisher die schwierigste Anweisung heute.', 'Ich warte jetzt wirklich. Das nächste Geräusch kommt nicht von mir.'],
  coffee: ['Kaffee. Bitte in meiner Abwesenheit keine Hardware erfinden.', 'Bin kurz weg. Der Rechner bleibt an. Der Chat vermutlich auch.', 'Ich hole Kaffee. Das ist ein anderes Flüssigkeitskühlsystem.'],
  back: ['Wieder da. Warum läuft der Lüfter anders?', 'Kaffee ist da. Was hat er gemacht, während ich weg war?', 'Ich war dreißig Sekunden weg. Das ist für diesen PC ein langes Leben.'],
  success: ['Er läuft. Deckel zu, Bild da, Temperatur normal. Ich sichere dieses Gefühl nicht als BIOS-Profil.', 'Ein funktionierender PC. Für 20 Cent. Ich traue mich nicht, den Warenkorb anzuschauen.', 'Das Ding läuft tatsächlich. Wir testen jetzt, ob es damit auch wieder aufhören kann.'],
  protection: ['Er ist ausgegangen. Das war keine Abstimmung.', 'Schwarz. Der Prozessor hat die Mittagspause selbst beantragt.', 'Temperaturschutz. Der einzige hier, der konsequent Grenzen setzt.'],
  installReset: ['Nach dem Neustart sind wir wieder beim letzten Installationsschritt. Sehr großzügig, dass er überhaupt einen behalten hat.', 'Wir haben Prozent verloren. Das passiert sonst eher meinem Handy.', 'Die Installation hat uns zurückgestuft. Ich fasse jetzt erst mal nur den Tisch an.']
};

// Aussagen beziehen sich auf einen beobachtbaren Zustand, nicht auf Suchwort-Platzhalter.
export const AMBIENT = {
  power: [
    [0, 'Hinten ist noch aus. Das Netzteil ist kein WLAN-Gerät.'], [5, 'Ich messe aus der Ferne ungefähr null Volt.'], [4, 'Bei meinem Fernseher gibt es dafür eine Taste.'], [8, 'Der Lüfter wartet auf seinen ersten Arbeitstag.'], [3, 'Hat er den Strom einzeln bestellt?']
  ],
  cable: [
    [1, 'Das HDMI-Kabel steckt da gerade wirklich im USB-Anschluss.'], [0, 'Weiter unten. An der Grafikkarte. WEITER UNTEN.'], [7, 'kein Bild aber immerhin ein Anschluss'], [5, 'Der rechteckige Stecker ist nicht automatisch der richtige.'], [10, 'Ich habe das Bild heller gestellt. Jetzt ist das Schwarz heller.'], [6, 'Bin wieder da. Hat er inzwischen ein Signal?']
  ],
  ram: [
    [1, 'Ein RAM-Clip steht noch offen. Sieht man sogar durch die Kamera.'], [5, 'Das orange Lämpchen sagt DRAM. Nicht Drama.'], [9, 'Er sollte den RAM auch elektrisch einbauen.'], [3, 'War der Riegel im Karton wenigstens fest?'], [0, 'Einmal richtig einsetzen, Finn. Nicht nur daneben wohnen lassen.']
  ],
  film: [
    [1, 'Da hängt noch die Lasche am Kühler.'], [0, 'Warum kann ich auf der Kontaktfläche REMOVE lesen?'], [5, 'Die Temperatur steigt schneller als die Zuschauerzahl.'], [8, 'Die Folie gibt thermisch wirklich alles. Also nichts.'], [11, 'Das ist Schutzfolie. Sie schützt leider vor Kühlung.'], [10, 'Ich dachte, das wäre ein Wasserzeichen.']
  ],
  paste: [
    [1, 'Bitte Wärmeleitpaste. Keine Zahn-, Wand- oder Leberpaste.'], [9, 'Die Tube mit dem Zahn drauf ist wahrscheinlich ein Hinweis.'], [3, 'Der PC hat jetzt einen besseren Atem als ich.'], [5, 'Minze ist keine SI-Einheit.'], [0, 'Kleiner Punkt reicht. Wir verfugen hier kein Bad.']
  ],
  drive: [
    [11, 'No boot device heißt nicht, dass der Schuh fehlt.'], [1, 'SSD liegt links neben der Schraube, die übrig bleiben sollte.'], [3, 'Die Verpackung hat jedenfalls schon 2 TB Luft.'], [8, 'Wir könnten das Betriebssystem vorerst im Chat lagern.'], [5, 'Bitte keinen Datenträger in den Lüfter stecken.']
  ],
  usb: [
    [0, 'Der Installationsstick fehlt. Wieder.'], [4, 'Ist der kleine blaue Riegel Essen?'], [1, 'Reinstecken und diesmal drin lassen.'], [9, 'Ohne Stick nur Gedankeninstallation.'], [6, 'Hab ich das Herausziehen verpasst oder war das vor meiner Zeit?']
  ],
  install: [
    [3, 'Ich habe länger auf den Karton gewartet. Noch.'], [4, 'Warum darf man die Prozentzahl nicht selbst eingeben?'], [6, 'Bin kurz einkaufen. Lasst mir die 99 übrig.'], [9, 'Datei 184 hat jetzt einen eigenen Spannungsbogen.'], [11, 'Der Balken bewegt sich. Ich habe eine Referenzmarkierung am Bildschirm gemacht.'], [10, 'Jedes Prozent einzeln aus Mumbai eingeflogen.'], [8, 'Fasse den Stick nicht an, Finn. Das ist kein Fortschrittshebel.'], [5, 'Die Lüfterdrehzahl ist höher als die Downloadrate.']
  ],
  drivers: [
    [7, 'Jetzt hat er endlich Bild und installiert etwas, das das Bild entfernt.'], [1, 'Schwarz während der Treiberinstallation ist diesmal tatsächlich vorgesehen.'], [0, 'Bitte NICHT schon wieder den Stecker wechseln.'], [10, 'Ich bleibe hier, bis der Mauszeiger wieder da ist.'], [6, 'Ist das die Nachtversion vom Desktop?']
  ],
  benchmark: [
    [3, 'Das Menü hat mehr gekostet als der PC.'], [7, 'Ich kann die einzelnen FPS mit Namen begrüßen.'], [1, 'Die Temperatur bitte mitlesen, bevor jemand Turbo schreibt.'], [8, 'Kann er wenigstens den Papierkorb in 60 FPS öffnen?'], [11, 'Für einen ordentlichen Vergleich brauchen wir einen zweiten 20-Cent-PC.'], [4, 'Hat das Spiel auch ein Inhaltsverzeichnis?'], [10, 'Grafik auf niedrig. Erwartungen sind schon unten.']
  ],
  tidy: [
    [0, 'Der Deckel passt, wenn er das Kabel vorher aus der Tür nimmt.'], [1, 'Kabelbinder liegen rechts. Nein, das sind Spaghetti. Die anderen.'], [3, 'Verkaufe die übrig gebliebene Schraube. Dann ist der Rechner refinanziert.'], [5, 'Geschlossenes Gehäuse wäre als Testbedingung durchaus üblich.'], [8, 'Kabelmanagement bedeutet nicht, dem Kabel Personalverantwortung zu geben.']
  ],
  stable: [
    [6, 'Bin wieder da. Warum funktioniert das?'], [3, 'Falls er jetzt teurer wird, haben wir aus Versehen investiert.'], [1, 'Bitte diese Konfiguration so lassen. Ich habe schon einen Screenshot.'], [9, 'Ein PC für 20 Cent und zwölf Leute, die ihn festhalten.'], [4, 'Kann ich darauf meine Fotos anschauen?'], [11, 'Ich notiere: Einmal korrekt verkabelt hilft.'], [10, 'Ich war nur wegen des Kartons hier. Bin jetzt seit einer Stunde drin.'], [7, 'Der Lüfter dreht sich immer noch. Das ist inzwischen Content.']
  ]
};
export const EVENT_CHAT = {
  rotate: [[0, 'ER HAT DEN MONITOR GEDREHT'], [10, 'querformat wurde erweitert'], [1, 'Der Tipp war zum Stecker. STECKER.'], [4, 'Muss ich mein Tablet jetzt auch drehen?']],
  cable: [[7, 'BILD Pog'], [0, 'Es war tatsächlich der Anschluss. Wir haben es vorher nur 19 Mal gesagt.'], [5, 'Signal vorhanden. Ich muss mich kurz daran gewöhnen.']],
  ram: [[1, 'Das war das Klickgeräusch, das wir gesucht haben.'], [9, 'Riegel hat Kontakt zu seiner Arbeitsstelle aufgenommen.']],
  toothpaste: [[0, 'FINN NEIN'], [1, 'Das ist Zahnpasta. Guck auf die Tube.'], [9, '32 Kerne, 0 Karies'], [2, 'Keine weiteren Zahnpasta-Marken posten. Wir werden sonst noch gefunden.']],
  protection: [[7, 'F'], [1, 'Erst die Folie ab, dann wieder an.'], [5, 'Das war eine Schutzabschaltung. Kein erfolgreicher Benchmark.']],
  installed: [[10, 'DESKTOP'], [3, 'Kannst den Karton jetzt als Zweitmonitor verwenden.'], [4, 'Das sieht aus wie mein Computer. Nur ohne die ganzen Symbole.']],
  success: [[0, 'Ich trau mich nicht zu schreiben, sonst geht er wieder aus.'], [1, 'Wir haben ihn gebaut. Also wir hauptsächlich mit Großbuchstaben.'], [3, '20 Cent. Bitte alle kurz auf die Rechnung schauen.'], [7, 'Pog']],
  unplug: [[0, 'Warum muss bei ihm alles immer wieder raus'], [1, 'Den brauchen wir noch.'], [11, 'Installationsmedium wurde erfolgreich deinstalliert.']],
  reset: [[6, 'Ich bin eine Minute weg und wir sind wieder im BIOS?'], [1, 'Jetzt bitte erst den Schritt zu Ende machen.']]
};

// Nebenunterhaltungen haben mehrere Sprecher und ein Ende. Sie laufen nicht
// bei jeder Nachricht neu an und werden innerhalb eines Durchlaufs nicht wiederholt.
export const SIDE_THREADS = [
  [[6, 'Bin neu hier. Warum kostet der PC 20 Cent?'], [3, 'Die Büroklammer daneben kostet 6.499 Euro.'], [6, 'Ist das ein Set?'], [3, 'Nein. Ich habe nur den günstigen Teil genommen.']],
  [[4, 'Mein Enkel sagt, ich soll meinen Computer entstauben.'], [1, 'Ausmachen, vom Strom nehmen, vorsichtig reinigen.'], [4, 'Das habe ich gemacht. Jetzt fehlen die Fotos.'], [1, 'Du hast aber nicht den Papierkorb geleert?'], [4, 'Der war ja auch voll.']],
  [[9, 'Meine Bewerbung als Treiber wurde abgelehnt.'], [8, 'Woran lag es?'], [9, 'Kein Führerschein.'], [5, 'Endlich ein Treiberproblem, bei dem ich helfen kann.']],
  [[3, 'Buyazon fragt, ob die Verpackung angemessen war.'], [10, 'War sie?'], [3, 'Der Rechner lag in einem Briefumschlag.'], [10, 'Gepolstert?'], [3, 'Mit einer Mahnung.']],
  [[11, 'Ich habe für den Stream einen zweiten Bildschirm gekauft.'], [0, 'Damit du Chat und PC gleichzeitig siehst?'], [11, 'Damit ich die Anleitung für den ersten lesen kann.'], [1, 'Wir verlieren hier gerade einen Zuschauer an ein Nebenprojekt.']],
  [[8, 'Habe Lieferlahm offen. Jemand Hunger?'], [9, 'Wie lang dauert die Pizza?'], [8, 'Zwölf Minuten. Die Gabel kommt morgen per Spedition.'], [4, 'Ich habe eine hier.'], [8, 'Kannst du die für 600 Euro einstellen? Dann kauft Buyazon sie zurück.']],
  [[10, 'Ich habe den Stream bei Nixflix vorgeschlagen.'], [6, 'Als Serie?'], [10, 'Als Dokumentation über Geduld.'], [2, 'Bitte keine Spoiler zur Prozentzahl.']],
  [[5, 'Mein Multimeter braucht eine neue Batterie.'], [0, 'Miss doch, ob die alte wirklich leer ist.'], [5, 'Womit?'], [0, 'Ich sehe das Problem.']],
  [[3, 'Die übrig gebliebene Schraube hat inzwischen einen Warenkorbwert von 21 Cent.'], [11, 'Verkaufst du sie?'], [3, 'Nein. Dann gehört mir der teuerste Teil des Rechners nicht mehr.'], [7, 'Diamond Schrauben']],
  [[6, 'War kurz auf Wickipedia. Dort steht, RAM verliert beim Ausschalten alles.'], [4, 'Ich auch manchmal beim Aufstehen.'], [1, 'Das nennt man Türrahmeneffekt.'], [4, 'Der PC steht doch gar nicht in der Tür.']],
  [[8, 'Finn hat mein Paket angenommen.'], [0, 'Was war drin?'], [8, 'Das weiß ich jetzt nicht mehr so genau.'], [3, 'Schreib mal, ob dein Karton jetzt 128 GB RAM hat.']],
  [[11, 'Habe im Bürgerbürokratie-Formular diesen Stream als letzte Fortbildung angegeben.'], [2, 'Wurde es akzeptiert?'], [11, 'Nein. Sie wollen eine Bescheinigung vom Netzteil.'], [5, 'Das kann ich unterschreiben, sobald meine Batterie da ist.']]
];
