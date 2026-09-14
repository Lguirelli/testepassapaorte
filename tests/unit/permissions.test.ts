import test from 'node:test';
import assert from 'node:assert/strict';
import {can} from '../../src/core/auth/permissions';
test('partner cannot access admin, QR, competitors or tourist trips',()=>{
 const actor={id:'a',role:'partner' as const,partnerId:'p'};
 assert.equal(can(actor,'partner:edit',{partnerId:'p'}),true);
 for(const permission of ['admin:access','qr:manage','trip:write'] as const)assert.equal(can(actor,permission,{ownerId:'a'}),false);
 assert.equal(can(actor,'partner:edit',{partnerId:'other'}),false);
 assert.equal(can(null,'admin:access'),false);
});
test('tourist writes only own trip',()=>{
 const actor={id:'a',role:'tourist' as const};
 assert.equal(can(actor,'trip:write',{ownerId:'a'}),true);
 assert.equal(can(actor,'trip:write',{ownerId:'b'}),false);
});
