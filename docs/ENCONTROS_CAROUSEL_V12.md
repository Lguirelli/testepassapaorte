# V12 — Encontros pelo caminho

A seção **Encontros pelo caminho** foi reconstruída a partir dos aspectos técnicos do carrossel fornecido como referência, sem reutilizar a linguagem visual de uma publicação de rede social.

## Aspectos técnicos aproveitados

- carrossel circular/infinito;
- cards distribuídos em arco;
- perspectiva 3D;
- deslocamento horizontal contínuo;
- deslocamento vertical progressivo conforme a distância do centro;
- rotação progressiva;
- escala por profundidade;
- opacidade, blur e redução de saturação nos cards distantes;
- controle de `z-index` por profundidade;
- interpolação contínua via `requestAnimationFrame`;
- arraste por pointer events;
- inércia curta após soltar o arraste;
- snap automático para o item mais próximo;
- suporte a roda do mouse/trackpad;
- setas anterior/próximo;
- teclado com ArrowLeft, ArrowRight, Home e End;
- autoplay discreto, pausado em hover e foco;
- desativação do autoplay em `prefers-reduced-motion`;
- máscaras laterais para dar continuidade espacial ao loop;
- card central como único item navegável por teclado.

## Linguagem visual aplicada

O aspecto Instagram não foi copiado. A seção não possui:

- avatar;
- username;
- selo de verificação;
- curtidas;
- comentários;
- salvar;
- compartilhar post;
- header de publicação;
- card quadrado de feed;
- ações de rede social.

Cada item foi redesenhado como **card editorial de experiência turística**, contendo:

- fotografia do lugar;
- número editorial;
- categoria;
- nome do parceiro;
- descrição breve;
- duração;
- localização;
- ação “Conhecer experiência”.

A fotografia não recebe zoom independente. O movimento vertical no hover é aplicado ao **card inteiro**, preservando o comportamento já definido nas versões anteriores do Passaporte.

## Comportamento

Ao clicar em um card lateral, ele é centralizado primeiro. O card central abre a página individual do parceiro e continua compatível com a shared element transition da aplicação.

O índice da Home continua sincronizado com `ui.homePartnerIndex`, mas as setas não provocam mais um rerender completo da página. Isso torna a interação contínua e elimina o tranco existente no carrossel anterior.

## Arquivos alterados

- `app.js`
- `theme.css`

## Validação

Ver `docs/ENCONTROS_CAROUSEL_V12_VALIDATION.json`.
