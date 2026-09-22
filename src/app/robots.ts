import type {MetadataRoute} from 'next';import {siteOrigin} from '@/core/security/origin';
export default function robots():MetadataRoute.Robots{const base=siteOrigin();return{rules:[{userAgent:'*',allow:'/',disallow:['/admin/','/painel-parceiro/','/api/','/viagens/','/meu-passaporte','/compartilhar/']}],sitemap:`${base}/sitemap.xml`};}
