# Rotas canônicas

## Público

| Rota | Responsabilidade |
|---|---|
| `/` | Home editorial e descoberta |
| `/explorar` | Busca, filtros, lista e preview territorial |
| `/mapa` | Exploração territorial do mesmo dataset |
| `/pontos-turisticos` | Índice de atrativos |
| `/lugares/[slug]` | Detalhe de lugar |
| `/parceiros` | Landing B2B |
| `/parceiros/[slug]` | Página pública do parceiro |
| `/roteiro` | Onboarding de viagem |
| `/meu-passaporte` | Passaporte autenticado |
| `/q/[code]` | Contexto e registro de presença |
| `/compartilhar/[tripId]` | Exportações da viagem |
| `/privacidade`, `/termos`, `/cookies`, `/acessibilidade` | Políticas |

`/para-parceiros` redireciona permanentemente para `/parceiros`.

## Viagem autenticada

- `/viagens/[tripId]/roteiro`
- `/viagens/[tripId]/calendario`

## Parceiro

- `/painel-parceiro`
- `/painel-parceiro/minha-pagina`
- `/painel-parceiro/solicitacoes`
- `/painel-parceiro/analytics`

## Admin

- `/admin`
- `/admin/conteudo`
- `/admin/secoes`
- `/admin/lugares`
- `/admin/parceiros`
- `/admin/eventos`
- `/admin/fontes`
- `/admin/qr`
- `/admin/solicitacoes`
- `/admin/analytics`
- `/admin/maturacao`
- `/admin/auditoria`
