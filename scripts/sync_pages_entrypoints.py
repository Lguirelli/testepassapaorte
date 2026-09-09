from pathlib import Path
import shutil

root = Path(__file__).resolve().parents[1]
show = root / 'showcase'
files = ['index.html','explorar.html','lugar.html','parceiro.html','roteiro-criar.html','roteiro.html','calendario.html','passaporte.html','admin.html','404.html','styles.css','app.js']
for target in (root, root / 'docs'):
    for name in files:
        shutil.copy2(show / name, target / name)
    assets = target / 'assets'
    if assets.exists():
        shutil.rmtree(assets)
    shutil.copytree(show / 'assets', assets)
    (target / '.nojekyll').touch()
print('Static Pages entrypoints synchronized: root + docs')
