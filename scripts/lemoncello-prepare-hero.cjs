// Deterministic alpha extraction explicitly requested for the supplied monogram.
// Generated watercolor layers retain their original pixels and alpha in the PNGs.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('../../backend-altezza/node_modules/sharp');
const root = path.resolve(__dirname, '../components/invitaciones-publicas/templates/wedding-lemoncello/assets');
const destination = path.resolve(__dirname, '../../backend-altezza/_local_storage/invitations/bodlauser/cover');

async function run() {
  fs.mkdirSync(destination, { recursive: true });
  const { data, info } = await sharp(path.join(destination, 'laura-sergio-monogram-source.jpg'))
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let pixel = 0; pixel < info.width * info.height; pixel++) {
    const i = pixel * info.channels;
    const luminance = .2126 * data[i] + .7152 * data[i + 1] + .0722 * data[i + 2];
    // Remove the near-white JPEG paper including compression noise; keep antialiasing.
    const alpha = Math.round(255 * Math.max(0, Math.min(1, (242 - luminance) / (242 - 56))));
    rgba.set([24, 52, 81, alpha], pixel * 4);
  }
  const output = path.join(destination, 'laura-sergio-monogram.png');
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(output);
  for (const name of ['hero-coast', 'hero-balcony']) {
    await sharp(path.join(root, `images/${name}.png`)).webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(root, `images/${name}.webp`));
  }
  console.log(JSON.stringify({ monogram: output, width: info.width, height: info.height, layers: ['hero-coast.webp', 'hero-balcony.webp'] }));
}
run().catch(error => { console.error(error); process.exitCode = 1; });
