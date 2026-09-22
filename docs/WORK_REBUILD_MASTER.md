# PASSAPORTE SERRA NEGRA — WORK REBUILD MASTER

**Versão:** 2026-09-12 — V2  
**Status:** fonte de verdade operacional para a próxima reconstrução no Work  
**Uso:** executar junto com o pacote `passaporte_serra_negra_work_rebuild_2026-09-12.zip`  
**Escopo:** recriar o Passaporte Serra Negra como produto canônico em Next.js, consolidando a arquitetura do Work original com a experiência visual/interativa aprovada posteriormente.

---

# 0. COMANDO PRINCIPAL

Recrie o projeto **Passaporte Serra Negra** em uma implementação única, coerente e mais finalizada.

Não faça apenas um patch incremental no protótipo atual. Use a arquitetura validada do Work como fundação técnica, use a aplicação estática atual como **referência visual/comportamental**, use os ativos e dados deste pacote como insumos, e produza um único runtime de produto em **Next.js**.

O resultado deve preservar as decisões já aprovadas e eliminar as duplicidades e contradições acumuladas entre:

- o Work original;
- a aplicação estática;
- a aplicação Next.js;
- documentos de fases anteriores;
- implementações visuais posteriores.

O objetivo desta rodada não é redesenhar o produto. O objetivo é **convergir produto, UX, arquitetura, dados e regras em uma base única pronta para continuar evoluindo**.

## Regra de execução

1. leia este documento inteiro antes de alterar código;
2. trate este arquivo como a fonte de verdade mais recente;
3. use os demais arquivos do pacote como referência, não como autoridade superior;
4. preserve decisões aprovadas mesmo quando o código antigo estiver diferente;
5. não carregue bugs ou conflitos apenas para manter compatibilidade histórica;
6. não mantenha dois runtimes de produção;
7. não invente dados reais;
8. não declare conformidade jurídica definitiva sem revisão especializada;
9. não introduza dependência paga como requisito do MVP;
10. se alguma skill/ferramenta externa adicional for indispensável e não estiver disponível, solicite **somente opção gratuita ou open source**. Não solicitar instalação de skill paga.

---

# 1. HIERARQUIA DE AUTORIDADE

Em caso de conflito, obedecer nesta ordem:

1. `WORK_REBUILD_MASTER_2026-09-12.md`;
2. decisões visuais e funcionais já incorporadas nos arquivos atuais de referência;
3. documentação mestra v4 e guia de construção visual;
4. implementação estática, somente como referência de aparência, composição e interação;
5. implementação Next atual, como baseline técnico reutilizável;
6. Work/LATEST original, apenas como histórico de validação arquitetural.

Documentos antigos que afirmem que determinada decisão visual ainda não foi tomada deixam de ser autoridade quando este documento já define a decisão.

---

# 2. OBJETIVO DO PRODUTO

O **Passaporte Serra Negra** é uma plataforma turística para Serra Negra, SP, que conecta:

```text
DESCOBERTA
↓
INTENÇÃO
↓
PLANEJAMENTO
↓
EXPERIÊNCIA FÍSICA
↓
MEMÓRIA
↓
INTELIGÊNCIA
```

O produto combina:

- descoberta de lugares, experiências e eventos;
- criação de roteiro contextual;
- calendário da viagem;
- registro de presença por QR e outras evidências;
- Passaporte digital com materialidade física;
- compartilhamento social;
- área do parceiro;
- Admin como centro operacional e de inteligência;
- tracking anônimo e autenticado com privacidade;
- aprendizado progressivo sobre circulação, interesse e oportunidades.

A promessa pública pode trabalhar em torno de:

> **Descubra Serra Negra do seu jeito.**

O produto não deve parecer um portal municipal, marketplace genérico, catálogo de anúncios ou programa tradicional de fidelidade.

---

# 3. ESCOPO E FRONTEIRAS

## 3.1. Superfícies do MVP

Existem três frentes independentes:

### Turista

Pode explorar sem login e autentica somente quando há persistência pessoal.

### Parceiro

Possui área própria, limitada ao próprio negócio e às próprias métricas.

### Admin

Possui área interna para conteúdo, operação, solicitações, QR, fontes, analytics e maturação.

## 3.2. Fora do MVP atual

O **Concierge Digital White Label** é um produto futuro separado.

Não implementar agora:

- QR do Concierge;
- hotel fixo obrigatório no roteiro do Passaporte;
- PMS;
- tenancy específica de hotéis;
- analytics White Label;
- branding de hotel sobre o Passaporte;
- preços públicos do White Label;
- reserva interna;
- pagamento interno;
- programa de recompensas;
- marketplace financeiro;
- condições especiais do Passaporte.

A arquitetura pode deixar pontos de extensão, mas não deve aumentar a complexidade atual para antecipar o White Label.

## 3.3. Geografia

No MVP público, somente:

```text
Serra Negra, SP, Brasil
```

O modelo deve possuir `city_id`, mas não publicar outras cidades ainda.

---

# 4. DECISÃO ARQUITETURAL PRINCIPAL

## 4.1. Um único runtime

A aplicação final deve possuir **um runtime canônico em Next.js**.

A implementação estática antiga:

```text
index.html
app.js
data.js
theme.css
static-interactions.*
partners-page.*
```

serve como referência durante a migração, mas **não deve permanecer como segunda aplicação concorrente**.

Após a convergência:

- rotas públicas são servidas pelo Next.js;
- dados públicos são consumidos do mesmo repositório/camada de domínio;
- não existe duplicação de conteúdo entre `tourism-data.js` e seed/banco;
- não existe teste que exija manter a SPA estática como entrada de produção;
- referências estáticas podem permanecer apenas em `docs/reference` ou equivalente.

## 4.2. Arquitetura recomendada

Manter um **monólito modular** inicialmente.

Camadas sugeridas:

```text
src/
  app/
  components/
  design-system/
  core/
    auth/
    db/
    i18n/
    routing/
    analytics/
  modules/
    content/
    places/
    experiences/
    partners/
    trips/
    passport/
    qr/
    events/
    weather/
    tracking/
    admin/
    partner-portal/
    sharing/
  providers/
```

Separar claramente:

- domínio;
- persistência;
- UI;
- autorização;
- tracking;
- renderização editorial.

Não criar microserviços no MVP.

---

# 5. STACK TÉCNICA

A baseline atual pode ser reutilizada:

- Next.js 16+;
- React 19+;
- TypeScript;
- Zod;
- Drizzle ORM;
- PostgreSQL em ambiente de produção;
- PostGIS quando necessário para consultas territoriais;
- PGlite somente como fallback/local demo;
- Playwright;
- ESLint;
- Node 22+.

## 5.1. Autenticação

Implementar autenticação real antes de declarar a área logada concluída.

Pode usar Clerk quando adequado e disponível em plano gratuito, ou alternativa gratuita/open source equivalente.

Papéis mínimos:

```text
tourist
partner
admin
```

Futuros:

```text
editor
moderator
```

Regra obrigatória:

> frontend controla o que o usuário vê; backend controla o que o usuário pode fazer.

Nunca confiar em role enviada pelo navegador.

---

# 6. ROTAS CANÔNICAS

A estrutura final deve ser previsível e baseada em URLs reais do Next.js.

## 6.1. Público

```text
/
 /explorar
 /mapa
 /pontos-turisticos
 /lugares/[slug]
 /parceiros
 /parceiros/[slug]
 /roteiro
 /meu-passaporte
 /termos
 /privacidade
 /cookies
 /acessibilidade
```

`/parceiros` é a landing institucional de aquisição B2B.

`/para-parceiros` pode existir apenas como redirect permanente para `/parceiros`.

## 6.2. Viagens autenticadas

```text
/viagens/[tripId]/roteiro
/viagens/[tripId]/calendario
```

## 6.3. QR

```text
/q/[code]
```

O QR deve abrir contexto do local antes de exigir login.

## 6.4. Área do parceiro

Preferir namespace que não conflite com páginas públicas:

```text
/painel-parceiro
/painel-parceiro/minha-pagina
/painel-parceiro/solicitacoes
/painel-parceiro/analytics
```

## 6.5. Admin

```text
/admin
/admin/conteudo
/admin/lugares
/admin/parceiros
/admin/eventos
/admin/qr
/admin/solicitacoes
/admin/fontes
/admin/analytics
/admin/maturacao
/admin/auditoria
```

Rotas podem ser refinadas, mas responsabilidades não devem ser misturadas.

---

# 7. MODELO CONCEITUAL

## 7.1. Lugar

`Place` representa ponto físico ou estabelecimento.

Pode ser:

- ponto turístico;
- negócio listado;
- parceiro;
- outro local relevante.

Não confundir natureza do local com relação comercial.

Exemplo:

```text
place_type
commercial_relation
```

`commercial_relation` pode usar:

```text
public_point
listed_business
partner
```

Nunca apresentar negócio pesquisado como parceiro sem confirmação.

## 7.2. Experiência

Lugar responde:

> onde vou?

Experiência responde:

> o que vou fazer?

`Experience` deve ser entidade própria e pode pertencer a lugar, parceiro ou evento.

Campos conceituais:

```text
place_id
title
description
cost_type
booking_type
duration
environment
weather_profile
accessibility
```

Tipos de custo:

```text
free
paid
free_with_booking
paid_with_booking
mixed
unknown
```

---

# 8. MODELO DE DADOS ALVO

O schema de validação antigo com quatro tabelas JSONB não deve ser tratado como modelo definitivo.

Criar migrations idempotentes e uma modelagem relacional suficiente para o MVP.

Entidades mínimas:

```text
City
Place
PlaceCategory
PlaceCategoryLink
Experience
Partner
PartnerUser
TravelerUser
AnonymousVisitor
Session
Trip
TripDay
TripItem
Visit
QrCode
Review
Event
WeatherSnapshot
Source
SectionDefinition
PageSection
ContentVersion
PartnerRequest
TrackingEvent
PartnerMaturityHistory
Alert
ConsentRecord
SharedArtifact
```

## 8.1. Campos essenciais de conteúdo

Conteúdo pesquisado deve manter proveniência:

```text
source_url
source_name
source_type
verified_at
verification_status
notes
```

Status recomendados:

```text
official_source
verified
secondary_source
conflicting
needs_review
```

## 8.2. Estado editorial

Para entidades publicáveis:

```text
draft
published
archived
needs_review
```

Salvar rascunho e publicar são ações distintas.

Restaurar versão antiga cria nova versão. Não apagar histórico.

## 8.3. Regra de campo vazio

Se não existir informação:

- campo continua no schema;
- elemento não aparece publicamente;
- layout fecha o espaço;
- não inventar placeholder factual.

---

# 9. SEEDS E DADOS REAIS

O seed final deve incorporar os dados reais já pesquisados em `tourism-data.js` e `TOURISM_RESEARCH.md`.

Atrativos atualmente documentados incluem:

- Fontana di Trevi em Serra Negra;
- Mirante do Alto da Serra;
- Mirante do Cristo Redentor;
- Parque Ecológico Adib João Dib;
- Parque Ecológico Dr. Jovino Silveira;
- Teleférico Serra Negra;
- Igreja Matriz Nossa Senhora do Rosário;
- Parque Fonte Santo Agostinho;
- Parque das Fontes;
- Praça das Rotas Turísticas;
- Feira de Artesanato de Serra Negra;
- Parque Aquático Municipal.

Regras:

- migrar esses registros para a camada dinâmica;
- preservar fonte e licença;
- manter `verified_at`;
- marcar informação sujeita a mudança;
- não carregar os três lugares sintéticos antigos para descoberta pública;
- parceiros fictícios podem permanecer somente como dados de demonstração claramente marcados `synthetic=true`.

Seeds devem ser idempotentes por slug/chave/upsert.

---

# 10. HOME PÚBLICA

A Home é editorial, turística, responsiva e visualmente premium.

Ordem consolidada:

1. Header global;
2. Hero;
3. Conheça Serra Negra / descoberta;
4. Encontros pelo caminho;
5. chamada visual do roteiro;
6. tipos de roteiro;
7. cards de roteiro;
8. seções editoriais/contextuais;
9. Explore por interesse / categorias;
10. Perguntas frequentes;
11. introdução ao Passaporte;
12. mapa/contexto territorial;
13. CTA final;
14. Footer.

## 10.1. Hero

Preservar a direção atual:

- imagem hero de Serra Negra;
- tipografia de display;
- título com comportamento inspirado em **Warp Text**;
- movimento discreto;
- sem prejudicar legibilidade;
- desativar ou simplificar no mobile e em `prefers-reduced-motion`.

Não transformar a Home em showcase de efeitos.

## 10.2. Descoberta contextual

Textos e botão centralizados.

A composição deve ter bastante respiro, sem perder densidade editorial.

## 10.3. Encontros pelo caminho

Usar carrossel circular/editorial inspirado no comportamento do **Circular Gallery**, adaptado para turismo.

Regras finais:

- card central é dominante;
- cards laterais possuem escala menor e blur progressivo;
- somente o card central recebe o hover completo;
- hover do card central tem movimento e escala mais fortes;
- quando o central cresce, os laterais ganham afastamento adicional para não sobrepor;
- cards laterais nunca devem sobrepor o central;
- clicar em card lateral primeiro o centraliza;
- card central abre página do parceiro;
- setas, arraste, trackpad/roda e teclado podem coexistir;
- sem autoplay;
- gradiente inferior de opacidade deve ser gradual;
- padding inferior termina logo abaixo da indicação `ARRASTE · ROLE · USE AS SETAS`;
- interação deve ser fluida sem rerender completo da página;
- manter shared element transition quando entrar na página do parceiro.

## 10.4. Explore por interesse

- textos e CTA centralizados;
- cards sobem discretamente e ganham escala no hover;
- usar `transform` e `opacity`;
- não provocar reflow.

## 10.5. FAQ

Accordion com abertura e fechamento orgânicos:

- altura/clip/opacity combinados quando necessário;
- easing premium;
- ARIA correto;
- teclado;
- sem salto brusco de layout.

## 10.6. Mapa demonstrativo

Pins:

- apenas leve escala;
- pequena troca de cor;
- sem deslocamento agressivo;
- posição do pin nunca pode ser sobrescrita pelo transform do hover.

## 10.7. CTA final

O heading principal deve quebrar em no máximo duas linhas no layout previsto.

---

# 11. HEADER E NAVEGAÇÃO

## 11.1. Desktop

Comportamento inspirado no **Dock**:

- navegação compacta;
- escala por proximidade moderada;
- preservação de legibilidade;
- header integrado ao hero no topo;
- após scroll, usar superfície translúcida/glass discreta;
- não aumentar excessivamente o layout ao passar o mouse;
- foco de teclado equivalente ao hover.

## 11.2. Mobile

Menu inspirado no **Card Nav**:

- abrir em painel/card organizado;
- manter navegação clara;
- Escape fecha;
- focus trap quando modal;
- impedir scroll do body enquanto aberto;
- touch targets adequados.

Não depender das bibliotecas como requisito. Recriar o comportamento em React/CSS se isso simplificar o projeto. Se usar pacote externo, deve ser gratuito/open source e compatível.

---

# 12. EXPLORAR

A rota `/explorar` deve combinar:

- busca;
- filtros;
- categorias;
- lugares reais;
- parceiros quando confirmados;
- experiências;
- mapa;
- lista;
- preview contextual.

Princípios:

- mapa e lista usam o mesmo dataset;
- seleção de item sincroniza com mapa;
- shared transition pode ligar card e página de detalhe;
- informação inexistente não aparece;
- filtros devem estar na URL quando fizer sentido;
- não usar ranking pago para recomendação pública;
- publicidade/comercial não pode se passar por relevância editorial.

---

# 13. MAPA

O produto deve conseguir mostrar lugares territorialmente sem exigir rastreamento contínuo do turista.

Para o MVP:

- preferir solução de mapa sem dependência paga obrigatória;
- Google Maps pode continuar como link externo de direções;
- mapa de exploração pode usar MapLibre/OpenStreetMap ou implementação equivalente;
- geolocalização do usuário somente com permissão;
- não guardar trilha GPS contínua por padrão.

O mapa vetorial estilizado do Passaporte é um ativo diferente do mapa funcional de navegação.

---

# 14. PÁGINA DE LUGAR / PONTO TURÍSTICO

Estrutura esperada:

- hero/fotografia do local;
- nome;
- categoria;
- descrição curta;
- descrição editorial;
- localização;
- horário;
- duração sugerida quando editorialmente estimada;
- custo;
- acessibilidade/restrições quando existirem;
- informações práticas;
- fotos;
- ações externas;
- experiências associadas;
- recomendações próximas;
- adicionar ao roteiro;
- contexto de clima quando relevante;
- fontes quando apropriado no Admin, não necessariamente expostas de forma pesada ao turista.

A fotografia representa o lugar, não uma campanha publicitária.

---

# 15. PÁGINA PÚBLICA DO PARCEIRO

No MVP, a página pública do parceiro é simples e útil.

Mostrar:

- identidade do negócio;
- descrição;
- informações práticas;
- serviços;
- experiências;
- contato;
- WhatsApp;
- telefone;
- Instagram;
- site;
- reserva externa;
- localização;
- tempo de resposta declarado;
- relação com Passaporte/visita quando aplicável;
- carimbo do estabelecimento quando o sistema estiver integrado.

Não implementar:

- reserva interna;
- pagamento interno;
- chat interno;
- condição especial do Passaporte nesta fase.

Links externos:

- desktop: abrir nova guia;
- mobile: deep link quando apropriado;
- registrar analytics;
- nunca destruir o estado atual do Passaporte.

Tempo de resposta é **declarado**, não medido automaticamente no MVP.

---

# 16. LANDING `/PARCEIROS`

Preservar a direção visual da reconstrução B2B existente.

A landing explica:

- o que é a rede;
- como o parceiro aparece;
- como o turista descobre;
- como o roteiro pode gerar intenção;
- como visitas podem gerar evidência;
- quais dados o parceiro pode acompanhar;
- como a maturação acontece;
- como entrar em contato.

Não inventar:

- preços;
- cases;
- depoimentos;
- empresas reais não confirmadas;
- SLA;
- métricas prometidas.

A comunicação deve ser comercialmente clara sem prometer causalidade ou vendas garantidas.

---

# 17. ÁREA DO PARCEIRO

O parceiro possui login próprio e nunca entra no Admin.

## 17.1. Minha Página

Pode:

- visualizar página pública;
- editar dados permitidos;
- atualizar links;
- revisar horários;
- atualizar imagens;
- informar tempo de resposta;
- visualizar experiências existentes;
- abrir solicitações;
- acompanhar solicitações;
- consultar histórico simples.

## 17.2. Alteração direta

Permitir somente campos explicitamente classificados como editáveis.

## 17.3. Solicitação obrigatória

Exigir solicitação para:

- nova informação estrutural;
- remoção estrutural;
- categoria;
- identidade principal;
- criação de experiência;
- nova seção;
- mudança de estrutura global.

UI deve distinguir claramente:

```text
EDITÁVEL
REQUER SOLICITAÇÃO
```

Não depender apenas de cor.

## 17.4. Segurança

Backend valida:

- role;
- ownership;
- permission;
- campo;
- estado.

Parceiro não pode:

- editar concorrente;
- alterar cidade;
- criar/alterar QR;
- editar tracking;
- alterar métricas;
- alterar score;
- acessar Admin;
- alterar Section Registry global;
- aprovar própria solicitação.

---

# 18. DASHBOARD DO PARCEIRO

Mostrar somente inteligência do próprio negócio.

Pode incluir:

- visualizações;
- cliques externos;
- adições ao roteiro;
- presenças registradas;
- retornos;
- origens de descoberta;
- afinidades agregadas;
- evolução temporal;
- inclusões em roteiro versus presenças registradas;
- visitas registradas sem inclusão prévia.

Componentes adequados:

- Sankey simplificado;
- funil de evidência;
- série temporal;
- planned vs registered simplificado.

Não mostrar ranking competitivo público.

---

# 19. MONTAR MEU ROTEIRO

Rota:

```text
/roteiro
```

Onboarding:

1. quando;
2. com quem;
3. interesses;
4. o que quer viver;
5. ritmo;
6. transporte;
7. necessidades;
8. revisão;
9. login se necessário;
10. geração.

O perfil pertence à viagem, não deve virar diagnóstico permanente do usuário.

Interesses possíveis:

- natureza;
- gastronomia;
- cafés;
- cultura;
- compras;
- aventura;
- vinícolas;
- bem-estar;
- experiências sem custo;
- pontos turísticos;
- eventos.

Intenções:

- clássicos;
- lugares diferentes;
- comer bem;
- relaxar;
- paisagens;
- crianças;
- gastar menos;
- produtores locais.

Ritmo:

```text
lento
equilibrado
ativo
```

Transporte:

```text
carro
a_pe
taxi_app
nao_sei
```

Necessidades podem incluir:

- acessibilidade;
- criança pequena;
- preferir gratuitas;
- evitar outdoor;
- restrições alimentares.

Clima não é perguntado; é dado contextual.

---

# 20. TRAVEL ENGINE

O MVP pode ser determinístico e explicável.

Pipeline recomendado:

```text
candidatos da cidade
↓
restrições duras
↓
compatibilidade de horário
↓
compatibilidade de clima
↓
acessibilidade/restrições
↓
score de interesse/intenção
↓
diversidade
↓
agrupamento geográfico
↓
montagem por dia
↓
explicação da recomendação
```

Considerar:

- datas;
- duração;
- companhia;
- crianças;
- interesses;
- intenção;
- ritmo;
- transporte;
- distância;
- funcionamento;
- clima;
- eventos;
- custo;
- diversidade;
- acessibilidade;
- disponibilidade real quando existir.

Não gerar lista aleatória.

Cada `TripItem` deve manter origem:

```text
recommended_by_engine
added_by_user
changed_by_user
fixed
```

Depois de uma edição local, não reconstruir silenciosamente todo o roteiro.

Preservar itens fixados e alterações manuais.

---

# 21. ROTEIRO GERADO

Rota:

```text
/viagens/[tripId]/roteiro
```

Estrutura:

- resumo da viagem;
- dias;
- clima;
- eventos relevantes;
- timeline;
- paradas;
- deslocamentos;
- tempo livre;
- mapa;
- resumo;
- edição;
- reorganização;
- compartilhamento.

Ações:

- adicionar;
- trocar;
- mover;
- remover;
- fixar;
- reorganizar.

Implementar drag and drop acessível ou alternativa por botões.

No mobile, não comprimir o desktop; usar fluxo vertical e bottom sheets quando necessário.

---

# 22. CALENDÁRIO

Rota:

```text
/viagens/[tripId]/calendario
```

Conceito:

```text
ROTEIRO = sequência e lógica
CALENDÁRIO = distribuição no tempo
PASSAPORTE = memória registrada
```

Modos:

- dia;
- semana;
- mês.

Mostrar:

- atividades planejadas;
- lugares;
- experiências;
- duração;
- deslocamentos;
- clima;
- eventos;
- intervalos livres;
- conflitos;
- sugestões;
- evidência de presença quando houver.

Estados:

- planejado;
- presença registrada;
- movido;
- removido;
- sem evidência registrada.

`sem evidência registrada` nunca significa automaticamente `não visitou`.

---

# 23. QR DO PASSAPORTE

O QR do MVP está associado a local/parceiro.

Serve para:

```text
descoberta
origem
presença
registro de visita
carimbo
retorno
continuidade da viagem
```

Não comprova:

- compra;
- reserva;
- consumo;
- gasto;
- transação.

Fluxo:

```text
scan
↓
resolver local
↓
mostrar contexto
↓
solicitar registro de visita
↓
login quando necessário
↓
retomar mesmo contexto
↓
validar
↓
criar Visit
↓
primeira visita ou retorno
↓
atualizar Passaporte
↓
mostrar carimbo
```

Prever:

- inválido;
- desativado;
- falha temporária;
- duplicidade recente;
- visita recentemente registrada;
- local indisponível.

Implementar deduplicação configurável. Não mostrar erro técnico cru.

---

# 24. MEU PASSAPORTE

O Passaporte é um **objeto digital com aparência física**, não dashboard decorado.

Direção:

> físico, elegante, contemporâneo, afetivo e colecionável.

## 24.1. Anatomia

```text
CAPA
IDENTIFICAÇÃO
VIAGEM ATUAL + TICKET
PÁGINAS DE CARIMBOS
DESCOBERTAS + REENCONTROS
CATEGORIAS
CAMINHO VIVIDO
LUGARES DE RETORNO
ARQUIVO DE VIAGENS
RESUMO
CONTRACAPA
```

Desktop:

- livro aberto com duas páginas.

Mobile:

- uma página por vez;
- swipe opcional;
- navegação por botões obrigatória.

## 24.2. Identificação

Não imitar documento oficial com dados civis desnecessários.

Pode mostrar:

- nome escolhido;
- número visual;
- ano;
- Serra Negra;
- idioma.

## 24.3. Ticket

Usar linguagem de bilhete físico, sem campos falsos de aviação.

Pode mostrar:

- viagem;
- destino;
- chegada;
- saída;
- duração;
- companhia;
- ritmo;
- lugares registrados;
- descobertas;
- reencontros.

## 24.4. Carimbos

O sistema visual do carimbo já está definido conceitualmente.

Carimbos:

- parecem aplicados;
- pequenas rotações;
- pequenas variações de posição;
- sobreposição controlada;
- legíveis;
- abrem detalhes;
- preservam identidade do mesmo local em retornos.

Na página pública do parceiro, o carimbo futuro deve conter:

- nome do negócio;
- ano;
- ícone da categoria/setor;
- linguagem vetorial coerente.

## 24.5. Categorias

Pode usar `X/X`, desde que o denominador venha de regra elegível controlada.

Não usar:

- XP;
- streak;
- ranking;
- barra de conclusão da cidade;
- gamificação agressiva.

## 24.6. Retorno / magical moment

O sistema deve modelar `visit_number` ou equivalente para reconhecer retorno.

Futuras experiências podem usar esse contexto para criar um momento especial com o parceiro.

Não implementar recompensa automática no MVP.

---

# 25. CAMINHO VIVIDO E MAPA VETORIAL

Separar:

```text
ROTEIRO = planejado
PASSAPORTE = registrado
```

O caminho vivido pode derivar de:

- QR validado;
- visitas registradas;
- ordem temporal;
- outras evidências explicitamente modeladas.

Não inferir GPS contínuo.

Criar ou reservar ativo para mapa vetorial real de Serra Negra com camadas:

```text
territory-outline
topography
route
visited-points
labels
decorative-details
```

Usos:

- páginas do Passaporte;
- ticket;
- compartilhamento;
- caminho vivido;
- abertura/contracapa;
- identidade territorial.

O arquivo geográfico final deve ter fonte e licença registradas.

---

# 26. COMPARTILHAMENTO

Cada dobra relevante do Passaporte deve poder ser compartilhada.

A exportação não é screenshot bruto do browser.

Gerar composição limpa removendo:

- header;
- menus;
- botões;
- setas;
- chrome técnico.

Preservar:

- papel;
- textura;
- carimbos;
- ticket;
- mapa;
- datas;
- branding discreto.

Formatos mínimos:

```text
1080x1920
1080x1350
1080x1080
```

A composição deve adaptar layout, não apenas cortar.

Também gerar:

- ticket compartilhável;
- resumo da viagem.

Privacidade:

- permitir ocultar nome/datas/lugares quando apropriado;
- nunca incluir localização atual;
- nunca incluir roteiro futuro automaticamente;
- nunca incluir dados de conta desnecessários.

Compartilhamento é também canal de aquisição orgânica, mas sem transformar o objeto em anúncio.

---

# 27. ADMIN

O Admin é mais que CMS.

Ele é:

```text
CMS
+
CONTROLE OPERACIONAL
+
INTELIGÊNCIA
+
MATURAÇÃO
```

Pode:

- criar/editar/publicar/arquivar páginas;
- revisar fontes;
- revisar solicitações;
- gerir lugares;
- gerir parceiros;
- gerir eventos;
- gerir QR;
- visualizar dados agregados;
- acessar dados individuais quando necessário e permitido;
- analisar comportamento;
- acompanhar circulação;
- analisar clima/eventos;
- acompanhar maturação;
- manter auditoria.

## 27.1. Editor

Estrutura:

```text
NAVEGAÇÃO
+
EDITOR
+
PREVIEW
```

Preview usa os mesmos componentes públicos reais.

Não manter renderer exclusivo do preview.

## 27.2. Section Registry

Toda seção reutilizável deve ser registrada.

Contrato conceitual:

```ts
type SectionDefinition = {
  id: string
  type: string
  version: number
  enabled: boolean
  order: number
  audience: string
  pageScopes: string[]
  variant?: string
  theme?: string
  content: Record<string, unknown>
  dataSource?: string
  visibility?: Record<string, unknown>
  layout?: Record<string, unknown>
  analytics?: Record<string, unknown>
}
```

Nova seção deve exigir:

1. componente;
2. schema;
3. registro;
4. dados;
5. responsividade;
6. estados;
7. analytics.

Uma variante de parceiro nunca sobrescreve a definição global.

---

# 28. MATURAÇÃO DE PARCEIROS

Usar 90 dias como referência operacional, não cronograma rígido.

Estágios possíveis:

```text
Entrada
Ativação
Primeiros dados
Engajamento
Consistência
Maturação
```

O parceiro pode avançar, permanecer ou regredir.

Maturidade do dado:

```text
DADO INICIAL
SINAL
PADRÃO
INSIGHT
OPORTUNIDADE
HIPÓTESE EM TESTE
APRENDIZADO VALIDADO
```

Não gerar score definitivo de saúde/oportunidade sem dados suficientes.

Alertas possíveis:

- sem visitas há 30 dias;
- QR sem uso;
- visitas altas com poucos cliques externos;
- crescimento forte;
- sem atualização há 90 dias;
- solicitação pendente;
- avaliações negativas em alta;
- muitas inclusões em roteiro;
- retornos recorrentes.

Valores e thresholds devem ser configuráveis.

---

# 29. TRACKING E EVIDÊNCIA

Tracking deve funcionar também sem login.

Identificadores técnicos:

```text
anonymous_visitor_id
session_id
```

Eventos importantes:

```text
PAGE_VIEWED
SECTION_IMPRESSION
PLACE_VIEWED
CATEGORY_VIEWED
SEARCH_PERFORMED
FILTER_APPLIED
EXPERIENCE_VIEWED
EVENT_VIEWED
PARTNER_CARD_IMPRESSION
PARTNER_CARD_CENTERED
PARTNER_CARD_CLICK
CONTACT_CLICKED
WHATSAPP_CLICKED
PHONE_CLICKED
WEBSITE_CLICKED
EXTERNAL_BOOKING_CLICKED
MAP_OPENED
ROUTE_STARTED
ROUTE_STEP_VIEWED
ROUTE_STEP_COMPLETED
ROUTE_INTEREST_SELECTED
ROUTE_PROFILE_COMPLETED
ROUTE_AUTH_REQUESTED
TRIP_CREATED
PLACE_ADDED
PLACE_REMOVED
PLACE_SWAPPED
QR_SCANNED
VISIT_CONFIRMED
REVIEW_SUBMITTED
PASSPORT_SHARED
```

Adicionar eventos específicos de portal/admin somente quando necessários.

## 29.1. Nível de Evidência de Atribuição

Usar conceito factual:

1. visualização;
2. salvo;
3. inserido em roteiro;
4. contato;
5. presença física;
6. reserva confirmada quando integrada;
7. transação confirmada quando integrada.

Não chamar isso de “Conversion Confidence”.

QR não comprova compra.

---

# 30. INTELIGÊNCIA E VISUALIZAÇÕES

Criar componentes reutilizáveis:

```text
JourneySankey
TerritorialFlowMap
PlannedVsRealizedJourney
TripTimeline
TravelCalendar
PassportJourneyMap
```

## 30.1. Journey Sankey

Representa organização agregada do funil:

```text
origem
↓
descoberta
↓
intenção
↓
ação
↓
presença
```

Interações:

- filtros;
- tooltips;
- foco por caminho;
- navegação acessível;
- relação com mapa territorial.

## 30.2. Circulação territorial

Uma conexão A → B significa:

> presença registrada em A seguida de presença registrada em B.

Não significa GPS contínuo.

Modos:

- fluxos;
- concentração;
- lugares.

Privacidade:

- não mostrar caminho individual;
- não mostrar localização em tempo real;
- aplicar agregação/thresholds quando necessário.

## 30.3. Planejado versus registrado

Estados:

- planejado e registrado;
- planejado sem evidência;
- registrado fora do roteiro;
- substituído;
- reorganizado.

Usar linguagem factual.

Nunca escrever `roteiro concluído 60%` se o dado só representa QR/evidência parcial.

---

# 31. SISTEMA VISUAL FINAL

A identidade visual já não está “em aberto” como no Work original.

## 31.1. Tipografia

Papéis aprovados:

```text
Origin Black Display
→ títulos de páginas, headings editoriais e subtítulos de impacto

Scratchy
→ carimbos, detalhes decorativos e elementos do objeto Passaporte

Anodina
→ body copy, descrições, navegação, botões, formulários e UI
```

Usar `public/typography.css` como referência.

Os binários de fonte **não estão neste pacote**.

Não substituir silenciosamente as fontes definitivas por Material Symbols ou outra tipografia decorativa.

Enquanto arquivos licenciados não estiverem disponíveis:

- manter fallbacks;
- documentar ausência;
- não empacotar fontes de terceiros.

## 31.2. Paleta clara atual

Tokens principais aprovados como baseline:

```text
canvas            #E8E8E0
section           #D4D1C7
surface           #F3F1EC
surface-raised    #FFFFFF
surface-inset     #D4D1C7
text              #161618
text-secondary    #403D3F
text-muted        #5E5A50
action            #403D3F
action-hover      #262425
paper             #F0EDE5
```

Cores complementares por nicho:

```text
red       #4E0000
yellow    #F2E8D1
sage      #A1AD92
olive     #5A5D43
blue      #94B2C4
navy      #00324D
cocoa     #5B4536
coconut   #F0EDE5
```

Usar essas cores como acentuação e organização, não como arco-íris de UI.

## 31.3. Dark Mode

Baseline:

```text
canvas            #161618
section           #211F20
surface           #2C292A
surface-raised    #373334
surface-inset     #403D3F
text              #F3F1EC
text-secondary    #D4D1C7
text-muted        #B8B1AA
```

No Dark Mode, o Passaporte físico continua parecendo papel. Não inverter as páginas para preto.

## 31.4. Design tokens

Centralizar:

- cores;
- fontes;
- espaçamento;
- raios;
- bordas;
- sombras;
- containers;
- z-index;
- motion;
- ícones;
- breakpoints.

Não espalhar valores arbitrários em componentes.

---

# 32. ÍCONES

A decisão final é usar o **sistema SVG do projeto**, principalmente `assets/icons-v3`.

Não usar Material Symbols como runtime principal.

Migrar `Icon.tsx` para resolver os SVGs/componentes gerados.

Regras:

- SVG escalável;
- preferir `currentColor`;
- acessibilidade com `aria-hidden` para decorativos;
- `title`/label para semânticos;
- tamanhos por token;
- manter aliases;
- não duplicar ícone só por variação de cor.

O pacote inclui documentação e previews do sistema de ícones.

---

# 33. FOTOGRAFIA E ATIVOS

Usar:

- `assets/brand`;
- `assets/tourism`;
- `assets/stock` somente como ilustração temporária;
- referências PSD/HTML;
- screenshots de validação.

Fotografia de página representa o local.

Evitar:

- flyer;
- arte de preço;
- banner promocional;
- imagem de campanha que não representa o espaço.

Manter `SOURCES.json`, licenças e atribuições.

---

# 34. MOTION DESIGN SYSTEM

Todas as animações devem transmitir produto premium com movimento discreto.

Baseline atual:

```css
--motion-ease: cubic-bezier(.22,1,.36,1);
--motion-fast: 160ms;
--motion-base: 260ms;
--motion-slow: 420ms;
--route-slide-duration: 680ms;
--route-slide-ease: cubic-bezier(.16,1,.3,1);
```

Princípios:

- preferir `transform` e `opacity`;
- evitar `top`, `left`, `margin` animados;
- evitar reflow;
- usar `transform-origin` apropriado;
- evitar overshoot agressivo;
- não usar transição linear;
- garantir que `overflow:hidden` não corte hover necessário;
- respeitar `prefers-reduced-motion`;
- hover nunca pode alterar posição lógica de pins/mapa;
- não animar a tela inteira quando só o conteúdo deve transicionar.

## 34.1. Transição entre páginas

Preservar a ideia atual:

- header/footer fora da transição principal;
- somente conteúdo principal entra/sai;
- direção pode acompanhar navegação;
- shared element para mídia de card → detalhe quando suportado;
- fallback simples quando View Transitions não existir.

Não tornar a transição mais importante do que a navegação.

---

# 35. ACESSIBILIDADE

Obrigatório desde a implementação, não como ajuste final.

Validar:

- navegação por teclado;
- foco visível;
- skip link;
- headings corretos;
- labels;
- alt text;
- dialogs;
- accordions;
- carrossel;
- drag and drop com alternativa;
- estados não dependentes apenas de cor;
- `prefers-reduced-motion`;
- contraste em Light e Dark;
- touch target;
- mensagens de erro;
- leitura de tabelas/gráficos;
- texto alternativo ou resumo de visualizações complexas.

Usar Axe/Playwright.

---

# 36. RESPONSIVIDADE

A experiência precisa ser nativa em:

```text
mobile pequeno ~390
tablet ~768
desktop ~1024/1366
desktop largo ~1440/1920
```

Não criar uma versão desktop e comprimir.

Usar:

- `clamp`;
- grid/flex responsivo;
- `minmax`;
- containers fluidos;
- aspect-ratio;
- imagens responsivas.

Para calendários, dashboards, passaporte e visualizações, definir comportamento mobile específico.

---

# 37. INTERNACIONALIZAÇÃO

Arquitetura preparada para:

```text
pt-BR
en
es
```

`pt-BR` é o conteúdo canônico inicial.

Não inventar traduções incompletas apenas para dizer que a feature existe.

Implementar:

- chaves estáveis;
- fallback;
- conteúdo dinâmico localizável;
- SEO por locale quando ativado.

---

# 38. PRIVACIDADE, LGPD E COMPLIANCE

Criar:

- Política de Privacidade;
- Termos;
- Política de Cookies;
- gestão de consentimento quando aplicável.

Princípios:

- minimização de dados;
- propósito explícito;
- consentimento quando necessário;
- retenção configurável;
- auditoria;
- não guardar geolocalização contínua;
- não expor jornadas individuais na inteligência;
- separar identificadores anônimos de identidade civil;
- documentar fornecedores.

Não declarar “100% LGPD compliant” sem revisão jurídica baseada na implementação real.

---

# 39. SEO E PRODUÇÃO

Implementar:

- títulos únicos;
- meta descriptions;
- Open Graph;
- imagem social;
- canonical;
- robots;
- sitemap;
- 404;
- breadcrumbs quando útil;
- links internos;
- schema estruturado somente quando factual;
- `LocalBusiness` apenas para negócio real;
- performance de imagens;
- segurança de headers;
- logs;
- observabilidade básica.

Robots não é mecanismo de segurança.

---

# 40. CONTEÚDO MODULAR

Toda nova seção deve ser reutilizável.

Uma alteração específica de um parceiro cria:

- variante;
- instância;
- versão local.

Nunca editar a definição global para resolver exceção local.

O Section Registry deve permitir criar novas seções sem reescrever todas as páginas.

---

# 41. ESTADOS DE UI

Todo componente importante deve considerar:

```text
loading
empty
error
success
disabled
offline/temporary failure quando relevante
```

Estado vazio não deve usar dados falsos.

Exemplo no Passaporte:

> Ainda há espaço para a primeira marca desta viagem.

---

# 42. REGRAS DE QUALIDADE DE CÓDIGO

- TypeScript estrito;
- schemas Zod nas fronteiras;
- componentes pequenos e reutilizáveis;
- Server Components por padrão;
- Client Components somente quando necessário;
- sem side effects escondidos;
- autorização no servidor;
- repositories/services para persistência;
- domínio não deve depender diretamente da UI;
- sem duas fontes de verdade para dados;
- sem JSONB genérico quando relação estrutural for estável;
- JSON pode ser usado para payload editorial flexível onde faça sentido;
- sem código morto da SPA antiga no runtime final.

---

# 43. MIGRAÇÃO DO BASELINE ATUAL

O pacote contém duas fontes de referência.

## 43.1. `01_NEXT_BASELINE`

Reutilizar quando fizer sentido:

- módulos de trips;
- persistência;
- tracking;
- passport;
- Admin;
- testes;
- setup Next/Drizzle;
- generated SVG components.

Revisar antes de copiar.

## 43.2. `02_STATIC_VISUAL_REFERENCE`

Usar para reproduzir:

- composição da Home;
- header;
- motion;
- carrossel;
- mapa demonstrativo;
- Passaporte;
- páginas de lugar;
- landing de parceiros;
- visual premium;
- dark mode.

Não copiar como segundo runtime.

## 43.3. Dados turísticos

Migrar `tourism-data.js` para seed/repository.

Depois da migração:

- `tourism-data.js` não é fonte de produção;
- UI e Admin leem o mesmo banco/repository.

---

# 44. REVISÕES OBRIGATÓRIAS SOBRE O REPOSITÓRIO ANTIGO

Corrigir durante a recriação:

1. remover a contradição “Next único” versus SPA estática mantida;
2. remover root bridge/testes que exigem runtime estático;
3. consolidar dados reais no banco;
4. não afirmar que dados turísticos foram migrados se ainda estiverem apenas em JS estático;
5. trocar Material Symbols pelos SVGs aprovados;
6. manter tipografia configurada, mas sem empacotar binários não fornecidos;
7. atualizar documentação de arquitetura;
8. revisar `README`;
9. revisar scripts de demo;
10. eliminar CSS conflitante acumulado entre `styles.css`, `visual.css`, `visual-v2.css` e `theme.css`;
11. transformar estilos aprovados em tokens/components organizados;
12. manter referências antigas fora do runtime.

---

# 45. PLANO DE EXECUÇÃO

## Fase 1 — saneamento e fundação

- criar branch/diretório limpo;
- importar baseline Next;
- remover dependência da SPA;
- normalizar tokens;
- migrar SVG Icon;
- preparar auth/RBAC;
- ajustar migrations.

## Fase 2 — dados

- modelar entidades;
- migrar dados turísticos;
- migrar fontes/licenças;
- seeds idempotentes;
- repository único.

## Fase 3 — shell e Home

- header Dock;
- menu mobile;
- hero;
- Home completa;
- Circular Gallery;
- FAQ;
- mapa;
- footer;
- Light/Dark;
- reduced motion.

## Fase 4 — descoberta

- Explorar;
- mapa/lista;
- páginas de lugares;
- parceiros públicos;
- landing B2B.

## Fase 5 — turista persistente

- auth;
- onboarding;
- Travel Engine;
- roteiro;
- calendário;
- persistence;
- compartilhamento.

## Fase 6 — Passaporte e QR

- QR;
- Visit;
- carimbos;
- ticket;
- páginas do Passaporte;
- caminho vivido;
- export social.

## Fase 7 — parceiro

- portal;
- campos editáveis;
- solicitações;
- analytics próprios;
- histórico.

## Fase 8 — Admin Intelligence

- CMS;
- fontes;
- QR;
- solicitações;
- maturação;
- alertas;
- Sankey;
- circulação;
- planejado vs registrado.

## Fase 9 — produção

- i18n;
- SEO;
- acessibilidade;
- performance;
- segurança;
- compliance;
- E2E;
- documentação.

Não avançar visualmente para a próxima fase deixando bugs arquiteturais graves na anterior.

---


# 46. ENTREGA FÍSICA OBRIGATÓRIA POR BLOCOS

A execução no Work deve produzir **arquivos físicos para download ao final de cada bloco concluído**.

Não considerar uma fase concluída somente porque o código foi alterado no workspace, exibido em diff, descrito em texto ou validado internamente.

Cada fase concluída deve resultar em um arquivo `.zip` efetivamente criado e disponibilizado para download.

## 46.1. Regra obrigatória de empacotamento

Ao concluir qualquer bloco funcional:

1. executar as validações aplicáveis;
2. consolidar todos os arquivos criados ou alterados;
3. preservar exatamente os caminhos relativos do repositório;
4. gerar um ZIP físico;
5. incluir documentação do bloco;
6. disponibilizar o ZIP para download;
7. somente então marcar o bloco como concluído.

Não usar ZIPs simbólicos, referências internas do Work ou artefatos que não possam ser baixados pelo usuário.

O arquivo deve existir fisicamente no ambiente de saída.

## 46.2. Estrutura interna dos ZIPs

Os ZIPs intermediários devem reproduzir a estrutura real do repositório.

Exemplo:

```text
03_shell_home_design_system.zip
├── CHANGELOG.md
├── BLOCK_STATUS.md
├── TEST_REPORT.md
├── src/
│   ├── app/
│   ├── components/
│   └── design-system/
├── public/
└── ...
```

Se um arquivo do bloco pertence a:

```text
src/components/passport/PassportBook.tsx
```

ele deve aparecer exatamente nesse caminho dentro do ZIP.

Não:

```text
arquivos-alterados/PassportBook.tsx
```

Não achatar diretórios.

Não renomear arquivos apenas para empacotamento.

## 46.3. ZIPs intermediários são patches aplicáveis

Cada ZIP intermediário deve funcionar como um **patch estrutural** sobre a versão-base correspondente.

Ao extrair o ZIP na raiz do repositório:

- arquivos novos entram em seus caminhos corretos;
- arquivos alterados substituem os equivalentes;
- pastas necessárias são recriadas;
- não deve ser necessária reorganização manual.

Quando houver arquivo que deva ser removido, registrar em:

```text
FILES_TO_DELETE.txt
```

com um caminho relativo por linha.

Exemplo:

```text
index.html
app.js
visual-v2.css
tests/unit/root-bridge.test.ts
```

Nunca simular remoção apenas omitindo o arquivo do ZIP.

## 46.4. Conteúdo obrigatório de cada ZIP

Todo ZIP de bloco deve conter na raiz:

### `CHANGELOG.md`

Informar:

- objetivo do bloco;
- funcionalidades implementadas;
- principais decisões;
- arquivos criados;
- arquivos alterados;
- arquivos removidos;
- migrations adicionadas;
- dependências adicionadas/removidas;
- incompatibilidades relevantes.

### `BLOCK_STATUS.md`

Usar estados:

```text
CONCLUÍDO
CONCLUÍDO COM PENDÊNCIAS EXTERNAS
PARCIAL
BLOQUEADO
```

Para cada requisito importante, marcar:

```text
[OK]
[PARCIAL]
[PENDENTE]
[BLOQUEADO]
```

Não marcar como concluído algo ainda mockado quando o requisito pede implementação real.

### `TEST_REPORT.md`

Registrar:

- comandos executados;
- resultado;
- testes unitários;
- integração;
- E2E;
- lint;
- typecheck;
- acessibilidade;
- páginas/fluxos revisados;
- erros conhecidos.

Quando um teste não puder ser executado, registrar explicitamente a causa.

Não converter ausência de teste em aprovação.

### `FILES_TO_DELETE.txt`

Criar somente quando houver arquivos que precisam ser removidos do repositório-base.

## 46.5. Manifesto opcional recomendado

Preferencialmente adicionar:

```text
MANIFEST.json
```

contendo:

```json
{
  "block": "03_shell_home_design_system",
  "generated_at": "ISO-8601",
  "base_revision": "...",
  "files": [
    {
      "path": "src/...",
      "status": "created|modified|deleted",
      "sha256": "..."
    }
  ]
}
```

Isso deve facilitar conferência e aplicação dos pacotes.

## 46.6. Nomes obrigatórios dos pacotes

Gerar progressivamente:

```text
01_fundacao_saneamento.zip
02_dados_migracoes_seeds.zip
03_shell_home_design_system.zip
04_explorar_lugares_parceiros.zip
05_turista_roteiro_calendario.zip
06_passaporte_qr_compartilhamento.zip
07_area_parceiro.zip
08_admin_intelligence.zip
09_producao_qa.zip
PASSAPORTE_SERRA_NEGRA_FINAL.zip
```

Se uma fase for dividida em sub-blocos, usar:

```text
05a_turista_auth_onboarding.zip
05b_travel_engine_roteiro.zip
05c_calendario_persistencia.zip
```

Ao final da fase, ainda gerar:

```text
05_turista_roteiro_calendario.zip
```

consolidando seus sub-blocos.

## 46.7. Pacotes intermediários não substituem o pacote final

Os ZIPs `01` a `09` existem para:

- auditoria;
- revisão;
- rollback;
- integração incremental;
- continuidade entre sessões do Work;
- recuperação caso uma execução posterior degrade o projeto.

Ao final, gerar também:

```text
PASSAPORTE_SERRA_NEGRA_FINAL.zip
```

O ZIP final deve ser **autocontido**.

Ele não é um patch.

Deve conter todo o repositório necessário para:

```bash
npm ci
npm run dev
npm run build
npm test
```

considerando as variáveis externas documentadas em `.env.example`.

## 46.8. Conteúdo obrigatório do ZIP final

O pacote final deve incluir:

```text
README.md
package.json
package-lock.json
.env.example
src/
public/
drizzle/
scripts/
seed/
tests/
docs/
```

e qualquer outro diretório necessário ao runtime.

Também incluir:

```text
docs/FINAL_IMPLEMENTATION_REPORT.md
docs/ARCHITECTURE.md
docs/ROUTES.md
docs/PERMISSIONS_MATRIX.md
docs/DATA_INVENTORY.md
docs/MIGRATION_FROM_STATIC.md
docs/ACCESSIBILITY_REPORT.md
docs/TEST_REPORT.md
docs/KNOWN_LIMITATIONS.md
```

Não incluir:

```text
node_modules/
.next/
coverage/
playwright-report/
test-results/
.env
credenciais
segredos
cache
arquivos temporários
```

Screenshots e relatórios finais podem ser incluídos em `docs/validation/`.

## 46.9. Validação obrigatória antes de gerar cada ZIP

Antes do empacotamento de um bloco, executar o máximo aplicável entre:

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

Para blocos visuais:

- validar desktop;
- validar tablet;
- validar mobile;
- validar Light Mode;
- validar Dark Mode;
- validar teclado;
- validar `prefers-reduced-motion`.

Não gerar um ZIP rotulado como concluído quando a aplicação não inicia, quando o build falha ou quando erros críticos conhecidos não estão documentados.

## 46.10. Regra de continuidade no Work

O Work deve tratar cada ZIP concluído como um **checkpoint físico**.

Ao iniciar a fase seguinte:

1. usar o estado validado da fase anterior;
2. não reconstruir a aplicação a partir de uma versão anterior;
3. não perder alterações aprovadas;
4. não substituir componentes funcionais sem necessidade;
5. manter compatibilidade com o checkpoint anterior ou documentar breaking changes.

Se houver regressão, corrigir antes de gerar o próximo checkpoint.

## 46.11. Entrega ao usuário

Ao encerrar cada fase, a resposta do Work deve mostrar claramente:

```text
FASE CONCLUÍDA
ZIP: <arquivo>.zip
STATUS: <status>
TESTES: <resumo>
PENDÊNCIAS: <resumo ou nenhuma>
```

e fornecer um link real para download.

Nunca responder apenas:

> “Os arquivos foram preparados.”

O arquivo deve estar efetivamente disponível.

## 46.12. Falhas na geração do ZIP

Se o ambiente impedir a criação do ZIP:

- não declarar a fase concluída;
- preservar os arquivos já criados;
- informar objetivamente a limitação;
- tentar método local alternativo disponível;
- não recorrer a serviço pago;
- se for necessária skill adicional, solicitar somente opção gratuita/open source.

## 46.13. Regra de integridade

Sempre que possível, testar o ZIP após criação:

```bash
unzip -t arquivo.zip
```

ou equivalente.

Para o pacote final, adicionalmente:

1. extrair em diretório limpo;
2. conferir estrutura;
3. instalar dependências;
4. executar validações;
5. confirmar ausência de segredos;
6. confirmar que o README corresponde ao projeto entregue.

O ZIP final deve ser considerado o artefato físico oficial da reconstrução.

---

# 47. TESTES

## 46.1. Unitários

Cobrir pelo menos:

- Travel Engine;
- edição de roteiro;
- preservação de itens manuais;
- deduplicação de QR;
- geração de visitas;
- passaporte;
- permissões;
- Section Registry;
- requests;
- evidência de atribuição.

## 46.2. Integração

Cobrir:

- draft → preview → publish;
- partner edit allowed;
- partner request required;
- trip persistence;
- QR → login → resume → visit;
- Visit → Passport;
- seed idempotente.

## 46.3. E2E

Matriz mínima:

```text
390x844
768x1024
1366x936
1440x900
```

Fluxos:

1. Home;
2. Explorar;
3. lugar;
4. parceiro;
5. montar roteiro;
6. editar roteiro;
7. calendário;
8. Passaporte;
9. QR;
10. parceiro logado;
11. Admin;
12. Light/Dark;
13. teclado;
14. reduced motion.

---

# 48. CRITÉRIOS DE ACEITE

A reconstrução só deve ser considerada concluída quando:

- todos os blocos concluídos possuírem ZIP físico correspondente;
- todos os ZIPs preservarem a estrutura de pastas;
- remoções estiverem registradas em `FILES_TO_DELETE.txt` quando aplicável;
- `PASSAPORTE_SERRA_NEGRA_FINAL.zip` tiver sido efetivamente criado e disponibilizado para download;

- existe apenas um runtime de produção;
- Next.js serve todas as rotas canônicas;
- dados turísticos reais vêm do repositório dinâmico;
- fontes/proveniência estão preservadas;
- SVGs são usados no lugar de Material Symbols;
- Home reproduz a experiência aprovada;
- carrossel central funciona conforme regras finais;
- dark mode funciona;
- reduced motion funciona;
- Explorar e mapa usam o mesmo dataset;
- páginas de lugar funcionam;
- landing de parceiros funciona;
- área do parceiro existe;
- Admin tem CMS + base de inteligência;
- roteiro e calendário persistem;
- QR cria `Visit` sem fingir compra;
- Passaporte é alimentado pelas visitas;
- compartilhamento gera arte limpa;
- autorização server-side está implementada;
- lint passa;
- typecheck passa;
- unit tests passam;
- E2E crítico passa;
- Axe não possui violações críticas;
- README corresponde ao sistema real;
- documentação não contradiz o runtime.

---

# 49. NÃO FAZER

Não:

- manter SPA estática concorrente;
- recriar visual do zero;
- voltar para Material Symbols;
- transformar Passaporte em programa de pontos;
- tratar QR como prova de compra;
- inventar parceiro real;
- inventar horário ou preço;
- mostrar campo sem dado;
- criar ranking pago disfarçado;
- usar GPS contínuo sem necessidade;
- criar dashboard genérico para o Passaporte;
- criar Admin só como CRUD;
- dar acesso do parceiro ao Admin;
- permitir parceiro editar estrutura global;
- perder contexto após login;
- resetar todo roteiro após pequena edição;
- usar transição linear;
- usar hover que causa reflow;
- cortar card central por overflow;
- duplicar dados entre arquivos e banco;
- criar nova linguagem visual para cada tela;
- instalar dependência paga como requisito do MVP.

---

# 50. ARQUIVOS DE REFERÊNCIA DESTE PACOTE

Use `REFERENCE_INDEX.md`.

Pastas:

```text
00_START_HERE
01_NEXT_BASELINE
02_STATIC_VISUAL_REFERENCE
03_VISUAL_REFERENCES
04_ASSETS
05_DATA_AND_PROVENANCE
06_SELECTED_DOCS
07_ORIGINAL_WORK_ARCHIVE
```

A ordem de leitura sugerida é:

1. este documento;
2. `REVISION_NOTES.md`;
3. screenshots e referências PSD/HTML;
4. `theme.css` / interações estáticas;
5. baseline Next;
6. dados/proveniência;
7. documentos antigos apenas quando necessário.

---

# 51. ENTREGA ESPERADA DO WORK

Ao final, entregar:

- os ZIPs físicos `01` a `09` de cada bloco concluído;
- `PASSAPORTE_SERRA_NEGRA_FINAL.zip` autocontido e validado;

- repositório limpo;
- migrations;
- seed;
- README atualizado;
- `.env.example`;
- documentação de arquitetura;
- mapa de rotas;
- matriz de permissões;
- inventário de dados reais versus demo;
- relatório de migração da SPA;
- relatório de acessibilidade;
- relatório de testes;
- screenshots desktop/tablet/mobile;
- lista objetiva de itens ainda bloqueados por ativo externo, credencial, licença ou revisão jurídica.

Se faltar alguma skill/ferramenta indispensável, não substituir por opção paga. Solicitar somente alternativa gratuita/open source e continuar os demais blocos que não dependam dela.

---

# 52. DEFINIÇÃO FINAL DO PRODUTO

O Passaporte Serra Negra deve sair desta reconstrução como uma plataforma coerente em que:

```text
o turista descobre
→ organiza
→ visita
→ registra
→ compartilha

o parceiro participa
→ mantém sua presença
→ recebe sinais
→ acompanha inteligência própria

o Admin publica
→ controla
→ observa
→ aprende
→ amadurece a rede
```

A arquitetura deve tornar essas três frentes parte do mesmo sistema de dados, sem misturar permissões e sem manter implementações paralelas.

**Não inventar novas telas sem necessidade. Consolidar o que já foi definido, torná-lo funcional e transformar a experiência aprovada em produto real.**
