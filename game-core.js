/* Original game rules. Reference ideas: pair matching / flashcard reversal.
 * No external curriculum or unlicensed reference code is copied. */
(function(root){
 function shuffle(items,random=Math.random){
  const result=items.slice();
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
 }
 class MemoryRound{
  constructor(ids,random=Math.random){this.cards=shuffle(ids.flatMap(id=>[{id,kind:'picture'},{id,kind:'word'}]),random);this.open=[];this.matched=[];this.locked=false;}
  pick(index){
   if(!Number.isInteger(index)||index<0||index>=this.cards.length||this.locked||this.open.includes(index)||this.matched.includes(index))return 'ignored';
   this.open.push(index);
   if(this.open.length<2)return 'first';
   const [a,b]=this.open;
   if(this.cards[a].id===this.cards[b].id){this.matched.push(a,b);this.open=[];return this.complete?'complete':'match';}
   this.locked=true;return 'miss';
  }
  conceal(){this.open=[];this.locked=false;}
  get complete(){return this.matched.length===this.cards.length;}
 }
 function hasTarget(word){return /[اى]/u.test(word);}
 const api={shuffle,MemoryRound,hasTarget};
 if(typeof module!=='undefined')module.exports=api;else root.ReadingGameRules=api;
})(typeof window!=='undefined'?window:globalThis);
