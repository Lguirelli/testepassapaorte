import {publicDataset} from '@/modules/content/repository';
import HomeExperience from '@/components/HomeExperience';
import type {ContentData} from '@/core/db/schema';

export const dynamic='force-dynamic';
export const metadata={title:'Passaporte Serra Negra',alternates:{canonical:'/'}};

function randomSample(items:ContentData[],count:number){
  const shuffled=[...items];
  for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
  return shuffled.slice(0,count);
}

export default async function Home(){
  const data=await publicDataset();
  const touristPoints=data.places.filter(place=>place.discoveryVisible!==false&&place.placeType==='tourist_point');
  const featured=randomSample(touristPoints,3);
  const partners=data.places.filter(place=>place.discoveryVisible!==false&&place.commercialRelation==='partner');
  const routePlaces=[...touristPoints,...partners].slice(0,6);
  return <HomeExperience featured={featured} partners={partners} categories={data.categories} routePlaces={routePlaces}/>;
}
