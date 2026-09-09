# ADR-001 — Monólito modular

**Status:** aceito para validação.

## Decisão

Usar um único Next.js App Router com módulos internos separados por domínio.

## Motivo

O vertical slice precisa validar relações entre descoberta, conteúdo, roteiro, calendário, Passaporte e Admin antes de justificar serviços independentes. Um monólito modular reduz infraestrutura sem impedir extração posterior.

## Consequências

- Contratos de repository/provider devem impedir dependência direta das telas em infraestrutura.
- Fronteiras de módulo são mantidas por organização e tipos, não por deploy separado.
