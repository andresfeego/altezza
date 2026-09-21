// Preserve generated watercolor originals and pack six poses for CSS playback.
const path = require('node:path');
const sharp = require('../../backend-altezza/node_modules/sharp');
const root = path.resolve(__dirname, '../components/invitaciones-publicas/templates/wedding-lemoncello/assets/images');

async function run() {
  for (const [name, width] of [['welcome-panorama-v1', 2200], ['welcome-board-v1', 1000], ['scene-arrow-v1', 384]]) {
    await sharp(path.join(root, name + '.png')).resize({ width, withoutEnlargement: true })
      .webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(root, name + '.webp'));
  }
  const source = path.join(root, 'waiter-walk-source-v1.png');
  const { width, height } = await sharp(source).metadata();
  const frames = await Promise.all(Array.from({ length: 6 }, async (_, index) => {
    const left = Math.round(index % 3 * width / 3), top = Math.round(Math.floor(index / 3) * height / 2);
    const right = Math.round((index % 3 + 1) * width / 3), bottom = Math.round((Math.floor(index / 3) + 1) * height / 2);
    return sharp(source).extract({ left, top, width: right - left, height: bottom - top })
      .resize(384, 576, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  }));
  await sharp({ create: { width: 2304, height: 576, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(frames.map((input, index) => ({ input, left: 384 * index, top: 0 })))
    .webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(root, 'waiter-walk-v1.webp'));
  console.log('Prepared panorama, board, arrow and six-frame waiter strip.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
