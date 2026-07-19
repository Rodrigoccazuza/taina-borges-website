/* global React, Icon, Eyebrow, Reveal, Grain */
const { useState, useEffect, useRef } = React;

function Testimonials() {
  const items = window.TB_PHOTOS.testimonials;
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);

  // Auto-advance every 6s, pause on hover
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  const item = items[idx];

  return (
    <section
      ref={ref}
      data-screen-label="05 Testimonials" id="testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        background: 'transparent', color: 'var(--limestone)',
        padding: '140px 32px',
        overflow: 'hidden'
      }}>
      {/* Soft dark wash so the quote stays legible over the brick reveal */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(60% 80% at 50% 50%, rgba(11,10,9,0.55) 0%, rgba(11,10,9,0.0) 80%)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 56, gap: 24, flexWrap: 'wrap' }}>
            <Eyebrow dark>kind words</Eyebrow>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <NavBtn onClick={() => setIdx((idx - 1 + items.length) % items.length)} icon="chevron-left" />
              <NavBtn onClick={() => setIdx((idx + 1) % items.length)} icon="chevron-right" />
            </div>
          </div>
        </Reveal>

        {/* Two-column quote + photo */}
        <div className="tb-testimonial-row" style={{
          display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 64, alignItems: 'center',
        }}>
          <div>
            <blockquote key={'q-' + idx} style={{
              margin: 0,
              fontFamily: 'var(--font-sans)', fontWeight: 300, fontStyle: 'italic',
              fontSize: 'clamp(28px, 3.6vw, 52px)', lineHeight: 1.18, letterSpacing: '-0.018em',
              color: 'var(--limestone)', textWrap: 'balance', maxInlineSize: '22ch',
              animation: 'tbQuoteIn 800ms var(--ease-cinematic)'
            }}>
              <span style={{ color: 'var(--taxi)', marginRight: 4 }}>“</span>{item.quote}<span style={{ color: 'var(--taxi)' }}>”</span>
            </blockquote>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 16, marginTop: 40,
              paddingTop: 28, borderTop: '1px solid rgba(232,226,212,0.14)', flexWrap: 'wrap'
            }}>
              <div style={{ width: 6, height: 6, background: 'var(--taxi)', borderRadius: 999 }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 16, color: 'var(--limestone)' }}>{item.name}</span>
              <span style={{ width: 14, height: 1, background: 'rgba(232,226,212,0.32)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8C857A' }}>{item.meta}</span>
            </div>

            {/* Dots */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 32 }}>
              {items.map((_, i) => {
                const active = i === idx;
                return (
                  <button key={i} onClick={() => setIdx(i)} aria-label={`testimonial ${i + 1}`} style={{
                    width: active ? 28 : 6, height: 6, padding: 0, borderRadius: 999, border: 'none',
                    background: active ? 'var(--taxi)' : 'rgba(232,226,212,0.32)',
                    cursor: 'pointer',
                    transition: 'width 480ms var(--ease-cinematic), background 240ms var(--ease-out)',
                  }} />
                );
              })}
              <span style={{ marginLeft: 14, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8C857A', letterSpacing: '0.18em' }}>0{idx + 1} / 0{items.length}</span>
            </div>
          </div>

          {/* Portrait paired with the current testimonial */}
          <div key={'img-' + idx} style={{
            position: 'relative', aspectRatio: '4 / 5',
            overflow: 'hidden', background: 'var(--asphalt)',
            border: '1px solid rgba(232,226,212,0.12)',
            animation: 'tbTestPhotoIn 900ms var(--ease-cinematic)'
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${item.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
              transform: 'scale(1.02)',
              animation: 'tbTestPhotoZoom 7000ms linear',
            }}/>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(22,21,19,0) 50%, rgba(22,21,19,0.65) 100%)',
            }}/>
            {/* Frame badge */}
            <div style={{
              position: 'absolute', top: 14, left: 14,
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'rgba(244,239,229,0.85)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 10px', background: 'rgba(22,21,19,0.4)',
              border: '1px solid rgba(232,226,212,0.18)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            }}>
              <span style={{ width: 4, height: 4, background: 'var(--taxi)', borderRadius: 999 }}/>
              frame {String(idx + 12).padStart(3, '0')}
            </div>
            {/* Caption strip */}
            <div style={{
              position: 'absolute', left: 14, right: 14, bottom: 14,
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'rgba(244,239,229,0.85)',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>{item.meta.split(' · ')[0]}</span>
              <span>kodak portra · 35mm</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tbQuoteIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes tbTestPhotoIn { from { opacity: 0; transform: translateY(20px) scale(1.04) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes tbTestPhotoZoom { from { transform: scale(1.02) } to { transform: scale(1.08) } }

        @media (max-width: 880px) {
          .tb-testimonial-row { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}

function NavBtn({ onClick, icon }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: 44, height: 44, borderRadius: 999,
        border: '1px solid ' + (hover ? 'var(--taxi)' : 'rgba(232,226,212,0.32)'),
        background: hover ? 'var(--taxi)' : 'transparent',
        color: hover ? 'var(--asphalt)' : 'var(--limestone)',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 180ms var(--ease-out)'
      }}>
      <Icon name={icon} size={16} />
    </button>
  );
}

window.Testimonials = Testimonials;
