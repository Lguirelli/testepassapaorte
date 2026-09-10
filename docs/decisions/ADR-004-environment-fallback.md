# ADR-004: explicit validation fallback

The requested production architecture remains Next.js + PostgreSQL/PostGIS + Drizzle. Docker and PostgreSQL binaries are absent in this execution environment, and installing the service failed due to OS permission restrictions. `DB_MODE=pglite` explicitly selects embedded PostgreSQL for local verification only. This mode does not load PostGIS. No geographic computation claims are made; maps and travel times remain deterministic mocks as requested.

The standalone Playwright runner could not launch because Chromium was unavailable and its download timed out. Browser inspection uses the available cloud browser through its documented Playwright API. Its viewport is 1363×936 and cannot be resized through that API. Requested desktop/tablet/mobile tests are included in the repository, but their execution remains pending unless the standalone runtime becomes available. Gates must distinguish code/build checks from full E2E acceptance.

The G1 browser/DB requirements are thus partially blocked by infrastructure. Continuing implementation with these explicit fallbacks does not mark G1 or later acceptance gates as fully passed.
