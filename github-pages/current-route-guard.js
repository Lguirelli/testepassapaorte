(() => {
  'use strict';

  /*
   * current-home.js owns the canonical home and ready-route surfaces while the
   * legacy app.js still owns the rest of the static preview. The legacy router
   * performs an asynchronous route transition before rendering; on an owned
   * route that late render could overwrite the canonical surface with its
   * fallback page. Keep transitions synchronous only for the routes owned by
   * current-home.js so its scheduled render is always the final DOM update.
   *
   * This bridge is intentionally small and can be removed when the two static
   * routers are consolidated.
   */
  const app=document.getElementById('app');
  const ownsCurrentRoute=()=>{
    const route=String(location.hash||'#/').slice(1).split('?')[0];
    return route===''||route==='/'||route==='/roteiros'||route.startsWith('/roteiros/');
  };

  const nativeViewTransition=typeof document.startViewTransition==='function'
    ? document.startViewTransition.bind(document)
    : null;

  if(nativeViewTransition){
    document.startViewTransition=(update)=>{
      if(!ownsCurrentRoute())return nativeViewTransition(update);
      let result;
      try{result=update?.();}
      catch(error){
        const failed=Promise.reject(error);
        failed.catch(()=>{});
        return {ready:failed,updateCallbackDone:failed,finished:failed,skipTransition(){}};
      }
      const done=Promise.resolve(result);
      return {ready:done,updateCallbackDone:done,finished:done,skipTransition(){}};
    };
  }

  if(app&&typeof app.animate==='function'){
    const nativeAnimate=app.animate.bind(app);
    app.animate=(keyframes,options)=>{
      if(!ownsCurrentRoute())return nativeAnimate(keyframes,options);
      return nativeAnimate([{transform:'none'},{transform:'none'}],{duration:0,fill:'both'});
    };
  }
})();
