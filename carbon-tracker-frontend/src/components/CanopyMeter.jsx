export default function CanopyMeter({ score = 0, maxScore = 500 }) {
  const bandCount = 5;
  const progress = Math.max(0, Math.min(1, score / maxScore));
  const filledBands = Math.round(progress * bandCount);

  // top (i=0, narrowest) to bottom (i=4, widest) — a hillside cross-section
  const widths = [120, 150, 180, 210, 240];

  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox="0 0 240 190" width="200" height="158">
        {widths.map((w, i) => {
          const orderFromBottom = bandCount - 1 - i; // bottom band fills first
          const isFilled = orderFromBottom < filledBands;
          const x = (240 - w) / 2;
          const y = i * 36;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={30}
              rx={2}
              fill={isFilled ? 'var(--terrace)' : 'var(--husk)'}
              stroke={isFilled ? 'var(--terrace)' : 'var(--husk-dark)'}
              style={{ transition: 'fill 0.4s ease' }}
            />
          );
        })}
      </svg>
      <div className="display data" style={{ fontSize: 32, marginTop: 4 }}>{score}</div>
      <div style={{ fontSize: 12, color: 'var(--ink)', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        eco score
      </div>
    </div>
  );
}