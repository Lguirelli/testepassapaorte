// Portuguese is the source. Other locales deliberately use visible untranslated keys.
export const pt={brand:'Passaporte Serra Negra',explore:'Explorar',passport:'Meu Passaporte',plan:'Planejar minha viagem',admin:'Admin',partners:'Para parceiros',loading:'Carregando…',error:'Não foi possível carregar. Tente novamente.',empty:'Nenhum resultado para esta seleção.',skip:'Ir para o conteúdo',theme:'Aparência',light:'Claro',dark:'Escuro',system:'Sistema'};
export type Locale='pt-BR'|'en'|'es';
export function t(key:keyof typeof pt,locale:Locale='pt-BR'){return locale==='pt-BR'?pt[key]:`[${locale}:${key}]`;}
