# Arquitetura de validação

## Objetivo

Validar o vertical slice com o menor número de decisões irreversíveis. A aplicação é um monólito modular Next.js com contratos explícitos para conteúdo, viagem e providers externos.

## Camadas

1. `src/app`: rotas e APIs.
2. `src/components`: UI reutilizável e telas compostas.
3. `src/modules`: regras de domínio específicas, como Admin e `DemoTravelEngine`.
4. `src/core/repository`: contrato único de persistência, implementado por `LocalRepository` e `PostgresRepository`.
5. `src/providers`: abstrações mock para Auth, Maps, Routes, Weather, Storage e Analytics.
6. `src/design-system`: Icon System v2 e tokens.
7. `src/features/stamps`: motor procedural fornecido e integrado sem redesenho.

## Persistência

### Local

Arquivo `.data/validation-store.json`, criado a partir dos seeds. Serve para demonstração, Playwright local e fluxo Admin sem credenciais. Mantém entidades publicadas, drafts separados, auditoria, trip bundle e tracking.

### PostgreSQL/PostGIS

`content_entities`, `content_drafts`, `audit_logs`, `trip_bundles` e `tracking_events`. `content_entities.geom` usa `geometry(Point,4326)` com índice GIST. O adapter expõe o mesmo contrato do modo local.

## Publicação

A versão pública permanece em `entities/content_entities`. `saveDraft` grava uma cópia separada. Preview pede `draft:true`. `publish` promove o draft para a entidade pública e registra `before/after` na auditoria.

## Roteiro e Passaporte

`TripBundle` é a fonte compartilhada de roteiro, calendário e visitas. O roteiro expressa planejamento. `visits` expressa registro. O Passaporte gera carimbos somente das visitas existentes.

## Providers

Os modos padrão são mock e determinísticos. Nenhuma chave externa é necessária para a build de apresentação. Os contratos permitem troca futura sem acoplar UI à implementação.

## Identidade

Tokens semânticos e system font temporária. Light/Dark/System são implementados tecnicamente sem assumir paleta, fonte ou marca final.
