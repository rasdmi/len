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



})();
