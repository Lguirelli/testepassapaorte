import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const compatibilityBridges=[
  'explorar/index.html',
  'pontos-turisticos/index.html',
  'mapa/index.html',
  'parceiros/index.html',
  'lugares/index.html',
  'roteiro/index.html',
  'meu-passaporte/index.html',
  'para-parceiros/index.html',
  'admin/index.html',
  'privacidade/index.html',
  'termos/index.html',
  'cookies/index.html',
  'acessibilidade/index.html',
];

test('index.html remains the complete static application entry',async()=>{
  const html=await readFile('index.html','utf8');
  assert.match(html,/<main id="app"/);
  assert.match(html,/\.\/app\.js/);
  assert.match(html,/\.\/data\.js/);
  assert.match(html,/\.\/theme\.css/);
  assert.match(html,/\.\/static-interactions\.css/);
  assert.doesNotMatch(html,/dynamic-entry\.js/);
  assert.doesNotMatch(html,/location\.replace\(/);
});

test('static compatibility pages bridge to index.html hash routes',async()=>{
  for(const file of compatibilityBridges){
    const html=await readFile(file,'utf8');
    assert.match(html,/location\.replace\(['"]\.\.\/index\.html#\//);
    assert.match(html,/href=['"]\.\.\/index\.html#\//);
    assert.doesNotMatch(html,/dynamic-entry\.js/);
  }
});

test('404 compatibility handler resolves known paths back to the static entry',async()=>{
  const html=await readFile('404.html','utf8');
  assert.match(html,/location\.replace\(`\$\{root\}index\.html#\/\$\{route\}`\)/);
  assert.match(html,/pontos-turisticos/);
  assert.match(html,/para-parceiros/);
});
