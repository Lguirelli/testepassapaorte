'use client';
import {t} from '@/core/i18n';
export function ThemePicker({initialTheme}:{initialTheme:'system'|'light'|'dark'}){return <label className="theme"><span className="sr-only">{t('theme')}</span><select aria-label={t('theme')} defaultValue={initialTheme} onChange={e=>{document.documentElement.dataset.theme=e.target.value;document.cookie=`theme=${e.target.value};path=/;SameSite=Lax;max-age=31536000`}}><option value="system">Sistema</option><option value="light">Claro</option><option value="dark">Escuro</option></select></label>}
