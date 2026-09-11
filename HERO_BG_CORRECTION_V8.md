# Atualização v8 — correção do fundo

## Ajuste solicitado

O fundo com a imagem panorâmica foi removido do header e aplicado ao hero da página inicial (`index` / Home).

## O que foi corrigido

- o `site-header` voltou a ter fundo transparente;
- as pseudo-camadas visuais do header foram desativadas;
- a imagem panorâmica foi aplicada ao fundo do hero da Home;
- o hero agora usa `picture` com versões otimizadas responsivas em JPG e WEBP;
- o preload foi atualizado para a imagem do hero, não mais para o header;
- o conteúdo do hero continua com overlay escuro para preservar leitura.

## Arquivos alterados

- `app.js`
- `visual.css`
- `theme.css`
- `index.html`

## Assets utilizados

- `assets/brand/hero/serra-negra-header-640.jpg`
- `assets/brand/hero/serra-negra-header-640.webp`
- `assets/brand/hero/serra-negra-header-960.jpg`
- `assets/brand/hero/serra-negra-header-960.webp`
- `assets/brand/hero/serra-negra-header-1280.jpg`
- `assets/brand/hero/serra-negra-header-1280.webp`
- `assets/brand/hero/serra-negra-header-1600.jpg`
- `assets/brand/hero/serra-negra-header-1600.webp`
- `assets/brand/hero/serra-negra-header-2048.jpg`
- `assets/brand/hero/serra-negra-header-2048.webp`

## Resultado esperado

- header transparente;
- foto panorâmica apenas no hero da Home;
- navegação continua sobreposta ao topo da Home com boa legibilidade;
- demais páginas não usam a foto como fundo do header.
