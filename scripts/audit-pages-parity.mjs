import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const fail = (message) => {
  console.error(`GitHub Pages parity audit failed: ${message}`);
  process.exitCode = 1;
};

const foundation = read('src/design-system/tokens/foundation.css');
const content = read('src/components/content.tsx');
const index = read('github-pages/index.html');
const sync = read('github-pages/product-sync.css');

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
if (syncPosition < 0) fail('product-sync.css is not loaded by github-pages/index.html');
else if (uxuiPosition < 0 || syncPosition < uxuiPosition) fail('product-sync.css must load after uxui-system.css');

if (!process.exitCode) {
  console.log('GitHub Pages parity audit passed: palette, interaction layer and PlaceCard media contract are synchronized.');
}
