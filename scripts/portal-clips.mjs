// Kleine eigene stumme Medien. Die DOM-Szenen werden mit der echten Zeit animiert.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
for (const duration of [8, 12, 30, 45]) {
  const target = fileURLToPath(new URL(`../assets/clip-${duration}.mp4`, import.meta.url));
  const result = spawnSync('ffmpeg', ['-y', '-f', 'lavfi', '-i', `color=c=0x262a24:s=640x360:r=20:d=${duration}`, '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', target], { encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) throw new Error(result.stderr || result.error?.message);
  console.log(`${duration}-Sekunden-Clip erstellt.`);
}
