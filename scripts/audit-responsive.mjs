import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const src=path.join(root,'src');
const failures=[];
const notes=[];
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(/\.(css|ts|tsx)$/.test(entry.name))files.push(full)}}
walk(src);
const all=files.map(file=>({file,text:fs.readFileSync(file,'utf8')}));
const relative=file=>path.relative(root,file).replaceAll('\\','/');
function fail(file,message){failures.push(`${relative(file)}: ${message}`)}
function requireIn(file,needles,label){const text=fs.readFileSync(file,'utf8');for(const needle of needles){if(!text.includes(needle))fail(file,`${label}: faltando ${needle}`)}}

for(const {file,text} of all){
  if(/\b100vh\b/.test(text))fail(file,'use svh/dvh/lvh em vez de 100vh');
  if(/navigator\.userAgent|screen\.width/.test(text))fail(file,'layout não pode depender de detecção de dispositivo/user-agent');
  if(/window\.innerWidth|\binnerWidth\b/.test(text))fail(file,'layout não pode depender de innerWidth');
  if(/matchMedia\(\s*['"]\(max-width:/.test(text))fail(file,'componente não deve inferir apresentação por media query JS de viewport');
  if(/(?:html|body)[^{]*\{[^}]*overflow-x\s*:\s*(?:hidden|clip)/s.test(text))fail(file,'não mascarar overflow horizontal globalmente');
}

const globalCss=path.join(src,'app/globals.css');
requireIn(globalCss,[
  'env(safe-area-inset-top)',
  '100dvh',
  'container-type:inline-size',
  'repeat(auto-fit,minmax',
  '@media (hover:none)',
  '.calendar-month{',
  'overflow-x:auto'
],'sistema responsivo global');

const homeCss=path.join(src,'app/home.module.css');
requireIn(homeCss,['container-type:inline-size','cqi','@container','@media (max-height:42rem)'],'Home responsiva intrínseca');

const book=path.join(src,'modules/passport/Book.tsx');
requireIn(book,['ResizeObserver','data-spread','spreadSize'],'Passaporte container-aware');

const test=path.join(root,'tests/e2e/05-responsive.spec.ts');
if(!fs.existsSync(test))fail(test,'suíte responsiva ausente');
else requireIn(test,['347','529','713','887','1113','1371','200%','scrollWidth'],'matriz de QA responsivo');

const mediaCount=all.filter(x=>x.file.endsWith('.css')).reduce((n,x)=>n+(x.text.match(/@media\s*\(/g)||[]).length,0);
const containerCount=all.filter(x=>x.file.endsWith('.css')).reduce((n,x)=>n+(x.text.match(/@container\s*\(/g)||[]).length,0);
notes.push(`CSS media queries: ${mediaCount}`);
notes.push(`CSS container queries: ${containerCount}`);
notes.push(`Arquivos auditados: ${files.length}`);

if(failures.length){console.error('RESPONSIVE AUDIT: FAIL');for(const item of failures)console.error(`- ${item}`);process.exit(1)}
console.log('RESPONSIVE AUDIT: PASS');for(const note of notes)console.log(`- ${note}`);
