import { json, sql } from './_db.js';
import { requireAuth } from './_auth.js';

export async function handler(event) {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });
  const auth = requireAuth(event);
  if (auth.error) return auth.error;
  try {
    const rows = await sql`SELECT shift_date,shift_type,employee_name,check_in_time,phone_number,location,is_deleted FROM shifts ORDER BY shift_date DESC`;
    const header = 'shift_date,shift_type,employee_name,check_in_time,phone_number,location,is_deleted';
    const csv = [header, ...rows.map((r) => [r.shift_date, r.shift_type, `"${String(r.employee_name).replaceAll('"','""')}"`, r.check_in_time, r.phone_number, `"${String(r.location).replaceAll('"','""')}"`, r.is_deleted].join(','))].join('\n');
    return { statusCode: 200, headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="shift-records.csv"' }, body: csv };
  } catch {
    return json(500, { error: 'Failed to export CSV' });
  }
}
