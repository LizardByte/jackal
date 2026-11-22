(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const storageKey = 'jackal-color-mode';
  const modeOrder = ['system', 'light', 'dark'];
  const modes = new Set(modeOrder);
  const modeLabels = { system: 'System', light: 'Light', dark: 'Dark' };
  const configured = document.currentScript?.dataset.defaultTheme;
  let mode = modes.has(configured) ? configured : 'system';

  try {
    const saved = localStorage.getItem(storageKey);
    if (modes.has(saved)) mode = saved;
  } catch {
    // The controls also work in this page when storage is unavailable.
  }

  function applyTheme() {
    const dark = mode === 'dark' || (mode === 'system' && system.matches);
    root.dataset.theme = dark ? 'dark' : 'light';
    for (const image of document.querySelectorAll('source[data-jackal-dark-image]')) {
      image.media = dark ? 'all' : 'not all';
    }
  }

  function nextMode() {
    return modeOrder[(modeOrder.indexOf(mode) + 1) % modeOrder.length];
  }

  function updateControls() {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      const label = `Color theme: ${modeLabels[mode]}. Switch to ${modeLabels[nextMode()]}.`;
      toggle.dataset.mode = mode;
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
    }
    for (const choice of document.querySelectorAll('[data-theme-mode]')) {
      choice.setAttribute('aria-pressed', String(choice.dataset.themeMode === mode));
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
    updateControls();
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
      toggle.addEventListener('click', () => saveMode(nextMode()));
      toggle.hidden = false;
    }
    const picker = document.querySelector('.theme-picker');
    if (picker) {
      for (const choice of picker.querySelectorAll('[data-theme-mode]')) {
        choice.addEventListener('click', () => saveMode(choice.dataset.themeMode));
      }
      picker.hidden = false;
    }
    applyTheme();
    updateControls();
    system.addEventListener('change', applyTheme);
    setupMenu();
  });
})();
