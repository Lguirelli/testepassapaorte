import fs from 'node:fs';

const read=(file)=>fs.readFileSync(file,'utf8');
const home=read('src/components/HomeExperience.tsx');
const homeCss=read('src/app/home.module.css');
const nav=read('src/components/MainNavigation.tsx');
const globalCss=read('src/app/globals.css');
const sitemap=read('src/app/sitemap.ts');
const map=read('src/components/PlaceMap.tsx');
const failures=[];
const check=(name,ok,detail)=>{if(!ok)failures.push({name,detail});};

check('warp-text',home.includes('function WarpTitle')&&home.includes('--warp-a-x')&&homeCss.includes('.warpLineA'),'Warp Text precisa estar no runtime Next');
check('warp-input-guard',home.includes("(hover:hover) and (pointer:fine)")&&home.includes('prefers-reduced-motion'),'Warp Text deve respeitar capacidade de entrada e reduced motion');
check('dock-proximity',nav.includes('requestAnimationFrame')&&nav.includes("*.14")&&globalCss.includes('.dock-nav>a'),'Dock deve usar proximidade contínua sem reflow');
const hasVelocity=home.includes('state.velocity');
const hasProjectedInertia=/projected\s*=\s*(?:delta|\(event\.clientX-state\.startX\))\s*\+\s*state\.velocity\s*\*\s*180/.test(home);
check('gallery-inertia',hasVelocity&&hasProjectedInertia,'Galeria precisa usar velocidade para snap/inércia');
check('gallery-side-center',home.includes('gallerySideActivate')&&home.includes('Centralizar ${place.name}'),'Cards laterais precisam centralizar por ação explícita');
check('gallery-progressive-depth',home.includes("'--blur'")&&home.includes("'--side-scale'")&&homeCss.includes('filter:blur(var(--blur))'),'Galeria precisa de profundidade/blur progressivo');
check('route-slider-keyboard',home.includes("ArrowRight")&&home.includes("ArrowLeft")&&home.includes("role=\"tablist\""),'Slider de roteiro precisa de teclado');
check('route-transition',fs.existsSync('src/app/template.tsx')&&globalCss.includes('route-page-enter'),'Transição de rota precisa preservar header e animar conteúdo');
check('map-svg-semantics',((map.includes('className="map-pin-html"')&&map.includes('<button')&&map.includes('aria-label={`Selecionar')&&map.includes('<a key={place.id} className="map-pin-html"'))||(!map.includes('<button')&&map.includes('role="button"')&&map.includes("event.key==='Enter'"))),'Pins do mapa precisam de semântica/teclado válidos');
check('sitemap-build-safe',sitemap.includes("export const dynamic='force-dynamic'")&&(sitemap.includes('if(!process.env.DATABASE_URL)return staticEntries')||sitemap.includes('if(!isVisualMode()&&!process.env.DATABASE_URL)return staticEntries')),'Sitemap não pode exigir banco no prerender da Vercel');

console.log(JSON.stringify({at:new Date().toISOString(),status:failures.length?'FAIL':'PASS',checks:10,failures},null,2));
process.exit(failures.length?1:0);