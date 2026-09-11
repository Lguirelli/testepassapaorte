# BLOCK_REPORT: Bloco 08, integridade editorial e regressão do Admin

## Objetivo
Retomar as pendências concretas do Bloco 07, corrigir relações públicas inconsistentes e ampliar a validação do Admin sem reiniciar o projeto.

## Executado
Extraído o serviço transacional do Admin para permitir testes reais de persistência. A server action continua exigindo autorização antes de chamar o serviço, que não é uma server action nem uma rota pública. Criados 11 cenários de integração em PGlite em memória. Separadas opções editoriais de dados públicos. Corrigidas categorias desativadas, ordem editorial, relações de parceiros/lugares arquivados e manutenção do arquivo durante restauração/edição. Incluída a integração no CI.

## Arquivos criados
src/modules/admin/service.ts; scripts/verify-admin.ts; logs em artifacts/validation/block-08/; este relatório. A lista exata dos arquivos entregues e seus hashes consta no MANIFEST.json da pasta/ZIP.

## Arquivos modificados
src/modules/admin/actions.ts; src/modules/admin/validation.ts; src/modules/content/repository.ts; páginas de edição/preview do Admin; .github/workflows/ci.yml; README.md; WORK_STATE.md; VALIDATION_REPORT.md.

## Decisões
Arquivamento não apaga histórico ou dados de viagem. Um lugar marcado como parceiro só participa da descoberta se houver parceiro publicado disponível. Arquivar o lugar oculta seus parceiros, experiências e eventos relacionados no público. Editor retém lugares publicados ainda sem parceiro para evitar dependência circular na criação. Categoria desativada perde exposição pública depois de publicar, sem eliminar a associação editorial armazenada. Restaurar ou editar arquivo não o republica implicitamente.

O seed contém a chave inexistente passaporte-descobertas em Bem-estar. Foi aplicada compatibilidade explícita para perfil-relaxar, já presente no Icon System v2. Não se desenhou ícone novo, nem se alterou o kit original. A normalização ocorre na consulta pública e validação de escrita do Admin.

## Testes realizados e resultado
PASS: 11 cenários de integração com banco real PGlite em memória. Para cada um dos seis tipos: criar, salvar rascunho, preservar publicado durante edição, publicar, rejeitar versão antiga sem nova auditoria, revisar, arquivar, restaurar e republicar. Cenários adicionais cobrem relações arquivadas, categoria desativada, ordenação e rollback de relacionamento indisponível. PASS: lint, TypeScript e 13 testes unitários. Build completo conferido no log do bloco antes do empacotamento.

ZIP individual e LATEST: existência, tamanho, abertura, CRC, lista exata e SHA-256 de todos os arquivos conferidos programaticamente. O PASS da entrega não promove gates de UI a aprovados.

## Problemas encontrados
O primeiro teste de ordenação falhou pelo ícone inexistente no seed. Log original preservado; correção aplicada e todos os cenários reexecutados com sucesso. Também foi corrigida a possibilidade de reexpor conteúdo arquivado simplesmente ao restaurar rascunho.

Docker/PostgreSQL/Chromium permanecem indisponíveis na conferência desta retomada. Foi iniciada uma nova tentativa limitada de download; a execução não forneceu conclusão de instalação e o executável permaneceu ausente. Não houve instalação confirmada, execução E2E ou screenshots novas neste bloco. As capturas dos blocos anteriores foram preservadas.

## Pendências
PostGIS, 51 casos E2E em três viewports, Axe e validação HTTP do ciclo completo do Admin ainda pendentes. A integração usa o serviço real, mas não comprova autorização, cookies, foco, layout ou navegação. G1–G8 permanecem parciais. i18n e modelo relacional definitivo continuam documentados como pendências.

## Próximo passo recomendado
Bloco 09: executar a matriz UI/PostGIS em ambiente com os executáveis disponíveis; conferir as mudanças de arquivo/categorias na interface e atualizar gates. Não repetir downloads indefinidamente nem declarar testes não executados como PASS.
