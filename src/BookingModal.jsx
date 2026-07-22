/* global React, Icon, Button, Eyebrow, TBMark, useLanguage */
const { useState, useMemo, useRef } = React;

const BOOKING_ENDPOINT = 'https://formsubmit.co/ajax/tainaborgesphoto@outlook.com';

function BookingModal({ open, onClose }) {
  const { isPortuguese } = useLanguage();
  const [step, setStep] = useState(0);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [info, setInfo] = useState({ name: '', email: '', note: '' });
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [honey, setHoney] = useState('');
  const openedAt = useRef(Date.now());

  const days = useMemo(() => {
    const out = []; const start = new Date();
    start.setHours(12, 0, 0, 0);
    start.setDate(start.getDate() + 1);
    for (let i = 0; i < 21; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const dow = (isPortuguese ? ['dom','seg','ter','qua','qui','sex','sáb'] : ['sun','mon','tue','wed','thu','fri','sat'])[d.getDay()];
      const disabled = d.getDay() === 0 || d.getDay() === 6;
      out.push({ d, dow, day: d.getDate(), month: d.toLocaleString(isPortuguese ? 'pt-BR' : 'en-US', { month: 'short' }).toLowerCase().replace('.', ''), disabled });
    }
    return out;
  }, [isPortuguese]);

  const times = ['09:30', '10:00', '11:00', '13:30', '14:00', '15:30', '16:00', '17:00'];

  if (!open) return null;

  const reset = () => { setStep(0); setDate(null); setTime(null); setConfirmed(false); setStatus('idle'); setError(''); setHoney(''); setInfo({ name: '', email: '', note: '' }); openedAt.current = Date.now(); onClose(); };

  const submitBooking = async () => {
    setError('');
    const selectedDay = days[date];
    if (!selectedDay || !time || !info.name.trim() || !/^\S+@\S+\.\S+$/.test(info.email.trim())) {
      setError('Please add your name and a valid email address.');
      return;
    }
    if (honey || Date.now() - openedAt.current < 2500) {
      setError('Please wait a moment and try again.');
      return;
    }
    try {
      const lastSent = Number(localStorage.getItem('tb-booking-sent') || 0);
      if (Date.now() - lastSent < 60000) throw new Error('Please wait one minute before sending another request.');
      setStatus('sending');
      const requestedDate = selectedDay.d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      const response = await fetch(BOOKING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: info.name.trim().slice(0, 100),
          email: info.email.trim().slice(0, 160),
          request_type: '20-minute introductory Zoom call',
          requested_date: requestedDate,
          requested_time: `${time} Eastern Time`,
          message: info.note.trim().slice(0, 2000),
          _subject: `New call request from ${info.name.trim().replace(/[\r\n]+/g, ' ').slice(0, 80)}`,
          _template: 'table',
          _honey: honey,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error(result.message || 'The booking request could not be sent.');
      localStorage.setItem('tb-booking-sent', String(Date.now()));
      setStatus('sent');
      setConfirmed(true);
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong. Please email me directly.');
    }
  };

  return (
    <div className="tb-booking-backdrop" style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(22,21,19,0.7)', animation: 'tbFadeIn 200ms var(--ease-out)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={reset}>
      <div className="tb-booking-dialog" onClick={e => e.stopPropagation()} style={{
        width: 'min(940px, 100%)', maxHeight: '92vh', overflow: 'auto',
        background: 'var(--limestone)', borderRadius: 4,
        boxShadow: '0 24px 60px -12px rgba(22,21,19,0.5)',
        animation: 'tbModalIn 320ms var(--ease-cinematic)',
      }}>
        <div className="tb-booking-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid var(--hairline)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <TBMark size={28} variant="light" />
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>{isPortuguese ? 'agendar conversa · vídeo' : 'book a call · video'}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 500, color: 'var(--asphalt)' }}>{isPortuguese ? 'conversa de 20 minutos · tainá borges' : '20-minute intro · tainá borges'}</div>
            </div>
          </div>
          <button onClick={reset} aria-label="Close booking request" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-2)', display: 'inline-flex' }}><Icon name="x" size={20}/></button>
        </div>

        {confirmed ? (
          <div style={{ padding: 40, background: 'var(--asphalt)', color: 'var(--limestone)' }}>
            <Eyebrow dark>{isPortuguese ? 'confirmado' : 'confirmed'}</Eyebrow>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 56, letterSpacing: '-0.04em', lineHeight: 1, margin: '14px 0 18px' }}>
              {isPortuguese ? 'pedido enviado' : 'you’re on the list'}<span style={{ color: 'var(--taxi)' }}>.</span>
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 18, lineHeight: 1.5, color: '#C9C2B3', margin: '0 0 24px', maxInlineSize: '36ch' }}>
              your request was sent. i\u2019ll confirm availability and send details to <span style={{ color: 'var(--taxi)' }}>{info.email || 'your email'}</span>. requested: {days[date]?.dow}, {days[date]?.month} {days[date]?.day} at {time} eastern.
            </p>
            <Button variant="accent" onClick={reset} icon={<Icon name="x" size={14}/>}>{isPortuguese ? 'Fechar' : 'Close'}</Button>
          </div>
        ) : (
          <>
            {step === 0 && (
              <div className="tb-booking-step" style={{ padding: 28 }}>
                <Eyebrow>{isPortuguese ? 'passo 1 / 3 · escolha o dia' : 'step 1 / 3 · pick a day'}</Eyebrow>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 30, letterSpacing: '-0.018em', margin: '12px 0 26px' }}>{isPortuguese ? 'qual dia funciona melhor?' : 'which day works?'}</h3>
                <div className="tb-cal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                  {days.map((d, i) => {
                    const active = date === i;
                    return (
                      <button key={i} disabled={d.disabled} onClick={() => { setDate(i); setStep(1); }} style={{
                        padding: '14px 8px', border: '1px solid ' + (active ? 'var(--asphalt)' : 'var(--line-strong)'),
                        background: active ? 'var(--asphalt)' : (d.disabled ? 'transparent' : 'var(--paper)'),
                        color: d.disabled ? 'var(--fg-4)' : (active ? 'var(--limestone)' : 'var(--asphalt)'),
                        cursor: d.disabled ? 'not-allowed' : 'pointer', borderRadius: 2,
                        display: 'flex', flexDirection: 'column', gap: 4,
                        opacity: d.disabled ? 0.4 : 1,
                        transition: 'all 180ms var(--ease-out)',
                      }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{d.dow}</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, letterSpacing: '-0.03em', lineHeight: 1 }}>{d.day}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7 }}>{d.month}</span>
                      </button>
                    );
                  })}
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.04em', margin: '24px 0 0' }}>{isPortuguese ? 'todos os horários são de nova york' : 'all times are eastern (new york)'}</p>
              </div>
            )}

            {step === 1 && date != null && (
              <div className="tb-booking-step" style={{ padding: 28 }}>
                <button onClick={() => setStep(0)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16, padding: 0 }}><Icon name="chevron-left" size={12}/> {isPortuguese ? 'voltar' : 'back'}</button>
                <Eyebrow>{isPortuguese ? 'passo 2 / 3 · escolha o horário' : 'step 2 / 3 · pick a time'}</Eyebrow>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: 30, letterSpacing: '-0.018em', margin: '12px 0 26px' }}>
                  {days[date].dow}, {days[date].month} {days[date].day}
                </h3>
                <div className="tb-time-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {times.map(t => (
                    <button key={t} onClick={() => { setTime(t); setStep(2); }} style={{
                      padding: '14px 8px', borderRadius: 999,
                      border: '1px solid var(--line-strong)',
                      background: 'var(--paper)', color: 'var(--asphalt)',
                      cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.04em',
                      transition: 'all 180ms var(--ease-out)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--asphalt)'; e.currentTarget.style.color = 'var(--limestone)'; e.currentTarget.style.borderColor = 'var(--asphalt)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--paper)'; e.currentTarget.style.color = 'var(--asphalt)'; e.currentTarget.style.borderColor = 'var(--line-strong)'; }}
                    >{t}</button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && date != null && time && (
              <div className="tb-booking-step" style={{ padding: 28 }}>
                <button onClick={() => setStep(1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16, padding: 0 }}><Icon name="chevron-left" size={12}/> {isPortuguese ? 'voltar' : 'back'}</button>
                <Eyebrow>{isPortuguese ? 'passo 3 / 3 · confirmar' : 'step 3 / 3 · confirm'}</Eyebrow>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 4vw, 52px)', letterSpacing: '-0.04em', lineHeight: 1, margin: '12px 0 24px' }}>
                  {days[date].dow}, {days[date].month} {days[date].day} · {time}
                </h3>
                <div className="tb-booking-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <input name="name" required maxLength="100" autoComplete="name" value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })} placeholder={isPortuguese ? 'seu nome' : 'your name'} style={inpStyle}/>
                  <input name="email" required type="email" maxLength="160" autoComplete="email" value={info.email} onChange={e => setInfo({ ...info, email: e.target.value })} placeholder="email" style={inpStyle}/>
                </div>
                <textarea name="message" maxLength="2000" value={info.note} onChange={e => setInfo({ ...info, note: e.target.value })} placeholder={isPortuguese ? 'algo que você queira me contar antes?' : 'anything you want me to know first?'} rows={3} style={{ ...inpStyle, width: '100%', boxSizing: 'border-box', resize: 'vertical' }}/>
                <label className="tb-honey" aria-hidden="true">Leave this empty<input value={honey} onChange={e => setHoney(e.target.value)} tabIndex="-1" autoComplete="off" /></label>
                {error && <p role="alert" style={{ margin: '12px 0 0', color: '#8F2F25', fontFamily: 'var(--font-sans)', fontSize: 14 }}>{error}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{isPortuguese ? 'a disponibilidade será confirmada por e-mail' : 'availability is confirmed by email'}</span>
                  <Button variant="accent" size="lg" disabled={status === 'sending'} onClick={submitBooking} icon={<Icon name="arrow-up-right" size={14}/>}>{status === 'sending' ? (isPortuguese ? 'Enviando…' : 'Sending…') : (isPortuguese ? 'Solicitar este horário' : 'Request this time')}</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes tbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes tbModalIn { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        .tb-honey { position: absolute !important; left: -10000px !important; width: 1px !important; height: 1px !important; overflow: hidden !important; }
        @media (max-width: 600px) {
          .tb-cal-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

const inpStyle = { padding: '12px 14px', background: 'var(--paper)', border: '1px solid var(--line-strong)', borderRadius: 2, fontFamily: 'var(--font-sans)', fontSize: 14, outline: 'none' };

window.BookingModal = BookingModal;
