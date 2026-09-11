# Correções realizadas — Passaporte Serra Negra

## Escopo

Aplicação direta das correções solicitadas no repositório, sem depender do Work.

## Ícones

- 154 SVGs dos três pacotes recebidos foram consolidados em `assets/icons-v3/`.
- O registry contém 308 chaves entre nomes semânticos e aliases/raw para cobertura integral.
- A aplicação usa `icon-registry.js` e CSS Mask com `currentColor`; não depende mais de `<img>` preto para ícones funcionais.
- Foram criados agrupamentos de navegação, perfil, lugares, clima, roteiro, calendário, QR, Passaporte, mapa, compartilhamento, parceiros e Admin.
- `validation/icon-catalog.html` renderiza o catálogo automaticamente.

## Tema e contraste

- `theme.css` passou a ser a última camada da cascata.
- Tokens semânticos foram criados para canvas, superfícies, texto, ícones, bordas, ações, foco e estados.
- O texto muted claro foi alterado para `#5E5A50`.
- Borda de controle clara: `#8A8378`, 3.32:1 sobre a superfície principal.
- Borda de controle dark: `#817B7B`, 3.47:1 sobre a superfície dark.
- Superfícies de papel do Passaporte possuem foreground próprio e não herdam texto claro do dark mode.
- Cards de nicho recebem pares explícitos de background/foreground.
- Foram corrigidas regras legadas que forçavam texto preto em `route-types` e texto escuro em cards de parceiros no dark mode.
- Todos os pares semânticos testados em `validation/contrast-audit.json` passam seus alvos.

## Interface dinâmica

- Header e footer são gerados por `ui-shell.js` a partir de `ui-config.js`.
- Navegação, metadados, filtros, FAQ, seções da Home, onboarding, capítulos do Passaporte, módulos Admin, schemas Admin e páginas legais estão centralizados em configuração.
- O router passou para um registry de rotas.
- O calendário mensal é calculado pelo mês/ano da viagem, sem setembro/2026 e 30 dias fixos no renderer.
- Datas do Passaporte e de visitas são derivadas do estado/dados da viagem; o horário do registro demo usa o relógio local do navegador quando não existe relógio de demo configurado.
- Novas paradas usam `nextAvailableStart()` e não recebem `17:00` fixo.
- Pins usam coordenadas reais quando disponíveis e fallback determinístico; não há array manual de posições por lugar.
- A linha visual de roteiro distribui paradas de forma calculada.
- Para Parceiros foi convertida para conteúdo e ordem de seções data-driven.
- Admin passou a usar módulos e formulários schema-driven.
- O bug de `onboardingSteps` ausente na raiz foi eliminado ao centralizar o onboarding na configuração.
- Menu mobile alterna dinamicamente os ícones Menu/Fechar.

## Deploy

O workflow `.github/workflows/pages.yml` agora inclui `theme.css`, `icon-registry.js`, `ui-config.js`, `ui-shell.js`, `tourism-data.js`, `partners-page.js`, seus CSS e as rotas físicas. O artefato equivalente a `pages-dist` foi montado localmente com sucesso e todas as dependências declaradas no `index.html` existem.

## Auditoria estática

```json
{
  "legacy_icon_paths": 0,
  "unicode_arrow_icons": 0,
  "fixed_visit_datetime": 0,
  "fixed_calendar_30_days": 0,
  "fixed_route_1700": 0,
  "static_header_tag_in_index": 0,
  "static_footer_tag_in_index": 0,
  "old_icon_img_runtime": 0,
  "icons_v3_files": 154,
  "dynamic_markers": {
    "CONFIG.home.sections": true,
    "CONFIG.home.faq": true,
    "CONFIG.onboarding": true,
    "CONFIG.passport.chapters": true,
    "CONFIG.admin.modules": true,
    "CONFIG.legal": true,
    "ROUTES": true,
    "mapPositions": true,
    "nextAvailableStart": true
  }
}
```

## Limpeza incorporada

A cópia antiga `demo/`, o conjunto antigo `assets/icons/` e o backup intermediário de `app.js` foram removidos da entrega para evitar duas fontes operacionais concorrentes.

## Limitação da validação visual

O Chromium instalado no ambiente recusou navegação local e `file://` com `ERR_BLOCKED_BY_ADMINISTRATOR`. Portanto não foi possível gerar uma bateria real de screenshots aqui. Foram executados: `node --check` nos JavaScript, validação de todas as chaves/caminhos do icon registry, montagem do artefato de Pages, verificação das dependências do `index.html`, auditoria de hardcodes e cálculo WCAG dos tokens principais.


## Correção v4 de contraste

A camada de tema foi refeita para distinguir superfícies adaptativas, contextos editoriais sempre escuros e superfícies de papel sempre claras. Foi adicionado `data-resolved-theme` para unificar Dark e Sistema/Dark. Consulte `DARK_MODE_CONTRAST_FIX_V4.md`.
