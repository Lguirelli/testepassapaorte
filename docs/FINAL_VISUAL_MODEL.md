# Passaporte Serra Negra — Direção Visual V4 baseada nas referências RV

A showcase em `showcase/` é a referência visual navegável do projeto para a próxima etapa de implementação funcional.

## Fonte de verdade visual

A composição foi reconstruída usando as referências RV-01 a RV-49 fornecidas no pacote `Passaporte_Serra_Negra_Documentacao_e_Referencias_v4_2026-09-09.zip`.

As imagens originais foram mantidas apenas em `docs/source/visual-reference-v4/` como material de desenvolvimento. Elas não são utilizadas como assets públicos do site.

A matriz de aplicação está em:

`showcase/VISUAL_REFERENCE_IMPLEMENTATION.md`

## Direções consolidadas

- Home com hero full-bleed, header mínimo e busca dominante.
- Descoberta com composição editorial principal + cards menores.
- Roteiro representado também como elemento territorial/gráfico, não apenas lista.
- Explorar mais funcional, mantendo hero editorial e mapa com estado compartilhado.
- Página de lugar assimétrica e editorial.
- Página de parceiro com linguagem comercial própria, sem parecer um template turístico genérico.
- Onboarding com seletor orbital inspirado em RV-37/RV-38, mantendo alternativa clicável.
- Calendário minimalista, com Dia/Semana/Mês e sem aparência de dashboard corporativo genérico.
- Passaporte tratado como objeto físico digital, com capa, spreads, ticket, carimbos e caminho vivido.
- Admin visualmente separado da experiência turística, mas usando os mesmos tokens semânticos.

## Tipografia

A direção atual está parametrizada como:

- Home headings: `Druk Text Wide` com fallback seguro.
- Home subheadings/UI: `Helvetica Neue` com fallback seguro.
- Páginas internas, títulos: `Arimo`.
- Páginas internas, subtítulos/editorial: `Cormorant Garamond`.
- Body copy: `Helvetica Neue`/Helvetica/Arial.

O repositório não distribui arquivos de fontes comerciais. Para fidelidade total em produção, a equipe deve fornecer/licenciar os webfonts correspondentes.

## Paleta

Base neutra: off-white/creme, bege acinzentado, taupe, grafite, carvão e preto profundo. Cores secundárias aparecem apenas onde têm função de nicho, estado, rota ou carimbo.

## Validação

O script `scripts/capture_showcase.py` valida desktop e mobile para todas as nove superfícies principais, verifica overflow e erros de página, testa a navegação orbital, troca do calendário e preservação da materialidade do Passaporte em Dark Mode.
