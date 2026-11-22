(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setupCarousel(carousel) {
    const controls = carousel.querySelector('[data-carousel-controls]');
    if (!controls) return;

    const track = carousel.querySelector('[data-carousel-track]');
    const slides = Array.from(track.children);
    const previous = controls.querySelector('[data-carousel-prev]');
    const next = controls.querySelector('[data-carousel-next]');
    const counter = controls.querySelector('[data-carousel-position]');
    let active = 0;

    function showPosition(index) {
      active = index;
      counter.value = `${index + 1} / ${slides.length}`;
      previous.setAttribute('aria-disabled', String(index === 0));
      next.setAttribute('aria-disabled', String(index === slides.length - 1));
    }

    function reveal(index) {
      const slide = slides[index];
      if (!slide) return;

      showPosition(index);
      track.scrollTo({
        left: slide.offsetLeft - slides[0].offsetLeft,
        behavior: reducedMotion.matches ? 'instant' : 'smooth',
      });
    }

    function syncPosition() {
      const step = slides[1].offsetLeft - slides[0].offsetLeft;
      if (!step) return;

      showPosition(Math.min(slides.length - 1, Math.max(0, Math.round(track.scrollLeft / step))));
    }

    track.setAttribute('aria-label', carousel.dataset.carouselLabel);
    track.tabIndex = 0;
    carousel.dataset.enhanced = 'true';
    controls.hidden = false;
    showPosition(0);
    previous.addEventListener('click', () => reveal(active - 1));
    next.addEventListener('click', () => reveal(active + 1));
    track.addEventListener('scrollend', syncPosition);
    track.addEventListener('keydown', event => {
      const direction = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
      const keys = { ArrowLeft: active - direction, ArrowRight: active + direction, Home: 0, End: slides.length - 1 };
      if (!Object.hasOwn(keys, event.key)) return;

      event.preventDefault();
      reveal(keys[event.key]);
    });
  }

  for (const carousel of document.querySelectorAll('[data-jackal-carousel]')) {
    setupCarousel(carousel);
  }
})();
