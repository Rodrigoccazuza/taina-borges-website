/* global React, Field, Button, Icon, Eyebrow, Reveal, useLanguage */
const { useState, useRef } = React;

const CONTACT_ENDPOINT = 'https://formsubmit.co/ajax/tainaborges_1@hotmail.com';

function Contact({ openBooking }) {
  const { isPortuguese } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', kind: 'portrait', when: '', note: '' });
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [honey, setHoney] = useState('');
  const openedAt = useRef(Date.now());

  const kinds = isPortuguese ? [
    { id: 'portrait', label: 'ensaio individual' }, { id: 'couple', label: 'casal' },
    { id: 'family', label: 'família' }, { id: 'other', label: 'outra ocasião' },
  ] : [
    { id: 'portrait', label: 'portrait session' }, { id: 'couple', label: 'couples' },
    { id: 'family', label: 'family' }, { id: 'other', label: 'something else' },
  ];

  const submitContact = async (event) => {
    event.preventDefault();
    setError('');

    // Very fast submissions and a filled honeypot are almost always bots.
    if (honey || Date.now() - openedAt.current < 2500) {
      setStatus('error');
      setError('Please wait a moment and try again.');
      return;
    }

    try {
      const lastSent = Number(localStorage.getItem('tb-contact-sent') || 0);
      if (Date.now() - lastSent < 60000) {
        throw new Error('Please wait one minute before sending another message.');
      }

      setStatus('sending');
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name.trim().slice(0, 100),
          email: form.email.trim().slice(0, 160),
          session_type: form.kind,
          preferred_date: form.when.trim().slice(0, 100),
          message: form.note.trim().slice(0, 3000),
          _subject: `New photography enquiry from ${form.name.trim().replace(/[\r\n]+/g, ' ').slice(0, 80)}`,
          _template: 'table',
          _honey: honey,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error(result.message || 'The message could not be sent.');
      localStorage.setItem('tb-contact-sent', String(Date.now()));
      setStatus('sent');
      setSubmitted(true);
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong. Please email me directly.');
    }
  };


  return (
    <section data-screen-label="06 Contact" id="contact" style={{ background: 'var(--paper)', padding: '140px 32px', backgroundColor: "rgb(232, 226, 213)" }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div className="tb-contact-grid" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 80, alignItems: 'start' }}>
          <div>
            <Reveal><Eyebrow>{isPortuguese ? 'contato' : 'contact'}</Eyebrow></Reveal>
            <Reveal delay={80}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: 'clamp(56px, 7vw, 112px)', lineHeight: 0.92, letterSpacing: '-0.045em',
                margin: '14px 0 22px', color: 'var(--asphalt)', textWrap: 'balance'
              }}>
                {isPortuguese ? 'vamos conversar' : 'say hi'}<span style={{ color: 'var(--taxi)' }}>.</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 19, lineHeight: 1.5, color: 'var(--fg-2)', maxInlineSize: '34ch', margin: 0 }}>
                {isPortuguese ? 'conte um pouco sobre a experiência que você imagina. respondo em até dois dias — normalmente antes.' : 'tell me a little about the experience you have in mind. i’ll get back within two days, usually sooner.'}
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <ContactLink icon="mail" href="mailto:tainaborges_1@hotmail.com">tainaborges_1@hotmail.com</ContactLink>
                <ContactLink icon="message-circle" href="https://wa.me/19175550042" external>+1 (917) 555-0042 · whatsapp</ContactLink>
                <ContactLink icon="instagram" href="https://www.instagram.com/tainaborges" external>@tainaborges</ContactLink>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div style={{ marginTop: 32, padding: 22, border: '1px solid var(--line-strong)', background: 'var(--limestone)' }}>
                <Eyebrow>{isPortuguese ? 'ou pule o formulário' : 'or skip the form'}</Eyebrow>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: 'var(--fg-2)', margin: '12px 0 18px', maxInlineSize: '32ch' }}>
                  {isPortuguese ? 'agende uma conversa de 20 minutos por vídeo para contar o que você tem em mente.' : 'book a 20-minute video call and we’ll talk through what you have in mind.'}
                </p>
                <Button variant="primary" onClick={openBooking} icon={<Icon name="calendar" size={14} />}>{isPortuguese ? 'Agendar conversa' : 'Book a call'}</Button>
              </div>
            </Reveal>
          </div>

          {submitted ?
          <Reveal>
              <div style={{ background: 'var(--asphalt)', color: 'var(--limestone)', padding: 56, borderRadius: 2 }}>
                <Eyebrow dark>{isPortuguese ? 'enviado' : 'sent'}</Eyebrow>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 64, lineHeight: 1, letterSpacing: '-0.04em', margin: '14px 0 16px' }}>
                  {isPortuguese ? 'obrigada' : 'thanks'}{form.name ? `, ${form.name.toLowerCase()}` : ''}<span style={{ color: 'var(--taxi)' }}>.</span>
                </h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 18, lineHeight: 1.5, color: '#C9C2B3', margin: 0, maxInlineSize: '36ch' }}>
                  {isPortuguese ? 'recebi sua mensagem. responderei em até dois dias — normalmente antes.' : 'i got it. i’ll write back within two days, usually sooner.'}
                </p>
              </div>
            </Reveal> :

          <Reveal delay={120}>
              <form onSubmit={submitContact}
                method="POST"
                action="https://formsubmit.co/tainaborges_1@hotmail.com"
                acceptCharset="UTF-8"
                aria-busy={status === 'sending'}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <label className="tb-honey" aria-hidden="true">
                  Leave this field empty
                  <input name="website" value={honey} onChange={(e) => setHoney(e.target.value)} tabIndex="-1" autoComplete="off" />
                </label>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>{isPortuguese ? 'qual é a ocasião?' : 'what is it for?'}</span>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                    {kinds.map((k) => {
                    const active = form.kind === k.id;
                    return (
                      <button key={k.id} type="button" onClick={() => setForm((f) => ({ ...f, kind: k.id }))} style={{
                        padding: '11px 16px', borderRadius: 2, cursor: 'pointer',
                        fontFamily: 'var(--font-sans)', fontSize: 14,
                        background: active ? 'var(--asphalt)' : 'transparent',
                        color: active ? 'var(--limestone)' : 'var(--asphalt)',
                        border: '1px solid ' + (active ? 'var(--asphalt)' : 'var(--line-strong)'),
                        transition: 'all 180ms var(--ease-out)'
                      }}>{k.label}</button>);

                  })}
                  </div>
                </div>
                <Field label={isPortuguese ? 'seu nome' : 'your name'} name="name" required maxLength={100} autoComplete="name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder={isPortuguese ? 'seu nome' : 'your name'} />
                <Field label="email" name="email" required maxLength={160} autoComplete="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="hello@example.com" type="email" />
                <Field label={isPortuguese ? 'data aproximada' : 'rough date'} name="preferred_date" maxLength={100} autoComplete="off" value={form.when} onChange={(v) => setForm((f) => ({ ...f, when: v }))} placeholder={isPortuguese ? 'junho, agosto, 14 de setembro' : 'june, august-ish, sept 14'} />
                <div />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label={isPortuguese ? 'conte um pouco sobre a ideia' : 'tell me a little about it'} name="message" required maxLength={3000} multiline value={form.note} onChange={(v) => setForm((f) => ({ ...f, note: v }))} placeholder={isPortuguese ? 'conte sobre as pessoas, o lugar e o clima que você imagina.' : 'tell me about the people, place, and feeling you have in mind.'} rows={5} />
                </div>
                {error && <p role="alert" style={{ gridColumn: '1 / -1', margin: 0, color: '#8F2F25', fontFamily: 'var(--font-sans)', fontSize: 14 }}>{error}</p>}
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.04em' }}>{isPortuguese ? 'eu mesma leio cada mensagem' : 'i read every email myself'}</span>
                  <Button type="submit" disabled={status === 'sending'} variant="accent" size="lg" icon={<Icon name="arrow-up-right" size={16} />}>{status === 'sending' ? (isPortuguese ? 'Enviando…' : 'Sending…') : (isPortuguese ? 'Enviar mensagem' : 'Send a note')}</Button>
                </div>
              </form>
            </Reveal>
          }
        </div>
      </div>
      <style>{`
        .tb-honey { position: absolute !important; left: -10000px !important; width: 1px !important; height: 1px !important; overflow: hidden !important; }
        @media (max-width: 880px) {
          .tb-contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>);

}

function ContactLink({ icon, href, external, children }) {
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} style={{
      display: 'inline-flex', alignItems: 'center', gap: 12, color: 'var(--asphalt)',
      fontFamily: 'var(--font-sans)', fontSize: 15, textDecoration: 'none',
      padding: '4px 0', borderBottom: '1px solid transparent',
      transition: 'border-color 180ms var(--ease-out), color 180ms var(--ease-out)'
    }}
    onMouseEnter={(e) => {e.currentTarget.style.borderBottomColor = 'var(--taxi)';e.currentTarget.style.color = 'var(--brick)';}}
    onMouseLeave={(e) => {e.currentTarget.style.borderBottomColor = 'transparent';e.currentTarget.style.color = 'var(--asphalt)';}}>
      
      <Icon name={icon} size={16} /> {children}
    </a>);

}

window.Contact = Contact;
