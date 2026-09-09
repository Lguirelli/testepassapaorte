from pathlib import Path
import asyncio, sys, shutil, base64, mimetypes, re
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
SHOW=ROOT/'showcase'
OUT=ROOT/'artifacts'/'showcase'
PAGES=['index','explorar','lugar','roteiro','passaporte','admin']
VIEWPORTS={'desktop':(1440,1000),'tablet':(1024,900),'mobile':(390,844)}

def data_uri(path:Path):
    mime=mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return f"data:{mime};base64,"+base64.b64encode(path.read_bytes()).decode('ascii')

def inline_html(name:str):
    html=(SHOW/f'{name}.html').read_text(encoding='utf-8')
    css=(SHOW/'styles.css').read_text(encoding='utf-8')
    css='\n'.join(line for line in css.splitlines() if not line.lstrip().startswith('@import '))
    js=(SHOW/'app.js').read_text(encoding='utf-8')
    html=html.replace("<link rel='stylesheet' href='styles.css'>",f'<style>{css}</style>')
    html=html.replace("<script src='app.js'></script>",f'<script>{js}</script>')
    # Inline referenced SVGs so capture needs no file/network access.
    refs=set(re.findall(r"assets/(?:icons|illustrations)/[^'\")]+\.svg",html))
    for ref in refs:
        p=SHOW/ref
        if p.exists(): html=html.replace(ref,data_uri(p))
    return html

async def main():
    errors=[]
    OUT.mkdir(parents=True,exist_ok=True)
    async with async_playwright() as p:
        system_chromium=shutil.which('chromium') or shutil.which('chromium-browser')
        kwargs={'headless':True}
        if system_chromium: kwargs['executable_path']=system_chromium
        browser=await p.chromium.launch(**kwargs)
        for vp,(w,h) in VIEWPORTS.items():
            d=OUT/vp; d.mkdir(parents=True,exist_ok=True)
            for name in PAGES:
                page=await browser.new_page(viewport={'width':w,'height':h})
                console=[]
                page.on('console',lambda msg, c=console: c.append(f'{msg.type}: {msg.text}') if msg.type=='error' else None)
                await page.set_content(inline_html(name),wait_until='load')
                await page.wait_for_timeout(100)
                overflow=await page.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth + 1')
                if overflow: errors.append(f'{vp}/{name}: horizontal overflow')
                if console: errors.append(f'{vp}/{name}: console {console}')
                await page.screenshot(path=str(d/f'{name}.png'),full_page=True)
                await page.close()
        # Theme regression: key surfaces in dark mode on desktop and mobile.
        for vp,(w,h) in {'desktop-dark':(1440,1000),'mobile-dark':(390,844)}.items():
            d=OUT/vp; d.mkdir(parents=True,exist_ok=True)
            for name in ['index','passaporte']:
                page=await browser.new_page(viewport={'width':w,'height':h})
                console=[]
                page.on('console',lambda msg, c=console: c.append(f'{msg.type}: {msg.text}') if msg.type=='error' else None)
                await page.set_content(inline_html(name),wait_until='load')
                await page.evaluate("document.documentElement.dataset.theme='dark'")
                await page.wait_for_timeout(100)
                overflow=await page.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth + 1')
                if overflow: errors.append(f'{vp}/{name}: horizontal overflow')
                if console: errors.append(f'{vp}/{name}: console {console}')
                await page.screenshot(path=str(d/f'{name}.png'),full_page=True)
                await page.close()
        await browser.close()
    if errors:
        print('\n'.join(errors)); sys.exit(1)
    print(f'showcase screenshots ok: {len(PAGES)*len(VIEWPORTS)+4}')
asyncio.run(main())
