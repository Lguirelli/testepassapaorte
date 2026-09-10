'use client';
import {t} from '@/core/i18n';
export function ThemePicker({initialTheme}:{initialTheme:"system"|"light"|"dark"}){return <label className="theme">{t('theme')}<select aria-label={t('theme')} defaultValue={initialTheme} onChange={e=>{document.documentElement.dataset.theme=e.target.value;document.cookie=`theme=${e.target.value};path=/;SameSite=Lax;max-age=31536000`;}}><option value="system">{t('system')}</option><option value="light">{t('light')}</option><option value="dark">{t('dark')}</option></select></label>;}
