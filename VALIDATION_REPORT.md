> Estado atual — bloco 12: etapa demonstrativa encerrada por ajuste explícito do usuário, sem Chromium e PostGIS. A dispensa permite entrega/apresentação, não transforma as verificações ausentes em PASS. Consulte ADR-005 e docs/DEMO_PRESENTATION.md.

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

Dívida técnica e cobertura: extração i18n incompleta; relações JSONB validadas na aplicação; migration inicial sem ledger; relações arquivadas e categorias foram corrigidas/testadas na persistência no Bloco 08; confirmação na interface permanece pendente; campos de perfil armazenados não são garantias de acessibilidade; dados demo restringem datas a 12–14/09/2026. Não promover esta base a produção enquanto essas pendências e os gates não forem resolvidos.

## Entrega e continuidade

Repositório local com commits por bloco, sem push GitHub. LATEST.zip contém estado completo para instalação e seed, documentação, testes, CI e evidências. Não contém caches, node_modules, builds, segredos ou banco binário. Os fixtures canônicos não foram alterados pelas mutações de QA; relatórios e capturas guardam sua evidência, não equivalência binária do banco transitório.

Próximo bloco recomendado: executar os 51 casos com Chromium e PostGIS disponíveis, completar CRUD/arquivo/relações e responsividade, corrigir violações reais e atualizar G1–G8. Não reiniciar projeto nem aplicar branding final. Consultar WORK_STATE.md.

## Atualização de 2026-09-11, Bloco 08

11 cenários de integração PASS usando o serviço transacional do Admin com PGlite em memória. Os seis tipos percorrem criação/edição/publicação/arquivo/restauração e rejeição de versão obsoleta sem auditoria indevida. Também foram verificados ocultação de relações indisponíveis, desativação/ordem de categorias e rollback por referência arquivada. Serviço interno foi extraído sem remover autorização da server action. Lint, typecheck e 13 unitários reexecutados; build e detalhes em artifacts/validation/block-08/.

Correções: restauração/edição não retiram arquivo implicitamente; relações públicas inválidas não geram cards para páginas indisponíveis; opções editoriais permitem completar um parceiro novo; ícone legado inválido de Bem-estar é compatibilizado com perfil-relaxar do sistema fornecido. Primeiro erro de integração e resultado final estão preservados nos logs.

Não foram executados novos testes de navegador ou PostGIS. A presença dos executáveis foi conferida e continuou negativa. Tentativa limitada de download não produziu instalação confirmada. G4 evoluiu em cobertura de persistência, mas todos os gates antes parciais continuam parciais. Nenhum dos 51 casos E2E foi declarado aprovado. Próximo bloco 09: matriz UI/PostGIS e confirmação das correções na interface.

## Bloco 09, confirmação UI de 2026-09-11

O navegador cloud confirmou oito verificações de categoria, ícone legado, arquivo persistido e republicação do parceiro; duas capturas adicionais e observações estruturadas em artifacts/validation/block-09/. A categoria Bem-estar e o Café terminaram públicos novamente. A suíte foi ampliada de 51 para 57 casos com dois fluxos em três projetos; continua somente preparada no runner standalone. Lint, typecheck e 13 unitários passaram. Não houve alteração no código de produto ou mudança do status parcial dos gates.

## Encerramento da implementação, Bloco 10

O pacote final contém os módulos solicitados, fixtures, migrations, Compose, CI, testes, 10 screenshots cloud e relatórios por bloco. Foram adicionados preflight e executor sequencial da aceitação completa, com logs e códigos de saída distintos para falha e bloqueio. Preflight executado: BLOCKED (Chromium ausente e PostgreSQL/PostGIS de validação não configurado). O caminho completo não foi executado. Novos comandos são auxiliares para reproduzir os gates, não evidência de sua aprovação.

Estado final: implementação do vertical slice entregue; aceitação integral da Definition of Done NÃO concluída. G0 PASS; G1–G8 PARCIAIS. Permanecem obrigatórios 57 casos E2E, três viewports, Axe, PostGIS e revisão das capturas produzidas por essa execução. Nenhum push/deploy ou execução remota foi feito. O próximo trabalho é remover esses bloqueios de infraestrutura e executar a aceitação, sem reconstruir o produto.

## Bloco 11, tentativa com URL demo explícita

Após o guia ser reenviado, validate:preflight e validate:full foram invocados com a URL PostgreSQL local demo configurada. Ambos retornaram BLOCKED. Diferentemente das tentativas sem variável, houve tentativa de verificar a conexão indicada, sem sucesso. Docker ausente. A execução completa foi chamada, mas não avançou a migrações ou testes. Logs e resumos separados em artifacts/validation/block-11/. Gates anteriores inalterados; não há aprovação adicional. Tentativa limitada de instalação do Chromium documentada no mesmo diretório.

## Bloco 12 — entrega para apresentação

PASS: demo:prepare duas vezes sobre o mesmo banco temporário; recusa de porta 4173 ocupada com saída 1 esperada e nenhum banco criado; lint; TypeScript; 13 testes unitários. Evidências em artifacts/validation/block-12/. O wrapper utiliza os scripts de migração/seed existentes e inicia o dev existente. Não houve nova inspeção browser nem reexecução de build/integração neste bloco; evidências anteriores são preservadas. Nenhuma tentativa adicional de Chromium/PostGIS. Etapa demonstrativa concluída, homologação integral não executada.
