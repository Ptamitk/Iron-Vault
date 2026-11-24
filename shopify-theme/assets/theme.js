(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('MobileNav');
  if (menuButton && mobileNav) menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    mobileNav.hidden = expanded;
    document.body.classList.toggle('menu-open', !expanded);
  });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach((node) => observer.observe(node));
  }
  document.querySelectorAll('.faq-item').forEach((item) => item.addEventListener('toggle', () => {
    if (item.open) document.querySelectorAll('.faq-item[open]').forEach((other) => { if (other !== item) other.open = false; });
  }));
})();