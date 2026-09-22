# Morph / shared-element transition audit

This package adds shared-element transitions only where origin and destination represent the same entity.

## Implemented

1. Tourist place card -> tourist detail page
   - media, title and category/meta share stable transition names.
2. Partner card -> partner detail page
   - media, name and partner/category meta share stable transition names.
3. Ready-route card -> ready-route detail
   - route image, title and route metadata morph into the detail hero.
4. Center card in "Descobertas no momento certo" -> partner detail
   - the active partner card is the interactive source; its media/title/meta morph to the detail page.
5. Map pin -> place preview
   - interactive map pins are HTML buttons/links layered over the map SVG so the circular source can morph reliably into the preview card.
6. Map preview -> place detail page
   - preview image, name and category/meta morph into the entity hero.

## Carousel restoration

"Descobertas no momento certo" keeps fixed card/media dimensions while restoring whole-card movement:
- pointer drag with live displacement;
- projected velocity/inertia on release;
- wheel navigation;
- keyboard arrows;
- center-card emphasis;
- side-card activation;
- reduced-motion fallback.

## Accessibility and fallback

- `prefers-reduced-motion: reduce` disables morph animation and keeps navigation functional.
- Browsers without View Transitions fall back to ordinary navigation/state updates.
- Map pins remain native buttons/links with labels and keyboard semantics.
- Shared names are assigned only during the initiating interaction to avoid duplicate transition names.

## Passport cover

The supplied transparent PNG cover is used directly in the "De roteiro a memória" section. Its visual container is transparent; only the artwork receives a drop shadow.

## v18 interaction refinement

O carrossel de parceiros agora trata o gesto como interação contínua: durante Pointer Capture, os cards não usam easing de posição e seguem o deslocamento horizontal diretamente. O clique é processado separadamente: um clique centraliza e um segundo clique no mesmo card dentro da janela de duplo clique abre a experiência. A capa do Passaporte usa apenas `transform` para o hover morph, evitando reflow.
