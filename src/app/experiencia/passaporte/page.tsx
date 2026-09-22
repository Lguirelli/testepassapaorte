import {publicDataset} from '@/modules/content/repository';
import {GuestPassportExperience} from '@/modules/trips/GuestExperience';
export const dynamic='force-dynamic';
export const metadata={title:'Passaporte de apresentação'};
export default async function Page(){const data=await publicDataset();return <GuestPassportExperience places={data.places.filter(p=>p.discoveryVisible!==false)} categories={data.categories}/>;}
