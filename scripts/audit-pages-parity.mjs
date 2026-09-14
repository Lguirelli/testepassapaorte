import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const fail = (message) => {
  console.error(`GitHub Pages parity audit failed: ${message}`);
  process.exitCode = 1;
};

const foundation = read('src/design-system/tokens/foundation.css');
const content = read('src/components/content.tsx');
const home = read('src/components/HomeExperience.tsx');
const index = read('github-pages/index.html');
const sync = read('github-pages/product-sync.css');
const currentHomeJs = read('github-pages/current-home.js');
const currentHomeCss = read('github-pages/current-home.css');

const tokenValue = (css, token) => {
  const match = css.match(new RegExp(`--${token}:([^;]+);`));
  return match?.[1]?.trim() || null;
};

for (const token of ['green', 'green-black', 'dark-green']) {
  const sourceValue = tokenValue(foundation, token);
  const pagesValue = tokenValue(sync, token);
  if (!sourceValue) fail(`source token --${token} was not found`);
  else if (pagesValue !== sourceValue) fail(`--${token} differs: source=${sourceValue}, pages=${pagesValue}`);
}

const compactContent = content.replace(/\s+/g, '');
for (const contract of [
  "height:'clamp(190px,22vw,220px)'",
  "minHeight:'190px'",
  "maxHeight:'220px'",
  "objectFit:'cover'",
]) {
  if (!compactContent.includes(contract.replace(/\s+/g, ''))) {
    fail(`current PlaceCard contract changed (${contract}); update github-pages/product-sync.css`);
  }
}

for (const rule of [
  'height:clamp(190px,22vw,220px)',
  'min-height:190px',
  'max-height:220px',
  'object-fit:cover',
]) {
  if (!sync.replace(/\s+/g, '').includes(rule.replace(/\s+/g, ''))) {
    fail(`GitHub Pages is missing PlaceCard media rule: ${rule}`);
  }
}

const uxuiPosition = index.indexOf('./uxui-system.css');
const syncPosition = index.indexOf('./product-sync.css');
const homeCssPosition = index.indexOf('./current-home.css');
const homeJsPosition = index.indexOf('./current-home.js');
if (syncPosition < 0) fail('product-sync.css is not loaded by github-pages/index.html');
else if (uxuiPosition < 0 || syncPosition < uxuiPosition) fail('product-sync.css must load after uxui-system.css');
if (homeCssPosition < syncPosition) fail('current-home.css must load after product-sync.css');
if (homeJsPosition < 0) fail('current-home.js is not loaded by github-pages/index.html');
if (!index.includes('psn-pages-version')) fail('Pages document is missing a release marker for cache diagnostics');

for (const phrase of [
  'Descubra Serra Negra do seu jeito.',
  'Organize os dias da sua viagem e guarde os lugares que fizeram parte dela.',
  'Descobertas que podem entrar no seu percurso',
  'Veja como as escolhas se encontram',
  'Encontre um ritmo para os seus dias',
  'Comece por aquilo que combina com você',
  'O mesmo lugar pode fazer sentido em momentos diferentes.',
  'Encontre um caminho pelo que chama sua atenção',
  'Planejar é uma coisa. Viver é outra.',
  'Comece pela curiosidade.',
]) {
  if (!home.includes(phrase)) fail(`current HomeExperience no longer contains expected phrase: ${phrase}`);
  if (!currentHomeJs.includes(phrase)) fail(`GitHub Pages current home is missing current product phrase: ${phrase}`);
}

for (const selector of ['.ch-hero','.ch-gallery','.ch-route-slide','.ch-card-grid4','.ch-faq','.ch-passport','.ch-final']) {
  if (!currentHomeCss.includes(selector)) fail(`current-home.css is missing ${selector}`);
}

if (!process.exitCode) {
  console.log('GitHub Pages parity audit passed: tokens, card media and current HomeExperience structure are synchronized.');
}
