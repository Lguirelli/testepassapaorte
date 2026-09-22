import Link from 'next/link';

export default function NotFound(){
  return <section className="route-state" aria-labelledby="not-found-title">
    <p className="eyebrow">Caminho não encontrado</p>
    <h1 id="not-found-title">Esta página não está disponível</h1>
    <p className="lead">O endereço pode ter mudado ou o conteúdo ainda não fazer parte desta versão do Passaporte.</p>
    <div className="actions">
      <Link className="button primary" href="/explorar">Explorar Serra Negra</Link>
      <Link className="button" href="/mapa">Abrir mapa</Link>
      <Link className="button" href="/">Voltar ao início</Link>
    </div>
  </section>;
}
