'use client';
import {useEffect,useRef,useState} from 'react';
import {Icon} from '@/design-system/icons';

export type BookPage={id:string;title:string;content:React.ReactNode};

/**
 * The passport adapts to the space offered by its own container instead of
 * inferring a device from the global viewport. ResizeObserver preserves the
 * current chapter while the layout moves between one-page and two-page modes.
 */
export function Book({pages}:{pages:BookPage[]}){
  const [page,setPage]=useState(0);
  const [spreadSize,setSpreadSize]=useState(1);
  const ref=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const node=ref.current;
    if(!node||typeof ResizeObserver==='undefined')return;
    const update=(width:number)=>setSpreadSize(width>=720?2:1);
    update(node.getBoundingClientRect().width);
    const observer=new ResizeObserver(entries=>{
      const entry=entries[0];
      if(entry)update(entry.contentRect.width);
    });
    observer.observe(node);
    return()=>observer.disconnect();
  },[]);

  const safePage=Math.min(page,Math.max(0,pages.length-1));

  function go(next:number){
    setPage(Math.max(0,Math.min(next,pages.length-1)));
    requestAnimationFrame(()=>ref.current?.focus());
  }

  const visiblePages=pages.slice(safePage,safePage+spreadSize);
  const pageLabel=spreadSize===1
    ?`Página ${safePage+1} de ${pages.length}`
    :`Páginas ${safePage+1} e ${Math.min(safePage+2,pages.length)} de ${pages.length}`;

  return <>
    <div className="actions passport-book-controls">
      <button aria-controls="passport-book" disabled={safePage===0} onClick={()=>go(safePage-spreadSize)}><Icon name="chevron-esquerda"/>Página anterior</button>
      <label className="field passport-chapter-field">Capítulo
        <select aria-label="Capítulo do Passaporte" value={safePage} onChange={e=>go(Number(e.target.value))}>
          {pages.map((p,i)=><option key={p.id} value={i}>{i+1}. {p.title}</option>)}
        </select>
      </label>
      <button aria-controls="passport-book" disabled={safePage+spreadSize>=pages.length} onClick={()=>go(safePage+spreadSize)}>Próxima página<Icon name="chevron-direita"/></button>
    </div>
    <p aria-live="polite" className="muted">{pageLabel}</p>
    <div className="book" id="passport-book" ref={ref} tabIndex={-1} data-spread={spreadSize===2?'double':'single'}>
      {visiblePages.map((p,i)=><section className="book-page" key={p.id} data-testid={`passport-page-${p.id}`}>
        <p className="eyebrow">Passaporte Serra Negra</p><h2>{p.title}</h2>{p.content}<small className="page-number">{safePage+i+1}</small>
      </section>)}
    </div>
  </>;
}
