import { screenState } from './twatsch-engine.js';

// Entirely code-drawn studio. Every visible hardware change reads the simulation.
export function createStudio(canvas) {
  const ctx = canvas.getContext('2d', { alpha: false });
  let quality = 720;
  function rectangle(x, y, w, h, color, radius = 0) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fill();
  }
  function text(value, x, y, size = 20, color = '#343639', weight = 400, align = 'left', font = 'Arial') {
    ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.fillText(value, x, y); ctx.textAlign = 'left';
  }
  function line(points, color, width = 3) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) ctx.lineTo(points[i], points[i + 1]); ctx.stroke();
  }
  function ellipse(x, y, rx, ry, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
  function fan(x, y, radius, time, running, heat) {
    ellipse(x, y, radius + 6, radius + 6, '#202b34');
    ctx.strokeStyle = heat > 85 ? '#ee775e' : '#64bfc1'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.stroke();
    ctx.save(); ctx.translate(x, y); ctx.rotate(running ? time * (.005 + Math.max(0, heat - 35) * .00008) : .3);
    for (let i = 0; i < 6; i++) { ctx.rotate(Math.PI / 3); ctx.fillStyle = '#42515c'; ctx.beginPath(); ctx.moveTo(1, 0); ctx.bezierCurveTo(radius * .9, -radius * .55, radius * .8, radius * .85, 4, radius * .6); ctx.closePath(); ctx.fill(); }
    ctx.restore(); ellipse(x, y, 8, 8, '#7c9098');
  }
  function person(x, y, scale, now, talking, reaching, away = false) {
    if (away) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
    const breathe = Math.sin(now / 1700) * 2;
    rectangle(-88, 68 + breathe, 176, 179, '#455e73', 35);
    ctx.fillStyle = '#334a5d'; ctx.beginPath(); ctx.moveTo(-70, 76); ctx.lineTo(-5, 160); ctx.lineTo(72, 78); ctx.closePath(); ctx.fill();
    line([-12, 113, -17, 162], '#b9c5c9', 3); line([12, 113, 18, 162], '#b9c5c9', 3);
    rectangle(-19, 37, 38, 49, '#c48b6e', 10);
    ellipse(0, -4, 53, 66, '#dca384'); ellipse(-53, 0, 8, 13, '#dca384'); ellipse(53, 0, 8, 13, '#dca384');
    ctx.fillStyle = '#4b372d'; ctx.beginPath(); ctx.moveTo(-52, -13); ctx.lineTo(-55, -45); ctx.quadraticCurveTo(-29, -88, 5, -70); ctx.quadraticCurveTo(53, -78, 55, -25); ctx.lineTo(45, -6); ctx.lineTo(37, -35); ctx.quadraticCurveTo(10, -17, -18, -44); ctx.lineTo(-42, -22); ctx.closePath(); ctx.fill();
    const blink = now % 4900 > 4740;
    line([-30, -15, -13, -18], '#5a3d30', 4); line([13, -17, 31, -13], '#5a3d30', 4);
    if (blink) { line([-28, -4, -13, -4], '#3a3532', 3); line([13, -4, 28, -4], '#3a3532', 3); }
    else { ellipse(-21, -5, 4, 5, '#303d40'); ellipse(21, -5, 4, 5, '#303d40'); ellipse(-20, -6, 1, 1, '#fff'); ellipse(22, -6, 1, 1, '#fff'); }
    line([0, -1, -4, 17, 4, 18], '#bd8066', 3);
    ctx.fillStyle = '#704b38'; ctx.beginPath(); ctx.moveTo(-37, 28); ctx.quadraticCurveTo(0, 71, 37, 28); ctx.lineTo(29, 53); ctx.quadraticCurveTo(0, 77, -29, 53); ctx.closePath(); ctx.fill();
    if (talking) ellipse(0, 35, 11, 3 + Math.abs(Math.sin(now / 115)) * 7, '#634334'); else line([-10, 34, 10, 34], '#835242', 3);
    // Headset with physical microphone, not a floating face sticker.
    ctx.strokeStyle = '#29323a'; ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(0, -9, 61, 70, 0, Math.PI, Math.PI * 2); ctx.stroke();
    rectangle(-66, -21, 18, 49, '#303c46', 7); rectangle(48, -21, 18, 49, '#303c46', 7);
    line([59, 17, 48, 41, 21, 45], '#303c46', 5); rectangle(16, 40, 17, 10, '#20272e', 4);
    if (!reaching) { line([-65, 103, -106, 187, -79, 220], '#455e73', 31); line([66, 104, 106, 188, 83, 220], '#455e73', 31); ellipse(-76, 223, 19, 11, '#dca384'); ellipse(81, 223, 19, 11, '#dca384'); }
    ctx.restore();
  }
  function drawMonitor(state, now, rotation) {
    rectangle(327, 476, 31, 67, '#5b6368', 4); ellipse(343, 543, 85, 14, '#545c61');
    ctx.save(); ctx.translate(338, 363); ctx.rotate(rotation * Math.PI);
    rectangle(-192, -126, 384, 244, '#30363d', 12); rectangle(-182, -116, 364, 217, '#111d27', 3);
    text('MORNITOR', 0, 113, 11, '#a2acb1', 700, 'center'); ellipse(173, 111, 3, 3, '#91c5a6');
    ctx.save(); ctx.beginPath(); ctx.rect(-180, -114, 360, 214); ctx.clip();
    const mode = screenState(state);
    if (mode === 'signal') {
      text('KEIN SIGNAL', 0, -12, 25, '#d4e2e6', 500, 'center');
      text('HDMI 1', 0, 24, 15, '#758b99', 400, 'center');
      const distance = (now / 85) % 330; rectangle(-170 + distance, 69, 12, 5, '#678ca5', 1);
    } else if (mode === 'ram') {
      rectangle(-180, -114, 360, 214, '#12223e');
      text('MEMORY TRAINING', -153, -74, 20, '#cdd9ed', 700, 'left', 'monospace');
      text('DRAM  . . .', -153, -22, 17, '#ebba68', 400, 'left', 'monospace');
      text('1 Riegel gefunden', -153, 18, 15, '#9cacc8', 400, 'left', 'monospace');
      text('0 Riegel eingerastet', -153, 47, 15, '#c4cfde', 400, 'left', 'monospace');
    } else if (mode === 'bios' || mode === 'boot') {
      rectangle(-180, -114, 360, 214, '#143c5c'); rectangle(-180, -114, 360, 31, '#245b7c');
      text('BUYAZON BASIC BIOS', -164, -92, 16, '#f3f7fa', 700, 'left', 'monospace');
      text('CPU: 128 Kerne, vielleicht', -162, -52, 14, '#d8e8ec', 400, 'left', 'monospace');
      text(`TEMP: ${Math.round(state.temperature)} C`, -162, -24, 15, state.temperature > 85 ? '#ffa484' : '#a2e2c4', 400, 'left', 'monospace');
      text(state.pc.drive ? 'SSD: ANGESCHLOSSEN' : 'SSD: NICHT GEFUNDEN', -162, 7, 14, '#d8e8ec', 400, 'left', 'monospace');
      text(mode === 'boot' ? 'INSTALLATIONSMEDIUM FEHLT' : 'NO BOOT DEVICE', -162, 52, 15, '#eccf87', 700, 'left', 'monospace');
    } else if (mode === 'install') {
      rectangle(-180, -114, 360, 214, '#334ba7');
      text('Fenster wird installiert', 0, -63, 21, '#fff', 500, 'center');
      const percent = Math.floor(state.install); text(`${percent} %`, 0, -7, 33, '#fff', 400, 'center');
      rectangle(-135, 22, 270, 7, '#6577c0', 4); rectangle(-135, 22, Math.max(1, 270 * percent / 100), 7, '#dce5ff', 4);
      text(state.installStarted ? percent >= 99 ? 'Nur noch einen Moment.' : 'Dateien kopieren' : 'Bereit zur Installation', 0, 60, 13, '#d5defe', 400, 'center');
    } else if (mode === 'driver') {
      if (state.driverUntil - state.now > 12000) { rectangle(-180, -114, 360, 214, '#111820'); ellipse(0, -4, 4 + Math.sin(now / 220), 4, '#52637b'); }
      else { rectangle(-180, -114, 360, 214, '#295e78'); text('Grafiktreiber', 0, -25, 22, '#fff', 500, 'center'); text('Bild gleich wieder da.', 0, 10, 15, '#c4e1e7', 400, 'center'); }
    } else if (mode === 'desktop') {
      rectangle(-180, -114, 360, 214, '#34708a');
      for (const [i, name] of ['Papierkorb', 'Crysis', 'Rechnung'].entries()) { rectangle(-161, -91 + i * 55, 24, 27, i === 1 ? '#6c8e4c' : '#b9d5dc', 3); text(name, -127, -73 + i * 55, 12, '#fff'); }
      rectangle(-180, 78, 360, 22, '#1d3449'); text('Fenster', -167, 94, 12, '#d2e3ec'); text(new Date(now).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }), 162, 94, 11, '#d2e3ec', 400, 'right');
    } else {
      rectangle(-180, -114, 360, 214, '#446a67');
      ctx.fillStyle = '#647d4c'; ctx.beginPath(); ctx.moveTo(-180, 48); ctx.lineTo(-75, -31); ctx.lineTo(23, 20); ctx.lineTo(120, -21); ctx.lineTo(180, 48); ctx.lineTo(180, 100); ctx.lineTo(-180, 100); ctx.closePath(); ctx.fill();
      for (let i = 0; i < 7; i++) { const x = (i * 72 - Math.floor(now / 180) % 72) - 190; rectangle(x, 0, 9, 73, '#344834'); ctx.fillStyle = '#406343'; ctx.beginPath(); ctx.moveTo(x - 23, 12); ctx.lineTo(x + 4, -43); ctx.lineTo(x + 31, 12); ctx.closePath(); ctx.fill(); }
      text('CRYSIS', -158, -79, 25, '#edf4e6', 700); text('EINSTELLUNGEN', -156, -52, 11, '#d1deca');
      rectangle(80, -102, 91, 34, '#101b1ccc', 2); text(`${state.fps} FPS`, 158, -80, 19, '#e6f6c8', 700, 'right', 'monospace');
      text('Mehr als ein Menü war nicht im Angebot.', 0, 79, 11, '#dce4cf', 400, 'center');
    }
    ctx.restore(); ctx.restore();
  }
  function drawCase(state, now, progress) {
    const pc = state.pc;
    ctx.fillStyle = '#303a43'; ctx.beginPath(); ctx.moveTo(796, 221); ctx.lineTo(1101, 221); ctx.lineTo(1150, 245); ctx.lineTo(845, 245); ctx.closePath(); ctx.fill();
    rectangle(790, 234, 309, 331, '#222c36', 9); rectangle(1100, 242, 50, 323, '#34404a', 3);
    rectangle(805, 248, 278, 302, '#17232c', 3);
    // Rear connectors stay visibly different even before the PC powers on.
    rectangle(772, 276, 20, 133, '#444e54', 3);
    [['USB', 288], ['BOARD', 333], ['GPU', 383]].forEach(([label, y]) => { rectangle(775, y, 14, 12, '#10181f', 2); text(label, 760, y + 10, 10, '#29343a', 700, 'right'); });
    rectangle(822, 263, 191, 212, '#31585b', 3);
    for (let i = 0; i < 10; i++) { line([835, 284 + i * 16, 845 + i % 3 * 8, 284 + i * 16, 845 + i % 3 * 8, 460], '#49756e', 1); }
    rectangle(902, 277, 64, 61, '#a1adb0', 4); rectangle(910, 285, 48, 45, '#6e7a82', 3);
    if (pc.paste !== 'none') ellipse(934, 302, pc.paste === 'pea' ? 7 : 19, pc.paste === 'pea' ? 5 : 14, pc.paste === 'pea' ? '#bcc1c2' : '#b1e3ce');
    fan(934, 309, 33, now, pc.power, state.temperature);
    if (pc.film) { rectangle(895, 269, 78, 76, '#d7eced59', 4); rectangle(963, 269, 13, 31, '#f8be59', 2); text('REMOVE', 934, 312, 10, '#eff8f8', 700, 'center'); }
    const ramLift = !pc.ram ? 17 : state.animation?.kind === 'ram' ? (1 - progress) * 17 : 0;
    for (let i = 0; i < 2; i++) { rectangle(980 + i * 17, 271 - ramLift, 10, 98, pc.ram ? '#8dbaa7' : '#b9c1a0', 2); rectangle(981 + i * 17, 278 - ramLift, 8, 59, '#39464a', 1); rectangle(981 + i * 17, 365 - ramLift, 8, 5, '#cfb66f'); }
    if (!pc.ram) line([1009, 270, 1017, 260], '#eaa26a', 4);
    rectangle(834, 386, 228, 47, '#4e5b63', 4); rectangle(843, 394, 209, 24, '#293741', 3); text('RTX IRGENDWAS', 951, 411, 14, '#acbfba', 700, 'center');
    if (pc.power) { rectangle(847, 423, 204, 3, state.temperature > 85 ? '#e69168' : '#83bab0', 1); }
    if (pc.drive) { rectangle(858, 448, 122, 18, '#3f76a1', 2); text('SSD', 918, 461, 10, '#e0eef5', 700, 'center'); }
    rectangle(817, 486, 243, 52, '#26343d', 4); text('0,20 € · 600 W?', 938, 517, 17, '#91a1a7', 500, 'center', 'monospace');
    fan(1123, 311, 21, now, pc.power, state.temperature); fan(1123, 389, 21, now, pc.power, state.temperature); fan(1123, 467, 21, now, pc.power, state.temperature);
    if (pc.tidy) {
      line([1043, 274, 1043, 476, 920, 476], '#66777a', 6); rectangle(1038, 351, 13, 7, '#b1b5ac'); rectangle(993, 471, 7, 13, '#b1b5ac');
    } else {
      ctx.strokeStyle = '#68716c'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(1043, 281); ctx.bezierCurveTo(1216, 374, 1033, 451, 1170, 531); ctx.bezierCurveTo(1217, 574, 1013, 556, 970, 498); ctx.stroke();
    }
    if (pc.lid) { rectangle(804, 248, 280, 301, '#9bb6c519', 2); line([824, 265, 1058, 530], '#c6d9e323', 2); }
    else { line([808, 251, 808, 548, 1083, 548], '#84959f', 2); }
    const port = { usb: [780, 294], motherboard: [780, 339], gpu: [780, 389] }[pc.cable];
    ctx.strokeStyle = '#252d32'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(517, 432); ctx.bezierCurveTo(620, 626, 682, 624, port[0] - 12, port[1]); ctx.stroke(); rectangle(port[0] - 14, port[1] - 5, 20, 12, '#1b2228', 3);
    if (pc.power) { ellipse(1140, 253, 3, 3, '#9cdfb8'); ellipse(1035, 273, 3, 3, !pc.ram ? '#efac60' : '#6ebf89'); }
    if (!pc.film) { ctx.save(); ctx.translate(724, 538); ctx.rotate(.18); rectangle(-35, -23, 75, 49, '#e9f2ec8c', 2); text('REMOVE', 2, 5, 10, '#82918d', 700, 'center'); ctx.restore(); }
    if (state.temperature > 86 && pc.power) { for (let i = 0; i < 4; i++) { const p = ((now / 1400 + i * .22) % 1); ellipse(920 + Math.sin(now / 1000 + i) * 12, 215 - p * 63, 7 + p * 13, 9 + p * 8, `rgba(221,222,209,${(1 - p) * .3})`); } }
  }
  function draw(state, now, reduced = false) {
    const time = reduced ? Math.floor(now / 4000) * 4000 : now;
    if (canvas.height !== quality) { canvas.height = quality; canvas.width = Math.round(quality * 16 / 9); }
    ctx.setTransform(canvas.width / 1280, 0, 0, canvas.height / 720, 0, 0);
    rectangle(0, 0, 1280, 720, '#dddcd5');
    rectangle(0, 0, 1280, 42, '#d1d1c9'); rectangle(24, 92, 207, 252, '#a5b8b8', 4); rectangle(36, 104, 183, 228, '#dbe6e2');
    rectangle(122, 104, 6, 228, '#b0bdb7'); rectangle(36, 215, 183, 6, '#b0bdb7'); rectangle(13, 337, 229, 14, '#bbc6be', 2);
    rectangle(846, 101, 355, 13, '#9f8f76', 2); rectangle(881, 43, 79, 58, '#b59b72', 2); rectangle(966, 63, 110, 38, '#c8b99c', 2); rectangle(1087, 34, 75, 67, '#a2aaa1', 2);
    text('KABEL', 1021, 88, 15, '#5b5e53', 700, 'center'); text('OHNE', 1123, 61, 12, '#5c675c', 700, 'center'); text('INHALT', 1123, 80, 12, '#5c675c', 700, 'center');
    rectangle(307, 83, 226, 102, '#d1c6ab', 3); rectangle(315, 91, 210, 86, '#ede8da', 2); text('BUYAZON', 420, 122, 18, '#414d56', 700, 'center'); text('GAMING-PC  0,20 €', 420, 155, 17, '#6b6c60', 500, 'center');
    // Chair remains when Finn goes for coffee.
    rectangle(529, 262, 140, 210, '#4a5358', 30); rectangle(586, 451, 25, 73, '#555f62', 5);
    const action = state.animation;
    const progress = action ? Math.max(0, Math.min(1, (now - action.at) / 2800)) : 1;
    const reaching = Boolean(action && progress < 1 && !['coffee', 'waiting', 'measure'].includes(action.kind));
    const talking = state.caption?.until > now;
    person(596, 277, 1.15, time, talking, reaching, state.coffeeUntil > now);
    ctx.fillStyle = '#d5b58c'; ctx.beginPath(); ctx.moveTo(35, 449); ctx.lineTo(1245, 449); ctx.lineTo(1280, 634); ctx.lineTo(0, 634); ctx.closePath(); ctx.fill();
    rectangle(0, 634, 1280, 24, '#b3936e'); rectangle(76, 658, 30, 62, '#9b805f'); rectangle(1160, 658, 30, 62, '#9b805f');
    for (let i = 0; i < 11; i++) line([10, 460 + i * 16, 1270, 460 + i * 16], '#aa86551c', 1);
    const oldRotation = action?.fromInverted ? 1 : 0; const targetRotation = state.pc.inverted ? 1 : 0;
    const rotation = action && ['rotate', 'upright'].includes(action.kind) && progress < 1 ? oldRotation + (targetRotation - oldRotation) * (1 - (1 - progress) ** 3) : targetRotation;
    drawMonitor(state, time, rotation); drawCase(state, time, progress);
    rectangle(239, 564, 305, 41, '#515d61', 5); for (let y = 0; y < 3; y++) for (let x = 0; x < 18; x++) rectangle(248 + x * 16, 570 + y * 10, 12, 6, '#7b8585', 1);
    ellipse(581, 587, 18, 25, '#57656a'); line([581, 566, 581, 582], '#afbab8', 1);
    ctx.save(); ctx.translate(643, 549); ctx.rotate(-.18); rectangle(-42, -11, 84, 22, '#4e6774', 5); rectangle(40, -5, 63, 10, '#afb9b9', 2); ctx.restore();
    if (!state.pc.drive) { rectangle(660, 598, 88, 16, '#3e77a0', 2); text('2 TB ?', 704, 610, 10, '#e1edf0', 500, 'center'); }
    if (!state.pc.usb) { rectangle(702, 488, 47, 20, '#4880ab', 3); rectangle(747, 491, 17, 14, '#b5b9b1', 2); }
    rectangle(568, 487, 67, 37, '#e2d9ba', 4); ellipse(635, 501, 13, 12, '#e2d9ba'); ellipse(632, 501, 7, 7, '#d5b58c'); text('CTRL', 600, 511, 12, '#777460', 700, 'center');
    if (reaching && state.coffeeUntil <= now) {
      const swing = Math.sin(progress * Math.PI);
      const monitorAction = ['rotate', 'upright'].includes(action.kind);
      const target = monitorAction ? [459, 315] : [934, 339];
      const hand = [641 + (target[0] - 641) * swing, 471 + (target[1] - 471) * swing];
      line([655, 379, 695, 429, hand[0], hand[1]], '#455e73', 30); ellipse(hand[0], hand[1], 17, 13, '#dca384');
    }
    if (state.coffeeUntil > now) { text('BIN KURZ KAFFEE HOLEN', 593, 286, 16, '#6a7476', 700, 'center'); }
    // The close-up is a second camera crop of the same drawn world, not a separate clip.
    if (state.cameraUntil > now) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const crop = { x: canvas.width * .59, y: canvas.height * .28, w: canvas.width * .33, h: canvas.height * .54 };
      ctx.drawImage(canvas, crop.x, crop.y, crop.w, crop.h, 0, 0, canvas.width, canvas.height); ctx.restore();
      text('WERKBANK · NAHAUFNAHME', 28, 37, 18, '#e7eef1', 700);
    } else {
      rectangle(1006, 529, 238, 164, '#313b46', 5); rectangle(1012, 535, 226, 152, '#c5c4b7', 2);
      ctx.save(); ctx.beginPath(); ctx.rect(1012, 535, 226, 152); ctx.clip(); person(1125, 598, 1.05, time, talking, false, state.coffeeUntil > now); ctx.restore();
      rectangle(1006, 665, 238, 28, '#1a252f'); text('FINNBAUT', 1020, 685, 14, '#f2f4f1', 700); text('0,20 €', 1231, 685, 14, '#9bc4b4', 700, 'right');
    }
    // Native broadcast overlays are part of the fictional camera image.
    rectangle(24, 21, 80, 29, '#b32c39', 3); text('LIVE', 64, 42, 17, '#fff', 700, 'center');
    text(state.cameraUntil > now ? 'KAMERA 2' : 'WERKBANK 1', 1194, 38, 14, '#677273', 700, 'right');
  }
  return { draw, setQuality(value) { quality = [360, 480, 720].includes(value) ? value : 720; } };
}

export function createStudioAudio() {
  let context, gain, noise, fanGain;
  let enabled = false;
  function init() {
    if (context) return;
    const Audio = globalThis.AudioContext || globalThis.webkitAudioContext; if (!Audio) return;
    context = new Audio(); gain = context.createGain(); gain.gain.value = .35; gain.connect(context.destination);
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate); const data = buffer.getChannelData(0);
    let n = 1761; for (let i = 0; i < data.length; i++) { n = (Math.imul(n, 1664525) + 1013904223) >>> 0; data[i] = n / 4294967296 * 2 - 1; }
    noise = context.createBufferSource(); noise.buffer = buffer; noise.loop = true;
    const filter = context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 420;
    fanGain = context.createGain(); fanGain.gain.value = 0; noise.connect(filter).connect(fanGain).connect(gain); noise.start();
  }
  return {
    async enable(volume = .35) { init(); if (!context) return false; await context.resume(); enabled = true; gain.gain.value = volume; return true; },
    mute() { enabled = false; if (gain) gain.gain.value = 0; },
    volume(value) { if (gain && enabled) gain.gain.value = value; },
    update(state, paused = false) { if (fanGain && context) fanGain.gain.setTargetAtTime(enabled && !paused && state.pc.power ? .035 + Math.max(0, state.temperature - 35) * .0011 : 0, context.currentTime, .4); },
    play(kind) {
      if (!enabled || !context) return;
      const time = context.currentTime; const oscillator = context.createOscillator(); const envelope = context.createGain(); oscillator.connect(envelope).connect(gain);
      const musical = ['notification', 'success', 'raid'].includes(kind); oscillator.type = musical ? 'sine' : 'triangle';
      const frequency = { power: 140, plug: 320, click: 790, peel: 1700, zip: 480, move: 190, off: 82, game: 280, notification: 659, success: 784, raid: 523 }[kind] || 450;
      oscillator.frequency.setValueAtTime(frequency, time); oscillator.frequency.exponentialRampToValueAtTime(musical ? frequency * 1.5 : frequency * .35, time + .13);
      envelope.gain.setValueAtTime(.0001, time); envelope.gain.exponentialRampToValueAtTime(musical ? .12 : .055, time + .008); envelope.gain.exponentialRampToValueAtTime(.0001, time + (musical ? .42 : .11));
      oscillator.start(time); oscillator.stop(time + .5);
    },
    dispose() { noise?.stop(); context?.close(); }
  };
}
