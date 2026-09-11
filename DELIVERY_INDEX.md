# Índice das entregas

O projeto completo mais recente está em `LATEST.zip`. ZIPs individuais a partir de 06 contêm os arquivos relacionados ao bloco, com caminhos relativos preservados dentro de block_XX/. Aplique seu conteúdo sobre o snapshot correspondente; para instalação limpa use LATEST. Não misture esta build neutra com versões de outros projetos ou reconstruções PSD.

| Bloco | Objetivo | Pacote |
|---|---|---|
| 00 | Bootstrap e arquitetura | passaporte-bloco-00.zip |
| 01 | Home e Explorar | passaporte-bloco-01.zip |
| 02 | Lugar e Parceiro | passaporte-bloco-02.zip |
| 03 | Admin operacional | passaporte-bloco-03.zip |
| 04 | Onboarding e roteiro | passaporte-bloco-04.zip |
| 05 | Calendário | passaporte-bloco-05.zip |
| 06 | Passaporte | block_06.zip |
| 07 | Regressão e documentação | block_07.zip |
| 08 | Integridade editorial e integração Admin | block_08.zip |
| 09 | Confirmação UI das correções | block_09.zip |
| 10 | Execução final e continuidade | block_10.zip |

Os pacotes antigos foram preservados; não estão duplicados dentro do snapshot mais recente. Cada bloco novo contém BLOCK_REPORT.md e MANIFEST.json. WORK_STATE.md é a referência de continuidade; VALIDATION_REPORT.md reúne evidências e limitações. docs/FINAL_ACCEPTANCE.md explica como concluir os testes bloqueados.

Esta entrega não contém node_modules, caches, builds, segredos ou banco binário. Fixtures recriam o cenário inicial. Mudanças temporárias de QA são evidências nos relatórios/capturas, não alterações do seed. O Git local permanece com os commits; o ZIP é um snapshot de fontes, não uma cópia do diretório .git.

Bloco 11 adicional: `block_11.zip`, tentativa explícita de aceitação com a URL demo configurada. Resultado BLOCKED, apenas evidências e documentação alteradas. Nenhuma nova aprovação de gate.

Bloco 12: `block_12.zip`, encerramento no escopo ajustado, comandos de demonstração sem Chromium/PostGIS, roteiro de apresentação e evidências de preparo. `LATEST.zip` é o snapshot completo atual. Próximo passo: apresentação e feedback; aceitação integral futura preservada.
