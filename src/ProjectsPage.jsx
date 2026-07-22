/* global React, ReactDOM, Eyebrow, Reveal, Icon, Button, Grain, TBMark, BookingModal, WhatsAppFloating, Footer */
const { useState, useEffect, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Lightweight header for the Projects page (links back to home)
// ─────────────────────────────────────────────────────────────
function ProjectsHeader({ scrolled, openBooking }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const onLight = scrolled;
  const fg = onLight ? 'var(--asphalt)' : 'var(--limestone)';

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: onLight ? '12px 32px' : '16px 32px',
      background: onLight ? 'rgba(232, 226, 212, 0.82)' : 'transparent',
      borderBottom: onLight ? '1px solid var(--hairline)' : '1px solid transparent',
      transition: 'all 320ms var(--ease-out)',
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <a href="Taina Borges Website.html" style={{
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12, color: fg,
        }}>
          <img className="tb-header-logo" src="assets/brand/hero-logo.png" alt="Tainá Borges Photography" style={{ width: 188, height: 'auto', display: 'block' }} />
        </a>

        <nav className="tb-nav" style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a href="Taina Borges Website.html" style={navLinkStyle(fg)}>home</a>
          <a href="Taina Borges Website.html#about" style={navLinkStyle(fg)}>about</a>
          <a href="Taina Borges Website.html#pricing" style={navLinkStyle(fg)}>pricing</a>
          <a href="Taina Borges Website.html#contact" style={navLinkStyle(fg)}>contact</a>
          <span style={{ width: 1, height: 18, background: onLight ? 'var(--line-strong)' : 'rgba(232,226,212,0.32)' }} />
          <Button variant={onLight ? 'primary' : 'accent'} size="sm" onClick={openBooking} icon={<Icon name="arrow-up-right" size={14} />}>
            Book a call
          </Button>
        </nav>

        <button type="button" onClick={() => setMenuOpen(true)} className="tb-burger" aria-label="Open menu" style={{
          display: 'none', alignItems: 'center', justifyContent: 'center', width: 44, height: 44,
          color: fg, background: 'transparent', border: 0, cursor: 'pointer', padding: 0,
        }}><Icon name="menu" size={22} /></button>
      </div>

      {menuOpen && ReactDOM.createPortal((
        <div className="tb-mobile-menu" style={{
          position: 'fixed', inset: 0, zIndex: 1000, padding: 32,
          display: 'flex', flexDirection: 'column', gap: 24,
          color: 'var(--limestone)', background: 'var(--asphalt)',
          overflowY: 'auto', overscrollBehavior: 'contain', touchAction: 'pan-y',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img src="assets/brand/hero-logo.png" alt="Tainá Borges Photography" style={{ width: 190, height: 'auto', display: 'block' }} />
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{
              width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--limestone)', background: 'transparent', border: '1px solid rgba(232,226,212,.25)', borderRadius: 999, cursor: 'pointer',
            }}><Icon name="x" size={22} /></button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 36 }}>
            {[
              ['home', 'Taina Borges Website.html'],
              ['about', 'Taina Borges Website.html#about'],
              ['pricing', 'Taina Borges Website.html#pricing'],
              ['contact', 'Taina Borges Website.html#contact'],
            ].map(([label, href]) => (
              <a className="tb-mobile-menu-link" key={label} href={href} style={{
                color: 'var(--limestone)', textDecoration: 'none', fontFamily: 'var(--font-display)',
                fontWeight: 900, fontSize: 44, letterSpacing: '-.04em', lineHeight: 1.05,
              }}>{label}</a>
            ))}
          </nav>
          <div style={{ marginTop: 'auto' }}>
            <Button variant="accent" size="lg" full onClick={() => { setMenuOpen(false); openBooking(); }} icon={<Icon name="arrow-up-right" size={16} />}>Book a call</Button>
          </div>
        </div>
      ), document.body)}
      <style>{`
        @media (max-width: 820px) {
          .tb-nav { display: none !important; }
          .tb-burger { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}
function navLinkStyle(fg) {
  return {
    background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0',
    fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14, textDecoration: 'none',
    color: fg, opacity: 0.7,
  };
}

// ─────────────────────────────────────────────────────────────
// Page hero
// ─────────────────────────────────────────────────────────────
function ProjectsHero({ total, totalFrames }) {
  return (
    <section data-screen-label="Projects hero" style={{
      position: 'relative', paddingTop: 180, paddingBottom: 64, paddingLeft: 32, paddingRight: 32,
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <Reveal><Eyebrow dark>the work · archive</Eyebrow></Reveal>
        <Reveal delay={80}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(64px, 12vw, 200px)', lineHeight: 0.88, letterSpacing: '-0.05em',
            margin: '18px 0 0', color: '#F4EFE5', textWrap: 'balance', maxInlineSize: '12ch',
            textShadow: '0 2px 30px rgba(0,0,0,0.5)',
          }}>
            every<br/>project<span style={{ color: 'var(--taxi)' }}>.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            gap: 32, marginTop: 40, flexWrap: 'wrap',
          }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 20, lineHeight: 1.5,
              color: 'rgba(244,239,229,0.86)', maxInlineSize: '46ch', margin: 0,
              textShadow: '0 1px 14px rgba(0,0,0,0.5)',
            }}>
              Explore complete New York City photography sessions. Each gallery follows the original story, location, and sequence from the day it was photographed.
            </p>
            <div style={{ display: 'flex', gap: 40 }}>
              <HeroStat n={String(total).padStart(2, '0')} label="projects" />
              <HeroStat n={`${totalFrames}+`} label="frames" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
function HeroStat({ n, label }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 4vw, 56px)', letterSpacing: '-0.04em', lineHeight: 1, color: '#F4EFE5' }}>{n}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(244,239,229,0.6)', marginTop: 8 }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sticky category filter / project index
// ─────────────────────────────────────────────────────────────
function ProjectIndex({ projects, filter, setFilter, scrollToProject }) {
  const cats = ['all', 'portraits', 'lifestyle', 'behind-the-scenes'];
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(11,10,9,0.96)',
      borderTop: '1px solid rgba(232,226,212,0.10)',
      borderBottom: '1px solid rgba(232,226,212,0.10)',
    }}>
      <div style={{
        maxWidth: 1440, margin: '0 auto', padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {cats.map(c => {
            const active = filter === c;
            return (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
                border: '1px solid ' + (active ? 'var(--taxi)' : 'rgba(232,226,212,0.28)'),
                background: active ? 'var(--taxi)' : 'transparent',
                color: active ? 'var(--asphalt)' : 'var(--limestone)',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
                transition: 'all 180ms var(--ease-out)',
              }}>{c === 'behind-the-scenes' ? 'behind the scenes' : c}</button>
            );
          })}
        </div>
        <div className="tb-proj-jump" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {projects.map(p => (
            <button key={p.id} onClick={() => scrollToProject(p.id)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'var(--font-sans)', fontSize: 13, color: 'rgba(244,239,229,0.6)',
              transition: 'color 160ms var(--ease-out)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--taxi)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(244,239,229,0.6)'}
            >{p.title.toLowerCase()}</button>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 980px){ .tb-proj-jump{ display:none !important; } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// A single project block — header + masonry photo grid
// ─────────────────────────────────────────────────────────────
function ProjectBlock({ project, index, onOpenPhoto }) {
  return (
    <section
      id={project.id}
      data-screen-label={`Project · ${project.title}`}
      style={{ padding: '96px 32px', scrollMarginTop: 64 }}
    >
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        {/* Project header */}
        <Reveal>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'end',
            paddingBottom: 32, marginBottom: 40,
            borderBottom: '1px solid rgba(232,226,212,0.16)',
          }} className="tb-proj-head">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'var(--asphalt)', background: 'var(--taxi)', padding: '4px 10px', borderRadius: 999, fontWeight: 500,
                }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(244,239,229,0.6)' }}>
                  {project.category}
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: 'clamp(44px, 6vw, 96px)', lineHeight: 0.92, letterSpacing: '-0.045em',
                margin: 0, color: '#F4EFE5', textWrap: 'balance', maxInlineSize: '16ch',
              }}>
                {project.title} <span style={{ color: 'var(--taxi)' }}>·</span> {project.year}
              </h2>
              <p style={{
                fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 18, lineHeight: 1.5,
                color: 'rgba(244,239,229,0.82)', margin: '18px 0 0', maxInlineSize: '52ch',
              }}>
                {project.blurb}
              </p>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <ProjMeta icon="map-pin" label={project.location} />
              <ProjMeta icon="image" label={`${project.frames} frames`} />
              <ProjMeta icon="calendar" label={project.year} />
            </div>
          </div>
        </Reveal>

        {/* Responsive gallery grid. A normal grid keeps native image boxes
            measurable so browser lazy-loading works consistently. */}
        <div className="tb-project-grid">
          {project.photos.map((ph, i) => (
            <ProjectTile
              key={i}
              photo={ph}
              eager={index === 0 && i < 6}
              priority={index === 0 && i < 2}
              onOpenPhoto={onOpenPhoto}
              project={project}
            />
          ))}
        </div>
      </div>

      <style>{`
        .tb-project-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          align-items: start;
        }
        .tb-project-tile img { transform: scale(1); transition: transform 260ms var(--ease-out); }
        .tb-project-overlay { opacity: 0; transition: opacity 240ms var(--ease-out); }
        .tb-project-tile:hover img, .tb-project-tile:focus-visible img { transform: scale(1.025); }
        .tb-project-tile:hover .tb-project-overlay, .tb-project-tile:focus-visible .tb-project-overlay { opacity: 1; }
        @media (prefers-reduced-motion: reduce) { .tb-project-tile img { transition: none; } }
        @media (max-width: 980px){ .tb-project-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .tb-proj-head { grid-template-columns: 1fr !important; gap: 20px !important; } .tb-proj-head > div:last-child { text-align: left !important; flex-direction: row !important; gap: 20px !important; flex-wrap: wrap; } }
        @media (max-width: 600px){ .tb-project-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

function ProjMeta({ icon, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end',
      fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'rgba(244,239,229,0.72)',
    }}>
      <Icon name={icon} size={13} /> {label}
    </span>
  );
}

function ProjectTile({ photo, eager, priority, onOpenPhoto, project }) {
  return (
    <button
      className="tb-project-tile"
      onClick={() => onOpenPhoto?.({ src: photo.src, title: photo.title, meta: project.location, year: project.year })}
      aria-label={`Open ${photo.title}`}
      style={{
        display: 'block', width: '100%',
        padding: 0, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}
    >
      <div style={{
        position: 'relative', overflow: 'hidden', borderRadius: 6,
        background: 'var(--bg-inset)',
        boxShadow: '0 2px 10px -6px rgba(0,0,0,0.4)',
      }}>
        <img
          src={photo.src}
          alt={photo.title}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          width={photo.width}
          height={photo.height}
          style={{ width: '100%', height: 'auto', display: 'block', background: 'var(--bg-inset)' }}
        />
        <div className="tb-project-overlay" aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(22,21,19,0) 55%, rgba(22,21,19,0.7) 100%)',
        }}/>
        <div className="tb-project-overlay" style={{
          position: 'absolute', left: 14, right: 14, bottom: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12,
          color: 'var(--limestone)',
        }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14 }}>{photo.title}</span>
          <span aria-hidden style={{ fontFamily: 'var(--font-mono)', fontSize: 15, lineHeight: 1 }}>↗</span>
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────────────────────
function Lightbox({ photo, onClose, onPrevious, onNext, index, total }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrevious();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onPrevious, onNext]);

  useEffect(() => {
    const preload = new Image();
    preload.decoding = 'async';
    preload.src = photo.src;
  }, [photo.src]);

  return (
    <div className="tb-project-lightbox" role="dialog" aria-modal="true" aria-label="Project photo viewer" onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(11,10,9,0.96)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32,
      animation: 'tbFadeIn 220ms var(--ease-out)',
    }}>
      <Grain opacity={0.06} />
      <button onClick={onClose} aria-label="close" style={{
        position: 'absolute', top: 24, right: 24, width: 44, height: 44, borderRadius: 999,
        background: 'transparent', color: 'var(--limestone)', border: '1px solid rgba(232,226,212,0.32)',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
      }}><Icon name="x" size={18}/></button>
      <button className="tb-lightbox-nav tb-lightbox-prev" onClick={(e) => { e.stopPropagation(); onPrevious(); }} aria-label="Previous photo">
        <span aria-hidden>&lt;</span>
      </button>
      <button className="tb-lightbox-nav tb-lightbox-next" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next photo">
        <span aria-hidden>&gt;</span>
      </button>
      <div key={photo.src} onClick={e => e.stopPropagation()} style={{
        position: 'relative', maxWidth: '90vw', maxHeight: '86vh', display: 'flex', flexDirection: 'column', gap: 16,
        animation: 'tbModalIn 380ms var(--ease-cinematic)',
      }}>
        <img src={photo.src} alt={photo.title} decoding="async" style={{
          maxWidth: '90vw', maxHeight: '78vh', objectFit: 'contain', display: 'block', background: 'var(--asphalt)',
        }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, color: 'var(--limestone)', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 18 }}>{photo.title}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8C857A' }}>
            {String(index + 1).padStart(3, '0')} / {String(total).padStart(3, '0')} · {photo.meta} · {photo.year}
          </span>
        </div>
      </div>
      <style>{`
        @keyframes tbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes tbModalIn { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        .tb-lightbox-nav {
          position: absolute; top: 50%; z-index: 3; width: 52px; height: 52px;
          transform: translateY(-50%); border-radius: 999px;
          border: 1px solid rgba(232,226,212,.32); background: rgba(11,10,9,.54);
          color: var(--limestone); cursor: pointer; display: inline-flex;
          align-items: center; justify-content: center; font-family: var(--font-sans);
          font-size: 30px; font-weight: 300; line-height: 1; backdrop-filter: blur(10px);
          transition: color 180ms var(--ease-out), background 180ms var(--ease-out), border-color 180ms var(--ease-out), transform 220ms var(--ease-out);
        }
        .tb-lightbox-prev { left: 24px; }
        .tb-lightbox-next { right: 24px; }
        .tb-lightbox-nav:hover { color: var(--asphalt); background: var(--taxi); border-color: var(--taxi); transform: translateY(-50%) scale(1.06); }
        @media (max-width: 720px) {
          .tb-project-lightbox { padding: 58px 14px 88px !important; }
          .tb-lightbox-nav { top: auto; bottom: 18px; width: 48px; height: 48px; transform: none; }
          .tb-lightbox-prev { left: calc(50% - 58px); }
          .tb-lightbox-next { right: calc(50% - 58px); }
          .tb-lightbox-nav:hover { transform: none; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page root
// ─────────────────────────────────────────────────────────────
function ProjectsApp() {
  const all = window.TB_COLLECTIONS || [];
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

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

  // Open directly to a hash project on load
  useEffect(() => {
    if (!window.location.hash) return undefined;
    const id = window.location.hash.slice(1);
    const jump = () => {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: Math.max(0, el.offsetTop - 56), behavior: 'auto' });
    };
    // Recheck after fonts and nearby lazy images settle so deep links always
    // land on their project rather than an obsolete pre-layout offset.
    const timers = [80, 600, 1600].map((delay) => setTimeout(jump, delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  const projects = useMemo(
    () => filter === 'all' ? all : all.filter(p => p.category === filter),
    [filter, all]
  );
  const visiblePhotos = useMemo(() => projects.flatMap((project) =>
    project.photos.map((photo) => ({
      src: photo.src,
      title: photo.title,
      meta: project.location,
      year: project.year,
    }))
  ), [projects]);
  const totalFrames = all.reduce((s, p) => s + (p.frames || 0), 0);

  const openPhoto = (photo) => {
    const index = visiblePhotos.findIndex((item) => item.src === photo.src);
    if (index >= 0) setLightboxIndex(index);
  };
  const previousPhoto = () => setLightboxIndex((index) => (index - 1 + visiblePhotos.length) % visiblePhotos.length);
  const nextPhoto = () => setLightboxIndex((index) => (index + 1) % visiblePhotos.length);

  const scrollToProject = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 56, behavior: 'smooth' });
  };

  return (
    <div data-screen-label="Projects gallery" style={{ color: 'var(--limestone)', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <ProjectsHeader scrolled={scrolled} openBooking={() => setBookingOpen(true)} />
      <ProjectsHero total={all.length} totalFrames={totalFrames} />
      <ProjectIndex projects={all} filter={filter} setFilter={setFilter} scrollToProject={scrollToProject} />

      {projects.map((p, i) => (
        <ProjectBlock key={p.id} project={p} index={i} onOpenPhoto={openPhoto} />
      ))}

      {/* CTA back to booking */}
      <section style={{ padding: '96px 32px 120px' }}>
        <div style={{
          maxWidth: 1440, margin: '0 auto', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        }}>
          <Reveal>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(40px, 6vw, 92px)', lineHeight: 0.92, letterSpacing: '-0.045em',
              margin: 0, color: '#F4EFE5', textWrap: 'balance', maxInlineSize: '16ch',
            }}>
              want one of these<br/>made for you<span style={{ color: 'var(--taxi)' }}>?</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button variant="accent" size="lg" onClick={() => setBookingOpen(true)} icon={<Icon name="calendar" size={16} />}>Book a call</Button>
              <Button variant="ghost" size="lg" dark href="Taina Borges Website.html#pricing" icon={<Icon name="arrow-up-right" size={16} />}>See pricing</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <WhatsAppFloating />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
      {lightboxIndex != null && visiblePhotos[lightboxIndex] && (
        <Lightbox
          photo={visiblePhotos[lightboxIndex]}
          index={lightboxIndex}
          total={visiblePhotos.length}
          onClose={() => setLightboxIndex(null)}
          onPrevious={previousPhoto}
          onNext={nextPhoto}
        />
      )}
    </div>
  );
}

window.ProjectsApp = ProjectsApp;
