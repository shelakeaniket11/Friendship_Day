(function(){

  /* ================= LENIS SMOOTH SCROLL ================= */
  let lenis;
  try{
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if(window.gsap && window.ScrollTrigger){
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time)=>{ lenis.raf(time*1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }catch(e){ /* fallback: native scroll */ }

  /* ================= PROGRESS BAR ================= */
  const progressFill = document.getElementById('progressFill');
  function updateProgress(){
    const h = document.documentElement;
    const scrollTop = h.scrollTop || document.body.scrollTop;
    const scrollHeight = h.scrollHeight - h.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop/scrollHeight)*100 : 0;
    progressFill.style.width = pct + '%';
  }
  document.addEventListener('scroll', updateProgress);
  if(lenis) lenis.on('scroll', updateProgress);

  /* ================= OPENING TYPEWRITER ================= */
  const openingEl = document.getElementById('opening');
  const typeLine = document.getElementById('typeLine');
  const beginBtn = document.getElementById('beginBtn');
  const cursor = document.querySelector('.type-cursor');

  const lines = [
    "Some people walk into our lives...",
    "...without making any noise.",
    "But somehow...",
    "...they change everything.",
    "I never knew I was waiting for someone...",
    "...until you came into my life."
  ];

  // opening ambient particles
  const partWrap = document.getElementById('openingParticles');
  for(let i=0;i<26;i++){
    const s = document.createElement('span');
    const size = 2 + Math.random()*3;
    s.style.width = size+'px'; s.style.height = size+'px';
    s.style.left = Math.random()*100+'%';
    s.style.top = Math.random()*100+'%';
    s.style.animation = `floaty ${8+Math.random()*10}s ease-in-out ${Math.random()*6}s infinite`;
    partWrap.appendChild(s);
  }
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes floaty{
      0%{ transform:translateY(0) translateX(0); opacity:0; }
      10%{ opacity:0.8; }
      50%{ transform:translateY(-40px) translateX(12px); }
      90%{ opacity:0.5; }
      100%{ transform:translateY(-90px) translateX(-8px); opacity:0; }
    }`;
  document.head.appendChild(styleTag);

  function typeText(str, el){
    return new Promise(resolve=>{
      let i = 0;
      const speed = 42;
      function step(){
        if(i <= str.length){
          el.textContent = str.slice(0,i);
          el.appendChild(cursor);
          i++;
          setTimeout(step, speed);
        } else { resolve(); }
      }
      step();
    });
  }
  function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
  function fadeOutText(el){
    return new Promise(resolve=>{
      el.style.transition = 'opacity 0.8s ease';
      el.style.opacity = 0;
      setTimeout(()=>{ el.textContent=''; el.style.opacity=1; el.appendChild(cursor); resolve(); }, 800);
    });
  }

  const soundToggle = document.getElementById('soundToggle');
  const bgMusic = document.getElementById('bgMusic');
  const soundOn = document.getElementById('soundIconOn');
  const soundOff = document.getElementById('soundIconOff');
  let musicPlaying = false;

  async function runIntro(){
    for(let i=0;i<lines.length;i++){
      await typeText(lines[i], typeLine);
      await wait(i===1||i===3||i===5 ? 900 : 550);
      if(i !== lines.length-1) await fadeOutText(typeLine);
    }
    beginBtn.classList.add('show');
  }

  function startMusic(){
    if(musicPlaying) return;
    bgMusic.volume = 0.35;
    bgMusic.play().then(()=>{
      musicPlaying = true;
      soundToggle.classList.add('visible');
      soundOn.style.display='block'; soundOff.style.display='none';
    }).catch(()=>{ /* browser blocked it — will retry on first interaction */ });
  }

  // try instantly on load
  startMusic();

  // fallback: browsers require a user gesture before audio can play —
  // this catches the very first click/tap/keypress anywhere on the page,
  // which may happen even before the Begin button is clicked.
  ['pointerdown','keydown','touchstart'].forEach(evt=>{
    window.addEventListener(evt, startMusic, { once:true, passive:true });
  });

  runIntro();

  beginBtn.addEventListener('click', ()=>{
    openingEl.classList.add('hide');
    soundToggle.classList.add('visible');
    startMusic();
    setTimeout(()=>{ openingEl.style.display='none'; document.body.style.overflow='auto'; }, 1500);
    if(window.ScrollTrigger) ScrollTrigger.refresh();
  });

  soundToggle.addEventListener('click', ()=>{
    if(musicPlaying){ bgMusic.pause(); musicPlaying=false; soundOn.style.display='none'; soundOff.style.display='block'; }
    else{ bgMusic.play().then(()=>{ musicPlaying=true; soundOn.style.display='block'; soundOff.style.display='none'; }).catch(()=>{}); }
  });

  /* ================= SCROLL REVEALS (GSAP) ================= */
  if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal').forEach((el)=>{
      gsap.to(el, {
        opacity:1, y:0, duration:1.1, ease:'power3.out',
        scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none reverse' }
      });
    });

    // stagger cards
    gsap.utils.toArray('.card-grid .glass-card').forEach((el,i)=>{
      gsap.to(el, {
        opacity:1, y:0, duration:0.9, delay:(i%3)*0.08, ease:'power3.out',
        scrollTrigger:{ trigger:el, start:'top 90%', toggleActions:'play none none reverse' }
      });
    });

    // timeline items stagger + line grow
    gsap.utils.toArray('.tl-item').forEach((el,i)=>{
      gsap.to(el, {
        opacity:1, y:0, duration:0.8, delay:i*0.05, ease:'power3.out',
        scrollTrigger:{ trigger:el, start:'top 92%', toggleActions:'play none none reverse' }
      });
    });

    // hero parallax orbs
    gsap.to('.ambient-orb.a', { y:60, scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:1 } });
    gsap.to('.ambient-orb.b', { y:-60, scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:1 } });

    // lucky counters text reveal
    gsap.utils.toArray('.lucky-item .num[data-text]').forEach(el=>{
      ScrollTrigger.create({
        trigger: el, start:'top 90%',
        onEnter: ()=>{ animateWordCounter(el); },
        once:true
      });
    });
  } else {
    // fallback: reveal everything immediately
    document.querySelectorAll('.reveal').forEach(el=>{ el.style.opacity=1; el.style.transform='none'; });
  }

  function animateWordCounter(el){
    const target = el.getAttribute('data-text');
    const fillers = ['0','12','58','214','∞','—'];
    let count = 0;
    const total = 14;
    const iv = setInterval(()=>{
      count++;
      el.textContent = count < total ? fillers[count % fillers.length] : target;
      if(count >= total){ clearInterval(iv); el.textContent = target; }
    }, 60);
  }

  /* ================= STAR FIELD (interactive) ================= */
  const starField = document.getElementById('starField');
  const starsFinale = document.getElementById('starsFinale');
  const words = ['You','are','my','safe place'];
  const positions = [ {x:18,y:30}, {x:42,y:65}, {x:64,y:22}, {x:84,y:58} ];
  let openedCount = 0;

  positions.forEach((pos,i)=>{
    const star = document.createElement('div');
    star.className = 'tap-star';
    star.style.left = pos.x + '%';
    star.style.top = pos.y + '%';
    star.innerHTML = `
      <svg viewBox="0 0 24 24" fill="#F3E9DA"><path d="M12 0l2.6 8.4L23 11l-8.4 2.6L12 22l-2.6-8.4L1 11l8.4-2.6L12 0z"/></svg>
      <span class="word">${words[i]}</span>
    `;
    star.addEventListener('click', ()=>{
      if(star.classList.contains('opened')) return;
      star.classList.add('opened');
      openedCount++;
      if(window.confetti){
        confetti({ particleCount: 26, spread: 55, startVelocity: 18, gravity: 0.6, ticks: 180, scalar: 0.7, colors: ['#F3E9DA','#E8C4BE','#CFC3E3','#C9A671'], origin: { x: 0.5, y: 0.7 } });
      }
      if(openedCount === positions.length){
        setTimeout(()=>{ starsFinale.classList.add('show'); }, 500);
      }
    });
    starField.appendChild(star);
  });

  /* ================= SCRATCH CARDS ================= */
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setupScratchCard(card){
    const canvas = card.querySelector('.scratch-canvas');
    const hint = card.querySelector('.scratch-hint');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, drawing = false, lastX = 0, lastY = 0, checkTimer = null;

    function sizeCanvas(){
      const rect = card.getBoundingClientRect();
      w = canvas.width = Math.max(1, Math.round(rect.width));
      h = canvas.height = Math.max(1, Math.round(rect.height));
      paintScratchLayer();
    }

    function paintScratchLayer(){
      // base shimmering gold/glitter fill
      const grad = ctx.createLinearGradient(0,0,w,h);
      grad.addColorStop(0, '#E4D3B4');
      grad.addColorStop(0.5, '#E8C4BE');
      grad.addColorStop(1, '#CFC3E3');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,w,h);
      // glitter speckles
      for(let i=0;i<70;i++){
        const gx = Math.random()*w, gy = Math.random()*h;
        const r = Math.random()*1.6+0.4;
        ctx.beginPath();
        ctx.arc(gx, gy, r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${0.25 + Math.random()*0.5})`;
        ctx.fill();
      }
    }

    function getPos(e){
      const rect = canvas.getBoundingClientRect();
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      return { x: cx * (w/rect.width), y: cy * (h/rect.height) };
    }

    function scratchAt(x, y){
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI*2);
      ctx.fill();
    }

    function scheduleCheck(){
      if(checkTimer) return;
      checkTimer = setTimeout(()=>{
        checkTimer = null;
        checkCleared();
      }, 180);
    }

    function checkCleared(){
      if(card.classList.contains('revealed')) return;
      let cleared = 0, sampled = 0;
      const step = 6;
      const data = ctx.getImageData(0,0,w,h).data;
      for(let y=0; y<h; y+=step){
        for(let x=0; x<w; x+=step){
          const idx = (y*w + x) * 4 + 3;
          sampled++;
          if(data[idx] < 40) cleared++;
        }
      }
      if(sampled > 0 && (cleared/sampled) > 0.45){
        card.classList.add('revealed');
        if(window.confetti){
          const rect = card.getBoundingClientRect();
          confetti({
            particleCount: 18, spread: 50, startVelocity: 14, gravity: 0.7, scalar: 0.7,
            colors: ['#E8C4BE','#CFC3E3','#C9A671','#F3E9DA'],
            origin: { x: (rect.left+rect.width/2)/window.innerWidth, y: (rect.top+rect.height/2)/window.innerHeight }
          });
        }
      }
    }

    function start(e){
      drawing = true;
      const p = getPos(e);
      lastX = p.x; lastY = p.y;
      scratchAt(p.x, p.y);
      scheduleCheck();
      e.preventDefault();
    }
    function move(e){
      if(!drawing) return;
      const p = getPos(e);
      const dist = Math.hypot(p.x-lastX, p.y-lastY);
      const steps = Math.max(1, Math.floor(dist/8));
      for(let i=0;i<steps;i++){
        const t = i/steps;
        scratchAt(lastX + (p.x-lastX)*t, lastY + (p.y-lastY)*t);
      }
      lastX = p.x; lastY = p.y;
      scheduleCheck();
      e.preventDefault();
    }
    function end(){ drawing = false; }

    canvas.addEventListener('pointerdown', start);
    canvas.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    canvas.addEventListener('touchstart', start, { passive:false });
    canvas.addEventListener('touchmove', move, { passive:false });
    canvas.addEventListener('touchend', end);

    sizeCanvas();
    window.addEventListener('resize', ()=>{ if(!card.classList.contains('revealed')) sizeCanvas(); });
  }

  document.querySelectorAll('.glass-card[data-scratch]').forEach(setupScratchCard);

  /* ================= GLITTERY FLOATING HEARTS ================= */
  const heartsLayer = document.getElementById('heartsLayer');
  const heartColors = ['#E8C4BE','#C9A671','#CFC3E3'];
  function spawnHeart(){
    if(reduceMotion) return;
    const h = document.createElement('div');
    h.className = 'floating-heart';
    const size = 10 + Math.random()*16;
    const left = Math.random()*100;
    const duration = 9 + Math.random()*8;
    const drift = (Math.random()*60 - 30) + 'px';
    const color = heartColors[Math.floor(Math.random()*heartColors.length)];
    h.style.left = left + '%';
    h.style.setProperty('--drift', drift);
    h.style.animation = `heart-rise ${duration}s ease-in ${Math.random()*1.5}s forwards`;
    h.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M12 21s-7.4-4.6-10-9C.4 8.6 2 5 5.6 5c2 0 3.4 1 4.4 2.4C11 5.9 12.4 5 14.4 5 18 5 19.6 8.6 22 12c-2.6 4.4-10 9-10 9z"/></svg><span class="glint"></span>`;
    heartsLayer.appendChild(h);
    setTimeout(()=> h.remove(), (duration+2)*1000);
  }
  let heartInterval;
  function startHearts(){
    if(reduceMotion || heartInterval) return;
    spawnHeart();
    heartInterval = setInterval(spawnHeart, 1300);
  }
  startHearts();

  /* ================= FINAL STARFIELD ================= */
  const finalStars = document.getElementById('finalStars');
  for(let i=0;i<70;i++){
    const s = document.createElement('span');
    s.style.left = Math.random()*100+'%';
    s.style.top = Math.random()*100+'%';
    s.style.opacity = (0.3 + Math.random()*0.7).toFixed(2);
    s.style.animation = `twinkle ${2+Math.random()*4}s ease-in-out ${Math.random()*4}s infinite`;
    finalStars.appendChild(s);
  }

  /* ================= RELIVE BUTTON ================= */
  document.getElementById('reliveBtn').addEventListener('click', ()=>{
    if(window.confetti){
      confetti({ particleCount: 90, spread: 100, origin:{y:0.6}, colors:['#F3E9DA','#E8C4BE','#CFC3E3','#C9A671','#C3D9E8'] });
    }
    if(lenis){ lenis.scrollTo(0, { duration: 2 }); }
    else{ window.scrollTo({ top:0, behavior:'smooth' }); }
  });

  document.body.style.overflow = 'hidden';
})();
