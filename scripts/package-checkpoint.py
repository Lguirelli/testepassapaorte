"""Package a checkpoint against the original ZIP without requiring Git history."""
import argparse
import hashlib
import json
import shutil
import zipfile
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('base_zip', type=Path)
parser.add_argument('--block', default='08')
args = parser.parse_args()
root = Path.cwd()
dest = root / 'deliveries'
dest.mkdir(exist_ok=True)

def sha(data):
    return hashlib.sha256(data).hexdigest()

with zipfile.ZipFile(args.base_zip) as base:
    assert base.testzip() is None
    original = {}
    for name in base.namelist():
        path = Path(name)
        assert not path.is_absolute() and '..' not in path.parts
        if not name.endswith('/'):
            original[str(Path(*path.parts[1:]))] = sha(base.read(name))

excluded = {'node_modules', '.next', '.next-build', '.git', '.data',
            'deliveries', 'test-results', 'playwright-report', '__pycache__',
            '.sites-runtime'}
generated = {'MANIFEST.json', 'SHA256SUMS.txt', 'FILES_CHANGED.txt',
             'BLOCK_REPORT.md', 'VALIDATION.md'}
files = {}
for path in root.rglob('*'):
    rel = path.relative_to(root)
    if any(part in excluded for part in rel.parts):
        continue
    if not path.is_file() or path.is_symlink():
        continue
    if path.name.startswith('.env') and path.name != '.env.example':
        continue
    if path.suffix in {'.tsbuildinfo', '.pyc'} or str(rel) in generated:
        continue
    files[str(rel)] = path
changed = sorted(name for name, path in files.items()
                 if original.get(name) != sha(path.read_bytes()))
removed = sorted(name for name in original if name not in files
                 and name not in generated)
assert not removed, f'Unexpected removals require explicit handling: {removed}'
results = []
for label, names in [(f'block_{args.block}', changed), ('LATEST', sorted(files))]:
    folder = dest / label
    assert not folder.exists(), 'Use a fresh delivery destination'
    folder.mkdir()
    for name in names:
        target = folder / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(files[name], target)
    shutil.copyfile(root / 'docs/validation' / f'BLOCK-{args.block}.md', folder / 'BLOCK_REPORT.md')
    shutil.copyfile(root / 'VALIDATION_REPORT.md', folder / 'VALIDATION.md')
    (folder / 'FILES_CHANGED.txt').write_text('\n'.join(changed) + '\n')
    manifest = {str(p.relative_to(folder)): sha(p.read_bytes())
                for p in sorted(folder.rglob('*')) if p.is_file()}
    (folder / 'MANIFEST.json').write_text(json.dumps(manifest, indent=2) + '\n')
    sums = dict(manifest)
    sums['MANIFEST.json'] = sha((folder / 'MANIFEST.json').read_bytes())
    (folder / 'SHA256SUMS.txt').write_text(''.join(f'{h}  {n}\n' for n, h in sorted(sums.items())))
    archive = dest / f'{label}.zip'
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
        for path in sorted(folder.rglob('*')):
            if path.is_file():
                z.write(path, f'{label}/{path.relative_to(folder)}')
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        assert set(z.namelist()) == {f'{label}/{n}' for n in sums} | {f'{label}/SHA256SUMS.txt'}
        for name, digest in sums.items():
            assert sha(z.read(f'{label}/{name}')) == digest
        assert z.read(f'{label}/SHA256SUMS.txt') == (folder / 'SHA256SUMS.txt').read_bytes()
    results.append({'file': archive.name, 'sha256': sha(archive.read_bytes()),
                    'bytes': archive.stat().st_size, 'crc': 'PASS',
                    'payload_sha256': 'PASS', 'validation': 'PARTIAL'})
(dest / 'DELIVERY_RECEIPT.json').write_text(json.dumps(results, indent=2) + '\n')
state = (root / 'WORK_STATE.md').read_text() + '\n## SHA-256 das entregas fechadas\n\n'
state += ''.join(f"{r['file']}: {r['sha256']}\n\n" for r in results)
(dest / 'WORK_STATE.md').write_text(state)
data = Path('/mnt/data')
if data.is_dir():
    for result in results:
        shutil.copyfile(dest / result['file'], data / f"passaporte-serra-negra-{result['file']}")
    shutil.copyfile(dest / 'WORK_STATE.md', data / 'WORK_STATE.md')
print(json.dumps(results, indent=2))
