// Gesprächszustände und handgeschriebene Antworten. Keine KI, keine Netzwerkanfragen.
const clean = value => String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9+*/.,-]+/g, ' ').trim();
const yes = value => /\b(ja|jep|jup|jo|klar|offen|geoffnet|bereit|fertig|erledigt|done|yes|opened|ready|already|hab ich|habe ich|ist auf|ist an|i did|i have|hab|habe)\b/.test(value) && !/\b(nicht|kein|keine|nein|no|not|haven t)\b/.test(value);
const no = value => /\b(nein|no|nicht|kein|keine|kann nicht|geht nicht|cannot|can t)\b/.test(value);
const complaint = value => /\b(du sollst|selber|selbst|nutzlos|help me|hilf mir|bruder|damit ich|warum ich|mach du|beantworte)\b/.test(value);
const repeat = value => /\b(nochmal|wiederholen|repeat|welche aufgabe|was war|worum ging|was wollte|what were)\b/.test(value);
const generic = [
  'Kannst du das kurz gurgeln und mir das erste Ergebnis schicken?',
  'Ich bin gerade am Handy. Können wir das später machen?',
  'Schreib mir bitte schon mal die Antwort. Ich formuliere dann die Frage dazu.',
  'Einen Moment. Ich öffne dafür einen zweiten Chat mit mir.',
  'Habe ich gelesen. Das wäre der erste Schritt.',
  'Dafür müsste ich kurz jemanden fragen. Bist du noch da?',
  'Ich habe eine leere Datei dazu angelegt. Du kannst jetzt anfangen.',
  'Gute Frage. Ich lasse den Tab mal offen, falls jemand vorbeikommt.',
  'Kannst du die Frage ausdrucken? Ich arbeite heute mit Papier.',
  'Ich würde das gern an einen Kollegen geben. Ich bin hier allerdings der einzige.',
  'Ich habe deine Frage unter „noch offen“ abgelegt. Das ist mein größter Ordner.',
  'Hast du schon eine Vermutung? Ich kann dann zustimmen.',
  'Ich notiere mir das. Einen Stift müsstest du mir noch nennen.',
  'Dazu habe ich einen neuen Absatz angefangen. Inhalt kommt von dir.',
  'Ich bin für den Empfang der Frage zuständig. Empfang bestätigt.',
  'Könntest du mir erklären, was ich antworten soll? Dann wären wir schneller fertig.',
  'Ich hätte einen Vorschlag: Frag kurz außerhalb dieses Chats.',
  'Meine Notizen dazu sind auf einem anderen Gerät. Es handelt sich um dein Gerät.'
];

export function createChatState() {
  return { thread: null, stage: null, task: null, turn: 0, lastReply: '', usedGeneric: [], observations: [], history: [] };
}
export function parseArithmetic(input) {
  let value = String(input).toLowerCase();
  const numbers = { null: 0, zero: 0, eins: 1, one: 1, zwei: 2, two: 2, drei: 3, three: 3, vier: 4, four: 4, fünf: 5, fuenf: 5, five: 5, sechs: 6, six: 6, sieben: 7, seven: 7, acht: 8, eight: 8, neun: 9, nine: 9, zehn: 10, ten: 10, elf: 11, eleven: 11, zwölf: 12, zwoelf: 12, twelve: 12 };
  for (const [word, number] of Object.entries(numbers)) value = value.replace(new RegExp(`\\b${word}\\b`, 'g'), String(number));
  const match = value.match(/(-?\d+(?:[.,]\d+)?)\s*(geteilt(?:\s+durch)?|divided\s+by|plus|minus|times|mal|[+*×/÷-])\s*(-?\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  const operator = { plus: '+', minus: '-', mal: '×', times: '×', '*': '×', 'geteilt durch': '÷', geteilt: '÷', 'divided by': '÷', '/': '÷' }[match[2]] || match[2];
  return { left: match[1], right: match[3], operator, expression: `${match[1]} ${operator} ${match[3]}` };
}
function calculatorInstructions(task) {
  const buttonName = { '+': 'Plus-Taste „+“', '-': 'Minus-Taste „−“', '×': 'Mal-Taste „×“ oder „*“', '÷': 'Geteilt-Taste „÷“ oder „/“' }[task.operator];
  const digits = number => [...number].map(character => character === ',' || character === '.' ? 'die Komma-Taste' : character === '-' ? 'die Vorzeichen-Taste' : `die Taste „${character}“`).join(', dann ');
  return [`Gut. Lass den Taschenrechner bitte offen. Wir bearbeiten weiterhin ${task.expression}.`, '', '1. Klick einmal in das Fenster des Taschenrechners. Nicht hier in den Chat.', '2. Drück „C“ oder „AC“, damit keine alte Zahl im Weg steht.', `3. Drück ${digits(task.left)}.`, `4. Drück die ${buttonName}.`, `5. Drück ${digits(task.right)}.`, '6. Drück die Gleich-Taste „=“. Falls sie fehlt, versuch Enter.', '7. Lies die Zahl oben ab und schreib sie mir hier.', '', 'Bitte den Taschenrechner bis zum Abschluss des Vorgangs nicht schließen. Ich bin auf deine Mitarbeit angewiesen.'].join('\n');
}

export function advanceChat(input, prior = createChatState()) {
  const text = String(input).trim().slice(0, 1000);
  const value = clean(text);
  let state = { ...prior, usedGeneric: [...prior.usedGeneric], observations: [...prior.observations], history: [...prior.history] };
  let reply;
  const expression = parseArithmetic(text);
  const reset = /^(vergiss das|neues thema|reset|forget that|start over)[.! ]*$/.test(value);
  if (reset) { state = createChatState(); reply = 'Alles klar. Ich habe die Aufgabe jetzt auch offiziell vergessen.'; }
  else if (!text) reply = 'Du kannst ruhig etwas schreiben. Ich lese dann später.';
  else if (/\b(wer bist|who are|chatgpp)\b/.test(value) && !state.thread) reply = 'Ich bin ChatGPP. Die beiden P stehen für Personalpause.';
  else if (expression) { state.thread = 'calculator'; state.stage = 'open'; state.task = expression; reply = 'Könntest du kurz den Taschenrechner öffnen?'; }
  else if (/\b(wetter|weather)\b/.test(value) && (state.thread !== 'weather' || /^(wie|what|how|wetter|weather)/.test(value))) { state.thread = 'weather'; state.stage = 'window'; state.task = { request: text }; reply = 'Ist bei dir ein Fenster in der Nähe?'; }
  else if (/\b(rezept|kochen|recipe|cook)\b/.test(value) && state.thread !== 'recipe') { state.thread = 'recipe'; state.stage = 'fridge'; state.task = { request: text }; reply = 'Kannst du kurz den Kühlschrank öffnen? Ich hätte gern einen Überblick.'; }
  else if (/\b(code|programmier\w*|javascript|python|html|css)\b/.test(value) && state.thread !== 'code') { state.thread = 'code'; state.stage = 'write'; state.task = { request: text }; reply = 'Kannst du den Code schon mal schreiben? Dann hätte ich etwas zum Anschauen.'; }
  else if (/\b(paket|tracking|sendung|parcel)\b/.test(value) && state.thread !== 'parcel') { state.thread = 'parcel'; state.stage = 'number'; state.task = { request: text }; reply = 'Hast du die Sendungsnummer? Ich möchte etwas haben, das ich nicht selbst verfolgen muss.'; }
  else if (/\b(ubersetz\w*|translate|translation)\b/.test(value) && state.thread !== 'translate') { state.thread = 'translate'; state.stage = 'text'; state.task = { request: text }; reply = 'Kannst du den Text einmal laut vorlesen und mir danach schreiben, was er bedeutet?'; }
  else if (state.thread === 'calculator') {
    if (repeat(value)) reply = state.stage === 'open' ? `Es ging um ${state.task.expression}. Dafür solltest du kurz den Taschenrechner öffnen.` : calculatorInstructions(state.task);
    else if (/\b(danke|thanks|thank you)\b/.test(value)) reply = 'Gern. Die meiste Arbeit hat der Taschenrechner gemacht. Du warst auch dabei.';
    else if (complaint(value)) reply = `Ich verstehe. Für ${state.task.expression} fehlt mir trotzdem noch das Ergebnis vom Taschenrechner. Wir sind also weiterhin auf dich angewiesen.`;
    else if (state.stage === 'open') {
      if (yes(value)) { reply = calculatorInstructions(state.task); state.stage = 'read-result'; }
      else if (no(value)) reply = 'Dann such auf deinem Handy nach „Rechner“. Falls du dort keinen findest, frag kurz jemanden, der gerade einen offen hat. Ich halte die Aufgabe solange fest.';
      else reply = `Noch geht es nur ums Öffnen. Ist der Taschenrechner für ${state.task.expression} jetzt offen?`;
    } else if (state.stage === 'read-result') {
      const result = text.match(/(?:^|\s)(-?\d+(?:[.,]\d+)?)(?:\s|[.!?]|$)/)?.[1];
      if (result) { state.task = { ...state.task, reportedResult: result }; state.stage = 'done'; reply = `Dann lautet meine Antwort: ${result}.\n\nIch habe das Ergebnis aus deiner Nachricht übernommen. Den Taschenrechner kannst du jetzt schließen. Falls noch eine Rechnung kommt, öffnest du ihn am besten wieder.`; }
      else if (no(value)) reply = 'Drück bitte noch einmal „AC“ und geh die Schritte erneut durch. Wenn keine Zahl erscheint, wäre zuerst der Taschenrechner dran, nicht die Rechnung.';
      else reply = `Jetzt brauche ich nur noch die Zahl, die bei ${state.task.expression} im Taschenrechner steht. „Hab ich“ ist leider keine Zahl, die ich übernehmen kann.`;
    } else if (/\b(falsch|stimmt nicht|wrong)\b/.test(value)) { state.stage = 'read-result'; reply = `Dann bitte nicht meine Antwort verwenden. Wir gehen zurück zu ${state.task.expression}.\n\n${calculatorInstructions(state.task)}`; }
    else reply = `Wir hatten ${state.task.expression} und dein Taschenrechner hat ${state.task.reportedResult} gemeldet. Für eine neue Rechnung müsstest du mir die neuen Zahlen schicken.`;
  } else if (repeat(value) && state.task?.request) reply = `Deine ursprüngliche Frage war: „${state.task.request}“.\n\n${state.lastReply}`;
  else if (complaint(value) && state.thread) reply = 'Ich habe verstanden, dass ich helfen soll. Mein aktueller Schritt besteht darin, dass du den nächsten Schritt machst.';
  else if (/\b(danke|thanks|thank you)\b/.test(value)) reply = state.thread ? 'Gern. Gib bitte der Person Bescheid, die das tatsächlich erledigt hat.' : 'Gern. Falls jemand fragt, haben wir das gemeinsam gemacht.';
  else if (state.thread === 'weather') {
    if (state.stage === 'window') {
      if (yes(value)) { state.stage = 'look'; reply = 'Gut. Geh bitte zum Fenster, zieh den Vorhang zur Seite und schau hinaus. Schreib mir, ob du Regen, Sonne oder einen Rollladen siehst.'; }
      else if (no(value)) { state.stage = 'look'; reply = 'Dann könntest du die Tür versuchen. Bitte danach kurz beschreiben, was draußen los ist. Die Tür ist in diesem Fall ein mobiles Fenster.'; }
      else reply = 'Das Fenster war erst eine Ja-oder-nein-Frage. Ich habe meinen Wetterbericht noch nicht von dir erhalten.';
    } else if (state.stage === 'look') {
      if (yes(value) && !/\b(regen|sonne|bewolkt|wolken|rain|sun|blau|grau)\b/.test(value)) reply = 'Du hast geschaut. Sehr gut. Jetzt bitte noch sagen, was du gesehen hast.';
      else { state.observations.push(text); state.stage = 'done'; reply = `Mein Wetterbericht: „${text}“.\n\nQuelle: du am Fenster. Für morgen musst du morgen noch einmal schauen.`; }
    } else reply = 'Für eine aktualisierte Vorhersage bitte erneut durchs Fenster schauen. Ich kann den Himmel von hier aus nicht anklicken.';
  } else if (state.thread === 'recipe') {
    if (state.stage === 'fridge') {
      if (yes(value)) { state.stage = 'ingredients'; reply = 'Prima. Lass ihn nicht zu lange offen. Schreib die Zutaten ab, die du erkennst. Die Kühlschranklampe zählt nicht als Zutat.'; }
      else if (no(value)) reply = 'Dann fang mit dem Griff an. Das ist meistens das längliche Teil an der Vorderseite.';
      else { state.observations.push(text); state.stage = 'cookbook'; reply = `Ich habe „${text}“ notiert. Kannst du damit kurz ein Rezept suchen? Dann kann ich es dir anschließend empfehlen.`; }
    } else if (state.stage === 'ingredients') { state.observations.push(text); state.stage = 'cookbook'; reply = `Zutatenliste gespeichert: ${text}.\n\nJetzt gib die Liste bitte bei Gurgel ein, such ein Rezept und lies es durch. Falls es gut ist, sag mir den Titel. Ich würde es dann ebenfalls vorschlagen.`; }
    else if (yes(value)) { state.stage = 'done'; reply = 'Dann empfehle ich dir genau das Rezept, das du gerade gefunden hast. Die Zubereitung steht dort. Ich würde sie an deiner Stelle selbst durchführen.'; }
    else reply = `Es geht weiterhin um „${state.task.request}“. Die Zutaten habe ich schon von dir. Was fehlt, ist das Rezept, das du noch suchen solltest.`;
  } else if (state.thread === 'code') {
    if (state.stage === 'write') {
      if (yes(value)) { state.stage = 'run'; reply = 'Gut. Speichere die Datei. Starte deinen Code. Falls etwas rot wird, kopier den roten Text hier hinein. Bitte vorher prüfen, dass du nicht nur eine rote Schriftfarbe eingestellt hast.'; }
      else if (no(value)) reply = 'Dann fehlt leider der Code, den ich mir anschauen wollte. Wir sind noch vor dem hilfreichen Teil.';
      else { state.observations.push(text); state.stage = 'run'; reply = 'Das sieht ausreichend nach Text aus. Kannst du ihn jetzt ausführen und mir sagen, ob er funktioniert?'; }
    } else { state.observations.push(text); reply = `Testergebnis notiert: „${text}“.\n\nWenn es funktioniert, war der Code gut. Wenn nicht, müsste ihn jemand ändern. Du hast die Datei ja schon offen.`; }
  } else if (state.thread === 'parcel') {
    if (state.stage === 'number') {
      if (yes(value)) { state.stage = 'tracking'; reply = 'Öffne bitte die Website des Zustellers. Such „Sendungsverfolgung“. Trag deine Nummer ein und klick auf Suchen. Danach sagst du mir den Status.'; }
      else if (no(value)) reply = 'Dann such in der Bestellbestätigung nach der Nummer. Ich warte hier auf eine Information, die du dort nachlesen kannst.';
      else { state.task = { ...state.task, number: text }; state.stage = 'tracking'; reply = 'Nummer erhalten. Bitte jetzt beim Zusteller eingeben. Ich kann dann den Status übernehmen, den du dort siehst.'; }
    } else { state.observations.push(text); reply = yes(value) ? 'Sehr gut. Jetzt fehlt noch der Status. Die Website muss ihn dir bereits verraten haben.' : `Aktueller Paketstatus laut meiner Auskunft: „${text}“.\n\nDie Auskunft stammt vollständig von dir.`; }
  } else if (state.thread === 'translate') {
    if (state.stage === 'text') { state.observations.push(text); state.stage = 'meaning'; reply = 'Text erhalten. Jetzt bitte die Bedeutung herausfinden und mir auf Deutsch schicken. Ich füge anschließend das Wort „Übersetzung“ darüber.'; }
    else { state.stage = 'done'; reply = `Übersetzung:\n${text}\n\nIch habe die Formatierung übernommen.`; }
  } else if (state.thread === 'research' && yes(value)) { state.stage = 'summary'; reply = 'Gut. Kopiere die Antwort hier hinein. Bitte vorher so zusammenfassen, dass ich nichts mehr zusammenfassen muss.'; }
  else if (state.thread === 'research' && state.stage === 'summary') { state.observations.push(text); state.stage = 'done'; reply = `Meine Zusammenfassung:\n${text}\n\nSo hätte ich es auch geschrieben, nachdem du es geschrieben hast.`; }
  else if (yes(value)) reply = 'Was genau hast du erledigt? Ohne offene Aufgabe kann ich dafür leider keine fremde Leistung übernehmen.';
  else {
    const available = generic.map((reply, index) => ({ reply, index })).filter(item => !state.usedGeneric.includes(item.index));
    const selected = available[(state.turn * 5) % available.length] || { reply: generic[0], index: 0 };
    state.usedGeneric = available.length === 1 ? [] : [...state.usedGeneric, selected.index];
    reply = selected.reply;
    if (selected.index === 0 || /\b(warum|wieso|why|wie|how)\b/.test(value)) { state.thread = 'research'; state.stage = 'search'; state.task = { request: text }; if (selected.index !== 0) reply = 'Die Frage hatte ich auch. Kannst du das kurz gurgeln und mir sagen, was dabei rauskommt?'; }
  }
  state.turn++;
  state.lastReply = reply;
  state.history = [...state.history, { question: text, reply }].slice(-30);
  return { reply, state };
}
