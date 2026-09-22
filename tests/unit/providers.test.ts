import test from 'node:test';import assert from 'node:assert/strict';import {mapsProvider,storageProvider} from '../../src/providers';
test('map adapter is deterministic and does not read device location',()=>{assert.deepEqual(mapsProvider.points([{id:'a'},{id:'b'}]),mapsProvider.points([{id:'a'},{id:'b'}]));});
test('local storage adapter returns project placeholders',()=>assert.equal(storageProvider.placeholder('hero'),'/placeholders/hero.svg'));
