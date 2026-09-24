// World coordinates: the same stars stay registered through both camera journeys.
const scatter = n => {
  let value = Math.imul(n ^ 0x45d9f3b, 0x45d9f3b);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
};
const stars = Array.from({ length: 90 }, (_, i) => ({
  x: 980 + scatter(i * 4 + 1) * 870,
  y: 12 + scatter(i * 4 + 2) * 380,
  radius: .5 + scatter(i * 4 + 3) * .65,
  opacity: .35 + scatter(i * 4 + 4) * .4,
})).filter(star => Math.hypot(star.x - 1440, star.y - 60) > 45);

export default function NightStars() {
  return <svg viewBox="0 0 1897 829" width="1897" height="829" aria-hidden="true" data-night-stars
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fill: 'var(--lemoncello-paper)' }}>
    {stars.map((star, i) => <circle key={i} cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} />)}
  </svg>;
}
