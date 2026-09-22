import fs from 'node:fs';
import ts from 'typescript';

// Both distribution targets consume the same reviewed content and interactions.
const source='src/components/reference-pages/';
const content=JSON.parse(fs.readFileSync(source+'content.json','utf8'));
const code=ts.transpileModule(fs.readFileSync(source+'interactions.ts','utf8'),{
 compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022},
}).outputText.replace('export function initializeReferencePage','function initializeReferencePage').replaceAll('/reference-assets/','./reference-assets/');
let css=(fs.readFileSync(source+'references.css','utf8')+'\n'+fs.readFileSync(source+'storytelling.css','utf8')).replaceAll('#conteudo','#app').replaceAll('/reference-assets/','./reference-assets/');
css+='\nbody:has(.reference-page) #site-footer-slot{display:none!important}\n';
fs.writeFileSync('github-pages/references.css',css);
fs.mkdirSync('github-pages/reference-assets',{recursive:true});
fs.cpSync('public/reference-assets','github-pages/reference-assets',{recursive:true});
const markup=Object.fromEntries(Object.entries(content).map(([kind,html])=>[kind,html.replaceAll('/reference-assets/','./reference-assets/').replaceAll('href="/','href="#/')]));
fs.writeFileSync('github-pages/references.js',`(()=>{\n${code}\nconst content=${JSON.stringify(markup)};\nlet dispose;\nwindow.PSN_REFERENCE_PAGES={render(path,app){dispose?.();dispose=undefined;const kind=path==='/'||path===''?'landing':path==='/parceiros'?'partners':path==='/parceiros/caminho-do-cafe'?'place':null;if(!kind)return window.PSN_DASHBOARDS?.render(path,app)||false;window.PSN_DASHBOARDS?.dispose();const root=document.createElement('div');root.className='reference-page reference-'+kind;root.innerHTML=content[kind];app.replaceChildren(root);dispose=initializeReferencePage(root,kind,path=>{location.hash='#'+path});return true;}};\n})();\n`);
console.log('Static preview synchronized with the three Next.js reference pages.');
