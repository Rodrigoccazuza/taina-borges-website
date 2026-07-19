/* global React, Header, Hero, Marquee, Gallery, Collections, Pricing, About, Testimonials, Contact, BookingModal, WhatsAppFloating, Footer, Icon, Grain, useLanguage */
const { useState, useEffect, useRef } = React;

function App() {
  const { isPortuguese } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [active, setActive] = useState('top');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let raf = 0;
    let last = window.scrollY > 80;
    const update = () => {
      const next = window.scrollY > 80;
      if (next !== last) { last = next; setScrolled(next); }
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  // section spy
  useEffect(() => {
    const ids = ['top', 'work', 'about', 'collections', 'testimonials', 'pricing', 'contact'];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-40% 0px -50% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // Reveal each major section once as it enters the viewport.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('#root section'))
      .filter((section) => section.id !== 'top');
    sections.forEach((section) => section.classList.add('tb-scroll-section'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sections.forEach((section) => section.classList.add('tb-scroll-section-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('tb-scroll-section-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: id === 'top' ? 0 : el.offsetTop - 60, behavior: 'smooth' });
  };

  return (
    <div data-screen-label="Tainá Borges" style={{ color: 'var(--asphalt)', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      <Header scrolled={scrolled} openBooking={() => setBookingOpen(true)} scrollTo={scrollTo} active={active} />

      <Hero openBooking={() => setBookingOpen(true)} scrollTo={scrollTo} />

      {/* Subway-sign marquee — feels like passing destination boards */}
      <Marquee items={isPortuguese ? ['retratos', 'casais', 'famílias', 'viagens', 'momentos reais', 'nova york', 'histórias inesquecíveis'] : ['portraits', 'couples', 'families', 'travel', 'real moments', 'new york', 'unforgettable stories']} speed={62} />

      {/* Transparent break section — lets the site-wide brick grid take the stage */}
      <BrickReveal />

      <About />

      <Collections onOpenPhoto={(p) => setLightbox(p)} />

      <Testimonials />

      <Gallery onOpenPhoto={(p) => setLightbox(p)} />

      <Pricing openBooking={() => setBookingOpen(true)} />

      <Contact openBooking={() => setBookingOpen(true)} />

      <Footer />

      <WhatsAppFloating />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />

      {lightbox && <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />}

      <style>{`
        .tb-scroll-section {
          opacity: 0;
          transform: translateY(42px);
          filter: blur(5px);
          transition:
            opacity 850ms var(--ease-out),
            transform 950ms var(--ease-cinematic),
            filter 850ms var(--ease-out);
        }
        .tb-scroll-section.tb-scroll-section-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .tb-scroll-section {
            opacity: 1;
            transform: none;
            filter: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

// Transparent break — the global site-wide brick grid is the visual; we just lay copy over it
function BrickReveal() {
  const { isPortuguese } = useLanguage();
  const tp = 1;

  return (
    <section data-screen-label="03b Brick reveal" style={{
      position: 'relative', minHeight: '92vh', overflow: 'hidden',
      background: 'transparent',
      padding: '120px 32px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{
        maxWidth: 1440, margin: '0 auto', width: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        flex: 1, gap: 80,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'rgba(244,239,229,0.92)', gap: 24, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
            opacity: tp, transform: `translateY(${(1 - tp) * 8}px)`,
            transition: 'opacity 240ms linear, transform 240ms linear',
          }}>
            {isPortuguese ? 'tijolo & cidade · 1880 — presente' : 'brick & city · 1880 — present'}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', textAlign: 'right',
            color: 'rgba(244,239,229,0.62)',
            opacity: tp, transform: `translateY(${(1 - tp) * 8}px)`,
            transition: 'opacity 240ms linear 80ms, transform 240ms linear 80ms',
          }}>
            {isPortuguese ? <>tijolos vermelhos de nova york<br/>brooklyn · bushwick</> : <>new york red brick<br/>brooklyn · bushwick</>}
          </span>
        </div>

        <div>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(56px, 9vw, 168px)', lineHeight: 0.88, letterSpacing: '-0.045em',
            color: '#F4EFE5', margin: 0, maxInlineSize: '14ch', textWrap: 'balance',
            opacity: tp,
            transform: `translateY(${(1 - tp) * 36}px)`,
            transition: 'opacity 600ms var(--ease-out), transform 800ms var(--ease-cinematic)',
            textShadow: '0 2px 18px rgba(0,0,0,0.55)',
          }}>
            {isPortuguese ? <>a cidade<br/>guarda o<br/>momento</> : <>the city<br/>holds the<br/>moment</>}<span style={{ color: 'var(--taxi)' }}>.</span>
          </h3>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginTop: 32, gap: 32, flexWrap: 'wrap',
            opacity: Math.max(0, (tp - 0.2) * 1.4),
            transform: `translateY(${Math.max(0, (1 - tp) * 18)}px)`,
            transition: 'opacity 500ms var(--ease-out), transform 600ms var(--ease-cinematic)',
          }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 18, lineHeight: 1.5,
              color: '#F4EFE5', maxInlineSize: '42ch', margin: 0,
              textShadow: '0 1px 12px rgba(0,0,0,0.6)',
            }}>
              {isPortuguese ? 'cada canto desta cidade guarda uma história. estou aqui para ajudar você a contar a sua.' : 'every corner of this city holds a story. i’m here to help you tell yours.'}
            </p>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244,239,229,0.75)' }}>
              {isPortuguese ? 'grid · sempre presente' : 'grid · always present'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// (kept for reference) Cinematic mid-page break — full-bleed image with quote pulled across
function FullBleedBreak() {
  const ref = useRef(null);
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const center = window.innerHeight / 2;
      const dist = (r.top + r.height / 2 - center) / window.innerHeight;
      setY(dist * -120);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <section ref={ref} style={{
      position: 'relative', height: '70vh', minHeight: 480, overflow: 'hidden',
      background: 'var(--asphalt)',
    }}>
      <div style={{
        position: 'absolute', inset: '-15% 0',
        backgroundImage: `url(assets/gallery/talita-central-park-2024/018.jpg)`,
        backgroundSize: 'cover', backgroundPosition: 'center 30%',
        transform: `translateY(${y}px) scale(1.05)`,
        filter: 'contrast(1.05) saturate(0.92)',
      }}/>
      <Grain opacity={0.10} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(22,21,19,0.45) 0%, rgba(22,21,19,0.15) 40%, rgba(22,21,19,0.85) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, padding: '32px', maxWidth: 1440, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(232,226,212,0.7)' }}>
          frame 117 · west 70th · 4:48 pm
        </span>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(44px, 7vw, 120px)', lineHeight: 0.92, letterSpacing: '-0.045em',
          color: 'var(--limestone)', margin: 0, maxInlineSize: '14ch', textWrap: 'balance',
        }}>
          the city is<br/>the subject<span style={{ color: 'var(--taxi)' }}>.</span>
        </h3>
      </div>
    </section>
  );
}

// Click a photo → lightbox
function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(22,21,19,0.96)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32,
      animation: 'tbFadeIn 220ms var(--ease-out)',
    }}>
      <Grain opacity={0.06} />
      <button onClick={onClose} aria-label="close" style={{
        position: 'absolute', top: 24, right: 24, width: 44, height: 44, borderRadius: 999,
        background: 'transparent', color: 'var(--limestone)', border: '1px solid rgba(232,226,212,0.32)',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
      }}><Icon name="x" size={18}/></button>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'relative', maxWidth: '90vw', maxHeight: '86vh', display: 'flex', flexDirection: 'column', gap: 16,
        animation: 'tbModalIn 380ms var(--ease-cinematic)',
      }}>
        <img src={photo.src} alt={photo.title} style={{
          maxWidth: '90vw', maxHeight: '78vh', objectFit: 'contain', display: 'block',
          background: 'var(--asphalt)',
        }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, color: 'var(--limestone)' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 18 }}>{photo.title}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8C857A' }}>{photo.meta} · {photo.year}</span>
        </div>
      </div>
    </div>
  );
}

window.App = App;
