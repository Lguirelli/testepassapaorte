"""Build delta and complete snapshots from Git; verify every file by SHA-256."""
import argparse,hashlib,json,shutil,subprocess,zipfile
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('block');p.add_argument('base');p.add_argument('destination');a=p.parse_args()
root=Path.cwd();dest=Path(a.destination).resolve();dest.mkdir(parents=True,exist_ok=True)
block=dest/f'block_{a.block}';latest=dest/'LATEST'
# Remove only generated staging folders, never project files.
for d in (block,latest):
 if d.exists():shutil.rmtree(d)
 d.mkdir()
tracked=subprocess.check_output(['git','ls-files','-z']).decode().split('\0');tracked=[f for f in tracked if f and (root/f).is_file()]
changed=subprocess.check_output(['git','diff','--name-only',a.base,'HEAD','--']).decode().splitlines()
related=[f for f in changed if (root/f).is_file()]
for folder,files in ((latest,tracked),(block,related)):
 for f in files:
  target=folder/f;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(root/f,target)
 shutil.copyfile(root/'docs/validation'/f'BLOCK-{a.block}.md',folder/'BLOCK_REPORT.md')
 shutil.copyfile(root/'WORK_STATE.md',folder/'WORK_STATE.md')
shutil.copyfile(root/'WORK_STATE.md',dest/'WORK_STATE.md')
(block/'APPLY.md').write_text(f'Apply these files over the preceding snapshot. For a standalone runnable checkout use LATEST.zip.\nBase: {a.base}\nHead: '+subprocess.check_output(['git','rev-parse','HEAD']).decode())
results=[]
for folder in (block,latest):
 manifest={str(f.relative_to(folder)):hashlib.sha256(f.read_bytes()).hexdigest() for f in sorted(folder.rglob('*')) if f.is_file()}
 (folder/'MANIFEST.json').write_text(json.dumps(manifest,indent=2))
 archive=dest/(folder.name+'.zip')
 with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
  for f in sorted(folder.rglob('*')):
   if f.is_file():z.write(f,str(f.relative_to(dest)))
 assert archive.is_file() and archive.stat().st_size>0
 with zipfile.ZipFile(archive) as z:
  assert z.testzip() is None
  expected={folder.name+'/'+f for f in manifest}|{folder.name+'/MANIFEST.json'}
  assert set(z.namelist())==expected
  for f,digest in manifest.items():assert hashlib.sha256(z.read(folder.name+'/'+f)).hexdigest()==digest
  for f in ['BLOCK_REPORT.md','WORK_STATE.md']:assert folder.name+'/'+f in z.namelist()
  if folder==latest:
   for f in ['package.json','package-lock.json','.env.example','README.md','drizzle/0000_validation.sql','seed/validation-content.json','src/app/meu-passaporte/page.tsx']:assert 'LATEST/'+f in z.namelist()
 results.append({'archive':str(archive),'bytes':archive.stat().st_size,'files':len(expected),'status':'PASS'})
(dest/f'block_{a.block}_ZIP_VALIDATION.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
