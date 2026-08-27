/* global React, Icon, Button, Eyebrow, TBMark, useLanguage */
const { useState, useMemo, useRef, useEffect } = React;

const AVAILABILITY_ENDPOINT = '/api/calcom/availability?days=21';
const BOOKING_ENDPOINT = '/api/calcom/book';
const NEW_YORK_TZ = 'America/New_York';

const keyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: NEW_YORK_TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
function dateKey(value) {
  const parts = Object.fromEntries(keyFormatter.formatToParts(new Date(value)).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
function formatTime(value, locale) {
  return new Intl.DateTimeFormat(locale, { timeZone: NEW_YORK_TZ, hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}
function buildCalendarDays(locale, slotsByDay) {
  const weekday = new Intl.DateTimeFormat(locale, { timeZone: NEW_YORK_TZ, weekday: 'short' });
  const month = new Intl.DateTimeFormat(locale, { timeZone: NEW_YORK_TZ, month: 'short' });
  const dayNumber = new Intl.DateTimeFormat(locale, { timeZone: NEW_YORK_TZ, day: 'numeric' });
  const out = [];
  const now = Date.now();
  for (let i = 1; i <= 21; i++) {
    const d = new Date(now + i * 86400000);
    const key = dateKey(d);
    out.push({ key, dow: weekday.format(d).toLowerCase().replace('.', ''), day: dayNumber.format(d), month: month.format(d).toLowerCase().replace('.', ''), slots: slotsByDay[key] || [] });
  }
  return out;
}

function BookingModal({ open, onClose }) {
  const { isPortuguese } = useLanguage();
  const locale = isPortuguese ? 'pt-BR' : 'en-US';
  const [step, setStep] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [info, setInfo] = useState({ name: '', email: '' });
  const [availability, setAvailability] = useState([]);
  const [eventType, setEventType] = useState(null);
  const [loadStatus, setLoadStatus] = useState('idle');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [honey, setHoney] = useState('');
  const openedAt = useRef(Date.now());

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    const controller = new AbortController();
    setLoadStatus('loading'); setError('');
    fetch(AVAILABILITY_ENDPOINT, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then(async response => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || 'Cal.com availability could not be loaded.');
        return result;
      })
      .then(result => {
        if (cancelled) return;
        setAvailability(Array.isArray(result.slots) ? result.slots : []);
        setEventType(result.event_type || null);
        setLoadStatus('ready');
      })
      .catch(err => {
        if (cancelled || err.name === 'AbortError') return;
        setLoadStatus('error'); setError(err.message || 'Scheduling is temporarily unavailable.');
      });
    return () => { cancelled = true; controller.abort(); };
  }, [open]);

  const slotsByDay = useMemo(() => {
    const grouped = {};
    availability.forEach(slot => {
      if (!slot?.start_time) return;
      const key = dateKey(slot.start_time);
      (grouped[key] ||= []).push(slot);
    });
    Object.values(grouped).forEach(list => list.sort((a, b) => new Date(a.start_time) - new Date(b.start_time)));
    return grouped;
  }, [availability]);

  const days = useMemo(() => buildCalendarDays(locale, slotsByDay), [locale, slotsByDay]);
  const day = selectedDay ? days.find(d => d.key === selectedDay) : null;
  const duration = Number(eventType?.duration) || 20;
  if (!open) return null;

  const reset = () => {
    setStep(0); setSelectedDay(null); setSelectedSlot(null); setInfo({ name: '', email: '' }); setAvailability([]); setEventType(null);
    setLoadStatus('idle'); setStatus('idle'); setError(''); setBooking(null); setHoney(''); openedAt.current = Date.now(); onClose();
  };

  const refreshAvailability = async () => {
    setLoadStatus('loading');
    const response = await fetch(AVAILABILITY_ENDPOINT, { headers: { Accept: 'application/json' } });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || 'Cal.com availability could not be loaded.');
    setAvailability(result.slots || []); setEventType(result.event_type || eventType); setLoadStatus('ready');
  };

  const submitBooking = async () => {
    setError('');
    if (!selectedSlot || !info.name.trim() || !/^\S+@\S+\.\S+$/.test(info.email.trim())) {
      setError(isPortuguese ? 'Adicione seu nome e um e-mail válido.' : 'Please add your name and a valid email address.'); return;
    }
    if (honey || Date.now() - openedAt.current < 1800) {
      setError(isPortuguese ? 'Aguarde um momento e tente novamente.' : 'Please wait a moment and try again.'); return;
    }
    try {
      setStatus('sending');
      const response = await fetch(BOOKING_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ start_time: selectedSlot.start_time, name: info.name.trim(), email: info.email.trim(), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || NEW_YORK_TZ })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 409 || result.error === 'SLOT_UNAVAILABLE') {
          setStatus('idle'); setStep(0); setSelectedDay(null); setSelectedSlot(null); await refreshAvailability();
          throw new Error(isPortuguese ? 'Esse horário acabou de ficar indisponível. Escolha outro horário.' : 'That time just became unavailable. Please choose another time.');
        }
        if (result.error === 'CALCOM_REQUIRED_FIELDS') throw new Error(isPortuguese ? 'Este tipo de evento possui campos obrigatórios adicionais no Cal.com.' : 'This Cal.com event type has additional required booking fields.');
        throw new Error(result.message || (isPortuguese ? 'Não foi possível concluir o agendamento.' : 'The booking could not be completed.'));
      }
      setBooking(result.booking || result); setStatus('booked');
    } catch (err) {
      if (status !== 'booked') setStatus('error');
      setError(err.message || (isPortuguese ? 'Algo deu errado. Tente novamente.' : 'Something went wrong. Please try again.'));
    }
  };

  const selectedLabel = selectedSlot ? formatTime(selectedSlot.start_time, locale) : '';

  return (
    <div className="tb-booking-backdrop" onClick={reset} style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(22,21,19,.7)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div className="tb-booking-dialog" role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()} style={{ width:'min(940px,100%)', maxHeight:'92vh', overflow:'auto', background:'var(--limestone)', borderRadius:4, boxShadow:'0 24px 60px -12px rgba(22,21,19,.5)' }}>
        <div className="tb-booking-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 28px', borderBottom:'1px solid var(--hairline)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}><TBMark size={28} variant="light"/><div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'var(--fg-3)' }}>Cal.com · {isPortuguese ? 'disponibilidade ao vivo' : 'live availability'}</div>
            <div style={{ fontFamily:'var(--font-sans)', fontSize:16, fontWeight:500 }}>{duration}-{isPortuguese ? 'minutos · tainá borges' : 'minute intro · tainá borges'}</div>
          </div></div>
          <button onClick={reset} aria-label="Close" style={{ background:'transparent', border:'none', cursor:'pointer' }}><Icon name="x" size={20}/></button>
        </div>

        {status === 'booked' ? <div style={{ padding:40, background:'var(--asphalt)', color:'var(--limestone)' }}>
          <Eyebrow dark>{isPortuguese ? 'confirmado no Cal.com' : 'confirmed in Cal.com'}</Eyebrow>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'clamp(42px,6vw,62px)', letterSpacing:'-.04em', lineHeight:1, margin:'14px 0 18px' }}>{isPortuguese ? 'está agendado' : 'you’re booked'}<span style={{ color:'var(--taxi)' }}>.</span></h3>
          <p style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:18, lineHeight:1.5, color:'#C9C2B3', margin:'0 0 24px', maxInlineSize:'42ch' }}>{isPortuguese ? 'Seu horário foi criado no Cal.com e os detalhes serão enviados para ' : 'Your booking was created in Cal.com and the details will be sent to '}<span style={{ color:'var(--taxi)' }}>{info.email}</span>. {day?.dow}, {day?.month} {day?.day} · {selectedLabel} ET.</p>
          {booking?.meeting_url && <p style={{ color:'#C9C2B3', fontSize:14 }}><a href={booking.meeting_url} target="_blank" rel="noopener noreferrer" style={{ color:'var(--taxi)' }}>{isPortuguese ? 'Abrir reunião' : 'Open meeting'}</a></p>}
          <Button variant="accent" onClick={reset}>{isPortuguese ? 'Fechar' : 'Close'}</Button>
        </div> : <>
          {loadStatus === 'loading' && <div style={{ padding:40 }}><Eyebrow>Cal.com · {isPortuguese ? 'sincronizando' : 'syncing'}</Eyebrow><h3 style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:30 }}>{isPortuguese ? 'buscando horários disponíveis…' : 'loading live availability…'}</h3></div>}
          {loadStatus === 'error' && <div style={{ padding:40 }}><Eyebrow>{isPortuguese ? 'agenda indisponível' : 'schedule unavailable'}</Eyebrow><p role="alert" style={{ color:'#8F2F25' }}>{error}</p><Button variant="accent" onClick={reset}>{isPortuguese ? 'Fechar' : 'Close'}</Button></div>}
          {loadStatus === 'ready' && step === 0 && <div className="tb-booking-step" style={{ padding:28 }}><Eyebrow>{isPortuguese ? 'passo 1 / 3 · escolha o dia' : 'step 1 / 3 · pick a day'}</Eyebrow><h3 style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:30 }}>{isPortuguese ? 'qual dia funciona melhor?' : 'which day works?'}</h3><div className="tb-cal-grid" style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8 }}>{days.map(d=>{const disabled=!d.slots.length;return <button key={d.key} disabled={disabled} onClick={()=>{setSelectedDay(d.key);setSelectedSlot(null);setStep(1);setError('')}} style={{ padding:'14px 8px', border:'1px solid var(--line-strong)', background:disabled?'transparent':'var(--paper)', opacity:disabled?.35:1, cursor:disabled?'not-allowed':'pointer' }}><span style={{ display:'block', fontFamily:'var(--font-mono)', fontSize:10 }}>{d.dow}</span><span style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:900, fontSize:24 }}>{d.day}</span><span style={{ display:'block', fontFamily:'var(--font-mono)', fontSize:10 }}>{d.month}</span></button>})}</div><p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-3)', marginTop:24 }}>{isPortuguese ? 'disponibilidade ao vivo do Cal.com · horário de Nova York' : 'live Cal.com availability · New York time'}</p></div>}
          {loadStatus === 'ready' && step === 1 && day && <div className="tb-booking-step" style={{ padding:28 }}><button onClick={()=>setStep(0)} className="tb-booking-back"><Icon name="chevron-left" size={12}/> {isPortuguese?'voltar':'back'}</button><Eyebrow>{isPortuguese?'passo 2 / 3 · escolha o horário':'step 2 / 3 · pick a time'}</Eyebrow><h3 style={{ fontFamily:'var(--font-sans)', fontWeight:300, fontSize:30 }}>{day.dow}, {day.month} {day.day}</h3><div className="tb-time-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>{day.slots.map(slot=><button key={slot.start_time} onClick={()=>{setSelectedSlot(slot);setStep(2);setError('')}} style={{ padding:'14px 8px', borderRadius:999, border:'1px solid var(--line-strong)', background:'var(--paper)', cursor:'pointer' }}>{formatTime(slot.start_time,locale)}</button>)}</div></div>}
          {loadStatus === 'ready' && step === 2 && selectedSlot && <div className="tb-booking-step" style={{ padding:28 }}><button onClick={()=>setStep(1)} className="tb-booking-back"><Icon name="chevron-left" size={12}/> {isPortuguese?'voltar':'back'}</button><Eyebrow>{isPortuguese?'passo 3 / 3 · confirmar':'step 3 / 3 · confirm'}</Eyebrow><h3 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'clamp(36px,4vw,52px)' }}>{day?.dow}, {day?.month} {day?.day} · {selectedLabel}</h3><div className="tb-booking-fields" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}><input value={info.name} onChange={e=>setInfo({...info,name:e.target.value})} placeholder={isPortuguese?'seu nome':'your name'} style={inpStyle}/><input type="email" value={info.email} onChange={e=>setInfo({...info,email:e.target.value})} placeholder="email" style={inpStyle}/></div><label className="tb-honey" aria-hidden="true">Leave this empty<input value={honey} onChange={e=>setHoney(e.target.value)} tabIndex="-1" autoComplete="off"/></label>{error&&<p role="alert" style={{ color:'#8F2F25' }}>{error}</p>}<div style={{ display:'flex', justifyContent:'flex-end', marginTop:24 }}><Button variant="accent" size="lg" disabled={status==='sending'} onClick={submitBooking}>{status==='sending'?(isPortuguese?'Agendando…':'Booking…'):(isPortuguese?'Confirmar horário':'Confirm booking')}</Button></div></div>}
        </>}
      </div>
      <style>{`.tb-booking-back{background:transparent;border:0;cursor:pointer;color:var(--fg-3);font-family:var(--font-mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;display:inline-flex;align-items:center;gap:6px;margin-bottom:16px;padding:0}.tb-honey{position:absolute!important;left:-10000px!important;width:1px!important;height:1px!important;overflow:hidden!important}@media(max-width:720px){.tb-booking-backdrop{padding:10px!important}.tb-booking-header{padding:16px 18px!important}.tb-booking-step{padding:22px 18px!important}.tb-cal-grid{grid-template-columns:repeat(3,1fr)!important}.tb-time-grid{grid-template-columns:repeat(2,1fr)!important}.tb-booking-fields{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

const inpStyle={fontFamily:'var(--font-sans)',fontWeight:400,fontSize:14,padding:'13px 14px',background:'var(--paper)',border:'1px solid var(--line-strong)',borderRadius:2,color:'var(--fg-1)',outline:'none',width:'100%',boxSizing:'border-box'};
window.BookingModal=BookingModal;
