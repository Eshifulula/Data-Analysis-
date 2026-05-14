import { json, sql } from './_db.js';
import { requireAuth } from './_auth.js';

export async function handler(event) {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });
  const auth = requireAuth(event);
  if (auth.error) return auth.error;

  const q = event.queryStringParameters || {};
  const type = q.type || 'daily';

  let where = 'WHERE s.is_deleted=false';
  if (type === 'daily' && q.date) where += ` AND s.shift_date='${q.date}'`;
  if (type === 'monthly' && q.month) where += ` AND to_char(s.shift_date,'YYYY-MM')='${q.month}'`;
  if (type === 'weekly' && q.start_date && q.end_date) where += ` AND s.shift_date BETWEEN '${q.start_date}' AND '${q.end_date}'`;

  try {
    const summary = await sql(`SELECT COUNT(*)::int total_entries, COUNT(DISTINCT lower(employee_name))::int unique_workers FROM shifts s ${where}`);
    const rows = await sql(`SELECT s.shift_date,s.shift_type,s.employee_name,s.check_in_time,s.phone_number,s.location FROM shifts s ${where} ORDER BY s.shift_date DESC, s.shift_type`);
    return json(200, { type, summary: summary[0], rows });
  } catch {
    return json(500, { error: 'Failed to build report' });
  }
}
