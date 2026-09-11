import {Suspense} from 'react';
import {PageTracking} from '@/modules/tracking/client';
import type {Metadata} from 'next';
import Link from 'next/link';
import {cookies} from 'next/headers';
import {Icon} from '@/design-system/icons';
import {ThemePicker} from '@/components/ThemePicker';
import {MainNavigation} from '@/components/MainNavigation';
import {RoutePageScope} from '@/components/RoutePageScope';
import {ROUTES} from '@/core/routing/routes';
import {t} from '@/core/i18n';
import './globals.css';

export const metadata:Metadata={
  title:{default:'Passaporte Serra Negra | Validação',template:'%s | Passaporte Serra Negra'},
  description:'Experiência dinâmica de validação do Passaporte Serra Negra.',
  robots:{index:false,follow:false}
};

export default async function Layout({children}:{children:React.ReactNode}){
  const savedTheme=(await cookies()).get('theme')?.value;
  const theme=savedTheme==='dark'||savedTheme==='light'?savedTheme:'system';
  return <html lang="pt-BR" data-theme={theme}>
    <body>
      <RoutePageScope/>
      <PageTracking/>
      <a className="skip" href="#conteudo">{t('skip')}</a>
      <div className="demo-banner">{t('demo')}</div>
      <header className="site-header">
        <Link className="brand" href={ROUTES.home}>
          <Icon name="passaporte"/>
          <span>Passaporte<br/><strong>Serra Negra</strong></span>
        </Link>
        <Suspense fallback={<nav className="main-nav" aria-label="Navegação principal"/>}>
          <MainNavigation/>
        </Suspense>
        <ThemePicker initialTheme={theme}/>
      </header>
      <main id="conteudo" tabIndex={-1}>{children}</main>
      <footer className="site-footer">
        <div><strong>{t('brand')}</strong><p>Descoberta, planejamento e memória de viagem.</p><small>Aplicação dinâmica de validação.</small></div>
        <nav aria-label="Rodapé">
          <Link href={ROUTES.explore}>Lugares e experiências</Link>
          <Link href={ROUTES.partnerProgram}>Para parceiros</Link>
          <Link href={ROUTES.demoCalendar}>Calendário demo</Link>
          <Link href={ROUTES.admin}>Admin de validação</Link>
        </nav>
      </footer>
    </body>
  </html>;
}
