/* global React */
const { useState, useEffect, useRef } = React;

// ─── Eyebrow ──────────────────────────────────────────────────
function Eyebrow({ children, dark, withBar = true, style }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: dark ? 'var(--limestone)' : 'var(--asphalt)',
      display: 'inline-flex', alignItems: 'center', gap: 10, ...style,
    }}>
      {withBar && <span className="tb-eyebrow-line" style={{ width: 18, height: 1, background: 'currentColor' }} />}
      {children}
    </span>
  );
}

// ─── Tag / chip ───────────────────────────────────────────────
function Tag({ children, onClick, active, dark }) {
  const base = active
    ? { background: 'var(--asphalt)', color: 'var(--limestone)', borderColor: 'var(--asphalt)' }
    : dark
      ? { background: 'transparent', color: 'var(--limestone)', borderColor: 'rgba(232,226,212,0.32)' }
      : { background: 'transparent', color: 'var(--asphalt)', borderColor: 'var(--line-strong)' };
  return (
    <button onClick={onClick} style={{
      ...base, padding: '8px 14px', borderRadius: 4, cursor: 'pointer',
      borderStyle: 'solid', borderWidth: 1,
      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase',
      transition: 'all 180ms var(--ease-out)',
    }}>{children}</button>
  );
}

// ─── Button ───────────────────────────────────────────────────
function Button({ children, variant = 'primary', onClick, icon, size = 'md', type = 'button', dark, full, href, disabled = false }) {
  const sizes = { sm: { padding: '8px 14px', fontSize: 12 }, md: { padding: '13px 20px', fontSize: 14 }, lg: { padding: '16px 26px', fontSize: 15 } };
  const variants = {
    primary: { background: 'var(--asphalt)', color: 'var(--limestone)', border: '1px solid var(--asphalt)' },
    accent:  { background: 'var(--taxi)',    color: 'var(--asphalt)',   border: '1px solid var(--taxi)' },
    ghost:   { background: 'transparent',    color: dark ? 'var(--limestone)' : 'var(--asphalt)',
               border: dark ? '1px solid rgba(232,226,212,0.32)' : '1px solid var(--line-strong)' },
    link:    { background: 'transparent',    color: 'var(--brick)', borderRadius: 0, padding: '4px 0', borderBottom: '1px solid currentColor' },
  };
  const Tag = href ? 'a' : 'button';
  const props = href ? { href } : { type, onClick, disabled };
  return (
    <Tag {...props} className={`tb-button tb-button-${variant}`} style={{
      ...variants[variant], ...sizes[size],
      borderRadius: variant === 'link' ? 0 : 2,
      fontFamily: 'var(--font-sans)', fontWeight: 500, letterSpacing: '-0.005em',
      cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
      opacity: disabled ? 0.62 : 1,
      lineHeight: 1, width: full ? '100%' : 'auto', justifyContent: 'center',
      textDecoration: 'none',
      transition: 'background 180ms var(--ease-out), color 180ms var(--ease-out), transform 80ms',
      ...(variant === 'link' ? { padding: '4px 0' } : {}),
    }}
    onClick={onClick}
    onMouseDown={e => e.currentTarget.style.transform = 'translateY(1px)'}
    onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {children}
      {icon && <span className="tb-button-icon" style={{ display: 'inline-flex' }}>{icon}</span>}
    </Tag>
  );
}

// ─── Field ────────────────────────────────────────────────────
function Field({ label, hint, value, onChange, type = 'text', placeholder, multiline, rows = 4, name, required = false, maxLength, autoComplete }) {
  const T = multiline ? 'textarea' : 'input';
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em',
                     textTransform: 'uppercase', color: 'var(--fg-3)' }}>{label}</span>
      <T
        type={multiline ? undefined : type}
        name={name}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        rows={multiline ? rows : undefined}
        value={value} onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14,
          padding: '13px 14px', background: 'var(--paper)',
          border: '1px solid ' + (focus ? 'var(--asphalt)' : 'var(--line-strong)'),
          borderRadius: 2, color: 'var(--fg-1)', outline: 'none',
          resize: multiline ? 'vertical' : 'none',
          width: '100%', boxSizing: 'border-box', minHeight: multiline ? 120 : 'auto',
          transition: 'border-color 180ms var(--ease-out)',
        }}
      />
      {hint && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{hint}</span>}
    </label>
  );
}

// ─── Lucide icon helper ───────────────────────────────────────
function Icon({ name, size = 18, stroke = 1.5, color = 'currentColor' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({ attrs: { 'stroke-width': stroke, width: size, height: size } });
    }
  }, [name, size, stroke]);
  return <span ref={ref} style={{ display: 'inline-flex', color, lineHeight: 0 }} />;
}

// ─── Reveal: reliable one-time staggered entrance ─────────────
function Reveal({ children, as: As = 'div', style, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return undefined;
    if (!('IntersectionObserver' in window)) { setVisible(true); return undefined; }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <As
      ref={ref}
      className={`tb-reveal${visible ? ' tb-reveal-visible' : ''}`}
      style={{ ...style, '--tb-reveal-delay': `${delay}ms` }}
    >
      {children}
    </As>
  );
}

// ─── Grain overlay ────────────────────────────────────────────
// A tiny static CSS pattern is substantially cheaper to composite than the
// previous full-screen SVG turbulence filter.
const GRAIN_URL = '';

function Grain({ opacity = 0.06, blend = 'overlay' }) {
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      mixBlendMode: blend, opacity,
      backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 0.55px, transparent 0.75px)',
      backgroundSize: '4px 4px',
    }}/>
  );
}

Object.assign(window, { Eyebrow, Tag, Button, Field, Icon, Reveal, Grain, GRAIN_URL });
