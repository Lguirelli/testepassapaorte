import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {dirname, extname, join, resolve} from 'node:path';

const root=process.cwd();
const site=join(root,'github-pages');
const failures=[];
const pass=(name)=>console.log(`✓ ${name}`);
const fail=(name,detail)=>{failures.push(`${name}: ${detail}`);console.error(`✗ ${name}: ${detail}`);};

const forbiddenPaths=['src','public','drizzle','seed','tests','docker-compose.yml','drizzle.config.ts','next.config.ts','next-env.d.ts','tsconfig.json','.env.example'];
for(const path of forbiddenPaths){
  if(existsSync(join(root,path))) fail('visual-only',`backend/runtime path still exists: ${path}`);
}
if(!failures.length) pass('visual-only repository has no backend/runtime directories');

const required=['index.html','app.js','data.js','references.js','dashboards.js','styles.css','references.css','dashboard.css','site.webmanifest'];
for(const path of required){
  if(!existsSync(join(site,path))) fail('required-static-file',path);
}
if(required.every(path=>existsSync(join(site,path)))) pass('required presentation files are present');

const vercel=JSON.parse(readFileSync(join(root,'vercel.json'),'utf8'));
if(vercel.framework!==null) fail('vercel','framework must be null');
if(vercel.outputDirectory!=='github-pages') fail('vercel','outputDirectory must be github-pages');
if(vercel.framework===null&&vercel.outputDirectory==='github-pages') pass('Vercel configured as plain static site');

const rootIndex=readFileSync(join(root,'index.html'),'utf8');
if(!rootIndex.includes('<base href="./github-pages/">')) fail('github-pages-bootstrap','root index must target ./github-pages/');
else pass('GitHub Pages root bootstrap points to static presentation');

const siteIndex=readFileSync(join(site,'index.html'),'utf8');
const refs=[...siteIndex.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(m=>m[1]);
for(const ref of refs){
  if(/^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(ref)) continue;
  const clean=ref.split(/[?#]/)[0];
  if(!clean) continue;
  const target=resolve(dirname(join(site,'index.html')),clean);
  if(!target.startsWith(resolve(site))) fail('asset-boundary',ref);
  else if(!existsSync(target)) fail('missing-asset',ref);
}
if(!failures.some(x=>x.startsWith('asset-boundary')||x.startsWith('missing-asset'))) pass('index references resolve inside static presentation');

const textExt=new Set(['.html','.css','.js','.json','.md','.mjs','.yml','.yaml']);
const files=[];
const walk=dir=>{for(const name of readdirSync(dir)){const path=join(dir,name);const st=statSync(path);if(st.isDirectory()) walk(path);else if(textExt.has(extname(path).toLowerCase())) files.push(path);}};
walk(root);

const forbiddenTerms=[
  ['supabase',/supabase/i],
  ['database-url',/DATABASE_URL/],
  ['db-mode',/DB_MODE/],
  ['pglite',/pglite/i],
  ['drizzle',/drizzle/i],
  ['postgres',/postgres(?:ql)?/i],
  ['server-auth-secret',/SESSION_SECRET|IDENTITY_PEPPER/]
];
for(const [label,pattern] of forbiddenTerms){
  const hits=[];
  for(const file of files){
    if(file.endsWith('scripts/validate-static.mjs')) continue;
    const text=readFileSync(file,'utf8');
    if(pattern.test(text)) hits.push(file.slice(root.length+1));
  }
  if(hits.length) fail(`forbidden-${label}`,hits.slice(0,12).join(', '));
  else pass(`no ${label} references`);
}

const networkPatterns=[['fetch',/\bfetch\s*\(/],['xhr',/XMLHttpRequest/],['websocket',/\bWebSocket\s*\(/],['eventsource',/\bEventSource\s*\(/],['api-route',/["'`]\/api\//]];
const jsFiles=files.filter(f=>f.startsWith(site)&&extname(f)==='.js');
for(const [label,pattern] of networkPatterns){
  const hits=jsFiles.filter(file=>pattern.test(readFileSync(file,'utf8'))).map(file=>file.slice(root.length+1));
  if(hits.length) fail(`network-${label}`,hits.join(', '));
  else pass(`no ${label} backend calls in presentation JavaScript`);
}

const demoMarkers=['Demonstração','demonstrativo','simulação','fictício'];
const combined=jsFiles.map(f=>readFileSync(f,'utf8')).join('\n')+'\n'+siteIndex;
if(!demoMarkers.some(marker=>combined.toLowerCase().includes(marker.toLowerCase()))) fail('demo-disclosure','presentation must identify simulated content');
else pass('presentation clearly marks simulated/demo content');

if(failures.length){
  console.error(`\n${failures.length} validation problem(s).`);
  process.exit(1);
}
console.log('\nStatic visual presentation validated successfully.');
