import { generateResults, chooseSearchSeed, normalize, suggestions, wikiIntro, topicFact, sites as searchSites, catalog } from './engine.js';
import { advanceChat, createChatState } from './chat-engine.js';
import { mountVideoScene, sceneLabel } from './video-scenes.js';
import { articleCopy } from './news-copy.js';
import { extraSites, clockTime, shuffled } from './world-content.js';
import { createPortals } from './portals.js';
import { variedCopy } from './parody-copy.js';
const sites = { ...searchSites, ...extraSites };

const app = document.querySelector('#app');
const dialog = document.querySelector('#dialog');
const toastElement = document.querySelector('#toast');
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const money = value => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
const icons = {
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  back: '<path d="m14 5-7 7 7 7M7 12h14"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>',
  lens: '<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3"/><circle cx="12" cy="12" r="4"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  cart: '<path d="M2 3h3l3 13h11l3-10H6M10 20h.1M18 20h.1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  like: '<path d="M7 21H3V10h4m0 11h12l2-12h-7l1-5-3-2-5 9Z"/>',
  send: '<path d="m5 12 7-7 7 7M12 5v15"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 5 5 3-3 4 4"/>'
};
const icon = (name, className = '') => `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.search}</svg>`;
const logo = (className = '') => `<a href="#/" class="gurgel-logo ${className}" aria-label="Gurgel Startseite"><span>G</span><span>u</span><span>r</span><span>g</span><span>e</span><span>l</span></a>`;
const readStorage = (key, fallback = null) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const writeStorage = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Private browsing works without storage. */ } };
let current = null;
let routeVersion = 0;
let loadingTimer;
let toastTimer;
let selectedSuggestion = -1;
let chats = [];
let chatState = createChatState();
let chatVersion = 0;
let playback = 0;
let disposeVideoScene = null;
let profile = null;
let settings = readStorage('gurgel-settings', { loading: true });
let cart = readStorage('gurgel-cart', []);
let recentSearches = [];
const portals = createPortals({ app, dialog, escape, money, toast, openDialog, homeURL, routeURL, siteHeader, thumbnail, sites, generateResults, renderRoute, getCurrent: () => current, syncProfile: name => { profile = name; } });
try { recentSearches = JSON.parse(sessionStorage.getItem('gurgel-pattern-memory-v2') || '[]'); recentSearches = Array.isArray(recentSearches) ? recentSearches.filter(entry => entry && Array.isArray(entry.families)) : []; } catch {}
function rememberSearch(model, seed, page = 1) {
  const queryHash = [...model.topic.query].reduce((hash, character) => Math.imul(hash ^ character.codePointAt(0), 16777619) >>> 0, 2166136261);
  const key = `${queryHash}:${seed}:${page}`;
  if (recentSearches.some(entry => entry.key === key)) return;
  recentSearches = [...recentSearches, { key, families: model.results.map(result => result.family) }].slice(-24);
  try { sessionStorage.setItem('gurgel-pattern-memory-v2', JSON.stringify(recentSearches)); } catch {}
}

function newSeed() { return crypto.getRandomValues(new Uint32Array(1))[0]; }
function homeURL(site, options = {}) {
  return `#/site/${site}?${new URLSearchParams({ q: '', s: newSeed(), ...options })}`;
}
function routeURL(query, { seed = newSeed(), page = 1, tab = 'all', site, id, offer } = {}) {
  const params = new URLSearchParams({ q: query, s: seed, page, tab });
  if (id) params.set('id', id);
  if (offer !== undefined && offer !== null) params.set('offer', offer);
  return `#/${site ? `site/${site}` : 'search'}?${params}`;
}
function search(query, options = {}) {
  if (!query.trim()) return;
  const seed = options.seed ?? chooseSearchSeed(query, recentSearches, newSeed());
  rememberSearch(generateResults(query, seed, options.page || 1), seed, options.page || 1);
  location.hash = routeURL(query.trim(), { ...options, seed });
}
function resultURL(result) { return routeURL(current.query, { ...current, site: result.site, id: result.id, offer: result.offer }); }
function image(result, className = '', invisible = false) {
  return `<img class="${className}${invisible ? ' invisible-product' : ''}" src="./assets/${result.asset}.svg" alt="${escape(invisible ? 'Unsichtbares Produkt, weißes Produktbild' : `Produktillustration: ${result.topic.name}`)}" width="480" height="340" loading="lazy">`;
}
function toast(message) {
  clearTimeout(toastTimer);
  toastElement.textContent = message;
  toastElement.classList.add('visible');
  toastTimer = setTimeout(() => toastElement.classList.remove('visible'), 3500);
}
function openDialog(title, content, className = '') {
  dialog.className = className;
  dialog.innerHTML = `<button class="icon-button dialog-close" data-action="close-dialog" aria-label="Schließen">${icon('close')}</button><h2>${escape(title)}</h2>${content}`;
  dialog.showModal();
}
function avatar() {
  return profile ? `<button class="avatar" data-action="account" aria-label="Konto: ${escape(profile)}">${escape(profile[0].toUpperCase())}</button>` : '<button class="sign-in" data-action="account">Anmelden</button>';
}
function appsButton() {
  return `<button class="icon-button apps-button" data-action="apps" aria-label="Gurgel-Apps"><span class="dots">${'<i></i>'.repeat(9)}</span></button>`;
}
function searchForm(query = '', className = '') {
  return `<form class="search-form ${className}" data-form="search" role="search" autocomplete="off"><div class="search-shell">${icon('search', 'search-leading')}<input type="search" name="q" maxlength="180" value="${escape(query)}" aria-label="Gurgel durchsuchen" aria-autocomplete="list" aria-controls="suggestions" aria-expanded="false" placeholder="" spellcheck="false"><button type="button" class="icon-button clear-search${query ? '' : ' hidden'}" data-action="clear-search" aria-label="Suche löschen">${icon('close')}</button><span class="search-divider"></span><button type="button" class="icon-button microphone" data-action="microphone" aria-label="Sprachsuche">${icon('mic')}</button><button type="button" class="icon-button lens" data-action="lens" aria-label="Bildersuche">${icon('lens')}</button><button class="icon-button search-submit" aria-label="Suchen">${icon('search')}</button></div><div class="suggestions hidden" id="suggestions" role="listbox"></div></form>`;
}
function footer(home = false) {
  return `<footer class="gurgel-footer ${home ? 'home-footer' : ''}"><div class="country">Deutschland</div><div class="footer-links"><div><button data-action="about">Über Gurgel</button><button data-action="about-search">Wie die Suche funktioniert</button></div><div><button data-action="parody">Parodie</button><button data-action="privacy">Datenschutz</button><button data-action="terms">Nutzungsbedingungen</button><button data-action="settings">Einstellungen</button></div></div></footer>`;
}
function renderHome() {
  document.title = 'Gurgel';
  app.innerHTML = `<div class="home-page"><header class="home-nav"><div><button data-action="about">Über Gurgel</button><a href="${homeURL('buyazon')}">Store</a></div><div><a href="${homeURL('gaehmail')}">Gähmail</a><a href="#/images?s=${newSeed()}">Bilder</a>${appsButton()}${avatar()}</div></header><main class="home-main">${logo()}${searchForm('', 'home-search')}<div class="home-search-actions"><button data-action="home-submit">Gurgel-Suche</button><button data-action="lucky">Auf gut Glück!</button></div><p class="language">Gurgel angeboten auf: <button data-action="language">English</button></p></main>${footer(true)}</div>`;
  queueMicrotask(() => app.querySelector('input[name="q"]')?.focus({ preventScroll: true }));
}
function searchHeader() {
  return `<header class="results-header"><div class="results-top">${logo('small')}${searchForm(current.query)}<div class="header-actions">${appsButton()}${avatar()}</div></div><nav class="search-tabs" aria-label="Suchtyp">${[['all', 'Alle'], ['images', 'Bilder'], ['shopping', 'Shopping'], ['videos', 'Videos'], ['news', 'News']].map(([key, name]) => `<a class="${current.tab === key ? 'active' : ''}" href="${routeURL(current.query, { ...current, tab: key })}"${current.tab === key ? ' aria-current="page"' : ''}>${name}</a>`).join('')}<button class="tools" data-action="tools">Suchfilter</button></nav></header>`;
}
function skeleton(site = false) {
  return `<div class="${site ? 'site-skeleton' : 'results-skeleton'}" aria-busy="true" aria-label="Seite wird geladen">${Array.from({ length: site ? 3 : 5 }, (_, i) => `<div class="skeleton-item"><span class="skeleton skeleton-source"></span><span class="skeleton skeleton-title" style="width:${60 + i % 3 * 10}%"></span><span class="skeleton skeleton-text"></span><span class="skeleton skeleton-text short"></span></div>`).join('')}</div>`;
}
function source(result) {
  const site = siteInfo(result.site, result);
  return `<div class="result-source"><span class="site-favicon" style="--site-color:${site.color}">${escape(site.letter)}</span><div><span class="source-name">${site.name}</span><span class="source-url">https://${site.domain} › ${site.path} › ${escape(result.topic.name.toLowerCase().replaceAll(' ', '-'))}</span></div><button class="result-more" data-action="result-info" aria-label="Informationen zu diesem Ergebnis">⋮</button></div>`;
}
function resultRow(result) {
  return `<article class="search-result">${source(result)}${result.site === 'youtuba' ? `<a class="video-result-media" href="${resultURL(result)}">${thumbnail(result, true)}</a>` : ''}<a class="result-title" href="${resultURL(result)}">${escape(result.title)}</a><p class="result-description">${escape(result.description)}</p>${result.site === 'buyazon' ? `<div class="result-rating"><span class="stars">★★★★<span>★</span></span> ${result.stars.replace('.', ',')} (${result.reviews.toLocaleString('de-DE')}) · ${money(result.price)} · Auf Lager</div>` : result.site === 'youtuba' ? `<div class="result-meta">${result.views} Aufrufe · ${result.age}</div>` : ''}${result.site === 'wickipedia' ? `<div class="sitelinks"><a href="${resultURL(result)}">Geschichte</a><span>·</span><a href="${resultURL(result)}">Verwendung</a><span>·</span><a href="${resultURL(result)}">Diskussion</a></div>` : ''}</article>`;
}
function thumbnail(result, small = false) {
  const bigText = sceneLabel(result);
  const variant = Number(result.id.split('-')[1]) || 0;
  return `<div class="thumbnail ${small ? 'small-thumbnail' : ''} theme-${variant % 3} genre-${result.genre || 'challenge'}">${image(result)}<span class="thumbnail-title">${escape(bigText)}</span><span class="thumbnail-arrow" aria-hidden="true">➜</span><span class="thumbnail-face" aria-hidden="true">${['😧', '🤨', '😳', '🧐', '😮'][variant % 5]}</span><span class="duration">${result.duration || portals.decorateVideo(result, current?.seed).duration}</span></div>`;
}
function relatedBlock(model) {
  return `<section class="related"><h2>Ähnliche Suchanfragen</h2><div class="related-grid">${model.related.map(query => `<a href="${routeURL(query)}" data-action="related-search" data-query="${escape(query)}">${icon('search')}<span>${escape(query)}</span></a>`).join('')}</div></section><nav class="pagination" aria-label="Ergebnisseiten"><div class="pagination-logo"><span>G</span>${Array.from({ length: 8 }, (_, i) => `<span class="${i === current.page - 1 ? 'red' : ''}">u</span>`).join('')}<span>rgel</span></div><div class="pagination-numbers">${[1, 2, 3, 4, 5, 6, 7, 8].map(page => `<a ${page === current.page ? 'class="current" aria-current="page"' : ''} href="${routeURL(current.query, { ...current, page })}">${page}</a>`).join('')}<a class="next" href="${routeURL(current.query, { ...current, page: current.page + 1 })}">Weiter ${icon('chevron')}</a></div></nav>`;
}
function shoppingOffers(model) {
  const products = model.results.filter(result => result.site === 'buyazon');
  const variants = [
    ['für draußen', 'Wetterfest, solange es drinnen bleibt.'],
    ['ohne Inhalt', 'Die Verpackung ist vollkommen leer. Sie sparen das Auspacken.'],
    ['mit Fernbedienung', 'Fernbedienung steuert aktuell die Garage des Verkäufers.'],
    ['gebraucht, wie neu', 'Wurde nur für das Produktfoto kurz angefasst.'],
    ['nur die Verpackung', 'Produkt wurde bereits von jemand anderem gekauft.'],
    ['mit Ladekabel', 'Ladekabel passt nicht. Sieht aber vollständig aus.']
  ];
  return [0.32, 6499, 49.99, 0.32, 899.9, 6.99].map((price, i) => ({ ...products[i % products.length], offer: i, price: i < products.length ? products[i].price : price, title: i < products.length ? products[i].title : `${model.topic.name} · ${variants[i][0]}`, description: i < products.length ? products[i].description : variants[i][1] }));
}
function renderResults(loading = false) {
  const model = current.model;
  document.title = `${current.query} - Gurgel-Suche`;
  let contents;
  if (loading) contents = skeleton();
  else if (current.tab === 'images') {
    contents = `<div class="image-results">${model.results.map(result => `<a class="image-result" href="${resultURL(result)}"><div class="image-frame">${result.site === 'youtuba' ? thumbnail(result) : image(result, '', /unsichtbar/i.test(result.title))}</div><span>${escape(result.title)}</span><small>${sites[result.site].name}</small></a>`).join('')}</div>`;
  } else if (current.tab === 'shopping') {
    const always = shoppingOffers(model);
    contents = `<div class="shopping-results">${always.map(result => `<a class="shopping-item" href="${resultURL(result)}">${image(result, '', /unsichtbar/i.test(result.title))}<p>${escape(result.title)}</p><strong>${money(result.price)}</strong><small>Buyazon · kostenloser Versand</small><span class="stars">★★★★☆</span></a>`).join('')}</div>`;
  } else {
    const filtered = current.tab === 'all' ? model.results : model.results.filter(result => result.site === (current.tab === 'videos' ? 'youtuba' : 'news'));
    contents = `<div class="results-list">${current.tab === 'all' ? portals.searchExtras(current.query) : ''}${filtered.map(resultRow).join('')}</div>${relatedBlock(model)}`;
  }
  app.innerHTML = `<div class="results-page">${searchHeader()}<main class="results-main ${['images', 'shopping'].includes(current.tab) ? 'wide-results' : ''}"><p class="results-stats">${loading ? 'Ergebnisse werden geladen …' : `Ungefähr ${model.count.toLocaleString('de-DE')} Ergebnisse (${model.seconds.replace('.', ',')} Sekunden)`}</p>${contents}</main>${footer()}</div>`;
}
function siteInfo(site, result = current?.result) {
  if (site === 'news' && !current?.id) return sites.news;
  const place = result?.place || current?.model?.results?.[0]?.place;
  return site === 'news' && place ? { ...sites.news, name: `Tagesblatt ${place}`, domain: `${normalize(place).replaceAll(' ', '-')}-tagesblatt.de` } : sites[site];
}
function siteHeader(site, extras = '') {
  const info = siteInfo(site);
  const logos = {
    buyazon: '<span class="buyazon-logo">buyazon<span class="buyazon-smile"></span><small>.de</small></span>',
    youtuba: '<span class="youtuba-logo"><span class="tube-mark">▶</span>YouTuba<sup>DE</sup></span>',
    wickipedia: '<span class="wicki-logo"><span class="wiki-globe">W</span><span>WICKIPEDIA<small>Die einigermaßen freie Enzyklopädie</small></span></span>',
    chatgpp: '<span class="chat-logo">ChatGPP <span>⌄</span></span>'
  };
  return `<div class="return-bar"><a href="${current.query ? routeURL(current.query, { ...current, site: null, id: null, offer: null }) : '#/'}">${icon('back')} Zurück zu Gurgel</a><span>${info.domain}</span><button data-action="parody">Parodie</button></div><header class="site-header ${site}-header"><a class="site-brand" href="${homeURL(site)}">${logos[site] || `<strong>${info.name}</strong>`}</a>${site !== 'chatgpp' ? `<form class="site-search" data-form="site-search"><input name="q" value="${escape(current.query)}" placeholder="${info.name} durchsuchen" aria-label="${info.name} durchsuchen" maxlength="180"><button aria-label="Suchen">${icon('search')}</button></form>` : ''}${extras}${!extras.includes('portal-account') ? `<button class="portal-account" data-world="service-account" data-site="${site}">${profile ? `Hallo, ${escape(profile)}` : 'Anmelden'}</button>` : ''}</header>`;
}
function renderSiteLoading(site) {
  app.innerHTML = `<div class="site-page ${site}-page">${siteHeader(site)}<main class="site-loading">${skeleton(true)}</main></div>`;
}
function renderBuyazon(result) {
  const invisible = /unsichtbar/i.test(result.title);
  document.title = `${result.title} : Buyazon.de`;
  app.innerHTML = `<div class="site-page buyazon-page">${siteHeader('buyazon', `<button class="cart-button" data-action="cart">${icon('cart')}<span>${cart.length}</span> Einkaufswagen</button>`)}<nav class="buyazon-nav"><button data-action="shop-all">${icon('menu')} Alle</button><button data-action="deals">Angebote</button><button data-action="delivery">Lieferung nach Hause</button><button data-action="service">Kundenservice</button><span>Prime. Kommt schon irgendwie.</span></nav><main class="product-main"><p class="breadcrumbs">Lebensmittel & mehr › ${escape(result.topic.name)} › Sie sind hier</p><div class="product-layout"><div class="product-gallery"><div class="product-thumbs"><button class="selected" data-action="product-image" data-view="front" aria-label="Produkt von vorne">${image(result, '', invisible)}</button><button data-action="product-image" data-view="back" aria-label="Produkt von hinten">${image(result, '', invisible)}</button></div><div class="product-photo">${image(result, '', invisible)}<span class="product-image-caption">Für eine größere Ansicht näher an den Bildschirm gehen.</span></div></div><section class="product-description"><a class="product-store" href="${routeURL(result.topic.name, { tab: 'shopping' })}">Besuche den völlig normalen Store</a><h1>${escape(result.title)}</h1><div class="product-rating"><span class="stars">★★★★☆</span><a href="#reviews" data-action="scroll-reviews">${result.reviews.toLocaleString('de-DE')} Bewertungen</a></div><span class="choice">Buyazon's Choice <span>für „${escape(result.topic.name)}“</span></span><hr><div class="product-price"><sup>€</sup>${Math.floor(result.price).toLocaleString('de-DE')}<sup>${String(Math.round(result.price * 100) % 100).padStart(2, '0')}</sup></div><p class="vat">Alle Preise inkl. Mehrwertsteuer. Falls zutreffend.</p><dl class="product-specs"><dt>Marke</dt><dd>Eine Marke</dd><dt>Zustand</dt><dd>Vorhanden${invisible ? ' (mutmaßlich)' : ''}</dd><dt>Farbe</dt><dd>Wie abgebildet</dd><dt>Lieferumfang</dt><dd>${escape(result.topic.name)}, soweit lieferbar</dd></dl><h2>Info zu diesem Artikel</h2><ul><li>${escape(result.description)}</li><li>${escape(topicFact(result.topic, 0))}</li><li>${escape(topicFact(result.topic, 1))}</li><li>Adresse und Zahlungsart werden aus Gründen der Einfachheit übersprungen.</li></ul></section><aside class="purchase-box"><strong>${money(result.price)}</strong><p><a href="#" data-action="delivery">KOSTENLOSE Lieferung</a> <b>gestern, vor 18 Uhr.</b></p><p class="delivery-location">Liefern an: Sie wissen schon</p><p class="stock">Auf Lager</p><label>Menge: <select id="quantity"><option>1</option><option>2</option><option>3</option><option>17</option></select></label><button class="add-cart" data-action="add-cart">In den Einkaufswagen</button><button class="buy-now" data-action="buy-now">Jetzt kaufen</button><p class="secure">🔒 Unsichere Transaktion</p><dl><dt>Versand</dt><dd>Buyazon</dd><dt>Verkäufer</dt><dd>Hat sich abgemeldet</dd><dt>Rückgabe</dt><dd>Bitte nicht</dd></dl></aside></div><section class="reviews" id="reviews"><h2>Kundenrezensionen</h2><div class="review-columns"></div></section></main><footer class="site-footer">Buyazon · Alle Bestellungen sind erfunden. Es wird nichts bezahlt oder geliefert.</footer></div>`;
  app.querySelector('.review-columns').innerHTML = portals.reviews(result, current.seed).map(row => `<article><span class="review-user">◉ ${escape(row.name)}</span><p class="stars">${'★'.repeat(row.stars)}${'☆'.repeat(5 - row.stars)} <b>${escape(row.title)}</b></p><small>Verifizierter Spaßkauf</small><p>${escape(row.text)}</p><button data-action="helpful">Nützlich</button></article>`).join('');
}
function renderYouTuba(result) {
  result = portals.decorateVideo(result, current.seed);
  current.result = result;
  document.title = `${result.title} - YouTuba`;
  const candidates = Array.from({ length: 12 }, (_, i) => {
    const seed = (current.seed + (i + 1) * 1009) >>> 0;
    return generateResults(current.query, seed, current.page).results.filter(item => item.site === 'youtuba').map(item => ({ ...item, seed }));
  }).flat();
  const recommendations = [...new Map([...portals.recommendations(current.seed), ...candidates].filter(item => item.title !== result.title).map(item => [item.title, item])).values()].slice(0, 6);
  app.innerHTML = `<div class="site-page youtuba-page">${siteHeader('youtuba', '<button class="icon-button" data-action="tube-menu" aria-label="Menü">'+icon('menu')+'</button>')}<main class="watch-layout"><section class="watch-main"><div class="video-player" id="video-player"><video id="experiment-video" src="./assets/${result.clip}" playsinline preload="metadata" aria-label="Stummer Clip"></video><div class="video-scene" id="video-scene">${thumbnail(result)}<div class="video-scene-text hidden"></div></div><button class="big-play" data-action="play" aria-label="Video abspielen">▶</button><div class="player-controls"><button data-action="play" id="play-button" aria-label="Abspielen">▶</button><span id="player-time">0:00 / ${result.duration}</span><input id="video-progress" type="range" min="0" max="${result.durationSeconds}" step="0.05" value="0" aria-label="Wiedergabeposition"><button data-action="fullscreen" aria-label="Vollbild">⛶</button></div></div><h1>${escape(result.title)}</h1><div class="video-actions"><div class="channel"><span class="channel-avatar">${escape(result.channelLetter)}</span><span><b>${escape(result.channel)}</b><small>${escape(result.subscribers)} Abonnenten</small></span><button class="subscribe" data-action="subscribe">Abonnieren</button></div><div class="video-actions-right"><button data-action="like">${icon('like')} <span>${result.likes.toLocaleString('de-DE')}</span></button><button data-action="share">Teilen</button><button data-action="save-video">Speichern</button></div></div><div class="video-description"><strong>${result.views} Aufrufe &nbsp; ${result.age}</strong><p>${escape(result.description)}</p><p>Teil 2 kommt, sobald wir die Kamera wiedergefunden haben.</p></div><section class="comments"><h2>3 Kommentare</h2><form data-form="comment"><span class="comment-avatar">D</span><input name="comment" aria-label="Kommentar hinzufügen" placeholder="Kommentar hinzufügen …" maxlength="300" required><button>Kommentieren</button></form><div id="comment-list"></div></section></section><aside class="recommended"><div class="recommended-tabs"><button class="selected" data-action="recommend-all">Alle</button><button data-action="recommend-related">Ähnlich</button></div>${recommendations.map(item => `<a class="recommended-video" href="${routeURL(item.topic.query || item.topic.name, { ...current, seed: item.seed, site: 'youtuba', id: item.id, offer: null })}">${thumbnail(item)}<div><h3>${escape(item.title)}</h3><small>${escape(portals.decorateVideo(item, item.seed).channel)}</small><small>${item.views} Aufrufe · ${item.age}</small></div></a>`).join('')}</aside></main><footer class="site-footer">YouTuba · Selbst gebaute, stumme Kurzclips.</footer></div>`;
  playback = 0;
  const video = app.querySelector('#experiment-video');
  video.src = `./assets/${result.clip}`;
  video.setAttribute('aria-label', `Stummer ${result.durationSeconds}-Sekunden-Clip: ${result.title}`);
  const slider = app.querySelector('#video-progress'); slider.max = result.durationSeconds;
  app.querySelector('.channel b').textContent = result.channel;
  app.querySelector('.channel-avatar').textContent = result.channelLetter;
  app.querySelector('.channel small').textContent = `${result.subscribers} Abonnenten`;
  const subscribe = app.querySelector('.subscribe'); subscribe.classList.toggle('subscribed', portals.isSubscribed(result.channel)); subscribe.textContent = portals.isSubscribed(result.channel) ? 'Abonniert' : 'Abonnieren';
  const comments = portals.comments(result, current.seed);
  app.querySelector('.comments form .comment-avatar').textContent = profile?.[0] || 'D';
  app.querySelector('.comments h2').textContent = `${comments.length} Kommentare`;
  app.querySelector('#comment-list').innerHTML = comments.map((row, i) => `<article><span class="comment-avatar ${['', 'purple', 'green'][i % 3]}">${escape(row.name[0].toUpperCase())}</span><div><b>@${escape(row.name)}</b><small>${row.age}</small><p>${escape(row.text)}</p></div></article>`).join('');
  app.querySelectorAll('.recommended-video').forEach((node, i) => { const item = portals.decorateVideo(recommendations[i], recommendations[i].seed); node.querySelector('.duration').textContent = item.duration; node.querySelector('small').textContent = item.channel; });
  app.querySelector('.video-description p:last-child').textContent = result.genre === 'kids' ? 'Eine MiniMöhren-Produktion. Der Karottenbus hält an jeder Farbe.' : result.genre === 'gem' ? 'Antwort vollständig. Keine Fortsetzung erforderlich.' : ['Drehort steht noch. Wir müssen aber gleich abschließen.', 'Die Kamera wurde anschließend vorsichtshalber ausgeschaltet.', 'Weitere Informationen haben wir auch nicht.', 'Sponsor hat sich nach Sichtung des Materials abgemeldet.'][current.seed % 4];
  disposeVideoScene = mountVideoScene(app.querySelector('#video-player'), video, result);
  const playButton = app.querySelector('#play-button');
  video.addEventListener('timeupdate', () => { if (video.isConnected && !video.seeking) { playback = video.currentTime; updatePlayback(); } });
  video.addEventListener('play', () => { portals.watched(result); playButton.textContent = 'Ⅱ'; playButton.setAttribute('aria-label', 'Pausieren'); });
  video.addEventListener('pause', () => { playButton.textContent = video.ended ? '↻' : '▶'; playButton.setAttribute('aria-label', video.ended ? 'Erneut abspielen' : 'Abspielen'); });
  video.addEventListener('ended', () => { if (video.isConnected) { playback = result.durationSeconds; updatePlayback(); } });
  updatePlayback();
}
function updatePlayback() {
  const player = app.querySelector('#video-player');
  if (!player) return;
  player.querySelector('.video-scene').classList.toggle('hidden', playback > 0);
  const length = current.result.durationSeconds || 3;
  player.classList.toggle('finished', playback >= length);
  player.querySelector('.big-play').classList.toggle('hidden', playback > 0 && playback < length);
  app.querySelector('#player-time').textContent = `${clockTime(playback)} / ${clockTime(length)}`;
  app.querySelector('#video-progress').value = playback;
  const video = player.querySelector('video');
  const control = player.querySelector('#play-button');
  control.textContent = !video.paused ? 'Ⅱ' : playback >= length ? '↻' : '▶';
  control.setAttribute('aria-label', !video.paused ? 'Pausieren' : playback >= length ? 'Erneut abspielen' : 'Abspielen');
}
async function togglePlayback() {
  const video = app.querySelector('#experiment-video');
  if (!video.paused) { video.pause(); return; }
  if (video.ended) video.currentTime = 0;
  try { await video.play(); } catch (error) { if (video.isConnected && error.name !== 'AbortError') toast('Der Clip konnte in diesem Browser nicht abgespielt werden.'); }
}
function seekVideo(requested) {
  const video = app.querySelector('#experiment-video');
  if (!video) return;
  playback = Math.max(0, Math.min(current.result.durationSeconds || 3, requested));
  video.currentTime = playback;
  updatePlayback();
}
function renderWickipedia(result) {
  const topic = result.topic;
  document.title = `${topic.name} – Wickipedia`;
  app.innerHTML = `<div class="site-page wickipedia-page">${siteHeader('wickipedia')}<div class="wiki-layout"><aside class="wiki-toc"><b>Inhaltsverzeichnis</b><hr>${[['intro', 'Einleitung'], ['history', 'Geschichte'], ['usage', 'Verwendung'], ['sources', 'Einzelnachweise']].map(([id, title]) => `<a href="#${id}" data-action="wiki-scroll" data-target="${id}">${title}</a>`).join('')}</aside><main class="wiki-article"><h1>${escape(topic.name)}</h1><div class="wiki-tabs"><div><button class="active" data-action="wiki-article">Artikel</button><button data-action="wiki-discussion">Diskussion</button></div><div><button data-action="wiki-edit">Bearbeiten</button><button data-action="wiki-history">Versionsgeschichte</button></div></div><div id="wiki-content"><p class="wiki-subtitle">aus Wickipedia, der einigermaßen freien Enzyklopädie</p><div class="wiki-notice">Dieser Artikel wurde von jemandem geschrieben, der den Tab inzwischen geschlossen hat.</div><aside class="wiki-infobox"><h2>${escape(topic.name)}</h2>${image(result)}<p>Abb. 1: ungefähr so.</p><dl><dt>Bezeichnung</dt><dd>${escape(topic.name)}</dd><dt>Fundort</dt><dd>Suchergebnisse</dd><dt>Status</dt><dd>Noch da</dd><dt>Weitere Namen</dt><dd>Kommt drauf an</dd></dl></aside><p id="intro"><b>${escape(topic.name)}</b>: ${escape(wikiIntro(topic))} <sup><a href="#sources" data-action="wiki-scroll" data-target="sources">[1]</a></sup></p><p>Die Einordnung erfolgt seit jeher nach dem Prinzip „das wird schon stimmen“. Abweichende Meinungen sind auf der Diskussionsseite dokumentiert und werden dort seit 2011 ignoriert.</p><h2 id="history">Geschichte</h2><p>Die erste Erwähnung findet sich in einer Einkaufsliste, deren Rückseite für eine Telefonnummer verwendet wurde. Die Nummer ist nicht mehr erreichbar. Eine genaue Datierung war deshalb nicht möglich.</p><p>Im Jahr 2008 wurde der Begriff erstmals in eine Suchleiste eingegeben. Seitdem erscheinen Ergebnisse. Ein Zusammenhang wird vermutet.</p><h2 id="usage">Verwendung</h2><p>${escape(topicFact(topic))} Die Anwendung außerhalb dieser Beschreibung erfolgt nach eigenem Ermessen.</p><table class="wiki-table"><tr><th>Situation</th><th>Empfehlung</th></tr><tr><td>Vorhanden</td><td>Prüfen, ob benötigt</td></tr><tr><td>Nicht vorhanden</td><td>Woanders schauen</td></tr><tr><td>Unklar</td><td>Tab offen lassen</td></tr></table><h2 id="sources">Einzelnachweise</h2><ol class="wiki-sources"><li>Ein Bekannter. Hat das mal gehört. Abrufdatum unbekannt.</li><li>Dieser Artikel. Verweist auf sich selbst.</li><li>Quelle wird nachgereicht, wenn Jens zurückschreibt.</li></ol><div class="wiki-categories">Kategorien: <a href="#" data-action="wiki-category">Dinge</a> · <a href="#" data-action="wiki-category">Unzureichend belegt</a> · <a href="#" data-action="wiki-category">Jens</a></div></div></main><aside class="wiki-appearance"><b>Erscheinungsbild</b><hr><label><input type="radio" name="wiki-size" value="normal" checked> Standard</label><label><input type="radio" name="wiki-size" value="large"> Groß</label><label><input type="radio" name="wiki-size" value="huge"> Jens</label></aside></div><footer class="site-footer">Diese Seite ist eine erfundene Parodie. Die beschriebenen Angaben sind keine Fakten.</footer></div>`;
  const copy = variedCopy(result, current.seed);
  app.querySelector('#intro + p').textContent = copy.observation;
  app.querySelector('#history + p').textContent = copy.history;
  app.querySelector('#history + p + p').textContent = `Die redaktionelle Betreuung übernimmt ${copy.author}. Rückfragen werden in der Reihenfolge bearbeitet, in der sie versehentlich wiedergefunden werden.`;
  app.querySelector('.wiki-sources').innerHTML = copy.sources.map((name, i) => `<li>${escape(name)}. ${['Notiz auf der Rückseite eines nicht zugehörigen Formulars.', 'Hat einen Ausdruck davon, sucht gerade den Ordner.', 'Siehe Quelle 1.'][i]}</li>`).join('');
  app.querySelector('.wiki-categories').innerHTML = `Kategorien: <a href="#" data-action="wiki-category">${escape(result.topic.category === 'food' ? 'Lebensmittel mit Aktenlage' : result.topic.category === 'city' ? 'Orte mit Rückfragen' : 'Unzureichend belegt')}</a> · <a href="#" data-action="wiki-category">${escape(copy.author)}</a>`;
}
function renderChatGPP() {
  document.title = 'ChatGPP';
  chats = [];
  chatState = createChatState();
  chatVersion++;
  app.innerHTML = `<div class="site-page chatgpp-page"><aside class="chat-sidebar"><a class="chat-gurgel" href="${routeURL(current.query, { ...current, site: null, id: null, offer: null })}">${icon('back')} Gurgel</a><button class="new-chat" data-action="new-chat">${icon('image')} Neuer Chat</button><span class="chat-sidebar-label">Heute</span><button class="chat-history" data-action="chat-history">${escape(current.query)}</button><div class="chat-sidebar-bottom"><span class="chat-account-avatar">${escape(profile?.[0]?.toUpperCase() || 'D')}</span><div><b>${escape(profile || 'Du')}</b><small>Free. Sehr free.</small></div></div></aside><div class="chat-body">${siteHeader('chatgpp', '<button class="chat-upgrade" data-action="chat-upgrade">Upgrade</button>')}<main class="chat-main"><div class="chat-welcome"><h1>Wobei kannst du mir helfen?</h1><p>Ich bin gerade allein hier.</p><div class="chat-prompts"><button data-action="chat-prompt" data-prompt="Was ist 2 plus 2?">Was ist 2 plus 2?</button><button data-action="chat-prompt" data-prompt="Schreib mir ein Rezept">Schreib mir ein Rezept</button><button data-action="chat-prompt" data-prompt="Hilf mir beim Programmieren">Hilf mir beim Programmieren</button></div></div><div class="chat-messages" aria-live="polite"></div></main><div class="chat-composer-wrap"><form class="chat-composer" data-form="chat"><textarea name="message" placeholder="Frag irgendwas" aria-label="Nachricht an ChatGPP" rows="2" maxlength="1000" required></textarea><div><span>ChatGPP Personalpause</span><button class="chat-send" aria-label="Nachricht senden">${icon('send')}</button></div></form><p class="chat-disclaimer">ChatGPP kann nichts. Wichtige Informationen bitte selbst besorgen.</p></div></div></div>`;
}
function sendChat(text) {
  if (!text.trim() || app.querySelector('.chat-composer button').disabled) return;
  const messages = app.querySelector('.chat-messages');
  const textarea = app.querySelector('textarea');
  const submit = app.querySelector('.chat-composer button');
  app.querySelector('.chat-welcome')?.remove();
  const response = advanceChat(text, chatState);
  const reply = response.reply;
  chatState = response.state;
  messages.insertAdjacentHTML('beforeend', `<div class="chat-message user-message">${escape(text)}</div><div class="chat-message assistant-message pending"><span class="assistant-mark">✳</span><span class="typing"><i></i><i></i><i></i></span></div>`);
  textarea.value = '';
  submit.disabled = true;
  messages.lastElementChild.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  const version = chatVersion;
  setTimeout(() => {
    if (version !== chatVersion || !messages.isConnected) return;
    messages.lastElementChild.innerHTML = `<span class="assistant-mark">✳</span><div>${escape(reply)}<div class="chat-message-actions"><button data-action="copy-chat" data-text="${escape(reply)}">Kopieren</button><button data-action="chat-feedback">Nicht hilfreich</button></div></div>`;
    messages.lastElementChild.classList.remove('pending');
    chats.push({ question: text, reply });
    submit.disabled = false;
    textarea.focus();
    messages.lastElementChild.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, settings.loading ? 550 + Math.random() * 400 : 30);
}
function renderArticle(result) {
  const site = result.site;
  const copy = articleCopy(result);
  document.title = `${result.title} - ${siteInfo(site, result).name}`;
  if (site === 'klein') {
    app.innerHTML = `<div class="site-page classifieds-page">${siteHeader(site)}<main class="classifieds-main"><p class="breadcrumbs">Startseite › ${escape(result.topic.name)} › Anzeigen</p><div class="classifieds-layout"><section><div class="classifieds-photo">${image(result)}</div><h1>${escape(result.title)}</h1><h2>VB</h2><p>📍 44135 Dortmund · Heute, 08:12</p><hr><h2>Beschreibung</h2><p>${escape(result.description)}</p><p>Keine Garantie. Keine Rücknahme. Keine Fragen, auf die ich nicht antworten möchte.</p><p>Solange die Anzeige online ist, weiß ich auch nicht, ob es noch da ist.</p></section><aside class="seller-box"><h2>Nachricht schreiben</h2><form data-form="seller"><textarea name="message" aria-label="Nachricht an Verkäufer" required>Hallo, ist das noch da?</textarea><button class="green-button">Nachricht senden</button></form><div id="seller-replies" aria-live="polite"></div><hr><b>Privater Anbieter</b><p>Seit 2013 angemeldet. Seit 2014 genervt.</p><button data-action="save-ad">Anzeige merken</button></aside></div></main><footer class="site-footer">Kleinunzeigen · Nachrichten werden nur lokal simuliert.</footer></div>`;
  } else if (site === 'forum') {
    app.innerHTML = `<div class="site-page forum-page">${siteHeader(site)}<main class="forum-main"><p class="breadcrumbs">Alle Fragen › ${escape(result.topic.name)}</p><h1>${escape(result.title)}</h1><p class="forum-author">fragender_2008 · vor 4 Minuten</p><p>${escape(result.description)}</p><h2>3 Antworten</h2><article class="forum-answer best"><small>Hilfreichste Antwort</small><b>Uwe, Experte für Sonstiges</b><p>Kommt auf den Einzelfall an. In deinem Fall würde ich erst mal schauen.</p><button data-action="helpful">Hilfreich (892)</button></article><article class="forum-answer"><b>AntwortIstNein</b><p>Nein.</p><button data-action="helpful">Hilfreich (1)</button></article><article class="forum-answer"><b>gelöschterNutzer</b><p>Habe exakt dasselbe Problem. Melde mich, wenn ich es vergessen habe.</p></article><h2>Deine Antwort</h2><form data-form="forum-answer"><textarea name="answer" placeholder="Was weißt du dazu?" aria-label="Deine Antwort" required maxlength="1000"></textarea><button>Antworten</button></form><div id="forum-replies"></div></main><footer class="site-footer">Schlechtefrage · Hier wird nichts abschließend geklärt.</footer></div>`;
  } else {
    app.innerHTML = `<div class="site-page news-page">${siteHeader('news')}<nav class="news-nav"><button data-action="news-local">${escape(result.place)}</button><button data-action="news-economy">Wirtschaft</button><button data-action="news-local">Panorama</button><button data-action="news-subscribe">Abo</button></nav><main class="news-article"><p class="news-rubric">${escape(copy.rubric)} · SATIRE</p><h1>${escape(result.title)}</h1><p class="news-lead">${escape(result.description)}</p><p class="news-byline">Von Rainer Zufall · Heute, 08:14 Uhr</p><figure>${image(result)}<figcaption>Symbolbild. Das abgebildete Motiv wurde nicht befragt.</figcaption></figure><p><b>${escape(result.place)}.</b> ${escape(result.description)}</p><h2>${escape(copy.heading)}</h2>${copy.paragraphs.map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}<blockquote>${escape(copy.quote)}</blockquote><button class="news-subscription" data-action="news-subscribe">Weiterlesen mit Tagesblatt Plus</button></main><footer class="site-footer">Tagesblatt ${escape(result.place)} · Sämtliche Meldungen sind erfundene Satire.</footer></div>`;
  }
  const variation = variedCopy(result, current.seed);
  if (site === 'forum') app.querySelectorAll('.forum-answer').forEach((node, i) => { node.querySelector('b').textContent = variation.answers[i][0]; node.querySelector('p').textContent = variation.answers[i][1]; });
  if (site === 'klein') { app.querySelector('.seller-box>b').textContent = variation.author; app.querySelector('.seller-box>b + p').textContent = `Privater Anbieter · Antwortquote: ${[4, 19, 0, 101][current.seed % 4]} %`; }
  if (site === 'news') app.querySelector('.news-byline').textContent = `Von ${variation.author} · Heute, 08:${String(current.seed % 60).padStart(2, '0')} Uhr`;
}
function parseRoute() {
  const [path, params = ''] = location.hash.slice(1).split('?');
  const values = new URLSearchParams(params);
  const query = (values.get('q') ?? (path?.startsWith('/site/') ? '' : 'Gurken')).slice(0, 180);
  const rawPage = Number(values.get('page'));
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.min(100, Math.floor(rawPage)) : 1;
  const rawSeed = values.get('s');
  const seed = rawSeed === null || !Number.isFinite(Number(rawSeed)) ? newSeed() : Number(rawSeed) >>> 0;
  const tab = ['all', 'images', 'shopping', 'videos', 'news'].includes(values.get('tab')) ? values.get('tab') : 'all';
  return { path: path || '/', query, seed, page, tab, site: path?.split('/')[2], id: values.get('id'), offer: values.has('offer') ? Number(values.get('offer')) : null };
}
function renderRoute() {
  portals.cleanup();
  disposeVideoScene?.();
  disposeVideoScene = null;
  clearTimeout(loadingTimer);
  chatVersion++;
  routeVersion++;
  const route = parseRoute();
  if (dialog.open) dialog.close();
  if (route.path === '/') { current = null; renderHome(); window.scrollTo(0, 0); portals.afterRender(); return; }
  if (route.path === '/images') {
    current = { ...route, query: '', tab: 'images', model: generateResults('Bilder', route.seed) };
    history.replaceState(null, '', `#/images?s=${route.seed}`);
    const discoveries = shuffled(['Mango', 'Gurken', 'Banane', 'Apfel', 'Tomaten', 'Karotten', 'Brokkoli', 'Heidelbeeren', 'Orange', 'Kartoffeln', 'Erdnüsse', 'Milch', 'Brot', 'Pizza', 'Döner', 'Burger', 'Sushi', 'Spaghetti', 'Gaming-PC', 'Büroklammer', 'Wetter', 'VW Golf', 'Dortmund', 'Taylor Swift', 'Taschenrechner', 'WLAN'], route.seed);
    const entries = discoveries.slice(0, 24).map((query, i) => { const seed = (route.seed + i * 7919) >>> 0; return { query, seed, result: generateResults(query, seed).results[i % 9] }; });
    app.innerHTML = `<div class="results-page">${searchHeader()}<main class="image-explore"><h1>Bilder entdecken</h1><p>Ein paar Dinge, die gerade im Internet herumliegen.</p><div class="image-results">${entries.map(({ query, seed, result }) => `<a class="image-result" href="${routeURL(query, { seed, site: result.site, id: result.id })}"><div class="image-frame">${image(result)}</div><span>${escape(result.title)}</span><small>${escape(query)} · ${sites[result.site].name}</small></a>`).join('')}</div></main>${footer()}</div>`;
    portals.afterRender(); return;
  }
  if (route.path !== '/search' && (!route.path.startsWith('/site/') || !sites[route.site])) { location.hash = '#/'; return; }
  current = { ...route, model: generateResults(route.query, route.seed, route.page) };
  current.model.results = current.model.results.map(result => result.site === 'youtuba' ? portals.decorateVideo(result, route.seed) : result);
  if (!new URLSearchParams(location.hash.split('?')[1]).has('s')) history.replaceState(null, '', routeURL(route.query, route));
  window.scrollTo(0, 0);
  const version = routeVersion;
  if (settings.loading) route.site ? renderSiteLoading(route.site) : renderResults(true);
  const finish = () => {
    if (version !== routeVersion) return;
    if (!route.site) { rememberSearch(current.model, route.seed, route.page); renderResults(); portals.afterRender(); return; }
    if (extraSites[route.site] || !route.id) { if (portals.renderHome(route.site, route)) { portals.afterRender(); return; } }
    const result = current.model.results.find(item => item.id === route.id && item.site === route.site) || current.model.results.find(item => item.site === route.site) || current.model.results[0];
    current.result = portals.catalogResult(route.site, route.id, route.seed) || { ...result, site: route.site };
    if (route.site === 'buyazon' && Number.isInteger(route.offer) && route.offer >= 0 && route.offer < 6) current.result = shoppingOffers(current.model)[route.offer];
    if (route.site === 'buyazon') renderBuyazon(current.result);
    else if (route.site === 'youtuba') renderYouTuba(current.result);
    else if (route.site === 'wickipedia') renderWickipedia(current.result);
    else if (route.site === 'chatgpp') renderChatGPP();
    else renderArticle(current.result);
    portals.afterRender();
  };
  if (settings.loading) loadingTimer = setTimeout(finish, 300 + Math.random() * 350);
  else finish();
}

document.addEventListener('submit', event => {
  const form = event.target.closest('form');
  if (!form) return;
  event.preventDefault();
  const data = new FormData(form);
  if (portals.handleSubmit(form, data)) return;
  if (form.dataset.form === 'search') search(String(data.get('q')), { tab: current?.site ? 'all' : current?.tab || 'all' });
  if (form.dataset.form === 'site-search') location.hash = homeURL(current.site, { q: String(data.get('q')).slice(0, 180) });
  if (form.dataset.form === 'chat') sendChat(String(data.get('message')));
  if (form.dataset.form === 'comment') {
    const text = String(data.get('comment')).trim();
    if (!text) return;
    portals.addVideoComment(current.result, text);
    app.querySelector('#comment-list').insertAdjacentHTML('afterbegin', `<article><span class="comment-avatar">${escape(profile?.[0] || 'D')}</span><div><b>@${escape(profile || 'Du')}</b><small>gerade eben</small><p>${escape(text)}</p></div></article>`);
    app.querySelector('.comments h2').textContent = `${portals.comments(current.result, current.seed).length} Kommentare`;
    form.reset(); toast('Kommentar veröffentlicht. In diesem Browser.');
  }
  if (form.dataset.form === 'seller') {
    const target = app.querySelector('#seller-replies');
    target.insertAdjacentHTML('beforeend', `<p class="seller-message">${escape(data.get('message'))}</p><p class="seller-response">${target.children.length ? 'Steht doch alles in der Anzeige.' : 'Was genau?'}</p>`);
  }
  if (form.dataset.form === 'forum-answer') {
    app.querySelector('#forum-replies').insertAdjacentHTML('beforeend', `<article class="forum-answer"><b>${escape(profile || 'Du')}</b><p>${escape(data.get('answer'))}</p><small>Antwort wurde versehentlich der richtigen Frage zugeordnet.</small></article>`); form.reset();
  }
});

document.addEventListener('input', event => {
  if (event.target.matches('.search-form input')) {
    const form = event.target.closest('form');
    const list = form.querySelector('.suggestions');
    const queries = suggestions(event.target.value);
    selectedSuggestion = -1;
    list.innerHTML = queries.map((query, i) => `<button type="button" role="option" id="suggestion-${i}" aria-selected="false" data-action="suggestion" data-query="${escape(query)}">${icon('search')}<span>${escape(query)}</span></button>`).join('');
    list.classList.toggle('hidden', !queries.length);
    form.classList.toggle('suggesting', !!queries.length);
    event.target.setAttribute('aria-expanded', Boolean(queries.length));
    event.target.removeAttribute('aria-activedescendant');
    form.querySelector('.clear-search').classList.toggle('hidden', !event.target.value);
  }
  if (event.target.id === 'video-progress') seekVideo(Number(event.target.value));
});
document.addEventListener('keydown', event => {
  if (event.target.id === 'video-progress' && ['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? Number(event.target.max) : Number(event.target.value) + (['ArrowRight', 'ArrowUp'].includes(event.key) ? 0.1 : -0.1);
    seekVideo(target);
    return;
  }
  if (event.target.matches('.search-form input')) {
    const list = event.target.closest('form').querySelector('.suggestions');
    const options = [...list.querySelectorAll('button')];
    if (['ArrowDown', 'ArrowUp'].includes(event.key) && !list.classList.contains('hidden') && options.length) {
      event.preventDefault();
      selectedSuggestion = (selectedSuggestion + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options.forEach((option, i) => { option.classList.toggle('selected', i === selectedSuggestion); option.setAttribute('aria-selected', i === selectedSuggestion); });
      event.target.setAttribute('aria-activedescendant', options[selectedSuggestion].id);
    } else if (event.key === 'Enter' && selectedSuggestion >= 0 && !list.classList.contains('hidden')) { event.preventDefault(); search(options[selectedSuggestion].dataset.query); }
    else if (event.key === 'Escape') hideSuggestions();
  }
  if (event.target.matches('.chat-composer textarea') && event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendChat(event.target.value); }
});
function hideSuggestions() {
  app.querySelector('.suggestions')?.classList.add('hidden');
  app.querySelector('.search-form')?.classList.remove('suggesting');
  app.querySelector('.search-form input')?.setAttribute('aria-expanded', 'false');
  selectedSuggestion = -1;
}
document.addEventListener('change', event => {
  if (event.target.name === 'wiki-size') app.querySelector('.wiki-article').style.fontSize = event.target.value === 'normal' ? '16px' : event.target.value === 'large' ? '19px' : '23px';
  if (event.target.id === 'loading-setting') { settings.loading = event.target.checked; writeStorage('gurgel-settings', settings); }
});

document.addEventListener('click', async event => {
  const button = event.target.closest('[data-action]');
  if (!event.target.closest('.search-form')) hideSuggestions();
  if (!button) return;
  const action = button.dataset.action;
  if (button.tagName === 'A') event.preventDefault();
  switch (action) {
    case 'suggestion': search(button.dataset.query); break;
    case 'related-search': search(button.dataset.query); break;
    case 'home-submit': search(app.querySelector('input[name="q"]').value); break;
    case 'lucky': { const query = app.querySelector('input[name="q"]').value.trim() || catalog[newSeed() % catalog.length].name; const seed = chooseSearchSeed(query, recentSearches, newSeed()); const model = generateResults(query, seed); rememberSearch(model, seed); const result = model.results[0]; location.hash = routeURL(query, { seed, site: result.site, id: result.id }); break; }
    case 'clear-search': { const input = button.closest('form').querySelector('input'); input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); input.focus(); break; }
    case 'close-dialog': dialog.close(); break;
    case 'apps': openDialog('Gurgel-Apps', `<div class="app-grid">${Object.keys(sites).map(site => `<a href="${homeURL(site)}"><span class="app-tile" style="--site-color:${sites[site].color}">${sites[site].letter}</span>${sites[site].name}</a>`).join('')}</div>`, 'apps-dialog'); break;
    case 'account': portals.showAccount(current?.site || 'gaehmail'); break;
    case 'about': openDialog('Gurgel', '<p>Du suchst. Wir wissen’s besser.</p><p>Eine Suchmaschine mit sehr vielen Ergebnissen und einem eher lockeren Verhältnis zur Aufgabenstellung.</p><p>YouTuba, Buyazon, Wickipedia und ChatGPP gehören zu diesem erfundenen kleinen Internet.</p>'); break;
    case 'about-search': openDialog('Wie die Suche funktioniert', `<p>${catalog.filter(item => item.category === 'food').length} Lebensmittel, ${catalog.filter(item => item.category === 'person').length} Personen und ${catalog.filter(item => item.category === 'car').length} Auto-Einträge haben hinterlegte Suchbegriffe. Dazu ${catalog.filter(item => item.category === 'city').length} Städte über 30.000 Einwohner (Stand 31.12.2025) und ${catalog.filter(item => item.category === 'everyday').length} typische Suchthemen.</p><p>Ein Regelalgorithmus kombiniert handgeschriebene Situationen. Auch unbekannte Eingaben bekommen Ergebnisse. Neue Suchen meiden kürzlich verwendete Vorlagen. Zurück und geteilte Links behalten ihre ursprünglichen Treffer.</p><p>Keine KI. Keine echte Websuche.</p>`); break;
    case 'parody': openDialog('Ein sehr kleines, erfundenes Internet', '<p>Gurgel und alle verlinkten Seiten sind Parodien. Produkte, Angebote, Meldungen, Bewertungen und enzyklopädische Texte sind erfunden.</p><p>Bei prominenten Personen sind diese Texte keine biografischen Angaben. Alle Links bleiben innerhalb dieser Website.</p>'); break;
    case 'privacy': openDialog('Datenschutz', '<p>Deine Suchanfragen werden hier im Browser verarbeitet. Es gibt keine Analyse-Tracker und keine KI-Anfragen.</p><p>Spaßkonten, Postfächer, Bestellungen, Videoverlauf, Anträge, Beiträge, Einstellungen und Einkaufswagen werden lokal gespeichert. Echte Passwörter, Kreditkarten oder Standortdaten werden nicht erfasst. Der aktuelle Tab merkt sich außerdem verwendete Witzvorlagen, um Wiederholungen zu meiden. Dabei werden keine vollständigen Suchanfragen gespeichert. Deine Suche steht außerdem in der URL und bleibt beim Teilen sichtbar.</p><p>Beim veröffentlichten Aufruf fallen die üblichen Verbindungsdaten beim Website-Host an.</p><button class="primary-button" data-action="clear-data">Lokale Daten löschen</button>'); break;
    case 'clear-data': ['gurgel-profile', 'gurgel-settings', 'gurgel-cart'].forEach(key => { try { localStorage.removeItem(key); } catch {} }); portals.reset(); profile = null; settings = { loading: true }; cart = []; recentSearches = []; try { sessionStorage.removeItem('gurgel-pattern-memory-v2'); } catch {} dialog.close(); renderRoute(); toast('Lokale Gurgel-Daten gelöscht.'); break;
    case 'terms': openDialog('Nutzungsbedingungen', '<p>§ 1: Sie dürfen suchen.</p><p>§ 2: Die Ergebnisse dürfen etwas anderes vorhaben.</p><p>§ 3: Käufe und Nachrichten sind lokale Simulationen. Es entstehen keine Bestellungen, Zahlungen oder externen Nachrichten.</p>'); break;
    case 'settings': openDialog('Einstellungen', `<label class="setting-row"><input id="loading-setting" type="checkbox" ${settings.loading ? 'checked' : ''}> Kurze Ladephasen anzeigen</label><p>Skeleton-Loader und ein kleiner Moment Wartezeit, wie bei echten Seiten.</p><p>Bewegungen werden bei aktivierter Systemeinstellung für reduzierte Bewegung abgeschaltet.</p>`); break;
    case 'language': toast('English queries work too. Die Ergebnisse haben noch Deutschunterricht.'); app.querySelector('input[name="q"]').focus(); break;
    case 'microphone': openDialog('Sprachsuche', '<div class="voice-symbol">'+icon('mic')+'</div><p>Unser Mikrofon ist gerade stummgeschaltet.</p><p>Bitte den Suchbegriff kurz eintippen. Das geht schneller als unser Support.</p>'); break;
    case 'lens': { const query = app.querySelector('input[name="q"]').value; if (query.trim()) search(query, { tab: 'images' }); else location.hash = `#/images?s=${newSeed()}`; break; }
    case 'tools': openDialog('Suchfilter', '<p>Zeitraum</p><button class="filter-choice" data-action="filter-time">Jederzeit</button><button class="filter-choice" data-action="filter-time">Vor dem Internet</button><button class="filter-choice" data-action="filter-time">Morgen</button>'); break;
    case 'filter-time': dialog.close(); toast(`Zeitraum: ${button.textContent}. Ergebnisse vorsorglich unverändert.`); break;
    case 'result-info': openDialog('Informationen zum Ergebnis', '<p>Dieses Ergebnis wurde lokal erfunden. Der Betreiber kennt den Betreiber dieser Suchmaschine persönlich.</p>'); break;
    case 'shop-all': location.hash = homeURL('buyazon'); break;
    case 'deals': location.hash = homeURL('buyazon', { q: 'PC' }); break;
    case 'delivery': openDialog('Lieferadresse', '<p>Die Adresse wurde durch Ausschlussverfahren ermittelt.</p><p>Falls das Paket nicht bei dir ankommt, wohnt vermutlich jemand anderes dort.</p><p class="dialog-note">Dies ist eine erfundene Lieferung. Es werden keine Adressdaten ermittelt.</p>'); break;
    case 'service': openDialog('Kundenservice', '<p>Ihr Anruf ist uns wichtig.</p><p>Deshalb haben wir die Telefonnummer entfernt, damit Sie nicht warten müssen.</p>'); break;
    case 'product-image': app.querySelector('.product-photo img').style.transform = button.dataset.view === 'back' ? 'scaleX(-1)' : ''; app.querySelector('.product-image-caption').textContent = button.dataset.view === 'back' ? 'Rückseite. Könnte auch die Vorderseite sein.' : 'Für eine größere Ansicht näher an den Bildschirm gehen.'; app.querySelectorAll('.product-thumbs button').forEach(item => item.classList.toggle('selected', item === button)); break;
    case 'add-cart': cart.push({ title: current.result.title, price: current.result.price, quantity: Number(app.querySelector('#quantity').value) }); writeStorage('gurgel-cart', cart); app.querySelector('.cart-button span').textContent = cart.length; toast('Im Einkaufswagen. Jetzt ist es dein Problem.'); break;
    case 'cart': openDialog('Einkaufswagen', cart.length ? `<div class="cart-items">${cart.map(item => `<p><b>${escape(item.title)}</b><span>${item.quantity} × ${money(item.price)}</span></p>`).join('')}</div><button class="primary-button" data-action="cart-clear">Alles wieder zurücklegen</button>` : '<p>Ihr Einkaufswagen ist leer. Auch unten drunter.</p>'); break;
    case 'cart-clear': cart = []; writeStorage('gurgel-cart', cart); dialog.close(); if (current?.site === 'buyazon') app.querySelector('.cart-button span').textContent = 0; toast('Zurückgelegt.'); break;
    case 'buy-now': { const order = portals.purchase(current.result); if (order) openDialog('Vielen Dank für Ihre Bestellung', `<div class="order-check">✓</div><p><b>${escape(current.result.title)}</b></p><p>Die Bestellung wurde gestern zugestellt.</p><p>Ablageort: bei Ihnen, irgendwo.</p><p>Bestellnummer: ${order.id}</p><a href="${homeURL('gaehmail')}">Bestätigung in Gähmail öffnen</a><p class="dialog-note">Spaßbestellung. Keine Zahlung und keine echte Lieferung.</p>`); break; }
    case 'scroll-reviews': app.querySelector('#reviews').scrollIntoView({ behavior: 'smooth' }); break;
    case 'helpful': button.textContent = 'Nützlich. Wurde so vermerkt.'; button.disabled = true; break;
    case 'play': togglePlayback(); break;
    case 'fullscreen': try { if (document.fullscreenElement) await document.exitFullscreen(); else await app.querySelector('#video-player').requestFullscreen(); } catch { toast('Vollbild ist in diesem Browser nicht verfügbar.'); } break;
    case 'subscribe': { const subscribed = portals.subscribe(current.result.channel); button.classList.toggle('subscribed', subscribed); button.textContent = subscribed ? 'Abonniert' : 'Abonnieren'; break; }
    case 'like': button.classList.toggle('liked'); button.querySelector('span').textContent = (current.result.likes + (button.classList.contains('liked') ? 1 : 0)).toLocaleString('de-DE'); break;
    case 'share': try { await navigator.clipboard.writeText(location.href); toast('Link kopiert.'); } catch { openDialog('Link teilen', `<input class="share-input" value="${escape(location.href)}" readonly aria-label="Link zum Kopieren">`); } break;
    case 'save-video': button.textContent = 'Gespeichert'; toast('Für später gespeichert. Das Video bleibt vorerst hier.'); break;
    case 'tube-menu': openDialog('YouTuba', `<p><a href="${homeURL('youtuba')}">Startseite</a></p><button class="filter-choice" data-world="tube-history">Verlauf</button>`); break;
    case 'recommend-all': if (dialog.open) dialog.close(); app.querySelectorAll('.recommended-video').forEach(el => el.classList.remove('hidden')); button.closest('.recommended-tabs')?.querySelectorAll('button').forEach(el => el.classList.toggle('selected', el === button)); break;
    case 'recommend-related': app.querySelectorAll('.recommended-video').forEach((el, i) => el.classList.toggle('hidden', i > 2)); button.closest('.recommended-tabs').querySelectorAll('button').forEach(el => el.classList.toggle('selected', el === button)); break;
    case 'wiki-scroll': app.querySelector(`#${button.dataset.target}`)?.scrollIntoView({ behavior: 'smooth' }); break;
    case 'wiki-discussion': { const copy = variedCopy(current.result, current.seed); openDialog('Diskussion: '+current.result.topic.name, copy.sources.map((name, i) => `<p><b>${escape(name)}:</b> ${['Das ist mein Ordner. Bitte den Ordner zurückbringen.', 'Es geht hier um den Artikel, nicht um den Ordner.', 'Im Ordner wäre die Quelle gewesen.'][i]}</p>`).join('')); break; }
    case 'wiki-edit': openDialog('Artikel bearbeiten', '<p>Dieser Artikel ist zum Schutz vor zusätzlichen Informationen gesperrt.</p><p>Bitte wenden Sie sich an Jens.</p>'); break;
    case 'wiki-history': openDialog('Versionsgeschichte', '<p>Heute, 08:14 · Ein Leerzeichen hinzugefügt.</p><p>Gestern, 17:38 · Leerzeichen wieder entfernt.</p><p>2008, 11:02 · Artikel angelegt. Inhalt folgt.</p>'); break;
    case 'wiki-article': window.scrollTo({ top: 0, behavior: 'smooth' }); break;
    case 'wiki-category': toast('Kategorie enthält diesen Artikel und Jens.'); break;
    case 'new-chat': renderChatGPP(); break;
    case 'chat-prompt': sendChat(button.dataset.prompt); break;
    case 'chat-history': if (!chats.length) sendChat(current.query); else app.querySelector('.chat-messages').firstElementChild?.scrollIntoView({ behavior: 'smooth' }); break;
    case 'chat-upgrade': openDialog('ChatGPP Plus', '<p>Für 20 € im Monat antworten wir weiterhin nicht richtig, aber in einer anderen Schriftgröße.</p><button class="primary-button" data-action="close-dialog">Beim kostenlosen Nichtwissen bleiben</button>'); break;
    case 'copy-chat': try { await navigator.clipboard.writeText(button.dataset.text); toast('Antwort kopiert. Vielleicht hilft sie jemand anderem.'); } catch { toast('Bitte die Antwort markieren und kopieren.'); } break;
    case 'chat-feedback': button.textContent = 'Wie erwartet'; button.disabled = true; break;
    case 'save-ad': button.textContent = 'Gemerkt'; toast('Wir haben uns gemerkt, dass du dir das merken wolltest.'); break;
    case 'news-local': search(current.query, { tab: 'news' }); break;
    case 'news-economy': search('Büroklammer', { tab: 'news' }); break;
    case 'news-subscribe': openDialog('Tagesblatt Plus', '<p>Sie haben den vollständigen Artikel bereits gelesen.</p><p>Mit Plus könnten Sie ihn noch einmal lesen.</p><button class="primary-button" data-action="close-dialog">Einmal reicht</button>'); break;
  }
});
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
window.addEventListener('hashchange', renderRoute);
renderRoute();
