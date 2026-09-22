import {readdirSync,readFileSync,statSync} from 'node:fs';
import {join,relative,extname,basename} from 'node:path';

const root=process.cwd();const findings=[];
const binary=new Set(['.png','.jpg','.jpeg','.webp','.gif','.ico','.woff','.woff2','.zip','.psd','.pdf','.mp4','.mov','.avif']);
const ignoredDirs=new Set(['node_modules','.next','.git','.data','coverage','playwright-report','test-results','artifacts']);
const secretPatterns=[
  ['private-key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['aws-access-key',/\bAKIA[0-9A-Z]{16}\b/],
  ['openai-key',/\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b/],
  ['github-token',/\bgh[pousr]_[A-Za-z0-9]{30,}\b/],
  ['google-api-key',/\bAIza[0-9A-Za-z_-]{30,}\b/],
  ['jwt',/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/],
];
const email=/\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g;
const allowedEmailDomains=new Set(['passaporte.local','passaporte.demo','example.com','example.invalid']);

function walk(dir){for(const name of readdirSync(dir)){if(ignoredDirs.has(name))continue;const path=join(dir,name);const stat=statSync(path);if(stat.isDirectory()){walk(path);continue;}if(path.endsWith('.env.example'))continue;if(basename(path).startsWith('.env')){findings.push({file:relative(root,path),kind:'environment-file',detail:'Arquivo de ambiente não permitido no pacote.'});continue;}if(binary.has(extname(path).toLowerCase()))continue;let text;try{text=readFileSync(path,'utf8');}catch{continue;}for(const [kind,pattern] of secretPatterns)if(pattern.test(text))findings.push({file:relative(root,path),kind,detail:'Padrão sensível detectado.'});for(const match of text.matchAll(email)){const domain=match[1].toLowerCase();if(!allowedEmailDomains.has(domain))findings.push({file:relative(root,path),kind:'email',detail:`E-mail fora da allowlist: ${match[0]}`});}}
}
walk(root);
const report={at:new Date().toISOString(),status:findings.length?'FAIL':'PASS',findings};console.log(JSON.stringify(report,null,2));process.exitCode=findings.length?1:0;
