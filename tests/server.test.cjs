const {test}=require('node:test');
const assert=require('node:assert/strict');
test('serves all shipped assets and blocks non-public files',async()=>{
  const {createStaticServer}=await import('../server.mjs');
  const {publicFiles}=await import('../project-files.mjs');
  const server=createStaticServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  try{
    for(const name of publicFiles){const r=await fetch(`${base}/${name}`);assert.equal(r.status,200,name);assert.ok((await r.arrayBuffer()).byteLength>0,name);}
    assert.equal((await fetch(base+'/')).status,200);
    assert.equal((await fetch(base+'/package.json')).status,404);
    assert.equal((await fetch(base+'/%2e%2e%2fpackage.json')).status,404);
    assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
    const font=await fetch(base+'/assets/fonts/Lalezar.woff',{method:'HEAD'});assert.equal(font.headers.get('content-type'),'font/woff');assert.equal((await font.text()).length,0);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
