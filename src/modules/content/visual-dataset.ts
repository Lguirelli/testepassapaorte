import real from '../../../seed/tourism-real.json';
import demo from '../../../seed/validation-content.json';
import type {ContentData} from '@/core/db/schema';
import type {Dataset} from './repository';

const demoImageByPlaceId:Record<string,{fallbackSrc:string;alt:string;illustrative:boolean;notActualPlace:boolean}>={
 'place-mirante-araucarias':{fallbackSrc:'assets/stock/01-mirante-vale-araucarias.jpg',alt:'Imagem ilustrativa de paisagem serrana para conteúdo de demonstração',illustrative:true,notActualPlace:true},
 'place-jardim-nascentes':{fallbackSrc:'assets/stock/02-jardim-nascentes.jpg',alt:'Imagem ilustrativa de área verde para conteúdo de demonstração',illustrative:true,notActualPlace:true},
 'place-centro-cultural':{fallbackSrc:'assets/stock/03-centro-cultural.jpg',alt:'Imagem ilustrativa de arquitetura para conteúdo de demonstração',illustrative:true,notActualPlace:true},
 'place-cafe-neblina':{fallbackSrc:'assets/stock/04-cafe-neblina-alta.jpg',alt:'Imagem ilustrativa de café para parceiro de demonstração',illustrative:true,notActualPlace:true},
 'place-bistro-estacao':{fallbackSrc:'assets/stock/05-bistro-estacao-verde.jpg',alt:'Imagem ilustrativa de gastronomia para parceiro de demonstração',illustrative:true,notActualPlace:true},
 'place-atelie-pedra-folha':{fallbackSrc:'assets/stock/06-atelie-pedra-folha.jpg',alt:'Imagem ilustrativa de artesanato para parceiro de demonstração',illustrative:true,notActualPlace:true},
 'place-casa-mel':{fallbackSrc:'assets/stock/07-casa-mel-serra.jpg',alt:'Imagem ilustrativa de produtos locais para parceiro de demonstração',illustrative:true,notActualPlace:true},
 'place-aguas-claras':{fallbackSrc:'assets/stock/08-bem-estar-aguas-claras.jpg',alt:'Imagem ilustrativa de bem-estar para parceiro de demonstração',illustrative:true,notActualPlace:true},
};

export function visualDataset():Dataset{
 const hidden=new Set(['place-mirante-araucarias','place-jardim-nascentes','place-centro-cultural']);
 const cityId=real.city.id;
 const places:ContentData[]=[
  ...real.places.map(place=>({...place,cityId,synthetic:false,discoveryVisible:true})),
  ...demo.places.map(place=>{const imageAsset=demoImageByPlaceId[place.id];return {...place,cityId,synthetic:true,discoveryVisible:!hidden.has(place.id),...(imageAsset?{imageAsset}:{})};}),
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
