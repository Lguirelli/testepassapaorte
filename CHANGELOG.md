# Changelog

## 2026-09-12 — Compatibilidade de build Vercel

- corrigidos os cinco erros TypeScript observados no deploy Vercel do commit `eba9a39`;
- updates Drizzle agora usam `.returning()` compatível com `drizzle-orm@0.45.2`;
- onboarding ganhou tipos explícitos derivados de `Profile`, sem coerção `as never`;
- Node fixado em `22.x`;
- Open Graph migrou de Edge para Node.js;
- origem pública usa `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL` quando `NEXT_PUBLIC_SITE_URL` não estiver definido;
- removida duplicação de `IDENTITY_PEPPER` em `.env.example`;
- adicionado `audit:vercel` ao gate estático;
- criado `VERCEL_DEPLOY.md`.

# Changelog final

## 1.0.0 — 2026-09-12

- Convergência para um único runtime Next.js.
- Modelagem relacional para conteúdo, viagens, visitas, QR, parceiro, tracking e sessões.
- Migração dos 12 atrativos pesquisados de Serra Negra com proveniência.
- Design system final, Home editorial, Light/Dark e reduced motion.
- Descoberta, mapa, páginas de lugar e parceiros.
- Sessão assinada server-side e RBAC `tourist`, `partner`, `admin`.
- Travel Engine determinístico, roteiro e calendário persistentes.
- QR, deduplicação, Visit, reencontro, Passaporte e exportações sociais.
- Portal do parceiro com ownership, solicitações e analytics próprios.
- Admin com CMS, Section Registry, QR, solicitações, maturação, auditoria e inteligência agregada.
- Consentimento de analytics, políticas, SEO, sitemap, robots e headers de segurança.
- Suítes unitárias/E2E atualizadas para o produto reconstruído.
- Documentação final de arquitetura, rotas, permissões, dados, migração, acessibilidade, testes e limitações.

## Hardening final de sanitização

- Sanitização compartilhada de texto, IDs, slugs, URLs, assets, contatos, redirects, objetos estruturados, telemetria e erros públicos.
- Pseudonimização de identidade por HMAC-SHA256 com `IDENTITY_PEPPER` separado de `SESSION_SECRET`.
- Bloqueio de credenciais `.local` e defaults de demonstração em produção.
- Analytics opcional sem identidade do viajante, sem query bruta e sem IDs privados de viagem; requisição nem é enviada antes do consentimento.
- Consentimento reversível em `/cookies`; negação remove identificadores opcionais do navegador.
- Redaction em profundidade para auditoria, saneamento de dados legados e rotina de retenção configurável.
- Limiar agregado mínimo de 3 observações para circulação/origens, reduzindo inferência em grupos pequenos.
- Rotas privadas de Admin e parceiro explicitamente dinâmicas.
- Auditoria automatizada integrada a `validate:static` para segredos, PII acidental, paths internos, HTML inseguro, JSON sem limite e regressões de privacidade.
- ZIP final passa por allowlist estrutural, varredura de material sensível, manifesto SHA-256 e validação após extração limpa.

## Refinamento responsivo global — 2026-09-12

- Responsividade redefinida como adaptação contínua por espaço disponível, conteúdo e método de entrada.
- Grids principais convertidos para comportamento intrínseco com `auto-fit`/`minmax()` e gaps fluidos.
- Container queries adicionadas à Home e `cqi` aplicado à composição espacial da galeria.
- Slider de tipos de roteiro removido de altura artificial fixa; conteúdo longo passa a determinar a geometria.
- Livro do Passaporte migrou de media query JavaScript da viewport para `ResizeObserver` do próprio container, preservando capítulo durante resize.
- Header, menu mobile, consentimento e diálogos passaram a respeitar safe areas e altura real com `dvh`.
- Tema continua acessível no menu compacto em vez de desaparecer por falta de largura.
- Calendário mensal e tabelas usam overflow horizontal deliberado quando a comparação precisa ser preservada.
- Hover transformativo é desativado em input coarse/no-hover.
- Regras para baixa altura, alto zoom, texto ampliado, labels longos e viewports estreitas foram incorporadas ao sistema global.
- Nova auditoria `audit:responsive` integrada ao `validate:static`.
- Nova suíte E2E responsiva cobre 347, 529, 713, 887, 1113 e 1371 px, landscape/baixa altura, texto em 200%, overflow e preservação de estado.

## GitHub deployment correction — 2026-09-12

- adicionado `github-pages/` como prévia navegável estática dedicada;
- adicionado `.github/workflows/deploy-pages.yml` para GitHub Pages via Actions;
- adicionado `.github/workflows/ci.yml` para validar o runtime Next.js completo;
- adicionado `index.html` raiz como fallback para repositórios ainda configurados como Pages pela raiz do branch;
- adicionado `.nojekyll` para evitar interpretação Jekyll do artefato estático;
- documentação técnica deixou de ser usada como entrada da publicação;
- produto Next.js server-side permanece canônico e separado da prévia estática.

## Aplicação sistêmica do comando global de UX/UI — revisão pós-GitHub Pages

- Corrigida a divergência entre o produto Next.js e a prévia publicada no GitHub Pages.
- Removido o runtime de Material Symbols da prévia; iconografia pública passa a usar o sistema SVG do projeto.
- Adicionada `github-pages/uxui-system.css` como camada normativa final de tokens, hierarquia, estados, foco, targets, motion e responsividade.
- Aplicado alvo mínimo de interação de aproximadamente 44×44 px nos controles principais da prévia e do runtime Next.
- Hover transformativo passa a existir apenas com `(hover: hover) and (pointer: fine)`; touch/coarse pointer não depende de hover.
- Menu compacto recebeu focus trap, Escape, retorno de foco, clique externo, bloqueio de scroll, safe areas e altura dinâmica.
- Ações primárias de cards deixaram de depender visualmente de hover para comunicar affordance.
- `main` deixou de atuar como live region global; feedback assistivo fica concentrado nos status/toasts apropriados.
- Linguagem pública foi simplificada para tarefa do turista, reduzindo termos de implementação, validação e demo.
- Grids e formulários passaram a usar reflow intrínseco; tabelas mantêm comparação por overflow deliberado quando necessário.
- Contraste aumentado, forced colors e reduced motion ganharam regras explícitas na camada normativa.
- Adicionada auditoria `audit:uxui` com 38 verificações estruturais e integração em `validate:static` e no workflow de deploy do GitHub Pages.
- Documentados o sistema em `docs/UX_UI_SYSTEM.md` e os achados/correções em `docs/UX_UI_AUDIT_REPORT.md`.
