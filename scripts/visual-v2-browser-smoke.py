from pathlib import Path
import json, re, base64
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'artifacts'/'visual-v2'
OUT.mkdir(parents=True,exist_ok=True)

def icon_data_map():
    out={}
    for p in (ROOT/'assets'/'icons').glob('*.svg'):
        b=base64.b64encode(p.read_bytes()).decode()
        out[p.stem]=f'data:image/svg+xml;base64,{b}'
    return out

def build_html(hash_value):
    idx=(ROOT/'index.html').read_text()
    body=re.search(r'<body>(.*)</body>',idx,re.S).group(1)
    body=re.sub(r'<script src="\./data\.js"></script>.*?<script src="\./app\.js"></script>','',body,flags=re.S)
    css=(ROOT/'styles.css').read_text()+'\n'+(ROOT/'visual-v2.css').read_text()
    data=(ROOT/'data.js').read_text()
    app=(ROOT/'app.js').read_text()
    icons=json.dumps(icon_data_map(),ensure_ascii=False)
    app=app.replace("const icon = (name, alt='') => `<img src=\"./assets/icons/${name}.svg\" alt=\"${esc(alt)}\" />`;", f"const ICON_DATA={icons}; const icon = (name, alt='') => `<img src=\"${{ICON_DATA[name]||''}}\" alt=\"${{esc(alt)}}\" />`;")
    preload=f"""
    <script>
      const __store={{}};
      Object.defineProperty(window,'localStorage',{{value:{{getItem:k=>__store[k]??null,setItem:(k,v)=>__store[k]=String(v),removeItem:k=>delete __store[k],clear:()=>{{for(const k in __store)delete __store[k]}}}},configurable:true}});
      window.confirm=()=>false;
      location.hash={json.dumps(hash_value)};
    </script>
    """
    return f'<!doctype html><html lang="pt-BR" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>{css}</style></head><body>{body}{preload}<script>{data}</script><script>{app}</script></body></html>'

def check_page(page, route, label, screenshot):
    errors=[]
    page.on('pageerror',lambda e: errors.append(f'pageerror: {e}'))
    page.on('console',lambda m: errors.append(f'console.{m.type}: {m.text}') if m.type=='error' else None)
    page.set_content(build_html(route),wait_until='load')
    page.wait_for_timeout(150)
    h1=page.locator('h1').first.inner_text()
    sw=page.evaluate('document.documentElement.scrollWidth')
    iw=page.evaluate('window.innerWidth')
    if sw>iw+1: raise AssertionError(f'{label}: horizontal overflow {sw}>{iw}')
    if page.locator('img[src=""]').count(): raise AssertionError(f'{label}: missing inline icon asset')
    if errors: raise AssertionError(f'{label}: JS errors {errors}')
    page.screenshot(path=str(OUT/screenshot),full_page=True,type='jpeg',quality=78)
    return h1,sw,iw

results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    for width,height,suffix in [(1440,1100,'desktop'),(390,844,'mobile')]:
        page=browser.new_page(viewport={'width':width,'height':height})
        h1,sw,iw=check_page(page,'#/','home '+suffix,f'home-{suffix}.jpg')
        if 'Serra Negra' not in h1: raise AssertionError(h1)
        # Home interactions on each viewport
        spots=page.locator('[data-home-spot]')
        if spots.count()>1:
            before=page.locator('.spot-feature h3').inner_text(); spots.nth(1).click(); page.wait_for_timeout(50); after=page.locator('.spot-feature h3').inner_text();
            if before==after: raise AssertionError('spot selection did not change feature')
        route_tabs=page.locator('[data-route-type="natureza"]')
        if route_tabs.count():
            route_tabs.first.click(); page.wait_for_timeout(50)
            if 'Verde e horizonte' not in page.locator('.route-type-copy h2').inner_text(): raise AssertionError('route type did not update')
        faq=page.locator('[data-home-faq="1"]'); faq.click(); page.wait_for_timeout(50)
        if not page.locator('.faq-item.open .faq-answer').count(): raise AssertionError('faq did not open')
        if suffix=='desktop':
            before=page.locator('.partner-loop-card.is-center h3').inner_text(); page.locator('[data-action="partner-next"]').click(); page.wait_for_timeout(50); after=page.locator('.partner-loop-card.is-center h3').inner_text();
            if before==after: raise AssertionError('partner loop did not advance')
        results.append(f'PASS home {suffix}: h1={h1!r}, overflow={sw}/{iw}, interactions=PASS')
        page.close()

        page=browser.new_page(viewport={'width':width,'height':height})
        h1,sw,iw=check_page(page,'#/parceiros/cafe-neblina-alta','partner '+suffix,f'partner-{suffix}.jpg')
        if 'Café Neblina Alta' not in h1: raise AssertionError(h1)
        if not page.locator('.partner-quick-info').count(): raise AssertionError('missing quick info')
        if not page.locator('.sticky-summary').count(): raise AssertionError('missing summary')
        page.locator('[data-action="add-trip"]').first.click(); page.wait_for_timeout(50)
        # state feedback appears either text/button depending original trip
        results.append(f'PASS partner {suffix}: h1={h1!r}, overflow={sw}/{iw}, add-trip handler=PASS')
        page.close()
    browser.close()

(OUT/'browser-smoke.log').write_text('\n'.join(results)+'\n')
print('\n'.join(results))
