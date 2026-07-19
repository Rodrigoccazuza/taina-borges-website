/* global React, Icon, Button, TBMark, useLanguage, LanguageToggle */
const { useState, useEffect } = React;

function Header({ scrolled, openBooking, scrollTo, active }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isPortuguese } = useLanguage();
  const onLight = scrolled;
  const fg = onLight ? 'var(--asphalt)' : 'var(--limestone)';

  const navItems = isPortuguese ? [
    { id: 'work', label: 'trabalhos', href: 'Projects.html' }, { id: 'about', label: 'sobre' },
    { id: 'collections', label: 'coleções' }, { id: 'pricing', label: 'valores' },
    { id: 'testimonials', label: 'depoimentos' }, { id: 'contact', label: 'contato' },
  ] : [
    { id: 'work', label: 'work', href: 'Projects.html' }, { id: 'about', label: 'about' },
    { id: 'collections', label: 'collections' }, { id: 'pricing', label: 'pricing' },
    { id: 'testimonials', label: 'kind words' }, { id: 'contact', label: 'contact' },
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: '16px 32px',
      background: onLight ? 'rgba(232, 226, 212, 0.82)' : 'transparent',
      borderBottom: onLight ? '1px solid var(--hairline)' : '1px solid transparent',
      transition: 'background 320ms var(--ease-out), border-color 320ms var(--ease-out), padding 320ms var(--ease-out)',
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <button onClick={() => scrollTo('top')} style={{
          background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
          color: fg, lineHeight: 1, display: 'inline-flex', alignItems: 'center', gap: 12,
        }}>
          {/* Brand mark — three balls */}
          <TBMark size={22} variant={onLight ? 'light' : 'dark'} />
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20,
            letterSpacing: '-0.04em', color: fg,
          }}>
            taína borges<span style={{ color: 'var(--taxi)' }}>.</span>
          </span>
        </button>

        <nav className="tb-nav" style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <LanguageToggle dark={!onLight} />
          {navItems.map(it => it.href ? (
            <a key={it.id} href={it.href} style={{
              background: 'transparent', padding: '4px 0', textDecoration: 'none',
              fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14,
              color: fg, opacity: 0.6, borderBottom: '1px solid transparent',
              transition: 'opacity 180ms var(--ease-out), border-color 180ms var(--ease-out)',
            }}>{it.label}</a>
          ) : (
            <button key={it.id} onClick={() => scrollTo(it.id)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0',
              fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14,
              color: fg, opacity: active === it.id ? 1 : 0.6,
              borderBottom: active === it.id ? `1px solid currentColor` : '1px solid transparent',
              transition: 'opacity 180ms var(--ease-out), border-color 180ms var(--ease-out)',
            }}>{it.label}</button>
          ))}
          <span style={{ width: 1, height: 18, background: onLight ? 'var(--line-strong)' : 'rgba(232,226,212,0.32)' }} />
          <Button variant={onLight ? 'primary' : 'accent'} size="sm" onClick={openBooking} icon={<Icon name="arrow-up-right" size={14} />}>
            {isPortuguese ? 'Agendar conversa' : 'Book a call'}
          </Button>
        </nav>

        <div className="tb-mobile-controls" style={{ display: 'none', alignItems: 'center', gap: 8 }}>
          <LanguageToggle dark={!onLight} />
          <button className="tb-burger" onClick={() => setMenuOpen(true)} aria-label={isPortuguese ? 'Abrir menu' : 'Open menu'} style={{
            background: 'transparent', border: 'none', cursor: 'pointer', color: fg, padding: 6,
          }}><Icon name="menu" size={22}/></button>
        </div>
      </div>

      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--asphalt)', color: 'var(--limestone)',
          padding: 32, display: 'flex', flexDirection: 'column', gap: 24, zIndex: 200,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              <TBMark size={22} variant="dark" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20 }}>taína borges<span style={{ color: 'var(--taxi)' }}>.</span></span>
            </span>
            <button onClick={() => setMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--limestone)', cursor: 'pointer' }}><Icon name="x" size={22}/></button>
          </div>
          <div style={{ alignSelf: 'flex-start' }}><LanguageToggle dark /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
            {navItems.map(it => it.href ? (
              <a key={it.id} href={it.href} style={{
                background: 'transparent', border: 'none', textAlign: 'left', textDecoration: 'none',
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 44, letterSpacing: '-0.04em',
                color: 'var(--limestone)', cursor: 'pointer', padding: 0, lineHeight: 1.05,
              }}>{it.label}</a>
            ) : (
              <button key={it.id} onClick={() => { scrollTo(it.id); setMenuOpen(false); }} style={{
                background: 'transparent', border: 'none', textAlign: 'left',
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 44, letterSpacing: '-0.04em',
                color: 'var(--limestone)', cursor: 'pointer', padding: 0, lineHeight: 1.05,
              }}>{it.label}</button>
            ))}
          </div>
          <div style={{ marginTop: 'auto' }}>
            <Button variant="accent" size="lg" full onClick={() => { openBooking(); setMenuOpen(false); }} icon={<Icon name="arrow-up-right" size={16}/>}>
              {isPortuguese ? 'Agendar conversa' : 'Book a call'}
            </Button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 980px) {
          .tb-nav { display: none !important; }
          .tb-mobile-controls { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}

window.Header = Header;
