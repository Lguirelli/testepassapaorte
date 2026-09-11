# Bloco 03: Admin operacional

Implementadas as seis listas, formulários orientados por metadados, criação, rascunho, preview, publicação, revisão, arquivamento, auditoria e restauração como nova versão.

Executado no navegador disponível: login mock, lista de lugares, edição de Café Neblina Alta, salvar rascunho, comparação com descrição pública anterior, preview do rascunho, publicação e confirmação da nova descrição pública. Histórico registrou draft e publish com ator e horário. Estado persistiu após reinício do preview.

Corrigidos: mensagem de sucesso perdida por remontagem do formulário; zero indevido ao renderizar lista de acessibilidade vazia; valor vazio de select opcional rejeitado na validação. Tests unitários cobrem assinatura, expiração, URLs, intervalo de evento e descarte de campos não autorizados.

A suíte E2E dos três viewports e o CRUD completo das seis entidades ainda exigem execução no ambiente com Chromium. Não marcar G4 como plenamente aprovado.
