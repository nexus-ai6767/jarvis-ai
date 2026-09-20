const glow=document.querySelector('.cursor-glow');
if(glow){document.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});}const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});document.querySelectorAll('.hero-copy,.reactor-stage,.section,.cta').forEach(e=>{e.classList.add('reveal');obs.observe(e)});document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const x=document.querySelector(a.getAttribute('href'));if(x){e.preventDefault();x.scrollIntoView({behavior:'smooth'})}}));

/* ================= PERSONAL BIRTHDAY COUNTDOWN ================= */
(function(){
  'use strict';

  function initBirthdayCountdown(){
    const d=document.getElementById('bd-days');
    const h=document.getElementById('bd-hours');
    const m=document.getElementById('bd-minutes');
    const sec=document.getElementById('bd-seconds');
    const bar=document.getElementById('bd-progress');
    const msg=document.getElementById('bd-message');
    if(!d||!h||!m||!sec) return;

    // 19 October 2026, 00:00:00 IST (UTC+05:30).
    // Numeric timestamp avoids browser-specific date parsing differences.
    const target=Date.UTC(2026,9,18,18,30,0);
    const start=Date.UTC(2026,8,20,18,30,0);
    const pad=n=>String(Math.max(0,n)).padStart(2,'0');

    function tick(){
      const diff=target-Date.now();
      if(diff<=0){
        d.textContent='00'; h.textContent='00'; m.textContent='00'; sec.textContent='00';
        if(bar) bar.style.width='100%';
        if(msg) msg.textContent='🎂 HAPPY BIRTHDAY // SYSTEM CELEBRATION ONLINE';
        return;
      }
      const total=Math.floor(diff/1000);
      d.textContent=String(Math.floor(total/86400));
      h.textContent=pad(Math.floor((total%86400)/3600));
      m.textContent=pad(Math.floor((total%3600)/60));
      sec.textContent=pad(total%60);
      if(bar){
        const progress=Math.max(0,Math.min(100,((Date.now()-start)/(target-start))*100));
        bar.style.width=progress+'%';
      }
      if(msg) msg.textContent='COUNTDOWN ACTIVE // YOUR BIG DAY IS APPROACHING';
    }

    tick();
    setInterval(tick,1000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initBirthdayCountdown);
  else initBirthdayCountdown();
})();
