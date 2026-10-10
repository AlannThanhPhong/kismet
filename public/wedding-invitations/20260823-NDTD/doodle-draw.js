(() => {
  'use strict';
  const assetBase = new URL('doodles/', document.currentScript.src);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const pending = new Set();
  const cache = new Map();
  let sequence = 0;

  // Real SVG strokes let each drawing reveal along its original pencil lines.
  document.querySelectorAll('.chapter-heading').forEach(heading => {
    const chapter = heading.closest('.album-chapter');
    const garden = chapter.classList.contains('chapter-garden');
    const days = chapter.classList.contains('chapter-days');
    ['first', 'last'].forEach((position, index) => {
      const motif = document.createElement('span');
      motif.className = `chapter-doodle chapter-doodle-${position}`;
      motif.dataset.doodle = index === 0
        ? (garden ? 'sprig' : days ? 'sun' : 'flower')
        : (garden ? 'lovebirds' : days ? 'butterfly' : 'bow');
      if ((index === 0 && (garden || days)) || (index === 1 && !garden && !days))
        motif.dataset.color = '#FCE205';
      motif.setAttribute('aria-hidden', 'true');
      heading.append(motif);
    });
    const extra = document.createElement('span');
    extra.className = 'chapter-doodle chapter-doodle-extra';
    extra.dataset.doodle = garden ? 'cat-outline' : days ? 'happy-pair' : 'cat-bold';
    extra.setAttribute('aria-hidden', 'true');
    heading.append(extra);
    heading.classList.add('has-inline-doodles');
  });

  function reveal(element) {
    if (!pending.has(element)) return;
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height || rect.bottom <= 0 || rect.top >= innerHeight ||
        getComputedStyle(element).visibility === 'hidden') return;
    pending.delete(element);
    observer.unobserve(element);
    const shapes = [...element.querySelectorAll('path, ellipse, circle, line, polyline, polygon, rect')];
    shapes.forEach((shape, index) => {
      const delay = index * 160;
      if (reducedMotion.matches) {
        shape.style.strokeDashoffset = '0';
        shape.style.fillOpacity = '';
        return;
      }
      shape.animate([
        { strokeDashoffset: shape.style.strokeDashoffset },
        { strokeDashoffset: '0' },
      ], { duration: 1600, delay, easing: 'ease-in-out', fill: 'forwards' });
      shape.animate([{ fillOpacity: 0 }, { fillOpacity: shape.dataset.fillOpacity }],
        { duration: 650, delay: delay + 1200, fill: 'forwards' });
    });
    element.querySelectorAll('text').forEach(text => {
      text.animate([{ opacity: 0 }, { opacity: 1 }],
        { duration: reducedMotion.matches ? 0 : 700, delay: reducedMotion.matches ? 0 : 2000, fill: 'forwards' });
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
  }, { threshold: .2 });
  // The invitation starts hidden; check again when the opening ceremony reveals it.
  new MutationObserver(() => pending.forEach(reveal))
    .observe(document.body, { attributes: true, attributeFilter: ['class'] });

  document.querySelectorAll('.doodle, [data-doodle]').forEach(async element => {
    const name = element.dataset.doodle || [...element.classList]
      .find(value => value.startsWith('doodle--'))?.slice(8);
    if (!name || name === 'heart-couple') return;
    try {
      if (!cache.has(name)) cache.set(name, fetch(new URL(`${name}.svg`, assetBase))
        .then(response => { if (!response.ok) throw new Error('Missing doodle'); return response.text(); }));
      const source = await cache.get(name);
      const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
      if (parsed.querySelector('parsererror')) throw new Error('Invalid doodle');
      const svg = document.importNode(parsed.documentElement, true);
      const color = element.dataset.color || (element.classList.contains('opening-doodle') ? '#5b9dce' : null);
      if (color) {
        svg.querySelectorAll('[stroke], [fill]').forEach(node => {
          ['stroke', 'fill'].forEach(attribute => {
            if (node.getAttribute(attribute) === '#315ba3') node.setAttribute(attribute, color);
          });
        });
      }
      const prefix = `doodle-${sequence++}-`;
      svg.querySelectorAll('[id]').forEach(node => {
        const oldId = node.id;
        node.id = prefix + oldId;
        svg.querySelectorAll('*').forEach(child => {
          [...child.attributes].forEach(attribute => {
            if (attribute.value.includes(`url(#${oldId})`))
              child.setAttribute(attribute.name, attribute.value.replaceAll(`url(#${oldId})`, `url(#${prefix}${oldId})`));
          });
        });
      });
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      element.append(svg);
      svg.querySelectorAll('path, ellipse, circle, line, polyline, polygon, rect').forEach(shape => {
        const length = shape.getTotalLength();
        shape.style.strokeDasharray = `${length} ${length}`;
        shape.style.strokeDashoffset = String(length);
        shape.dataset.fillOpacity = getComputedStyle(shape).fillOpacity;
        shape.style.fillOpacity = '0';
      });
      svg.querySelectorAll('text').forEach(text => { text.style.opacity = '0'; });
      element.classList.add('doodle-inline');
      pending.add(element);
      observer.observe(element);
      reveal(element);
    } catch (error) {
      // Keep the existing background artwork if an asset cannot be loaded.
      element.querySelector('svg')?.remove();
      console.warn('Doodle could not be prepared:', name, error);
    }
  });
})();
