const glow=document.querySelector('.cursor-glow');document.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});document.querySelectorAll('.hero-copy,.reactor-stage,.section,.cta').forEach(e=>{e.classList.add('reveal');obs.observe(e)});document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const x=document.querySelector(a.getAttribute('href'));if(x){e.preventDefault();x.scrollIntoView({behavior:'smooth'})}}));
/* ===== JARVIS INTRO VIDEO ===== */
(function(){
function initJarvisIntro(){
const intro=document.getElementById("jarvisIntro"), video=document.getElementById("jarvisIntroVideo"), btn=document.getElementById("introAudioBtn");
if(!intro||!video)return;
document.documentElement.classList.add("intro-active"); document.body.classList.add("intro-active");
video.muted=false;
const p=video.play();
if(p&&p.catch)p.catch(function(){video.muted=true; video.play().catch(function(){}); if(btn)btn.classList.remove("hidden");});
if(btn)btn.addEventListener("click",function(){video.muted=false;video.volume=1;video.play().catch(function(){});btn.classList.add("hidden");});
let done=false;
function close(){if(done)return;done=true;intro.classList.add("hide");document.documentElement.classList.remove("intro-active");document.body.classList.remove("intro-active");setTimeout(function(){intro.remove()},800);}
video.addEventListener("ended",close);
video.addEventListener("loadedmetadata",function(){setTimeout(close,video.duration*1000+1200);});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initJarvisIntro);else initJarvisIntro();
})();
