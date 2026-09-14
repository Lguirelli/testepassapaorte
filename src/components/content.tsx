import {safeAssetSrc,safeObjectPosition} from '@/core/security/sanitize';
import Link from 'next/link';
import {Icon} from '@/design-system/icons';
import type {ContentData} from '@/core/db/schema';
import {PlaceMap} from './PlaceMap';
import {placeUrl} from '@/modules/content/urls';

export const labels:Record<string,string>={tourist_point:'Ponto turístico',business:'Estabelecimento',partner:'Parceiro',public_point:'Ponto público',free:'Sem custo',paid:'Pago',paid_with_booking:'Pago com reserva',free_with_booking:'Gratuito com reserva',mixed:'Misto',unknown:'Não informado',indoor:'Ambiente interno',outdoor:'Ao ar livre',within_1_hour:'Em até 1 hora',same_day:'No mesmo dia',within_few_hours:'Em algumas horas',partly_cloudy:'Parcialmente nublado',rain:'Chuva',clear:'Céu aberto',planned:'Planejado',fixed:'Fixado',moved:'Movido',removed:'Removido'};

export function PlaceCard({place}:{place:ContentData}){
  const asset=place.imageAsset;
  const remoteIsIllustrative=asset?.illustrative===true||asset?.notActualPlace===true;
  const preferFallback=remoteIsIllustrative&&Boolean(asset?.fallbackSrc);
  const image=safeAssetSrc(preferFallback?asset?.fallbackSrc:(asset?.src||asset?.fallbackSrc),'/placeholders/card.svg');
  const alt=preferFallback?`Imagem de ${place.name}`:(asset?.alt||`Imagem de ${place.name}`);
  const kind=labels[place.commercialRelation||'']||labels[place.placeType||''];
  return <article className="card" data-testid={`place-card-${place.id}`}>
    <img
      className="placeholder"
      data-card-media="true"
      src={image}
      alt={alt}
      style={{
        objectPosition:safeObjectPosition(asset?.position),
        display:'block',
        width:'100%',
        height:'clamp(190px, 22vw, 220px)',
        minHeight:'190px',
        maxHeight:'220px',
        aspectRatio:'auto',
        objectFit:'cover',
      }}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
    <span className="eyebrow">{place.synthetic?`${kind} · DEMO`:kind}</span>
    <h3><Link href={placeUrl(place)}>{place.name}</Link></h3>
    <p>{place.shortDescription}</p>
    <div className="actions"><small><Icon name="lugar-duracao-sugerida" size="xs"/> {place.durationMinutes} min</small><span className="badge">{labels[place.environment||'']}</span></div>
  </article>;
}

export function MockMap({places}:{places:ContentData[]}){return <PlaceMap places={places} compact/>;}
export function Weather({date,snapshot}:{date?:string;snapshot?:{condition?:string;temperatureC?:number;rainProbability?:number}}){return <aside className="notice" aria-label="Contexto de clima"><Icon name={snapshot?.condition==='rain'?'clima-chuva':'sol'}/> <strong>{date?`Clima · ${date}`:'Clima contextual'}</strong><p>{snapshot?`${labels[snapshot.condition||'']||snapshot.condition||'Condição disponível'}${snapshot.temperatureC!==undefined?` · ${snapshot.temperatureC} °C`:''}${snapshot.rainProbability!==undefined?` · ${snapshot.rainProbability}% de chance de chuva`:''}`:'Nenhuma previsão verificada foi armazenada para este contexto. O sistema não inventa clima.'}</p></aside>;}
export function EventList({events}:{events:ContentData[]}){return <section><h2>Eventos</h2>{events.length?events.map(e=><article className="panel" key={e.id}><h3>{e.name}</h3><p>{e.startsAt?new Date(e.startsAt).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'}):''}</p><span className="badge">{labels[e.costType||'']}</span></article>):<p className="empty">Nenhum evento informado nesta seleção.</p>}</section>;}
