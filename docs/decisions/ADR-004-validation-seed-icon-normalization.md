# ADR-004 — Normalização de ícone inválido no seed de validação

**Status:** aceito para a build de validação.

## Contexto

O seed fornecido usava `passaporte-descobertas` na categoria Bem-estar, mas esse identificador não existe no Icon System v2 anexado, que é a fonte oficial de ícones desta build.

## Decisão

No seed operacional copiado para o repositório, Bem-estar usa `perfil-relaxar`, um ícone existente no Icon System v2 e semanticamente compatível. O pacote-fonte original permanece preservado em `docs/source/validation-kit/`, sem alteração.

## Consequência

Nenhum componente precisa inventar um SVG ou recorrer a biblioteca externa para preencher essa lacuna.
