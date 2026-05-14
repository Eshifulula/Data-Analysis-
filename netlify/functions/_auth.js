import jwt from 'jsonwebtoken';
import { json } from './_db.js';

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(user) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is required');
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

export function requireAuth(event) {
  if (!JWT_SECRET) return { error: json(500, { error: 'Server auth misconfiguration' }) };
  const h = event.headers.authorization || event.headers.Authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return { error: json(401, { error: 'Missing token' }) };
  try {
    return { user: jwt.verify(token, JWT_SECRET) };
  } catch {
    return { error: json(401, { error: 'Invalid or expired token' }) };
  }
}

export const allowRoles = (user, roles) => roles.includes(user.role);
export const phoneValid = (phone) => /^(07|01)\d{8}$/.test(String(phone || ''));
export const timeValid = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(t || ''));

export function currentShiftNairobi() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Nairobi', hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).formatToParts(now);

  const get = (t) => parts.find((p) => p.type === t).value;
  const hh = Number(get('hour'));
  const mm = Number(get('minute'));
  const minutes = hh * 60 + mm;

  const dayOpen = 4 * 60 + 45;
  const dayClose = 9 * 60;
  const nightOpen = 16 * 60 + 45;
  const nightClose = 21 * 60;

  let can_submit = false;
  let shift_type = null;
  let remaining_minutes = 0;
  let message = 'Outside allowed shift windows.';

  if (minutes >= dayOpen && minutes <= dayClose) {
    can_submit = true;
    shift_type = 'Day';
    remaining_minutes = dayClose - minutes;
    message = 'Day shift is active.';
  } else if (minutes >= nightOpen && minutes <= nightClose) {
    can_submit = true;
    shift_type = 'Night';
    remaining_minutes = nightClose - minutes;
    message = 'Night shift is active.';
  }

  return {
    can_submit,
    shift_type,
    message,
    current_time: `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}+03:00`,
    remaining_minutes,
    shift_date: `${get('year')}-${get('month')}-${get('day')}`
  };
}
