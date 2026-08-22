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
  const source = `${sharedPrelude}${await wrappedSources(files)}\n(() => {\n  if (globalThis.lucide) globalThis.lucide.createIcons();\n  const mountNode = document.getElementById('root');\n  if (!mountNode || !globalThis.${appName} || !globalThis.LanguageProvider) return;\n  globalThis.ReactDOM.createRoot(mountNode).render(\n    globalThis.React.createElement(\n      globalThis.LanguageProvider,\n      null,\n      globalThis.React.createElement(globalThis.${appName})\n    )\n  );\n})();`;

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

async function optimizeHtml(filename, bundleName) {
  const file = path.join(out, filename);
  let html = await readFile(file, 'utf8');

  html = html.replace(
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",
    "script-src 'self' 'unsafe-inline' https://unpkg.com"
  );

  const runtimeBlock = /  <script src="https:\/\/unpkg\.com\/react@18\.3\.1\/umd\/react\.production\.min\.js"[\s\S]*?  <\/script>\n\n<\/body>/;
  const replacement = `  <script defer src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js" crossorigin="anonymous"></script>\n  <script defer src="assets/${bundleName}.min.js?v=20260822-performance1"></script>\n\n</body>`;

  if (!runtimeBlock.test(html)) {
    throw new Error(`Could not find runtime script block in ${filename}`);
  }
  html = html.replace(runtimeBlock, replacement);

  html = html.replace(
    '</style>\n<link rel="stylesheet" href="responsive.css',
    `  /* Skip expensive rendering work for sections well below the initial viewport. */\n  #about, #collections, #testimonials, #work, #pricing, #contact {\n    content-visibility: auto;\n    contain-intrinsic-size: 900px;\n  }\n  @media (max-width: 720px) {\n    .tb-hero-image { animation: none !important; will-change: auto !important; }\n  }\n</style>\n<link rel="stylesheet" href="responsive.css`
  );

  await writeFile(file, html);
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

await Promise.all([
  optimizeHtml('index.html', 'app-home'),
  optimizeHtml('Projects.html', 'app-projects')
]);

await writeFile(path.join(out, '.nojekyll'), '');
console.log(`Static site built successfully in ${out}`);
