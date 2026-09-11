import Link from 'next/link';
import {publicDataset} from '@/modules/content/repository';
import {PlaceCard,MockMap} from '@/components/content';
import {Icon} from '@/design-system/icons';
import {ROUTES} from '@/core/routing/routes';

export const dynamic='force-dynamic';

export default async function Home(){
  const data=await publicDataset();
  const touristPoints=data.places.filter(p=>p.placeType==='tourist_point').sort((a,b)=>Number(b.synthetic===false)-Number(a.synthetic===false));
  const partners=data.places.filter(p=>p.commercialRelation==='partner');
  return <>
    <section className="hero">
      <div>
        <p className="eyebrow">Descoberta · planejamento · memória</p>
        <h1>Descubra Serra Negra do seu jeito.</h1>
        <p className="lead">Organize os dias da sua viagem e guarde os lugares que fizeram parte dela.</p>
        <p className="muted">Atrativos públicos pesquisados preservam suas fontes; parceiros, jornada e interações desta versão continuam demonstrativos.</p>
        <div className="actions"><Link className="button primary" href={ROUTES.explore}>Explorar Serra Negra <Icon name="avancar" size="sm"/></Link><Link className="button" href={ROUTES.map}>Abrir mapa</Link></div>
      </div>
      <img className="placeholder" src="/assets/brand/logo-passaporte-serra-negra.svg" alt="Passaporte Serra Negra"/>
    </section>

    <section className="section">
      <div className="section-head"><div><p className="eyebrow">Primeiros caminhos</p><h2>Conheça Serra Negra</h2></div><Link href={ROUTES.touristPoints}>Ver pontos turísticos</Link></div>
      <div className="grid">{touristPoints.slice(0,3).map(p=><PlaceCard key={p.id} place={p}/>)}</div>
    </section>

    <section className="section">
      <div className="section-head"><div><p className="eyebrow">Encontros pelo caminho</p><h2>Parceiros de demonstração</h2></div><Link href={ROUTES.partnerProgram}>Como funciona para parceiros</Link></div>
      <p>Negócios e atividades aparecem no contexto da descoberta e do roteiro.</p>
      <div className="grid">{partners.slice(0,6).map(p=><PlaceCard key={p.id} place={p}/>)}</div>
    </section>

    <section className="section">
      <h2>Uma viagem com espaço para você</h2>
      <p className="lead">Escolha quando ir, com quem viajar e o que gostaria de fazer. O roteiro organiza essas escolhas em dias.</p>
      <div className="grid">{data.categories.slice(0,3).map(c=><article className="panel" key={c.id}><h3>{c.name}</h3><p>Explore este interesse na montagem da viagem.</p><Link href={`${ROUTES.tripBuilder}?interest=${c.id}`}>Criar roteiro demo</Link></article>)}</div>
    </section>

    <section className="section two">
      <div><p className="eyebrow">Caderno de viagem</p><h2>Planejar também é deixar espaço livre.</h2><p className="lead">Intercale paradas, confira o tempo disponível e mantenha suas escolhas ao ajustar o caminho. O calendário e o roteiro mostram a mesma viagem de formas diferentes.</p><Link href={ROUTES.demoTrip}>Abrir viagem de exemplo</Link></div>
      <div><h2>Explore por interesse</h2><div className="chips">{data.categories.map(c=><Link key={c.id} href={`${ROUTES.explore}?category=${c.id}`} className="button">{c.name}</Link>)}</div></div>
    </section>

    <section className="section two">
      <div><p className="eyebrow">Sua história</p><h2>Um Passaporte para o que você viveu.</h2><p>Planejar uma parada e registrar uma presença são coisas diferentes. O Passaporte reúne os registros da viagem, incluindo descobertas fora do roteiro.</p><Link className="button" href={ROUTES.passport}>Conhecer o Passaporte demo</Link></div>
      <MockMap places={touristPoints.slice(0,4)}/>
    </section>

    <section className="section"><h2>Por onde começa a sua viagem?</h2><Link className="button primary" href={ROUTES.tripBuilder}>Montar meu roteiro</Link></section>
  </>;
}
