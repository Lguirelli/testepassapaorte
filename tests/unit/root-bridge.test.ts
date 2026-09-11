import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const bridges=[
  'index.html',
  '404.html',
  'explorar/index.html',
  'pontos-turisticos/index.html',
  'mapa/index.html',
  'parceiros/index.html',
  'lugares/index.html',
  'roteiro/index.html',
  'meu-passaporte/index.html',
  'para-parceiros/index.html',
];

test('root compatibility files only bridge to the dynamic application',async()=>{
  for(const file of bridges){
    const html=await readFile(file,'utf8');
    assert.match(html,/dynamic-entry\.js/);
    assert.doesNotMatch(html,/\bapp\.js\b/);
    assert.doesNotMatch(html,/\bdata\.js\b/);
    assert.doesNotMatch(html,/\btheme\.css\b/);
    assert.match(html,/conteúdo real continua sendo renderizado pelo Next\.js/i);
  }
});
