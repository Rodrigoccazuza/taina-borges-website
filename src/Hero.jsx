/* global React, Icon, Button, Eyebrow, Grain, useLanguage */
const { useState, useEffect, useRef } = React;

const HERO_SLIDES = [
  {
    src: 'assets/photos/hero-central-park.jpg',
    eyebrow: 'central park · autumn',
    meta: 'frame 042 · canon · 35mm',
    position: 'center 38%',
    mobilePosition: '58% 38%'
  },
  {
    src: 'assets/gallery/ariane-long-beach-2025/052.jpg',
    eyebrow: 'long beach · quiet tide',
    meta: 'frame 052 · long beach · ny',
    position: 'center 48%',
    mobilePosition: '60% 48%'
  },
  {
    src: 'assets/photos/hero-morningside.jpg',
    eyebrow: 'morningside · spring',
    meta: 'frame 116 · uptown · 4:18 pm',
    position: 'center 35%',
    mobilePosition: '58% 35%'
  },
  {
    src: 'assets/gallery/ariane-long-beach-2025/021.jpg',
    eyebrow: 'long beach · ocean air',
    meta: 'frame 021 · long beach · ny',
    position: 'center 48%',
    mobilePosition: '64% 48%'
  },
  {
    src: 'assets/gallery/ariane-long-beach-2025/096.jpg',
    eyebrow: 'long beach · film study',
    meta: 'frame 096 · monochrome · ny',
    position: 'center 42%',
    mobilePosition: '54% 42%'
  },
  {
    src: 'assets/gallery/naruna-2024/047.jpg',
    eyebrow: 'times square · city light',
    meta: 'frame 047 · midtown · ny',
    position: 'center 42%',
    mobilePosition: '58% 42%'
  },
  {
    src: 'assets/gallery/talita-long-beach-2025/147.jpg',
    eyebrow: 'long beach · atlantic edge',
    meta: 'frame 147 · long beach · ny',
    position: 'center 48%',
    mobilePosition: '52% 48%'
  },
  {
    src: 'assets/gallery/talita-central-park-2024/057.jpg',
    eyebrow: 'central park · spring',
    meta: 'frame 057 · uptown · ny',
    position: 'center 48%',
    mobilePosition: '58% 48%'
  }
];


function Hero({ openBooking, scrollTo }) {
  const { isPortuguese } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // Auto-advance every 5s, pause on hover.
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  // Keep only one full-screen image layer in the DOM. Preloading the next
  // frame preserves the crossfade feel without downloading and compositing
  // all eight hero photographs at startup.
  useEffect(() => {
    const next = new Image();
    next.decoding = 'async';
    next.src = HERO_SLIDES[(idx + 1) % HERO_SLIDES.length].src;
  }, [idx]);

  const current = HERO_SLIDES[idx];

  return (
    <section
      data-screen-label="01 Hero"
      id="top"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative', height: '100vh', minHeight: 720, width: '100%',
        overflow: 'hidden', background: 'var(--asphalt)'
      }}>
      
      {/* A single active layer avoids eight simultaneous full-screen textures. */}
      <div key={current.src} aria-hidden style={{
        position: 'absolute', inset: 0,
        animation: 'tbHeroCrossfade 620ms var(--ease-out)',
      }}>
        <div className="tb-hero-image" style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${current.src})`,
          backgroundSize: 'cover',
          '--hero-position': current.position,
          '--hero-mobile-position': current.mobilePosition,
        }} />
      </div>

      <Grain opacity={0.10} />

      {/* Protection gradients */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(22,21,19,0.62) 0%, rgba(22,21,19,0.05) 22%, rgba(22,21,19,0.0) 50%, rgba(22,21,19,0.55) 78%, rgba(22,21,19,0.92) 100%)' }} />

      <div style={{
        position: 'absolute', inset: 0, padding: '120px 32px 96px',
        maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
      }}>
        {/* Top eyebrow row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap',
          opacity: 1
        }}>
          <Eyebrow dark>{current.eyebrow}</Eyebrow>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(232,226,212,0.62)', textAlign: 'right' }}>
            est. 2019<br />brooklyn, ny
          </span>
        </div>

        {/* Headline block — animates only on first load, content stays fixed across slides */}
        <div data-comment-anchor="0b9f845f6d-div-113-9">
          <h1 style={{
            margin: 0,
            fontFamily: 'var(--font-display)', fontWeight: 900,

            letterSpacing: '-0.045em',
            color: 'var(--limestone)', textWrap: 'balance', maxInlineSize: '12ch',
            opacity: 1, lineHeight: 0.9,
            fontSize: 'clamp(56px, 9vw, 132px)'
          }}>
            {isPortuguese ? <>Guarde o Momento<br />em Nova<br />York</> : <>Save the Moment<br />in New<br />York</>}<span style={{ color: 'var(--taxi)' }}>.</span>
          </h1>

          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            gap: 32, marginTop: 32, flexWrap: 'wrap',
            opacity: 1
          }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 18, lineHeight: 1.45,
              color: '#E8E2D4', maxInlineSize: '40ch', margin: 0, opacity: 0.92
            }}>
              {isPortuguese ? 'pedras, concreto, o verde das árvores e o amarelo dos táxis — um registro autêntico da cidade e das pessoas que vivem cada momento nela.' : 'cobblestone, concrete, the green of trees and the yellow of cabs — an authentic record of the city and the people in it.'}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button variant="accent" size="lg" href="Projects.html" icon={<Icon name="arrow-up-right" size={16} />}>
                {isPortuguese ? 'Ver trabalhos' : 'See the work'}
              </Button>
              <Button variant="ghost" size="lg" dark onClick={openBooking} icon={<Icon name="calendar" size={16} />}>
                {isPortuguese ? 'Agendar conversa' : 'Book a call'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators — bottom-center, click to jump, softly animate */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 32, transform: 'translateX(-50%)',
        display: 'inline-flex', alignItems: 'center', gap: 14, zIndex: 4,
        opacity: 1
      }}>
        {HERO_SLIDES.map((_, i) => {
          const active = i === idx;
          return (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`slide ${i + 1}`}
              style={{
                width: active ? 32 : 8,
                height: 8,
                padding: 0,
                borderRadius: 999,
                border: 'none',
                background: active ? 'var(--taxi)' : 'rgba(244,239,229,0.40)',
                cursor: 'pointer',
                transition: 'width 520ms var(--ease-cinematic), background 320ms var(--ease-out)'
              }} />);


        })}
      </div>

      {/* Frame meta — bottom-left, swaps with the active slide */}
      <div key={`meta-${idx}`} style={{
        position: 'absolute', left: 32, bottom: 36, zIndex: 4,
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: 'rgba(244,239,229,0.55)',
        animation: 'tbHeroMetaIn 700ms var(--ease-out)'
      }}>
        {current.meta}
      </div>

      {/* Slide counter — bottom-right */}
      <div style={{
        position: 'absolute', right: 32, bottom: 36, zIndex: 4,
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: 'rgba(244,239,229,0.55)'
      }}>
        0{idx + 1} <span style={{ opacity: 0.5, margin: '0 6px' }}>/</span> 0{HERO_SLIDES.length}
      </div>

      <style>{`
        @keyframes tbHeroCrossfade { from { opacity: 0.35 } to { opacity: 1 } }
        @keyframes tbHeroMetaIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        .tb-hero-image { background-position: var(--hero-position); }
        .tb-hero-image {
          animation: tbHeroZoomOut 5200ms linear both;
          transform-origin: center center;
          will-change: transform;
        }
        @keyframes tbHeroZoomOut {
          from { transform: scale(1.09); }
          to { transform: scale(1); }
        }
        @media (max-width: 720px) {
          .tb-hero-image { background-position: var(--hero-mobile-position); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tb-hero-image { animation: none; transform: none; }
        }
      `}</style>
    </section>);

}

window.Hero = Hero;
