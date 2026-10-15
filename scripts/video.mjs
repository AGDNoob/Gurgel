// Drei Sekunden handgemachter Clip. FFmpeg wird nur zum erneuten Erstellen benötigt.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const font = process.platform === 'win32' ? 'C\\:/Windows/Fonts/arialbd.ttf' : '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
const text = (value, condition, size, color = 'white') => `drawtext=fontfile='${font}':text='${value}':fontcolor=${color}:fontsize=${size}:x=(w-tw)/2:y=(h-th)/2:enable='${condition}'`;
const filter = [
  'color=c=0x151515:s=960x540:r=25:d=3',
  "drawbox=x=60:y=440:w='840*t/3':h=8:color=red:t=fill",
  text('VERSUCH GESTARTET', 'lt(t,0.9)', 52),
  text('warte', 'between(t,0.9,1.8)', 68),
  text('GONE WRONG', 'gte(t,1.8)', 84, '0xffdb55')
].join(',');
const result = spawnSync('ffmpeg', ['-y', '-f', 'lavfi', '-i', filter, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', fileURLToPath(new URL('../assets/versuch.mp4', import.meta.url))], { encoding: 'utf8', windowsHide: true });
if (result.status !== 0) { console.error(result.stderr || result.error?.message); process.exit(1); }
console.log('3-Sekunden-Clip erstellt.');
