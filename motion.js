/* Qiraati interaction motion.
 * Spark-particle radial distribution and pointer-normalized card tilt adapted
 * from the user-supplied mudarrisi-reading-app/app/unit1_fx.js.
 * Changed: native Web Animations only, success-only particles, explicit lifecycle,
 * no MutationObserver, no moving illustration, no per-letter Arabic text split.
 * See THIRD_PARTY.md for source reference. */
(function(root){
  const attached=new WeakSet();
  const reduced=()=>root.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  function animate(node,frames,options){
    if(!node||reduced()||!node.animate)return null;
    return node.animate(frames,{duration:360,easing:'cubic-bezier(.2,.8,.2,1)',...options});
  }
  function mount(host){
    if(!host)return;
    host.querySelectorAll('.word-list button,.letter-choice,.answer-row button').forEach(button=>{
      if(attached.has(button))return;attached.add(button);button.classList.add('motion-tilt');
      button.addEventListener('pointermove',e=>{
        if(e.pointerType!=='mouse'||reduced()||button.disabled)return;
        const r=button.getBoundingClientRect();
        button.style.setProperty('--tilt-y',`${((e.clientX-r.left)/r.width-.5)*7}deg`);
        button.style.setProperty('--tilt-x',`${-((e.clientY-r.top)/r.height-.5)*5}deg`);
      });
      const reset=()=>{button.style.setProperty('--tilt-y','0deg');button.style.setProperty('--tilt-x','0deg');};
      button.addEventListener('pointerleave',reset);button.addEventListener('blur',reset);
      button.addEventListener('pointerdown',()=>animate(button,[{transform:'scale(1)'},{transform:'scale(.95)'},{transform:'scale(1)'}],{duration:210}));
    });
  }
  function enter(host){
    if(!host)return;
    const title=host.querySelector('h2');
    animate(title,[{opacity:0,transform:'translateX(12px)'},{opacity:1,transform:'translateX(0)'}]);
    host.querySelectorAll('.letter-choice,.word-list button,.answer-row button').forEach((n,i)=>{
      animate(n,[{opacity:0,transform:'translateY(12px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{delay:i*35,duration:330});
    });
  }
  function sparkle(x,y){
    if(reduced())return;
    for(let i=0;i<7;i++){
      const particle=document.createElement('i');particle.className='fx-particle';particle.setAttribute('aria-hidden','true');
      particle.style.left=x+'px';particle.style.top=y+'px';document.body.appendChild(particle);
      const angle=Math.PI*2*i/7,dist=22+Math.random()*20,dx=Math.cos(angle)*dist,dy=Math.sin(angle)*dist;
      const motion=animate(particle,[{transform:'translate(0,0) scale(.5)',opacity:0},{transform:`translate(${dx}px,${dy}px) scale(1)`,opacity:1,offset:.4},{transform:`translate(${dx*1.15}px,${dy*1.15}px) scale(.2)`,opacity:0}],{duration:520});
      if(motion)motion.onfinish=()=>particle.remove();else particle.remove();
    }
  }
  function collect(from,target,glyph){
    if(!from||!target||reduced())return;
    const to=target.getBoundingClientRect();
    const ghost=document.createElement('span');ghost.className='fx-flight';ghost.textContent=glyph;ghost.setAttribute('aria-hidden','true');
    Object.assign(ghost.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px'});document.body.appendChild(ghost);
    const dx=to.left+to.width/2-from.left-from.width/2,dy=to.top+to.height/2-from.top-from.height/2;
    const motion=animate(ghost,[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx*.5}px,${dy*.5-20}px) scale(.8)`,opacity:1,offset:.45},{transform:`translate(${dx}px,${dy}px) scale(.4)`,opacity:0}],{duration:480});
    if(motion)motion.onfinish=()=>{ghost.remove();if(target.isConnected){sparkle(to.left+to.width/2,to.top+to.height/2);animate(target,[{transform:'scale(1)'},{transform:'scale(1.16)'},{transform:'scale(1)'}],{duration:260});}};else ghost.remove();
  }
  function word(host){
    animate(host?.querySelector('.discovery .word'),[{opacity:.3,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:240});
    animate(host?.querySelector('.selected-picture'),[{opacity:.4,transform:'scale(.9)'},{opacity:1,transform:'scale(1)'}],{duration:300});
  }
  function success(host){
    const word=host?.querySelector('.word');if(!word)return;
    animate(word,[{transform:'scale(1)'},{transform:'scale(1.07)'},{transform:'scale(1)'}],{duration:360});
    const r=word.getBoundingClientRect();sparkle(r.left+r.width/2,r.top+r.height/2);
  }
  function wrong(button){animate(button,[{transform:'translateX(0)'},{transform:'translateX(4px)'},{transform:'translateX(-4px)'},{transform:'translateX(0)'}],{duration:240});}
  root.ReadingMotion={mount,enter,collect,word,success,wrong};
})(window);
