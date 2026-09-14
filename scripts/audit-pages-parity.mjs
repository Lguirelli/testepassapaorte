import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const fail = (message) => {
  console.error(`GitHub Pages parity audit failed: ${message}`);
  process.exitCode = 1;
};

const foundation = read('src/design-system/tokens/foundation.css');
const content = read('src/components/content.tsx');
const home = read('src/components/HomeExperience.tsx');
const routes = read('src/modules/trips/ready-routes.ts');
const index = read('github-pages/index.html');
const config = read('github-pages/ui-config.js');
const shell = read('github-pages/ui-shell.js');
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
  if (!compactContent.includes(contract.replace(/\s+/g, ''))) fail(`current PlaceCard contract changed (${contract}); update github-pages/product-sync.css`);
}

for (const rule of ['height:clamp(190px,22vw,220px)','min-height:190px','max-height:220px','object-fit:cover']) {
  if (!sync.replace(/\s+/g, '').includes(rule.replace(/\s+/g, ''))) fail(`GitHub Pages is missing PlaceCard media rule: ${rule}`);
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

const nextContracts=[
  ['ready route primary path','href="/roteiros"'],
  ['custom builder secondary path','href="/roteiro"'],
  ['ready route slider','home-route-slider'],
  ['partner circular gallery','home-partner-gallery'],
  ['FAQ interaction','home-faq'],
  ['passport distinction','Planejar é uma coisa. Viver é outra.'],
];
for(const [label,needle] of nextContracts)if(!home.includes(needle))fail(`Next home lost ${label}: ${needle}`);

const readyRouteSlugs=['serra-negra-essencial-2-dias','fim-de-semana-a-dois','familia-com-criancas','dia-de-chuva','natureza-e-mirantes','cafes-e-sabores'];
for(const needle of ['READY_ROUTES',...readyRouteSlugs])if(!routes.includes(needle))fail(`ready route catalog lost contract: ${needle}`);

const navigationContracts=[
  ['explicit home navigation',"label:'Início'"],
  ['ready routes navigation',"href:'#/roteiros'"],
  ['custom builder navigation',"label:'Criar do zero'"],
  ['custom builder href',"href:'#/roteiro'"],
];
for(const [label,needle] of navigationContracts)if(!config.includes(needle))fail(`GitHub Pages canonical navigation lost ${label}: ${needle}`);
if(shell.includes('normalizedNav'))fail('ui-shell.js must consume canonical navigation without rewriting it');
if(!shell.includes('C.navigation.main.map'))fail('ui-shell.js no longer consumes canonical navigation directly');

for(const slug of readyRouteSlugs)if(!config.includes(`slug:'${slug}'`))fail(`GitHub Pages ready route config lost slug: ${slug}`);
for(const question of ['Preciso responder perguntas para começar?','O roteiro pronto fica engessado?','Qual é a diferença entre roteiro e Passaporte?'])if(!config.includes(question))fail(`GitHub Pages FAQ config lost question: ${question}`);

const pagesContracts=[
  ['ready routes page','renderReadyRoutes'],
  ['ready route primary path','href=\"#/roteiros\"'],
  ['custom builder path','href=\"#/roteiro\"'],
  ['current home marker','data-current-home'],
  ['passport distinction','Planejar é uma coisa. Viver é outra.'],
  ['ready-route slug consumption','slug||r.id'],
  ['shared FAQ consumption','CONFIG.home?.faq'],
  ['gallery keyboard support',"e.key==='ArrowRight'"],
  ['gallery inertia','projected=delta+velocity*180'],
];
for(const [label,needle] of pagesContracts)if(!currentHomeJs.includes(needle))fail(`GitHub Pages lost ${label}: ${needle}`);

for (const selector of ['.ch-hero','.ch-gallery','.ch-route-slide','.ch-card-grid4','.ch-faq','.ch-passport','.ch-final']) {
  if (!currentHomeCss.includes(selector)) fail(`current-home.css is missing ${selector}`);
}

if (!process.exitCode) console.log('GitHub Pages parity audit passed: tokens, canonical navigation, six ready routes, FAQ, card media and interaction contracts are synchronized.');
