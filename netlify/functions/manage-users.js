import bcrypt from 'bcryptjs';
import { json, sql, parseBody } from './_db.js';
import { requireAuth, allowRoles } from './_auth.js';

export async function handler(event){
  if(event.httpMethod!=='POST') return json(405,{error:'Method not allowed'});
  const auth=requireAuth(event); if(auth.error) return auth.error;
  if(!allowRoles(auth.user,['admin'])) return json(403,{error:'Forbidden'});
  const body=parseBody(event); if(!body) return json(400,{error:'Invalid JSON'});
  const {action}=body;
  try{
    if(action==='create'){
      const hash=await bcrypt.hash(body.password,10);
      await sql`INSERT INTO users (username,password_hash,role) VALUES (${body.username},${hash},${body.role || 'viewer'})`;
      return json(200,{success:true});
    }
    if(action==='deactivate') { await sql`UPDATE users SET is_active=false,updated_at=NOW() WHERE id=${body.id}`; return json(200,{success:true}); }
    if(action==='update_role') { await sql`UPDATE users SET role=${body.role},updated_at=NOW() WHERE id=${body.id}`; return json(200,{success:true}); }
    if(action==='reset_password') { const hash=await bcrypt.hash(body.password,10); await sql`UPDATE users SET password_hash=${hash},updated_at=NOW() WHERE id=${body.id}`; return json(200,{success:true}); }
    return json(400,{error:'Unsupported action'});
  }catch{return json(500,{error:'Failed to manage user'});}
}
