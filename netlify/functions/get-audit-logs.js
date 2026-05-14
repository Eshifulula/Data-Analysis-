import { json, sql } from './_db.js';
import { requireAuth, allowRoles } from './_auth.js';
export async function handler(event){
  if(event.httpMethod!=='GET') return json(405,{error:'Method not allowed'});
  const auth=requireAuth(event); if(auth.error) return auth.error;
  if(!allowRoles(auth.user,['admin'])) return json(403,{error:'Forbidden'});
  const q=event.queryStringParameters||{}; const page=Math.max(Number(q.page||1),1); const limit=Math.min(Number(q.limit||20),100); const offset=(page-1)*limit;
  const data=await sql(`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`);
  const c=await sql`SELECT COUNT(*)::int c FROM audit_logs`;
  return json(200,{data,total:c[0].c,page,total_pages:Math.max(1,Math.ceil(c[0].c/limit))});
}
