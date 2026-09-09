# COMANDO DE EXECUÇÃO PARA CHATGPT WORK

# PASSAPORTE SERRA NEGRA — REPOSITÓRIO DE VALIDAÇÃO V1

Atue como um laboratório de produto e engenharia responsável por transformar a documentação e os assets anexos em um **repositório GitHub executável de validação incremental** do Passaporte Serra Negra.

A meta NÃO é terminar o MVP inteiro. A meta é construir um vertical slice funcional do que já está definido, validar a arquitetura e a experiência com Playwright, corrigir problemas encontrados e deixar uma base limpa para evolução em blocos posteriores.

---

## 0. FONTES DE VERDADE E ORDEM DE AUTORIDADE

Leia integralmente antes de implementar:

1. `references/Passaporte_Serra_Negra_Documentacao_Mestra_v4_2026-09-09.md`
2. `docs/VALIDATION_SCOPE.md`
3. `docs/ADMIN_VALIDATION_RULES.md`
4. `docs/NO_BRAND_DECISIONS.md`
5. `docs/REPO_BLUEPRINT.md`
6. `docs/MISSING_REFERENCE_ASSETS.md`
7. `acceptance/PLAYWRIGHT_MATRIX.md`
8. `acceptance/DEFINITION_OF_DONE.md`
9. `references/icon-system-v2/README.md`
10. `references/icon-system-v2/docs/ICON_SYSTEM.md`
11. `seed/validation-content.json`
12. `seed/validation-trip.json`

Em caso de conflito:

- as instruções deste comando têm prioridade para esta build de validação;
- a documentação mestre é a fonte de verdade de produto;
- os arquivos de escopo limitam o que deve ser implementado agora;
- o Icon System v2 é a fonte oficial de ícones;
- o seed é somente conteúdo sintético de teste, nunca fonte de verdade turística.

Não use conhecimento externo para preencher lacunas de produto sem registrar explicitamente a decisão. Não pesquise pontos reais nesta etapa. Não substitua dados fictícios por estabelecimentos reais.

---

# 1. RESULTADO ESPERADO

Criar um repositório chamado preferencialmente:

`passaporte-serra-negra-validation`

Se houver acesso GitHub autenticado:

- criar repositório privado por padrão, para evitar publicação acidental de dados sintéticos;
- inicializar `main`;
- fazer commits por bloco;
- fazer push do estado validado.

Se não houver acesso GitHub:

- criar o repositório Git local completo;
- entregar o diretório pronto para push;
- não bloquear a execução por falta de integração externa.

O repositório deve rodar localmente, possuir README, migrations, seed, testes, Playwright e CI.

---

# 2. FILOSOFIA DE CONSTRUÇÃO

Construir por blocos pequenos e verificáveis.

Fluxo obrigatório de cada bloco:

```text
LER REQUISITOS
↓
IMPLEMENTAR
↓
LINT
↓
TYPECHECK
↓
TESTES
↓
SUBIR APLICAÇÃO
↓
PLAYWRIGHT
↓
CAPTURAR SCREENSHOTS
↓
INSPECIONAR VISUALMENTE
↓
CORRIGIR
↓
REEXECUTAR
↓
COMMIT
```

Não acumular dez telas antes de testar.

Não considerar um bloco concluído apenas porque compila.

---

# 3. STACK DE VALIDAÇÃO

Manter a arquitetura já definida:

- monólito modular;
- Next.js App Router;
- TypeScript `strict`;
- Node LTS compatível;
- PostgreSQL + PostGIS;
- Drizzle + migrations;
- React;
- providers abstraídos;
- CSS baseado em tokens semânticos;
- Playwright.

Fixar versões estáveis e compatíveis no lockfile no momento da execução. Não usar `latest` flutuante no CI.

## Banco local

Fornecer `docker-compose.yml` para PostgreSQL/PostGIS.

Criar migration inicial mínima para a validação. O schema desta build é **v0 de validação**, não deve ser tratado como Data Model definitivo. Evitar decisões irreversíveis e campos especulativos.

Seeds devem ser idempotentes por IDs/slugs/upsert.

---

# 4. MODO DE DEMONSTRAÇÃO

A aplicação deve iniciar localmente sem exigir credenciais externas.

Criar adapters:

```text
AuthProvider
MapsProvider
RoutesProvider
WeatherProvider
StorageProvider
AnalyticsProvider
```

Por padrão em desenvolvimento:

```text
AUTH_MODE=mock
MAPS_MODE=mock
ROUTES_MODE=mock
WEATHER_MODE=mock
ANALYTICS_MODE=local
```

O modo mock deve ser determinístico e claramente marcado como demonstração.

Exibir discretamente, mas de forma inequívoca, um indicador como:

`Modo de validação — conteúdo fictício`

Nunca permitir que os dados sintéticos pareçam dados reais de Serra Negra.

Preparar os adapters para substituição futura, sem implementar integrações externas que exijam credenciais agora.

---

# 5. IDENTIDADE VISUAL NESTA FASE

NÃO definir:

- fonte final;
- paleta final;
- cor primária final;
- logo final;
- símbolo final;
- linguagem fotográfica final;
- capa final do Passaporte.

Usar:

- system font stack temporária;
- tokens semânticos;
- valores neutros temporários marcados `VALIDATION_ONLY`;
- layouts limpos e funcionais;
- contraste suficiente;
- responsividade real.

Não espalhar valores de cor hardcoded nos componentes.

Light, Dark e System devem funcionar tecnicamente por tokens, mas não interpretar isso como definição de identidade.

---

# 6. ÍCONES

Usar obrigatoriamente o conteúdo de:

`references/icon-system-v2/`

Integrar o componente `<Icon />`, registry, aliases e assets canônicos.

Não substituir os ícones existentes por Lucide, Heroicons, emoji ou outra biblioteca quando o símbolo já existir no Icon System v2.

Não usar emojis como ícones de interface.

Preservar `currentColor`, acessibilidade e aliases.

---

# 7. IMAGENS E ASSETS AUSENTES

Não pesquisar fotografias reais nesta etapa.

Criar placeholders genéricos locais em proporções úteis:

- hero 16:9;
- card 4:3;
- galeria 3:2;
- avatar/logo de parceiro 1:1 quando necessário.

Os placeholders devem ser semanticamente neutros e identificados como placeholder.

Referências `RV-XX` não estão disponíveis. Não tentar reconstruí-las por imaginação.

A documentação diz que o sistema visual de carimbos já foi desenvolvido, mas o motor oficial não está neste pacote. Portanto:

- NÃO redesenhar o carimbo;
- criar uma interface/componente `StampRenderer` substituível;
- durante a validação usar um placeholder explícito de carimbo demo;
- manter dados de lugar/data/visita separados do desenho do carimbo.

Para o mapa vetorial territorial definitivo, usar placeholder funcional. Não inventar contorno geográfico final.

---

# 8. DADOS DE VALIDAÇÃO

Importar os arquivos:

- `seed/validation-content.json`
- `seed/validation-trip.json`

Todos os dados são sintéticos.

Criar e relacionar:

- categorias;
- pontos turísticos fictícios;
- parceiros fictícios;
- experiências fictícias;
- eventos fictícios;
- fontes sintéticas;
- uma viagem demo;
- visitas demo;
- clima demo.

Não trocar esses nomes por estabelecimentos reais.

Adicionar flag/campo apropriado como `is_demo` / `synthetic` onde necessário.

---

# 9. BLOCO 0 — BOOTSTRAP

Criar:

- aplicação Next.js;
- TypeScript strict;
- estrutura modular;
- banco Docker;
- Drizzle;
- migrations;
- seed;
- design tokens temporários;
- Icon System v2;
- providers mock;
- layout global;
- header/footer base;
- `DEMO MODE`;
- lint;
- typecheck;
- testes;
- Playwright;
- GitHub Actions.

Antes de continuar, validar uma rota simples `/health` ou equivalente e uma Home mínima.

Executar Playwright desktop/mobile e corrigir qualquer problema estrutural.

Commit sugerido:

`chore: bootstrap validation architecture`

---

# 10. BLOCO 1 — HOME + EXPLORAR

Implementar somente o necessário da documentação mestre para validar a arquitetura.

## Home

Representar:

- Header;
- Hero placeholder;
- Conheça Serra Negra;
- loop/área de parceiros fictícios;
- chamada para roteiro;
- tipos/cards de roteiro;
- seção editorial simples;
- categorias;
- introdução ao Passaporte;
- contexto territorial placeholder;
- CTA final;
- Footer.

Não tentar finalizar design.

## Explorar

Implementar:

- busca;
- categorias rápidas;
- filtros progressivos;
- clima demo;
- eventos demo;
- cards derivados do banco;
- lista/mapa compartilhando estado de filtros;
- mapa mock substituível.

Sem rankings pagos, “melhor” ou “mais popular” fictícios.

### Playwright

Testar busca, filtros, navegação, desktop/tablet/mobile, keyboard e screenshots.

Commit:

`feat: add public discovery validation slice`

---

# 11. BLOCO 2 — LUGAR + PARCEIRO

## Lugar

Implementar `/lugares/[slug]` com os principais blocos definidos na documentação:

- hero placeholder;
- tipo/nome/descrição;
- adicionar ao roteiro;
- informações rápidas;
- conteúdo editorial;
- experiências;
- planejamento;
- clima mock;
- galeria placeholder;
- localização/mapa mock;
- eventos;
- estado do Passaporte;
- 3 ou 4 sugestões próximas.

## Parceiro

Implementar `/parceiros/[slug]` como template distinto, simples e comercial:

- identidade do negócio;
- descrição;
- informações práticas;
- experiências;
- contatos externos demo;
- tempo de resposta declarado;
- localização;
- estado de visita/Passaporte.

Links `example.invalid` não devem ser abertos como se fossem reais. Interceptar ou marcar como demonstração.

### Playwright

Validar navegação, layout, estados e ausência de confusão entre ponto turístico e parceiro.

Commit:

`feat: add place and partner validation pages`

---

# 12. BLOCO 3 — ADMIN OPERACIONAL

Este é um dos objetivos centrais da validação.

Criar Admin funcional para:

- lugares;
- experiências;
- parceiros;
- eventos;
- categorias;
- fontes.

O Admin deve permitir operações recorrentes sem banco/código.

Fluxo:

```text
lista
↓
editar/criar
↓
salvar rascunho
↓
preview
↓
publicar
↓
histórico
```

Implementar estados:

- draft;
- published;
- archived;
- needs_review quando aplicável.

Preview deve reutilizar componentes públicos quando fizer sentido.

Criar auditoria mínima.

### Teste crítico Playwright

Executar integralmente o fluxo descrito em `acceptance/PLAYWRIGHT_MATRIX.md`:

`Admin edita Café Neblina Alta → rascunho não altera público → preview mostra rascunho → publicar → público atualiza → histórico registra`.

Corrigir até passar.

Commit:

`feat: add admin operational cms validation`

---

# 13. BLOCO 4 — ONBOARDING + ROTEIRO DEMO

Não implementar Travel Engine definitivo.

Criar `DemoTravelEngine` determinístico, isolado atrás de interface adequada.

Fluxo `/roteiro`:

1. quando;
2. com quem;
3. interesses;
4. intenção;
5. ritmo;
6. transporte;
7. necessidades;
8. revisão;
9. gerar rota demo.

Persistência pessoal pode usar usuário mock.

Gerar/usar `demo-trip-001`.

Página do roteiro:

- dias;
- clima demo;
- eventos;
- timeline;
- paradas;
- deslocamentos mock;
- tempo livre;
- mapa mock;
- edição local;
- mover;
- remover;
- trocar;
- adicionar;
- preservar itens `fixed`/alterados.

Não reconstruir silenciosamente todo o roteiro após uma mudança local.

Commit:

`feat: add deterministic demo itinerary flow`

---

# 14. BLOCO 5 — CALENDÁRIO

Implementar `/viagens/demo-trip-001/calendario` reutilizando os mesmos dados do roteiro.

Modos:

- Dia;
- Semana;
- Mês.

Mobile deve favorecer agenda diária e semana simplificada. Não comprimir uma grade desktop.

Estados sem depender somente de cor:

- planejado;
- presença registrada;
- movido;
- removido;
- sem evidência registrada.

Não interpretar ausência de evidência como ausência de visita.

Commit:

`feat: add trip calendar validation`

---

# 15. BLOCO 6 — PASSAPORTE DEMO

Implementar `/meu-passaporte` como validação estrutural do objeto físico digital.

Desktop:

- duas páginas quando houver espaço adequado.

Mobile:

- uma página por vez;
- botões acessíveis;
- swipe opcional, nunca único mecanismo.

Representar:

- capa placeholder;
- identificação demo;
- ticket demo;
- páginas de carimbos usando `StampRenderer` placeholder;
- descobertas/reencontros;
- categorias;
- caminho vivido mock;
- arquivo de viagens demo;
- resumo.

Não usar:

- XP;
- streak;
- ranking;
- percentual de cidade concluída;
- recompensa obrigatória.

O Passaporte deve diferenciar claramente:

`planejado` de `registrado`.

Commit:

`feat: add passport structural validation`

---

# 16. PLAYWRIGHT COMO MOTOR DE CORREÇÃO

Playwright não é apenas teste final.

Após CADA bloco:

1. subir servidor;
2. executar testes;
3. capturar screenshots nos viewports definidos;
4. abrir e inspecionar as screenshots;
5. verificar console/browser errors;
6. detectar overflow, desalinhamento, corte, hierarquia ruim, elementos inalcançáveis e estados quebrados;
7. corrigir o código;
8. repetir até estabilizar.

Adicionar testes para regressões encontradas durante a própria execução.

Se um bug visual for encontrado manualmente em screenshot, criar uma asserção ou teste reproduzível quando possível.

Usar `prefers-reduced-motion` em pelo menos um projeto Playwright.

Preferir locators por role/label/test-id sem depender de classes CSS frágeis.

---

# 17. ACESSIBILIDADE

Durante a validação:

- HTML semântico;
- headings coerentes;
- foco visível;
- teclado;
- skip link;
- nome acessível de botões;
- ícones decorativos `aria-hidden`;
- ícones significativos com label textual/aria apropriado;
- contraste suficiente nos tokens temporários;
- `prefers-reduced-motion`;
- modais/drawers com foco controlado.

Se utilizar `@axe-core/playwright`, não tratar automaticamente toda advertência como verdade absoluta: revisar e corrigir violações reais.

---

# 18. TRACKING DE VALIDAÇÃO

Não construir analytics avançado.

Criar um adapter local capaz de registrar pelo menos:

- `PAGE_VIEWED`
- `PLACE_VIEWED`
- `SEARCH_PERFORMED`
- `FILTER_APPLIED`
- `PARTNER_CARD_CLICK`
- `ROUTE_STARTED`
- `TRIP_CREATED`
- `PLACE_ADDED`
- `PLACE_REMOVED`
- `PLACE_SWAPPED`
- `VISIT_CONFIRMED`
- `PASSPORT_SHARED` se houver ação de compartilhamento demo.

Registrar payload mínimo e inspecionável no Admin/dev tools apropriado, sem definir ainda o contrato definitivo de analytics.

---

# 19. GITHUB / CI

Criar workflow que execute ao menos:

- install locked;
- lint;
- typecheck;
- unit/integration tests;
- build.

Se viável no ambiente de CI, executar uma suíte Playwright smoke com Postgres/PostGIS de serviço ou Docker.

Não armazenar secrets no repositório.

Criar `.env.example` documentado.

---

# 20. DOCUMENTAÇÃO DO REPOSITÓRIO

README deve explicar:

- objetivo de validação;
- dados fictícios;
- como instalar;
- como subir banco;
- como migrar/seed;
- como rodar app;
- como rodar Playwright;
- arquitetura;
- modo mock;
- limitações;
- o que NÃO está finalizado;
- próximos blocos.

Criar também:

`docs/VALIDATION_ARCHITECTURE.md`

`docs/decisions/ADR-001-modular-monolith.md`

`docs/decisions/ADR-002-admin-operational-control-plane.md`

`docs/decisions/ADR-003-validation-providers.md`

`VALIDATION_REPORT.md`

---

# 21. VALIDATION_REPORT.MD

Ao final, registrar:

## Implementado

O que efetivamente existe e funciona.

## Playwright

- rotas testadas;
- viewports;
- quantidade de testes;
- screenshots geradas.

## Bugs encontrados durante a construção

Para cada bug relevante:

- sintoma;
- causa;
- correção;
- teste/regressão criado.

## Pendências reais

Separar:

- propositalmente fora do escopo;
- depende de decisão futura;
- depende de asset ausente;
- depende de credencial/provider;
- dívida técnica real.

## Não assumir

Não declarar algo como validado se não foi executado/testado.

---

# 22. GATES

## G0 — fontes lidas

Não codificar antes de revisar todas as fontes indicadas.

## G1 — bootstrap passa

Lint/typecheck/build + Playwright smoke.

## G2 — descoberta passa

Home/Explorar estáveis em três viewports.

## G3 — páginas de entidades passam

Lugar/Parceiro sem mistura conceitual.

## G4 — Admin passa

CRUD + draft/preview/publish + histórico testados.

## G5 — roteiro passa

Onboarding + edição local funcional.

## G6 — calendário passa

Dados compartilhados com roteiro e mobile adequado.

## G7 — Passaporte passa

Objeto responsivo e planejado/registrado corretos.

## G8 — regressão final

Executar suite completa, revisar screenshots e produzir relatório.

Não avançar silenciosamente se um gate falhar. Corrigir o que estiver dentro do escopo; se depender de decisão ausente, registrar a pendência de modo explícito e implementar fallback neutro apenas quando seguro.

---

# 23. REGRAS DE NÃO INVENÇÃO

Não inventar:

- parceiros reais;
- métricas reais;
- avaliações reais;
- popularidade;
- dados turísticos atuais;
- identidade final;
- regras definitivas de Travel Engine;
- regras definitivas de QR;
- conclusão jurídica de LGPD;
- traduções editoriais supostamente revisadas;
- carimbo oficial ausente;
- mapa territorial oficial ausente.

Qualquer dado demo deve ser identificado como sintético.

---

# 24. ENTREGA

Entregar:

1. repositório completo;
2. URL GitHub se a conexão permitir;
3. zip do repositório como fallback;
4. `VALIDATION_REPORT.md`;
5. screenshots Playwright organizadas por viewport/bloco;
6. status dos gates G0–G8;
7. lista objetiva do próximo bloco recomendado.

A entrega principal é software executável e validado, não apenas documentação ou mockups.
