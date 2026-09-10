/* eslint-disable */
import type {StampTheme} from './types';
export const palette={terracotta:'#A24B2A',olive:'#4D5E32',petroleum:'#16616A',mustard:'#89620E',burgundy:'#782C3C',navy:'#274C6D',warmBrown:'#684838'};
export function contrast(a:string,b:string){const luminance=(s:string)=>{const v=s.slice(1).match(/../g)!.map(x=>parseInt(x,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722;};const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
export function createStampTheme(input:Partial<StampTheme>&{palette:string[]}):StampTheme {
 const background=input.background??'#F6F1E7';if(!/^#[0-9a-f]{6}$/i.test(background))throw new Error('Fundo inválido');
 const colors=input.palette.filter(c=>/^#[0-9a-f]{6}$/i.test(c)&&contrast(c,background)>=4.5);
 if(!colors.length)throw new Error('A paleta precisa de uma cor com contraste mínimo de 4,5:1');
 return {id:input.id??'custom',version:input.version??1,palette:colors,background};
}
export const defaultTheme=createStampTheme({id:'serra-negra',palette:Object.values(palette)});
export const tokens={fontFamily:'"Stamp Condensed", "Arial Narrow", sans-serif',borderWidth:4,innerWidth:1.4,rotation:5,texture:.58};
