'use client';
import Link from 'next/link';
import {usePathname,useSearchParams} from 'next/navigation';
import {MAIN_NAV,ROUTES,type MainNavKey} from '@/core/routing/routes';

function activeKey(pathname:string,params:{get(name:string):string|null}):MainNavKey|undefined{
  if(/^\/viagens\/[^/]+\/roteiro\/?$/.test(pathname)) return 'routes';
  if(pathname==='/parceiros') return 'partnerProgram';
  if(pathname!=='/explorar') return undefined;
  if(params.get('view')==='map') return 'map';
  if(params.get('relation')==='public_point') return 'touristPoints';
  return 'explore';
}

export function MainNavigation(){
  const pathname=usePathname();
  const params=useSearchParams();
  const active=activeKey(pathname,params);
  return <nav aria-label="Navegação principal" className="main-nav">
    {MAIN_NAV.map(item=><Link key={item.key} href={item.href} aria-current={active===item.key?'page':undefined}>{item.label}</Link>)}
    <Link className="button primary" href={ROUTES.tripBuilder}>Montar meu roteiro</Link>
  </nav>;
}
