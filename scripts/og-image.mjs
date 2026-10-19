// Erzeugt das Vorschaubild für geteilte Links (Open Graph, 1200 × 630).
// Die meisten Messenger zeigen keine SVG-Vorschauen, deshalb rendert ein lokaler Chrome oder Edge die Zeichnung als PNG.
// Der Browser wird nur zum Erstellen benötigt. Ein anderer Pfad lässt sich mit CHROME=… angeben.
import { writeFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const svgFile = fileURLToPath(new URL('../assets/og-image.tmp.svg', import.meta.url));
const pngFile = fileURLToPath(new URL('../assets/og-image.png', import.meta.url));
const browser = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(path => path && existsSync(path));
if (!browser) throw new Error('Kein Chrome oder Edge gefunden. Bitte CHROME=/pfad/zum/browser setzen.');
const letters = [['G', '#4285f4'], ['u', '#ea4335'], ['r', '#fbbc05'], ['g', '#4285f4'], ['e', '#34a853'], ['l', '#ea4335']];
const font = 'font-family="Arial, Helvetica, sans-serif"';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#ffffff"/>
<rect y="566" width="1200" height="64" fill="#f2f2f2"/>
<text x="600" y="250" text-anchor="middle" ${font} font-size="170" font-weight="500" letter-spacing="-8">${letters.map(([letter, color]) => `<tspan fill="${color}">${letter}</tspan>`).join('')}</text>
<rect x="250" y="310" width="700" height="76" rx="38" fill="#ffffff" stroke="#dadce0" stroke-width="2"/>
<circle cx="302" cy="345" r="13" fill="none" stroke="#9aa0a6" stroke-width="4"/><path d="M312 355l14 14" stroke="#9aa0a6" stroke-width="4" stroke-linecap="round"/>
<text x="346" y="358" ${font} font-size="32" fill="#202124">Wie viel Gurgel ist zu viel Gurgel?</text>
<text x="600" y="460" text-anchor="middle" ${font} font-size="40" fill="#3c4043">Die Suchmaschine, die es besser weiß.</text>
<text x="600" y="510" text-anchor="middle" ${font} font-size="26" fill="#70757a">Eine interaktive Internet-Parodie. Ganz ohne KI.</text>
<text x="600" y="606" text-anchor="middle" ${font} font-size="22" fill="#70757a">agdnoob.github.io/Gurgel</text>
</svg>`;

await writeFile(svgFile, svg);
try { execFileSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630', `--screenshot=${pngFile}`, pathToFileURL(svgFile).href], { stdio: 'ignore' }); }
finally { await rm(svgFile, { force: true }); }
console.log('assets/og-image.png erzeugt.');
