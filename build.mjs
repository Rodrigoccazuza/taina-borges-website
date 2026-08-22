import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const root = process.cwd();
const out = path.join(root, 'dist');
const assetDir = path.join(root, 'assets');

const sharedPrelude = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
const ReactDOM = { createRoot, createPortal };
globalThis.React = React;
globalThis.ReactDOM = ReactDOM;
`;

const homeSources = [
  'src/data.js',
  'src/Primitives.jsx',
  'src/i18n.jsx',
  'src/Logo.jsx',
  'src/Header.jsx',
  'src/Hero.jsx',
  'src/Marquee.jsx',
  'src/Gallery.jsx',
  'src/Collections.jsx',
  'src/Pricing.jsx',
  'src/About.jsx',
  'src/Testimonials.jsx',
  'src/Contact.jsx',
  'src/BookingModal.jsx',
  'src/WhatsAppFloating.jsx',
  'src/Footer.jsx',
  'src/App.jsx'
];

const projectSources = [
  'src/data.js',
  'src/Primitives.jsx',
  'src/i18n.jsx',
  'src/Logo.jsx',
  'src/BookingModal.jsx',
  'src/WhatsAppFloating.jsx',
  'src/Footer.jsx',
  'src/ProjectsPage.jsx'
];

async function wrappedSources(files) {
  const chunks = [];
  for (const file of files) {
    const source = await readFile(path.join(root, file), 'utf8');
    chunks.push(`\n(()=>{\nconst React=globalThis.React;\nconst ReactDOM=globalThis.ReactDOM;\n${source}\n})();\n`);
  }
  return chunks.join('\n');
}

async function bundle(name, files, appName) {
  const source = `${sharedPrelude}${await wrappedSources(files)}\n(() => {\n  if (globalThis.lucide) globalThis.lucide.createIcons();\n  const root = document.getElementById('root');\n  if (!root || !globalThis.${appName} || !globalThis.LanguageProvider) return;\n  globalThis.ReactDOM.createRoot(root).render(\n    globalThis.React.createElement(\n      globalThis.LanguageProvider,\n      null,\n      globalThis.React.createElement(globalThis.${appName})\n    )\n  );\n})();`;

  await build({
    stdin: {
      contents: source,
      loader: 'jsx',
      resolveDir: root,
      sourcefile: `${name}.jsx`
    },
    bundle: true,
    minify: true,
    legalComments: 'none',
    target: ['es2019'],
    format: 'iife',
    outfile: path.join(assetDir, `${name}.min.js`)
  });
}

await mkdir(assetDir, { recursive: true });
await Promise.all([
  bundle('app-home', homeSources, 'App'),
  bundle('app-projects', projectSources, 'ProjectsApp')
]);

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

await writeFile(path.join(out, '.nojekyll'), '');
console.log(`Static site built successfully in ${out}`);
