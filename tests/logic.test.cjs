const {test}=require('node:test');
const assert=require('node:assert/strict');
const TraceTracker=require('../trace.js');
const lesson=require('../lesson.js');
const points=Array.from({length:81},(_,i)=>({x:220,y:45+i*2.75}));
test('trace rejects a tap and a jump from start to end',()=>{
 const t=new TraceTracker(points,24);assert.equal(t.begin(points[0]),true);t.end();assert.equal(t.complete,false);
 t.begin(points[0]);t.move(points[80]);assert.equal(t.complete,false);assert.equal(t.active,false);
});
test('trace rejects starting at the bottom and accepts ordered coverage',()=>{
 const t=new TraceTracker(points,24);assert.equal(t.begin(points[80]),false);
 assert.equal(t.begin(points[0]),true);for(const p of points)t.move(p);assert.equal(t.complete,true);
});
test('trace can resume after lifting but not skip the remaining path',()=>{
 const t=new TraceTracker(points,24);t.begin(points[0]);for(const p of points.slice(0,35))t.move(p);t.end();
 assert.equal(t.begin(points[80]),false);assert.equal(t.begin(points[t.index]),true);
 for(const p of points.slice(t.index))t.move(p);assert.equal(t.complete,true);
});
test('fill exercise uses all five source words and correct letter forms',()=>{
 assert.deepEqual(lesson.fill.map(x=>x.word),['نار','مرمى','دار','حلوى','عصا']);
 assert.deepEqual(lesson.fill.map(x=>x.answer),['ا','ى','ا','ى','ا']);
 assert.equal(lesson.letters.filter(x=>['ا','ى'].includes(x)).length,3);
 for(const q of lesson.fill)assert.ok(q.word.includes(q.answer));
});
