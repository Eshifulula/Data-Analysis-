import { json, sql, parseBody } from './_db.js';
import { requireAuth, allowRoles, phoneValid, timeValid } from './_auth.js';

export async function handler(event){
  if(event.httpMethod!=='PUT') return json(405,{error:'Method not allowed'});
  const auth=requireAuth(event); if(auth.error) return auth.error;
  if(!allowRoles(auth.user,['admin','supervisor'])) return json(403,{error:'Forbidden'});
  const body=parseBody(event); if(!body?.id) return json(400,{error:'id required'});
  const rows=await sql`SELECT * FROM shifts WHERE id=${body.id} LIMIT 1`; const old=rows[0]; if(!old) return json(404,{error:'Not found'});
  if(auth.user.role==='supervisor'){
    const allowed=(Date.now()-new Date(old.created_at).getTime())<=24*60*60*1000;
    if(!allowed) return json(403,{error:'Supervisors can edit only within 24 hours'});
  }
  if(body.phone_number && !phoneValid(body.phone_number)) return json(400,{error:'Invalid phone number'});
  if(body.check_in_time && !timeValid(body.check_in_time)) return json(400,{error:'Invalid check-in time'});
  const updated=await sql`UPDATE shifts SET employee_name=COALESCE(${body.employee_name},employee_name), check_in_time=COALESCE(${body.check_in_time},check_in_time), phone_number=COALESCE(${body.phone_number},phone_number), location=COALESCE(${body.location},location), notes=COALESCE(${body.notes},notes), updated_at=NOW() WHERE id=${body.id} RETURNING *`;
  await sql`INSERT INTO audit_logs (user_id,action,table_name,record_id,old_data,new_data,ip_address,user_agent) VALUES (${auth.user.id},'edit','shifts',${body.id},${JSON.stringify(old)}::jsonb,${JSON.stringify(updated[0])}::jsonb,${event.headers['x-forwarded-for']||''},${event.headers['user-agent']||''})`;
  return json(200,{success:true,data:updated[0]});
}
