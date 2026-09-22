import {createServer} from 'node:http';
import {createReadStream, existsSync, statSync} from 'node:fs';
import {extname, join, normalize, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(fileURLToPath(new URL('../github-pages/', import.meta.url)));
const port=Number(process.env.PORT||4173);
const host=process.env.HOST||'127.0.0.1';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2','.ttf':'font/ttf','.webmanifest':'application/manifest+json'};

createServer((req,res)=>{
  const url=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`);
  let pathname=decodeURIComponent(url.pathname);
  if(pathname==='/'||!extname(pathname)) pathname='/index.html';
  const target=normalize(join(root,pathname));
  if(!target.startsWith(root)||!existsSync(target)||!statSync(target).isFile()){
    res.writeHead(404,{'content-type':'text/plain; charset=utf-8'});
    res.end('Not found');
    return;
  }
  res.writeHead(200,{'content-type':types[extname(target).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});
  createReadStream(target).pipe(res);
}).listen(port,host,()=>console.log(`Passaporte visual: http://${host}:${port}`));
