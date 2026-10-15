import { hash, shuffled } from './world-content.js';
const names = ['Ute Randnotiz', 'Klaus Korrektur', 'Nele Nachweis', 'Werner Weißnicht', 'Mara Möglicherweise', 'Cem Fußnote', 'Ralf Register', 'Jana Jaja', 'Robin Restbestand', 'Karin Komma', 'Ben Blatt', 'Erika Eintrag'];
const history = [
  'Die erste Erwähnung steht auf einem Kassenzettel. Die Summe war lesbar, das Datum nicht. Die Forschung konzentriert sich daher vorerst auf 3,49 Euro.',
  'Ein Foto aus dem Jahr 1997 zeigt möglicherweise den Gegenstand. Es könnte aber auch der Daumen der fotografierenden Person sein.',
  'Bis 2012 war der Begriff falsch sortiert. Seitdem wird er korrekt an der falschen Stelle geführt.',
  'Die älteste erhaltene Beschreibung befindet sich in einem Kalender für 2006. Dort steht lediglich „nicht vergessen“. Was nicht vergessen werden sollte, wurde vergessen.',
  'Im Archiv wurden vier Kartons gefunden. Drei enthielten weitere Kartons. Der vierte gilt seit dem Umzug als der wichtige.',
  'Die offizielle Einführung erfolgte an einem Dienstag. Der zuständige Mittwoch bestreitet bis heute jede Beteiligung.',
  'Eine frühe Darstellung wurde als Screensaver verwendet. Alle Belege verschwanden, sobald jemand die Maus bewegte.',
  '2009 wurde ein Ausschuss gegründet. Sein einziger Beschluss war, für weitere Beschlüsse einen Unterausschuss zu gründen.',
  'Zwei Schulen behaupten, den Begriff zuerst verwendet zu haben. Beide meinen damit die Schule auf der anderen Straßenseite.',
  'Bei einer Bestandsaufnahme wurde die Sache doppelt gezählt. Der zweite Eintrag blieb bestehen, um niemanden zu enttäuschen.',
  'Die historische Bezeichnung wurde aus Platzgründen abgekürzt. Die Abkürzung ist heute länger als die ursprüngliche Bezeichnung.',
  'Eine mündliche Überlieferung beginnt mit „Frag mal meine Schwester“. Die Schwester hat eine neue Nummer.'
];
const observations = [
  'Die frühere Fassung enthielt einen Satz mehr. Niemand weiß, welcher es war. Die Änderung gilt deshalb als redaktionelle Verbesserung.',
  'Untersuchungen werden fortgesetzt, sobald der Raum mit dem funktionierenden Beamer frei ist.',
  'Die neueste Studie liegt als Anhang einer E-Mail vor. Sie wurde an eine Adresse geschickt, die es seit 2015 nicht mehr gibt.',
  'In der Fachliteratur existieren mehrere Schreibweisen. Eine davon ist ein Druckfehler, wird aber am häufigsten zitiert.',
  'Eine Kartenansicht wurde entfernt, weil die Markierung mitten im Text lag.',
  'Die Einteilung in drei Untergruppen wurde nachträglich um eine Gruppe für Sachen ergänzt, die in keine Untergruppe passen.',
  'Seit der letzten Überarbeitung verweist der Artikel nicht mehr auf eine leere Seite, sondern auf eine andere leere Seite.',
  'Das zugehörige Diagramm wurde versehentlich als Tortendiagramm angelegt. Der Autor hat anschließend Hunger bekommen.'
];
const answers = [
  ['Antwort ohne Rückfrage', 'Hatte ich auch mal. War allerdings etwas völlig anderes.'],
  ['BitteSuchfunktion', 'Wurde 2011 schon gefragt. Der Link wurde 2012 gelöscht.'],
  ['DennisDetails', 'Welche Farbe hat es? Ohne die Farbe kann ich dazu nichts Allgemeines sagen.'],
  ['KarinKlappt', 'Bei mir ging es nach dem Ausschalten. Habe es seitdem nicht wieder eingeschaltet.'],
  ['MalAndersrum', 'Versuch das Gegenteil. Falls es funktioniert, war das hier ein guter Tipp.'],
  ['HorstHatZeit', 'Warum willst du das überhaupt wissen? Ich brauche erst den gesamten Lebenslauf der Frage.'],
  ['NichtDerSupport', 'Bitte eine Sendungsnummer angeben. Auch wenn nichts verschickt wurde.'],
  ['LeaVielleicht', 'Der wichtige Punkt steht zwischen den Zeilen. Da ist bei dir allerdings nur ein Leerzeichen.'],
  ['RudiRechnet', 'Kommt drauf an, ob heute noch gestern ist.'],
  ['ArchiviertSeit2008', 'Dieser Nutzer wurde seit Erstellung der Antwort nicht mehr gesehen.'],
  ['FensterAufKipp', 'Mach kurz ein Fenster auf. Hat mir bei einer anderen Sache geholfen.'],
  ['PetraPraxis', 'Kenne jemanden, der das weiß. Wir haben seit der Hochzeit keinen Kontakt.'],
  ['AntwortNachgereicht', 'Ich ergänze die genaue Anleitung morgen. Bearbeitet: vor 13 Jahren.'],
  ['TobiasTon', 'Auf dem Foto kann ich nichts hören. Bitte mit Ton hochladen.'],
  ['MitgliedSeitEben', 'Habe mich nur angemeldet, um ebenfalls ratlos zu sein.'],
  ['EineLetzteFrage', 'Kannst du bitte dieselbe Frage in einem anderen Browser stellen?']
];
export function variedCopy(result, seed) {
  const key = hash(result.title) ^ seed;
  const author = names[(key >>> 0) % names.length];
  return { author, history: history[(key >>> 5) % history.length], observation: observations[(key >>> 11) % observations.length], sources: shuffled(names, key).slice(0, 3), answers: shuffled(answers, key).slice(0, 3) };
}
