/* Mini-game controller: original implementation using source-book words.
 * Games are enrichment; they do not fabricate completion of book activities. */
const ReadingGames=(()=>{
 let game=null,concealTimer=null,soundOn=false,audio=null;
 const titles={match:'الصورة وكلمتها',memory:'أين صديق البطاقة؟',catch:'صيد الحروف',paint:'ألوان الكلمات'};
 const descriptions={match:'شاهد المشهد واختر كلمته',memory:'اجمع الصورة مع كلمتها',catch:'اجمع ا وى من الفقاعات',paint:'لوّن كلمات كتاب النشاط'};
 function cancel(){if(concealTimer){clearTimeout(concealTimer);concealTimer=null;}if(game?.memory?.locked)game.memory.conceal();}
 function sound(){
  if(!soundOn)return;
  try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audio??=new Audio();if(audio.state==='suspended')audio.resume();
   [523.25,659.25,783.99].forEach((frequency,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.075;o.type='sine';o.frequency.value=frequency;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.045,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.19);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.2);});
  }catch{}
 }
 function win(){if(!state.gameWins.includes(game.type)){state.gameWins.push(game.type);save();}sound();celebrate();game.won=true;}
 function menu(){game=null;view='games';render(true);}
 function start(type,first){
  if(!titles[type])return;
  const rest=ReadingGameRules.shuffle(LESSON.words.map((_,i)=>i).filter(i=>i!==first));
  game={type,order:Number.isInteger(first)?[first,...rest]:rest,round:0,answered:false,won:false,caught:[],painted:[],paused:false};
  if(type==='memory')game.memory=new ReadingGameRules.MemoryRound(ReadingGameRules.shuffle(LESSON.words.map((_,i)=>i)).slice(0,3));
  if(type==='catch')game.bubbles=ReadingGameRules.shuffle(LESSON.letters.map((glyph,id)=>({glyph,id})));
  if(type==='match')prepareMatch();
  view='games';render(true);
 }
 function prepareMatch(){const id=game.order[game.round];game.choices=ReadingGameRules.shuffle([id,...ReadingGameRules.shuffle(LESSON.words.map((_,i)=>i).filter(i=>i!==id)).slice(0,2)]);game.answered=false;}
 function toolbar(){return `<div class="play-toolbar"><button class="secondary" id="play-menu">← ساحة اللعب</button><span class="play-caption">${titles[game.type]}</span><button class="secondary" id="game-sound" aria-pressed="${soundOn}">${soundOn?'إيقاف النغمات':'تشغيل النغمات'}</button></div>`;}
 function wrap(body,scene=state.word){return `<div class="game-page">${toolbar()}<div class="game-layout">${scenery(false,scene,true)}<section class="game-stage storybook">${body}</section></div></div>`;}
 function showMenu(){
  $('screen').innerHTML=`<section class="play-lobby"><div class="lobby-title"><span class="eyebrow">كلمات كتابنا… نلعب بها ونتعلم</span><h2>ساحة اللعب</h2><p>اختر مغامرتك</p></div><div class="game-menu">${Object.keys(titles).map((type,i)=>`<button class="game-door door-${type}" data-game="${type}"><span class="door-art">${i<2?picture(i===0?0:2):`<span class="door-glyph">${LESSON.targets[i===2?0:LESSON.targets.length-1]}</span>`}</span><span class="door-text"><strong>${titles[type]}</strong><small>${type==='catch'?'اجمع '+LESSON.targets.join(' و '):descriptions[type]}</small></span><span class="door-status">${state.gameWins.includes(type)?'✓':'←'}</span></button>`).join('')}</div><button class="secondary" data-go-home>العودة إلى رحلتي</button></section>`;
 }
 function show(){
  frame();
  if(!game){showMenu();return;}
  if(game.won){finish();return;}
  if(game.type==='match')showMatch();
  if(game.type==='memory')showMemory();
  if(game.type==='catch')showCatch();
  if(game.type==='paint')showPaint();
 }
 function showMatch(){
  const id=game.order[game.round];
  $('screen').innerHTML=wrap(`<span class="eyebrow">${game.round+1} من ${LESSON.words.length} · من كلمات القراءة</span><h2>ما كلمة هذه الصورة؟</h2><div class="match-picture">${picture(id)}</div><div class="match-answers">${game.choices.map(i=>`<button data-match="${i}" class="word-answer">${LESSON.words[i].word}</button>`).join('')}</div><p id="game-message" class="game-message" role="status">المس الكلمة التي تناسب الصورة</p><button id="match-next" class="primary" hidden>${game.round===LESSON.words.length-1?'شاهد مكافأتي':'المشهد التالي'} ←</button>`,id);
 }
 function match(id,b){
  if(game.answered||!game.choices.includes(id))return;
  if(id!==game.order[game.round]){motion('wrong',b);$('game-message').textContent='انظر إلى الصورة وجرّب كلمة أخرى';return;}
  game.answered=true;b.classList.add('correct');
  $('screen').querySelectorAll('[data-match]').forEach(n=>n.disabled=true);
  $('game-message').textContent='أحسنت! هذه كلمة '+LESSON.words[id].word;
  $('match-next').hidden=false;motion('reward',b);motion('scene',$('screen'));sound();
 }
 function showMemory(){
  const m=game.memory;
  $('screen').innerHTML=wrap(`<span class="eyebrow">صور وكلمات من درسنا</span><h2>الصورة تبحث عن كلمتها</h2><p class="small">اقلب بطاقتين: صورة وكلمتها</p><div class="memory-grid">${m.cards.map((c,i)=>`<button class="memory-card" data-memory="${i}" aria-label="بطاقة مغلقة ${i+1}"><span class="memory-inner"><span class="card-cover" aria-hidden="true"><span class="cover-flower">${flower}</span></span><span class="card-face" aria-hidden="true">${c.kind==='picture'?picture(c.id):`<span class="memory-word">${LESSON.words[c.id].word}</span>`}</span></span></button>`).join('')}</div><p id="game-message" class="game-message" role="status">ابحث عن الأزواج الثلاثة</p><button class="primary" id="memory-prize" hidden>شاهد مكافأتي ←</button>`,m.cards[0].id);
  syncMemory();
 }
 function syncMemory(){
  const m=game.memory;
  $('screen').querySelectorAll('[data-memory]').forEach(b=>{const i=Number(b.dataset.memory),shown=m.open.includes(i)||m.matched.includes(i);b.classList.toggle('revealed',shown);b.classList.toggle('paired',m.matched.includes(i));b.disabled=m.matched.includes(i);b.setAttribute('aria-label',shown?(m.cards[i].kind==='picture'?'صورة ':'كلمة ')+LESSON.words[m.cards[i].id].word:'بطاقة مغلقة '+(i+1));});
 }
 function memoryPick(i){
  const result=game.memory.pick(i);if(result==='ignored')return;
  syncMemory();
  if(result==='miss'){
   $('game-message').textContent='تذكّر مكانهما… وجرّب من جديد';
   const current=game;concealTimer=setTimeout(()=>{concealTimer=null;if(game!==current||view!=='games')return;game.memory.conceal();syncMemory();$('game-message').textContent='أين الصورة وكلمتها؟';},1100);
  }else if(result==='match'||result==='complete'){
   sound();$('game-message').textContent='وجدت '+game.memory.matched.length/2+' من 3 أزواج';
   if(result==='complete'){$('memory-prize').hidden=false;celebrate();}
  }
 }
 function showCatch(){
  $('screen').innerHTML=wrap(`<span class="eyebrow">حروف تمرين القراءة · صفحة ${LESSON.readingPage}</span><h2>اصطد ${LESSON.targets.join(" و ")}</h2><p class="small">المس الفقاعات التي تحمل الحرف المطلوب</p><div class="bubble-field" id="bubble-field">${game.bubbles.map((b,i)=>`<button data-bubble="${b.id}" class="letter-bubble ${game.caught.includes(b.id)?'caught':''}" style="--order:${i};--bubble-color:${['#a9e9ec','#ffd698','#cfc5f6'][i%3]}" ${game.caught.includes(b.id)?'disabled':''} aria-label="الحرف ${b.glyph}">${b.glyph}</button>`).join('')}</div><div class="catch-basket" aria-label="الحروف المجموعة">${LESSON.targetIndices.map(i=>`<span data-basket="${i}">${game.caught.includes(i)?LESSON.letters[i]:'·'}</span>`).join('')}</div><p id="game-message" class="game-message" role="status">جمعت ${game.caught.length} من ${LESSON.targetIndices.length}</p><div class="game-actions"><button id="pause-bubbles" class="secondary" aria-pressed="false">أوقف حركة الفقاعات</button><button id="catch-prize" class="primary" ${game.caught.length<LESSON.targetIndices.length?'hidden':''}>شاهد مكافأتي ←</button></div>`,1);
 }
 function catchLetter(i,b){
  if(game.caught.includes(i))return;
  if(!LESSON.targetIndices.includes(i)){motion('wrong',b);$('game-message').textContent='نبحث عن '+LESSON.targets.join(' أو ');return;}
  const from=b.getBoundingClientRect();game.caught.push(i);b.classList.add('caught');b.disabled=true;
  const target=$('screen').querySelector(`[data-basket="${i}"]`);target.textContent=LESSON.letters[i];motion('collect',from,target,LESSON.letters[i]);sound();
  $('game-message').textContent='جمعت '+game.caught.length+' من '+LESSON.targetIndices.length;if(game.caught.length===LESSON.targetIndices.length)$('catch-prize').hidden=false;
 }
 function showPaint(){
  $('screen').innerHTML=wrap(`<span class="eyebrow">كتاب النشاط · صفحة ${LESSON.workbookPage} · نشاط ٢</span><h2>لوّن البطاقة الصحيحة</h2><p class="small">لوّن الكلمات التي تحتوي ${LESSON.targets.join(" أو ")}</p><div class="paint-grid">${WORKBOOK_WORDS.map((w,i)=>`<button class="paint-card ${game.painted.includes(i)?'painted':''}" data-paint="${i}" aria-pressed="${game.painted.includes(i)}"><span>${w}</span></button>`).join('')}</div><p id="game-message" class="game-message" role="status">لونك يحوّل الكلمات إلى لوحة</p><button id="paint-prize" class="primary" ${game.painted.length<3?'hidden':''}>شاهد مكافأتي ←</button>`,0);
 }
 function paint(i,b){
  if(game.painted.includes(i)||!WORKBOOK_WORDS[i])return;
  if(!LESSON.targets.some(g=>WORKBOOK_WORDS[i].includes(g))){motion('wrong',b);$('game-message').textContent='جرّب كلمة تحتوي '+LESSON.targets.join(' أو ');return;}
  game.painted.push(i);b.classList.add('painted');b.setAttribute('aria-pressed','true');sound();motion('reward',b);$('game-message').textContent='لوّنت '+game.painted.length+' من 3 كلمات';if(game.painted.length===3)$('paint-prize').hidden=false;
 }
 function finish(){
  $('screen').innerHTML=`<section class="game-finale"><div class="prize-flower">${flower}</div><span class="eyebrow">إنجاز جديد في ساحة اللعب</span><h2>لعبت… واكتشفت!</h2><p>أكملت «${titles[game.type]}»</p><div class="prize-stamps">${LESSON.words.slice(0,3).map(w=>picture(w.cell)).join('')}</div><div class="game-actions"><button class="primary" data-game="${game.type}">ألعب مرة ثانية</button><button class="secondary" id="play-menu">أختار لعبة أخرى</button></div></section>`;
  motion('enter',$('screen'));
 }
 function handle(b){
  if(b.id==='play-menu'||b.id==='games'||b.dataset.playMenu!==undefined){menu();return;}
  if(b.dataset.game){start(b.dataset.game,b.dataset.first!==undefined?Number(b.dataset.first):undefined);return;}
  if(view!=='games'||!game)return;
  if(b.id==='game-sound'){soundOn=!soundOn;b.setAttribute('aria-pressed',String(soundOn));b.textContent=soundOn?'إيقاف النغمات':'تشغيل النغمات';if(soundOn)sound();}
  if(b.dataset.match!==undefined&&game.type==='match')match(Number(b.dataset.match),b);
  if(b.id==='match-next'&&game.type==='match'&&game.answered){if(game.round===LESSON.words.length-1){win();finish();}else{game.round++;prepareMatch();showMatch();motion('enter',$('screen'));}}
  if(b.dataset.memory!==undefined&&game.type==='memory')memoryPick(Number(b.dataset.memory));
  if(b.dataset.bubble!==undefined&&game.type==='catch')catchLetter(Number(b.dataset.bubble),b);
  if(b.dataset.paint!==undefined&&game.type==='paint')paint(Number(b.dataset.paint),b);
  if(b.id==='pause-bubbles'){game.paused=!game.paused;$('bubble-field').classList.toggle('paused',game.paused);b.setAttribute('aria-pressed',String(game.paused));b.textContent=game.paused?'حرّك الفقاعات':'أوقف حركة الفقاعات';}
  if((b.id==='memory-prize'&&game.type==='memory'&&game.memory.complete)||(b.id==='catch-prize'&&game.type==='catch'&&game.caught.length===LESSON.targetIndices.length)||(b.id==='paint-prize'&&game.type==='paint'&&game.painted.length===3)){win();finish();}
 }
 return{show,start,handle,cancel,reset(){cancel();game=null;}};
})();
