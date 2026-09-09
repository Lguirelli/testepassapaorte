export const dictionaries={
  "pt-BR":{home:"Início",explore:"Explorar",route:"Roteiro",passport:"Meu Passaporte",partners:"Parceiros",demo:"Modo de validação — conteúdo fictício"},
  en:{home:"Home",explore:"Explore",route:"Itinerary",passport:"My Passport",partners:"Partners",demo:"Validation mode — fictional content"},
  es:{home:"Inicio",explore:"Explorar",route:"Itinerario",passport:"Mi Pasaporte",partners:"Socios",demo:"Modo de validación — contenido ficticio"}
} as const;
export type Locale=keyof typeof dictionaries;
export const defaultLocale:Locale="pt-BR";
