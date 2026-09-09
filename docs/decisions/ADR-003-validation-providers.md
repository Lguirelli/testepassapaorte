# ADR-003 — Providers substituíveis e modo demo

**Status:** aceito para validação.

## Decisão

Auth, Maps, Routes, Weather, Storage e Analytics ficam atrás de interfaces. Desenvolvimento usa mocks determinísticos e sem credenciais.

## Motivo

A build valida experiência e arquitetura sem transformar indisponibilidade de serviços externos em bloqueio. Integrações reais entram depois, preservando contratos.
