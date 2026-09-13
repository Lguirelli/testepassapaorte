'use client';

import Link from 'next/link';
import type {ContentData} from '@/core/db/schema';
import {placeUrl} from '@/modules/content/urls';
import {Icon} from '@/design-system/icons';

function hashPoint(id:string,index:number){
  let h=2166136261;
  for(const c of id){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
  return{x:12+Math.abs(h%76),y:15+Math.abs((h>>>8)%68)+(index%2)*2};
}

function points(places:ContentData[]){
  const geo=places.filter(place=>Number.isFinite(place.location?.lat)&&Number.isFinite(place.location?.lng));
  if(geo.length>=2){
    const lats=geo.map(place=>place.location!.lat!);
    const lngs=geo.map(place=>place.location!.lng!);
    const minLat=Math.min(...lats),maxLat=Math.max(...lats),minLng=Math.min(...lngs),maxLng=Math.max(...lngs);
    return places.map((place,index)=>{
      if(place.location?.lat===undefined||place.location?.lng===undefined)return{...hashPoint(place.id,index),approx:true};
      return{x:10+80*((place.location.lng-minLng)/(maxLng-minLng||1)),y:88-76*((place.location.lat-minLat)/(maxLat-minLat||1)),approx:false};
    });
  }
  return places.map((place,index)=>({...hashPoint(place.id,index),approx:true}));
}

export function PlaceMap({places,selectedId,onSelect,compact=false}:{places:ContentData[];selectedId?:string|null;onSelect?:(id:string)=>void;compact?:boolean}){
  const pts=points(places);
  const selected=places.find(place=>place.id===selectedId)||places[0];
  return <div className={`territorial-map ${compact?'territorial-map-compact':''}`} data-testid="place-map">
    <div className="territorial-map-head"><div><Icon name="mapa"/><strong> Serra Negra</strong></div><small>{places.some((place,index)=>pts[index]?.approx&&place.location?.lat===undefined)?'Alguns pontos usam posição esquemática até a coordenada ser verificada.':'Posições baseadas nas coordenadas publicadas.'}</small></div>
    <svg viewBox="0 0 100 100" role="img" aria-label={`Mapa com ${places.length} lugares`}>
      <defs><pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" stroke="currentColor" strokeOpacity=".07" strokeWidth=".35"/></pattern></defs>
      <rect width="100" height="100" rx="5" fill="url(#grid)"/>
      <path d="M8 78 C23 63, 27 38, 46 30 S72 22, 91 11" fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth="1.2"/>
      <path d="M7 56 C27 54, 42 68, 58 58 S76 40, 93 47" fill="none" stroke="currentColor" strokeOpacity=".13" strokeWidth=".8"/>
      {places.map((place,index)=>{
        const pt=pts[index];
        const active=place.id===selected?.id;
        const marker=<>
          <circle className="map-pin-hit" r="7.5"/>
          <circle className="map-pin-dot" r={active?4.6:3.6}/>
          <text y="1.4" textAnchor="middle">{index+1}</text>
        </>;
        if(onSelect)return <g key={place.id} className="map-pin" role="button" tabIndex={0} aria-label={`Selecionar ${place.name}`} aria-pressed={active} data-active={active?'true':'false'} transform={`translate(${pt.x} ${pt.y})`} onClick={()=>onSelect(place.id)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onSelect(place.id);}}}>{marker}</g>;
        return <a key={place.id} href={placeUrl(place)} aria-label={`Abrir ${place.name}`}><g className="map-pin" data-active={active?'true':'false'} transform={`translate(${pt.x} ${pt.y})`}>{marker}</g></a>;
      })}
    </svg>
    {selected&&<div className="territorial-map-card" aria-live="polite"><span className="eyebrow">{selected.synthetic?'DEMO · ':''}{selected.placeType==='tourist_point'?'Ponto turístico':'Lugar'}</span><strong>{selected.name}</strong>{selected.location?.display&&<small>{selected.location.display}</small>}<div className="actions"><Link href={placeUrl(selected)}>Abrir lugar</Link>{selected.location?.display&&<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.location.display)}`} target="_blank" rel="noreferrer">Direções <Icon name="link-externo" size="xs"/></a>}</div></div>}
    {!places.length&&<p className="empty">Nenhum lugar para mostrar neste filtro.</p>}
  </div>;
}
