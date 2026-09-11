import {test} from 'node:test';import assert from 'node:assert/strict';
import {routesProvider,weatherProvider} from '../../src/providers';
test('mock route is deterministic',()=>{assert.deepEqual(routesProvider.between('a','b'),routesProvider.between('a','b'));});
test('unknown weather is absent, never invented',()=>{assert.equal(weatherProvider.forDate('2027-01-01'),undefined);});
