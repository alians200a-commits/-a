'use strict';
const $ = id => document.getElementById(id);
const KEY = 'qiraati:new-curriculum:alif:v1';
const icons = {
  look:'<circle cx="12" cy="12" r="8"/><path d="M12 7v10M7 12h10"/>',
  choose:'<path d="M9 12V4a2 2 0 0 1 4 0v7l2-1 5 3-2 8H9l-6-8q-1-3 2-2l4 3"/>',
  trace:'<path d="m5 16 11-12 4 4L9 20H5Z"/><path stroke-dasharray="1 4" d="M3 3v9"/>',
  fill:'<path d="m4 17 13-13 4 4L8 21H4ZM14 7l4 4"/>'
};
const svg = key => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[key]}</svg>`;
const fresh = () => ({version:1,stage:0,word:1,seen:[],selected:[],traced:[],fillDone:[],finished:false});
let saved = null;
try { saved = JSON.parse(localStorage.getItem(KEY)); } catch {}
let state = fresh();
// Restore only validated fields; corrupt/old storage cannot mark this lesson done.
if(saved?.version === 1){
  for(const [key,max] of [['seen',4],['selected',5],['traced',1],['fillDone',4]]){
    state[key]=Array.isArray(saved[key])?[...new Set(saved[key].filter(n=>Number.isInteger(n)&&n>=0&&n<=max))]:[];
  }
  state.selected=state.selected.filter(n=>['ا','ى'].includes(LESSON.letters[n]));
  state.stage=Number.isInteger(saved.stage)&&saved.stage>=0&&saved.stage<=3?saved.stage:0;
  state.word=Number.isInteger(saved.word)&&saved.word>=0&&saved.word<5?saved.word:1;
  state.finished=saved.finished===true && state.seen.length===5&&state.selected.length===3&&state.traced.length===2&&state.fillDone.length===5;
}
let traceIndex = state.traced.includes(0)?1:0;
let fillIndex = Math.max(0,LESSON.fill.findIndex((_,i)=>!state.fillDone.includes(i)));
let tracker = null;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$('save-status').textContent='يُحفظ تقدمك على هذا الجهاز';}catch{$('save-status').textContent='التقدم متاح لهذه الجلسة فقط؛ تعذر الحفظ';}}
function add(key,n){if(!state[key].includes(n))state[key].push(n);save();}
function feedback(text,error=false){$('feedback').textContent=text;$('feedback').classList.toggle('error',error);}
function picture(cell,extra=''){return `<div class="picture ${extra}" role="img" aria-label="${['دار','غزال','حلوى','مرمى','عصا','نار'][cell]}" style="background-position:${(cell%3)*50}% ${Math.floor(cell/3)*100}%"></div>`;}
function highlighted(word){return word.replace(/[اى]/g,letter=>`<mark>${letter}</mark>`);}
function completion(){return [state.seen.length===5,state.selected.length===3,state.traced.length===2,state.fillDone.length===5];}
function shell(){
  const done=completion();
  $('progress').innerHTML=done.map((v,i)=>`<i class="${v?'done':''} ${state.stage===i?'current':''}" aria-label="النشاط ${i+1}${v?' مكتمل':''}"></i>`).join('');
  const labels=['أكتشف','أختار','أتتبع','أكمل'];
  $('tabs').innerHTML=labels.map((name,i)=>`<button class="tab ${state.stage===i?'active':''}" data-stage="${i}" ${state.stage===i?'aria-current="step"':''}>${svg(['look','choose','trace','fill'][i])}<span>${name}</span></button>`).join('');
  $('next').disabled=!done[state.stage];
  $('next').innerHTML=`${state.stage===3?'إنهاء الدرس':'التالي'} <span aria-hidden="true">←</span>`;
}
function render(focus=false){
  tracker=null;feedback('');
  if(state.finished){endScreen();return;}
  if(state.stage===0)explore();
  if(state.stage===1)choose();
  if(state.stage===2)trace();
  if(state.stage===3)fill();
  shell();save();if(focus)$('screen').focus();
}
function explore(){
  add('seen',state.word);
  const word=LESSON.words[state.word];
  $('screen').innerHTML=`<div class="lesson-layout"><section class="panel" aria-label="الحرف والكلمة"><div class="letters"><span>ا</span><span>ى</span></div><div class="ornament"></div><p class="lead">ألاحظ وأكتشف</p><div class="word-box"><p class="word">${highlighted(word.word)}</p></div><div class="word-list">${LESSON.words.map((w,i)=>`<button data-word="${i}" aria-pressed="${i===state.word}">${w.word}</button>`).join('')}</div><p class="small">اختر كل كلمة ولاحظ الحرف الملوّن</p><p class="small">التسجيل الصوتي قيد الإعداد</p></section><div class="scene">${word.id==='gazelle'?'<img src="assets/garden.webp" alt="طفلان يشاهدان غزالًا في حديقة" fetchpriority="high"><span class="scene-note">مشهد ثابت · الأنميشن قيد الإعداد</span>':picture(word.cell,'large')}</div></div>`;
  if(state.seen.length===5)feedback('شاهدت كل الكلمات. انتقل إلى النشاط التالي.');
}
function choose(){
  $('screen').innerHTML=`<section class="activity"><span class="eyebrow">أختار · من نشاط الكتاب</span><h2>أختار كلَّ «ا» و«ى»</h2><p class="sub">المس الحرف المطلوب لتضع دائرة حوله</p><div class="letter-grid">${LESSON.letters.map((l,i)=>`<button class="letter-choice" data-letter="${i}" aria-label="الحرف ${l} في الموضع ${i+1}" aria-pressed="${state.selected.includes(i)}">${l}</button>`).join('')}</div><p class="counter">${state.selected.length} / 3</p></section>`;
  if(state.selected.length===3)feedback('أحسنت، وجدت كل الحروف المطلوبة.');
}
function trace(){
  const glyph=traceIndex===0?'ا':'ى';
  const path=traceIndex===0?'M220 45 L220 265':'M275 85 C225 35 190 95 235 120 C295 160 270 230 185 242 C105 255 55 205 85 158';
  $('screen').innerHTML=`<section class="activity"><span class="eyebrow">أتتبع · تدريب الكتابة</span><h2>أتتبع الحرف بإصبعي</h2><div class="trace-wrap"><div class="trace-help"><div class="letters">${glyph}</div><p>ابدأ من النقطة الذهبية، واتبع المسار بهدوء. إذا رفعت إصبعك، أكمل من آخر نقطة.</p><p class="small">يمكن استخدام الإصبع أو القلم أو الفأرة.</p></div><div><svg id="trace-board" class="trace-board" viewBox="0 0 400 310" role="img" aria-label="مسار تتبع الحرف ${glyph}"><path id="guide" class="guide" d="${path}"/><path class="centerline" d="${path}"/><path id="ink" class="ink" d="${path}"/><circle id="cursor" r="12" fill="#d6aa57" stroke="#fff" stroke-width="3"/></svg><div class="trace-meter" role="progressbar" aria-label="تقدم التتبع" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div id="trace-progress"></div></div></div></div><div class="trace-actions"><button class="secondary" data-trace="0" aria-pressed="${traceIndex===0}">أتتبع ا ${state.traced.includes(0)?'· تم':''}</button><button class="secondary" data-trace="1" aria-pressed="${traceIndex===1}">أتتبع ى ${state.traced.includes(1)?'· تم':''}</button><button class="secondary" id="clear-trace">إعادة المحاولة</button></div></section>`;
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
  board.addEventListener('pointerdown',e=>{if(pointer!==null||tracker.complete)return;e.preventDefault();if(tracker.begin(point(e))){pointer=e.pointerId;board.setPointerCapture(pointer);feedback('تابع على المسار المرسوم.');}else feedback('ابدأ من النقطة الذهبية.',true);});
  board.addEventListener('pointermove',e=>{if(pointer!==e.pointerId)return;e.preventDefault();tracker.move(point(e));update();if(!tracker.active)feedback('ارجع إلى النقطة الذهبية وأكمل منها.',true);if(tracker.complete){add('traced',traceIndex);feedback(state.traced.length===2?'أحسنت، أكملت الحرفين.':'أحسنت! اختر الحرف الآخر لتتتبعه.');shell();}});
  function end(e){if(e.pointerId===pointer){tracker.end();pointer=null;}}
  board.addEventListener('pointerup',end);board.addEventListener('pointercancel',end);update();
  if(state.traced.length===2)feedback('سبق أن أكملت الحرفين. يمكنك التدرب مجددًا أو المتابعة.');
}
function fill(){
  const q=LESSON.fill[fillIndex],answered=state.fillDone.includes(fillIndex);
  $('screen').innerHTML=`<section class="activity"><span class="eyebrow">أكمل · ${fillIndex+1} / ${LESSON.fill.length}</span><h2>أختار الحرف الناقص</h2><div class="fill-layout"><div>${picture(q.cell)}</div><div><p class="word" aria-label="${answered?q.word:'كلمة ينقصها حرف'}">${answered?highlighted(q.word):`${q.before}<span class="gap">؟</span>${q.after}`}</p><div class="answer-row">${['ا','ى'].map(l=>`<button data-answer="${l}" ${answered?'disabled':''} class="${answered&&l===q.answer?'correct':''}">${l}</button>`).join('')}</div><p class="small">اختر ا أو ى لتكتمل الكلمة</p></div></div>${answered?'<button class="secondary" id="next-word">'+(state.fillDone.length===5?'مراجعة الكلمات':'الكلمة التالية')+'</button>':''}</section>`;
  if(answered)feedback(state.fillDone.length===5?'أحسنت، أكملت الكلمات الخمس.':'إجابة صحيحة، اكتملت الكلمة.');
}
function endScreen(){
  $('screen').innerHTML=`<section class="activity end-card">${picture(1)}<span class="eyebrow">خطوة جميلة في رحلة القراءة</span><h2>أكملت درس «ا / ى»</h2><p class="sub">تعرفت الكلمات، واخترت الحروف، وتدربت على كتابتها.</p><div class="end-buttons"><button class="primary" id="review">أراجع الدرس</button><button class="secondary" id="parent-info">للأهل</button></div><p class="small">الدرس التالي «و» قيد الإعداد.</p></section>`;
  $('tabs').innerHTML='';$('next').disabled=true;feedback('');$('progress').innerHTML=completion().map(()=>'<i class="done"></i>').join('');save();
}
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.stage!==undefined){state.stage=Number(b.dataset.stage);state.finished=false;render(true);}
  if(b.dataset.word!==undefined){state.word=Number(b.dataset.word);render();}
  if(b.dataset.letter!==undefined){const i=Number(b.dataset.letter);if(['ا','ى'].includes(LESSON.letters[i])){add('selected',i);choose();shell();feedback(state.selected.length===3?'أحسنت، وجدت كل الحروف المطلوبة.':'صحيح، ابحث عن بقية الحروف.');}else{b.classList.add('wrong');feedback('حاول مرة أخرى؛ ابحث عن ا أو ى.',true);}}
  if(b.dataset.trace!==undefined){traceIndex=Number(b.dataset.trace);render();}
  if(b.dataset.answer){const q=LESSON.fill[fillIndex];if(b.dataset.answer===q.answer){add('fillDone',fillIndex);fill();shell();}else feedback('انظر إلى الصورة وحاول بالحرف الآخر.',true);}
  if(b.id==='clear-trace'){trace();feedback('ابدأ من النقطة الذهبية.');}
  if(b.id==='next-word'){fillIndex=state.fillDone.length===5?(fillIndex+1)%5:LESSON.fill.findIndex((_,i)=>!state.fillDone.includes(i));render();}
  if(b.id==='next'){if(!completion()[state.stage])return;if(state.stage<3){state.stage++;render(true);}else if(completion().every(Boolean)){state.finished=true;render(true);}else{state.stage=completion().indexOf(false);render(true);feedback('نكمل هذا النشاط أولًا.');}}
  if(b.id==='home'||b.id==='review'){state.stage=0;state.finished=false;render(true);}
  if(['about','parent-info'].includes(b.id))$('info').showModal();
  if(b.id==='reset'&&confirm('هل تريد مسح تقدم هذا الدرس والبدء من جديد؟')){state=fresh();traceIndex=0;fillIndex=0;$('info').close();render(true);}
});
render();
