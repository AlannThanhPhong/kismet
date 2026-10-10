const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve('public/balloons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generates an ultra-soft, voluminous cloud puff SVG
function makeCloudSvg(width, height, circles, seed = 1) {
  const circlesMarkup = circles
    .map(
      (c) =>
        `<circle cx="${c.x}" cy="${c.y}" r="${c.r}" fill="url(#radGrad${c.id || 1})" />`
    )
    .join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="softTurbulence" x="-40%" y="-40%" width="180%" height="180%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="5" result="noise" seed="${seed}" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="65" xChannelSelector="R" yChannelSelector="G" result="displaced" />
      <feGaussianBlur in="displaced" stdDeviation="16" result="blurred" />
      <feColorMatrix in="blurred" type="matrix" values="
        1 0 0 0 1
        0 1 0 0 1
        0 0 1 0 1
        0 0 0 18 -1.5" />
    </filter>
    <radialGradient id="radGrad1" cx="45%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.98"/>
      <stop offset="45%" stop-color="#f8fcfe" stop-opacity="0.9"/>
      <stop offset="75%" stop-color="#edf5fa" stop-opacity="0.5"/>
      <stop offset="92%" stop-color="#e2eef5" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#d4e6f1" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="radGradDense" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="85%" stop-color="#f2f7fb" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#e5eef4" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <g filter="url(#softTurbulence)">
    ${circlesMarkup}
  </g>
</svg>`;
}

async function buildAll() {
  // 1. Cloud Bank 1 (Big cumulus cloud cluster)
  const svg1 = makeCloudSvg(1400, 900, [
    { x: 700, y: 500, r: 380, id: 'Dense' },
    { x: 420, y: 440, r: 280, id: '1' },
    { x: 960, y: 450, r: 300, id: '1' },
    { x: 620, y: 320, r: 240, id: '1' },
    { x: 780, y: 330, r: 250, id: '1' },
    { x: 280, y: 520, r: 200, id: '1' },
    { x: 1100, y: 530, r: 210, id: '1' },
  ], 7);
  await sharp(Buffer.from(svg1)).png().toFile(path.join(outDir, 'cloud-bank-1.png'));
  console.log('Generated soft cloud-bank-1.png');

  // 2. Cloud Bank 2 (Elongated wind-blown cloud)
  const svg2 = makeCloudSvg(1300, 700, [
    { x: 650, y: 380, r: 300, id: 'Dense' },
    { x: 380, y: 390, r: 240, id: '1' },
    { x: 920, y: 370, r: 250, id: '1' },
    { x: 220, y: 410, r: 180, id: '1' },
    { x: 1080, y: 380, r: 170, id: '1' },
    { x: 550, y: 280, r: 180, id: '1' },
  ], 23);
  await sharp(Buffer.from(svg2)).png().toFile(path.join(outDir, 'cloud-bank-2.png'));
  console.log('Generated soft cloud-bank-2.png');

  // 3. Cloud Curtain (Heavy, dense white cover for total screen envelopment)
  const svgCurtain = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">
    <defs>
      <filter id="cCurtainFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="4" result="noise" seed="88" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="90" xChannelSelector="R" yChannelSelector="G" result="displaced" />
        <feGaussianBlur in="displaced" stdDeviation="30" />
      </filter>
      <radialGradient id="cgFull" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
        <stop offset="70%" stop-color="#ffffff" stop-opacity="1"/>
        <stop offset="90%" stop-color="#fdfefe" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#f5fafd" stop-opacity="0.3"/>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="1600" height="1200" fill="url(#cgFull)" filter="url(#cCurtainFilter)" />
  </svg>`;
  await sharp(Buffer.from(svgCurtain)).png().toFile(path.join(outDir, 'cloud-curtain.png'));
  console.log('Generated soft cloud-curtain.png');
}

buildAll().catch(console.error);
