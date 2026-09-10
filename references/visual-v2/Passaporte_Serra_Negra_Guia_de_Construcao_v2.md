# Passaporte Serra Negra — Guia de Construção Visual e Modular
## Comandos de implementação por seção + mapa de referências

**Versão:** 2.0  
**Uso:** este arquivo deve ser usado junto com a pasta `imagens/` deste kit como briefing operacional para construção do site.  
**Objetivo:** permitir que um agente de código ou equipe implemente cada seção separadamente, mantendo a mesma estética global, responsividade, fluidez, acessibilidade e possibilidade de criar novas seções sem reescrever páginas existentes.

---

# 0. Como usar este guia

Este documento não é apenas uma descrição visual. Cada bloco marcado como **COMANDO DE CONSTRUÇÃO** é uma instrução executável de implementação.

## Ordem recomendada

1. implemente primeiro o **sistema global**;
2. implemente o **Section Registry**;
3. implemente os componentes compartilhados;
4. construa a landing do turista seção por seção;
5. construa páginas públicas de parceiro;
6. construa a landing de aquisição de parceiros;
7. construa área logada do parceiro;
8. construa Admin;
9. só depois adicione novas variações.

## Regra fundamental

**Não copie literalmente as referências.**  
Extraia delas composição, hierarquia, ritmo, proporção, comportamento e sensação visual. A identidade final deve continuar sendo Passaporte Serra Negra.

---

# 1. Regras globais obrigatórias

## 1.1. Sistema visual

Todas as páginas devem consumir os mesmos tokens globais para:

- cores;
- tipografia;
- espaçamento;
- raios;
- bordas;
- sombras;
- largura de containers;
- breakpoints;
- z-index;
- motion;
- estados de interação.

**Não usar valores hardcoded dentro de componentes quando o valor puder ser token.**

## 1.2. Fluidez

Toda seção deve:

- funcionar de 320px até telas wide;
- evitar larguras fixas para conteúdo principal;
- usar `clamp()`, `min()`, `max()`, `minmax()` ou equivalente;
- evitar overflow horizontal acidental;
- ter comportamento explícito para mobile, tablet, desktop e wide;
- preservar ordem semântica do conteúdo;
- aceitar conteúdo variável sem quebrar a composição.

## 1.3. Motion

Toda animação deve ter sensação premium e discreta:

- `ease-in-out` ou curva equivalente;
- fade;
- translate curto;
- scale sutil;
- duração curta/moderada;
- sem overshoot agressivo;
- sem parallax pesado;
- sem blur excessivo;
- respeitar `prefers-reduced-motion`.

## 1.4. Imagens

- usar imagens responsivas;
- definir `aspect-ratio`;
- `object-fit: cover`;
- lazy load abaixo da primeira dobra;
- usar placeholder/skeleton;
- evitar CLS;
- permitir focal point quando necessário.

## 1.5. Conteúdo ausente

Se um campo não tiver dados:

- o campo continua existindo no schema;
- o elemento não aparece publicamente;
- nenhum espaço vazio deve permanecer no layout;
- não inserir texto fictício.

## 1.6. Links externos

Todo link externo fornecido por parceiro:

- abre em nova guia;
- deve ser visualmente distinguível quando apropriado;
- deve registrar analytics;
- nunca substitui a página atual do Passaporte.

## 1.7. Acessibilidade

Obrigatório:

- foco visível;
- teclado;
- contraste adequado;
- labels;
- alt text;
- landmarks;
- headings em ordem;
- ARIA para accordions, dialogs e carrosséis;
- touch targets adequados;
- não comunicar status apenas por cor.

---

# 2. Contrato técnico para seções

Toda seção deve ser um módulo independente registrado em um **Section Registry**.

```ts
export type SectionDefinition = {
  id: string
  type: string
  version: number
  enabled: boolean
  order: number

  audience:
    | 'tourist'
    | 'partner_public'
    | 'partner_private'
    | 'admin'

  pageScopes: string[]

  variant?: string
  theme?: 'light' | 'dark' | 'photo' | 'brand'

  content: Record<string, unknown>
  dataSource?: string

  visibility?: {
    requiresAuth?: boolean
    requiresData?: string[]
    startsAt?: string
    endsAt?: string
  }

  layout?: {
    container: 'contained' | 'wide' | 'full'
    density: 'compact' | 'comfortable' | 'editorial'
  }

  analytics?: {
    impressionEvent?: string
    interactionEvents?: string[]
  }
}
```

Exemplo:

```ts
export const sectionRegistry = {
  homeHero: HomeHeroSection,
  touristSpots: TouristSpotsSection,
  partnerLoop: PartnerLoopSection,
  routeVisual: RouteVisualSection,
  routeTypesShowcase: RouteTypesShowcaseSection,
  routeTypeCards: RouteTypeCardsSection,
  editorialDiscovery: EditorialDiscoverySection,
  partnerCategories: PartnerCategoriesSection,
  homeFaq: HomeFaqSection,
  passportIntro: PassportIntroSection,
  mapExplore: MapExploreSection,
}
```

### Critério

Adicionar uma nova seção deve exigir somente:

1. criar componente;
2. definir schema;
3. registrar no registry;
4. definir dados;
5. definir responsividade;
6. definir estados;
7. definir analytics.

**Nunca editar manualmente o JSX/HTML estrutural de todas as páginas para inserir uma nova seção.**

---

# 3. Shell global público

## COMANDO DE CONSTRUÇÃO — `PublicShell`

> Construa o shell global público do Passaporte Serra Negra. Crie Header, área principal e Footer reutilizáveis. O Header deve iniciar integrado visualmente ao Hero quando houver imagem full-bleed e assumir fundo sólido ou translúcido ao rolar. Use a identidade visual global do projeto, sem inventar uma identidade paralela. Garanta navegação por teclado, menu mobile, fechamento por Escape, prevenção de scroll quando o menu móvel estiver aberto e transições discretas. Não duplique o CTA principal em itens de menu e botão.

### Deve conter

- marca;
- Explorar;
- Pontos turísticos;
- Roteiros;
- Mapa;
- Para parceiros;
- CTA `Montar meu roteiro`.

### Responsividade

**Desktop:** navegação horizontal.  
**Tablet:** reduzir gaps antes de ocultar itens.  
**Mobile:** menu em drawer/sheet; CTA preservado.

### Aceite quando

- não houver salto de layout no scroll;
- Header funcionar sobre fundo claro e foto;
- menu mobile for totalmente navegável por teclado;
- Footer usar o mesmo container e tokens.

---

# 4. Landing principal do turista

---

## 4.1. Hero — referências 01 + 02

**Arquivos:**

- `imagens/01_home_ref_vienna_hero.png`
- `imagens/02_home_ref_escape_search_hero.png`

## COMANDO DE CONSTRUÇÃO — `HomeHeroSection`

> Construa o Hero principal do Passaporte Serra Negra combinando a atmosfera cinematográfica da referência 01 com a barra de pesquisa da referência 02. A fotografia deve dominar a dobra. Use headline editorial grande, poucas informações auxiliares e pesquisa integrada sem transformar a página em um buscador genérico. A barra deve pesquisar lugar, categoria, experiência ou intenção. Inclua sugestões rápidas abaixo ou integradas à busca. Preserve legibilidade com overlay controlado. Não use muitos cards no Hero. O resultado deve parecer destino turístico premium primeiro e interface digital em segundo.

### Conteúdo mínimo

- eyebrow/marca;
- headline;
- subtítulo;
- busca;
- 3–5 sugestões rápidas.

### Interações

- foco abre sugestões;
- Enter executa busca;
- sugestões preenchem/disparam pesquisa;
- analytics em `search_focus`, `search_submit`, `search_suggestion_click`.

### Responsividade

**Desktop:** hero 85–100svh; busca larga central.  
**Tablet:** headline reduzida com `clamp`.  
**Mobile:** hero nunca menor que espaço útil da tela; busca empilhada; botão pode ocupar linha inteira.

### Não fazer

- não usar carrossel de 10 imagens no Hero;
- não colocar métricas;
- não colocar filtros avançados;
- não usar mais de um CTA principal.

---

## 4.2. Conheça Serra Negra — referência 03

**Arquivo:** `imagens/03_home_ref_saint_antonin_cards.png`

## COMANDO DE CONSTRUÇÃO — `TouristSpotsSection`

> Construa uma seção editorial chamada “Conheça Serra Negra” dedicada aos pontos turísticos. Use um painel principal de grande impacto e cards laterais parcialmente visíveis, inspirados na referência 03. Ao trocar o ponto selecionado, atualize fotografia, nome, descrição e metadados com transição suave. Esta seção não deve promover parceiros comerciais; seu papel é apresentar a cidade. Permita swipe em touch e teclado em desktop.

### Dados

```ts
type TouristSpot = {
  id: string
  name: string
  slug: string
  image: ImageAsset
  category?: string
  region?: string
  shortDescription?: string
}
```

### Responsividade

- desktop: painel + 3–4 cards visíveis/parciais;
- tablet: 2–3;
- mobile: 1 card principal + peek do próximo.

### Aceite quando

- troca de seleção não altera altura abruptamente;
- imagens têm focal point;
- leitura funciona sem animação;
- controles têm labels acessíveis.

---

## 4.3. Loop de parceiros — referência 04 + protótipo

**Arquivos:**

- `imagens/04_home_ref_adventure_partner_loop.png`
- `prototipos/partner_loop_infinite_reference.zip`

## COMANDO DE CONSTRUÇÃO — `PartnerLoopSection`

> Construa um carrossel/loop infinito de parceiros inspirado no movimento da referência 04 e no protótipo anexado, mas com visual próprio do Passaporte Serra Negra. Carregue no máximo 6 parceiros elegíveis por sessão da seção. Sorteie o conjunto no carregamento e mantenha-o estável durante o loop. Em seguida, randomize a ordem visual. O card central é apenas o item selecionado, nunca um ranking. Permita autoplay lento, drag, swipe, teclado e clique. Ao clicar em um card lateral, centralize-o; ao clicar no card central, abra a página pública do parceiro. Pause autoplay em hover, foco ou interação. Respeite `prefers-reduced-motion`.

### Regra de justiça

Não usar uma seleção puramente aleatória sem possibilidade de equilíbrio futuro.

Preparar data layer para:

```ts
partner_index_impression
partner_card_centered
partner_card_click
```

e campos como:

```ts
lastShownAt
impressionCount
centerCount
clickCount
```

### Visual

- centro `scale ~ 1`;
- vizinhos `~0.90`;
- segundo nível `~0.80`;
- rotação máxima aproximada `8–12deg`;
- sem blur forte;
- opacidade/contraste reduzem discretamente nas extremidades.

### Card

- foto;
- ícone do nicho;
- categoria;
- nome;
- localização;
- status somente se necessário internamente.

### Responsividade

**Desktop:** 1 central + laterais reconhecíveis.  
**Mobile:** 1 central + peek anterior/próximo; nunca comprimir 6 cards na viewport.

---

## 4.4. Rota visual — referência 05

**Arquivo:** `imagens/05_home_ref_old_riga_route.png`

## COMANDO DE CONSTRUÇÃO — `RouteVisualSection`

> Construa uma seção visual que apresente uma rota real ou demonstrativa por Serra Negra através de uma linha contínua ligando paradas. A linha deve funcionar como linguagem gráfica da plataforma, não como decoração gratuita. Mostre 3–6 paradas, pequenas imagens ou marcadores, horário ou sequência, distância total e duração. A linha pode atravessar cards ou imagens de forma editorial. Anime o traçado discretamente ao entrar na viewport, mas apresente a informação completa imediatamente quando `prefers-reduced-motion` estiver ativo.

### Responsividade

- desktop: composição horizontal/diagonal;
- mobile: rota vira progressão vertical;
- não reduzir texto a ponto de perder legibilidade.

---

## 4.5. Apresentação dos tipos de roteiro — referência 06

**Arquivo:** `imagens/06_home_ref_morocco_route_types.png`

## COMANDO DE CONSTRUÇÃO — `RouteTypesShowcaseSection`

> Construa um showcase de tipos de roteiro com uma grande imagem ativa, texto editorial e seletor de miniaturas/chips. A seleção deve trocar o conteúdo sem navegar para outra página. Use a referência 06 para composição, não para copiar estilo. Tipos iniciais podem incluir: um dia, fim de semana, primeira visita, natureza, gastronomia, família, casal, experiências sem custo e dia de chuva.

### Regras

- seleção inicial determinística;
- estado selecionado acessível;
- teclado entre opções;
- transição de imagem com fade/scale discreto.

---

## 4.6. Cards de roteiro — referência 07

**Arquivo:** `imagens/07_home_ref_idyll_route_cards.png`

## COMANDO DE CONSTRUÇÃO — `RouteTypeCardsSection`

> Construa uma fileira ou grade de cards verticais para roteiros, inspirados na proporção editorial da referência 07. Cada card deve apresentar imagem, título, duração, quantidade de lugares e CTA. Os cards devem pertencer ao mesmo sistema de `RouteCard`, aceitando variações de tema sem alterar a estrutura. Em telas pequenas, usar scroll horizontal com snap ou grid de uma coluna conforme a densidade.

---

## 4.7. Seções editoriais de descoberta — referências 08 + 09

**Arquivos:**

- `imagens/08_home_ref_travel_time_sections.png`
- `imagens/09_home_ref_creacy_editorial_sections.png`

## COMANDO DE CONSTRUÇÃO — `EditorialDiscoverySection`

> Construa uma seção editorial modular capaz de alternar texto, fotografia e pequenos cards sem repetir a grade das seções anteriores. Ela deve aceitar variantes de layout, como `media-left`, `media-right`, `hero-media`, `cards-bottom` e `split`. Use esta seção para narrativas sobre Serra Negra, ideias sazonais, clima, “para hoje” e outros conteúdos contextuais. Não codifique conteúdo específico dentro do componente.

### Schema sugerido

```ts
type EditorialBlock = {
  heading: string
  eyebrow?: string
  body?: string
  media?: ImageAsset
  cards?: EditorialCard[]
  cta?: Link
  variant: 'media-left' | 'media-right' | 'hero-media' | 'cards-bottom' | 'split'
}
```

---

## 4.8. Categorias dos parceiros — referência 10

**Arquivo:** `imagens/10_home_ref_miljo_partner_categories.png`

## COMANDO DE CONSTRUÇÃO — `PartnerCategoriesSection`

> Construa uma grade de categorias inspirada na seção “Our waste services” da referência 10. Troque os ícones genéricos por ícones SVG consistentes que representem cada nicho do Passaporte Serra Negra. Cada card deve conter nome da categoria, imagem e ícone. O último card pode ser “Ver todos”. Mantenha proporções consistentes e permita que a quantidade de categorias cresça sem exigir alteração de layout.

### Categorias iniciais possíveis

- Gastronomia;
- Cafés;
- Hospedagem;
- Comércio;
- Vinícolas;
- Aventura;
- Cultura;
- Bem-estar;
- Experiências.

---

## 4.9. FAQ principal — referência 15

**Arquivo:** `imagens/15_home_ref_faq_passport_dark.png`

## COMANDO DE CONSTRUÇÃO — `HomeFaqSection`

> Construa a seção de FAQ da landing principal usando atmosfera escura/fotográfica inspirada na parte superior da referência 15. Use accordions com uma pergunta aberta por vez por padrão, mas permita configuração. A imagem deve ser de fundo/apoio e nunca comprometer contraste. O componente deve receber perguntas por dados e não conter perguntas hardcoded.

### Perguntas iniciais

- preciso criar conta?;
- como funciona o Passaporte?;
- como funcionam os roteiros?;
- como funciona o QR?;
- como registro visita?;
- posso alterar roteiro?;
- quanto custa usar?.

---

## 4.10. Dinâmica do Passaporte — referência 15

**Arquivo:** `imagens/15_home_ref_faq_passport_dark.png`

## COMANDO DE CONSTRUÇÃO — `PassportIntroSection`

> Construa uma seção própria para explicar visualmente a dinâmica do Passaporte Serra Negra. Apresente um mockup do passaporte e conecte as etapas “Explorar → Montar → Visitar → Registrar → Construir o Passaporte” através da linguagem de rota da plataforma. Mostre exemplos de carimbos, contador X/X por categoria, primeira visita e retorno. Não transforme a seção em tutorial longo; a compreensão deve ocorrer principalmente pela composição visual.

---

## 4.11. Mapa de exploração

## COMANDO DE CONSTRUÇÃO — `MapExploreSection`

> Construa uma seção de mapa integrada à descoberta. O mapa deve ser secundário em relação ao conteúdo editorial da home, mas permitir pins, categorias e cards vinculados. Em mobile, priorize card/sheet e mapa em tela suficiente para interação. Carregue o provedor do mapa sob demanda para evitar custo de performance na primeira dobra.

---

## 4.12. CTA final

## COMANDO DE CONSTRUÇÃO — `FinalCtaSection`

> Construa um fechamento fotográfico de alto impacto, com headline curta, CTA principal “Montar meu roteiro” e ação secundária “Explorar primeiro”. Não adicione novos recursos ou grids nessa seção. O objetivo é fechar a narrativa e converter.

---

# 5. Página pública de parceiro

**Referências:** 11, 12, 13, 14.

---

## 5.1. Hero do parceiro — referências 11 + 12

**Arquivos:**

- `imagens/11_partner_page_ref_armonia.png`
- `imagens/12_partner_page_ref_idyll.png`

## COMANDO DE CONSTRUÇÃO — `PartnerHeroSection`

> Construa o Hero da página pública do parceiro mantendo o shell do Passaporte Serra Negra. Use fotografia imersiva inspirada na referência 12 e organização editorial da referência 11. Exiba categoria, nome, localização, descrição curta e carimbo do parceiro. A página deve parecer uma página do Passaporte sobre aquele negócio, não um site independente com identidade própria.

---

## 5.2. Quick Info

## COMANDO DE CONSTRUÇÃO — `PartnerQuickInfoSection`

> Construa uma faixa de informações práticas imediatamente após o Hero. Mostre apenas dados existentes, como aberto hoje, horário, contato, localização, faixa de preço, site e reserva externa. Em mobile, transformar a faixa em grid de 2 colunas ou scroll horizontal, conforme o número de itens. Nunca renderizar slots vazios.

---

## 5.3. Sobre o lugar

## COMANDO DE CONSTRUÇÃO — `PartnerAboutSection`

> Construa uma composição editorial assimétrica de texto + imagens. Permita variantes `image-left`, `image-right` e `dual-media`. Preserve largura de leitura confortável e use o mesmo componente em todos os nichos.

---

## 5.4. O que você encontra aqui — referência 13

**Arquivo:** `imagens/13_partner_page_ref_cabin_modules.png`

## COMANDO DE CONSTRUÇÃO — `PartnerFeatureGridSection`

> Construa módulos alternados de foto e texto inspirados na referência 13. O componente deve aceitar entre 1 e 6 itens e reorganizar automaticamente o grid. Não dependa de exatamente quatro blocos. Cada item pode conter título, descrição, imagem e tags. Em mobile, ordenar imagem e texto de forma semântica, evitando zigue-zague cansativo.

---

## 5.5. Imagem de impacto

## COMANDO DE CONSTRUÇÃO — `PartnerFeatureBannerSection`

> Construa uma imagem horizontal ampla com opcional de pequeno bloco contextual sobreposto. Use apenas quando houver mídia suficiente. Em mobile, o texto sobreposto deve virar bloco separado se o contraste não for seguro.

---

## 5.6. Informações e ações — referência 14

**Arquivo:** `imagens/14_partner_page_ref_athens_info_faq.png`

## COMANDO DE CONSTRUÇÃO — `PartnerDetailsSection`

> Construa uma seção em duas colunas no desktop: conteúdo detalhado à esquerda e resumo acionável à direita. O card da direita pode ser sticky enquanto permanecer dentro do limite da seção. A ação interna “Adicionar ao roteiro” deve ser visualmente dominante. Links de WhatsApp, Instagram, site, mapa ou reserva são externos e devem ser separados visualmente. Em mobile, remover sticky e colocar o resumo antes ou depois do conteúdo conforme prioridade semântica.

---

## 5.7. Galeria

## COMANDO DE CONSTRUÇÃO — `PartnerGallerySection`

> Construa galeria com uma imagem principal e até 5 miniaturas visíveis. Ao abrir, mostrar viewer/modal acessível com navegação por teclado, swipe e fechamento por Escape. Lazy load de imagens não visíveis.

---

## 5.8. Localização

## COMANDO DE CONSTRUÇÃO — `PartnerLocationSection`

> Construa bloco de localização com mapa, endereço e CTA “Abrir rota”. Não dependa de mapa para que o endereço fique acessível. Em falha do mapa, manter texto e link funcional.

---

## 5.9. FAQ / Antes de visitar

## COMANDO DE CONSTRUÇÃO — `PartnerFaqSection`

> Construa accordion opcional para dúvidas práticas. Só renderize se houver perguntas reais. Não gere perguntas artificiais para preencher layout. Aceite perguntas estruturadas por parceiro e/ou nicho.

---

## 5.10. Passaporte e visita

## COMANDO DE CONSTRUÇÃO — `PartnerPassportStatusSection`

> Construa um bloco que mostre relação daquele usuário com o local. Estados: `anonymous`, `not_visited`, `visited_once`, `returned`. Exiba carimbo, data de primeira/última visita e contagem quando disponível. Nunca exibir dados pessoais de outro usuário. Quando não autenticado, mostrar convite para entrar apenas se a ação exigir conta.

---

## 5.11. Continue explorando

## COMANDO DE CONSTRUÇÃO — `RelatedPlacesSection`

> Construa uma seleção neutra de poucos lugares relacionados por região, categoria ou contexto. Não rotular como “melhores”, “top” ou “premium”. Preparar seleção para equilíbrio de exposição.

---

# 6. Landing de aquisição de parceiros — referência 16

**Arquivo:** `imagens/16_partner_acquisition_landing_ref_old_riga.png`

## COMANDO DE CONSTRUÇÃO — `PartnerAcquisitionPage`

> Construa uma landing pública específica para aquisição de parceiros, inspirada no ritmo narrativo e na linha de percurso da referência 16. A página deve explicar valor sem parecer uma página comercial agressiva. Conduza o visitante por “descoberta → página → contato → visita → QR → dados → relacionamento”. Use fotografias de Serra Negra, blocos claros, bastante respiro e linguagem visual de rota.

### Seções

1. Hero de entrada;
2. jornada visual;
3. valor para o parceiro;
4. como funciona;
5. como o parceiro aparece;
6. nichos atendidos;
7. FAQ;
8. CTA de contato.

### Regra

Não expor publicamente regras internas de maturação, dados sensíveis ou ferramentas exclusivas do Admin.

---

# 7. Área logada do parceiro

**Referências:** 17 e 19.

- `imagens/17_partner_dashboard_ref_dropify.png`
- `imagens/19_dashboard_shared_components_ref_caplen.png`

## 7.1. Shell da área do parceiro

## COMANDO DE CONSTRUÇÃO — `PartnerDashboardShell`

> Construa um dashboard leve e acolhedor, com sidebar, topbar e área de cards, usando a organização da referência 17 e elementos da referência 19. Use a paleta global do Passaporte em vez de roxo/lima das referências. O parceiro só pode acessar dados do próprio negócio. Não reutilizar rotas ou permissões do Admin.

### Menu inicial

- Visão geral;
- Minha página;
- Desempenho;
- Visitas e interesse;
- Solicitações;
- Configurações.

---

## 7.2. KPIs do parceiro

## COMANDO DE CONSTRUÇÃO — `PartnerKpiGrid`

> Construa cards de KPI simples com número principal, período, variação e mini tendência opcional. KPIs iniciais: visualizações da página, cliques externos, visitas registradas, entradas em roteiros e solicitações. Não mostrar métricas sem volume suficiente quando isso puder induzir leitura errada; use estados “dados insuficientes” quando necessário.

---

## 7.3. Status e completude

## COMANDO DE CONSTRUÇÃO — `PartnerProfileHealthCard`

> Construa um card de status da página com percentual de completude, status de publicação, última atualização e checklist de campos importantes. O objetivo é orientar o parceiro a melhorar o próprio perfil sem dar acesso à estrutura global.

---

## 7.4. Interesse no negócio

## COMANDO DE CONSTRUÇÃO — `PartnerInterestCard`

> Construa visualização simples de comportamento do turista: visualizações, cliques de contato, salvamentos, adições a roteiro e visitas QR. Preferir gráficos pequenos, legíveis e comparáveis por período. Não criar “score” opaco sem definição.

---

## 7.5. Origem das interações

## COMANDO DE CONSTRUÇÃO — `PartnerTrafficSourcesCard`

> Construa um card mostrando como os turistas chegaram ao parceiro: busca, home, categoria, roteiro, QR ou outra página. Use distribuição simples e tooltips claros.

---

## 7.6. Solicitações e pendências

## COMANDO DE CONSTRUÇÃO — `PartnerRequestsPanel`

> Construa uma lista de solicitações com status, data, tipo e última atualização. O parceiro pode editar dados não sensíveis permitidos; inclusão/remoção de informações estruturais deve passar pelo fluxo de solicitação definido pelo sistema.

---

## 7.7. Próximos passos

## COMANDO DE CONSTRUÇÃO — `PartnerNextActions`

> Construa checklist acionável com no máximo 5 itens prioritários. Exemplos: adicionar horário, corrigir link, incluir foto, completar descrição, acompanhar solicitação. Não criar tarefas artificiais quando não houver pendências.

---

# 8. Área Admin

**Referências:** 18, 19 e 20.

- `imagens/18_admin_dashboard_ref_dodo.png`
- `imagens/19_dashboard_shared_components_ref_caplen.png`
- `imagens/20_dashboard_tables_profiles_ref_korean.png`

## 8.1. Shell Admin

## COMANDO DE CONSTRUÇÃO — `AdminShell`

> Construa um dashboard administrativo mais denso que a área do parceiro, mas usando o mesmo design system. Crie sidebar persistente, topbar com busca global, filtros contextuais, notificações e ações primárias. O Admin deve ter visão do ecossistema, não apenas de um parceiro.

### Menu inicial

- Visão geral;
- Parceiros;
- Páginas;
- Roteiros;
- Eventos;
- Solicitações;
- Alertas;
- Cidades;
- Dados;
- Configurações.

---

## 8.2. KPIs gerais

## COMANDO DE CONSTRUÇÃO — `AdminKpiGrid`

> Construa um grid responsivo de KPIs gerais: parceiros ativos, páginas publicadas, visitas registradas, cliques externos, roteiros criados e solicitações pendentes. Em desktop, priorize leitura em uma única linha quando houver espaço; em tablet/mobile, quebrar sem reduzir demais os cards.

---

## 8.3. Controle das páginas dos parceiros

## COMANDO DE CONSTRUÇÃO — `AdminPartnerPagesControl`

> Construa um bloco central de controle das páginas dos parceiros. Permita buscar, filtrar, ordenar, abrir preview, editar, verificar status, categoria, cidade e última atualização. Exiba cards de preview quando o objetivo for reconhecimento visual e tabela quando o objetivo for operação em massa. Nunca substituir tabela por cards em listas grandes.

---

## 8.4. Alertas e oportunidades

## COMANDO DE CONSTRUÇÃO — `AdminAlertsPanel`

> Construa um painel priorizado de alertas e oportunidades com ícone, severidade, título, parceiro/objeto relacionado, tempo e ação. Suportar inicialmente: sem visitas há 30 dias, QR sem uso, solicitação pendente, forte crescimento, sem atualização há 90 dias, baixa conversão de clique, crescimento de avaliações negativas, forte presença em roteiros e aumento de retornos.

---

## 8.5. Visitas ao longo do tempo

## COMANDO DE CONSTRUÇÃO — `AdminVisitsChart`

> Construa gráfico temporal com filtros de período, tooltip e comparação opcional. Não esconder valores atrás apenas de hover; fornecer resumo textual e tabela acessível quando necessário.

---

## 8.6. Distribuição de categorias

## COMANDO DE CONSTRUÇÃO — `AdminCategoriesChart`

> Construa visualização de distribuição dos parceiros por nicho. Pode usar donut/radial como resumo, mas sempre acompanhar legenda com valores absolutos e percentuais. Em mobile, priorizar a lista e reduzir o gráfico se necessário.

---

## 8.7. Mapa e visão territorial

## COMANDO DE CONSTRUÇÃO — `AdminTerritoryMap`

> Construa mapa para visão territorial de parceiros, cidades, eventos ou atividade. Permita filtros. O mapa não deve ser a única forma de acessar os dados; sempre fornecer lista/tabela equivalente.

---

## 8.8. Tabelas operacionais — referência 20

## COMANDO DE CONSTRUÇÃO — `AdminDataTable`

> Construa um componente de tabela robusto inspirado na clareza da referência 20. Deve suportar colunas configuráveis, busca, filtros, ordenação, paginação, status, seleção opcional e ações por linha. Em mobile, não simplesmente esmagar colunas: usar prioridade de colunas + detalhe expansível ou card-row mantendo semântica.

### Usos

- Parceiros;
- Páginas;
- Solicitações;
- Eventos;
- Cidades;
- Roteiros;
- Auditoria.

---

## 8.9. Atividade recente

## COMANDO DE CONSTRUÇÃO — `AdminRecentActivity`

> Construa lista cronológica de ações relevantes: página atualizada, parceiro cadastrado, solicitação aprovada, roteiro alterado, evento criado, mudança de status. Mostrar autor/sistema, objeto e horário.

---

## 8.10. Ciclo de maturação do parceiro

## COMANDO DE CONSTRUÇÃO — `PartnerMaturityPanel`

> Construa uma visão administrativa de maturação com padrão inicial de 90 dias, mas sem tornar o processo rígido. Permita acompanhar estágio atual, última interação, atividade, riscos, sinais de avanço/regressão e próxima ação recomendada. O período de 90 dias deve ser configurável e tratado como referência de acompanhamento.

---

# 9. Componentes compartilhados

## COMANDO DE CONSTRUÇÃO — `DashboardComponentLibrary`

> Antes de duplicar UI entre Admin e parceiro, crie uma biblioteca compartilhada de componentes. Compartilhe aparência e comportamento, mas preserve permissões e densidade de informação diferentes.

### Base

- Sidebar;
- Topbar;
- SearchBar;
- KPI Card;
- Status Badge;
- Filter Bar;
- Dropdown;
- Tabs;
- Button;
- Icon Button;
- Section Header.

### Informação

- Progress Card;
- Quick Stats;
- Activity List;
- Alert List;
- Small Calendar;
- Line Chart;
- Bar Chart;
- Donut Chart;
- Map Card;
- Data Table;
- Empty State;
- Error State;
- Skeleton.

### Operação

- Partner Preview Card;
- Request Item;
- Action Checklist;
- Sticky Summary;
- Modal;
- Drawer;
- Confirm Dialog;
- Toast.

---

# 10. Padrões responsivos obrigatórios

## COMANDO DE CONSTRUÇÃO — `ResponsiveSystem`

> Crie breakpoints como tokens de design, não valores repetidos. Implemente containers fluidos e grids que mudem de quantidade de colunas automaticamente. Cada componente deve documentar seu comportamento em mobile, tablet, desktop e wide.

### Sugestão inicial

```css
--bp-mobile-max: 639px;
--bp-tablet-min: 640px;
--bp-desktop-min: 1024px;
--bp-wide-min: 1440px;
```

### Regras

- mobile-first;
- nenhuma seção pública depende de largura fixa;
- dashboard sidebar vira drawer quando necessário;
- card sticky desativa no mobile;
- carrosséis aceitam swipe;
- tabelas usam estratégia de prioridade/expansão;
- mapa não ocupa toda a tela sem escape claro;
- texto nunca fica sobre imagem sem contraste suficiente.

---

# 11. Padrão para criação de NOVA seção

Use o comando abaixo sempre que surgir uma nova ideia.

## COMANDO MESTRE — `CreateNewSection`

> Crie uma nova seção para o Passaporte Serra Negra sem alterar a identidade visual nem quebrar páginas existentes. Primeiro defina o objetivo da seção, audiência, página(s) permitidas, dados necessários, estados de vazio/loading/erro, comportamento responsivo, eventos de analytics e referência visual aplicável. Em seguida, crie o componente isolado, schema de dados, stories/previews, testes e registro no Section Registry. Use apenas tokens globais e componentes compartilhados. A seção deve poder ser habilitada, desabilitada, ordenada e versionada por configuração. Se não houver dados obrigatórios, ela não deve renderizar. Não hardcode posição, conteúdo de parceiro ou quantidade fixa de itens salvo quando a regra de produto exigir.

### Checklist obrigatório

- [ ] tem `type`, `id`, `version` e `order`;
- [ ] audiência definida;
- [ ] page scopes definidos;
- [ ] schema validado;
- [ ] mobile/tablet/desktop documentados;
- [ ] sem dados não quebra;
- [ ] loading definido;
- [ ] erro definido;
- [ ] analytics definidos;
- [ ] teclado/foco testados;
- [ ] motion reduzido testado;
- [ ] performance revisada;
- [ ] não duplica componente existente;
- [ ] pode ser removida sem editar outras seções.

---

# 12. Comando mestre para construir uma página a partir das seções

## COMANDO MESTRE — `BuildPageFromRegistry`

> Construa a página lendo uma lista ordenada de `SectionDefinition`. Filtre seções desabilitadas ou sem dados obrigatórios. Resolva o componente pelo `sectionRegistry`. Renderize cada seção dentro do shell apropriado e aplique containers/temas por configuração. Se um `type` desconhecido for recebido, falhe de forma segura em desenvolvimento e ignore com log em produção. Não use condicionais espalhadas pela página para escolher seções específicas.

Exemplo:

```ts
const visibleSections = page.sections
  .filter(section => section.enabled)
  .filter(section => hasRequiredData(section))
  .sort((a, b) => a.order - b.order)

return (
  <PublicShell>
    {visibleSections.map(section => {
      const Component = sectionRegistry[section.type]
      if (!Component) return null

      return (
        <Component
          key={`${section.id}:${section.version}`}
          definition={section}
        />
      )
    })}
  </PublicShell>
)
```

---

# 13. Analytics mínimos

## COMANDO DE CONSTRUÇÃO — `AnalyticsLayer`

> Crie uma camada de analytics independente dos componentes visuais. Componentes devem emitir eventos sem conhecer o provedor de analytics. Inclua identificadores de seção, tipo de conteúdo, origem e contexto. Não enviar dados pessoais desnecessários.

### Eventos iniciais

```text
section_impression
search_focus
search_submit
search_suggestion_click
filter_change
card_impression
partner_index_impression
partner_card_centered
partner_card_click
external_link_click
route_view
route_save
add_to_route
remove_from_route
qr_scan
visit_validated
review_submitted
passport_shared
```

---

# 14. Estados de interface

## COMANDO DE CONSTRUÇÃO — `UiStates`

> Para cada componente de dados, implemente pelo menos os estados `loading`, `ready`, `empty` e `error`. Se houver permissão/autenticação, incluir `unauthorized` ou `requires_auth`. Evite loaders infinitos; forneça mensagens curtas e ações úteis.

### Casos importantes do produto

- busca sem resultado;
- parceiro sem foto;
- parceiro indisponível;
- link externo ausente;
- roteiro vazio;
- viagem sem data;
- evento encerrado;
- QR inválido;
- visita já registrada;
- mapa indisponível;
- conexão ruim.

---

# 15. Estrutura sugerida de código

```text
src/
├── app/
├── components/
│   ├── global/
│   ├── sections/
│   │   ├── public/
│   │   ├── partner-public/
│   │   ├── partner-private/
│   │   └── admin/
│   ├── cards/
│   ├── dashboard/
│   ├── forms/
│   └── maps/
├── features/
│   ├── tourist/
│   ├── partner/
│   ├── admin/
│   ├── routes/
│   ├── passport/
│   └── analytics/
├── design-system/
│   ├── tokens/
│   ├── icons/
│   ├── typography/
│   └── motion/
├── section-registry/
├── schemas/
├── data/
├── lib/
└── styles/
```

---

# 16. Mapa das referências visuais

| Arquivo | Aplicação principal |
|---|---|
| `01_home_ref_vienna_hero.png` | atmosfera e fotografia do Hero |
| `02_home_ref_escape_search_hero.png` | barra de busca do Hero |
| `03_home_ref_saint_antonin_cards.png` | pontos turísticos / cards laterais |
| `04_home_ref_adventure_partner_loop.png` | movimento e profundidade do loop de parceiros |
| `05_home_ref_old_riga_route.png` | linha visual de rota |
| `06_home_ref_morocco_route_types.png` | showcase de tipos de roteiro |
| `07_home_ref_idyll_route_cards.png` | cards verticais de roteiro |
| `08_home_ref_travel_time_sections.png` | densidade controlada e descoberta |
| `09_home_ref_creacy_editorial_sections.png` | ritmo editorial da landing |
| `10_home_ref_miljo_partner_categories.png` | grade de nichos/categorias |
| `11_partner_page_ref_armonia.png` | grid e estrutura da página pública |
| `12_partner_page_ref_idyll.png` | hero e atmosfera da página pública |
| `13_partner_page_ref_cabin_modules.png` | módulos foto + texto |
| `14_partner_page_ref_athens_info_faq.png` | detalhes, galeria, FAQ, card de ação |
| `15_home_ref_faq_passport_dark.png` | FAQ principal + apresentação do Passaporte |
| `16_partner_acquisition_landing_ref_old_riga.png` | landing de aquisição de parceiros |
| `17_partner_dashboard_ref_dropify.png` | área logada do parceiro |
| `18_admin_dashboard_ref_dodo.png` | estrutura geral do Admin |
| `19_dashboard_shared_components_ref_caplen.png` | cards, progresso, agenda, listas |
| `20_dashboard_tables_profiles_ref_korean.png` | tabelas e gestão de múltiplos registros |
| `prototipos/partner_loop_infinite_reference.zip` | referência de comportamento do loop de parceiros |

---

# 17. Critério de aceite global antes de integrar uma seção

Uma seção só deve ser integrada quando:

- [ ] está visualmente alinhada ao Passaporte Serra Negra;
- [ ] usa o design system;
- [ ] não contém estilos globais acidentais;
- [ ] não depende de dados fictícios;
- [ ] é configurável;
- [ ] é responsiva;
- [ ] possui estados;
- [ ] é acessível;
- [ ] respeita reduced motion;
- [ ] registra analytics relevantes;
- [ ] não degrada Core Web Vitals sem justificativa;
- [ ] pode ser removida/ocultada sem quebrar a página;
- [ ] pode receber conteúdo maior/menor;
- [ ] não favorece parceiro por posição fixa quando a regra exigir neutralidade.

---

# 18. Instrução final para agente de construção

> Use este Markdown como contrato de implementação e os arquivos de `imagens/` como referências visuais. Não trate as imagens como screenshots para cópia pixel a pixel. Preserve a identidade global do Passaporte Serra Negra e a coerência entre turista, parceiro e Admin. Construa cada seção como módulo independente, responsivo e orientado a dados. Quando surgir uma nova seção, use `CreateNewSection` e registre-a no `Section Registry`. Antes de criar um componente novo, verifique se um componente global já resolve o problema. Priorize fluidez, clareza, performance e manutenção sobre efeitos visuais. Nenhuma decisão visual local deve comprometer o comportamento do sistema como um todo.
