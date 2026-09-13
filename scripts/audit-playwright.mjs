import {readFileSync,existsSync} from 'node:fs';

const root=new URL('../',import.meta.url);
const read=(path)=>readFileSync(new URL(path,root),'utf8');
const pkg=JSON.parse(read('package.json'));
const config=read('playwright.config.ts');
const ci=read('.github/workflows/ci.yml');
const interactions=read('tests/e2e/06-interactions.spec.ts');
const responsive=read('tests/e2e/05-responsive.spec.ts');
const publicSpec=read('tests/e2e/00-public.spec.ts');

const checks=[
  ['@playwright/test fixado',pkg.devDependencies?.['@playwright/test']==='1.63.0'],
  ['Axe Playwright fixado',pkg.devDependencies?.['@axe-core/playwright']==='4.13.0'],
  ['script instala Chromium',pkg.scripts?.['playwright:install']==='playwright install chromium'],
  ['script remoto existe',pkg.scripts?.['test:e2e:remote']==='node scripts/e2e-remote.mjs'&&existsSync(new URL('scripts/e2e-remote.mjs',root))],
  ['Chromium explícito',config.includes("browserName:'chromium'")],
  ['matriz mobile/tablet/desktop',config.includes("name:'mobile'")&&config.includes("name:'tablet'")&&config.includes("name:'desktop'")&&config.includes("name:'desktop-wide'")],
  ['projeto reduced motion',config.includes("name:'reduced-motion'")&&config.includes("reducedMotion:'reduce'")],
  ['artefatos de falha',config.includes("trace:'retain-on-failure'")&&config.includes("screenshot:'only-on-failure'")&&config.includes("video:'retain-on-failure'")],
  ['CI instala browser',ci.includes('npm run playwright:install:ci')],
  ['CI executa E2E',ci.includes('npm run test:e2e')],
  ['Axe cobre público',publicSpec.includes("@axe-core/playwright")&&publicSpec.includes('critical')&&publicSpec.includes('serious')],
  ['responsividade aleatória',responsive.includes('347')&&responsive.includes('529')&&responsive.includes('713')&&responsive.includes('887')&&responsive.includes('1113')&&responsive.includes('1371')],
  ['targets de interação 44px',responsive.includes('toBeGreaterThanOrEqual(44)')],
  ['interações premium cobertas',interactions.includes('home-warp-title')&&interactions.includes('main-dock-navigation')&&interactions.includes('home-partner-gallery')&&interactions.includes('home-route-slider')&&interactions.includes('home-faq')],
];

const failures=checks.filter(([,ok])=>!ok);
for(const [label,ok] of checks)console.log(`${ok?'PASS':'FAIL'} ${label}`);
if(failures.length){console.error(`Playwright audit falhou: ${failures.length}/${checks.length}`);process.exit(1);}
console.log(`Playwright audit: PASS (${checks.length}/${checks.length})`);
