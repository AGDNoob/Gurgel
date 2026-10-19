import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { stampIndex } from '../scripts/stamp.mjs';

test('index.html verweist auf die aktuellen Versionen aller Module und Stylesheets', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.equal(html, await stampIndex(html), 'index.html ist veraltet. Bitte `npm run stamp` ausführen.');
  const map = JSON.parse(html.match(/<script type="importmap">(.*?)<\/script>/)[1]);
  for (const [name, target] of Object.entries(map.imports)) {
    assert.match(target, /\?v=[0-9a-f]{10}$/);
    assert.ok(existsSync(new URL(`.${name.slice(1)}`, new URL('../', import.meta.url))), name);
  }
  assert.ok(html.indexOf('type="importmap"') < html.indexOf('type="module"'), 'Die Import-Map muss vor dem ersten Modul stehen.');
});

test('Vorschaubild für geteilte Links liegt lokal vor', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const image = html.match(/property="og:image" content="https:\/\/agdnoob\.github\.io\/Gurgel\/([^"]+)"/)[1];
  const png = await readFile(new URL(`../${image}`, import.meta.url));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1200, 630]);
});
