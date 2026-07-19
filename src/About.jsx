/* global React, Icon, Eyebrow, Reveal, Grain, useLanguage */

function About() {
  const { isPortuguese } = useLanguage();
  const copy = isPortuguese ? {
    eyebrow: 'sobre · tainá borges',
    title: 'Oi, eu sou a Tainá!',
    paragraphs: [
      'Nasci no Brasil e visitei Nova York pela primeira vez em 2019. Como tantas pessoas, cheguei como visitante — e me apaixonei instantaneamente pela energia, diversidade e charme icônico da cidade.',
      'O que começou como uma viagem acabou se tornando meu lar. Hoje, tenho o privilégio de ajudar visitantes do mundo todo a registrar suas próprias memórias inesquecíveis em Nova York por meio de fotografias autênticas e atemporais.',
      'Acredito que as melhores fotos nascem de momentos reais, não de poses rígidas. Seja para celebrar uma ocasião especial, viajar com quem você ama ou simplesmente explorar a cidade, meu objetivo é fazer você se sentir à vontade, confiante e totalmente você.',
      'Mais do que um ensaio fotográfico, quero que sua sessão faça parte da sua experiência em Nova York — divertida, leve e cheia de memórias que você vai guardar muito depois do fim da viagem.',
    ],
    closing: 'Vamos contar juntos a sua história em Nova York.',
    facts: [
      ['map-pin', 'nasceu no', 'Brasil - Rio de Janeiro'], ['plane', 'em Nova York desde', '2019'],
      ['camera', 'equipamento', 'Cannon T8i'], ['sun', 'experiência', 'leve e autêntica'],
    ],
    available: 'reservas abertas · 2026',
  } : {
    eyebrow: 'about · tainá borges',
    title: 'Hi, I’m Tainá!',
    paragraphs: [
      'I was born in Brazil and first visited New York City in 2019. Like so many people, I came here as a visitor—and instantly fell in love with the city’s energy, diversity, and iconic charm.',
      'What started as a trip eventually became home. Today, I have the privilege of helping visitors from around the world capture their own unforgettable New York memories through authentic, timeless photography.',
      'I believe the best photos come from real moments, not stiff poses. Whether you’re celebrating a special occasion, traveling with your loved ones, or simply exploring the city, my goal is to make you feel comfortable, confident, and completely yourself.',
      'More than a photoshoot, I want your session to be part of your New York experience—fun, relaxed, and filled with memories you’ll treasure long after your trip is over.',
    ],
    closing: 'Let’s tell your New York story together.',
    facts: [
      ['map-pin', 'born in', 'Brazil - Rio de Janeiro'], ['plane', 'In New York since', '2019'],
      ['camera', 'Camera set up', 'Cannon T8i'], ['sun', 'experience', 'relaxed & authentic'],
    ],
    available: 'booking now · 2026',
  };

  return (
    <section id="about" data-screen-label="04 About" style={{
      position: 'relative', minHeight: '100vh', overflow: 'hidden', background: 'var(--asphalt)',
    }}>
      <div className="tb-about-photo" aria-hidden style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${window.TB_PHOTOS.aboutCamera || 'assets/photos/taina-camera.jpg'})`,
        backgroundSize: 'cover', backgroundPosition: 'center 28%', transform: 'scale(1.02)',
      }} />
      <Grain opacity={0.055} blend="overlay" />
      <div className="tb-about-side-shade" aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(11,10,9,.94) 0%, rgba(11,10,9,.78) 38%, rgba(11,10,9,.30) 68%, rgba(11,10,9,.12) 100%)' }} />
      <div className="tb-about-edge-shade" aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,10,9,.48), transparent 28%, rgba(11,10,9,.70))' }} />

      <div className="tb-about-layout" style={{
        position: 'relative', zIndex: 2, maxWidth: 1440, minHeight: '100vh', margin: '0 auto',
        padding: '120px 32px 80px', boxSizing: 'border-box', display: 'grid',
        gridTemplateColumns: 'minmax(0, 7fr) minmax(260px, 4fr)', gap: 72, alignItems: 'end',
      }}>
        <div style={{ maxWidth: 760 }}>
          <Reveal><Eyebrow dark>{copy.eyebrow}</Eyebrow></Reveal>
          <Reveal delay={50}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(54px, 7.5vw, 116px)', lineHeight: .9, letterSpacing: '-.045em',
              color: '#F4EFE5', margin: '24px 0 30px', textShadow: '0 2px 24px rgba(0,0,0,.55)',
            }}>{copy.title}</h2>
          </Reveal>
          <div className="tb-about-copy">
            {copy.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph} delay={80 + index * 35}>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: index === 0 ? 19 : 16,
                  fontWeight: index === 0 ? 400 : 300, lineHeight: 1.62,
                  color: index === 0 ? '#F4EFE5' : 'rgba(244,239,229,.86)',
                  margin: '0 0 14px', maxWidth: '63ch', textShadow: '0 1px 12px rgba(0,0,0,.72)',
                }}>{paragraph}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={250}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 27, fontWeight: 800, color: 'var(--taxi)', margin: '25px 0 0' }}>
              {copy.closing}
            </p>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <aside className="tb-about-facts" style={{ padding: 24, background: 'rgba(11,10,9,.46)', border: '1px solid rgba(244,239,229,.2)', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginBottom: 18, color: '#F4EFE5', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase' }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: '#5EC07E', boxShadow: '0 0 0 4px rgba(94,192,126,.2)' }} />
              {copy.available}
            </div>
            {copy.facts.map(([icon, label, value]) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 12, padding: '14px 0', borderTop: '1px solid rgba(244,239,229,.16)', color: '#F4EFE5' }}>
                <Icon name={icon} size={15} />
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(244,239,229,.58)' }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, marginTop: 4 }}>{value}</div>
                </div>
              </div>
            ))}
          </aside>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .tb-about-layout { grid-template-columns: 1fr !important; gap: 38px !important; padding-top: 108px !important; }
          .tb-about-photo { background-position: 62% 22% !important; }
        }
        @media (max-width: 600px) {
          .tb-about-layout { padding: 96px 22px 64px !important; }
          .tb-about-copy p { font-size: 15px !important; }
        }
      `}</style>
    </section>
  );
}

window.About = About;
