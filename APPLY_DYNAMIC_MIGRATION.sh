#!/usr/bin/env sh
set -eu
for path in \
  .nojekyll 404.html index.html app.js data.js tourism-data.js partners-page.js icon-registry.js ui-config.js ui-shell.js \
  styles.css visual-v2.css visual.css partners-page.css tourism-pages.css theme.css robots.txt site.webmanifest \
  assets demo lugares parceiros para-parceiros \
  scripts/static-demo-smoke.cjs scripts/visual-v2-browser-smoke.py .github/workflows/pages.yml
do
  rm -rf -- "$path"
done
printf '%s\n' 'Static runtime removed. Use npm ci && npm run db:migrate && npm run db:seed && npm run dev.'
