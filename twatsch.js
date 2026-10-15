import { CHANNEL, REWARDS, GOAL_NAMES } from './twatsch-content.js';
import { STREAM_KEY, loadStream, advanceStream, postViewerMessage, currentGoal, screenState, streamTitle, votePoll, redeemReward } from './twatsch-engine.js';
import { createStudio, createStudioAudio } from './twatsch-scene.js';

const shapes = {
  play: '<path d="m8 5 11 7-11 7Z"/>', pause: '<path d="M8 5v14M16 5v14"/>',
  volume: '<path d="m4 9 4 0 5-4v14l-5-4H4zM17 8q5 4 0 8"/>', muted: '<path d="m4 9 4 0 5-4v14l-5-4H4zM17 9l5 6M22 9l-5 6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="m9 3 6 0 1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1Z"/>',
  theater: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M17 5v14"/>', full: '<path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6"/>',
  heart: '<path d="M12 21 3 12C-3 3 8-1 12 6c4-7 15-3 9 6Z"/>', search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 9h.1M16 9h.1M8 14q4 5 8 0"/>', chevron: '<path d="m8 5 7 7-7 7"/>', points: '<path d="m12 2 8 5v10l-8 5-8-5V7Z"/><path d="m8 10 4-3 4 3v4l-4 3-4-3Z"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${shapes[name] || shapes.play}</svg>`;
const elapsedText = milliseconds => { const seconds = Math.max(0, Math.floor(milliseconds / 1000)); return `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor(seconds / 60) % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; };

export function clearTwatsch() { try { localStorage.removeItem(STREAM_KEY); } catch {} }

export function mountTwatsch(api) {
  const { app, escape: e, portals, homeURL, toast } = api;
  const state = loadStream(undefined, Date.now(), crypto.getRandomValues(new Uint32Array(1))[0]);
  document.title = 'FinnBaut - Twatsch';
  const logo = '<svg class="tw-brand-mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M5 3h25v18l-8 8h-7l-5 3v-7H5Z" fill="currentColor"/><path d="M10 7h16v12l-5 5h-6v-4h-5Z" fill="#0e0e10"/><path d="M16 10v7m6-7v7" stroke="currentColor" stroke-width="3"/></svg>';
  app.innerHTML = `<div class="site-page twatsch-page"><div class="return-bar"><a href="#/">← Zurück zu Gurgel</a><span>twatsch.invalid</span><button data-action="parody">Parodie</button></div>
    <header class="tw-header"><a class="tw-brand" href="${homeURL('twatsch')}" aria-label="Twatsch Startseite">${logo}<strong>Twatsch</strong></a><button class="tw-browse" data-tw="browse">Durchsuchen</button><form class="tw-search" data-form="twatsch-search"><input name="channel" aria-label="Twatsch durchsuchen" placeholder="Suchen" maxlength="100" autocomplete="off"><button aria-label="Kanal suchen">${icon('search')}</button><div class="tw-search-results hidden"></div></form><div class="tw-header-actions"><button class="icon-button apps-button" data-action="apps" aria-label="Gurgel-Apps"><span class="dots">${'<i></i>'.repeat(9)}</span></button><button class="tw-login" data-world="service-account" data-site="twatsch">${e(portals.viewer() || 'Anmelden')}</button></div></header>
    <div class="tw-shell"><aside class="tw-sidebar"><div class="tw-sidebar-heading">FÜR DICH</div><h2>Empfohlener Kanal</h2><a class="tw-side-channel" href="${homeURL('twatsch')}"><span class="tw-finn-avatar">F</span><span><b>FinnBaut</b><small>Basteln & Hardware</small></span><i></i><small class="tw-side-count">1,8 Tsd.</small></a><p>Ein Kanal.<br>Genug Baustellen.</p><div class="tw-side-bottom">Alles Fake.<br>Auch der Preis ist verdächtig.</div></aside>
    <div class="tw-content"><div class="tw-watch"><main class="tw-video-column"><section class="tw-player" aria-label="Livestream von FinnBaut"><canvas class="tw-studio" width="1280" height="720" role="img" aria-label="Finn baut einen PC zusammen. HDMI steckt im falschen Anschluss."></canvas><div class="tw-caption" aria-live="off"><b>Finn</b><span></span></div><div class="tw-paused hidden"><b>Wiedergabe pausiert</b><span>Der Stream läuft währenddessen weiter.</span><button data-tw="live">Zum Livestream</button></div><div class="tw-buffer hidden"><span></span></div><div class="tw-controls"><button data-tw="pause" aria-label="Wiedergabe pausieren">${icon('pause')}</button><button data-tw="sound" aria-label="Ton einschalten" title="Ton einschalten: Lüfter, Werkbank und Alerts">${icon('muted')}</button><input class="tw-volume" type="range" min="0" max="1" step="0.05" value="${state.preferences.volume}" aria-label="Stream-Lautstärke"><button class="tw-live" data-tw="live"><i></i> LIVE</button><span class="tw-controls-spacer"></span><button data-tw="captions" aria-label="Untertitel ausschalten" title="Untertitel">CC</button><button data-tw="settings" aria-label="Wiedergabeeinstellungen" aria-expanded="false">${icon('gear')}</button><button data-tw="theater" aria-label="Theatermodus" aria-pressed="false">${icon('theater')}</button><button data-tw="full" aria-label="Vollbild">${icon('full')}</button></div><div class="tw-quality-panel hidden"><label>Qualität<select aria-label="Stream-Qualität"><option value="720">720p · Quelle</option><option value="480">480p</option><option value="360">360p</option></select></label><small>Ton: Werkbank, Lüfter & Alerts</small></div></section>
    <section class="tw-channel-info"><div class="tw-channel-top"><span class="tw-finn-avatar large">F<span>LIVE</span></span><div class="tw-channel-heading"><h1>FinnBaut <span aria-label="Verifiziert">✓</span></h1><p class="tw-stream-title">${e(streamTitle(state))}</p></div><button class="tw-follow ${state.followed ? 'followed' : ''}" data-tw="follow">${icon('heart')}<span>${state.followed ? 'Gefolgt' : 'Folgen'}</span></button></div><div class="tw-stream-meta"><a href="${homeURL('twatsch')}">Basteln & Hardware</a><span class="tw-tag">Deutsch</span><span class="tw-tag">PC-Bau</span><div class="tw-live-meta"><span class="tw-viewers" aria-label="Zuschauer">● 1.837</span><time class="tw-uptime">${elapsedText(Date.now() - state.startedAt)}</time></div></div></section></main>
    <aside class="tw-chat" aria-label="Stream-Chat"><header><button data-tw="chat-collapse" aria-label="Chat einklappen">›</button><h2>STREAM-CHAT</h2><button data-tw="chat-settings" aria-label="Chat-Einstellungen">⋮</button></header><div class="tw-pinned"><span>◆</span><p>Tipps bitte konkret. Finn interpretiert sonst die Möbel.</p></div><section class="tw-poll hidden" aria-label="Kanalabstimmung"></section><div class="tw-chat-log" role="log" aria-label="Chatverlauf" aria-live="off"></div><button class="tw-new-messages hidden" data-tw="latest">↓ Neue Nachrichten</button><div class="tw-chat-bottom"><div class="tw-chat-as">Du chattest als <button data-tw="nickname">${e(portals.viewer() || state.guest)}</button><span>3 Sek. Verzögerung</span></div><form data-form="twatsch-chat"><label class="tw-sr-only" for="tw-message">Nachricht an FinnBaut</label><textarea id="tw-message" name="message" rows="2" maxlength="240" placeholder="Eine Nachricht senden" required></textarea><div class="tw-chat-compose-actions"><button type="button" class="tw-points" data-tw="rewards" aria-label="Schraubenpunkte einlösen">${icon('points')}<span>${state.points.toLocaleString('de-DE')}</span></button><button type="button" class="tw-emote-button" data-tw="emotes" aria-label="Emotes">${icon('smile')}</button><button class="tw-send">Chat</button></div><p class="tw-chat-feedback" role="status"></p></form></div><div class="tw-emotes hidden">${['LUL', 'Pog', 'F', 'KABEL', '🪛', '🧯'].map(emote => `<button data-tw="emote" data-value="${e(emote)}">${emote}</button>`).join('')}</div><div class="tw-chat-preferences hidden"><label><input type="checkbox" class="tw-timestamps" ${state.preferences.timestamps ? 'checked' : ''}> Zeitstempel</label><label><input type="checkbox" class="tw-transcript" ${state.preferences.transcript ? 'checked' : ''}> Finns Untertitel im Chat behalten</label><label><input type="checkbox" class="tw-announcements"> Neue Nachrichten vorlesen lassen <small>(Screenreader)</small></label></div></aside><button class="tw-chat-reopen hidden" data-tw="chat-collapse">Chat öffnen</button></div>
    <section class="tw-about"><div><h2>Über FinnBaut</h2><p class="tw-followers">${(CHANNEL.followers + (state.followed ? 1 : 0)).toLocaleString('de-DE')} Follower</p><p>${CHANNEL.description}</p><p>Der Kanal läuft weiter, während du woanders bist. Nachrichten kommen mit etwas Verzögerung bei Finn an. Er liest nicht alles, merkt sich aber manche Tipps erstaunlich lange.</p><small>Fiktiver Stream mit animierter Werkbank und simuliertem Chat. Keine echten Zuschauer, Zahlungen oder Sprachaufnahmen.</small></div><div class="tw-setup"><h3>Das heutige Setup</h3><a href="${homeURL('buyazon', { q: 'Gaming-PC' })}"><span>buyazon</span><b>Gaming-PC mit RTX Irgendwas</b><strong>0,20 €</strong></a><p>128 GB RAM laut Karton. Ein Lüfter laut Nachbarn.</p><p>Nächster Stream: sobald das Ersatzteil da ist.</p></div></section><footer class="tw-footer">Twatsch · Alles Fake, nicht ernst gemeint. Deine Nachrichten und der Verlauf bleiben in diesem Browser.</footer></div></div></div>`;

  const root = app.querySelector('.twatsch-page'); const player = root.querySelector('.tw-player');
  const canvas = root.querySelector('canvas'); const studio = createStudio(canvas); studio.setQuality(state.preferences.quality);
  const audio = createStudioAudio(); const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const log = root.querySelector('.tw-chat-log'); const input = root.querySelector('#tw-message');
  let disposed = false, paused = false, sound = false, theater = false, frameId, lastFrame = 0, lastUI = 0, lastSave = 0;
  let lastMessage = 0, lastSound = state.soundSequence, lastPoll = 0, atBottom = true, bufferingUntil = 0;
  let completedMail = state.completionMail || false;
  const viewer = () => portals.viewer() || state.guest;
  const save = () => { try { localStorage.setItem(STREAM_KEY, JSON.stringify(state)); } catch {} };
  function feedback(text) { root.querySelector('.tw-chat-feedback').textContent = text; }
  function appendMessages() {
    const fresh = state.messages.filter(message => message.id > lastMessage);
    if (!fresh.length) return;
    const shouldScroll = atBottom;
    fresh.forEach(message => {
      const row = document.createElement('div'); row.className = `tw-chat-line${message.spoken ? ' spoken' : ''}${message.role === 'viewer' ? ' own' : ''}`;
      row.dataset.message = message.id;
      const time = new Date(message.at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      const badge = { mod: '◆', vip: '♦', sub: '▣', streamer: '♛', viewer: '' }[message.role] || '';
      row.innerHTML = `<time>${time}</time>${badge ? `<span class="tw-chat-badge ${message.role}" title="${message.role === 'mod' ? 'Moderatorin' : message.role === 'streamer' ? 'Streamer' : message.role === 'vip' ? 'VIP' : 'Abonnent'}">${badge}</span>` : ''}<b style="color:${message.color}">${e(message.name)}</b><span>${e(message.text)}</span>`;
      log.append(row); lastMessage = message.id;
    });
    while (log.children.length > 140) log.firstElementChild.remove();
    if (shouldScroll) log.scrollTop = log.scrollHeight; else root.querySelector('.tw-new-messages').classList.remove('hidden');
    root.classList.toggle('show-timestamps', state.preferences.timestamps);
    root.classList.toggle('tw-show-transcript', Boolean(state.preferences.transcript));
  }
  function updatePoll() {
    const panel = root.querySelector('.tw-poll'); const poll = state.poll;
    if (!poll || (poll.finished && state.now > poll.endsAt + 20000)) { panel.classList.add('hidden'); return; }
    panel.classList.remove('hidden');
    if (poll.id !== lastPoll) {
      panel.innerHTML = `<div><b>${e(poll.question)}</b><time></time></div>${poll.options.map((option, i) => `<button data-tw="vote" data-index="${i}"><i></i><span>${e(option.text)}</span><small></small></button>`).join('')}<p></p>`;
      lastPoll = poll.id;
    }
    const total = poll.options.reduce((sum, row) => sum + row.votes, 0);
    panel.querySelector('time').textContent = poll.finished ? 'BEENDET' : `${Math.max(0, Math.ceil((poll.endsAt - state.now) / 1000))} Sek.`;
    panel.querySelectorAll('button').forEach((button, i) => { button.disabled = poll.finished || poll.vote !== null; button.classList.toggle('voted', poll.vote === i); button.querySelector('i').style.width = `${poll.options[i].votes / total * 100}%`; button.querySelector('small').textContent = `${poll.options[i].votes}`; });
    panel.querySelector('p').textContent = poll.finished ? `Ergebnis: ${poll.winner.text}` : poll.vote !== null ? 'Deine Stimme wurde gezählt.' : 'Eine Stimme pro Zuschauer.';
  }
  function updateUI(now) {
    appendMessages(); updatePoll();
    const title = streamTitle(state); root.querySelector('.tw-stream-title').textContent = title;
    root.querySelector('.tw-uptime').textContent = elapsedText(now - state.startedAt);
    const viewers = 1837 + Math.round(Math.sin((now - state.startedAt) / 49000) * 34) + (state.followed ? 1 : 0);
    root.querySelector('.tw-viewers').textContent = `● ${viewers.toLocaleString('de-DE')}`; root.querySelector('.tw-side-count').textContent = `${(viewers / 1000).toFixed(1).replace('.', ',')} Tsd.`;
    const caption = root.querySelector('.tw-caption'); caption.classList.toggle('hidden', !state.preferences.captions || !state.caption || state.caption.until <= now || paused);
    caption.querySelector('span').textContent = state.caption?.text || '';
    root.querySelector('.tw-points span').textContent = state.points.toLocaleString('de-DE');
    root.querySelector('.tw-chat-as>button').textContent = viewer();
    root.querySelector('.tw-chat-as>span').textContent = state.silenceUntil > now ? `Slowmode: ${Math.ceil((state.silenceUntil - now) / 1000)} Sek.` : '3 Sek. Verzögerung';
    canvas.setAttribute('aria-label', `Finns Werkbank. ${GOAL_NAMES[currentGoal(state)]}. Monitor ${state.pc.inverted ? 'auf dem Kopf' : 'richtig herum'}. Temperatur ${Math.round(state.temperature)} Grad. ${screenState(state) === 'signal' ? 'Kein Bildsignal.' : `Bild: ${screenState(state)}.`}`);
    const cc = root.querySelector('[data-tw="captions"]'); cc.classList.toggle('selected', state.preferences.captions); cc.setAttribute('aria-label', state.preferences.captions ? 'Untertitel ausschalten' : 'Untertitel einschalten');
    if (state.celebration && !completedMail) { completedMail = true; state.completionMail = true; if (portals.viewer()) portals.streamMail('Der 20-Cent-PC läuft. Bitte kurz nicht anfassen.', `FinnBaut hat es geschafft. ${state.bootCount} Startversuche, ${state.protections} Temperaturabschaltungen. Der PC bleibt jetzt im Langzeittest. Diese Mail wäre dafür nicht erforderlich gewesen.`); }
  }
  function frame(now) {
    if (disposed) return;
    const wall = Date.now(); advanceStream(state, wall, !document.hidden && !paused);
    if (!document.hidden && now - lastFrame >= 33) {
      if (!paused && wall >= bufferingUntil) studio.draw(state, wall, reduced.matches);
      root.querySelector('.tw-buffer').classList.toggle('hidden', wall >= bufferingUntil);
      if (state.sound && state.sound.id > lastSound) { if (!paused) audio.play(state.sound.kind); lastSound = state.sound.id; }
      audio.update(state, paused); lastFrame = now;
    }
    if (now - lastUI >= 500) { updateUI(wall); lastUI = now; }
    if (wall - lastSave > 4500) { save(); lastSave = wall; }
    frameId = requestAnimationFrame(frame);
  }
  const updatePause = () => {
    root.querySelector('.tw-paused').classList.toggle('hidden', !paused);
    const button = root.querySelector('[data-tw="pause"]'); button.innerHTML = icon(paused ? 'play' : 'pause'); button.setAttribute('aria-label', paused ? 'Livestream fortsetzen' : 'Wiedergabe pausieren');
    root.querySelector('.tw-live').classList.toggle('behind', paused);
  };
  function submit(event) {
    const form = event.target.closest('form'); if (!form) return;
    if (form.dataset.form === 'twatsch-chat') {
      event.preventDefault(); const result = postViewerMessage(state, input.value, viewer());
      if (result.accepted) { input.value = ''; feedback(''); atBottom = true; input.focus(); } else feedback(result.reason);
      updateUI(Date.now()); save();
    }
    if (form.dataset.form === 'twatsch-search') { event.preventDefault(); searchChannels(); }
  }
  function searchChannels() {
    const query = root.querySelector('.tw-search input').value.toLowerCase(); const matches = !query || /finn|pc|hardware|buyazon|bastel|20|live/.test(query);
    const result = root.querySelector('.tw-search-results'); result.classList.remove('hidden');
    result.innerHTML = matches ? `<a href="${homeURL('twatsch')}"><span class="tw-finn-avatar">F</span><div><b>FinnBaut</b><small>LIVE · ${e(streamTitle(state))}</small></div></a>` : '<p>Kein weiterer Kanal gefunden. Finn hat heute genug zu tun.</p>';
  }
  function showRewards() {
    portals.openStreamDialog('Schraubenpunkte einlösen', `<p>Du hast <b>${state.points.toLocaleString('de-DE')}</b> Schraubenpunkte. Beim Zuschauen kommen weitere dazu.</p><div class="tw-reward-list">${REWARDS.map(reward => `<button data-tw-reward="${reward.id}" ${state.points < reward.cost ? 'disabled' : ''}><b>${reward.title}<span>${reward.cost}</span></b><small>${reward.description}</small></button>`).join('')}</div><p class="dialog-note">Fiktive Kanalpunkte. Kein Geld und keine Zahlung.</p>`, 'tw-reward-dialog');
  }
  async function click(event) {
    const button = event.target.closest('[data-tw]'); if (!button) return;
    const kind = button.dataset.tw;
    if (kind === 'pause') { paused = !paused; updatePause(); }
    if (kind === 'live') { paused = false; bufferingUntil = Date.now() + 250; updatePause(); }
    if (kind === 'sound') {
      try { if (sound) { audio.mute(); sound = false; } else sound = await audio.enable(state.preferences.volume); }
      catch { if (!disposed) toast('Ton bitte noch einmal über die Lautsprechertaste einschalten.'); }
      if (!disposed) { button.innerHTML = icon(sound ? 'volume' : 'muted'); button.setAttribute('aria-label', sound ? 'Ton ausschalten' : 'Ton einschalten'); }
    }
    if (kind === 'captions') { state.preferences.captions = !state.preferences.captions; updateUI(Date.now()); }
    if (kind === 'settings') { const panel = root.querySelector('.tw-quality-panel'); panel.classList.toggle('hidden'); button.setAttribute('aria-expanded', !panel.classList.contains('hidden')); }
    if (kind === 'theater') { theater = !theater; root.classList.toggle('tw-theater', theater); button.setAttribute('aria-pressed', theater); }
    if (kind === 'full') { try { if (document.fullscreenElement) await document.exitFullscreen(); else await player.requestFullscreen(); } catch { toast('Vollbild ist hier nicht verfügbar. Der Theatermodus geht auch.'); } }
    if (kind === 'latest') { atBottom = true; log.scrollTop = log.scrollHeight; button.classList.add('hidden'); }
    if (kind === 'emotes') root.querySelector('.tw-emotes').classList.toggle('hidden');
    if (kind === 'emote') { input.value = `${input.value}${input.value ? ' ' : ''}${button.dataset.value}`.slice(0, 240); root.querySelector('.tw-emotes').classList.add('hidden'); input.focus(); }
    if (kind === 'follow') { state.followed = !state.followed; state.followedAt = Date.now(); button.classList.toggle('followed', state.followed); button.querySelector('span').textContent = state.followed ? 'Gefolgt' : 'Folgen'; root.querySelector('.tw-followers').textContent = `${(CHANNEL.followers + (state.followed ? 1 : 0)).toLocaleString('de-DE')} Follower`; if (state.followed && portals.viewer()) portals.streamFollow(); }
    if (kind === 'vote') { votePoll(state, Number(button.dataset.index)); updatePoll(); }
    if (kind === 'rewards') showRewards();
    if (kind === 'nickname') { if (portals.viewer()) portals.showAccount('twatsch'); else portals.openStreamDialog('Dein Name im Chat', `<form data-form="twatsch-nickname"><label>Fiktiver Chatname<input name="nickname" maxlength="30" value="${e(state.guest)}" required autocomplete="off"></label><button class="primary-button">Im Chat verwenden</button></form><p class="dialog-note">Oder mit Gähmail auf allen Seiten dasselbe Spaßkonto verwenden.</p>`); }
    if (kind === 'chat-settings') root.querySelector('.tw-chat-preferences').classList.toggle('hidden');
    if (kind === 'chat-collapse') { root.classList.toggle('tw-chat-closed'); root.querySelector('.tw-chat-reopen').classList.toggle('hidden', !root.classList.contains('tw-chat-closed')); }
    if (kind === 'browse') { root.querySelector('.tw-search input').value = ''; searchChannels(); }
    save();
  }
  function settingsChange(event) {
    if (event.target.matches('.tw-volume')) { state.preferences.volume = Number(event.target.value); audio.volume(state.preferences.volume); }
    if (event.target.matches('.tw-quality-panel select')) { state.preferences.quality = Number(event.target.value); studio.setQuality(state.preferences.quality); bufferingUntil = Date.now() + 650; root.querySelector('.tw-quality-panel').classList.add('hidden'); root.querySelector('[data-tw="settings"]').setAttribute('aria-expanded', 'false'); }
    if (event.target.matches('.tw-timestamps')) { state.preferences.timestamps = event.target.checked; root.classList.toggle('show-timestamps', state.preferences.timestamps); }
    if (event.target.matches('.tw-transcript')) { state.preferences.transcript = event.target.checked; root.classList.toggle('tw-show-transcript', state.preferences.transcript); log.scrollTop = log.scrollHeight; }
    if (event.target.matches('.tw-announcements')) log.setAttribute('aria-live', event.target.checked ? 'polite' : 'off');
    save();
  }
  function inputEvent(event) { if (event.target.matches('.tw-search input')) searchChannels(); if (event.target.matches('.tw-volume')) settingsChange(event); }
  function keydown(event) { if (event.target === input && event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); input.closest('form').requestSubmit(); } if (event.key === 'Escape') root.querySelectorAll('.tw-emotes,.tw-quality-panel,.tw-chat-preferences,.tw-search-results').forEach(element => element.classList.add('hidden')); }
  function scroll() { atBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 45; if (atBottom) root.querySelector('.tw-new-messages').classList.add('hidden'); }
  function visibility() { advanceStream(state, Date.now()); if (document.hidden) audio.update(state, true); else updateUI(Date.now()); save(); }
  function dialogClick(event) { const button = event.target.closest('[data-tw-reward]'); if (!button || disposed) return; const result = redeemReward(state, button.dataset.twReward, viewer()); portals.closeStreamDialog(); if (!result.ok) feedback(result.reason); else { feedback(`Eingelöst: ${result.reward.title}`); atBottom = true; } updateUI(Date.now()); save(); }
  function dialogSubmit(event) { if (event.target.dataset.form !== 'twatsch-nickname' || disposed) return; event.preventDefault(); state.guest = String(new FormData(event.target).get('nickname')).trim().slice(0, 30) || state.guest; portals.closeStreamDialog(); updateUI(Date.now()); save(); }
  root.querySelector('.tw-quality-panel select').value = state.preferences.quality;
  root.addEventListener('submit', submit); root.addEventListener('click', click); root.addEventListener('change', settingsChange); root.addEventListener('input', inputEvent); root.addEventListener('keydown', keydown);
  log.addEventListener('scroll', scroll); document.addEventListener('visibilitychange', visibility); window.addEventListener('pagehide', save);
  api.dialog.addEventListener('click', dialogClick); api.dialog.addEventListener('submit', dialogSubmit);
  updateUI(Date.now()); studio.draw(state, Date.now(), reduced.matches); save(); frameId = requestAnimationFrame(frame);
  return () => {
    if (disposed) return; save(); disposed = true; cancelAnimationFrame(frameId); audio.dispose();
    root.removeEventListener('submit', submit); root.removeEventListener('click', click); root.removeEventListener('change', settingsChange); root.removeEventListener('input', inputEvent); root.removeEventListener('keydown', keydown);
    log.removeEventListener('scroll', scroll); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('pagehide', save);
    api.dialog.removeEventListener('click', dialogClick); api.dialog.removeEventListener('submit', dialogSubmit);
  };
}
