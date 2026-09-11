# Apresentação da demonstração

Status: entrega da etapa concluída no escopo ajustado pelo usuário em 2026-09-11. Dados e serviços são demonstrativos. Não constitui homologação de produção.

## Preparar

Node 24, npm, `npm ci` e `npm run demo` a partir da pasta LATEST. A primeira execução instala o banco embarcado local com os seeds fornecidos. Abra http://localhost:4173. Internet pode ser necessária para instalar dependências; não são necessárias contas externas. `Ctrl+C` encerra o servidor. O comando não apaga edições existentes nem usa o banco de validação anterior.

Porta 4173 deve estar livre. Se estiver ocupada, encerre a instância anterior e repita. PGlite é single-process: não abra o mesmo diretório por outro programa. Não execute migração/seed enquanto o servidor está ativo. Para uma sessão nova, encerre o servidor e escolha um novo diretório com a variável DEMO_DATA_PATH; preserve o anterior.

## Roteiro de 10–15 minutos

1. Home `/`: apresentar a estrutura e o aviso de dados sintéticos; alternar claro/escuro/sistema.
2. Explorar `/explorar`: pesquisar, combinar filtros e comparar lista e mapa esquemático.
3. Abrir um lugar e um parceiro pelos cards: comparar conteúdo turístico e comercial; mostrar os placeholders explicitamente identificados.
4. Admin `/admin`: entrar pelo botão demo; abrir um conteúdo, salvar rascunho, conferir Preview e publicar. Demonstrar o histórico e a separação entre rascunho e público. As edições persistem localmente.
5. Roteiro `/roteiro`: completar onboarding com as datas demo 12–14/09/2026 e gerar o roteiro sintético; mover e fixar um item.
6. Abrir o calendário pela navegação da viagem: comparar dia, semana e mês; registrar uma presença demo para um lugar/data.
7. Passaporte `/meu-passaporte`: navegar o livro e comparar planejamento com as presenças registradas. Carimbos e mapa territorial oficiais continuam placeholders.

## Resultado a registrar

Anotar clareza da navegação, entendimento de rascunho/publicação, edição do roteiro, distinção entre planejamento e presença e problemas observados. Não apresentar a demonstração como dados reais, integração externa validada ou produto pronto para produção. Caso seja necessário restaurar um conteúdo editado, use o histórico e publique explicitamente.

## Evidências e continuação

VALIDATION_REPORT.md distingue testes aprovados, fluxos cloud dirigidos em 1363×936 e verificações não executadas. Há 57 E2E preparados, mas Chromium standalone, matriz de três viewports, Axe e PostGIS não foram aprovados. A dispensa desses requisitos vale para o encerramento desta etapa; não altera resultados históricos. docs/FINAL_ACCEPTANCE.md conserva o procedimento futuro.

Próximo passo de produto: apresentar o slice e registrar feedback priorizado. A implementação do escopo original desta demonstração está encerrada; novas integrações ou alterações funcionais dependem desse próximo escopo.
