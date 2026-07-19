/* global React, Eyebrow */
const { useState, useEffect, useRef } = React;

// Subway-sign-style scrolling marquee. Reads as a moving destination board.
function Marquee({ items, dark = false, speed = 60, accent = 'var(--taxi)' }) {
  const ref = useRef(null);
  // Triple the list so the loop never seams visibly
  const list = [...items, ...items, ...items];
  return (
    <div style={{
      width: '100%', overflow: 'hidden',
      background: dark ? 'var(--asphalt)' : 'var(--paper)',
      color: dark ? 'var(--limestone)' : 'var(--asphalt)',
      borderTop: '1px solid ' + (dark ? 'rgba(232,226,212,0.14)' : 'var(--line)'),
      borderBottom: '1px solid ' + (dark ? 'rgba(232,226,212,0.14)' : 'var(--line)'),
      padding: '20px 0', position: 'relative',
    }}>
      <div ref={ref} style={{
        display: 'inline-flex', whiteSpace: 'nowrap', gap: 56,
        animation: `tbMarquee ${speed}s linear infinite`,
        willChange: 'transform',
      }}>
        {list.map((it, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 24,
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 88px)',
            letterSpacing: '-0.04em', lineHeight: 1,
          }}>
            {it}
            <span style={{ width: 14, height: 14, background: accent, display: 'inline-block', borderRadius: 999 }} />
          </span>
        ))}
      </div>
      <style>{`@keyframes tbMarquee { 0% { transform: translateX(0) } 100% { transform: translateX(-33.333%) } }`}</style>
    </div>
  );
}

window.Marquee = Marquee;
