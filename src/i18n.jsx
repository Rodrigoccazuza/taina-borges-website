/* global React */
const { createContext, useContext, useEffect, useMemo, useState } = React;

const LanguageContext = createContext({ language: 'en', isPortuguese: false, setLanguage: () => {} });

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('tb-language') === 'pt-BR' ? 'pt-BR' : 'en'; }
    catch (_) { return 'en'; }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try { localStorage.setItem('tb-language', language); } catch (_) {}
  }, [language]);

  const value = useMemo(() => ({
    language,
    isPortuguese: language === 'pt-BR',
    setLanguage,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function useLanguage() {
  return useContext(LanguageContext);
}

function LanguageToggle({ dark = false }) {
  const { language, setLanguage } = useLanguage();
  const fg = dark ? '#F4EFE5' : 'var(--asphalt)';
  const border = dark ? 'rgba(244,239,229,0.35)' : 'var(--line-strong)';

  return (
    <div aria-label="Language selector" role="group" style={{
      display: 'inline-flex', alignItems: 'center', gap: 2, padding: 3,
      border: `1px solid ${border}`, borderRadius: 999,
      background: dark ? 'rgba(22,21,19,0.24)' : 'rgba(244,239,229,0.45)',
    }}>
      {[
        { code: 'en', label: 'EN' },
        { code: 'pt-BR', label: 'PT-BR' },
      ].map(option => {
        const active = language === option.code;
        return (
          <button key={option.code} type="button" onClick={() => setLanguage(option.code)}
            aria-pressed={active} aria-label={option.code === 'en' ? 'View in English' : 'Ver em português do Brasil'}
            style={{
              border: 0, borderRadius: 999, cursor: 'pointer', padding: '6px 9px',
              background: active ? 'var(--taxi)' : 'transparent',
              color: active ? 'var(--asphalt)' : fg,
              fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
              letterSpacing: '0.12em', lineHeight: 1,
            }}>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { LanguageProvider, useLanguage, LanguageToggle });
