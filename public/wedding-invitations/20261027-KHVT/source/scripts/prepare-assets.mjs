import sharp from 'sharp';
import { mkdir, readdir, copyFile, stat } from 'node:fs/promises';
import path from 'node:path';

const source = process.argv[2];
const audio = process.argv[3];
if (!source || !audio) throw new Error('Usage: node scripts/prepare-assets.mjs <photo-folder> <audio-file>');
await mkdir('public/images', { recursive: true });
await mkdir('public/audio', { recursive: true });
const files = (await readdir(source)).filter((name) => /^0V7A.*\.jpg$/i.test(name));
let before = 0;
let after = 0;
for (const file of files) {
  const original = path.join(source, file);
  const id = path.parse(file).name.replace('(1)', '-1');
  before += (await stat(original)).size;
  for (const width of [800, 1200]) {
    const target = `public/images/${id}-${width}.webp`;
    await sharp(original).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: width === 800 ? 80 : 86, effort: 5 }).toFile(target);
    after += (await stat(target)).size;
  }
}
await copyFile(audio, 'public/audio/mot-doi.m4a');
console.log(`${files.length} photos: ${(before / 1048576).toFixed(1)} MB originals → ${(after / 1048576).toFixed(1)} MB for both responsive sizes. Audio copied.`);
