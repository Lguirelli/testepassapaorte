export type PageKind =
  | 'home'
  | 'explore'
  | 'partner-acquisition'
  | 'partner-detail'
  | 'tourism-detail'
  | 'onboarding'
  | 'trip-route'
  | 'calendar'
  | 'passport'
  | 'admin'
  | 'system';

export function pageKindForPath(pathname:string):PageKind {
  if (pathname === '/') return 'home';
  if (pathname === '/explorar') return 'explore';
  if (pathname === '/parceiros') return 'partner-acquisition';
  if (/^\/parceiros\/[^/]+\/?$/.test(pathname)) return 'partner-detail';
  if (/^\/lugares\/[^/]+\/?$/.test(pathname)) return 'tourism-detail';
  if (pathname === '/roteiro') return 'onboarding';
  if (/^\/viagens\/[^/]+\/roteiro\/?$/.test(pathname)) return 'trip-route';
  if (/^\/viagens\/[^/]+\/calendario\/?$/.test(pathname)) return 'calendar';
  if (pathname === '/meu-passaporte') return 'passport';
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return 'admin';
  return 'system';
}
