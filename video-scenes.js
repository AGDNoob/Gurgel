// Kleine, lokal gebaute Szenen. Die echte Video-Zeit steuert auch Pause und Seek.
const descriptions = {
  drop: ['EXTREMTEST', ['Versuchsaufbau steht.', 'Nicht anfassen.', 'Das war der Versuchsaufbau.']],
  spin: ['FALSCH RUM', ['Vorderseite.', 'Andere Vorderseite.', 'Jetzt weiß es selbst nicht mehr.']],
  unbox: ['AUSPACKEN', ['Lieferung vollständig.', 'Noch ein Karton.', 'Inhalt: Verpackung.']],
  race: ['SPEEDTEST', ['Startbedingungen geprüft.', 'Das zählt als Strecke.', 'Ziel wurde verlegt.']],
  city: ['STADTFÜHRUNG', ['Hier geht es los.', 'Wir nehmen die Abkürzung.', 'Wieder hier. Alles gesehen.']],
  rain: ['WETTER LIVE', ['Sieb ist bereit.', 'Wasser hält sich nicht an die Form.', 'Luft erfolgreich gefiltert.']],
  signal: ['VERBINDUNG', ['Suche nach Empfang.', 'Ein Balken ist angekommen.', 'Der Rest fährt mit dem Bus.']],
  calculator: ['LIVE GERECHNET', ['Zwei.', 'Plus zwei.', 'Das hat jetzt jemand anderes gemacht.']],
  identity: ['DIE VERWECHSLUNG', ['Das müsste es sein.', 'Moment.', 'War das andere.']],
  loading: ['BITTE WARTEN', ['Update wird vorbereitet.', '99 %.', 'Auch 99 %.']],
  sleep: ['24 STUNDEN', ['Kamera läuft.', 'Hauptdarsteller schläft.', 'Kamera auch.']],
  printer: ['ER DRUCKT!', ['Druckauftrag gesendet.', 'Drucker möchte Magenta.', '84 Seiten Fehlermeldung.']],
  kids: ['HALLO BEIGE!', ['Der Karottenbus ist da!', 'Wir fahren zur nächsten Farbe.', 'Die ist heute auch Beige.']]
};
export function sceneFor(result) {
  if (result.genre === 'kids') return 'kids';
  if (descriptions[result.scene]) return result.scene;
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
export function sceneLabel(result) { return result.thumbText || result.thumb || descriptions[sceneFor(result)][0]; }
const element = (tag, className, text) => { const node = document.createElement(tag); node.className = className; if (text !== undefined) node.textContent = text; return node; };

export function mountVideoScene(player, video, result) {
  const kind = sceneFor(result);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const layer = element('div', `experiment-overlay experiment-${kind} hidden`);
  layer.setAttribute('aria-hidden', 'true');
  layer.dataset.scene = kind;
  const label = element('div', 'experiment-label', sceneLabel(result));
  const counter = element('div', 'experiment-counter', '00:00');
  const ground = element('div', 'experiment-ground');
  const actor = element('img', 'experiment-actor');
  actor.src = `./assets/${result.asset}.svg`; actor.alt = '';
  const other = element('img', 'experiment-other');
  other.src = `./assets/${kind === 'identity' ? 'parcel' : kind === 'race' ? 'car' : kind === 'unbox' ? 'parcel' : 'city'}.svg`; other.alt = '';
  const prop = element('div', 'experiment-prop', kind === 'printer' ? 'BITTE DRUCKEN' : kind === 'city' ? result.topic.name : kind === 'signal' ? '▂ ▄ ▆ █' : kind === 'sleep' ? 'z z z' : '');
  const caption = element('div', 'experiment-caption');
  const calculator = element('div', 'scene-calculator');
  const calcDisplay = element('div', 'calc-display', '0');
  const keys = element('div', 'calc-keys');
  for (const digit of ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', 'C', '0', '=', '+']) keys.append(element('span', '', digit));
  calculator.append(calcDisplay, keys);
  const bar = element('div', 'experiment-bar');
  bar.append(element('span', ''));
  const drops = element('div', 'scene-raindrops');
  for (let i = 0; i < 20; i++) { const drop = element('i', ''); drop.style.left = `${5 + i * 4.7}%`; drops.append(drop); }
  const paper = element('div', 'experiment-paper', 'FEHLER\nFEHLER\nFEHLER\nFEHLER\nFEHLER');
  layer.append(label, counter, ground, actor, other, prop, calculator, bar, drops, paper, caption);
  if (kind === 'rain') {
    const sieve = element('div', 'scene-sieve');
    sieve.innerHTML = '<svg viewBox="0 0 180 80" xmlns="http://www.w3.org/2000/svg"><path d="M25 22q47 67 94 0" fill="#eaf1f7" stroke="#738698" stroke-width="3"/><ellipse cx="72" cy="22" rx="47" ry="12" fill="none" stroke="#738698" stroke-width="3"/><path d="M119 22h47" stroke="#738698" stroke-width="7" stroke-linecap="round"/><path d="m42 26 10 30m7-27 5 39m15-39-3 39m20-41-9 31m-42-20h52m-39 11h27" fill="none" stroke="#9db0bf" stroke-width="2"/></svg>';
    layer.append(sieve);
  }
  if (kind === 'signal') actor.src = './assets/router.svg';
  if (kind === 'rain') actor.src = './assets/cloud.svg';
  if (kind === 'printer') actor.src = './assets/pc.svg';
  player.append(layer);
  let raf = 0;
  let disposed = false;

  function draw() {
    if (disposed || !layer.isConnected) return;
    const duration = result.durationSeconds || 3;
    const elapsed = Math.min(duration, Math.max(0, video.currentTime));
    const f = elapsed / duration;
    const t = f * 3;
    const motion = reduced.matches ? (f < 0.5 ? 0 : 1) : f;
    layer.classList.toggle('hidden', t <= 0);
    layer.dataset.shot = t < 0.9 ? 'one' : t < 1.9 ? 'two' : 'three';
    caption.textContent = (result.genre === 'gem' ? ['Zwei Dinge.', 'Noch zwei Dinge dazu.', 'Zusammen sind es vier.'] : descriptions[kind][1])[t < 0.9 ? 0 : t < 1.9 ? 1 : 2];
    const format = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
    counter.textContent = `${format(elapsed)} / ${format(duration)}`;
    if (kind === 'kids') { actor.style.transform = `translate(${motion * 90 - 90}%, -5%) rotate(${reduced.matches ? 0 : Math.sin(motion * 16) * 6}deg)`; prop.textContent = motion < .3 ? '1 🥕' : motion < .65 ? '2 🥕 🥕' : '3 🥕 🥕 🥕'; }
    else if (kind === 'drop') {
      const y = motion < 0.64 ? -80 + Math.pow(motion / 0.64, 2) * 115 : 35 - Math.abs(Math.sin((motion - 0.64) * 20)) * (1 - motion) * 60;
      actor.style.transform = `translate(-50%, ${y}%) rotate(${motion * 35}deg)`;
    } else if (kind === 'spin') actor.style.transform = `translate(-50%, -10%) rotate(${motion * 720}deg)`;
    else if (kind === 'unbox') { other.style.transform = `translate(-50%, 4%) scale(${1 + motion * 0.15})`; actor.style.transform = `translate(-50%, ${25 - motion * 90}%) scale(${0.5 + motion * 0.3})`; prop.textContent = `${Math.floor(motion * 79) + 1} / 80 Kartons`; }
    else if (kind === 'race') { actor.style.transform = `translate(${motion * 320 - 190}%, 5%) rotate(${motion > 0.8 ? (motion - 0.8) * 120 : 0}deg)`; other.style.transform = `translate(${motion * 110 - 40}%, 26%)`; }
    else if (kind === 'city') { actor.style.transform = `translate(-50%, 0%) scale(${1 + motion * 0.2})`; prop.style.transform = `translate(${Math.sin(motion * Math.PI * 2) * 65}%, ${-Math.cos(motion * Math.PI * 2) * 60}%)`; }
    else if (kind === 'identity') { actor.style.transform = `translate(${motion < 0.45 ? -50 : -50 - (motion - 0.45) * 380}%, -10%)`; other.style.transform = `translate(${motion < 0.45 ? 170 : 170 - (motion - 0.45) * 400}%, -10%)`; }
    else if (kind === 'signal') { actor.style.transform = `translate(-50%, -10%) rotate(${reduced.matches ? 0 : Math.sin(motion * 25) * 3}deg)`; prop.textContent = motion < 0.4 ? '▂ ▄ ▆ █' : motion < 0.7 ? '▂ ▄' : '▂'; }
    else if (kind === 'rain') { actor.style.transform = `translate(-50%, -30%)`; [...drops.children].forEach((drop, i) => drop.style.transform = `translateY(${((motion * 420 + i * 29) % 240) - 30}px)`); }
    else if (kind === 'calculator') {
      actor.classList.add('hidden');
      calcDisplay.textContent = t < 0.6 ? '2' : t < 1.3 ? '2 +' : t < 2.2 ? '2 + 2' : '4';
      [...keys.children].forEach(key => key.classList.toggle('pressed', key.textContent === (t < 0.6 ? '2' : t < 1.3 ? '+' : t < 2.2 ? '2' : '=')));
    } else if (kind === 'loading') { actor.classList.add('hidden'); bar.firstElementChild.style.width = `${Math.min(99, 40 + motion * 120)}%`; prop.textContent = `${Math.min(99, Math.floor(40 + motion * 120))} %`; }
    else if (kind === 'sleep') { actor.style.transform = `translate(-50%, 10%) rotate(-16deg)`; prop.style.transform = `translateY(${-motion * 30}px)`; prop.style.opacity = 1 - motion * 0.5; }
    else if (kind === 'printer') { actor.style.transform = 'translate(-50%, -25%)'; paper.style.transform = `translate(-50%, ${motion * 100 - 20}%)`; prop.textContent = t < 1 ? 'AUFTRAG: 1 SEITE' : t < 2 ? 'MAGENTA LEER' : '84 SEITEN GEDRUCKT'; }
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
    video.removeEventListener('play', play); video.removeEventListener('pause', stop); video.removeEventListener('seeked', draw); video.removeEventListener('ended', stop); video.removeEventListener('timeupdate', draw);
  };
}
