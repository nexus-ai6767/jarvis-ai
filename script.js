const glow=document.querySelector('.cursor-glow');document.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});document.querySelectorAll('.hero-copy,.reactor-stage,.section,.cta').forEach(e=>{e.classList.add('reveal');obs.observe(e)});document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const x=document.querySelector(a.getAttribute('href'));if(x){e.preventDefault();x.scrollIntoView({behavior:'smooth'})}}));

/* ================= PERSONAL BIRTHDAY COUNTDOWN ================= */
(function(){
  const target = new Date('2026-10-19T00:00:00+05:30').getTime();
  const start = new Date('2026-09-20T00:00:00+05:30').getTime();
  const els = {
    d: document.getElementById('bd-days'),
    h: document.getElementById('bd-hours'),
    m: document.getElementById('bd-minutes'),
    s: document.getElementById('bd-seconds'),
    p: document.getElementById('bd-progress'),
    msg: document.getElementById('bd-message')
  };
  if(!els.d) return;
  function pad(n){return String(n).padStart(2,'0');}
  function tick(){
    const now = Date.now();
    let diff = target - now;
    if(diff <= 0){
      els.d.textContent='00'; els.h.textContent='00'; els.m.textContent='00'; els.s.textContent='00';
      els.p.style.width='100%';
      els.msg.textContent='🎂 HAPPY BIRTHDAY // SYSTEM CELEBRATION ONLINE';
      return;
    }
    const total = Math.floor(diff/1000);
    const days = Math.floor(total/86400);
    const hours = Math.floor((total%86400)/3600);
    const minutes = Math.floor((total%3600)/60);
    const seconds = total%60;
    els.d.textContent=pad(days); els.h.textContent=pad(hours); els.m.textContent=pad(minutes); els.s.textContent=pad(seconds);
    const progress = Math.max(0,Math.min(100,((now-start)/(target-start))*100));
    els.p.style.width=progress+'%';
    els.msg.textContent='AWAITING THE BIG DAY // STAY READY';
    setTimeout(tick,250);
  }
  tick();
})();
