// Minimal foreground static server for the built site (dist/), used by
// Playwright's webServer. Astro 7's `astro preview` daemonises and exits,
// which Playwright treats as an early crash — so tests use this instead.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT || 4321);
const BASE = '/php2shell-anatomy';
const ROOT = fileURLToPath(new URL('../dist/', import.meta.url));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    if (pathname === BASE) pathname = `${BASE}/`;
    if (pathname.startsWith(`${BASE}/`)) pathname = pathname.slice(BASE.length);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = normalize(join(ROOT, pathname));
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end('forbidden');
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
}).listen(PORT, () => {
  console.log(`serving dist at http://localhost:${PORT}${BASE}/`);
});
