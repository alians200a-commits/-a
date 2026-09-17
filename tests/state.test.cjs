const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

// Controller-only harness: does not emulate layout, touch APIs or a browser.
function boot(saved){
  const nodes=new Map();let lastSaved;
  const get=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',disabled:false,dataset:{},hidden:false,classList:{toggle(){},add(){}},focus(){}});return nodes.get(id);};
  const listeners={};
  const context=vm.createContext({document:{getElementById:get,addEventListener:(name,fn)=>listeners[name]=fn},localStorage:{getItem:()=>saved,setItem:(key,value)=>lastSaved=JSON.parse(value)},confirm:()=>false});
  for(const name of ['lesson.js','vendor/kitkit-trace-locator.js','trace.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',name),'utf8'),context);
  return {read:code=>vm.runInContext(code,context),saved:()=>lastSaved,click:button=>listeners.click({target:{closest:()=>button}}),get};
}
test('corrupt storage starts a usable new lesson',()=>{
 const app=boot('{invalid');assert.equal(app.read('state.stage'),0);assert.equal(app.read('state.finished'),false);assert.equal(app.get('next').disabled,true);
});
test('stored finished flag without completed activities cannot finish lesson',()=>{
 const app=boot(JSON.stringify({version:1,stage:0,seen:[0,0,99,-1],selected:[1,3,5],finished:true}));
 assert.equal(app.read('state.finished'),false);assert.equal(app.read('state.selected.length'),0);assert.equal(app.get('next').disabled,true);
});
test('five distinct words unlock next and wrong letters do not count',()=>{
 const app=boot(null);
 for(let i=0;i<5;i++)app.click({dataset:{word:String(i)}});
 assert.equal(app.saved().seen.length,5);assert.equal(app.get('next').disabled,false);
 app.click({id:'next',dataset:{}});assert.equal(app.read('state.stage'),1);
 app.click({dataset:{letter:'1'},classList:{add(){}}});assert.equal(app.saved().selected.length,0);
 for(const i of [0,2,4])app.click({dataset:{letter:String(i)}});
 assert.equal(app.get('next').disabled,false);
});
test('wrong completion answer cannot count and a repeated answer counts once',()=>{
 const app=boot(JSON.stringify({version:1,stage:3}));
 app.click({dataset:{stage:'3'}});
 app.click({dataset:{answer:'ى'}});assert.equal(app.saved().fillDone.length,0);
 app.click({dataset:{answer:'ا'}});app.click({dataset:{answer:'ا'}});
 assert.equal(app.saved().fillDone.length,1);assert.equal(app.get('next').disabled,true);
});

test('home and garden preserve progress and do not award unseen words',()=>{
 const app=boot(null);
 assert.equal(app.read('view'),'home');
 assert.equal(app.read('state.seen.length'),0);
 assert.equal(app.get('lesson-dock').hidden,true);
 app.click({id:'start-journey',dataset:{}});
 assert.equal(app.read('view'),'lesson');
 assert.equal(app.get('lesson-dock').hidden,false);
 assert.equal(app.read('state.seen.length'),1);
 app.click({id:'home',dataset:{}});
 assert.equal(app.read('view'),'home');
 assert.equal(app.get('lesson-dock').hidden,true);
 app.click({id:'garden',dataset:{}});
 assert.equal(app.read('view'),'garden');
 assert.equal(app.get('garden-count').textContent,0);
 assert.equal(app.read('state.seen.length'),1);
});
test('earned flower survives reload and resume opens first incomplete activity',()=>{
 const saved={version:1,stage:0,seen:[0,1,2,3,4],selected:[],traced:[],fillDone:[]};
 const app=boot(JSON.stringify(saved));
 assert.equal(app.get('garden-count').textContent,1);
 app.click({id:'start-journey',dataset:{}});
 assert.equal(app.read('state.stage'),1);
 app.click({id:'home',dataset:{}});
 assert.equal(app.read('state.seen.length'),5);
 assert.match(app.get('screen').innerHTML,/أزهرت هذه المحطة/);
});
