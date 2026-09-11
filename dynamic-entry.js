(() => {
  const doc = document;
  const status = doc.querySelector('[data-dynamic-status]');
  const links = doc.querySelector('[data-dynamic-links]');
  const routeMeta = doc.querySelector('meta[name="dynamic-route"]');

  const cleanOrigin = value => String(value || '').trim().replace(/\/$/, '');
  const normalizeRoute = value => {
    let route = String(value || '/').trim();
    if (!route.startsWith('/')) route = `/${route}`;
    route = route.replace(/\/index\.html$/i, '/').replace(/\.html$/i, '');
    if (route === '/para-parceiros' || route === '/para-parceiros/') route = '/parceiros';
    if (route === '/lugares' || route === '/lugares/') route = '/pontos-turisticos';
    return route || '/';
  };

  const currentParams = new URLSearchParams(location.search);
  const override = cleanOrigin(currentParams.get('__app'));
  currentParams.delete('__app');

  const explicitRoute = routeMeta?.getAttribute('content');
  const fallbackRoute = location.pathname || '/';
  const route = normalizeRoute(explicitRoute === '__CURRENT_PATH__' ? fallbackRoute : explicitRoute || fallbackRoute);
  const query = currentParams.toString();
  const suffix = `${route}${query ? `?${query}` : ''}${location.hash || ''}`;

  if (override) {
    try { localStorage.setItem('passaporteDynamicOrigin', override); } catch {}
  }

  let stored = '';
  try { stored = cleanOrigin(localStorage.getItem('passaporteDynamicOrigin')); } catch {}

  const host = location.hostname || 'localhost';
  const localHost = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(host) ? 'localhost' : host;
  const candidates = [...new Set([
    override,
    stored,
    `http://${localHost}:4173`,
    `http://${localHost}:3000`,
  ].filter(Boolean))];

  const setStatus = message => { if (status) status.textContent = message; };
  const dynamicUrl = origin => `${cleanOrigin(origin)}${suffix}`;

  if (links) {
    links.innerHTML = candidates.map((origin, index) =>
      `<a href="${dynamicUrl(origin)}" data-origin="${origin}">${index === 0 ? 'Abrir aplicação dinâmica' : `Tentar ${origin}`}</a>`
    ).join('');
  }

  const probe = async origin => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 900);
    try {
      await fetch(`${cleanOrigin(origin)}/health`, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });
      return true;
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
    }
  };

  (async () => {
    setStatus('Procurando a aplicação dinâmica…');
    for (const origin of candidates) {
      if (await probe(origin)) {
        setStatus(`Conectando em ${origin}…`);
        location.replace(dynamicUrl(origin));
        return;
      }
    }
    setStatus('A aplicação dinâmica não respondeu. Inicie o Next.js com “npm run dev” e tente novamente.');
  })();
})();
