/* Shared behaviour for all templates: header state, mobile menu,
   scroll reveal, counters, light parallax and demo forms. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* Stagger: give each child of [data-stagger] a reveal delay */
  document.querySelectorAll('[data-stagger]').forEach(group => {
    [...group.children].forEach((child, i) => {
      if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', '');
      child.style.setProperty('--delay', `${(i * 0.12).toFixed(2)}s`);
    });
  });

  /* Header: shrink on scroll + mobile menu */
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');

  const setMenu = open => {
    if (!header || !toggle) return;
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  if (toggle) {
    toggle.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));
  }
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
  });

  /* Parallax (desktop, motion allowed only) */
  const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
  const updateParallax = () => {
    const desktop = window.innerWidth >= 880;
    parallaxEls.forEach(el => {
      if (reduce || !desktop || !el.parentElement) {
        el.style.transform = '';
        return;
      }
      const box = el.parentElement.getBoundingClientRect();
      const offsetFromCenter = box.top + box.height / 2 - window.innerHeight / 2;
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      el.style.transform = `translate3d(0, ${(-offsetFromCenter * speed).toFixed(1)}px, 0)`;
    });
  };

  /* One rAF-throttled scroll handler for header + parallax */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
      updateParallax();
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateParallax);
  updateParallax();

  /* Animated counters */
  const countUp = el => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const raw = el.dataset.count;
    const end = parseFloat(raw);
    const decimals = (raw.split('.')[1] || '').length;
    const fmt = v => v.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    if (reduce) {
      el.textContent = fmt(end);
      return;
    }
    const duration = 1600;
    const start = performance.now();
    const frame = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(end * eased);
      if (p < 1) requestAnimationFrame(frame);
    };
    el.textContent = fmt(0);
    requestAnimationFrame(frame);
  };

  /* Scroll reveal */
  const reveal = el => {
    el.classList.add('is-visible');
    // After the entrance finishes, drop the stagger delay so hover transitions feel instant
    el.addEventListener('transitionend', e => {
      if (e.propertyName === 'opacity') el.style.transitionDelay = '0s';
    }, { once: true });
    el.querySelectorAll('[data-count]').forEach(countUp);
    if (el.hasAttribute('data-count')) countUp(el);
  };

  document.documentElement.classList.add('js');
  const revealTargets = [...document.querySelectorAll('[data-reveal]')];
  const standaloneCounters = [...document.querySelectorAll('[data-count]')]
    .filter(el => !el.closest('[data-reveal]'));
  const targets = [...revealTargets, ...standaloneCounters];

  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(el => io.observe(el));
  } else {
    targets.forEach(reveal);
  }

  /* Demo forms: validate natively, show a friendly note, never send anything */
  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const msg = form.querySelector('.form-message');
      if (msg) {
        msg.textContent = 'Thank you!';
        msg.classList.add('is-visible');
        clearTimeout(msg._t);
        msg._t = setTimeout(() => msg.classList.remove('is-visible'), 6000);
      }
      form.reset();
    });
  });
})();
