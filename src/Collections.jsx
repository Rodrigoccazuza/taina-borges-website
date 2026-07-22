/* global React, Eyebrow, Reveal, Icon */
const { useState, useEffect, useRef } = React;

// "Collections" — a curated set of recent shoots, presented in the reference's style:
// big rounded photo cards with the title bottom-left, a chevron at the right edge.
function Collections({ onOpenPhoto }) {
  const items = window.TB_COLLECTIONS || [];
  const [idx, setIdx] = useState(0);
  const visible = items.slice(idx, idx + 4);

  const next = () => setIdx((i) => Math.min(items.length - 4, i + 1));
  const prev = () => setIdx((i) => Math.max(0, i - 1));

  return (
    <section data-screen-label="04b Collections" id="collections" style={{
      background: 'var(--limestone)', padding: '120px 32px',
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <Reveal><Eyebrow>collections · selected sets</Eyebrow></Reveal>
        <Reveal delay={80}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginTop: 14, marginBottom: 48 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(48px, 6vw, 100px)', lineHeight: 0.92, letterSpacing: '-0.045em',
              margin: 0, color: 'var(--asphalt)', maxInlineSize: '14ch', textWrap: 'balance',
            }}>
              recent shoots<span style={{ color: 'var(--taxi)' }}>.</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <a href="Projects.html" style={{
                fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--brick)', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 6, borderBottom: '1px solid currentColor', paddingBottom: 2,
              }}>view all projects <Icon name="arrow-up-right" size={14} /></a>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
                {String(idx + 1).padStart(2, '0')} to {String(Math.min(items.length, idx + 4)).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </span>
              <NavBtn icon="chevron-left" onClick={prev} disabled={idx === 0} />
              <NavBtn icon="chevron-right" onClick={next} disabled={idx >= items.length - 4} />
            </div>
          </div>
        </Reveal>

        <div className="tb-collections-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18,
        }}>
          {visible.map((c, i) => (
            <CollectionCard key={c.id + idx} collection={c} delay={i * 60} onOpenPhoto={onOpenPhoto} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .tb-collections-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function CollectionCard({ collection, delay, onOpenPhoto }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={delay}>
      <a
        className="tb-collection-card"
        href={`Projects.html#${collection.id}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'relative', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer',
          textAlign: 'left', overflow: 'hidden', borderRadius: 16, width: '100%', display: 'block',
          aspectRatio: '16 / 11', textDecoration: 'none',
          boxShadow: hover
            ? '0 18px 40px -12px rgba(22,21,19,0.35)'
            : '0 6px 18px -10px rgba(22,21,19,0.22)',
          transition: 'box-shadow 320ms var(--ease-out)',
        }}
      >
        <div className="tb-collection-image" style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${collection.src})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transform: hover ? 'scale(1.05)' : 'scale(1.0)',
          transition: 'transform 900ms var(--ease-out)',
          filter: 'saturate(0.97)',
        }}/>
        {/* Bottom protection gradient for the title */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(22,21,19,0) 35%, rgba(22,21,19,0.55) 80%, rgba(22,21,19,0.8) 100%)',
          pointerEvents: 'none',
        }}/>
        {/* Title — big, bottom-left like the reference */}
        <div style={{
          position: 'absolute', left: 26, right: 26, bottom: 22,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18,
        }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(28px, 3vw, 44px)', lineHeight: 1.05, letterSpacing: '-0.035em',
              color: '#F4EFE5', margin: 0,
              textShadow: '0 2px 14px rgba(0,0,0,0.45)',
            }}>
              {collection.title} <span style={{ color: 'var(--taxi)' }}>·</span> {collection.year}
            </h3>
            <div style={{
              marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 10,
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'rgba(244,239,229,0.8)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--taxi)' }}/>
              {collection.location} · {collection.frames} frames
            </div>
          </div>
          <span style={{
            width: 40, height: 40, borderRadius: 999,
            background: hover ? 'var(--taxi)' : 'rgba(22,21,19,0.55)',
            border: '1px solid rgba(232,226,212,0.25)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            color: hover ? 'var(--asphalt)' : 'var(--limestone)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 200ms var(--ease-out), color 200ms var(--ease-out)',
            flexShrink: 0,
          }}>
            <Icon name="arrow-up-right" size={16}/>
          </span>
        </div>
      </a>
    </Reveal>
  );
}

function NavBtn({ icon, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 40, height: 40, borderRadius: 999,
        border: '1px solid var(--line-strong)',
        background: disabled ? 'transparent' : 'var(--paper)',
        color: disabled ? 'var(--fg-4)' : 'var(--asphalt)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 180ms var(--ease-out)',
      }}
    >
      <Icon name={icon} size={15} />
    </button>
  );
}

window.Collections = Collections;
