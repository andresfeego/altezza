// Integrate only the edited tree region; keep the original panorama and doorway geometry.
const path = require('node:path');
let sharp;
try { sharp = require('sharp'); }
catch { sharp = require('../../backend-altezza/node_modules/sharp'); }
const root = path.resolve(__dirname, '../components/invitaciones-publicas/templates/wedding-lemoncello/assets/images');

async function run() {
  const base = await sharp(path.join(root, 'landscape-open-alpha.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const edit = await sharp(path.join(root, 'envelope-tree-close-edit-v2.png')).resize(500, 520).ensureAlpha().raw().toBuffer();
  if (base.info.width !== 2172 || base.info.height !== 724) throw new Error('Review source coordinates.');
  const { data, info } = base;
  const original = Buffer.from(data);
  // The edit target was a 500×520 crop at (1190,80). The right side of the edit
  // is not used: preserve the registered arch, facade and steps outside the tree.
  for (let y = 0; y < 510; y++) for (let x = 0; x < 310; x++) {
    const blend = Math.max(0, Math.min(1, x / 8, (310 - x) / 30, (y - 12) / 16, (510 - y) / 16));
    const to = ((y + 80) * info.width + x + 1190) * 4;
    const from = (y * 500 + x) * 4;
    for (let c = 0; c < 3; c++) data[to + c] = Math.round(data[to + c] * (1 - blend) + edit[from + c] * blend);
  }
  // Color selection alone retained green leaves inside the opening. Empty the
  // full registered arch, including vegetation, with a one-pixel antialiased edge.
  let cleared = 0;
  for (let y = 134; y <= 494; y++) for (let x = 1451; x <= 1633; x++) {
    const px = x + .5, py = y + .5;
    const distance = py < 225 ? Math.hypot(px - 1542, py - 225) - 87
      : Math.max(1455 - px, px - 1629, py - 492);
    const i = (y * info.width + x) * 4 + 3;
    const alpha = Math.min(data[i], Math.round(255 * Math.max(0, Math.min(1, distance + .5))));
    if (alpha < data[i]) cleared++;
    data[i] = alpha;
  }
  let stray = 0;
  for (let y = 230; y < 490; y++) for (let x = 1457; x < 1627; x++) {
    if (data[(y * info.width + x) * 4 + 3] !== 0) stray++;
  }
  if (stray) throw new Error('The opening must be fully transparent.');
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if ((x >= 1190 && x < 1500 && y >= 80 && y < 590) || (x >= 1451 && x <= 1633 && y >= 134 && y <= 494)) continue;
    const i = (y * info.width + x) * 4;
    for (let c = 0; c < 4; c++) if (data[i + c] !== original[i + c]) throw new Error('Unexpected change outside the tree/opening.');
  }
  const image = sharp(data, { raw: info });
  await image.clone().png().toFile(path.join(root, 'landscape-open-clear-v3.png'));
  await image.clone().webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(root, 'landscape-open-clear-v3.webp'));
  console.log(JSON.stringify({ dimensions: [info.width, info.height], newlyClearedPixels: cleared, strayInteriorPixels: stray }));
}
run().catch(error => { console.error(error); process.exitCode = 1; });
