'use client';
import {useEffect,useState} from 'react';
import {t} from '@/core/i18n';

type Theme='system'|'light'|'dark';

function resolved(theme:Theme){
  if(theme==='dark')return'dark';
  if(theme==='light')return'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
}

export function ThemePicker({initialTheme}:{initialTheme:Theme}){
  const [theme,setTheme]=useState<Theme>(initialTheme);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-color-scheme: dark)');
    const apply=(next:Theme)=>{
      document.documentElement.dataset.theme=next;
      document.documentElement.dataset.resolvedTheme=resolved(next);
    };
    apply(theme);
    const onSystem=()=>{if(theme==='system')apply('system')};
    media.addEventListener?.('change',onSystem);
    return()=>media.removeEventListener?.('change',onSystem);
  },[theme]);
  return <label className="theme"><span className="sr-only">{t('theme')}</span><select aria-label={t('theme')} value={theme} onChange={e=>{const next=e.target.value as Theme;setTheme(next);document.documentElement.dataset.theme=next;document.documentElement.dataset.resolvedTheme=resolved(next);document.cookie=`theme=${next};path=/;SameSite=Lax;max-age=31536000`}}><option value="system">Sistema</option><option value="light">Claro</option><option value="dark">Escuro</option></select></label>;
}
