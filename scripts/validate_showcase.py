from pathlib import Path
from html.parser import HTMLParser
import sys
ROOT=Path(__file__).resolve().parents[1]
SHOW=ROOT/'showcase'
class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.refs=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        for key in ('href','src'):
            v=a.get(key)
            if v and not v.startswith(('http://','https://','#','mailto:','tel:','javascript:')):
                self.refs.append(v.split('?')[0].split('#')[0])
errors=[]
required=['index.html','explorar.html','lugar.html','parceiro.html','roteiro-criar.html','roteiro.html','calendario.html','passaporte.html','admin.html','404.html','styles.css','app.js','.nojekyll']
for name in required:
    if not (SHOW/name).exists(): errors.append(f'missing: {name}')
for html in SHOW.glob('*.html'):
    p=Parser(); p.feed(html.read_text(encoding='utf-8'))
    for ref in p.refs:
        if not ref: continue
        target=(html.parent/ref).resolve()
        if not target.exists() and '..' not in ref:
            errors.append(f'{html.name}: missing ref {ref}')
if errors:
    print('\n'.join(errors)); sys.exit(1)
print(f'showcase ok: {len(list(SHOW.glob("*.html")))} pages, local references resolved')
