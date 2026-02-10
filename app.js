// render from content.json, build nav, reveal, active link
(async function(){
  const res = await fetch('content.json', { cache: 'no-store' });
  const data = await res.json();

  document.getElementById('brandName').textContent = data.brand;
  document.getElementById('footerBrand').textContent = data.brand;
  document.getElementById('year').textContent = new Date().getFullYear();

  const nav = document.getElementById('nav');
  const drawerNav = document.getElementById('drawerNav');

  const navHtml = data.sections.map(s =>
    `<a href="#${s.id}" data-id="${s.id}">${s.nav || s.title}</a>`
  ).join('');
  nav.innerHTML = navHtml;
  drawerNav.innerHTML = navHtml;

  const app = document.getElementById('app');

  data.sections.forEach((s, idx) => {
    const sec = document.createElement('section');
    sec.className = 'section reveal';
    sec.id = s.id;

    let mediaHtml = '';
    if(s.id === 'about'){
      mediaHtml = `
        <div class="media media--circle">
          <video autoplay muted loop playsinline preload="metadata" poster="${data.media.aboutFallback}">
            <source src="${data.media.aboutVideo}" type="video/mp4" />
            <img src="${data.media.aboutFallback}" alt="Лена Рыбина" />
          </video>
        </div>
      `;
    } else {
      mediaHtml = `
        <div class="media">
          <img src="${data.media.aboutFallback}" alt="Поп-ап работа" />
        </div>
      `;
    }

    let extra = '';
    if(s.plans){
      extra = `
        <div class="pricing">
          ${s.plans.map(p => `
            <article class="plan">
              <div class="plan__top">
                <div>
                  <h3 class="plan__name">${p.name}</h3>
                  <div class="plan__meta">${p.meta || ''}</div>
                </div>
                <div class="plan__price">${p.price || ''}</div>
              </div>
              <ul>${(p.bullets||[]).map(b => `<li>${b}</li>`).join('')}</ul>
            </article>
          `).join('')}
        </div>`;
    }

    let cta = '';
    if(s.cta){
      cta = `
        <div class="cta">
          ${s.cta.map(c => {
            const cls = c.kind === 'tg' ? 'btn btn--tg' : (c.kind === 'primary' ? 'btn btn--primary' : 'btn');
            return `<a class="${cls}" href="${c.href}" target="_blank" rel="noopener">${c.label}</a>`;
          }).join('')}
        </div>`;
    }

    let chips = '';
    if(s.id === 'intro' && data.chips){
      chips = `<div class="chips">${data.chips.map(x => `<span class="chip">${x}</span>`).join('')}</div>`;
    }

    sec.innerHTML = `
      <div class="card">
        <div class="card__inner">
          <div>
            <div class="kicker">${s.nav || s.title}</div>
            <h2 class="card__title">${s.title}</h2>
            <p class="card__text">${s.text || ''}</p>
            ${chips}
            ${extra}
            ${cta}
          </div>
          ${mediaHtml}
        </div>
      </div>
    `;
    app.appendChild(sec);
  });

  // drawer
  const drawer = document.getElementById('drawer');
  const btn = document.getElementById('navbtn');
  const scrim = document.getElementById('drawerScrim');
  const closeDrawer = () => drawer.classList.remove('is-open');
  btn.addEventListener('click', () => drawer.classList.toggle('is-open'));
  scrim.addEventListener('click', closeDrawer);
  drawerNav.addEventListener('click', (e) => {
    if(e.target.closest('a')) closeDrawer();
  });

  // reveal
  const io = new IntersectionObserver((entries) => {
    for(const e of entries){
      if(e.isIntersecting) e.target.classList.add('is-visible');
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // active link
  const setCurrent = (id) => {
    document.querySelectorAll('.nav a, .drawer__panel a').forEach(a => {
      a.setAttribute('aria-current', a.getAttribute('data-id') === id ? 'true' : 'false');
    });
  };
  const sections = data.sections.map(s => document.getElementById(s.id)).filter(Boolean);
  const io2 = new IntersectionObserver((entries) => {
    const v = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(v) setCurrent(v.target.id);
  }, { threshold: [0.25, 0.45, 0.6] });
  sections.forEach(s => io2.observe(s));
})();
