// Redaktionell geschriebene Inhalte. Alle Anbieter und Vorgänge sind erfunden.
export const extraSites = {
  gaehmail: { name: 'Gähmail', domain: 'gaehmail.invalid', color: '#d93025', letter: 'M', path: 'Posteingang' },
  buerger: { name: 'Bürgerbürokratie', domain: 'amt.gurgel.invalid', color: '#174b77', letter: '§', path: 'Online-Dienste' },
  instakram: { name: 'Instakram', domain: 'instakram.invalid', color: '#be3278', letter: '◎', path: 'feed' },
  fazebook: { name: 'Fazebook', domain: 'fazebook.invalid', color: '#0866ff', letter: 'f', path: 'feed' },
  lieferlahm: { name: 'Lieferlahm', domain: 'lieferlahm.invalid', color: '#f36805', letter: 'L', path: 'speisekarte' },
  nixflix: { name: 'Nixflix', domain: 'nixflix.invalid', color: '#e50914', letter: 'N', path: 'serien' },
  twatsch: { name: 'Twatsch', domain: 'twatsch.invalid', color: '#9146ff', letter: '▣', path: 'FinnBaut' }
};
export function hash(value) { return [...String(value)].reduce((n, c) => Math.imul(n ^ c.codePointAt(0), 16777619) >>> 0, 2166136261); }
export function rng(seed) { let n = seed >>> 0; return () => { n += 0x6D2B79F5; let t = Math.imul(n ^ n >>> 15, 1 | n); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function shuffled(items, seed) { const random = rng(seed); const copy = [...items]; for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; }
export const products = [
  ['Gaming-PC mit 128 GB RAM, RTX Irgendwas', 'pc', .20, 'Spielt alle Spiele. Der Einschaltknopf ist ein kostenpflichtiger DLC.'],
  ['Büroklammer, einzeln, mit Stammbaum', 'clip', 6499, 'Lückenloser Herkunftsnachweis bis zur ersten Büroklammer. Nicht aus Platin.'],
  ['Unsichtbare Gurke · Premium', 'cucumber', 49.99, 'Bitte vor dem Anschneiden wiederfinden.'],
  ['Mango mit bereits beantworteter Sicherheitsfrage', 'mango', 8.49, 'Name Ihres ersten Haustiers: Mango.'],
  ['WLAN-Verlängerungskabel, 50 Meter', 'router', 3.12, 'Verbindet zwei Orte, an denen kein WLAN ist.'],
  ['Ein einzelner linker Airpod für das rechte Ohr', 'parcel', .07, 'Spielt die andere Hälfte des Liedes.'],
  ['Banane, vorinstalliert', 'banana', 1199, 'Inklusive zwei Jahren Updates für die Schale.'],
  ['Kartoffel mit USB-C', 'potato', .49, 'Lädt nicht. Ist jetzt aber Standard.'],
  ['Neuwagen als Briefsendung', 'car', 4.20, 'Bitte Briefkasten auf Fahrzeuggröße erweitern.'],
  ['Druckerpatrone Magenta · ohne Druckerpatrone', 'pc', 89.99, 'Der Drucker merkt den Unterschied sofort.'],
  ['Ein Quadratmeter Dienstag', 'city', 27, 'Nur dienstags nutzbar. Mittwoch muss zurückgebaut werden.'],
  ['Erdnuss, entsperrt für alle Netze', 'nuts', .03, 'Vertrag läuft 24 Monate. Knacken gilt als Kündigung.'],
  ['Toast mit Seriennummer', 'bread', 17.99, 'Registrierung vor dem ersten Bissen erforderlich.'],
  ['Paket aus einem Paket-Unboxing', 'parcel', 6.30, 'YouTuba-zertifizierter Karton. Inhalt separat erhältlich.'],
  ['Regenwolke für den Balkon', 'cloud', 2.79, 'Nachbarn im Erdgeschoss benötigen keine eigene.'],
  ['Taschenrechner mit nur einer 2', 'calculator', .32, 'Für weitere Zweien bitte mehrfach drücken.']
].map(([title, asset, price, description], i) => ({ id: `catalog-${i}`, site: 'buyazon', title, asset, price, description, topic: { name: title, category: 'object', group: 'object' }, stars: String(3.1 + (i % 5) * .4), reviews: 17 + i * 193, place: 'Dortmund' }));

const creators = [
  ['Finns Fehlversuche', 'F', '842.000'], ['KartonKalle', 'K', '12.400'], ['Nele erklärt kurz', 'N', '6.300'], ['MiniMöhren', 'M', '1,8 Mio.'], ['Amtlich LIVE', 'A', '318'], ['TurboTimo', 'T', '2,1 Mio.'], ['Oma lädt hoch', 'O', '91.000'], ['PixelPanne', 'P', '407.000'], ['Herr Beige', 'H', '84'], ['Zwei linke Hände', 'Z', '54.600'], ['Garten ohne Plan', 'G', '27.000'], ['Fakten ohne Intro', 'F', '1.204']
];
const videoRows = [
  ['Ich habe 24 STUNDEN nicht geatmet (GONE WRONG)', 'portrait', 3, 'drop', 0, 'challenge', '24 STUNDEN?!', 'Das Experiment wurde nach dem Einatmen abgebrochen.'],
  ['80 Kartons auspacken, um einen Karton zu finden', 'parcel', 12, 'unbox', 1, 'unboxing', 'KARTON IN KARTON', 'Die Verpackung war tatsächlich gut verpackt.'],
  ['Wir lernen die Farben! Heute: Beige. Morgen: Beige.', 'carrot', 30, 'spin', 3, 'kids', 'HALLO BEIGE!', 'MiniMöhren fährt mit einem Karottenbus durch drei beige Zimmer.'],
  ['Ich habe meinen Drucker beleidigt. Er druckt meinen Lebenslauf.', 'pc', 8, 'printer', 7, 'tech', 'ER HAT MAGENTA', 'Die dritte Seite ist eine Beschwerde über mich.'],
  ['Dortmund Speedrun: am Bahnhof umgedreht', 'city', 8, 'city', 5, 'travel', 'ALLES GESEHEN', 'Keine Sehenswürdigkeit wurde durch die Aufnahme gestört.'],
  ['GURKE vs. HYDRAULIKPRESSE (Presse nicht geliefert)', 'cucumber', 12, 'drop', 0, 'challenge', 'SIE HAT GEWONNEN', 'Wir haben die Gurke höflich gefragt, ob sie sich flach hinlegen kann.'],
  ['Mein WLAN braucht einen Sitzplatz im Bus', 'router', 8, 'signal', 7, 'tech', 'NUR EIN BALKEN', 'Der Router fährt bis zur Endhaltestelle.'],
  ['ASMR: Formblatt 28b wird NICHT umgeblättert', 'parcel', 45, 'sleep', 4, 'asmr', 'PAPIER BLEIBT', 'Kopfhörer empfohlen. Es passiert absolut nichts Lautes.'],
  ['Oma bewertet meine 6.499-Euro-Büroklammer', 'clip', 30, 'identity', 6, 'review', 'WAS KOSTET DIE?!', 'Sie hat dieselbe noch in der Schublade. Für mich ist das schlecht.'],
  ['10 Dinge, die du über Mangos wissen musst. Nummer 1: Mango.', 'mango', 12, 'spin', 2, 'list', 'NUMMER 2 FEHLT', 'Die anderen neun Dinge stehen auf dem Einkaufszettel.'],
  ['Ich baue ein Auto aus einem Auto (Tutorial)', 'car', 45, 'race', 9, 'diy', 'ES FÄHRT NOCH', 'Schritt eins: Das Auto stehen lassen.'],
  ['Der Karottenbus fährt rückwärts zur Kita', 'carrot', 30, 'race', 3, 'kids', 'BRUMM BRUMM!', 'Heute lernen wir: Rückwärts ist eine Fahrtrichtung.'],
  ['UPDATE: Wir sind immer noch bei 99 Prozent', 'pc', 45, 'loading', 7, 'tech', 'FAST FERTIG', 'Live-Berichterstattung aus dem Ladebalken.'],
  ['Ich habe Wasser durch ein Sieb gegossen. Wissenschaft!', 'cloud', 8, 'rain', 2, 'science', 'WO IST ES HIN?', 'Ein Behälter mit sehr vielen Ausgängen.'],
  ['Zimmerpflanze reagiert auf mein Entschuldigungsvideo', 'broccoli', 12, 'sleep', 10, 'reaction', 'KEINE ANTWORT', 'Ich habe sie in Ruhe gelassen. Das kam gut an.'],
  ['VLOG: Heute fast die Mülltonne rausgestellt', 'city', 30, 'city', 8, 'vlog', 'SO NAH DRAN', 'Ich hatte schon Schuhe an.'],
  ['Dieser PC kostet 20 Cent. Kann er Crysis öffnen?', 'pc', 8, 'loading', 5, 'gaming', '20 CENT GAMING', 'Er kann die Verknüpfung anzeigen.'],
  ['3 Zutaten, 0 Gerichte: Ich habe vergessen zu kochen', 'tomato', 12, 'identity', 9, 'cooking', 'BON APPETIT?', 'Zutaten noch einzeln im Kühlschrank.'],
  ['Banane zeichnet ein Gesicht und beantragt ein Konto', 'banana', 30, 'spin', 3, 'kids', 'BANANE SAGT HI', 'Malen, zählen und gegen 14 Uhr zur Bank gehen.'],
  ['24 Stunden in der Warteschleife (Teil 6)', 'router', 45, 'signal', 4, 'live', 'SIE SIND DRAN', 'Die Musik war gestern noch schneller.'],
  ['Ich verkaufe meine Wohnung als USB-Stick', 'parcel', 12, 'unbox', 0, 'challenge', '2 ZIMMER · 8 GB', 'Balkon passt nicht durch den Anschluss.'],
  ['Wie man ein Passwort vergisst. Fortgeschritten.', 'calculator', 8, 'identity', 7, 'tutorial', 'JETZT IST ES WEG', 'Auch der Passwortmanager möchte das Passwort wissen.'],
  ['Rasen mähen ohne Rasen: Nachbar ruft trotzdem Polizei', 'broccoli', 30, 'race', 10, 'garden', 'ER HÖRT ES!', 'Der Mäher ist ebenfalls nicht da.'],
  ['Die ganze Wahrheit über diesen einen Parkplatz', 'city', 45, 'city', 8, 'documentary', 'PLATZ 3', 'Früher stand dort ein anderes Auto.']
];
export function clockTime(seconds) { return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`; }
export function videoDetails(result, seed = 1) {
  const value = hash(`${result.title}:${seed}`); const creator = creators[value % creators.length];
  const durationSeconds = result.durationSeconds || [3, 8, 12, 30, 45][(value >>> 8) % 5];
  return { ...result, description: result.description?.replace(/^0:03\s*·\s*/, '') || '', likes: 20 + (value >>> 6) % 60000, durationSeconds, duration: clockTime(durationSeconds), channel: result.channel || creator[0], channelLetter: result.channelLetter || creator[1], subscribers: result.subscribers || creator[2], genre: result.genre || ['challenge', 'tech', 'unboxing', 'review', 'tutorial'][(value >>> 14) % 5], clip: durationSeconds === 3 ? 'versuch.mp4' : `clip-${durationSeconds}.mp4` };
}
export function videoCatalog(seed) {
  const random = rng(seed);
  const rows = videoRows.map(([title, asset, durationSeconds, scene, creatorIndex, genre, thumbText, description], i) => {
    const creator = creators[creatorIndex];
    return { ...videoDetails({ id: `video-${i}`, site: 'youtuba', title, asset, durationSeconds, scene, genre, thumbText, description, topic: { name: title, category: 'object' }, views: (12204 + i * 641204).toLocaleString('de-DE'), age: i % 9 ? `vor ${1 + i % 9} Tagen` : 'vor 1 Tag' }, seed), channel: creator[0], channelLetter: creator[1], subscribers: creator[2] };
  });
  // 0,02 Wahrscheinlichkeit pro Startseite: ein tatsächlich hilfreicher Fund.
  if (random() < .02) rows.push({ ...videoDetails({ id: 'video-gem', site: 'youtuba', title: '2 + 2, ohne Intro und ohne Sponsor', asset: 'calculator', durationSeconds: 8, scene: 'calculator', genre: 'gem', thumbText: '4. DAS WAR’S.', description: 'Zwei Dinge und zwei weitere Dinge ergeben vier Dinge. Fertig.', topic: { name: '2 plus 2', category: 'everyday' }, views: '204', age: 'vor 1 Jahr' }, seed), channel: 'Fakten ohne Intro', channelLetter: 'F', subscribers: '1.204' });
  return shuffled(rows, seed + 713);
}
const reviewRows = [
  ['Renate aus dem dritten Stock', 5, 'Nachbar hat es schon', 'Wurde beim Nachbarn abgegeben, bevor ich bestellt hatte. Er benutzt es jetzt.'],
  ['Kevin ohne Prime', 1, 'Zu pünktlich', 'Der Fahrer war gestern da. Ich war gestern noch gar kein Kunde.'],
  ['Büro_4B', 4, 'Finanzamt hat Fragen', 'Unsere Buchhaltung hat die Rechnung eingerahmt.'],
  ['Claudia K.', 2, 'Falsches Geräusch', 'Auf dem Produktfoto war es deutlich leiser.'],
  ['Kartonsammler', 5, 'Verpackung hervorragend', 'Den Inhalt habe ich verschenkt. Der Karton hat jetzt einen Ehrenplatz.'],
  ['Heinz, 68', 3, 'Soweit vorhanden', 'Habe es zur Sicherheit einmal gezählt. War eins.'],
  ['Mila testet', 4, 'Nicht spülmaschinenfest', 'Steht nirgends, habe trotzdem nachgefragt. Verkäufer hat aufgelegt.'],
  ['Torben', 1, 'Bedienungsanleitung fehlt', 'Es war ein Zettel dabei: „Sie schaffen das.“'],
  ['Ulrike W.', 5, 'Familie informiert', 'Meine Schwester hat jetzt auch eins, obwohl sie nichts davon wissen wollte.'],
  ['Jan mit Fahrrad', 3, 'Abholung kompliziert', 'Abholstation war in meinem Wohnzimmer.'],
  ['Zweimal bestellt', 2, 'Menge stimmt', 'Wollte eins. Habe zweimal eins bekommen. Rechnerisch korrekt.'],
  ['Petra fotografiert', 4, 'Fotogener als ich', 'Habe das Produktbild als Profilbild genommen. Wurde befördert.'],
  ['Andi_2004', 1, 'Kann kein Bluetooth', 'Ich konnte auch vorher keins. Trotzdem enttäuschend.'],
  ['Doris', 5, 'Enkel zufrieden', 'Er weiß noch nicht, dass es für ihn ist.'],
  ['Jörg im Homeoffice', 3, 'Passt auf den Schreibtisch', 'Musste dafür den Schreibtisch kaufen.'],
  ['Lena links', 2, 'Steht falsch herum', 'Nach dem Drehen stand es auf der anderen Seite falsch herum.'],
  ['Kaufmensch', 5, 'Für den Preis', 'Musste den Preis dreimal vorlesen. Kassierer ist jetzt auch hier.'],
  ['Wolfgang', 4, 'Montag bestellt', 'Dienstag war Dienstag. Alles wie erwartet.'],
  ['Silke S.', 1, 'Hatte keine Batterien', 'Das Produkt benötigt keine. Ich wollte trotzdem welche.'],
  ['Rainer im Keller', 3, 'Lagerung funktioniert', 'Liegt im Keller. Seit Februar.'],
  ['Nora normal', 5, 'Geschenk kam an', 'Beschenkter fragt seitdem täglich, warum.'],
  ['Dennis ohne Dennis', 2, 'Zu viele Buchstaben', 'Der Produktname passt nicht auf mein Etikett.'],
  ['Gabi mit Maßband', 4, 'Maße nachgemessen', 'Das Maßband war länger. Gut.'],
  ['Emre', 3, 'Unboxing ruiniert', 'War bereits ausgepackt, als ich die Kamera gefunden hatte.']
];
export function productReviews(result, seed) { return shuffled(reviewRows, hash(result.title) ^ seed).slice(0, 4).map(([name, stars, title, text]) => ({ name, stars, title, text })); }
const commentRows = [
  ['BastiKurz', 'Bei 0:01 hatte ich schon genug Informationen.'], ['lenas_laptop', 'Habe aus Versehen in 0,25-facher Geschwindigkeit geschaut. Mein Nachmittag ist weg.'], ['MoinMitM', 'Warum ist das in meiner Playlist „Arbeit“?'], ['KalleKlickt', 'Die Werbung davor war länger und hatte mehr Handlung.'], ['sara_ohne_h', 'Ich war die 204. Person hier. Das muss ich kurz verarbeiten.'], ['Papierflieger', 'Mein Vater hat das auf den Fernseher übertragen. Wir sitzen noch hier.'], ['michi_liest', 'Titel gelesen. Video bestätigt.'], ['luisa_8', 'Kann jemand die Stelle verlinken, an der es losgeht?'], ['gruenertab', 'Wurde mir nach einem Bewerbungstutorial empfohlen.'], ['KaiPause', 'Mit Pause wesentlich besser.'], ['Nina_Nebenan', 'Der Hintergrund ist exakt meine Küche. Warum?'], ['pixelbrot', 'Untertitel sagen [unverständlich]. Es spricht niemand.'], ['DieterOffline', 'Erster. Laut meiner Uhr.'], ['MertMitT', 'Ich habe dafür WLAN eingeschaltet.'], ['FrauFunktion', 'Hab den Link meinem Chef geschickt. Bin morgen im Gespräch.'], ['tim_ohne_intro', 'Teil 2 bitte ohne Teil 1.'], ['LotteLaedt', 'Ich warte auf die Hörbuchfassung.'], ['TomatenTimer', 'Bei mir hat die Tomate gerade auch das gemacht.'], ['oma_ist_online', 'Wie komme ich wieder zu den Nachrichten?'], ['Cloudia', 'Wollte das Wetter wissen. Jetzt weiß ich weniger.'], ['SvenSieb', 'Der Schnitt war schneller als mein Blick.'], ['naechster_tab', 'Danke für das Tutorial. Habe jetzt ein neues Problem.'], ['Jules', 'Habe es gespeichert. Für welchen Anlass weiß ich noch nicht.'], ['MiaMitKamera', 'Das hätte eine E-Mail sein können.'], ['finn_fertig', 'Abspann übersprungen und beim Anfang gelandet.'], ['BenBenBen', 'Das Video hat mich gefragt, ob ich noch da bin. Ja, leider.'], ['KartonKatja', 'Endlich eine unabhängige Verpackungsbewertung.'], ['LarsLangsam', 'Bitte ein Making-of vom Einschalten der Kamera.']
];
export function videoComments(result, seed) {
  const specialized = result.genre === 'kids' ? [['papa_mit_tablet', 'Mein Kind sagt jetzt bei jeder Farbe Beige.'], ['karottenfan', 'Der Bus hat mehr Sitzplätze als unser echter.'], ['MamaMuede', 'Folge 8 läuft. Ich kann den Song inzwischen ohne Ton hören.']] : result.genre === 'gem' ? [['endlichkurz', 'Antwort in acht Sekunden. Ich bin fertig.'], ['Nele', 'Keine Musik, keine Einleitung. Habe tatsächlich etwas verstanden.']] : [];
  return [...specialized, ...shuffled(commentRows, hash(result.title) ^ seed)].slice(0, 4 + hash(result.title) % 5).map(([name, text], i) => ({ name, text, age: `vor ${i + 1} ${i ? 'Stunden' : 'Minute'}` }));
}
export const meals = [
  ['Pizza Margherita', 'Pizzeria Da Später', 'pizza', 7.90, 2.49, 35, 'Der Käse liegt überwiegend auf der Pizza.'],
  ['Döner komplett', 'Dönerstag', 'kebab', 6.50, 1.99, 25, 'Mit allem. Auch mit Dingen, die wir noch im Kühlschrank hatten.'],
  ['Vada Pav aus Mumbai', 'Mumbai Bordsteinküche', 'potato', .80, 223.50, 580, 'Street Food wird eingeflogen. Flug im Versand enthalten. Fiktive Flugzeit: 9 Std. 40 Min. bis Dortmund.'],
  ['Sushi, jedes Stück einzeln verschickt', 'Sushi-Sendung', 'sushi', 8, 54, 65, 'Zwölf Sendungsnummern, ein Abendessen.'],
  ['Pommes als Bausatz', 'Kartoffel & Partner', 'potato', 2.90, 1.49, 20, 'Kartoffeln, Salz und eine ausführliche Schneideanleitung.'],
  ['Pho aus Hanoi', 'Gate 12 Suppenbar', 'noodles', 1.20, 287.40, 720, 'Brühe im Aufgabegepäck. Nudeln haben einen Fensterplatz.'],
  ['Butter Chicken ohne Butter, mit Chicken', 'Curry Eilig', 'curry', 9.90, 2.99, 45, 'Die Butter kommt mit der nächsten Bestellung.'],
  ['Falafel im Kreis', 'Rund & Satt', 'broccoli', 5.40, 0, 30, 'Geometrisch korrekt angerichtet.'],
  ['Burger mit sehr langem Namen', 'Burger aus Gründen', 'burger', 8.99, 2.49, 40, 'Lässt sich im Warenkorb abkürzen.'],
  ['Lasagne, Schicht 3 separat', 'Da Schichtwechsel', 'tomato', 7.20, 4.99, 50, 'Schichten 1, 2 und 4 wurden von anderen Kunden reserviert.'],
  ['Leitungswasser aus dem Himalaya', 'Wasser weit weg', 'cloud', .10, 194.80, 660, 'Am Ziel noch einmal kurz durch die Leitung gelaufen.'],
  ['Käsespätzle', 'Spätzle ohne Grenze', 'milk', 8.40, 1.90, 35, 'Zwiebeln nach persönlicher Einschätzung des Kochs.'],
  ['Salat mit WLAN-Zugang', 'Green Hotspot', 'broccoli', 4.99, 1.49, 25, 'Passwort steht unter der Tomate.'],
  ['Bánh mì aus Ho-Chi-Minh-Stadt', 'Sandwich Air', 'bread', .95, 251.70, 780, 'Handgepäck bis 8 kg. Ihr Brot wiegt 240 g.'],
  ['Ramen auf Rechnung', 'Nudel inkasso', 'noodles', 10.20, 2.99, 40, 'Zahlungsziel: bevor die Nudeln weich werden.'],
  ['Ein Löffel Tiramisu', 'Dolce Minimale', 'milk', .60, 6.90, 55, 'Der Rest ist auf dem Produktfoto noch zu sehen.']
].map(([title, restaurant, asset, price, shipping, minutes, description], i) => ({ id: i, title, restaurant, asset, price, shipping, minutes, description, international: shipping > 100 }));
export const series = [
  ['Der Ordner', 'parcel', 'Ein Sachbearbeiter legt einen Ordner von links nach rechts. In Staffel 2 zurück.', 'Drama', 8, 'Freigabe ausstehend'],
  ['Parkplatz 3', 'city', 'Immer dieselbe Einstellung. Gelegentlich steht ein silberner Kombi dort.', 'Dokumentation', 11, 'Niemand parkt heute'],
  ['Die Heizung bleibt auf 2', 'router', 'Eine Familie spricht nicht darüber, dass der Heizkörper auf 2 steht.', 'Familiensaga', 6, 'Die Einstellung'],
  ['Excel: Zeile 184', 'calculator', 'Zeile 183 wurde abgeschlossen. Jetzt muss jemand weiter nach unten scrollen.', 'Thriller', 4, 'Zelle B184'],
  ['Sendung wurde elektronisch angekündigt', 'parcel', 'Ein Paket ist noch nicht im Paketzentrum. Zehn Staffeln lang.', 'Mystery', 10, 'Noch nicht erhalten'],
  ['Protokoll der Eigentümerversammlung', 'city', 'TOP 1: Begrüßung. TOP 2 wird erst in Staffel 4 behandelt.', 'Serie', 7, 'Beschlussfähigkeit'],
  ['Herr Beige', 'bread', 'Ein Mann kauft eine beige Hose. Sie ist wieder beige.', 'Mode', 3, 'Die Anprobe'],
  ['Die Rückseite vom Kühlschrank', 'milk', 'Man weiß, dass sie da ist. Heute wird sie gezeigt.', 'Naturfilm', 2, 'Staub'],
  ['War das schon immer da?', 'clip', 'Ein Fleck an der Wand. Acht Zeugen können sich nicht erinnern.', 'Krimi', 5, 'Beweisstück Wand'],
  ['Bitte nicht laminieren', 'parcel', 'Ute laminiert. Ralf sagt nichts. Die Kantine macht um zwei zu.', 'Arbeitswelt', 9, 'Das Gerät ist warm'],
  ['Montag, 14:07', 'cloud', 'Es ist Montag. Um 14:08 wird die Folge beendet.', 'Echtzeit', 1, '14:07:00'],
  ['Gebrauchsanweisung Seite 6', 'pc', 'Vor Inbetriebnahme bitte aufmerksam ansehen. Seite 7 separat buchbar.', 'Technik', 6, 'Warnhinweis C'],
  ['Das Brot wird nicht schlecht', 'bread', 'Ein Brot wird täglich kontrolliert. Bislang unauffällig.', 'Langzeitstudie', 12, 'Tag 1'],
  ['Zug fährt durch', 'car', 'Der Zug hält nicht. Die Menschen am Bahnsteig waren vorbereitet.', 'Reise', 4, 'Ohne Halt']
].map(([title, asset, description, genre, seasons, episode], id) => ({ id, title, asset, description, genre, seasons, episode }));
export const socialPosts = [
  ['Lena_Linse', 'mango', 'Neue Wohnung. Das ist die einzige Sache, die ich mir nach der Kaution noch leisten konnte.', 'Dortmund'],
  ['KartonKalle', 'parcel', 'Roomtour. Heute nur der Raum im Karton.', 'Im Karton'],
  ['RenateReist', 'city', 'Bin am Gate. Reise seit 6 Stunden von Terminal 1 nach Terminal 2.', 'Flughafen'],
  ['FinnFitness', 'potato', 'Meal Prep für den ganzen Monat. Die Kartoffel wird täglich neu fotografiert.', 'Küche'],
  ['Bürokratie.offiziell', 'clip', 'Unsere Büroklammer hat jetzt einen eigenen Sachbearbeiter. Bewerbungen bitte gelocht.', 'Amt'],
  ['NeleNormal', 'bread', 'Heute kein Filter. Das Brot sieht wirklich so aus.', 'Bäckerei'],
  ['TurboTimo', 'car', 'Neues Auto. Passt leider nur auf den Bildschirm.', 'Buyazon'],
  ['OmaOnline', 'portrait', 'IST DAS JETZT PRIVAT ODER KÖNNEN DAS ALLE SEHEN', 'Wohnzimmer'],
  ['GartenGuido', 'broccoli', 'Der Brokkoli hat den Schrebergarten übernommen. Ich muss Eintritt zahlen.', 'Parzelle 8'],
  ['SinaSignal', 'router', 'Date mit meinem Router. Heute hat er drei Balken für mich.', 'Neben der Steckdose'],
  ['TomateMitTermin', 'tomato', 'Produktiv gewesen: Tomate gedreht, Foto gemacht, Tomate zurückgedreht.', 'Homeoffice'],
  ['Wolke7', 'cloud', 'Nicht jede Wolke muss Content sein. Diese schon.', 'Oben'],
  ['KäseKlara', 'milk', 'Beziehungsstatus: laktosefrei.', 'Kühlregal'],
  ['BananenBea', 'banana', 'Werbung wegen Schale. Kooperation mit der Obstabteilung steht noch aus.', 'Supermarkt'],
  ['ZweiFenster', 'city', 'Nachbar hat das Fenster auf Kipp. Wir bleiben dran.', 'Nachbarschaft'],
  ['ApfelArmin', 'apple', 'Hab das Bild versehentlich ausgedruckt. Jetzt muss ich es per Post liken.', 'Drucker']
].map(([name, asset, text, place], id) => ({ id: `seed-${id}`, name, asset, text, place, likes: 3 + id * 83 }));
export const mailTemplates = [
  ['Buyazon', 'DRINGEND: 20-Cent-PC jetzt für 19 Cent!', 'Wahnsinnige 2 % Rabatt. Neuer Preis: 19 Cent. Unsere Mathematikabteilung ist bereits im Feierabend. Nur heute, gestern und bis auf Weiteres.'],
  ['Buyazon', 'Ihr leerer Einkaufswagen vermisst Sie', 'Wir haben unten nachgesehen. Immer noch leer. Bitte sorgen Sie dafür, dass er sich nicht langweilt.'],
  ['Bürgerbürokratie', 'Bestätigung Ihrer Eingangsbestätigung', 'Ihre Bestätigung ist eingegangen. Bitte bestätigen Sie, dass die Bestätigung zur Bestätigung eingegangen ist.'],
  ['YouTuba', 'Ein Kanal, den Sie nicht kennen, hat nichts hochgeladen', 'Wir dachten, das sollten Sie wissen. Das nächste Nicht-Video erscheint voraussichtlich auch nicht.'],
  ['Lieferlahm', 'Ihr Brot hat einen Anschlussflug', 'Gate wurde von 8 auf 42 geändert. Ihr Brot muss laufen. Die Kruste hat Priority Boarding.'],
  ['Nixflix', 'Staffel 9 von „Der Ordner“ ist da', 'Diesmal wird der Ordner nicht geöffnet. Das Finale lässt alle Register offen.'],
  ['Instakram', 'Jemand hat Ihr Profil nicht besucht', 'Es war sehr wahrscheinlich jemand, der etwas anderes gemacht hat. Wir halten Sie auf dem Laufenden.'],
  ['Fazebook', 'Du könntest Rüdiger kennen', 'Rüdiger kennt dich nicht. Das ist schon eine Gemeinsamkeit.'],
  ['Gähmail', 'Speicher zu 0,0003 % gefüllt', 'Noch Platz für ungefähr 800.000 solcher Hinweise. Wir fangen dann schon mal an.'],
  ['Buyazon', 'Büroklammer: jetzt auch in Raten', '6.499 Euro. Oder 6.499 monatliche Raten zu je einem Euro. Ohne Zinsen. Mit sehr langer Beziehung.'],
  ['Bürgerbürokratie', 'Ihr Antrag benötigt einen Antrag', 'Bitte beantragen Sie das Recht, Ihren bereits gestellten Antrag beantragen zu dürfen. Formblatt steht in der Warteschlange.'],
  ['YouTuba', 'Sie haben 3 Sekunden Video verpasst', 'Wir schicken Ihnen später eine 12-minütige Zusammenfassung.'],
  ['Gähmail', 'Montag wurde erfolgreich zugestellt', 'Ein Abbestellen von Montag ist aktuell nicht möglich.'],
  ['Lieferlahm', 'Der Fahrer hat einen Löffel vergessen', 'Er fährt zurück. Der Löffel möchte nicht alleine bleiben.'],
  ['Nixflix', 'Weil du den Browser geöffnet hast', 'Unsere Empfehlung: „Gebrauchsanweisung Seite 6“. Passt zu deinem bisherigen Sehverhalten: anwesend.'],
  ['Buyazon', 'Frage zu Ihrem Produkt: Hat es eine Rückseite?', 'Ein anderer Kunde möchte wissen, ob auch hinten etwas ist. Bitte drehen Sie es um.'],
  ['Instakram', 'Neue Story: eine Geschichte ohne Handlung', 'Lena hat ihr Brot diesmal von rechts fotografiert. Nur noch 23 Stunden verfügbar.'],
  ['Fazebook', 'Die Gruppe „Ist das noch da?“ lädt dich ein', 'Aufnahmefrage: Ist das noch da? Bitte keine langen Antworten.'],
  ['Bürgerbürokratie', 'Ihre Wartezeit wurde verlängert', 'Gute Nachricht: Sie haben jetzt mehr Zeit zum Warten.'],
  ['Gähmail', 'Sie haben diese E-Mail erhalten', 'Der Zustellvorgang ist damit abgeschlossen. Diese Nachricht dient der Information über sich selbst.'],
  ['YouTuba', 'Premiere in 214 Tagen', 'Sie können sich jetzt schon auf die Wartezeit vorbereiten.'],
  ['Buyazon', 'Ihr Produkt ist jetzt in Beige erhältlich', 'Auch falls es vorher schon beige war. Diesmal offiziell.'],
  ['Nixflix', 'Schaust du noch?', 'Sie haben die E-Mail noch nicht geschlossen. Das werten wir als ja.'],
  ['Lieferlahm', 'Ihr Essen sammelt Meilen', 'Noch zwei Bestellungen, dann fliegt die Pommes Business Class.']
];
