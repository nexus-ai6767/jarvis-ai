/* ASTRON red core intro + automatic greeting. Isolated, self-contained. Loaded synchronously in <head> so the
   overlay covers the page from the first paint. Remove this file + its <script>/<link> tags to disable. */
(function(){
  'use strict';
  if(window.__astronIntroStarted){return;} window.__astronIntroStarted=true;

  var GREETING='Hello. Welcome back. I am ASTRON, your personal AI assistant. How may I assist you today?';
  var MIN_MS=4200, BLOCKED_MS=7000, MAX_MS=18000, REDUCED_MS=2600, AFTER_SPEECH_MS=900, START_WAIT_MS=3500, MAX_ATTEMPTS=4;
  var doc=document, root=doc.documentElement;
  var reduced=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var start=Date.now(), done=false, started=false, pending=false, ended=false, attempts=0, timers=[], el, statusEl, prevOverflow;
  var synth=('speechSynthesis' in window&&'SpeechSynthesisUtterance' in window)?window.speechSynthesis:null;
  var utt=null;   // kept on a long-lived reference: Chrome can garbage-collect a local utterance and drop its events

  function later(fn,ms){var t=setTimeout(fn,ms);timers.push(t);return t;}
  function rnd(a,b){return a+Math.random()*(b-a);}

  function build(){
    el=doc.createElement('div');
    el.id='astron-core-intro';
    el.setAttribute('role','status');
    el.setAttribute('aria-label','ASTRON starting');
    el.innerHTML='<div class="aci-grid"></div><div class="aci-scan"></div><div class="aci-particles"></div>'+
      '<div class="aci-vignette"></div>'+
      '<div class="aci-reactor"><div class="aci-glow"></div><div class="aci-wave"></div><div class="aci-wave aci-w2"></div>'+
      '<div class="aci-ring aci-ticks"></div><div class="aci-ring aci-r1"></div><div class="aci-ring aci-seg"></div>'+
      '<div class="aci-ring aci-r2"></div><div class="aci-ring aci-metal"></div><div class="aci-ring aci-r3"></div>'+
      '<div class="aci-plate"></div><div class="aci-ring aci-blades"></div><div class="aci-core"></div><div class="aci-spec"></div>'+
      '<div class="aci-streak"></div></div>'+
      '<div class="aci-word">ASTRON</div><div class="aci-status">CORE ONLINE</div><div class="aci-bar"><i></i></div>'+
      '<div class="aci-flash"></div>';
    root.appendChild(el);                       // child of <html>: works before <body> exists
    statusEl=el.querySelector('.aci-status');
    prevOverflow=root.style.overflow; root.style.overflow='hidden';
    if(!reduced){                                // a few embers only; lightweight (transform/opacity animation)
      var box=el.querySelector('.aci-particles'), n=(window.innerWidth<600)?14:22, frag=doc.createDocumentFragment();
      for(var i=0;i<n;i++){
        var a=rnd(0,Math.PI*2), r0=rnd(90,150), r1=r0+rnd(90,220), s=rnd(1.5,3), p=doc.createElement('span');
        p.className='aci-p';
        p.style.cssText='width:'+s+'px;height:'+s+'px;--sx:'+(Math.cos(a)*r0).toFixed(1)+'px;--sy:'+(Math.sin(a)*r0).toFixed(1)+
          'px;--dx:'+(Math.cos(a)*r1).toFixed(1)+'px;--dy:'+(Math.sin(a)*r1).toFixed(1)+'px;--t:'+rnd(4,8).toFixed(2)+'s;--d:'+rnd(1.2,6).toFixed(2)+'s';
        frag.appendChild(p);
      }
      box.appendChild(frag);
    }
  }

  function setStatus(t){ if(statusEl&&!done){statusEl.textContent=t;} }

  function finish(){
    if(done){return;} done=true;
    timers.forEach(clearTimeout); timers=[];
    try{ if(synth&&(synth.speaking||synth.pending)){synth.cancel();} }catch(e){}
    removeListeners();
    root.style.overflow=prevOverflow||'';
    if(el){
      el.classList.remove('aci-live'); el.classList.add('aci-out');
      later(function(){ if(el&&el.parentNode){el.parentNode.removeChild(el);} },reduced?400:1150);
    }
  }
  function finishAfterMin(extra){
    var wait=Math.max(0,(reduced?REDUCED_MS:MIN_MS)-(Date.now()-start))+(extra||0);
    later(finish,wait);
  }

  /* ---- voice selection: prefer an English male voice; never pick a known female one ---- */
  var MALE_HINTS=/\b(male|david|guy|mark|george|james|ryan|daniel|alex|fred|aaron|arthur|thomas|oliver|gordon|rishi|brian|christopher|eric|roger|steffan|davis|tony|jason|prabhat)\b/i;
  var FEMALE_HINTS=/\b(female|zira|hazel|susan|samantha|victoria|karen|moira|tessa|fiona|serena|kate|allison|ava|jenny|aria|emma|libby|sonia|heera|veena|catherine|linda|sara|nancy|amy|joanna|salli|kimberly|ivy|neerja|natasha)\b/i;
  function pickVoice(){
    var all=[]; try{all=synth.getVoices()||[];}catch(e){}
    var en=all.filter(function(v){return /^en([-_]|$)/i.test(v.lang||'');});
    var notFemale=en.filter(function(v){return !FEMALE_HINTS.test(v.name);});
    var order=[/google uk english male/i,/microsoft (guy|ryan|david|mark|george|prabhat)/i,/\b(daniel|alex|aaron|arthur|fred|rishi)\b/i];
    for(var i=0;i<order.length;i++){
      for(var j=0;j<notFemale.length;j++){ if(order[i].test(notFemale[j].name)){return {v:notFemale[j],male:true};} }
    }
    for(var k=0;k<notFemale.length;k++){ if(MALE_HINTS.test(notFemale[k].name)){return {v:notFemale[k],male:true};} }
    return {v:notFemale[0]||null,male:false};     // unlabeled voice: lowered pitch below, may not be male
  }

  function blocked(){
    pending=false;
    if(done||started){return;}
    setStatus('PRESS ANY KEY FOR VOICE');          // shown only when the browser refused autoplay
    // keep the intro up long enough for a keypress/tap to unlock speech, then continue silently
    later(function(){ if(!started&&!done){finish();} },Math.max(0,BLOCKED_MS-(Date.now()-start)));
  }

  function speak(){
    if(done||started||pending||ended||!synth||attempts>=MAX_ATTEMPTS){return;}
    attempts++;
    var pick=pickVoice();
    var u=new SpeechSynthesisUtterance(GREETING);
    u.lang='en-US'; u.rate=0.93; u.volume=1;
    if(pick.v){u.voice=pick.v;u.lang=pick.v.lang||'en-US';}
    u.pitch=pick.male?0.95:0.8;                    // calm; no robotic effects
    u.onstart=function(){
      started=true; pending=false;
      if(el){el.classList.add('aci-live');} setStatus('CORE ONLINE');
    };
    u.onend=function(){
      ended=true; pending=false; started=true;
      if(el){el.classList.remove('aci-live');}
      if(!done){finishAfterMin(AFTER_SPEECH_MS);}
    };
    u.onerror=function(e){
      var code=e&&e.error;
      if(code==='interrupted'||code==='canceled'){ if(done){return;} }
      if(started){ ended=true; if(!done){finishAfterMin(400);} return; }   // failed mid-speech: just finish
      if(code==='not-allowed'||code==='audio-busy'||code==='synthesis-unavailable'||code==='synthesis-failed'||code==='audio-hardware'){ blocked(); }
      else { pending=false; blocked(); }
    };
    utt=u; pending=true;
    try{
      if(synth.paused){synth.resume();}
      if(synth.speaking||synth.pending){synth.cancel();}   // only cancel stale speech; cancel() right before speak() can drop it
      synth.speak(u);
    }catch(err){ blocked(); return; }
    // Some browsers neither start nor report an error. If nothing starts, treat as blocked.
    later(function(){ if(!started&&pending&&!done){ pending=false; blocked(); } },START_WAIT_MS);
  }

  /* If the browser blocked autoplay, retry on each user gesture (activation) while the intro is still up. */
  function onGesture(){ if(!started&&!pending){speak();} }
  function onKey(e){ if(e.key==='Escape'){finish();} else {onGesture();} }
  var GESTURES=['pointerdown','mousedown','touchstart','click'];
  function removeListeners(){
    GESTURES.forEach(function(n){doc.removeEventListener(n,onGesture,true);});
    doc.removeEventListener('keydown',onKey,true);
  }

  try{
    build();
    GESTURES.forEach(function(n){doc.addEventListener(n,onGesture,{capture:true,passive:true});});
    doc.addEventListener('keydown',onKey,true);

    later(finish,MAX_MS);                          // hard safety net: never trap the visitor
    if(!synth){ finishAfterMin(); return; }

    var tried=false;
    function go(){ if(tried){return;} tried=true; speak(); }
    var vs=[]; try{vs=synth.getVoices();}catch(e){}
    if(vs&&vs.length){ go(); }
    else{
      try{ synth.addEventListener('voiceschanged',go,{once:true}); }catch(e){}
      later(go,900);                               // some browsers never fire voiceschanged
    }
  }catch(err){
    try{ if(el&&el.parentNode){el.parentNode.removeChild(el);} root.style.overflow=prevOverflow||''; }catch(e2){}
  }
})();
