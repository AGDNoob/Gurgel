import test from 'node:test';
import assert from 'node:assert/strict';
import { generateResults } from '../engine.js';
import { buildSerp, INITIAL_QUESTIONS } from '../serp.js';

const queries = ['Banane', 'Pizza kaufen', 'München', 'Taylor Swift', 'VW Golf', 'Elektroauto', 'Wetter in Köln', 'Gaming-PC', 'Büroklammer', 'Passwort vergessen', 'xkcd qwertz blub'];

test('Gurgel-Übersicht, Anzeigen und Fragen sind vollständig und ohne offene Platzhalter', () => {
  for (const query of queries) {
    for (const seed of [1, 4711, 98765]) {
      const model = generateResults(query, seed);
      const serp = buildSerp(model, seed);
      assert.deepEqual(buildSerp(generateResults(query, seed), seed), serp, `${query} ist nicht deterministisch`);
      assert.doesNotMatch(JSON.stringify(serp), /\{\w+\}|undefined|NaN/, query);
      assert.ok(serp.overview.lead.length > 20);
      assert.equal(serp.overview.points.length, 3);
      assert.equal(new Set(serp.overview.points.map(point => point.site)).size, 3, 'Jede Quelle wird nur einmal zitiert');
      for (const point of serp.overview.points) assert.ok(model.results.some(result => result.id === point.id && result.site === point.site), 'Zitate verweisen auf echte Treffer');
      assert.equal(serp.ads.top.length, 2);
      assert.equal(serp.ads.bottom.length, 1);
      assert.equal(new Set([...serp.ads.top, ...serp.ads.bottom].map(ad => ad.title)).size, 3);
      for (const ad of [...serp.ads.top, ...serp.ads.bottom]) assert.match(ad.domain, /\.invalid$/, 'Werbetreibende haben keine echten Domains');
      assert.ok(serp.questions.length > INITIAL_QUESTIONS + 8, 'Fragen wachsen beim Aufklappen weiter');
      assert.equal(new Set(serp.questions.map(item => item.q)).size, serp.questions.length);
      assert.equal(serp.questions.at(-1).q, 'Gibt es ein Ende dieser Liste?');
    }
  }
});

test('Knowledge Panel passt zur Kategorie und erfindet nichts über echte Personen', () => {
  const city = buildSerp(generateResults('München', 7), 7).panel;
  assert.equal(city.kind, 'city');
  assert.ok(city.facts.some(([key, value]) => key === 'Einwohner' && value.startsWith('1.505.036')), 'Einwohnerzahl stammt aus dem Gemeindeverzeichnis');
  assert.ok(city.related.length === 4 && !city.related.includes('München'));

  const person = buildSerp(generateResults('Taylor Swift', 7), 7);
  assert.equal(person.panel.kind, 'person');
  assert.ok(person.panel.claim);
  assert.match(person.panel.note, /Parodie/);
  assert.ok(!person.panel.related.includes('Taylor Swift'));
  assert.ok(!person.questions.some(item => /einfrieren|zurückgeben|gesund/.test(item.q)), 'Personen bekommen keine Produktfragen');

  assert.equal(buildSerp(generateResults('Brokkoli', 7), 7).panel.subtitle, 'Gemüse');
  assert.ok(buildSerp(generateResults('Brokkoli', 7), 7).panel.nutrition.length);
  assert.equal(buildSerp(generateResults('Wetter', 7), 7).panel, null);
  assert.equal(buildSerp(generateResults('xkcd qwertz blub', 7), 7).panel, null);
});

test('Gefilterte Suchanfragen bekommen keine Zusatzbausteine', () => {
  assert.equal(buildSerp(generateResults('porno', 3), 3), null);
});
