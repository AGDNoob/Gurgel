import { CHANNEL, CHATTERS, LINES, AMBIENT, EVENT_CHAT, SIDE_THREADS, GOAL_NAMES, REWARDS } from './twatsch-content.js';
export const STREAM_KEY = 'gurgel-twatsch-v1';
export const STREAM_VERSION = 1;
const clean = value => String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9äöü+?! ]/g, ' ').replace(/\s+/g, ' ').trim();
function random(state) { state.random = (Math.imul(state.random, 1664525) + 1013904223) >>> 0; return state.random / 4294967296; }
function between(state, min, max) { return min + random(state) * (max - min); }
function choose(state, rows, key) {
  const used = new Set(state.used.filter(row => row.key === key).map(row => row.index));
  let available = rows.map((_, i) => i).filter(i => !used.has(i));
  if (!available.length) { state.used = state.used.filter(row => row.key !== key); available = rows.map((_, i) => i); }
  const index = available[Math.floor(random(state) * available.length)];
  state.used.push({ key, index }); state.used = state.used.slice(-90); return rows[index];
}
export function emitMessage(state, name, text, role = '', color = '#bfa2ff', extra = {}) {
  const message = { id: ++state.sequence, at: state.now, name, text, role, color, ...extra };
  state.messages.push(message); state.messages = state.messages.slice(-140); return message;
}
function npc(state, index, text) { const actor = CHATTERS[index % CHATTERS.length]; return emitMessage(state, actor.name, text, actor.role, actor.color); }
function say(state, key, explicit) {
  const text = explicit || choose(state, LINES[key], `finn:${key}`);
  state.caption = { text, at: state.now, until: state.now + Math.min(10000, Math.max(5000, text.length * 62)) };
  emitMessage(state, CHANNEL.name, text, 'streamer', '#cdaaff', { spoken: true });
}
function effect(state, kind) { state.sound = { id: ++state.soundSequence, kind, at: state.now }; }
function queue(state, kind, delay, data = {}) { state.queue.push({ kind, at: state.now + delay, ...data }); state.queue.sort((a, b) => a.at - b.at); }
function burst(state, key) {
  const rows = EVENT_CHAT[key]; if (!rows) return;
  rows.forEach(([actor, text], i) => queue(state, 'chat', between(state, 900, 2100) + i * between(state, 450, 1200), { actor, text }));
}

export function currentGoal(state) {
  const pc = state.pc;
  if (!pc.power) return 'power';
  if (pc.cable !== 'gpu') return 'cable';
  if (!pc.ram) return 'ram';
  if (pc.film) return 'film';
  if (pc.paste !== 'pea') return 'paste';
  if (!pc.drive) return 'drive';
  if (!pc.os && !pc.usb) return 'usb';
  if (!pc.os) return 'install';
  if (!pc.driver) return 'drivers';
  if (state.benchmark < 60) return 'benchmark';
  if (!pc.tidy || !pc.lid) return 'tidy';
  return 'stable';
}
export function screenState(state) {
  const pc = state.pc;
  if (!pc.power || pc.cable !== 'gpu') return 'signal';
  if (!pc.ram) return 'ram';
  if (state.driverUntil && state.now < state.driverUntil) return 'driver';
  if (!pc.drive) return 'bios';
  if (!pc.os) return pc.usb ? 'install' : 'boot';
  return state.benchmarkRunning ? 'game' : 'desktop';
}
export function streamTitle(state) { return `20-Cent-PC: ${GOAL_NAMES[currentGoal(state)]}`; }

export function createStream(now = Date.now(), seed = 31847) {
  const state = {
    version: STREAM_VERSION, random: seed >>> 0, seed: seed >>> 0, now, lastTick: now,
    startedAt: now - (17 * 60 + seed % 117) * 1000, watchAt: now, sequence: 0, soundSequence: 0, messages: [], queue: [], used: [],
    pc: { power: false, cable: 'usb', inverted: false, ram: false, film: true, paste: 'none', drive: false, usb: false, os: false, driver: false, boost: false, tidy: false, lid: false },
    temperature: 24, fps: 0, bootCount: 0, protections: 0, install: 0, checkpoint: 0, holdUntil: 0,
    driverUntil: 0, driverStarted: false, benchmark: 0, benchmarkRunning: false, stableAt: 0, celebration: false,
    autoAt: now + 14000, ambientAt: now + 5500, threadAt: now + 85000, raidAt: now + 230000 + seed % 180000,
    pauseUntil: 0, coffeeUntil: 0, cameraUntil: 0, lastGoal: 'power', goalSince: now,
    memory: [], lastIntent: null, lastHandled: null, pending: [], avoid: [], userTimes: [], silenceUntil: 0,
    attempts: {}, milestones: [], poll: null, pollHistory: [], nextPollAt: now + 35000,
    points: 1200, pointMilliseconds: 0, followed: false, rewards: [], followedAt: 0,
    caption: null, animation: null, sound: null, guest: `Gast_${100 + seed % 900}`, preferences: { volume: .35, quality: 720, captions: true, timestamps: false }
  };
  npc(state, 2, 'Willkommen bei FinnBaut. Tipps gern konkret. Finn interpretiert sonst die Möbel.');
  npc(state, 3, 'Der PC hat wirklich 20 Cent gekostet. Die Rechnung liegt links.');
  npc(state, 1, 'RAM noch nicht eingerastet und HDMI in USB. Ich hole mir einen Stuhl.');
  say(state, null, 'Das Kabel steckt fast drin. Ich schaue gleich noch nach dem Strom. Immer nur eine Baustelle gleichzeitig.');
  return state;
}
export function loadStream(storage, now = Date.now(), seed = 31847) {
  try {
    const saved = JSON.parse((storage ?? globalThis.localStorage)?.getItem(STREAM_KEY));
    if (saved?.version === STREAM_VERSION && typeof saved.pc?.power === 'boolean' && saved.preferences && Array.isArray(saved.memory) && Array.isArray(saved.used) && Array.isArray(saved.pending) && Array.isArray(saved.queue) && Array.isArray(saved.messages) && Number.isFinite(saved.lastTick)) {
      return advanceStream(saved, now);
    }
  } catch { /* Storage can be unavailable; this stream also works for guests. */ }
  return createStream(now, seed);
}

export function interpretMessage(text, state) {
  const value = clean(text); const negative = /\b(nicht|kein|keine|keinen|niemals|don t|do not|never)\b/.test(value);
  const correction = /\b(nein|falsch|meinte|gemeint|no|meant)\b/.test(value);
  if (/nicht.*(?:mainboard|usb).*(?:grafik|gpu)/.test(value)) return { kind: 'cable' };
  if (correction && /stecker|kabel|hdmi|cable|plug/.test(value) && ['rotate', 'upright'].includes(state.lastHandled?.kind || state.lastIntent?.kind)) return { kind: 'correct' };
  let kind;
  if (/richtig\s*rum|zuruckdrehen|wieder.*(?:normal|gerade)|(?:monitor|bildschirm).*(?:zuruck|gerade|richtig)|upright/.test(value)) kind = 'upright';
  else if (/(?:dreh|rotat|turn).*(?:stecker|kabel|monitor|bildschirm|plug|cable)|(?:stecker|kabel|monitor|bildschirm).*(?:umdrehen|drehen)/.test(value)) kind = 'rotate';
  else if (/zahnpasta|toothpaste/.test(value)) kind = 'toothpaste';
  else if (/sauber|abwischen|wegwischen|paste.*(?:runter|entfern)|wipe|clean/.test(value)) kind = 'wipe';
  else if (/folie|schutzfilm|peel|plastic film/.test(value)) kind = 'film';
  else if (/warmeleit|thermal|paste/.test(value)) kind = 'paste';
  else if (/\bram\b|arbeitsspeicher|\briegel\b|\bmemory\b/.test(value)) kind = 'ram';
  else if (/(?:usb|stick).*(?:raus|zieh|entfern|out|remove)|(?:zieh|entfern).*(?:usb|stick)/.test(value)) kind = 'unplug';
  else if (/installationsstick|usb|boot.?stick|stick.*rein/.test(value)) kind = 'usb';
  else if (/ssd|festplatte|datentrager|storage|drive/.test(value)) kind = 'drive';
  else if (/treiber|driver/.test(value)) kind = 'drivers';
  else if (/kabelbinder|kabelmanagement|kabel.*(?:ordnen|aufraumen|sauber|verstauen)|cable.*tidy/.test(value)) kind = 'tidy';
  else if (/deckel|gehause.*zu|close.*case/.test(value)) kind = 'lid';
  else if (/grafikkarte|hdmi|\bgpu\b|anschluss|stecker|displayport|\bcable\b|\bplug\b/.test(value)) kind = 'cable';
  else if (/turbo.*aus|standardtakt|normal.*takt|underclock/.test(value)) kind = 'normal';
  else if (/turbo|ubertakt|mehr fps|overclock/.test(value)) kind = 'boost';
  else if (/crysis|benchmark|spiel.*start|start.*spiel|game/.test(value)) kind = 'benchmark';
  else if (/neustart|reset|restart|reboot/.test(value)) kind = 'reset';
  else if (/ausschalten|abschalten|turn.*off|switch.*off|power off/.test(value)) kind = 'off';
  else if (/netzteil|strom|einschalten|schalter|\bpower\b|switch on/.test(value)) kind = 'power';
  else if (/installier|windows|betriebssystem|install/.test(value)) kind = 'install';
  else if (/wart|geduld|lass.*(?:laufen|finger)|wait|patience/.test(value)) kind = 'waiting';
  else if (/kaffee|pause|coffee|break/.test(value)) kind = 'coffee';
  else if (/temperatur|heiss|warm|miss|messen|kein bild|was.*(?:kaputt|problem|fehlt)|warum.*(?:schwarz|bild)|temperature|what.*wrong/.test(value)) kind = 'measure';
  else if (/mach (?:das|es)|genau das|ja genau|do it/.test(value) && state.lastIntent) kind = state.lastIntent.kind;
  if (!kind) return null;
  if (negative && !/kein bild|was.*fehlt|turbo.*aus/.test(value)) return { kind: 'avoid', target: kind };
  return { kind };
}

export function postViewerMessage(state, rawText, rawName = state.guest, now = Date.now()) {
  advanceStream(state, now);
  const text = String(rawText).trim().slice(0, 240); const name = String(rawName || state.guest).trim().slice(0, 30) || state.guest;
  if (!text) return { accepted: false, reason: 'Die Nachricht ist noch leer.' };
  if (state.now < state.silenceUntil) return { accepted: false, reason: 'Kurz langsam. Die Kabel brauchen zwei Sekunden Vorsprung.' };
  state.userTimes = state.userTimes.filter(time => state.now - time < 10000);
  if (state.userTimes.length >= 5) {
    state.silenceUntil = state.now + 7000; npc(state, 2, 'Kurz Slowmode. Finn kann immer nur ein Kabel gleichzeitig falsch verstehen.');
    return { accepted: false, reason: 'Slowmode: sieben Sekunden Pause.' };
  }
  emitMessage(state, name, text, 'viewer', '#c8b5ff'); state.userTimes.push(state.now);
  const intent = interpretMessage(text, state);
  if (intent) {
    if (state.pending.some(row => row.kind === intent.kind && state.now - row.at < 7000)) return { accepted: true, intent, queued: false };
    state.lastIntent = { ...intent, by: name, at: state.now };
    if (intent.kind !== 'avoid') state.avoid = state.avoid.filter(kind => kind !== intent.kind);
    state.pending.push({ kind: intent.kind, at: state.now }); state.pending = state.pending.slice(-12);
    queue(state, 'action', between(state, 2400, 5200), { action: intent.kind, target: intent.target, by: name });
    state.autoAt = Math.max(state.autoAt, state.now + 26000);
    return { accepted: true, intent, queued: true };
  }
  // A streamer can miss a message. Unknown prose is never echoed as pretend understanding.
  return { accepted: true, intent: null, queued: false };
}

function remember(state, kind, by) {
  if (!by || by === 'Abstimmung') return;
  const memory = { kind, by, at: state.now, id: ++state.sequence };
  state.memory.push(memory); state.memory = state.memory.slice(-18);
  if (['rotate', 'correct', 'upright', 'ram', 'film', 'paste', 'toothpaste', 'reset', 'unplug', 'cable'].includes(kind)) {
    queue(state, 'callback', between(state, 65000, 145000), { memory });
  }
}
function measure(state) {
  const goal = currentGoal(state); const temp = Math.round(state.temperature);
  const findings = {
    power: 'Der Schalter am Netzteil ist aus.', cable: `HDMI steckt ${state.pc.cable === 'usb' ? 'im USB-Anschluss' : 'am Mainboard'}. Die Grafikkarte ist weiter unten.`,
    ram: 'Der rechte RAM-Clip ist noch offen.', film: 'Am Kühler hängt noch die Schutzfolie.',
    paste: state.pc.paste === 'toothpaste' ? 'Auf dem Prozessor ist Zahnpasta. Auf der Tube ist sogar ein Zahn.' : 'Zwischen Kühler und Prozessor fehlt die Wärmeleitpaste.',
    drive: 'Im BIOS steht kein Datenträger. Die SSD liegt noch auf dem Tisch.', usb: 'Der Installationsstick ist nicht angeschlossen.',
    install: `Die Installation steht bei ${Math.floor(state.install)} Prozent. ${state.now < state.holdUntil ? 'Der Balken ist gerade beschäftigt, stillzustehen.' : 'Dateien werden tatsächlich weiterkopiert.'}`,
    drivers: 'Der Grafiktreiber fehlt noch. Den gibt es nicht im Karton.', benchmark: 'Jetzt fehlt nur noch der Spieletest.',
    tidy: 'Das dicke Kabel liegt genau da, wo der Deckel hinwill.', stable: `Der Rechner läuft. ${Math.round(state.fps)} Bilder pro Sekunde im Test.`
  };
  say(state, null, `${temp} Grad. ${findings[goal]}`);
  npc(state, 5, `${temp} °C. Habe ich mitgelesen. ${temp > 85 ? 'Das ist keine Raumtemperatur.' : 'Messung ist fürs Protokoll gespeichert.'}`);
}
function applyAction(state, kind, by, target) {
  const pc = state.pc; const goal = currentGoal(state);
  state.lastHandled = { kind, by, at: state.now };
  state.animation = { kind, at: state.now, until: state.now + 2800, fromCable: pc.cable, fromInverted: pc.inverted };
  if (kind === 'avoid') {
    if (!state.avoid.includes(target)) state.avoid.push(target);
    state.queue = state.queue.filter(event => event.kind !== 'action' || event.action !== target);
    state.pending = state.pending.filter(row => row.kind !== target);
    if (target === 'rotate' && !pc.inverted) say(state, null, 'Okay. Der Monitor bleibt stehen. Ich merke mir das vor dem Anfassen.');
    else if (target === 'toothpaste') say(state, null, 'Keine Zahnpasta. Ich lege die Tube hinter mich, damit ich nicht wieder drankomme.');
    else say(state, null, 'Gelesen. Diesen Handgriff lasse ich erst mal aus.');
    remember(state, 'avoid', by); return;
  }
  if (kind === 'measure') { measure(state); return; }
  if (kind === 'power') { pc.power = true; state.bootCount++; say(state, 'power'); effect(state, 'power'); }
  else if (kind === 'off') { pc.power = false; state.benchmarkRunning = false; say(state, null, 'Ausgeschaltet. Dieses Schwarz war jetzt Absicht. Der Lüfter darf kurz durchatmen.'); effect(state, 'off'); }
  else if (kind === 'rotate') { pc.inverted = !pc.inverted; say(state, 'rotate'); burst(state, 'rotate'); effect(state, 'move'); }
  else if (kind === 'upright') { pc.inverted = false; say(state, 'upright'); effect(state, 'move'); }
  else if (kind === 'cableWrong') { pc.cable = 'motherboard'; say(state, 'cableWrong'); effect(state, 'plug'); }
  else if (kind === 'cable' || kind === 'correct') {
    pc.cable = 'gpu';
    if (kind === 'correct') say(state, kind);
    else if (!pc.power) say(state, null, 'Das Kabel steckt an der Grafikkarte. Der PC braucht jetzt noch Strom. Wir machen das hier offenbar einzeln.');
    else if (!pc.ram) say(state, null, 'Der Anschluss stimmt jetzt. Das Bild wartet noch auf den RAM. Das orange Lämpchen ist leider kein Erfolgssignal.');
    else say(state, kind);
    if (pc.power && pc.ram) burst(state, 'cable');
    effect(state, 'plug');
  }
  else if (kind === 'ram') { pc.ram = true; say(state, 'ram'); burst(state, 'ram'); effect(state, 'click'); }
  else if (kind === 'film') { pc.film = false; say(state, 'film'); effect(state, 'peel'); }
  else if (kind === 'paste') { pc.paste = 'pea'; say(state, 'paste'); effect(state, 'click'); }
  else if (kind === 'toothpaste') { pc.paste = 'toothpaste'; say(state, 'toothpaste'); burst(state, 'toothpaste'); effect(state, 'click'); }
  else if (kind === 'wipe') { pc.paste = 'none'; say(state, 'wipe'); effect(state, 'peel'); }
  else if (kind === 'drive') { pc.drive = true; say(state, 'drive'); effect(state, 'click'); }
  else if (kind === 'usb') { pc.usb = true; say(state, 'usb'); effect(state, 'plug'); }
  else if (kind === 'unplug') { pc.usb = false; say(state, 'unplug'); burst(state, 'unplug'); effect(state, 'plug'); }
  else if (kind === 'install') {
    if (pc.power && pc.ram && pc.drive && pc.usb) { say(state, 'install'); state.installStarted = true; }
    else say(state, null, `Installieren wäre gut. ${!pc.drive ? 'Dafür muss die SSD noch in den PC.' : !pc.usb ? 'Der Stick steckt aber noch nicht.' : 'Vorher brauchen wir einen laufenden Rechner.'}`);
  }
  else if (kind === 'drivers') {
    if (!pc.os) say(state, null, 'Treiber merke ich mir. Dafür hätte ich gern vorher ein Betriebssystem.');
    else if (!pc.driver && !state.driverUntil) { state.driverUntil = state.now + 52000; state.driverStarted = true; say(state, 'drivers'); effect(state, 'notification'); }
    else if (pc.driver) say(state, null, 'Der Treiber ist inzwischen drin. Den lasse ich jetzt bitte dort.');
  }
  else if (kind === 'benchmark') {
    if (pc.os && pc.driver && pc.power) { state.benchmarkRunning = true; say(state, 'benchmark'); effect(state, 'game'); }
    else say(state, null, `Crysis wartet noch. ${!pc.os ? 'Auf ein Betriebssystem.' : !pc.driver ? 'Auf den Grafiktreiber.' : 'Auf Strom.'}`);
  }
  else if (kind === 'lid') { if (pc.tidy) { pc.lid = true; say(state, 'tidy'); } else say(state, 'lidBlocked'); effect(state, 'click'); }
  else if (kind === 'tidy') { pc.tidy = true; pc.lid = true; say(state, 'tidy'); effect(state, 'zip'); }
  else if (kind === 'boost') { pc.boost = true; say(state, 'boost'); effect(state, 'power'); }
  else if (kind === 'normal') { pc.boost = false; say(state, 'normal'); }
  else if (kind === 'reset') {
    pc.power = true; state.bootCount++; state.benchmarkRunning = false;
    if (!pc.os && state.install > 0) { state.install = state.checkpoint; state.installStarted = true; say(state, 'installReset'); }
    else say(state, 'reset');
    burst(state, 'reset'); effect(state, 'power');
  }
  else if (kind === 'waiting') { state.pauseUntil = state.now + 45000; say(state, 'waiting'); }
  else if (kind === 'coffee') { state.coffeeUntil = state.now + 30000; state.pauseUntil = state.coffeeUntil; say(state, 'coffee'); }
  if (by) {
    remember(state, kind, by);
    const attribution = by === 'Abstimmung' ? 'Das war das Ergebnis unserer Abstimmung. Finn hat es gerade umgesetzt.' : `${by}, Finn hat deinen Tipp ausprobiert.`;
    if (random(state) < .4 && !['avoid', 'waiting', 'measure'].includes(kind)) queue(state, 'chat', 1400, { actor: 2, text: attribution });
  }
  state.attempts[goal] = (state.attempts[goal] || 0) + 1;
}

function callback(state, memory) {
  const { by, kind } = memory; let text;
  if (kind === 'rotate') text = state.pc.inverted ? `Falls ihr gerade reinkommt: Der Monitor steht wegen ${by} so. Gesucht war ursprünglich der Stecker.` : `${by} hat vorhin den Monitor umdrehen lassen. Er steht inzwischen wieder richtig. Wir behalten den Vorfall trotzdem.`;
  else if (kind === 'upright') text = `Seit ${by} den Monitor wieder gerade gestellt hat, kann ich die Fehlermeldungen wesentlich besser lesen.`;
  else if (kind === 'toothpaste') text = state.pc.paste === 'toothpaste' ? `Die Zahnpasta von ${by}s Tipp ist übrigens noch drauf. Der Lüfter hat dazu eine sehr laute Meinung.` : `${by}s Zahnpasta-Versuch ist inzwischen entfernt. Die Tube kommt nicht in die Teileliste.`;
  else if (kind === 'reset') text = `${by} hatte den Neustart vorgeschlagen. Wir sind seitdem bei Versuch ${state.bootCount}. Bitte die Zählung nicht auch neu starten.`;
  else if (kind === 'unplug') text = `${by} hat vorhin den Installationsstick ziehen lassen. ${state.pc.os ? 'Wir sind trotzdem auf dem Desktop angekommen.' : state.pc.usb ? 'Er ist inzwischen wieder da.' : 'Er fehlt übrigens immer noch.'}`;
  else if (kind === 'film') text = `Die Kühlerfolie ist dank ${by} weg. Aktuell ${Math.round(state.temperature)} Grad. Die Folie liegt jetzt auf dem Tisch, wo sie hingehört.`;
  else if (kind === 'paste') text = `${by} hatte die richtige Paste vorgeschlagen. Die Temperatur beträgt gerade ${Math.round(state.temperature)} Grad.`;
  else if (kind === 'ram') text = `Der RAM von ${by}s Hinweis sitzt immer noch. Wir haben uns darauf geeinigt, ihn nicht wieder anzufassen.`;
  else if (kind === 'cable' || kind === 'correct') text = `Das Kabel von ${by}s Tipp steckt noch an der Grafikkarte. ${state.pc.power ? 'Der Anschluss hat sich bewährt.' : 'Wir arbeiten gerade am anderen Ende der Stromversorgung.'}`;
  if (text) { say(state, null, text); if (kind === 'rotate') npc(state, 10, 'Ich war dabei. Es war wirklich nur ein Kabel gemeint.'); }
}

function autoAction(state) {
  const goal = currentGoal(state); const count = state.attempts[goal] || 0;
  let action;
  if (goal === 'power') action = 'power';
  else if (goal === 'cable') action = count < 1 ? 'cableWrong' : 'cable';
  else if (goal === 'ram') action = count < 1 ? 'measure' : 'ram';
  else if (goal === 'film') action = count < 1 ? 'measure' : 'film';
  else if (goal === 'paste') action = state.pc.paste === 'toothpaste' ? 'wipe' : count < 1 && !state.avoid.includes('toothpaste') ? 'toothpaste' : 'paste';
  else if (goal === 'drive') action = 'drive';
  else if (goal === 'usb') action = 'usb';
  else if (goal === 'install') action = !state.installStarted ? 'install' : 'waiting';
  else if (goal === 'drivers') action = state.driverUntil ? 'waiting' : 'drivers';
  else if (goal === 'benchmark') action = state.benchmarkRunning ? 'measure' : 'benchmark';
  else if (goal === 'tidy') action = count < 1 ? 'lid' : 'tidy';
  else action = random(state) < .3 ? 'coffee' : 'measure';
  if (state.avoid.includes(action)) action = 'measure';
  applyAction(state, action);
  if (action === 'measure') state.attempts[goal] = count + 1;
  state.autoAt = state.now + between(state, goal === 'stable' ? 80000 : 24000, goal === 'stable' ? 140000 : 44000);
}

function openPoll(state) {
  const goal = currentGoal(state);
  if (state.pollHistory.includes(goal) || ['install', 'drivers', 'stable', 'benchmark'].includes(goal)) return;
  const options = goal === 'cable' ? [['Grafikkarte anschließen', 'cable'], ['Monitor umdrehen', 'rotate'], ['Erst mal nachmessen', 'measure']] : goal === 'paste' ? [['Wärmeleitpaste', 'paste'], ['Zahnpasta', 'toothpaste'], ['Tube erst mal lesen', 'measure']] : [['Den Fehler prüfen', 'measure'], ['Einen Neustart versuchen', 'reset'], ['Kurz warten', 'waiting']];
  state.poll = { id: ++state.sequence, question: goal === 'cable' ? 'Wo muss das Kabel hin?' : goal === 'paste' ? 'Welche Tube kommt auf den Prozessor?' : 'Was soll Finn als Nächstes machen?', options: options.map(([text, action], i) => ({ text, action, votes: 6 - i })), endsAt: state.now + 45000, vote: null, finished: false, tickAt: state.now + 5000 };
  state.pollHistory.push(goal); npc(state, 2, 'Abstimmung ist offen. Bitte die Bauteile bis zum Ergebnis an ihrem Platz lassen.');
}
export function votePoll(state, index, now = Date.now()) {
  advanceStream(state, now); const poll = state.poll;
  if (!poll || poll.finished || poll.vote !== null || !poll.options[index]) return false;
  poll.options[index].votes++; poll.vote = index; return true;
}
export function redeemReward(state, id, name = state.guest, now = Date.now()) {
  advanceStream(state, now); const reward = REWARDS.find(row => row.id === id);
  if (!reward) return { ok: false, reason: 'Diese Einlösung gibt es nicht.' };
  if (state.rewards.some(row => row.id === id && state.now - row.at < 35000)) return { ok: false, reason: 'Diese Einlösung ist kurz in der Werkstatt. Gleich wieder.' };
  if (state.points < reward.cost) return { ok: false, reason: 'Dafür fehlen noch ein paar Schraubenpunkte.' };
  state.points -= reward.cost; state.rewards.push({ id, at: state.now }); state.rewards = state.rewards.slice(-20);
  npc(state, 2, `${name} hat „${reward.title}“ eingelöst.`);
  if (id === 'hands') { state.cameraUntil = state.now + 30000; effect(state, 'notification'); }
  else queue(state, 'action', 1800, { action: { measure: 'measure', upright: 'upright', coffee: 'coffee' }[id], by: name });
  return { ok: true, reward };
}

function integrate(state, seconds) {
  const pc = state.pc;
  const running = pc.power && pc.ram;
  const target = running ? (pc.film ? 118 : pc.paste === 'toothpaste' ? 104 : pc.paste === 'none' ? 108 : state.benchmarkRunning ? 59 : 39) + (pc.boost ? 35 : 0) - (pc.tidy ? 4 : 0) : 24;
  state.temperature += (target - state.temperature) * (1 - Math.exp(-seconds / (running ? 28 : 42)));
  if (pc.power && state.temperature > 101) {
    pc.power = false; state.protections++; state.benchmarkRunning = false; state.autoAt = state.now + 30000;
    say(state, 'protection'); burst(state, 'protection'); effect(state, 'off');
  }
  if (pc.power && running && pc.drive && pc.usb && !pc.os && state.installStarted) {
    if (state.now >= state.holdUntil) {
      const old = state.install; state.install = Math.min(100, state.install + seconds * .73);
      for (const milestone of [37, 83, 99]) {
        if (old < milestone && state.install >= milestone && !state.milestones.includes(`install-${milestone}`)) {
          state.install = milestone; state.checkpoint = milestone === 99 ? 83 : milestone;
          state.holdUntil = state.now + (milestone === 99 ? between(state, 35000, 55000) : between(state, 9000, 17000));
          state.milestones.push(`install-${milestone}`); npc(state, milestone === 99 ? 6 : 9, milestone === 99 ? '99 %. Ich habe den Einkauf geschafft.' : `${milestone} %. Dieser Abschnitt hat jetzt einen Stammplatz.`); break;
        }
      }
      if (state.install >= 100) { pc.os = true; say(state, 'installed'); burst(state, 'installed'); effect(state, 'notification'); state.autoAt = state.now + 22000; }
    }
  }
  if (state.driverUntil && state.now >= state.driverUntil && pc.os && pc.power) { pc.driver = true; state.driverUntil = 0; say(state, 'driverDone'); effect(state, 'notification'); state.autoAt = state.now + 22000; }
  if (state.benchmarkRunning && pc.power && running && pc.driver && pc.cable === 'gpu') state.benchmark += seconds;
  state.fps = state.benchmarkRunning && running ? Math.max(1, Math.round(11 + (pc.boost ? 5 : 0) - Math.max(0, state.temperature - 70) * .3 + Math.sin(state.now / 3300) * 2)) : 0;
  if (currentGoal(state) === 'stable' && !state.celebration) { state.celebration = true; state.stableAt = state.now; say(state, 'success'); burst(state, 'success'); effect(state, 'success'); }
}
function tick(state, seconds) {
  integrate(state, seconds);
  while (state.queue[0]?.at <= state.now) {
    const event = state.queue.shift();
    if (event.kind === 'chat') npc(state, event.actor, event.text);
    else if (event.kind === 'callback') callback(state, event.memory);
    else if (event.kind === 'action') { if (event.by === 'Abstimmung' && state.avoid.includes(event.action)) measure(state); else applyAction(state, event.action, event.by, event.target); state.pending = state.pending.filter(row => row.kind !== event.action); }
  }
  if (state.coffeeUntil && state.now >= state.coffeeUntil) { state.coffeeUntil = 0; say(state, 'back'); }
  const goal = currentGoal(state);
  if (goal !== state.lastGoal) { state.lastGoal = goal; state.goalSince = state.now; state.milestones.push(`${goal}:${state.now}`); }
  if (state.now >= state.ambientAt) {
    const rows = AMBIENT[goal].filter((_, index) => !(goal === 'cable' && index === 0 && state.pc.cable !== 'usb') && !(goal === 'paste' && index === 2 && state.pc.paste !== 'toothpaste'));
    const [who, text] = choose(state, rows, `ambient:${goal}:${goal === 'paste' ? state.pc.paste : goal === 'cable' ? state.pc.cable : ''}`); npc(state, who, text);
    if (state.pc.inverted && state.now > (state.invertedCommentAt || 0) && random(state) < .2) {
      const text = choose(state, ['Ich habe mein Tablet jetzt auch gedreht. Helfen tut es nicht.', 'Liest er die Fehlermeldung gerade von unten nach oben?', 'Ich liege inzwischen auf der Couch. Für mich steht er richtig.', 'Falls jemand neu hier ist: Euer Handy ist in Ordnung.'], 'inverted-comment');
      queue(state, 'chat', 1700, { actor: 4, text }); state.invertedCommentAt = state.now + 180000;
    }
    state.ambientAt = state.now + between(state, 6500, 12500);
  }
  state.threadAt ??= state.now + 85000;
  if (state.now >= state.threadAt) {
    state.threadsSeen ??= [];
    if (state.threadsSeen.length >= SIDE_THREADS.length) state.threadsSeen = [];
    const available = SIDE_THREADS.map((_, index) => index).filter(index => !state.threadsSeen.includes(index));
    const index = available[Math.floor(random(state) * available.length)]; state.threadsSeen.push(index);
    const conversation = SIDE_THREADS[index];
    conversation.forEach(([actor, text], i) => queue(state, 'chat', 1000 + i * 4300, { actor, text }));
    state.ambientAt = Math.max(state.ambientAt, state.now + conversation.length * 4300 + 2000);
    state.threadAt = state.now + between(state, 95000, 155000);
  }
  if (state.now >= state.autoAt && state.now >= state.pauseUntil && !state.pending.length) autoAction(state);
  if (state.now >= state.nextPollAt && (!state.poll || state.poll.finished)) { openPoll(state); state.nextPollAt = state.now + 130000; }
  const poll = state.poll;
  if (poll && !poll.finished) {
    if (state.now >= poll.tickAt) { poll.options[Math.floor(random(state) * poll.options.length)].votes++; poll.tickAt = state.now + between(state, 5000, 9000); }
    if (state.now >= poll.endsAt) { poll.finished = true; poll.winner = poll.options.reduce((a, b) => a.votes >= b.votes ? a : b); npc(state, 2, `Ergebnis: ${poll.winner.text}. Finn liest es gerade.`); queue(state, 'action', 4000, { action: poll.winner.action, by: 'Abstimmung' }); }
  }
  if (state.now >= state.raidAt) { npc(state, 3, 'YouTuba hat uns aus Versehen 17 Leute rübergeschickt. Die wollten alle einen Karton sehen.'); effect(state, 'raid'); state.raidAt = state.now + between(state, 480000, 840000); }
}
export function advanceStream(state, targetNow = Date.now(), watching = false) {
  if (!Number.isFinite(targetNow)) return state;
  const watchDelta = Math.max(0, Math.min(2500, targetNow - (state.watchAt ?? targetNow)));
  state.watchAt = targetNow;
  if (watching) {
    state.pointMilliseconds = (state.pointMilliseconds || 0) + watchDelta;
    if (state.pointMilliseconds >= 60000) { state.points += Math.floor(state.pointMilliseconds / 60000) * 60; state.pointMilliseconds %= 60000; }
  }
  if (targetNow <= state.lastTick) return state;
  const elapsed = targetNow - state.lastTick; const limit = Math.min(elapsed, 45 * 60 * 1000);
  const destination = state.lastTick + limit;
  while (state.lastTick + 1000 <= destination) { state.lastTick += 1000; state.now = state.lastTick; tick(state, 1); }
  if (elapsed > limit) {
    const shift = targetNow - state.lastTick;
    for (const key of ['autoAt', 'ambientAt', 'threadAt', 'nextPollAt', 'raidAt', 'pauseUntil', 'coffeeUntil', 'cameraUntil', 'driverUntil', 'holdUntil']) if (state[key]) state[key] += shift;
    state.queue.forEach(event => { event.at += shift; }); state.lastTick = targetNow; state.now = targetNow;
  }
  return state;
}
