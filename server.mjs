import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {publicFiles} from './project-files.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const allowed=new Set(publicFiles);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.woff':'font/woff','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8'};
export function createStaticServer(){
  return http.createServer(async(req,res)=>{
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
    let name;
    try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html';}
    catch{res.writeHead(400);res.end('Bad request');return;}
    if(!allowed.has(name)){res.writeHead(404);res.end('Not found');return;}
    try{
      const body=await readFile(path.join(root,name));
      res.writeHead(200,{'Content-Type':mime[path.extname(name)]||'application/octet-stream','Content-Length':body.length,'X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});
      res.end(req.method==='HEAD'?undefined:body);
    }catch{res.writeHead(404);res.end('Not found');}
  });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const port=Number(process.env.PORT||3000);
  createStaticServer().listen(port,'0.0.0.0',()=>console.log(`Qiraati 0.7: http://localhost:${port}`));
}
