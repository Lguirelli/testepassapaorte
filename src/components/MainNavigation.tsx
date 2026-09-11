'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {MAIN_NAV,ROUTES,type MainNavKey} from '@/core/routing/routes';

function activeKey(pathname:string):MainNavKey|undefined{
  if (pathname==='/explorar') return 'explore';
  if (pathname==='/pontos-turisticos'||pathname.startsWith('/lugares/')) return 'touristPoints';
  if (pathname==='/mapa') return 'map';
  if (pathname==='/parceiros'||pathname.startsWith('/parceiros/')) return 'partnerProgram';
  if (pathname==='/roteiro'||/^\/viagens\/[^/]+\/(roteiro|calendario)\/?$/.test(pathname)) return 'routes';
  return undefined;
}

export function MainNavigation(){
  const pathname=usePathname();
  const active=activeKey(pathname);
  return <nav aria-label="Navegação principal" className="main-nav">
    {MAIN_NAV.map(item=><Link key={item.key} href={item.href} aria-current={active===item.key?'page':undefined}>{item.label}</Link>)}
    <Link className="button primary" href={ROUTES.tripBuilder}>Montar meu roteiro</Link>
  </nav>;
}
