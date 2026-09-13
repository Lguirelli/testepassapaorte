import Link from 'next/link';
import {MockMap,PlaceCard} from '@/components/content';
import {ROUTES} from '@/core/routing/routes';
import {publicDataset} from '@/modules/content/repository';

export const dynamic='force-dynamic';
export const metadata={title:'Pontos turísticos'};

export default async function TouristPointsPage(){
  const data=await publicDataset();
  const places=data.places
    .filter(place=>place.discoveryVisible!==false&&(place.placeType==='tourist_point'||place.commercialRelation==='public_point'))
    .sort((a,b)=>Number(b.synthetic===false)-Number(a.synthetic===false)||String(a.name).localeCompare(String(b.name),'pt-BR'));

  return <>
    <section className="section-head">
      <div><p className="eyebrow">Descoberta pública</p><h1 className="compact">Pontos turísticos</h1><p className="lead">Explore os atrativos disponíveis na base dinâmica e abra cada lugar em sua página própria.</p></div>
      <div className="actions"><Link className="button" href={ROUTES.map}>Ver no mapa</Link><Link className="button primary" href={ROUTES.tripBuilder}>Adicionar ao roteiro</Link></div>
    </section>
    <section className="section two">
      <div>{places.length?<div className="grid">{places.map(place=><PlaceCard key={place.id} place={place}/>)}</div>:<p className="empty">Nenhum ponto turístico publicado.</p>}</div>
      <div className="stack"><MockMap places={places}/><Link className="button" href={ROUTES.explore}>Abrir exploração completa</Link></div>
    </section>
  </>;
}
