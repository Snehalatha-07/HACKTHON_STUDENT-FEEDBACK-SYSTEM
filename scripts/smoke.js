#!/usr/bin/env node
import http from 'http';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const distDir = path.resolve(process.cwd(), 'dist');

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (e) {
    return false;
  }
}

function startStaticServer(port = 8080) {
  const server = http.createServer((req, res) => {
    // serve files from dist, fallback to index.html
    const reqPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath = path.join(distDir, reqPath);
    if (reqPath === '/' || reqPath === '') filePath = path.join(distDir, 'index.html');
    if (filePath.endsWith('/')) filePath = path.join(filePath, 'index.html');

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        // fallback to index.html
        const index = path.join(distDir, 'index.html');
        if (fileExists(index)) {
          res.end(fs.readFileSync(index));
        } else {
          res.writeHead(404);
          res.end('Not found');
        }
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const map = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
        '.json': 'application/json'
      };
      res.writeHead(200, { 'Content-Type': map[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(port, () => resolve(server));
  });
}

async function run() {
  console.log('Smoke: verifying build output exists...');

  if (!fileExists(distDir)) {
    console.error('dist directory not found. Make sure `npm run build` completed successfully.');
    process.exit(2);
  }

  const indexFile = path.join(distDir, 'index.html');
  if (!fileExists(indexFile)) {
    console.error('dist/index.html missing. Build may have failed.');
    process.exit(2);
  }

  console.log('dist found. Starting temporary static server on port 8080...');
  const server = await startStaticServer(8080);

  const routes = ['/', '/auth', '/login', '/register', '/student', '/admin'];
  const results = [];

  for (const route of routes) {
    const url = `http://127.0.0.1:8080${route}`;
    results.push(await fetchUrl(url).catch(err => ({ route, ok: false, status: 0, err })));
  }

  server.close();

  let failed = false;
  for (const r of results) {
    if (!r.ok || r.status >= 400) {
      failed = true;
      console.error(`Route ${r.route} -> FAILED (status: ${r.status})`);
    } else {
      console.log(`Route ${r.route} -> OK (status: ${r.status})`);
    }
  }

  if (failed) {
    console.error('Smoke checks failed');
    process.exit(3);
  }

  console.log('Smoke checks passed');
  process.exit(0);
}

function fetchUrl(url, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      // consume data
      res.on('data', () => {});
      res.on('end', () => resolve({ route: new URL(url).pathname, ok: res.statusCode < 400, status: res.statusCode }));
    });
    req.on('error', reject);
    req.setTimeout(timeout, () => {
      req.destroy(new Error('timeout'));
    });
  });
}

run().catch(err => {
  console.error('Smoke encountered an error:', err);
  process.exit(1);
});
