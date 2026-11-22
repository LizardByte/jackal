(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const storageKey = 'jackal-color-mode';
  const modes = ['system', 'light', 'dark'];
  const configured = document.currentScript?.dataset.defaultTheme;
  let mode = modes.includes(configured) ? configured : 'system';

  try {
    const saved = localStorage.getItem(storageKey);
    if (modes.includes(saved)) mode = saved;
  } catch {
    // The controls also work in this page when storage is unavailable.
  }

  function applyTheme() {
    const dark = mode === 'dark' || (mode === 'system' && system.matches);
    root.dataset.theme = dark ? 'dark' : 'light';
    const toggle = document.querySelector('.theme-toggle');
    const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
    toggle?.setAttribute('aria-label', label);
    toggle?.setAttribute('title', label);
    toggle?.querySelector('[data-jackal-theme-icon]')?.setAttribute('href', dark ? '#sun' : '#moon');
    for (const image of document.querySelectorAll('source[data-jackal-dark-image]')) {
      image.media = dark ? 'all' : 'not all';
    }
  }

  function saveMode(selection) {
    mode = selection;
    try {
      localStorage.setItem(storageKey, mode);
    } catch {
      // Retain the selection for the current page.
    }
    applyTheme();
  }

  function setupMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('navigation');
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
      setOpen(false);
      toggle.focus();
    });
  }

  applyTheme();
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => saveMode(root.dataset.theme === 'dark' ? 'light' : 'dark'));
      toggle.hidden = false;
    }
    const select = document.querySelector('.theme-select');
    if (select) {
      select.value = mode;
      select.addEventListener('change', () => saveMode(select.value));
      select.hidden = false;
    }
    applyTheme();
    system.addEventListener('change', applyTheme);
    setupMenu();
  });
})();
