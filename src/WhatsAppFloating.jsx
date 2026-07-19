/* global React, Icon, useLanguage */
const { useState, useEffect } = React;

function WhatsAppFloating() {
  const { isPortuguese } = useLanguage();
  const [hover, setHover] = useState(false);
  const [shown, setShown] = useState(false);
  const number = '19175550042';
  const text = encodeURIComponent(isPortuguese ? 'Oi, Tainá! Estou pensando em fazer um ensaio em Nova York.' : 'Hi, Tainá! I’m thinking about a photo session in New York.');

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <a href={`https://wa.me/${number}?text=${text}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with Taína on WhatsApp"
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{
         position: 'fixed', right: 22, bottom: 22, zIndex: 60,
         display: 'inline-flex', alignItems: 'center', gap: 10,
         padding: hover ? '14px 20px 14px 16px' : '14px 14px',
         borderRadius: 999,
         background: '#25D366', color: '#0E2A18',
         textDecoration: 'none', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14,
         boxShadow: '0 12px 28px -10px rgba(22,21,19,0.55)',
         transition: 'padding 220ms var(--ease-out), background 180ms var(--ease-out), opacity 600ms var(--ease-out), transform 600ms var(--ease-out)',
         border: '1px solid rgba(14,42,24,0.18)',
         opacity: shown ? 1 : 0,
         transform: shown ? 'translateY(0)' : 'translateY(20px)',
       }}>
      <WhatsAppIcon size={21} />
      <span style={{ maxWidth: hover ? 220 : 0, overflow: 'hidden', whiteSpace: 'nowrap', transition: 'max-width 280ms var(--ease-out)' }}>
        {isPortuguese ? 'falar no whatsapp' : 'chat on whatsapp'}
      </span>
    </a>
  );
}

function WhatsAppIcon({ size = 21 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" focusable="false">
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.7 7.4L3.5 20.5l1.4-4.1A8.5 8.5 0 1 1 20.5 11.7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.1 7.7c.3-.4.7-.4 1-.1l1 1.5c.2.3.2.6 0 .9l-.7.8c.6 1.4 1.8 2.6 3.3 3.2l.8-.8c.2-.2.6-.3.9-.1l1.5.9c.4.2.5.6.3 1-.4.9-1.3 1.5-2.3 1.4-4.1-.5-7.3-3.7-7.8-7.8-.1-.4.1-.7.3-.9Z" fill="currentColor" />
    </svg>
  );
}

window.WhatsAppFloating = WhatsAppFloating;
