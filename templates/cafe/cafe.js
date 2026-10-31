/* Cafe template: footer year, mobile menu, demo form. Kept short on purpose. */
(() => {
  // 1. Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // 2. Mobile menu: Menu button opens / closes the links
  const navbar = document.querySelector('.navbar');
  const menuBtn = document.querySelector('.menu-btn');

  menuBtn.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the menu when a link is tapped (phones only, harmless on desktop)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // 3. Demo form: check the fields, show a message, then clear the form
  const form = document.querySelector('form[data-demo]');
  if (form) {
    const message = form.querySelector('.form-message');

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      message.textContent = 'Thank you! This is a demo form, so nothing was sent.';
      form.reset();
    });
  }
})();


  // 4. About cards: fade in when they scroll into view
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.card').forEach(card => observer.observe(card));
  }


    // 4. Cards and gallery photos: fade in when they scroll into view
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.card, .gallery .ph').forEach(item => observer.observe(item));
  }