

document.addEventListener('DOMContentLoaded', () => {

  const burger  = document.querySelector('.burger');
  const drawer  = document.getElementById('mobileMenu');
  const overlay = document.getElementById('menuOverlay');
  const links   = drawer.querySelectorAll('a, .lang');

  /* обычное open / close по клику */
  function setOpen(open){
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    burger .classList.toggle('open', open);
    burger .setAttribute('aria-expanded', open);
    overlay.hidden = !open;
    document.body.classList.toggle('no-scroll', open);
  }

  burger .addEventListener('click', () => setOpen(true));
  overlay.addEventListener('click', () => setOpen(false));
  links  .forEach(el => el.addEventListener('click', () => setOpen(false)));

  /* ---------- DRAG-закрытие (начинать можно на overlay или в меню) ---------- */
  let dragging = false, startX = 0, drawerW = 0;

[drawer, overlay].forEach(el => el.addEventListener('pointerdown', e => {
  if (!drawer.classList.contains('open')) return;   // работаем только когда меню открыто
  dragging = true;
  startX   = e.clientX;
  drawerW  = drawer.offsetWidth;
  el.setPointerCapture(e.pointerId);
}));

window.addEventListener('pointermove', e => {
  if (!dragging) return;

  const dx = e.clientX - startX;                // ← отрицательно / → положительно
  let translate = 0, scale = 1;

  if (dx >= 0){                                 // тащим вправо (закрываем)
    translate = Math.min(dx, drawerW);
  } else {                                      // тащим влево — JELLY-эффект
    const stretch = Math.min(Math.abs(dx), drawerW * 0.1); // макс 10 % ширины
    scale = 1 + (stretch / drawerW) * 0.6;      // до +6 % масштаба
  }

  drawer.style.transform  = `translateX(${translate}px) scaleX(${scale})`;
  overlay.style.opacity   = 1 - translate / drawerW;
});

window.addEventListener('pointerup', finish);
window.addEventListener('pointercancel', finish);

function finish(e){
  if (!dragging) return;
  dragging = false;

  const dx      = e.clientX - startX;
  const closed  =  dx > drawerW * 0.30;               // >30 % вправо = закрыть

  drawer.style.transform = '';                        // снимаем inline-style
  overlay.style.opacity  = '';
  setOpen(!closed);                                   // закрываем или оставляем
}



/* ------ Автоподтягивание следующего слайда в новостях ------ */
  const newsSection = document.getElementById('news');
  const newsGrid    = document.querySelector('.news-grid');
  let teaseTimer;
  let lastTease = 0;

  if (newsSection && newsGrid){
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && window.innerWidth <= 767){
          maybeTease();
        }
      });
    }, {threshold: 0.5});
    observer.observe(newsSection);
  }

  function maybeTease(){
    const now = Date.now();
    const cooldown = 5 * 60 * 1000; // раз в пять минут
    if (now - lastTease < cooldown) return;
    lastTease = now;
    teaseOnce();
  }

  function teaseOnce(){
    clearTimeout(teaseTimer);
    const slide = newsGrid.querySelector('.col');
    if (!slide) return;
    const move = slide.clientWidth * 0.3;
    const overshoot = slide.clientWidth * 0.05;
    newsGrid.scrollBy({left: move + overshoot, behavior: 'smooth'});
    teaseTimer = setTimeout(() => {
      newsGrid.scrollBy({left: -(move + overshoot), behavior: 'smooth'});
    }, 800);
  }
});


window.addEventListener('DOMContentLoaded', () => {
  // Если перезагрузили страницу (не первый заход) и в URL есть #gallery
  const navEntries = performance.getEntriesByType("navigation");
  const isReload = navEntries.length && navEntries[0].type === "reload";
  if (isReload && window.location.hash === "#gallery") {
    // Убираем хэш без перезагрузки
    history.replaceState(null, "", window.location.pathname + window.location.search);
    // Сбрасываем прокрутку наверх
    window.scrollTo(0, 0);
  }
});






