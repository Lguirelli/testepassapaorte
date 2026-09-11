const fs=require('fs'), vm=require('vm');
const routes=['#/','#/parceiros/cafe-neblina-alta','#/explorar?relation=public_point','#/para-parceiros','#/roteiro','#/viagens/demo-trip-001/roteiro','#/meu-passaporte','#/admin'];
let failures=[];
for(const hash of routes){
  const app={innerHTML:'',focus(){}};
  const toast={textContent:'',classList:{add(){},remove(){}},_t:null};
  const theme={value:'system',addEventListener(){}};
  const generic={classList:{add(){},remove(){},toggle(){return false},contains(){return false}},setAttribute(){},focus(){}};
  const document={
    documentElement:{dataset:{}},body:{dataset:{},classList:{add(){},remove(){},toggle(){}}},
    getElementById(id){if(id==='app')return app;if(id==='toast')return toast;if(id==='theme-select')return theme;return generic},
    querySelector(sel){if(sel==='#theme-select')return theme;return null},querySelectorAll(){return []},
    addEventListener(){},
  };
  const store={};
  const localStorage={getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=String(v)};
  const location={hash};
  const window={PSN_DATA:null,addEventListener(){},scrollTo(){},location};
  const sandbox={window,document,localStorage,location,navigator:{clipboard:null},confirm:()=>false,console,Intl,URLSearchParams,setTimeout:()=>0,clearTimeout(){},FormData:function(){},Date,encodeURIComponent,decodeURIComponent};
  vm.createContext(sandbox);
  try{
    vm.runInContext(fs.readFileSync('data.js','utf8'),sandbox,{filename:'data.js'});
    vm.runInContext(fs.readFileSync('app.js','utf8'),sandbox,{filename:'app.js'});
    if(!app.innerHTML || !/<(section|div)/.test(app.innerHTML)) throw new Error('empty render');
    console.log('PASS',hash,'bytes',app.innerHTML.length,'page',document.body.dataset.page||'');
  }catch(e){failures.push([hash,e.stack||String(e)]);console.error('FAIL',hash,e.message)}
}
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exit(1)}
