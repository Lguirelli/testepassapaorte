import Link from 'next/link';
import {MockMap,PlaceCard} from '@/components/content';
import {ROUTES} from '@/core/routing/routes';
import {publicDataset} from '@/modules/content/repository';

export const dynamic='force-dynamic';
export const metadata={title:'Mapa'};

type MapParams={relation?:string};

export default async function MapPage({searchParams}:{searchParams:Promise<MapParams>}){
  const sp=await searchParams;
  const data=await publicDataset();
  const relation=sp.relation||'';
  const places=relation?data.places.filter(place=>place.commercialRelation===relation):data.places;

  return <>
    <section className="section-head">
      <div><p className="eyebrow">Visão espacial</p><h1 className="compact">Mapa</h1><p className="lead">Uma visão dinâmica dos lugares publicados, conectada às mesmas páginas usadas em Explorar, Pontos turísticos e Parceiros.</p></div>
      <div className="actions"><Link className="button" href={ROUTES.touristPoints}>Pontos turísticos</Link><Link className="button" href={`${ROUTES.map}?relation=partner`}>Parceiros</Link><Link className="button" href={ROUTES.map}>Todos</Link></div>
    </section>
    <section className="section two">
      <MockMap places={places}/>
      <div>{places.length?<div className="grid">{places.map(place=><PlaceCard key={place.id} place={place}/>)}</div>:<p className="empty">Nenhum lugar disponível para este filtro.</p>}</div>
    </section>
  </>;
}
