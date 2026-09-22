# Arquitetura

## Decisão principal

O Passaporte Serra Negra possui um único runtime de produção em Next.js. A SPA estática anterior não faz parte do runtime final.

## Camadas

- `src/app`: páginas, route handlers e layouts.
- `src/core/auth`: sessão assinada, RBAC e autorização server-side.
- `src/core/db`: Drizzle, PostgreSQL/PGlite e schema.
- `src/modules/content`: repositório relacional, filtros, persistência editorial e Section Registry.
- `src/modules/trips`: Travel Engine determinístico, persistência, edição e evidência.
- `src/modules/qr`: resolução de QR e criação/deduplicação de `Visit`.
- `src/modules/passport`: objeto Passaporte derivado de visitas registradas.
- `src/modules/partners`: ownership, edição permitida, solicitações e analytics próprios.
- `src/modules/admin`: CMS, operações e governança.
- `src/modules/tracking`: eventos, consentimento e analytics.
- `src/design-system`: tokens, motion e SVGs.

## Persistência

`0000_validation.sql` representa a base histórica preservada para migração. `0001_relational_domain.sql` cria o domínio relacional e renomeia as antigas tabelas editoriais. `0002_final_product.sql` retira o JSONB da viagem do runtime canônico, preservando-o somente como coluna legada nullable, e adiciona `auth_sessions`.

A UI pública lê `places`, `partners`, `experiences`, `events`, categorias, mídia e fontes por `src/modules/content/repository.ts`. `editorial_drafts` é somente staging de edição/preview.

## Autorização

A sessão contém um identificador assinado em cookie `httpOnly`; o papel é lido da tabela `auth_sessions`. Papéis enviados pelo navegador não são aceitos como autoridade. A área do parceiro resolve o `partnerId` a partir da sessão; viagens são filtradas pelo proprietário no servidor; Admin exige `role=admin`.

## Viagem

O pipeline aplica restrições, pontua interesses/intenções, evita entidades sintéticas, distribui paradas por dia e preserva itens fixados/manuais em regenerações. `TripItem.source` distingue recomendação, adição e alteração do usuário.

## QR e Passaporte

QR resolve um lugar antes do login, preserva o contexto, aplica janela anti-duplicidade e cria `visits`. `visit_number` identifica reencontros. O Passaporte deriva sua memória exclusivamente desses registros, não de inferência sobre o roteiro.

## Inteligência

Tracking opcional é consentido. O Admin agrega funil de evidência, planejado versus registrado e sequências A→B baseadas em visitas registradas por viagem. Não existe localização em tempo real nem exibição de jornada individual como mapa de circulação.


## Sanitização e fronteiras

`src/core/security/sanitize.ts` é a camada compartilhada para validação/normalização de IDs, texto, URLs, assets, contatos, redirects, telemetria e mensagens de erro. Schemas de domínio continuam responsáveis por semântica e autorização continua independente da sanitização. APIs JSON aplicam origem + limite real de corpo + schema estrito. Conteúdo editorial usa versões completas sanitizadas para restore e auditoria minimizada para rastreabilidade. Consulte `SANITIZATION_AND_PRIVACY.md`.

### Identidade, privacidade e observabilidade

Identidade de acesso e identidade operacional são separadas. O e-mail é validado na fronteira de login e convertido em `authSubject` por HMAC-SHA256 com `IDENTITY_PEPPER`; `traveler-*`, `partner-user-*` e `admin-*` derivam desse subject pseudônimo. O `SESSION_SECRET` possui finalidade separada e não pode compartilhar o mesmo valor em produção.

Analytics opcional não recebe a identidade do viajante nem IDs privados de viagem. O cliente só envia eventos após consentimento explícito; payloads usam allowlist e paths privados são generalizados. Circulação territorial e dimensões de origem aplicam limiar agregado mínimo de 3 observações.

Retenção operacional é executável por `npm run privacy:cleanup`. Dados legados podem ser redigidos/pseudonimizados por `npm run db:sanitize`. As áreas `/admin` e `/painel-parceiro` são explicitamente dinâmicas e aplicam autorização server-side antes da renderização do conteúdo privado.


## Responsividade como camada de arquitetura

A apresentação evita inferência de dispositivo. Layouts usam Grid/Flex intrínsecos, `minmax()`, `clamp()`, `auto-fit`, unidades de viewport modernas e container queries quando o componente pode viver em contextos diferentes. O Passaporte observa o próprio container; mudanças de largura preservam estado em vez de remount. O contrato completo está em `RESPONSIVE_SYSTEM.md`.
