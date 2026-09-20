const glow=document.querySelector('.cursor-glow');document.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});document.querySelectorAll('.hero-copy,.reactor-stage,.section,.cta').forEach(e=>{e.classList.add('reveal');obs.observe(e)});document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const x=document.querySelector(a.getAttribute('href'));if(x){e.preventDefault();x.scrollIntoView({behavior:'smooth'})}}));
/* ================= BIRTHDAY COUNTDOWN ================= */
(function initBirthdayCountdown(){
    const root=document.getElementById('birthday-countdown');
    if(!root) return;

    const days=document.getElementById('count-days');
    const hours=document.getElementById('count-hours');
    const minutes=document.getElementById('count-minutes');
    const seconds=document.getElementById('count-seconds');
    const status=document.getElementById('birthday-status');

    // 19 October 2026, 00:00 IST
    const target=new Date('2026-10-19T00:00:00+05:30').getTime();

    const pad=n=>String(Math.max(0,n)).padStart(2,'0');

    function update(){
        const diff=target-Date.now();

        if(diff<=0){
            days.textContent='00';
            hours.textContent='00';
            minutes.textContent='00';
            seconds.textContent='00';
            root.classList.remove('birthday-live');
            root.classList.add('birthday-complete');
            status.textContent='🎂 HAPPY BIRTHDAY // JARVIS ONLINE';
            return;
        }

        const totalSeconds=Math.floor(diff/1000);
        const d=Math.floor(totalSeconds/86400);
        const h=Math.floor((totalSeconds%86400)/3600);
        const m=Math.floor((totalSeconds%3600)/60);
        const s=totalSeconds%60;

        days.textContent=pad(d);
        hours.textContent=pad(h);
        minutes.textContent=pad(m);
        seconds.textContent=pad(s);
        status.textContent='TARGET LOCKED // COUNTDOWN ACTIVE';
        root.classList.add('birthday-live');
    }

    update();
    setInterval(update,1000);
})();
