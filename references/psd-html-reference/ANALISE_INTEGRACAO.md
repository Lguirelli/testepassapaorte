# ANÁLISE DE INTEGRAÇÃO — PSD_HTML_REFERENCE

## Papel do pacote

O `PSD_HTML_REFERENCE` deve ser tratado como **fonte visual e estrutural** para duas superfícies:

1. Home / Index
2. Página individual de parceiro / experiência

Ele não deve substituir sozinho a aplicação atual.

A combinação recomendada é:

- **PSD_HTML_REFERENCE** → composição, ritmo, hierarquia e estrutura visual.
- **Passaporte v10** → navegação premium, View Transitions, shared elements, ícones, dark mode, interações, mapa/roteiro/Passaporte.
- **LATEST(4)** → CMS, dados públicos/editoriais, tracking, providers, regras de publicação e integridade.

---

# HOME

O material contém 12 seções:

1. Hero
2. Discovery Band
3. Popular Routes
4. Signature Route
5. Editorial
6. Categories
7. Context Section
8. Interest Section
9. FAQ
10. Journey Section
11. Territory Section
12. Final CTA

## Uso imediato

### Hero
Pode orientar diretamente a Home atual:
- header transparente sobre imagem;
- foto em grande escala;
- título editorial;
- busca;
- microinformação inferior;
- CTA circular.

Manter a fotografia atual de Serra Negra, não os assets temporários extraídos do PSD.

### Discovery Band
Vale incorporar.
Funciona melhor que uma grade convencional para descoberta por intenção.
Deve usar categorias/interesses reais e o trilho horizontal deve ser gerado dinamicamente.

### Popular Routes
Vale incorporar visualmente.
Os cards devem receber dados de templates reais de roteiro.

### Signature Route
Vale incorporar.
O SVG de rota deve usar dados reais do roteiro e a animação premium existente.

### Editorial
Vale incorporar o layout assimétrico.
O conteúdo precisa vir de configuração/dados.

### Categories
Vale incorporar.
Usar `categoryIds`, icon registry e imagens reais.

### Context Section
É uma das melhores adições do pacote.
Pode reunir:
- clima;
- tempo disponível;
- evento;
- proximidade;
- imagem;
- pequena rota.

Transformar em contexto real quando providers forem conectados.

### Interest Section
Vale incorporar como mosaico de descoberta.
Não duplicar Categories: Categories = taxonomia; Interests = intenção/perfil.

### FAQ
Manter a lógica atual, mas aproximar a composição do layout do PSD.

### Journey Section
Vale incorporar como ponto de entrada para o onboarding.
O formulário deve iniciar/preencher o estado de viagem, não ser um formulário isolado.

### Territory Section
Vale usar como introdução editorial ao mapa.
Ao clicar, leva para Explorar em modo mapa.

### Final CTA
Vale incorporar.

---

# PÁGINA INDIVIDUAL DE PARCEIRO

Este é o maior ganho do pacote.

A v10 atual possui uma página de parceiro funcional, mas o layout do PSD HTML é muito mais completo e adequado a uma experiência premium.

Usar como template de:

`#/parceiros/:slug`

Não substituir a página institucional `#/parceiros` / “Para parceiros”.

## Estrutura recomendada

1. Hero fotográfico
2. Barra de disponibilidade/planejamento
3. Introdução e atributos
4. Mosaico de benefícios e métricas
5. Bloco editorial
6. Faixas de experiências
7. Oferta em tabs
8. Manifesto/citação
9. Recomendações por proximidade
10. Informações práticas
11. CTA de roteiro/reserva

## Adaptação obrigatória

Nada deve ficar hardcoded.

### Hero
Derivar de:
- nome;
- categorias;
- descrição;
- imagem;
- relação comercial.

### Barra de disponibilidade
Só mostrar “Ver disponibilidade” quando existir provider/integração real.

Caso contrário:
- data pretendida;
- período;
- pessoas;
- botão “Adicionar ao roteiro” ou “Planejar visita”.

### Mosaico
Derivar de:
- duração;
- distância;
- avaliação somente se houver fonte real;
- atributos;
- imagens.

Não inventar avaliação.

### Experience Bands
Gerar a partir das experiências relacionadas ao lugar.

### Tabs
Gerar de modalidades/experiências.
Se só existir uma modalidade, não mostrar tabs artificiais.

### Recomendações
Usar o motor de proximidade/contexto da v10.
Cards devem abrir lugares reais.

### Informações práticas
Usar icon registry:
- horário;
- duração;
- localização;
- reserva;
- estacionamento;
- acessibilidade;
- telefone;
- WhatsApp;
- Instagram;
- direções.

### CTA final
Conectar ao roteiro real.
Reserva somente quando existir integração válida.

---

# O QUE NÃO DEVE SER COPIADO LITERALMENTE

## Fotografias temporárias
Os WebPs/JPGs foram extraídos do PSD e o próprio relatório informa que são assets de referência.

Não usar como acervo definitivo.

## Marca inline do protótipo
A referência usa um símbolo SVG próprio no header.
Manter a identidade oficial já existente no projeto.

## Ícones Unicode
A referência usa caracteres como:
- `↗`
- `→`
- `←`
- `↓`
- `↘`
- `♡`
- `♥`
- `◌`
- `◉`
- `◇`
- `⌂`

Substituir todos pelo icon registry da v10.

## Transição antiga
A referência usa uma camada `.page-transition` com `setTimeout(560)`.

Não usar.
Manter View Transitions/shared transitions da v10.

## Toasts de protótipo
Manter a infraestrutura atual de feedback do Passaporte.

## Conteúdo demonstrativo
Não copiar textos como dados definitivos de parceiros.

---

# O QUE O PSD REFERENCE FAZ MELHOR QUE A V10

1. Página individual de parceiro muito mais completa.
2. Hierarquia visual editorial mais consistente.
3. Ritmo vertical mais próximo de produto premium.
4. Uso mais forte de módulos assimétricos.
5. Context Section mais interessante que blocos informacionais convencionais.
6. Journey CTA melhor como entrada no onboarding.
7. Territory Section cria uma transição narrativa melhor para o mapa.
8. Mosaicos mobile estão bem resolvidos e já foram validados em 390 px.
9. Partner mobile mantém narrativa forte sem parecer apenas cards empilhados.

---

# O QUE A V10 FAZ MELHOR

1. Navegação SPA real.
2. View Transitions.
3. Shared element transition.
4. Sistema de ícones.
5. Dark mode.
6. Dados dinâmicos.
7. Personalização da Home.
8. Mapa/lista conectado.
9. Drag-and-drop de roteiro.
10. Passaporte SVG real.
11. Tracking/state.
12. Componentização sem conteúdo estático.
13. Integração com estrutura futura do CMS.

Portanto, o PSD HTML deve entrar como **camada de composição**, não como base de runtime.

---

# ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

## Bloco 1 — Partner Detail
Reconstruir `renderPartner()` usando a estrutura de 10 seções do PSD HTML.

É o maior ganho visual imediato.

## Bloco 2 — Home
Reconciliar as 12 seções do PSD com os módulos já existentes.

Prioridade:
- Discovery Band
- Popular Routes
- Context Section
- Interests
- Journey
- Territory

## Bloco 3 — Dados
Conectar cada seção ao modelo público do LATEST:
- places;
- partners;
- experiences;
- events;
- categories.

## Bloco 4 — Interações premium
Preservar:
- shared transitions;
- slide suave;
- hover de card inteiro;
- header reactivo;
- map/card sync;
- onboarding;
- roteiro.

## Bloco 5 — Regressão responsiva
Usar as screenshots de referência:
- Home: 1920, 1440, 1024, 768, 390.
- Partner: 1440, 1024, 768, 390.

---

# REGRA DE FONTE DE VERDADE

Para futuras construções:

### Visual
`PSD_HTML_REFERENCE`

### Interações
`Passaporte v10`

### Dados / CMS
`LATEST(4)`

### Identidade / ícones
Sistema atual `assets/icons-v3` + marca oficial.

### Fotografias
Acervo real aprovado de Serra Negra e parceiros.

---

# CONCLUSÃO

O pacote é utilizável imediatamente, principalmente como referência estrutural para Home e como template quase completo da página individual de parceiro.

A recomendação é não copiar o HTML diretamente. O correto é portar a estrutura visual para os renderizadores e componentes dinâmicos da aplicação atual.
