(() => {
  const transition = document.querySelector('.page-transition');
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-mobile-menu]');
  const toast = document.querySelector('[data-toast]');

  requestAnimationFrame(() => transition?.classList.add('is-entering'));
  transition?.addEventListener('animationend', () => transition.classList.remove('is-entering'));
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 70);
  updateHeader(); window.addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menu?.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('is-open'); menuButton?.setAttribute('aria-expanded','false'); document.body.classList.remove('menu-open');
  }));

  document.querySelectorAll('[data-page-link]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    transition?.classList.add('is-leaving');
    setTimeout(() => { window.location.href = link.getAttribute('href'); }, 560);
  }));

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const notify = message => {
    if (!toast) return; toast.textContent = message; toast.classList.add('is-visible'); clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  };

  document.querySelector('[data-save]')?.addEventListener('click', event => {
    const button = event.currentTarget; const saved = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!saved)); button.classList.toggle('is-saved', !saved); button.querySelector('span').textContent = saved ? '♡' : '♥';
    notify(saved ? 'Removido do passaporte.' : 'Salvo no passaporte demonstrativo.');
  });

  const panels = {
    livre: ['Visita livre, no seu próprio tempo.','Uma janela confortável para explorar e seguir viagem sem compromisso com horário de saída.',['Duração sugerida: 1h30','Reserva: recomendada em fins de semana','Perfil: casal, família, solo']],
    guiada: ['Experiência guiada, com contexto local.','Uma visita com mediação para quem quer entender melhor a história, o entorno e os detalhes do lugar.',['Duração sugerida: 2h','Reserva: necessária','Perfil: pequenos grupos']],
    grupo: ['Formato ajustado para grupos.','Organização prévia de chegada, permanência e sequência para reduzir espera e manter a experiência confortável.',['Duração sugerida: 2h30','Reserva: obrigatória','Perfil: 6 a 20 pessoas']],
    acessivel: ['Planeje a visita com antecedência.','Informações de acesso podem ser confirmadas antes da saída para adaptar trajeto e permanência.',['Contato prévio: recomendado','Apoio: sob consulta','Perfil: conforme necessidade']]
  };
  document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b === button)));
    const data = panels[button.dataset.tab]; const panel = document.querySelector('[data-tab-panel]'); if (!panel || !data) return;
    panel.querySelector('h3').textContent = data[0]; panel.querySelector('p').textContent = data[1]; panel.querySelector('ul').innerHTML = data[2].map(item => `<li>${item}</li>`).join('');
  }));

  document.querySelector('[data-booking-form]')?.addEventListener('submit', event => { event.preventDefault(); notify('Disponibilidade simulada. Integração real será adicionada depois.'); });
  document.querySelector('[data-cta-form]')?.addEventListener('submit', event => { event.preventDefault(); notify('Roteiro demonstrativo iniciado a partir deste ponto.'); });
})();
