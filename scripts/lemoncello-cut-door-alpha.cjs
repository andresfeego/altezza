// Rebuild the actual alpha aperture without repainting or resizing the watercolor.
// Run from the frontend project with: node scripts/lemoncello-cut-door-alpha.cjs
const path = require('node:path');
let sharp;
try { sharp = require('sharp'); }
catch { sharp = require('../../backend-altezza/node_modules/sharp'); }

const directory = path.resolve(__dirname, '../components/invitaciones-publicas/templates/wedding-lemoncello/assets/images');

async function main() {
  const { data, info } = await sharp(path.join(directory, 'landscape-proportioned.png'))
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.width !== 2172 || info.height !== 724) throw new Error('Review doorway coordinates for the new source dimensions.');

  // A bounded connected color selection keeps the masonry and green/yellow leaves.
  // Bounds follow the existing painted opening, including its irregular watercolor edge.
  const bounds = { left: 1451, right: 1633, top: 134, bottom: 494 };
  const selected = new Uint8Array(info.width * info.height);
  const pending = [[1542, 320]];
  let removed = 0;
  while (pending.length) {
    const [x, y] = pending.pop();
    if (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) continue;
    const pixel = y * info.width + x;
    if (selected[pixel]) continue;
    selected[pixel] = 1;
    const offset = pixel * 4;
    const [r, g, b] = data.subarray(offset, offset + 3);
    if (!(b > r * 1.12 + 3 && b > g * .98 + 1)) continue;
    data[offset + 3] = 0;
    removed++;
    pending.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
  }
  if (removed < 50000 || removed > 65000) throw new Error(`Unexpected aperture area: ${removed}. Inspect the source before using this mask.`);
  const output = sharp(data, { raw: info });
  await output.clone().png().toFile(path.join(directory, 'landscape-open-alpha.png'));
  await output.clone().webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(directory, 'landscape-open-alpha.webp'));
  console.log(`Created PNG and WebP with ${removed} fully transparent doorway pixels; original RGB and dimensions preserved.`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
