// Moderne Bausteine der Ergebnisseite: Gurgel-Übersicht, Anzeigen, Ähnliche Fragen, Knowledge Panel.
// buildSerp ist rein und deterministisch (gleicher Seed, gleiche Seite). serpView erzeugt das HTML.
import { random, normalize, assetFor, catalog } from './engine.js';
import { overviewLeads, intentLeads, groupLeads, citations, overviewMore, adPools, adNotes, questionPools, driftQuestions, panelFacts, nutrition, foodKinds, panelReviews } from './serp-content.js';

const pick = (array, rng) => array[Math.floor(rng() * array.length)];
const shuffle = (array, rng) => {
  const output = [...array];
  for (let i = output.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [output[i], output[j]] = [output[j], output[i]]; }
  return output;
};
const fill = (template, vars) => template.replace(/\{(\w+)\}/g, (match, key) => vars[key] ?? match).replace(/([!?.…])\.(\s|$)/g, '$1$2').replace(/([!?.…])“\./g, '$1“').replace(/„„/g, '„').replace(/““/g, '“');
const euro = value => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
const kindOf = topic => overviewLeads[topic.category] ? topic.category : 'unknown';

function related(topic, rng, filter) {
  return shuffle(catalog.filter(item => item.name !== topic.name && filter(item)), rng).slice(0, 4).map(item => item.name);
}

function buildPanel(topic, model, vars, rng) {
  const wiki = model.results.find(result => result.site === 'wickipedia')?.id || null;
  const base = { title: topic.name, asset: assetFor(topic), wiki, facts: [], related: [], note: 'Alle Angaben erfunden. Gurgel ist eine Parodie.' };
  const rating = () => ({ stars: (3.4 + rng() * 1.3).toFixed(1).replace('.', ','), count: (800 + Math.floor(rng() * 24000)).toLocaleString('de-DE') });
  if (topic.category === 'city' && topic.city) {
    return { ...base, kind: 'city', subtitle: `Stadt in ${vars.state}`, description: `${topic.name} ist eine Stadt in ${vars.state}. Sie ist bekannt für ihre Lage, die sich seit Jahren nicht verändert hat.`,
      facts: [['Einwohner', `${vars.population} (Zensus 2022)`], ['Bundesland', vars.state], ['Postleitzahl', `${vars.postal} und weitere`], ...shuffle(panelFacts.city, rng).slice(0, 2)],
      rating: rating(), review: pick(panelReviews.city, rng), actions: ['Route', 'Speichern', 'Teilen'],
      related: related(topic, rng, item => item.category === 'city' && item.state === vars.state), relatedTitle: `Weitere Städte in ${vars.state}`,
      note: 'Einwohnerzahl, Bundesland und Postleitzahl stammen aus dem Gemeindeverzeichnis. Alles andere ist erfunden.' };
  }
  if (topic.category === 'person') {
    return { ...base, kind: 'person', subtitle: 'Person des öffentlichen Suchinteresses', description: `Über ${topic.name} wird viel gesucht. Dieses Panel zeigt deshalb ausschließlich Angaben über das Suchen.`,
      facts: shuffle(panelFacts.person, rng).slice(0, 3), claim: true,
      related: related(topic, rng, item => item.category === 'person'), relatedTitle: 'Andere suchten auch nach',
      note: 'Erfundene Parodie. Keine echten Angaben über reale Personen.' };
  }
  if (topic.category === 'car') {
    const brand = /^(Auto|Elektroauto|Gebrauchtwagen)$/.test(topic.name) ? '' : ` · ${topic.name.split(' ')[0]}`;
    return { ...base, kind: 'car', subtitle: `Fahrzeug${brand}`, description: `${topic.name} gilt als Auto. Vorne ist dort, wo es hinfährt, außer beim Einparken.`,
      facts: shuffle(panelFacts.car, rng).slice(0, 4), rating: rating(), review: pick(panelReviews.car, rng),
      related: related(topic, rng, item => item.category === 'car'), relatedTitle: 'Andere suchten auch nach' };
  }
  if (topic.category === 'food') {
    return { ...base, kind: 'food', subtitle: foodKinds[topic.group] || 'Lebensmittel', description: `${topic.name} ist essbar. Das unterscheidet ${topic.name} von den meisten Suchergebnissen.`,
      nutrition: shuffle(nutrition, rng).slice(0, 5), review: pick(panelReviews.food, rng),
      related: related(topic, rng, item => item.category === 'food' && item.group === topic.group), relatedTitle: 'Andere suchten auch nach' };
  }
  if (topic.category === 'tech' || topic.category === 'object') {
    return { ...base, kind: topic.category, subtitle: topic.category === 'tech' ? 'Gerät' : 'Gegenstand', description: `${topic.name} ist ${topic.category === 'tech' ? 'ein Gerät, das' : 'ein Gegenstand, der'} in vielen Haushalten bereits vorhanden ist, nur gerade nicht greifbar.`,
      facts: shuffle(panelFacts[topic.category], rng).slice(0, 3) };
  }
  return null;
}

export function buildSerp(model, seed = 1) {
  const topic = model.topic;
  if (topic.category === 'sfw') return null;
  const rng = random((Number(seed) ^ 0x5e4b1d) >>> 0);
  const kind = kindOf(topic);
  const n = topic.name;
  const city = topic.city || (topic.category === 'city' ? topic : null);
  const vars = { n, slug: normalize(n).replaceAll(' ', '-') || 'suche', place: topic.place || 'deiner Nähe', state: city?.state || '', population: city?.population?.toLocaleString('de-DE') || '', postal: city?.postalCode || '', percent: String(61 + Math.floor(rng() * 38)) };

  const lead = fill(groupLeads[topic.group] || intentLeads[topic.intent] || pick(overviewLeads[kind], rng), vars);
  const cited = [];
  for (const result of shuffle(model.results, rng)) {
    if (cited.length >= 3 || cited.some(entry => entry.site === result.site)) continue;
    const text = fill(pick(citations[result.site], rng), { ...vars, title: result.title, description: result.description, price: euro(result.price), rating: String(result.stars).replace('.', ','), views: result.views });
    cited.push({ id: result.id, site: result.site, text });
  }
  const overview = { lead, points: cited, more: shuffle(overviewMore, rng).slice(0, 2).map(text => fill(text, vars)) };

  const toAd = ([advertiser, domain, title, description, links]) => ({ advertiser, domain: fill(domain, vars), title: fill(title, vars), description: fill(description, vars), links, note: pick(adNotes, rng) });
  const special = shuffle(adPools[kind] || [], rng);
  const generic = shuffle(adPools.generic, rng);
  const ads = { top: [special[0] || generic[2], generic[0]].map(toAd), bottom: [generic[1]].map(toAd) };

  const own = shuffle(questionPools[kind] || [], rng);
  const extra = ['person', 'city'].includes(kind) ? [] : shuffle(questionPools.generic, rng);
  const questions = [...own, ...extra].slice(0, 8).concat(driftQuestions).map(([q, a, site]) => ({ q: fill(q, vars), a: fill(a, vars), site }));

  return { topic, overview, ads, questions, panel: buildPanel(topic, model, vars, rng) };
}

export const INITIAL_QUESTIONS = 4;

export function serpView({ escape, icon, sites, resultURL, routeURL, wikiURL }) {
  const favicon = site => `<span class="site-favicon" style="--site-color:${sites[site].color}" aria-hidden="true">${escape(sites[site].letter)}</span>`;

  function overview(serp, results, pending = false) {
    const body = pending
      ? `<p class="overview-pending">Kevin liest die Treffer …</p><span class="skeleton skeleton-text"></span><span class="skeleton skeleton-text"></span><span class="skeleton skeleton-text short"></span>`
      : `<p class="overview-lead">${escape(serp.overview.lead)}</p><ul class="overview-points">${serp.overview.points.map((point, i) => {
        const result = results.find(item => item.id === point.id);
        return `<li>${escape(point.text)} <a class="overview-cite" href="${result ? resultURL(result) : '#'}" aria-label="Quelle ${i + 1}: ${escape(sites[point.site].name)}">${i + 1}</a></li>`;
      }).join('')}</ul><div class="overview-more" hidden>${serp.overview.more.map(text => `<p>${escape(text)}</p>`).join('')}</div><div class="overview-sources">${serp.overview.points.map(point => `<span class="overview-source">${favicon(point.site)}${escape(sites[point.site].name)}</span>`).join('')}</div>`;
    return `<section class="gurgel-overview${pending ? ' pending' : ''}" aria-labelledby="overview-title" aria-busy="${pending}"><div class="overview-head"><span class="overview-mark" aria-hidden="true">✦</span><h2 id="overview-title">Gurgel-Übersicht</h2><span class="overview-badge">ohne KI</span></div><div class="overview-body">${body}</div>${pending ? '' : `<div class="overview-foot"><button class="overview-toggle" data-action="overview-more" aria-expanded="false">Mehr anzeigen ${icon('chevron', 'overview-chevron')}</button><p class="overview-disclaimer">Erstellt ohne KI: Kevin (Praktikum, 3. Woche) hat die Überschriften der Treffer unten gelesen. Kevin kann Fehler machen. Überprüfe wichtige Informationen, vor allem die unwichtigen.</p><div class="overview-feedback"><button data-action="overview-feedback" data-vote="up" aria-label="Hilfreich">${icon('like')}</button><button data-action="overview-feedback" data-vote="down" aria-label="Nicht hilfreich">${icon('like', 'flip')}</button></div></div>`}</section>`;
  }

  function ads(list, slot) {
    return `<section class="serp-ads ${slot}" aria-label="Anzeigen">${list.map((ad, i) => `<article class="serp-ad" data-ad="${slot}-${i}"><p class="ad-label">Gesponsert</p><div class="result-source"><span class="site-favicon ad-favicon" aria-hidden="true">${escape(ad.advertiser[0])}</span><div><span class="source-name">${escape(ad.advertiser)}</span><span class="source-url">https://www.${escape(ad.domain)}</span></div><button class="result-more" data-action="ad-why" data-ad="${slot}-${i}" aria-label="Warum sehe ich diese Anzeige?">⋮</button></div><a class="result-title" href="#" data-action="ad-open" data-ad="${slot}-${i}">${escape(ad.title)}</a><p class="result-description">${escape(ad.description)}</p><div class="ad-links">${ad.links.map(link => `<a href="#" data-action="ad-open" data-ad="${slot}-${i}">${escape(link)}</a>`).join('')}</div></article>`).join('')}</section>`;
  }

  function question(item, i) {
    const site = sites[item.site];
    return `<div class="paa-item"><h3><button class="paa-question" data-action="paa-toggle" data-index="${i}" aria-expanded="false" aria-controls="paa-answer-${i}"><span>${escape(item.q)}</span>${icon('chevron', 'paa-chevron')}</button></h3><div class="paa-answer" id="paa-answer-${i}" hidden><p>${escape(item.a)}</p><div class="result-source">${favicon(item.site)}<div><span class="source-name">${escape(site.name)}</span><span class="source-url">https://${escape(site.domain)} › ${escape(site.path)}</span></div></div><a class="paa-search" href="${routeURL(item.q)}" data-action="related-search" data-query="${escape(item.q)}">${icon('search')} Suchen: ${escape(item.q)}</a></div></div>`;
  }

  function questions(serp, shown = INITIAL_QUESTIONS) {
    return `<section class="related-questions" aria-labelledby="paa-title"><h2 id="paa-title">Ähnliche Fragen</h2><div class="paa-list">${serp.questions.slice(0, shown).map(question).join('')}</div><p class="paa-end" hidden>Die ähnlichen Fragen sind vorerst aufgebraucht. Neue Fragen werden morgen früh geliefert.</p></section>`;
  }

  function panel(serp) {
    const p = serp.panel;
    if (!p) return '';
    const stars = value => { const full = Math.round(Number(value.replace(',', '.'))); return '★'.repeat(full) + '☆'.repeat(5 - full); };
    return `<aside class="knowledge-panel" aria-labelledby="kp-title"><div class="kp-media"><img src="./assets/${p.asset}.svg" alt="" width="480" height="340" loading="lazy"></div><div class="kp-head"><h2 id="kp-title">${escape(p.title)}</h2><p class="kp-subtitle">${escape(p.subtitle)}</p></div>${p.actions ? `<div class="kp-actions">${p.actions.map(action => `<button data-action="kp-action" data-kind="${escape(action)}">${escape(action)}</button>`).join('')}</div>` : ''}<p class="kp-description">${escape(p.description)}${p.wiki ? ` <a href="${wikiURL(p.wiki)}">Wickipedia</a>` : ''}</p>${p.rating ? `<div class="kp-rating"><b>${p.rating.stars}</b> <span class="stars" aria-hidden="true">${stars(p.rating.stars)}</span> <span>${p.rating.count} Gurgel-Rezensionen</span></div>` : ''}${p.facts.length ? `<dl class="kp-facts">${p.facts.map(([key, value]) => `<div><dt>${escape(key)}:</dt> <dd>${escape(value)}</dd></div>`).join('')}</dl>` : ''}${p.nutrition ? `<table class="kp-nutrition"><caption>Nährwerte pro Portion (eine Portion)</caption><tbody>${p.nutrition.map(([key, value]) => `<tr><th scope="row">${escape(key)}</th><td>${escape(value)}</td></tr>`).join('')}</tbody></table>` : ''}${p.review ? `<blockquote class="kp-review">${escape(p.review)}</blockquote>` : ''}${p.related.length ? `<div class="kp-related"><h3>${escape(p.relatedTitle)}</h3><div>${p.related.map(name => `<a href="${routeURL(name)}" data-action="related-search" data-query="${escape(name)}"><span class="kp-related-thumb" aria-hidden="true">${escape(name[0])}</span><span>${escape(name)}</span></a>`).join('')}</div></div>` : ''}${p.claim ? `<button class="kp-claim" data-action="kp-claim">Sind Sie ${escape(p.title)}? Dieses Panel beanspruchen</button>` : ''}<p class="kp-note">${escape(p.note)} <button data-action="kp-feedback">Feedback geben</button></p></aside>`;
  }

  return { overview, ads, question, questions, panel };
}
