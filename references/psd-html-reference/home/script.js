(() => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-mobile-menu]');
  const transition = document.querySelector('.page-transition');
  const toast = document.querySelector('[data-toast]');

  requestAnimationFrame(() => transition?.classList.add('is-entering'));
  transition?.addEventListener('animationend', () => transition.classList.remove('is-entering'));

  const closeMenu = () => {
    menu?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menu?.classList.toggle('is-open', !open);
    body.classList.toggle('menu-open', !open);
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 80);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('[data-page-link]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const href = link.getAttribute('href');
      transition?.classList.add('is-leaving');
      setTimeout(() => { window.location.href = href; }, 560);
    });
  });

  document.querySelectorAll('[data-rail-prev]').forEach(button => {
    button.addEventListener('click', () => document.getElementById(button.dataset.railPrev)?.scrollBy({ left: -310, behavior: 'smooth' }));
  });
  document.querySelectorAll('[data-rail-next]').forEach(button => {
    button.addEventListener('click', () => document.getElementById(button.dataset.railNext)?.scrollBy({ left: 310, behavior: 'smooth' }));
  });

  document.querySelectorAll('[data-accordion] .accordion-item button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion-item');
      const open = item.classList.contains('is-open');
      document.querySelectorAll('[data-accordion] .accordion-item').forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('button')?.setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .signature-route').forEach(el => revealObserver.observe(el));

  const dialog = document.querySelector('[data-search-dialog]');
  document.querySelector('[data-search-open]')?.addEventListener('click', () => {
    dialog?.showModal();
    setTimeout(() => dialog?.querySelector('input')?.focus(), 50);
  });

  const notify = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  };

  document.querySelector('[data-search-form]')?.addEventListener('submit', event => {
    event.preventDefault();
    const query = event.currentTarget.querySelector('input')?.value.trim();
    notify(query ? `Busca demonstrativa: ${query}` : 'Digite algo para explorar.');
  });
  document.querySelector('[data-planner-form]')?.addEventListener('submit', event => {
    event.preventDefault();
    const value = event.currentTarget.querySelector('input')?.value.trim();
    notify(value ? 'Ponto de partida salvo neste protótipo.' : 'Conte como você quer viver este dia.');
  });
})();
