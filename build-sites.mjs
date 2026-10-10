import fs from 'node:fs';
import path from 'node:path';

fs.rmSync('dist', {recursive: true, force: true});
fs.mkdirSync('dist/client', {recursive: true});
for (const entry of fs.readdirSync('.')) {
  if (!fs.statSync(entry).isFile()) continue;
  if (!/\.(html|css|js|json|jpg|png|svg)$/.test(entry)) continue;
  if (entry === 'sites-worker.js') continue;
  fs.copyFileSync(entry, path.join('dist/client', entry));
}

fs.copyFileSync('sites-worker.js', path.join('dist', 'index.js'));
