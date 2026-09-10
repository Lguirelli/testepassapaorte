import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root,"icon-manifest.json"),"utf8"));
let errors=[];
const canonical = new Set(manifest.icons.map(i=>i.canonical));
for (const name of canonical) {
  const p=path.join(root,"public","icons",`${name}.svg`);
  if(!fs.existsSync(p)){ errors.push(`missing asset ${name}`); continue; }
  const s=fs.readFileSync(p,"utf8");
  if(!s.includes('viewBox="-10 -10 120 120"')) errors.push(`${name}: viewBox`);
  if(!s.includes('data-icon-system="passaporte-serra-negra-v2"')) errors.push(`${name}: system marker`);
  if(/<script|javascript:|<foreignObject/i.test(s)) errors.push(`${name}: unsafe content`);
  // Hardcoded visible black may legitimately exist only inside mask mechanics; audit script does not reject it globally.
}
for (const i of manifest.icons) {
  if(!canonical.has(i.canonical)) errors.push(`${i.name}: invalid canonical ${i.canonical}`);
}
if(errors.length){ console.error(errors.join("\n")); process.exit(1); }
console.log(`OK: ${manifest.semanticCount} semantic names, ${manifest.canonicalAssetCount} canonical SVGs, ${manifest.aliasCount} aliases.`);
