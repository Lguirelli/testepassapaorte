# Inventário de dados

## Dados reais pesquisados

`seed/tourism-real.json` contém 12 atrativos de Serra Negra, SP:

1. Fontana di Trevi em Serra Negra
2. Mirante do Alto da Serra
3. Mirante do Cristo Redentor
4. Parque Ecológico Adib João Dib
5. Parque Ecológico Dr. Jovino Silveira
6. Teleférico Serra Negra
7. Igreja Matriz Nossa Senhora do Rosário
8. Parque Fonte Santo Agostinho
9. Parque das Fontes
10. Praça das Rotas Turísticas
11. Feira de Artesanato de Serra Negra
12. Parque Aquático Municipal

Cada registro mantém `sourceIds`, dados de verificação e imagem/atribuição quando disponíveis. Assets ficam em `public/assets/tourism` com `SOURCES.json`.

## Dados sintéticos

`seed/validation-content.json` contém negócios/parceiros, experiências, eventos e alguns pontos legados necessários para exercitar fluxos. Todos são persistidos como `synthetic=true`. Os três pontos turísticos sintéticos legados ficam `discovery_visible=false`.

Dados sintéticos nunca devem ser interpretados como parceria comercial confirmada.

## Fontes de verdade

- Conteúdo público: tabelas relacionais.
- Draft/preview editorial: `editorial_drafts`.
- Viagens: `trips`, `trip_days`, `trip_items`.
- Presença: `visits`.
- QR: `qr_codes`.
- Consentimento: `consent_records`.
- Sessões autenticadas: `auth_sessions`.
- Analytics: `tracking_events` e agregações derivadas.

## Dados privados e pseudônimos

- `traveler_users.auth_subject` e `partner_users.auth_subject` recebem subject derivado por HMAC; o e-mail puro não é persistido nessas tabelas.
- `trips`, `trip_days`, `trip_items` e `visits` contêm dados privados de viagem e são protegidos por ownership/RBAC.
- `anonymous_visitors` e `sessions` são identificadores técnicos usados apenas após consentimento de analytics.
- `tracking_events` usa payload por allowlist e não anexa `travelerUserId` aos eventos de produto/analytics.
- `consent_records` registra finalidade, estado e versão da política sem exigir identidade civil.
- `audit` usa ator pseudônimo e snapshots mínimos/redigidos.

## Segredos

`SESSION_SECRET`, `IDENTITY_PEPPER`, senhas do adaptador local e `DATABASE_URL` pertencem exclusivamente ao ambiente. O ZIP distribui apenas `.env.example`, sem valores operacionais.

## Retenção

O repositório inclui `scripts/privacy-maintenance.ts` para expurgo de analytics, sessões anônimas, consentimentos, sessões autenticadas revogadas/expiradas e auditoria conforme parâmetros de ambiente.
