import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const failures=[];const passes=[];
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const exists=(p)=>fs.existsSync(path.join(root,p));
const pass=(name,detail)=>passes.push(`${name}: ${detail}`);
const fail=(name,detail)=>failures.push(`${name}: ${detail}`);
const must=(file,needles,name=file)=>{if(!exists(file)){fail(name,'arquivo ausente');return;}const text=read(file);for(const needle of needles){text.includes(needle)?pass(`${name}:${needle}`,'presente'):fail(name,`faltando ${needle}`)}};
const forbid=(file,patterns,name=file)=>{if(!exists(file))return;const text=read(file);for(const p of patterns){p.test(text)?fail(name,`padrão proibido ${p}`):pass(`${name}:${p}`,'ausente')}};

must('github-pages/index.html',['uxui-system.css','<main id="app" tabindex="-1">','role="status" aria-live="polite"'],'Pages shell');
forbid('github-pages/index.html',[/Material\+Symbols/i,/fonts\.googleapis\.com/i,/aria-live="polite"><\/main>/i],'Pages shell');
must('github-pages/icon-registry.js',["--ui-icon-url:url('",'assets/icons-v3/','aria-hidden="true"'],'SVG icon runtime');
forbid('github-pages/icon-registry.js',[/material-symbols-outlined/i,/Material Symbols/i],'SVG icon runtime');
must('github-pages/uxui-system.css',[
  '--target-min:2.75rem','@media (hover:hover) and (pointer:fine)','@media (hover:none), (pointer:coarse)','@media (prefers-reduced-motion:reduce)','@media (prefers-contrast:more)','@media (forced-colors:active)','env(safe-area-inset-top','repeat(auto-fit,minmax','max-height:40rem','min-block-size:var(--target-min)','container-type:inline-size'
],'Pages UX/UI CSS');
must('github-pages/static-interactions.js',["e.key!=='Tab'","e.key==='Escape'",'focusables=()=>','document.addEventListener(\'pointerdown\'','compact.addEventListener'],'Mobile navigation accessibility');
must('src/design-system/tokens/uxui.css',['--target-min:2.75rem','@media (hover:hover) and (pointer:fine)','@media (hover:none), (pointer:coarse)','@media (prefers-reduced-motion:reduce)'],'Next UX/UI tokens');
must('src/app/globals.css',["@import '../design-system/tokens/uxui.css';"],'Next UX/UI import');
must('src/components/MainNavigation.tsx',["window.matchMedia('(hover:hover) and (pointer:fine)').matches","event.key==='Escape'","event.key!=='Tab'"],'Next navigation input/accessibility');

const pagesCss=read('github-pages/uxui-system.css');
if((pagesCss.match(/--radius-/g)||[]).length>=5)pass('radius-system','tokenized');else fail('radius-system','tokens insuficientes');
if(pagesCss.includes('.place-card-action-label{max-inline-size:none')||pagesCss.includes('.place-card-action-label{'))pass('card-affordance','ação visível sem hover');else fail('card-affordance','CTA de card não auditado');

const pkg=JSON.parse(read('package.json'));
const staticCmd=pkg.scripts?.['validate:static']||'';
staticCmd.includes('audit-uxui.mjs')?pass('validate:static','inclui UX/UI audit'):fail('validate:static','não inclui audit-uxui.mjs');

if(failures.length){console.error('UX/UI AUDIT: FAIL');for(const x of failures)console.error(`- ${x}`);process.exit(1)}
console.log('UX/UI AUDIT: PASS');
console.log(`- verificações aprovadas: ${passes.length}`);
