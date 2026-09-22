import test from 'node:test';import assert from 'node:assert/strict';
import {applyOperation,generatePlan,type Profile} from '../../src/modules/trips/engine';import type {TripData} from '../../src/modules/trips/types';import type {ContentData} from '../../src/core/db/schema';
const places:ContentData[]=[
 {id:'a',name:'A',status:'published',discoveryVisible:true,synthetic:false,categoryIds:['cat-natureza'],durationMinutes:60,costType:'free'},
 {id:'b',name:'B',status:'published',discoveryVisible:true,synthetic:false,categoryIds:['cat-gastronomia'],durationMinutes:75,costType:'paid'},
 {id:'c',name:'C',status:'published',discoveryVisible:true,synthetic:false,categoryIds:['cat-cultura'],durationMinutes:60,costType:'free'},
 {id:'demo',name:'Demo',status:'published',discoveryVisible:true,synthetic:true,categoryIds:['cat-natureza']},
];
const profile:Profile={startsOn:'2026-09-12',endsOn:'2026-09-13',party:'couple',interests:['cat-natureza','cat-gastronomia'],intentions:['classics'],pace:'balanced',transport:'car',needs:[]};
const trip:TripData={trip:{id:'trip-1',synthetic:false,cityId:'serra-negra-sp',...profile},days:[{id:'d1',date:'2026-09-12',items:[{id:'i1',placeId:'a',startsAt:'09:30',durationMinutes:60,source:'added_by_user',state:'planned'},{id:'i2',placeId:'b',startsAt:'13:00',durationMinutes:75,source:'fixed',state:'fixed'}]},{id:'d2',date:'2026-09-13',items:[]}],visits:[],weather:[]};
test('engine never recommends synthetic places and keeps manual choices',()=>{const plan=generatePlan(profile,places,trip);assert.equal(plan.flatMap(d=>d.items).some(i=>i.placeId==='demo'),false);assert.equal(plan.flatMap(d=>d.items).some(i=>i.id==='i1'),true);assert.equal(plan.flatMap(d=>d.items).some(i=>i.id==='i2'),true);});
test('fixed item cannot be silently removed',()=>assert.throws(()=>applyOperation(trip,{action:'remove',itemId:'i2'},places)));
test('move preserves input and unrelated items',()=>{const before=structuredClone(trip);const after=applyOperation(trip,{action:'move',itemId:'i1',date:'2026-09-13',time:'11:00'},places);assert.deepEqual(trip,before);assert.equal(after.days[1].items[0]?.id,'i1');assert.equal(after.days[1].items[0]?.source,'changed_by_user');assert.equal(after.days[0].items[0]?.id,'i2');});
test('removed item is recoverable',()=>{const removed=applyOperation(trip,{action:'remove',itemId:'i1'},places);assert.equal(removed.days[0].items.find(i=>i.id==='i1')?.state,'removed');const restored=applyOperation(removed,{action:'restore',itemId:'i1'},places);assert.equal(restored.days[0].items.find(i=>i.id==='i1')?.state,'planned');});
