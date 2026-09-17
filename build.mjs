import {mkdir,copyFile,rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {publicFiles} from './project-files.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
await rm(path.join(root,'dist'),{recursive:true,force:true});
for(const name of publicFiles){
  const target=path.join(root,'dist',name);
  await mkdir(path.dirname(target),{recursive:true});
  await copyFile(path.join(root,name),target);
}
console.log(`Built ${publicFiles.length} local files into dist/`);
