# Arquitetura dinâmica oficial

## Fonte de verdade

O repositório possui uma única aplicação executável: **Next.js em `src/`**.

Foram removidos da raiz os runtimes estáticos antigos (`index.html`, `app.js`, folhas CSS paralelas, dados globais JS e diretórios HTML de redirects). Eles não devem ser recriados como segunda aplicação.

## Rotas públicas

- `/` — Home
- `/explorar` — descoberta geral
- `/explorar?relation=public_point` — pontos turísticos
- `/explorar?view=map` — mapa
- `/parceiros` — aquisição / programa para parceiros
- `/parceiros/[slug]` — detalhe de parceiro
- `/lugares/[slug]` — detalhe de ponto turístico
- `/roteiro` — onboarding para montar roteiro
- `/viagens/[tripId]/roteiro` — roteiro existente
- `/viagens/[tripId]/calendario` — calendário
- `/meu-passaporte` — Passaporte
- `/admin/**` — administração

As URLs e a navegação principal são centralizadas em `src/core/routing/routes.ts`.
A classificação de página usada por estilos e comportamento é centralizada em `src/core/routing/page-kind.ts`.

## CSS e interações

Existe uma única base global em `src/app/globals.css`. Não há cascata entre múltiplas folhas concorrentes da antiga SPA.

Efeitos interativos são opt-in. Por exemplo, somente `.place-card` recebe elevação/escala; `.card` e `.panel` não recebem movimento automaticamente. Isso impede que uma alteração visual genérica alcance componentes de páginas não relacionadas.

## Conteúdo migrado

Os 12 atrativos públicos pesquisados que antes eram injetados por `tourism-data.js` foram movidos para `seed/validation-content.json`. As mídias locais necessárias foram movidas para `public/assets/`.

## Deploy

GitHub Pages foi removido porque não executa SSR/rotas dinâmicas do Next.js. O build usa `output: 'standalone'` e pode ser executado como servidor Node ou imagem Docker. O workflow `dynamic-build.yml` produz um artefato de servidor, mas não presume um provedor de hospedagem específico.
