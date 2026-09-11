import {PageTracking} from '@/modules/tracking/client';
import type {Metadata} from 'next';
import Link from 'next/link';
import {cookies} from 'next/headers';
import {Icon} from '@/design-system/icons';
import {ThemePicker} from '@/components/ThemePicker';
import {t} from '@/core/i18n';
import './globals.css';
export const metadata:Metadata={title:{default:'Passaporte Serra Negra | Validação',template:'%s | Passaporte demo'},description:'Ambiente de validação com conteúdo totalmente fictício.',robots:{index:false,follow:false}};
export default async function Layout({children}:{children:React.ReactNode}){const savedTheme=(await cookies()).get('theme')?.value;const theme=savedTheme==='dark'||savedTheme==='light'?savedTheme:'system';return <html lang="pt-BR" data-theme={theme}><body><PageTracking/><a className="skip" href="#conteudo">{t('skip')}</a><div className="demo-banner">{t('demo')}</div><header><Link className="brand" href="/"><Icon name="passaporte"/><span>Passaporte<br/><strong>Serra Negra</strong></span></Link><nav aria-label="Navegação principal"><Link href="/explorar">{t('explore')}</Link><Link href="/meu-passaporte">{t('passport')}</Link><Link href="/explorar?relation=partner">{t('partners')}</Link><Link className="button primary header-cta" href="/roteiro">{t('plan')}</Link></nav><ThemePicker initialTheme={theme}/></header><main id="conteudo" tabIndex={-1}>{children}</main><footer><div><strong>{t('brand')}</strong><p>Descoberta, planejamento e memória de viagem.</p><small>Conteúdo sintético. Identidade visual temporária.</small></div><nav aria-label="Rodapé"><Link href="/explorar">Lugares e experiências</Link><Link href="/viagens/demo-trip-001/calendario">Calendário demo</Link><Link href="/admin">Admin de validação</Link></nav></footer></body></html>;}
