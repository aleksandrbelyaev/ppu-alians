// Лайтбокс и горизонтальная прокрутка галереи работ на страницах услуг.
(function () {
  const galleryButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('.work-photo[data-gallery-src]'),
  );
  const lightbox = document.querySelector<HTMLElement>('.gallery-lightbox');
  const track = document.querySelector<HTMLElement>('.work-gallery__track');

  if (!galleryButtons.length || !lightbox || !track) return;

  const image = lightbox.querySelector<HTMLImageElement>('.gallery-lightbox__img')!;
  const title = lightbox.querySelector<HTMLElement>('.gallery-lightbox__text h3')!;
  const caption = lightbox.querySelector<HTMLElement>('.gallery-lightbox__text p')!;
  const counter = lightbox.querySelector<HTMLElement>('.gallery-lightbox__counter');
  const closeButtons = lightbox.querySelectorAll<HTMLButtonElement>(
    '.gallery-lightbox__close, .gallery-lightbox__backdrop',
  );
  const prevButton = lightbox.querySelector<HTMLButtonElement>('.gallery-lightbox__nav--prev');
  const nextButton = lightbox.querySelector<HTMLButtonElement>('.gallery-lightbox__nav--next');

  let currentIndex = 0;
  let pointerDown = false;
  let dragStarted = false;
  let startX = 0;
  let startY = 0;
  let startScrollLeft = 0;
  let suppressClickUntil = 0;

  function normalizeIndex(index: number) {
    if (index < 0) return galleryButtons.length - 1;
    if (index >= galleryButtons.length) return 0;
    return index;
  }

  function showPhoto(index: number) {
    currentIndex = normalizeIndex(index);

    const button = galleryButtons[currentIndex];
    const src = button.dataset.gallerySrc || '';
    const img = button.querySelector('img');
    const titleText = button.dataset.galleryTitle || '';
    const captionText = button.dataset.galleryCaption || '';

    image.src = src;
    image.alt = img ? img.alt : titleText;
    title.textContent = titleText;
    caption.textContent = captionText;

    if (counter) {
      counter.textContent = currentIndex + 1 + ' / ' + galleryButtons.length;
    }
  }

  function openLightbox(index: number) {
    showPhoto(index);
    lightbox!.classList.add('is-open');
    lightbox!.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gallery-lock');

    const closeButton = lightbox!.querySelector<HTMLButtonElement>('.gallery-lightbox__close');
    if (closeButton) closeButton.focus({ preventScroll: true });
  }

  function closeLightbox() {
    lightbox!.classList.remove('is-open');
    lightbox!.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gallery-lock');

    window.setTimeout(function () {
      if (!lightbox!.classList.contains('is-open')) {
        image.src = '';
      }
    }, 180);
  }

  function showNext() {
    showPhoto(currentIndex + 1);
  }

  function showPrev() {
    showPhoto(currentIndex - 1);
  }

  galleryButtons.forEach(function (button, index) {
    button.addEventListener('click', function (event) {
      if (Date.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      openLightbox(index);
    });
  });

  closeButtons.forEach(function (button) {
    button.addEventListener('click', closeLightbox);
  });

  if (nextButton) nextButton.addEventListener('click', showNext);
  if (prevButton) prevButton.addEventListener('click', showPrev);

  document.addEventListener('keydown', function (event) {
    if (!lightbox!.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrev();
    }
  });

  track.addEventListener('pointerdown', function (event) {
    if (event.button !== undefined && event.button !== 0) return;
    pointerDown = true;
    dragStarted = false;
    startX = event.clientX;
    startY = event.clientY;
    startScrollLeft = track!.scrollLeft;
  });

  document.addEventListener(
    'pointermove',
    function (event) {
      if (!pointerDown) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      if (!dragStarted && Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        dragStarted = true;
        track!.classList.add('is-dragging');
      }

      if (dragStarted) {
        event.preventDefault();
        track!.scrollLeft = startScrollLeft - deltaX;
      }
    },
    { passive: false },
  );

  document.addEventListener('pointerup', function () {
    if (!pointerDown) return;
    if (dragStarted) suppressClickUntil = Date.now() + 220;
    pointerDown = false;
    dragStarted = false;
    track!.classList.remove('is-dragging');
  });

  document.addEventListener('pointercancel', function () {
    pointerDown = false;
    dragStarted = false;
    track!.classList.remove('is-dragging');
  });
})();
