# IMPLEMENTATION NOTES — `/parceiros`

## Escopo

Reconstrução da landing institucional B2B **Para parceiros** a partir de `parceiros.psd`, preservando a arquitetura real da demo estática publicada no GitHub Pages. A build atual usa roteamento por hash, portanto a rota funcional é `#/parceiros`; um arquivo físico `parceiros/index.html` redireciona para essa rota para permitir entrada por `/parceiros/`. As páginas individuais continuam em `#/parceiros/{slug}`.

## Mapeamento visual do PSD

| Ordem visual | Layer do PSD | Y aprox. | Geometria | Função implementada |
|---:|---|---:|---|---|
| 1 | Camada 7 | 0 | 691×332 | Hero fotográfico de aquisição B2B |
| 2 | Camada 1 | 319 | 646×115 | Ecossistema e categorias |
| 3 | Camada 2 | 434 | 646×253 | Mosaico “Mais do que uma vitrine” |
| 4 | Camada 5 | 678 | 652×343 | Por que participar |
| 5 | Camada 8 | 1020 | 615×470 | Storytelling “Como a rede funciona” |
| 6 | Camada 6 | 1472 | 633×342 | Formas de participação com tabs |
| 7 | Camada 9 | 1736 | 625×216 | Manifesto escuro |
| 8 | Camada 3 | 1952 | 592×471 | Grid de seis recursos |
| 9 | Camada 10 | 2423 | 567×556 | Jornada + CTA final |

A ordem foi definida por posição vertical no canvas, não pela ordem da pilha de layers.

## Arquitetura

- `partners-page.js`: configuração editorial e renderização dos nove blocos.
- `partners-page.css`: estilos isolados da landing B2B.
- `app.js`: apenas integração de rota, estado da tab e ações de scroll/CTA.
- `index.html`: navegação global aponta para `#/parceiros`.
- `parceiros/index.html`: entrada física para hosts estáticos.
- `para-parceiros/index.html`: compatibilidade com o destino temporário anterior.

## Interações

- CTA do hero rola até o bloco de contato.
- CTA secundário rola até “Como a rede funciona”.
- tabs acessíveis em `role=tablist` alteram o painel sem reload.
- manifesto rola até o grid de recursos.
- CTA final é demonstrativo e exibe confirmação sem enviar dados.
- links para a experiência do visitante e páginas individuais permanecem funcionais.

## Fotografias temporárias

Foram reutilizadas as **fotografias reais de banco já empacotadas localmente** em `assets/stock/`, evitando URLs remotas e vetores como mídia principal. Elas são ilustrativas e não representam empresas reais de Serra Negra. Créditos e origem permanecem em `ASSET_SOURCES_STOCK_IMAGES.md` e `assets/stock/SOURCES.json`.

## Conteúdo comercial

Não foram criados preços, métricas, cases, depoimentos, empresas reais, telefone, WhatsApp, e-mail ou SLA. O CTA de contato é explicitamente demonstrativo.

## Compatibilidade

A landing institucional não substitui páginas individuais. `#/parceiros/cafe-neblina-alta` e demais slugs continuam usando o renderer existente de parceiro. `/explorar` também permanece intacto.
