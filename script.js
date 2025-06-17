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
});
