/* global React, Tag, Icon, Eyebrow, Reveal */
const { useState, useMemo, useEffect, useRef } = React;

// Distribute photos across N columns, deterministically.
function distribute(items, cols) {
  const out = Array.from({ length: cols }, () => []);
  items.forEach((it, i) => out[i % cols].push(it));
  return out;
}

function Gallery({ onOpenPhoto }) {
  const sectionRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const [inView, setInView] = useState(false);
  const all = window.TB_PHOTOS.gallery;
  const filtered = filter === 'all' ? all : all.filter((p) => p.genre === filter);

  // 4 vertical columns of marquee photos. We duplicate the list inside each
  // column so the loop is seamless. Columns alternate scroll direction.
  const columns = useMemo(() => distribute(filtered, 4), [filtered]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '180px 0px' });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} data-screen-label="03 Work" id="work" style={{ background: 'var(--limestone)', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow>selected work · 2024 — 2026</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginTop: 14, marginBottom: 56 }}>
            <h2 style={{
              fontFamily: 'var(--font-sans)', fontWeight: 300,
              fontSize: 'clamp(40px, 5.4vw, 76px)', lineHeight: 1.02, letterSpacing: '-0.025em',
              margin: 0, color: 'var(--asphalt)', maxInlineSize: '20ch', textWrap: 'balance'
            }}>
              twenty-four months,<br />mostly walking.
            </h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'all' },
                { id: 'portraits', label: 'portraits' },
                { id: 'lifestyle', label: 'lifestyle' },
                { id: 'behind-the-scenes', label: 'behind the scenes' }
              ].map((f) =>
                <Tag key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</Tag>
              )}
            </div>
          </div>
        </Reveal>

        {/* 4-column vertical marquee grid */}
        <div
          className="tb-gallery-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 18,
            height: '78vh',
            minHeight: 620,
            overflow: 'hidden',
            position: 'relative',
            maskImage: 'linear-gradient(to bottom, transparent 0, #000 8%, #000 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 8%, #000 92%, transparent 100%)',
          }}
        >
          {columns.map((colItems, ci) => (
            <MarqueeColumn
              key={ci + '-' + filter}
              items={colItems}
              direction={ci % 2 === 0 ? 'up' : 'down'}
              speed={42 + (ci * 6)}
              onOpenPhoto={onOpenPhoto}
              startOffset={ci}
              active={inView}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tbMarqueeUp   { from { transform: translateY(0) } to { transform: translateY(-50%) } }
        @keyframes tbMarqueeDown { from { transform: translateY(-50%) } to { transform: translateY(0) } }

        .tb-gallery-col:hover .tb-gallery-track { animation-play-state: paused; }
        .tb-gallery-tile img { transform: scale(1); filter: saturate(0.96); transition: transform 700ms var(--ease-out), filter 300ms var(--ease-out); }
        .tb-gallery-tile .tb-gallery-caption { opacity: 0; transition: opacity 240ms var(--ease-out); }
        .tb-gallery-tile:hover img, .tb-gallery-tile:focus-visible img { transform: scale(1.045); filter: none; }
        .tb-gallery-tile:hover .tb-gallery-caption, .tb-gallery-tile:focus-visible .tb-gallery-caption { opacity: 1; }

        @media (prefers-reduced-motion: reduce) {
          .tb-gallery-track { animation: none !important; transform: none !important; }
          .tb-gallery-tile img { transition: none; }
        }

        @media (max-width: 880px) {
          .tb-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; height: 92vh !important; }
        }
      `}</style>
    </section>
  );
}

function MarqueeColumn({ items, direction, speed, onOpenPhoto, startOffset, active }) {
  // Duplicate the list once so the loop is seamless when translating by -50%.
  const doubled = [...items, ...items];
  const animName = direction === 'up' ? 'tbMarqueeUp' : 'tbMarqueeDown';

  return (
    <div className="tb-gallery-col" style={{
      position: 'relative', overflow: 'hidden', height: '100%',
    }}>
      <div
        className="tb-gallery-track"
        style={{
          display: 'flex', flexDirection: 'column', gap: 18,
          animation: `${animName} ${speed}s linear infinite`,
          animationDelay: `${-startOffset * 4}s`,
          animationPlayState: active ? 'running' : 'paused',
          willChange: 'transform',
        }}
      >
        {doubled.map((p, i) => (
          <GalleryTile
            key={`${p.id}-${i}`}
            photo={p}
            index={i}
            onOpenPhoto={onOpenPhoto}
          />
        ))}
      </div>
    </div>
  );
}

function GalleryTile({ photo, index, onOpenPhoto }) {
  // Varied aspect ratios so the column has a natural rhythm
  const ratios = ['4 / 5', '3 / 4', '1 / 1', '4 / 5', '3 / 4'];
  const ratio = photo.ratio || ratios[index % ratios.length];

  return (
    <button
      className="tb-gallery-tile"
      onClick={() => onOpenPhoto?.(photo)}
      aria-label={`Open ${photo.title}`}
      style={{
        padding: 0, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
        flex: '0 0 auto',
      }}
    >
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'var(--bg-inset)',
        aspectRatio: ratio,
        borderRadius: 4,
      }}>
        <img
          src={photo.src}
          alt={photo.title}
          loading="lazy"
          decoding="async"
          width="1200"
          height="1500"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="tb-gallery-caption" style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%',
          background: 'linear-gradient(180deg, rgba(22,21,19,0) 0%, rgba(22,21,19,0.7) 100%)',
        }} />
        <div className="tb-gallery-caption" style={{
          position: 'absolute', left: 12, right: 12, bottom: 10, color: 'var(--limestone)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12,
        }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.2 }}>{photo.title}</span>
          <Icon name="arrow-up-right" size={14} />
        </div>
      </div>
    </button>
  );
}

window.Gallery = Gallery;
