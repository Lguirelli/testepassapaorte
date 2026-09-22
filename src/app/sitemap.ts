import {isVisualMode} from '@/core/app-mode';
import type {MetadataRoute} from 'next';
import {publicDataset,placeUrl} from '@/modules/content/repository';
import {siteOrigin} from '@/core/security/origin';

// Sitemap must never make a Vercel build depend on a live database.
// When a database is available at request time, dynamic place URLs are added.
export const dynamic='force-dynamic';

const staticRoutes=['/','/explorar','/mapa','/pontos-turisticos','/parceiros','/roteiro','/privacidade','/termos','/cookies','/acessibilidade'] as const;

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const base=siteOrigin();
  const staticEntries=staticRoutes.map(url=>({
    url:`${base}${url}`,
    changeFrequency:'weekly' as const,
    priority:url==='/'?1:.7,
  }));

  if(!isVisualMode()&&!process.env.DATABASE_URL)return staticEntries;

  try{
    const data=await publicDataset();
    return [
      ...staticEntries,
      ...data.places
        .filter(place=>place.discoveryVisible!==false)
        .map(place=>({url:`${base}${placeUrl(place)}`,changeFrequency:'weekly' as const,priority:.8})),
    ];
  }catch{
    // A sitemap outage must not take the whole deployment down. Runtime pages
    // still surface database failures normally instead of silently using fake data.
    return staticEntries;
  }
}
