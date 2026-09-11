import {publicDataset} from '@/modules/content/repository';
import HomeExperience from '@/components/HomeExperience';

export const dynamic='force-dynamic';

function shuffled<T>(items:T[]){
  return items.map(item=>({item,order:Math.random()})).sort((a,b)=>a.order-b.order).map(entry=>entry.item);
}

export default async function Home(){
  const data=await publicDataset();
  const touristPoints=data.places.filter(place=>place.placeType==='tourist_point');
  const featured=shuffled(touristPoints).slice(0,3);
  const partners=data.places.filter(place=>place.commercialRelation==='partner');
  const routePlaces=[...touristPoints,...partners].slice(0,6);
  return <HomeExperience featured={featured} partners={partners} categories={data.categories} routePlaces={routePlaces}/>;
}
