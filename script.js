const burger   = document.querySelector('.burger');
const drawer   = document.getElementById('mobileMenu');
const overlay  = document.getElementById('menuOverlay');
const links    = drawer.querySelectorAll('a, .lang');

function toggleMenu() {
  const open = drawer.classList.toggle('open');
  overlay.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  overlay.hidden = !open;
}

burger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);
links.forEach(l => l.addEventListener('click', toggleMenu));
