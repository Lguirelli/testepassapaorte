import {readdir,readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

const ROOT=process.cwd();
const OUT=path.join(ROOT,'artifacts','repository-insights');
const IGNORE=new Set(['.git','.next','node_modules','artifacts','playwright-report','test-results','coverage','.turbo']);
const TEXT_EXT=new Set(['.ts','.tsx','.js','.mjs','.cjs','.json','.md','.html','.css','.scss','.yml','.yaml','.sql']);
const CODE_EXT=new Set(['.ts','.tsx','.js','.mjs','.cjs']);
const ASSET_EXT=new Set(['.png','.jpg','.jpeg','.webp','.svg','.gif','.ico','.woff','.woff2','.ttf','.otf']);
const SOURCE_ROOTS=['src/','github-pages/','scripts/','tests/','.github/'];

const rel=p=>path.relative(ROOT,p).split(path.sep).join('/');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const md=s=>String(s).replaceAll('|','\\|').replaceAll('\n',' ');

async function walk(dir){
  const out=[];
  for(const entry of await readdir(dir,{withFileTypes:true})){
    if(entry.name.startsWith('.')&&entry.name!=='.github'&&entry.name!=='.nojekyll')continue;
    if(IGNORE.has(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

function routeFromAppFile(file){
  const p=file.replace(/^src\/app\//,'').replace(/\/(page|route)\.(tsx?|jsx?)$/,'').replace(/^(page|route)\.(tsx?|jsx?)$/,'');
  if(file.endsWith('/route.ts')||file.endsWith('/route.tsx'))return `/api-or-handler/${p}`.replace(/\/$/,'');
  const route='/'+p.replace(/\(.*?\)\//g,'').replace(/\[\.\.\.(.*?)\]/g,':$1*').replace(/\[(.*?)\]/g,':$1');
  return route==='/'?'/':route.replace(/\/$/,'');
}

function isNextEntrypoint(file){return /^src\/app\/.+\/(page|layout|route|loading|error|not-found)\.(ts|tsx|js|jsx)$/.test(file)||/^src\/app\/(page|layout|route|loading|error|not-found)\.(ts|tsx|js|jsx)$/.test(file);}
function isConfigOrEntrypoint(file){
  return isNextEntrypoint(file)||[
    'src/middleware.ts','src/proxy.ts','next.config.ts','eslint.config.mjs','drizzle.config.ts','playwright.config.ts','playwright.visual.config.ts',
    'index.html','github-pages/index.html','github-pages/site.webmanifest','package.json'
  ].includes(file)||file.startsWith('.github/workflows/')||file.startsWith('drizzle/')||file.startsWith('seed/');
}

function resolveImport(fromFile,spec,filesSet){
  if(!spec||(!spec.startsWith('.')&&!spec.startsWith('@/')))return null;
  let base;
  if(spec.startsWith('@/'))base=path.join(ROOT,'src',spec.slice(2));
  else base=path.resolve(ROOT,path.dirname(fromFile),spec);
  const guesses=[base,...['.ts','.tsx','.js','.mjs','.cjs','.json','.css'].map(ext=>base+ext),...['index.ts','index.tsx','index.js','index.mjs'].map(name=>path.join(base,name))];
  for(const guess of guesses){const r=rel(guess);if(filesSet.has(r))return r;}
  return null;
}

function extractRefs(file,text,filesSet){
  const refs=new Set();
  if(CODE_EXT.has(path.extname(file))){
    const patterns=[/(?:from\s+|import\s*\(|require\s*\()\s*['"]([^'"]+)['"]/g,/import\s+['"]([^'"]+)['"]/g];
    for(const pattern of patterns){for(const match of text.matchAll(pattern)){const hit=resolveImport(file,match[1],filesSet);if(hit)refs.add(hit);}}
  }
  if(file.endsWith('.html')){
    for(const match of text.matchAll(/(?:src|href)=['"]([^'"?#]+)[^'"]*['"]/g)){
      const raw=match[1];
      if(raw.startsWith('http')||raw.startsWith('data:')||raw.startsWith('#'))continue;
      const hit=rel(path.resolve(ROOT,path.dirname(file),raw));
      if(filesSet.has(hit))refs.add(hit);
    }
  }
  if(file.endsWith('.css')){
    for(const match of text.matchAll(/url\(['"]?([^)'"?#]+)[^)]*\)/g)){
      const raw=match[1];if(raw.startsWith('data:')||raw.startsWith('http'))continue;
      const hit=rel(path.resolve(ROOT,path.dirname(file),raw));if(filesSet.has(hit))refs.add(hit);
    }
  }
  return refs;
}

async function main(){
  const absFiles=await walk(ROOT);
  const files=absFiles.map(rel).sort();
  const filesSet=new Set(files);
  const metadata=[];
  const texts=new Map();
  const hashGroups=new Map();

  for(const abs of absFiles){
    const file=rel(abs);const s=await stat(abs);const ext=path.extname(file).toLowerCase();
    metadata.push({file,size:s.size,ext});
    if(TEXT_EXT.has(ext)){
      try{texts.set(file,await readFile(abs,'utf8'));}catch{}
    }
    if(ASSET_EXT.has(ext)){
      const buf=await readFile(abs);const hash=createHash('sha256').update(buf).digest('hex');
      if(!hashGroups.has(hash))hashGroups.set(hash,[]);hashGroups.get(hash).push(file);
    }
  }

  const inbound=new Map(files.map(f=>[f,new Set()]));
  for(const [file,text] of texts){for(const target of extractRefs(file,text,filesSet))inbound.get(target)?.add(file);}

  // Package scripts and workflows contain runtime references that are not imports.
  const orchestration=[texts.get('package.json')||'',...Array.from(texts).filter(([f])=>f.startsWith('.github/workflows/')).map(([,t])=>t)].join('\n');
  for(const file of files){if(file.startsWith('scripts/')&&orchestration.includes(file))inbound.get(file)?.add('package/workflow');}

  const routes=files.filter(f=>/^src\/app\/(?:.*\/)?(?:page|route)\.(?:ts|tsx|js|jsx)$/.test(f)).map(file=>({route:routeFromAppFile(file),file})).sort((a,b)=>a.route.localeCompare(b.route));
  const staticHtml=texts.get('github-pages/index.html')||'';
  const staticLoaded=[...staticHtml.matchAll(/<(?:script|link)[^>]+(?:src|href)=['"]\.\/([^'"?]+)[^'"]*['"][^>]*>/g)].map(m=>`github-pages/${m[1]}`);

  const exactDuplicates=[...hashGroups.values()].filter(group=>group.length>1).sort((a,b)=>b.length-a.length);
  const suspects=metadata.filter(({file,ext})=>{
    if(!SOURCE_ROOTS.some(root=>file.startsWith(root)))return false;
    if(isConfigOrEntrypoint(file))return false;
    if(file.endsWith('.d.ts'))return false;
    if(file.startsWith('tests/'))return false;
    if(file.startsWith('src/app/')&&ext==='.css')return false; // CSS modules/global CSS may be indirectly imported through layout chains.
    return (inbound.get(file)?.size||0)===0;
  }).sort((a,b)=>b.size-a.size);

  const sourceRiskSymbols=['routeTypes','faqs','home.routeTypes','home.faq','MAIN_NAV','navigation.main'];
  const sourceRisks=sourceRiskSymbols.map(symbol=>({symbol,files:[...texts].filter(([,text])=>text.includes(symbol)).map(([file])=>file)})).filter(x=>x.files.length>1);

  const bigFiles=[...metadata].sort((a,b)=>b.size-a.size).slice(0,20);
  const staticLayers=staticLoaded.filter(f=>f.endsWith('.css')||f.endsWith('.js'));
  const totals={files:files.length,textFiles:texts.size,nextRoutes:routes.length,staticLayers:staticLayers.length,duplicateGroups:exactDuplicates.length,suspects:suspects.length};

  const report={generatedAt:new Date().toISOString(),totals,routes,staticLoaded,exactDuplicates,suspects: suspects.map(x=>({...x,inbound:[...(inbound.get(x.file)||[])]})),sourceRisks,bigFiles};
  await mkdir(OUT,{recursive:true});
  await writeFile(path.join(OUT,'report.json'),JSON.stringify(report,null,2));

  const markdown=[];
  markdown.push('# Passaporte Serra Negra · Repository Insights','',`Gerado em ${report.generatedAt}. **Candidatos sem referência não são automaticamente arquivos mortos.** O relatório serve como evidência para revisão antes de qualquer exclusão.`,'');
  markdown.push('## Visão geral','',`| Arquivos | Rotas Next | Camadas estáticas carregadas | Duplicações exatas de assets | Candidatos sem referência |`,`|---:|---:|---:|---:|---:|`,`| ${totals.files} | ${totals.nextRoutes} | ${totals.staticLayers} | ${totals.duplicateGroups} | ${totals.suspects} |`,'');
  markdown.push('## Jornada do produto','', '```mermaid','flowchart LR','  H[Início] --> RR[Roteiros prontos]','  RR --> RD[Detalhe do roteiro]','  RD --> A[Adaptar e usar]','  H --> Z[Criar do zero]','  Z --> OB[Onboarding]','  A --> T[Minha viagem]','  OB --> T','  T --> P[Passaporte]','  H --> E[Explorar lugares]','  E --> T','```','');
  markdown.push('## Superfícies do repositório','', '```mermaid','flowchart TD','  Repo[Repositório] --> Next[Next.js canônico]','  Repo --> Pages[GitHub Pages prévia]','  Next --> Src[src/app + components + modules]','  Pages --> Static[github-pages/index.html]','  Static --> Layers[CSS + JS carregados em sequência]','  Repo --> QA[Scripts + Playwright + Actions]','  QA --> Insight[Repository Insights]','```','');
  markdown.push('## Rotas Next.js','', '| Rota | Arquivo |','|---|---|',...routes.map(r=>`| \`${md(r.route)}\` | \`${md(r.file)}\` |`),'');
  markdown.push('## Camadas carregadas pela prévia estática','',`A prévia carrega **${staticLayers.length}** camadas JS/CSS diretamente no HTML. Muitas camadas podem ser intencionais, mas uma sequência longa aumenta o risco de override e de código legado permanecer ativo.`,'',...staticLayers.map(f=>`- \`${f}\``),'');
  markdown.push('## Fontes de verdade potencialmente duplicadas','', sourceRisks.length?'| Símbolo/conceito | Arquivos que o definem/usam |\n|---|---|\n'+sourceRisks.map(r=>`| \`${md(r.symbol)}\` | ${r.files.map(f=>`\`${md(f)}\``).join('<br>')} |`).join('\n'):'Nenhum padrão conhecido duplicado foi encontrado.','');
  markdown.push('## Assets exatamente duplicados','',exactDuplicates.length?'Os grupos abaixo têm o mesmo SHA-256. São bons candidatos para consolidação depois de confirmar caminhos públicos e compatibilidade.\n\n'+exactDuplicates.slice(0,30).map((group,i)=>`${i+1}. ${group.map(f=>`\`${f}\``).join(' = ')}`).join('\n'):'Nenhum asset duplicado por hash foi encontrado.','');
  markdown.push('## Candidatos sem referência estática','',`Detectados **${suspects.length}** candidatos. Esta heurística não enxerga imports totalmente dinâmicos, convenções externas ou consumo por ferramentas fora do repositório.`,'','| Arquivo | Tamanho |','|---|---:|',...suspects.slice(0,80).map(x=>`| \`${md(x.file)}\` | ${(x.size/1024).toFixed(1)} KB |`),'');
  markdown.push('## Maiores arquivos','', '| Arquivo | Tamanho |','|---|---:|',...bigFiles.map(x=>`| \`${md(x.file)}\` | ${(x.size/1024).toFixed(1)} KB |`),'');
  markdown.push('## Regras para limpeza segura','', '1. Não excluir candidatos apenas porque aparecem nesta lista.','2. Consolidar primeiro fontes de verdade duplicadas de navegação, roteiros e FAQ.','3. Para assets idênticos, manter um caminho canônico e atualizar referências antes da exclusão.','4. Para a prévia estática, reduzir camadas somente após a paridade com o runtime Next.js estar coberta por teste.','5. Toda remoção deve passar por `validate:static`, typecheck, lint e Playwright/visual quando aplicável.','');
  const mdText=markdown.join('\n');
  await writeFile(path.join(OUT,'report.md'),mdText);

  const dupRows=exactDuplicates.slice(0,20).map(g=>`<tr><td>${g.length}</td><td>${g.map(f=>`<code>${esc(f)}</code>`).join('<br>')}</td></tr>`).join('');
  const suspectRows=suspects.slice(0,100).map(x=>`<tr><td><code>${esc(x.file)}</code></td><td>${(x.size/1024).toFixed(1)} KB</td></tr>`).join('');
  const routeRows=routes.map(r=>`<tr><td><code>${esc(r.route)}</code></td><td><code>${esc(r.file)}</code></td></tr>`).join('');
  const riskRows=sourceRisks.map(r=>`<tr><td><code>${esc(r.symbol)}</code></td><td>${r.files.map(f=>`<code>${esc(f)}</code>`).join('<br>')}</td></tr>`).join('');
  const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Repository Insights · Passaporte Serra Negra</title><style>
  :root{font-family:Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light dark}body{margin:0;background:Canvas;color:CanvasText}.shell{max-width:1180px;margin:auto;padding:40px 24px 80px}.hero{padding:32px;border:1px solid color-mix(in srgb,CanvasText 14%,transparent);border-radius:24px}.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:24px 0}.metric,.panel{border:1px solid color-mix(in srgb,CanvasText 14%,transparent);border-radius:18px;padding:18px;background:color-mix(in srgb,Canvas 96%,CanvasText 4%)}.metric strong{display:block;font-size:2rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:18px;margin-top:18px}.panel{overflow:auto}table{width:100%;border-collapse:collapse;font-size:.9rem}th,td{text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid color-mix(in srgb,CanvasText 10%,transparent)}code{font-family:ui-monospace,monospace;font-size:.84em;overflow-wrap:anywhere}.warning{font-weight:600}h1{margin:.2em 0}.eyebrow{text-transform:uppercase;letter-spacing:.12em;font-size:.75rem;opacity:.7}.flow{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.flow span{padding:10px 14px;border:1px solid color-mix(in srgb,CanvasText 18%,transparent);border-radius:999px}.flow i{opacity:.45}@media(max-width:620px){.shell{padding:24px 14px}.grid{grid-template-columns:1fr}.hero{padding:22px}}
  </style></head><body><main class="shell"><section class="hero"><div class="eyebrow">Repository Intelligence</div><h1>Passaporte Serra Negra</h1><p>Mapa técnico para enxergar o que está ativo, duplicado, potencialmente legado e onde existem múltiplas fontes de verdade.</p><div class="metrics"><div class="metric"><strong>${totals.files}</strong>arquivos</div><div class="metric"><strong>${totals.nextRoutes}</strong>rotas Next</div><div class="metric"><strong>${totals.staticLayers}</strong>camadas estáticas</div><div class="metric"><strong>${totals.duplicateGroups}</strong>grupos duplicados</div><div class="metric"><strong>${totals.suspects}</strong>candidatos</div></div><div class="flow"><span>Início</span><i>→</i><span>Roteiros prontos</span><i>→</i><span>Adaptar</span><i>→</i><span>Minha viagem</span><i>→</i><span>Passaporte</span></div></section><div class="grid"><section class="panel"><h2>Rotas</h2><table><thead><tr><th>Rota</th><th>Arquivo</th></tr></thead><tbody>${routeRows}</tbody></table></section><section class="panel"><h2>Fontes de verdade</h2><p>Conceitos encontrados em mais de um lugar.</p><table><tbody>${riskRows||'<tr><td>Nenhum risco conhecido detectado.</td></tr>'}</tbody></table></section><section class="panel"><h2>Assets duplicados</h2><p>Conteúdo binário exatamente igual. Revisar antes de consolidar.</p><table><thead><tr><th>Cópias</th><th>Caminhos</th></tr></thead><tbody>${dupRows||'<tr><td colspan="2">Nenhum grupo duplicado.</td></tr>'}</tbody></table></section><section class="panel"><h2>Candidatos sem referência</h2><p class="warning">Sinal de auditoria, não autorização para excluir.</p><table><thead><tr><th>Arquivo</th><th>Tamanho</th></tr></thead><tbody>${suspectRows||'<tr><td colspan="2">Nenhum candidato.</td></tr>'}</tbody></table></section></div></main></body></html>`;
  await writeFile(path.join(OUT,'index.html'),html);
  console.log(mdText);
}

main().catch(error=>{console.error(error);process.exitCode=1;});
