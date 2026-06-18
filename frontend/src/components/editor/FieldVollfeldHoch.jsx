// Einfache, maßstabsgetreue Fußballfeld-Vorlage als SVG (Vollfeld, Hochformat).
// Echte Spielfeldmaße (105 x 68 m) sind allgemein bekannte Normgrößen und nicht
// urheberrechtlich geschützt — daher hier komplett selbst nachgezeichnet.
//
// Diese Komponente liefert reine Linien auf transparentem Hintergrund; das
// "Rasenmuster" wird separat per CSS/Gradient hinterlegt, damit der SVG-Code
// schlank bleibt.

export default function FieldVollfeldHoch({ width = 680, height = 1050 }) {
  // Skalierung: 1050px Höhe entspricht ~105m Spielfeldlänge
  const scale = height / 105;
  const w = (m) => m * (width / 68);
  const h = (m) => m * scale;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <rect x="0" y="0" width={width} height={height} fill="#3f9142" />
      {/* Rasenstreifen */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect
          key={i}
          x="0"
          y={(height / 12) * i}
          width={width}
          height={height / 12}
          fill={i % 2 === 0 ? '#458a47' : '#3f9142'}
        />
      ))}

      <g stroke="#fff" strokeWidth="2" fill="none">
        {/* Außenlinie */}
        <rect x={w(1)} y={h(1)} width={w(66)} height={h(103)} />
        {/* Mittellinie */}
        <line x1={w(1)} y1={height / 2} x2={w(67)} y2={height / 2} />
        {/* Mittelkreis */}
        <circle cx={width / 2} cy={height / 2} r={h(9.15)} />
        <circle cx={width / 2} cy={height / 2} r="2" fill="#fff" />

        {/* Strafraum oben */}
        <rect x={w(14.84)} y={h(1)} width={w(38.32)} height={h(16.5)} />
        {/* Torraum oben */}
        <rect x={w(25.84)} y={h(1)} width={w(16.32)} height={h(5.5)} />
        {/* Strafraumbogen oben */}
        <path d={`M ${w(24.84)} ${h(17.5)} A ${h(9.15)} ${h(9.15)} 0 0 0 ${w(43.16)} ${h(17.5)}`} />
        <circle cx={width / 2} cy={h(12)} r="2" fill="#fff" />
        {/* Tor oben */}
        <rect x={w(30.34)} y={h(-0.6)} width={w(7.32)} height={h(1.6)} fill="#fff" opacity="0.9" />

        {/* Strafraum unten */}
        <rect x={w(14.84)} y={h(87.5)} width={w(38.32)} height={h(16.5)} />
        {/* Torraum unten */}
        <rect x={w(25.84)} y={h(98.5)} width={w(16.32)} height={h(5.5)} />
        {/* Strafraumbogen unten */}
        <path d={`M ${w(24.84)} ${h(87.5)} A ${h(9.15)} ${h(9.15)} 0 0 1 ${w(43.16)} ${h(87.5)}`} />
        <circle cx={width / 2} cy={h(93)} r="2" fill="#fff" />
        {/* Tor unten */}
        <rect x={w(30.34)} y={h(104)} width={w(7.32)} height={h(1.6)} fill="#fff" opacity="0.9" />

        {/* Eckkreise */}
        <path d={`M ${w(1)} ${h(2)} A 2 2 0 0 1 ${w(3)} ${h(1)}`} />
        <path d={`M ${w(65)} ${h(1)} A 2 2 0 0 1 ${w(67)} ${h(2)}`} />
        <path d={`M ${w(1)} ${h(102)} A 2 2 0 0 0 ${w(3)} ${h(103)}`} />
        <path d={`M ${w(65)} ${h(103)} A 2 2 0 0 0 ${w(67)} ${h(102)}`} />
      </g>
    </svg>
  );
}
