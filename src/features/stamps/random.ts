/* eslint-disable */
export function hash(text: string): number {
  let h=2166136261; for(let i=0;i<text.length;i++) h=Math.imul(h^text.charCodeAt(i),16777619); return h>>>0;
}
export function createSeededRandom(seed: string|number) {
  let a=typeof seed==='number'?seed:hash(seed);
  const float=()=>{a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
  return {float,int:(min:number,max:number)=>Math.floor(float()*(max-min+1))+min,
    pick:<T>(items:T[]):T=>{if(!items.length)throw new Error('Lista vazia');return items[Math.floor(float()*items.length)];},
    weighted:<T>(items:[T,number][]):T=>{const total=items.reduce((s,i)=>s+Math.max(0,i[1]),0);if(!items.length||total<=0)throw new Error('Pesos inválidos');let r=float()*total;for(const [v,w] of items){r-=Math.max(0,w);if(r<0)return v;}return items[items.length-1][0];}
  };
}
