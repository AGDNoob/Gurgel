import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { catalog, normalize, resolveQuery, generateResults, chooseSearchSeed, chatReply, suggestions, sites } from '../engine.js';
import { cities, citySource } from '../cities.js';
import { commonTopics } from '../search-content.js';
import { createChatState, advanceChat } from '../chat-engine.js';
import { sceneFor, sceneLabel } from '../video-scenes.js';

test('Deutsche und englische Lebensmittel, Personen und Fahrzeuge erkennen', () => {
  for (const [query, name, category] of [
    ['Gurken', 'Gurke', 'food'], ['Cucumbers', 'Gurke', 'food'], ['sweet potato recipe', 'Süßkartoffel', 'food'], ['walnuts kaufen', 'Walnuss', 'food'], ['Wie koche ich Reis?', 'Reis', 'food'], ['ÄPFEL', 'Apfel', 'food'], ['cashews', 'Cashew', 'food'], ['oat milk', 'Hafermilch', 'food'], ['Taylor Swift', 'Taylor Swift', 'person'], ['mbappé', 'Kylian Mbappé', 'person'], ['used BMW M3', 'BMW M3', 'car'], ['volkswagen golf', 'VW Golf', 'car'], ['Gaming-PC', 'Gaming-PC', 'tech'], ['Büroklammern', 'Büroklammer', 'object']
  ]) {
    const topic = resolveQuery(query);
    assert.equal(topic.name, name, query);
    assert.equal(topic.category, category, query);
  }
});

test('Der gesamte Katalog liefert funktionierende Seiten und lokale Bilder', () => {
  for (const entry of catalog) {
    const { results } = generateResults(entry.name, 42);
    assert.ok(results.length >= 7, entry.name);
    for (const site of Object.keys(sites)) assert.ok(results.some(result => result.site === site), `${entry.name}: ${site}`);
    for (const result of results) {
      assert.ok(sites[result.site]);
      assert.ok(result.title && result.description);
      assert.ok(Number.isFinite(result.price));
      assert.ok(existsSync(new URL(`../assets/${result.asset}.svg`, import.meta.url)), result.asset);
      assert.doesNotMatch(result.title + result.description, /undefined|\[object Object\]|NaN/);
    }
  }
});

test('Alle deutschen Katalognamen werden ihrer Kategorie zugeordnet', () => {
  for (const entry of catalog) assert.equal(resolveQuery(entry.name).category, entry.category, entry.name);
});

test('Unbekannte Eingaben, Satzzeichen und HTML werden als Daten behandelt', () => {
  for (const query of ['Waschmaschine frisst meine Socken', 'qzx-9843', 'こんにちは', '<img src=x onerror=alert(1)>', '🦕']) {
    const model = generateResults(query, 19);
    assert.ok(model.results.length >= 7);
    assert.equal(model.topic.query, query);
  }
  assert.equal(normalize('ÄÖÜ ß!'), 'aou ss');
  assert.notEqual(resolveQuery('Diese Eieruhr tickt').name, 'Ei', 'keine Teilworttreffer');
  assert.equal(resolveQuery('Warum frisst mein Drucker meine Socken?').name, 'Drucker');
});

test('Die ikonischen Angebote und Preise stimmen in Liste und Produktdaten überein', () => {
  for (let seed = 0; seed < 20; seed++) {
    assert.equal(generateResults('Gaming-PC', seed).results.find(result => result.title === 'High-End Gaming-PC · 0,32 €').price, 0.32);
    assert.equal(generateResults('Büroklammern', seed).results.find(result => result.title === 'Büroklammer · normale Büroklammer').price, 6499);
    for (const result of generateResults('nicht katalogisiert', seed).results) {
      if (result.description.startsWith('0,32 €')) assert.equal(result.price, 0.32);
    }
  }
});

test('Zurück und geteilte URLs sind stabil, neue Suchen und Seiten variieren', () => {
  assert.deepEqual(generateResults('Gurken', 42), generateResults('Gurken', 42));
  const signatures = new Set(Array.from({ length: 40 }, (_, seed) => generateResults('Gurken', seed).results.map(result => result.title).join('|')));
  assert.ok(signatures.size > 35);
  assert.notDeepEqual(generateResults('Gurken', 42, 1), generateResults('Gurken', 42, 2));
  assert.notDeepEqual(generateResults('Gurken', 42).results.map(result => result.site), generateResults('Reis', 173).results.map(result => result.site));
});

test('SFW-Suchanfragen behalten ausschließlich harmlose Inhalte', () => {
  for (const query of ['pornos', 'porn', 'hentai', 'nudes', 'xxx']) {
    const model = generateResults(query, 17);
    assert.equal(model.topic.category, 'sfw');
    assert.ok(model.results.every(result => result.asset !== 'portrait'));
    assert.doesNotMatch(model.results.map(result => result.title).join(' '), /porn|hentai|nackt|nudes|xxx/i);
  }
});

test('ChatGPP delegiert Mathematik zurück und verarbeitet auch unbekannte Fragen', () => {
  assert.match(chatReply('Was ist 2 plus 2?'), /Taschenrechner/);
  assert.match(chatReply('2+2'), /Taschenrechner/);
  assert.match(chatReply('Wie ist das Wetter?'), /Fenster/);
  assert.match(chatReply('Schreib JavaScript'), /Code/);
  assert.equal(typeof chatReply('unbekannter Quatsch'), 'string');
  assert.ok(chatReply('unbekannter Quatsch').length > 0);
});

test('Autocomplete unterstützt englische Begriffe und freie Eingaben', () => {
  assert.ok(suggestions('cucu').includes('gurke'));
  assert.ok(suggestions('erdb').includes('erdbeere'));
  assert.ok(suggestions('erfundene Eingabe').includes('erfundene Eingabe'));
  assert.deepEqual(suggestions(''), []);
});

test('Der amtliche Stadtkatalog deckt die Schwelle und alle 16 Länder ab', () => {
  assert.equal(citySource.referenceDate, '2025-12-31');
  assert.equal(cities.length, 396);
  assert.equal(new Set(cities.map(city => city.ags)).size, cities.length);
  assert.equal(new Set(cities.map(city => city.state)).size, 16);
  for (const city of cities) {
    assert.ok(city.population > 30000, city.name);
    assert.match(city.ags, /^\d{8}$/);
    assert.match(city.postalCode, /^\d{5}$/);
    assert.equal(resolveQuery(city.name).category, 'city', city.name);
  }
  assert.equal(resolveQuery('Seevetal').category, 'unknown', 'Gemeinde ohne Stadtrecht wird nicht als Stadt etikettiert');
  assert.equal(resolveQuery('Muenchen').name, 'München');
  assert.equal(resolveQuery('Cologne').name, 'Köln');
  assert.equal(resolveQuery('Frankfurt').name, 'Frankfurt am Main');
  assert.equal(resolveQuery('Frankfurt Oder').name, 'Frankfurt (Oder)');
  assert.equal(resolveQuery('Bad Homburg').category, 'city');
  assert.equal(resolveQuery('Radolfzell').category, 'city');
  assert.equal(resolveQuery('Neumarkt in der Oberpfalz').name, 'Neumarkt i.d.OPf.');
});

test('Typische Suchen erkennen Absicht und Ort, ohne Essen mit der Stadt zu verwechseln', () => {
  for (const topic of commonTopics) assert.equal(resolveQuery(topic.name).category, 'everyday', topic.name);
  assert.equal(resolveQuery('Wetter in München').group, 'weather');
  assert.equal(resolveQuery('Wetter in München').place, 'München');
  assert.equal(resolveQuery('hotel Berlin').group, 'hotel');
  assert.equal(resolveQuery('hotel Berlin').place, 'Berlin');
  assert.equal(resolveQuery('Mango in Hamburg kaufen').name, 'Mango');
  assert.equal(resolveQuery('Mango in Hamburg kaufen').place, 'Hamburg');
  assert.equal(resolveQuery('Essen').category, 'city');
  assert.equal(resolveQuery('Was soll ich essen').group, 'recipe');
  assert.equal(resolveQuery('Essen kaufen').category, 'food');
});

test('Neue Suchen meiden die Vorlagen vorheriger Suchen, Seeds bleiben reproduzierbar', () => {
  const history = [];
  for (const query of ['Mango', 'Gurken', 'Reis', 'Banane', 'Brot', 'Nüsse', 'Berlin', 'Hamburg', 'Wetter München', 'Drucker offline', 'Wohnung', 'Paketverfolgung']) {
    const seed = chooseSearchSeed(query, history, 42);
    const model = generateResults(query, seed);
    const last = history.at(-1)?.families || [];
    assert.ok(model.results.filter(result => last.includes(result.family)).length <= 1, query);
    assert.equal(new Set(model.results.map(result => result.site + ':' + result.title)).size, model.results.length);
    assert.deepEqual(model, generateResults(query, seed), 'Historie verändert keine gespeicherten Links');
    assert.ok(model.results.every(result => !result.title.startsWith('Dortmund plant Kreisverkehr wegen')));
    history.push({ families: model.results.map(result => result.family) });
  }
});

test('Vorlagenerkennung verwechselt Reis in Preis und Ei in anderen Wörtern nicht', () => {
  const families = ['Mango', 'Reis', 'Ei'].map(query => {
    for (let seed = 0; seed < 200; seed++) {
      const result = generateResults(query, seed).results.find(result => result.title.startsWith('Preisvergleich findet'));
      if (result) return result.family;
    }
    assert.fail(`Preisvergleich-Vorlage für ${query} fehlt`);
  });
  assert.equal(new Set(families).size, 1);
});

test('ChatGPP führt den Taschenrechner-Dialog über Bestätigung, Ergebnis und Rückfrage fort', () => {
  let response = advanceChat('Was ist 2 plus 2?', createChatState());
  assert.match(response.reply, /Taschenrechner öffnen/);
  response = advanceChat('Hab ich', response.state);
  assert.match(response.reply, /2 \+ 2/);
  assert.match(response.reply, /Plus-Taste/);
  assert.match(response.reply, /Gleich-Taste/);
  assert.equal(response.state.stage, 'read-result');
  response = advanceChat('Warum muss ich das selber machen?', response.state);
  assert.match(response.reply, /2 \+ 2/);
  response = advanceChat('Da steht 4', response.state);
  assert.match(response.reply, /meine Antwort: 4/);
  response = advanceChat('Worum ging es nochmal?', response.state);
  assert.match(response.reply, /2 \+ 2/);
});

test('ChatGPP merkt sich auch andere Zahlen, Ablehnung und neue Themen', () => {
  let response = advanceChat('Was ist 13 mal 7?');
  const original = structuredClone(response.state);
  response = advanceChat('Nein, habe keinen', response.state);
  assert.equal(response.state.stage, 'open');
  assert.deepEqual(original.task, response.state.task);
  response = advanceChat('Ist jetzt offen', response.state);
  assert.match(response.reply, /13 × 7/);
  assert.match(response.reply, /Taste „1“.*Taste „3“/);
  assert.match(response.reply, /Mal-Taste/);
  const separate = advanceChat('Hab ich', createChatState());
  assert.doesNotMatch(separate.reply, /13|Taschenrechner/);
  response = advanceChat('Wie ist das Wetter?', response.state);
  assert.equal(response.state.thread, 'weather');
  response = advanceChat('Ja', response.state);
  assert.match(response.reply, /Vorhang/);
  response = advanceChat('Es regnet', response.state);
  assert.match(response.reply, /Es regnet/);
  assert.match(response.reply, /du am Fenster/);
});

test('Rezept- und Programmierdialoge halten mehr als zwei Folgefragen aus', () => {
  let response = advanceChat('Schreib mir ein Rezept');
  response = advanceChat('Hab ich', response.state);
  assert.match(response.reply, /Zutaten/);
  response = advanceChat('Eier, Milch und Mehl', response.state);
  assert.match(response.reply, /Eier, Milch und Mehl/);
  response = advanceChat('Hab ein Rezept gefunden', response.state);
  assert.match(response.reply, /genau das Rezept/);
  response = advanceChat('Hilf beim Programmieren');
  response = advanceChat('Hab ich geschrieben', response.state);
  assert.match(response.reply, /Speichere die Datei/);
  response = advanceChat('ReferenceError', response.state);
  assert.match(response.reply, /ReferenceError/);
  assert.equal(response.state.thread, 'code');
});

test('YouTuba hat verschiedene passende Szenen statt desselben Standbilds', () => {
  const observed = new Set();
  for (let seed = 0; seed < 12; seed++) {
    for (const query of ['Wetter', 'Drucker', 'Berlin', 'Mango', 'Taschenrechner', 'Windows Update', 'BMW M3']) {
      for (const result of generateResults(query, seed).results.filter(result => result.site === 'youtuba')) {
        observed.add(sceneFor(result));
        assert.ok(sceneLabel(result));
      }
    }
  }
  assert.ok(observed.size >= 8, [...observed].join(','));
});
