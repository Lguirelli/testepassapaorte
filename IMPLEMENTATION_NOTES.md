# IMPLEMENTATION_NOTES — reconstrução Landing V3

Execução realizada diretamente neste ambiente, usando o arquivo `PROMPT_RECONSTRUCAO_LANDING_V3.md` como comando de construção e `landing page(2).psd` como referência de composição. O PSD não foi usado como imagem de fundo da página. A implementação é HTML/CSS/JavaScript real e preserva a semântica e as interações do index existente.

## A. Mapeamento PSD → componente do index

O PSD possui composite de 1920 × 10533 px e 12 camadas visuais principais. Os valores de `PSD Y` abaixo seguem a matriz obrigatória do comando e foram conferidos contra a sequência, os nomes e as alturas das 12 camadas extraídas do PSD. `Impl Y` é normalizado para o início do Hero na validação em 1920 px, desconsiderando o aviso e o shell global.

| # | Camada PSD | PSD Y | PSD H | Componente | Padrão visual extraído | Decisão de implementação | Impl Y | Impl H |
|---:|---|---:|---:|---|---|---|---:|---:|
| 01 | Passaporte Serra Negra · validação visual v2 | 0 | 1080 | `homeHeroSection()` | hero paisagístico, conteúdo concentrado, busca integrada | paisagem abstrata CSS/SVG + busca HTML funcional | 0 | 1080 |
| 02 | Primeiros caminhos | 1080 | 802 | `homeTouristSpotsSection()` | destaque principal + rail de cartões | spotlight real, seleção sem reload e `aria-pressed` | 1080 | 802 |
| 03 | Encontros pelo caminho | 1882 | 788 | `homePartnerLoopSection()` | fundo escuro, card central e vizinhos | carrossel de parceiros, sem ranking | 1882 | 796 |
| 04 | A linha conecta a experiência | 2834 | 750 | `homeRouteVisualSection()` | módulos assimétricos ligados por linha | rota construída em SVG/CSS, não rasterizada | 2842 | 750 |
| 05 | Tipos de roteiro | 3584 | 783 | `homeRouteTypesSection()` | composição editorial de tipo ativo | tabs ARIA + conteúdo trocado sem reload | 3592 | 783 |
| 06 | Escolha um ponto de partida | 4363 | 1014 | `homeRouteCardsSection()` | três cards verticais editoriais | três cards de roteiro clicáveis | 4375 | 1040 |
| 07 | Descoberta contextual | 5213 | 816 | `homeEditorialSection()` | split assimétrico, imagem/painel/contexto | clima e evento sintéticos em módulos | 5251 | 860 |
| 08 | Explore por interesse | 6029 | 1278 | `homeCategoriesSection()` | grid modular de tiles | categorias do Passaporte, não serviços da referência | 6112 | 1289 |
| 09 | Perguntas frequentes | 7307 | 1029 | `homeFaqSection()` | bloco escuro, lista ativa + preview | accordion acessível + painel de preview | 7401 | 1029 |
| 10 | Da intenção à memória | 8336 | 792 | `homePassportIntroSection()` | jornada escura + objeto central | mockup de Passaporte + etapas Explorar→Registrar | 8430 | 792 |
| 11 | Visão territorial | 9128 | 808 | `homeMapSection()` | mapa dominante, overlay/lista/pins | mapa demonstrativo real em SVG/HTML, ligado à lista | 9222 | 808 |
| 12 | Visão territorial *(nome duplicado)* | 9936 | 597 | `homeFinalCtaSection()` | encerramento minimalista | CTA final, não segundo mapa | 10030 | 597 |

Em 1920 px, as cinco primeiras faixas ficam com desvio vertical de 0–12 px. O maior desvio acumulado no início da camada final é 94 px em uma referência de 10533 px, aproximadamente 0,9%, mantendo a composição fluida em HTML real. O respiro entre as camadas 03/04 e a sobreposição entre 06/07 foram tratados como relações intencionais, em vez de normalizados automaticamente.

### Segunda matriz: comportamento responsivo

| Ordem | Seção | Referência PSD | Desktop | Tablet | Mobile | Interação | Status |
|---:|---|---|---|---|---|---|---|
| 01 | Hero | camada 01 | 1080 px de referência em 1920, conteúdo à esquerda | escala fluida | conteúdo empilhado, busca preservada | busca + sugestões | PASS |
| 02 | Pontos | camada 02 | spotlight + opções | rail reduzido | destaque + scroll/seleção | seleção ativa | PASS |
| 03 | Parceiros | camada 03 | centro + vizinhos | cards comprimidos com respiro | scroll/controles sem dependência exclusiva de setas | anterior/próximo/clique | PASS |
| 04 | Rota visual | camada 04 | rota horizontal/assimétrica | adaptação compacta | progressão legível | CTA + SVG real | PASS |
| 05 | Tipos | camada 05 | composição editorial | colunas reduzidas | empilhado | tabs e teclado | PASS |
| 06 | Cards de roteiro | camada 06 | 3 cards | grid adaptado | cards empilhados/scrollável conforme espaço | CTAs | PASS |
| 07 | Contextual | camada 07 | split modular | 2 colunas quando possível | 1 coluna | CTA | PASS |
| 08 | Categorias | camada 08 | grid editorial | menos colunas | tiles empilhados | links/filtros | PASS |
| 09 | FAQ | camada 09 | lista + preview | split reduzido | preview abaixo/uma coluna | accordion ARIA | PASS |
| 10 | Passaporte | camada 10 | mockup + texto | reduz proporções | empilha mockup/texto | CTA | PASS |
| 11 | Mapa | camada 11 | mapa dominante + lista | mapa/lista equilibrados | mapa acima, lista abaixo | foco/hover lista↔pin | PASS |
| 12 | CTA final | camada 12 | central minimalista | fluido | botões adequados ao toque | 2 CTAs | PASS |

## B. Estrutura implementada

A Home mantém exatamente 12 seções, nesta ordem:

1. `homeHeroSection()`
2. `homeTouristSpotsSection()`
3. `homePartnerLoopSection()`
4. `homeRouteVisualSection()`
5. `homeRouteTypesSection()`
6. `homeRouteCardsSection()`
7. `homeEditorialSection()`
8. `homeCategoriesSection()`
9. `homeFaqSection()`
10. `homePassportIntroSection()`
11. `homeMapSection()`
12. `homeFinalCtaSection()`

A renderização continua registrada por dados no `sectionRegistry`; não foi criada uma nova ordem editorial a partir do conteúdo estrangeiro das referências.

## C. Hero e busca

A busca é um subcomponente funcional da primeira camada, dentro de `homeHeroSection()`. Não existe uma décima terceira seção de busca. Submit e sugestões rápidas encaminham para Explorar e usam controles HTML reais com foco de teclado.

## D. Nome duplicado da última camada

O PSD recebido contém duas camadas chamadas `Visão territorial`. A primeira, camada 11, é o mapa. A camada 12 foi resolvida como `homeFinalCtaSection()` por posição final no documento, composição de encerramento e ordem funcional do index. Nenhum segundo mapa foi criado.

## E. Elementos globais

Header e Footer não têm camadas exclusivas no PSD e foram preservados como shell global. O Header é sticky, contém o SVG oficial fornecido pelo proprietário, navegação, CTA, seletor de aparência e menu mobile. O aviso `Modo de validação · conteúdo fictício` permanece separado. O Footer é renderizado após a seção 12 e preserva Descobrir, Ecossistema e Transparência.

O arquivo usado como marca é `assets/brand/logo-passaporte-serra-negra.svg`, byte a byte igual ao SVG fornecido anteriormente pelo proprietário. SHA-256: `a3de3eabe39a00463207c8ad0afc3bd76e382b710efc30aabc1bc98e6d68071e`.

## F. Interações reconstruídas

Foram exercitadas e aprovadas na validação em Chromium:

- busca e sugestão rápida do Hero;
- seletor do ponto turístico ativo;
- carrossel de parceiros;
- tabs de tipos de roteiro e navegação por teclado;
- cards/CTAs de roteiro;
- accordion de FAQ;
- relação entre lista e pins no mapa;
- alternância de tema;
- menu mobile;
- `prefers-reduced-motion`;
- rotas hash e navegação já existentes na demo.

## G. Elementos temporários

Permanecem explicitamente temporários:

- fotografias de banco gratuitas do Pexels aplicadas aos oito lugares fictícios como mídia ilustrativa;
- oito JPGs locais em `assets/stock/` funcionam como fallback automático se o CDN remoto falhar;
- dados de lugares, parceiros, clima, evento e visitas, todos sintéticos;
- mapa territorial, que demonstra relação entre lista/pins sem afirmar geografia real;
- QR real, providers externos, autenticação de produção e integrações de mapa/clima;
- imagens fotográficas finais dos lugares reais; as fotos Pexels atuais são temporárias e não representam Serra Negra nem os estabelecimentos fictícios.

Nenhuma screenshot do PSD foi usada como asset de produção, e textos/botões estrangeiros das referências não foram incorporados.

## H. Validação

Resoluções exercitadas: `1920×1080`, `1440×900`, `1280×800`, `1024×768`, `768×1024`, `390×844` e `360×800`.

Resultados:

- 7/7 viewports sem overflow horizontal;
- 0 erros de console detectados no harness;
- 0 referências literais de asset ausentes;
- `node --check app.js`: PASS;
- servidor HTTP local: `index.html` e `404.html` retornam HTTP 200;
- interações listadas na seção F: PASS;
- `prefers-reduced-motion`: exercitado;
- screenshots obrigatórios criados em `screenshots/`;
- comparação visual lado a lado em `screenshots/validation/psd-vs-implementation.jpg`.

### Limitação do navegador deste ambiente

O Chromium disponível possui política administrativa `URLBlocklist=["*"]`, que bloqueia navegação para `http://localhost` e `file://` antes que a aplicação seja carregada. A validação visual e interativa foi, portanto, executada com o mesmo Chromium através de `page.set_content()`, injetando os arquivos reais da build em memória. Como `about:blank` não fornece `localStorage`, o harness de teste substituiu apenas durante a validação esse armazenamento por um shim em memória. Essa substituição **não existe nos arquivos entregues**. O servidor HTTP foi validado separadamente com `curl`. Não se declara uma execução Playwright por navegação HTTP normal neste ambiente.

Arquivos de evidência:

- `screenshots/validation-report.json`
- `screenshots/psd-geometry-comparison.json`
- `screenshots/asset-reference-check.json`
- `screenshots/home-1920.png`
- `screenshots/home-1440.png`
- `screenshots/home-1024.png`
- `screenshots/home-390.png`
- `screenshots/home-fullpage-1440.png`
- `screenshots/validation/psd-vs-implementation.jpg`

## I. Pendências reais

A reconstrução estrutural/compositiva da landing está concluída para validação. Permanecem dependências externas ou de produção, e não bloqueios desta entrega:

- substituir as fotografias Pexels de validação por fotografias finais/licenciadas dos lugares reais quando os assets forem definidos;
- integrar geografia/provedor de mapa real apenas quando houver fonte e credenciais aprovadas;
- integrar autenticação/RBAC e autorização de backend antes de tratar Admin/parceiro como áreas seguras de produção;
- integrar QR, analytics e demais providers somente com contratos reais;
- revisão jurídica das páginas e fluxos de dados antes de produção;
- executar novamente a suíte em um ambiente sem a política administrativa que bloqueia navegação do Chromium, caso seja necessária evidência E2E por URL real.

## Arquivos principais desta reconstrução

- `index.html`
- `styles.css`
- `visual-v2.css`
- `visual.css`
- `data.js`
- `app.js`
- `assets/`
- `screenshots/`
- `references/landing-reconstruction-v3/`
- este `IMPLEMENTATION_NOTES.md`


## Fotografias temporárias dos cards

A proveniência das oito fotografias de validação está documentada em `ASSET_SOURCES_STOCK_IMAGES.md`. As URLs ficam centralizadas em `data.js` e a mesma foto acompanha o mesmo lugar em todas as ocorrências.
