import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { initialWorld, createAccount, activeAccount, addMail, dueMail, nextUnwantedMail, joinService, recordPurchase, recordWatch, lastWatched, startCivic, remainingCivic, submitCivic, loadWorld, MAIL_INTERVAL, FORM_LIMIT, WORLD_KEY } from '../world-state.js';
import { products, videoCatalog, videoDetails, productReviews, videoComments, meals, series, extraSites } from '../world-content.js';

test('Fiktive Accounts verwenden ausschließlich die lokale .invalid-Adresse', () => {
  const state = initialWorld();
  const user = createAccount(state, 'Karton.Koenig', 'Kartoffel', 100);
  assert.equal(user.email, 'karton.koenig@gaehmail.invalid');
  assert.equal(activeAccount(state), user);
  assert.equal(user.nextMailAt, 100 + MAIL_INTERVAL);
  assert.throws(() => createAccount(state, 'karton.koenig', 'Jemand'));
  for (const input of ['x', 'real@example.com', '<script>', 'mit leerzeichen']) assert.throws(() => createAccount(state, input, 'Test'));
  assert.ok(joinService(state, 'buyazon'));
  assert.ok(joinService(state, 'youtuba'));
  joinService(state, 'buyazon');
  assert.equal(user.memberships.filter(site => site === 'buyazon').length, 1);
  state.activeId = null;
  assert.equal(addMail(state, 'Absender', 'Betreff', 'Text'), null);
  assert.equal(joinService(state, 'buyazon'), false);
});

test('Unnötige Mails kommen nach fünf Minuten und Rückkehr erzeugt keine Mail-Lawine', () => {
  const state = initialWorld(); const user = createAccount(state, 'posttest', 'Post', 0);
  assert.equal(dueMail(state, MAIL_INTERVAL - 1), null);
  assert.ok(dueMail(state, MAIL_INTERVAL));
  assert.equal(user.messages.length, 2);
  assert.equal(dueMail(state, MAIL_INTERVAL), null);
  assert.ok(dueMail(state, MAIL_INTERVAL * 100));
  assert.equal(user.messages.length, 3);
  assert.equal(user.nextMailAt, MAIL_INTERVAL * 101);
  const fresh = initialWorld(); createAccount(fresh, 'maildeck', 'Deck', 0);
  const subjects = new Set(); for (let i = 0; i < 24; i++) subjects.add(nextUnwantedMail(fresh, i).subject);
  assert.equal(subjects.size, 24);
});

test('Käufe und gestartete Videos gehören zum angemeldeten Konto', () => {
  const state = initialWorld(); const first = createAccount(state, 'konto1', 'Eins', 0);
  recordPurchase(state, products[0], 1);
  const clip = videoCatalog(21)[0]; recordWatch(state, clip);
  assert.equal(first.purchases[0].title, products[0].title);
  assert.equal(lastWatched(state).title, clip.title);
  const second = createAccount(state, 'konto2', 'Zwei', 0);
  assert.equal(second.purchases.length, 0);
  assert.equal(lastWatched(state), undefined);
  state.activeId = first.id;
  assert.equal(lastWatched(state).title, clip.title);
  assert.ok(first.messages.some(mail => mail.from === 'Buyazon'));
});

test('Bürgerbüro prüft die echte lokale Historie und behält seine Frist', () => {
  const state = initialWorld(); const user = createAccount(state, 'amtstest', 'Antrag', 0);
  recordPurchase(state, products[1], 1); const video = videoCatalog(7)[0]; recordWatch(state, video);
  const draft = startCivic(state, 'wohn', 1000);
  Object.assign(draft.fields, { age: '42', purchase: 'falsch', video: video.title, printer: 'Magenta fehlt', potato: 'USB-C', receipt: 'WEISS-NICHT', reason: 'Ich möchte eine Nebenwohnung im Browser.', agreement: true });
  assert.equal(remainingCivic(state, 1000), 600);
  assert.equal(remainingCivic(state, 1000 + FORM_LIMIT - 1000), 1);
  assert.throws(() => submitCivic(state, 2000), /Einkaufsabteilung/);
  draft.fields.purchase = products[1].title;
  draft.fields.email = 'andere@gaehmail.invalid';
  assert.throws(() => submitCivic(state, 2000), /Spaßkonto/);
  draft.fields.email = user.email;
  assert.match(submitCivic(state, 2000), /^BB-/);
  assert.equal(draft.status, 'submitted');
  assert.ok(user.messages[0].from === 'Bürgerbürokratie');
  assert.throws(() => submitCivic(state, 2000), /bereits/);
  startCivic(state, 'zeit', 3000);
  assert.throws(() => submitCivic(state, 3000 + FORM_LIMIT), /Frist abgelaufen/);
  assert.equal(state.civic.status, 'expired');
});

test('Lokale Daten können wiederhergestellt werden, auch mit unbrauchbarem Speicher', () => {
  const state = initialWorld(); createAccount(state, 'localtest', 'Lokal', 0); startCivic(state, 'wohn', 42);
  const storage = { getItem: key => key === WORLD_KEY ? JSON.stringify(state) : null };
  const restored = loadWorld(storage); assert.equal(activeAccount(restored).email, activeAccount(state).email); assert.equal(restored.civic.deadline, 42 + FORM_LIMIT);
  assert.deepEqual(loadWorld({ getItem() { throw Error('privat'); } }), initialWorld());
  assert.deepEqual(loadWorld({ getItem: () => '{kaputt' }), initialWorld());
});

test('YouTuba hat echte unterschiedliche Laufzeiten, Kanäle, Genres und seltene hilfreiche Clips', () => {
  const list = videoCatalog(71);
  assert.ok(new Set(list.map(row => row.durationSeconds)).size >= 5);
  assert.ok(new Set(list.map(row => row.channel)).size >= 10);
  assert.ok(new Set(list.map(row => row.genre)).size >= 12);
  for (const clip of list) assert.ok(existsSync(new URL(`../assets/${clip.clip}`, import.meta.url)));
  for (const clip of list) { const detail = videoDetails(clip, 71); assert.equal(detail.channel, clip.channel); assert.equal(detail.genre, clip.genre); assert.equal(detail.duration, clip.duration); }
  const gems = Array.from({ length: 1000 }, (_, seed) => videoCatalog(seed).some(row => row.genre === 'gem')).filter(Boolean).length;
  assert.ok(gems >= 10 && gems <= 35, `Gem-Häufigkeit: ${gems}/1000`);
  assert.deepEqual(videoCatalog(71), list);
  const commentSets = list.slice(0, 8).map(clip => videoComments(clip, 71).map(row => row.name).join(','));
  assert.equal(new Set(commentSets).size, 8);
});

test('Bewertungen, Essen und Serien sind unterschiedlich und verwenden vorhandene Bilder', () => {
  const reviews = products.map(product => productReviews(product, 71).map(row => row.name).join(','));
  assert.equal(new Set(reviews).size, products.length);
  assert.ok(meals.length >= 16); assert.ok(series.length >= 14); assert.equal(Object.keys(extraSites).length, 6);
  const mumbai = meals.find(meal => meal.title.includes('Mumbai'));
  assert.equal(mumbai.price, .8); assert.equal(mumbai.shipping, 223.5); assert.ok(mumbai.minutes > 500);
  for (const row of [...products, ...meals, ...series]) assert.ok(existsSync(new URL(`../assets/${row.asset}.svg`, import.meta.url)), row.asset);
});
