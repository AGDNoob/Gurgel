// YouTuba-Szenen nach Drehbuch. Die echte Video-Zeit steuert alles, auch Pause und Seek.
// Katalogvideos haben eigene Drehbücher, Suchvideos werden aus Bausteinen zusammengesetzt.
import { catalogScripts, intros, begs, sponsors, endings, outros, bodies, titleBodies } from './video-scripts.js';

const labels = { drop: 'EXTREMTEST', spin: 'FALSCH RUM', unbox: 'AUSPACKEN', race: 'SPEEDTEST', city: 'STADTFÜHRUNG', rain: 'WETTER LIVE', signal: 'VERBINDUNG', calculator: 'LIVE GERECHNET', identity: 'DIE VERWECHSLUNG', loading: 'BITTE WARTEN', sleep: '24 STUNDEN', printer: 'ER DRUCKT!', kids: 'HALLO BEIGE!' };
export function sceneFor(result) {
  if (result.genre === 'kids') return 'kids';
  if (labels[result.scene]) return result.scene;
  const title = result.title.toLowerCase();
  if (result.topic.category === 'city') return 'city';
  if (result.topic.category === 'car') return 'race';
  if (result.topic.category === 'person') return 'identity';
  if (/drucker|druckt/.test(title)) return 'printer';
  if (/regen|wetter/.test(title)) return 'rain';
  if (/taschenrechner|plus|rechnen/.test(title)) return 'calculator';
  if (/update|laden|werbung/.test(title)) return 'loading';
  if (/verpack|bestellt|auspack/.test(title)) return 'unbox';
  if (/gefallen|fallen|fall|weggeschoben/.test(title)) return 'drop';
  if (/passwort|wlan|internet/.test(title)) return 'signal';
  if (/schlaf/.test(title)) return 'sleep';
  return ['spin', 'unbox', 'drop', 'identity'][Number(result.id?.split('-')[1] || 0) % 4];
}
export function sceneLabel(result) { return result.thumbText || result.thumb || labels[sceneFor(result)]; }

const PERSISTENT = ['bg', 'a', 'p', 'pa', 'face', 'flip', 'smile', 'count', 'bar', 'bars', 'screen', 'pages', 'sheet', 'sieve', 'rain'];
const backgrounds = { city: 'outdoor', race: 'outdoor', rain: 'outdoor', printer: 'office', loading: 'office', calculator: 'lab', kids: 'beige' };
const hash = text => { let value = 2166136261; for (const character of String(text)) value = Math.imul(value ^ character.codePointAt(0), 16777619); return value >>> 0; };
const spread = (list, count) => count >= list.length ? list : Array.from({ length: count }, (_, i) => list[Math.round(i * (list.length - 1) / Math.max(1, count - 1))]);

function templateBeats(result, kind, duration) {
  const value = hash(`${result.title}:${result.id}`);
  const pick = (list, salt) => list[(value >>> salt) % list.length];
  const family = titleBodies.find(([pattern]) => pattern.test(result.title))?.[1];
  // Reine Werbevideos bestehen nur aus ihrem eigenen Ablauf, Sponsoren inklusive.
  if (family?.ads) return spread(family.beats, duration <= 3 ? 3 : duration <= 8 ? 4 : duration <= 12 ? 5 : 6);
  const body = family?.beats || bodies[family?.kind || kind];
  if (kind === 'kids') return [...body, ['Tschüss, Kinder! Morgen wieder: Beige!', { end: duration >= 30, fx: 'bounce' }]];
  const [bigText, line, face] = pick(endings, 3);
  const ending = [line, { big: bigText, face }];
  if (duration <= 3) return [['„{title}“', { face: '😤' }], body[Math.min(2, body.length - 1)], ending];
  const intro = pick(intros, 7);
  if (duration <= 12) return [intro, ...spread(body, duration <= 8 ? 2 : 3), ending];
  const sponsor = pick(sponsors, 11);
  const parts = spread(body, duration <= 30 ? 4 : 6);
  const split = duration <= 30 ? 3 : 4;
  return [intro, [pick(begs, 13), { sub: true }], ...parts.slice(0, split), [`Dieses Video wird gesponsert von ${sponsor.name}.`, { sponsor }], ...parts.slice(split), ending, [pick(outros, 17), { end: true }]];
}

export function scriptFor(result) {
  const duration = result.durationSeconds || 3;
  const kind = sceneFor(result);
  const custom = catalogScripts[result.title];
  const fill = text => String(text).replaceAll('{n}', result.topic?.name || result.title).replaceAll('{title}', result.title.replace(/[.!?]+$/, ''));
  let raw = custom?.beats;
  if (!raw) {
    const parts = templateBeats(result, kind, duration);
    raw = parts.map(([text, opts], i) => [Math.round(i * duration / parts.length * 10) / 10, text, opts]);
  }
  let state = { bg: backgrounds[kind] || 'studio', a: 'center', face: '🙂' };
  let timer = null;
  const beats = raw.map(([start, text, opts = {}], i) => {
    const previous = state;
    state = { ...state };
    for (const key of PERSISTENT) if (key in opts) { if (opts[key] === null) delete state[key]; else state[key] = typeof opts[key] === 'string' ? fill(opts[key]) : opts[key]; }
    if ('timer' in opts) {
      if (typeof opts.timer === 'number') timer = { base: opts.timer, since: start, running: true };
      else if (opts.timer === 'run' && !timer?.running) timer = { base: timer?.base ?? 0, since: start, running: true };
      else if (opts.timer === 'stop' && timer) timer = { base: timer.running ? timer.base + start - timer.since : timer.base, since: start, running: false };
      else if (opts.timer === null) timer = null;
    }
    return { start, end: raw[i + 1]?.[0] ?? duration, text: fill(text), state, previous, timer, big: opts.big && fill(opts.big), cam: opts.cam, fx: opts.fx, circle: !!opts.circle, arrow: !!opts.arrow, slow: !!opts.slow, sub: !!opts.sub, endscreen: !!opts.end, sponsor: opts.sponsor || null };
  });
  const sponsored = beats.filter(beat => beat.sponsor);
  return { duration, kind, face: custom ? custom.face !== false : kind !== 'kids', asset: custom?.asset || result.asset, beats, sponsor: sponsored.length ? { start: sponsored[0].start, end: sponsored.at(-1).end, ...sponsored[0].sponsor } : null };
}

export function beatAt(script, time) {
  let beat = script.beats[0];
  for (const candidate of script.beats) if (candidate.start <= time) beat = candidate;
  return beat;
}

const poses = { center: {}, left: { x: -24 }, right: { x: 24 }, offleft: { x: -95 }, offright: { x: 95 }, high: { y: -22, s: .78 }, ground: { y: 18, r: 82, s: .9 }, small: { s: .6, y: 6 }, tiny: { s: .28, y: 14 }, huge: { s: 1.75, y: -4 }, tilt: { r: -24 }, gone: { o: 0 } };
const pose = name => ({ x: 0, y: 0, r: 0, s: 1, o: 1, ...(poses[name] || {}) });
const mix = (a, b, q) => Object.fromEntries(Object.keys(a).map(key => [key, a[key] + (b[key] - a[key]) * q]));
const easeOut = q => 1 - Math.pow(1 - q, 3);
const easeInOut = q => q < .5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2;
const clock = (seconds, long) => {
  const s = Math.max(0, seconds);
  if (long) return [Math.floor(s / 3600), Math.floor(s % 3600 / 60), Math.floor(s % 60)].map(part => String(part).padStart(2, '0')).join(':');
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')},${String(Math.floor(s % 1 * 100)).padStart(2, '0')}`;
};
const element = (tag, className, text) => { const node = document.createElement(tag); node.className = className; if (text !== undefined) node.textContent = text; return node; };

export function mountVideoScene(player, video, result) {
  const script = scriptFor(result);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const layer = element('div', 'vs-stage hidden');
  layer.setAttribute('aria-hidden', 'true');
  const world = element('div', 'vs-world');
  const actor = element('div', 'vs-actor');
  const actorImage = element('img', 'vs-actor-image'); actorImage.src = `./assets/${script.asset}.svg`; actorImage.alt = '';
  const smile = element('span', 'vs-smile');
  const circle = element('span', 'vs-circle');
  const arrow = element('span', 'vs-arrow', '➜');
  actor.append(actorImage, smile, circle, arrow);
  const prop = element('img', 'vs-prop'); prop.alt = '';
  const count = element('div', 'vs-count');
  const timer = element('div', 'vs-timer');
  const bar = element('div', 'vs-bar'); const barFill = element('span', ''); const barLabel = element('b', ''); bar.append(barFill, barLabel);
  const bars = element('div', 'vs-bars'); for (let i = 0; i < 4; i++) bars.append(element('i', ''));
  const screen = element('div', 'vs-screen');
  const pages = element('div', 'vs-pages'); for (let i = 0; i < 5; i++) pages.append(element('i', '')); const pagesLabel = element('b', ''); pages.append(pagesLabel);
  const sheet = element('div', 'vs-sheet'); sheet.innerHTML = '<b>FORMBLATT 28b</b><span></span><span></span><span class="short"></span><em>Feld 14</em><span></span>';
  const sieve = element('div', 'vs-sieve'); sieve.innerHTML = '<svg viewBox="0 0 180 80" xmlns="http://www.w3.org/2000/svg"><path d="M25 22q47 67 94 0" fill="#eaf1f7" stroke="#738698" stroke-width="3"/><ellipse cx="72" cy="22" rx="47" ry="12" fill="none" stroke="#738698" stroke-width="3"/><path d="M119 22h47" stroke="#738698" stroke-width="7" stroke-linecap="round"/><path d="m42 26 10 30m7-27 5 39m15-39-3 39m20-41-9 31m-42-20h52m-39 11h27" fill="none" stroke="#9db0bf" stroke-width="2"/></svg>';
  const rain = element('div', 'vs-rain'); for (let i = 0; i < 18; i++) { const drop = element('i', ''); drop.style.left = `${4 + i * 5.3}%`; rain.append(drop); }
  world.append(rain, sieve, sheet, pages, prop, actor, screen, bar);
  const big = element('div', 'vs-big');
  const subtitle = element('div', 'vs-subtitle');
  const facecam = element('div', 'vs-facecam'); const faceEmoji = element('span', ''); facecam.append(faceEmoji, element('small', '', result.channelLetter || result.channel?.[0] || 'Y'));
  const sponsor = element('div', 'vs-sponsor');
  const subscribe = element('div', 'vs-subscribe');
  const endscreen = element('div', 'vs-end');
  endscreen.innerHTML = `<div class="vs-end-card"><span>TEIL 2</span><small>Kommt nie</small></div><div class="vs-end-avatar">${(result.channelLetter || 'Y').replace(/[<>&"]/g, '')}<small>ABONNIEREN</small></div><div class="vs-end-card"><span>REACTION</span><small>Ich reagiere auf dieses Video</small></div>`;
  layer.append(world, count, timer, bars, big, sponsor, subscribe, endscreen, facecam, subtitle);
  const skip = element('button', 'vs-skip hidden', 'Sponsor überspringen ⏭');
  skip.type = 'button';
  skip.addEventListener('click', () => { if (script.sponsor) video.currentTime = Math.min(script.duration, script.sponsor.end + .01); });
  player.append(layer, skip);
  let raf = 0;
  let disposed = false;

  function draw() {
    if (disposed || !layer.isConnected) return;
    const t = Math.min(script.duration, Math.max(0, video.currentTime));
    const beat = beatAt(script, t);
    const state = beat.state;
    const length = Math.max(.1, beat.end - beat.start);
    const local = t - beat.start;
    const calm = reduced.matches;
    const q = calm ? 1 : Math.min(1, local / (beat.slow ? length : Math.min(.6, length)));
    layer.classList.toggle('hidden', t <= 0);
    layer.dataset.bg = state.bg;

    const current = mix(pose(beat.previous.a), pose(state.a), beat.slow ? easeInOut(q) : easeOut(q));
    let { x, y, r, s, o } = current;
    if (!calm && beat.fx === 'shake') { x += Math.sin(t * 61) * 1.2; r += Math.sin(t * 47) * 4; }
    if (!calm && beat.fx === 'bounce') y -= Math.abs(Math.sin(t * 7)) * 6;
    if (!calm && beat.fx === 'spin') r += 360 * easeInOut(Math.min(1, local / Math.min(1.2, length)));
    actor.style.transform = `translate(${x}cqw, ${y}cqh) rotate(${r}deg) scale(${state.flip ? -s : s}, ${s})`;
    actor.style.opacity = o;
    smile.textContent = state.smile || '';
    smile.style.transform = state.flip ? 'scaleX(-1)' : '';
    circle.classList.toggle('on', beat.circle && !state.sheet);
    arrow.classList.toggle('on', beat.arrow);

    prop.classList.toggle('on', !!state.pa);
    if (state.pa && !prop.src.endsWith(`/${state.pa}.svg`)) prop.src = `./assets/${state.pa}.svg`;
    const propPose = mix(pose(beat.previous.pa ? beat.previous.p : state.p), pose(state.p), beat.slow ? easeInOut(q) : easeOut(q));
    prop.style.transform = `translate(${propPose.x}cqw, ${propPose.y}cqh) rotate(${propPose.r}deg) scale(${propPose.s})`;
    prop.style.opacity = propPose.o;

    const zoom = beat.cam === 'zoom' ? 1 + .22 * easeOut(Math.min(1, local / .25)) : beat.cam === 'wide' ? .86 : 1;
    world.style.transform = `scale(${calm ? 1 : zoom})`;

    count.textContent = state.count || '';
    count.classList.toggle('on', !!state.count);
    const timerValue = beat.timer ? (beat.timer.running ? beat.timer.base + t - beat.timer.since : beat.timer.base) : null;
    timer.classList.toggle('on', timerValue !== null);
    timer.classList.toggle('stopped', !!beat.timer && !beat.timer.running);
    if (timerValue !== null) timer.textContent = clock(timerValue, beat.timer.base >= 3600);
    bar.classList.toggle('on', typeof state.bar === 'number');
    if (typeof state.bar === 'number') { barFill.style.width = `${state.bar}%`; barLabel.textContent = `${String(state.bar).replace('.', ',')} %`; }
    bars.classList.toggle('on', typeof state.bars === 'number');
    [...bars.children].forEach((item, i) => item.classList.toggle('lit', i < (state.bars || 0)));
    screen.textContent = state.screen || '';
    screen.classList.toggle('on', !!state.screen);
    pages.classList.toggle('on', typeof state.pages === 'number');
    [...pages.querySelectorAll('i')].forEach((sheetItem, i) => sheetItem.classList.toggle('on', i < Math.min(5, Math.ceil((state.pages || 0) / 17))));
    pagesLabel.textContent = state.pages === 1 ? '1 Seite' : `${state.pages || 0} Seiten`;
    sheet.classList.toggle('on', !!state.sheet);
    sheet.classList.toggle('circled', beat.circle && !!state.sheet);
    sheet.style.transform = !calm && beat.fx === 'shake' && state.sheet ? `rotate(${Math.sin(t * 9) * 1.5}deg)` : '';
    sieve.classList.toggle('on', !!state.sieve);
    rain.classList.toggle('on', !!state.rain);
    if (state.rain) [...rain.children].forEach((drop, i) => { drop.style.transform = `translateY(${((t * 260 + i * 37) % 130) - 20}cqh)`; });

    big.textContent = beat.big || '';
    big.classList.toggle('on', !!beat.big);
    if (beat.big) big.style.transform = `translateX(-50%) rotate(-4deg) scale(${calm ? 1 : 1 + .8 * (1 - easeOut(Math.min(1, local / .22)))})`;

    const shown = beat.text.slice(0, Math.floor(local * 34) + 1);
    subtitle.textContent = beat.text ? shown : '';
    subtitle.classList.toggle('on', !!beat.text);
    facecam.classList.toggle('on', script.face);
    faceEmoji.textContent = state.face || '🙂';
    const talking = !calm && beat.text && shown.length < beat.text.length && !beat.text.startsWith('[');
    faceEmoji.style.transform = talking ? `translateY(${Math.sin(t * 22) * 2}px) rotate(${Math.sin(t * 9) * 4}deg)` : '';

    sponsor.classList.toggle('on', !!beat.sponsor);
    if (beat.sponsor) sponsor.innerHTML = `<small>Werbung · ${beat.sponsor.name.replace(/[<>&"]/g, '')}</small><b>${beat.sponsor.line.replace(/[<>&"]/g, '')}</b><span style="width:${Math.min(100, (t - script.sponsor.start) / (script.sponsor.end - script.sponsor.start) * 100)}%"></span>`;
    skip.classList.toggle('hidden', !beat.sponsor);
    subscribe.classList.toggle('on', beat.sub || beat.endscreen);
    subscribe.classList.toggle('done', (beat.sub || beat.endscreen) && local / length > .5);
    subscribe.textContent = (beat.sub || beat.endscreen) && local / length > .5 ? 'ABONNIERT ✓ 🔔' : 'ABONNIEREN';
    endscreen.classList.toggle('on', beat.endscreen && local > Math.min(1.5, length * .35));
  }
  function tick() { draw(); if (!disposed && layer.isConnected && !video.paused && !video.ended) raf = requestAnimationFrame(tick); }
  const play = () => { cancelAnimationFrame(raf); tick(); };
  const stop = () => { cancelAnimationFrame(raf); draw(); };
  video.addEventListener('play', play);
  video.addEventListener('pause', stop);
  video.addEventListener('seeked', draw);
  video.addEventListener('ended', stop);
  video.addEventListener('timeupdate', draw);
  draw();
  return () => {
    disposed = true; cancelAnimationFrame(raf);
    video.pause();
    skip.remove();
    video.removeEventListener('play', play); video.removeEventListener('pause', stop); video.removeEventListener('seeked', draw); video.removeEventListener('ended', stop); video.removeEventListener('timeupdate', draw);
  };
}
