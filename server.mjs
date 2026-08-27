import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT || 3000);
const CAL_API = 'https://api.cal.com';
const NEW_YORK_TZ = 'America/New_York';
const MAX_BODY_BYTES = 32 * 1024;

const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.woff': 'font/woff', '.woff2': 'font/woff2'
};

function json(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  });
  res.end(JSON.stringify(payload));
}

function getApiKey() {
  const key = process.env.CALCOM_API_KEY?.trim();
  if (!key) {
    const err = new Error('Cal.com is not configured on the server.');
    err.code = 'CALCOM_NOT_CONFIGURED';
    throw err;
  }
  return key;
}

async function cal(endpoint, { version, method = 'GET', body } = {}) {
  const response = await fetch(`${CAL_API}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      Accept: 'application/json',
      ...(version ? { 'cal-api-version': version } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.status === 'error') {
    const err = new Error(data?.error?.message || data?.message || data?.error || `Cal.com request failed (${response.status})`);
    err.status = response.status;
    err.details = data;
    throw err;
  }
  return data;
}

let eventTypeCache = null;
let eventTypeCacheAt = 0;
async function getEventType() {
  if (eventTypeCache && Date.now() - eventTypeCacheAt < 5 * 60 * 1000) return eventTypeCache;
  const result = await cal('/v2/event-types', { version: '2024-06-14' });
  const types = Array.isArray(result?.data) ? result.data : [];
  if (!types.length) {
    const err = new Error('No Cal.com event type was found for this API key.');
    err.code = 'NO_CALCOM_EVENT_TYPE';
    throw err;
  }

  const pinnedId = Number(process.env.CALCOM_EVENT_TYPE_ID || 0);
  let eventType = pinnedId ? types.find(t => Number(t.id) === pinnedId) : null;
  if (pinnedId && !eventType) {
    const err = new Error('CALCOM_EVENT_TYPE_ID does not match an event type available to this API key.');
    err.code = 'INVALID_CALCOM_EVENT_TYPE_ID';
    throw err;
  }
  if (!eventType) eventType = types.find(t => Number(t.lengthInMinutes) === 20) || types[0];

  eventTypeCache = eventType;
  eventTypeCacheAt = Date.now();
  return eventType;
}

function publicEventType(eventType) {
  const requiredCustomFields = Array.isArray(eventType?.bookingFields)
    ? eventType.bookingFields
        .filter(f => f?.required && !['name', 'email'].includes(f?.slug) && f?.isDefault !== true)
        .map(f => ({ slug: f.slug, label: f.label || f.slug, type: f.type || 'text' }))
    : [];
  return {
    id: eventType.id,
    title: eventType.title,
    slug: eventType.slug,
    duration: eventType.lengthInMinutes,
    locations: eventType.locations || [],
    required_fields: requiredCustomFields
  };
}

async function readJsonBody(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const err = new Error('Request body is too large.');
      err.status = 413;
      throw err;
    }
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch {
    const err = new Error('Invalid JSON body.');
    err.status = 400;
    throw err;
  }
}

function validEmail(value) {
  return typeof value === 'string' && /^\S+@\S+\.\S+$/.test(value) && value.length <= 160;
}

function ymd(date) {
  return date.toISOString().slice(0, 10);
}

async function handleAvailability(req, res, url) {
  const eventType = await getEventType();
  const days = Math.max(1, Math.min(31, Number(url.searchParams.get('days') || 21)));
  const start = new Date();
  start.setUTCDate(start.getUTCDate() + 1);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + days);

  const params = new URLSearchParams({
    eventTypeId: String(eventType.id),
    start: ymd(start),
    end: ymd(end),
    timeZone: NEW_YORK_TZ
  });
  const result = await cal(`/v2/slots?${params}`, { version: '2024-09-04' });
  const grouped = result?.data && typeof result.data === 'object' ? result.data : {};
  const slots = [];
  for (const values of Object.values(grouped)) {
    if (!Array.isArray(values)) continue;
    for (const item of values) {
      const startTime = typeof item === 'string' ? item : item?.start;
      if (startTime) slots.push({ start_time: startTime, status: 'available' });
    }
  }

  return json(res, 200, {
    timezone: NEW_YORK_TZ,
    event_type: publicEventType(eventType),
    slots
  });
}

async function handleBook(req, res) {
  const body = await readJsonBody(req);
  const eventType = await getEventType();
  const name = String(body.name || '').trim().slice(0, 100);
  const email = String(body.email || '').trim().slice(0, 160);
  const start = String(body.start_time || '').trim();
  const timeZone = String(body.timezone || NEW_YORK_TZ).trim().slice(0, 100);

  if (!name || !validEmail(email) || !start || Number.isNaN(Date.parse(start))) {
    return json(res, 400, { error: 'INVALID_BOOKING_DATA', message: 'Name, valid email, and start time are required.' });
  }

  const required = publicEventType(eventType).required_fields;
  if (required.length) {
    return json(res, 400, {
      error: 'CALCOM_REQUIRED_FIELDS',
      message: 'This Cal.com event type contains required custom booking fields that are not yet collected by the website.',
      fields: required
    });
  }

  const payload = {
    start: new Date(start).toISOString(),
    attendee: {
      name,
      email,
      timeZone,
      language: 'en'
    },
    eventTypeId: Number(eventType.id),
    metadata: {
      source: 'taina-borges-website'
    }
  };

  try {
    const result = await cal('/v2/bookings', {
      version: '2026-02-25',
      method: 'POST',
      body: payload
    });
    const booking = result?.data || {};
    return json(res, 201, {
      booked: true,
      booking: {
        id: booking.id || null,
        uid: booking.uid || null,
        status: booking.status || null,
        start: booking.start || payload.start,
        end: booking.end || null,
        title: booking.title || eventType.title || null,
        meeting_url: booking.meetingUrl || booking.location || null
      },
      event_type: publicEventType(eventType)
    });
  } catch (err) {
    if ([400, 409, 422].includes(err.status)) {
      const text = JSON.stringify(err.details || {}).toLowerCase();
      if (text.includes('available') || text.includes('conflict') || text.includes('slot')) {
        return json(res, 409, { error: 'SLOT_UNAVAILABLE', message: 'That time is no longer available. Please choose another time.' });
      }
      return json(res, 400, {
        error: 'CALCOM_VALIDATION_ERROR',
        message: err.message || 'Cal.com rejected the booking details.',
        calcom: err.details || null
      });
    }
    throw err;
  }
}

async function handleApi(req, res, url) {
  try {
    if (req.method === 'GET' && url.pathname === '/api/calcom/health') {
      const eventType = await getEventType();
      return json(res, 200, { ok: true, configured: true, provider: 'cal.com', event_type: publicEventType(eventType) });
    }
    if (req.method === 'GET' && url.pathname === '/api/calcom/availability') return handleAvailability(req, res, url);
    if (req.method === 'POST' && url.pathname === '/api/calcom/book') return handleBook(req, res);
    return json(res, 404, { error: 'NOT_FOUND' });
  } catch (err) {
    console.error('[Cal.com API]', err.code || err.status || 'ERROR', err.message, err.details || '');
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 502;
    return json(res, status, {
      error: err.code || 'CALCOM_API_ERROR',
      message: err.code === 'CALCOM_NOT_CONFIGURED' ? 'Scheduling is temporarily unavailable because CALCOM_API_KEY is missing.' : err.message,
      calcom_status: err.status || null
    });
  }
}

async function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  const resolved = path.normalize(path.join(publicDir, pathname));
  if (!resolved.startsWith(publicDir)) { res.writeHead(403); return res.end('Forbidden'); }
  try {
    let target = resolved;
    const info = await stat(target).catch(() => null);
    if (info?.isDirectory()) target = path.join(target, 'index.html');
    const body = await readFile(target);
    const ext = path.extname(target).toLowerCase();
    const cache = ext === '.html' ? 'no-cache' : (['.jpg', '.jpeg', '.png', '.webp', '.woff', '.woff2'].includes(ext) ? 'public, max-age=2592000' : 'public, max-age=3600');
    res.writeHead(200, {
      'Content-Type': mime[ext] || 'application/octet-stream',
      'Cache-Control': cache,
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/calcom/')) return handleApi(req, res, url);
  return serveStatic(req, res, url);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Tainá Borges Photography server listening on port ${PORT}`);
  console.log(`Cal.com integration: ${process.env.CALCOM_API_KEY ? 'configured' : 'missing CALCOM_API_KEY'}`);
});
