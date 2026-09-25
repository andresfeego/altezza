// The old trip spent 20% standing still. Slow each moving leg to 70% speed
// and remove that hold, so entering flows directly into leaving.
export const UMBRELLA_MS = Math.round(3200 * .8 / .7);
export const UMBRELLA_COVER_MS = UMBRELLA_MS / 2;

// Fixed art direction avoids a visible grid without reshuffling on rerenders.
// Each tuple is normalized x/y and relative canopy size.
const CANOPIES = [
  [.09, .03, 1], [.51, .08, .96], [.93, .02, 1.05],
  [.28, .24, .95], [.77, .23, 1.02], [0, .40, 1.04],
  [.52, .42, .96], [1.01, .40, 1.02], [.22, .60, 1.03],
  [.76, .58, .95], [0, .78, .98], [.48, .80, 1.04],
  [.98, .76, 1], [.24, .98, 1.02], [.81, 1.01, 1.05],
];

// The opaque inner 80% of each canopy overlaps its neighbors around the swap,
// including viewport corners, even as the canopies keep moving and rotating.
export function umbrellaLayout(width, height) {
  const baseDiameter = Math.hypot(width / 3, height / 5) * 1.8;
  return CANOPIES.map(([normalizedX, normalizedY, scale], index) => {
    const diameter = Math.ceil(baseDiameter * scale);
    const x = normalizedX * width;
    const y = normalizedY * height;
    const edge = index % 4;
    const horizontalDistance = Math.max(x, width - x) + diameter;
    const verticalDistance = Math.max(y, height - y) + diameter;
    const offset = edge === 0 ? { x: -horizontalDistance, y: 0 }
      : edge === 1 ? { x: horizontalDistance, y: 0 }
      : edge === 2 ? { x: 0, y: -verticalDistance }
      : { x: 0, y: verticalDistance };
    return { x, y, diameter, offset, angle: index * 29, direction: index % 2 ? -1 : 1 };
  });
}
