# Iconografia

São 71 entradas e 364 aliases em português e inglês: gastronomia, bebidas, hospedagem, natureza, aventura, cultura, religião, turismo rural, compras, bem-estar, transporte, entretenimento, família, fotografia, serviços e esportes. A biblioteca contém também metadados de acessibilidade e mobilidade, disponíveis para uso explícito.

As entradas compartilham símbolos quando o significado permite. Existem 70 símbolos gráficos distintos: chá e sucos usam o mesmo copo. A cachoeira recebeu um pictograma vetorial próprio. A maior parte vem do Lucide v1.31.0, sob licença ISC, incluída na entrega. O script `scripts/build-icons.mjs` extrai apenas os nós dos ícones selecionados; o núcleo não carrega todo o Lucide nem depende do React.

A prioridade é customIcon → subcategory → category. Cada etapa aceita IDs e aliases normalizados. Keywords registradas explicitamente são consideradas depois das correspondências exatas; desconhecidos retornam map-pin. A normalização remove acentos, espaços excedentes e apóstrofos, converte espaços/underscores em hífens e usa minúsculas.

```ts
registerIcon({
  id: 'meu-icone', label: 'Meu nicho',
  svg: '<path d="M3 3L21 21"/>',
  aliases: ['meu-nicho', 'categoria-local'], keywords: ['palavra']
});
registerCategory({
  id: 'nova-categoria', defaultIcon: 'meu-icone', aliases: ['apelido']
});
```

O SVG personalizado deve ser um fragmento geométrico no espaço 0 0 24 24. São aceitos path, circle, ellipse, rect, line, polyline e polygon, com atributos em uma lista restrita. Tags devem ser autocontidas. Scripts, eventos, links, HTML, CSS e referências externas são rejeitados. Não passe o documento SVG inteiro: extraia suas primitivas permitidas.

O resultado é sempre um único grupo `data-stamp-icon`. Vários paths podem formar um único pictograma. Não acrescente folhas, estrelas temáticas, grãos ou outros símbolos semânticos como decoração. A seleção de um ícone customizado substitui o ícone anterior.
