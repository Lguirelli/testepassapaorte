import test from 'node:test';
import assert from 'node:assert/strict';
import {privacySafePath,publicErrorMessage,redactForAudit,safeAssetSrc,safeContactHref,safeObjectPosition,sanitizeHttpsUrl,sanitizeId,sanitizeNarrative,sanitizeRelativePath,sanitizeStructuredValue,sanitizeText,sanitizeTrackingPayload,trySanitizeHttpsUrl} from '../../src/core/security/sanitize';
import {validateContent} from '../../src/modules/admin/validation';

test('text normalization removes control, bidi and zero-width characters without stripping legitimate accents',()=>{
  assert.equal(sanitizeText('  Café\u202E\u200B Serra\u0007 Negra  ',100,{multiline:false}),'Café Serra Negra');
});

test('identifiers and internal redirects reject traversal or cross-origin shapes',()=>{
  assert.throws(()=>sanitizeId('../admin'));
  assert.equal(sanitizeRelativePath('//evil.example/path','/roteiro'),'/roteiro');
  assert.equal(sanitizeRelativePath('https://evil.example','/roteiro'),'/roteiro');
  assert.equal(sanitizeRelativePath('/viagens/trip-1/roteiro?day=2026-09-12','/'),'/viagens/trip-1/roteiro?day=2026-09-12');
});

test('external URLs require HTTPS and reject embedded credentials',()=>{
  assert.equal(sanitizeHttpsUrl('https://example.com/path'),'https://example.com/path');
  assert.throws(()=>sanitizeHttpsUrl('javascript:alert(1)'));
  assert.throws(()=>sanitizeHttpsUrl('http://example.com'));
  assert.throws(()=>sanitizeHttpsUrl('https://user:pass@example.com'));
  assert.equal(trySanitizeHttpsUrl('not a url'),null);
});

test('contact and media output helpers fail closed',()=>{
  assert.equal(safeContactHref('website','javascript:alert(1)'),null);
  assert.equal(safeContactHref('whatsapp','https://evil.example/123'),null);
  assert.equal(safeAssetSrc('javascript:alert(1)','/fallback.svg'),'/fallback.svg');
  assert.equal(safeAssetSrc('assets/tourism/photo.webp'),'/assets/tourism/photo.webp');
});

test('tracking payload is allowlisted, bounded and privacy-safe',()=>{
  const clean=sanitizeTrackingPayload({path:'/viagens/private-trip/roteiro?token=secret',tripId:'private-trip',token:'secret',placeId:'place-1',query:'nome da pessoa',queryLength:9999,hasQuery:true});
  assert.deepEqual(clean,{path:'/viagens/[tripId]/roteiro',placeId:'place-1',queryLength:120,hasQuery:true});
  assert.equal(privacySafePath('/q/private-code?utm=abc'),'/q/[code]');
});

test('technical error details are not returned to end users',()=>{
  assert.equal(publicErrorMessage(new Error('Failed query: select * from users'),'Falha segura'),'Falha segura');
  assert.equal(publicErrorMessage(new Error('Horário inválido.'),'Falha segura'),'Horário inválido.');
});

test('admin content rejects undeclared fields and unsafe URLs',()=>{
  assert.throws(()=>validateContent('categories',{id:'cat-test',name:'Teste',slug:'teste',synthetic:true,cityId:'city-serra-negra-sp',unexpected:'x'} as never));
  assert.throws(()=>validateContent('sources',{id:'source-test',sourceName:'Fonte',sourceType:'verified',sourceUrl:'javascript:alert(1)',synthetic:false,cityId:'city-serra-negra-sp'}));
});


test('external URLs reject local and private destinations',()=>{
  for(const value of ['https://localhost/test','https://127.0.0.1/test','https://10.0.0.1/test','https://192.168.1.2/test','https://172.16.0.1/test'])assert.throws(()=>sanitizeHttpsUrl(value));
});

test('free-form operational narratives reject unnecessary sensitive data',()=>{
  assert.equal(sanitizeNarrative('Alterar a categoria para cafeteria.',500),'Alterar a categoria para cafeteria.');
  assert.throws(()=>sanitizeNarrative('Contato pessoal pessoa@example.com',500));
  assert.throws(()=>sanitizeNarrative('Token sk-abcdefghijklmnop',500));
});

test('audit redaction removes sensitive values recursively',()=>{
  assert.deepEqual(redactForAudit({status:'ok',email:'pessoa@example.com',nested:{phone:'+55 11 99999-9999'},path:['/mnt','data','private.txt'].join('/')}),{status:'ok',email:'[redacted]',nested:{phone:'[redacted]'},path:'[redacted]'});
});

test('structured values drop prototype-pollution keys and bound CSS image position',()=>{
  const clean=sanitizeStructuredValue(JSON.parse('{"safe":"ok","__proto__":{"polluted":true},"constructor":"x"}')) as Record<string,unknown>;
  assert.equal(clean.safe,'ok');
  assert.equal(Object.prototype.hasOwnProperty.call(clean,'__proto__'),false);
  assert.equal(Object.prototype.hasOwnProperty.call(clean,'constructor'),false);
  assert.equal(safeObjectPosition('120% 50%'),'center');
  assert.equal(safeObjectPosition('25% 80%'),'25% 80%');
});
