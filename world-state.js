import { mailTemplates, shuffled, hash, extraSites } from './world-content.js';
export const WORLD_KEY = 'gurgel-world-v1';
export const MAIL_INTERVAL = 300000;
export const FORM_LIMIT = 600000;
export function initialWorld() { return { version: 1, consent: false, accounts: [], activeId: null, sequence: 0, posts: [], likes: [], saved: [], comments: {}, watched: [], subscriptions: [], civic: null }; }
export function loadWorld(storage) { try { const value = JSON.parse((storage ?? globalThis.localStorage)?.getItem(WORLD_KEY)); return value?.version === 1 && Array.isArray(value.accounts) ? { ...initialWorld(), ...value } : initialWorld(); } catch { return initialWorld(); } }
export const activeAccount = state => state.accounts.find(account => account.id === state.activeId) || null;
export function addMail(state, from, subject, body, now = Date.now()) {
  const account = activeAccount(state); if (!account) return null;
  const mail = { id: `mail-${++state.sequence}`, from, subject, body, time: now, read: false, starred: false, folder: 'inbox' };
  account.messages.unshift(mail); account.messages = account.messages.slice(0, 120); return mail;
}
export function createAccount(state, alias, name, now = Date.now()) {
  const safeAlias = alias.trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9._-]{1,23}$/.test(safeAlias)) throw new Error('Bitte 2 bis 24 Buchstaben oder Zahlen. Punkte, Bindestriche und Unterstriche gehen auch.');
  if (state.accounts.some(account => account.alias === safeAlias)) throw new Error('Dieses Spaßkonto gibt es hier schon. Bitte unten anmelden.');
  if (state.accounts.length >= 8) throw new Error('Acht Spaßkonten reichen diesem Browser. Bitte ein vorhandenes benutzen.');
  const account = { id: `account-${++state.sequence}`, alias: safeAlias, name: name.trim().slice(0, 30) || safeAlias, email: `${safeAlias}@gaehmail.invalid`, messages: [], memberships: ['gaehmail'], purchases: [], orders: [], nextMailAt: now + MAIL_INTERVAL, mailCycle: 0 };
  state.accounts.push(account); state.activeId = account.id;
  addMail(state, 'Gähmail', 'Willkommen. Wir schicken Ihnen bald zu viel.', `Hallo ${account.name},\n\nIhr Spaßkonto ist fertig. Sie können sich damit im ganzen Gurgel-Internet anmelden. Ein Passwort brauchen wir nicht. Wir sind hier unter uns.\n\nDies ist ein fiktives Postfach. Nachrichten verlassen diesen Browser nicht.`, now);
  return account;
}
export function nextUnwantedMail(state, now = Date.now()) {
  const account = activeAccount(state); if (!account) return null;
  const deck = shuffled(mailTemplates, hash(account.alias) + Math.floor(account.mailCycle / mailTemplates.length));
  const [from, subject, body] = deck[account.mailCycle++ % deck.length];
  account.nextMailAt = now + MAIL_INTERVAL;
  return addMail(state, from, subject, body, now);
}
export function dueMail(state, now = Date.now()) { const account = activeAccount(state); return account && now >= account.nextMailAt ? nextUnwantedMail(state, now) : null; }
export function joinService(state, site) { const account = activeAccount(state); if (!account) return false; if (!account.memberships.includes(site)) { account.memberships.push(site); addMail(state, extraSites[site]?.name || { buyazon: 'Buyazon', youtuba: 'YouTuba', wickipedia: 'Wickipedia', chatgpp: 'ChatGPP', klein: 'Kleinunzeigen', forum: 'Schlechtefrage', news: 'Tagesblatt' }[site] || site, 'Anmeldung erfolgreich. Abmelden ist auch eine Option.', 'Ihr Konto wurde verknüpft. Wir wissen jetzt, dass Sie einen Knopf angeklickt haben.'); } return true; }
export function recordPurchase(state, product, now = Date.now()) { const account = activeAccount(state); if (!account) return null; const order = { id: `B-${++state.sequence}`, title: product.title, price: product.price, time: now }; account.purchases.unshift(order); account.purchases = account.purchases.slice(0, 30); addMail(state, 'Buyazon', `Bestellung ${order.id}: schon gestern zugestellt`, `${product.title}\nPreis: ${product.price.toFixed(2)} Euro.\nAblageort: irgendwo bei Ihnen. Für eine genaue Angabe haben wir keine Adresse.\n\nEs wird nichts geliefert oder bezahlt.`, now); return order; }
export function recordWatch(state, video) { const account = activeAccount(state); if (!account) return; const entry = { title: video.title, channel: video.channel, time: Date.now(), accountId: account.id }; state.watched = [entry, ...state.watched.filter(row => row.title !== entry.title || row.accountId !== account.id)].slice(0, 40); }
export function lastWatched(state) { return state.watched.find(row => row.accountId === state.activeId); }
export function startCivic(state, type = 'wohn', now = Date.now()) { const account = activeAccount(state); state.civic = { accountId: account?.id, type, deadline: now + FORM_LIMIT, fields: { email: account?.email || '', name: account?.name || '', age: '', purchase: '', video: '', printer: '', potato: '', reason: '', receipt: '', agreement: false }, status: 'draft' }; return state.civic; }
export function remainingCivic(state, now = Date.now()) { return Math.max(0, Math.ceil(((state.civic?.deadline || now) - now) / 1000)); }
export function submitCivic(state, now = Date.now()) {
  const draft = state.civic; const account = activeAccount(state);
  if (!draft || draft.accountId !== account?.id || !account) throw new Error('Bitte mit dem Spaßkonto dieses Antrags anmelden.');
  if (draft.status !== 'draft') throw new Error('Dieser Antrag wurde bereits bearbeitet.');
  if (!remainingCivic(state, now)) { draft.status = 'expired'; throw new Error('Frist abgelaufen. Sie wurden als Serverbelastung vorgemerkt.'); }
  if (draft.fields.email !== account.email) throw new Error('Die Gähmail-Adresse gehört nicht zum angemeldeten Spaßkonto.');
  if (!draft.fields.name.trim() || !/^\d{1,3}$/.test(draft.fields.age) || Number(draft.fields.age) > 150) throw new Error('Fiktiven Namen und ein Alter von 0 bis 150 eintragen.');
  const purchase = account.purchases[0]?.title || 'Noch nichts gekauft'; const video = lastWatched(state)?.title || 'Noch kein Video angesehen';
  if (draft.fields.purchase !== purchase) throw new Error('Die Einkaufsabteilung kennt einen anderen letzten Kauf. Feld bitte prüfen.');
  if (draft.fields.video !== video) throw new Error('Die Bewegtbildabteilung kennt ein anderes letztes Video. Feld bitte prüfen.');
  if (!draft.fields.printer || !draft.fields.potato || !draft.fields.reason.trim() || !draft.fields.receipt.trim() || !draft.fields.agreement) throw new Error('Die Pflichtfelder sind noch nicht vollständig. Auch die Kartoffel zählt.');
  draft.status = 'submitted'; draft.reference = `BB-${++state.sequence}-B`;
  addMail(state, 'Bürgerbürokratie', `Antrag ${draft.reference} erfolgreich in die Warteschlange gestellt`, 'Ihr Antrag wurde zur Bearbeitung der Bearbeitung weitergeleitet. Voraussichtliche Wartezeit: 6 bis 8 Werktagsbegriffe. Bitte keine weiteren Informationen schicken, wir haben schon genug Felder.\n\nFiktiver Vorgang. Keine Behörde erhält Daten.', now); return draft.reference;
}
