(() => {
  const q = (s, p = document) => p.querySelector(s);
  const qa = (s, p = document) => [...p.querySelectorAll(s)];

  const langDropdowns = qa('[data-lang-dropdown]');
  langDropdowns.forEach((drop) => {
    const toggle = q('[data-lang-toggle]', drop);
    if (!toggle) return;
    toggle.addEventListener('click', () => drop.classList.toggle('open'));
  });

  document.addEventListener('click', (e) => {
    langDropdowns.forEach((drop) => {
      if (!drop.contains(e.target)) drop.classList.remove('open');
    });
  });

  const drawer = q('[data-mobile-drawer]');
  const mobileBackdrop = q('[data-mobile-backdrop]');
  const openMobile = q('[data-mobile-open]');
  const closeMobile = q('[data-mobile-close]');

  const closeDrawer = () => {
    drawer?.classList.remove('show');
    mobileBackdrop?.classList.remove('show');
  };

  openMobile?.addEventListener('click', () => {
    drawer?.classList.add('show');
    mobileBackdrop?.classList.add('show');
  });

  closeMobile?.addEventListener('click', closeDrawer);
  mobileBackdrop?.addEventListener('click', closeDrawer);

  qa('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = q(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeDrawer();
    });
  });

  const modal = q('[data-privacy-modal]');
  const modalBackdrop = q('[data-modal-backdrop]');
  const modalOpeners = qa('[data-open-privacy]');
  const modalClosers = qa('[data-close-privacy]');

  const openModal = () => {
    modal?.classList.add('show');
    modalBackdrop?.classList.add('show');
  };
  const closeModal = () => {
    modal?.classList.remove('show');
    modalBackdrop?.classList.remove('show');
  };

  modalOpeners.forEach((btn) => btn.addEventListener('click', openModal));
  modalClosers.forEach((btn) => btn.addEventListener('click', closeModal));
  modalBackdrop?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeDrawer();
      langDropdowns.forEach((drop) => drop.classList.remove('open'));
    }
  });

  qa('form[data-demo-form]').forEach((form) => {
    const msgEl = q('.form-msg', form);
    const text = form.dataset.demoMessage || 'Demo — submission disabled.';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (msgEl) msgEl.textContent = text;
    });
  });

  const investment = q('#investment');
  const yieldRange = q('#yield');
  const duration = q('#duration');
  const investOut = q('[data-investment-value]');
  const yieldOut = q('[data-yield-value]');
  const durationOut = q('[data-duration-value]');
  const totalOut = q('[data-total]');
  const profitOut = q('[data-profit]');
  const gainOut = q('[data-gain]');
  const progressOut = q('[data-progress]');
  const assumptionToggle = q('#assumption-toggle');

  const formatMoney = (n) =>
    new Intl.NumberFormat(document.documentElement.lang || 'en', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);

  const updateCalc = () => {
    if (!investment || !yieldRange || !duration) return;
    const principal = Number(investment.value);
    const yearly = Number(yieldRange.value) / 100;
    const years = Number(duration.value);
    const conservative = assumptionToggle?.checked ? 0.88 : 1;
    const total = principal * Math.pow(1 + yearly * conservative, years);
    const profit = total - principal;
    const gain = (profit / principal) * 100;

    if (investOut) investOut.textContent = formatMoney(principal);
    if (yieldOut) yieldOut.textContent = `${yieldRange.value}%`;
    if (durationOut) durationOut.textContent = `${duration.value}`;
    if (totalOut) totalOut.textContent = formatMoney(total);
    if (profitOut) profitOut.textContent = formatMoney(profit);
    if (gainOut) gainOut.textContent = `${gain.toFixed(1)}%`;
    if (progressOut) progressOut.style.width = `${Math.min(100, gain)}%`;
  };

  [investment, yieldRange, duration, assumptionToggle].forEach((el) => {
    el?.addEventListener('input', updateCalc);
    el?.addEventListener('change', updateCalc);
  });
  updateCalc();

  const revealEls = qa('.reveal');
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  revealEls.forEach((el) => revealObs.observe(el));

  const counters = qa('[data-count-to]');
  const countObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.countTo || 0);
        const suffix = el.dataset.suffix || '';
        const durationMs = 1200;
        const start = performance.now();

        const animate = (t) => {
          const progress = Math.min(1, (t - start) / durationMs);
          const value = Math.floor(target * progress);
          el.textContent = `${value}${suffix}`;
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        countObs.unobserve(el);
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((c) => countObs.observe(c));
})();
