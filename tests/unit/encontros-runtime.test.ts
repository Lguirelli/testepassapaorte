import assert from 'node:assert/strict';
import test from 'node:test';
import {access,readFile} from 'node:fs/promises';

test('Encontros stays inside the component system without a global carousel override',async()=>{
  const [layout,home]=await Promise.all([
    readFile('src/app/layout.tsx','utf8'),
    readFile('src/components/HomeExperience.tsx','utf8'),
  ]);
  assert.doesNotMatch(layout,/encontros-carousel\.css/,'layout must not load the legacy global Encontros override');
  await assert.rejects(access('public/encontros-carousel.css'));
  assert.match(home,/data-testid="home-partner-gallery"/);
  assert.match(home,/--blur/);
  assert.match(home,/gallerySideActivate/);
});
