// Pack the generated watercolor poses into a single, registered animation strip.
// Only translate/resize the complete frames; retain the original paint and alpha.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('../../backend-altezza/node_modules/sharp');

const assets = path.resolve(__dirname, '../components/invitaciones-publicas/templates/wedding-lemoncello/assets/images');
const registration = [[0, 0], [-4, -1], [2, 0], [1, 0], [1, -36], [-3, -36], [1, -36], [-2, -36]];

async function run() {
  // The generator's 1774x887 canvas is uniformly scaled to an integer 4x2 grid.
  const source = await sharp(path.join(assets, 'hero-bird-flight-source-v1.png')).resize(1776, 888).png().toBuffer();
  const frames = await Promise.all(registration.map(async ([dx, dy], index) => {
    const crop = await sharp(source).extract({ left: index % 4 * 444, top: Math.floor(index / 4) * 444, width: 444, height: 444 }).png().toBuffer();
    // Register the eye/head to frame 1, with enough transparent padding for all wings.
    const aligned = await sharp({ create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: crop, left: 28 - dx, top: 28 - dy }]).png().toBuffer();
    return sharp(aligned).resize(384, 384).png().toBuffer();
  }));
  const output = path.join(assets, 'hero-bird-flight-v1.webp');
  await sharp({ create: { width: 384 * frames.length, height: 384, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(frames.map((input, index) => ({ input, left: index * 384, top: 0 })))
    .webp({ quality: 88, alphaQuality: 100 }).toFile(output);
  console.log(JSON.stringify({ output, frames: frames.length, frameSize: 384, registration, bytes: fs.statSync(output).size }));
}
run().catch(error => { console.error(error); process.exitCode = 1; });
