# Passaporte Serra Negra — Icon System v2

## Regra central

A interface deve consumir ícones pelo componente `Icon` e por nomes semânticos do registry. Não referenciar códigos de prancheta (`O-003`, `A-001`, etc.) no código de produto. Esses códigos ficam somente no manifesto de proveniência.

```tsx
<Icon name="perfil-familia" />
<Icon name="clima-chuva" size="lg" />
<Icon name="admin-dashboard" title="Dashboard" />
```

## Escala

- `xs`: 16 px
- `sm`: 20 px
- `md`: 24 px, padrão
- `lg`: 32 px
- `xl`: 40 px

## Cor e temas

Glyphs de produção usam `currentColor`. A cor vem do contexto/token semântico, não do SVG. Isso torna o mesmo asset compatível com Light Mode, Dark Mode, hover, foco, disabled e estados de feedback.

## Acessibilidade

- Ícone puramente decorativo: não fornecer `title`; o componente aplica `aria-hidden`.
- Ícone que comunica significado sem texto adjacente: fornecer `title`.
- Botões devem ter nome acessível no próprio botão; o ícone não substitui o label.
- Estados nunca dependem somente de cor.

## Escopos

O registry separa semanticamente `core`, perfil de viagem, lugar/parceiro, clima, roteiro, calendário, QR, Passaporte, mapa, compartilhamento, área do parceiro e Admin/CMS. A separação é de significado, não de biblioteca: todos pertencem ao mesmo sistema visual.

## Admin/CMS

Ícones administrativos seguem a mesma família visual, mas não devem ser reutilizados em superfícies públicas quando o significado for operacional/administrativo.

## Reuso

Nomes semânticos podem apontar para o mesmo glyph. Isso é intencional. Exemplo: um mesmo desenho pode representar `perfil-a-pe` e `roteiro-caminhada`, mantendo APIs semânticas diferentes sem duplicar o componente.

## Alterações futuras

1. Preservar o nome semântico existente sempre que o significado permanecer o mesmo.
2. Não editar SVG diretamente dentro de páginas/componentes.
3. Adicionar o novo asset ao registry e manifesto.
4. Normalizar `currentColor`, IDs internos e acessibilidade.
5. Rodar `node scripts/validate-icons.mjs`.
