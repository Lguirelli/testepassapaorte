import test from 'node:test';
import assert from 'node:assert/strict';
import {pageKindForPath} from '../../src/core/routing/page-kind';
import {MAIN_NAV,ROUTES} from '../../src/core/routing/routes';

test('page kinds separate acquisition and entity detail routes',()=>{
  assert.equal(pageKindForPath('/'),'home');
  assert.equal(pageKindForPath('/explorar'),'explore');
  assert.equal(pageKindForPath('/parceiros'),'partner-acquisition');
  assert.equal(pageKindForPath('/parceiros/cafe-neblina-alta'),'partner-detail');
  assert.equal(pageKindForPath('/lugares/mirante-alto-da-serra'),'tourism-detail');
  assert.equal(pageKindForPath('/roteiro'),'onboarding');
  assert.equal(pageKindForPath('/viagens/demo-trip-001/roteiro'),'trip-route');
  assert.equal(pageKindForPath('/viagens/demo-trip-001/calendario'),'calendar');
  assert.equal(pageKindForPath('/meu-passaporte'),'passport');
  assert.equal(pageKindForPath('/admin/lugares/place-cafe-neblina'),'admin');
});

test('main navigation destinations are unique',()=>{
  const hrefs=MAIN_NAV.map(item=>item.href);
  assert.equal(new Set(hrefs).size,hrefs.length);
  assert.equal(ROUTES.explore,'/explorar');
  assert.equal(ROUTES.touristPoints,'/explorar?relation=public_point');
  assert.equal(ROUTES.map,'/explorar?view=map');
  assert.equal(ROUTES.partnerProgram,'/parceiros');
});
