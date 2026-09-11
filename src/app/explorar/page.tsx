import {publicDataset,filterPlaces,type Filters} from '@/modules/content/repository';
import {PlaceCard,MockMap,Weather,EventList} from '@/components/content';
import Link from 'next/link';
import {SearchTracking} from './tracking';
import {ROUTES} from '@/core/routing/routes';

export const dynamic='force-dynamic';
export const metadata={title:'Explorar'};

type ExploreParams=Record<string,string|undefined>;

export default async function Explore({searchParams}:{searchParams:Promise<ExploreParams>}){
  const sp=await searchParams;
  const f:Filters={q:sp.q||'',category:sp.category||'',environment:sp.environment||'',cost:sp.cost||'',relation:sp.relation||'',accessible:sp.accessible||''};
  const data=await publicDataset();
  const places=filterPlaces(data,f);
  const mapView=sp.view==='map';
  const touristView=f.relation==='public_point';
  const title=mapView?'Mapa de descoberta':touristView?'Pontos turísticos':'O que você quer descobrir?';
  return <>
    <SearchTracking filters={f}/>
    <p className="eyebrow">Lugares · experiências · eventos</p>
    <h1 className="compact">{title}</h1>
    <form action={ROUTES.explore} className="panel">
      {mapView&&<input type="hidden" name="view" value="map"/>}
      <label className="field">Buscar lugares, experiências ou categorias<input type="search" name="q" defaultValue={f.q} placeholder="Experimente buscar café"/></label>
      <div className="chips">{data.categories.map(c=><Link key={c.id} className="button" href={`${ROUTES.explore}?category=${c.id}`}>{c.name}</Link>)}</div>
      <div className="filters">
        <label className="field">Categoria<select name="category" defaultValue={f.category}><option value="">Todas</option>{data.categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label className="field">Relação<select name="relation" defaultValue={f.relation}><option value="">Todos os lugares</option><option value="partner">Parceiros</option><option value="public_point">Pontos turísticos</option></select></label>
      </div>
      <details open={!!(f.environment||f.cost||f.accessible)}><summary>Mais filtros</summary><div className="filters">
        <label className="field">Ambiente<select name="environment" defaultValue={f.environment}><option value="">Qualquer ambiente</option><option value="indoor">Ambiente interno</option><option value="outdoor">Ao ar livre</option><option value="mixed">Misto</option></select></label>
        <label className="field">Custo<select name="cost" defaultValue={f.cost}><option value="">Qualquer custo</option><option value="free">Sem custo</option><option value="paid">Pago</option></select></label>
        <label className="field">Acessibilidade informada<select name="accessible" defaultValue={f.accessible}><option value="">Sem filtro</option><option value="partial">Parcial</option><option value="full">Completa</option></select></label>
      </div></details>
      <div className="actions"><button className="primary" type="submit">Aplicar busca e filtros</button><Link href={mapView?ROUTES.map:ROUTES.explore}>Limpar filtros</Link></div>
    </form>
    <Weather/>
    <div className="section-head"><h2>{places.length} lugares encontrados</h2><span className="badge">Dados dinâmicos</span></div>
    {mapView
      ? <div className="two"><div className="stack"><MockMap places={places}/><EventList events={data.events.filter(e=>places.some(p=>p.id===e.placeId))}/></div><div>{places.length?<div className="grid">{places.map(p=><PlaceCard key={p.id} place={p}/>)}</div>:<p className="empty">Nenhum resultado para esta seleção.</p>}</div></div>
      : <div className="two"><div>{places.length?<div className="grid">{places.map(p=><PlaceCard key={p.id} place={p}/>)}</div>:<p className="empty">Nenhum resultado para esta seleção.</p>}</div><div className="stack"><MockMap places={places}/><EventList events={data.events.filter(e=>places.some(p=>p.id===e.placeId))}/></div></div>}
  </>;
}
