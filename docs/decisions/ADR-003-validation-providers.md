# ADR-003: providers de validação

AuthProvider, MapsProvider, RoutesProvider, WeatherProvider, StorageProvider e AnalyticsProvider são contratos substituíveis. Adapters atuais são locais ou determinísticos e não fazem chamadas comerciais externas.

ALLOW_DEMO=true é obrigatório ao executar o build em modo de produção. Modos desconhecidos falham explicitamente. Links example.invalid nunca são navegáveis. Os mapas mostram posições esquemáticas e a distância estimada entre coordenadas sintéticas não é roteamento viário. WeatherProvider retorna ausência explícita para datas não presentes no fixture.

StampRenderer deve ser substituído pelo motor oficial quando entregue; esta build contém apenas representação identificada como placeholder.
