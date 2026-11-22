(() => {
  const measurementId = document.currentScript.dataset.measurementId;
  if (!/^G-[A-Z0-9]+$/u.test(measurementId)) return;

  window.dataLayer ??= [];
  function tag() {
    window.dataLayer.push(arguments);
  }
  tag('js', new Date());
  tag('config', measurementId);

  const script = document.createElement('script');
  const url = new URL('https://www.googletagmanager.com/gtag/js');
  url.searchParams.set('id', measurementId);
  script.src = url.href;
  script.async = true;
  document.head.append(script);
})();
