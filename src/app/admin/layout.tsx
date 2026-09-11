import Link from 'next/link';import {routeKinds,kindLabels} from '@/modules/admin/fields';
export const metadata={title:'Admin operacional'};
export default function AdminLayout({children}:{children:React.ReactNode}){return <><p className="eyebrow">Controle de conteúdo · validação</p><nav className="actions admin-nav" aria-label="Admin"><Link className="button" href="/admin">Visão geral</Link>{Object.entries(routeKinds).map(([route,kind])=><Link className="button" key={route} href={`/admin/${route}`}>{kindLabels[kind]}</Link>)}</nav>{children}</>;}
