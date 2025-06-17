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
  let dragging = false;
  let startX   = 0;
  let drawerW  = 0;

  /* назначим одну и ту же функцию двум элементам */
  [drawer, overlay].forEach(el => el.addEventListener('pointerdown', onStart));

  function onStart(e){
    /* работаем только когда меню ОТКРЫТО */
    if (!drawer.classList.contains('open')) return;

    dragging = true;
    startX   = e.clientX;
    drawerW  = drawer.offsetWidth;
    e.target.setPointerCapture(e.pointerId);
  }

  window.addEventListener('pointermove', e => {
    if (!dragging) return;

    const dx        = Math.max(0, e.clientX - startX);   // влево не двигаем
    const translate = Math.min(dx, drawerW);            // 0 … width

    drawer .style.transform = `translateX(${translate}px)`;
    overlay.style.opacity   = 1 - translate / drawerW;
  });

  window.addEventListener('pointerup',   finishDrag);
  window.addEventListener('pointercancel', finishDrag);

  function finishDrag(e){
    if (!dragging) return;
    dragging = false;

    const dx       = e.clientX - startX;
    const closed   = dx > drawerW * 0.30;               // 30 % порог
    drawer .style.transform = '';
    overlay.style.opacity   = '';
    setOpen(!closed);
  }
});
