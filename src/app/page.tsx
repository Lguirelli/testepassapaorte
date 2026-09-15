import {publicDataset} from '@/modules/content/repository';
import HomeExperience from '@/components/HomeExperience';

export const metadata={title:'Passaporte Serra Negra',alternates:{canonical:'/'}};

function presentationFeatured<T>(items:T[]){
  if(items.length<=3)return items;
  const picks=[0,Math.floor(items.length/2),items.length-1];
  return picks.map(index=>items[index]);
}

export default async function Home(){
  const data=await publicDataset();
  const touristPoints=data.places.filter(place=>place.discoveryVisible!==false&&place.placeType==='tourist_point');
  const featured=presentationFeatured(touristPoints);
  const partners=data.places.filter(place=>place.discoveryVisible!==false&&place.commercialRelation==='partner');
  const routePlaces=[...touristPoints,...partners].slice(0,6);
  return <HomeExperience featured={featured} partners={partners} categories={data.categories} routePlaces={routePlaces}/>;
}
