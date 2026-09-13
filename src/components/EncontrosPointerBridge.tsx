'use client';

import {useEffect} from 'react';

type PendingTap={
  pointerId:number;
  button:HTMLButtonElement;
  startX:number;
  startY:number;
  moved:boolean;
  nativeClicked:boolean;
};

function sideCardButton(target:EventTarget|null){
  if(!(target instanceof Element))return null;
  const button=target.closest<HTMLButtonElement>('button[aria-label^="Centralizar "]');
  if(!button)return null;
  return button.closest('[data-testid="home-partner-gallery"]')?button:null;
}

/**
 * The gallery captures the pointer at stage level so dragging remains continuous even
 * when the cursor leaves a card. Some browsers consequently retarget the final click
 * to the stage. This bridge restores the intended tap/click on side cards without
 * weakening drag: a stationary pointer recenters the card, a moved pointer stays a drag.
 */
export function EncontrosPointerBridge(){
  useEffect(()=>{
    let pending:PendingTap|null=null;

    const onPointerDown=(event:PointerEvent)=>{
      const button=sideCardButton(event.target);
      if(!button)return;
      pending={pointerId:event.pointerId,button,startX:event.clientX,startY:event.clientY,moved:false,nativeClicked:false};
    };

    const onPointerMove=(event:PointerEvent)=>{
      if(!pending||pending.pointerId!==event.pointerId)return;
      const dx=event.clientX-pending.startX;
      const dy=event.clientY-pending.startY;
      if(Math.hypot(dx,dy)>8)pending.moved=true;
    };

    const onClick=(event:MouseEvent)=>{
      if(!pending)return;
      const button=sideCardButton(event.target);
      if(button===pending.button)pending.nativeClicked=true;
    };

    const finish=(event:PointerEvent)=>{
      if(!pending||pending.pointerId!==event.pointerId)return;
      const tap=pending;
      if(tap.moved){pending=null;return;}
      window.setTimeout(()=>{
        if(!tap.nativeClicked&&tap.button.isConnected)tap.button.click();
        if(pending===tap)pending=null;
      },0);
    };

    const cancel=(event:PointerEvent)=>{
      if(pending?.pointerId===event.pointerId)pending=null;
    };

    document.addEventListener('pointerdown',onPointerDown,true);
    document.addEventListener('pointermove',onPointerMove,true);
    document.addEventListener('pointerup',finish,true);
    document.addEventListener('pointercancel',cancel,true);
    document.addEventListener('click',onClick,true);
    return ()=>{
      document.removeEventListener('pointerdown',onPointerDown,true);
      document.removeEventListener('pointermove',onPointerMove,true);
      document.removeEventListener('pointerup',finish,true);
      document.removeEventListener('pointercancel',cancel,true);
      document.removeEventListener('click',onClick,true);
    };
  },[]);

  return null;
}
