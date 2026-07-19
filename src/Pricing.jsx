/* global React, Icon, Eyebrow, Reveal, useLanguage */

function Pricing({ openBooking }) {
  const { isPortuguese } = useLanguage();
  const ui = isPortuguese ? {
    eyebrow: 'investimento', title: 'Escolha sua experiência em Nova York.',
    intro: 'Três formas de guardar sua história na cidade — com direção leve, momentos reais e fotografias atemporais.',
    includes: 'inclui', bestFor: 'ideal para', mostBooked: 'mais escolhido', cta: 'reservar esta experiência',
  } : {
    eyebrow: 'investment', title: 'Choose your New York experience.',
    intro: 'Three ways to preserve your story in the city—with gentle direction, real moments, and timeless photographs.',
    includes: 'includes', bestFor: 'best for', mostBooked: 'most booked', cta: 'book this experience',
  };

  const tiers = isPortuguese ? [
    {
      id: 'essentials', kicker: 'Essentials', name: 'NYC Mini Experience', price: '$175–225',
      duration: '30–45 minutos · 1 local', mark: 'E', markColor: '#DEA61F',
      includes: ['sessão de 30–45 minutos em NYC', '1 local', '1 look', '10–15 fotos editadas', 'galeria online privada', 'downloads em alta resolução'],
      bestFor: 'viajantes solo · casais · retratos para redes sociais',
    },
    {
      id: 'signature', kicker: 'Signature · principal', name: 'The New York Experience', price: '$350–450',
      duration: '1,5 hora · 2 locais', mark: 'S', markColor: '#7E4834', featured: true,
      includes: ['sessão fotográfica de 1,5 hora', '2 locais próximos', '1 troca de look (opcional)', '30–40 fotos editadas', 'galeria online privada', 'recomendações de locais', 'downloads em alta resolução'],
      bestFor: 'casais · famílias · memórias de viagem · primeira vez em NYC',
    },
    {
      id: 'story', kicker: 'Story', name: 'NYC Story Experience', price: '$650–800',
      duration: '3 horas · vários locais', mark: 'NY', markColor: '#161513',
      includes: ['sessão de 3 horas em NYC', 'planejamento de roteiro personalizado', 'vários locais', '60–80 fotos editadas', 'galeria privada', 'downloads em alta resolução'],
      bestFor: 'lua de mel · pedidos de noivado · aniversários · famílias',
    },
  ] : [
    {
      id: 'essentials', kicker: 'Essentials', name: 'NYC Mini Experience', price: '$175–225',
      duration: '30–45 minutes · 1 location', mark: 'E', markColor: '#DEA61F',
      includes: ['30–45 minute photo session in NYC', '1 location', '1 outfit', '10–15 edited photos', 'private online gallery', 'high-resolution downloads'],
      bestFor: 'solo travelers · couples · social media portraits',
    },
    {
      id: 'signature', kicker: 'Signature · main experience', name: 'The New York Experience', price: '$350–450',
      duration: '1.5 hours · 2 locations', mark: 'S', markColor: '#7E4834', featured: true,
      includes: ['1.5-hour photo session', '2 nearby locations', '1 outfit change (optional)', '30–40 edited photos', 'private online gallery', 'location recommendations', 'high-resolution downloads'],
      bestFor: 'couples · families · vacation memories · first NYC trip',
    },
    {
      id: 'story', kicker: 'Story', name: 'NYC Story Experience', price: '$650–800',
      duration: '3 hours · multiple locations', mark: 'NY', markColor: '#161513',
      includes: ['3-hour NYC session', 'personalized route planning', 'multiple locations', '60–80 edited photos', 'private gallery', 'high-resolution downloads'],
      bestFor: 'honeymoons · proposals · anniversaries · families',
    },
  ];

  return (
    <section id="pricing" data-screen-label="07 Pricing" style={{ background: 'var(--paper)', padding: '140px 32px' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', marginBottom: 62 }}>
            <div style={{ maxWidth: 900 }}>
              <Eyebrow>{ui.eyebrow}</Eyebrow>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 6vw, 94px)', lineHeight: .92, letterSpacing: '-.045em', margin: '22px 0 18px', maxWidth: '15ch' }}>{ui.title}</h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 18, lineHeight: 1.55, color: 'var(--fg-2)', maxWidth: 650, margin: 0 }}>{ui.intro}</p>
            </div>
          </div>
        </Reveal>

        <div className="tb-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18, alignItems: 'stretch' }}>
          {tiers.map((tier, index) => <PricingCard key={tier.id} tier={tier} ui={ui} delay={index * 70} openBooking={openBooking} />)}
        </div>
      </div>
      <style>{`
        @media (max-width: 1020px) { .tb-pricing-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 600px) { #pricing { padding: 96px 20px !important; } }
      `}</style>
    </section>
  );
}

function PricingCard({ tier, ui, delay, openBooking }) {
  const featured = tier.featured;
  const main = featured ? 'var(--limestone)' : 'var(--asphalt)';
  const muted = featured ? 'rgba(232,226,212,.66)' : 'var(--fg-3)';
  return (
    <Reveal delay={delay}>
      <article style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 6, position: 'relative', background: featured ? 'var(--asphalt)' : 'var(--limestone)', color: main, border: `1px solid ${featured ? 'var(--asphalt)' : 'var(--line-strong)'}`, boxShadow: featured ? '0 26px 64px -24px rgba(22,21,19,.5)' : 'none' }}>
        <div style={{ height: 4, background: tier.markColor }} />
        {featured && <span style={{ position: 'absolute', top: 18, right: 18, padding: '5px 10px', borderRadius: 999, background: 'var(--taxi)', color: 'var(--asphalt)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase' }}>{ui.mostBooked}</span>}
        <div style={{ padding: '30px 28px 24px' }}>
          <div style={{ width: 52, height: 52, borderRadius: 99, background: tier.markColor, color: tier.id === 'story' ? '#F4EFE5' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: tier.mark.length > 1 ? 19 : 28, marginBottom: 24 }}>{tier.mark}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: muted, marginBottom: 9 }}>{tier.kicker}</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 31, letterSpacing: '-.03em', lineHeight: 1, margin: '0 0 24px', maxWidth: '14ch' }}>{tier.name}</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}><span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 43, letterSpacing: '-.04em', lineHeight: 1 }}>{tier.price}</span><span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: muted }}>USD</span></div>
          <div style={{ marginTop: 12, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15 }}>{tier.duration}</div>
        </div>
        <div style={{ height: 1, margin: '0 28px', background: featured ? 'rgba(232,226,212,.18)' : 'var(--line-strong)' }} />
        <div style={{ padding: '24px 28px', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: muted, marginBottom: 16 }}>{ui.includes}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {tier.includes.map(item => <li key={item} style={{ display: 'flex', gap: 11, fontFamily: 'var(--font-sans)', fontSize: 14.5, lineHeight: 1.4 }}><Icon name="check" size={15} color={tier.markColor} /><span>{item}</span></li>)}
          </ul>
        </div>
        <div style={{ padding: '20px 28px 28px', borderTop: `1px solid ${featured ? 'rgba(232,226,212,.18)' : 'var(--line-strong)'}` }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>{ui.bestFor}</div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.5, margin: '0 0 20px' }}>{tier.bestFor}</p>
          <button type="button" onClick={openBooking} style={{ width: '100%', border: 0, borderRadius: 2, padding: '14px 16px', cursor: 'pointer', background: featured ? 'var(--taxi)' : 'var(--asphalt)', color: featured ? 'var(--asphalt)' : 'var(--limestone)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600 }}><span>{ui.cta}</span><Icon name="arrow-up-right" size={15} /></button>
        </div>
      </article>
    </Reveal>
  );
}

window.Pricing = Pricing;
