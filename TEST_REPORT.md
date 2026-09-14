# TEST REPORT

## Revisão Vercel Effects Restoration

### Evidência do deploy anterior fornecida pelo usuário

- Next.js 16.3.4: compilação de produção concluída.
- TypeScript: concluído sem erros.
- coleta de page data: concluída até geração de páginas.
- bloqueio observado: prerender de `/sitemap.xml` por ausência de `DATABASE_URL`.

### Correção

`src/app/sitemap.ts` agora é dinâmico e devolve o conjunto de rotas estáticas quando `DATABASE_URL` não está presente durante o build. Se o banco estiver disponível em runtime, acrescenta as páginas dinâmicas dos lugares. Falhas de sitemap não derrubam o deployment, mas páginas de produto continuam exigindo banco real.

### Gates executados nesta revisão

- Static structural validation: PASS
- Sensitive information scan: PASS
- Sanitization audit: PASS
- Responsive audit: PASS
- UX/UI audit: PASS
- Vercel audit: PASS, 9/9
- Interaction audit: PASS, 10/10
- TypeScript transpile syntax: PASS, 280 arquivos TS/TSX, 0 erros

### Cobertura do interaction audit

- Warp Text + pointer/reduced-motion guards
- Dock com requestAnimationFrame e escala sem reflow
- drag/inércia/snap da Circular Gallery
- blur/escala progressivos
- centralização explícita de cards laterais
- teclado do slider de roteiro
- transição de rota
- semântica e teclado dos pins SVG
- sitemap build-safe

### Não executado localmente

`npm ci` continua sem concluir por indisponibilidade de registry neste ambiente, portanto o `next build` desta revisão não é marcado como aprovado localmente. O redeploy Vercel é o teste autoritativo de build/runtime desta revisão.


### Playwright QA

- configuração Playwright auditada: PASS, 14/14 invariantes;
- Playwright Python 1.57 + Chromium 144: smoke real PASS;
- clique, viewport 390×844, reduced motion e ausência de overflow no harness: PASS;
- suíte E2E do runtime ampliada para Dock, Warp Text, Circular Gallery, slider, FAQ, Card Nav e pins do mapa;
- GitHub Actions instala Chromium e executa E2E/Axe automaticamente;
- execução TypeScript completa local do Playwright permanece não executada nesta máquina porque `npm ci` não conclui por falha de registry; não é marcada como aprovada.

- melhoria derivada do QA: targets do header, tema, ícones, fechamento mobile e dots da galeria elevados para 44 px; a suíte responsiva agora exige 44 px nos controles avaliados.
