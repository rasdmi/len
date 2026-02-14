// Pop-up with Lena — tiny JS
// 1) mobile drawer
// 2) doodles generator (random each load, spans full page height)

(function(){
  const navBtn = document.getElementById('navBtn');
  const drawer = document.getElementById('drawer');

  function closeDrawer(){
    if(!drawer) return;
    drawer.hidden = true;
    navBtn?.setAttribute('aria-expanded','false');
  }
  function openDrawer(){
    if(!drawer) return;
    drawer.hidden = false;
    navBtn?.setAttribute('aria-expanded','true');
  }

  navBtn?.addEventListener('click', () => {
    const isOpen = !drawer.hidden;
    isOpen ? closeDrawer() : openDrawer();
  });
  drawer?.addEventListener('click', (e) => {
    if(e.target === drawer) closeDrawer();
  });
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  // ===== Doodles =====
    // ===== Doodles =====
  const root = document.getElementById('doodles');
  if(!root) return;

  const css = getComputedStyle(document.documentElement);
  const COLORS = {
    red:   (css.getPropertyValue('--red').trim() || '#E2553D'),
    yellow:(css.getPropertyValue('--yellow').trim() || '#FFD22E'),
    blue:  (css.getPropertyValue('--blue').trim() || '#1F4EA3'),
  };

  // Allowed categories (no people/flags/gestures/emotions/signs)
  const EMOJI = [
    // animals
    '🐶','🐱','🐭','🐰','🦊','🐻','🐼','🐯','🦁','🐷','🐸','🐵','🐥','🦉','🦋','🐝','🐟',
    // plants / nature
    '🌿','🍃','🌵','🌲','🌳','🍀','🌸','🌼','🌻','🪴',
    // food
    '🍎','🍐','🍌','🍓','🍇','🥐','🍞','🧀','🍯','🍪','🍰',
    // sport
    '⚽️','🏀','🏸','🎾','🛹','⛸️',
    // creativity / making
    '✂️','🧷','🧵','🧶','📎','🖍️','✏️','📐','📏','📌','🧩','📚',
    // buildings
    '🏠','🏫','🏭','🏛️','🏡'
  ];

  const rand = (min,max) => Math.random()*(max-min)+min;
  const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];

  function pageHeight(){
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
  }

  function clear(){
    root.innerHTML = '';
  }

  function createSVG(w,h){
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio','none');
    svg.classList.add('doodlesSvg');
    return svg;
  }

  function dashedPath(svg, d, color){
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d', d);
    path.setAttribute('fill','none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width','6');
    path.setAttribute('stroke-linecap','round');
    path.setAttribute('stroke-dasharray','12 14');
    path.setAttribute('opacity','0.95');
    svg.appendChild(path);
  }

  function addEmoji(x,y, colorKey){
    const el = document.createElement('div');
    el.className = 'emoji';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.textContent = pick(EMOJI);
    // цвет берём через filter/тень в CSS, чтобы не было “квадрата”
    el.dataset.c = colorKey;
    root.appendChild(el);
    return el;
  }

  function cubic(p0,p1,p2,p3,t){
    const u = 1 - t;
    return (u*u*u)*p0 + 3*(u*u)*t*p1 + 3*u*(t*t)*p2 + (t*t*t)*p3;
  }

  function build(){
    clear();

    const w = window.innerWidth;
    const h = pageHeight();
    root.style.height = h + 'px';

    const svg = createSVG(w,h);
    root.appendChild(svg);

    // 3 paths: each has ONLY start + end emoji
    const lines = [
      {c:'yellow'},
      {c:'red'},
      {c:'blue'},
    ];

    lines.forEach((ln, i) => {
      // start near top, different columns
      const sx = rand(w*(0.10 + i*0.26), w*(0.22 + i*0.26));
      const sy = rand(120, 260);

      // end near bottom, spread across width and deep in scroll
      const ex = rand(w*0.15, w*0.88);
      const ey = rand(h*0.78, h*0.96);

      // bezier controls to make a long “flow” across the page
      const c1x = sx + rand(-w*0.10, w*0.22);
      const c1y = sy + rand(h*0.18, h*0.32);
      const c2x = ex + rand(-w*0.22, w*0.10);
      const c2y = ey - rand(h*0.18, h*0.30);

      const d = `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;
      dashedPath(svg, d, COLORS[ln.c]);

      addEmoji(sx, sy, ln.c); // one emoji = one line start
      addEmoji(ex, ey, ln.c); // one emoji = one line end
    });
  }

  // IMPORTANT: build ONCE
 window.addEventListener('load', () => {
  build(); // генерируем ОДИН раз
});


})();
