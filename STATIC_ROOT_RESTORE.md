# Passaporte Serra Negra — restauração estática da raiz

Este patch restaura a experiência estática principal na raiz do repositório.

## Runtime restaurado

- `index.html` como entrada principal.
- SPA baseada em `app.js` + dados locais.
- CSS visual original preservado.
- Nova camada `static-interactions.css` / `static-interactions.js` para os refinamentos de motion.
- `404.html` com reconexão para as rotas da SPA.
- bridges para rotas diretas (`/mapa`, `/pontos-turisticos`, `/roteiro`, `/lugares/...`, `/parceiros/...`, etc.).
- `assets/` restaurado na raiz, porque a versão estática depende desses caminhos.

## Refinamentos incluídos

- Dock por proximidade no header desktop.
- CTA claro no header do index.
- Card Nav mobile animado, com Aparência dentro do painel.
- Hero em `100svh`.
- Warp Text no título, desativado em mobile/reduced motion.
- remoção da linha/bola decorativa da pesquisa.
- 3 pontos turísticos aleatórios por carregamento + CTA para todos.
- Circular Gallery com centro dominante e afastamento lateral.
- hover discreto nos pontos da rota.
- slider horizontal em Tipos de roteiro, sem linha pontilhada sobre a imagem.
- cards com hover perceptível e sem clipping.
- Descoberta contextual e Explore por interesse centralizados.
- FAQ com expansão orgânica.
- pins com apenas escala e alteração de cor.
- CTA final mantido em duas linhas no desktop.
- suporte a `prefers-reduced-motion`.

## Validação

Chromium foi usado sobre uma fixture com o HTML/CSS/JS finais embutidos porque a política do ambiente bloqueia navegação HTTP/file local. Foram aprovadas 52 verificações, incluindo 9 viewports:

- 1920×1080
- 1440×900
- 1366×768
- 1280×720
- 1024×768
- 768×1024
- 430×932
- 390×844
- 360×800

Em todas, `scrollWidth - innerWidth` foi zero.
