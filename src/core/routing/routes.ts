export const ROUTES = {
  home: '/',
  explore: '/explorar',
  touristPoints: '/explorar?relation=public_point',
  map: '/explorar?view=map',
  partnerProgram: '/parceiros',
  tripBuilder: '/roteiro',
  passport: '/meu-passaporte',
  demoTrip: '/viagens/demo-trip-001/roteiro',
  demoCalendar: '/viagens/demo-trip-001/calendario',
  admin: '/admin',
} as const;

export type MainNavKey = 'explore' | 'touristPoints' | 'routes' | 'map' | 'partnerProgram';

export const MAIN_NAV: Array<{key:MainNavKey;label:string;href:string}> = [
  {key:'explore', label:'Explorar', href:ROUTES.explore},
  {key:'touristPoints', label:'Pontos turísticos', href:ROUTES.touristPoints},
  {key:'routes', label:'Roteiros', href:ROUTES.demoTrip},
  {key:'map', label:'Mapa', href:ROUTES.map},
  {key:'partnerProgram', label:'Para parceiros', href:ROUTES.partnerProgram},
];
