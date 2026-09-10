# Arquitetura de validação

Monólito modular Next.js App Router, React e TypeScript strict. Rotas server renderizam conteúdo persistido e componentes client tratam interações locais. Módulos: content, admin, trips, calendar, passport e tracking. Design system usa exclusivamente o Icon System v2 fornecido e tokens neutros temporários.

## Persistência
Drizzle sobre PostgreSQL; Compose fornece PostGIS. PGlite é fallback explícito para o ambiente sem Docker, não valida extensão nem consultas geográficas. Migration inicial transacional e idempotente, sem ledger de evolução ainda. Seed cria 30 registros de conteúdo e uma viagem e preserva IDs existentes.

Conteúdo contém draft/published, estado, versão e flag synthetic. Auditoria mantém antes/depois. Viagem usa agregado JSONB tipado; movimentar uma parada não reconstrói dias alheios. Fixados, removidos recuperáveis e registros de visita são preservados pela geração explícita. Schema v0: relações verificadas na aplicação, sem compromisso com o modelo definitivo.

## Admin e concorrência
Login mock de administrador, cookie assinado com validade, autorização no servidor e transações com comparação de versão. Salvar não publica; preview usa componentes públicos com dados draft; publicar promove a versão; arquivo retira a entidade da consulta pública. O login é exclusivo de demonstração e não oferece isolamento multiusuário real. Relações entre registros arquivados ainda precisam de regressão integral.

## Providers
AuthProvider, MapsProvider, RoutesProvider, WeatherProvider, StorageProvider e AnalyticsProvider têm contratos substituíveis. Mocks são determinísticos. Ausência de clima não gera previsão inventada. Mapa é esquema funcional; deslocamentos são estimativas demo sem garantia geográfica. Modo demo em produção exige ALLOW_DEMO explícito.

## Passaporte
Trip.visits é a fonte de evidência; itens planejados nunca são convertidos em presença automaticamente. Registro manual demo tem deduplicação por lugar/dia, classificação de retorno e transação com tracking. StampRenderer é placeholder substituível, sem desenho oficial presumido. Livro adapta a quantidade de páginas pela largura; viewport mobile ainda depende de execução da suíte.

## Continuidade
LATEST.zip inclui fontes, assets, fixtures, migrations, lockfile, CI, testes, evidências e WORK_STATE.md. Não inclui dependências reinstaláveis, builds ou bancos binários temporários. Reproduz o cenário inicial pelo seed; as mutações feitas durante QA ficam documentadas, não alteram os fixtures. block_XX.zip é um delta sobre o checkpoint anterior. MANIFEST.json enumera hashes dos arquivos; scripts/deliver-block.py confere a correspondência exata da pasta e do ZIP.
