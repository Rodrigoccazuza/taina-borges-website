/* global React, Icon, useLanguage */
const { useState, useEffect } = React;

function WhatsAppFloating() {
  const { isPortuguese } = useLanguage();
  const [hover, setHover] = useState(false);
  const [shown, setShown] = useState(false);
  const number = '15165592237';
  const text = encodeURIComponent(isPortuguese ? 'Oi, Tainá! Estou pensando em fazer um ensaio em Nova York.' : 'Hi, Tainá! I’m thinking about a photo session in New York.');

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <a href={`https://wa.me/${number}?text=${text}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with Tainá on WhatsApp"
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{
         position: 'fixed', right: 22, bottom: 22, zIndex: 60,
         display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: hover ? 10 : 0,
         padding: hover ? '14px 20px 14px 16px' : '14px 14px',
         borderRadius: 999,
         background: '#0E2A18', color: '#F4EFE5',
         textDecoration: 'none', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14,
         boxShadow: '0 12px 28px -10px rgba(22,21,19,0.55)',
         transition: 'padding 220ms var(--ease-out), gap 220ms var(--ease-out), background 180ms var(--ease-out), opacity 600ms var(--ease-out), transform 600ms var(--ease-out)',
         border: '1px solid rgba(111,231,19,0.48)',
         opacity: shown ? 1 : 0,
         transform: shown ? 'translateY(0)' : 'translateY(20px)',
       }}>
      <img src="assets/brand/whatsapp-icon.svg" width="23" height="23" alt="" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }} />
      <span style={{ maxWidth: hover ? 220 : 0, overflow: 'hidden', whiteSpace: 'nowrap', transition: 'max-width 280ms var(--ease-out)' }}>
        {isPortuguese ? 'falar no whatsapp' : 'chat on whatsapp'}
      </span>
    </a>
  );
}

window.WhatsAppFloating = WhatsAppFloating;
