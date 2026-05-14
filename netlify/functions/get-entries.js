import { json, sql } from './_db.js';
import { requireAuth } from './_auth.js';

export async function handler(event) {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });
  const auth = requireAuth(event);
  if (auth.error) return auth.error;

  try {
    const q = event.queryStringParameters || {};
    const page = Math.max(parseInt(q.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(q.limit || '20', 10), 1), 100);
    const offset = (page - 1) * limit;

    const filters = [];
    if (q.start_date) filters.push(`s.shift_date >= '${q.start_date}'`);
    if (q.end_date) filters.push(`s.shift_date <= '${q.end_date}'`);
    if (q.shift && ['Day', 'Night'].includes(q.shift)) filters.push(`s.shift_type = '${q.shift}'`);
    if (q.employee) filters.push(`LOWER(s.employee_name) LIKE LOWER('%${q.employee.replace(/'/g, "''")}%')`);
    if (q.location) filters.push(`LOWER(s.location) LIKE LOWER('%${q.location.replace(/'/g, "''")}%')`);

    const includeDeleted = auth.user.role === 'admin' && q.include_deleted === 'true';
    if (!includeDeleted) filters.push('s.is_deleted = false');
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const rows = await sql(`SELECT s.*, u.username AS submitted_by_name FROM shifts s LEFT JOIN users u ON u.id=s.submitted_by ${where} ORDER BY s.created_at DESC LIMIT ${limit} OFFSET ${offset}`);
    const totalResult = await sql(`SELECT COUNT(*)::int AS c FROM shifts s ${where}`);
    const total = totalResult[0]?.c || 0;

    return json(200, { data: rows, total, page, total_pages: Math.max(1, Math.ceil(total / limit)) });
  } catch {
    return json(500, { error: 'Failed to fetch entries' });
  }
}
