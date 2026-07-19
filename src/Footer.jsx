/* global React, Icon, Eyebrow, Reveal, TBMark, useLanguage */
function Footer() {
  const { isPortuguese } = useLanguage();
  return (
    <footer style={{
      background: 'transparent', color: 'var(--limestone)',
      padding: '88px 32px 32px',
      borderTop: '1px solid rgba(232,226,212,0.08)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <Reveal>
          <div className="tb-foot-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, paddingBottom: 64, borderBottom: '1px solid rgba(232,226,212,0.14)' }}>
            <div>
              {/* Big stacked logo + mark */}
              <div style={{ marginBottom: 22 }}>
                <TBMark size={56} variant="dark" gap={6} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 48, letterSpacing: '-0.045em', lineHeight: 0.95, marginBottom: 18 }}>
                taína borges<span style={{ color: 'var(--taxi)' }}>.</span>
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: '#C9C2B3', marginTop: 0, maxInlineSize: '40ch' }}>
                {isPortuguese ? 'fotógrafa em nova york. experiências leves, autênticas e cheias de memórias.' : 'new york photographer. relaxed, authentic experiences and memories that last.'}
              </p>
            </div>
            <FootCol title={isPortuguese ? 'explorar' : 'browse'} items={isPortuguese ? ['retratos', 'casais', 'famílias', 'coleções'] : ['portraits', 'couples', 'families', 'collections']} />
            <FootCol title={isPortuguese ? 'informações' : 'info'} items={isPortuguese ? ['sobre', 'valores', 'contato', 'processo'] : ['about', 'pricing', 'contact', 'process']} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Eyebrow dark withBar={false}>{isPortuguese ? 'encontre-me' : 'elsewhere'}</Eyebrow>
              <FootLink icon="instagram" label="@tainaborges" href="https://www.instagram.com/tainaborges" external />
              <FootLink icon="mail" label="tainaborges_1@hotmail.com" href="mailto:tainaborges_1@hotmail.com" />
              <FootLink icon="message-circle" label="whatsapp" href="https://wa.me/19175550042" external />
            </div>
          </div>
        </Reveal>
        <div className="tb-foot-end" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#5C5750', letterSpacing: '0.06em', gap: 16, flexWrap: 'wrap' }}>
          <span>© taína borges, new york — 2026</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, background: 'var(--taxi)', borderRadius: 999 }} /> made on the 6 train
          </span>
        </div>
      </div>
      <style>{`
        @media (max-width: 880px) {
          .tb-foot-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .tb-foot-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function FootCol({ title, items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow dark withBar={false}>{title}</Eyebrow>
      {items.map(x => (
        <a key={x} href="#" style={{ color: '#C9C2B3', fontFamily: 'var(--font-sans)', fontSize: 14, textDecoration: 'none', padding: '2px 0', width: 'fit-content', borderBottom: '1px solid transparent', transition: 'border-color 180ms var(--ease-out), color 180ms var(--ease-out)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--limestone)'; e.currentTarget.style.borderBottomColor = 'var(--taxi)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#C9C2B3'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
        >{x}</a>
      ))}
    </div>
  );
}

function FootLink({ icon, label, href, external }) {
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} style={{ color: '#C9C2B3', fontFamily: 'var(--font-sans)', fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <Icon name={icon} size={14}/>{label}
    </a>
  );
}

window.Footer = Footer;
