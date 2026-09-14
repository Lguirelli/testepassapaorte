import type {TripProfile} from './types';

export type ReadyRoutePreset={
  slug:string;
  eyebrow:string;
  title:string;
  summary:string;
  durationDays:number;
  paceLabel:string;
  audience:string;
  highlights:string[];
  image:string;
  profile:Omit<TripProfile,'startsOn'|'endsOn'>;
};

export const READY_ROUTES:ReadyRoutePreset[]=[
  {
    slug:'serra-negra-essencial-2-dias',
    eyebrow:'Primeira vez em Serra Negra',
    title:'Serra Negra essencial em 2 dias',
    summary:'Um primeiro contato equilibrado com paisagens, referências da cidade, pausas e descobertas sem transformar o fim de semana em uma corrida.',
    durationDays:2,
    paceLabel:'Equilibrado',
    audience:'Primeira visita',
    highlights:['clássicos da cidade','paisagens','tempo livre entre paradas'],
    image:'/assets/tourism/fontana-di-trevi.jpg',
    profile:{party:'friends',interests:['cat-cultura','cat-natureza','cat-gastronomia'],intentions:['classics','landscapes'],pace:'balanced',transport:'car',needs:[]},
  },
  {
    slug:'fim-de-semana-a-dois',
    eyebrow:'Fim de semana a dois',
    title:'Dois dias para aproveitar sem pressa',
    summary:'Paisagens, cafés, gastronomia e pausas maiores para quem quer viver a cidade com um ritmo mais tranquilo.',
    durationDays:2,
    paceLabel:'Tranquilo',
    audience:'Casal',
    highlights:['paisagens','cafés e gastronomia','ritmo tranquilo'],
    image:'/assets/tourism/mirante-alto-da-serra.jpg',
    profile:{party:'couple',interests:['cat-natureza','cat-gastronomia','cat-cafes','cat-bem-estar'],intentions:['relax','food','landscapes'],pace:'slow',transport:'car',needs:[]},
  },
  {
    slug:'familia-com-criancas',
    eyebrow:'Viagem em família',
    title:'Serra Negra com crianças',
    summary:'Um roteiro com variedade, intervalos e menos pressão de tempo para equilibrar adultos e crianças ao longo do dia.',
    durationDays:2,
    paceLabel:'Equilibrado',
    audience:'Família',
    highlights:['paradas variadas','intervalos maiores','atrações para compartilhar'],
    image:'/assets/tourism/parque-fonte-santo-agostinho.jpg',
    profile:{party:'family',interests:['cat-natureza','cat-cultura'],intentions:['children','classics'],pace:'balanced',transport:'car',needs:['small_child']},
  },
  {
    slug:'dia-de-chuva',
    eyebrow:'Quando o tempo muda',
    title:'Um dia de chuva que continua funcionando',
    summary:'Alternativas cobertas e uma sequência mais flexível para não depender de mirantes ou longos períodos ao ar livre.',
    durationDays:1,
    paceLabel:'Tranquilo',
    audience:'Qualquer companhia',
    highlights:['ambientes internos','gastronomia','plano flexível'],
    image:'/assets/tourism/igreja-nossa-senhora-rosario.jpg',
    profile:{party:'friends',interests:['cat-cultura','cat-gastronomia','cat-cafes','cat-compras'],intentions:['different','food'],pace:'slow',transport:'car',needs:['avoid_outdoor']},
  },
  {
    slug:'natureza-e-mirantes',
    eyebrow:'Mais tempo ao ar livre',
    title:'Natureza, mirantes e paisagens',
    summary:'Um caminho para quem quer priorizar horizonte, áreas abertas e contemplação, com menos trocas de contexto ao longo do dia.',
    durationDays:1,
    paceLabel:'Equilibrado',
    audience:'Paisagens e natureza',
    highlights:['mirantes','áreas abertas','contemplação'],
    image:'/assets/tourism/mirante-alto-da-serra.jpg',
    profile:{party:'friends',interests:['cat-natureza'],intentions:['landscapes','relax'],pace:'balanced',transport:'car',needs:[]},
  },
  {
    slug:'cafes-e-sabores',
    eyebrow:'Sabores pelo caminho',
    title:'Cafés, gastronomia e descobertas locais',
    summary:'Uma viagem organizada ao redor de pausas gastronômicas, cafés e experiências que combinam com quem gosta de descobrir a cidade pelo sabor.',
    durationDays:1,
    paceLabel:'Tranquilo',
    audience:'Gastronomia',
    highlights:['cafés','gastronomia','produtores e compras locais'],
    image:'/assets/tourism/feira-artesanato.jpg',
    profile:{party:'couple',interests:['cat-gastronomia','cat-cafes','cat-compras'],intentions:['food','local_producers'],pace:'slow',transport:'car',needs:[]},
  },
];

export function readyRouteBySlug(slug:string){return READY_ROUTES.find(route=>route.slug===slug);}

function addDays(date:string,days:number){const value=new Date(`${date}T12:00:00Z`);value.setUTCDate(value.getUTCDate()+days);return value.toISOString().slice(0,10);}

export function profileForReadyRoute(route:ReadyRoutePreset,startsOn:string):TripProfile{
  return {...route.profile,startsOn,endsOn:addDays(startsOn,Math.max(0,route.durationDays-1))};
}
