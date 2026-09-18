'use strict';
const $ = id => document.getElementById(id);
let KEY = 'qiraati:new-curriculum:alif:v1';
const icons = {
  look:'<circle cx="12" cy="12" r="8"/><path d="M12 7v10M7 12h10"/>',
  choose:'<path d="M9 12V4a2 2 0 0 1 4 0v7l2-1 5 3-2 8H9l-6-8q-1-3 2-2l4 3"/>',
  trace:'<path d="m5 16 11-12 4 4L9 20H5Z"/><path stroke-dasharray="1 4" d="M3 3v9"/>',
  fill:'<path d="m4 17 13-13 4 4L8 21H4ZM14 7l4 4"/>'
};
const svg = key => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[key]}</svg>`;
const fresh = () => ({version:1,stage:0,word:1,seen:[],selected:[],traced:[],fillDone:[],gameWins:[],finished:false});
let state;
function restore(){
let saved = null;
try { saved = JSON.parse(localStorage.getItem(KEY)); } catch {}
state = fresh();
// Restore only validated fields; corrupt/old storage cannot mark this lesson done.
if(saved?.version === 1){
  state.gameWins=Array.isArray(saved.gameWins)?[...new Set(saved.gameWins.filter(x=>['match','memory','catch','paint'].includes(x)))]:[];
  for(const [key,max] of [['seen',LESSON.words.length-1],['selected',LESSON.letters.length-1],['traced',LESSON.traceGlyphs.length-1],['fillDone',LESSON.fill.length-1]]){
    state[key]=Array.isArray(saved[key])?[...new Set(saved[key].filter(n=>Number.isInteger(n)&&n>=0&&n<=max))]:[];
  }
  state.selected=state.selected.filter(n=>LESSON.targets.includes(LESSON.letters[n]));
  state.stage=Number.isInteger(saved.stage)&&saved.stage>=0&&saved.stage<=3?saved.stage:0;
  state.word=Number.isInteger(saved.word)&&saved.word>=0&&saved.word<LESSON.words.length?saved.word:1;
  state.finished=saved.finished===true && state.seen.length===LESSON.words.length&&state.selected.length===LESSON.targetIndices.length&&state.traced.length===LESSON.traceGlyphs.length&&state.fillDone.length===LESSON.fill.length;
}
}
restore();
let traceIndex = Math.max(0,LESSON.traceGlyphs.findIndex((_,i)=>!state.traced.includes(i)));
let fillIndex = Math.max(0,LESSON.fill.findIndex((_,i)=>!state.fillDone.includes(i)));
let tracker = null;
let demoTimer = null;
let view = 'home';
const labels = ['أكتشف','أختار','أتتبع','أكمل'];
const flower = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 58V30M32 47Q14 47 15 36Q28 34 32 47M32 41Q49 42 49 31Q36 30 32 41" fill="#5b9d62" stroke="#397c51"/><g fill="#ffca65" stroke="#d99c31" stroke-width="2"><ellipse cx="32" cy="14" rx="9" ry="12"/><ellipse cx="44" cy="25" rx="12" ry="9"/><ellipse cx="32" cy="34" rx="9" ry="12"/><ellipse cx="20" cy="25" rx="12" ry="9"/></g><circle cx="32" cy="25" r="8" fill="#ee8850" stroke="#fff0b7" stroke-width="3"/></svg>';
function scenery(home=false,cell=null,hideAnswer=false){
 const n=cell??(state.stage===3?LESSON.fill[fillIndex].cell:state.word),scene=WORD_SCENES[n]||WORD_SCENES[1];
 if(home)return `<aside class="story-scene welcome-scene"><img src="assets/world.webp" alt="الطفلان في حديقة الكلمات" fetchpriority="high"><div class="scene-intro"><span class="scene-tag">رحلة صغيرة، اكتشاف كبير</span><h2>هنا تنمو<br>الكلمات</h2></div><button class="scene-play" data-play-menu>لنلعب بالكلمات <span>←</span></button></aside>`;
 return `<aside class="story-scene cinema-scene theme-${scene.theme}" aria-label="مشهد الكلمة"><div class="cinema-art">${scene.crop!==undefined?picture(scene.crop,'book-scene'):`<img id="story-art" src="${scene.image}" alt="${hideAnswer?'مشهد مصوّر من كلمات الدرس':scene.alt}" fetchpriority="high">`}<div class="scene-glints" aria-hidden="true"><i></i><i></i><i></i></div></div><div class="cinema-caption">${hideAnswer?'<span class="scene-tag">شاهد المشهد… واكتشف</span>':`<span class="scene-word">${highlighted(scene.caption)}</span><button class="scene-replay" id="scene-replay" aria-label="أبرز الكلمة">اكتشف الحرف</button>`}</div></aside>`;
}
let shownFlowers=0;
function frame(){
  $('app-shell').dataset.view=view;
  $('app-shell').dataset.lesson=LESSON.id;
  $('app-shell').dataset.stage=String(state.stage);
  const count=completion().filter(Boolean).length;
  $('garden-count').textContent=count;
  if(count>shownFlowers)motion('reward',$('garden-count'));
  shownFlowers=count;
  $('lesson-dock').hidden=view!=='lesson'||state.finished;
}
function homeScreen(){
 const done=completion(),count=done.filter(Boolean).length;
 $('screen').innerHTML=`<div class="home-layout">${scenery(true)}<section class="journey-book"><span class="eyebrow">${LESSON.title}</span><h2>رحلتي في الحديقة</h2><p class="sub">أربع محطات، وأربع زهرات تنتظرك</p><div class="journey-path">${labels.map((label,i)=>`<button class="journey-stop ${done[i]?'earned':''} ${state.stage===i?'current':''}" data-stage="${i}"><span class="stop-medal">${done[i]?flower:svg(['look','choose','trace','fill'][i])}</span><span><strong>${label}</strong><small>${done[i]?'أزهرت هذه المحطة':['كلمات جديدة تنتظرك','اجمع الحروف','ارسم الحرف بإصبعك','أكمل الكلمات'][i]}</small></span><span class="stop-check">${done[i]?'✓':i+1}</span></button>`).join('')}</div><button class="primary journey-start" id="start-journey">${count?'أكمل رحلتي':'هيا نبدأ'} <span>←</span></button><button class="play-invite" data-play-menu><strong>ساحة اللعب</strong><span>مطابقة · ذاكرة · صيد الحروف · تلوين ←</span></button>${lessonPicker()}</section></div>`;
 $('tabs').innerHTML='';$('next').disabled=true;
 $('progress').innerHTML=done.map(v=>`<i class="${v?'done':''}"></i>`).join('');
 frame();save();motion('enter',$('screen'));
}
function gardenScreen(){
 const done=completion();
 $('screen').innerHTML=`<div class="home-layout">${scenery(true)}<section class="journey-book reward-book"><span class="eyebrow">كل نشاط تكمله يُزهر هنا</span><h2>حديقة إنجازاتي</h2><div class="flower-bed">${labels.map((l,i)=>`<div class="reward-plant ${done[i]?'bloomed':''}">${flower}<strong>${l}</strong><small>${done[i]?'أزهرت!':'تنتظر إنجازك'}</small></div>`).join('')}</div><p class="game-medals">أكملت ${state.gameWins.length} من 4 ألعاب</p><button class="secondary" data-play-menu>أزور ساحة اللعب</button><h2 class="collection-title">كلماتي المكتشفة</h2><div class="word-collection">${LESSON.words.map((w,i)=>`<div class="word-stamp ${state.seen.includes(i)?'unlocked':''}">${picture(w.cell)}<span>${state.seen.includes(i)?w.word:'…'}</span></div>`).join('')}</div><button id="start-journey" class="primary">أعود إلى رحلتي <span>←</span></button></section></div>`;frame();motion('enter',$('screen'));
}

function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$('save-status').textContent='يُحفظ تقدمك على هذا الجهاز';}catch{$('save-status').textContent='التقدم متاح لهذه الجلسة فقط؛ تعذر الحفظ';}}
function add(key,n){if(!state[key].includes(n))state[key].push(n);save();}
function feedback(text,error=false){$('feedback').textContent=text;$('feedback').classList.toggle('error',error);}
function picture(cell,extra=''){if(LESSON.id==='waw'){const [x,y,w,h]=WAW_CROPS[cell];return `<div class="picture book-picture ${extra}" role="img" aria-label="${LESSON.words[cell].word}" style="background-image:url('assets/waw-book.webp');background-size:${919/w*100}% ${1300/h*100}%;background-position:${x/(919-w)*100}% ${y/(1300-h)*100}%"></div>`;}return `<div class="picture ${extra}" role="img" aria-label="${['دار','غزال','حلوى','مرمى','عصا','نار'][cell]}" style="background-position:${(cell%3)*50}% ${Math.floor(cell/3)*100}%"></div>`;}
function highlighted(word){return Array.from(word,letter=>LESSON.targets.includes(letter)?`<mark>${letter}</mark>`:letter).join('');}
function completion(){return [state.seen.length===LESSON.words.length,state.selected.length===LESSON.targetIndices.length,state.traced.length===LESSON.traceGlyphs.length,state.fillDone.length===LESSON.fill.length];}
const motion = (name,...args) => { if(typeof ReadingMotion!=='undefined')ReadingMotion[name](...args); };
function shell(){
  const done=completion();
  frame();
  $('progress').innerHTML=done.map((v,i)=>`<i class="${v?'done':''} ${state.stage===i?'current':''}" aria-label="النشاط ${i+1}${v?' مكتمل':''}"></i>`).join('');
  $('tabs').innerHTML=labels.map((name,i)=>`<button class="tab ${state.stage===i?'active':''}" data-stage="${i}" ${state.stage===i?'aria-current="step"':''}>${svg(['look','choose','trace','fill'][i])}<span>${name}</span></button>`).join('');
  $('next').disabled=!done[state.stage];
  $('next').innerHTML=`${state.stage===3?'إنهاء الدرس':'التالي'} <span aria-hidden="true">←</span>`;
  motion('mount',$('screen'));
}
function render(focus=false){
  motion('cancel');if(typeof ReadingGames!=='undefined')ReadingGames.cancel();tracker=null;if(demoTimer){clearTimeout(demoTimer);demoTimer=null;}feedback('');
  if(view==='home'){homeScreen();return;}
  if(view==='garden'){gardenScreen();return;}
  if(view==='games'){ReadingGames.show();if(focus){$('screen').focus();$('screen').scrollTop=0;motion('enter',$('screen'));}return;}
  if(state.finished){endScreen();frame();motion('enter',$('screen'));return;}
  if(state.stage===0)explore();
  if(state.stage===1)choose();
  if(state.stage===2)trace();
  if(state.stage===3)fill();
  shell();save();if(focus){$('screen').focus();$('screen').scrollTop=0;motion('enter',$('screen'));}
}
function explore(){
  add('seen',state.word);
  const word=LESSON.words[state.word];
  $('screen').innerHTML=`<div class="lesson-layout">${scenery()}<section class="panel storybook" aria-label="اكتشاف الكلمات"><div class="activity-heading"><span class="eyebrow">المحطة الأولى · أكتشف</span><h2>لكلّ كلمة حكاية</h2></div><div class="discovery"><div class="selected-picture">${picture(word.cell)}</div><div><p class="word">${highlighted(word.word)}</p><span class="eyebrow">ألاحظ الحرف الملوّن</span></div><span class="word-count"><bdi dir="ltr">${state.seen.length} / ${LESSON.words.length}</bdi></span></div><div class="word-list">${LESSON.words.map((w,i)=>`<button data-word="${i}" aria-pressed="${i===state.word}" aria-label="${w.word}">${picture(w.cell)}<span>${w.word}</span>${state.seen.includes(i)?'<i class="seen-check" aria-hidden="true">✓</i>':''}</button>`).join('')}</div><button class="word-play" data-game="match" data-first="${state.word}">ألعب مع كلمة «${word.word}» <span>←</span></button><p class="small">كل صورة تأخذك إلى مشهد جديد</p></section></div>`;
  if(state.seen.length===LESSON.words.length)feedback('رائع! اكتشفت كل الكلمات.');
}
function celebrate(){
  if(typeof confetti==='function') confetti({particleCount:28,spread:48,origin:{y:.65},colors:['#efb847','#269d87','#ff876a','#9985d6'],disableForReducedMotion:true});
}

function choose(){
  $('screen').innerHTML=`<div class="lesson-layout">${scenery()}<section class="activity storybook"><span class="eyebrow">أختار · من نشاط الكتاب</span><h2>نجمع حروف الحديقة</h2><p class="sub">ابحث عن ${LESSON.targets.join(" و ")} بين الحروف</p><div class="letter-grid">${LESSON.letters.map((l,i)=>`<button class="letter-choice" data-letter="${i}" aria-label="الحرف ${l} في الموضع ${i+1}" aria-pressed="${state.selected.includes(i)}">${l}</button>`).join('')}</div><div class="collected-letters" aria-label="الحروف التي عثرت عليها">${LESSON.targetIndices.map(i=>`<span class="${state.selected.includes(i)?'found':''}">${state.selected.includes(i)?LESSON.letters[i]:'·'}</span>`).join('')}</div><p class="counter">وجدت ${state.selected.length} من ${LESSON.targetIndices.length}</p></section></div>`;
  if(state.selected.length===LESSON.targetIndices.length)feedback('أحسنت، وجدت كل الحروف المطلوبة.');
}
function trace(){
  if(demoTimer){clearTimeout(demoTimer);demoTimer=null;}
  const glyph=LESSON.traceGlyphs[traceIndex],path=LESSON.tracePaths[traceIndex];
  $('screen').innerHTML=`<div class="lesson-layout">${scenery()}<section class="activity storybook"><span class="eyebrow">أتتبع · تدريب الكتابة</span><h2>أتتبع الحرف بإصبعي</h2><div class="trace-wrap"><div class="trace-help"><div class="letters">${glyph}</div><p>اتبع النقطة الذهبية بإصبعك.</p><p class="small">يمكن استخدام الإصبع أو القلم أو الفأرة.</p></div><div><svg id="trace-board" class="trace-board" viewBox="0 0 400 310" role="img" aria-label="مسار تتبع الحرف ${glyph}"><path id="guide" class="guide" d="${path}"/><path class="centerline" d="${path}"/><path id="ink" class="ink" d="${path}"/><circle id="cursor" r="12" fill="#d6aa57" stroke="#fff" stroke-width="3"/></svg><div class="trace-meter" role="progressbar" aria-label="تقدم التتبع" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div id="trace-progress"></div></div></div></div><div class="trace-actions"><button class="secondary demo-button" id="trace-demo">شاهد الطريقة</button>${LESSON.traceGlyphs.map((g,i)=>`<button class="secondary" data-trace="${i}" aria-pressed="${traceIndex===i}">أتتبع ${g} ${state.traced.includes(i)?'· تم':''}</button>`).join('')}<button class="secondary" id="clear-trace">إعادة المحاولة</button></div></section></div>`;
  const guide=$('guide'),length=guide.getTotalLength(),points=Array.from({length:81},(_,i)=>{const p=guide.getPointAtLength(length*i/80);return{x:p.x,y:p.y};});
  tracker=new TraceTracker(points,24);
  const board=$('trace-board'),ink=$('ink');ink.style.strokeDasharray=String(length);ink.style.strokeDashoffset=String(length);
  function update(){
    ink.style.strokeDashoffset=String(length*(1-tracker.progress));
    const p=points[tracker.index];$('cursor').setAttribute('cx',p.x);$('cursor').setAttribute('cy',p.y);
    $('trace-progress').style.width=`${tracker.progress*100}%`;
    board.parentElement.querySelector('[role=progressbar]').setAttribute('aria-valuenow',Math.round(tracker.progress*100));
  }
  function point(e){const p=board.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(board.getScreenCTM().inverse());}
  let pointer=null;
  board.addEventListener('pointerdown',e=>{stopTraceDemo();if(pointer!==null||tracker.complete)return;e.preventDefault();if(tracker.begin(point(e))){pointer=e.pointerId;board.setPointerCapture(pointer);feedback('تابع على المسار المرسوم.');}else feedback('ابدأ من النقطة الذهبية.',true);});
  board.addEventListener('pointermove',e=>{if(pointer!==e.pointerId||tracker.complete)return;e.preventDefault();tracker.move(point(e));update();if(!tracker.active)feedback('ارجع إلى النقطة الذهبية وأكمل منها.',true);if(tracker.complete){add('traced',traceIndex);celebrate();feedback(state.traced.length===LESSON.traceGlyphs.length?'أحسنت، أكملت التتبع.':'أحسنت! اختر الحرف الآخر لتتتبعه.');shell();}});
  function end(e){if(e.pointerId===pointer){tracker.end();pointer=null;}}
  board.addEventListener('pointerup',end);board.addEventListener('pointercancel',end);update();
  if(state.traced.length===LESSON.traceGlyphs.length)feedback('سبق أن أكملت التتبع. يمكنك التدرب مجددًا أو المتابعة.');
}
function stopTraceDemo(){
  if(demoTimer){clearTimeout(demoTimer);demoTimer=null;}
  const demo=$('trace-demonstration');if(demo)demo.remove();
}
function showTraceDemo(){
  stopTraceDemo();
  const guide=$('guide'),board=$('trace-board');if(!guide||!board)return;
  if(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches){
    feedback('ابدأ من النقطة الذهبية واتبع الخط المنقّط.');return;
  }
  const group=document.createElementNS('http://www.w3.org/2000/svg','g');group.id='trace-demonstration';
  const path=guide.getAttribute('d');
  group.innerHTML=`<circle r="18" fill="#efb847" stroke="white" stroke-width="4"><animateMotion dur="3s" repeatCount="1" fill="freeze" path="${path}"/></circle>`;
  board.appendChild(group);feedback('شاهد اتجاه الحركة، ثم جرّب بإصبعك.');
  demoTimer=setTimeout(()=>{stopTraceDemo();feedback('دورك الآن! ابدأ من النقطة الذهبية.');},3200);
}

function fill(){
  const q=LESSON.fill[fillIndex],answered=state.fillDone.includes(fillIndex);
  $('screen').innerHTML=`<div class="lesson-layout">${scenery()}<section class="activity storybook"><span class="eyebrow">أكمل · <bdi dir="ltr">${fillIndex+1} / ${LESSON.fill.length}</bdi></span><h2>أختار الحرف الناقص</h2><div class="fill-layout"><div>${picture(q.cell)}</div><div><p class="word" aria-label="${answered?q.word:'كلمة ينقصها حرف'}">${answered?highlighted(q.word):`${q.before}<span class="gap">؟</span>${q.after}`}</p><div class="answer-row">${LESSON.answers.map(l=>`<button data-answer="${l}" ${answered?'disabled':''} class="${answered&&l===q.answer?'correct':''}">${l}</button>`).join('')}</div><p class="small">اختر ${LESSON.answers.join(" أو ")} لتكتمل الكلمة</p></div></div>${answered?'<button class="secondary" id="next-word">'+(state.fillDone.length===LESSON.fill.length?'مراجعة الكلمات':'الكلمة التالية')+'</button>':''}</section></div>`;
  if(answered)feedback(state.fillDone.length===LESSON.fill.length?'أحسنت، أكملت كل الكلمات.':'إجابة صحيحة، اكتملت الكلمة.');
}
function endScreen(){
  $('screen').innerHTML=`<section class="activity end-card storybook"><div class="end-blooms">${[0,1,2,3].map(()=>flower).join('')}</div><span class="eyebrow">أزهرت حديقتك بأربع زهرات</span><h2>أكملت درس «${LESSON.targets.join(" / ")}»</h2><p class="sub">تعرفت الكلمات، واخترت الحروف، وتدربت على كتابتها.</p><div class="end-buttons"><button class="primary" id="review">أراجع الدرس</button><button class="secondary" id="garden-end">شاهد حديقتي</button></div>${lessonPicker()}</section>`;
  $('tabs').innerHTML='';$('next').disabled=true;feedback('');$('progress').innerHTML=completion().map(()=>'<i class="done"></i>').join('');save();
}
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.lesson){switchLesson(b.dataset.lesson);return;}
  if(typeof ReadingGames!=='undefined')ReadingGames.handle(b);
  if(b.id==='scene-replay'){motion('scene',$('screen'));feedback('لاحظ الحرف الملوّن داخل الكلمة.');}
  if(b.dataset.stage!==undefined){view='lesson';state.stage=Number(b.dataset.stage);state.finished=false;render(true);}
  if(b.dataset.word!==undefined){view='lesson';state.stage=0;state.finished=false;state.word=Number(b.dataset.word);render();motion('word',$('screen'));motion('scene',$('screen'));}
  if(b.dataset.letter!==undefined){const i=Number(b.dataset.letter),origin=b.getBoundingClientRect?.();if(LESSON.targets.includes(LESSON.letters[i])){const isNew=!state.selected.includes(i);add('selected',i);choose();shell();if(isNew){motion('collect',origin,typeof ReadingMotion!=='undefined'?$('screen').querySelectorAll('.collected-letters span')[LESSON.targetIndices.indexOf(i)]:null,LESSON.letters[i]);if(state.selected.length===LESSON.targetIndices.length)celebrate();}feedback(state.selected.length===LESSON.targetIndices.length?'أحسنت، وجدت كل الحروف المطلوبة.':'صحيح، ابحث عن بقية الحروف.');}else{motion('wrong',b);feedback('حاول مرة أخرى؛ ابحث عن '+LESSON.targets.join(' أو '),true);}}
  if(b.dataset.trace!==undefined){traceIndex=Number(b.dataset.trace);render();}
  if(b.dataset.answer){const q=LESSON.fill[fillIndex];if(b.dataset.answer===q.answer){const isNew=!state.fillDone.includes(fillIndex);add('fillDone',fillIndex);fill();shell();if(isNew){motion('success',$('screen'));if(state.fillDone.length===LESSON.fill.length)celebrate();}}else {motion('wrong',b);feedback('انظر إلى الصورة وحاول بالحرف الآخر.',true);}}
  if(b.id==='trace-demo'){showTraceDemo();}
  if(b.id==='clear-trace'){trace();feedback('ابدأ من النقطة الذهبية.');}
  if(b.id==='next-word'){fillIndex=state.fillDone.length===LESSON.fill.length?(fillIndex+1)%LESSON.fill.length:LESSON.fill.findIndex((_,i)=>!state.fillDone.includes(i));render();}
  if(b.id==='next'){if(!completion()[state.stage])return;if(state.stage<3){state.stage++;render(true);}else if(completion().every(Boolean)){state.finished=true;render(true);}else{state.stage=completion().indexOf(false);render(true);feedback('نكمل هذا النشاط أولًا.');}}
  if(b.id==='home'||b.dataset.goHome!==undefined){view='home';render(true);}
  if(b.id==='garden'||b.id==='garden-end'){view='garden';render(true);}
  if(b.id==='review'){view='lesson';state.stage=0;state.finished=false;render(true);}
  if(b.id==='start-journey'){view='lesson';state.finished=false;const first=completion().indexOf(false);state.stage=first<0?0:first;render(true);}
  if(['about','parent-info'].includes(b.id))$('info').showModal();
  if(b.id==='reset'&&confirm('هل تريد مسح تقدم هذا الدرس والبدء من جديد؟')){state=fresh();view='home';traceIndex=0;fillIndex=0;$('info').close();render(true);}
});
render();

function lessonPicker(){return `<nav class="lesson-picker" aria-label="اختر الدرس">${Object.values(LESSONS).map(l=>`<button class="secondary" data-lesson="${l.id}" aria-pressed="${LESSON.id===l.id}"><span>${l.targets.join(' / ')}</span>${l.title}</button>`).join('')}</nav>`;}
function switchLesson(id){
 if(!LESSONS[id]||id===LESSON.id)return;
 save();ReadingGames.reset();LESSON=LESSONS[id];KEY=`qiraati:new-curriculum:${id}:v1`;
 WORD_SCENES=id==='waw'?WAW_SCENES:ALIF_SCENES;WORKBOOK_WORDS=LESSON.workbook;
 restore();traceIndex=Math.max(0,LESSON.traceGlyphs.findIndex((_,i)=>!state.traced.includes(i)));fillIndex=Math.max(0,LESSON.fill.findIndex((_,i)=>!state.fillDone.includes(i)));shownFlowers=0;view='home';render(true);
}
