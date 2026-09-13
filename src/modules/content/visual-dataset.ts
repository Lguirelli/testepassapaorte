import real from '../../../seed/tourism-real.json';
import demo from '../../../seed/validation-content.json';
import type {ContentData} from '@/core/db/schema';
import type {Dataset} from './repository';

export function visualDataset():Dataset{
 const hidden=new Set(['place-mirante-araucarias','place-jardim-nascentes','place-centro-cultural']);
 const cityId=real.city.id;
 const places:ContentData[]=[
  ...real.places.map(place=>({...place,cityId,synthetic:false,discoveryVisible:true})),
  ...demo.places.map(place=>({...place,cityId,synthetic:true,discoveryVisible:!hidden.has(place.id)})),
 ];
 return {
  places,
  categories:real.categories.map(category=>({...category,synthetic:false,status:'published'})),
  partners:demo.partners.map(partner=>{const place=places.find(p=>p.id===partner.placeId);return {...partner,cityId,synthetic:true,name:place?.name,slug:place?.slug,demoContacts:{}};}),
  experiences:demo.experiences.map(item=>({...item,cityId,synthetic:true})),
  events:demo.events.map(item=>({...item,cityId,synthetic:true})),
  sources:[...real.sources.map(source=>({...source,sourceName:source.name,sourceUrl:source.url,synthetic:false})),...demo.sources.map(source=>({...source,name:source.sourceName,synthetic:true}))],
 };
}
