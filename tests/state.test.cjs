const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

// Controller-only harness: does not emulate layout, touch APIs or a browser.
function boot(saved){
  const nodes=new Map();let lastSaved;const storage=new Map([['qiraati:new-curriculum:alif:v1',saved]]);
  const get=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',disabled:false,dataset:{},hidden:false,classList:{toggle(){},add(){}},focus(){},setAttribute(){},querySelectorAll(){return []},querySelector(){return null}});return nodes.get(id);};
  const listeners={};
  const context=vm.createContext({document:{getElementById:get,addEventListener:(name,fn)=>listeners[name]=fn},localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>{storage.set(key,value);lastSaved=JSON.parse(value)}},confirm:()=>false,setTimeout,clearTimeout});
  for(const name of ['lesson.js','scenes.js','game-core.js','games.js','vendor/kitkit-trace-locator.js','trace.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',name),'utf8'),context);
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

test('every reading word opens its own scene; fire fill uses fire scene',()=>{
 const app=boot(null);
 const paths=['house.webp','world.webp','sweets.webp','goal.webp','cane.webp'];
 paths.forEach((name,i)=>{app.click({dataset:{word:String(i)}});assert.ok(app.get('screen').innerHTML.includes(name));});
 app.click({dataset:{stage:'3'}});
 assert.match(app.get('screen').innerHTML,/scenes\/fire.webp/);
});
test('games are separate from lesson completion and cannot award by skipping',()=>{
 const app=boot(null);
 app.click({id:'games',dataset:{}});
 assert.equal(app.read('view'),'games');
 assert.match(app.get('screen').innerHTML,/ساحة اللعب/);
 app.click({dataset:{game:'match',first:'0'}});
 const first=app.get('screen').innerHTML;
 app.click({id:'match-next',dataset:{}});
 assert.equal(app.get('screen').innerHTML,first);
 assert.equal(app.saved().gameWins.length,0);
 assert.equal(app.saved().seen.length,0);
 app.click({dataset:{match:'0'},classList:{add(){}}});
 assert.equal(app.get('match-next').hidden,false);
 app.click({id:'match-next',dataset:{}});
 assert.match(app.get('screen').innerHTML,/2 من 5/);
 app.click({id:'home',dataset:{}});
 assert.equal(app.read('view'),'home');
});
test('activity-book coloring rejects ملك and awards only three correct cards',()=>{
 const app=boot(null);
 app.click({dataset:{game:'paint'}});
 const click=i=>app.click({dataset:{paint:String(i)},classList:{add(){}},setAttribute(){}});
 click(0);app.click({id:'paint-prize',dataset:{}});
 assert.equal(app.saved().gameWins.length,0);
 click(1);click(1);click(2);app.click({id:'paint-prize',dataset:{}});
 assert.equal(app.saved().gameWins.length,0);
 click(3);app.click({id:'paint-prize',dataset:{}});
 assert.equal(app.saved().gameWins[0],'paint');
 assert.equal(app.saved().selected.length,0);
});
test('malformed stored game rewards are filtered and valid rewards restored',()=>{
 const app=boot(JSON.stringify({version:1,gameWins:['paint','paint','fake',7]}));
 assert.equal(app.saved().gameWins.length,1);
 assert.equal(app.saved().gameWins[0],'paint');
});

test('lesson switching preserves independent progress and rewards',()=>{
 const app=boot(null);
 app.click({dataset:{word:'4'}});
 app.read("state.gameWins.push('memory');save()");
 app.click({dataset:{lesson:'waw'}});
 assert.equal(app.read('LESSON.words.length'),4);
 assert.equal(app.read('state.seen.length'),0);
 assert.equal(app.read('state.gameWins.length'),0);
 for(let i=0;i<4;i++)app.click({dataset:{word:String(i)}});
 assert.equal(app.get('next').disabled,false);
 app.click({dataset:{lesson:'alif'}});
 assert.equal(app.read('state.seen.join()'),'4');
 assert.equal(app.read('state.gameWins.join()'),'memory');
 app.click({dataset:{lesson:'waw'}});
 assert.equal(app.read('state.seen.length'),4);
});
test('waw letter and fill gates use source counts, not alif counts',()=>{
 const app=boot(null);app.click({dataset:{lesson:'waw'}});
 app.click({dataset:{stage:'1'}});
 for(const i of [1,3])app.click({dataset:{letter:String(i)}});
 assert.equal(app.get('next').disabled,false);
 app.click({dataset:{stage:'3'}});
 app.click({dataset:{answer:'ر'}});assert.equal(app.read('state.fillDone.length'),0);
 for(let i=0;i<4;i++){app.click({dataset:{answer:'و'}});if(i<3)app.click({id:'next-word',dataset:{}});}
 assert.equal(app.read('state.fillDone.length'),4);assert.equal(app.get('next').disabled,false);
 app.click({id:'next-word',dataset:{}});assert.equal(app.read('fillIndex'),0);
});
test('waw coloring rejects دب and retains its own award',()=>{
 const app=boot(null);app.click({dataset:{lesson:'waw'}});app.click({dataset:{game:'paint'}});
 const pick=i=>app.click({dataset:{paint:String(i)},classList:{add(){}},setAttribute(){}});
 pick(2);app.click({id:'paint-prize',dataset:{}});assert.equal(app.read('state.gameWins.length'),0);
 [0,1,3].forEach(pick);app.click({id:'paint-prize',dataset:{}});assert.equal(app.read('state.gameWins.join()'),'paint');
 app.click({dataset:{lesson:'alif'}});assert.equal(app.read('state.gameWins.length'),0);
});
test('waw match completes after four correct rounds',()=>{
 const app=boot(null);app.click({dataset:{lesson:'waw'}});app.click({dataset:{game:'match',first:'0'}});
 for(let round=0;round<4;round++){
  for(let i=0;i<4;i++)app.click({dataset:{match:String(i)},classList:{add(){}}});
  app.click({id:'match-next',dataset:{}});
 }
 assert.equal(app.read('state.gameWins.join()'),'match');
 assert.match(app.get('screen').innerHTML,/لعبت… واكتشفت/);
});
