#!/usr/bin/env bash
set -euo pipefail
printf '\nPlaywright UI: http://localhost:9323\nApp preview:   http://localhost:3000\n\n'
exec npm run pw:ui
