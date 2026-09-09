import fs from 'node:fs';import path from 'node:path';
const required=[
 'src/app/page.tsx','src/app/explorar/page.tsx','src/app/lugares/[slug]/page.tsx','src/app/parceiros/[slug]/page.tsx','src/app/roteiro/page.tsx','src/app/viagens/[tripId]/roteiro/page.tsx','src/app/viagens/[tripId]/calendario/page.tsx','src/app/meu-passaporte/page.tsx','src/app/admin/page.tsx','playwright.config.ts','docker-compose.yml','drizzle/0000_validation_v0.sql','VALIDATION_REPORT.md'
];
let failed=false;for(const rel of required){if(!fs.existsSync(path.resolve(rel))){console.error('MISSING',rel);failed=true;}}
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));for(const s of ['build','lint','typecheck','test','test:e2e','db:migrate','db:seed'])if(!pkg.scripts[s]){console.error('MISSING SCRIPT',s);failed=true;}
const content=JSON.parse(fs.readFileSync('seed/validation-content.json','utf8'));if(!content.places?.length||!content.partners?.length) {console.error('Seed inválido');failed=true;}
if(failed)process.exit(1);console.log(`Repository contract OK: ${required.length} arquivos críticos, ${content.places.length} lugares demo.`);
