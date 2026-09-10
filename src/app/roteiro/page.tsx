import {publicContent} from '@/modules/content/repository';import {Onboarding} from '@/modules/trips/Onboarding';
export const dynamic='force-dynamic';export const metadata={title:'Montar roteiro demo'};
export default async function Page({searchParams}:{searchParams:Promise<{interest?:string}>}){const categories=await publicContent('categories');const {interest}=await searchParams;return <Onboarding categories={categories} initialInterest={categories.some(c=>c.id===interest)?interest:undefined}/>;}
