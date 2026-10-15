import { cities } from './cities.js';
import { commonTopics } from './search-content.js';
// Einträge: deutscher Name | englische / zusätzliche Suchbegriffe. Keine Modelle, keine API.
const foodGroups = {
  fruit: `Apfel|apple,äpfel,apples;Birne|pear,birnen;Banane|banana,bananen;Orange|oranges,orangen;Mandarine|tangerine,mandarinen;Clementine|clementines,clementinen;Zitrone|lemon,zitronen;Limette|lime,limetten;Grapefruit|grapefruits;Pomelo|pomelos;Erdbeere|strawberry,strawberries,erdbeeren;Himbeere|raspberry,himbeeren;Brombeere|blackberry,brombeeren;Heidelbeere|blueberry,blaubeeren,blaubeere,heidelbeeren;Johannisbeere|currant,johannisbeeren;Stachelbeere|gooseberry,stachelbeeren;Preiselbeere|lingonberry,preiselbeeren;Cranberry|cranberries;Kirsche|cherry,cherries,kirschen;Pfirsich|peach,pfirsiche;Nektarine|nectarine,nektarinen;Aprikose|apricot,aprikosen;Pflaume|plum,pflaumen;Zwetschge|damson,zwetschgen;Mirabelle|mirabelles,mirabellen;Weintraube|grape,grapes,trauben,weintrauben;Wassermelone|watermelon,wassermelonen,melone,melon;Honigmelone|honeydew;Ananas|pineapple;Mango|mangoes,mangos;Papaya|papayas;Kiwi|kiwis;Passionsfrucht|passion fruit,maracuja;Granatapfel|pomegranate,granatäpfel;Feige|fig,feigen;Dattel|date,dates,datteln;Kaki|persimmon,kakis;Litschi|lychee,litschis;Guave|guava;Drachenfrucht|dragon fruit,pitaya;Kokosnuss|coconut,kokosnüsse;Avocado|avocados;Quitte|quince,quitten;Sternfrucht|starfruit,karambole;Physalis|cape gooseberry;Holunderbeere|elderberry,holunder;Sanddorn|sea buckthorn;Maulbeere|mulberry;Açaí|acai;Aronia|chokeberry;Jackfrucht|jackfruit;Durian|durian fruit;Rambutan|rambutans;Rosine|raisin,rosinen;Obst|fruit,früchte,frucht,fruits`,
  vegetable: `Gurke|cucumber,cucumbers,gurken;Zucchini|courgette,zucchinis;Tomate|tomato,tomatoes,tomaten;Paprika|bell pepper,paprikas;Karotte|carrot,möhre,möhren,karotten;Kartoffel|potato,potatoes,kartoffeln;Süßkartoffel|sweet potato,süßkartoffeln;Aubergine|eggplant,auberginen;Brokkoli|broccoli;Blumenkohl|cauliflower;Rosenkohl|brussels sprouts;Rotkohl|red cabbage;Weißkohl|white cabbage;Wirsing|savoy cabbage;Grünkohl|kale;Chinakohl|chinese cabbage;Pak Choi|bok choy,pakchoi;Kohlrabi|kohlrabis;Spinat|spinach;Mangold|chard;Rucola|arugula,rocket;Kopfsalat|lettuce,salat;Feldsalat|lambs lettuce;Eisbergsalat|iceberg lettuce;Chicorée|chicory,chicoree;Endivie|endive;Fenchel|fennel;Sellerie|celery;Stangensellerie|celery stalk;Rote Bete|beetroot,rote beete;Radieschen|radish,radishes;Rettich|daikon;Pastinake|parsnip,pastinaken;Petersilienwurzel|parsley root;Schwarzwurzel|salsify;Topinambur|jerusalem artichoke;Steckrübe|rutabaga;Kürbis|pumpkin,kürbisse;Hokkaido|hokkaido pumpkin;Butternut|butternut squash;Spargel|asparagus;Artischocke|artichoke,artischocken;Mais|corn,sweetcorn;Erbse|pea,peas,erbsen;Bohne|bean,beans,bohnen;Kidneybohne|kidney bean,kidneybohnen;Kichererbse|chickpea,kichererbsen;Linse|lentil,linsen;Sojabohne|soybean,soja;Edamame|edamames;Zuckerschote|sugar snap pea,zuckerschoten;Okra|okra pods;Zwiebel|onion,onions,zwiebeln;Frühlingszwiebel|spring onion,lauchzwiebel;Schalotte|shallot,schalotten;Lauch|leek,porree;Knoblauch|garlic;Ingwer|ginger;Chili|chilli,chilies;Meerrettich|horseradish;Champignon|mushroom,champignons,pilze,pilz;Steinpilz|porcini,steinpilze;Pfifferling|chanterelle,pfifferlinge;Austernpilz|oyster mushroom;Gemüse|vegetable,vegetables`,
  nut: `Erdnuss|peanut,peanuts,erdnüsse;Walnuss|walnut,walnuts,walnüsse;Haselnuss|hazelnut,haselnüsse;Mandel|almond,almonds,mandeln;Cashew|cashews,cashewnuss;Pistazie|pistachio,pistazien;Pekannuss|pecan,pekannüsse;Paranuss|brazil nut,paranüsse;Macadamia|macadamias;Pinienkern|pine nut,pinienkerne;Esskastanie|chestnut,marone,maronen;Muskatnuss|nutmeg;Sonnenblumenkern|sunflower seed,sonnenblumenkerne;Kürbiskern|pumpkin seed,kürbiskerne;Leinsamen|flaxseed;Chiasamen|chia seed;Sesam|sesame;Nüsse|nuts,nuss`,
  pantry: `Reis|rice;Nudel|pasta,noodle,noodles,nudeln;Spaghetti|spagetti;Mehl|flour;Haferflocken|oats,oatmeal;Hafer|oat;Weizen|wheat;Roggen|rye;Dinkel|spelt;Gerste|barley;Hirse|millet;Quinoa|quinoa grain;Buchweizen|buckwheat;Couscous|cous cous;Bulgur|bulgur wheat;Brot|bread;Brötchen|bread roll,brötchen;Toast|toastbrot;Baguette|baguettes;Brezel|pretzel,brezn;Zucker|sugar;Salz|salt;Pfeffer|pepper;Zimt|cinnamon;Vanille|vanilla;Honig|honey;Marmelade|jam;Schokolade|chocolate;Kakao|cocoa;Kaffee|coffee;Tee|tea;Olivenöl|olive oil;Öl|oil,speiseöl;Essig|vinegar;Senf|mustard;Ketchup|tomato ketchup;Mayonnaise|mayo;Tofu|bean curd;Tempeh|tempe;Hummus|humus;Olive|olives,oliven;Gewürze|spices,gewürz;Backpulver|baking powder;Hefe|yeast;Wasser|water;Saft|juice;Apfelsaft|apple juice;Orangensaft|orange juice;Mineralwasser|sparkling water;Lebensmittel|food,essen,nahrung`,
  dairy: `Milch|milk;Butter|butter;Käse|cheese;Joghurt|yogurt,yoghurt,jogurt;Quark|curd;Sahne|cream;Frischkäse|cream cheese;Mozzarella|mozzarella cheese;Feta|feta cheese;Gouda|gouda cheese;Parmesan|parmesan cheese;Camembert|camembert cheese;Ei|egg,eggs,eier;Hafermilch|oat milk;Mandelmilch|almond milk;Sojamilch|soy milk;Kefir|kefir milk;Buttermilch|buttermilk`,
  meal: `Hähnchen|chicken,huhn;Rindfleisch|beef;Schweinefleisch|pork;Hackfleisch|minced meat;Wurst|sausage,würstchen;Schinken|ham;Speck|bacon;Lachs|salmon;Thunfisch|tuna;Forelle|trout;Garnele|shrimp,garnelen;Fisch|fish;Pizza|pizzas;Pommes|fries,french fries;Burger|hamburger;Döner|doner,kebab;Suppe|soup;Eis|ice cream,eiscreme;Kuchen|cake;Keks|cookie,cookies,kekse`
};

export const catalog = Object.entries(foodGroups).flatMap(([group, entries]) => entries.split(';').map(entry => {
  const [name, aliases = ''] = entry.split('|');
  return { name, aliases: aliases.split(','), category: 'food', group };
}));

const people = [
  ['Taylor Swift', 'taylor,swift'], ['Beyoncé', 'beyonce'], ['Rihanna', 'rihanna'], ['Adele', 'adele'], ['Billie Eilish', 'billie'], ['Dua Lipa', 'dua'], ['Lady Gaga', 'gaga'], ['Shakira', 'shakira'], ['Harry Styles', 'harry styles'], ['Ed Sheeran', 'sheeran'], ['The Weeknd', 'weeknd'], ['Drake', 'drake'], ['Eminem', 'eminem'], ['Snoop Dogg', 'snoop'], ['Bad Bunny', 'bad bunny'], ['Justin Bieber', 'bieber'], ['Ariana Grande', 'ariana'], ['Olivia Rodrigo', 'olivia rodrigo'], ['Sabrina Carpenter', 'sabrina'],
  ['Keanu Reeves', 'keanu'], ['Tom Hanks', 'tom hanks'], ['Leonardo DiCaprio', 'dicaprio,leonardo'], ['Brad Pitt', 'brad pitt'], ['Margot Robbie', 'margot'], ['Ryan Gosling', 'gosling'], ['Ryan Reynolds', 'reynolds'], ['Zendaya', 'zendaya'], ['Dwayne Johnson', 'the rock,dwayne'], ['Pedro Pascal', 'pedro'], ['Emma Watson', 'emma watson'], ['Jackie Chan', 'jackie'], ['Chuck Norris', 'chuck'],
  ['Cristiano Ronaldo', 'ronaldo,cr7'], ['Lionel Messi', 'messi'], ['Kylian Mbappé', 'mbappe,mbappé'], ['Erling Haaland', 'haaland'], ['Thomas Müller', 'thomas müller'], ['Manuel Neuer', 'neuer'], ['Dirk Nowitzki', 'nowitzki'], ['LeBron James', 'lebron'], ['Michael Jordan', 'michael jordan'], ['Lewis Hamilton', 'hamilton'], ['Max Verstappen', 'verstappen'],
  ['Olaf Scholz', 'scholz'], ['Angela Merkel', 'merkel'], ['Friedrich Merz', 'merz'], ['Donald Trump', 'trump'], ['Barack Obama', 'obama'], ['Elon Musk', 'elon,musk'], ['Mark Zuckerberg', 'zuckerberg'], ['Bill Gates', 'gates'], ['Jeff Bezos', 'bezos'],
  ['Heidi Klum', 'heidi'], ['Stefan Raab', 'raab'], ['Thomas Gottschalk', 'gottschalk'], ['Joko Winterscheidt', 'joko'], ['Klaas Heufer-Umlauf', 'klaas'], ['Jan Böhmermann', 'böhmermann'], ['Günther Jauch', 'jauch'], ['Dieter Bohlen', 'bohlen'], ['Helene Fischer', 'helene'], ['Sido', 'sido'], ['Apache 207', 'apache'], ['Ski Aggu', 'ski aggu'], ['Cro', 'cro'], ['Mark Forster', 'mark forster'], ['Boris Becker', 'boris becker']
];
catalog.push(...people.map(([name, alias]) => ({ name, aliases: alias.split(','), category: 'person', group: 'person' })));

const cars = [
  ['VW Golf', 'golf,volkswagen golf'], ['VW Polo', 'polo'], ['VW Passat', 'passat'], ['VW Tiguan', 'tiguan'], ['VW ID.3', 'id3,id.3'], ['VW ID.4', 'id4,id.4'], ['VW T-Roc', 't-roc,troc'], ['VW', 'volkswagen'],
  ['BMW 3er', 'bmw 320,bmw 318,3er'], ['BMW 5er', '5er,bmw 520'], ['BMW M3', 'm3'], ['BMW M4', 'm4'], ['BMW X5', 'x5'], ['BMW', 'bmw'], ['Mercedes C-Klasse', 'c klasse,c-klasse'], ['Mercedes E-Klasse', 'e klasse,e-klasse'], ['Mercedes G-Klasse', 'g klasse,g-klasse,g wagon'], ['Mercedes', 'mercedes-benz,benz,amg'],
  ['Audi A3', 'a3'], ['Audi A4', 'a4'], ['Audi A6', 'a6'], ['Audi RS6', 'rs6'], ['Audi Q5', 'q5'], ['Audi', 'audi'], ['Porsche 911', '911'], ['Porsche Taycan', 'taycan'], ['Porsche', 'porsche'], ['Tesla Model 3', 'model 3'], ['Tesla Model Y', 'model y'], ['Tesla Cybertruck', 'cybertruck'], ['Tesla', 'tesla'],
  ['Toyota Yaris', 'yaris'], ['Toyota Corolla', 'corolla'], ['Toyota Supra', 'supra'], ['Toyota', 'toyota'], ['Opel Corsa', 'corsa'], ['Opel Astra', 'astra'], ['Opel', 'opel'], ['Ford Fiesta', 'fiesta'], ['Ford Focus', 'focus'], ['Ford Mustang', 'mustang'], ['Ford', 'ford'], ['Škoda Octavia', 'skoda octavia,octavia'], ['Škoda', 'skoda'],
  ['Renault Clio', 'clio'], ['Renault', 'renault'], ['Peugeot 208', '208'], ['Peugeot', 'peugeot'], ['Fiat 500', 'fiat 500'], ['Fiat', 'fiat'], ['Seat Ibiza', 'ibiza'], ['Seat', 'seat'], ['Cupra', 'cupra'], ['Hyundai i30', 'i30'], ['Hyundai', 'hyundai'], ['Kia', 'kia'], ['Dacia Sandero', 'sandero'], ['Dacia', 'dacia'], ['Nissan GT-R', 'gtr,gt-r'], ['Nissan', 'nissan'], ['Honda Civic', 'civic'], ['Honda', 'honda'], ['Mazda MX-5', 'mx5,mx-5'], ['Mazda', 'mazda'], ['Volvo', 'volvo'], ['Mini Cooper', 'mini cooper'], ['Ferrari', 'ferrari'], ['Lamborghini', 'lambo,lamborghini'], ['Bugatti', 'bugatti'], ['Auto', 'car,cars,autos,pkw,fahrzeug'], ['Elektroauto', 'electric car,e-auto,e auto,elektroautos'], ['Gebrauchtwagen', 'used car,gebrauchtwagen']
];
catalog.push(...cars.map(([name, alias]) => ({ name, aliases: alias.split(','), category: 'car', group: 'car' })));
catalog.push(...cities, ...commonTopics);

export const sites = {
  buyazon: { name: 'Buyazon', domain: 'buyazon.de', color: '#232f3e', letter: 'b', path: 'Angebote' },
  youtuba: { name: 'YouTuba', domain: 'youtuba.com', color: '#f03', letter: '▶', path: 'watch' },
  wickipedia: { name: 'Wickipedia', domain: 'de.wickipedia.org', color: '#555', letter: 'W', path: 'wiki' },
  chatgpp: { name: 'ChatGPP', domain: 'chatgpp.com', color: '#20856b', letter: '✳', path: 'chat' },
  news: { name: 'Dortmunder Tagesblatt', domain: 'dortmunder-tagesblatt.de', color: '#b51a21', letter: 'D', path: 'Lokales' },
  klein: { name: 'Kleinunzeigen', domain: 'kleinunzeigen.de', color: '#657b20', letter: 'k', path: 's-anzeige' },
  forum: { name: 'Schlechtefrage', domain: 'schlechtefrage.net', color: '#3176bc', letter: '?', path: 'frage' }
};

// Diese Pointen beziehen sich wirklich auf das Lebensmittel, nicht nur auf einen Platzhalter.
export const specifics = {
  Gurke: [
    ['news', 'Dortmunder Gurke soll eine Zucchini sein', 'Der Aufkleber sagt Gurke. Die Nachbarn sind sich trotzdem sicher. Ein Gutachter soll jetzt das Ende untersuchen.'],
    ['buyazon', 'Unsichtbare Gurke · Premiumqualität', '49,99 € · Auf Lager, soweit wir wissen. Produktbild in Originalgröße.'],
    ['klein', 'Gurke sucht Glas mit Balkon', 'Ruhig, Nichtraucher, eigenes Dill vorhanden. Bitte keine Salatschüsseln.'],
    ['youtuba', 'ICH HABE EINE GURKE ENTSCHÄLT', 'Die Schale ist wieder dran. Tutorial folgt, sobald wir wissen, wie.']
  ],
  Banane: [['news', 'Banane beim Geradeausfahren erwischt', 'Die Polizei spricht von einem einmaligen Vorgang.'], ['buyazon', 'Banane ohne Kurve, für schmale Schubladen', '12,90 € · Die EU möchte dieses Produkt kurz sprechen.']],
  Apfel: [['buyazon', 'Apfel Pro Max, 256 Kerne', 'Mit Ladegerät. Kompatibel mit Birnen ab Baujahr 2019.'], ['news', 'Apfel fällt nicht weit vom Stamm, parkt trotzdem falsch', 'Die Abschleppkosten trägt der Baum.']],
  Birne: [['forum', 'Birne gewechselt, Zimmer immer noch dunkel?', 'Habe sie sogar geschält. Elektriker antwortet nicht mehr.']],
  Erdbeere: [['news', 'Erdbeere setzt Samen ab sofort nach innen', 'Die Umstellung soll bis zum nächsten Sommer abgeschlossen sein.']],
  Wassermelone: [['buyazon', 'Wassermelone trocken, zum Selberbefüllen', 'Wasser nicht enthalten. Schlauchanschluss ¾ Zoll.']],
  Ananas: [['forum', 'Ananas hat eine Krone. Muss ich jetzt siezen?', 'Sie steht seit Dienstag auf meinem Küchentisch und sagt nichts.']],
  Kiwi: [['news', 'Kiwi verweigert Rasur vor Familienfoto', 'Die Obstschale bittet um Verständnis.']],
  Zitrone: [['buyazon', 'Zitrone entsäuert · Geschmack: Leitungswasser', 'Mit neutralem Gesichtsausdruck geerntet.']],
  Avocado: [['news', 'Avocado war zwischen 14:02 und 14:03 reif', 'Eine Wiederholung des Ereignisses ist nicht geplant.']],
  Tomate: [['forum', 'Tomate wird rot, wenn ich reinkomme', 'Ist das normal oder soll ich die Küche wechseln?']],
  Kartoffel: [['buyazon', 'Kartoffel mit vorinstalliertem Windows', 'Updates während des Kochens nicht ausschalten.']],
  Zwiebel: [['news', 'Zwiebel eröffnet Beschwerdestelle', 'Auch dort müssen alle weinen.']],
  Knoblauch: [['buyazon', 'Knoblauch geruchsneutral · nur noch Lauch', 'Sie sparen 50 % des Namens.']],
  Brokkoli: [['news', 'Brokkoli beantragt Status als Wald', 'Das Forstamt fordert größere Bäume.']],
  Karotte: [['buyazon', 'Karotte, Bluetooth, 40 Meter Reichweite', 'Die Verbindung zum Kaninchen erfolgt automatisch.']],
  Kürbis: [['news', 'Kürbis beantragt Gesicht auch außerhalb von Oktober', 'Bisher durfte er nur saisonal schauen.']],
  Paprika: [['buyazon', 'Ampel-Paprika, Gelb gerade ausgefallen', 'Bitte vorsichtig durch den Salat fahren.']],
  Erdnuss: [['forum', 'Erdnuss eingepflanzt. Wann kommt der Boden?', 'Die Packung verspricht Erde, aber bisher ist nur Nuss da.']],
  Walnuss: [['buyazon', 'Walnuss, bereits zugeschraubt', 'Passender Schlüssel separat erhältlich.']],
  Pistazie: [['news', 'Pistazie mit geschlossener Schale erhält Hausrecht', 'Die restliche Tüte steht vor der Tür.']],
  Reis: [['forum', 'Handy in Reis gelegt. Reis ruft jetzt an', 'Ich gehe nicht ran, weil ich die Nummer nicht kenne.']],
  Nudel: [['news', 'Nudel kündigt al dente an, bleibt dann doch weich', 'Gäste sprechen von falschen Versprechungen.']],
  Spaghetti: [['buyazon', 'Spaghetti kabellos · endlich ohne Kabelsalat', 'Die Reichweite hängt von der Soße ab.']],
  Brot: [['buyazon', 'Brot mit eingebautem Toaster', 'Gerät ist nicht aus dem Brot entfernbar.']],
  Milch: [['news', 'Milch länger haltbar als angekündigt', 'Das Datum auf der Packung wurde zur Stellungnahme gebeten.']],
  Käse: [['buyazon', 'Käselöcher, 500 g, ohne Käse', 'Sehr leicht. Auch als Fenster geeignet.']],
  Ei: [['forum', 'Ei geöffnet. Kein Beipackzettel?', 'Habe noch ein zweites geprüft. Wieder keiner.']],
  Kaffee: [['news', 'Kaffee kann selbst nicht mehr einschlafen', 'Seit Montag steht er im Flur und wartet auf den Bus.']],
  Salz: [['buyazon', 'Salz, jedes Korn einzeln verpackt', 'Lieferung in 18.400 Paketen.']],
  Honig: [['news', 'Bienen stellen auf Stundenlohn um', 'Das Glas wird künftig nach Aufwand berechnet.']],
  Pizza: [['buyazon', 'Pizza mit bereits entfernten Lieblingsstücken', 'Für das authentische WG-Erlebnis.']],
  Büroklammer: [['buyazon', 'Büroklammer · normale Büroklammer', '6.499,00 € · Keine besonderen Eigenschaften.']],
  'Gaming-PC': [['buyazon', 'High-End Gaming-PC · 0,32 €', 'Versand kostenlos. Adresse ermitteln wir durch Ausschlussverfahren.']]
};

export const groupFacts = {
  fruit: ['Bei Zimmertemperatur lagern. Das Zimmer darf dabei nicht wissen, warum.', 'Die Schale gehört zum Lieferumfang und kann nicht abgewählt werden.', 'Das Exemplar auf dem Foto wurde inzwischen gegessen.'],
  vegetable: ['Regional angebaut, anschließend einmal um die Region gefahren.', 'Bitte vor dem Verzehr aus der Produktverpackung nehmen.', 'Auch einzeln im Dreierpack erhältlich.'],
  nut: ['Kann Spuren der eigenen Anwesenheit enthalten.', 'Die Schale zählt bei der Gewichtsangabe als Zubehör.', 'Für Studentenfutter geeignet. Immatrikulationsbescheinigung erforderlich.'],
  pantry: ['Trocken lagern. Bei Regen bitte das Dach verwenden.', 'Mindesthaltbarkeit: siehe Boden. Auf dem Boden steht nichts.', 'Portionsgröße wurde von einer sehr kleinen Person festgelegt.'],
  dairy: ['Nach dem Öffnen bitte wieder daran denken.', 'Gekühlt lagern. Der Kühlschrank muss mitspielen.', 'Die Verpackung ist wiederverschließbar, wenn man sie nicht öffnet.'],
  meal: ['Serviervorschlag enthält fremdes Geschirr.', 'Kann warm oder nach einem längeren Gespräch kalt serviert werden.', 'Die abgebildete Portion ist nicht Ihre Portion.']
};

// Zusätzliche Situationen pro Lebensmittelgruppe. Der gleiche Suchbegriff kann in
// völlig unterschiedlichen Geschichten landen, statt nur ein Wort auszutauschen.
export const groupVariants = {
  fruit: [
    ['buyazon', '{n}, Reifegrad im Abo', 'Heute hart, morgen perfekt, übermorgen nur noch Briefbeschwerer. Kündigung täglich möglich.'],
    ['buyazon', '{n} mit abnehmbarer Schale', 'Die Schale kann mit der Hand entfernt werden. Diese Innovation kostet 899 €.'],
    ['news', '{n} kommt nach Urlaub braun zurück', 'Lag zwei Wochen neben dem Fenster. War laut eigener Aussage sehr erholsam.'],
    ['news', 'Obstschale fordert für {n} eine Kaution', 'Die letzte Banane hat Flecken hinterlassen.'],
    ['youtuba', 'ALLE KERNE VON {n} GEZÄHLT (MIT FEHLERN)', '0:03 · Nach drei wurde geschätzt.'],
    ['youtuba', '{n} rückwärts essen: Mein Zahnarzt reagiert', '0:03 · Er geht nicht ans Telefon.'],
    ['klein', '{n}, nur an Liebhaber mit Fensterbank', 'Stand immer neben Obst. Kennt also Gesellschaft.'],
    ['forum', '{n} liegt im Obstkorb. Muss es sich am Haushalt beteiligen?', 'Hat bisher weder gespült noch Müll rausgebracht.']
  ],
  vegetable: [
    ['buyazon', '{n}, fertig ungekocht', 'Spart Ihnen den gesamten Vorgang des Nichtkochens. Topf optional.'],
    ['buyazon', '{n} mit TÜV bis 2028', 'Für öffentliche Suppen zugelassen. Keine Eintragung erforderlich.'],
    ['news', '{n} verlässt Gemüsefach über Notausgang', 'Der Kühlschrank verweist auf seine Hausordnung.'],
    ['news', 'Supermarkt stellt {n} versehentlich zur Buchhaltung', 'Die Bilanz ist seitdem knackiger, sagen Mitarbeiter.'],
    ['youtuba', '{n} FRITTIERT, ABER DAS ÖL VERGESSEN', '0:03 · Das Ergebnis wird jetzt gebraten genannt.'],
    ['youtuba', 'Kann {n} alleine nach Hause finden?', '0:03 · Es liegt noch an derselben Stelle.'],
    ['klein', '{n}, noch auf dem Feld montiert', 'Selbstabbau. Der Bauer möchte vorher angerufen werden.'],
    ['forum', 'Kann ich {n} einfrieren, ohne einen Termin zu machen?', 'Mein Gefrierfach wirkt seit gestern sehr beschäftigt.']
  ],
  nut: [
    ['buyazon', '{n} komplett geöffnet, wieder mit Klebeband zu', 'Für Menschen, die gern selber öffnen, aber ungern knacken.'],
    ['buyazon', '{n}, Kern und Schale separat geliefert', 'Zwei Liefertermine. Bitte erst nach vollständiger Lieferung zusammenbauen.'],
    ['news', '{n} beantragt Baugenehmigung für zweite Schale', 'Die Außenfassade soll aus einer weiteren Nuss bestehen.'],
    ['news', 'Studentenfutter weist {n} wegen fehlendem Semesterticket ab', 'Eine Gasthörerschaft wurde angeboten.'],
    ['youtuba', '{n} MIT EINEM ANDEREN {n} GEÖFFNET', '0:03 · Jetzt sind beide kaputt.'],
    ['youtuba', 'ICH HABE EINEM EICHHÖRNCHEN {n} GELIEHEN', '0:03 · Rückzahlung bisher offen.'],
    ['klein', '{n}, ungeknackt, Schlüssel verloren', 'Vielleicht kennt sich hier jemand mit Schlössern aus.'],
    ['forum', '{n} unter Sofa gefunden. Gehört das dem Vermieter?', 'War beim Einzug vermutlich schon drin.']
  ],
  pantry: [
    ['buyazon', '{n}, 500 g in 500 einzelnen Paketen', 'Versandkosten werden pro Paket berechnet. Paketbote hat gekündigt.'],
    ['buyazon', '{n} Express: nur noch aufwärmen, kochen und einkaufen', 'Mit zeitsparender Anleitung auf der Verpackung.'],
    ['news', '{n} im Vorratsschrank zum Kassenwart gewählt', 'Die Wahl war geheim. Nudeln wollten die Ergebnisse sehen.'],
    ['news', 'Packung {n} enthält 12 % mehr Packung', 'Am Inhalt wurde aus Kostengründen nichts verändert.'],
    ['youtuba', '{n} NACH ANLEITUNG ZUBEREITET (ERSTER VERSUCH)', '0:03 · Anleitung stand auf einer anderen Packung.'],
    ['youtuba', 'Mein Wasserkocher bewertet {n}', '0:03 · Zwei Sterne. Einer davon ist Kalk.'],
    ['klein', '{n}, aus Nachlass einer Einkaufsliste', 'Die Person lebt noch, kauft aber jetzt woanders.'],
    ['forum', '{n} hat kein Ablaufdatum. Kann ich es zurückgeben?', 'Ich brauche einen festen Termin, sonst vergesse ich es.']
  ],
  dairy: [
    ['buyazon', '{n} ohne Kühlkette, dafür mit Halskette', 'Das Produkt ist jetzt sehr warm, sieht aber gut aus.'],
    ['buyazon', '{n}, laktosefrei laut Verkäufer', 'Verkäufer ist selbst laktosefrei. Zum Produkt liegen keine Angaben vor.'],
    ['news', '{n} reserviert Platz im Kühlschrank', 'Auf dem Fach liegt seit drei Tagen ein Handtuch.'],
    ['news', 'Kühlschrank und {n} einigen sich auf 7 Grad', 'Beide Seiten hätten sich auch 6 vorstellen können.'],
    ['youtuba', '{n} BEI ZIMMERTEMPERATUR ÜBERNACHTEN LASSEN', '0:03 · War morgens ein anderes Produkt.'],
    ['youtuba', 'ICH HABE {n} MIT EINER GABEL GETRUNKEN', '0:03 · Teil 2 dauert noch.'],
    ['klein', '{n}, immer gekühlt außer unterwegs', 'Unterwegs seit Juni. Preis verhandelbar.'],
    ['forum', '{n} im Kühlschrank spricht nicht mit mir', 'Es steht immer mit dem Etikett zur Wand.']
  ],
  meal: [
    ['buyazon', '{n}, Serviervorschlag wird mitgeliefert', 'Sie bekommen ausschließlich das Foto. Teller sieht wirklich gut aus.'],
    ['buyazon', '{n}, vom Lieferanten schon mal probiert', 'Er wollte sicherstellen, dass Sie das mögen. Hälfte noch da.'],
    ['news', '{n} erscheint 40 Minuten nach Bestellung', 'Eine örtliche Liefer-App bezeichnet das als sofort.'],
    ['news', '{n} gewinnt Wahl zum Abendessen', 'Der Zweitplatzierte muss morgen gegessen werden.'],
    ['youtuba', 'ICH HABE {n} MIT DEN AUGEN AUFGEGESSEN', '0:03 · Danach musste ich noch essen.'],
    ['youtuba', '{n} GEGEN DÖNER: BEIDE HABEN VERLOREN', '0:03 · Ich war hungrig.'],
    ['klein', '{n}, unbenutzte Hälfte', 'War mehr als gedacht. Nur schnelle Abholung.'],
    ['forum', '{n} bestellt. Muss ich dem Lieferanten meine Tür erklären?', 'Er steht vor der Hauswand und wirkt entschlossen.']
  ]
};
