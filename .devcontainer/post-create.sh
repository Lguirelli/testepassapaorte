#!/usr/bin/env bash
set -euo pipefail

npm ci
cat > .env.local <<'ENV'
DB_MODE=pglite
PGLITE_PATH=.data/pglite
AUTH_MODE=mock
MAPS_MODE=mock
ROUTES_MODE=mock
WEATHER_MODE=mock
STORAGE_MODE=local
ANALYTICS_MODE=local
ALLOW_DEMO=true
ENV

npm run db:migrate
npm run db:seed

echo "Codespace preparado. Execute: npm run dev"
