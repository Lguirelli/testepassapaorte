import assert from 'node:assert/strict';
import test from 'node:test';
import {canonicalPublicDataset} from '../../src/modules/content/repository';

test('canonical public fallback exposes researched discovery content without demo relations',()=>{
  const data=canonicalPublicDataset();
  assert.ok(data.places.length>=12,'expected the bundled researched tourism catalog');
  assert.ok(data.categories.length>0,'expected public discovery categories');
  assert.ok(data.sources.length>0,'expected provenance sources');
  assert.equal(data.partners.length,0,'fallback must not invent partner relationships');
  assert.equal(data.experiences.length,0,'fallback must not expose synthetic experiences');
  assert.equal(data.events.length,0,'fallback must not expose synthetic events');
  assert.ok(data.places.every(place=>place.synthetic===false),'fallback places must be canonical, not demo');
  assert.ok(data.places.every(place=>place.discoveryVisible!==false),'fallback places must remain discoverable');
});
