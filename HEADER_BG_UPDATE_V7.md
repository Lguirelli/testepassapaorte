# Atualização v7 — imagem do usuário aplicada ao header

## O que foi feito

- A imagem enviada foi aplicada como fundo do `.site-header`.
- O header agora usa a foto com overlay escuro para preservar contraste do logo, navegação, CTA, menu mobile e seletor de aparência.
- O fundo da logo continua transparente, sem container colorido atrás do SVG.

## Otimização para site

Foram geradas versões otimizadas em JPG e WEBP:

- `assets/brand/header/serra-negra-header-640.jpg`
- `assets/brand/header/serra-negra-header-640.webp`
- `assets/brand/header/serra-negra-header-960.jpg`
- `assets/brand/header/serra-negra-header-960.webp`
- `assets/brand/header/serra-negra-header-1280.jpg`
- `assets/brand/header/serra-negra-header-1280.webp`
- `assets/brand/header/serra-negra-header-1600.jpg`
- `assets/brand/header/serra-negra-header-1600.webp`
- `assets/brand/header/serra-negra-header-2048.jpg`
- `assets/brand/header/serra-negra-header-2048.webp`
- `assets/brand/header/serra-negra-header-original.jpg`

## Adaptação técnica

- `theme.css` recebeu a camada responsiva do header com `image-set`, fallback JPG e troca de tamanhos por breakpoint.
- `index.html` recebeu preload da versão 1280 em WEBP e JPG.
- O menu mobile aberto também foi adaptado para manter legibilidade sobre o novo fundo.

## Observação

A imagem foi aplicada como plano de fundo do header de forma global, para manter consistência visual em toda a navegação do site.
