import {builtinIcons} from './icon-data';
import type {IconDefinition} from './types';
export const normalizeCategory=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/['’]/g,'').replace(/[\s_]+/g,'-').replace(/-+/g,'-');
export const iconRegistry:Record<string,IconDefinition>={};const aliases=new Map<string,string>();
// Only geometric SVG primitives are accepted. No root SVG, CSS, references, HTML or executable attributes.
export function sanitizeIcon(svg:string){
 const tags=svg.match(/<[^>]+>/g)??[];if(!tags.length||svg.replace(/<[^>]+>/g,'').trim())throw new Error('SVG precisa conter somente primitivas vetoriais');
 for(const tag of tags){if(!/^<(path|circle|ellipse|rect|line|polyline|polygon)\s/.test(tag)||!tag.endsWith('/>'))throw new Error('Elemento SVG não permitido');
 const body=tag.replace(/^<\w+\s*/,'').slice(0,-2);const pattern=/([\w-]+)="([^"]*)"/g;let m;while((m=pattern.exec(body))){if(!['d','cx','cy','r','rx','ry','x','y','x1','x2','y1','y2','width','height','points','fill','stroke','stroke-width','stroke-linecap','stroke-linejoin'].includes(m[1])||/[<>&]|url|javascript|data:/i.test(m[2]))throw new Error('Atributo SVG não permitido');}if(body.replace(pattern,'').trim())throw new Error('Atributo SVG inválido');}
 return svg;
}
export function registerIcon(icon:IconDefinition){if(!/^[a-z][a-z0-9-]*$/.test(icon.id))throw new Error('Identificador inválido');const safe={...icon,svg:sanitizeIcon(icon.svg)};iconRegistry[icon.id]=safe;for(const a of [icon.id,...icon.aliases])aliases.set(normalizeCategory(a),icon.id);}
export function registerCategory(c:{id:string;defaultIcon:string;aliases?:string[]}){if(!iconRegistry[c.defaultIcon])throw new Error('Ícone inexistente');for(const a of [c.id,...(c.aliases??[])])aliases.set(normalizeCategory(a),c.defaultIcon);}
for(const icon of builtinIcons)registerIcon(icon);
export function resolveStampIcon(input:{category:string;subcategory?:string;customIcon?:string}){
 for(const s of [input.customIcon,input.subcategory,input.category]){if(!s)continue;const key=aliases.get(normalizeCategory(s));if(key)return iconRegistry[key];}
 for(const s of [input.subcategory,input.category]){if(!s)continue;const normalized=normalizeCategory(s);for(const i of Object.values(iconRegistry))if(i.keywords?.some(k=>normalized.split('-').includes(normalizeCategory(k))))return i;}
 return iconRegistry['map-pin'];
}
