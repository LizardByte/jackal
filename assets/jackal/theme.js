(() => {
  const modes = ['system', 'light', 'dark'];
  const storageKey = 'jackal-color-mode';
  const defaultTheme = document.currentScript?.dataset.defaultTheme;
  let mode = modes.includes(defaultTheme) ? defaultTheme : 'system';

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (modes.includes(saved)) mode = saved;
  } catch {
    // The control still works for this page if storage is unavailable.
  }

  function applyMode(value) {
    document.documentElement.dataset.jackalTheme = value;
  }

  applyMode(mode);
  document.addEventListener('DOMContentLoaded', () => {
    const control = document.querySelector('[data-jackal-theme-control]');
    const selector = control?.querySelector('[data-jackal-theme]');
    if (!selector) return;

    selector.value = mode;
    control.hidden = false;
    selector.addEventListener('change', () => {
      const next = selector.value;
      if (!modes.includes(next)) return;

      applyMode(next);
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Apply the selection even when it cannot be remembered.
      }
    });
  });
})();
