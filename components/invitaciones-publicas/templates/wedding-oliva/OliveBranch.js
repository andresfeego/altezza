// Template-owned botanical artwork. Geometry stays independent from event data.
export default function OliveBranch({ className = '' }) {
  return (
    <svg className={className} viewBox="-20 -40 220 410" fill="none" aria-hidden="true">
      <path d="M42 348C83 270 111 156 128 22M65 299C58 266 41 247 23 227M86 237C121 215 143 187 153 158M105 167C88 137 73 117 54 100M117 104C143 86 159 63 166 43" stroke="currentColor" strokeWidth="1.4" />
      {[
        [63, 293, -38], [75, 266, 31], [87, 235, -32], [96, 203, 35],
        [105, 166, -30], [112, 135, 28], [119, 104, -25], [125, 66, 22],
        [129, 28, 10], [43, 259, -40], [25, 230, -32], [125, 205, 40],
        [144, 175, 30], [79, 133, -40], [56, 103, -33], [149, 74, 40], [164, 46, 25],
      ].map(([x, y, angle], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${angle})`}>
          <path d="M0 0C-16-12-16-40-3-55C10-38 11-15 0 0Z" fill="currentColor" opacity={i % 3 === 0 ? '.22' : '.12'} />
          <path d="M0 0C-16-12-16-40-3-55C10-38 11-15 0 0ZM0-3L-3-48" stroke="currentColor" strokeWidth=".7" opacity=".6" />
        </g>
      ))}
      <ellipse cx="94" cy="188" rx="4" ry="7" fill="currentColor" opacity=".65" />
      <ellipse cx="135" cy="192" rx="4" ry="7" fill="currentColor" opacity=".65" />
      <ellipse cx="115" cy="79" rx="4" ry="7" fill="currentColor" opacity=".65" />
    </svg>
  );
}
