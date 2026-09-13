import {publicDataset} from '@/modules/content/repository';
import HomeExperience from '@/components/HomeExperience';

export const dynamic='force-dynamic';
export const metadata={title:'Passaporte Serra Negra',alternates:{canonical:'/'}};

export default async function Home(){
  const data=await publicDataset();
  const touristPoints=data.places.filter(place=>place.discoveryVisible!==false&&place.placeType==='tourist_point');
  const shuffled=[...touristPoints];
  for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
  const featured=shuffled.slice(0,3);
  const partners=data.places.filter(place=>place.discoveryVisible!==false&&place.commercialRelation==='partner');
  const routePlaces=[...touristPoints,...partners].slice(0,6);
  return <HomeExperience featured={featured} partners={partners} categories={data.categories} routePlaces={routePlaces}/>;
}
