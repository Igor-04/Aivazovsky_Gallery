document.addEventListener('DOMContentLoaded', () => {
  const burger  = document.querySelector('.burger');
  const drawer  = document.getElementById('mobileMenu');
  const overlay = document.getElementById('menuOverlay');
  const links   = drawer.querySelectorAll('a, .lang');

  /* ========== обычное открытие/закрытие по клику ========== */
  function setOpen(open) {
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    overlay.hidden = !open;
    document.body.classList.toggle('no-scroll', open);
  }
  burger.addEventListener('click', () => setOpen(true));
  overlay.addEventListener('click', () => setOpen(false));
  links.forEach(l => l.addEventListener('click', () => setOpen(false)));

  /* ========== drag-закрытие  ========== */
  let startX   = 0;
  let drawerW  = 0;
  let dragging = false;

  drawer.addEventListener('pointerdown', e => {
    // начинаем перетаскивание только по левому краю панели (20 px)
    if (e.clientX > window.innerWidth - drawer.offsetWidth + 20) {
      e.preventDefault();
      dragging = true;
      startX  = e.clientX;
      drawerW = drawer.offsetWidth;
      drawer.setPointerCapture(e.pointerId);
    }
  });

  drawer.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;        // отрицательное число
    const translate = Math.min(0, dx);    // не двигаем вправо
    drawer.style.transform = `translateX(${translate}px)`;
    overlay.style.opacity  = 1 + translate / drawerW; // плавное затенение
  });

  drawer.addEventListener('pointerup', e => finishDrag(e));
  drawer.addEventListener('pointercancel', e => finishDrag(e));

  function finishDrag(e){
    if (!dragging) return;
    dragging = false;
    drawer.releasePointerCapture(e.pointerId);

    const dx = e.clientX - startX;
    const closed = Math.abs(dx) > drawerW * 0.30;   // 30 % порог
    drawer.style.transform = '';                    // снимаем inline-style
    overlay.style.opacity  = '';                    // —
    setOpen(!closed);                               // закрыть или вернуть
  }
});
