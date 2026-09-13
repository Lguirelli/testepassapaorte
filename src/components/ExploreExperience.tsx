'use client';

import {useState} from 'react';
import Link from 'next/link';
import Form from 'next/form';
import type {ContentData} from '@/core/db/schema';
import type {Filters} from '@/modules/content/repository';
import {PlaceCard} from './content';
import {PlaceMap} from './PlaceMap';
import {Icon} from '@/design-system/icons';

export function ExploreExperience({places,categories,filters}:{places:ContentData[];categories:ContentData[];filters:Filters}){
  const[selected,setSelected]=useState<string|null>(places[0]?.id||null);
  return <>
    <section className="discovery-head">
      <p className="eyebrow">Lugares · experiências · contexto</p>
      <h1 className="compact">O que você quer descobrir?</h1>
      <p className="lead">Explore a cidade usando a mesma base de lugares que alimenta o mapa e o roteiro.</p>
    </section>
    <Form action="/explorar" className="filter-bar">
      <label className="search-field"><span className="sr-only">Buscar</span><Icon name="busca"/><input type="search" name="q" defaultValue={filters.q} placeholder="Busque por lugar, interesse ou experiência"/></label>
      <label><span>Categoria</span><select name="category" defaultValue={filters.category}><option value="">Todas</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label><span>Ambiente</span><select name="environment" defaultValue={filters.environment}><option value="">Todos</option><option value="outdoor">Ao ar livre</option><option value="indoor">Ambiente interno</option></select></label>
      <label><span>Custo</span><select name="cost" defaultValue={filters.cost}><option value="">Todos</option><option value="free">Sem custo</option><option value="paid">Pago</option></select></label>
      <button className="primary" type="submit">Aplicar filtros</button>
      {Object.values(filters).some(Boolean)&&<Link className="button" href="/explorar">Limpar</Link>}
    </Form>
    <div className="interest-chips" aria-label="Explorar por interesse">{categories.map(c=><Link key={c.id} aria-current={filters.category===c.id?'page':undefined} href={`/explorar?category=${encodeURIComponent(c.id)}`}>{c.name}</Link>)}</div>
    <section className="explore-layout" aria-labelledby="explore-results-title">
      <div className="explore-results">
        <div className="section-head"><div><p className="eyebrow" aria-live="polite">{places.length} {places.length===1?'resultado':'resultados'}</p><h2 id="explore-results-title">Lugares para considerar</h2></div><Link href="/mapa">Ver mapa ampliado</Link></div>
        {places.length?<div className="explore-card-grid">{places.map(place=><div key={place.id} onPointerEnter={()=>setSelected(place.id)} onFocusCapture={()=>setSelected(place.id)} data-selected={selected===place.id?'true':'false'}><PlaceCard place={place}/></div>)}</div>:<p className="empty">Nenhum lugar corresponde a estes filtros. Remova um filtro ou tente outra busca.</p>}
      </div>
      <aside className="explore-map-sticky"><PlaceMap places={places} selectedId={selected} onSelect={setSelected}/></aside>
    </section>
  </>;
}
