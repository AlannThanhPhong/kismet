(() => {
  const screen = document.querySelector('.vintage-tv-screen');
  const track = document.querySelector('.vintage-tv-track');
  const dialog = document.querySelector('.tv-lightbox');
  if (!screen || !track || !dialog) return;
  const links = Array.from(track.querySelectorAll('a'));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0;
  let previousFocus;
  let screenVisible = false;
  let keyboardPaused = false;
  let pausedOffset = 0;
  let lastTime = 0;
  let offset = 0;
  const invitation = document.querySelector('.invitation');
  let photos = [];
  // Duplicate one cycle for a seamless horizontal film, keeping copies out of keyboard navigation.
  links.forEach(link => {
    const copy = link.cloneNode(true);
    copy.tabIndex = -1;
    copy.setAttribute('aria-hidden', 'true');
    track.append(copy);
  });
  function isPhoto(img) {
    return img instanceof HTMLImageElement && img.hasAttribute('src') &&
      !img.matches('[aria-hidden="true"], .vintage-tv-frame') &&
      !img.closest('[aria-hidden="true"], button');
  }
  function preparePhotos() {
    invitation.querySelectorAll('img').forEach(img => {
      if (!isPhoto(img)) return;
      img.classList.add('enlargeable-photo');
      const link = img.closest('a');
      const trigger = link || img;
      trigger.setAttribute('aria-haspopup', 'dialog');
      if (!link) {
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `Xem ảnh lớn: ${img.alt || 'Ảnh cưới'}`);
      }
    });
  }
  preparePhotos();
  // Include album photos inserted later and the portrait moved out of the opening envelope.
  new MutationObserver(preparePhotos).observe(invitation, { childList: true, subtree: true });
  function showPhoto(index) {
    selected = (index + photos.length) % photos.length;
    const source = photos[selected];
    const photo = dialog.querySelector('img');
    photo.src = source.url;
    photo.alt = source.alt;
    dialog.querySelector('.tv-lightbox-count').textContent = `${selected + 1} / ${photos.length}`;
  }
  function openPhoto(img) {
    const unique = new Map();
    invitation.querySelectorAll('img').forEach(source => {
      if (isPhoto(source)) {
        const url = source.currentSrc || source.src;
        if (!unique.has(url)) unique.set(url, { url, alt: source.alt });
      }
    });
    photos = Array.from(unique.values());
    const index = photos.findIndex(photo => photo.url === (img.currentSrc || img.src));
    if (index < 0) return;
    previousFocus = img.closest('a') || img;
    pausedOffset = offset;
    showPhoto(index);
    document.body.classList.add('tv-photo-open');
    dialog.showModal();
  }
  invitation.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    let img = event.target.closest('img');
    // Captions and lettering layered over a photo should open that photo too.
    if (!img) img = event.target.closest('.chapter-photo, .chronicles-poster, .monogram-photo, .glance-collage, .letter-photo')?.querySelector('img');
    if (!img || (!img.matches('.enlargeable-photo') && !img.closest('.vintage-tv-track'))) return;
    if (img.closest('button')) return;
    event.preventDefault();
    openPhoto(img);
  });
  invitation.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('img.enlargeable-photo')) {
      event.preventDefault();
      openPhoto(event.target);
    }
  });
  dialog.querySelector('.tv-lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.tv-lightbox-prev').addEventListener('click', () => showPhoto(selected - 1));
  dialog.querySelector('.tv-lightbox-next').addEventListener('click', () => showPhoto(selected + 1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(selected + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('tv-photo-open');
    previousFocus?.focus({ preventScroll: true });
    // Restoring focus must not rewind the film or leave playback paused.
    offset = pausedOffset;
    track.style.transform = `translateX(${-offset * 100}%)`;
    keyboardPaused = false;
    lastTime = performance.now();
  });
  screen.addEventListener('pointerdown', () => { keyboardPaused = false; });
  screen.addEventListener('focusout', event => {
    if (!screen.contains(event.relatedTarget)) keyboardPaused = false;
  });
  // Bring keyboard-selected memories into view even with motion disabled.
  links.forEach((link, index) => link.addEventListener('focus', () => {
    if (dialog.open || !link.matches(':focus-visible')) return;
    keyboardPaused = true;
    offset = index;
    track.style.transform = `translateX(${-offset * 100}%)`;
  }));
  function animate(time) {
    const elapsed = Math.min(time - lastTime, 50);
    lastTime = time;
    if (screenVisible && !document.hidden && !motion.matches && !dialog.open && !keyboardPaused) {
      offset = (offset + elapsed / 8000) % links.length;
      track.style.transform = `translateX(${-offset * 100}%)`;
    }
    requestAnimationFrame(animate);
  }
  new IntersectionObserver(entries => {
    screenVisible = entries[0].isIntersecting;
    if (screenVisible) track.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
  }).observe(screen);
  requestAnimationFrame(animate);
  const paragraph = document.querySelector('.tv-typewriter');
  const target = paragraph.querySelector('.tv-typed-text');
  const sentence = target.textContent;
  let started = false;
  let count = 0;
  let timer;
  function finishTyping() {
    clearTimeout(timer);
    target.textContent = sentence;
    paragraph.classList.remove('is-typing');
  }
  function typeNext() {
    if (motion.matches) { finishTyping(); return; }
    if (!document.hidden) {
      count++;
      target.textContent = sentence.slice(0, count);
    }
    if (count < sentence.length) timer = setTimeout(typeNext, /[.,:]/.test(sentence[count - 1]) ? 260 : 45);
    else paragraph.classList.remove('is-typing');
  }
  if (!motion.matches) target.textContent = '';
  motion.addEventListener('change', () => { if (motion.matches) finishTyping(); });
  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || started || document.body.classList.contains('is-opening-locked')) return;
    started = true;
    observer.disconnect();
    if (motion.matches) { finishTyping(); return; }
    paragraph.classList.add('is-typing');
    typeNext();
  }, { threshold: .3 });
  observer.observe(paragraph);
})();
