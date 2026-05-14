import { json, sql, parseBody } from './_db.js';
import { requireAuth, allowRoles } from './_auth.js';

export async function handler(event){
  if(event.httpMethod!=='DELETE') return json(405,{error:'Method not allowed'});
  const auth=requireAuth(event); if(auth.error) return auth.error;
  if(!allowRoles(auth.user,['admin'])) return json(403,{error:'Forbidden'});
  const body=parseBody(event); if(!body?.id) return json(400,{error:'id required'});
  const oldRows=await sql`SELECT * FROM shifts WHERE id=${body.id} LIMIT 1`; const old=oldRows[0]; if(!old) return json(404,{error:'Not found'});
  const rows=await sql`UPDATE shifts SET is_deleted=true,deleted_at=NOW(),deleted_by=${auth.user.id},updated_at=NOW() WHERE id=${body.id} RETURNING *`;
  await sql`INSERT INTO audit_logs (user_id,action,table_name,record_id,old_data,new_data,ip_address,user_agent) VALUES (${auth.user.id},'delete','shifts',${body.id},${JSON.stringify(old)}::jsonb,${JSON.stringify(rows[0])}::jsonb,${event.headers['x-forwarded-for']||''},${event.headers['user-agent']||''})`;
  return json(200,{success:true});
}
