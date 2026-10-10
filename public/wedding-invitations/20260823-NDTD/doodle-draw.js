(() => {
  'use strict';
  const assetBase = new URL('doodles/', document.currentScript.src);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const pending = new Set();
  const cache = new Map();
  let sequence = 0;

  function motif(name, yellow = false) {
    const element = document.createElement('span');
    element.className = 'doodle scattered-doodle';
    element.dataset.doodle = name;
    element.dataset.color = yellow ? '#FCE205' : '#5b9dce';
    element.setAttribute('aria-hidden', 'true');
    return element;
  }
  function motifRow(names) {
    const row = document.createElement('div');
    row.className = 'doodle-scatter-row';
    row.setAttribute('aria-hidden', 'true');
    names.forEach((name, index) => row.append(motif(name, index === 1)));
    return row;
  }
  const openingMotifs = [
    'flower', 'girl-portrait', 'boy-portrait', 'happy-pair', 'heart-people', 'cat-fish',
    'sun', 'daisy-pencil', 'love', 'cat-skate', 'bow', 'smile',
    'sprig', 'bouquet', 'butterfly', 'girl-flower', 'cat-bold', 'cat-outline',
    'lovebirds', 'radiant-heart', 'flower-solid', 'daisy-solid', 'heart-hug',
  ];
  const openingDecoration = document.querySelector('.opening-decoration');
  if (openingDecoration) {
    openingDecoration.replaceChildren();
    const panels = ['left', 'right'].map(side => {
      const panel = document.createElement('div');
      panel.className = `opening-motif-panel opening-motif-panel-${side}`;
      openingDecoration.append(panel);
      return panel;
    });
    const loosePositions = [
      [17, 8, 1.08, -14], [60, 5, .72, 12], [85, 23, .84, -8],
      [41, 27, 1.02, 7], [12, 40, .68, -5], [72, 43, .86, 19],
      [30, 54, .9, -10], [88, 61, .64, 10], [57, 69, .72, -19],
      [16, 78, .96, 4], [81, 88, 1.03, -9], [40, 94, .68, 16],
    ];
    const phonePositions = [
      [16, 6], [58, 8], [84, 17], [37, 20], [12, 29], [66, 29],
      [87, 39], [40, 37], [15, 45], [68, 48], [36, 54], [84, 57],
      [12, 65], [57, 64], [86, 71], [42, 74], [12, 81], [64, 81],
      [85, 90], [39, 91], [14, 96], [82, 5], [63, 97],
    ];
    openingMotifs.forEach((name, index) => {
      const element = motif(name);
      element.className = 'doodle opening-doodle opening-motif';
      const [x, y, scale, tilt] = loosePositions[index % 12];
      const [phoneX, phoneY] = phonePositions[index];
      element.style.cssText = `--motif-x:${index < 12 ? x : 100 - x}%;--motif-y:${y}%;--motif-size:${scale};--motif-tilt:${tilt}deg;--phone-x:${phoneX}%;--phone-y:${phoneY}%`;
      panels[index < 12 ? 0 : 1].append(element);
    });
    const updateCoverWidth = () => {
      document.querySelector('.opening-screen').style.setProperty('--opening-center-width',
        `${document.querySelector('.opening-layout').getBoundingClientRect().width}px`);
    };
    updateCoverWidth();
    new ResizeObserver(updateCoverWidth).observe(document.querySelector('.opening-layout'));
  }
  // Keep illustrations in the whitespace, clear of photos and interactive controls.
  const placements = [
    ['.album-heading', ['daisy-pencil', 'smile']],
    ['.paper.invitation', ['heart-people', 'flower-solid']],
    ['.chapter-days .gallery', ['cat-fish', 'daisy-solid']],
    ['.chapter-garden .gallery', ['smile', 'radiant-heart']],
    ['.chapter-studio .gallery', ['cat-skate', 'flower-solid']],
    ['.location-grid', ['daisy-solid', 'cat-fish']],
    ['#rsvp-form', ['boy-portrait', 'girl-portrait']],
    ['#open-guestbook', ['cat-skate', 'smile']],
  ];
  placements.forEach(([selector, names]) => {
    const anchor = document.querySelector(selector);
    if (!anchor) return;
    const row = motifRow(names);
    if (selector === '.album-heading' || selector === '.paper.invitation') anchor.append(row);
    else anchor.after(row);
  });
  document.querySelector('.closing .back-link')?.before(motifRow(['flower-solid', 'radiant-heart']));

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
      if (!cache.has(name)) cache.set(name, fetch(new URL(`${name}.svg?v=reference-portraits`, assetBase))
        .then(response => { if (!response.ok) throw new Error('Missing doodle'); return response.text(); }));
      const source = await cache.get(name);
      const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
      if (parsed.querySelector('parsererror')) throw new Error('Invalid doodle');
      const svg = document.importNode(parsed.documentElement, true);
      const color = element.classList.contains('opening-doodle') ? '#5b9dce' : element.dataset.color;
      if (color) {
        svg.querySelectorAll('[stroke], [fill]').forEach(node => {
          ['stroke', 'fill'].forEach(attribute => {
            const original = node.getAttribute(attribute);
            if (original === '#315ba3' ||
                (element.classList.contains('opening-doodle') && original === '#FCE205'))
              node.setAttribute(attribute, color);
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
