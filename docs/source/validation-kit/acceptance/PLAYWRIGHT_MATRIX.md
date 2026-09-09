# Matriz Playwright — validação obrigatória

## Viewports

Executar pelo menos:

- desktop: 1440×1000;
- tablet: 1024×768;
- mobile: 390×844.

## Rotas públicas

1. `/`
2. `/explorar`
3. `/lugares/mirante-vale-das-araucarias`
4. `/parceiros/cafe-neblina-alta`
5. `/roteiro`
6. `/viagens/demo-trip-001/roteiro`
7. `/viagens/demo-trip-001/calendario`
8. `/meu-passaporte`

## Rotas Admin

1. `/admin`
2. `/admin/lugares`
3. edição de lugar
4. `/admin/experiencias`
5. `/admin/parceiros`
6. `/admin/eventos`
7. `/admin/categorias`
8. `/admin/fontes`

## Fluxos E2E obrigatórios

### A. Admin altera conteúdo público

1. entrar no Admin em modo mock;
2. editar descrição curta do `Café Neblina Alta`;
3. salvar como rascunho;
4. confirmar que a página pública ainda mostra a versão publicada;
5. abrir preview e confirmar rascunho;
6. publicar;
7. abrir `/parceiros/cafe-neblina-alta`;
8. confirmar nova descrição;
9. confirmar registro no histórico.

### B. Explorar

1. abrir `/explorar`;
2. pesquisar `café`;
3. aplicar filtro de parceiro;
4. abrir card;
5. voltar preservando estado quando aplicável.

### C. Roteiro

1. iniciar `/roteiro`;
2. selecionar datas demo;
3. companhia casal;
4. interesses gastronomia + natureza;
5. ritmo equilibrado;
6. transporte carro;
7. gerar roteiro demo;
8. abrir dia 1;
9. mover ou trocar uma parada;
10. confirmar que a mudança local não reconstrói silenciosamente todo o roteiro.

### D. Calendário

- Dia/Semana/Mês acessíveis;
- mobile não usa grade desktop comprimida;
- itens correspondem ao roteiro.

### E. Passaporte

- desktop apresenta duas páginas quando espaço permitir;
- mobile uma página por vez;
- botões de navegação existem além de swipe;
- visitas registradas são diferenciadas de itens apenas planejados;
- não exibir progresso gamificado, XP, streak ou ranking.

## Verificações automáticas por página

- sem erro de console inesperado;
- sem request 5xx;
- sem overflow horizontal não intencional;
- foco visível;
- navegação essencial por teclado;
- botões com nome acessível;
- imagens/placeholder com alt apropriado;
- ícones decorativos ocultos da árvore acessível;
- `prefers-reduced-motion` respeitado;
- screenshot salvo em `artifacts/playwright/<viewport>/`.

## Loop de correção obrigatório

Após cada bloco:

`implementar → lint → typecheck → testes → Playwright → screenshots → inspecionar → corrigir → repetir`

Não finalizar um bloco com testes falhando, layout evidentemente quebrado ou erros de console conhecidos sem registrar justificativa explícita.
