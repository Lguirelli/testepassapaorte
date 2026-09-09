from pathlib import Path
import sys,re,base64
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]; src=R/'static-preview'; out=R/'artifacts/playwright-static'; out.mkdir(parents=True,exist_ok=True)
css=(src/'styles.css').read_text()
def inline_html(name):
 text=(src/f'{name}.html').read_text().replace('<link rel="stylesheet" href="styles.css">',f'<style>{css}</style>')
 def repl(m):
  fp=src/m.group(1); data=base64.b64encode(fp.read_bytes()).decode(); return f'src="data:image/svg+xml;base64,{data}"'
 return re.sub(r'src="(assets/[^"]+\.svg)"',repl,text)
viewports={'desktop':(1440,1000),'tablet':(1024,768),'mobile':(390,844)}; pages=['index','explorar','lugar','parceiro','roteiro','calendario','passaporte','admin']; failures=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for label,(w,h) in viewports.items():
  context=browser.new_context(viewport={'width':w,'height':h},reduced_motion='reduce' if label=='mobile' else 'no-preference')
  for name in pages:
   page=context.new_page(); errors=[];page.on('console',lambda m: errors.append(m.text) if m.type=='error' else None)
   page.set_content(inline_html(name),wait_until='load'); page.wait_for_timeout(100)
   overflow=page.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth + 2')
   if overflow: failures.append(f'{label}/{name}: horizontal overflow')
   if errors: failures.extend(f'{label}/{name}: console {e}' for e in errors)
   d=out/label;d.mkdir(exist_ok=True);page.screenshot(path=str(d/f'{name}.png'),full_page=True);page.close()
  context.close()
 browser.close()
if failures:
 print('\n'.join(failures));sys.exit(1)
print(f'Static visual validation OK: {len(viewports)*len(pages)} screenshots, no horizontal overflow or console errors.')
