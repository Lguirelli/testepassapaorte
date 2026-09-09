import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.join(process.cwd(), 'artifacts', 'visual-audit');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (/\.png$/i.test(entry.name)) files.push(full);
  }
  return files;
}

await fs.mkdir(root, { recursive: true });
const files = (await walk(root)).sort();
const cards = files.map((file) => {
  const rel = path.relative(root, file).split(path.sep).join('/');
  const label = rel.replace(/\.png$/i, '').replaceAll('/', ' · ');
  return `<figure><a href="${rel}"><img src="${rel}" alt="${label}" loading="lazy"></a><figcaption>${label}</figcaption></figure>`;
}).join('\n');

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Passaporte · Visual Audit</title>
<style>
:root{font-family:Arial,sans-serif;color:#181818;background:#f5f3ed}body{margin:0;padding:32px}header{max-width:1200px;margin:0 auto 28px}h1{margin:.2rem 0}p{color:#555}.grid{max-width:1400px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}figure{margin:0;background:white;border:1px solid #ddd;border-radius:12px;overflow:hidden;box-shadow:0 8px 28px #0001}img{display:block;width:100%;height:260px;object-fit:cover;object-position:top}figcaption{padding:12px;font-weight:700;font-size:14px}a{color:inherit}</style>
</head><body><header><small>Chromium + Playwright</small><h1>Visual Audit</h1><p>Clique em qualquer captura para abrir em resolução integral. Este relatório é gerado pelo GitHub Actions.</p></header><main class="grid">${cards || '<p>Nenhuma screenshot encontrada.</p>'}</main></body></html>`;

await fs.writeFile(path.join(root, 'index.html'), html);
console.log(`Galeria criada com ${files.length} screenshots em ${path.join(root, 'index.html')}`);
