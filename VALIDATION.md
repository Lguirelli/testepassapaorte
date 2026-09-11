# Validação atual: Bloco 08 PARCIAL

Baseline local reexecutada: lint, strict, 13 unitários, persistência PGlite, build e migração/seed PASS. Nove rotas HTTP 200. Suíte completa tentou 51 casos, todos bloqueados antes do corpo por Chromium ausente. PostGIS não executado, instalação de sistema bloqueada por permissões. Axe e screenshots novos não executados. G0 PASS; G1–G8 PARCIAL.

Evidência atual: artifacts/block_08/ e docs/validation/BLOCK-08.md. As seções abaixo são o histórico do Bloco 07, preservado como tal. Elas não constituem nova execução.

---

# Relatório de validação, Passaporte Serra Negra

Data: 2026-09-10. Entrega incremental de validação, não MVP final nem aprovação de produção.

## Implementado

Blocos 00–06: bootstrap modular; Home e Explorar com pesquisa/filtros e mapa mock; páginas distintas de lugar e parceiro; Admin com seis tipos de registro, rascunho, preview, publicação, arquivo, revisão, restauração e auditoria; onboarding de oito etapas; roteiro demo determinístico editável por dia; calendário Dia/Semana/Mês; Passaporte com capítulos e evidência separada de planejamento. Fluxos usam persistência via Drizzle. Providers e conteúdo são explicitamente fictícios.

## Resultados executados

| Verificação | Resultado | Evidência |
|---|---|---|
| Lint | PASS | artifacts/validation/lint.log |
| TypeScript strict | PASS | artifacts/validation/typecheck.log |
| Unitários | 13 PASS, 0 FAIL | artifacts/validation/unit.log |
| Build Next completo | PASS | artifacts/validation/build.log |
| Persistência isolada PGlite | PASS | artifacts/validation/persistence.log |
| Listagem E2E | 51 casos, 7 arquivos, 3 projetos | artifacts/validation/e2e-list.log |
| Tentativa smoke E2E standalone | FAIL na inicialização, corpo do teste não executado | artifacts/validation/e2e-attempt.log |
| PostgreSQL/PostGIS Docker | NÃO EXECUTADO | ADR-004 |
| Workflow GitHub Actions | ENTREGUE, NÃO EXECUTADO remotamente | .github/workflows/ci.yml |

Persistência: duas migrações consecutivas, três seeds, exatamente 30 conteúdos e uma viagem, edição preservada após reabertura. Banco temporário isolado da aplicação, removido pelo próprio script após a verificação. Isto não valida PostGIS.

## Playwright e navegador

A inspeção cloud usou a API Playwright do navegador disponível, em **1363×936**. É uma verificação dirigida de fluxos, não execução da suíte standalone. Rotas inspecionadas ao longo dos blocos: Home, Explorar, parceiro Café Neblina Alta, editor e preview do Café, onboarding, roteiro demo, calendário e Meu Passaporte.

Fluxos observados: busca/filtros; separação draft/publicado com preview da nova descrição e publicação persistida após reinício; auditoria; geração explícita da viagem; café movido para 11h30 sem alterar Mirante e Bistrô fixado; calendário refletindo o roteiro; livro com navegação para bilhete/marcas; tema escuro persistido; visita demo salva e nova submissão lugar/dia recusada. O registro de visita confirmado nesta retomada foi Espaço Bem-Estar Águas Claras em 12/09/2026, exclusivamente fictício.

Oito capturas em `artifacts/playwright/cloud-1363x936/`: 00-home, 01-explorar, 02-parceiro, 03-admin, 03-preview, 04-roteiro, 05-calendario e 06-passaporte-dark. Capturas são de viewport, não páginas completas. A última captura antecede a visita demo criada na retomada.

A suíte preparada contempla desktop 1440×1000, tablet 1024×768 e mobile 390×844, com reduced motion no mobile. Os **51 casos não passaram** nesta execução: foram apenas enumerados. Um smoke foi tentado e falhou ao iniciar Chromium. A instalação anterior do navegador esgotou tentativas normais por timeout. A API cloud não oferece redimensionamento suportado; não houve simulação falsa dos três tamanhos. Axe está preparado, mas não foi executado. Não há certificação de acessibilidade.

## Bugs corrigidos

| Sintoma | Causa | Correção e evidência |
|---|---|---|
| Prévia não iniciava | Flags de servidor incompatíveis com Next | Wrapper scripts/dev.mjs; prévia cloud funcional |
| Script TS falhava com EPERM | Canal IPC do launcher tsx | node --import tsx; scripts executados |
| Campo opcional vazio invalidava formulário | String vazia sem normalização | Normalização e teste unitário |
| Feedback do editor desaparecia | Remontagem por versão na key | Identidade estável do editor; fluxo cloud de salvar/publicar |
| Restauração não refletia campos | Inputs não controlados conservavam valor | Recarga após restauração; regressão completa ainda pendente |
| Número 0 solto na entidade | Renderização de expressão numérica | Guarda booleana de acessibilidade |
| Tema selecionado divergente após recarga | defaultValue fixo em system | Valor inicial do cookie validado; cloud mostrou Escuro selecionado |
| Teste de auditoria ambíguo após múltiplas publicações | Locator correspondia a várias linhas | Seleção explícita da primeira ocorrência; teste somente preparado |
| Build poderia disputar saída com prévia | Mesmo diretório .next | NEXT_BUILD_DIR opcional; build separado aprovado |

Uma rota pré-carregada antes de ser criada exigiu recarga durante desenvolvimento; comportamento documentado no Bloco 05. Não foi declarado problema de produção resolvido sem teste correspondente.

## Gates G0–G8

| Gate | Estado | Motivo |
|---|---|---|
| G0 fontes | PASS | Fontes obrigatórias lidas antes da implementação |
| G1 bootstrap | PARCIAL | Lint/typecheck/build aprovados; smoke standalone e PostGIS pendentes |
| G2 descoberta | PARCIAL | Implementação e inspeção cloud; três viewports pendentes |
| G3 entidades | PARCIAL | Templates e relações implementados; regressão integral pendente |
| G4 Admin | PARCIAL | Draft/preview/publicação/audit verificados; CRUD completo de seis tipos não integralmente testado |
| G5 roteiro | PARCIAL | Unitários e fluxo dirigido; matriz E2E pendente |
| G6 calendário | PARCIAL | Três modos verificados cloud; mobile pendente |
| G7 Passaporte | PARCIAL | Livro, tema, gravação e deduplicação verificados; responsividade completa pendente |
| G8 regressão | PARCIAL | Verificações locais e relatório concluídos; suíte completa bloqueada |

PASS de entrega significa apenas ZIP fisicamente existente, legível, CRC válido, lista exata de arquivos e hashes conferidos; não altera os gates acima.

## Pendências reais

Fora do escopo: reservas/pagamentos, analytics avançado, Concierge, gamificação competitiva, pesquisa de atrações reais e Travel Engine definitivo.

Decisão futura: identidade visual, modelo relacional definitivo, regras finais de roteiro, QR e contrato definitivo de analytics. Sem conclusão jurídica de LGPD.

Assets ausentes: RV-XX, motor oficial de carimbos, mapa territorial final, fotografias finais. Placeholders explicitamente neutros preservados.

Providers/credenciais: autenticação de produção, mapas/rotas/clima/storage externos e GitHub autenticado. Mocks não são integrações reais.

Dívida técnica e cobertura: extração i18n incompleta; relações JSONB validadas na aplicação; migration inicial sem ledger; arquivamento de parceiros pode deixar referências comerciais em lugares e precisa de política/correção e teste; categorias desabilitadas e ordenação editorial precisam de regressão e tratamento público consistente; campos de perfil armazenados não são garantias de acessibilidade; dados demo restringem datas a 12–14/09/2026. Não promover esta base a produção enquanto essas pendências e os gates não forem resolvidos.

## Entrega e continuidade

Repositório local com commits por bloco, sem push GitHub. LATEST.zip contém estado completo para instalação e seed, documentação, testes, CI e evidências. Não contém caches, node_modules, builds, segredos ou banco binário. Os fixtures canônicos não foram alterados pelas mutações de QA; relatórios e capturas guardam sua evidência, não equivalência binária do banco transitório.

Próximo bloco recomendado: executar os 51 casos com Chromium e PostGIS disponíveis, completar CRUD/arquivo/relações e responsividade, corrigir violações reais e atualizar G1–G8. Não reiniciar projeto nem aplicar branding final. Consultar WORK_STATE.md.
