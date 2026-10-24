const glow=document.querySelector('.cursor-glow');
if(glow){document.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});}const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});document.querySelectorAll('.hero-copy,.reactor-stage,.section,.cta').forEach(e=>{e.classList.add('reveal');obs.observe(e)});document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const x=document.querySelector(a.getAttribute('href'));if(x){e.preventDefault();x.scrollIntoView({behavior:'smooth'})}}));

/* ================= ASTRON PRO LAUNCH LOCK ================= */
(function(){
  'use strict';
  const TARGET = Date.UTC(2026,9,18,18,30,0); // 19 Oct 2026 00:00 IST
  const START = Date.UTC(2026,8,20,18,30,0);
  const pad=n=>String(Math.max(0,n)).padStart(2,'0');
  function initProLaunchLock(){
    const lock=document.getElementById('pro-launch-lock');
    if(!lock) return;
    const els={
      d:document.getElementById('launch-days'), h:document.getElementById('launch-hours'),
      m:document.getElementById('launch-minutes'), s:document.getElementById('launch-seconds'),
      bar:document.getElementById('launch-progress'), msg:document.getElementById('launch-message')
    };
    function unlock(){
      document.documentElement.classList.add('jarvis-pro-launched');
      lock.classList.add('unlocked');
      if(els.msg) els.msg.textContent='ASTRON PRO ONLINE // LAUNCH COMPLETE';
      document.title='ASTRON PRO // ONLINE';
      setTimeout(()=>lock.remove(),1000);
    }
    function tick(){
      const now=Date.now(), diff=TARGET-now;
      if(diff<=0){ unlock(); return; }
      const total=Math.floor(diff/1000);
      if(els.d) els.d.textContent=String(Math.floor(total/86400));
      if(els.h) els.h.textContent=pad(Math.floor(total%86400/3600));
      if(els.m) els.m.textContent=pad(Math.floor(total%3600/60));
      if(els.s) els.s.textContent=pad(total%60);
      if(els.bar) els.bar.style.width=Math.max(0,Math.min(100,((now-START)/(TARGET-START))*100))+'%';
    }
    tick();
    window.setInterval(tick,1000);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initProLaunchLock);
  else initProLaunchLock();
})();


/* ================= COMMAND LAB ================= */
(function(){
  'use strict';
  function initCommandLab(){
    const input=document.getElementById('commandLabInput');
    const run=document.getElementById('commandLabRun');
    const lab=document.querySelector('.command-lab');
    const output=document.getElementById('commandLabOutput');
    const nodes=[...document.querySelectorAll('#commandPipeline .pipeline-node')];
    const presets=[...document.querySelectorAll('.command-presets button[data-command]')];
    if(!input||!run||!lab||!output||nodes.length!==4) return;
    const sleep=ms=>new Promise(r=>setTimeout(r,ms));
    function setNode(i,status){
      nodes.forEach((n,k)=>{n.classList.toggle('active',k===i);const sm=n.querySelector('small');if(sm) sm.textContent=k===i?status:(k<i?'COMPLETE':'STANDBY');});
    }
    async function execute(raw){
      const command=(raw||'').trim();
      if(!command) return;
      lab.classList.add('running'); run.disabled=true; input.value=command;
      output.innerHTML='ASTRON // PROCESSING<br><span>Command received: '+escapeHtml(command)+'</span>';
      setNode(0,'RECEIVED'); await sleep(420);
      setNode(1,'ANALYSING'); output.innerHTML='ASTRON // BRAIN<br><span>Intent detected from command input.</span>'; await sleep(520);
      setNode(2,'EXECUTING'); output.innerHTML='ASTRON // ACTION<br><span>Simulating the requested action pipeline...</span>'; await sleep(620);
      setNode(3,'COMPLETE'); output.innerHTML='ASTRON // COMPLETE<br><span>'+escapeHtml(responseFor(command))+'</span>';
      lab.classList.remove('running'); run.disabled=false;
    }
    function responseFor(c){
      const x=c.toLowerCase();
      if(x.includes('youtube')) return 'Opening YouTube...';
      if(x.includes('search')) return 'Web search intent ready.';
      if(x.includes('note')) return 'Note action queued.';
      if(x.includes('remember')||x.includes('memory')) return 'Memory update intent detected.';
      if(x.includes('status')) return 'All visible ASTRON systems report READY.';
      if(x.includes('gesture')) return 'Gesture control module enabled.';
      return 'Command understood. Action pipeline complete.';
    }
    function escapeHtml(v){return v.replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));}
    run.addEventListener('click',()=>execute(input.value));
    input.addEventListener('keydown',e=>{if(e.key==='Enter') execute(input.value);});
    presets.forEach(b=>b.addEventListener('click',()=>execute(b.dataset.command)));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initCommandLab); else initCommandLab();
})();


/* ================= COMMANDS IN MOTION ================= */
(function(){
  'use strict';
  function initMotion(){
    const board=document.querySelector('[data-motion-board]');
    if(!board) return;
    const steps=[...board.querySelectorAll('.motion-step')];
    const status=document.getElementById('motionStatus');
    const timer=document.getElementById('motionTimer');
    const command=document.getElementById('motionCommand');
    const buttons=[...board.querySelectorAll('[data-motion-command]')];
    const sleep=ms=>new Promise(r=>setTimeout(r,ms));
    let busy=false;
    async function run(raw){
      if(busy) return;
      busy=true; board.classList.add('running'); command.textContent='"'+raw+'"';
      steps.forEach(x=>x.classList.remove('active','complete'));
      const start=performance.now();
      status.textContent='EXECUTING // COMMAND FLOW';
      for(let i=0;i<steps.length;i++){
        steps[i].classList.add('active');
        await sleep(i===2?720:480);
        steps[i].classList.remove('active'); steps[i].classList.add('complete');
        timer.textContent=((performance.now()-start)/1000).toFixed(2)+'s';
      }
      status.textContent='SIMULATION COMPLETE';
      board.classList.remove('running'); busy=false;
    }
    buttons.forEach(b=>b.addEventListener('click',()=>run(b.dataset.motionCommand)));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initMotion); else initMotion();
})();

/* ================= RESPONSIVE NAVIGATION ================= */
(function(){
  const nav=document.querySelector('.nav');
  const toggle=document.querySelector('.nav-toggle');
  const panel=document.getElementById('astron-mobile-nav');
  if(!nav||!toggle||!panel) return;
  function close(){panel.hidden=true;nav.classList.remove('menu-open');document.body.classList.remove('mobile-menu-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation menu');}
  toggle.addEventListener('click',()=>{const opening=panel.hidden;panel.hidden=!opening;nav.classList.toggle('menu-open',opening);document.body.classList.toggle('mobile-menu-open',opening);toggle.setAttribute('aria-expanded',String(opening));toggle.setAttribute('aria-label',opening?'Close navigation menu':'Open navigation menu');});
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  window.addEventListener('resize',()=>{if(window.innerWidth>900) close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape') close();});
})();

