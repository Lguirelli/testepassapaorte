(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem('psn-showcase-theme');
  if (saved) root.dataset.theme = saved;
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('psn-showcase-theme', next);
    btn.setAttribute('aria-label', next === 'dark' ? 'Usar modo claro' : 'Usar modo escuro');
  }));
  const menuBtn = document.querySelector('[data-menu]');
  const mobile = document.querySelector('.mobile-menu');
  if (menuBtn && mobile) menuBtn.addEventListener('click', () => {
    mobile.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', mobile.classList.contains('open') ? 'true' : 'false');
  });
  const q = document.querySelector('[data-search]');
  const cards = [...document.querySelectorAll('[data-place-card]')];
  if (q && cards.length) q.addEventListener('input', () => {
    const term = q.value.toLowerCase().trim();
    cards.forEach(c => c.style.display = !term || c.textContent.toLowerCase().includes(term) ? '' : 'none');
  });
  document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.dataset.filter;
    cards.forEach(c => c.style.display = category === 'all' || c.dataset.category === category ? '' : 'none');
  }));
})();
