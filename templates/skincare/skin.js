(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-navigation');
  const toast = document.querySelector('.toast');
  let toastTimer;

  const closeMenu = () => {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      navigation.classList.toggle('is-open', !isOpen);
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 640) closeMenu();
    });
  }

  const showToast = (productName) => {
    if (!toast) return;
    toast.textContent = `${productName} added to your routine.`;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2600);
  };

  document.querySelectorAll('.add-button').forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product || 'Product';
      showToast(productName);
    });
  });
})();
