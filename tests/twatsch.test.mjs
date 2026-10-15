import test from 'node:test';
import assert from 'node:assert/strict';
import { createStream, advanceStream, postViewerMessage, interpretMessage, currentGoal, screenState, loadStream, STREAM_KEY, votePoll, redeemReward } from '../twatsch-engine.js';

test('Ein Tipp verändert sichtbare Hardware und die Korrektur behält den Gesprächsbezug', () => {
  const s = createStream(0, 7);
  assert.equal(postViewerMessage(s, 'Dreh den Stecker um', 'Lina', 0).intent.kind, 'rotate');
  assert.equal(s.pc.inverted, false, 'Reaktion wird nicht sofort vorgetäuscht');
  advanceStream(s, 6000);
  assert.equal(s.pc.inverted, true);
  assert.equal(s.pc.cable, 'usb');
  assert.equal(postViewerMessage(s, 'Nein, den Stecker!', 'Lina', 7000).intent.kind, 'correct');
  advanceStream(s, 14000);
  assert.equal(s.pc.cable, 'gpu');
  assert.equal(s.pc.inverted, true, 'Kabelkorrektur macht eine andere Folge nicht heimlich rückgängig');
  postViewerMessage(s, 'Den Monitor wieder richtig rum stellen', 'Lina', 15000);
  advanceStream(s, 22000); assert.equal(s.pc.inverted, false);
  advanceStream(s, 170000);
  assert.ok(s.messages.some(row => row.spoken && row.text.includes('Lina') && row.text.includes('Monitor')));
});

test('Negationen und ausdrückliche Anschlüsse werden auseinandergehalten', () => {
  const s = createStream(0, 11);
  assert.deepEqual(interpretMessage('Keine Zahnpasta!', s), { kind: 'avoid', target: 'toothpaste' });
  assert.deepEqual(interpretMessage('Nicht den Monitor drehen', s), { kind: 'avoid', target: 'rotate' });
  assert.deepEqual(interpretMessage('HDMI nicht ins Mainboard, sondern in die Grafikkarte', s), { kind: 'cable' });
  assert.deepEqual(interpretMessage('Ich sehe kein Bild', s), { kind: 'measure' });
  assert.deepEqual(interpretMessage('Turn the cable around', s), { kind: 'rotate' });
  postViewerMessage(s, 'Keine Zahnpasta', 'Nele', 0); advanceStream(s, 6000);
  advanceStream(s, 1200000);
  assert.ok(!s.messages.some(row => row.spoken && row.text.includes('Zahnpasta drauf')));
});

test('Unbekannte Nachrichten werden als Daten behandelt und nicht als angeblich verstandene Befehle', () => {
  const s = createStream(0, 28);
  const before = structuredClone(s.pc);
  const response = postViewerMessage(s, '<img src=x onerror=alert(1)> Pflaumenmus auf dem Mond', '<b>Mond</b>', 0);
  assert.equal(response.intent, null); assert.equal(response.accepted, true);
  assert.deepEqual(s.pc, before);
  assert.ok(s.messages.some(row => row.role === 'viewer' && row.text.includes('<img')));
  assert.ok(!s.messages.some(row => row.spoken && row.text.includes('Pflaumenmus')));
});

test('Ein richtiger Anschluss erzeugt ohne Strom und eingerasteten RAM keine erfundene Bildmeldung', () => {
  const s = createStream(0, 23);
  postViewerMessage(s, 'HDMI an die Grafikkarte', 'Nele', 0); advanceStream(s, 9000);
  assert.equal(s.pc.cable, 'gpu'); assert.equal(screenState(s), 'signal');
  assert.ok(!s.messages.some(row => /BILD Pog|Signal vorhanden|Bild!/.test(row.text)));
});

test('Ein Kanal bewältigt ohne Eingriffe mehrere Phasen und erreicht einen funktionierenden PC', () => {
  const endings = new Set();
  for (const seed of [1, 7, 31, 99, 9182, 31847]) {
    const s = createStream(0, seed); advanceStream(s, 35 * 60 * 1000);
    assert.equal(currentGoal(s), 'stable', `Seed ${seed}`);
    assert.ok(s.pc.os && s.pc.driver && s.pc.ram && s.pc.drive && s.pc.lid);
    assert.equal(s.pc.paste, 'pea'); assert.equal(s.pc.film, false);
    assert.ok(s.stableAt > 6 * 60000, 'Langfristiger Ablauf statt Drei-Sekunden-Clip');
    assert.ok(s.milestones.some(row => row.startsWith('install:')));
    assert.ok(s.milestones.some(row => row.startsWith('benchmark:')));
    assert.ok(s.messages.length <= 140); assert.ok(s.queue.length < 50);
    endings.add(s.stableAt);
  }
  assert.ok(endings.size > 3, 'Abläufe unterscheiden sich durch Entscheidungen und Ereigniszeiten');
});

test('Temperaturabschaltungen haben Folgen und korrekte Kühlung wirkt unabhängig von Antworten', () => {
  const s = createStream(0, 31); s.pc.power = true; s.pc.ram = true; s.pc.cable = 'gpu';
  s.autoAt = 1e9; s.nextPollAt = 1e9; advanceStream(s, 51000);
  assert.equal(s.pc.power, false); assert.equal(s.protections, 1);
  const hot = s.temperature;
  advanceStream(s, 65000); assert.ok(s.temperature < hot);
  s.pc.film = false; s.pc.paste = 'pea'; s.pc.power = true;
  s.autoAt = 1e9;
  advanceStream(s, 200000); assert.equal(s.pc.power, true); assert.ok(s.temperature < 45);
});

test('Ein gezogener Installationsstick unterbricht die Installation, Neustart verliert Fortschritt', () => {
  const s = createStream(0, 22); Object.assign(s.pc, { power: true, cable: 'gpu', ram: true, film: false, paste: 'pea', drive: true, usb: true });
  s.installStarted = true; s.autoAt = 1e9; s.nextPollAt = 1e9;
  advanceStream(s, 30000); const progress = s.install;
  postViewerMessage(s, 'Zieh den USB-Stick raus', 'Tom', 30000); advanceStream(s, 37000);
  assert.equal(s.pc.usb, false); const stopped = s.install;
  advanceStream(s, 45000); assert.equal(s.install, stopped); assert.ok(stopped > progress);
  assert.equal(screenState(s), 'boot');
  postViewerMessage(s, 'Neustart', 'Tom', 46000); advanceStream(s, 53000);
  assert.ok(s.install < stopped); assert.equal(s.pc.os, false);
});

test('Abstimmungen zählen eine Stimme und ihr Ergebnis führt einen Handgriff aus', () => {
  const s = createStream(0, 7); advanceStream(s, 36000);
  assert.ok(s.poll && !s.poll.finished);
  const option = s.poll.options.findIndex(row => row.action === 'rotate'); assert.ok(option >= 0);
  s.poll.options.forEach(row => { row.votes = 0; });
  assert.equal(votePoll(s, option, 36000), true);
  assert.equal(votePoll(s, option, 36000), false);
  s.poll.options[option].votes = 100;
  advanceStream(s, 87000); assert.ok(s.poll.finished); assert.equal(s.pc.inverted, true);
});

test('Punkte werden über echte verstrichene Sichtzeit gezählt, nicht pro Animationsframe', () => {
  const s = createStream(0, 8);
  for (let now = 16; now <= 60000; now += 16) advanceStream(s, now, true);
  assert.equal(s.points, 1260);
  advanceStream(s, 660000, false); assert.equal(s.points, 1260, 'Keine Punkte für zehn Minuten Abwesenheit');
  const reward = redeemReward(s, 'hands', 'Lina', 660000);
  assert.equal(reward.ok, true); assert.equal(s.points, 1110); assert.equal(s.cameraUntil, 690000);
  assert.equal(redeemReward(s, 'hands', 'Lina', 660000).ok, false);
  s.points = 0; assert.equal(redeemReward(s, 'coffee', 'Lina', 661000).ok, false);
});

test('Wiederaufnahme behält Folgen und verspätete Reaktionen über Reload und Kanalwechsel', () => {
  const s = createStream(0, 123); postViewerMessage(s, 'Dreh den Stecker um', 'KabelKatja', 0); advanceStream(s, 6000);
  const storage = { getItem: key => key === STREAM_KEY ? JSON.stringify(s) : null };
  const restored = loadStream(storage, 120000, 999);
  assert.equal(restored.seed, 123); assert.equal(restored.pc.inverted, true);
  assert.ok(restored.memory.some(row => row.by === 'KabelKatja' && row.kind === 'rotate'));
  advanceStream(restored, 200000);
  assert.ok(restored.messages.some(row => row.spoken && row.text.includes('KabelKatja')));
  const away = loadStream({ getItem: () => JSON.stringify(restored) }, 7 * 24 * 3600 * 1000);
  assert.equal(away.pc.inverted, true); assert.equal(away.pc.os, true); assert.ok(away.messages.length <= 140);
  assert.equal(loadStream({ getItem() { throw Error('Speicher gesperrt'); } }, 10, 1).seed, 1);
});

test('Spam vervielfacht keine gleichen Aktionen und normale Folgenachrichten funktionieren weiter', () => {
  const s = createStream(0, 1);
  postViewerMessage(s, 'Monitor umdrehen', 'Max', 0);
  postViewerMessage(s, 'Monitor umdrehen', 'Max', 0);
  assert.equal(s.queue.filter(row => row.action === 'rotate').length, 1);
  for (let i = 0; i < 4; i++) postViewerMessage(s, 'Hallo', 'Max', 0);
  assert.equal(postViewerMessage(s, 'Hallo', 'Max', 0).accepted, false);
  advanceStream(s, 11000);
  assert.equal(postViewerMessage(s, 'Jetzt den Monitor wieder richtig rum', 'Max', 11000).accepted, true);
});

test('Zufällige Wortteile werden nicht zu RAM-Tipps und ausgeschaltet bedeutet wirklich aus', () => {
  const s = createStream(0, 41);
  assert.equal(interpretMessage('Ich lerne programmieren', s), null);
  assert.equal(interpretMessage('Ich komme gerade von Instakram', s), null);
  s.pc.power = true;
  postViewerMessage(s, 'Switch the power off', 'Lina', 0); advanceStream(s, 6000);
  assert.equal(s.pc.power, false);
  assert.equal(interpretMessage('Nicht ausschalten', s).target, 'off');
  const broken = { getItem: () => JSON.stringify({ version: 1, pc: {}, queue: [], messages: [], lastTick: 1 }) };
  assert.equal(loadStream(broken, 1, 99).seed, 99);
});

test('Nebenunterhaltungen entfalten sich über Zeit und wiederholen ihre Themen nicht vorzeitig', () => {
  const s = createStream(0, 913); s.pc.inverted = true;
  let seen = 0;
  for (let now = 1000; now <= 18 * 60000; now += 1000) {
    advanceStream(s, now);
    if (s.threadsSeen) { assert.equal(new Set(s.threadsSeen).size, s.threadsSeen.length); seen = Math.max(seen, s.threadsSeen.length); }
  }
  assert.ok(seen >= 7);
  const comments = s.messages.filter(row => /mein Tablet jetzt auch gedreht|Fehlermeldung gerade von unten|Couch. Für mich|Euer Handy ist/.test(row.text));
  for (let i = 1; i < comments.length; i++) assert.ok(comments[i].at - comments[i - 1].at >= 180000);
});
