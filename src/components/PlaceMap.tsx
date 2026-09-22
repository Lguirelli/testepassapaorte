'use client';

import {flushSync} from 'react-dom';
import type {CSSProperties} from 'react';
import type {ContentData} from '@/core/db/schema';
import {placeUrl} from '@/modules/content/urls';
import {Icon} from '@/design-system/icons';
import {safeAssetSrc,safeObjectPosition} from '@/core/security/sanitize';
import {morphNames,morphStyle} from '@/core/ui/morph';

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

function reducedMotion(){return typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;}

type PinStyle=CSSProperties&{viewTransitionName?:string};

export function PlaceMap({places,selectedId,onSelect,compact=false}:{places:ContentData[];selectedId?:string|null;onSelect?:(id:string)=>void;compact?:boolean}){
  const pts=points(places);
  const selected=places.find(place=>place.id===selectedId)||places[0];
  const selectWithMorph=(id:string)=>{
    if(!onSelect||id===selected?.id)return;
    const apply=()=>flushSync(()=>onSelect(id));
    const doc=document as Document&{startViewTransition?:(update:()=>void)=>{finished:Promise<void>}};
    if(reducedMotion()||!doc.startViewTransition){apply();return;}
    doc.startViewTransition(apply);
  };
  const selectedAsset=selected?.imageAsset;
  const selectedImage=selected?safeAssetSrc(selectedAsset?.src||selectedAsset?.fallbackSrc,'/placeholders/card.svg'):'/placeholders/card.svg';

  return <div className={`territorial-map ${compact?'territorial-map-compact':''}`} data-testid="place-map">
    <div className="territorial-map-head"><div><Icon name="mapa"/><strong> Serra Negra</strong></div><small>{places.some((place,index)=>pts[index]?.approx&&place.location?.lat===undefined)?'Alguns pontos usam posição esquemática até a coordenada ser verificada.':'Posições baseadas nas coordenadas publicadas.'}</small></div>
    <div className="territorial-map-canvas">
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <defs><pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" stroke="currentColor" strokeOpacity=".07" strokeWidth=".35"/></pattern></defs>
        <rect width="100" height="100" rx="5" fill="url(#grid)"/>
        <path d="M8 78 C23 63, 27 38, 46 30 S72 22, 91 11" fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth="1.2"/>
        <path d="M7 56 C27 54, 42 68, 58 58 S76 40, 93 47" fill="none" stroke="currentColor" strokeOpacity=".13" strokeWidth=".8"/>
      </svg>
      <div className="territorial-map-pins" role="group" aria-label={`Mapa com ${places.length} lugares`}>
        {places.map((place,index)=>{
          const pt=pts[index];
          const active=place.id===selected?.id;
          const baseStyle={left:`${pt.x}%`,top:`${pt.y}%`} as PinStyle;
          const pinStyle=onSelect&&!active?{...baseStyle,...morphStyle(morphNames.mapPreview(place.id))}:baseStyle;
          const label=<><span aria-hidden="true">{index+1}</span><span className="sr-only">{place.name}</span></>;
          if(onSelect)return <button key={place.id} type="button" className="map-pin-html" aria-label={`Selecionar ${place.name}`} aria-pressed={active} data-active={active?'true':'false'} style={pinStyle} onClick={()=>selectWithMorph(place.id)}>{label}</button>;
          return <a key={place.id} className="map-pin-html" href={placeUrl(place)} aria-label={`Abrir ${place.name}`} data-active={active?'true':'false'} style={baseStyle}>{label}</a>;
        })}
      </div>
    </div>
    {selected&&<article className="territorial-map-card" data-map-preview-card="true" data-morph-card="place" data-morph-id={selected.id} aria-live="polite" style={onSelect?morphStyle(morphNames.mapPreview(selected.id)):undefined}>
      <div className="territorial-map-preview-media" data-morph-media="true"><img src={selectedImage} alt={selectedAsset?.alt||`Imagem de ${selected.name}`} style={{objectPosition:safeObjectPosition(selectedAsset?.position)}}/></div>
      <span className="eyebrow" data-morph-meta="true">{selected.synthetic?'DEMO · ':''}{selected.placeType==='tourist_point'?'Ponto turístico':selected.commercialRelation==='partner'?'Parceiro':'Lugar'}</span>
      <strong data-morph-title="true">{selected.name}</strong>
      {selected.location?.display&&<small>{selected.location.display}</small>}
      <div className="actions"><a data-morph-link="true" href={placeUrl(selected)}>Abrir lugar</a>{selected.location?.display&&<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.location.display)}`} target="_blank" rel="noreferrer">Direções <Icon name="link-externo" size="xs"/></a>}</div>
    </article>}
  </div>;
}
