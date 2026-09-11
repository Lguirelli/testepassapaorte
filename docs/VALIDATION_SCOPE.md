# Escopo de validação v1

## Meta

Validar a arquitetura, navegação, componentes reutilizáveis, responsividade, edição pelo Admin e fluxo básico do turista antes da expansão do MVP.

## Vertical slice obrigatório

### Público / turista

- `/` Home de validação
- `/explorar`
- `/lugares/[slug]`
- `/parceiros/[slug]`
- `/roteiro` onboarding simplificado usando dados fictícios
- `/viagens/demo-trip-001/roteiro`
- `/viagens/demo-trip-001/calendario`
- `/meu-passaporte`

### Admin

- `/admin`
- `/admin/lugares`
- `/admin/lugares/[id]`
- `/admin/experiencias`
- `/admin/parceiros`
- `/admin/eventos`
- `/admin/categorias`
- `/admin/fontes`

## O que deve funcionar de verdade

- pesquisa e filtro no Explorar;
- navegação entre entidades;
- dados lidos de persistência, não hardcoded nos componentes;
- Admin cria, edita, salva rascunho, publica e arquiva entidades suportadas;
- alterações publicadas no Admin aparecem na superfície pública;
- preview do Admin usa os mesmos componentes públicos quando aplicável;
- histórico mínimo de alterações;
- relacionamento Place → Experience → Partner;
- roteiro demo coerente por dia;
- calendário demo usando os mesmos itens do roteiro;
- Passaporte demo distinguindo planejado de presença registrada;
- registry de ícones com Material Symbols Outlined via Google Fonts, preservando os nomes internos do Icon System v2;
- Light/Dark/System tecnicamente suportados por tokens, sem definir paleta final;
- textos preparados para i18n, com pt-BR como conteúdo inicial; en/es podem usar chaves ou conteúdo mínimo de validação, sem exigir tradução editorial completa nesta etapa;
- estados loading, empty, error e success nos componentes principais.

## O que não deve ser implementado nesta etapa

- identidade visual final;
- escolha de tipografia de marca;
- paleta de marca;
- logo final;
- fotografias reais;
- mapa vetorial final de Serra Negra;
- Google Maps real se exigir credenciais;
- weather provider real se exigir credenciais;
- Travel Engine completo ou score definitivo;
- QR antifraude definitivo;
- analytics avançado / Sankey final;
- fórmula comercial;
- pagamento ou reserva interna;
- Concierge White Label;
- dados reais de parceiros;
- gamificação além do que é necessário para representar o Passaporte;
- novo desenho de carimbos.

## Providers de validação

Implementar interfaces reais e adapters de demonstração:

- `AuthProvider`: `mock` por padrão; adapter preparado para Clerk.
- `MapsProvider`: `mock` por padrão; interface preparada para Google Maps.
- `RoutesProvider`: `mock` determinístico.
- `WeatherProvider`: `mock` determinístico.
- `StorageProvider`: armazenamento local/dev para placeholders; adapter substituível.
- `AnalyticsProvider`: coleta local/dev dos eventos necessários para testes.

Nenhum provider mock deve vazar para produção silenciosamente. Exibir `DEMO MODE` em desenvolvimento e exigir configuração explícita para trocar de adapter.
