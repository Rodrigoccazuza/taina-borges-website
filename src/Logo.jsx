/* global React */
// Taína Borges mark — three balls: T (yellow), B (brown), camera (dark/light).
// Small reusable React component. `size` sets the ball diameter in px.
// `variant`: "light" (on light bg = dark camera ball) | "dark" (on dark bg = light camera ball)
// `wordmark`: if true, place "TAÍNA BORGES" wordmark on the left.

function TBMark({ size = 26, variant = 'light', wordmark = false, gap = 4 }) {
  const isLight = variant === 'light';
  const ink = isLight ? '#161513' : '#F4EFE5';
  const yellow = '#DEA61F';
  const brown = '#7E4834';
  const cameraBg = isLight ? '#161513' : '#F4EFE5';
  const cameraFg = isLight ? '#F4EFE5' : '#161513';

  // Ball SVG factory (we draw text/icons inside)
  const ballStyle = (bg) => ({
    width: size, height: size, borderRadius: '50%', background: bg,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  });

  const letterSize = Math.round(size * 0.66);
  const camSize = Math.round(size * 0.5);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      {wordmark && (
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.04em',
          fontSize: Math.round(size * 0.84), color: ink, lineHeight: 1,
        }}>
          tainá borges
          <span style={{ color: yellow }}>.</span>
        </span>
      )}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: gap }}>
        <span style={ballStyle(yellow)}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: letterSize, color: '#fff', lineHeight: 1, letterSpacing: '-0.04em',
            transform: 'translateY(2%)',
          }}>T</span>
        </span>
        <span style={ballStyle(brown)}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: letterSize, color: '#fff', lineHeight: 1, letterSpacing: '-0.04em',
            transform: 'translateY(2%)',
          }}>B</span>
        </span>
        <span style={ballStyle(cameraBg)}>
          {/* tiny camera icon, inline SVG so it scales perfectly */}
          <svg width={camSize} height={camSize * 0.78} viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M21 4h-3.2l-.7-1.6A1.5 1.5 0 0 0 15.8 1.5H8.2a1.5 1.5 0 0 0-1.3.9L6.2 4H3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" fill={cameraFg}/>
            <circle cx="12" cy="11" r="3.6" fill={cameraBg} stroke={cameraFg} strokeWidth="1.2"/>
            <circle cx="18.8" cy="6.6" r="0.9" fill={cameraBg}/>
          </svg>
        </span>
      </span>
    </span>
  );
}

window.TBMark = TBMark;
