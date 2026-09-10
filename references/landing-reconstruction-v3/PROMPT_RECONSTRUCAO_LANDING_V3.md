# PROMPT DE EXECUÇÃO PARA CHATGPT WORK

# RECONSTRUÇÃO DA LANDING PAGE DO PASSAPORTE SERRA NEGRA
## COMPARAÇÃO OBRIGATÓRIA CAMADA A CAMADA DO PSD COM A ESTRUTURA ORIGINAL DO INDEX

Atue como um laboratório de engenharia front-end, UI/UX, direção de arte digital, design systems, engenharia de interação e validação visual.

Você receberá **somente um arquivo PSD** chamado, ou equivalente a, `landing page(1).psd`.

Esta versão do PSD já foi **reorganizada e teve suas camadas principais renomeadas semanticamente** para refletir a seção do `index` que cada referência representa. Os nomes das camadas agora são parte importante do mapeamento e devem ser lidos antes da implementação.

Esse PSD não é um conjunto aleatório de referências e não deve ser interpretado livremente.

Ele foi montado deliberadamente **a partir da estrutura de uma landing page/index que já existia**. Cada imagem/camada foi posicionada no PSD para representar visualmente uma seção ou elemento que já fazia parte desse `index`.

Seu trabalho é reconstruir a landing page completa usando:

- a **estrutura funcional e semântica do index original descrita neste comando** como fonte de verdade para o que cada bloco significa;
- a **posição, proporção, composição e referência visual de cada camada do PSD** como fonte de verdade para como cada bloco deve ser apresentado;
- os **textos, dados e elementos temporários do index original** fornecidos neste comando como conteúdo da primeira versão.

Não invente uma nova arquitetura de landing page.

Não transforme cada referência visual do PSD em uma função diferente da seção correspondente no index.

Não use os textos, nomes de marcas, destinos ou produtos presentes nas referências estrangeiras do PSD como conteúdo do Passaporte Serra Negra.

---

# 1. PRINCÍPIO CENTRAL DA EXECUÇÃO

A reconstrução deve obedecer à seguinte hierarquia:

## 1.1 O INDEX ORIGINAL DEFINE

- quais seções existem;
- a ordem funcional das seções;
- o significado de cada seção;
- os textos temporários;
- os dados temporários;
- as interações;
- os CTAs;
- os estados de interface;
- a relação entre os componentes;
- header;
- footer;
- navegação;
- comportamento responsivo esperado.

## 1.2 O PSD DEFINE

- onde cada seção aparece visualmente;
- altura relativa de cada bloco;
- distribuição interna de texto e imagem;
- proporção dos cards;
- quantidade de espaço negativo;
- alinhamentos;
- sobreposições;
- ritmo vertical;
- alternância claro/escuro/fotográfico;
- escala tipográfica;
- linguagem de composição;
- relação visual entre os elementos dentro de cada seção.

## 1.3 REGRA DE CONFLITO

Se o conteúdo da imagem de referência do PSD sugerir uma função diferente da função existente no index, **o index vence semanticamente**.

Exemplo:

Se uma camada do PSD mostra "Popular Tours", mas ela está posicionada para representar a seção `partnerLoop` do index, essa camada deverá continuar sendo **Parceiros que entram na viagem**. Use apenas a composição visual de cards da referência.

---

# 2. O PSD NÃO É UM STORYBOARD ABERTO

Não trate o PSD como uma sequência de sites de referência que pode ser reinterpretada.

A montagem foi feita com associação intencional entre posição vertical e componentes do index original.

Portanto, antes de programar, você DEVE:

1. abrir o PSD;
2. inspecionar o composite completo;
3. inspecionar individualmente todas as camadas;
4. levantar `x`, `y`, largura e altura das camadas quando tecnicamente possível;
5. ordenar as camadas por posição vertical real, não apenas pela ordem da pilha do Photoshop;
6. usar a matriz de correspondência fornecida neste comando;
7. comparar cada camada com o componente correspondente do index;
8. validar o nome semanticamente contra a matriz deste comando;
9. somente depois iniciar a implementação.

**Não renomeie as funções do index para acompanhar nomes das referências.** Os nomes das camadas são rótulos de mapeamento visual, enquanto os componentes continuam com os identificadores funcionais originais.

Não faça uma nova interpretação livre da sequência.

---

# 3. DIMENSÕES E LEITURA CONHECIDA DO PSD

O PSD reorganizado possui:

- largura total: `1920 px`;
- altura total: `10533 px`;
- **12 camadas visuais principais**;
- faixa principal das referências: aproximadamente `1560 px` de largura;
- margem lateral visual aproximada: `180 px` de cada lado.

As margens pretas/laterais da montagem **não são parte do layout final do site**.

O site deve ser responsivo e ocupar a viewport normalmente.

As dimensões do PSD servem para entender proporções e ritmo, não para criar uma página fixa de 1920 px.

Existe agora uma correspondência direta de **12 camadas principais → 12 seções funcionais da home**. A busca deixou de existir como camada independente e deve ser tratada como parte integrante do Hero.

Também preserve como informação de composição as relações verticais do PSD. Há um respiro intencional de aproximadamente `164 px` entre o fim da camada **Encontros pelo caminho** e o início de **A linha conecta a experiência**, além de uma sobreposição aproximada de `164 px` entre **Escolha um ponto de partida** e **Descoberta contextual**. Não normalize esses encontros automaticamente antes de comparar o composite.

---

# 4. MATRIZ OBRIGATÓRIA PSD → INDEX

Esta associação é uma regra da execução.

Os **nomes das camadas** devem ser usados em conjunto com a posição vertical e o conteúdo do index. Não altere a função de uma camada por causa do conteúdo visual estrangeiro presente na imagem de referência.

| Ordem | Nome atual da camada no PSD | Posição real aproximada | Componente original do index | Função correta no Passaporte |
|---:|---|---:|---|---|
| 01 | `Passaporte Serra Negra · validação visual v2` | `x 180 / y 0 / 1560×1080` | `homeHeroSection()` | Hero principal, incluindo busca |
| 02 | `Primeiros caminhos` | `x 180 / y 1080 / 1560×802` | `homeTouristSpotsSection()` | Descoberta de pontos turísticos |
| 03 | `Encontros pelo caminho` | `x 180 / y 1882 / 1560×788` | `homePartnerLoopSection()` | Carrossel de parceiros |
| 04 | `A linha conecta a experiência` | `x 180 / y 2834 / 1560×750` | `homeRouteVisualSection()` | Narrativa visual da sequência do roteiro |
| 05 | `Tipos de roteiro` | `x 181 / y 3584 / 1560×783` | `homeRouteTypesSection()` | Showcase/tabs de tipos de roteiro |
| 06 | `Escolha um ponto de partida` | `x 181 / y 4363 / 1560×1014` | `homeRouteCardsSection()` | Cards de roteiros para diferentes intenções |
| 07 | `Descoberta contextual` | `x 180 / y 5213 / 1560×816` | `homeEditorialSection()` | Descoberta contextual |
| 08 | `Explore por interesse` | `x 180 / y 6029 / 1560×1278` | `homeCategoriesSection()` | Explorar por interesse/categorias |
| 09 | `Perguntas frequentes` | `x 179 / y 7307 / 1561×1029` | `homeFaqSection()` | FAQ interativo em bloco escuro |
| 10 | `Da intenção à memória` | `x 181 / y 8336 / 1559×792` | `homePassportIntroSection()` | Introdução ao Passaporte e jornada |
| 11 | `Visão territorial` | `x 180 / y 9128 / 1560×808` | `homeMapSection()` | Exploração territorial/mapa |
| 12 | `Visão territorial` *(nome duplicado no PSD atual)* | `x 180 / y 9936 / 1560×597` | `homeFinalCtaSection()` | CTA final |

## Observação crítica sobre os nomes das camadas

As camadas 01 a 11 estão semanticamente alinhadas com os kickers/funções do `index`.

A camada 12 está atualmente com o mesmo nome `Visão territorial` da camada 11, porém sua **posição final no documento e sua referência visual de encerramento/CTA** correspondem inequivocamente a `homeFinalCtaSection()`.

Portanto, durante esta execução:

- NÃO criar um segundo mapa;
- NÃO duplicar `homeMapSection()`;
- mapear a última camada para `homeFinalCtaSection()`;
- registrar em `IMPLEMENTATION_NOTES.md` que o nome da última camada está duplicado no PSD recebido, mas a função foi resolvida por posição + composição + ordem do index.

A home possui **12 camadas principais e 12 seções funcionais em correspondência 1:1**.

A barra de busca pertence à primeira camada/hero e deve ser reconstruída dentro de `homeHeroSection()`.

---

# 5. ORDEM FUNCIONAL ORIGINAL DA HOME

A home original utilizava este registro lógico:

```js
const HOME_SECTIONS = [
  { id: 'hero', type: 'homeHero', order: 10 },
  { id: 'spots', type: 'touristSpots', order: 20 },
  { id: 'partners', type: 'partnerLoop', order: 30 },
  { id: 'route-visual', type: 'routeVisual', order: 40 },
  { id: 'route-types', type: 'routeTypesShowcase', order: 50 },
  { id: 'route-cards', type: 'routeTypeCards', order: 60 },
  { id: 'editorial', type: 'editorialDiscovery', order: 70 },
  { id: 'categories', type: 'partnerCategories', order: 80 },
  { id: 'faq', type: 'homeFaq', order: 90 },
  { id: 'passport', type: 'passportIntro', order: 100 },
  { id: 'map', type: 'mapExplore', order: 110 },
  { id: 'final', type: 'finalCta', order: 120 }
];
```

Preserve essa sequência.

Não fundir seções apenas porque visualmente são parecidas.

Não trocar duas seções de posição.

Não adicionar uma nova seção a partir de conteúdo textual presente nas referências do PSD.

---

# 6. HEADER ORIGINAL DO INDEX

O header não possui uma camada exclusiva no PSD.

Ele deve ser preservado como elemento global da landing page e integrado visualmente ao hero.

Estrutura:

- logo/wordmark: **Passaporte Serra Negra**;
- Explorar;
- Pontos turísticos;
- Roteiros;
- Mapa;
- Para parceiros;
- CTA: **Montar meu roteiro**;
- seletor de aparência: Sistema / Claro / Escuro;
- menu mobile;
- comportamento sticky.

Rotas temporárias:

```text
Explorar            -> #/explorar
Pontos turísticos   -> #/explorar?relation=public_point
Roteiros             -> #/viagens/demo-trip-001/roteiro
Mapa                 -> #/explorar
Para parceiros       -> #/para-parceiros
Montar meu roteiro   -> #/roteiro
```

Também existe antes do header um aviso temporário discreto:

**Modo de validação · conteúdo fictício**

Na home, o header pode assumir tratamento transparente/escuro sobre o hero, desde que mantenha contraste e legibilidade.

Não interprete as pequenas labels presentes no topo da Camada 1 como substitutas do header funcional.

---

# 7. SEÇÃO 01 — HERO
## Componente original: `homeHeroSection()`
## PSD: Camada 01 — `Passaporte Serra Negra · validação visual v2`

A primeira camada define toda a composição do hero, incluindo a presença visual da busca. A busca agora está incorporada à própria referência do hero e não deve ser tratada como camada ou seção independente.

Conteúdo original:

Kicker:

**Passaporte Serra Negra · validação visual v2**

Título:

**Serra Negra, no seu ritmo.**

Lead:

**Descubra possibilidades, monte uma viagem flexível e transforme os lugares vividos em memória.**

Busca:

- label: **O que você quer encontrar?**
- placeholder: **Lugar, experiência, café, natureza…**
- botão: **Explorar**

Sugestões rápidas:

- Natureza
- Cafés
- Cultura
- Sem custo

Nota de scroll:

**Role para descobrir a cidade por caminhos, não por rankings.**

### Interação obrigatória

- submit da busca encaminha para exploração;
- sugestões rápidas preenchem/disparam busca;
- controles reais em HTML;
- foco de teclado;
- hero não deve ser uma screenshot.

### Comparação visual obrigatória

Compare:

- escala do fundo;
- posição vertical do título;
- alinhamento horizontal;
- área respirável;
- largura e forma da busca;
- posição, largura e contraste da busca integrada ao próprio hero;
- relação entre texto central e paisagem;
- conteúdo próximo ao rodapé do hero.

---

# 8. SEÇÃO 02 — PONTOS TURÍSTICOS
## Componente original: `homeTouristSpotsSection()`
## PSD: Camada 02 — `Primeiros caminhos`

A referência visual pode conter nomes de destinos estrangeiros. Ignore-os.

Ela corresponde funcionalmente ao seletor editorial de pontos turísticos do index.

Kicker:

**Primeiros caminhos**

Título:

**Conheça Serra Negra**

Texto auxiliar:

**Uma leitura editorial dos pontos de demonstração. Selecione um cartão para mudar o destaque.**

Pontos temporários:

### Mirante Vale das Araucárias
- Natureza
- 75 min
- sem custo
- descrição: **Mirante fictício criado para validar páginas de ponto turístico, clima e recomendações próximas.**

### Jardim das Nascentes
- Natureza
- 90 min
- sem custo
- descrição: **Parque fictício usado para validar filtros outdoor, atividades sem custo e calendário.**

### Centro Cultural Estação da Serra
- Cultura
- 60 min
- sem custo
- descrição: **Espaço cultural fictício usado para validar conteúdo indoor, eventos e páginas editoriais.**

CTA do ponto ativo:

**Conhecer este lugar**

### Comportamento original a preservar

- existe um item ativo;
- existe destaque visual principal;
- existe rail/lista de opções menores;
- clicar em outra opção muda o destaque sem reload;
- item ativo possui estado visual e `aria-pressed`;
- não existe ranking.

### Use a camada `Primeiros caminhos` para definir

- relação entre imagem principal e cards secundários;
- proporção dos cards;
- sobreposição;
- profundidade;
- recortes;
- escala do item ativo;
- quantidade de conteúdo parcialmente visível na lateral.

---

# 9. SEÇÃO 03 — PARCEIROS
## Componente original: `homePartnerLoopSection()`
## PSD: Camada 03 — `Encontros pelo caminho`

A camada `Encontros pelo caminho` mostra visualmente uma área escura de cards de tours. No Passaporte, sua função é o carrossel de parceiros.

Kicker:

**Encontros pelo caminho**

Título:

**Parceiros que entram na viagem**

Texto:

**Nenhuma posição indica ranking. O destaque muda para validar o comportamento do índice.**

Parceiros temporários:

- Café Neblina Alta | Cafés · Gastronomia
- Bistrô Estação Verde | Gastronomia
- Ateliê Pedra & Folha | Cultura · Compras locais
- Casa do Mel da Serra | Compras locais · Gastronomia
- Espaço Bem-Estar Águas Claras | Bem-estar

### Comportamento original

Desktop:

- card central ativo;
- vizinhos à esquerda e direita;
- profundidade visual progressiva;
- anterior/próximo;
- centralização por clique;
- CTA no item central: **Abrir página**.

Mobile:

- scroll horizontal;
- scroll-snap;
- não depender exclusivamente das setas.

### Comparação obrigatória

Use a camada `Encontros pelo caminho` para extrair:

- fundo escuro;
- escala relativa dos cards;
- área de respiro superior;
- distância entre cards;
- alinhamento central;
- tratamento de borda/overlay;
- densidade do texto sobre imagem.

---

# 10. SEÇÃO 04 — ROTEIRO COMO SEQUÊNCIA
## Componente original: `homeRouteVisualSection()`
## PSD: Camada 04 — `A linha conecta a experiência`

A camada `A linha conecta a experiência` deve ser reinterpretada exclusivamente como a representação visual do conceito de sequência conectada do roteiro.

Kicker:

**A linha conecta a experiência**

Título:

**Um roteiro é uma sequência que pode mudar.**

Texto:

**A viagem demonstrativa compartilha os mesmos dados com calendário e Passaporte. Alterar uma parada não reconstrói silenciosamente o restante.**

CTA:

**Abrir roteiro pronto**

Use os itens do primeiro dia do dataset como referência principal:

- 09:00 | Mirante Vale das Araucárias
- 11:00 | Café Neblina Alta
- 14:00 | Centro Cultural Estação da Serra

Também existem, no dataset:

- 13 SET, 09:00 | Jardim das Nascentes
- 13 SET, 12:00 | Bistrô Estação Verde
- 13 SET, 15:00 | Ateliê Pedra & Folha
- 14 SET, 09:30 | Casa do Mel da Serra
- 14 SET, 14:00 | Espaço Bem-Estar Águas Claras

### Comportamento visual

A rota deve ser construída com elementos reais, preferencialmente SVG/CSS:

- linha curva;
- pontos/paradas;
- horário;
- nome do lugar;
- leitura sequencial.

Não rasterize a rota.

### Use a camada `A linha conecta a experiência` para comparar

- disposição assimétrica dos pequenos módulos;
- uso de linha conectando elementos;
- ritmo entre texto e cards;
- escala de módulos maiores/menores;
- uso de espaço negativo.

Não transforme esta seção em uma explicação genérica de produto. Ela continua sendo `routeVisual`.

---

# 11. SEÇÃO 05 — SHOWCASE DE TIPO DE ROTEIRO
## Componente original: `homeRouteTypesSection()`
## PSD: Camada 05 — `Tipos de roteiro`

A camada `Tipos de roteiro` mostra uma composição editorial de destino/experiência. Essa composição deve ser usada para o tipo de roteiro ativo.

Kicker:

**Tipos de roteiro**

Tipos existentes:

### 01 Primeira visita
Título: **Um começo sem pressa**
Texto: **Uma seleção demonstrativa que combina paisagem, centro e uma pausa gastronômica.**

### 02 Natureza
Título: **Verde e horizonte**
Texto: **Paradas ao ar livre e tempo livre para caminhar sem transformar o dia em uma corrida.**

### 03 Gastronomia
Título: **Sabores pelo caminho**
Texto: **Uma sequência demonstrativa de café, almoço e produção local, sempre com dados fictícios.**

### 04 Dia de chuva
Título: **Descobertas em ambiente interno**
Texto: **Alternativas demonstrativas para reorganizar a viagem quando o clima muda.**

Stats:

- 3 paradas
- 1 dia
- editável

CTA:

**Montar o meu**

### Comportamento original

- quatro tabs;
- uma tab ativa;
- trocar a tab altera imagem/conteúdo do showcase;
- usar `role="tablist"`, `role="tab"` e `aria-selected`;
- conteúdo sem reload.

### Use a camada `Tipos de roteiro` para comparar

- predominância da paisagem;
- posição do texto;
- traçado de rota sobre imagem;
- relação entre CTA e metadata;
- contraste;
- altura total da seção.

---

# 12. SEÇÃO 06 — CARDS DE ROTEIROS
## Componente original: `homeRouteCardsSection()`
## PSD: Camada 06 — `Escolha um ponto de partida`

A camada `Escolha um ponto de partida` possui uma estrutura editorial em cards. Ela corresponde aos cards de roteiro do index.

Kicker:

**Escolha um ponto de partida**

Título:

**Roteiros para diferentes intenções**

CTA secundário:

**Criar do zero**

Cards principais:

1. Primeira visita | Um começo sem pressa
2. Natureza | Verde e horizonte
3. Gastronomia | Sabores pelo caminho

Cada card mostra:

- número `01`, `02`, `03`;
- tipo;
- título;
- `1 dia`;
- `3 lugares`;
- CTA: **Usar como inspiração**.

O quarto tipo, Dia de chuva, continua no dataset e nas tabs da seção anterior.

### Use a camada `Escolha um ponto de partida` para comparar

- proporção vertical dos cards;
- grid com três elementos;
- relação imagem/texto;
- posição do número;
- comportamento editorial do rodapé dos cards;
- respiro entre título da seção e cards.

---

# 13. SEÇÃO 07 — DESCOBERTA CONTEXTUAL
## Componente original: `homeEditorialSection()`
## PSD: Camada 07 — `Descoberta contextual`

Kicker:

**Descoberta contextual**

Título:

**O mesmo destino pode pedir um dia diferente.**

Texto:

**Clima, tempo disponível e intenção podem reorganizar a leitura da cidade. Nesta versão, o contexto é inteiramente simulado.**

Clima temporário:

- 12 SET 2026 | Parcialmente nublado | 23 °C | 20% de chuva
- 13 SET 2026 | Chuva | 19 °C | 75% de chuva
- 14 SET 2026 | Céu aberto | 25 °C | 10% de chuva

Evento usado pela home:

**Feira Criativa da Serra — DEMO**

CTA:

**Ver possibilidades**

### Use a camada `Descoberta contextual` para comparar

- split de colunas;
- imagem editorial principal;
- painel de informações;
- card contextual/evento;
- relação entre metadata, título e descrição;
- proporções diferentes entre colunas.

---

# 14. SEÇÃO 08 — CATEGORIAS
## Componente original: `homeCategoriesSection()`
## PSD: Camada 08 — `Explore por interesse`

A camada `Explore por interesse` é um grid visual de serviços na referência. Na landing do Passaporte ela continua sendo **Explore por interesse**.

Kicker:

**Explore por interesse**

Título:

**O que combina com a sua viagem?**

Texto:

**As categorias filtram o conteúdo existente sem criar uma hierarquia de importância.**

Categorias originais:

- Natureza
- Gastronomia
- Cafés
- Cultura
- Compras locais
- Bem-estar

Tile complementar:

**Ver todos**

Subtexto:

**Busca e filtros**

### Use a camada `Explore por interesse` para comparar

- grade modular;
- combinação de tiles com e sem imagem;
- tamanhos relativos;
- bordas;
- ícones;
- espaçamento interno;
- relação entre cabeçalho e grid.

Não renomeie essas categorias com os rótulos estrangeiros da referência.

---

# 15. SEÇÃO 09 — FAQ
## Componente original: `homeFaqSection()`
## PSD: Camada 09 — `Perguntas frequentes`

A camada `Perguntas frequentes` mostra uma composição escura baseada em lista com item ativo e preview. Use exatamente essa lógica visual para o FAQ.

Kicker:

**Perguntas frequentes**

Título:

**Entenda antes de começar.**

Introdução:

**Esta interface é uma validação funcional. Recursos ainda não integrados são mostrados como tal, sem simular disponibilidade real.**

FAQ original:

### Preciso criar conta?
**Não nesta demonstração. O estado é salvo somente no navegador para permitir validar os fluxos.**

### Como funcionam os roteiros?
**Você responde ao onboarding, recebe um roteiro demonstrativo e pode mover, fixar, remover ou adicionar paradas sem reconstrução automática.**

### Como funciona o Passaporte?
**Planejamento e visita registrada são estados diferentes. O Passaporte reúne apenas os registros demonstrativos confirmados.**

### Como funciona o QR?
**O QR real ainda não está integrado nesta fase. O registro manual existe somente para validar a experiência e permanece identificado como demonstração.**

### Posso alterar o roteiro?
**Sim. As mudanças locais são persistidas no navegador e refletidas também no calendário.**

### Comportamento original

- accordion;
- um item aberto;
- `aria-expanded`;
- clique troca item;
- animação discreta;
- desktop pode mostrar preview visual relacionado à direita usando a linguagem da camada `Perguntas frequentes`;
- mobile pode trazer esse preview abaixo do item ativo.

---

# 16. SEÇÃO 10 — PASSAPORTE
## Componente original: `homePassportIntroSection()`
## PSD: Camada 10 — `Da intenção à memória`

A camada `Da intenção à memória` mostra uma composição de início de jornada. Use essa organização para apresentar a jornada do Passaporte.

Kicker:

**Da intenção à memória**

Título:

**O roteiro organiza. O Passaporte guarda.**

Texto:

**A experiência separa claramente o que você pretende fazer daquilo que registrou como vivido.**

Etapas originais:

01 Explorar
02 Montar
03 Visitar
04 Registrar
05 Construir o Passaporte

CTA:

**Abrir meu Passaporte**

O index original também possuía um mockup visual de passaporte:

Capa:

```text
PASSAPORTE
SERRA
NEGRA
memórias da viagem
```

Página interna demonstrativa:

```text
VISITA
12 SET
DEMO
```

Mostrar também uma contagem temporária de registros demonstrativos.

### Use a camada `Da intenção à memória` para comparar

- fundo escuro;
- foco em uma ação principal;
- uso de linha/caminho pontilhado;
- relação entre mockup e texto;
- sensação de progressão/jornada.

Não transformar essa seção em formulário de reserva ou campanha comercial.

---

# 17. SEÇÃO 11 — MAPA
## Componente original: `homeMapSection()`
## PSD: Camada 11 — `Visão territorial`

Kicker:

**Visão territorial**

Título:

**Explore também pelo mapa**

Texto:

**O mapa desta validação é abstrato. Ele demonstra vínculo entre pins, cards e filtros sem afirmar geografia real.**

Usar pelo menos cinco lugares do dataset temporário.

Lista lateral pode mostrar três itens, por exemplo:

- Mirante Vale das Araucárias
- Jardim das Nascentes
- Centro Cultural Estação da Serra

CTA:

**Abrir exploração completa**

### Comportamento

- mapa visual real em HTML/SVG/CSS ou biblioteca apropriada;
- não usar screenshot do PSD como mapa funcional;
- hover/focus em item deve destacar pin correspondente;
- no mobile, mapa acima e lista abaixo;
- enquanto não houver dados geográficos reais definitivos, identificar o mapa como demonstrativo.

### Use a camada `Visão territorial` do mapa para comparar

- mapa como elemento dominante;
- overlay editorial;
- pinagem;
- linha territorial;
- escala do título;
- quantidade de área visual ocupada pelo mapa.

---

# 18. SEÇÃO 12 — CTA FINAL
## Componente original: `homeFinalCtaSection()`
## PSD: Camada 12 — última camada, `Visão territorial` no PSD atual, funcionalmente CTA final

Kicker:

**Seu próximo caminho**

Título:

**Comece pela curiosidade. O roteiro vem depois.**

CTAs:

- **Montar meu roteiro**
- **Explorar primeiro**

A última camada define o encerramento minimalista da landing. Apesar do nome duplicado `Visão territorial`, ela corresponde funcionalmente ao CTA final.

Use:

- muito espaço negativo;
- título forte;
- dois CTAs;
- composição limpa;
- clara separação do mapa anterior.

---

# 19. FOOTER ORIGINAL DO INDEX

O footer não possui uma camada exclusiva no PSD.

Ele deve ser adicionado **depois da Camada 12/CTA final**, preservando a arquitetura do index original.

Marca:

**Passaporte Serra Negra**

Texto:

**Demonstração visual e funcional. Dados exclusivamente sintéticos.**

Coluna Descobrir:

- Explorar
- Montar roteiro
- Meu Passaporte

Coluna Ecossistema:

- Para parceiros
- Admin demo
- Restaurar demo

Coluna Transparência:

- Privacidade
- Termos de uso
- Cookies e armazenamento
- Acessibilidade

Não tente encontrar uma camada do PSD para o footer. Ele é uma estrutura global do index que precisa ser preservada.

---

# 20. DADOS TEMPORÁRIOS DO INDEX

Centralize os dados temporários em um objeto separado para facilitar substituição futura.

## Cidade

```json
{
  "name": "Serra Negra",
  "state": "SP",
  "country": "BR",
  "synthetic": true
}
```

## Categorias

```text
Natureza
Gastronomia
Cafés
Cultura
Compras locais
Bem-estar
```

## Lugares

### Mirante Vale das Araucárias
- tipo: ponto turístico
- relação: ponto público
- categoria: Natureza
- duração: 75 min
- ambiente: outdoor
- custo: sem custo
- horário demo: 08:00–18:00

### Jardim das Nascentes
- tipo: ponto turístico
- relação: ponto público
- categoria: Natureza
- duração: 90 min
- ambiente: outdoor
- custo: sem custo
- horário demo: 07:00–17:30

### Centro Cultural Estação da Serra
- tipo: ponto turístico
- relação: ponto público
- categoria: Cultura
- duração: 60 min
- ambiente: indoor
- custo: sem custo
- horário demo: 10:00–18:00

### Café Neblina Alta
- tipo: business
- relação: parceiro
- categorias: Cafés, Gastronomia
- duração: 60 min
- ambiente: indoor
- custo: pago
- horário demo: 08:00–19:00

### Bistrô Estação Verde
- tipo: business
- relação: parceiro
- categoria: Gastronomia
- duração: 90 min
- ambiente: indoor
- custo: pago
- horário demo: 11:30–22:00

### Ateliê Pedra & Folha
- tipo: business
- relação: parceiro
- categorias: Cultura, Compras locais
- duração: 75 min
- ambiente: indoor
- custo: misto
- horário demo: 09:30–18:00

### Casa do Mel da Serra
- tipo: business
- relação: parceiro
- categorias: Compras locais, Gastronomia
- duração: 60 min
- ambiente: misto
- custo: misto
- horário demo: 09:00–17:00

### Espaço Bem-Estar Águas Claras
- tipo: business
- relação: parceiro
- categoria: Bem-estar
- duração: 90 min
- ambiente: indoor
- custo: pago com reserva
- horário demo: 10:00–20:00

Todos são dados fictícios de validação.

---

# 21. IDENTIDADE TEMPORÁRIA DO INDEX

Use os tokens abaixo como base. Não substitua arbitrariamente a paleta por cores encontradas nas referências externas do PSD.

```css
:root {
  --bg-primary: #E8E8E0;
  --bg-secondary: #D4D1C7;

  --surface-primary: #F3F1EC;
  --surface-secondary: #D4D1C7;

  --text-primary: #161618;
  --text-secondary: #403D3F;
  --text-muted: #7A7372;

  --border-primary: #C8C3B8;
  --icon-primary: #45454A;

  --accent-primary: #403D3F;
  --accent-secondary: #7A7372;

  --niche-red: #4E0000;
  --niche-yellow: #F2E8D1;
  --niche-sage: #A1AD92;
  --niche-olive: #5A5D43;
  --niche-blue: #94B2C4;
  --niche-navy: #00324D;
  --niche-cocoa: #5B4536;
  --niche-coconut: #F0EDE5;
}

[data-theme="dark"] {
  --bg-primary: #161618;
  --bg-secondary: #262425;

  --surface-primary: #262425;
  --surface-secondary: #403D3F;

  --text-primary: #E8E8E0;
  --text-secondary: #D4D1C7;
  --text-muted: #A6A09A;

  --border-primary: #45454A;
  --icon-primary: #D4D1C7;

  --accent-primary: #D4D1C7;
  --accent-secondary: #A6A09A;
}
```

Direção tipográfica temporária:

- títulos principais: serifada editorial, preferencialmente Georgia ou equivalente segura;
- corpo/interface: Inter ou system-ui;
- kickers: caixa alta, tamanho pequeno, tracking alto;
- números de seção: serifados grandes quando a composição pedir.

---

# 22. ELEMENTOS VISUAIS TEMPORÁRIOS

O index original utilizava placeholders cenográficos próprios, e não as imagens de terceiros como conteúdo final.

Mantenha essa lógica.

O PSD é referência para composição, não uma biblioteca de assets finais.

Você pode:

- usar gradientes próprios;
- criar paisagens abstratas com CSS/SVG;
- usar blocos temporários editáveis;
- criar linhas de montanha/relevo;
- usar texturas sutis;
- criar slots claros para futura substituição por fotos reais.

Nomeie slots semanticamente:

```text
hero-serra-negra
spot-mirante
spot-jardim
spot-centro-cultural
partner-cafe
partner-bistro
partner-atelie
partner-casa-mel
partner-bem-estar
route-landscape
editorial-landscape
map-background
```

Não use screenshots inteiras do PSD como fundo final.

Não recorte botões/textos das referências para simular HTML.

---

# 23. INTERAÇÕES MÍNIMAS DO INDEX A RECONSTRUIR

A landing precisa continuar funcional.

Implemente:

- header sticky;
- menu mobile;
- seletor de tema Sistema/Claro/Escuro;
- busca do hero;
- sugestões rápidas de busca;
- seleção do ponto turístico em destaque;
- carrossel de parceiros;
- tabs de tipos de roteiro;
- cards de roteiro clicáveis;
- accordion de FAQ;
- relação visual entre lista e pins no mapa;
- CTAs e navegação por hash;
- estados hover/focus/active;
- navegação por teclado;
- `prefers-reduced-motion`;
- ARIA onde necessário.

Não deixe os componentes apenas decorativos se no index original eles tinham interação.

---

# 24. ESTADO LOCAL TEMPORÁRIO

Se for necessário recriar o comportamento da demo sem backend, use `localStorage` para:

- preferência de tema;
- estado demonstrativo do roteiro;
- seleção temporária quando fizer sentido;
- visitas demonstrativas do Passaporte.

Não implemente autenticação falsa.

Não implemente integrações externas falsas.

Não faça requests para serviços inexistentes.

---

# 25. RESPONSIVIDADE

A composição do PSD corresponde à leitura desktop, mas não deve ser reproduzida com largura fixa.

Validar em:

- 1920 × 1080;
- 1440 × 900;
- 1280 × 800;
- 1024 × 768;
- 768 × 1024;
- 390 × 844;
- 360 × 800.

Regras:

- preservar a ordem das 12 seções;
- preservar a hierarquia visual de cada camada correspondente;
- adaptar composição, não apenas reduzir escala;
- cards horizontais podem virar scroll-snap;
- grids devem reduzir colunas gradualmente;
- mapa fica acima da lista em telas estreitas;
- FAQ passa para uma coluna quando necessário;
- Passaporte pode empilhar mockup e texto;
- títulos devem usar `clamp()`;
- sem overflow horizontal;
- áreas clicáveis adequadas para toque.

---

# 26. ARQUITETURA DE ARQUIVOS

Se não houver projeto inicial no ambiente, crie uma build autocontida e simples:

```text
/
  index.html
  styles.css
  visual.css
  data.js
  app.js
  README.md
  IMPLEMENTATION_NOTES.md
  /assets
    /brand
    /icons
    /placeholders
  /screenshots
```

Pode usar uma stack moderna somente se ela já estiver preparada e trouxer benefício claro.

Não introduza uma pilha complexa sem necessidade.

Preferir:

- HTML semântico;
- CSS variables;
- JavaScript organizado por componentes;
- SVG para rotas/pins/formas;
- dados temporários separados da renderização.

---

# 27. PROCESSO OBRIGATÓRIO DE COMPARAÇÃO

Antes de implementar qualquer CSS final, produza internamente uma tabela de análise com estas colunas:

```text
PSD_LAYER
PSD_Y
PSD_HEIGHT
INDEX_COMPONENT
INDEX_CONTENT
INDEX_INTERACTION
VISUAL_PATTERN_FROM_PSD
IMPLEMENTATION_DECISION
```

Preencha para todas as **12 camadas principais**, usando prioritariamente o **nome da camada** e a posição vertical para identificação.

A busca deve aparecer como subcomponente de `homeHeroSection()` dentro da primeira camada, sem gerar registro próprio na tabela de seções.

Depois faça uma segunda tabela com as 12 seções:

```text
SECTION_ORDER
INDEX_SECTION
PSD_REFERENCE
DESKTOP_LAYOUT
TABLET_LAYOUT
MOBILE_LAYOUT
INTERACTION
VALIDATION_STATUS
```

Essas tabelas devem orientar a implementação e ser incluídas resumidamente em `IMPLEMENTATION_NOTES.md`.

---

# 28. MÉTODO DE IMPLEMENTAÇÃO

Execute nesta ordem:

1. inspecionar PSD e camadas;
2. confirmar o mapeamento PSD → index;
3. construir header global;
4. construir esqueleto das 12 seções na ordem correta;
5. construir footer global;
6. aplicar proporções e composição com base em cada camada;
7. inserir o conteúdo temporário fornecido neste comando;
8. implementar interações;
9. ajustar desktop;
10. ajustar tablet;
11. ajustar mobile;
12. validar acessibilidade básica;
13. rodar build/local server;
14. tirar screenshots;
15. comparar screenshots com o PSD;
16. corrigir desvios grosseiros;
17. documentar.

Não pare na fase de análise.

Não responda apenas com código solto.

Crie os arquivos reais.

---

# 29. VALIDAÇÃO VISUAL CAMADA A CAMADA

A validação não deve ser apenas "o site ficou bonito".

Para cada seção, compare explicitamente com a camada correspondente em:

- início e fim visual do bloco;
- altura proporcional;
- largura útil;
- posição do título;
- posição do texto secundário;
- proporção de imagem;
- posição dos cards;
- alinhamentos;
- quantidade de espaço negativo;
- contraste;
- hierarquia;
- sobreposição;
- densidade;
- eixo visual dominante.

A fidelidade buscada é **fidelidade estrutural/compositiva**, não cópia literal de branding externo.

---

# 30. NÃO FAZER

Não:

- tratar o PSD como inspiração genérica;
- mudar a ordem das seções;
- criar seções baseadas nos textos das referências;
- remover seções do index por não entender a referência;
- criar uma seção independente para a busca do Hero;
- substituir parceiros por "tours";
- substituir categorias por "serviços";
- substituir FAQ por "awards";
- substituir Passaporte por formulário de viagem;
- usar nomes estrangeiros encontrados nas imagens;
- usar logo estrangeiro;
- usar screenshot integral do PSD na página;
- rasterizar textos, botões ou formulários;
- transformar o mapa em uma imagem sem interação;
- remover funcionalidades existentes para aproximar a screenshot;
- inventar dados reais de Serra Negra nesta fase.

---

# 31. CRITÉRIO DE PRIORIDADE EM CADA BLOCO

Ao trabalhar em uma seção, responda internamente nesta ordem:

1. **Qual componente do index esta camada representa?**
2. **Qual era a função desse componente?**
3. **Qual conteúdo temporário ele utilizava?**
4. **Qual interação ele possuía?**
5. **Como a camada do PSD reorganiza visualmente esse mesmo conteúdo?**
6. **Como reproduzir a composição com HTML/CSS/JS real?**

Nunca comece pela pergunta "o que esta screenshot parece ser?".

Comece por "qual parte do index esta screenshot foi escolhida para representar?".

---

# 32. FIDELIDADE E FONTES DE VERDADE

Ordem de prioridade obrigatória:

### Para FUNÇÃO
1. este comando;
2. descrição do index original contida neste comando;
3. comportamento original aqui especificado.

### Para POSIÇÃO E COMPOSIÇÃO VISUAL
1. PSD e suas camadas;
2. composite completo;
3. relação espacial entre uma camada e a seguinte.

### Para CONTEÚDO
1. textos e dados temporários deste comando;
2. nunca os textos estrangeiros do PSD.

### Para ASSETS
1. elementos próprios/temporários editáveis;
2. placeholders;
3. nunca tratar imagens de referência como identidade final.

---

# 33. VALIDAÇÃO TÉCNICA

Ao concluir:

- iniciar o site localmente;
- verificar console;
- eliminar erros JS;
- eliminar 404 de assets;
- testar navegação;
- testar keyboard navigation;
- testar menu mobile;
- testar carrossel;
- testar troca de ponto turístico;
- testar tabs;
- testar FAQ;
- testar mapa/lista;
- testar tema;
- verificar `prefers-reduced-motion`;
- verificar overflow horizontal.

Se Playwright/Chromium estiver disponível, use-os para testes e screenshots.

---

# 34. SCREENSHOTS OBRIGATÓRIOS

Produza pelo menos:

```text
/screenshots/home-1920.png
/screenshots/home-1440.png
/screenshots/home-1024.png
/screenshots/home-390.png
```

Além disso, produza uma captura **full page desktop** para permitir comparação vertical com os `10533 px` do PSD.

Quando tecnicamente possível, crie também uma montagem de validação lado a lado:

```text
PSD | IMPLEMENTAÇÃO
```

Não precisa ser pixel-perfect, mas deve permitir identificar:

- se as 12 faixas/camadas aparecem na ordem correta;
- se cada uma utiliza o padrão visual da camada correta;
- se a densidade e as proporções estão coerentes.

---

# 35. IMPLEMENTATION_NOTES.md

O relatório final deve conter obrigatoriamente:

## A. Mapeamento
Tabela Nome da camada PSD → Componente do index, incluindo geometria e observação da camada final com nome duplicado.

## B. Estrutura
Lista das 12 seções na ordem implementada.

## C. Hero e busca
Explicação explícita de que a busca faz parte da primeira camada/hero e não existe como seção independente.

## D. Nome duplicado da última camada
Registrar que a camada final chegou nomeada `Visão territorial`, mas foi mapeada para `homeFinalCtaSection()` por posição, composição e ordem funcional.

## E. Elementos globais
Como header e footer foram preservados apesar de não possuírem camadas exclusivas no PSD.

## F. Interações
Quais interações do index foram reconstruídas.

## G. Temporários
Quais dados, imagens e componentes continuam como placeholders.

## H. Validação
Resoluções testadas e problemas corrigidos.

## I. Pendências
Somente pendências realmente bloqueadas por ausência de ativo ou integração externa.

---

# 36. CRITÉRIOS DE ACEITE

A execução só está concluída quando:

- o PSD tiver sido inspecionado por camadas;
- todas as 12 camadas principais tiverem sido classificadas;
- a busca tiver sido tratada como elemento interno do hero;
- o nome duplicado da camada 12 tiver sido documentado e resolvido como CTA final;
- as 12 seções originais estiverem presentes;
- as 12 seções estiverem na ordem original;
- cada seção estiver usando a camada visual correspondente;
- nenhum conteúdo estrangeiro das referências tiver substituído o conteúdo do Passaporte;
- header existir;
- footer existir;
- busca funcionar;
- seletor de pontos funcionar;
- carrossel de parceiros funcionar;
- tabs de roteiro funcionarem;
- cards de roteiro existirem;
- descoberta contextual estiver presente;
- grid de categorias estiver presente;
- FAQ funcionar;
- Passaporte estiver representado;
- mapa estiver presente e ligado à lista;
- CTA final estiver presente;
- mobile estiver resolvido;
- não existir overflow horizontal;
- não houver erros no console;
- screenshots de validação tiverem sido criados.

---

# 37. ENTREGA FÍSICA

Não considere previews ou snippets como entrega.

Entregue os arquivos reais do projeto.

No mínimo:

```text
index.html
styles.css / visual.css
data.js
app.js
README.md
IMPLEMENTATION_NOTES.md
screenshots/
assets/
```

Se a stack escolhida gerar estrutura diferente, entregue o equivalente completo e executável.

Ao final da execução, informe objetivamente:

- o que foi criado;
- como executar;
- quais interações funcionam;
- onde estão os screenshots;
- quais itens são placeholders;
- se alguma divergência entre PSD e index precisou ser resolvida.

---

# 38. RESULTADO ESPERADO

O resultado não deve parecer uma página nova criada a partir de referências aleatórias.

Ele deve parecer **a evolução visual direta do index original do Passaporte Serra Negra**.

A semântica, dados e funcionalidades continuam sendo os do index.

O PSD reorganiza visualmente essa mesma página.

Em termos simples:

> **INDEX = o que existe e o que cada parte faz.**
>
> **PSD = onde cada parte fica e como ela deve parecer.**
>
> **IMPLEMENTAÇÃO = reconstrução real da mesma landing page combinando as duas fontes.**

Essa regra deve orientar toda a execução, do primeiro diagnóstico ao último screenshot de validação.
