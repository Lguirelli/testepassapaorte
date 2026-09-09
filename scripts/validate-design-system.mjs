import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const req = (p) => {
  const full = path.join(root,p);
  if (!fs.existsSync(full)) throw new Error(`Arquivo obrigatório ausente: ${p}`);
  return fs.readFileSync(full,'utf8');
};

const css = req('src/design-system/tokens/brand.css');
const jsonText = req('src/design-system/tokens/brand.json');
const showcase = req('showcase/styles.css');
const globals = req('src/app/globals.css');
const doc = req('docs/design-system-v1/PASSAPORTE_SERRA_NEGRA_DESIGN_SYSTEM.md');
const tokens = JSON.parse(jsonText);

const expected = {
  neutral050:'#E7E7DE', neutral950:'#141416', redInferno:'#4E0000',
  reseda:'#A1AD92', powderBlue:'#94B2C4', deepBlue:'#01273E', cocoa:'#594536'
};
const checks = [
  [tokens.colors.neutral['050'], expected.neutral050, 'Neutral 050'],
  [tokens.colors.neutral['950'], expected.neutral950, 'Neutral 950'],
  [tokens.colors.accent.redInferno, expected.redInferno, 'Red Inferno'],
  [tokens.colors.accent.reseda, expected.reseda, 'Reseda'],
  [tokens.colors.accent.powderBlue, expected.powderBlue, 'Powder Blue'],
  [tokens.colors.accent.deepBlue, expected.deepBlue, 'Deep Blue'],
  [tokens.colors.accent.cocoa, expected.cocoa, 'Cocoa'],
];
for (const [actual, exp, label] of checks) {
  if (actual.toUpperCase() !== exp.toUpperCase()) throw new Error(`${label}: esperado ${exp}, recebido ${actual}`);
}
for (const marker of ['--font-home-heading','--font-page-title','--font-page-subtitle','--font-body','--niche-cafe']) {
  if (!css.includes(marker)) throw new Error(`Token CSS ausente: ${marker}`);
}
if (!showcase.startsWith("@import url('design-tokens.css')")) throw new Error('showcase/styles.css não importa design-tokens.css');
if (!globals.includes('@import "../design-system/tokens/brand.css";')) throw new Error('globals.css não importa brand.css');
for (const obsolete of ['Druk Text Wide','Helvetica Neue']) {
  if (showcase.includes(obsolete) || globals.includes(obsolete)) throw new Error(`Fonte substituída ainda ativa no código: ${obsolete}`);
}
if (!showcase.includes('var(--font-home-heading)')) throw new Error('Heading da Home não usa o stack oficial');
if (!showcase.includes('var(--font-page-title)')) throw new Error('Páginas internas não usam Arimo via token');
if (!showcase.includes('var(--font-page-subtitle)')) throw new Error('Editorial não usa Cormorant Garamond via token');
if (!doc.includes('80% a 90%') || !doc.includes('10% a 20%')) throw new Error('Documento consolidado do Design System V1 incompleto');
console.log('Design System V1: tokens, tipografia e integração validados.');
