import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8', '.mp4': 'video/mp4', '.md': 'text/plain; charset=utf-8' };
http.createServer(async (req, res) => {
  try {
    const relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const filename = path.resolve(root, `.${relative === '/' ? '/index.html' : relative}`);
    if (!filename.startsWith(root) || relative.includes('..')) { res.writeHead(403).end(); return; }
    const content = await readFile(filename);
    const headers = { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes' };
    if (req.headers.range) {
      const range = req.headers.range.match(/^bytes=(\d*)-(\d*)$/);
      let start = range?.[1] ? Number(range[1]) : 0;
      let end = range?.[2] ? Number(range[2]) : content.length - 1;
      if (range && !range[1] && range[2]) { start = Math.max(0, content.length - end); end = content.length - 1; }
      end = Math.min(end, content.length - 1);
      if (!range || start > end || start >= content.length) { res.writeHead(416, { 'Content-Range': `bytes */${content.length}` }).end(); return; }
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${content.length}`, 'Content-Length': end - start + 1 });
      res.end(content.subarray(start, end + 1));
      return;
    }
    res.writeHead(200, { ...headers, 'Content-Length': content.length });
    res.end(content);
  } catch { res.writeHead(404).end('Nicht gefunden. Diesmal wirklich.'); }
}).listen(port, '127.0.0.1', () => console.log(`Gurgel: http://127.0.0.1:${port}`));
