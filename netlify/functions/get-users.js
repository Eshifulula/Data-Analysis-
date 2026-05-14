import { json, sql } from './_db.js';
import { requireAuth, allowRoles } from './_auth.js';

export async function handler(event){
  if(event.httpMethod!=='GET') return json(405,{error:'Method not allowed'});
  const auth=requireAuth(event); if(auth.error) return auth.error;
  if(!allowRoles(auth.user,['admin'])) return json(403,{error:'Forbidden'});
  const rows=await sql`SELECT id,username,role,is_active,created_at,updated_at FROM users ORDER BY id`;
  return json(200,{data:rows});
}
