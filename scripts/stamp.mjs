// Versieht Stylesheets und JavaScript-Module in index.html mit Inhalts-Hashes.
// GitHub Pages cacht jede Datei zehn Minuten. Ohne Versionen könnte ein Browser nach einem Push
// alte und neue Module mischen. Die Import-Map leitet jeden relativen Import auf die passende Version um.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const styles = ['styles.css', 'portals.css', 'twatsch.css'];
const START = '<!-- stamp:start -->';
const END = '<!-- stamp:end -->';

const version = async name => createHash('sha256').update(await readFile(new URL(name, root))).digest('hex').slice(0, 10);

export async function stampedBlock(indent = '    ') {
  const modules = (await readdir(root)).filter(name => name.endsWith('.js')).sort();
  const imports = {};
  for (const name of modules) imports[`./${name}`] = `./${name}?v=${await version(name)}`;
  const lines = [START];
  for (const name of styles) lines.push(`<link rel="stylesheet" href="./${name}?v=${await version(name)}">`);
  lines.push(`<script type="importmap">${JSON.stringify({ imports })}</script>`);
  lines.push(`<script type="module" src="${imports['./app.js']}"></script>`);
  lines.push(END);
  return lines.map(line => indent + line).join('\n');
}

export async function stampIndex(html) {
  const pattern = new RegExp(`^([ \\t]*)${START}[\\s\\S]*?${END}`, 'm');
  const match = html.match(pattern);
  if (!match) throw new Error(`index.html enthält keinen Block ${START} … ${END}.`);
  return html.replace(pattern, await stampedBlock(match[1]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = new URL('index.html', root);
  const html = await readFile(file, 'utf8');
  const next = await stampIndex(html);
  if (process.argv.includes('--check')) {
    if (next !== html) { console.error('index.html ist veraltet. Bitte `npm run stamp` ausführen.'); process.exit(1); }
    console.log('index.html ist aktuell.');
  } else if (next === html) console.log('index.html war bereits aktuell.');
  else { await writeFile(file, next); console.log('index.html aktualisiert.'); }
}
