'use client';
import {t} from '@/core/i18n';
export default function ErrorPage({reset}:{reset:()=>void}){return <div role="alert"><h1>Falha temporária</h1><p>{t('error')}</p><button onClick={reset}>Tentar novamente</button></div>;}
