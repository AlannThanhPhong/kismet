const DURATION = 2800;
const REST_SHAPE = 'M -120 0 L 600 0 L 600 1000 L -120 1000 Z';

export function curtainFabric(side) {
  const id = `curtain-${side}`;
  return `<svg class="curtain-fabric" viewBox="0 0 600 1000" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="${id}-folds" x1="0" x2="100" y1="0" y2="0" gradientUnits="userSpaceOnUse" spreadMethod="repeat" data-curtain-folds>
        <stop offset="0" stop-color="#4e0b1b"/>
        <stop offset=".18" stop-color="#77182b"/>
        <stop offset=".42" stop-color="#a54152"/>
        <stop offset=".56" stop-color="#ad4b59"/>
        <stop offset=".74" stop-color="#831d32"/>
        <stop offset="1" stop-color="#4e0b1b"/>
      </linearGradient>
      <radialGradient id="${id}-light" cx=".65" cy=".2" r=".85">
        <stop stop-color="#f2b7a0" stop-opacity=".12"/>
        <stop offset=".65" stop-color="#790f23" stop-opacity="0"/>
        <stop offset="1" stop-color="#290711" stop-opacity=".22"/>
      </radialGradient>
    </defs>
    <path id="${id}-cloth" data-curtain-cloth d="${REST_SHAPE}" fill="url(#${id}-folds)"/>
    <use href="#${id}-cloth" fill="url(#${id}-light)"/>
  </svg>`;
}

// Zero velocity and acceleration at both ends; no easing restarts mid-pull.
const smooth = (value) => {
  const t = Math.min(1, Math.max(0, value));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

function clothShape(progress) {
  const points = Array.from({ length: 9 }, (_, index) => {
    const y = index / 8;
    // The top carries the pull; the hem follows with a short, continuous lag.
    const lag = .14 * Math.sin(y * Math.PI / 2);
    const pull = smooth((progress - lag) / (1 - lag));
    return { x: 600 - 608 * pull, y: y * 1000 };
  });
  let path = `M -120 0 L ${points[0].x.toFixed(2)} 0`;
  for (let i = 0; i < points.length - 1; i++) {
    const before = points[Math.max(0, i - 1)];
    const from = points[i];
    const to = points[i + 1];
    const after = points[Math.min(points.length - 1, i + 2)];
    const x1 = from.x + (to.x - before.x) / 6;
    const x2 = to.x - (after.x - from.x) / 6;
    path += ` C ${x1.toFixed(2)} ${from.y + (to.y - from.y) / 3} ${x2.toFixed(2)} ${to.y - (to.y - from.y) / 3} ${to.x.toFixed(2)} ${to.y}`;
  }
  return `${path} L -120 1000 Z`;
}

export function openCurtains(cover, reducedMotion) {
  if (reducedMotion.matches) return Promise.resolve();
  const cloths = [...cover.querySelectorAll('[data-curtain-cloth]')];
  const folds = [...cover.querySelectorAll('[data-curtain-folds]')];
  if (!cloths.length) return Promise.resolve();

  return new Promise((resolve) => {
    const start = performance.now();
    let frame;
    const finish = () => {
      cancelAnimationFrame(frame);
      reducedMotion.removeEventListener('change', onMotionChange);
      resolve();
    };
    const onMotionChange = () => { if (reducedMotion.matches) finish(); };
    reducedMotion.addEventListener('change', onMotionChange);

    const draw = (now) => {
      const progress = Math.min(1, (now - start) / DURATION);
      const pull = smooth(progress);
      const path = clothShape(progress);
      // Pleats gather toward the outside; diagonal drag adds weight without rocking.
      const spacing = 1 - .84 * pull;
      const drag = .025 * Math.sin(Math.PI * pull);
      const transform = `matrix(${spacing.toFixed(4)} 0 ${drag.toFixed(4)} 1 ${(-70 * pull).toFixed(2)} 0)`;
      cloths.forEach((cloth) => cloth.setAttribute('d', path));
      folds.forEach((fold) => fold.setAttribute('gradientTransform', transform));
      if (progress < 1) frame = requestAnimationFrame(draw);
      else finish();
    };
    frame = requestAnimationFrame(draw);
  });
}
