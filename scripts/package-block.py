"""Create a cumulative source checkpoint from the specified Git revision."""
from pathlib import Path
import subprocess, sys, zipfile, io
block = sys.argv[1]
revision = sys.argv[2] if len(sys.argv) > 2 else 'HEAD'
root = Path(__file__).resolve().parent.parent
output = Path(sys.argv[3]) if len(sys.argv) > 3 else root.parent / f'passaporte-bloco-{block}.zip'
raw = subprocess.check_output(['git', 'archive', '--format=zip', revision], cwd=root)
sha = subprocess.check_output(['git', 'rev-parse', revision], cwd=root, text=True).strip()
with zipfile.ZipFile(io.BytesIO(raw)) as source, zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as target:
    for item in source.infolist():
        target.writestr('passaporte-serra-negra-validation/' + item.filename, source.read(item.filename))
    target.writestr('passaporte-serra-negra-validation/CHECKPOINT.md', f'# Bloco {block}\n\nSnapshot cumulativo do commit {sha}.\n\nConsulte README.md, docs/validation e ADR-004 para execução e limitações. Código implementado não equivale a aprovação dos gates ainda bloqueados por infraestrutura.\n')
print(output)
