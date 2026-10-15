import { catalog, specifics, sites, groupFacts, groupVariants } from './data.js';
import { cities } from './cities.js';
import { commonTopics, topicStories, cityStories, extraFoodStories, sharedStories, expandStories } from './search-content.js';
import { advanceChat, createChatState } from './chat-engine.js';

export function normalize(value) {
  return String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, ' ').trim();
}

export function random(seed) {
  let state = Number(seed) >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let x = Math.imul(state ^ state >>> 15, state | 1);
    x ^= x + Math.imul(x ^ x >>> 7, x | 61);
    return ((x ^ x >>> 14) >>> 0) / 4294967296;
  };
}

const index = entries => entries.flatMap(item => [item.name, ...item.aliases].map(alias => ({ phrase: normalize(alias), item }))).sort((a, b) => b.phrase.length - a.phrase.length);
const indexed = index(catalog.filter(item => !['city', 'everyday'].includes(item.category)));
const cityIndex = index(cities);
const commonIndex = index(commonTopics);
const exactCity = new Map();
for (const city of [...cities].reverse()) for (const alias of [city.name, ...city.aliases]) exactCity.set(normalize(alias), city);
function findCity(normalized) {
  const padded = ` ${normalized} `;
  const found = cityIndex.find(({ phrase }) => padded.includes(` ${phrase} `))?.item;
  if (found?.name === 'Essen' && normalized !== 'essen' && !/\b(in essen|essen wetter|wetter essen|essen hotel|hotel essen|stadt essen|nach essen)\b/.test(normalized)) return null;
  return found;
}
const everydaySubjects = [
  ['Drucker', 'printer,print,drucker'], ['Waschmaschine', 'washing machine,waschmaschine'], ['Kühlschrank', 'fridge,refrigerator,kühlschrank'], ['Toaster', 'toaster'], ['Staubsauger', 'vacuum cleaner,staubsauger'], ['Taschenrechner', 'calculator,taschenrechner'], ['Handy', 'phone,handy'], ['Fernseher', 'tv,television,fernseher'], ['Internet', 'internet,wlan,wifi'], ['Socke', 'sock,socks,socken'], ['Schuh', 'shoe,shoes,schuhe'], ['Schlüssel', 'key,keys,schlüssel'], ['Tür', 'door,tür'], ['Fenster', 'window,fenster'], ['Sofa', 'couch,sofa'], ['Bürostuhl', 'office chair,bürostuhl'], ['Bett', 'bed,bett'], ['Hund', 'dog,dogs,hunde,hund'], ['Katze', 'cat,cats,katzen,katze'], ['Dinosaurier', 'dinosaur,dinosaurs,dinosaurier'], ['Steuererklärung', 'tax return,steuererklärung'], ['Urlaub', 'vacation,holiday,urlaub'], ['Wetter', 'weather,wetter'], ['Minecraft', 'minecraft'], ['Fortnite', 'fortnite'], ['Roblox', 'roblox'], ['Fußball', 'football,soccer,fußball'], ['Haus', 'house,haus'], ['Wohnung', 'apartment,flat,wohnung'], ['Geld', 'money,geld'], ['Arbeit', 'job,work,arbeit']
];
function fallbackSubject(query, normalized) {
  const known = everydaySubjects.find(([, aliases]) => aliases.split(',').some(alias => ` ${normalized} `.includes(` ${normalize(alias)} `)));
  if (known) return known[0];
  if (query.split(/\s+/).length <= 3) return query;
  const nouns = query.match(/\b[A-ZÄÖÜ][a-zäöüß]{2,}\b/g) || [];
  const candidate = nouns.find(word => !['Warum', 'Wieso', 'Weshalb', 'Wie', 'Was', 'Wer', 'Wann', 'Kann', 'Kannst', 'Können', 'Könnt', 'Wo', 'Bitte', 'Ich', 'Mein', 'Meine', 'How', 'What', 'Why', 'Where', 'When', 'Can', 'Could', 'The', 'Find'].includes(word));
  return candidate || query;
}
const pick = (array, rng) => array[Math.floor(rng() * array.length)];
const shuffle = (array, rng) => {
  const output = [...array];
  for (let i = output.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
};
function storyFamily(site, title, name, place) {
  let fingerprint = normalize(title);
  for (const [word, replacement] of [[normalize(name), 'topic'], [normalize(place), 'place']]) {
    if (word) fingerprint = fingerprint.replace(new RegExp(`\\b${word}\\b`, 'g'), replacement);
  }
  return `${site}:${fingerprint}`;
}

export function resolveQuery(input) {
  const query = String(input).replace(/\s+/g, ' ').trim().slice(0, 180) || 'Gurke';
  const normalized = normalize(query);
  const padded = ` ${normalized} `;
  if (/\b(porn\w*|porno\w*|hentai|xxx|sex|nackt|nudes|onlyfans)\b/.test(normalized)) {
    return { query, name: 'Zimmerpflanzen', category: 'sfw', group: 'vegetable', intent: 'search' };
  }
  let item;
  const city = findCity(normalized);
  const everyday = commonIndex.find(({ phrase }) => padded.includes(` ${phrase} `))?.item;
  const everydayExact = commonIndex.find(({ phrase }) => phrase === normalized)?.item;
  if (exactCity.has(normalized)) item = exactCity.get(normalized);
  else if (everydayExact) item = everydayExact;
  else if (/\b(gaming pc|gaming computer|gamingpc|high end pc)\b/.test(normalized)) item = { name: 'Gaming-PC', category: 'tech', group: 'tech' };
  else if (/\b(buroklammer\w*|paperclip\w*|paper clip)\b/.test(normalized)) item = { name: 'Büroklammer', category: 'object', group: 'object' };
  else if (/\b(iphone|ipad|macbook|smartphone|laptop|computer|pc|playstation|ps5|xbox)\b/.test(normalized)) {
    item = { name: query, category: 'tech', group: 'tech' };
  } else item = indexed.find(({ phrase }) => padded.includes(` ${phrase} `))?.item;
  if (everyday && (!item || ['weather', 'time', 'parcel', 'translate', 'password', 'hours'].includes(everyday.group))) item = everyday;
  item ??= city;
  item ??= { name: fallbackSubject(query, normalized), category: 'unknown', group: 'unknown' };
  let intent = 'search';
  if (/\b(rezept\w*|kochen|recipe\w*|cook\w*|backen)\b/.test(normalized)) intent = 'recipe';
  else if (/\b(kaufen|preis\w*|bestellen|buy|price\w*|shop)\b/.test(normalized)) intent = 'buy';
  else if (/\b(repar\w*|kaputt|repair|broken)\b/.test(normalized)) intent = 'repair';
  else if (/\b(kalorien|gesund|nutrition|calories)\b/.test(normalized)) intent = 'nutrition';
  return { ...item, query, intent, ...(city ? { place: city.name, city } : {}) };
}

export function assetFor(topic) {
  const n = normalize(topic.name);
  if (topic.category === 'car') return 'car';
  if (topic.category === 'person') return 'portrait';
  if (topic.category === 'city') return 'city';
  if (topic.group === 'weather') return 'cloud';
  if (topic.group === 'calculator') return 'calculator';
  if (['internet', 'speedtest'].includes(topic.group)) return 'router';
  if (['printer', 'update', 'games', 'phone'].includes(topic.group)) return 'pc';
  if (topic.name === 'Mango') return 'mango';
  if (n.includes('buroklammer')) return 'clip';
  if (topic.category === 'tech') return 'pc';
  if (/pizza/.test(n)) return 'pizza';
  if (/doner|kebab/.test(n)) return 'kebab';
  if (/burger/.test(n)) return 'burger';
  if (/sushi/.test(n)) return 'sushi';
  if (/nudel|spaghetti|ramen|pho\b/.test(n)) return 'noodles';
  if (/curry/.test(n)) return 'curry';
  if (/gurke|zucchini/.test(n)) return 'cucumber';
  if (/banane/.test(n)) return 'banana';
  if (/tomate/.test(n)) return 'tomato';
  if (/karotte|pastinake|rettich/.test(n)) return 'carrot';
  if (/brokkoli|blumenkohl|kohl|salat|spinat/.test(n)) return 'broccoli';
  if (/beere|kirsche/.test(n)) return 'berry';
  if (/orange|mandarine|zitrone|limette|grapefruit/.test(n)) return 'citrus';
  if (topic.group === 'fruit') return 'apple';
  if (topic.group === 'nut') return 'nuts';
  if (topic.group === 'dairy') return 'milk';
  if (topic.group === 'pantry') return 'bread';
  if (topic.group === 'vegetable') return 'potato';
  return 'parcel';
}

const foodResults = n => [
  ['buyazon', `${n} · nur die Verpackung`, 'Inhalt separat erhältlich. Die Verpackung ist bereits leer und sofort einsatzbereit.'],
  ['buyazon', `${n}, Einzelstück, 6.499,00 €`, 'Versand: 89,90 €. Mengenrabatt ab einem halben Stück.'],
  ['buyazon', `${n} gebraucht, kaum gekaut`, 'Zustand: wie neu von außen. Rücknahme nur in Originalform.'],
  ['buyazon', `${n} zum Selberfinden · 0,32 €`, 'Wir liefern irgendwohin. Wenn Sie es finden, gehört es Ihnen.'],
  ['youtuba', `ICH HABE ${n.toLocaleUpperCase('de')} 24 STUNDEN LANG BEOBACHTET`, '0:03 · Die restlichen 23 Stunden wurden aus Datenschutzgründen entfernt.'],
  ['youtuba', `${n} aus 2 cm fallen lassen (GONE WRONG)`, '0:03 · Das Brett hat es nicht geschafft.'],
  ['youtuba', `Kann ${n} einen Drucker ersetzen?`, '0:03 · Dieses Video wird vom örtlichen Druckerfachhandel nicht unterstützt.'],
  ['youtuba', `Ich erkläre ${n} meinem Vater`, '0:03 · Er wusste es schon.'],
  ['wickipedia', `${n} – Wickipedia`, `${n} bezeichnet zunächst ${n}. Weiterführende Informationen wurden in einem anderen Tab geöffnet.`],
  ['wickipedia', `${n}: Geschichte, Verwendung und Parkplatz`, 'Die Herkunft ist ungeklärt. Am ehesten aus der Einkaufstasche. Dieser Artikel braucht bessere Quellen.'],
  ['news', `${n} bleibt nach Ladenschluss im Supermarkt`, 'Die Filialleitung spricht von einem regulären Vorgang. Trotzdem wurde ein Fotograf geschickt.'],
  ['news', `Stadt Dortmund richtet eigene Spur für ${n} ein`, 'Die Markierung ist fertig. Wie das Ganze benutzt werden soll, steht noch nicht fest.'],
  ['news', `${n} erscheint ohne Termin im Bürgerbüro`, 'Die Nummer wurde gezogen. Jetzt heißt es warten.'],
  ['news', `Preis für ${n} um 0 Cent gestiegen`, 'Experten empfehlen, zunächst die nächste Zahl abzuwarten.'],
  ['klein', `${n} abzugeben. Bitte eigenen Boden mitbringen`, 'Nur Abholung. Steht aktuell auf meinem Boden und der bleibt hier.'],
  ['klein', `${n}, wegen Hobbyaufgabe`, 'War doch nicht mein Ding. Tausche gegen funktionierende Klingel.'],
  ['klein', `${n} mit Papieren`, 'Kassenzettel dabei. Stammbaum müsste ich malen.'],
  ['forum', `Darf mein Vermieter ${n} verbieten?`, 'Im Mietvertrag steht nur Haustiere. Bin seit gestern unsicher. 14 Antworten, davon 11 vom Vermieter.'],
  ['forum', `${n} gekauft. Muss ich das anmelden?`, 'Es liegt jetzt in der Küche. Das Bürgeramt geht nicht ran.'],
  ['forum', `Wie viel ${n} passt in einen Golf?`, 'Mit umgeklappter Rückbank. Die Rückbank antwortet bisher nicht.'],
  ['chatgpp', `${n}? ChatGPP klärt das für dich`, 'Schreib uns kurz, was dabei rauskommt. Wir sind auch neugierig.'],
  ['chatgpp', `${n}: eine Antwort ist in Vorbereitung`, 'Der zuständige Mitarbeiter ist ein Ladebalken.']
];

const carResults = n => [
  ['buyazon', `${n}, 0,32 € · Prime-Lieferung`, 'Wird in den Briefkasten gelegt. Außenspiegel bitte selbst aufklappen.'],
  ['buyazon', `Linker Blinker für ${n} · 6.499 €`, 'Rechts separat. Blinkflüssigkeit nicht im Lieferumfang.'],
  ['buyazon', `${n}, ohne Straße`, 'Straße muss vor der Lieferung vorhanden sein. Wir bauen keine.'],
  ['youtuba', `${n}: 0 AUF 100 IM WOHNZIMMER`, '0:03 · Der Couchtisch ist jetzt draußen.'],
  ['youtuba', `ICH HABE ${n.toUpperCase()} MIT LEITUNGSWASSER GETANKT`, '0:03 · Werkstatt-Reaktion ungekürzt.'],
  ['youtuba', `${n} gegen einen Einkaufswagen (FAIRER TEST)`, '0:03 · Beide haben vier Räder. Mehr wurde nicht geprüft.'],
  ['wickipedia', `${n} – Wickipedia`, 'Ein Fahrzeug zur Beförderung von Menschen zwischen zwei Parkplatzproblemen.'],
  ['news', `${n} besteht TÜV ohne anwesend zu sein`, 'Die Plakette hat einen guten Eindruck gemacht.'],
  ['news', `Besitzer von ${n} findet endlich zweite Parklücke`, 'Die erste wurde für den Rest des Autos benötigt.'],
  ['news', `${n} fährt freiwillig auf rechte Spur`, 'Augenzeugen wollen zunächst anonym bleiben.'],
  ['klein', `${n}, Checkheft gepflegt`, 'Das Heft ist wirklich sehr sauber. Zum Auto kann ich nichts sagen.'],
  ['klein', `${n}, 12 km, davon 280.000 rückwärts`, 'Tacho zeigt nur Vorwärtsfahrten. Kein letzter Preis.'],
  ['forum', `${n} macht Geräusche. Kann ich Radio lauter stellen?`, 'Beste Antwort: Ja, aber nur bei laufendem Radio.'],
  ['chatgpp', `${n}: unabhängige Kaufberatung`, 'Hast du schon jemanden gefragt, der sich mit Autos auskennt?']
];

const personResults = n => [
  ['buyazon', `Pappaufsteller: ${n}, Rückseite unbekannt`, 'Aufstellhöhe: abhängig vom Boden. Steht nur, wenn Sie ihn nicht umwerfen.'],
  ['buyazon', `Autogramm von ${n}, selbst geschrieben`, 'Unterschrift nach bestem Wissen des Verkäufers. Filzstift enthalten.'],
  ['youtuba', `ICH WAR 24 STUNDEN NICHT ${n.toUpperCase()}`, '0:03 · Hat problemlos funktioniert.'],
  ['youtuba', `Ich frage ${n} nach dem WLAN-Passwort`, '0:03 · Wir haben bisher keinen Kontakt.'],
  ['wickipedia', `${n} – Wickipedia`, 'Bekannte Person. Auf Fotos meist irgendwo zwischen dem linken und dem rechten Bildrand.'],
  ['news', `Dortmunder Mann heißt nicht ${n}`, 'Die Verwechslung konnte vor Ort ausgeschlossen werden.'],
  ['news', `Bäckerei reserviert Tisch für ${n}, falls nötig`, 'Die Person hat weder angefragt noch zugesagt. Der Tisch steht trotzdem da.'],
  ['klein', `${n}: Fanposter, stand nie im Kontakt`, 'Poster ist rechteckig. Person darauf ebenfalls zu erkennen.'],
  ['forum', `Weiß ${n}, dass ich heute frei habe?`, 'Habe es im Kalender eingetragen. Bis jetzt keine Reaktion.'],
  ['chatgpp', `Was du über ${n} wissen musst`, 'Wir können diese Person kurz fragen. Hast du die Nummer?']
];

const otherResults = n => [
  ['buyazon', `${n} · Basismodell ohne Funktion`, '0,32 € · Das Produktfoto ist verbindlicher als die Beschreibung.'],
  ['buyazon', `${n} Premium · 6.499,00 €`, 'Gleiches Produkt, anderer Preis. Kein Rabattcode kann das erklären.'],
  ['buyazon', `${n}, unsichtbar, doppelt vorhanden`, 'Lieferumfang lässt sich erst nach dem Auspacken nicht überprüfen.'],
  ['youtuba', `${n.toUpperCase()} UM 3 UHR NACHTS BESTELLT`, '0:03 · Die Bestellbestätigung kam direkt.'],
  ['youtuba', `Kann ${n} schwimmen? (GONE WRONG)`, '0:03 · Wir haben es nicht aus der Verpackung genommen.'],
  ['youtuba', `${n}: Ich habe meinen Vater entscheiden lassen`, '0:03 · Er hat nein gesagt.'],
  ['wickipedia', `${n} – Wickipedia`, 'Der Begriff kommt vor. Besonders häufig in dieser Überschrift. Die weitere Verwendung ist nicht abschließend geklärt.'],
  ['news', `${n}: Nachbar möchte dazu nichts sagen`, 'Unser Reporter hat trotzdem dreimal geklingelt.'],
  ['klein', `${n}, muss bis 18 Uhr weg`, 'Ab 18 Uhr bin ich wieder da. Dann muss es bis 19 Uhr weg.'],
  ['klein', `${n}, nur Tausch gegen dasselbe in besser`, 'Bitte keine Angebote, die meine Situation nicht verbessern.'],
  ['forum', `${n}: Ist das bei euch auch so?`, 'Foto folgt. Kann gerade nicht, weil ich am Handy bin.'],
  ['chatgpp', `${n}: Wir übernehmen die Recherche`, 'Kannst du uns zwei oder drei Links schicken? Dann wäre die Recherche fertig.']
];

function sfwResults() {
  return [
    ['youtuba', 'Klempner kommt tatsächlich zur Reparatur', '0:03 · Danach folgt die Rechnung. Alles vollständig angezogen.'],
    ['buyazon', 'Blickdichter Vorhang · endlich Privatsphäre', '19,99 € · Der Nachbar hat bereits zwei bestellt.'],
    ['wickipedia', 'Porree – Wickipedia', 'Ein langes Gemüse. Der Browser hat entschieden, dass Sie das gemeint haben.'],
    ['news', 'Mann schließt 47 Tabs und findet Wetterbericht', 'Das Wetter war schlechter als erwartet.'],
    ['klein', 'Zimmerpflanze, ohne Übertopf', 'Vollständige Blattansicht. Nur an sonnigen Standort.'],
    ['forum', 'Warum steht der Klempner noch im Flur?', 'Er wartet auf den Zugang zum Waschbecken.'],
    ['chatgpp', 'Wir haben Ihre Suchanfrage umgetopft', 'Bitte gießen Sie die Ergebnisse zweimal pro Woche.']
  ];
}

export function generateResults(input, seed = 1, page = 1) {
  const topic = resolveQuery(input);
  const rng = random((Number(seed) + (page - 1) * 7919) >>> 0);
  const n = topic.name;
  const place = topic.place || pick(cities.slice(0, 80), rng).name;
  let pool = topic.category === 'sfw' ? sfwResults() : topic.category === 'city' ? expandStories(cityStories, topic, place) : topic.category === 'car' ? carResults(n) : topic.category === 'person' ? personResults(n) : topic.category === 'food' ? foodResults(n) : otherResults(n);
  if (topic.category !== 'sfw') pool = [...(specifics[n] || []), ...pool];
  if (topic.category === 'food') pool.push(...(groupVariants[topic.group] || []).map(([site, title, description]) => [site, title.replaceAll('{n}', n), description]));
  if (topic.category !== 'sfw') pool.push(...expandStories(sharedStories, topic, place));
  const bespoke = [...(extraFoodStories[n] || []), ...expandStories(topicStories[topic.group] || [], topic, place)];
  pool.push(...bespoke);
  pool = pool.map(([site, title, description, extra]) => [site, site === 'news' && !specifics[n]?.some(row => row[1] === title) ? title.replaceAll('Stadt Dortmund', place).replaceAll('Dortmunder Mann', `Mann in ${place}`) : title, description, extra]);
  if (topic.intent === 'recipe') pool.push(['forum', `Rezept für ${n}, ohne die Zutaten`, 'Zubereitungszeit: 0 Minuten. Habe es gerade ausprobiert, schmeckt nach Teller.']);
  if (topic.intent === 'repair') pool.push(['forum', `${n} reparieren: erst mal wieder zusammenbauen`, 'Die restlichen Schrauben bitte für später aufheben.']);
  if (topic.intent === 'nutrition') pool.push(['wickipedia', `Nährwerte von ${n} pro Blickkontakt`, 'Die Tabelle ist leer, damit Sie selbst nichts ausrechnen müssen.']);
  const chosen = [];
  // Jede Quelle ist vertreten. Reihenfolge und die zwei zusätzlichen Treffer wechseln.
  for (const site of ['buyazon', 'youtuba', 'wickipedia', 'chatgpp', 'news', 'klein', 'forum']) {
    const variants = pool.filter(row => row[0] === site);
    const specific = [...(specifics[n] || []), ...bespoke].filter(row => row[0] === site);
    const iconicProduct = site === 'buyazon' && ['Gaming-PC', 'Büroklammer'].includes(n);
    chosen.push(pick(specific.length && (iconicProduct || rng() < 0.4) ? specific : variants, rng));
  }
  for (const row of shuffle(pool.filter(row => !chosen.some(selected => selected[0] === row[0] && selected[1] === row[1])), rng)) {
    if (chosen.length >= 9) break;
    if (chosen.filter(x => x[0] === row[0]).length < 2) chosen.push(row);
  }
  const results = shuffle(chosen, rng).map(([site, title, description, extra = {}], index) => ({
    id: `${page}-${index}`, site, title, description, topic, asset: assetFor(topic),
    place: /Dortmund|Dortmunder/.test(title) ? 'Dortmund' : place,
    family: storyFamily(site, title, n, place),
    ...extra,
    price: resultPrice(title, description, rng),
    stars: (3 + rng() * 1.9).toFixed(1), reviews: 18 + Math.floor(rng() * 9000),
    views: `${1 + Math.floor(rng() * 18)},${Math.floor(rng() * 9)} Mio.`, duration: '0:03',
    age: pick(['vor 2 Stunden', 'vor 3 Tagen', 'vor 11 Minuten', 'vor 6 Monaten'], rng)
  }));
  return { topic, results, related: relatedQueries(topic), count: 12000 + Math.floor(rng() * 880000), seconds: (0.18 + rng() * 0.42).toFixed(2) };
}

// Die Erinnerung gilt der Vorlage: Mango durch Reis zu ersetzen zählt nicht als
// neue Pointe. Der gewählte Seed in der URL macht Zurück und Teilen unabhängig
// von der lokalen Suchhistorie.
export function chooseSearchSeed(input, recent = [], initialSeed = 1) {
  if (!recent.length) return initialSeed >>> 0;
  const penalties = new Map();
  recent.slice(-12).forEach((entry, i, all) => {
    for (const family of entry.families || []) penalties.set(family, (penalties.get(family) || 0) + Math.pow(1.6, i - all.length + 1));
  });
  let best = { seed: initialSeed >>> 0, score: Infinity };
  for (let i = 0; i < 64; i++) {
    const candidate = (initialSeed + Math.imul(i, 0x9e3779b9)) >>> 0;
    const model = generateResults(input, candidate);
    const score = model.results.reduce((sum, result) => sum + (penalties.get(result.family) || 0), 0);
    if (score < best.score) best = { seed: candidate, score };
    if (!score) break;
  }
  return best.seed;
}

function resultPrice(title, description, rng) {
  const amount = `${title} ${description}`.match(/(\d[\d.]*)(?:,(\d{2}))?\s*€/);
  if (amount) return Number(amount[1].replaceAll('.', '')) + Number(amount[2] || 0) / 100;
  return /unsichtbar/i.test(title) ? 49.99 : pick([0.32, 6499, 49.99, 12.9, 89], rng);
}

export function relatedQueries(topic) {
  const n = topic.name.toLowerCase();
  if (topic.category === 'city') return [`wetter ${n}`, `hotel ${n}`, `wohnung ${n}`, `${n} öffnungszeiten`, `${n} sehenswürdigkeiten`, `${n} warum`];
  if (topic.category === 'everyday') return [`${n} geht nicht`, `${n} ohne anmeldung`, `${n} anleitung`, `${n} in ${topic.place || 'der nähe'}`, `${n} selber machen`, `${n} gestern`];
  if (topic.category === 'car') return [`${n} gebraucht`, `${n} rückwärts kaufen`, `${n} geräusch normal`, `${n} passt in briefkasten`, `${n} ohne räder`, `${n} letzter preis`];
  if (topic.category === 'person') return [`${n} größe`, `${n} wlan passwort`, `${n} kennt mich`, `${n} öffnungszeiten`, `${n} pappaufsteller`, `${n} dortmund`];
  return [`${n} kaufen`, `${n} gebraucht`, `${n} ohne anmeldung`, `${n} nachts geräusche`, `${n} lieferung gestern`, `${n} mit garantie`];
}

export function suggestions(input) {
  const value = input.trim();
  if (!value) return [];
  const needle = normalize(value);
  const matches = catalog.filter(item => [item.name, ...item.aliases].some(alias => normalize(alias).startsWith(needle))).slice(0, 5).map(item => item.name.toLowerCase());
  return [...new Set([value, ...matches, `${value} kaufen`, `${value} warum`, `${value} in der nähe`])].slice(0, 7);
}

export function chatReply(input, turn = 0, previous = '') {
  const state = previous ? advanceChat(previous).state : createChatState();
  state.turn = turn;
  return advanceChat(input, state).reply;
}
export function wikiIntro(topic) {
  if (topic.category === 'city') return `${topic.name} ist eine Stadt in ${topic.state}. Bei starker Vergrößerung des Stadtplans werden Straßen sichtbar, bei weiterer Vergrößerung nur noch die eigenen Fingerabdrücke. Die Fahrt dorthin dauert so lange, bis man angekommen ist.`;
  if (topic.category === 'everyday') return `Unter ${topic.name} versteht man einen Vorgang, zu dem mindestens ein Browser-Tab offen bleibt. Die meisten Anleitungen beginnen mit „ganz einfach“ und enden auf einem anderen Gerät.`;
  if (topic.category === 'person') return `${topic.name} ist eine Person, die durch die Eingabe ihres Namens in eine Suchmaschine hierher gelangt ist. Dieser Artikel beschreibt ausdrücklich eine erfundene Parodie, keine tatsächliche Biografie.`;
  if (topic.category === 'car') return `${topic.name} ist ein Fahrzeug mit einer Vorderseite und einer Seite, die beim Rückwärtsfahren vorne ist. Die Anzahl der verfügbaren Parkplätze blieb trotz seiner Einführung unverändert.`;
  return `${topic.name} ist die Bezeichnung für ${topic.name}. Die Fachliteratur unterscheidet zwei Fälle: „${topic.name} vorhanden“ und „${topic.name} nicht vorhanden“. Der zweite Fall wird im Handel häufig als Premiumvariante angeboten.`;
}

export function topicFact(topic, index = 0) {
  if (topic.category === 'city') return [`Lieferung innerhalb von ${topic.name}. Die Stadtgrenze muss vor Ort vorhanden sein.`, 'Das Rathaus ist kein Zubehörteil und bleibt stehen.', 'Abholung bitte zwischen Ankunft und Abreise.'][index % 3];
  return (groupFacts[topic.group] || ['Der abgebildete Artikel weiß nichts von dieser Anzeige.', 'Technische Angaben wurden nach Augenmaß ermittelt.', 'Bitte nach Erhalt prüfen, ob Sie das wirklich wollten.'])[index % 3];
}

export { sites, catalog };
