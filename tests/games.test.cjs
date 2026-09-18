const {test}=require('node:test');
const assert=require('node:assert/strict');
const {MemoryRound,shuffle,hasTarget}=require('../game-core.js');
test('memory prevents double-click same card and locks mismatches',()=>{
 const m=new MemoryRound([0,1,2],()=>.5);
 assert.equal(m.pick(0),'first');assert.equal(m.pick(0),'ignored');
 const other=m.cards.findIndex(c=>c.id!==m.cards[0].id);
 assert.equal(m.pick(other),'miss');assert.equal(m.pick(3),'ignored');
 assert.equal(m.matched.length,0);m.conceal();assert.equal(m.locked,false);assert.equal(m.open.length,0);
});
test('memory counts only distinct picture-word pairs and completes exactly once',()=>{
 const m=new MemoryRound([0,1,2],()=>.4);
 for(const id of [0,1,2]){const a=m.cards.findIndex(c=>c.id===id&&c.kind==='picture'),b=m.cards.findIndex(c=>c.id===id&&c.kind==='word');m.pick(a);assert.equal(m.pick(b),id===2?'complete':'match');assert.equal(m.pick(a),'ignored');}
 assert.equal(m.complete,true);assert.equal(m.matched.length,6);
});
test('shuffle preserves all source items without mutating content',()=>{
 const a=['ا','ي','ا','ل','ى','ط'];const b=shuffle(a,()=>.3);
 assert.deepEqual([...a].sort(),[...b].sort());assert.deepEqual(a,['ا','ي','ا','ل','ى','ط']);
});
test('workbook page 5 coloring discriminates exact source words',()=>{
 assert.equal(hasTarget('ملك'),false);for(const word of ['مال','هدى','هادي'])assert.equal(hasTarget(word),true);
});
