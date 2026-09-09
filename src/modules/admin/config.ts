import type {EntityKind} from "@/core/domain/types";
export const adminSections={
  lugares:{kind:"places",label:"Lugares",titleField:"name",canPublish:true},
  experiencias:{kind:"experiences",label:"Experiências",titleField:"name",canPublish:true},
  parceiros:{kind:"partners",label:"Parceiros",titleField:"id",canPublish:true},
  eventos:{kind:"events",label:"Eventos",titleField:"name",canPublish:true},
  categorias:{kind:"categories",label:"Categorias",titleField:"name",canPublish:true},
  fontes:{kind:"sources",label:"Fontes",titleField:"sourceName",canPublish:false},
} as const satisfies Record<string,{kind:EntityKind;label:string;titleField:string;canPublish:boolean}>;
export type AdminSection=keyof typeof adminSections;
export function resolveAdminSection(value:string){return (adminSections as Record<string,(typeof adminSections)[AdminSection]>)[value]??null;}
export type FieldDef={key:string;label:string;type:"text"|"textarea"|"number"|"select"|"json";options?:string[];readOnly?:boolean;help?:string};
export const fieldMetadata:Record<EntityKind,FieldDef[]>={
  places:[{key:"name",label:"Nome",type:"text"},{key:"slug",label:"Slug",type:"text"},{key:"shortDescription",label:"Descrição curta",type:"textarea"},{key:"longDescription",label:"Conteúdo editorial",type:"textarea"},{key:"environment",label:"Ambiente",type:"select",options:["indoor","outdoor","mixed"]},{key:"costType",label:"Custo",type:"text"},{key:"durationMinutes",label:"Duração sugerida (min)",type:"number"},{key:"categoryIds",label:"Categorias (JSON)",type:"json"},{key:"location",label:"Localização (JSON)",type:"json"}],
  experiences:[{key:"name",label:"Nome",type:"text"},{key:"slug",label:"Slug",type:"text"},{key:"placeId",label:"Lugar",type:"text"},{key:"costType",label:"Custo",type:"text"},{key:"bookingType",label:"Reserva",type:"text"},{key:"durationMinutes",label:"Duração (min)",type:"number"},{key:"environment",label:"Ambiente",type:"text"}],
  partners:[{key:"placeId",label:"Lugar relacionado",type:"text"},{key:"responseTime",label:"Tempo de resposta declarado",type:"text"},{key:"demoContacts",label:"Contatos DEMO (JSON)",type:"json"}],
  events:[{key:"name",label:"Nome",type:"text"},{key:"slug",label:"Slug",type:"text"},{key:"placeId",label:"Lugar",type:"text"},{key:"startsAt",label:"Início",type:"text"},{key:"endsAt",label:"Fim",type:"text"},{key:"costType",label:"Custo",type:"text"},{key:"environment",label:"Ambiente",type:"text"}],
  categories:[{key:"name",label:"Nome",type:"text"},{key:"slug",label:"Slug",type:"text"},{key:"icon",label:"Ícone oficial",type:"text"},{key:"sortOrder",label:"Ordem",type:"number"}],
  sources:[{key:"sourceName",label:"Fonte",type:"text"},{key:"sourceType",label:"Tipo",type:"text"},{key:"sourceUrl",label:"URL",type:"text"},{key:"verificationStatus",label:"Verificação",type:"text"},{key:"notes",label:"Notas",type:"textarea"}],
};
