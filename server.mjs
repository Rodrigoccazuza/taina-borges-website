import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT || 3000);
const CALENDLY_API = 'https://api.calendly.com';
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

function getToken() {
  const token = process.env.CALENDLY_TOKEN?.trim();
  if (!token) {
    const err = new Error('Calendly is not configured on the server.');
    err.code = 'CALENDLY_NOT_CONFIGURED';
    throw err;
  }
  return token;
}

async function calendly(endpoint, options = {}) {
  const token = getToken();
  const response = await fetch(`${CALENDLY_API}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data?.message || data?.title || `Calendly request failed (${response.status})`);
    err.status = response.status;
    err.details = data;
    throw err;
  }
  return data;
}

let accountCache = null;
let accountCacheAt = 0;
async function getAccountData() {
  if (accountCache && Date.now() - accountCacheAt < 5 * 60 * 1000) return accountCache;
  const me = await calendly('/users/me');
  const userUri = me?.resource?.uri;
  if (!userUri) throw new Error('Calendly did not return a user URI.');
  const params = new URLSearchParams({ user: userUri, active: 'true', count: '100' });
  const types = await calendly(`/event_types?${params}`);
  const activeTypes = Array.isArray(types?.collection) ? types.collection.filter(t => t.active !== false) : [];
  if (!activeTypes.length) {
    const err = new Error('No active Calendly event type was found.');
    err.code = 'NO_ACTIVE_EVENT_TYPE';
    throw err;
  }

  const pinned = process.env.CALENDLY_EVENT_TYPE_URI?.trim();
  let eventType = pinned ? activeTypes.find(t => t.uri === pinned) : null;
  if (!eventType) eventType = activeTypes.find(t => Number(t.duration) === 20) || activeTypes[0];

  accountCache = { user: me.resource, eventTypes: activeTypes, eventType };
  accountCacheAt = Date.now();
  return accountCache;
}

function publicEventType(eventType) {
  return {
    uri: eventType.uri,
    name: eventType.name,
    duration: eventType.duration,
    scheduling_url: eventType.scheduling_url || eventType.scheduling_uri || null,
    locations: Array.isArray(eventType.locations) ? eventType.locations.map(({ kind, location }) => ({ kind, location: location || null })) : []
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

function chooseLocation(eventType) {
  const locations = Array.isArray(eventType.locations) ? eventType.locations.filter(Boolean) : [];
  if (!locations.length) return null;
  if (locations.length > 1) {
    const err = new Error('This Calendly event type offers multiple locations and needs a location choice.');
    err.code = 'LOCATION_SELECTION_REQUIRED';
    throw err;
  }
  const item = locations[0];
  if (!item?.kind) return null;
  if (['ask_invitee', 'outbound_call'].includes(item.kind)) {
    const err = new Error('This Calendly event type needs location information from the invitee.');
    err.code = 'LOCATION_INPUT_REQUIRED';
    throw err;
  }
  return { kind: item.kind, ...(item.location ? { location: item.location } : {}) };
}

async function handleAvailability(req, res, url) {
  const { eventType } = await getAccountData();
  const requestedDays = Math.max(1, Math.min(31, Number(url.searchParams.get('days') || 21)));
  const start = new Date(Date.now() + 60 * 1000);
  const end = new Date(start.getTime() + requestedDays * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({ event_type: eventType.uri, start_time: start.toISOString(), end_time: end.toISOString() });
  const data = await calendly(`/event_type_available_times?${params}`);
  const slots = (data?.collection || []).map(slot => ({
    start_time: slot.start_time,
    status: slot.status || 'available',
    invitees_remaining: slot.invitees_remaining ?? null
  }));
  json(res, 200, { timezone: NEW_YORK_TZ, event_type: publicEventType(eventType), slots });
}

async function handleBook(req, res) {
  const body = await readJsonBody(req);
  const { eventTypes, eventType: defaultType } = await getAccountData();
  const eventType = body.event_type ? eventTypes.find(t => t.uri === body.event_type) : defaultType;
  if (!eventType) return json(res, 400, { error: 'INVALID_EVENT_TYPE', message: 'That Calendly event type is not available.' });

  const name = String(body.name || '').trim().slice(0, 100);
  const email = String(body.email || '').trim().slice(0, 160);
  const startTime = String(body.start_time || '').trim();
  const timezone = String(body.timezone || NEW_YORK_TZ).trim().slice(0, 100);
  const note = String(body.note || '').trim().slice(0, 2000);
  if (!name || !validEmail(email) || !startTime || Number.isNaN(Date.parse(startTime))) {
    return json(res, 400, { error: 'INVALID_BOOKING_DATA', message: 'Name, valid email, and start time are required.' });
  }

  const location = chooseLocation(eventType);
  const payload = {
    event_type: eventType.uri,
    start_time: new Date(startTime).toISOString(),
    invitee: { name, email, timezone },
    tracking: { utm_source: 'taina-borges-website', utm_medium: 'website', utm_campaign: 'booking-modal' }
  };
  if (location) payload.location = location;
  if (note) payload.questions_and_answers = [{ question: 'Anything you want me to know first?', answer: note, position: 0 }];

  try {
    const booking = await calendly('/invitees', { method: 'POST', body: JSON.stringify(payload) });
    json(res, 201, {
      booked: true,
      timezone: booking?.resource?.timezone || timezone,
      event: booking?.resource?.event || null,
      cancel_url: booking?.resource?.cancel_url || null,
      reschedule_url: booking?.resource?.reschedule_url || null,
      event_type: publicEventType(eventType)
    });
  } catch (err) {
    if (err.status === 409 || err.status === 422) {
      return json(res, 409, { error: 'SLOT_UNAVAILABLE', message: 'That time is no longer available. Please choose another time.' });
    }
    throw err;
  }
}

async function handleApi(req, res, url) {
  try {
    if (req.method === 'GET' && url.pathname === '/api/calendly/health') {
      const { eventType } = await getAccountData();
      return json(res, 200, { ok: true, configured: true, event_type: publicEventType(eventType) });
    }
    if (req.method === 'GET' && url.pathname === '/api/calendly/availability') return await handleAvailability(req, res, url);
    if (req.method === 'POST' && url.pathname === '/api/calendly/book') return await handleBook(req, res);
    return json(res, 404, { error: 'NOT_FOUND' });
  } catch (err) {
    console.error('[Calendly API]', err.code || err.status || 'ERROR', err.message);
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 502;
    return json(res, status, {
      error: err.code || 'CALENDLY_API_ERROR',
      message: err.code === 'CALENDLY_NOT_CONFIGURED' ? 'Scheduling is temporarily unavailable.' : err.message
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
  if (url.pathname.startsWith('/api/calendly/')) return handleApi(req, res, url);
  return serveStatic(req, res, url);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Tainá Borges Photography server listening on port ${PORT}`);
  console.log(`Calendly integration: ${process.env.CALENDLY_TOKEN ? 'configured' : 'missing CALENDLY_TOKEN'}`);
});
