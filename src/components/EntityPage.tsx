import Link from 'next/link';
import type {ContentData} from '@/core/db/schema';
import type {Dataset} from '@/modules/content/repository';
import {placeUrl} from '@/modules/content/repository';
import type {TripData} from '@/modules/trips/types';
import {ROUTES} from '@/core/routing/routes';
import {Weather,MockMap,PlaceCard,EventList,labels} from './content';
import {PlaceActions} from './PlaceActions';

function hasCoordinates(place:ContentData){
  return typeof place.location?.lat==='number'&&typeof place.location?.lng==='number';
}

function squaredDistance(a:ContentData,b:ContentData){
  if(!hasCoordinates(a)||!hasCoordinates(b)) return Number.POSITIVE_INFINITY;
  const latA=a.location!.lat as number;
  const lngA=a.location!.lng as number;
  const latB=b.location!.lat as number;
  const lngB=b.location!.lng as number;
  return (latA-latB)**2+(lngA-lngB)**2;
}

export function EntityPage({place,data,trip,partner,preview=false}:{place:ContentData;data:Dataset;trip:TripData;partner?:ContentData;preview?:boolean}){
  const commercial=place.commercialRelation==='partner';
  const visits=trip.visits.filter(v=>v.placeId===place.id);
  const experiences=data.experiences.filter(e=>e.placeId===place.id);
  const nearby=hasCoordinates(place)
    ? data.places.filter(p=>p.id!==place.id&&hasCoordinates(p)).sort((a,b)=>squaredDistance(a,place)-squaredDistance(b,place)).slice(0,3)
    : [];

  const practical=<>
    <h2>Informações práticas</h2>
    <dl>
      {place.openingHours?.text&&<><dt>{place.synthetic===false?'Horário informado':'Horário demo'}</dt><dd>{place.openingHours.text}</dd></>}
      {place.durationMinutes&&<><dt>Tempo sugerido</dt><dd>{place.durationMinutes} minutos</dd></>}
      {place.environment&&<><dt>Ambiente</dt><dd>{labels[place.environment]}</dd></>}
      {place.costType&&<><dt>Custo</dt><dd>{labels[place.costType]}</dd></>}
      {!!place.accessibility?.length&&<><dt>Acessibilidade informada</dt><dd>{place.accessibility.includes('partial')?'Parcial':'Consultar condições'}</dd></>}
    </dl>
    {place.priceNote&&<p><strong>Valor informado:</strong> {place.priceNote}</p>}
    {!!place.requirements?.length&&<ul>{place.requirements.map(item=><li key={item}>{item}</li>)}</ul>}
  </>;

  return <>
    <Link href={ROUTES.explore}>Voltar a explorar</Link>
    {preview&&<p className="notice">Preview do rascunho. Esta versão ainda não está publicada.</p>}

    {commercial
      ? <section className="hero partner-hero"><div>
          <img className="placeholder" style={{width:80,height:80}} src="/placeholders/avatar.svg" alt="Placeholder de identidade do negócio"/>
          <p className="eyebrow">Parceiro fictício · estabelecimento</p>
          <h1 className="compact">{place.name}</h1>
          <p className="lead" data-testid="public-description">{place.shortDescription}</p>
          {!preview&&<PlaceActions id={place.id} partner/>}
        </div><aside className="panel">{practical}<h2>Contato de demonstração</h2><p>Os contatos abaixo são fictícios e não abrem serviços externos.</p>{partner?.demoContacts&&Object.entries(partner.demoContacts).filter(([,v])=>v).map(([k,v])=><details key={k}><summary>{k} · demo</summary><p>{v}</p><small>Contato indisponível para uso real.</small></details>)}{partner?.responseTime&&<p><strong>Tempo de resposta declarado:</strong> {labels[partner.responseTime]||partner.responseTime} (demo).</p>}</aside></section>
      : <>
          <img className="placeholder" style={{aspectRatio:'16/5',marginTop:'1.5rem',objectPosition:place.imageAsset?.position}} src={place.imageAsset?.fallbackSrc?`/${place.imageAsset.fallbackSrc}`:'/placeholders/hero.svg'} alt={place.imageAsset?.alt||`Imagem de capa de ${place.name}`}/>
          <section className="section">
            <p className="eyebrow">{place.synthetic===false?'Ponto turístico pesquisado':'Ponto turístico de demonstração'}</p>
            <h1>{place.name}</h1>
            <p className="lead" data-testid="public-description">{place.shortDescription}</p>
            {!preview&&<PlaceActions id={place.id}/>}<div className="panel">{practical}</div>
          </section>
        </>}

    <div className="two"><div>
      <section className="section"><h2>{commercial?'Conheça o negócio':'Conheça este lugar'}</h2><p>{place.longDescription||place.shortDescription}</p></section>
      <section className="section"><h2>O que fazer aqui</h2>{experiences.length?experiences.map(e=><article className="panel" key={e.id}><h3>{e.name}</h3><p>{e.shortDescription}</p><div className="actions"><span className="badge">{labels[e.costType||'']}</span><span>{e.durationMinutes} minutos</span></div>{e.bookingType?.includes('required')&&<p>Reserva externa necessária na simulação. Contato demo indisponível.</p>}</article>):<p>Nenhuma experiência publicada.</p>}</section>
      <section className="section"><h2>Planeje sua visita</h2><p>Confira horários e tempo disponível antes de organizar as paradas.</p><Link href={ROUTES.demoTrip}>Ver roteiro demo</Link><Weather/></section>
      <section className="section"><h2>Galeria</h2><img className="placeholder" src={place.imageAsset?.fallbackSrc?`/${place.imageAsset.fallbackSrc}`:'/placeholders/gallery.svg'} alt={place.imageAsset?.alt||`Imagem da galeria de ${place.name}`}/>{place.imageAsset?.provider&&<small>Mídia de validação: {place.imageAsset.provider}{place.imageAsset.author?` · ${place.imageAsset.author}`:''}{place.imageAsset.illustrative?' · imagem ilustrativa':''}</small>}</section>
      {place.research?.officialSource&&<section className="section"><h2>Fonte da pesquisa</h2><p>{place.research.officialSource.label}</p><a href={place.research.officialSource.url} rel="noreferrer">Consultar fonte oficial</a>{place.research.checkedAt&&<p><small>Verificação registrada em {place.research.checkedAt}.</small></p>}</section>}
      <EventList events={data.events.filter(e=>e.placeId===place.id)}/>
    </div><aside className="stack" style={{alignContent:'start'}}>
      <section className="panel"><h2>No seu Passaporte</h2>{visits.length?<p>{visits.length} presença registrada de demonstração.</p>:<p>Sem evidência registrada. Isso não significa que a visita não ocorreu.</p>}<p>{trip.days.some(d=>d.items.some(i=>i.placeId===place.id&&i.state!=='removed'))?'Lugar planejado no roteiro demo.':'Fora do planejamento atual.'}</p><Link href={ROUTES.passport}>Abrir meu Passaporte</Link></section>
      <section><h2>Localização</h2>{place.location?.display&&<p>{place.location.display}</p>}<MockMap places={[place]}/></section>
    </aside></div>

    {!commercial&&nearby.length>0&&<section className="section"><h2>Perto daqui na simulação</h2><p>Proximidade aproximada entre coordenadas disponíveis, sem validação viária.</p><div className="grid">{nearby.map(p=><PlaceCard key={p.id} place={p}/>)}</div></section>}
    {commercial&&<p><Link href={placeUrl(place)}>Página comercial de demonstração</Link></p>}
  </>;
}
