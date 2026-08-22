import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist');

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const entries = [
  'index.html',
  'Projects.html',
  'colors_and_type.css',
  'responsive.css',
  'robots.txt',
  'sitemap.xml',
  'assets',
  'fonts'
];

for (const entry of entries) {
  const source = path.join(root, entry);
  if (existsSync(source)) {
    await cp(source, path.join(out, entry), { recursive: true });
  }
}

console.log(`Static site built successfully in ${out}`);
